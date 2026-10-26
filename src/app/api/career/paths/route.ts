import { NextResponse } from "next/server";
import { queryDb } from "@/lib/db-server";

export const dynamic = "force-dynamic";

export interface CareerPathRecord {
  id: string;
  name: string;
  category: string;
  description: string;
  typical_skills: string[];
  active: boolean;
  display_order: number;
}

export async function GET() {
  try {
    const { rows } = await queryDb<CareerPathRecord>(
      `SELECT id, name, category, description, typical_skills, active, display_order
       FROM public.career_paths
       WHERE active = true
       ORDER BY display_order ASC, name ASC;`
    );

    // Group paths by category preserving order
    const categoriesMap: Record<string, CareerPathRecord[]> = {};
    for (const path of rows) {
      if (!categoriesMap[path.category]) {
        categoriesMap[path.category] = [];
      }
      categoriesMap[path.category].push(path);
    }

    const categories = Object.keys(categoriesMap).map((catName) => ({
      name: catName,
      paths: categoriesMap[catName],
    }));

    return NextResponse.json({
      success: true,
      total: rows.length,
      categories,
      paths: rows,
    });
  } catch (err: any) {
    console.error("[CareerPathsAPI:GET] Error fetching career paths:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch career paths" },
      { status: 500 }
    );
  }
}
