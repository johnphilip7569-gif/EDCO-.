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
    const {
      sender_id,
      sender_name,
      sender_avatar,
      message_type,
      content,
      media_url,
    } = body;

    const authUserId = await getUserId();
    if (!authUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized: Active login session required." }, { status: 401 });
    }

    const userId = authUserId;

    if (!content && !media_url) {
      return NextResponse.json(
        { success: false, error: "Message must contain text, photo, or video content." },
        { status: 400 }
      );
    }

    const type = ["text", "image", "video"].includes(message_type) ? message_type : "text";

    const pool = getDbPool();
    const client = await pool.connect();

    try {
      // Membership check: Verify that caller belongs to this project workspace
      const memberCheck = await client.query(
        `SELECT role FROM public.edbuild_members WHERE group_id = $1::uuid AND user_id = $2::uuid LIMIT 1;`,
        [groupId, userId]
      );

      if (memberCheck.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: "Forbidden: You must be an accepted member of this workspace to send messages." },
          { status: 403 }
        );
      }

      const result = await client.query(
        `INSERT INTO public.edbuild_messages (
          group_id,
          sender_id,
          sender_name,
          sender_avatar,
          message_type,
          content,
          media_url,
          created_at
        ) VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, $7, NOW())
        RETURNING *;`,
        [
          groupId,
          userId,
          (sender_name || "Teammate").trim(),
          sender_avatar || null,
          type,
          (content || "").trim(),
          media_url || null,
        ]
      );

      return NextResponse.json({
        success: true,
        message: result.rows[0],
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[EdBuildMessages:POST] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to post message" },
      { status: 500 }
    );
  }
}
