"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { 
  Brain, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Award, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle, 
  BarChart3, 
  Check, 
  AlertTriangle, 
  Maximize2, 
  Lock 
} from "lucide-react";
import AntiOcrQuestionCanvas from "@/components/proctoring/AntiOcrQuestionCanvas";
import AntiScreenshotShield from "@/components/proctoring/AntiScreenshotShield";
import { useExamProctoring } from "@/hooks/useExamProctoring";

interface Question {
  index: number;
  id: string;
  category: string;
  question: string;
  options: { id: string; text: string }[];
  difficulty: number;
}

export default function AptitudeStudioPage() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [timerActive, setTimerActive] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  // Strict Tab & Window Switch Proctoring
  const {
    violationCount,
    maxViolations,
    isDisqualified,
    activeWarning,
    isFullscreen,
    requestFullscreen,
    dismissWarning,
  } = useExamProctoring({
    maxViolations: 3,
    onDisqualified: (reason) => {
      handleAutoSubmitDisqualified(reason);
    },
  });

  useEffect(() => {
    const fetchDaily = async () => {
      try {
        const res = await fetch("/api/aptitude/daily");
        const data = await res.json();
        if (data.success && data.questions) {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error("Failed to load daily aptitude:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDaily();
  }, []);

  const startExam = async () => {
    await requestFullscreen();
    setExamStarted(true);
    setTimerActive(true);
  };

  useEffect(() => {
    if (!timerActive || result || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, result, timeRemaining]);

  const handleSelectOption = (qId: string, optId: string) => {
    if (result || isDisqualified) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleAutoSubmitDisqualified = async (reason: string) => {
    setSubmitting(true);
    setTimerActive(false);
    try {
      const res = await fetch("/api/aptitude/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid || null,
          answers: userAnswers,
          timeSpentSeconds: 600 - timeRemaining,
          disqualified: true,
          disqualificationReason: reason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({
          ...data,
          disqualified: true,
          score: 0,
          percentage: 0,
          disqualificationReason: reason,
        });
      }
    } catch (err) {
      console.error("Disqualified submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (submitting || result) return;
    setSubmitting(true);
    setTimerActive(false);

    try {
      const res = await fetch("/api/aptitude/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid || null,
          answers: userAnswers,
          timeSpentSeconds: 600 - timeRemaining,
          violations: violationCount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  };

  const answeredCount = Object.keys(userAnswers).length;
  const currentQ = questions[currentIdx];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-[#111827]">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center animate-spin mb-4">
          <Brain className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-[#111827]">Calibrating Daily Aptitude Pool...</h2>
        <p className="text-xs text-[#6B7280] mt-1">Generating 10 cross-domain questions for today</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] p-4 sm:p-8 lg:p-10 font-sans select-none" onContextMenu={(e) => e.preventDefault()}>
      
      {/* 1. STRICT PROCTORING VIOLATION MODAL */}
      {activeWarning && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xl text-center space-y-4">
            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border ${
              isDisqualified ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-amber-50 border-amber-200 text-amber-600"
            }`}>
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isDisqualified ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-900"
              }`}>
                {isDisqualified ? "Disqualification Triggered" : "Lockdown Violation Detected"}
              </span>
              <h2 className="text-xl font-bold text-[#111827]">
                {isDisqualified ? "Exam Session Terminated" : "Tab or Window Switch Detected"}
              </h2>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                {activeWarning}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-[11px] text-[#111827] font-mono">
              Strikes: {Math.min(violationCount, maxViolations + 1)} / {maxViolations + 1} &bull; Fullscreen Required
            </div>

            {!isDisqualified ? (
              <button
                type="button"
                onClick={dismissWarning}
                className="w-full py-2.5 px-4 rounded-xl bg-[#111827] hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Return to Exam &bull; Resume Fullscreen
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="inline-block w-full py-2.5 px-4 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700 transition-colors"
              >
                Return to Dashboard
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Screenshot & DevTools Blocker Overlay */}
      <AntiScreenshotShield />

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-[#2563EB] border border-blue-200 flex items-center justify-center font-bold">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-[#111827]">Daily Aptitude Sprint</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  +50 XP
                </span>
                {examStarted && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F7F8FA] text-[#111827] border border-[#E5E7EB] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Proctor: {violationCount}/{maxViolations} Strikes
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6B7280] font-normal">
                10-Minute Quantitative, Logical, &amp; Verbal Reasoning Assessment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {examStarted && !result && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono font-bold text-amber-900">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-xl bg-[#F7F8FA] hover:bg-gray-100 border border-[#E5E7EB] text-xs font-semibold text-[#111827] transition-colors"
            >
              Exit
            </Link>
          </div>
        </div>

        {/* 2. PRE-FLIGHT LOCKDOWN PROCTORING SCREEN */}
        {!examStarted && !result ? (
          <div className="p-8 sm:p-12 rounded-2xl bg-white border border-[#E5E7EB] text-center max-w-2xl mx-auto space-y-6 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] border border-blue-200 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Proctored Environment Active
              </span>
              <h2 className="text-2xl font-bold text-[#111827] tracking-tight">
                Anti-Cheat &amp; Speed Sprint Calibration
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] max-w-md mx-auto leading-relaxed">
                This sprint enforces browser fullscreen lockdown, tab switch interception, and anti-OCR canvas protections to benchmark your real problem-solving speed.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#111827]">
                  <Maximize2 className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Fullscreen Lock</span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Exiting fullscreen triggers a strike. 3 strikes lead to automatic submission.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#111827]">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Strict 10 Minutes</span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Sprint auto-submits upon timer expiration. Questions cannot be retaken today.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#111827]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Anti-OCR Shield</span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Content rendered via canvas to protect from AI screen reader extensions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={startExam}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#111827] hover:bg-black text-white font-bold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Enter Fullscreen &amp; Start Sprint</span>
            </button>
          </div>
        ) : result ? (
          /* Results View */
          <div className="space-y-6">
            <div className="p-6 sm:p-10 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-6 text-center">
              <div className={`inline-flex p-3 rounded-2xl border ${
                result.passed ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"
              }`}>
                {result.passed ? <Award className="w-10 h-10" /> : <RotateCcw className="w-10 h-10" />}
              </div>

              <div className="space-y-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  result.disqualified 
                    ? "bg-rose-100 text-rose-800" 
                    : result.passed 
                    ? "bg-emerald-100 text-emerald-800" 
                    : "bg-amber-100 text-amber-900"
                }`}>
                  {result.disqualified ? "Disqualified" : result.passed ? "Sprint Passed" : "Needs Practice"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
                  {result.disqualified 
                    ? "Session Terminated: Prohibited Activity" 
                    : result.passed 
                    ? "Exceptional Performance!" 
                    : "Good Effort, Keep Practicing"}
                </h2>
                <p className="text-xs sm:text-sm text-[#6B7280] max-w-md mx-auto">
                  {result.disqualified 
                    ? `Exam disqualified: ${result.disqualificationReason}`
                    : `You scored ${result.score} out of ${result.totalQuestions} questions correctly (${result.percentage}%).`}
                </p>
              </div>

              {result.xpAwarded > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>+{result.xpAwarded} XP Added to Profile &amp; Streak Multiplier</span>
                </div>
              )}

              {result.streakCount > 0 && (
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Active Sprint Streak: {result.streakCount} Days</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#E5E7EB]">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl bg-[#F7F8FA] hover:bg-gray-100 border border-[#E5E7EB] text-[#111827] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  Return to Dashboard
                </Link>
                <Link
                  href="/practice"
                  className="px-5 py-2 rounded-xl bg-[#111827] text-white text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-xs"
                >
                  <span>Practice More Problems</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Answer breakdown */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#2563EB]" />
                <span>Sprint Breakdown &amp; Solutions</span>
              </h3>

              {result.breakdown?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className={"p-5 rounded-2xl border space-y-3 shadow-xs " + (item.isCorrect ? "bg-white border-[#E5E7EB]" : "bg-white border-rose-200")}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6B7280]">
                      Question {idx + 1} &bull; {item.category}
                    </span>
                    {item.isCorrect ? (
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold flex items-center gap-1 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-bold flex items-center gap-1 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-[#111827] leading-relaxed">{item.question}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {item.options?.map((opt: any) => {
                      const isCorrectOpt = opt.id === item.correctOptionId;
                      const isSelectedOpt = opt.id === item.selectedOption;
                      return (
                        <div
                          key={opt.id}
                          className={"p-3 rounded-xl border flex items-center gap-2.5 " + (
                            isCorrectOpt
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                              : isSelectedOpt
                              ? "bg-rose-50 border-rose-300 text-rose-900 line-through"
                              : "bg-[#F8F9FA] border-[#E5E7EB] text-[#6B7280]"
                          )}
                        >
                          <span className="w-5 h-5 rounded-md font-mono text-[10px] font-bold flex items-center justify-center bg-white border border-[#E5E7EB]">
                            {opt.id}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {item.explanation && (
                    <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] text-xs text-[#6B7280] space-y-1">
                      <span className="font-bold text-[#111827] flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-[#2563EB]" />
                        Explanation:
                      </span>
                      <p>{item.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress indicators */}
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#6B7280]">
                <span>Question {currentIdx + 1} of {questions.length}</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">{answeredCount} of {questions.length} Answered</span>
              </div>

              <div className="grid grid-cols-10 gap-1.5">
                {questions.map((q, idx) => {
                  const isAnswered = !!userAnswers[q.id];
                  const isCurrent = idx === currentIdx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-8 rounded-lg text-xs font-semibold font-mono transition-all flex items-center justify-center cursor-pointer ${
                        isCurrent
                          ? "bg-[#111827] text-white"
                          : isAnswered
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-[#F8F9FA] text-[#6B7280] border border-[#E5E7EB] hover:bg-gray-100"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question card */}
            {currentQ && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#F8F9FA] text-[#6B7280] border border-[#E5E7EB] uppercase">
                    {currentQ.category}
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#6B7280]">
                    Difficulty: {currentQ.difficulty}/5
                  </span>
                </div>

                {/* Secure Anti-OCR Canvas Rendering */}
                <AntiOcrQuestionCanvas
                  questionText={currentQ.question}
                  category={currentQ.category}
                  fontSize={16}
                />

                <div className="space-y-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = userAnswers[currentQ.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(currentQ.id, opt.id)}
                        className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-3.5 cursor-pointer ${
                          isSelected
                            ? "bg-[#111827] text-white border-[#111827] shadow-xs"
                            : "bg-[#F8F9FA] hover:bg-gray-100 border-[#E5E7EB] text-[#111827]"
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? "bg-white text-[#111827] border-white"
                              : "bg-white text-[#6B7280] border-[#E5E7EB]"
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-3">
                  <button
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx((prev) => prev - 1)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-[#F8F9FA] border border-[#E5E7EB] text-xs font-semibold text-[#111827] disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-3">
                    {currentIdx < questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentIdx((prev) => prev + 1)}
                        className="px-4 py-2 rounded-xl bg-[#111827] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{submitting ? "Submitting..." : "Submit Sprint"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
