"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

interface LessonItem {
  id: string;
  lessonNumber: string;
  lessonTitle: string;
  courseTitle: string;
  instructor: string;
  duration: string;
  href: string;
}

export default function NextLessonsSection() {
  const lessons: LessonItem[] = [
    {
      id: "lesson-1",
      lessonNumber: "01",
      lessonTitle: "Algorithmic Complexity & Profiling Patterns",
      courseTitle: "Data Structures & Algorithmic Patterns",
      instructor: "Engineering Faculty",
      duration: "25 min",
      href: "/learn",
    },
    {
      id: "lesson-2",
      lessonNumber: "02",
      lessonTitle: "Partitioning & Sharding in Distributed Databases",
      courseTitle: "Cloud & Distributed Systems Architecture",
      instructor: "System Design Faculty",
      duration: "40 min",
      href: "/learn",
    },
    {
      id: "lesson-3",
      lessonNumber: "03",
      lessonTitle: "STAR Communication for Technical Behavioral Rounds",
      courseTitle: "Placement Readiness & Technical Pitching",
      instructor: "Career Mentor",
      duration: "30 min",
      href: "/interviews",
    },
    {
      id: "lesson-4",
      lessonNumber: "04",
      lessonTitle: "Mitigating Deadlocks & Race Conditions with Redis",
      courseTitle: "High-Concurrency Backend Engineering",
      instructor: "Distributed Systems Faculty",
      duration: "35 min",
      href: "/edfix",
    },
  ];

  return (
    <div className="rounded-xl bg-white border border-[#E5E7EB] p-6 shadow-xs select-none flex-1 flex flex-col justify-between">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
        <div>
          <h3 className="text-lg font-bold text-[#111827] tracking-tight">
            Upcoming Lessons &amp; Incident Drills
          </h3>
          <p className="text-xs text-[#6B7280] mt-0.5">Resume your scheduled curriculum</p>
        </div>
        <Link
          href="/learn"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. Column Header */}
      <div className="grid grid-cols-12 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider py-2.5 px-2 border-b border-[#E5E7EB]">
        <span className="col-span-7 sm:col-span-6">Lesson</span>
        <span className="col-span-3 sm:col-span-4">Track</span>
        <span className="col-span-2 sm:col-span-2 text-right">Duration</span>
      </div>

      {/* 3. Lesson Row List */}
      <div className="divide-y divide-[#E5E7EB]">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={lesson.href}
            className="grid grid-cols-12 items-center py-3 px-2 hover:bg-[#F7F8FA] rounded-lg transition-colors duration-150 group cursor-pointer"
          >
            {/* Number + Title */}
            <div className="col-span-7 sm:col-span-6 flex items-center gap-3 pr-2 min-w-0">
              <span className="w-7 h-7 rounded-md bg-[#F7F8FA] border border-[#E5E7EB] group-hover:bg-[#2563EB] group-hover:text-white text-[#111827] flex items-center justify-center text-xs font-mono font-semibold shrink-0 transition-colors">
                {lesson.lessonNumber}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#111827] group-hover:text-[#2563EB] truncate transition-colors">
                  {lesson.lessonTitle}
                </p>
                <p className="text-[11px] text-[#6B7280] truncate">
                  {lesson.courseTitle}
                </p>
              </div>
            </div>

            {/* Track / Instructor */}
            <div className="col-span-3 sm:col-span-4">
              <span className="text-xs text-[#6B7280] truncate block">
                {lesson.instructor}
              </span>
            </div>

            {/* Duration */}
            <div className="col-span-2 sm:col-span-2 text-right flex items-center justify-end gap-1 text-[11px] font-medium text-[#6B7280]">
              <Clock className="w-3 h-3 text-[#6B7280] hidden sm:inline" />
              <span>{lesson.duration}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
