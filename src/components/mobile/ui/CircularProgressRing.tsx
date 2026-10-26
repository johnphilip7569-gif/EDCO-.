"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";

export interface CircularProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  onCompleteClick?: () => void;
  className?: string;
}

export const CircularProgressRing: React.FC<CircularProgressRingProps> = ({
  percentage = 70,
  size = 72,
  strokeWidth = 6,
  onCompleteClick,
  className,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={cn(
        "flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-white to-orange-50/60 dark:from-indigo-950/40 dark:via-[#161922] dark:to-orange-950/30 border border-indigo-100 dark:border-indigo-900/50 shadow-sm",
        className
      )}
    >
      {/* SVG Ring */}
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-800"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            fill="transparent"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3D3BF3" />
              <stop offset="100%" stopColor="#FF6B00" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center percentage label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Info & action CTA */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Profile Strength
          </span>
          <span className="text-[10px] font-semibold text-[#FF6B00] bg-[#FF6B00]/10 px-1.5 py-0.2 rounded">
            +30% left
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
          Add experience and portfolio link to reach 100%
        </p>
        <button
          type="button"
          onClick={onCompleteClick}
          className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#3D3BF3] dark:text-[#5856FF] hover:underline cursor-pointer group"
        >
          <span>Complete now</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
