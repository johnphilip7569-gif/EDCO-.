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
      <div className="min-h-screen bg-[#F8F9FA] text-[#111827] font-sans pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 animate-in fade-in duration-200">
          
          {/* 1. HEADER */}
          <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Project Studio &bull; Capstone Track
                </span>
                <span className="text-xs text-[#6B7280] font-medium">Real-World Engineering Challenges</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
                Industry Problem Statements
              </h1>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                Filter and inspect real-world production engineering briefs. Build verifiable proof-of-work capstones tailored to high-tier software engineering, AI, and distributed systems roles.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenMyra()}
                className="bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Recommend with Myra</span>
              </button>
            </div>
          </section>

          {/* 2. TOP SEARCH & FILTER BAR */}
          <section className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs space-y-4">
            
            {/* Primary Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search problem statements by keyword, technology, or scenario (e.g. Redis, RAG, Kafka, Rate Limiter)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] text-[#111827] placeholder:text-[#9CA3AF] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111827] p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Domain Pills & Sponsored Filter Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F3F4F6]">
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
                {ALL_DOMAINS.map((domain) => {
                  const isActive = selectedDomain === domain;
                  return (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => setSelectedDomain(domain)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#111827] text-white border-[#111827] shadow-xs"
                          : "bg-white text-[#4B5563] hover:bg-[#F3F4F6] border-[#E5E7EB]"
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
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all inline-flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  sponsorOnly
                    ? "bg-amber-50 text-amber-800 border-amber-200 shadow-xs"
                    : "bg-white text-[#4B5563] hover:bg-[#F3F4F6] border-[#E5E7EB]"
                }`}
              >
                <Award className={`w-3.5 h-3.5 ${sponsorOnly ? "text-amber-600" : "text-[#9CA3AF]"}`} />
                <span>Sponsored Challenges Only</span>
                {sponsorOnly && <Check className="w-3.5 h-3.5 text-amber-600" />}
              </button>
            </div>

            {/* Filter Dropdowns and Buttons Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              
              {/* Domain Filter */}
              <div>
                <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
                  Domain / Category
                </label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] focus:outline-none focus:border-[#2563EB] cursor-pointer"
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
                <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
                  Difficulty Level
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] focus:outline-none focus:border-[#2563EB] cursor-pointer"
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
                <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1">
                  Specific Technology
                </label>
                <select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-xl text-[#111827] focus:outline-none focus:border-[#2563EB] cursor-pointer"
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
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-xl border transition-colors inline-flex items-center justify-center gap-1.5 ${
                    hasActiveFilters
                      ? "bg-white text-[#111827] hover:bg-gray-50 border-[#E5E7EB] cursor-pointer shadow-xs"
                      : "bg-[#F9FAFB] text-[#9CA3AF] border-[#E5E7EB] cursor-not-allowed"
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            </div>

            {/* Results Count and Active Filter Pills */}
            <div className="pt-3 border-t border-[#F3F4F6] flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="text-[#6B7280]">
                Showing <strong className="text-[#111827] font-semibold">{filteredProblems.length}</strong> of{" "}
                {PROBLEM_STATEMENTS_DATA.length} problem statements
              </div>

              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedDomain !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] text-[#374151] text-xs font-medium">
                      Domain: {selectedDomain}
                      <button onClick={() => setSelectedDomain("All")} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedDifficulty !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] text-[#374151] text-xs font-medium">
                      Level: {selectedDifficulty}
                      <button onClick={() => setSelectedDifficulty("All")} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedTech !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] text-[#374151] text-xs font-medium">
                      Tech: {selectedTech}
                      <button onClick={() => setSelectedTech("All")} className="hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {sponsorOnly && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
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
                    Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
                    Advanced: "bg-blue-50 text-blue-700 border-blue-200",
                    "Industry Grade": "bg-indigo-50 text-indigo-700 border-indigo-200",
                  }[problem.difficulty] || "bg-gray-50 text-gray-700 border-gray-200";

                  return (
                    <div
                      key={problem.id}
                      className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs hover:border-gray-300 transition-colors flex flex-col justify-between space-y-4"
                    >
                      {/* Card Header Tags */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#F9FAFB] border border-[#E5E7EB] text-[#4B5563]">
                              {problem.domain}
                            </span>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${difficultyBadge}`}>
                              {problem.difficulty}
                            </span>
                          </div>

                          <span className="text-xs text-[#6B7280] flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {problem.timeEstimate}
                          </span>
                        </div>

                        {/* Company Sponsor Callout */}
                        {problem.companySponsor && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-[#111827]">
                            <Award className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="font-bold text-[#111827]">{problem.companySponsor.name}</span>
                            <span className="text-gray-300">&bull;</span>
                            <span className="text-[#4B5563] truncate">{problem.companySponsor.hiringTrack}</span>
                          </div>
                        )}

                        {/* Title */}
                        <h2 className="text-base sm:text-lg font-bold text-[#111827] leading-snug tracking-tight">
                          {problem.title}
                        </h2>

                        {/* Summary */}
                        <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3">
                          {problem.summary}
                        </p>
                      </div>

                      {/* Functional Snippets */}
                      <div className="pt-3 border-t border-[#F3F4F6] space-y-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] block">
                          Key Deliverable Highlights:
                        </span>
                        <ul className="space-y-1">
                          {problem.functionalRequirements.slice(0, 2).map((req, rIdx) => (
                            <li key={rIdx} className="text-xs text-[#4B5563] flex items-start gap-1.5 line-clamp-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
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
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F9FAFB] border border-[#E5E7EB] text-[#4B5563]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-[#F3F4F6] flex flex-wrap items-center justify-between gap-2">
                        <Link
                          href={`/edbuild?problemId=${problem.id}&create=true`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#111827] text-xs font-semibold transition-colors shadow-xs"
                        >
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          <span>Build in EdBuild</span>
                        </Link>

                        <button
                          onClick={() => handleOpenProblem(problem)}
                          className="bg-[#111827] hover:bg-black text-white text-xs font-semibold py-2 px-4 rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
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
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center space-y-4 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 flex items-center justify-center mx-auto">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#111827]">
                  No problem statements matched your search
                </h3>
                <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
                  We could not find any problem statements matching "{searchQuery}" with the selected domain and difficulty filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}
          </section>

          {/* 4. FOOTER GUIDANCE BANNER */}
          <section className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs text-xs text-[#111827] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[#4B5563]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All problem statements are calibrated to real-world production engineering architectures.</span>
            </div>
            <Link
              href="/dashboard"
              className="text-[#111827] font-semibold hover:underline inline-flex items-center gap-1 shrink-0"
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
