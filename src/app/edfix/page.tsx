"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import AuthGuard from "@/components/auth/AuthGuard";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Send, 
  FolderGit2, 
  Lock,
  Layers,
  Search,
  Check,
  Tag,
  Building2,
  ExternalLink,
  Flame,
  Award,
  Zap,
  X
} from "lucide-react";
import StudioSticker from "@/components/studio/StudioSticker";

export const dynamic = "force-dynamic";

interface EdFixProblem {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: number;
  min_age_band: string;
  interest_tags: string[];
  companies?: string[];
  source: string;
  is_active: boolean;
  created_at: string;
  last_reviewed_at?: string;
  points?: number;
}

export default function EdFixPage() {
  const { user, profile, isMinor } = useAuth();
  const [problems, setProblems] = useState<EdFixProblem[]>([]);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Solution Submission Modal State
  const [selectedProblem, setSelectedProblem] = useState<EdFixProblem | null>(null);
  const [solutionTitle, setSolutionTitle] = useState("");
  const [solutionDescription, setSolutionDescription] = useState("");
  const [linkedProjectId, setLinkedProjectId] = useState<string>("");
  const [visibility, setVisibility] = useState<"private" | "classroom" | "public">("public");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadBoardData() {
      try {
        const ageBand = user?.ageBand || "18+";
        const res = await fetch(`/api/problems?category=${categoryFilter}&ageBand=${ageBand}&userId=${user?.uid || ""}`);
        const data = await res.json();
        
        if (data?.problems) {
          const formatted: EdFixProblem[] = data.problems.map((p: any) => ({
            ...p,
            last_reviewed_at: p.last_reviewed_at || "September 24, 2026",
            points: p.points || (p.difficulty_level >= 3 ? 150 : p.difficulty_level >= 2 ? 100 : 50)
          }));
          setProblems(formatted);
        }

        // Load user's active solutions
        if (user) {
          const sRes = await fetch(`/api/problems/solutions?userId=${user.uid}&callerId=${user.uid}`);
          const sData = await sRes.json();
          if (sData?.solutions) setSolutions(sData.solutions);

          // Load user's Project Studio projects if not minor
          if (!isMinor) {
            const { data: pData } = await supabase
              .from("projects")
              .select("id, title")
              .eq("user_id", user.uid);
            if (pData) setProjects(pData);
          }
        }
      } catch (err) {
        console.warn("EdFix data load note:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBoardData();
  }, [user, categoryFilter, isMinor]);

  const handleSubmitSolution = async (status: "in_progress" | "submitted") => {
    if (!user || !selectedProblem || !solutionTitle.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/problems/solutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: selectedProblem.id,
          userId: user.uid,
          title: solutionTitle.trim(),
          description: solutionDescription.trim(),
          linkedProjectId: isMinor ? null : linkedProjectId || null,
          status,
          visibility
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit solution.");

      setSuccessMessage(json.message || "Solution submitted successfully! Points credited.");
      setSelectedProblem(null);
      setSolutionTitle("");
      setSolutionDescription("");
      setLinkedProjectId("");

      // Refresh solutions
      const sRes = await fetch(`/api/problems/solutions?userId=${user.uid}&callerId=${user.uid}`);
      const sData = await sRes.json();
      if (sData?.solutions) setSolutions(sData.solutions);
    } catch (err: any) {
      alert(err.message || "Failed to submit solution.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch = !searchQuery.trim() || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.interest_tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [problems, searchQuery]);

  const CATEGORIES = [
    { id: "all", label: "All Problems" },
    { id: "ai", label: "AI & PyTorch (TorchLeet)" },
    { id: "engineering", label: "GPU & Distributed Systems" },
    { id: "technical", label: "Backend & Cloud Architecture" },
    { id: "community", label: "Product & EdTech Workflows" },
    { id: "environment", label: "Energy & Infrastructure" },
  ];

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-4rem)] bg-[#FFF8EE] text-[#1B1B2F] py-8 px-4 sm:px-6 lg:px-8 xl:px-10 font-sans selection:bg-[#8E6CEF] selection:text-white">
        <div className="max-w-[1536px] mx-auto space-y-8 animate-in fade-in">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#1B1B2F] shadow-[6px_6px_0px_#1B1B2F]">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <StudioSticker bgColor="#8E6CEF" textColor="#FFFFFF" rotate="slight-left" size="sm">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    EdFix Engineering Labs
                  </span>
                </StudioSticker>
                <span className="text-xs font-bold text-[#1B1B2F] bg-[#FFF8EE] px-3 py-1 rounded-lg border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]">
                  Curated Engineering Scenarios
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#1B1B2F]">
                Practice &amp; Engineering Problems
              </h1>
              <p className="text-xs sm:text-sm text-[#1B1B2F]/75 max-w-2xl leading-relaxed font-medium">
                Master algorithmic data structures, systems architecture, and engineering interview challenges with integrated Myra AI guidance.
              </p>
            </div>

            {successMessage && (
              <div className="px-4 py-3 rounded-xl bg-[#6BCB77]/20 text-[#1B1B2F] border-2 border-[#1B1B2F] text-xs font-bold flex items-center gap-2 shadow-[3px_3px_0px_#1B1B2F] self-start md:self-auto">
                <CheckCircle2 className="w-4 h-4 text-[#1B1B2F] shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto touch-scroll-x pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`btn-squishy px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-2 border-[#1B1B2F] ${
                    categoryFilter === cat.id
                      ? "bg-[#8E6CEF] text-white shadow-[3px_3px_0px_#1B1B2F]"
                      : "bg-white text-[#1B1B2F] hover:bg-[#FFF8EE] shadow-[2px_2px_0px_#1B1B2F]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px] sm:w-80">
              <Search className="w-4 h-4 text-[#1B1B2F]/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search problems, skills, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border-2 border-[#1B1B2F] text-xs font-medium text-[#1B1B2F] placeholder:text-[#1B1B2F]/40 focus:outline-none shadow-[3px_3px_0px_#1B1B2F]"
              />
            </div>
          </div>

          {/* User's Submitted Solutions Strip */}
          {solutions.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border-2 border-[#1B1B2F] shadow-[5px_5px_0px_#1B1B2F] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#8E6CEF]" />
                  <h3 className="text-xs font-extrabold text-[#1B1B2F] uppercase tracking-wider">
                    My Active Problem Solutions ({solutions.length})
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-[#1B1B2F]/60">Portfolio Verified</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {solutions.map((sol) => (
                  <div key={sol.id} className="p-4 rounded-xl bg-[#FFF8EE] border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F] flex items-center justify-between">
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <p className="text-xs font-bold text-[#1B1B2F] truncate">{sol.title}</p>
                      <p className="text-[10px] font-medium text-[#1B1B2F]/70">{sol.status === "submitted" ? "Submitted for Review" : "In Progress"}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-white text-[#1B1B2F] border-2 border-[#1B1B2F] shrink-0 shadow-[1px_1px_0px_#1B1B2F]">
                      {sol.status === "submitted" ? "Active" : "Draft"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Problems Grid */}
          {loading ? (
            <div className="py-16 text-center text-xs font-bold text-[#1B1B2F]/60">
              Loading curated EdFix problems...
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center space-y-3 border-2 border-[#1B1B2F] shadow-[6px_6px_0px_#1B1B2F] max-w-md mx-auto">
              <Sparkles className="w-8 h-8 text-[#8E6CEF] mx-auto" />
              <p className="text-sm font-extrabold text-[#1B1B2F]">No problems found matching this filter.</p>
              <p className="text-xs text-[#1B1B2F]/70">Try selecting a different category or clearing your search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProblems.map((prob) => {
                const diffLabel = prob.difficulty_level >= 3 ? "Advanced" : prob.difficulty_level === 2 ? "Intermediate" : "Foundational";
                const diffColor = prob.difficulty_level >= 3 
                  ? "bg-[#FF6B6B]/20 text-[#1B1B2F]" 
                  : prob.difficulty_level === 2 
                    ? "bg-[#FFC93C]/30 text-[#1B1B2F]" 
                    : "bg-[#6BCB77]/20 text-[#1B1B2F]";

                return (
                  <div
                    key={prob.id}
                    className="bg-white rounded-2xl p-6 border-2 border-[#1B1B2F] shadow-[5px_5px_0px_#1B1B2F] hover:shadow-[7px_7px_0px_#1B1B2F] hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border-2 border-[#1B1B2F] ${diffColor}`}>
                          {diffLabel}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold text-[#1B1B2F] bg-[#8E6CEF]/20 border-2 border-[#1B1B2F] px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Zap className="w-3 h-3 text-[#8E6CEF]" />
                            +{prob.points || 100} pts
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5">
                        <h3 className="text-base font-black text-[#1B1B2F] group-hover:text-[#8E6CEF] transition-colors leading-snug line-clamp-2">
                          {prob.title}
                        </h3>
                        <p className="text-xs text-[#1B1B2F]/75 line-clamp-3 leading-relaxed font-medium">
                          {prob.description}
                        </p>
                      </div>

                      {/* Company & Source */}
                      {prob.companies && prob.companies.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <Building2 className="w-3.5 h-3.5 text-[#1B1B2F]/60" />
                          <span className="text-[10px] font-bold text-[#1B1B2F]/60">Citing:</span>
                          {prob.companies.slice(0, 3).map((comp) => (
                            <span key={comp} className="px-2 py-0.5 rounded-md bg-[#FFF8EE] border border-[#1B1B2F] text-[10px] font-bold text-[#1B1B2F]">
                              {comp}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      {prob.interest_tags && prob.interest_tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {prob.interest_tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="text-[10px] font-bold text-[#1B1B2F]/70 bg-[#FFF8EE] px-2 py-0.5 rounded-md border border-[#1B1B2F]/30">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer: Hint & Solve Action */}
                    <div className="pt-3 border-t-2 border-[#1B1B2F]/10 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            window.dispatchEvent(new CustomEvent("open-myra-copilot"));
                          }
                        }}
                        className="text-xs font-bold text-[#1B1B2F] hover:text-[#8E6CEF] flex items-center gap-1 transition-colors cursor-pointer"
                        title="Ask Myra for guidance"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#8E6CEF]" />
                        <span>Ask Myra Hint</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedProblem(prob)}
                        className="btn-squishy text-xs font-bold py-2 px-4 cursor-pointer flex items-center gap-1.5 bg-[#8E6CEF] text-white border-2 border-[#1B1B2F] rounded-xl shadow-[3px_3px_0px_#1B1B2F]"
                      >
                        <span>Solve Problem</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Solution Submission Modal */}
          {selectedProblem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1B2F]/60 backdrop-blur-xs animate-in fade-in">
              <div className="max-w-lg w-full bg-white rounded-2xl p-6 sm:p-7 shadow-[10px_10px_0px_#1B1B2F] border-2 border-[#1B1B2F] space-y-5 text-[#1B1B2F]">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b-2 border-[#1B1B2F]/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8E6CEF]" />
                    <h3 className="text-base font-extrabold text-[#1B1B2F]">
                      Submit Problem Solution
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedProblem(null)}
                    className="p-1 rounded-lg text-[#1B1B2F]/60 hover:text-[#1B1B2F] hover:bg-[#FFF8EE] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Problem Context Pill */}
                <div className="p-3.5 rounded-xl bg-[#FFF8EE] border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F] space-y-1">
                  <span className="text-[10px] uppercase text-[#1B1B2F]/60 font-bold">Target Challenge</span>
                  <p className="text-xs font-black text-[#1B1B2F]">{selectedProblem.title}</p>
                </div>

                {/* Submission Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitSolution("submitted");
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="block font-bold text-[#1B1B2F] uppercase tracking-wider mb-1.5">
                      Solution / Architecture Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={solutionTitle}
                      onChange={(e) => setSolutionTitle(e.target.value)}
                      placeholder="e.g. Distributed Lock Manager with Redis Redlock & Failover"
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1B1B2F] text-xs font-medium text-[#1B1B2F] bg-[#FFF8EE] focus:outline-none shadow-[2px_2px_0px_#1B1B2F]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1B1B2F] uppercase tracking-wider mb-1.5">
                      Technical Explanation &amp; Approach *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={solutionDescription}
                      onChange={(e) => setSolutionDescription(e.target.value)}
                      placeholder="Explain your approach, design decisions, trade-offs, and how you validated the solution..."
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1B1B2F] text-xs font-medium text-[#1B1B2F] bg-[#FFF8EE] focus:outline-none shadow-[2px_2px_0px_#1B1B2F]"
                    />
                  </div>

                  {!isMinor && projects.length > 0 && (
                    <div>
                      <label className="block font-bold text-[#1B1B2F] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-[#8E6CEF]" />
                        <span>Link Project Studio Repository (Optional)</span>
                      </label>
                      <select
                        value={linkedProjectId}
                        onChange={(e) => setLinkedProjectId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1B1B2F] text-xs font-bold text-[#1B1B2F] bg-white focus:outline-none shadow-[2px_2px_0px_#1B1B2F]"
                      >
                        <option value="">-- Select a project from Studio --</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t-2 border-[#1B1B2F]/10">
                    <button
                      type="button"
                      onClick={() => setSelectedProblem(null)}
                      className="btn-squishy text-xs font-bold py-2 px-4 rounded-xl border-2 border-[#1B1B2F] bg-white text-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSubmitSolution("in_progress")}
                        disabled={submitting}
                        className="btn-squishy text-xs font-bold py-2 px-4 rounded-xl border-2 border-[#1B1B2F] bg-[#FFF8EE] text-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F] disabled:opacity-50 cursor-pointer"
                      >
                        Save Draft
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-squishy text-xs font-bold py-2 px-5 rounded-xl border-2 border-[#1B1B2F] bg-[#8E6CEF] text-white shadow-[3px_3px_0px_#1B1B2F] disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submitting ? "Submitting..." : "Submit Solution"}</span>
                      </button>
                    </div>
                  </div>
                </form>

              </div>
            </div>
          )}

        </div>
      </div>
    </AuthGuard>
  );
}
