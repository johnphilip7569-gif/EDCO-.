"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  RotateCw, 
  Download, 
  Plus, 
  LayoutGrid, 
  Zap, 
  GraduationCap
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface FigmaTopBarProps {
  onRefresh?: () => void;
  onExport?: () => void;
  onOpenDirectory?: () => void;
  lessonsRemaining?: number;
}

export default function FigmaTopBar({
  onRefresh,
  onExport,
  onOpenDirectory,
  lessonsRemaining = 2,
}: FigmaTopBarProps) {
  const { user, profile } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const displayName = (user?.name || profile?.name || "Liam").split(" ")[0];

  // Dynamic Date string matching reference format: "5 September, 2 lessons for today"
  const today = new Date();
  const dateFormatted = today.toLocaleDateString("en-US", { day: "numeric", month: "long" });

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleExportClick = () => {
    if (onExport) {
      onExport();
    } else if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100/90 select-none">
      
      {/* Left: Brand Crest & Friendly Greeting */}
      <div className="flex items-center gap-3.5">
        
        {/* Purple Crest Emblem matching reference UI */}
        <Link
          href="/dashboard"
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5B47B8] via-[#6351C9] to-[#7360E0] flex items-center justify-center text-white shadow-[0_8px_20px_rgba(91,71,184,0.35)] shrink-0 hover:scale-105 transition-transform relative overflow-hidden group"
          title="EdWorld Co."
        >
          {/* Subtle concentric crest line overlay */}
          <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />
          <GraduationCap className="w-6 h-6 text-white group-hover:rotate-6 transition-transform" />
        </Link>

        {/* Greeting & Date */}
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight leading-none">
            Hello, {displayName}
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            <span>{dateFormatted}, </span>
            <span className="text-[#5B47B8] font-bold">{lessonsRemaining} lessons for today</span>
          </p>
        </div>

      </div>

      {/* Right: Actions Cluster matching reference UI */}
      <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
        
        {/* Refresh Data Pill */}
        <button
          type="button"
          onClick={handleRefreshClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-neutral-50 border border-[#E5E7EB] text-xs font-semibold text-[#1F2937] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.06)] active:scale-95 cursor-pointer"
          title="Refresh Data"
        >
          <RotateCw className={`w-3.5 h-3.5 text-neutral-500 ${isRefreshing ? "animate-spin text-[#5B47B8]" : ""}`} />
          <span>Refresh data</span>
        </button>

        {/* Export Pill */}
        <button
          type="button"
          onClick={handleExportClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-neutral-50 border border-[#E5E7EB] text-xs font-semibold text-[#1F2937] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.06)] active:scale-95 cursor-pointer"
          title="Export Workspace Data"
        >
          <Download className="w-3.5 h-3.5 text-neutral-500" />
          <span>Export</span>
        </button>

        {/* Plus Action Circle */}
        <Link
          href="/learn"
          className="w-9 h-9 rounded-full bg-[#18181B] hover:bg-black text-white flex items-center justify-center transition-all shadow-[0_2px_8px_rgba(0,0,0,0.18)] active:scale-95 cursor-pointer shrink-0"
          title="Add New Quest / Course"
        >
          <Plus className="w-4 h-4" />
        </Link>

        {/* Grid Apps Trigger (::) */}
        <button
          type="button"
          onClick={onOpenDirectory}
          className="w-9 h-9 rounded-full bg-[#F3F4F6] hover:bg-white border border-[#E5E7EB] text-[#4B5563] hover:text-[#111827] flex items-center justify-center transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:scale-95 cursor-pointer shrink-0"
          title="All Tools & Directory"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        {/* Circular Avatar with Orange Energy Ring */}
        <Link
          href="/profile"
          className="relative pl-1 group cursor-pointer"
          title="View Profile & Account"
        >
          <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#F59E0B] via-[#FB923C] to-[#EA580C] shadow-xs flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#18181B] text-white flex items-center justify-center text-xs font-black font-mono">
              {(displayName[0] || "U").toUpperCase()}
            </div>
            {/* Energy Lightning Badge */}
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white shadow-xs flex items-center justify-center border border-white">
              <Zap className="w-2.5 h-2.5 fill-[#F59E0B] text-[#F59E0B]" />
            </div>
          </div>
        </Link>

      </div>

    </header>
  );
}
