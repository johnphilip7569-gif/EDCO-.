"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Code2, 
  Target,
  ArrowRight,
  BookOpen,
  Users,
  Award
} from "lucide-react";
import { ProblemStatement } from "@/lib/projects/problem-statements-data";

interface ProblemStatementDetailModalProps {
  problem: ProblemStatement | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenMyraWithPrompt?: (prompt: string) => void;
}

export default function ProblemStatementDetailModal({
  problem,
  isOpen,
  onClose,
  onOpenMyraWithPrompt,
}: ProblemStatementDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !problem) return null;

  const handleCopy = () => {
    const textToCopy = `PROBLEM: ${problem.title}\nDOMAIN: ${problem.domain} (${problem.difficulty})\nESTIMATED TIME: ${problem.timeEstimate}\n\nSCENARIO & STATEMENT:\n${problem.problemStatement}\n\nFUNCTIONAL REQUIREMENTS:\n${problem.functionalRequirements.map((r, i) => `${i + 1}. ${r}`).join("\n")}\n\nNON-FUNCTIONAL CONSTRAINTS:\n${problem.nonFunctionalConstraints.map((c) => `- ${c}`).join("\n")}\n\nTECH STACK: ${problem.techStack.join(", ")}`;
    
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleAskMyra = () => {
    const prompt = `I am working on the real-world problem statement: "${problem.title}" (${problem.domain}, ${problem.difficulty}). Can you help me break down the optimal architecture pattern, key edge cases to handle, and provide a phase-by-phase implementation guide?`;
    if (onOpenMyraWithPrompt) {
      onOpenMyraWithPrompt(prompt);
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-myra-copilot", { detail: { prompt } })
      );
    }
    onClose();
  };

  // Difficulty badge colors
  const difficultyColors = {
    Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
    Advanced: "bg-blue-50 text-blue-700 border-blue-200",
    "Industry Grade": "bg-indigo-50 text-indigo-700 border-indigo-200",
  }[problem.difficulty] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-[#111827] font-sans"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#E5E7EB] flex items-start justify-between gap-4 bg-white shrink-0">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#F7F8FA] border border-[#E5E7EB] text-[#6B7280]">
                {problem.domain}
              </span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${difficultyColors}`}>
                {problem.difficulty}
              </span>
              <span className="text-xs text-[#6B7280] flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {problem.timeEstimate}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
              {problem.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#111827] p-1.5 rounded-lg hover:bg-[#F7F8FA] transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm leading-relaxed">
          {/* Company Sponsor Banner */}
          {problem.companySponsor && (
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#111827]">{problem.companySponsor.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-[#2563EB]">
                      {problem.companySponsor.tier}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7280]">
                    Hiring Track: <strong className="text-[#111827]">{problem.companySponsor.hiringTrack}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Industry Relevance Alert */}
          <div className="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            <div className="text-xs text-[#6B7280]">
              <strong className="text-[#111827] font-semibold">Industry Relevance: </strong>
              {problem.industryRelevance}
            </div>
          </div>

          {/* Problem Statement Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              The Problem Statement & Scenario
            </h3>
            <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-[#111827] whitespace-pre-line leading-relaxed text-xs sm:text-sm">
              {problem.problemStatement}
            </div>
          </div>

          {/* Functional Requirements */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Core Functional Requirements
            </h3>
            <ul className="space-y-2">
              {problem.functionalRequirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#374151]">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Non-Functional Constraints */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Engineering Constraints & SLA Targets
            </h3>
            <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] space-y-1.5">
              {problem.nonFunctionalConstraints.map((constraint, index) => (
                <div key={index} className="flex items-start gap-2 text-xs text-[#4B5563]">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{constraint}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Tech Stack */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Recommended Tech Stack & Tools
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {problem.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#F7F8FA] border border-[#E5E7EB] text-[#111827]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Implementation Roadmap */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Suggested Implementation Steps
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {problem.suggestedRoadmap.map((step, index) => (
                <div key={index} className="p-3 rounded-lg border border-[#E5E7EB] bg-[#F7F8FA] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                    {step.phase}
                  </span>
                  <p className="text-xs text-[#6B7280] leading-snug">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-[#E5E7EB] bg-[#F7F8FA] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#111827] bg-white hover:bg-gray-50 border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Copy Problem Statement</span>
              </>
            )}
          </button>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <Link
              href={`/edbuild?problemId=${problem.id}&create=true`}
              onClick={onClose}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#111827] bg-white hover:bg-gray-50 border border-[#E5E7EB] rounded-lg transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Create Squad in EdBuild</span>
            </Link>

            <button
              onClick={handleAskMyra}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Ask Myra</span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-[#6B7280] hover:text-[#111827] hover:bg-gray-200/60 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
