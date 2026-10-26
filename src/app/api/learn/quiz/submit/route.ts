import { NextRequest, NextResponse } from "next/server";
import { queryDb } from "@/lib/db-server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, recipientName, userId, answers = {} } = body || {};

    if (!slug) {
      return NextResponse.json({ success: false, error: "Course slug is required." }, { status: 400 });
    }

    const trimmedName = (recipientName || "").trim();
    if (!trimmedName) {
      return NextResponse.json({ success: false, error: "Recipient name is required for certificate issuance." }, { status: 400 });
    }

    // 1. Fetch authoritative course and quiz_spec from PostgreSQL
    const { rows } = await queryDb(
      `SELECT id, slug, title, category, quiz_spec 
       FROM public.courses 
       WHERE slug = $1 AND is_active = true 
       LIMIT 1`,
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Course not found." }, { status: 404 });
    }

    const course = rows[0];
    const questions: any[] = course.quiz_spec?.questions || [];
    const passingScore: number = course.quiz_spec?.passing_score || 75;

    if (questions.length === 0) {
      return NextResponse.json({ success: false, error: "No quiz configured for this course." }, { status: 400 });
    }

    // 2. Evaluate answers
    let correctCount = 0;
    const review = questions.map((q) => {
      const selectedIndex = answers[q.id];
      const isCorrect = selectedIndex === q.correct_index;
      if (isCorrect) correctCount++;

      return {
        id: q.id,
        question: q.question,
        selectedIndex,
        correctIndex: q.correct_index,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercentage >= passingScore;

    let certificateRecord = null;

    // 3. If passed, issue verifiable certificate
    if (passed) {
      const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
      const certificateCode = `EDW-CERT-2026-${randomSuffix}`;
      
      const payloadToHash = `${certificateCode}:${trimmedName}:${course.slug}:${scorePercentage}:${Date.now()}`;
      const verificationHash = crypto.createHash("sha256").update(payloadToHash).digest("hex");

      const insertRes = await queryDb(
        `INSERT INTO public.course_certificates (
          certificate_code, user_id, recipient_name, course_id, course_title, course_slug,
          course_category, score_percentage, passed, verification_hash, issued_at, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, $9, NOW(), $10)
        RETURNING id, certificate_code, recipient_name, course_title, course_slug, course_category,
                  score_percentage, passed, verification_hash, issued_at`,
        [
          certificateCode,
          userId || null,
          trimmedName,
          course.id,
          course.title,
          course.slug,
          course.category,
          scorePercentage,
          verificationHash,
          JSON.stringify({
            correctAnswers: correctCount,
            totalQuestions: questions.length,
            passingScoreThreshold: passingScore,
          }),
        ]
      );

      certificateRecord = insertRes.rows[0];
    }

    return NextResponse.json({
      success: true,
      passed,
      scorePercentage,
      passingScore,
      correctCount,
      totalCount: questions.length,
      certificate: certificateRecord,
      review,
    });
  } catch (err: any) {
    console.error("[API Quiz Submit Error]:", err);
    return NextResponse.json(
      { success: false, error: "Failed to evaluate quiz and issue certificate" },
      { status: 500 }
    );
  }
}
