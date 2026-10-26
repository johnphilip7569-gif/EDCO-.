"use client";

import React from "react";
import Link from "next/link";
import { SlidersHorizontal, Star } from "lucide-react";

export default function FigmaPopularCoursesGrid() {
  const courses = [
    {
      id: "1",
      title: "Language Modeling",
      rating: "4.8",
      slug: "technical-writing-documentation",
      bgPastel: "bg-[#ffe4e6] hover:bg-[#fecdd3]",
      borderPastel: "border-rose-200/80",
      illustration: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-sm">
          {/* Pink Cosmic Nebula Oval */}
          <ellipse cx="50" cy="50" rx="36" ry="24" fill="#f43f5e" fillOpacity="0.85" transform="rotate(-25 50 50)" />
          {/* Rocket Fuselage */}
          <g transform="rotate(-35 50 50)">
            {/* Rocket Body */}
            <path d="M50 18 C44 26 42 56 42 68 L58 68 C58 56 56 26 50 18 Z" fill="#ffffff" />
            {/* Nose Cone */}
            <path d="M50 18 C46 24 45 30 45 34 L55 34 C55 30 54 24 50 18 Z" fill="#6366f1" />
            {/* Window */}
            <circle cx="50" cy="42" r="5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
            {/* Wings */}
            <polygon points="42,54 32,66 42,66" fill="#ef4444" />
            <polygon points="58,54 68,66 58,66" fill="#ef4444" />
            {/* Flame */}
            <polygon points="46,68 50,82 54,68" fill="#facc15" />
          </g>
        </svg>
      ),
    },
    {
      id: "2",
      title: "Computer Science",
      rating: "4.8",
      slug: "fullstack-nextjs-typescript",
      bgPastel: "bg-[#fef3c7] hover:bg-[#fde68a]",
      borderPastel: "border-amber-200/80",
      illustration: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-sm">
          {/* Laptop Base */}
          <polygon points="26,68 74,68 80,73 20,73" fill="#94a3b8" />
          {/* Screen Shell */}
          <rect x="30" y="36" width="40" height="28" rx="3" fill="#1e293b" />
          <rect x="33" y="39" width="34" height="22" rx="1.5" fill="#38bdf8" />
          {/* Code text on screen */}
          <line x1="36" y1="45" x2="52" y2="45" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="36" y1="50" x2="60" y2="50" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          {/* Desk Lamp (Red) */}
          <path d="M22 68 L22 38 L30 32" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="28,28 38,34 32,38" fill="#f87171" />
        </svg>
      ),
    },
    {
      id: "3",
      title: "AI Fundamentals",
      rating: "4.8",
      slug: "ai-prompt-engineering",
      bgPastel: "bg-[#e0e7ff] hover:bg-[#c7d2fe]",
      borderPastel: "border-indigo-200/80",
      illustration: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-sm">
          {/* Book Isometric Tilted */}
          <g transform="rotate(-8 50 50)">
            <rect x="32" y="24" width="38" height="52" rx="4" fill="#4f46e5" />
            <rect x="36" y="24" width="34" height="52" rx="3" fill="#6366f1" />
            {/* Spine */}
            <rect x="32" y="24" width="5" height="52" rx="2" fill="#3730a3" />
            {/* Title Band */}
            <rect x="39" y="32" width="28" height="8" rx="2" fill="#ffffff" />
            <text x="53" y="37.5" fill="#4338ca" fontSize="4.5" fontWeight="bold" textAnchor="middle">AI Science</text>
            {/* Atomic Ring Icon on cover */}
            <circle cx="53" cy="56" r="3" fill="#facc15" />
            <ellipse cx="53" cy="56" rx="8" ry="3.5" fill="none" stroke="#ffffff" strokeWidth="1" transform="rotate(35 53 56)" />
            <ellipse cx="53" cy="56" rx="8" ry="3.5" fill="none" stroke="#ffffff" strokeWidth="1" transform="rotate(-35 53 56)" />
          </g>
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-3.5">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-black tracking-tight">
          Popular courses
        </h3>

        <button
          type="button"
          className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
          title="Filter Courses"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Pastel Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/learn#${course.slug}`}
            className="group flex flex-col items-center justify-between text-center space-y-2"
          >
            {/* Illustration Card Container */}
            <div
              className={`w-full aspect-[4/3] rounded-[26px] ${course.bgPastel} border ${course.borderPastel} flex items-center justify-center p-3 shadow-2xs group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1`}
            >
              <div className="transform transition-transform duration-300 group-hover:scale-110">
                {course.illustration}
              </div>
            </div>

            {/* Title & Rating */}
            <div className="space-y-0.5 w-full text-left sm:text-center px-1">
              <h4 className="text-xs font-black text-black group-hover:text-indigo-600 transition-colors truncate">
                {course.title}
              </h4>
              <div className="flex items-center sm:justify-center gap-1 text-[11px] font-mono font-bold text-neutral-600">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                <span>{course.rating}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
