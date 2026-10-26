import { NextRequest, NextResponse } from "next/server";
import { queryDb, getDbPool } from "@/lib/db-server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Helper to resolve current authenticated user ID
async function getUserId(): Promise<string | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch (e) {
    return null;
  }
}

// Generate human-friendly private join key
function generateJoinKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "EDBUILD-";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const queryUserId = searchParams.get("userId");
    const currentUserId = queryUserId || (await getUserId());

    const pool = getDbPool();
    const client = await pool.connect();

    try {
      // 1. Fetch public groups with member details
      const publicGroupsRes = await client.query(
        `SELECT g.*, 
                COALESCE(
                  json_agg(
                    json_build_object(
                      'user_id', m.user_id,
                      'name', m.name,
                      'avatar_url', m.avatar_url,
                      'role', m.role
                    )
                  ) FILTER (WHERE m.id IS NOT NULL), '[]'
                ) as members
         FROM public.edbuild_groups g
         LEFT JOIN public.edbuild_members m ON m.group_id = g.id
         WHERE g.access_type = 'public'
         GROUP BY g.id
         ORDER BY g.created_at DESC;`
      );

      // 2. If user is logged in, fetch groups they belong to
      let myGroups: any[] = [];
      if (currentUserId) {
        const myGroupsRes = await client.query(
          `SELECT g.*, 
                  COALESCE(
                    json_agg(
                      json_build_object(
                        'user_id', m.user_id,
                        'name', m.name,
                        'avatar_url', m.avatar_url,
                        'role', m.role
                      )
                    ) FILTER (WHERE m.id IS NOT NULL), '[]'
                  ) as members
           FROM public.edbuild_groups g
           JOIN public.edbuild_members my_m ON my_m.group_id = g.id AND my_m.user_id = $1::uuid
           LEFT JOIN public.edbuild_members m ON m.group_id = g.id
           GROUP BY g.id
           ORDER BY g.created_at DESC;`,
          [currentUserId]
        );
        myGroups = myGroupsRes.rows;
      }

      return NextResponse.json({
        success: true,
        publicGroups: publicGroupsRes.rows,
        myGroups,
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[EdBuild:GET] Error fetching groups:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load groups" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      access_type,
      team_size,
      problem_statement,
      leader_name,
      leader_email,
      leader_phone,
      userId: passedUserId,
      avatar_url,
    } = body;

    const authUserId = await getUserId();
    const userId = passedUserId || authUserId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Please log in to create an EdBuild group." },
        { status: 401 }
      );
    }

    if (!name || !problem_statement) {
      return NextResponse.json(
        { success: false, error: "Project name and problem statement are required." },
        { status: 400 }
      );
    }

    const accessType = access_type === "private" ? "private" : "public";
    const teamSize = Math.max(2, Math.min(8, Number(team_size) || 4));
    const joinKey = accessType === "private" ? generateJoinKey() : null;

    const pool = getDbPool();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Insert group
      const groupRes = await client.query(
        `INSERT INTO public.edbuild_groups (
          name,
          access_type,
          join_key,
          team_size,
          current_members_count,
          leader_id,
          leader_name,
          leader_email,
          leader_phone,
          problem_statement,
          status,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, 1, $5::uuid, $6, $7, $8, $9, 'OPEN', NOW(), NOW())
        RETURNING *;`,
        [
          name.trim(),
          accessType,
          joinKey,
          teamSize,
          userId,
          (leader_name || "Leader").trim(),
          (leader_email || "").trim().toLowerCase(),
          (leader_phone || "").trim() || null,
          problem_statement.trim(),
        ]
      );

      const newGroup = groupRes.rows[0];

      // 2. Add creator as team leader member
      await client.query(
        `INSERT INTO public.edbuild_members (
          group_id,
          user_id,
          name,
          email,
          phone,
          avatar_url,
          role,
          joined_at
        ) VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, 'LEADER', NOW());`,
        [
          newGroup.id,
          userId,
          (leader_name || "Leader").trim(),
          (leader_email || "").trim().toLowerCase(),
          (leader_phone || "").trim() || null,
          avatar_url || null,
        ]
      );

      // 3. System welcoming message
      await client.query(
        `INSERT INTO public.edbuild_messages (
          group_id,
          sender_id,
          sender_name,
          sender_avatar,
          message_type,
          content,
          created_at
        ) VALUES ($1::uuid, $2::uuid, 'EdBuild Bot', null, 'system', $3, NOW());`,
        [
          newGroup.id,
          userId,
          `🚀 Welcome to ${newGroup.name}! Team leader ${leader_name || "Leader"} initialized the project workspace.`,
        ]
      );

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        group: newGroup,
        message: accessType === "private" 
          ? `Private group created! Share join key ${joinKey} with your teammates.`
          : "Public group created and listed in EdBuild directory!",
      });
    } catch (dbErr: any) {
      await client.query("ROLLBACK");
      throw dbErr;
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[EdBuild:POST] Error creating group:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create group" },
      { status: 500 }
    );
  }
}
