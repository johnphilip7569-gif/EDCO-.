"use client";

import React from "react";
import ArrayTwoPointerVisualizer from "./ArrayTwoPointerVisualizer";
import LinkedListVisualizer from "./LinkedListVisualizer";
import TreeTraversalVisualizer from "./TreeTraversalVisualizer";
import SortSteppingVisualizer from "./SortSteppingVisualizer";
import GraphBfsDfsVisualizer from "./GraphBfsDfsVisualizer";
import DynamicProgrammingVisualizer from "./DynamicProgrammingVisualizer";
import { VisualizerType } from "@/lib/dsa/dsa-bank";
import { Info } from "lucide-react";

interface DsaVisualizerHostProps {
  visualizerType: VisualizerType;
  topicName: string;
}

export default function DsaVisualizerHost({ visualizerType, topicName }: DsaVisualizerHostProps) {
  if (visualizerType === "two_pointer") {
    return <div className="w-full max-w-full overflow-x-auto no-scrollbar"><ArrayTwoPointerVisualizer /></div>;
  }
  if (visualizerType === "linked_list") {
    return <div className="w-full max-w-full overflow-x-auto no-scrollbar"><LinkedListVisualizer /></div>;
  }
  if (visualizerType === "tree_traversal") {
    return <div className="w-full max-w-full overflow-x-auto no-scrollbar"><TreeTraversalVisualizer /></div>;
  }
  if (visualizerType === "sorting") {
    return <div className="w-full max-w-full overflow-x-auto no-scrollbar"><SortSteppingVisualizer /></div>;
  }
  if (visualizerType === "graph_bfs_dfs") {
    return <div className="w-full max-w-full overflow-x-auto no-scrollbar"><GraphBfsDfsVisualizer /></div>;
  }
  if (visualizerType === "dp_table") {
    return <div className="w-full max-w-full overflow-x-auto no-scrollbar"><DynamicProgrammingVisualizer /></div>;
  }

  // Fallback for topics that currently use static architectural diagrams
  return (
    <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 text-center space-y-2">
      <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 text-black flex items-center justify-center mx-auto shadow-2xs">
        <Info className="w-5 h-5" />
      </div>
      <h4 className="text-xs font-bold text-black uppercase tracking-wider">
        Conceptual Diagram Reference
      </h4>
      <p className="text-xs text-neutral-500 max-w-md mx-auto">
        {topicName} uses static structural representations and worked step-by-step examples below. Review the problem walk-through and practice drills to master this topic.
      </p>
    </div>
  );
}
