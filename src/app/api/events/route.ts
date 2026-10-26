import { NextRequest, NextResponse } from "next/server";
import { queryDb } from "@/lib/db-server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export interface EventRecord {
  id: string;
  title: string;
  organizer: string;
  category: string;
  mode: string;
  is_free: boolean;
  prize_pool: string;
  banner_style: {
    theme?: string;
    bgGradient?: string;
    badgeColor?: string;
    accentColor?: string;
    headline?: string;
    subHeadline?: string;
    imageUrl?: string;
  };
  description: string;
  eligibility: string;
  registration_deadline: string;
  registration_url: string;
  registration_status: string;
  skills: string[];
  team_size: string;
  featured: boolean;
  display_order: number;
  created_at: string;
  is_saved?: boolean;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const queryUserId = searchParams.get("userId");

    // Resolve userId if logged in
    let userId = queryUserId || null;
    if (!userId) {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id) userId = user.id;
      } catch (e) {
        // Continue unauthenticated
      }
    }

    let sql = `
      SELECT 
        e.id,
        e.title,
        e.organizer,
        e.category,
        e.mode,
        e.is_free,
        e.prize_pool,
        e.banner_style,
        e.description,
        e.eligibility,
        e.registration_deadline,
        e.registration_url,
        e.registration_status,
        e.skills,
        e.team_size,
        e.featured,
        e.display_order,
        e.created_at,
        ${userId ? `EXISTS(SELECT 1 FROM public.user_saved_events use WHERE use.event_id = e.id AND use.user_id = $1)` : `false`} AS is_saved
      FROM public.events e
      WHERE 1=1
    `;

    const params: any[] = [];
    if (userId) {
      params.push(userId);
    }

    if (category && category !== "all" && category !== "All") {
      params.push(category);
      sql += ` AND e.category ILIKE $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      sql += ` AND (e.title ILIKE $${params.length} OR e.organizer ILIKE $${params.length} OR e.description ILIKE $${params.length})`;
    }

    sql += ` ORDER BY e.display_order ASC, e.created_at DESC;`;

    const { rows } = await queryDb<EventRecord>(sql, params);

    return NextResponse.json({
      success: true,
      total: rows.length,
      events: rows,
    });
  } catch (err: any) {
    console.error("[EventsAPI:GET] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve events catalog" },
      { status: 500 }
    );
  }
}
