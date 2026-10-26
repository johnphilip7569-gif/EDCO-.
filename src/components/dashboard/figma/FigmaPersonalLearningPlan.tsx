"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, SlidersHorizontal, Sparkles, Clock, Globe, Box, FlaskConical, BookOpen, Atom, ChevronRight } from "lucide-react";

export default function FigmaPersonalLearningPlan() {
  const [selectedGrade, setSelectedGrade] = useState<"Grade 1" | "Grade 2" | "Grade 3">("Grade 2");

  return (
    <div className="space-y-6">
      
      {/* 1. Top Section: Title & Created by AI Bubble */}
      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight leading-tight">
          Your personal learning plan
        </h3>

        {/* Created by AI Gradient Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] text-white text-xs font-black shadow-xs">
          <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
          <span>Created by AI</span>
        </div>
      </div>

      {/* 2. Grade / Level Selector Pills */}
      <div className="flex items-center gap-2">
        {(["Grade 1", "Grade 2", "Grade 3"] as const).map((grade) => (
          <button
            key={grade}
            type="button"
            onClick={() => setSelectedGrade(grade)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedGrade === grade
                ? "bg-black text-white shadow-xs font-black"
                : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
            }`}
          >
            {grade}
          </button>
        ))}
      </div>

      {/* 3. Weekly Blocks (Week 1 & Week 2) */}
      <div className="space-y-4">
        
        {/* Block 1: 3 Subjects */}
        <div className="rounded-[28px] bg-[#fbfcfd] border border-neutral-200/80 p-4 sm:p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-mono font-bold text-[10px]">
              Week
            </span>
            <span className="font-bold text-neutral-500 text-[11px] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>3 Subjects</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Subject: Geography */}
            <Link
              href="/learn#geography"
              className="p-3 rounded-2xl bg-white hover:bg-amber-50/50 border border-neutral-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center text-center space-y-1.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-black">Geography</span>
              <span className="text-[10px] font-mono text-neutral-500 font-semibold">8 hours</span>
            </Link>

            {/* Subject: Geometry */}
            <Link
              href="/learn#geometry"
              className="p-3 rounded-2xl bg-white hover:bg-amber-50/50 border border-neutral-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center text-center space-y-1.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <Box className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-black">Geometry</span>
              <span className="text-[10px] font-mono text-neutral-500 font-semibold">14 hours</span>
            </Link>

            {/* Add Subject */}
            <button
              type="button"
              className="p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-dashed border-neutral-300 flex flex-col items-center justify-center text-center space-y-1 cursor-pointer transition-all active:scale-95"
            >
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-neutral-400">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-neutral-500">Add</span>
            </button>
          </div>
        </div>

        {/* Block 2: 10 Subjects */}
        <div className="rounded-[28px] bg-[#fbfcfd] border border-neutral-200/80 p-4 sm:p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-mono font-bold text-[10px]">
              Week
            </span>
            <span className="font-bold text-neutral-500 text-[11px] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              <span>10 Subjects</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Subject: Chemistry */}
            <Link
              href="/learn#chemistry"
              className="p-3 rounded-2xl bg-white hover:bg-indigo-50/50 border border-neutral-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center text-center space-y-1.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                <FlaskConical className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-black truncate w-full">Chemistry</span>
              <span className="text-[10px] font-mono text-neutral-500 font-semibold">34 hours</span>
            </Link>

            {/* Subject: Literature */}
            <Link
              href="/learn#literature"
              className="p-3 rounded-2xl bg-white hover:bg-indigo-50/50 border border-neutral-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center text-center space-y-1.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-black truncate w-full">Literature</span>
              <span className="text-[10px] font-mono text-neutral-500 font-semibold">23 hours</span>
            </Link>

            {/* Subject: Physics */}
            <Link
              href="/learn#physics"
              className="p-3 rounded-2xl bg-white hover:bg-indigo-50/50 border border-neutral-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center text-center space-y-1.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Atom className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-black truncate w-full">Physics</span>
              <span className="text-[10px] font-mono text-neutral-500 font-semibold">8 hours</span>
            </Link>
          </div>
        </div>

      </div>

      {/* 4. Daily Schedule Agenda */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-black tracking-tight">
            Schedule
          </h4>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-black flex items-center justify-center cursor-pointer transition-colors"
              title="Add Schedule Item"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="w-6 h-6 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-black flex items-center justify-center cursor-pointer transition-colors"
              title="Filter Schedule"
            >
              <SlidersHorizontal className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Schedule Items */}
        <div className="space-y-2">
          {/* Item 1 */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-black">Design seminar</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-500">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>9:30</span>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-black">Define requirements</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-500">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>10:30</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
