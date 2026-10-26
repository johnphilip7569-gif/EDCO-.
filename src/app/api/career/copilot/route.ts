import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { synthesizePersonalCareerGraph, computeSkillIntelligence, computeCareerGapAnalysis } from "@/lib/services/career-intelligence-graph";
import { MyraOrchestrator } from "@/lib/ai/myra-orchestration";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, sessionId = "default" } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    const cleanMessage = message.trim();
    const promptLower = cleanMessage.toLowerCase();

    // Aegis Sentinel AI Prompt-Injection & Exploit Inspection
    const { evaluateThreat } = await import("@/lib/security/sentinel-agent");
    const threatCheck = evaluateThreat({
      ip: req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1",
      userAgent: req.headers.get("user-agent") || "",
      path: "/api/career/copilot",
      bodyText: cleanMessage,
    });

    if (threatCheck.blocked || threatCheck.threatVectors.includes("PROMPT_INJECTION") || threatCheck.threatVectors.includes("OWASP_EXPLOIT")) {
      return NextResponse.json(
        {
          reply: "Your query was flagged by Aegis Sentinel AI for prompt integrity and platform security guidelines.",
          error: "PROMPT_SECURITY_FLAGGED",
          riskScore: threatCheck.riskScore,
        },
        { status: 403 }
      );
    }

    // 1. Authorized Context Retrieval
    const [profileRes, graph, skills, gaps, resumesRes, appsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      synthesizePersonalCareerGraph(user.id, supabase),
      computeSkillIntelligence(user.id, supabase),
      computeCareerGapAnalysis(user.id, "Full Stack Software Engineer", supabase),
      supabase.from("resumes").select("title, target_role, ats_score").eq("user_id", user.id).limit(3),
      supabase.from("job_applications_pipeline").select("company_name, job_title, status").eq("user_id", user.id)
    ]);

    const resumes = resumesRes.data || [];
    const applications = appsRes.data || [];

    const evidenceCitations: Array<{ title: string; source: string; url?: string }> = [];
    const actionShortcuts: Array<{ label: string; actionType: string; href: string }> = [];

    // 2. Directly answer the exact question asked via MyraOrchestrator
    const orchestration = await MyraOrchestrator.execute({
      userId: user.id,
      featureContext: "ask_myra",
      prompt: `User Question: ${cleanMessage}\n\nAnswer ONLY what the user asked directly and concisely. Do not include asterisks (*).`,
      rawQuery: cleanMessage,
      temperature: 0.35,
      maxTokens: 600,
    });

    let reply = (orchestration.text || "").replace(/\*/g, "").trim();

    // Only attach targeted context or shortcuts if the user explicitly asked about their own career state
    if (/\b(my resume|my ats|my cv)\b/.test(promptLower)) {
      const topResume = resumes[0];
      reply = `Your active resume "${topResume?.title || "Target Resume"}" has an ATS rating of ${topResume?.ats_score ?? 85}/100. Focus on Action + Technical Context + Quantified Impact in your bullet points.`;
      evidenceCitations.push({ title: topResume?.title || "Active Resume", source: "Resume Engine", url: "/resumes" });
      actionShortcuts.push({ label: "Open Resume Studio", actionType: "resume", href: "/resumes" });
    } else if (/\b(my skills|my evidence|skill gap)\b/.test(promptLower)) {
      const topSkills = skills.slice(0, 4);
      reply = topSkills.length > 0
        ? `Your verified skills: ${topSkills.map((s) => `${s.skillName} (${s.state.toUpperCase()})`).join(", ")}.`
        : `You currently have ${gaps.developingSkillsCount} developing skills tracked.`;
      evidenceCitations.push({ title: "Verified Skill Evidence", source: "Evidence Engine", url: "/career/evidence" });
    } else if (/\b(what should i work on|my plan today|focus today)\b/.test(promptLower)) {
      reply = `Focus on ${gaps.developingSkillsCount} developing skill(s), review your ${graph.nodes.filter((n) => n.type === "project").length} recorded project(s), and follow up on ${applications.length} active application(s).`;
      actionShortcuts.push({ label: "Start Mock Interview", actionType: "interview", href: "/interviews" });
    }

    // Log user & assistant messages
    await supabase.from("career_copilot_conversations").insert([
      {
        user_id: user.id,
        session_id: sessionId,
        role: "user",
        content: cleanMessage
      },
      {
        user_id: user.id,
        session_id: sessionId,
        role: "assistant",
        content: reply,
        evidence_citations: evidenceCitations,
        action_shortcuts: actionShortcuts
      }
    ]);

    // Record AI Telemetry
    const latencyMs = Date.now() - startTime;
    await supabase.from("ai_analysis_logs").insert({
      analysis_id: `copilot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_id: user.id,
      feature: "career_copilot",
      analysis_type: "copilot_interaction",
      model: orchestration.modelUsed || "claude-3-7-sonnet",
      prompt_version: "v9.2_direct_answer",
      input_reference: { messageLength: cleanMessage.length, sessionId },
      result: { replyLength: reply.length, citationsCount: evidenceCitations.length },
      latency_ms: latencyMs,
      status: "SUCCESS"
    });

    return NextResponse.json({
      success: true,
      reply,
      evidenceCitations,
      actionShortcuts
    });
  } catch (err: any) {
    console.error("[Career Copilot API Error]:", err);
    return NextResponse.json({ error: err.message || "Failed to process Copilot request" }, { status: 500 });
  }
}
