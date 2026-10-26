"use client";

import React, { useState, useMemo } from "react";
import {
  MOCK_OPPORTUNITIES,
  EDWORLD_CORE_FEATURES,
  OpportunityItem,
  EdworldFeatureItem,
} from "@/lib/mobile-design-tokens";
import { OpportunityCard } from "../ui/OpportunityCard";
import { EdworldFeatureCard } from "../ui/EdworldFeatureCard";
import { MobileChip } from "../ui/MobileChip";
import {
  Search,
  SlidersHorizontal,
  Bell,
  Sparkles,
  Flame,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface HomeScreenProps {
  onProfileClick: () => void;
  onNotificationsClick?: () => void;
  onFeatureLaunch: (feature: EdworldFeatureItem) => void;
  onOpportunityClick: (opp: OpportunityItem) => void;
  userName?: string;
  avatarUrl?: string;
  streakDays?: number;
  showTourTooltips?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onProfileClick,
  onNotificationsClick,
  onFeatureLaunch,
  onOpportunityClick,
  userName = "Rahul",
  avatarUrl = "/images/myra-avatar.png",
  streakDays = 12,
  showTourTooltips: defaultShowTooltips = true,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [bannerIndex, setBannerIndex] = useState(0);
  const [tourStep, setTourStep] = useState<number | null>(defaultShowTooltips ? 1 : null);

  const categories = [
    { id: "all", label: "All" },
    { id: "hackathon", label: "Hackathons" },
    { id: "competition", label: "Competitions" },
    { id: "internship", label: "Internships" },
    { id: "job", label: "Jobs" },
    { id: "mentorship", label: "Mentorship" },
  ];

  const banners = [
    {
      id: "b1",
      badge: "National Hackathon",
      title: "Smart India Hackathon 2026",
      subtitle: "₹1 Crore Prize Pool • Direct Internships",
      gradient: "from-[#3D3BF3] via-[#5856FF] to-[#2E2CD4]",
      cta: "Register Free",
    },
    {
      id: "b2",
      badge: "EdWorld Feature",
      title: "DSA Studio Interactive Drills",
      subtitle: "20 Modules • Deterministic Visualizer",
      gradient: "from-[#FF6B00] via-[#FF8533] to-[#E05E00]",
      cta: "Practice Now",
    },
    {
      id: "b3",
      badge: "Career Tool",
      title: "ATS Single-Column Resume Maker",
      subtitle: "Recruiter-Calibrated • 100% Text Match",
      gradient: "from-emerald-600 via-teal-600 to-emerald-700",
      cta: "Build Resume",
    },
  ];

  // Filtered opportunities
  const filteredOpportunities = useMemo(() => {
    return MOCK_OPPORTUNITIES.filter((opp) => {
      const matchesCategory =
        selectedCategory === "all" || opp.type === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const recommendedOpps = filteredOpportunities.filter((o) => o.recommended);
  const closingSoonOpps = filteredOpportunities.filter((o) => o.closingSoon || o.deadlineDays <= 3);
  const trendingOpps = filteredOpportunities.filter((o) => o.trending);

  return (
    <div className="flex flex-col h-full bg-[#F8F9FD] dark:bg-[#0E1017] select-none overflow-y-auto pb-6">
      {/* Top Header: Greeting, Streak & Avatar */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#161922]/95 backdrop-blur-md px-4 pt-3 pb-3 border-b border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onProfileClick}
              className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#3D3BF3]/40 dark:ring-[#5856FF]/40 cursor-pointer flex-shrink-0"
              aria-label="View Profile"
            >
              <div className="w-full h-full bg-gradient-to-tr from-[#3D3BF3] to-[#FF6B00] flex items-center justify-center text-white font-bold text-sm">
                {userName.charAt(0)}
              </div>
            </button>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Welcome back,
                </span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                  {userName} 👋
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-bold text-[#FF6B00] bg-[#FF6B00]/10 dark:bg-[#FF6B00]/20 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  <Flame className="w-3 h-3 fill-current" /> {streakDays} Day Streak
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  • Level 4
                </span>
              </div>
            </div>
          </div>

          {/* Top Actions: Bell & Points */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onNotificationsClick}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 relative hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF6B00] ring-2 ring-white dark:ring-[#161922]" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 relative flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-xl px-3 py-2 border border-transparent focus-within:border-[#3D3BF3] focus-within:bg-white dark:focus-within:bg-[#161922] transition-colors">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0 mr-2" />
            <input
              type="text"
              placeholder="Search hackathons, DSA, jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors flex-shrink-0"
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pills Row */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <MobileChip
              key={cat.id}
              label={cat.label}
              active={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              size="sm"
            />
          ))}
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="px-4 pt-4 space-y-6">
        {/* First-Time User Tooltip Tour Card */}
        {tourStep !== null && (
          <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 shadow-xs relative animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#3D3BF3] text-white flex items-center justify-center text-xs font-black">
                  {tourStep}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3D3BF3] dark:text-[#7A78FF]">
                  Quick Onboarding Tip ({tourStep}/3)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTourStep(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
                aria-label="Dismiss tips"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-200 mt-2 font-medium leading-relaxed">
              {tourStep === 1 && "🔥 Maintain your daily practice streak to unlock free 1:1 FAANG system design mock sessions with top mentors."}
              {tourStep === 2 && "⚡ EdWorld Studio Hub gives you instant 1-tap access to the DSA Visualizer, ATS Resume Maker, and Myra AI."}
              {tourStep === 3 && "🎯 Use the Explore search bar to filter hackathons by cash prizes, eligibility, and 1-click register!"}
            </p>

            <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-indigo-100 dark:border-indigo-900/40">
              <button
                type="button"
                onClick={() => setTourStep(null)}
                className="text-[11px] text-slate-400 hover:underline"
              >
                Skip tour
              </button>
              <button
                type="button"
                onClick={() => {
                  if (tourStep < 3) setTourStep(tourStep + 1);
                  else setTourStep(null);
                }}
                className="text-xs font-bold text-[#3D3BF3] dark:text-[#7A78FF] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>{tourStep === 3 ? "Got it! Complete tour" : "Next tip"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Banner Carousel */}
        <div className="relative overflow-hidden rounded-2xl shadow-md">
          <div
            className={cn(
              "p-4 text-white bg-gradient-to-r flex flex-col justify-between min-h-[135px] transition-all duration-300",
              banners[bannerIndex].gradient
            )}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                {banners[bannerIndex].badge}
              </span>
              <h3 className="text-base sm:text-lg font-black mt-2 leading-tight">
                {banners[bannerIndex].title}
              </h3>
              <p className="text-xs text-white/80 mt-1">
                {banners[bannerIndex].subtitle}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs font-bold underline underline-offset-2 flex items-center gap-1">
                {banners[bannerIndex].cta} <ArrowRight className="w-3.5 h-3.5" />
              </span>

              {/* Dot Indicators */}
              <div className="flex items-center gap-1.5">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setBannerIndex(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-200",
                      bannerIndex === i ? "w-5 bg-white" : "w-1.5 bg-white/40"
                    )}
                    aria-label={`Go to banner ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* EDWORLD CORE FEATURES HUB (DSA, Mock Interviews, ATS Resume, Myra AI) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#3D3BF3] dark:text-[#5856FF]" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                EdWorld Studio Features
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#3D3BF3] dark:text-[#5856FF]">
              4 Superpowers
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {EDWORLD_CORE_FEATURES.map((feature) => (
              <EdworldFeatureCard
                key={feature.id}
                feature={feature}
                variant="tile"
                onLaunch={onFeatureLaunch}
              />
            ))}
          </div>
        </div>

        {/* Section 1: Recommended for You */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF6B00]" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Recommended for you
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {recommendedOpps.length} found
            </span>
          </div>

          <div className="space-y-3">
            {recommendedOpps.slice(0, 2).map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onClick={onOpportunityClick}
              />
            ))}
          </div>
        </div>

        {/* Section 2: Closing Soon (Countdown urgency) */}
        {closingSoonOpps.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#FF6B00]" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Closing soon
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-0.5 rounded-full">
                Hurry up
              </span>
            </div>

            <div className="space-y-3">
              {closingSoonOpps.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onClick={onOpportunityClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Trending Opportunities */}
        {trendingOpps.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#3D3BF3]" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Trending on EdWorld
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                High demand
              </span>
            </div>

            <div className="space-y-3">
              {trendingOpps.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onClick={onOpportunityClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
