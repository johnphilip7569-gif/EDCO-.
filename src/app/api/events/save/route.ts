import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db-server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, userId: bodyUserId } = body;

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: "eventId is required" },
        { status: 400 }
      );
    }

    // Resolve userId
    let userId = bodyUserId || null;
    if (!userId) {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id) userId = user.id;
      } catch (e) {}
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required to bookmark events" },
        { status: 401 }
      );
    }

    const pool = getDbPool();
    const client = await pool.connect();

    try {
      // Check if already saved
      const existing = await client.query(
        `SELECT id FROM public.user_saved_events WHERE user_id = $1 AND event_id = $2;`,
        [userId, eventId]
      );

      let isSaved = false;
      if (existing.rows.length > 0) {
        // Remove bookmark
        await client.query(
          `DELETE FROM public.user_saved_events WHERE user_id = $1 AND event_id = $2;`,
          [userId, eventId]
        );
        isSaved = false;
      } else {
        // Add bookmark
        await client.query(
          `INSERT INTO public.user_saved_events (user_id, event_id, saved_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (user_id, event_id) DO NOTHING;`,
          [userId, eventId]
        );
        isSaved = true;
      }

      return NextResponse.json({
        success: true,
        eventId,
        userId,
        is_saved: isSaved,
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[EventsSaveAPI:POST] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update event bookmark" },
      { status: 500 }
    );
  }
}
