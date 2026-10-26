"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, X, CheckCircle2, ArrowRight } from "lucide-react";

export default function FloatingMyraSignupBuddy() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans print:hidden">
      {/* Expanded Helper Dialog */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-3xl p-5 shadow-xl border border-neutral-200 text-black animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7 rounded-full overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                <Image
                  src="/images/myra-avatar.png"
                  alt="Myra"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <span className="text-xs font-black text-black">
                Myra AI Study Buddy 🐻
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-black p-1 transition-colors"
              title="Close guidance"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3.5 space-y-2.5">
            <p className="text-xs text-neutral-600 leading-relaxed font-medium">
              Welcome to EdWorld Co.! Signing up gives you free 24/7 access to your personal study companion:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Instant step-by-step doubt solving in simple words</span>
              </div>
              <div className="flex items-start gap-2 text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <span>Personalized weekly study timetables for your exams</span>
              </div>
              <div className="flex items-start gap-2 text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <span>1-question diagnostic quizzes with immediate feedback</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>Let's Create My Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Mascot Companion Pill */}
      <div className="flex items-center gap-2.5">
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full shadow-md border border-neutral-200 text-xs font-bold text-black cursor-pointer hover:border-black transition-all"
          >
            <span className="text-sm">🐻</span>
            <span>Need study help? I'm Myra!</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 p-0.5 shadow-xl shadow-blue-500/25 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 group"
          aria-label="Study buddy help"
          title="Myra Study Buddy"
        >
          <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
            <Image
              src="/images/myra-avatar.png"
              alt="Myra Mascot"
              fill
              className="object-cover object-top group-hover:scale-110 transition-transform"
            />
          </div>
          {/* Live Pulsing Online Dot */}
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </span>
        </button>
      </div>
    </div>
  );
}
