"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Video,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Award,
  Zap,
  BarChart3,
  Sliders,
  AlertCircle,
} from "lucide-react";
import EdworldNavbar from "@/components/layout/EdworldNavbar";
import EdworldFooter from "@/components/layout/EdworldFooter";

interface QuestionItem {
  id: string;
  domain: string;
  type: "technical" | "behavioral" | "hr";
  prompt: string;
  expectedKeywords: string[];
  tips: string;
}

const SAMPLE_QUESTIONS: QuestionItem[] = [
  {
    id: "q1",
    domain: "SDE-1 Backend",
    type: "technical",
    prompt: "How would you design a distributed cache invalidation strategy for a high-concurrency e-commerce inventory service?",
    expectedKeywords: ["Write-Through", "Cache Aside", "TTL", "Redis Pub/Sub", "Eventual Consistency"],
    tips: "Structure your answer with requirements, high-level architecture, cache stampede prevention, and database locking strategies.",
  },
  {
    id: "q2",
    domain: "Frontend Engineer",
    type: "technical",
    prompt: "Explain how React 18 Concurrent Mode and Suspense handle interruptible rendering and state tearing.",
    expectedKeywords: ["Fiber Tree", "Transitions", "Priority Queue", "useDeferredValue", "Hydration"],
    tips: "Mention the difference between synchronous rendering vs. time-sliced updates and how memory allocation is preserved.",
  },
  {
    id: "q3",
    domain: "All Engineering",
    type: "behavioral",
    prompt: "Tell me about a time when a critical bug slipped into production on a Friday evening. How did you handle triage, stakeholders, and remediation?",
    expectedKeywords: ["Situation", "Task", "Action", "Result", "Blameless Post-Mortem", "Rollback Strategy"],
    tips: "Follow the STAR framework rigorously. Highlight ownership, customer impact mitigation, and post-incident safeguards.",
  },
  {
    id: "q4",
    domain: "All Engineering",
    type: "hr",
    prompt: "Why are you interested in joining high-velocity early engineering teams over mature legacy corporations, and how do you prioritize competing deadlines?",
    expectedKeywords: ["Impact", "Ownership", "Prioritization", "Growth Velocity", "Collaborative Agility"],
    tips: "Show self-awareness, authentic motivation, and structured time management frameworks like Eisenhower matrix.",
  },
];

