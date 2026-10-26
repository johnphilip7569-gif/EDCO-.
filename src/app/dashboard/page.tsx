"use client";

export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Flame,
  Target,
  Calendar,
  Compass,
  Lock,
  ShieldCheck,
  Clock,
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/lib/auth-context";

// 3 Core Single Dashboard Components
import StudentProgressWidget from "@/components/dashboard/StudentProgressWidget";
import PersonalizedTimetableWidget from "@/components/dashboard/PersonalizedTimetableWidget";
import CareerPathSelectorWidget from "@/components/dashboard/CareerPathSelectorWidget";

export default function DashboardPage() {
  const { user, profile } = useAuth();

  const handleOpenMyra = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-myra-copilot"));
    }
  };

  const studentName = profile?.name || user?.name || "Student";
  const targetRole = profile?.targetRole || "Software Engineer";
  const academicStage = profile?.degree || profile?.careerStage || "Undergraduate";
  const cgpa = profile?.cgpa ? `${profile.cgpa} CGPA` : "Academic Profile Active";

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-4rem)] bg-[#F8F9FA] text-[#111827] font-sans pb-10 px-4 sm:px-6 lg:px-8 pt-6 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
        
        {/* Onboarding Incomplete Alert Banner */}
        {profile && profile.onboarding_completed === false && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#111827]">
                  Complete Your Student Profile
                </h4>
                <p className="text-xs text-[#6B7280]">
                  Provide your degree, GPA, and target role so Myra AI can personalize your roadmap and timetable.
                </p>
              </div>
            </div>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] hover:bg-black text-white text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              <span>Complete Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* 1. STUDENT WELCOME HERO BANNER */}
        <section className="relative overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] p-6 sm:p-8 shadow-xs">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                  4-Day Streak
                </span>
                <span className="px-2.5 py-1 rounded-lg border border-[#E5E7EB] bg-[#F7F8FA] text-xs font-semibold text-[#111827]">
                  {cgpa}
                </span>
                <span className="px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700">
                  {targetRole}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight">
                Welcome back, {studentName}
              </h1>

              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-normal">
                Your focused career dashboard tracks your daily study progress, scheduled timetable blocks, and selected career pathway.
              </p>
            </div>

            {/* Quick Action Button for Myra */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleOpenMyra}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#111827] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ask Myra AI Copilot</span>
              </button>
            </div>
          </div>
        </section>

        {/* 1.5 DEEP WORK FOCUS LOCK STRIP */}
        <section className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                Focus Mode
              </span>
              <span className="text-xs font-mono font-medium text-[#6B7280]">Distraction Blocker</span>
            </div>
            <h3 className="text-lg font-bold text-[#111827]">
              Lock In for a Distraction-Free Study Session
            </h3>
            <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
              Restrict Instagram, Snapchat, YouTube, and games until your study timer completes. Ask permission to close distracting apps and earn Focus XP.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <Link
              href="/focus"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4 text-white" />
              <span>Launch Focus Lock Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>
        </section>

        {/* 2. SECTION 1: PROGRESS */}
        <section aria-label="Student Learning Progress">
          <StudentProgressWidget onOpenMyra={handleOpenMyra} />
        </section>

        {/* 3. SECTION 2: TIMETABLE */}
        <section aria-label="Personalized Daily and Weekly Timetable">
          <PersonalizedTimetableWidget />
        </section>

        {/* 4. SECTION 3: SELECT CAREER PATH */}
        <section aria-label="Career Path Selection">
          <CareerPathSelectorWidget />
        </section>

      </div>
    </AuthGuard>
  );
}
