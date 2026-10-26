"use client";

import React from "react";
import Link from "next/link";
import { Zap, ChevronRight } from "lucide-react";

interface QuixelStreakCardProps {
  streakDays?: number;
  streakScore?: number;
  activeDays?: string[];
  topics?: Array<{
    name: string;
    xp: number;
    percent: number;
  }>;
}

export default function QuixelStreakCard({
  streakDays = 5,
  streakScore = 31,
  topics = [
    { name: "Full-Stack Web Dev", xp: 4712, percent: 84 },
    { name: "Algorithms & DSA", xp: 4328, percent: 76 },
    { name: "System Design", xp: 2810, percent: 52 },
    { name: "AI & Prompt Eng", xp: 1561, percent: 34 },
  ],
}: QuixelStreakCardProps) {
  const days = [
    { label: "S", active: false },
    { label: "M", active: false },
    { label: "T", active: true },
    { label: "W", active: true },
    { label: "T", active: true },
    { label: "F", active: true },
    { label: "S", active: true },
  ];

  return (
    <div className="relative rounded-[32px] sm:rounded-[36px] bg-white border border-neutral-200/90 p-6 sm:p-7 shadow-[0_24px_50px_rgba(0,0,0,0.12)] flex flex-col justify-between space-y-6 transition-all duration-300 lg:-rotate-[1.5deg] hover:rotate-0 hover:shadow-[0_28px_60px_rgba(0,0,0,0.16)] group">
      
      {/* Top Banner: Streak Title & Score Badge */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="text-lg sm:text-xl font-black text-black tracking-tight">
            You're on a {streakDays}-day streak
          </h4>
        </div>

        {/* Tactile Streak XP Badge */}
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 font-mono font-black text-sm shadow-2xs">
          <Zap className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>{streakScore}</span>
        </div>
      </div>

      {/* Weekday Circle Grid with Lightning Bolts */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        {days.map((d, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs transition-transform duration-200 group-hover:scale-105 ${
                d.active
                  ? "bg-[#dcf443] text-black shadow-[0_4px_10px_rgba(220,244,67,0.4)] border border-[#cbe334]"
                  : "bg-neutral-100 text-neutral-400 border border-neutral-200"
              }`}
            >
              {d.active ? (
                <Zap className="w-4 h-4 fill-black text-black" />
              ) : (
                <span>{d.label}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Topic Mini XP Meters with Candy-Striped Turquoise Bars */}
      <div className="space-y-3.5 pt-2 border-t border-neutral-100">
        {topics.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-800">{item.name}</span>
              <span className="font-mono text-neutral-500 font-bold">
                {item.xp.toLocaleString()} XP
              </span>
            </div>
            
            {/* Candy-Striped Diagonal Pattern Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-neutral-100 overflow-hidden p-0.5 border border-neutral-200/50">
              <div
                className="h-full rounded-full transition-all duration-700 shadow-2xs"
                style={{
                  width: `${item.percent}%`,
                  backgroundImage: `repeating-linear-gradient(
                    -45deg,
                    #14b8a6,
                    #14b8a6 6px,
                    #0d9488 6px,
                    #0d9488 12px
                  )`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Link */}
      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
        <Link
          href="/learn"
          className="text-xs font-bold text-neutral-700 hover:text-black flex items-center gap-1 group/link transition-colors"
        >
          <span>View more details</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
