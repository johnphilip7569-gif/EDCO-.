"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

interface StepState {
  step: number;
  left: number;
  right: number;
  currentSum: number;
  action: string;
  found: boolean;
}

const SAMPLE_ARRAY = [1, 2, 4, 6, 8, 11, 15];
const TARGET_SUM = 14;

const STEPS: StepState[] = [
  { step: 0, left: 0, right: 6, currentSum: 16, action: "Initialize Left at index 0 (val 1) and Right at index 6 (val 15). Sum = 1 + 15 = 16.", found: false },
  { step: 1, left: 0, right: 5, currentSum: 12, action: "Current sum 16 > target 14. To reduce sum on sorted array, decrement Right pointer to index 5 (val 11).", found: false },
  { step: 2, left: 1, right: 5, currentSum: 13, action: "Current sum 12 < target 14. To increase sum, increment Left pointer to index 1 (val 2).", found: false },
  { step: 3, left: 2, right: 5, currentSum: 15, action: "Current sum 13 < target 14. Increment Left pointer to index 2 (val 4).", found: false },
  { step: 4, left: 2, right: 4, currentSum: 12, action: "Current sum 15 > target 14. Decrement Right pointer to index 4 (val 8).", found: false },
  { step: 5, left: 3, right: 4, currentSum: 14, action: "Current sum 12 < target 14. Increment Left pointer to index 3 (val 6). Sum = 6 + 8 = 14 == TARGET FOUND!", found: true },
];

export default function ArrayTwoPointerVisualizer() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentStep = STEPS[currentStepIdx];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
            Interactive Visualizer
          </span>
          <h4 className="text-sm font-extrabold text-black">
            Two-Pointer Search &bull; Target Sum = {TARGET_SUM}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-black border border-neutral-200">
            Step {currentStepIdx + 1} of {STEPS.length}
          </span>
        </div>
      </div>

      {/* Array Element Boxes */}
      <div className="py-4 overflow-x-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 min-w-[320px]">
          {SAMPLE_ARRAY.map((val, idx) => {
            const isLeft = idx === currentStep.left;
            const isRight = idx === currentStep.right;
            const isMatch = currentStep.found && (isLeft || isRight);

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                {/* Pointer Label Top */}
                <div className="h-5 flex items-center justify-center">
                  {isLeft && isRight ? (
                    <span className="px-1.5 py-0.2 rounded bg-black text-white text-[9px] font-mono font-bold">L/R</span>
                  ) : isLeft ? (
                    <span className="px-1.5 py-0.2 rounded bg-black text-white text-[9px] font-mono font-bold animate-pulse">L</span>
                  ) : isRight ? (
                    <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-white text-[9px] font-mono font-bold animate-pulse">R</span>
                  ) : null}
                </div>

                {/* Box */}
                <div
                  className={`w-11 h-12 sm:w-13 sm:h-14 rounded-xl flex items-center justify-center text-sm sm:text-base font-extrabold font-mono transition-all duration-300 border-2 ${
                    isMatch
                      ? "bg-black text-white border-black scale-105 shadow-md"
                      : isLeft || isRight
                      ? "bg-neutral-100 text-black border-black shadow-xs scale-102"
                      : "bg-white text-neutral-600 border-neutral-200"
                  }`}
                >
                  {val}
                </div>

                {/* Index Subtitle */}
                <span className="text-[10px] font-mono text-neutral-400">
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Telemetry Banner */}
      <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Left (idx {currentStep.left})</span>
            <span className="font-mono font-bold text-black text-sm">{SAMPLE_ARRAY[currentStep.left]}</span>
          </div>
          <span className="text-neutral-400 font-bold">+</span>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Right (idx {currentStep.right})</span>
            <span className="font-mono font-bold text-black text-sm">{SAMPLE_ARRAY[currentStep.right]}</span>
          </div>
          <span className="text-neutral-400 font-bold">=</span>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Current Sum</span>
            <span className={`font-mono font-bold text-sm ${currentStep.found ? "text-black underline font-black" : "text-black"}`}>
              {currentStep.currentSum}
            </span>
          </div>
        </div>

        {currentStep.found && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black text-white text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>Target 14 Found! (Indices [{currentStep.left}, {currentStep.right}])</span>
          </div>
        )}
      </div>

      {/* Step Explanation Text */}
      <p className="text-xs text-neutral-700 leading-relaxed bg-white p-3 rounded-xl border border-neutral-200 font-medium">
        <strong>Step {currentStep.step + 1}:</strong> {currentStep.action}
      </p>

      {/* Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentStepIdx === 0}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIdx((prev) => Math.max(0, prev - 1));
            }}
            className="p-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-black disabled:opacity-40 transition-colors cursor-pointer"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={currentStepIdx === STEPS.length - 1}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIdx((prev) => Math.min(STEPS.length - 1, prev + 1));
            }}
            className="p-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-black disabled:opacity-40 transition-colors cursor-pointer"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? "Pause" : "Auto-Play"}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsPlaying(false);
            setCurrentStepIdx(0);
          }}
          className="px-3 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600 hover:text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
