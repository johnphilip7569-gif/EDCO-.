"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "flat" | "bordered" | "gradient";
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
}

export const MobileCard = React.forwardRef<HTMLDivElement, MobileCardProps>(
  ({ className, variant = "default", padding = "md", interactive = false, children, ...props }, ref) => {
    const baseClasses =
      "rounded-2xl transition-all duration-200 overflow-hidden relative";

    const paddingClasses = {
      none: "p-0",
      sm: "p-3",
      md: "p-4",
      lg: "p-5",
    }[padding];

    const variantClasses = {
      default:
        "bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
      elevated:
        "bg-white dark:bg-[#161922] border border-slate-100/80 dark:border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]",
      flat:
        "bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60",
      bordered:
        "bg-transparent border-2 border-slate-200 dark:border-slate-700/80",
      gradient:
        "bg-gradient-to-br from-indigo-50/70 via-white to-orange-50/50 dark:from-[#161922] dark:via-[#1a1e2b] dark:to-[#161922] border border-indigo-100/60 dark:border-indigo-900/40 shadow-sm",
    }[variant];

    const interactiveClasses = interactive
      ? "active:scale-[0.985] cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800/60 transition-transform"
      : "";

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses, paddingClasses, interactiveClasses, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MobileCard.displayName = "MobileCard";
