"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AVAILABLE_CATEGORIES } from "@/lib/mock-data";
import { SkillLevel } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import MediaRecorderStudio from "@/components/interview/MediaRecorderStudio";
import PreFlightAudioCheckModal from "@/components/interview/PreFlightAudioCheckModal";
import { VoiceChoice } from "@/lib/interview/voice-profiles";
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Layers,
  HelpCircle, 
  Lock, 
  ArrowRight, 
  FileText, 
  Play, 
  RotateCcw, 
  Briefcase, 
  Code2, 
  Cpu, 
  Check, 
  ChevronRight, 
  AlertTriangle,
  Maximize2,
  ExternalLink
} from "lucide-react";
import { useExamProctoring } from "@/hooks/useExamProctoring";

interface SavedResume {
  id: string;
  title: string;
  content: any;
  updated_at: string;
}

export default function ActiveInterviewStudioPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const categoryId = params?.category as string;
  const searchParams = useSearchParams();

  // Career Track Gating: 18+ only
  const isMinorUser = user ? user.ageBand !== "18+" : false;

  const categoryObj = AVAILABLE_CATEGORIES.find(
    (c) => c.id === categoryId || c.name.toLowerCase().includes(categoryId?.toLowerCase() || "")
  ) || AVAILABLE_CATEGORIES[0];

  const categoryName = categoryObj.name;

  const interestObj = profile?.interests?.find(
    (i) => i.id === categoryObj.id || i.name.toLowerCase() === categoryName.toLowerCase() || categoryName.toLowerCase().includes(i.name.toLowerCase())
  );
  const effectiveLevel: SkillLevel = interestObj ? interestObj.effectiveLevel : 0;

  // State
  const [targetRole, setTargetRole] = useState(categoryName);
  const [selectedSector, setSelectedSector] = useState<string>("Software & Full-Stack");
  const [jobDescriptionInput, setJobDescriptionInput] = useState("");
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [rawResumeInput, setRawResumeInput] = useState("");
  const [loadingResumes, setLoadingResumes] = useState(true);

  // Active Session State
  const [sessionStarted, setSessionStarted] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [aiModelUsed, setAiModelUsed] = useState<string>("");
  const [resumeConnected, setResumeConnected] = useState(false);
  const [sessionTranscripts, setSessionTranscripts] = useState<Record<number, string>>({});

  // Voice & Pre-Flight Hardware Check State
  const [isPreFlightOpen, setIsPreFlightOpen] = useState(false);
  const [audioOptIn, setAudioOptIn] = useState(false);
  const [voiceChoice, setVoiceChoice] = useState<VoiceChoice>("myra-neutral");
  const [speakingSpeed, setSpeakingSpeed] = useState(1.0);
  const [useKeyboardFallback, setUseKeyboardFallback] = useState(false);

  // Myra Auto-Setup & Progress States
  const [isAutoSettingUp, setIsAutoSettingUp] = useState(false);
  const [myraNotice, setMyraNotice] = useState<string | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [scoringStageIndex, setScoringStageIndex] = useState(0);
  const [generatingStageIndex, setGeneratingStageIndex] = useState(0);

  // Proctoring in Live Mock Interview
  const {
    violationCount,
    maxViolations,
    isDisqualified,
    activeWarning,
    requestFullscreen,
    dismissWarning,
  } = useExamProctoring({
    enabled: sessionStarted && !isScoring,
    maxViolations: 2,
    onDisqualify: (reason) => {
      // Auto-terminate interview
      alert(`Interview Terminated: ${reason}`);
      router.push("/interviews");
    },
  });

  const scoringStages = [
    "Evaluating interview audio telemetry...",
    "Analyzing STAR narrative structure...",
    "Cross-referencing JD competency keywords...",
    "Synthesizing actionable upgrade roadmap..."
  ];

  const generatingStages = [
    "Analyzing resume projects and technical stack...",
    "Cross-referencing target Job Description competencies...",
    "Synthesizing high-signal situational questions...",
    "Finalizing proctored interview environment..."
  ];

  useEffect(() => {
    const jobTitleParam = searchParams.get("jobTitle");
    const jdParam = searchParams.get("jd");
    const resumeIdParam = searchParams.get("resumeId");

    if (jobTitleParam) setTargetRole(jobTitleParam);
    if (jdParam) setJobDescriptionInput(jdParam);
    if (resumeIdParam) setSelectedResumeId(resumeIdParam);
  }, [searchParams]);

  // Progress timer for generating questions
  useEffect(() => {
    if (!generating) {
      setGeneratingStageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setGeneratingStageIndex((prev) => (prev < generatingStages.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [generating]);

  // Progress timer for scoring session
  useEffect(() => {
    if (!isScoring) {
      setScoringStageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setScoringStageIndex((prev) => (prev < scoringStages.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [isScoring]);

  // Fetch User's Saved Resumes from Supabase
  useEffect(() => {
    if (!user || isMinorUser) {
      setLoadingResumes(false);
      return;
    }

    const fetchResumes = async () => {
      try {
        const { data } = await supabase
          .from("resumes")
          .select("id, title, content, updated_at")
          .eq("user_id", user.uid)
          .order("updated_at", { ascending: false });

        if (data && data.length > 0) {
          setSavedResumes(data);
          // Default to the most recently updated resume if not already set
          setSelectedResumeId((prev) => (prev ? prev : data[0].id));
        } else {
          setSelectedResumeId("custom");
        }
      } catch (err) {
        console.warn("[Fetch Resumes Supabase Note]:", err);
      } finally {
        setLoadingResumes(false);
      }
    };

    fetchResumes();
  }, [user, isMinorUser]);

  // Selected Resume Details Preview
  const selectedResumeObj = savedResumes.find((r) => r.id === selectedResumeId);
  const resumeSkills: string[] = selectedResumeObj?.content?.skills?.technical || 
    selectedResumeObj?.content?.skills?.tools || 
    (Array.isArray(selectedResumeObj?.content?.skills) ? selectedResumeObj.content.skills : []) || [];
  const resumeProjects: Array<{ title: string; technologies?: string[] }> = selectedResumeObj?.content?.projects || [];

  // "Let Myra set this up for me" Handler
  const handleMyraAutoSetup = () => {
    setIsAutoSettingUp(true);
    const inferredRole = profile?.targetRole || selectedResumeObj?.content?.target_role || categoryName;
    setTargetRole(inferredRole);

    const lowerRole = inferredRole.toLowerCase();
    let bestSector = "Software & Full-Stack";
    if (lowerRole.includes("data") || lowerRole.includes("ai") || lowerRole.includes("ml")) {
      bestSector = "AI, ML & Data Science";
    } else if (lowerRole.includes("cloud") || lowerRole.includes("devops") || lowerRole.includes("sre")) {
      bestSector = "Cloud & DevOps";
    } else if (lowerRole.includes("security") || lowerRole.includes("cyber")) {
      bestSector = "CyberSecurity";
    }
    setSelectedSector(bestSector);

    if (savedResumes.length > 0 && !selectedResumeId) {
      setSelectedResumeId(savedResumes[0].id);
    }

    if (!jobDescriptionInput.trim()) {
      setJobDescriptionInput(
        `Core Competencies for ${inferredRole}:\n- Architecture design and rigorous technical problem solving\n- Robust error boundaries, performance optimization, and testing\n- Clear communication of engineering trade-offs, constraints, and business outcomes`
      );
    }

    setMyraNotice(`Myra configured your setup for ${inferredRole} using your saved resume!`);
    setTimeout(() => setIsAutoSettingUp(false), 350);
  };

  const handleStartSession = async () => {
    // Validate resume input
    const hasResume = (selectedResumeId && selectedResumeId !== "custom" && selectedResumeId !== "none") || (selectedResumeId === "custom" && rawResumeInput.trim().length > 10);
    if (!hasResume && savedResumes.length === 0) {
      alert("Please build or paste your resume details first so questions can be calibrated to your projects!");
      return;
    }

    setGenerating(true);
    try {
      const candidateName = user?.name || profile?.name || "";
      const firstName = candidateName ? candidateName.trim().split(" ")[0] : "";
      
      const payload: any = {
        category: categoryName,
        targetRole: targetRole || categoryName,
        sector: selectedSector,
        effectiveLevel,
        candidateName,
        userId: user?.uid,
        jobDescription: jobDescriptionInput,
      };

      if (selectedResumeId && selectedResumeId !== "custom" && selectedResumeId !== "none") {
        payload.resumeId = selectedResumeId;
        payload.resumeContent = selectedResumeObj?.content;
      } else if (selectedResumeId === "custom" && rawResumeInput.trim()) {
        payload.rawResumeText = rawResumeInput.trim();
      }

      const res = await fetch("/api/interview/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setAiModelUsed(data.modelUsed || data.source || "Claude 3.5 Sonnet");
        setResumeConnected(Boolean(data.resumeConnected));
      } else {
        // Fallback questions calibrated to role
        setQuestions([
          {
            id: "warmup-1",
            text: firstName
              ? `Hi ${firstName}, welcome to your mock round for ${targetRole || categoryName}. To start, walk me through the key architectural decisions of the most complex project on your resume.`
              : `Welcome! Walk me through the key architectural decisions and metrics of the most complex project on your resume.`,
            difficultyLevel: 0,
            type: "warmup",
            contextSource: "Resume Alignment",
            suggestedDurationSeconds: 120,
          },
          {
            id: "q-project-1",
            text: `Based on your technical experience and the requirements for ${targetRole || categoryName}, how did you handle data consistency, performance bottlenecks, and automated unit testing in your last major deployment?`,
            difficultyLevel: effectiveLevel,
            type: "project_deep_dive",
            contextSource: "JD Competency Evaluation",
            suggestedDurationSeconds: 150,
          },
          {
            id: "q-tech-3",
            text: `Looking at this target role's production requirements, suppose you experience an unexpected latency spike or service outage. What is your step-by-step triage and post-mortem workflow?`,
            difficultyLevel: effectiveLevel,
            type: "technical",
            contextSource: "JD Technical Rigor",
            suggestedDurationSeconds: 120,
          },
        ]);
        setAiModelUsed("Universal Deterministic Engine");
      }

      // Open hardware and privacy preflight check before entering active interview
      setIsPreFlightOpen(true);
    } catch (e) {
      console.warn("Question generation note:", e);
      setIsPreFlightOpen(true);
    } finally {
      setGenerating(false);
    }
  };

  const handlePreFlightProceed = async (config: {
    audioOptIn: boolean;
    voiceChoice: VoiceChoice;
    speakingSpeed: number;
    isAudioOnly: boolean;
    useKeyboardFallback: boolean;
  }) => {
    setAudioOptIn(config.audioOptIn);
    setVoiceChoice(config.voiceChoice);
    setSpeakingSpeed(config.speakingSpeed);
    setUseKeyboardFallback(config.useKeyboardFallback);
    setIsPreFlightOpen(false);

    try {
      await requestFullscreen();
    } catch (fsErr) {
      console.warn("Fullscreen request note:", fsErr);
    }
    setSessionStarted(true);
  };

  const handleQuestionSubmit = async (sessionSubmission: {
    transcript: string;
    durationSeconds: number;
    isAudioOnly?: boolean;
    voiceOptIn?: boolean;
    fullscreenExitEvents?: Array<{ timestamp: string; questionIndex: number }>;
  }) => {
    if (!user) return;

    const updatedTranscripts = {
      ...sessionTranscripts,
      [currentQuestionIdx]: sessionSubmission.transcript,
    };
    setSessionTranscripts(updatedTranscripts);

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      return;
    }

    // Finished all questions -> Score Session
    setIsScoring(true);
    try {
      const combinedTranscript = Object.values(updatedTranscripts).join(" \n\n ");

      const res = await fetch("/api/interview/score-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          category: categoryName,
          targetRole: targetRole || categoryName,
          difficultyLevel: effectiveLevel,
          questions: questions.length > 0 ? questions : [{ id: "q1", text: "Interview Question", transcript: sessionSubmission.transcript }],
          transcript: combinedTranscript || sessionSubmission.transcript,
          durationSeconds: sessionSubmission.durationSeconds,
          resumeContext: selectedResumeObj?.title ? `Resume: ${selectedResumeObj.title}` : "",
          voiceOptIn: audioOptIn,
          fullscreenExitEvents: sessionSubmission.fullscreenExitEvents || [],
        }),
      });

      const data = await res.json();
      if (data.success && data.sessionId) {
        localStorage.setItem(`edworld_${user.uid}_interview_${data.sessionId}`, JSON.stringify(data));
        router.push(`/interviews/results/${data.sessionId}`);
      } else {
        router.push("/interviews");
      }
    } catch (e) {
      console.warn("Session score submission error:", e);
      router.push("/interviews");
    } finally {
      setIsScoring(false);
    }
  };

  if (isMinorUser) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-white">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-neutral-200 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-black flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-black">Career Track Restricted</h1>
          <p className="text-xs text-neutral-500">
            Mock interviews and speech diagnostics are available for 18+ Career Track members.
          </p>
          <Link href="/dashboard" className="inline-block px-4 py-2 rounded-xl bg-black text-white text-xs font-bold">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIdx] || {
    id: "warmup-1",
    text: "Tell me about yourself, your background, and what drives your passion for this domain.",
    difficultyLevel: 0,
    type: "warmup",
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white py-8 px-4 sm:px-6 lg:px-8 text-black select-none">
      
      {/* Tab/Window Switch Warning Modal during Active Interview */}
      {activeWarning && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-black shadow-2xl text-center space-y-5">
            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
              isDisqualified ? "bg-red-100 text-red-600" : "bg-neutral-100 text-black"
            }`}>
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                isDisqualified ? "bg-red-600 text-white" : "bg-black text-white"
              }`}>
                Lockdown Violation
              </span>
              <h2 className="text-xl font-extrabold text-black">
                {isDisqualified ? "Interview Terminated" : "Tab or Window Switch Detected"}
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {activeWarning}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-600 font-mono">
              Strikes: {Math.min(violationCount, maxViolations + 1)} / {maxViolations + 1} &bull; Fullscreen Enforced
            </div>

            {!isDisqualified ? (
              <button
                type="button"
                onClick={dismissWarning}
                className="w-full py-3 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Resume Interview Session
              </button>
            ) : (
              <Link
                href="/interviews"
                className="inline-block w-full py-3 px-4 rounded-xl bg-black text-white text-xs font-bold"
              >
                Return to Interviews
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link href="/interviews" className="text-xs font-bold text-neutral-500 hover:text-black flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Mock Interview Studio</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-black bg-neutral-100 border border-neutral-300 px-3 py-1 rounded-full">
              {categoryName} &bull; Level {effectiveLevel}
            </span>
          </div>
        </div>

        {!sessionStarted ? (
          /* RESUME-FIRST PRE-SESSION SETUP: 3-STEP FLOW */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-8 animate-in fade-in">
            
            {/* 3-Step Flow Stepper Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black text-white flex items-center gap-1.5 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Resume-First Interview Flow</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-500 bg-neutral-50 px-2 py-0.5 rounded-md border border-neutral-200">
                  Calibrated to your experience
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
                  EdInterview &bull; {categoryName}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                  Step 1: Connect your resume. Step 2: Input target JD. Step 3: Face questions calibrated to your actual projects.
                </p>
              </div>

              {/* 3-Step Visual Progress Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-neutral-50 border-2 border-black space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-black">
                    <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-mono font-black">1</span>
                    <span>Build / Select Resume</span>
                  </div>
                  <p className="text-[10px] text-neutral-500">Your projects &amp; verified skills</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-black">
                    <span className="w-5 h-5 rounded-full bg-neutral-200 text-black flex items-center justify-center text-[11px] font-mono font-black">2</span>
                    <span>Target Role &amp; JD</span>
                  </div>
                  <p className="text-[10px] text-neutral-500">Specific job requirements</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-black">
                    <span className="w-5 h-5 rounded-full bg-neutral-200 text-black flex items-center justify-center text-[11px] font-mono font-black">3</span>
                    <span>Lockdown Interview</span>
                  </div>
                  <p className="text-[10px] text-neutral-500">Video round &amp; STAR scoring</p>
                </div>
              </div>
            </div>

            {/* STEP 1: RESUME REQUIREMENT & SELECTOR */}
            <div className="space-y-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-black" />
                    <span>Step 1: Your Active ATS Resume (Mandatory)</span>
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Questions are directly derived from the technical projects, languages, and metrics in your resume.
                  </p>
                </div>

                <Link
                  href="/resumes"
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-black text-xs font-bold flex items-center gap-1 shadow-2xs transition-all"
                  target="_blank"
                >
                  <span>Build New Resume</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500" />
                </Link>
              </div>

              {savedResumes.length === 0 && !loadingResumes ? (
                /* No Resume Warning & Quick Gate */
                <div className="p-5 rounded-xl bg-white border border-neutral-300 space-y-3">
                  <div className="flex items-center gap-2 text-black font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-black" />
                    <span>No Saved Resume Detected</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    EdWorld mock rounds evaluate your real project architectural decisions against recruiter criteria. You can create your ATS resume in 2 minutes, or paste your experience bullets below.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link
                      href="/resumes"
                      className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold flex items-center gap-1.5 hover:bg-neutral-800"
                    >
                      <span>Build ATS Resume First</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSelectedResumeId("custom")}
                      className="px-4 py-2 rounded-xl bg-neutral-100 border border-neutral-200 text-black text-xs font-bold hover:bg-neutral-200"
                    >
                      Paste Resume Text Instead
                    </button>
                  </div>
                </div>
              ) : (
                /* Saved Resumes Selector */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {savedResumes.map((resume) => (
                    <button
                      key={resume.id}
                      type="button"
                      onClick={() => setSelectedResumeId(resume.id)}
                      className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                        selectedResumeId === resume.id
                          ? "border-black bg-white text-black shadow-xs ring-2 ring-black"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <FileText className={`w-4 h-4 ${selectedResumeId === resume.id ? "text-black" : "text-neutral-400"}`} />
                          {selectedResumeId === resume.id && (
                            <CheckCircle2 className="w-4 h-4 text-black" />
                          )}
                        </div>
                        <p className="font-bold text-xs line-clamp-1">{resume.title || "Portfolio Resume"}</p>
                        <p className="text-[10px] text-neutral-500">
                          Updated {new Date(resume.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setSelectedResumeId("custom")}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                      selectedResumeId === "custom"
                        ? "border-black bg-white text-black shadow-xs ring-2 ring-black"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Code2 className={`w-4 h-4 ${selectedResumeId === "custom" ? "text-black" : "text-neutral-400"}`} />
                        {selectedResumeId === "custom" && <CheckCircle2 className="w-4 h-4 text-black" />}
                      </div>
                      <p className="font-bold text-xs">Paste Resume Text</p>
                      <p className="text-[10px] text-neutral-500">Manual bullet points</p>
                    </div>
                  </button>
                </div>
              )}

              {/* Custom Resume Text Box if Selected */}
              {selectedResumeId === "custom" && (
                <div className="pt-2 animate-in fade-in space-y-1.5">
                  <label className="text-[11px] font-bold text-black">
                    Paste Your Key Projects &amp; Skills:
                  </label>
                  <textarea
                    rows={4}
                    value={rawResumeInput}
                    onChange={(e) => setRawResumeInput(e.target.value)}
                    placeholder="e.g. Project: E-commerce microservice built with Node.js, Redis cache, Postgres. Handled 10k req/sec with zero downtime during flash sales. Skills: TypeScript, Docker, Kafka, AWS..."
                    className="w-full p-3.5 rounded-2xl bg-white border border-neutral-300 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              )}

              {/* Connected Resume Deep-Dive Insights */}
              {selectedResumeObj && selectedResumeId !== "custom" && (
                <div className="p-3.5 rounded-xl bg-white border border-neutral-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span className="font-bold text-xs text-black">
                      Connected Resume: {selectedResumeObj.title}
                    </span>
                  </div>
                  
                  {resumeSkills.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-neutral-500">Skills to test:</span>
                      {resumeSkills.slice(0, 6).map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-bold text-black border border-neutral-200">
                          {sk}
                        </span>
                      ))}
                      {resumeSkills.length > 6 && (
                        <span className="text-[10px] font-bold text-neutral-500">+{resumeSkills.length - 6} more</span>
                      )}
                    </div>
                  )}

                  {resumeProjects.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-neutral-500">Projects for deep-dive:</span>
                      {resumeProjects.slice(0, 3).map((pj, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-bold text-black border border-neutral-200">
                          {pj.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* STEP 2: TARGET ROLE & JOB DESCRIPTION */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-black" />
                  <span>Step 2: Target Job Description (JD) &amp; Role</span>
                </h3>
                <p className="text-[11px] text-neutral-500">
                  The AI interviewer will ask questions cross-referencing your resume against these specific JD requirements.
                </p>
              </div>

              {/* Target Role Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-black uppercase tracking-wider">
                  Target Role Title
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full-Stack Software Engineer, Machine Learning Engineer, Systems Architect..."
                  className="w-full p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs font-medium text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>

              {/* Sector Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-black" />
                  <span>Industry Sector</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    "Software & Full-Stack",
                    "Backend & Systems",
                    "AI, ML & Data Science",
                    "Cloud & DevOps",
                    "Fintech & Banking",
                    "Healthcare Tech",
                    "CyberSecurity",
                    "Product Management",
                  ].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setSelectedSector(sec)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left truncate cursor-pointer ${
                        selectedSector === sec
                          ? "bg-black text-white border-black shadow-2xs"
                          : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Description Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-black uppercase tracking-wider">
                    Target Job Description (JD)
                  </label>
                  <span className="text-[10px] font-mono text-neutral-500">Pasted or calibrated</span>
                </div>
                <textarea
                  rows={4}
                  value={jobDescriptionInput}
                  onChange={(e) => setJobDescriptionInput(e.target.value)}
                  placeholder="Paste the job requirements, responsibilities, or target tech stack here (e.g. Distributed caching, REST/GraphQL APIs, Kubernetes orchestration, 99.99% uptime)..."
                  className="w-full p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* STEP 3: LAUNCH LOCKDOWN INTERVIEW */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-200 pt-4">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>Fullscreen lockdown &amp; tab switch monitoring will activate upon start.</span>
              </div>

              <button
                type="button"
                onClick={handleStartSession}
                disabled={generating}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current text-white" />
                <span>{generating ? "Calibrating Questions from Resume & JD..." : "Step 3: Generate Questions & Launch"}</span>
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE INTERVIEW STUDIO */
          <div className="space-y-4">
            
            {/* Header with AI Model Badge, Generation Source Label & Progress */}
            <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-black text-white">
                    Question {currentQuestionIdx + 1} of {questions.length}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-black border border-neutral-200">
                    Calibrated from your resume &amp; {targetRole || categoryName} JD
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500">
                <span>Lockdown:</span>
                <span className="font-bold text-black bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
                  {violationCount}/{maxViolations} Strikes
                </span>
              </div>
            </div>

            <MediaRecorderStudio
              questionText={currentQ.text}
              category={categoryName}
              difficultyLevel={currentQ.difficultyLevel || effectiveLevel}
              suggestedDurationSeconds={currentQ.suggestedDurationSeconds || 120}
              currentQuestionIndex={currentQuestionIdx + 1}
              totalQuestions={questions.length || 3}
              adaptiveFocus={currentQ.adaptiveFocus}
              userId={user?.uid}
              targetRole={targetRole || categoryName}
              resumeContext={selectedResumeObj?.title ? `Resume: ${selectedResumeObj.title}` : ""}
              voiceChoice={voiceChoice}
              speakingSpeed={speakingSpeed}
              audioOptIn={audioOptIn}
              initialUseKeyboardFallback={useKeyboardFallback}
              onSubmitSession={handleQuestionSubmit}
            />
          </div>
        )}

        {/* Hardware Pre-Flight & Voice Privacy Consent Modal */}
        <PreFlightAudioCheckModal
          isOpen={isPreFlightOpen}
          onProceed={handlePreFlightProceed}
          onCancel={() => setIsPreFlightOpen(false)}
        />

        {/* Multi-Stage Branded Progress Loader during Generation or Scoring */}
        {(generating || isScoring) && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="max-w-md w-full bg-white border border-neutral-300 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full border-4 border-black border-t-transparent animate-spin flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-black" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-black">
                  {isScoring ? "Evaluating Your Session" : "Calibrating Your Interview"}
                </h3>
                <p className="text-xs text-neutral-600 font-medium">
                  {isScoring ? scoringStages[scoringStageIndex] : generatingStages[generatingStageIndex]}
                </p>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden border border-neutral-200">
                <div
                  className="bg-black h-full transition-all duration-500 rounded-full"
                  style={{ width: `${((isScoring ? scoringStageIndex + 1 : generatingStageIndex + 1) / 4) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                Matching Resume Experience ↔ Target JD Competencies
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
