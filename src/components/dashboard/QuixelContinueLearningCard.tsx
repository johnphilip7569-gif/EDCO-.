"use client";

import React from "react";
import Link from "next/link";
import { Bell, MoreHorizontal, Play, Layers } from "lucide-react";
import Clay3dBrain from "@/components/ui/clay3d/Clay3dBrain";

interface QuixelContinueLearningCardProps {
  courseTitle?: string;
  courseCategory?: string;
  progressPercent?: number;
  courseSlug?: string;
}

export default function QuixelContinueLearningCard({
  courseTitle = "Full-Stack Next.js 14 & TypeScript Engineering",
  courseCategory = "Course",
  progressPercent = 46,
  courseSlug = "fullstack-nextjs-typescript",
}: QuixelContinueLearningCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[32px] sm:rounded-[36px] bg-[#fbfcfd] border border-neutral-200/80 p-5 sm:p-7 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] group">
      
      {/* Organic Asymmetrical Lime/Chartreuse Puddle Contour (#d8f34e) */}
      <div 
        className="absolute -top-10 -left-10 w-52 h-52 sm:w-64 sm:h-64 rounded-[44%_56%_62%_38%/42%_48%_52%_58%] bg-[#dcf443]/70 pointer-events-none transform -rotate-6 transition-transform duration-700 group-hover:scale-105"
      />
      <div 
        className="absolute top-8 left-8 w-36 h-36 rounded-full bg-[#f2ff8c]/40 blur-md pointer-events-none"
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left Side: 3D Isometric Brain & Course Metadata */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          
          {/* 3D Isometric Claymorphic Brain with Gold Lightning Bolts */}
          <div className="relative shrink-0 transform transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-2">
            <Clay3dBrain className="w-20 h-20 sm:w-24 sm:h-24" />
          </div>

          {/* Text & Dual-Tone Progress Track */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/95 border border-neutral-200 text-neutral-700 text-[10px] font-mono font-bold uppercase tracking-wider shadow-2xs">
                <Layers className="w-3 h-3 text-neutral-800" />
                {courseCategory}
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-black tracking-tight leading-snug max-w-md">
              {courseTitle}
            </h3>

            {/* Progress Bar Container */}
            <div className="space-y-1.5 pt-1 max-w-sm">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
                <span>{progressPercent}% of 100% Completed</span>
              </div>
              <div className="w-48 sm:w-64 h-2.5 rounded-full bg-neutral-200/90 overflow-hidden p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] transition-all duration-700 shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Dual Circular Wells & High-Contrast Black Pill Button */}
        <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0 pt-2 md:pt-0">
          
          {/* Lime/Yellow Circular Well housing the Notification Bell */}
          <button 
            type="button"
            className="w-11 h-11 rounded-full bg-[#dcf443] hover:bg-[#cde533] border border-black/10 flex items-center justify-center text-black transition-all shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:scale-95 cursor-pointer"
            title="Course Notifications"
            aria-label="Course notifications"
          >
            <Bell className="w-4 h-4 fill-black/20" />
          </button>

          {/* White Circular Well housing options dots */}
          <button 
            type="button"
            className="w-11 h-11 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200/90 flex items-center justify-center text-neutral-700 hover:text-black transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Course Options"
            aria-label="Course options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* High-Contrast Solid Black Pill Button */}
          <Link
            href={`/learn#${courseSlug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black hover:bg-neutral-850 text-white text-xs font-black transition-all shadow-[0_4px_14px_rgba(0,0,0,0.25)] active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span>Resume learning</span>
          </Link>

        </div>

      </div>

    </div>
  );
}
