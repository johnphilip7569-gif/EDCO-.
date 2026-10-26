"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  Zap, 
  ArrowRight, 
  Sliders, 
  RotateCcw,
  Target,
  Award,
  Layers
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface TimetableSlot {
  id: string;
  timeOfDay: "Morning" | "Afternoon" | "Evening" | "Night";
  duration: string;
  title: string;
  category: "Core Concept" | "Coding & DSA" | "Aptitude" | "Interview Drill" | "Project Work";
  description: string;
  actionLabel: string;
  actionHref: string;
  recommendedFocus: string;
}

export default function PersonalizedTimetableWidget() {
  const { user, profile } = useAuth();
  const [dailyHours, setDailyHours] = useState<number>(3);
  const [completedSlots, setCompletedSlots] = useState<Record<string, boolean>>({});
  const [isMounted, setIsMounted] = useState(false);

  // Today's date string for local storage key
  const todayKey = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(`edworld_timetable_${todayKey}`);
      if (saved) {
        setCompletedSlots(JSON.parse(saved));
      }
      const savedHours = localStorage.getItem("edworld_study_hours");
      if (savedHours) {
        setDailyHours(Number(savedHours));
      }
    } catch (e) {
      // Ignore local storage error
    }
  }, [todayKey]);

  const toggleSlot = (id: string) => {
    setCompletedSlots((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(`edworld_timetable_${todayKey}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleHoursChange = (hours: number) => {
    setDailyHours(hours);
    try {
      localStorage.setItem("edworld_study_hours", hours.toString());
    } catch (e) {}
  };

  const handleResetChecklist = () => {
    setCompletedSlots({});
    try {
      localStorage.removeItem(`edworld_timetable_${todayKey}`);
    } catch (e) {}
  };

  // Derive academic profile signals
  const cgpaRaw = (profile as any)?.cgpa || (user as any)?.cgpa;
  const numericCgpa = typeof cgpaRaw === "number" ? cgpaRaw : parseFloat(cgpaRaw) || 8.0;
  const targetRole = profile?.targetRole || "Software Development Engineer";
  const gradeLevel = profile?.gradeLevel || user?.gradeLevel || "College";

  // Generate slots tailored to CGPA & daily hours
  const generateSlots = (): TimetableSlot[] => {
    const isAdvanced = numericCgpa >= 8.5;
    const isIntermediate = numericCgpa >= 7.0 && numericCgpa < 8.5;

    if (dailyHours <= 2) {
      return [
        {
          id: "slot-1",
          timeOfDay: "Morning",
          duration: "45 mins",
          title: isAdvanced ? "High-Yield DSA & Algorithm Optimization" : "Core Fundamentals & Concept Mastery",
          category: isAdvanced ? "Coding & DSA" : "Core Concept",
          description: isAdvanced 
            ? "Solve 1 Medium/Hard LeetCode problem focusing on Dynamic Programming / Graphs."
            : "Review fundamental data structures (Arrays, Linked Lists, Binary Trees) and core OOP principles.",
          actionLabel: "Start Practice",
          actionHref: "/practice",
          recommendedFocus: isAdvanced ? "Time/Space Complexity" : "Concept Clarity",
        },
        {
          id: "slot-2",
          timeOfDay: "Evening",
          duration: "45 mins",
          title: "AI Mock Interview & Behavioral Drill",
          category: "Interview Drill",
          description: "Complete 1 STAR behavioral simulation or rapid technical drill tailored for " + targetRole + ".",
          actionLabel: "Launch Simulation",
          actionHref: "/interviews/star-method",
          recommendedFocus: "STAR Articulation",
        },
      ];
    }

    if (dailyHours <= 3.5) {
      return [
        {
          id: "slot-1",
          timeOfDay: "Morning",
          duration: "60 mins",
          title: isAdvanced ? "Advanced Data Structures & Algorithms" : "Data Structures & Aptitude Sprint",
          category: "Coding & DSA",
          description: isAdvanced 
            ? "Solve 2 problems on Graphs, DP, or Sliding Window with strict timer constraints."
            : "Master 10 Quant & Logical Reasoning questions + 1 fundamental data structure drill.",
          actionLabel: "Start Drill",
          actionHref: "/practice",
          recommendedFocus: isAdvanced ? "Greedy & DP" : "Quant Formulas",
        },
        {
          id: "slot-2",
          timeOfDay: "Afternoon",
          duration: "60 mins",
          title: isAdvanced ? "System Design & Low-Level Design (LLD)" : "Hands-on Project & Resume Implementation",
          category: isAdvanced ? "Core Concept" : "Project Work",
          description: isAdvanced 
            ? "Deconstruct microservices scaling, database sharding, and caching strategies."
            : "Work on your portfolio project and align architecture with your target resume role.",
          actionLabel: "Review Architecture",
          actionHref: "/interviews/system-design",
          recommendedFocus: "Scalability Patterns",
        },
        {
          id: "slot-3",
          timeOfDay: "Evening",
          duration: "45 mins",
          title: "STAR Behavioral & Mock Assessment",
          category: "Interview Drill",
          description: "Simulate a live interview scenario with instant AI feedback on communication & technical depth.",
          actionLabel: "Take Mock Interview",
          actionHref: "/interviews",
          recommendedFocus: "Confidence & Clarity",
        },
      ];
    }

    // 4+ Hours Schedule
    return [
      {
        id: "slot-1",
        timeOfDay: "Morning",
        duration: "75 mins",
        title: isAdvanced ? "Competitive DSA & Hard Problem Analysis" : "Core CS Fundamentals & Quantitative Aptitude",
        category: "Coding & DSA",
        description: isAdvanced 
          ? "Deep dive into Trie, Segment Trees, Graph BFS/DFS, and Backtracking edge cases."
          : "Cover Probability, Speed & Distance, and Array/String pattern matching techniques.",
        actionLabel: "Practice Problems",
        actionHref: "/practice",
        recommendedFocus: isAdvanced ? "Advanced Trees" : "Speed & Accuracy",
      },
      {
        id: "slot-2",
        timeOfDay: "Afternoon",
        duration: "90 mins",
        title: "Full-Stack Project & Architecture Engineering",
        category: "Project Work",
        description: "Implement core backend APIs, database schemas, and clean frontend UI for your major capstone.",
        actionLabel: "Build & Verify",
        actionHref: "/resume",
        recommendedFocus: "Clean Code & Tests",
      },
      {
        id: "slot-3",
        timeOfDay: "Evening",
        duration: "60 mins",
        title: "High-Fidelity AI Mock Interview Simulation",
        category: "Interview Drill",
        description: "Execute a full-length 45-minute technical + STAR behavioral interview session.",
        actionLabel: "Start Interview",
        actionHref: "/interviews",
        recommendedFocus: "STAR Structure",
      },
      {
        id: "slot-4",
        timeOfDay: "Night",
        duration: "30 mins",
        title: "Daily Flashcard & Concept Recap",
        category: "Core Concept",
        description: "Review missed questions from today's drills and clarify doubts with Myra AI.",
        actionLabel: "Ask Myra",
        actionHref: "/practice",
        recommendedFocus: "Spaced Repetition",
      },
    ];
  };

  const slots = generateSlots();
  const completedCount = isMounted ? slots.filter((s) => completedSlots[s.id]).length : 0;
  const progressPct = slots.length > 0 ? Math.round((completedCount / slots.length) * 100) : 0;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-7 shadow-xs">
      
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#111827] tracking-tight flex items-center gap-2 flex-wrap">
                Personalized Study Timetable
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F7F8FA] text-[#111827] border border-[#E5E7EB]">
                  Calibrated for {numericCgpa ? `CGPA ${numericCgpa}` : "Target Role"}
                </span>
              </h2>
              <p className="text-xs text-[#6B7280] font-normal mt-0.5">
                Daily smart curriculum calibrated to your academic metrics, available study hours, and target role.
              </p>
            </div>
          </div>
        </div>

        {/* Study Hours Selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#F7F8FA] border border-[#E5E7EB] p-1.5 rounded-xl">
          <span className="text-[11px] font-medium text-[#6B7280] px-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#111827]" />
            Study Time:
          </span>
          {[2, 3, 4.5].map((hrs) => (
            <button
              key={hrs}
              onClick={() => handleHoursChange(hrs)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                dailyHours === hrs
                  ? "bg-[#111827] text-white border-[#111827]"
                  : "bg-white text-[#6B7280] border-transparent hover:border-[#E5E7EB]"
              }`}
            >
              {hrs}h/day
            </button>
          ))}
        </div>
      </div>

      {/* Progress & Milestone Bar */}
      <div className="mt-5 p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
            {progressPct}%
          </div>
          <div>
            <div className="text-xs font-bold text-[#111827] flex items-center gap-2">
              <span>Today's Task Completion</span>
              <span className="text-[11px] text-[#6B7280] font-normal">
                ({completedCount} of {slots.length} tasks completed)
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280] font-normal mt-0.5">
              {progressPct === 100 
                ? "Fantastic job! You have conquered all your scheduled milestones for today." 
                : "Check off each slot as you complete it to build your consistency streak."}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-48 flex items-center gap-2">
          <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {completedCount > 0 && (
            <button
              onClick={handleResetChecklist}
              title="Reset today's checklist"
              className="text-[#6B7280] hover:text-[#111827] p-1 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Time Slots List */}
      <div className="mt-5 space-y-3">
        {slots.map((slot) => {
          const isDone = isMounted && !!completedSlots[slot.id];

          return (
            <div
              key={slot.id}
              className={`p-4 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                isDone
                  ? "bg-emerald-50/40 border-emerald-200"
                  : "bg-white border-[#E5E7EB] hover:border-gray-300 shadow-xs"
              }`}
            >
              {/* Checkbox and Details */}
              <div className="flex items-start gap-3.5 min-w-0">
                <button
                  onClick={() => toggleSlot(slot.id)}
                  className="mt-0.5 text-gray-400 hover:text-[#111827] transition-colors shrink-0 focus:outline-none cursor-pointer"
                  aria-label={`Mark ${slot.title} as ${isDone ? "incomplete" : "complete"}`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 hover:text-gray-500" />
                  )}
                </button>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#F7F8FA] text-[#111827] border border-[#E5E7EB]">
                      {slot.timeOfDay} • {slot.duration}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {slot.category}
                    </span>
                    <span className="text-[10px] text-[#6B7280]">
                      Focus: <strong className="text-[#111827] font-semibold">{slot.recommendedFocus}</strong>
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-bold mt-1.5 leading-snug ${
                      isDone ? "line-through text-gray-400" : "text-[#111827]"
                    }`}
                  >
                    {slot.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                    {slot.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pl-8 sm:pl-0">
                <Link
                  href={slot.actionHref}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
                    isDone
                      ? "bg-gray-100 text-[#111827] hover:bg-gray-200 border border-[#E5E7EB]"
                      : "bg-[#111827] hover:bg-black text-white"
                  }`}
                >
                  <span>{slot.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Guidance */}
      <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] font-normal gap-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Have questions about your schedule? Open <strong>Myra AI</strong> anytime for custom revisions.</span>
        </div>
        <Link
          href="/practice"
          className="text-[#2563EB] font-semibold hover:underline inline-flex items-center gap-1"
        >
          <span>Explore All Question Banks</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

    </div>
  );
}
