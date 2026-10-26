import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DSA_QUESTIONS } from "@/lib/dsa/dsa-bank";
import { awardPoints } from "@/lib/gamification-service";

export const dynamic = "force-dynamic";

// In-memory sliding window rate limiter against automated option brute-forcing
const submissionHistory = new Map<string, { timestamps: number[]; lastQuestionAttempt: Record<string, number> }>();

const SECURITY_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { topicId, questionId, selectedAnswer, userId } = body;

    if (!topicId || !questionId || !selectedAnswer) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // 1. Strict Input Validation & Sanitization
    const safeTopicId = String(topicId).trim();
    const safeQuestionId = String(questionId).trim();
    const normalizedAnswer = String(selectedAnswer).trim().toUpperCase();

    if (!/^[a-z0-9-]+$/i.test(safeTopicId) || !/^[a-z0-9-]+$/i.test(safeQuestionId)) {
      return NextResponse.json(
        { success: false, error: "Invalid identifier format" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    if (!["A", "B", "C", "D"].includes(normalizedAnswer)) {
      return NextResponse.json(
        { success: false, error: "Invalid option selection" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // 2. Anti-Brute-Force Rate Limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const rateKey = userId && userId !== "null" && userId !== "guest" ? `u_${userId}` : `ip_${clientIp}`;
    const now = Date.now();
    const record = submissionHistory.get(rateKey) || { timestamps: [], lastQuestionAttempt: {} };

    // Keep timestamps within last 60 seconds
    record.timestamps = record.timestamps.filter((t) => now - t < 60_000);
    if (record.timestamps.length >= 15) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Slow down before submitting more answers." },
        { status: 429, headers: SECURITY_HEADERS }
      );
    }

    const lastAttemptOnQ = record.lastQuestionAttempt[safeQuestionId] || 0;
    if (now - lastAttemptOnQ < 1200) {
      return NextResponse.json(
        { success: false, error: "Submission cooldown active. Please wait a second before retrying." },
        { status: 429, headers: SECURITY_HEADERS }
      );
    }

    record.timestamps.push(now);
    record.lastQuestionAttempt[safeQuestionId] = now;
    submissionHistory.set(rateKey, record);

    // 3. Server-Side Track Gating Check for Authenticated Users
    const isAuthenticatedUser = Boolean(userId && userId !== "null" && userId !== "guest");
    if (isAuthenticatedUser) {
      try {
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("age_band, career_stage")
          .eq("id", userId)
          .maybeSingle();

        if (
          userProfile &&
          (userProfile.age_band === "13-15" || String(userProfile.career_stage || "").toLowerCase() === "junior")
        ) {
          return NextResponse.json(
            { success: false, error: "Junior Track is restricted from advanced DSA placement drills." },
            { status: 403, headers: SECURITY_HEADERS }
          );
        }
      } catch (_) {}
    }

    // 4. Find Question and Authoritative Answer
    let question = DSA_QUESTIONS.find((q) => q.id === safeQuestionId);

    if (!question) {
      try {
        const { data: dbQ } = await supabase
          .from("dsa_questions")
          .select("*")
          .eq("id", safeQuestionId)
          .maybeSingle();

        if (dbQ) {
          question = {
            id: dbQ.id,
            topic_id: dbQ.topic_id,
            difficulty_level: dbQ.difficulty_level,
            question_type: dbQ.question_type,
            question_text: dbQ.question_text,
            code_snippet: dbQ.code_snippet,
            options: dbQ.options,
            correct_answer: dbQ.correct_answer,
            explanation: dbQ.explanation,
          };
        }
      } catch (err) {
        console.warn("[Find Question DB Note]", err);
      }
    }

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404, headers: SECURITY_HEADERS }
      );
    }

    const isCorrect = normalizedAnswer === String(question.correct_answer).trim().toUpperCase();
    let pointsAwarded = 0;
    let newMasteryScore = 0;

    //Deterministic sourceId to prevent duplicate XP farming on the same question
    const deterministicSourceId = `dsa_drill_${safeTopicId}_${safeQuestionId}`;

    // 5. If authenticated user, record progress & award idempotent gamification points
    if (isAuthenticatedUser) {
      try {
        // Fetch existing progress
        const { data: existingProgress } = await supabase
          .from("dsa_progress")
          .select("*")
          .eq("user_id", userId)
          .eq("topic_id", safeTopicId)
          .maybeSingle();

        const currentAnswered = (existingProgress?.questions_answered || 0) + 1;
        const currentCorrect = (existingProgress?.questions_correct || 0) + (isCorrect ? 1 : 0);
        newMasteryScore = Math.min(100, Math.round((currentCorrect / currentAnswered) * 100));
        const status = newMasteryScore >= 70 ? "completed" : "in_progress";

        await supabase.from("dsa_progress").upsert(
          {
            user_id: userId,
            topic_id: safeTopicId,
            status,
            mastery_score: newMasteryScore,
            effective_level_for_topic: isCorrect
              ? Math.min(2, (existingProgress?.effective_level_for_topic || 0) + 1)
              : existingProgress?.effective_level_for_topic || 0,
            questions_answered: currentAnswered,
            questions_correct: currentCorrect,
            last_practiced_at: new Date().toISOString(),
          },
          { onConflict: "user_id,topic_id" }
        );

        // Award shared gamification XP if correct (Idempotent via deterministicSourceId)
        if (isCorrect) {
          // Check if user already claimed XP for this specific question
          const { data: priorAward } = await supabase
            .from("point_events")
            .select("id")
            .eq("user_id", userId)
            .eq("source_feature", "dsa_practice")
            .eq("source_id", deterministicSourceId)
            .maybeSingle();

          if (!priorAward) {
            const awardRes = await awardPoints({
              userId,
              sourceFeature: "dsa_practice",
              sourceId: deterministicSourceId,
              points: 25,
            });
            pointsAwarded = awardRes.awarded ? awardRes.pointsEarned : 25;
          } else {
            pointsAwarded = 0; // Already awarded previously for this question
          }
        }
      } catch (dbErr) {
        console.warn("[DSA Progress Update DB Note]", dbErr);
      }
    } else if (isCorrect) {
      pointsAwarded = 25;
    }

    return NextResponse.json(
      {
        success: true,
        isCorrect,
        correctAnswer: question.correct_answer,
        explanation: question.explanation,
        pointsAwarded,
        newMasteryScore,
      },
      { headers: SECURITY_HEADERS }
    );
  } catch (err: any) {
    console.error("Failed to submit DSA answer:", err);
    return NextResponse.json(
      { success: false, error: "Internal assessment grading error" },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }
}
