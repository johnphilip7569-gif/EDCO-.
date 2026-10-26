"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface SortStep {
  step: number;
  array: number[];
  comparingIndices: [number, number];
  swapped: boolean;
  sortedIndices: number[];
  caption: string;
}

const STEPS: SortStep[] = [
  {
    step: 0,
    array: [5, 2, 8, 1, 4],
    comparingIndices: [0, 1],
    swapped: false,
    sortedIndices: [],
    caption: "Compare index 0 (val 5) and index 1 (val 2). Since 5 > 2, swap them.",
  },
  {
    step: 1,
    array: [2, 5, 8, 1, 4],
    comparingIndices: [1, 2],
    swapped: true,
    sortedIndices: [],
    caption: "Swapped! Array is now [2, 5, 8, 1, 4]. Compare index 1 (val 5) and index 2 (val 8). 5 < 8, no swap.",
  },
  {
    step: 2,
    array: [2, 5, 8, 1, 4],
    comparingIndices: [2, 3],
    swapped: false,
    sortedIndices: [],
    caption: "Compare index 2 (val 8) and index 3 (val 1). Since 8 > 1, swap them.",
  },
  {
    step: 3,
    array: [2, 5, 1, 8, 4],
    comparingIndices: [3, 4],
    swapped: true,
    sortedIndices: [],
    caption: "Swapped! Array is now [2, 5, 1, 8, 4]. Compare index 3 (val 8) and index 4 (val 4). 8 > 4, swap them.",
  },
  {
    step: 4,
    array: [2, 5, 1, 4, 8],
    comparingIndices: [3, 4],
    swapped: true,
    sortedIndices: [4],
    caption: "First pass complete! Largest element (8) has bubbled to the end and is permanently sorted at index 4.",
  },
  {
    step: 5,
    array: [2, 1, 4, 5, 8],
    comparingIndices: [1, 2],
    swapped: true,
    sortedIndices: [3, 4],
    caption: "Pass 2 completes: 5 locks into index 3. Array is now [2, 1, 4, 5, 8].",
  },
  {
    step: 6,
    array: [1, 2, 4, 5, 8],
    comparingIndices: [0, 1],
    swapped: true,
    sortedIndices: [0, 1, 2, 3, 4],
    caption: "Final pass complete! Array is fully sorted: [1, 2, 4, 5, 8].",
  },
];

export default function SortSteppingVisualizer() {
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
            Sorting Step-Through &bull; Comparison &amp; Swap Invariants
          </h4>
        </div>

        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-black border border-neutral-200">
          Step {currentStepIdx + 1} of {STEPS.length}
        </span>
      </div>

      {/* Bar Heights Visualizer */}
      <div className="py-6 flex items-end justify-center gap-3 sm:gap-4 h-48 border-b border-neutral-100">
        {currentStep.array.map((val, idx) => {
          const isComparing = currentStep.comparingIndices.includes(idx);
          const isSorted = currentStep.sortedIndices.includes(idx);
          const heightPx = Math.max(36, val * 18);

          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className="text-xs font-mono font-bold text-neutral-600">{val}</span>
              <div
                style={{ height: `${heightPx}px` }}
                className={`w-10 sm:w-12 rounded-xl transition-all duration-300 flex items-center justify-center font-mono font-black text-xs ${
                  isSorted
                    ? "bg-black text-white shadow-xs"
                    : isComparing
                    ? "bg-neutral-800 text-white ring-4 ring-neutral-200 scale-105"
                    : "bg-neutral-100 text-black border border-neutral-300"
                }`}
              >
                {val}
              </div>
              <span className="text-[10px] font-mono text-neutral-400">[{idx}]</span>
            </div>
          );
        })}
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
