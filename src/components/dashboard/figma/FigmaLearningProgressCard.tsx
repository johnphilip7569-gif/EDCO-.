"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, Users } from "lucide-react";

export default function FigmaLearningProgressCard() {
  const [activePage, setActivePage] = useState(0);

  const modules = [
    {
      title: "User research",
      dateTag: "8/09",
      percent: 43,
      strokeColor: "#f97316", // Warm Orange
      fillColor: "rgba(249, 115, 22, 0.12)",
      strategy: "Read one short book/guide (Rich Dad, Poor Dad or How the Stock Market Works).",
      wavePath: "M0,28 C25,28 35,8 60,18 C85,28 95,8 120,24 L120,40 L0,40 Z",
      strokePath: "M0,28 C25,28 35,8 60,18 C85,28 95,8 120,24",
    },
    {
      title: "User research",
      dateTag: "12/10",
      percent: 74,
      strokeColor: "#a855f7", // Vibrant Purple
      fillColor: "rgba(168, 85, 247, 0.12)",
      strategy: "Read one short book/guide (Rich Dad, Poor Dad or How the Stock Market Works).",
      wavePath: "M0,24 C25,24 35,32 60,14 C85,-2 95,24 120,18 L120,40 L0,40 Z",
      strokePath: "M0,24 C25,24 35,32 60,14 C85,-2 95,24 120,18",
    },
  ];

  return (
    <div className="rounded-[32px] bg-[#fbfcfd] border border-neutral-200/80 p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-black text-black tracking-tight">
            Learning progress
          </h3>
        </div>

        <Link
          href="/learn"
          className="w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-black transition-colors"
          title="View all progress"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 2 Side-by-Side Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {modules.map((m, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-white border border-neutral-200/90 p-4 space-y-3 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
          >
            {/* Top: Title & Date Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-xs font-black text-black">{m.title}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[10px] font-mono font-bold text-neutral-600">
                {m.dateTag}
              </span>
            </div>

            {/* Percentage & Bezier Wave Sparkline */}
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-black text-black font-mono tracking-tight">
                {m.percent}%
              </span>

              {/* Smooth Bezier Wave Chart */}
              <div className="w-28 h-9 overflow-hidden shrink-0">
                <svg viewBox="0 0 120 40" className="w-full h-full" preserveAspectRatio="none">
                  <path d={m.wavePath} fill={m.fillColor} />
                  <path
                    d={m.strokePath}
                    fill="none"
                    stroke={m.strokeColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Strategy Footer Note */}
            <div className="pt-1 border-t border-neutral-100">
              <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                Learning strategy
              </span>
              <p className="text-[11px] text-neutral-600 leading-snug line-clamp-2 mt-0.5">
                {m.strategy}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Pagination Dots */}
      <div className="flex items-center justify-center gap-1 pt-1">
        {[0, 1, 2].map((dot) => (
          <button
            key={dot}
            type="button"
            onClick={() => setActivePage(dot)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              activePage === dot ? "w-4 bg-black" : "bg-neutral-300 hover:bg-neutral-400"
            }`}
            aria-label={`Slide ${dot + 1}`}
          />
        ))}
      </div>

    </div>
  );
}
