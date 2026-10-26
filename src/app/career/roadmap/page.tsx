"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/auth/AuthGuard";
import { 
  Compass, 
  Target, 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Calendar, 
  ChevronRight, 
  Check, 
  Layers, 
  Zap, 
  Award,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Filter
} from "lucide-react";
import { 
  CareerRoadmapData, 
  RoadmapMilestone, 
  TARGET_ROLE_OPTIONS 
} from "@/lib/career/roadmap-generator";
import StudioSticker from "@/components/studio/StudioSticker";

export const dynamic = "force-dynamic";

export default function CareerRoadmapPage() {
  const { user, profile } = useAuth();

  const [roadmap, setRoadmap] = useState<CareerRoadmapData | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>(TARGET_ROLE_OPTIONS[0]);
  const [activeHorizon, setActiveHorizon] = useState<"1_year" | "3_year" | "5_year">("1_year");
  const [filterMode, setFilterMode] = useState<"all" | "pending" | "completed">("all");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [targetRolesList, setTargetRolesList] = useState<string[]>(TARGET_ROLE_OPTIONS);

  // Load existing roadmap on mount
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const userId = user?.uid || "guest";
        const res = await fetch(`/api/career/roadmap?userId=${userId}`);
        const data = await res.json();
        if (data.success) {
          if (data.roadmap) {
            setRoadmap(data.roadmap);
            setSelectedRole(data.roadmap.targetRole || TARGET_ROLE_OPTIONS[0]);
          }
          if (data.targetRoles) {
            setTargetRolesList(data.targetRoles);
          }
        }
      } catch (err) {
        console.error("Failed to fetch roadmap:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [user]);

  const handleGenerate = async (roleToUse?: string) => {
    const targetRole = roleToUse || selectedRole;
    setGenerating(true);

    try {
      const res = await fetch("/api/career/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid || "guest",
          targetRole,
          currentLevel: profile?.experience_level || "Foundational",
          academicYear: profile?.gradeLevel || "College 3rd Year"
        })
      });

      const data = await res.json();
      if (data.success && data.roadmap) {
        setRoadmap(data.roadmap);
      }
    } catch (err) {
      console.error("Failed to generate career roadmap:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleMilestone = async (milestoneId: string, currentStatus: boolean) => {
    if (!roadmap) return;

    // Optimistic UI update
    const updatedMilestones = roadmap.milestones.map((m) =>
      m.id === milestoneId ? { ...m, isCompleted: !currentStatus } : m
    );
    setRoadmap({ ...roadmap, milestones: updatedMilestones });

    try {
      await fetch("/api/career/roadmap", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          milestoneId,
          isCompleted: !currentStatus,
          userId: user?.uid || "guest"
        })
      });
    } catch (err) {
      console.error("Failed to patch milestone:", err);
    }
  };

  const filteredMilestones = (roadmap?.milestones || [])
    .filter((m) => m.horizon === activeHorizon)
    .filter((m) => {
      if (filterMode === "pending") return !m.isCompleted;
      if (filterMode === "completed") return m.isCompleted;
      return true;
    });

  const allMilestones = roadmap?.milestones || [];
  const completedCount = allMilestones.filter((m) => m.isCompleted).length;
  const progressPercent = allMilestones.length > 0 
    ? Math.round((completedCount / allMilestones.length) * 100) 
    : 0;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#FFF8EE] text-[#1B1B2F] font-sans pb-24 selection:bg-[#4D96FF] selection:text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-in fade-in">
          
          {/* Top Breadcrumb */}
          <div className="flex items-center justify-between">
            <Link
              href="/career"
              className="text-xs font-bold text-[#1B1B2F]/70 hover:text-[#1B1B2F] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Career OS</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-[10px] font-mono font-extrabold uppercase bg-white text-[#1B1B2F] border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]">
                Multi-Horizon Timeline
              </span>
              <span className="px-3 py-1 rounded-lg text-[10px] font-mono font-extrabold uppercase bg-[#4D96FF]/20 text-[#1B1B2F] border-2 border-[#1B1B2F]">
                AI Structured
              </span>
            </div>
          </div>

          {/* Hero Header */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-[#1B1B2F] space-y-4 shadow-[6px_6px_0px_#1B1B2F]">
            <div className="flex items-center gap-2 flex-wrap">
              <StudioSticker bgColor="#4D96FF" textColor="#FFFFFF" rotate="slight-left" size="sm">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-white" />
                  Strategic Engineering Trajectory
                </span>
              </StudioSticker>
              <span className="text-xs font-bold text-[#1B1B2F] bg-[#FFF8EE] px-3 py-1 rounded-lg border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]">
                1Y • 3Y • 5Y Multi-Horizon Blueprint
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1B1B2F] tracking-tight">
                  AI Career Roadmap
                </h1>
                <p className="text-xs sm:text-sm text-[#1B1B2F]/75 max-w-2xl mt-1 leading-relaxed font-medium">
                  Synthesize an actionable 1-year, 3-year, and 5-year technical blueprint from your academic standing and target company aspirations. Track milestones month-by-month.
                </p>
              </div>

              {/* Target Track Selector Form */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3.5 py-2.5 text-xs rounded-xl border-2 border-[#1B1B2F] bg-[#FFF8EE] text-[#1B1B2F] font-bold focus:outline-none shadow-[2px_2px_0px_#1B1B2F]"
                >
                  {targetRolesList.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  disabled={generating}
                  className="btn-squishy px-4 py-2.5 rounded-xl bg-[#4D96FF] hover:bg-[#3d85ee] text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F]"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>Generate Roadmap</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Overall Progress Status Bar */}
            {roadmap && (
              <div className="pt-4 border-t-2 border-[#1B1B2F]/10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-8 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#1B1B2F]">
                      Overall Milestone Completion
                    </span>
                    <span className="font-mono font-black text-[#4D96FF]">
                      {completedCount} of {allMilestones.length} Done ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white border-2 border-[#1B1B2F] overflow-hidden p-0.5">
                    <div 
                      className="h-full bg-[#4D96FF] transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="sm:col-span-4 flex items-center justify-end gap-2 text-xs text-[#1B1B2F]/70 font-bold">
                  <span className="font-black text-[#1B1B2F]">Target:</span>
                  <span className="truncate">{roadmap.targetRole}</span>
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-16 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-[#1B1B2F] border-t-[#4D96FF] rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-[#1B1B2F]/70">Retrieving career milestones...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !roadmap && (
            <div className="p-12 rounded-2xl border-2 border-dashed border-[#1B1B2F] text-center space-y-4 bg-white shadow-[4px_4px_0px_#1B1B2F]">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] flex items-center justify-center mx-auto text-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-[#1B1B2F]">No Roadmap Generated Yet</h3>
                <p className="text-xs text-[#1B1B2F]/70 max-w-sm mx-auto font-medium">
                  Select your target engineering specialty above and click &ldquo;Generate Roadmap&rdquo; to build your tailored 1, 3, and 5-year milestones.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="btn-squishy px-5 py-2.5 rounded-xl bg-[#4D96FF] text-white text-xs font-black transition-all border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F] cursor-pointer"
              >
                Generate First Roadmap
              </button>
            </div>
          )}

          {/* Active Roadmap View */}
          {!loading && roadmap && (
            <div className="space-y-6">
              
              {/* Strategic Horizon Switcher (1 Year vs 3 Years vs 5 Years) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b-2 border-[#1B1B2F]/10 pb-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {[
                    { id: "1_year", label: "1-Year Horizon", sub: "Foundation & Proof-of-Work" },
                    { id: "3_year", label: "3-Year Horizon", sub: "Industry Placement & Scaling" },
                    { id: "5_year", label: "5-Year Horizon", sub: "Senior & Architectural Lead" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveHorizon(tab.id as any)}
                      className={`btn-squishy px-4 py-2.5 rounded-xl text-left transition-all cursor-pointer border-2 border-[#1B1B2F] ${
                        activeHorizon === tab.id
                          ? "bg-[#4D96FF] text-white shadow-[3px_3px_0px_#1B1B2F]"
                          : "bg-white text-[#1B1B2F] hover:bg-[#FFF8EE] shadow-[1px_1px_0px_#1B1B2F]"
                      }`}
                    >
                      <div className="text-xs font-black">{tab.label}</div>
                      <div className={`text-[10px] font-bold ${activeHorizon === tab.id ? "text-white/80" : "text-[#1B1B2F]/60"}`}>
                        {tab.sub}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Filter Pills (All vs Pending vs Completed) */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto bg-white p-1.5 rounded-xl border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]">
                  {(["all", "pending", "completed"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFilterMode(mode)}
                      className={`btn-squishy px-3 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer border-2 ${
                        filterMode === mode
                          ? "bg-[#FFC93C] text-[#1B1B2F] border-[#1B1B2F] shadow-[1px_1px_0px_#1B1B2F]"
                          : "border-transparent text-[#1B1B2F]/60 hover:text-[#1B1B2F]"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strategy Abstract Card */}
              <div className="p-4 rounded-xl bg-white border-2 border-[#1B1B2F] text-xs text-[#1B1B2F] leading-relaxed shadow-[3px_3px_0px_#1B1B2F]">
                <strong className="font-black text-[#4D96FF]">Horizon Focus:</strong> <span className="font-medium text-[#1B1B2F]/80">{roadmap.summary}</span>
              </div>

              {/* Monthly Checklist Cards */}
              <div className="space-y-3.5">
                {filteredMilestones.length === 0 ? (
                  <div className="p-8 text-center text-xs font-bold text-[#1B1B2F]/60 border-2 border-dashed border-[#1B1B2F] rounded-2xl bg-white">
                    No milestones match the selected filter ({filterMode}).
                  </div>
                ) : (
                  filteredMilestones.map((m) => (
                    <div
                      key={m.id}
                      className={`p-5 rounded-2xl border-2 border-[#1B1B2F] transition-all ${
                        m.isCompleted
                          ? "bg-[#FFF8EE]/60 opacity-80 shadow-[2px_2px_0px_#1B1B2F]"
                          : "bg-white shadow-[4px_4px_0px_#1B1B2F] hover:shadow-[6px_6px_0px_#1B1B2F] hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Interactive Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleMilestone(m.id, m.isCompleted)}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center border-2 border-[#1B1B2F] transition-all shrink-0 mt-0.5 cursor-pointer shadow-[2px_2px_0px_#1B1B2F] ${
                            m.isCompleted
                              ? "bg-[#6BCB77] text-[#1B1B2F]"
                              : "bg-[#FFF8EE] hover:bg-white text-transparent"
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-extrabold bg-[#FFF8EE] text-[#1B1B2F] border-2 border-[#1B1B2F]">
                                {m.monthRangeLabel || `Month ${m.monthIndex}`}
                              </span>
                              <h3 className={`text-sm font-black ${
                                m.isCompleted ? "line-through text-[#1B1B2F]/50" : "text-[#1B1B2F]"
                              }`}>
                                {m.title}
                              </h3>
                            </div>

                            {m.recommendedResource && (
                              <Link
                                href={m.recommendedResource.href}
                                className="text-[11px] font-bold text-[#4D96FF] hover:underline flex items-center gap-1 self-start sm:self-auto"
                              >
                                <span>{m.recommendedResource.title}</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}
                          </div>

                          <p className={`text-xs leading-relaxed font-medium ${
                            m.isCompleted ? "text-[#1B1B2F]/50" : "text-[#1B1B2F]/75"
                          }`}>
                            {m.description}
                          </p>

                          {/* Skill Tags */}
                          {m.skillTags && m.skillTags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {m.skillTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FFF8EE] text-[#1B1B2F] border border-[#1B1B2F]"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </AuthGuard>
  );
}
