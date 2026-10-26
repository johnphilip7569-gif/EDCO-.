"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface GraphStep {
  step: number;
  activeNode: string;
  queue: string[];
  visited: string[];
  caption: string;
}

const STEPS: GraphStep[] = [
  { step: 0, activeNode: "A", queue: ["A"], visited: ["A"], caption: "Enqueue Start Node 'A'. Queue = [A]. Visited = {A}." },
  { step: 1, activeNode: "A", queue: ["B", "C"], visited: ["A", "B", "C"], caption: "Dequeue 'A'. Inspect neighbors (B, C). Both unvisited -> add to Queue and mark Visited. Queue = [B, C]." },
  { step: 2, activeNode: "B", queue: ["C", "D"], visited: ["A", "B", "C", "D"], caption: "Dequeue 'B'. Inspect neighbor (D). Unvisited -> add to Queue. Queue = [C, D]." },
  { step: 3, activeNode: "C", queue: ["D", "E"], visited: ["A", "B", "C", "D", "E"], caption: "Dequeue 'C'. Inspect neighbor (E). Unvisited -> add to Queue. Queue = [D, E]." },
  { step: 4, activeNode: "D", queue: ["E"], visited: ["A", "B", "C", "D", "E"], caption: "Dequeue 'D'. No unvisited neighbors. Queue = [E]." },
  { step: 5, activeNode: "E", queue: [], visited: ["A", "B", "C", "D", "E"], caption: "Dequeue 'E'. Queue empty! All reachable vertices traversed in O(V + E) time." },
];

export default function GraphBfsDfsVisualizer() {
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

  const nodes = [
    { id: "A", x: 50, y: 15 },
    { id: "B", x: 25, y: 55 },
    { id: "C", x: 75, y: 55 },
    { id: "D", x: 15, y: 90 },
    { id: "E", x: 85, y: 90 },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
            Interactive Visualizer
          </span>
          <h4 className="text-sm font-extrabold text-black">
            Graph Breadth-First Search (BFS) &bull; Level-Order Expansion
          </h4>
        </div>

        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-black border border-neutral-200">
          Step {currentStepIdx + 1} of {STEPS.length}
        </span>
      </div>

      {/* SVG Graph Topology Display */}
      <div className="py-4 flex justify-center">
        <div className="relative w-full max-w-sm h-48 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-center p-4">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            {/* Edge Lines */}
            <line x1="50" y1="20" x2="25" y2="55" stroke="#D1D5DC" strokeWidth="1.5" />
            <line x1="50" y1="20" x2="75" y2="55" stroke="#D1D5DC" strokeWidth="1.5" />
            <line x1="25" y1="55" x2="15" y2="90" stroke="#D1D5DC" strokeWidth="1.5" />
            <line x1="75" y1="55" x2="85" y2="90" stroke="#D1D5DC" strokeWidth="1.5" />
          </svg>

          {nodes.map((node) => {
            const isActive = currentStep.activeNode === node.id;
            const isVisited = currentStep.visited.includes(node.id);

            return (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
                className={`absolute w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-black text-white border-black scale-115 ring-4 ring-neutral-300 shadow-md"
                    : isVisited
                    ? "bg-neutral-200 text-black border-black"
                    : "bg-white text-neutral-600 border-neutral-300"
                }`}
              >
                {node.id}
              </div>
            );
          })}
        </div>
      </div>

      {/* Queue and Visited Set Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block font-sans">
            FIFO Queue State
          </span>
          <div className="flex items-center gap-1.5 min-h-[24px]">
            {currentStep.queue.length === 0 ? (
              <span className="text-neutral-400 font-sans">[Empty Queue]</span>
            ) : (
              currentStep.queue.map((item, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-black text-white font-bold text-xs">
                  {item}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block font-sans">
            Visited Set ({currentStep.visited.length} Nodes)
          </span>
          <div className="flex items-center gap-1.5 min-h-[24px]">
            {currentStep.visited.map((item, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-neutral-200 text-black font-bold text-xs">
                {item}
              </span>
            ))}
          </div>
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
