"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from "lucide-react";

interface LLStep {
  step: number;
  prevVal: string;
  currVal: string;
  nextVal: string;
  connections: Array<{ from: number; to: number | null; dir: "right" | "left" | "none" }>;
  caption: string;
}

const NODES = [1, 2, 3, 4];

const STEPS: LLStep[] = [
  {
    step: 0,
    prevVal: "NULL",
    currVal: "1",
    nextVal: "NULL",
    connections: [{ from: 0, to: 1, dir: "right" }, { from: 1, to: 2, dir: "right" }, { from: 2, to: 3, dir: "right" }, { from: 3, to: null, dir: "right" }],
    caption: "Initial State: prev = NULL, curr = Node(1). Original pointers: 1 -> 2 -> 3 -> 4 -> NULL.",
  },
  {
    step: 1,
    prevVal: "NULL",
    currVal: "1",
    nextVal: "2",
    connections: [{ from: 0, to: null, dir: "none" }, { from: 1, to: 2, dir: "right" }, { from: 2, to: 3, dir: "right" }, { from: 3, to: null, dir: "right" }],
    caption: "Step 1: next = curr.next (Save Node 2 in next so we don't lose the rest of the list). curr.next = prev (Node 1 now points to NULL).",
  },
  {
    step: 2,
    prevVal: "1",
    currVal: "2",
    nextVal: "2",
    connections: [{ from: 0, to: null, dir: "none" }, { from: 1, to: 2, dir: "right" }, { from: 2, to: 3, dir: "right" }, { from: 3, to: null, dir: "right" }],
    caption: "Step 2: Advance pointers: prev = curr (Node 1), curr = next (Node 2).",
  },
  {
    step: 3,
    prevVal: "1",
    currVal: "2",
    nextVal: "3",
    connections: [{ from: 1, to: 0, dir: "left" }, { from: 2, to: 3, dir: "right" }, { from: 3, to: null, dir: "right" }],
    caption: "Step 3: next = curr.next (Save Node 3). curr.next = prev (Node 2 now points back to Node 1: 1 <- 2).",
  },
  {
    step: 4,
    prevVal: "2",
    currVal: "3",
    nextVal: "4",
    connections: [{ from: 1, to: 0, dir: "left" }, { from: 2, to: 1, dir: "left" }, { from: 3, to: null, dir: "right" }],
    caption: "Step 4: Advance: prev = Node 2, curr = Node 3. curr.next = prev (Node 3 now points back to Node 2: 2 <- 3).",
  },
  {
    step: 5,
    prevVal: "3",
    currVal: "4",
    nextVal: "NULL",
    connections: [{ from: 1, to: 0, dir: "left" }, { from: 2, to: 1, dir: "left" }, { from: 3, to: 2, dir: "left" }],
    caption: "Step 5: curr = Node 4. curr.next = prev (Node 4 points to Node 3). curr advances to NULL. Loop terminates!",
  },
  {
    step: 6,
    prevVal: "4",
    currVal: "NULL",
    nextVal: "NULL",
    connections: [{ from: 3, to: 2, dir: "left" }, { from: 2, to: 1, dir: "left" }, { from: 1, to: 0, dir: "left" }],
    caption: "Reversal Complete! prev (Node 4) is the new head of the reversed list: 4 -> 3 -> 2 -> 1 -> NULL.",
  },
];

export default function LinkedListVisualizer() {
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
            In-Place Linked List Reversal &bull; 3 Pointers
          </h4>
        </div>

        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-black border border-neutral-200">
          Step {currentStepIdx + 1} of {STEPS.length}
        </span>
      </div>

      {/* Nodes and Links Display */}
      <div className="py-6 overflow-x-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 min-w-[380px]">
          {NODES.map((val, idx) => {
            const isCurr = currentStep.currVal === String(val);
            const isPrev = currentStep.prevVal === String(val);

            return (
              <React.Fragment key={val}>
                <div className="flex flex-col items-center gap-1.5">
                  {/* Pointer Pip Top */}
                  <div className="h-5 flex items-center justify-center">
                    {isCurr && isPrev ? (
                      <span className="px-1.5 py-0.2 rounded bg-black text-white text-[9px] font-mono font-bold">curr/prev</span>
                    ) : isCurr ? (
                      <span className="px-1.5 py-0.2 rounded bg-black text-white text-[9px] font-mono font-bold animate-pulse">curr</span>
                    ) : isPrev ? (
                      <span className="px-1.5 py-0.2 rounded bg-neutral-600 text-white text-[9px] font-mono font-bold">prev</span>
                    ) : null}
                  </div>

                  {/* Node Capsule */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-extrabold font-mono border-2 transition-all duration-300 ${
                      isCurr
                        ? "bg-black text-white border-black scale-105 shadow-md"
                        : isPrev
                        ? "bg-neutral-100 text-black border-black shadow-xs"
                        : "bg-white text-neutral-800 border-neutral-300"
                    }`}
                  >
                    Node({val})
                  </div>
                </div>

                {/* Arrow Connector */}
                {idx < NODES.length - 1 && (
                  <div className="pt-5 flex items-center justify-center text-neutral-400">
                    {currentStepIdx >= 3 && idx === 0 ? (
                      <ArrowLeft className="w-4 h-4 text-black animate-pulse" />
                    ) : currentStepIdx >= 4 && idx === 1 ? (
                      <ArrowLeft className="w-4 h-4 text-black animate-pulse" />
                    ) : currentStepIdx >= 5 && idx === 2 ? (
                      <ArrowLeft className="w-4 h-4 text-black animate-pulse" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Pointers State Capsule */}
      <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block font-sans">prev pointer</span>
            <span className="font-bold text-black">{currentStep.prevVal}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block font-sans">curr pointer</span>
            <span className="font-bold text-black">{currentStep.currVal}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block font-sans">next pointer</span>
            <span className="font-bold text-black">{currentStep.nextVal}</span>
          </div>
        </div>
      </div>

      {/* Step Explanation */}
      <p className="text-xs text-neutral-700 leading-relaxed bg-white p-3 rounded-xl border border-neutral-200 font-medium">
        {currentStep.caption}
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
