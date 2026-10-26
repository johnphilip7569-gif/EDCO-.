import { NextRequest, NextResponse } from "next/server";
import { MyraInterviewPolicy, MYRA_INTERVIEWER_VERSION } from "@/lib/ai/myra-interview-policy";
import { supabase } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limiter";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") || `req-${Date.now()}`;
  const log = logger.child({ request_id: requestId, route: "/api/interview/turn", service: "interview" });
  const startTime = Date.now();

  // Rate limit: 10 turns per minute per IP (AI endpoint — expensive to abuse)
  const ip = getClientIp(req);
  const rl = rateLimit(`interview-turn:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    log.warn("Rate limit exceeded", { ip, limit: rl.limit });
    return NextResponse.json(
      { success: false, error: "Too many requests. Please wait before continuing." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.reset - Date.now()) / 1000)),
          "x-request-id": requestId,
        },
      }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const {
      questionText = "",
      candidateTranscript = "",
      isFollowUp = false,
      questionIndex = 0,
      totalQuestions = 3,
      targetRole = "Software Engineer",
      category = "Software Engineering",
      resumeContext = "",
      candidateName = "",
      userId = "anonymous",
      sessionId = "",
    } = body;

    if (!questionText) {
      return NextResponse.json(
        { error: "questionText is required." },
        { status: 400 }
      );
    }

    // Evaluate turn using Myra Interview Policy
    const turnResult = MyraInterviewPolicy.evaluateTurn({
      questionText,
      candidateTranscript: candidateTranscript || "",
      isFollowUp: Boolean(isFollowUp),
      questionIndex: Number(questionIndex) || 0,
      totalQuestions: Number(totalQuestions) || 3,
      targetRole,
      category,
      resumeContext,
      candidateName,
    });

    const latencyMs = Date.now() - startTime;

    // Log interaction to myra_interactions table
    if (userId && userId !== "anonymous" && userId !== "guest") {
      try {
        await supabase.from("myra_interactions").insert({
          user_id: userId,
          feature_context: isFollowUp ? "interview_follow_up" : "live_interview_turn",
          input_summary: candidateTranscript.slice(0, 300) || "[No speech / repeat request]",
          output_summary: turnResult.spokenText.slice(0, 300),
          model_version: turnResult.modelVersion || MYRA_INTERVIEWER_VERSION,
          status: "success",
          metadata: {
            action: turnResult.action,
            questionIndex,
            isFollowUp,
            latencyMs,
            sessionId,
            referencedPhrase: turnResult.referencedPhrase || null,
          },
        });
      } catch (logErr) {
        console.warn("[Myra Turn Log Warning]:", logErr);
      }
    }

    return NextResponse.json({
      success: true,
      action: turnResult.action,
      spokenText: turnResult.spokenText,
      followUpQuestion: turnResult.followUpQuestion || null,
      referencedPhrase: turnResult.referencedPhrase || null,
      reasoning: turnResult.reasoning,
      modelVersion: turnResult.modelVersion,
      latencyMs,
    });
  } catch (err: any) {
    console.error("[Myra Turn Error]:", err);
    // Graceful fallback turn so candidate interview never freezes or dead-ends
    return NextResponse.json({
      success: true,
      action: "next",
      spokenText: "Understood. Let's move to our next question.",
      reasoning: "Graceful recovery on internal processing exception.",
      modelVersion: MYRA_INTERVIEWER_VERSION,
      latencyMs: Date.now() - startTime,
    });
  }
}
