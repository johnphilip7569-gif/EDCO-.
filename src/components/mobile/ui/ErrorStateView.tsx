"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { MobileButton } from "./MobileButton";
import { cn } from "@/lib/utils";

export interface ErrorStateViewProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorStateView: React.FC<ErrorStateViewProps> = ({
  title = "Something went wrong",
  description = "We couldn't load the opportunities right now. Please check your connection and try again.",
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-6 min-h-[300px] select-none",
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center mb-4 shadow-sm">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-[280px] mt-1.5 leading-relaxed">
        {description}
      </p>

      {onRetry && (
        <div className="mt-5 w-full max-w-[200px]">
          <MobileButton
            variant="primary"
            size="md"
            fullWidth
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Retry Now
          </MobileButton>
        </div>
      )}
    </div>
  );
};
