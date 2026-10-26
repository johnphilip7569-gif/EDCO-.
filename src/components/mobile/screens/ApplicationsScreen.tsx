"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  ChevronRight,
  Bookmark,
  Trophy,
  AlertCircle,
  Calendar,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ApplicationCardItem {
  id: string;
  title: string;
  company: string;
  logo: string;
  category: "hackathon" | "internship" | "competition" | "job";
  status: "applied" | "under_review" | "shortlisted" | "rejected" | "won";
  statusLabel: string;
  appliedDate: string;
  nextRoundTitle: string;
  nextRoundDate: string;
  countdown: string;
  isBookmarked?: boolean;
}

export const ApplicationsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "shortlisted" | "completed" | "bookmarked">("active");

  const applications: ApplicationCardItem[] = [
    {
      id: "app-1",
      title: "AI Hackathon India 2026: Agentic LLM Challenge",
      company: "Google Cloud & EdWorld",
      logo: "⚡",
      category: "hackathon",
      status: "applied",
      statusLabel: "Applied",
      appliedDate: "Applied 2 hours ago",
      nextRoundTitle: "Round 1: Idea PPT & Architecture",
      nextRoundDate: "Oct 22, 2026",
      countdown: "Starts in 2d 14h",
      isBookmarked: true,
    },
    {
      id: "app-2",
      title: "Full-Stack AI Engineering Summer Intern",
      company: "Tata Digital",
      logo: "🔷",
      category: "internship",
      status: "shortlisted",
      statusLabel: "Shortlisted",
      appliedDate: "Applied 4 days ago",
      nextRoundTitle: "Round 2: Technical Live Coding",
      nextRoundDate: "Oct 20, 2026",
      countdown: "Due in 18 hours",
      isBookmarked: false,
    },
    {
      id: "app-3",
      title: "FinTech Case Challenge: AI Wealth Systems",
      company: "Zerodha Tech Labs",
      logo: "📈",
      category: "competition",
      status: "under_review",
      statusLabel: "Under Review",
      appliedDate: "Applied 1 week ago",
      nextRoundTitle: "Executive Summary Evaluation",
      nextRoundDate: "Oct 18, 2026",
      countdown: "Results in 3 days",
      isBookmarked: true,
    },
    {
      id: "app-4",
      title: "Smart India Hackathon (SIH 2024)",
      company: "Ministry of Education & EdWorld",
      logo: "🏆",
      category: "hackathon",
      status: "won",
      statusLabel: "Won 1st Place 🏆",
      appliedDate: "Completed Dec 2024",
      nextRoundTitle: "Grand Finale Winner",
      nextRoundDate: "Dec 18, 2024",
      countdown: "₹1,50,000 Awarded",
      isBookmarked: false,
    },
    {
      id: "app-5",
      title: "Graduate Software Development Engineer (SDE-1)",
      company: "Microsoft India",
      logo: "🪟",
      category: "job",
      status: "under_review",
      statusLabel: "ATS Verified (88%)",
      appliedDate: "Applied 2 weeks ago",
      nextRoundTitle: "Online Assessment Screening",
      nextRoundDate: "Oct 28, 2026",
      countdown: "Starts in 7 days",
      isBookmarked: true,
    },
  ];

  // Filtering based on tab
  const filteredApps = applications.filter((app) => {
    if (activeTab === "active") return app.status === "applied" || app.status === "under_review";
    if (activeTab === "shortlisted") return app.status === "shortlisted";
    if (activeTab === "completed") return app.status === "won" || app.status === "rejected";
    if (activeTab === "bookmarked") return app.isBookmarked;
    return true;
  });

  const getStatusBadge = (status: ApplicationCardItem["status"], label: string) => {
    switch (status) {
      case "shortlisted":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            {label}
          </span>
        );
      case "won":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            {label}
          </span>
        );
      case "under_review":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-[#3D3BF3] dark:bg-indigo-950/60 dark:text-indigo-300">
            {label}
          </span>
        );
      case "applied":
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            {label}
          </span>
        );
      case "rejected":
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {label}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FD] dark:bg-[#0E1017] select-none overflow-y-auto pb-10">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#161922]/95 backdrop-blur-md px-4 pt-3 pb-3 border-b border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-[#3D3BF3] dark:text-[#5856FF] flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
              My Applications
            </h2>
            <p className="text-[10px] text-slate-400">
              Track round timelines, submissions & shortlist status
            </p>
          </div>
        </div>

        {/* 4 Tabs: Active | Shortlisted | Completed | Bookmarked */}
        <div className="mt-3 grid grid-cols-4 p-1 bg-slate-200/70 dark:bg-slate-800/70 rounded-xl">
          {[
            { id: "active", label: "Active" },
            { id: "shortlisted", label: "Shortlisted" },
            { id: "completed", label: "Finished" },
            { id: "bookmarked", label: "Saved" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "py-1.5 text-xs font-bold rounded-lg transition-all min-h-[36px] cursor-pointer text-center",
                activeTab === tab.id
                  ? "bg-white dark:bg-[#161922] text-[#3D3BF3] dark:text-[#5856FF] shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="px-4 pt-4 space-y-3.5">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg flex-shrink-0 border border-slate-200/60 dark:border-slate-700">
                    {app.logo}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-500 truncate block">
                      {app.company}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
                      {app.title}
                    </h3>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {getStatusBadge(app.status, app.statusLabel)}
                </div>
              </div>

              {/* Next Round & Countdown Box */}
              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Next Milestone
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                    {app.nextRoundTitle}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Target Date: {app.nextRoundDate}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-extrabold text-[#FF6B00] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-md inline-block">
                    {app.countdown}
                  </span>
                </div>
              </div>

              {/* Footer row */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>{app.appliedDate}</span>
                <span className="text-[#3D3BF3] dark:text-[#5856FF] font-bold flex items-center gap-0.5">
                  View Submission <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-white dark:bg-[#161922] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-[#3D3BF3] flex items-center justify-center mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              No applications in {activeTab}
            </h4>
            <p className="text-xs text-slate-500 max-w-[220px] mt-1 leading-relaxed">
              Explore open hackathons and internship drives to boost your career pipeline.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
