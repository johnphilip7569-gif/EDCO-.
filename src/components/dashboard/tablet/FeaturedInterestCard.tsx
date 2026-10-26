"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";

export default function FeaturedInterestCard() {
  return (
    <div className="rounded-xl bg-[#111827] text-white p-6 shadow-xs flex flex-col justify-between select-none w-full border border-gray-800 h-full">
      <div>
        <div className="text-xs font-semibold tracking-wider uppercase text-blue-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Recommended Track</span>
        </div>

        <div className="mt-3">
          <span className="inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-gray-800 text-gray-300 border border-gray-700">
            Computer Science • Cloud &amp; Microservices
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-white mt-3.5 leading-snug">
          Cloud &amp; Distributed Systems Architecture
        </h3>

        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          Master containerization, horizontal scalability, event-driven pipelines, and resilient distributed databases.
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-800">
        <Link
          href="/learn"
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium py-2.5 px-4 rounded-lg transition-colors duration-150 flex items-center justify-center gap-1.5 shadow-xs"
        >
          <span>Explore Curriculum</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
