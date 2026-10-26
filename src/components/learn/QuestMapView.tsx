"use client";

import React from "react";
import {
  Sparkles,
  Lock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
} from "lucide-react";

export interface QuestNode {
  id: string;
  slug: string;
  title: string;
  category: string;
  tier: "Foundations" | "Core Engineering" | "Specialized Mastery" | "Capstone & Ventures";
  xpBounty: number;
  level: string;
  skills: string[];
  prerequisites?: string[];
}

interface QuestMapViewProps {
  courses: Array<{
    id: string;
    slug: string;
    title: string;
    category: string;
    level: string;
    skills: string[];
    duration_weeks: number;
  }>;
  completedQuests: Record<string, boolean>;
  onSelectCourse: (slug: string) => void;
}

export function QuestMapView({
  courses,
  completedQuests,
  onSelectCourse,
}: QuestMapViewProps) {
  // Group courses by tier
  const tiers = [
    {
      name: "Tier 1 &bull; Foundations of Modern Computing",
      badge: "Foundations",
      desc: "Master algorithmic thinking, low-level data structures, and type-safe systems.",
      slugs: ["advanced-data-structures-algorithms", "fullstack-nextjs-typescript", "technical-writing-content-strategy"],
    },
    {
      name: "Tier 2 &bull; Applied Engineering & Systems",
      badge: "Core Engineering",
      desc: "Build distributed clouds, microcontroller firmware, and intuitive design systems.",
      slugs: ["embedded-systems-iot-robotics", "ui-ux-design-systems-research", "machine-learning-ai-systems"],
    },
    {
      name: "Tier 3 &bull; Quantitative & Bio-Science Domains",
      badge: "Specialized Domains",
      desc: "Analyze quantitative markets, genomics pipelines, and tech legal governance.",
      slugs: ["financial-modeling-valuation-fintech", "bioinformatics-healthcare-data-analytics", "tech-law-cyber-governance-compliance"],
    },
    {
      name: "Tier 4 &bull; Apex Leadership & Ventures",
      badge: "Pinnacle Capstones",
      desc: "Lead cross-functional product orgs, pitch investors, and scale zero-to-one startups.",
      slugs: ["product-management-growth-strategy", "startup-venture-building-fundraising"],
    },
  ];

  return (
    <div className="space-y-12 py-4 relative">
      {/* Background Pathway Line */}
      <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-800 -translate-x-1/2 pointer-events-none" />

      {tiers.map((tier, tierIdx) => {
        const tierCourses = tier.slugs
          .map((s) => courses.find((c) => c.slug === s))
          .filter(Boolean) as typeof courses;

        return (
          <div key={tierIdx} className="space-y-6 relative z-10">
            {/* Tier Header Badge */}
            <div className="flex flex-col items-center text-center space-y-1.5 max-w-md mx-auto">
              <span className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-[10px] font-mono font-bold uppercase tracking-widest shadow-md">
                {tier.badge}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                {tier.name.replace("&bull;", "•")}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {tier.desc}
              </p>
            </div>

            {/* Nodes Grid for Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {tierCourses.map((c) => {
                const isCompleted = !!completedQuests[c.slug];
                const xpBounty = 350 + (tierIdx + 1) * 75;

                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectCourse(c.slug)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group shadow-xl relative overflow-hidden ${
                      isCompleted
                        ? "bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400"
                        : "bg-neutral-900/80 hover:bg-neutral-900 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    {/* Glowing Accent Corner */}
                    <div
                      className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none ${
                        isCompleted ? "bg-emerald-500/10" : "bg-neutral-500/5 group-hover:bg-neutral-400/10"
                      }`}
                    />

                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px] font-mono font-bold uppercase">
                          {c.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isCompleted ? (
                            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Mastered
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-md">
                              <Zap className="w-3 h-3 text-amber-400" />
                              +{xpBounty} XP
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm sm:text-base font-black text-white group-hover:text-neutral-200 transition-colors">
                          {c.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 mt-1">
                          <span>{c.duration_weeks}w Duration</span>
                          <span>&bull;</span>
                          <span>{c.level}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {c.skills.slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-black/60 text-neutral-400 text-[9px] font-mono border border-neutral-800"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-neutral-800 flex items-center justify-between text-xs relative z-10">
                      <span className="text-[11px] font-mono text-neutral-400">
                        {isCompleted ? "Verified Credential Unlocked" : "Quest Available"}
                      </span>

                      <span className="font-bold text-white group-hover:translate-x-1 transition-transform flex items-center gap-1 text-xs">
                        <span>{isCompleted ? "Review" : "Start Quest"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
