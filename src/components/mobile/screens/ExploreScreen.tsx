"use client";

import React, { useState, useMemo } from "react";
import {
  MOCK_OPPORTUNITIES,
  EDWORLD_CORE_FEATURES,
  RECENT_SEARCHES,
  TRENDING_KEYWORDS,
  OpportunityItem,
  EdworldFeatureItem,
} from "@/lib/mobile-design-tokens";
import { OpportunityCard } from "../ui/OpportunityCard";
import { EdworldFeatureCard } from "../ui/EdworldFeatureCard";
import { MobileChip } from "../ui/MobileChip";
import { FilterBottomSheet, FilterState, DEFAULT_FILTERS } from "../ui/FilterBottomSheet";
import {
  Search,
  Compass,
  SlidersHorizontal,
  Clock,
  TrendingUp,
  RotateCcw,
  Sparkles,
  SearchX,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExploreScreenProps {
  onFeatureLaunch: (feature: EdworldFeatureItem) => void;
  onOpportunityClick: (opp: OpportunityItem) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onFeatureLaunch,
  onOpportunityClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [selectedQuickCategory, setSelectedQuickCategory] = useState<string>("all");

  const quickCategories = [
    { id: "all", label: "All" },
    { id: "studios", label: "EdWorld Studios" },
    { id: "hackathon", label: "Hackathons" },
    { id: "internship", label: "Internships" },
    { id: "job", label: "Tech Jobs" },
  ];

  const activeFilterCount =
    filters.type.length +
    filters.location.length +
    filters.eligibility.length +
    (filters.prizeRange !== "all" ? 1 : 0) +
    (filters.deadline !== "all" ? 1 : 0) +
    (filters.isFreeOnly ? 1 : 0);

  // Filtered & sorted opportunities
  const filteredOpps = useMemo(() => {
    let result = [...MOCK_OPPORTUNITIES];

    // Quick category
    if (selectedQuickCategory !== "all" && selectedQuickCategory !== "studios") {
      result = result.filter((opp) => opp.type === selectedQuickCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (opp) =>
          opp.title.toLowerCase().includes(q) ||
          opp.organizer.toLowerCase().includes(q) ||
          opp.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter sheet - type
    if (filters.type.length > 0) {
      result = result.filter((opp) => filters.type.includes(opp.type));
    }

    // Filter sheet - location
    if (filters.location.length > 0) {
      result = result.filter((opp) =>
        filters.location.some((loc) =>
          opp.location.toLowerCase().includes(loc.toLowerCase().split(" ")[0])
        )
      );
    }

    // Filter sheet - deadline
    if (filters.deadline === "24h") {
      result = result.filter((opp) => opp.deadlineDays <= 1);
    } else if (filters.deadline === "3d") {
      result = result.filter((opp) => opp.deadlineDays <= 3);
    } else if (filters.deadline === "week") {
      result = result.filter((opp) => opp.deadlineDays <= 7);
    }

    // Sort By
    if (filters.sortBy === "newest") {
      result.sort((a, b) => b.id.localeCompare(a.id));
    } else if (filters.sortBy === "closing_soon") {
      result.sort((a, b) => a.deadlineDays - b.deadlineDays);
    } else if (filters.sortBy === "popular") {
      result.sort((a, b) => b.registrations - a.registrations);
    }

    return result;
  }, [searchQuery, filters, selectedQuickCategory]);

  return (
    <div className="flex flex-col h-full bg-[#F8F9FD] dark:bg-[#0E1017] select-none overflow-y-auto pb-10">
      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filters={filters}
        onApply={(f) => setFilters(f)}
      />

      {/* Top Header & Search Bar */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#161922]/95 backdrop-blur-md px-4 pt-3 pb-3 border-b border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-[#3D3BF3] dark:text-[#5856FF] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
                Explore & Search
              </h2>
              <p className="text-[10px] text-slate-400">
                Find verified hackathons, internships & studios
              </p>
            </div>
          </div>
        </div>

        {/* Search input + Filter button */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-xl px-3 py-2 border border-transparent focus-within:border-[#3D3BF3] focus-within:bg-white dark:focus-within:bg-[#161922] transition-colors">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0 mr-2" />
            <input
              type="text"
              placeholder="Search hackathons, DSA, jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(true)}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 relative cursor-pointer",
              activeFilterCount > 0
                ? "bg-[#3D3BF3] text-white shadow-md shadow-[#3D3BF3]/25"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            )}
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF6B00] text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white dark:ring-[#161922]">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick category pills */}
        <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {quickCategories.map((c) => (
            <MobileChip
              key={c.id}
              label={c.label}
              active={selectedQuickCategory === c.id}
              onClick={() => setSelectedQuickCategory(c.id)}
              size="sm"
            />
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Recent & Trending Searches (only when not searching) */}
        {!searchQuery && (
          <div className="space-y-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-xs">
            {/* Recent Searches */}
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
                <Clock className="w-3 h-3" />
                <span>Recent Searches</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {RECENT_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Keywords */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-[#FF6B00] text-[11px] font-bold uppercase tracking-wider mb-2">
                <TrendingUp className="w-3 h-3" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TRENDING_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => setSearchQuery(kw)}
                    className="text-xs bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 text-[#FF6B00] dark:text-[#FFA057] px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    #{kw}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Signature EdWorld Studios Section */}
        {(selectedQuickCategory === "all" || selectedQuickCategory === "studios") && !searchQuery && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Signature EdWorld Studios
              </h3>
              <span className="text-[11px] font-bold text-[#3D3BF3] dark:text-[#5856FF]">
                Included Free
              </span>
            </div>

            <div className="space-y-3">
              {EDWORLD_CORE_FEATURES.map((feature) => (
                <EdworldFeatureCard
                  key={feature.id}
                  feature={feature}
                  variant="banner"
                  onLaunch={onFeatureLaunch}
                />
              ))}
            </div>
          </div>
        )}

        {/* Opportunities List or Empty State */}
        {selectedQuickCategory !== "studios" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {searchQuery ? `Search Results (${filteredOpps.length})` : `All Listings (${filteredOpps.length})`}
              </h3>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="text-xs text-[#3D3BF3] dark:text-[#5856FF] font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>

            {filteredOpps.length > 0 ? (
              <div className="space-y-3">
                {filteredOpps.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    onClick={onOpportunityClick}
                  />
                ))}
              </div>
            ) : (
              /* No Results Empty State */
              <div className="p-8 text-center bg-white dark:bg-[#161922] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
                  <SearchX className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  No opportunities match your criteria
                </h4>
                <p className="text-xs text-slate-500 max-w-[240px] mt-1 leading-relaxed">
                  Try adjusting your filters, clearing your search query, or exploring our signature studios.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setFilters(DEFAULT_FILTERS);
                    setSelectedQuickCategory("all");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#3D3BF3] text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
