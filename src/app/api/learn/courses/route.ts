import { NextRequest, NextResponse } from "next/server";
import { queryDb } from "@/lib/db-server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let sql = `
      SELECT id, slug, title, tagline, category, level, duration_weeks, skills, icon_name, display_order, created_at,
             jsonb_array_length(roadmap) as phases_count,
             jsonb_array_length(resources) as resources_count,
             (quiz_spec->>'passing_score')::int as passing_score,
             jsonb_array_length(quiz_spec->'questions') as questions_count
      FROM public.courses
      WHERE is_active = true
    `;
    const params: any[] = [];

    if (category && category !== "All Fields" && category !== "all") {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(title) LIKE $${params.length} OR LOWER(tagline) LIKE $${params.length} OR LOWER(category) LIKE $${params.length})`;
    }

    sql += ` ORDER BY display_order ASC, created_at ASC`;

    const { rows } = await queryDb(sql, params);

    return NextResponse.json({
      success: true,
      count: rows.length,
      courses: rows,
    });
  } catch (err: any) {
    console.error("[API Learn Courses Error]:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve courses catalog" },
      { status: 500 }
    );
  }
}
