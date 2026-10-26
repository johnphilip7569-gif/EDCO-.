import { NextRequest, NextResponse } from "next/server";
import { queryDb } from "@/lib/db-server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ success: false, error: "Course slug is required" }, { status: 400 });
    }

    const { rows } = await queryDb(
      `SELECT id, slug, title, tagline, category, level, duration_weeks, skills, icon_name,
              roadmap, resources, quiz_spec, display_order, created_at
       FROM public.courses
       WHERE slug = $1 AND is_active = true
       LIMIT 1`,
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }

    const course = rows[0];

    // Sanitize quiz questions: do not send correct_index to client prior to evaluation
    const rawQuestions = course.quiz_spec?.questions || [];
    const clientQuestions = rawQuestions.map((q: any) => ({
      id: q.id,
      question: q.question,
      options: q.options,
    }));

    const sanitizedCourse = {
      ...course,
      quiz: {
        passingScore: course.quiz_spec?.passing_score || 75,
        totalQuestions: clientQuestions.length,
        questions: clientQuestions,
      },
    };
    delete sanitizedCourse.quiz_spec;

    return NextResponse.json({
      success: true,
      course: sanitizedCourse,
    });
  } catch (err: any) {
    console.error("[API Learn Course Detail Error]:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve course details" },
      { status: 500 }
    );
  }
}