export default function PracticePage() {
  const [selectedDomain, setSelectedDomain] = useState("SDE-1 Backend");
  const [selectedType, setSelectedType] = useState<"technical" | "behavioral" | "hr">("technical");
  const [activeQuestion, setActiveQuestion] = useState<QuestionItem>(SAMPLE_QUESTIONS[0]);

  // Simulation state
  const [simState, setSimState] = useState<"idle" | "recording" | "analyzing" | "completed">("idle");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [volumeHeights, setVolumeHeights] = useState<number[]>([20, 35, 60, 45, 80, 50, 75, 40, 65, 90, 40, 55]);

  // Filter questions on domain/type change
  useEffect(() => {
    const matched =
      SAMPLE_QUESTIONS.find((q) => q.type === selectedType && (q.domain === selectedDomain || q.domain === "All Engineering")) ||
      SAMPLE_QUESTIONS.find((q) => q.type === selectedType) ||
      SAMPLE_QUESTIONS[0];
    setActiveQuestion(matched);
    setSimState("idle");
    setRecordingSeconds(0);
  }, [selectedDomain, selectedType]);

  // Timer simulation
  useEffect(() => {
    let timer: any;
    if (simState === "recording") {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
        // Randomize waveform
        setVolumeHeights(Array.from({ length: 16 }, () => Math.floor(Math.random() * 70) + 25));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [simState]);

  const handleStartRecording = () => {
    setSimState("recording");
    setRecordingSeconds(0);
  };

  const handleStopAndEvaluate = () => {
    setSimState("analyzing");
    setTimeout(() => {
      setSimState("completed");
    }, 1500);
  };

  const handleReset = () => {
    setSimState("idle");
    setRecordingSeconds(0);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAF9] text-[#0B1E16] font-sans antialiased">
      <EdworldNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        {/* Header Banner */}
        <div className="space-y-3 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8F3DC] text-[#1B4332] text-xs font-mono font-bold uppercase tracking-wider">
            <Video className="w-3.5 h-3.5 text-[#1B4332]" />
            <span>AI Mock Interview Simulator &bull; Voice &amp; Video Rubric</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1E16] tracking-tight">
            Practice Real Interview Pressure
          </h1>
          <p className="text-sm sm:text-base text-[#4A5D54]">
            Calibrate your cadence, eliminate filler words, and verify your STAR structure against top-tier tech benchmarks.
          </p>
        </div>

        {/* Domain & Interview Type Selectors */}
        <div className="bg-white rounded-2xl border border-[#E2EBE5] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold uppercase text-[#788B82]">Target Engineering Track</label>
              <div className="flex flex-wrap gap-2">
                {["SDE-1 Backend", "Frontend Engineer", "Full Stack", "Data Engineering", "AI/ML Engineer"].map((domain) => (
                  <button
                    key={domain}
                    onClick={() => setSelectedDomain(domain)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
                      selectedDomain === domain
                        ? "bg-[#1B4332] text-white shadow-xs"
                        : "bg-[#F8FAF9] text-[#4A5D54] hover:bg-[#EAF9ED] border border-[#E2EBE5]"
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold uppercase text-[#788B82]">Round Type</label>
              <div className="flex gap-2">
                {[
                  { id: "technical", label: "Technical DSA & System" },
                  { id: "behavioral", label: "Behavioral (STAR)" },
                  { id: "hr", label: "Culture & HR" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
                      selectedType === type.id
                        ? "bg-[#D97706] text-white shadow-xs"
                        : "bg-[#F8FAF9] text-[#4A5D54] hover:bg-[#FEF3C7] border border-[#E2EBE5]"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulator Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Question & Audio Waveform Studio (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl bg-white border border-[#E2EBE5] p-6 sm:p-8 shadow-sm space-y-6">
              {/* Question Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#D8F3DC] text-[#1B4332] uppercase">
                    {activeQuestion.type} Round &bull; {selectedDomain}
                  </span>
                  <span className="text-xs text-[#788B82] font-mono">Question ID: #{activeQuestion.id}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0B1E16] leading-snug">
                  &ldquo;{activeQuestion.prompt}&rdquo;
                </h2>
                <p className="text-xs text-[#4A5D54] bg-[#F8FAF9] p-3 rounded-xl border border-[#E2EBE5] leading-relaxed">
                  <strong className="text-[#0B1E16]">Rubric Hint:</strong> {activeQuestion.tips}
                </p>
              </div>

              {/* Live Waveform & Audio Status Canvas */}
              <div className="p-6 rounded-2xl bg-[#081C15] text-white space-y-4">
                <div className="flex items-center justify-between text-xs border-b border-[#2D6A4F] pb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        simState === "recording" ? "bg-red-500 animate-pulse" : "bg-[#52B788]"
                      }`}
                    />
                    <span className="font-mono text-[#D8F3DC]">
                      {simState === "idle" && "READY TO SIMULATE"}
                      {simState === "recording" && `RECORDING &bull; 00:${String(recordingSeconds).padStart(2, "0")}`}
                      {simState === "analyzing" && "EVALUATING SPEECH RUBRIC..."}
                      {simState === "completed" && "EVALUATION COMPLETE"}
                    </span>
                  </div>
                  <span className="font-mono text-white/70">Audio Proctored &bull; 44.1 kHz</span>
                </div>

                {/* Animated Waveform Visualizer */}
                <div className="h-20 flex items-center justify-between gap-1.5 px-4 bg-[#121E18] rounded-xl border border-[#2D6A4F]/60">
                  {volumeHeights.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full bg-[#52B788] transition-all duration-200"
                      style={{
                        height: simState === "recording" ? `${h}%` : "15%",
                        opacity: simState === "recording" ? 1 : 0.35,
                      }}
                    />
                  ))}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {simState === "idle" && (
                      <button
                        type="button"
                        onClick={handleStartRecording}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#52B788] hover:bg-[#40916C] text-[#081C15] font-bold text-xs transition-all active:scale-95 cursor-pointer min-h-[44px]"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Start Speaking Now</span>
                      </button>
                    )}

                    {simState === "recording" && (
                      <button
                        type="button"
                        onClick={handleStopAndEvaluate}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#F59E0B] text-white font-bold text-xs transition-all active:scale-95 cursor-pointer min-h-[44px]"
                      >
                        <MicOff className="w-4 h-4" />
                        <span>Stop &amp; Score Answer</span>
                      </button>
                    )}

                    {simState === "analyzing" && (
                      <span className="inline-flex items-center gap-2 text-xs font-bold text-[#D8F3DC]">
                        <Sparkles className="w-4 h-4 animate-spin text-[#F59E0B]" />
                        Running Rubric Benchmark...
                      </span>
                    )}

                    {simState === "completed" && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all min-h-[44px]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Practice Again</span>
                      </button>
                    )}
                  </div>

                  <span className="text-[11px] text-white/60 font-mono">
                    Target Cadence: 130–160 WPM
                  </span>
                </div>
              </div>

              {/* Expected Keywords Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-[#788B82]">
                  Key Technical Terms Expected in Response
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeQuestion.expectedKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 rounded-lg bg-[#F2FBF4] border border-[#B7E4C7] text-[#1B4332] text-xs font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4-Metric Score Breakdown & Benchmark (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl bg-white border border-[#E2EBE5] p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2EBE5] pb-3">
                <h3 className="font-bold text-sm text-[#0B1E16]">Interview Readiness Score</h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#D8F3DC] text-[#1B4332]">
                  {simState === "completed" ? "88 / 100" : "Benchmark"}
                </span>
              </div>

              {/* 4 Metrics */}
              <div className="space-y-4">
                {/* 1. Communication */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#4A5D54]">1. Communication Clarity</span>
                    <span className="font-bold text-[#1B4332]">88%</span>
                  </div>
                  <div className="w-full bg-[#E2EBE5] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1B4332] h-full rounded-full" style={{ width: "88%" }} />
                  </div>
                  <div className="text-[10px] text-[#788B82]">Zero filler words detected (&ldquo;basically&rdquo;, &ldquo;like&rdquo;).</div>
                </div>

                {/* 2. Confidence */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#4A5D54]">2. Confidence &amp; Steady Tone</span>
                    <span className="font-bold text-[#D97706]">85%</span>
                  </div>
                  <div className="w-full bg-[#E2EBE5] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#D97706] h-full rounded-full" style={{ width: "85%" }} />
                  </div>
                  <div className="text-[10px] text-[#788B82]">Consistent volume throughout question answer.</div>
                </div>

                {/* 3. Content */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#4A5D54]">3. Content Accuracy</span>
                    <span className="font-bold text-[#1B4332]">92%</span>
                  </div>
                  <div className="w-full bg-[#E2EBE5] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1B4332] h-full rounded-full" style={{ width: "92%" }} />
                  </div>
                  <div className="text-[10px] text-[#788B82]">Matched 4 of 5 target system architecture concepts.</div>
                </div>

                {/* 4. Pace */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#4A5D54]">4. Speech Pace</span>
                    <span className="font-bold text-[#0B1E16]">142 WPM</span>
                  </div>
                  <div className="w-full bg-[#E2EBE5] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#52B788] h-full rounded-full" style={{ width: "80%" }} />
                  </div>
                  <div className="text-[10px] text-[#52B788] font-semibold">Optimal range (130–160 WPM).</div>
                </div>
              </div>

              {/* STAR Checklist */}
              <div className="p-3.5 rounded-xl bg-[#F2FBF4] border border-[#B7E4C7] space-y-2 text-xs">
                <span className="font-bold text-[#1B4332]">STAR Framework Compliance</span>
                <div className="space-y-1 text-[11px] text-[#4A5D54]">
                  <div className="flex items-center gap-1.5 text-[#1B4332]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Situation &amp; Context clearly articulated</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#1B4332]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Technical Action quantified with metrics</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#1B4332]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Measurable outcome achieved</span>
                  </div>
                </div>
              </div>

              {/* Try a Free Interview CTA */}
              <Link
                href="/auth/signup"
                className="w-full py-3 rounded-xl bg-[#D97706] hover:bg-[#F59E0B] text-white font-bold text-xs text-center transition-all shadow-xs flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <span>Unlock Unlimited AI Mock Rounds</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <EdworldFooter />
    </div>
  );
}
