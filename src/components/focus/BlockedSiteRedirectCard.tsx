"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  Lock, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  BookOpen 
} from "lucide-react";

interface BlockedSiteRedirectCardProps {
  blockedDomain: string;
  remainingSeconds: number;
  subjectName?: string;
  subjectHref?: string;
  onClearQuery: () => void;
}

export default function BlockedSiteRedirectCard({
  blockedDomain,
  remainingSeconds,
  subjectName = "Active Learning Block",
  subjectHref = "/dsa",
  onClearQuery,
}: BlockedSiteRedirectCardProps) {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="p-6 sm:p-10 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs text-center max-w-xl mx-auto space-y-6">
      
      {/* Icon Capsule */}
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
        <Lock className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-center">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 border border-rose-200 text-rose-800">
            Access Restricted
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
          {blockedDomain} is Locked!
        </h2>

        <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed max-w-md mx-auto">
          You set an active study timer on EdWorld. Social media and entertainment apps are blocked until your learning session is complete.
        </p>
      </div>

      {/* Countdown Card */}
      <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] inline-flex items-center gap-4 text-xs font-mono text-[#111827]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-rose-600 animate-pulse" />
          <span className="text-[#6B7280]">Timer Remaining:</span>
        </div>
        <span className="text-base font-bold px-3 py-1 rounded-lg bg-white border border-[#E5E7EB]">
          {remainingSeconds > 0 ? formatTime(remainingSeconds) : "Session Finishing..."}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href={subjectHref}
          onClick={onClearQuery}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#111827] hover:bg-black text-white font-bold text-xs sm:text-sm shadow-xs transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Resume Study Target ({subjectName})</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </Link>

        <button
          onClick={onClearQuery}
          className="px-4 py-2 text-xs text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
        >
          Dismiss Alert
        </button>
      </div>

    </div>
  );
}
