"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { 
  Layers, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Flame, 
  TrendingUp, 
  BookOpen, 
  Filter, 
  ChevronRight,
  ExternalLink,
  Target
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import UserGreeting from "@/components/ui/UserGreeting";
import { DsaTier, InterviewFrequency, DsaTopic, getAllDsaTopics } from "@/lib/dsa/dsa-bank";
import StudioSticker from "@/components/studio/StudioSticker";

export const dynamic = "force-dynamic";

interface TopicWithProgress extends DsaTopic {
  status: "not_started" | "in_progress" | "completed";
  mastery_score: number;
  user_effective_level: number;
}

export default function DsaCurriculumHubPage() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<TopicWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string>("All");
  const [selectedFrequency, setSelectedFrequency] = useState<string>("All");

  // Track Gating: Career Track (18+) & Explorer Track (16-17) have access. Junior Track (13-15) is gated.
  const isJuniorTrack = user?.ageBand === "13-15";

  useEffect(() => {
    if (isJuniorTrack) {
      setLoading(false);
      return;
    }

    const fetchTopics = async () => {
      try {
        const userId = user?.uid || "";
        const res = await fetch(`/api/dsa/topics?userId=${userId}`);
        const data = await res.json();
        if (data.success && data.topics) {
          setTopics(data.topics);
        } else {
          // Fallback to static bank
          const staticTopics = getAllDsaTopics().map((t) => ({
            ...t,
            status: "not_started" as const,
            mastery_score: 0,
            user_effective_level: t.difficulty_level,
          }));
          setTopics(staticTopics);
        }
      } catch (err) {
        console.error("Failed to fetch DSA topics:", err);
        const staticTopics = getAllDsaTopics().map((t) => ({
          ...t,
          status: "not_started" as const,
          mastery_score: 0,
          user_effective_level: t.difficulty_level,
        }));
        setTopics(staticTopics);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [user, isJuniorTrack]);

  // Minor / Junior Track Gating Screen
  if (isJuniorTrack) {
    return (
      <AuthGuard>
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 bg-white font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 shadow-xl p-8 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-black flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 text-xs font-mono font-bold uppercase">
                Junior Track &bull; COPPA Protected
              </span>
              <h1 className="text-2xl font-bold text-black tracking-tight">
                Advanced DSA is on Explorer &amp; Career Tracks
              </h1>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Data Structures &amp; Algorithms technical rounds are designed for high school competitive entrance (Explorer 16+) and university placement prep (Career 18+). Junior members build foundational problem-solving in the Curiosity Quests.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="w-full py-3 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Return to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // Filter topics
  const filteredTopics = topics.filter((t) => {
    const tierMatch = selectedTier === "All" || t.tier === selectedTier;
    const freqMatch = selectedFrequency === "All" || t.interview_frequency === selectedFrequency;
    return tierMatch && freqMatch;
  });

  const completedCount = topics.filter((t) => t.status === "completed").length;
  const inProgressCount = topics.filter((t) => t.status === "in_progress").length;
  const highFreqCount = topics.filter((t) => t.interview_frequency === "High").length;

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-5rem)] bg-[#FFF8EE] text-[#1B1B2F] pb-20 font-sans selection:bg-[#FFC93C] selection:text-[#1B1B2F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8 animate-in fade-in">
          
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-[#1B1B2F] shadow-[6px_6px_0px_#1B1B2F] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <StudioSticker bgColor="#FFC93C" textColor="#1B1B2F" rotate="slight-left" size="sm">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#1B1B2F]" />
                    Core Engineering Curriculum
                  </span>
                </StudioSticker>
                <span className="text-xs font-bold text-[#1B1B2F] bg-[#FFF8EE] px-3 py-1 rounded-lg border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]">
                  Structured Problem Tracks
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1B1B2F] tracking-tight">
                Data Structures &amp; Algorithms Studio
              </h1>
              <p className="text-xs sm:text-sm text-[#1B1B2F]/75 max-w-2xl leading-relaxed font-medium">
                Master 20 essential DSA topics through deterministic step-through visualizers and server-graded prediction drills calibrated to your effective skill level.
              </p>
            </div>

            {/* Quick Metrics Capsule */}
            <div className="w-full md:w-auto grid grid-cols-3 md:flex items-center gap-2 sm:gap-4 bg-[#FFF8EE] p-4 rounded-xl border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F]">
              <div className="text-center px-2 sm:px-3 border-r-2 border-[#1B1B2F]/20">
                <span className="text-lg sm:text-2xl font-black text-[#1B1B2F] tabular-nums">
                  {completedCount}/{topics.length || 20}
                </span>
                <span className="text-xs font-bold text-[#1B1B2F]/70 block">Mastered</span>
              </div>
              <div className="text-center px-2 sm:px-3 border-r-2 border-[#1B1B2F]/20">
                <span className="text-lg sm:text-2xl font-black text-[#FF6B6B] tabular-nums">
                  {highFreqCount}
                </span>
                <span className="text-xs font-bold text-[#1B1B2F]/70 block">High freq</span>
              </div>
              <div className="text-center px-2 sm:px-3">
                <span className="text-lg sm:text-2xl font-black text-[#2EC4B6] tabular-nums">
                  {inProgressCount}
                </span>
                <span className="text-xs font-bold text-[#1B1B2F]/70 block">In flight</span>
              </div>
            </div>
          </div>

          {/* Filtering and Tier Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-b-2 border-[#1B1B2F]/10 pb-4">
            
            {/* Tier Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
              {["All", "Beginner", "Intermediate", "Advanced"].map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setSelectedTier(tier)}
                  className={`btn-squishy px-4 py-2 min-h-[40px] rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border-2 border-[#1B1B2F] ${
                    selectedTier === tier
                      ? "bg-[#1B1B2F] text-white shadow-[3px_3px_0px_#1B1B2F]"
                      : "bg-white text-[#1B1B2F] hover:bg-[#FFF8EE] shadow-[1px_1px_0px_#1B1B2F]"
                  }`}
                >
                  {tier === "All" ? "All Tiers (20)" : `${tier}`}
                </button>
              ))}
            </div>

            {/* Interview Frequency Filter */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              <span className="text-xs font-bold text-[#1B1B2F] flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5 text-[#1B1B2F]" />
                <span>Priority:</span>
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {["All", "High", "Medium", "Low"].map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setSelectedFrequency(freq)}
                    className={`btn-squishy px-3 py-1.5 min-h-[38px] rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border-2 border-[#1B1B2F] ${
                      selectedFrequency === freq
                        ? "bg-[#FFC93C] text-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]"
                        : "bg-white text-[#1B1B2F] hover:bg-[#FFF8EE]"
                    }`}
                  >
                    {freq === "All" ? "All" : `${freq} Freq`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => {
              const hasVisualizer = !!topic.visualizer_type;
              const isHighFreq = topic.interview_frequency === "High";

              return (
                <Link
                  key={topic.id}
                  href={`/dsa/${topic.slug}`}
                  className="p-6 rounded-2xl bg-white border-2 border-[#1B1B2F] shadow-[4px_4px_0px_#1B1B2F] hover:shadow-[7px_7px_0px_#1B1B2F] hover:-translate-y-0.5 transition-all flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-[#FFF8EE] text-[#1B1B2F] border-2 border-[#1B1B2F]">
                          {topic.tier}
                        </span>
                        {isHighFreq && (
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-[#FF6B6B]/20 text-[#1B1B2F] border-2 border-[#1B1B2F]">
                            High Freq
                          </span>
                        )}
                        {hasVisualizer && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-[#4D96FF]/20 text-[#1B1B2F] border border-[#1B1B2F]">
                            Visualizer
                          </span>
                        )}
                      </div>

                      {/* Status Pip */}
                      {topic.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-[#6BCB77] shrink-0" />
                      ) : topic.status === "in_progress" ? (
                        <span className="w-3 h-3 rounded-full bg-[#FFC93C] border-2 border-[#1B1B2F] animate-pulse" />
                      ) : null}
                    </div>

                    <div>
                      <h3 className="text-base font-black text-[#1B1B2F] group-hover:text-[#FF6B6B] transition-colors leading-snug">
                        {topic.name}
                      </h3>
                      <p className="text-xs text-[#1B1B2F]/75 line-clamp-2 mt-1 leading-relaxed font-medium">
                        {topic.explainer_concept}
                      </p>
                    </div>

                    {/* Prerequisite Tag */}
                    {topic.prerequisite_topic_ids && topic.prerequisite_topic_ids.length > 0 && (
                      <div className="pt-1 flex items-center gap-1.5 flex-wrap text-[10px] text-[#1B1B2F]/60 font-bold">
                        <span>Prereq:</span>
                        {topic.prerequisite_topic_ids.map((preId) => (
                          <span key={preId} className="px-2 py-0.5 rounded-md bg-[#FFF8EE] text-[#1B1B2F] border border-[#1B1B2F]">
                            {preId}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t-2 border-[#1B1B2F]/10 flex items-center justify-between text-xs font-bold text-[#1B1B2F]">
                    <span className="text-[11px] text-[#1B1B2F]/70 font-bold">
                      Mastery: {topic.mastery_score || 0}%
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#1B1B2F] group-hover:translate-x-0.5 transition-transform font-extrabold">
                      <span>Explore</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </AuthGuard>
  );
}
