"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, Sparkles } from "lucide-react";

interface QuixelJobBoardCardProps {
  targetRole?: string;
  roleTags?: string[];
}

export default function QuixelJobBoardCard({
  targetRole = "Full-Stack Software Engineer",
  roleTags = ["Full-Stack Dev", "UI/UX Engineer", "Quality Assurance", "Product Manager"],
}: QuixelJobBoardCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[32px] sm:rounded-[36px] bg-gradient-to-br from-[#4f46e5] via-[#5b52e0] to-[#3730a3] text-white p-6 sm:p-7 shadow-[0_16px_36px_rgba(79,70,229,0.3)] transition-all hover:shadow-[0_20px_48px_rgba(79,70,229,0.4)] group flex flex-col justify-between">
      
      {/* Subtle Ambient Radial Lighting & Organic Light Violet Puddle */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none transform translate-x-16 -translate-y-16" />
      <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-[48%] bg-[#818cf8]/25 blur-sm pointer-events-none group-hover:scale-115 transition-transform duration-500" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
        
        {/* Top Header & Role Tag Chips */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Curated Career Hub</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            The #1 job board for {targetRole}!
          </h3>

          <p className="text-xs text-indigo-100/90 leading-relaxed max-w-sm">
            Explore verified high-growth opportunities worldwide tailored to your verified credentials and skills.
          </p>
        </div>

        {/* Floating Mini Role Badges */}
        <div className="flex flex-wrap gap-1.5">
          {roleTags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/15 text-[11px] font-mono font-medium text-white/90"
            >
              &lt;/&gt; {tag}
            </span>
          ))}
        </div>

        {/* Action Button: Crisp White Pill */}
        <div className="pt-2">
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-neutral-100 text-indigo-950 text-xs font-black transition-all shadow-[0_4px_14px_rgba(0,0,0,0.15)] active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Briefcase className="w-3.5 h-3.5 text-indigo-700" />
            <span>Find a job</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
