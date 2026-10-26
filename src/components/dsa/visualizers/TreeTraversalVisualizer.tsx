"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

type TraversalMode = "inorder" | "preorder" | "levelorder";

interface TreeStep {
  activeNode: number;
  visitedNodes: number[];
  callStack: string[];
  explanation: string;
}

const INORDER_STEPS: TreeStep[] = [
  { activeNode: 10, visitedNodes: [], callStack: ["visit(10)"], explanation: "Start at Root (10). Recurse into Left Subtree (5)." },
  { activeNode: 5, visitedNodes: [], callStack: ["visit(10)", "visit(5)"], explanation: "At Node (5). Recurse into Left Subtree (2)." },
  { activeNode: 2, visitedNodes: [2], callStack: ["visit(10)", "visit(5)", "visit(2)"], explanation: "Node (2) has no left child. Process and output 2." },
  { activeNode: 5, visitedNodes: [2, 5], callStack: ["visit(10)", "visit(5)"], explanation: "Left of 5 complete. Process and output 5. Recurse to Right (8)." },
  { activeNode: 8, visitedNodes: [2, 5, 8], callStack: ["visit(10)", "visit(8)"], explanation: "At Node (8). Process and output 8." },
  { activeNode: 10, visitedNodes: [2, 5, 8, 10], callStack: ["visit(10)"], explanation: "Entire left subtree of root done. Process and output Root (10). Recurse to Right (15)." },
  { activeNode: 15, visitedNodes: [2, 5, 8, 10, 15], callStack: ["visit(15)"], explanation: "Process and output 15." },
];

export default function TreeTraversalVisualizer() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = INORDER_STEPS;
  const currentStep = steps[currentStepIdx];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
            Interactive Visualizer
          </span>
          <h4 className="text-sm font-extrabold text-black">
            Binary Search Tree &bull; In-Order Traversal (L &rarr; Root &rarr; R)
          </h4>
        </div>

        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-black border border-neutral-200">
          Step {currentStepIdx + 1} of {steps.length}
        </span>
      </div>

      {/* Tree Node Hierarchy Representation */}
      <div className="py-6 flex flex-col items-center gap-6">
        
        {/* Root Level */}
        <div className="flex justify-center">
          <div
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${
              currentStep.activeNode === 10
                ? "bg-black text-white border-black scale-110 shadow-md ring-4 ring-neutral-200"
                : currentStep.visitedNodes.includes(10)
                ? "bg-neutral-100 text-black border-black"
                : "bg-white text-neutral-600 border-neutral-300"
            }`}
          >
            10
          </div>
        </div>

        {/* Level 1 Children */}
        <div className="flex justify-center gap-24 sm:gap-36 relative">
          {/* Connector lines hint */}
          <div
            className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${
              currentStep.activeNode === 5
                ? "bg-black text-white border-black scale-110 shadow-md ring-4 ring-neutral-200"
                : currentStep.visitedNodes.includes(5)
                ? "bg-neutral-100 text-black border-black"
                : "bg-white text-neutral-600 border-neutral-300"
            }`}
          >
            5
          </div>

          <div
            className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${
              currentStep.activeNode === 15
                ? "bg-black text-white border-black scale-110 shadow-md ring-4 ring-neutral-200"
                : currentStep.visitedNodes.includes(15)
                ? "bg-neutral-100 text-black border-black"
                : "bg-white text-neutral-600 border-neutral-300"
            }`}
          >
            15
          </div>
        </div>

        {/* Level 2 Children */}
        <div className="flex justify-center gap-12 sm:gap-20">
          <div
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${
              currentStep.activeNode === 2
                ? "bg-black text-white border-black scale-110 shadow-md ring-4 ring-neutral-200"
                : currentStep.visitedNodes.includes(2)
                ? "bg-neutral-100 text-black border-black"
                : "bg-white text-neutral-600 border-neutral-300"
            }`}
          >
            2
          </div>

          <div
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${
              currentStep.activeNode === 8
                ? "bg-black text-white border-black scale-110 shadow-md ring-4 ring-neutral-200"
                : currentStep.visitedNodes.includes(8)
                ? "bg-neutral-100 text-black border-black"
                : "bg-white text-neutral-600 border-neutral-300"
            }`}
          >
            8
          </div>
        </div>
      </div>

      {/* Traversal Output Sequence */}
      <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5 text-xs">
        <span className="text-[10px] uppercase font-bold text-neutral-400 block font-sans">
          In-Order Output (Always Monotonically Sorted)
        </span>
        <div className="flex items-center gap-2 font-mono font-bold text-sm min-h-[28px]">
          {currentStep.visitedNodes.length === 0 ? (
            <span className="text-neutral-400 font-normal">[Traversing...]</span>
          ) : (
            currentStep.visitedNodes.map((n, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-black text-white shadow-2xs">
                {n}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Step Explanation */}
      <p className="text-xs text-neutral-700 leading-relaxed bg-white p-3 rounded-xl border border-neutral-200 font-medium">
        {currentStep.explanation}
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
            disabled={currentStepIdx === steps.length - 1}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIdx((prev) => Math.min(steps.length - 1, prev + 1));
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
