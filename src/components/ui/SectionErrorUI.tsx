"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface SectionErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  sectionName: string;
  returnHref?: string;
  returnLabel?: string;
}

export function SectionErrorUI({
  error,
  reset,
  sectionName,
  returnHref = "/dashboard",
  returnLabel = "Back to Dashboard",
}: SectionErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      console.error(`[${sectionName} Error]:`, error?.digest ?? "no-digest");
    } else {
      console.error(`[${sectionName} Error]:`, error);
    }
  }, [error, sectionName]);

  const safeRef =
    process.env.NODE_ENV !== "production" && error?.message
      ? error.message
      : error?.digest
      ? `Ref: ${error.digest}`
      : null;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8ECF2] shadow-xl p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-[#FFEFEA] border border-[#FF7A50]/20 text-[#FF7A50] flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-wider text-[#8E95A5]">
            {sectionName}
          </p>
          <h2 className="text-xl font-black text-[#13141B] tracking-tight">
            Something went wrong
          </h2>
          <p className="text-xs text-[#5E6573] leading-relaxed">
            This section encountered an unexpected error. Your data is safe — try again or return to your dashboard.
          </p>
        </div>

        {safeRef && (
          <p className="text-[10px] font-mono text-[#8E95A5] bg-[#F4F6FB] rounded-xl px-3 py-2 border border-[#E8ECF2]">
            {safeRef}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#13141B] hover:bg-[#2A2C38] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link
            href={returnHref}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-[#13141B] font-bold text-xs border border-[#E8ECF2] flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Home className="w-3.5 h-3.5 text-[#8E95A5]" />
            {returnLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
