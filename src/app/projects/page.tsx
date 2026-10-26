"use client";

export const dynamic = "force-dynamic";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  X, 
  Sparkles, 
  Clock, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  RotateCcw,
  Code2,
  ExternalLink,
  ChevronRight,
  Users,
  Award,
  Building2
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/lib/auth-context";
import { 
  PROBLEM_STATEMENTS_DATA, 
  ProblemStatement, 
  ProblemDomain, 
  ProblemDifficulty 
} from "@/lib/projects/problem-statements-data";
import ProblemStatementDetailModal from "@/components/project/ProblemStatementDetailModal";
import { StudioSticker } from "@/components/studio/StudioSticker";

const ALL_DOMAINS: ("All" | ProblemDomain)[] = [
  "All",
  "Distributed Systems",
  "AI & Machine Learning",
  "Full-Stack Web",
  "DevOps & Cloud",
  "FinTech & Data",
];

const ALL_DIFFICULTIES: ("All" | ProblemDifficulty)[] = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Industry Grade",
];

export default function ProjectStudioPage() {
  const { user, profile } = useAuth();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<"All" | ProblemDomain>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"All" | ProblemDifficulty>("All");
  const [selectedTech, setSelectedTech] = useState<string>("All");
  const [sponsorOnly, setSponsorOnly] = useState<boolean>(false);

  // Modal inspection state
  const [activeProblem, setActiveProblem] = useState<ProblemStatement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract all unique tech stack tools across problems
  const availableTechStacks = useMemo(() => {
    const set = new Set<string>();
    PROBLEM_STATEMENTS_DATA.forEach((p) => p.techStack.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set).sort()];
  }, []);

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return PROBLEM_STATEMENTS_DATA.filter((problem) => {
      // 1. Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = problem.title.toLowerCase().includes(query);
        const matchesSummary = problem.summary.toLowerCase().includes(query);
        const matchesStatement = problem.problemStatement.toLowerCase().includes(query);
        const matchesTech = problem.techStack.some((t) => t.toLowerCase().includes(query));
        const matchesIndustry = problem.industryRelevance.toLowerCase().includes(query);
        const matchesSponsor = problem.companySponsor?.name.toLowerCase().includes(query) || problem.companySponsor?.hiringTrack.toLowerCase().includes(query);

        if (!matchesTitle && !matchesSummary && !matchesStatement && !matchesTech && !matchesIndustry && !matchesSponsor) {
          return false;
        }
      }

      // 2. Domain filter
      if (selectedDomain !== "All" && problem.domain !== selectedDomain) {
        return false;
      }

      // 3. Difficulty filter
      if (selectedDifficulty !== "All" && problem.difficulty !== selectedDifficulty) {
        return false;
      }

      // 4. Tech stack filter
      if (selectedTech !== "All" && !problem.techStack.includes(selectedTech)) {
        return false;
      }

      // 5. Sponsored filter
      if (sponsorOnly && !problem.companySponsor) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedDomain, selectedDifficulty, selectedTech, sponsorOnly]);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedDomain !== "All" || selectedDifficulty !== "All" || selectedTech !== "All" || sponsorOnly;

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDomain("All");
    setSelectedDifficulty("All");
    setSelectedTech("All");
    setSponsorOnly(false);
  };

  const handleOpenProblem = (problem: ProblemStatement) => {
    setActiveProblem(problem);
    setIsModalOpen(true);
  };

  const handleOpenMyra = (customPrompt?: string) => {
    if (typeof window !== "undefined") {
      const prompt = customPrompt || "Can you recommend the highest-yield real-world engineering problem statement for my current academic level and target career role?";
      window.dispatchEvent(new CustomEvent("open-myra-copilot", { detail: { prompt } }));
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#FFF8EE] text-[#1B1B2F] font-sans selection:bg-[#FFC93C] selection:text-[#1B1B2F] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
          
          {/* 1. STUDIO HEADER */}
          <section className="bg-white rounded-2xl border-2 border-[#1B1B2F] p-6 sm:p-8 shadow-[6px_6px_0px_#1B1B2F] flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2.5">
                <StudioSticker text="Project Studio • Capstone Track" color="#8E6CEF" rotate={-1} />
                <span className="text-xs text-[#1B1B2F]/60 font-mono font-bold">Real-World Engineering Challenges</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B2F] tracking-tight">
                Industry Problem Statements
              </h1>
              <p className="text-xs sm:text-sm text-[#1B1B2F]/70 leading-relaxed font-medium">
                Filter and inspect real-world production engineering briefs. Build verifiable proof-of-work capstones tailored to high-tier software engineering, AI, and distributed systems roles.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenMyra()}
                className="bg-[#2EC4B6] hover:bg-[#2EC4B6]/90 text-white text-xs font-extrabold py-3 px-5 rounded-xl border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F] transition-all hover:translate-x-[1px] hover:translate-y-[1px] inline-flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FFC93C]" />
                <span>Recommend with Myra</span>
              </button>
            </div>
          </section>

          {/* 2. TOP SEARCH & FILTER BAR */}
          <section className="bg-white rounded-2xl border-2 border-[#1B1B2F] p-5 sm:p-6 shadow-[6px_6px_0px_#1B1B2F] space-y-4">
            
            {/* Primary Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#1B1B2F]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search problem statements by keyword, technology, or scenario (e.g. Redis, RAG, Kafka, Rate Limiter, Matching Engine)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-3 text-xs sm:text-sm bg-[#FFF8EE] border-2 border-[#1B1B2F] rounded-xl focus:outline-none text-[#1B1B2F] placeholder:text-[#1B1B2F]/50 font-medium shadow-[2px_2px_0px_#1B1B2F] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1B1B2F]/60 hover:text-[#1B1B2F] p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Domain Pills & Sponsored Filter Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t-2 border-[#1B1B2F]/10">
              <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-1">
                {ALL_DOMAINS.map((domain) => {
                  const isActive = selectedDomain === domain;
                  return (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => setSelectedDomain(domain)}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border-2 border-[#1B1B2F] transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#1B1B2F] text-white shadow-[2px_2px_0px_#FFC93C]"
                          : "bg-[#FFF8EE] text-[#1B1B2F] hover:bg-white shadow-[2px_2px_0px_#1B1B2F] hover:translate-x-[1px] hover:translate-y-[1px]"
                      }`}
                    >
                      {domain}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setSponsorOnly(!sponsorOnly)}
                className={`text-xs font-extrabold px-3.5 py-1.5 rounded-xl border-2 border-[#1B1B2F] transition-all inline-flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  sponsorOnly
                    ? "bg-[#FFC93C] text-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F]"
                    : "bg-[#FFF8EE] text-[#1B1B2F] hover:bg-white shadow-[2px_2px_0px_#1B1B2F] hover:translate-x-[1px] hover:translate-y-[1px]"
                }`}
              >
                <Award className={`w-3.5 h-3.5 ${sponsorOnly ? "text-[#1B1B2F]" : "text-[#1B1B2F]/60"}`} />
                <span>Sponsored Challenges Only</span>
                {sponsorOnly && <Check className="w-3.5 h-3.5 text-[#1B1B2F]" />}
              </button>
            </div>

            {/* Filter Dropdowns and Buttons Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              
              {/* Domain Filter */}
              <div>
                <label className="text-[11px] font-mono font-bold text-[#1B1B2F]/60 uppercase tracking-wider block mb-1">
                  Domain / Category
                </label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-[#FFF8EE] border-2 border-[#1B1B2F] rounded-xl text-[#1B1B2F] font-bold shadow-[2px_2px_0px_#1B1B2F] focus:outline-none cursor-pointer"
                >
                  {ALL_DOMAINS.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain === "All" ? "All Domains" : domain}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="text-[11px] font-mono font-bold text-[#1B1B2F]/60 uppercase tracking-wider block mb-1">
                  Difficulty Level
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-[#FFF8EE] border-2 border-[#1B1B2F] rounded-xl text-[#1B1B2F] font-bold shadow-[2px_2px_0px_#1B1B2F] focus:outline-none cursor-pointer"
                >
                  {ALL_DIFFICULTIES.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff === "All" ? "All Difficulties" : diff}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tech Stack Filter */}
              <div>
                <label className="text-[11px] font-mono font-bold text-[#1B1B2F]/60 uppercase tracking-wider block mb-1">
                  Specific Technology
                </label>
                <select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FFF8EE] border-2 border-[#1B1B2F] rounded-xl text-[#1B1B2F] font-bold shadow-[2px_2px_0px_#1B1B2F] focus:outline-none cursor-pointer"
                >
                  {availableTechStacks.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech === "All" ? "All Technologies" : tech}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Action */}
              <div className="flex items-end">
                <button
                  disabled={!hasActiveFilters}
                  onClick={handleResetFilters}
                  className={`w-full py-2 px-3 text-xs font-extrabold rounded-xl border-2 border-[#1B1B2F] transition-all inline-flex items-center justify-center gap-1.5 ${
                    hasActiveFilters
                      ? "bg-[#FFF8EE] text-[#1B1B2F] hover:bg-white shadow-[2px_2px_0px_#1B1B2F] hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer"
                      : "bg-neutral-100 text-[#1B1B2F]/40 border-[#1B1B2F]/30 cursor-not-allowed"
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            </div>

            {/* Results Count and Active Filter Pills */}
            <div className="pt-3 border-t-2 border-[#1B1B2F]/10 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="text-[#1B1B2F]/70 font-medium">
                Showing <strong className="text-[#1B1B2F] font-bold">{filteredProblems.length}</strong> of{" "}
                {PROBLEM_STATEMENTS_DATA.length} problem statements
              </div>

              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedDomain !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFF8EE] border-2 border-[#1B1B2F] text-[#1B1B2F] text-xs font-bold shadow-[2px_2px_0px_#1B1B2F]">
                      Domain: {selectedDomain}
                      <button onClick={() => setSelectedDomain("All")} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedDifficulty !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFF8EE] border-2 border-[#1B1B2F] text-[#1B1B2F] text-xs font-bold shadow-[2px_2px_0px_#1B1B2F]">
                      Level: {selectedDifficulty}
                      <button onClick={() => setSelectedDifficulty("All")} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedTech !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFF8EE] border-2 border-[#1B1B2F] text-[#1B1B2F] text-xs font-bold shadow-[2px_2px_0px_#1B1B2F]">
                      Tech: {selectedTech}
                      <button onClick={() => setSelectedTech("All")} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {sponsorOnly && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFC93C] border-2 border-[#1B1B2F] text-[#1B1B2F] text-xs font-extrabold shadow-[2px_2px_0px_#1B1B2F]">
                      Sponsored Only
                      <button onClick={() => setSponsorOnly(false)} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* 3. PROBLEM STATEMENTS GRID */}
          <section className="space-y-4">
            {filteredProblems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                {filteredProblems.map((problem) => {
                  const difficultyBadge = {
                    Beginner: "bg-[#6BCB77]/20 text-[#1B1B2F] border-2 border-[#1B1B2F]",
                    Intermediate: "bg-[#FFC93C]/20 text-[#1B1B2F] border-2 border-[#1B1B2F]",
                    Advanced: "bg-[#4D96FF]/20 text-[#1B1B2F] border-2 border-[#1B1B2F]",
                    "Industry Grade": "bg-[#8E6CEF]/20 text-[#1B1B2F] border-2 border-[#1B1B2F]",
                  }[problem.difficulty] || "bg-[#FFF8EE] text-[#1B1B2F] border-2 border-[#1B1B2F]";

                  return (
                    <div
                      key={problem.id}
                      className="bg-white rounded-2xl border-2 border-[#1B1B2F] p-6 shadow-[5px_5px_0px_#1B1B2F] hover:shadow-[7px_7px_0px_#1B1B2F] hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-4"
                    >
                      {/* Card Header Tags */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FFF8EE] border-2 border-[#1B1B2F] text-[#1B1B2F]">
                              {problem.domain}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${difficultyBadge}`}>
                              {problem.difficulty}
                            </span>
                          </div>

                          <span className="text-[11px] text-[#1B1B2F]/60 flex items-center gap-1 font-mono font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            {problem.timeEstimate}
                          </span>
                        </div>

                        {/* Company Sponsor Callout */}
                        {problem.companySponsor && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFC93C]/20 border-2 border-[#1B1B2F] text-xs text-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]">
                            <Award className="w-4 h-4 text-[#1B1B2F] shrink-0" />
                            <span className="font-extrabold text-[#1B1B2F]">{problem.companySponsor.name}</span>
                            <span className="text-[#1B1B2F]/40">&bull;</span>
                            <span className="font-semibold truncate">{problem.companySponsor.hiringTrack}</span>
                          </div>
                        )}

                        {/* Title */}
                        <h2 className="text-base sm:text-lg font-extrabold text-[#1B1B2F] leading-snug tracking-tight">
                          {problem.title}
                        </h2>

                        {/* Summary */}
                        <p className="text-xs text-[#1B1B2F]/70 leading-relaxed font-medium line-clamp-3">
                          {problem.summary}
                        </p>
                      </div>

                      {/* Functional Snippets */}
                      <div className="pt-3 border-t-2 border-[#1B1B2F]/10 space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1B1B2F]/60 block">
                          Key Deliverable Highlights:
                        </span>
                        <ul className="space-y-1">
                          {problem.functionalRequirements.slice(0, 2).map((req, rIdx) => (
                            <li key={rIdx} className="text-xs text-[#1B1B2F]/80 font-medium flex items-start gap-1.5 line-clamp-1">
                              <Check className="w-3.5 h-3.5 text-[#2EC4B6] shrink-0 mt-0.5" />
                              <span className="truncate">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {problem.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FFF8EE] border-2 border-[#1B1B2F] text-[#1B1B2F]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t-2 border-[#1B1B2F]/10 flex flex-wrap items-center justify-between gap-2">
                        <Link
                          href={`/edbuild?problemId=${problem.id}&create=true`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-[#1B1B2F] bg-[#FFF8EE] hover:bg-white text-[#1B1B2F] text-xs font-extrabold transition-all shadow-[2px_2px_0px_#1B1B2F] hover:translate-x-[1px] hover:translate-y-[1px]"
                        >
                          <Users className="w-3.5 h-3.5 text-[#2EC4B6]" />
                          <span>Build in EdBuild</span>
                        </Link>

                        <button
                          onClick={() => handleOpenProblem(problem)}
                          className="bg-[#1B1B2F] hover:bg-[#1B1B2F]/90 text-white text-xs font-extrabold py-2 px-4 rounded-xl transition-all border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#FFC93C] hover:translate-x-[1px] hover:translate-y-[1px] inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>View Problem</span>
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty Search State */
              <div className="bg-white rounded-2xl border-2 border-[#1B1B2F] p-10 text-center space-y-4 shadow-[6px_6px_0px_#1B1B2F]">
                <div className="w-14 h-14 rounded-2xl bg-[#FFC93C] border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F] text-[#1B1B2F] flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-[#1B1B2F]">
                  No problem statements matched your search
                </h3>
                <p className="text-xs text-[#1B1B2F]/70 max-w-md mx-auto leading-relaxed font-medium">
                  We could not find any problem statements matching "{searchQuery}" with the selected domain and difficulty filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1B1B2F] text-white text-xs font-extrabold border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#FFC93C] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}
          </section>

          {/* 4. FOOTER GUIDANCE BANNER */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-[#1B1B2F] shadow-[4px_4px_0px_#1B1B2F] text-xs text-[#1B1B2F] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#2EC4B6] shrink-0" />
              <span>All problem statements are calibrated to real-world production engineering architectures.</span>
            </div>
            <Link
              href="/dashboard"
              className="text-[#1B1B2F] font-extrabold hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Back to Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </section>

        </div>

        {/* 5. INTERACTIVE PROBLEM STATEMENT DETAIL MODAL */}
        <ProblemStatementDetailModal
          problem={activeProblem}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onOpenMyraWithPrompt={(prompt) => handleOpenMyra(prompt)}
        />
      </div>
    </AuthGuard>
  );
}
