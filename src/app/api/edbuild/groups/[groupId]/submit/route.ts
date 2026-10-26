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
    const body = await req.json();
    const { submission_repo_url, submission_live_url, submission_notes } = body;

    const authUserId = await getUserId();
    if (!authUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized: Active login session required." }, { status: 401 });
    }

    const userId = authUserId;

    if (!submission_repo_url) {
      return NextResponse.json(
        { success: false, error: "Please provide your GitHub repository or project submission link." },
        { status: 400 }
      );
    }

    const pool = getDbPool();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // 1. Verify group & leadership
      const groupRes = await client.query(
        `SELECT * FROM public.edbuild_groups WHERE id = $1::uuid LIMIT 1;`,
        [groupId]
      );

      if (groupRes.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json({ success: false, error: "Group not found" }, { status: 404 });
      }

      const group = groupRes.rows[0];

      // Check if user is leader
      const isLeader = group.leader_id === userId;
      if (!isLeader) {
        // Double check members table for LEADER role
        const memberRes = await client.query(
          `SELECT role FROM public.edbuild_members WHERE group_id = $1::uuid AND user_id = $2::uuid LIMIT 1;`,
          [groupId, userId]
        );
        if (memberRes.rows.length === 0 || memberRes.rows[0].role !== "LEADER") {
          await client.query("ROLLBACK");
          return NextResponse.json(
            { success: false, error: "Only the Team Leader can submit the project for official review." },
            { status: 403 }
          );
        }
      }

      // 2. Update group status to PENDING_REVIEW
      await client.query(
        `UPDATE public.edbuild_groups 
         SET status = 'PENDING_REVIEW',
             submission_repo_url = $1,
             submission_live_url = $2,
             submission_notes = $3,
             submitted_at = NOW(),
             updated_at = NOW()
         WHERE id = $4::uuid;`,
        [
          submission_repo_url.trim(),
          (submission_live_url || "").trim() || null,
          (submission_notes || "").trim() || null,
          groupId,
        ]
      );

      // 3. Post system message to group
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
          groupId,
          userId,
          `🏆 Project submitted for EdWorld Co. evaluation! Our engineering team will review the repository and live demo. Upon acceptance, official Certificates of Completion will be issued to all team members.`,
        ]
      );

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        message: "Project successfully submitted for review!",
      });
    } catch (e: any) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[EdBuildSubmit:POST] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit project" },
      { status: 500 }
    );
  }
}
