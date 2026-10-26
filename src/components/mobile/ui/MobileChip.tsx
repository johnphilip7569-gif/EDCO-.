"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface MobileChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
  icon?: React.ReactNode;
  variant?: "default" | "accent" | "outline";
  size?: "sm" | "md";
  className?: string;
  disabled?: boolean;
}

export const MobileChip: React.FC<MobileChipProps> = ({
  label,
  active = false,
  onClick,
  count,
  icon,
  variant = "default",
  size = "md",
  className,
  disabled = false,
}) => {
  const baseClasses =
    "inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-150 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D3BF3]";

  const sizeClasses =
    size === "sm"
      ? "text-xs px-3 py-1.5 min-h-[36px]"
      : "text-xs sm:text-sm px-4 py-2 min-h-[44px]";

  let stateClasses = "";
  if (active) {
    if (variant === "accent") {
      stateClasses =
        "bg-[#FF6B00] text-white shadow-sm shadow-[#FF6B00]/30 hover:bg-[#E05E00]";
    } else {
      stateClasses =
        "bg-[#3D3BF3] text-white shadow-sm shadow-[#3D3BF3]/30 hover:bg-[#2E2CD4]";
    }
  } else {
    stateClasses =
      "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-200 border border-transparent dark:border-slate-700/60";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, sizeClasses, stateClasses, disabled && "opacity-50 cursor-not-allowed", className)}
    >
      {icon && <span className="flex-shrink-0 text-current">{icon}</span>}
      <span className="truncate">{label}</span>
      {typeof count === "number" && (
        <span
          className={cn(
            "ml-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-full",
            active
              ? "bg-white/20 text-white"
              : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
};
