"use client";

import React, { useState } from "react";
import { DsaQuestion } from "@/lib/dsa/dsa-bank";
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Brain,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import AntiOcrQuestionCanvas from "@/components/proctoring/AntiOcrQuestionCanvas";
import AntiOcrCodeCanvas from "@/components/proctoring/AntiOcrCodeCanvas";
import AntiScreenshotShield from "@/components/proctoring/AntiScreenshotShield";
import { useExamProctoring } from "@/hooks/useExamProctoring";

interface DsaPracticeQuizProps {
  questions: Array<Omit<DsaQuestion, "correct_answer" | "explanation"> & { correct_answer?: string; explanation?: string }>;
  topicId: string;
  topicName: string;
  userId?: string;
  onAnswerSubmitted?: (result: { isCorrect: boolean; pointsAwarded: number }) => void;
}

export default function DsaPracticeQuiz({
  questions,
  topicId,
  topicName,
  userId,
  onAnswerSubmitted,
}: DsaPracticeQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimitWarning, setRateLimitWarning] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
    pointsAwarded?: number;
  } | null>(null);
  const [completedCount, setCompletedCount] = useState(0);

  // Active Proctoring & Anti-Tab-Switch Guard
  const {
    violationCount,
    maxViolations,
    activeWarning,
    dismissWarning,
  } = useExamProctoring({
    enabled: Boolean(questions && questions.length > 0),
    maxViolations: 3,
  });

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white border border-neutral-200 text-center space-y-3 font-sans">
        <Brain className="w-8 h-8 text-neutral-400 mx-auto" />
        <h4 className="text-sm font-bold text-black">Questions Calibrating</h4>
        <p className="text-xs text-neutral-500">Practice questions for this tier are compiling.</p>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  const handleSubmitAnswer = async () => {
    if (!selectedOption || isSubmitting || submissionResult?.submitted) return;
    setIsSubmitting(true);
    setRateLimitWarning(null);

    try {
      const res = await fetch("/api/dsa/submit-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId,
          questionId: currentQ.id,
          selectedAnswer: selectedOption,
          userId: userId || null,
        }),
      });

      const data = await res.json();
      if (res.status === 429) {
        setRateLimitWarning(data.error || "Please wait a moment before submitting another answer.");
        return;
      }

      if (data.success) {
        setSubmissionResult({
          submitted: true,
          isCorrect: data.isCorrect,
          correctAnswer: data.correctAnswer,
          explanation: data.explanation,
          pointsAwarded: data.pointsAwarded || 0,
        });

        if (data.isCorrect) {
          setCompletedCount((prev) => prev + 1);
        }

        if (onAnswerSubmitted) {
          onAnswerSubmitted({ isCorrect: data.isCorrect, pointsAwarded: data.pointsAwarded || 0 });
        }
      }
    } catch (err) {
      console.error("Failed to submit DSA answer:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setSubmissionResult(null);
    setRateLimitWarning(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setCurrentIdx(0); // Loop back or complete
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "trace_output":
        return "Trace / Predict Output";
      case "complexity":
        return "Time & Space Complexity";
      case "conceptual_ordering":
        return "Conceptual & Architecture";
      default:
        return "Practice Question";
    }
  };

  const watermarkFingerprint = `EDWORLD-DSA • ${userId ? userId.slice(0, 8) : "VERIFIED"} • ${topicId.toUpperCase()}`;

  return (
    <AntiScreenshotShield watermarkLabel={watermarkFingerprint}>
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6 font-sans select-none">
        
        {/* Active Proctoring Warning Banner */}
        {activeWarning && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-red-900">Proctoring Security Alert ({violationCount}/{maxViolations})</p>
                <p className="text-[11px] text-red-700 leading-relaxed">{activeWarning}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissWarning}
              className="px-2.5 py-1 rounded-lg bg-red-900 text-white text-[10px] font-bold shrink-0 cursor-pointer"
            >
              Acknowledge
            </button>
          </div>
        )}

        {/* Rate Limit Warning */}
        {rateLimitWarning && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900">
            {rateLimitWarning}
          </div>
        )}

        {/* Header Capsule */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-black text-white">
                {getQuestionTypeLabel(currentQ.question_type)}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-neutral-100 text-black border border-neutral-200">
                Level {currentQ.difficulty_level === 2 ? "Advanced" : currentQ.difficulty_level === 1 ? "Intermediate" : "Foundations"}
              </span>
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              Question {currentIdx + 1} of {questions.length} &bull; Graded Server-Side
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-700">
            <ShieldCheck className="w-4 h-4 text-black" />
            <span>Anti-Camera OCR &amp; Non-Execution Judge</span>
          </div>
        </div>

        {/* Protected Question Prompt & Protected Code Trace (Zero DOM Text) */}
        <div className="space-y-4">
          <AntiOcrQuestionCanvas
            text={currentQ.question_text}
            category={`${topicName} • ${getQuestionTypeLabel(currentQ.question_type)}`}
            antiOcrStrength="high"
            watermarkText={watermarkFingerprint}
          />

          {/* Protected Code Snippet Canvas (Display only, never executed, zero DOM text) */}
          {currentQ.code_snippet && (
            <AntiOcrCodeCanvas
              code={currentQ.code_snippet}
              language={`${topicName} — Static Trace`}
              watermarkText={watermarkFingerprint}
            />
          )}
        </div>

        {/* Options Selection Grid */}
        <div className="space-y-2.5 pt-1">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isCorrect = submissionResult?.submitted && opt.id === submissionResult.correctAnswer;
            const isWrongSelected = submissionResult?.submitted && isSelected && !submissionResult.isCorrect;

            return (
              <button
                key={opt.id}
                type="button"
                disabled={submissionResult?.submitted}
                onClick={() => setSelectedOption(opt.id)}
                onCopy={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-3 cursor-pointer select-none ${
                  isCorrect
                    ? "bg-neutral-100 border-black text-black font-bold ring-2 ring-black"
                    : isWrongSelected
                    ? "bg-red-50 border-red-300 text-red-900 line-through"
                    : isSelected
                    ? "bg-black text-white border-black shadow-xs"
                    : "bg-white hover:bg-neutral-50 border-neutral-200 text-black"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 border ${
                    isSelected && !submissionResult?.submitted
                      ? "bg-white text-black border-white"
                      : isCorrect
                      ? "bg-black text-white border-black"
                      : "bg-neutral-100 text-neutral-600 border-neutral-200"
                  }`}
                >
                  {opt.id}
                </span>
                <span className="flex-1 select-none">{opt.text}</span>
                {isSelected && !submissionResult?.submitted && <Check className="w-4 h-4 text-white" />}
                {isCorrect && <CheckCircle2 className="w-4 h-4 text-black" />}
                {isWrongSelected && <XCircle className="w-4 h-4 text-red-600" />}
              </button>
            );
          })}
        </div>

        {/* Detailed Post-Submission Feedback */}
        {submissionResult?.submitted && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border space-y-2 animate-in fade-in ${
              submissionResult.isCorrect
                ? "bg-neutral-50 border-black text-black"
                : "bg-neutral-50 border-neutral-300 text-black"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {submissionResult.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-black" />
                ) : (
                  <XCircle className="w-5 h-5 text-neutral-600" />
                )}
                <span className="font-bold text-sm">
                  {submissionResult.isCorrect ? "Correct Solution!" : "Incorrect Answer"}
                </span>
              </div>

              {submissionResult.isCorrect && submissionResult.pointsAwarded! > 0 && (
                <span className="px-2.5 py-0.5 rounded-md bg-black text-white text-[11px] font-mono font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+{submissionResult.pointsAwarded} XP</span>
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed pt-1">
              {submissionResult.explanation}
            </p>
          </div>
        )}

        {/* Action Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-neutral-200">
          <span className="text-xs font-mono text-neutral-500">
            Accuracy: {completedCount} / {currentIdx + (submissionResult?.submitted ? 1 : 0)} solved
          </span>

          {!submissionResult?.submitted ? (
            <button
              type="button"
              disabled={!selectedOption || isSubmitting}
              onClick={handleSubmitAnswer}
              className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all disabled:opacity-40 shadow-xs cursor-pointer"
            >
              {isSubmitting ? "Evaluating..." : "Check Answer"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>{currentIdx < questions.length - 1 ? "Next Question" : "Practice Again"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          )}
        </div>

      </div>
    </AntiScreenshotShield>
  );
}
