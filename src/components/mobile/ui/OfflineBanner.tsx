"use client";

import React, { useState } from "react";
import { WifiOff, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OfflineBannerProps {
  onRetry?: () => void;
  className?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ onRetry, className }) => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      onRetry?.();
    }, 700);
  };

  return (
    <div
      role="alert"
      className={cn(
        "w-full bg-slate-900 text-white px-3.5 py-2.5 flex items-center justify-between shadow-md text-xs z-30 animate-in slide-in-from-top duration-200 border-b border-slate-800",
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
          <WifiOff className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <span className="font-bold block text-slate-100">You're offline</span>
          <span className="text-[11px] text-slate-400 truncate block">
            Showing cached data. Reconnecting...
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleRetry}
        disabled={retrying}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold min-h-[44px] cursor-pointer text-xs flex-shrink-0 transition-colors"
      >
        <RefreshCw className={cn("w-3.5 h-3.5", retrying && "animate-spin text-[#FF6B00]")} />
        <span>{retrying ? "Checking..." : "Retry"}</span>
      </button>
    </div>
  );
};
