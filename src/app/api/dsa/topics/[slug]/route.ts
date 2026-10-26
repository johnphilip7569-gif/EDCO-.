import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getDsaTopicBySlug, getQuestionsForTopic, DsaTopic } from "@/lib/dsa/dsa-bank";

export const dynamic = "force-dynamic";

const SECURITY_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const safeSlug = String(slug || "").trim().toLowerCase();

    // Prevent PostgREST filter injection
    if (!safeSlug || !/^[a-z0-9-]+$/.test(safeSlug)) {
      return NextResponse.json(
        { success: false, error: "Invalid topic identifier" },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const requestedLevelParam = url.searchParams.get("effectiveLevel");

    // 1. Server-Side Track Gating Check for Authenticated Users
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
            { success: false, error: "Junior Track is restricted from advanced DSA placement modules." },
            { status: 403, headers: SECURITY_HEADERS }
          );
        }
      } catch (_) {}
    }

    // 2. Resolve Topic
    let topic: DsaTopic | undefined = getDsaTopicBySlug(safeSlug);

    try {
      const { data: dbTopic } = await supabase
        .from("dsa_topics")
        .select("*")
        .or(`slug.eq.${safeSlug},id.eq.${safeSlug}`)
        .maybeSingle();

      if (dbTopic) {
        topic = {
          id: dbTopic.id,
          name: dbTopic.name,
          slug: dbTopic.slug,
          tier: dbTopic.tier,
          difficulty_level: dbTopic.difficulty_level,
          interview_frequency: dbTopic.interview_frequency,
          prerequisite_topic_ids: dbTopic.prerequisite_topic_ids || [],
          explainer_concept: dbTopic.explainer_concept,
          explainer_why_it_matters: dbTopic.explainer_why_it_matters,
          explainer_common_use: dbTopic.explainer_common_use,
          worked_example:
            typeof dbTopic.worked_example === "string"
              ? JSON.parse(dbTopic.worked_example)
              : dbTopic.worked_example,
          visualizer_type: dbTopic.visualizer_type,
          order_index: dbTopic.order_index,
        };
      }
    } catch (dbErr) {
      console.warn("[DSA Topic By Slug DB Note]", dbErr);
    }

    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Topic not found" },
        { status: 404, headers: SECURITY_HEADERS }
      );
    }

    // 3. Resolve User's Effective Level for this topic
    let effectiveLevel = topic.difficulty_level; // default to topic level

    if (requestedLevelParam !== null) {
      effectiveLevel = Math.max(0, Math.min(2, parseInt(requestedLevelParam, 10) || 0)) as 0 | 1 | 2;
    } else if (isAuthenticatedUser) {
      try {
        const { data: prog } = await supabase
          .from("dsa_progress")
          .select("effective_level_for_topic")
          .eq("user_id", userId)
          .eq("topic_id", topic.id)
          .maybeSingle();

        if (prog && prog.effective_level_for_topic !== null) {
          effectiveLevel = prog.effective_level_for_topic;
        }
      } catch (err) {
        console.warn("[User Effective Level Fetch Note]", err);
      }
    }

    // 4. Fetch Questions Calibrated to Effective Level
    const questions = getQuestionsForTopic(topic.id, effectiveLevel);

    // Strip answers and explanations from client response for integrity
    const sanitizedQuestions = questions.map((q) => ({
      id: q.id,
      topic_id: q.topic_id,
      difficulty_level: q.difficulty_level,
      question_type: q.question_type,
      question_text: q.question_text,
      code_snippet: q.code_snippet,
      options: q.options,
    }));

    return NextResponse.json(
      {
        success: true,
        topic,
        effectiveLevel,
        questions: sanitizedQuestions,
      },
      { headers: SECURITY_HEADERS }
    );
  } catch (err: any) {
    console.error("Failed to fetch DSA topic:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }
}
