"use client";

import React from "react";
import { Clay3dCoin, Clay3dTarget, Clay3dDiploma, Clay3dGamepad } from "@/components/ui/clay3d/Clay3dStatIcons";

interface QuixelStatPillsProps {
  points?: number;
  coursesCount?: number;
  certificatesCount?: number;
  challengesCount?: number;
}

export default function QuixelStatPills({
  points = 248,
  coursesCount = 17,
  certificatesCount = 120,
  challengesCount = 31,
}: QuixelStatPillsProps) {
  const stats = [
    {
      value: points,
      label: "Points",
      wellBg: "bg-[#fffbeb] border-amber-200/80",
      iconComponent: <Clay3dCoin className="w-8 h-8" />,
    },
    {
      value: coursesCount,
      label: "Courses",
      wellBg: "bg-[#faf5ff] border-purple-200/80",
      iconComponent: <Clay3dTarget className="w-8 h-8" />,
    },
    {
      value: certificatesCount,
      label: "Certificates",
      wellBg: "bg-[#fff7ed] border-orange-200/80",
      iconComponent: <Clay3dDiploma className="w-8 h-8" />,
    },
    {
      value: challengesCount,
      label: "Challenges",
      wellBg: "bg-[#eef2ff] border-indigo-200/80",
      iconComponent: <Clay3dGamepad className="w-8 h-8" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
      {stats.map((s, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl ${s.wellBg} border transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:-translate-y-0.5 group cursor-default`}
        >
          <div className="shrink-0 transition-transform group-hover:scale-110 duration-300">
            {s.iconComponent}
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-base sm:text-lg font-black text-black font-mono tracking-tight">
              {s.value}
            </span>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider">
              {s.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
