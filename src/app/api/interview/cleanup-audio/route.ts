import { NextRequest, NextResponse } from "next/server";
import { queryDb } from "@/lib/db-server";

export const dynamic = "force-dynamic";

/**
 * Audio Retention & Privacy Deletion Endpoint
 * 
 * 1. POST: Scheduled cron cleaner or opt-in enforcement job
 * 2. DELETE: Candidate self-service deletion of their session recording
 */
export async function POST(req: NextRequest) {
  try {
    const now = new Date().toISOString();

    // 1. Purge recordings where retention has expired
    const updateExpired = await queryDb(
      `UPDATE public.interview_sessions
       SET audio_deleted_at = $1, audio_url = NULL
       WHERE retention_expires_at < $1 AND audio_deleted_at IS NULL
       RETURNING id`,
      [now]
    );

    // 2. Also ensure any session where user did NOT opt-in (voice_opt_in = false) has audio removed
    const updateNoOptIn = await queryDb(
      `UPDATE public.interview_sessions
       SET audio_deleted_at = COALESCE(audio_deleted_at, $1), audio_url = NULL
       WHERE voice_opt_in = false AND audio_url IS NOT NULL
       RETURNING id`,
      [now]
    );

    const purgedCount = (updateExpired.rowCount || 0) + (updateNoOptIn.rowCount || 0);

    return NextResponse.json({
      success: true,
      purgedCount,
      timestamp: now,
    });
  } catch (err: any) {
    console.error("[Audio Cleanup Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to run audio cleanup." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, userId } = body;

    if (!sessionId || !userId) {
      return NextResponse.json(
        { error: "sessionId and userId are required." },
        { status: 400 }
      );
    }

    // Check ownership
    const { rows: sessions } = await queryDb(
      `SELECT id, user_id FROM public.interview_sessions WHERE id = $1`,
      [sessionId]
    );

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    const session = sessions[0];
    if (session.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized access to session." }, { status: 403 });
    }

    const now = new Date().toISOString();
    await queryDb(
      `UPDATE public.interview_sessions
       SET audio_deleted_at = $1, audio_url = NULL
       WHERE id = $2`,
      [now, sessionId]
    );

    return NextResponse.json({
      success: true,
      message: "Audio recording deleted permanently per user request.",
      deletedAt: now,
    });
  } catch (err: any) {
    console.error("[User Audio Delete Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete audio recording." },
      { status: 500 }
    );
  }
}
