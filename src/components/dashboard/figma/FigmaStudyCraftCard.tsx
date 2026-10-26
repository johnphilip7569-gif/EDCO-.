"use client";

import React from "react";
import { Sparkles, Clock, BookOpen, Star, Menu, Award } from "lucide-react";
import MyraTeddyMascot from "@/components/ui/figma/MyraTeddyMascot";

interface FigmaStudyCraftCardProps {
  onOpenMyra?: () => void;
}

export default function FigmaStudyCraftCard({ onOpenMyra }: FigmaStudyCraftCardProps) {
  const handleCardClick = () => {
    if (onOpenMyra) {
      onOpenMyra();
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-myra-copilot"));
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative overflow-hidden rounded-[36px] bg-[#fefce8] hover:bg-[#fef9c3]/90 border border-amber-200/70 p-6 sm:p-7 shadow-[0_12px_36px_rgba(254,240,138,0.3)] transition-all duration-300 hover:shadow-[0_16px_44px_rgba(250,204,21,0.3)] group cursor-pointer flex flex-col justify-between"
      title="Click to interact with Myra Teddy Mentor"
    >
      {/* Top Header: Title & Quick Badges */}
      <div className="relative z-10 flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight">
          Study Craft
        </h3>

        <div className="flex items-center gap-2">
          {/* Rank Badge #2 */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-mono font-black shadow-2xs">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>#2</span>
          </div>

          {/* Options Circle */}
          <div className="w-8 h-8 rounded-full bg-white/90 border border-amber-200/60 flex items-center justify-center text-amber-900 shadow-2xs">
            <Menu className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Center Character: Cute Teacher Myra Teddy */}
      <div className="relative z-10 py-3 flex items-center justify-center">
        <MyraTeddyMascot className="w-48 h-48 sm:w-56 sm:h-56" />
      </div>

      {/* Bottom Content: Science Play Title, Rating & Quick Stats */}
      <div className="relative z-10 space-y-3 pt-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-base sm:text-lg font-black text-black flex items-center gap-1.5">
              <span>Science Play</span>
              <span>🎓</span>
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2 max-w-[220px]">
              Discover the magic of tech and science! With our wise and playful Myra Teddy, explore code and formulas.
            </p>
          </div>

          {/* Circular 5.0 Rating Badge */}
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-400/80 bg-white flex flex-col items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <span className="text-xs font-black text-black font-mono leading-none">5.0</span>
            <div className="flex items-center gap-0.5 mt-0.5">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Stats Pills Row */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-amber-200/60 shadow-2xs">
            <Clock className="w-4 h-4 text-blue-500" />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Hours</span>
              <span className="text-xs font-black text-black font-mono">32</span>
            </div>
          </div>

          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-amber-200/60 shadow-2xs">
            <BookOpen className="w-4 h-4 text-purple-500" />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Lessons</span>
              <span className="text-xs font-black text-black font-mono">16</span>
            </div>
          </div>

          {/* 3D Box Badge */}
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/70 flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-4 h-4 text-rose-500" />
          </div>
        </div>
      </div>

    </div>
  );
}
