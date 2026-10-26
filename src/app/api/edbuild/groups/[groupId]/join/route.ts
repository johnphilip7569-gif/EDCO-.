import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db-server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getUserId(): Promise<string | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch (e) {
    return null;
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const groupId = params.groupId;
    const body = await req.json().catch(() => ({}));
    const { key, name, email, phone, avatar_url, userId: passedUserId } = body;

    const authUserId = await getUserId();
    const userId = passedUserId || authUserId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Please sign in to join an EdBuild group." },
        { status: 401 }
      );
    }

    const pool = getDbPool();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Fetch group
      let groupRes;
      if (groupId === "by-key") {
        if (!key) {
          return NextResponse.json({ success: false, error: "Please enter a valid join key." }, { status: 400 });
        }
        groupRes = await client.query(
          `SELECT * FROM public.edbuild_groups WHERE UPPER(join_key) = UPPER($1) LIMIT 1;`,
          [key.trim()]
        );
      } else {
        groupRes = await client.query(
          `SELECT * FROM public.edbuild_groups WHERE id = $1::uuid LIMIT 1;`,
          [groupId]
        );
      }

      if (groupRes.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { success: false, error: "EdBuild group not found or invalid key." },
          { status: 404 }
        );
      }

      const group = groupRes.rows[0];
      const actualGroupId = group.id;

      // 2. Check if private group key matches
      if (group.access_type === "private" && groupId !== "by-key") {
        if (!key || key.trim().toUpperCase() !== (group.join_key || "").toUpperCase()) {
          await client.query("ROLLBACK");
          return NextResponse.json(
            { success: false, error: "Invalid private join key for this group." },
            { status: 403 }
          );
        }
      }

      // 3. Check if user is already a member
      const existingMember = await client.query(
        `SELECT id FROM public.edbuild_members WHERE group_id = $1::uuid AND user_id = $2::uuid LIMIT 1;`,
        [actualGroupId, userId]
      );

      if (existingMember.rows.length > 0) {
        await client.query("COMMIT");
        return NextResponse.json({
          success: true,
          groupId: actualGroupId,
          message: "You are already a member of this group. Redirecting to workspace...",
        });
      }

      // 4. Check capacity (team_size)
      const currentCount = Number(group.current_members_count) || 1;
      const maxCapacity = Number(group.team_size) || 4;

      if (currentCount >= maxCapacity) {
        // Ensure status reflects full
        await client.query(
          `UPDATE public.edbuild_groups SET status = 'FULL' WHERE id = $1::uuid;`,
          [actualGroupId]
        );
        await client.query("COMMIT");
        return NextResponse.json(
          { success: false, error: "This group has reached its maximum team size (Room Full)." },
          { status: 400 }
        );
      }

      // 5. Add user to members
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
        ) VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, 'MEMBER', NOW());`,
        [
          actualGroupId,
          userId,
          (name || "Team Member").trim(),
          (email || "").trim().toLowerCase(),
          (phone || "").trim() || null,
          avatar_url || null,
        ]
      );

      // 6. Increment count & update status if reached capacity
      const newCount = currentCount + 1;
      const newStatus = newCount >= maxCapacity ? "FULL" : group.status;

      await client.query(
        `UPDATE public.edbuild_groups 
         SET current_members_count = $1, status = $2, updated_at = NOW() 
         WHERE id = $3::uuid;`,
        [newCount, newStatus, actualGroupId]
      );

      // 7. Post join notification in chat
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
          actualGroupId,
          userId,
          `👋 ${name || "A new teammate"} joined the group! Team count is now ${newCount}/${maxCapacity}.`,
        ]
      );

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        groupId: actualGroupId,
        message: "Successfully joined EdBuild group!",
      });
    } catch (e: any) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[EdBuildJoin:POST] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to join group" },
      { status: 500 }
    );
  }
}
