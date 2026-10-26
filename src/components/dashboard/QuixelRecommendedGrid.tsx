"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Swords, MoreVertical } from "lucide-react";
import Clay3dAlphabetBlocks from "@/components/ui/clay3d/Clay3dAlphabetBlocks";
import Clay3dCalendar from "@/components/ui/clay3d/Clay3dCalendar";
import Clay3dNotepadPen from "@/components/ui/clay3d/Clay3dNotepadPen";
import Clay3dPaletteBrush from "@/components/ui/clay3d/Clay3dPaletteBrush";

interface RecommendedItem {
  id: string;
  type: "Course" | "Challenge";
  title: string;
  level: string;
  meta: string;
  category: "Beginner" | "Intermediate" | "Advanced";
  slug: string;
  bgPastel: string;
  component: React.ReactNode;
}

const ITEMS: RecommendedItem[] = [
  {
    id: "1",
    type: "Course",
    title: "Typography & Interface Systems",
    level: "Beginner",
    meta: "1 hour",
    category: "Beginner",
    slug: "ui-ux-design-systems",
    bgPastel: "#eefd8d",
    component: <Clay3dAlphabetBlocks className="w-14 h-14" />,
  },
  {
    id: "2",
    type: "Course",
    title: "Basic 3D Design & Spatial UX",
    level: "Advanced",
    meta: "3 hours",
    category: "Advanced",
    slug: "robotics-iot-embedded",
    bgPastel: "#fef3c7",
    component: <Clay3dCalendar className="w-14 h-14" />,
  },
  {
    id: "3",
    type: "Challenge",
    title: "UX Writing & Content Strategy",
    level: "Beginner",
    meta: "8 questions",
    category: "Beginner",
    slug: "technical-writing-documentation",
    bgPastel: "#e0f2fe",
    component: <Clay3dNotepadPen className="w-14 h-14" />,
  },
  {
    id: "4",
    type: "Challenge",
    title: "Color Psychology in Products",
    level: "Intermediate",
    meta: "24 questions",
    category: "Intermediate",
    slug: "product-management-metrics",
    bgPastel: "#fae8ff",
    component: <Clay3dPaletteBrush className="w-14 h-14" />,
  },
];

export default function QuixelRecommendedGrid() {
  const [activeTab, setActiveTab] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");

  const filteredItems = ITEMS.filter((item) => {
    if (activeTab === "All") return true;
    return item.category === activeTab;
  });

  return (
    <div className="space-y-4">
      
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-xl font-black text-black tracking-tight">
          Recommended For You
        </h3>

        {/* Filter Pills with options dot */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-full bg-neutral-100 text-xs font-bold">
            {(["All", "Beginner", "Intermediate", "Advanced"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-white text-black shadow-xs font-black"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
            title="Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2x2 Grid of Cards with Tactile 3D Vector Illustrations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <Link
            key={item.id}
            href={`/learn#${item.slug}`}
            className="relative overflow-hidden rounded-[28px] bg-[#fbfcfd] hover:bg-white border border-neutral-200/90 p-5 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] group flex flex-col justify-between min-h-[148px]"
          >
            {/* Organic Pastel Cutout Puddle in Bottom-Right */}
            <div
              className="absolute -bottom-10 -right-10 w-28 h-28 rounded-[48%] opacity-70 group-hover:scale-115 transition-transform duration-500 pointer-events-none"
              style={{ backgroundColor: item.bgPastel }}
            />

            {/* Card Body */}
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="space-y-1.5 max-w-[210px]">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
                  {item.type === "Course" ? (
                    <BookOpen className="w-3 h-3 text-neutral-600" />
                  ) : (
                    <Swords className="w-3 h-3 text-purple-600" />
                  )}
                  <span>{item.type}</span>
                </span>

                <h4 className="text-sm font-black text-black leading-snug group-hover:text-neutral-700 transition-colors">
                  {item.title}
                </h4>
              </div>

              {/* 3D Claymorphic Vector Art Container */}
              <div className="shrink-0 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                {item.component}
              </div>
            </div>

            {/* Bottom Metadata Pill */}
            <div className="relative z-10 pt-4 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/95 border border-neutral-200 text-neutral-700 text-[10px] font-mono font-bold shadow-2xs">
                {item.level}
              </span>
              <span className="text-[11px] font-mono text-neutral-500 font-semibold">
                &bull; {item.meta}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Link to Full Catalog */}
      <div className="pt-2 text-center">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-black transition-colors group"
        >
          <span>See all courses</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
