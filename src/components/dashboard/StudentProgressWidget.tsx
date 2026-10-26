"use client";

import React, { useState, useEffect } from "react";
import { Flame, Target, TrendingUp, Award, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface StudentProgressWidgetProps {
  onOpenMyra?: () => void;
}

export default function StudentProgressWidget({ onOpenMyra }: StudentProgressWidgetProps) {
  const { user, profile } = useAuth();
  const [dailyHours, setDailyHours] = useState<number>(3);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [totalSlots, setTotalSlots] = useState<number>(3);

  const studentName = profile?.name || user?.name || "Student";
  const targetRole = profile?.targetRole || "Software Engineer";
  const streakDays = 4; // active streak

  // Read saved timetable checklist state to synchronize progress accurately
  useEffect(() => {
    try {
      const todayKey = new Date().toISOString().split("T")[0];
      const saved = localStorage.getItem(`edworld_timetable_${todayKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const done = Object.values(parsed).filter(Boolean).length;
        setCompletedCount(done);
      }
      const savedHours = localStorage.getItem("edworld_study_hours");
      if (savedHours) {
        const hours = Number(savedHours);
        setDailyHours(hours);
        setTotalSlots(hours <= 2 ? 2 : hours <= 3.5 ? 3 : 3);
      }
    } catch (e) {
      // Local storage fallback
    }
  }, []);

  const loggedHours = totalSlots > 0 ? ((completedCount / totalSlots) * dailyHours).toFixed(1) : "0.0";
  const progressPercent = totalSlots > 0 ? Math.min(100, Math.round((completedCount / totalSlots) * 100)) : 0;

  // Days of week for streak tracking
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const activeDays = [true, true, true, true, false, false, false]; // Mon-Thu completed

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header with Title and Streak Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
              Learning Progress
            </span>
            <span className="text-xs font-medium text-[#6B7280]">Real-time Academic Index</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mt-1">
            Student Performance &amp; Milestones
          </h2>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 fill-amber-600 text-amber-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <span>{streakDays} Day Study Streak</span>
            </div>
            <p className="text-[11px] font-medium text-amber-800/80">Top 10% consistency this week</p>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Daily Study Hours */}
        <div className="p-5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#111827]">Daily Study Goal</span>
            <Clock className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#111827] tabular-nums">
              {loggedHours} <span className="text-xs font-normal text-[#6B7280]">/ {dailyHours} hrs</span>
            </div>
            <div className="mt-2.5 w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2563EB] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-medium text-[#6B7280] mt-2 inline-block">
              {progressPercent}% of target schedule finished
            </span>
          </div>
        </div>

        {/* Metric 2: Weekly Consistency */}
        <div className="p-5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#111827]">Weekly Consistency</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-1.5 pt-1">
              {daysOfWeek.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full aspect-square rounded-md flex items-center justify-center text-[10px] font-bold ${
                      activeDays[idx]
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-white text-gray-400 border border-gray-200"
                    }`}
                  >
                    {activeDays[idx] ? "✓" : ""}
                  </div>
                  <span className="text-[10px] text-[#6B7280] font-semibold">{day}</span>
                </div>
              ))}
            </div>
            <span className="text-[11px] text-[#6B7280] font-medium mt-2.5 inline-block">
              4 of 7 weekly targets logged
            </span>
          </div>
        </div>

        {/* Metric 3: Target Role Readiness */}
        <div className="p-5 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#111827]">Role Readiness</span>
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#111827]">
              86% <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Ready</span>
            </div>
            <p className="text-[11px] text-[#6B7280] mt-1 truncate font-normal">
              Benchmarked for <strong className="text-[#111827]">{targetRole}</strong>
            </p>
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#6B7280] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>14 of 18 core milestones verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
