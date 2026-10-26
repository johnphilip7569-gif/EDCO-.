"use client";

import React from "react";
import { EdworldFeatureItem } from "@/lib/mobile-design-tokens";
import { Layers, Video, FileText, Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EdworldFeatureCardProps {
  feature: EdworldFeatureItem;
  variant?: "tile" | "banner";
  onLaunch?: (feature: EdworldFeatureItem) => void;
  className?: string;
}

export const EdworldFeatureCard: React.FC<EdworldFeatureCardProps> = ({
  feature,
  variant = "tile",
  onLaunch,
  className,
}) => {
  const getIcon = () => {
    switch (feature.iconName) {
      case "Layers":
        return <Layers className="w-5 h-5" />;
      case "Video":
        return <Video className="w-5 h-5" />;
      case "FileText":
        return <FileText className="w-5 h-5" />;
      case "Sparkles":
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const badgeColorMap = {
    indigo: "bg-[#3D3BF3]/10 text-[#3D3BF3] dark:bg-[#3D3BF3]/25 dark:text-[#7A78FF]",
    orange: "bg-[#FF6B00]/10 text-[#FF6B00] dark:bg-[#FF6B00]/25 dark:text-[#FFA057]",
    gold: "bg-[#FFB800]/15 text-[#B45309] dark:bg-[#FFB800]/25 dark:text-[#FDE047]",
    emerald: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-400",
  }[feature.badgeColor];

  const iconBgMap = {
    indigo: "bg-indigo-100 text-[#3D3BF3] dark:bg-indigo-950/80 dark:text-[#5856FF]",
    orange: "bg-orange-100 text-[#FF6B00] dark:bg-orange-950/80 dark:text-[#FF6B00]",
    gold: "bg-amber-100 text-[#B45309] dark:bg-amber-950/80 dark:text-[#FFB800]",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400",
  }[feature.badgeColor];

  if (variant === "tile") {
    return (
      <div
        onClick={() => onLaunch?.(feature)}
        className={cn(
          "group relative flex flex-col justify-between p-3.5 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800",
          "shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98]",
          "min-w-[140px] flex-shrink-0",
          className
        )}
      >
        <div className="flex items-center justify-between gap-1 mb-2">
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", iconBgMap)}>
            {getIcon()}
          </div>
          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md", badgeColorMap)}>
            {feature.badge}
          </span>
        </div>

        <div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#3D3BF3] dark:group-hover:text-[#5856FF] transition-colors leading-tight">
            {feature.name}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
            {feature.tagline}
          </p>
        </div>
      </div>
    );
  }

  // Banner variant
  return (
    <div
      onClick={() => onLaunch?.(feature)}
      className={cn(
        "group relative p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800",
        "shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99]",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5", iconBgMap)}>
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#3D3BF3] dark:group-hover:text-[#5856FF] transition-colors">
              {feature.name}
            </h4>
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md", badgeColorMap)}>
              {feature.badge}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
            {feature.description}
          </p>

          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {feature.metrics}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#3D3BF3] dark:text-[#5856FF] group-hover:translate-x-0.5 transition-transform">
              Launch <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
