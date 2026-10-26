"use client";

import React, { useState } from "react";
import { OpportunityItem } from "@/lib/mobile-design-tokens";
import { Bookmark, Clock, Users, CheckCircle2, Share2, Flame, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OpportunityCardProps {
  opportunity: OpportunityItem;
  onBookmarkToggle?: (id: string, isBookmarked: boolean) => void;
  onClick?: (opportunity: OpportunityItem) => void;
  className?: string;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onBookmarkToggle,
  onClick,
  className,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(opportunity.bookmarked || false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    onBookmarkToggle?.(opportunity.id, nextState);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: opportunity.title,
        text: `Check out ${opportunity.title} on EdWorld!`,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  // Type badge styling
  const typeBadgeStyles = {
    hackathon: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
    competition: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    internship: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    job: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    course: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300",
    mentorship: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
  }[opportunity.type];

  return (
    <div
      onClick={() => onClick?.(opportunity)}
      className={cn(
        "group relative bg-white dark:bg-[#161922] rounded-2xl border border-slate-100 dark:border-slate-800/80",
        "p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
        "transition-all duration-200 hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50 cursor-pointer",
        className
      )}
    >
      {/* Top row: Organizer + Type Badge + Bookmark */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg flex-shrink-0 border border-slate-200/60 dark:border-slate-700">
            {opportunity.organizerLogo}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                {opportunity.organizer}
              </span>
              {opportunity.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3D3BF3] dark:text-[#5856FF] flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                  typeBadgeStyles
                )}
              >
                {opportunity.type}
              </span>
              {opportunity.featured && (
                <span className="text-[10px] font-bold bg-[#FF6B00]/10 text-[#FF6B00] dark:bg-[#FF6B00]/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Flame className="w-3 h-3" /> Featured
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center -mr-1">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Share opportunity"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleBookmark}
            className={cn(
              "p-2 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center",
              isBookmarked
                ? "text-[#FF6B00] dark:text-[#FF6B00]"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            )}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark opportunity"}
          >
            <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-2.5 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-[#3D3BF3] dark:group-hover:text-[#5856FF] transition-colors">
        {opportunity.title}
      </h3>

      {/* Tags row */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {opportunity.tags.slice(0, 3).map((tag, idx) => (
          <span
            key={idx}
            className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Prize / Stipend Highlight Banner */}
      <div className="mt-3 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-50/70 to-orange-50/40 dark:from-indigo-950/40 dark:to-orange-950/20 border border-indigo-100/60 dark:border-indigo-900/40 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {opportunity.type === "internship" || opportunity.type === "job" ? "Stipend / CTC" : "Prize Pool"}
        </span>
        <span className="text-xs sm:text-sm font-extrabold text-[#3D3BF3] dark:text-[#5856FF]">
          {opportunity.prizeOrStipend}
        </span>
      </div>

      {/* Card Footer: Deadline & Registrations */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <Clock className={cn("w-3.5 h-3.5", opportunity.deadlineDays <= 2 ? "text-[#FF6B00]" : "text-slate-400")} />
          <span className={cn(opportunity.deadlineDays <= 2 && "text-[#FF6B00] font-semibold")}>
            {opportunity.deadlineText}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>{opportunity.registrations.toLocaleString()} registered</span>
        </div>
      </div>
    </div>
  );
};
