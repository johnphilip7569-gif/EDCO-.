import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAllDsaTopics } from "@/lib/dsa/dsa-bank";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    // 1. Fetch topics from Supabase or fallback to in-memory bank
    let topics = getAllDsaTopics();

    try {
      const { data: dbTopics, error } = await supabase
        .from("dsa_topics")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && dbTopics && dbTopics.length > 0) {
        topics = dbTopics.map((t) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          tier: t.tier,
          difficulty_level: t.difficulty_level,
          interview_frequency: t.interview_frequency,
          prerequisite_topic_ids: t.prerequisite_topic_ids || [],
          explainer_concept: t.explainer_concept,
          explainer_why_it_matters: t.explainer_why_it_matters,
          explainer_common_use: t.explainer_common_use,
          worked_example: typeof t.worked_example === "string" ? JSON.parse(t.worked_example) : t.worked_example,
          visualizer_type: t.visualizer_type,
          order_index: t.order_index,
        }));
      }
    } catch (dbErr) {
      console.warn("[DSA Topics DB Fallback]", dbErr);
    }

    // 2. If userId is provided, merge user's topic progress
    let userProgressMap: Record<string, { status: string; mastery_score: number; effective_level: number }> = {};

    if (userId && userId !== "null" && userId !== "guest") {
      try {
        const { data: progressRows } = await supabase
          .from("dsa_progress")
          .select("topic_id, status, mastery_score, effective_level_for_topic")
          .eq("user_id", userId);

        if (progressRows) {
          progressRows.forEach((r) => {
            userProgressMap[r.topic_id] = {
              status: r.status,
              mastery_score: r.mastery_score,
              effective_level: r.effective_level_for_topic || 0,
            };
          });
        }
      } catch (pErr) {
        console.warn("[DSA Progress DB Fallback]", pErr);
      }
    }

    const payload = topics.map((t) => {
      const prog = userProgressMap[t.id] || { status: "not_started", mastery_score: 0, effective_level: 0 };
      return {
        ...t,
        status: prog.status,
        mastery_score: prog.mastery_score,
        user_effective_level: prog.effective_level,
      };
    });

    return NextResponse.json({
      success: true,
      topics: payload,
    });
  } catch (err: any) {
    console.error("Failed to fetch DSA topics:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
