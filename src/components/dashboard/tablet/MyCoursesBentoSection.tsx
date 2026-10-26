"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark, ArrowRight } from "lucide-react";

interface CourseCardData {
  id: string;
  category: string;
  title: string;
  progressCurrent: number;
  progressTotal: number;
  slug: string;
}

export default function MyCoursesBentoSection() {
  const [activeFilter, setActiveFilter] = useState("All courses");

  const filterTabs = ["All courses", "Computer Science", "Engineering", "Artificial Intelligence"];

  const courses: CourseCardData[] = [
    {
      id: "course-1",
      category: "Computer Science",
      title: "Data Structures & Algorithmic Patterns",
      progressCurrent: 14,
      progressTotal: 20,
      slug: "/learn",
    },
    {
      id: "course-2",
      category: "Engineering",
      title: "Full-Stack System Architecture & Cloud",
      progressCurrent: 8,
      progressTotal: 18,
      slug: "/learn",
    },
    {
      id: "course-3",
      category: "Artificial Intelligence",
      title: "Machine Learning & Vector Search Systems",
      progressCurrent: 6,
      progressTotal: 15,
      slug: "/learn",
    },
  ];

  const filteredCourses =
    activeFilter === "All courses"
      ? courses
      : courses.filter((c) => c.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section className="space-y-4 select-none">
      {/* 1. Header with Title & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            My Courses
          </h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Continue structured tracks with personalized milestone progress.
          </p>
        </div>

        {/* Filter Pills with Minimal Styling */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#2563EB] text-white"
                    : "bg-white hover:bg-[#F7F8FA] text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB]"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 3 Clean Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredCourses.map((course) => {
          const percent = Math.round((course.progressCurrent / course.progressTotal) * 100);

          return (
            <div
              key={course.id}
              className="rounded-xl p-5 bg-white border border-[#E5E7EB] shadow-xs flex flex-col justify-between relative group hover:border-gray-400 hover:shadow-xs transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-[#E5E7EB] bg-[#F7F8FA] text-[#6B7280]">
                    {course.category}
                  </span>

                  <button
                    type="button"
                    className="w-7 h-7 rounded-md flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FA] transition-colors cursor-pointer"
                    title="Bookmark course"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="my-3">
                  <h3 className="text-base font-semibold text-[#111827] group-hover:text-[#2563EB] transition-colors leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="text-xs text-[#6B7280] mt-1.5">
                    {course.progressCurrent} of {course.progressTotal} modules completed
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#E5E7EB]">
                {/* Thin Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <span>Progress</span>
                    <span className="font-semibold text-[#111827]">{percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2563EB] rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <Link
                  href={course.slug}
                  className="w-full bg-[#F7F8FA] hover:bg-gray-100 text-[#111827] border border-[#E5E7EB] text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-150 flex items-center justify-center gap-1.5 group/btn"
                >
                  <span>Continue Learning</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
