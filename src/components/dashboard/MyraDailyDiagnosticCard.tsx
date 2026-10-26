"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw, BrainCircuit } from "lucide-react";
import { Interactive3DCard } from "@/components/ui/Interactive3DCard";

interface QuestionData {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const SAMPLE_QUESTION: QuestionData = {
  id: "math-01",
  topic: "Discrete Mathematics & Logic",
  question: "If a connected planar graph has 6 vertices and 9 edges, how many regions (faces) does it divide the plane into?",
  options: ["3 faces", "5 faces", "7 faces", "4 faces"],
  correctIndex: 1, // 5 faces: Euler's formula V - E + F = 2 => 6 - 9 + F = 2 => F = 5
  explanation: "By Euler's planar formula, V - E + F = 2. Substituting vertices V=6 and edges E=9 gives 6 - 9 + F = 2, so F = 5 regions.",
};

export default function MyraDailyDiagnosticCard() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [xpEarned, setXpEarned] = useState<number>(0);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === SAMPLE_QUESTION.correctIndex) {
      setXpEarned(50);
      try {
        const current = parseInt(localStorage.getItem("edw_gamer_xp") || "0", 10);
        localStorage.setItem("edw_gamer_xp", (current + 50).toString());
      } catch {}
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const isCorrect = selectedOption === SAMPLE_QUESTION.correctIndex;

  return (
    <Interactive3DCard className="w-full">
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs hover:border-black transition-all">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
              <Image
                src="/images/myra-avatar.png"
                alt="Myra"
                fill
                className="object-cover object-top"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-black">
                  Myra's Daily 1-Q Diagnostic
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-black text-[10px] font-mono font-bold border border-neutral-200">
                  +50 XP
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                {SAMPLE_QUESTION.topic} &bull; Keep your daily streak active
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs text-neutral-600 font-mono">
            <BrainCircuit className="w-4 h-4 text-black" />
            <span>AI Verified</span>
          </div>
        </div>

        {/* Question Statement */}
        <div className="py-4">
          <p className="text-sm sm:text-base font-bold text-black leading-relaxed">
            {SAMPLE_QUESTION.question}
          </p>
        </div>

        {/* MCQ Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-4">
          {SAMPLE_QUESTION.options.map((opt, idx) => {
            let optionStyles = "bg-white border-neutral-200 text-black hover:border-black";

            if (selectedOption === idx) {
              optionStyles = "bg-neutral-100 border-black text-black font-bold ring-1 ring-black";
            }

            if (isSubmitted) {
              if (idx === SAMPLE_QUESTION.correctIndex) {
                optionStyles = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500";
              } else if (selectedOption === idx) {
                optionStyles = "bg-rose-50 border-rose-400 text-rose-950 line-through ring-1 ring-rose-400";
              } else {
                optionStyles = "bg-neutral-50 border-neutral-200 text-neutral-400 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isSubmitted}
                onClick={() => setSelectedOption(idx)}
                className={`p-3.5 rounded-2xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between ${optionStyles}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-neutral-100 text-black font-mono font-bold flex items-center justify-center text-xs shrink-0 border border-neutral-200">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isSubmitted && idx === SAMPLE_QUESTION.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                {isSubmitted && selectedOption === idx && idx !== SAMPLE_QUESTION.correctIndex && (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Action Footer */}
        {isSubmitted ? (
          <div className="pt-4 border-t border-neutral-100 space-y-3 animate-in fade-in">
            <div className={`p-3.5 rounded-2xl border ${isCorrect ? "bg-emerald-50/70 border-emerald-200 text-emerald-950" : "bg-neutral-50 border-neutral-200 text-neutral-900"}`}>
              <div className="flex items-center gap-2 text-xs font-bold mb-1">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Brilliant! You mastered Euler's Formula (+50 XP)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Myra Explanation:</span>
                  </>
                )}
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {SAMPLE_QUESTION.explanation}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary text-xs py-2 px-3.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Another Practice</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("open-myra-copilot"));
                  }
                }}
                className="btn-primary text-xs py-2 px-4"
              >
                <span>Ask Myra a Follow-Up</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">
              Pick an answer to evaluate your daily concept retention
            </span>
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={handleSubmit}
              className="btn-primary text-xs py-2 px-5"
            >
              <span>Submit Answer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </Interactive3DCard>
  );
}
