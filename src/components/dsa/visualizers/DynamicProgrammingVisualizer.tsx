"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface DpStep {
  step: number;
  activeCell: number;
  lookbackCells: number[];
  table: Array<number | null>;
  formula: string;
  caption: string;
}

const STEPS: DpStep[] = [
  { step: 0, activeCell: 0, lookbackCells: [], table: [1, null, null, null, null, null], formula: "Base Case: dp[0] = 1 (1 way to stay at ground)", caption: "Initialize Base Case: dp[0] = 1." },
  { step: 1, activeCell: 1, lookbackCells: [], table: [1, 1, null, null, null, null], formula: "Base Case: dp[1] = 1 (1 way to step onto stair 1)", caption: "Initialize Base Case: dp[1] = 1." },
  { step: 2, activeCell: 2, lookbackCells: [0, 1], table: [1, 1, 2, null, null, null], formula: "dp[2] = dp[1] + dp[0] = 1 + 1 = 2", caption: "Fill dp[2]: Sum of subproblems dp[1] and dp[0] = 2 distinct ways." },
  { step: 3, activeCell: 3, lookbackCells: [1, 2], table: [1, 1, 2, 3, null, null], formula: "dp[3] = dp[2] + dp[1] = 2 + 1 = 3", caption: "Fill dp[3]: Sum of subproblems dp[2] and dp[1] = 3 distinct ways." },
  { step: 4, activeCell: 4, lookbackCells: [2, 3], table: [1, 1, 2, 3, 5, null], formula: "dp[4] = dp[3] + dp[2] = 3 + 2 = 5", caption: "Fill dp[4]: Sum of subproblems dp[3] and dp[2] = 5 distinct ways." },
  { step: 5, activeCell: 5, lookbackCells: [3, 4], table: [1, 1, 2, 3, 5, 8], formula: "dp[5] = dp[4] + dp[3] = 5 + 3 = 8", caption: "Fill dp[5]: Sum of subproblems dp[4] and dp[3] = 8 distinct ways. Global solution computed in O(N) time!" },
];

export default function DynamicProgrammingVisualizer() {
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
    }, 2000);
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
            Dynamic Programming &bull; 1D Tabulation Table &bull; dp[i] = dp[i-1] + dp[i-2]
          </h4>
        </div>

        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-black border border-neutral-200">
          Step {currentStepIdx + 1} of {STEPS.length}
        </span>
      </div>

      {/* DP Table Array Grid */}
      <div className="py-6 overflow-x-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 min-w-[320px]">
          {currentStep.table.map((val, idx) => {
            const isActive = currentStep.activeCell === idx;
            const isLookback = currentStep.lookbackCells.includes(idx);

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                {/* Pointer Label Top */}
                <div className="h-5 flex items-center justify-center">
                  {isActive ? (
                    <span className="px-1.5 py-0.2 rounded bg-black text-white text-[9px] font-mono font-bold animate-pulse">
                      target
                    </span>
                  ) : isLookback ? (
                    <span className="px-1.5 py-0.2 rounded bg-neutral-600 text-white text-[9px] font-mono font-bold">
                      subproblem
                    </span>
                  ) : null}
                </div>

                {/* Table Cell */}
                <div
                  className={`w-12 h-13 sm:w-14 sm:h-15 rounded-xl border-2 flex items-center justify-center font-mono font-extrabold text-sm sm:text-base transition-all duration-300 ${
                    isActive
                      ? "bg-black text-white border-black scale-105 shadow-md"
                      : isLookback
                      ? "bg-neutral-100 text-black border-black ring-2 ring-neutral-200"
                      : val !== null
                      ? "bg-neutral-50 text-neutral-800 border-neutral-200"
                      : "bg-white text-neutral-300 border-dashed border-neutral-200"
                  }`}
                >
                  {val !== null ? val : "—"}
                </div>

                {/* Index Bottom */}
                <span className="text-[10px] font-mono text-neutral-400">
                  dp[{idx}]
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recurrence Formula Callout */}
      <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-400 block font-sans">
            Active Recurrence Evaluation
          </span>
          <span className="font-bold text-black text-sm">{currentStep.formula}</span>
        </div>
      </div>

      {/* Step Explanation */}
      <p className="text-xs text-neutral-700 leading-relaxed bg-white p-3 rounded-xl border border-neutral-200 font-medium">
        <strong>Step {currentStep.step + 1}:</strong> {currentStep.caption}
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
