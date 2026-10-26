import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db-server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const groupId = params.groupId;
    if (!groupId) {
      return NextResponse.json({ success: false, error: "Missing groupId" }, { status: 400 });
    }

    const pool = getDbPool();
    const client = await pool.connect();

    try {
      // 1. Fetch group
      const groupRes = await client.query(
        `SELECT * FROM public.edbuild_groups WHERE id = $1::uuid LIMIT 1;`,
        [groupId]
      );

      if (groupRes.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: "EdBuild group not found" },
          { status: 404 }
        );
      }

      const group = groupRes.rows[0];

      // 2. Fetch members with username & updated avatar from profiles table
      const membersRes = await client.query(
        `SELECT 
           m.*, 
           COALESCE(p.username, '') as username,
           COALESCE(m.avatar_url, p.avatar_url) as avatar_url
         FROM public.edbuild_members m
         LEFT JOIN public.profiles p ON p.id = m.user_id
         WHERE m.group_id = $1::uuid
         ORDER BY m.role DESC, m.joined_at ASC;`,
        [groupId]
      );

      // Check private workspace access boundary
      if (group.access_type === "private") {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const isMember = user && membersRes.rows.some((m: any) => m.user_id === user.id);
        if (!isMember) {
          let isAdmin = false;
          if (user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("is_admin, role")
              .eq("id", user.id)
              .maybeSingle();
            if (profile?.is_admin || ["ADMIN", "SUPER_ADMIN", "FOUNDER", "EXECUTIVE"].includes(profile?.role)) {
              isAdmin = true;
            }
          }
          if (!isAdmin) {
            return NextResponse.json(
              { success: false, error: "Forbidden: This workspace is private. Only accepted team members may access activity." },
              { status: 403 }
            );
          }
        }
      }

      // 3. Fetch messages
      const messagesRes = await client.query(
        `SELECT * FROM public.edbuild_messages WHERE group_id = $1::uuid ORDER BY created_at ASC;`,
        [groupId]
      );

      // 4. Check if certificates exist
      const certsRes = await client.query(
        `SELECT * FROM public.edbuild_certificates WHERE group_id = $1::uuid;`,
        [groupId]
      );

      return NextResponse.json({
        success: true,
        group,
        members: membersRes.rows,
        messages: messagesRes.rows,
        certificates: certsRes.rows,
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[EdBuildGroup:GET] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch group details" },
      { status: 500 }
    );
  }
}
