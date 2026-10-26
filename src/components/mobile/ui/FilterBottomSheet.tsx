"use client";

import React, { useState } from "react";
import { X, Check, SlidersHorizontal, RotateCcw } from "lucide-react";
import { MobileButton } from "./MobileButton";
import { cn } from "@/lib/utils";

export interface FilterState {
  type: string[];
  location: string[];
  eligibility: string[];
  prizeRange: string;
  deadline: string;
  isFreeOnly: boolean;
  sortBy: "relevance" | "newest" | "closing_soon" | "popular";
}

export const DEFAULT_FILTERS: FilterState = {
  type: [],
  location: [],
  eligibility: [],
  prizeRange: "all",
  deadline: "all",
  isFreeOnly: false,
  sortBy: "relevance",
};

export interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  isOpen,
  onClose,
  filters: initialFilters,
  onApply,
}) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  if (!isOpen) return null;

  const toggleArrayFilter = (field: "type" | "location" | "eligibility", value: string) => {
    setFilters((prev) => {
      const exists = prev[field].includes(value);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter((v) => v !== value)
          : [...prev[field], value],
      };
    });
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const activeCount =
    filters.type.length +
    filters.location.length +
    filters.eligibility.length +
    (filters.prizeRange !== "all" ? 1 : 0) +
    (filters.deadline !== "all" ? 1 : 0) +
    (filters.isFreeOnly ? 1 : 0);

  const typeOptions = ["hackathon", "competition", "internship", "job", "mentorship"];
  const locationOptions = ["Online", "Offline / On-Campus", "Hybrid"];
  const eligibilityOptions = ["Undergraduate", "School Student", "Graduate / Fresher", "All"];
  const prizeRanges = [
    { id: "all", label: "Any Amount" },
    { id: "1lakh", label: "Up to ₹1 Lakh" },
    { id: "5lakh", label: "₹1L – ₹5 Lakhs" },
    { id: "above5", label: "₹5 Lakhs+" },
  ];
  const deadlineOptions = [
    { id: "all", label: "Anytime" },
    { id: "24h", label: "Closing in 24h" },
    { id: "3d", label: "Closing in 3 days" },
    { id: "week", label: "This week" },
  ];
  const sortOptions = [
    { id: "relevance", label: "Relevance" },
    { id: "newest", label: "Newest" },
    { id: "closing_soon", label: "Closing soon" },
    { id: "popular", label: "Most popular" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative z-10 w-full max-w-[420px] max-h-[88vh] bg-white dark:bg-[#161922] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 border-t border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#3D3BF3] dark:text-[#5856FF]" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Filter & Sort
            </h3>
            {activeCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF6B00] text-white">
                {activeCount} active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 min-h-[36px] px-2 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center cursor-pointer"
              aria-label="Close filters"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Filters */}
        <div className="px-5 py-4 overflow-y-auto space-y-5 flex-1">
          {/* Sort By */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Sort Opportunities
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFilters({ ...filters, sortBy: opt.id as any })}
                  className={cn(
                    "px-3 py-2 text-xs font-semibold rounded-xl border text-left flex items-center justify-between transition-all min-h-[44px] cursor-pointer",
                    filters.sortBy === opt.id
                      ? "border-[#3D3BF3] bg-indigo-50/70 text-[#3D3BF3] dark:bg-indigo-950/60 dark:text-[#7A78FF] ring-1 ring-[#3D3BF3]"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                  )}
                >
                  <span>{opt.label}</span>
                  {filters.sortBy === opt.id && <Check className="w-3.5 h-3.5 text-[#3D3BF3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Opportunity Type */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Opportunity Type
            </h4>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((t) => {
                const isSelected = filters.type.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleArrayFilter("type", t)}
                    className={cn(
                      "px-3.5 py-2 text-xs font-semibold rounded-full border transition-all capitalize min-h-[44px] flex items-center gap-1.5 cursor-pointer",
                      isSelected
                        ? "bg-[#3D3BF3] text-white border-[#3D3BF3] shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    )}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location / Mode */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Mode / Location
            </h4>
            <div className="flex flex-wrap gap-2">
              {locationOptions.map((loc) => {
                const isSelected = filters.location.includes(loc);
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => toggleArrayFilter("location", loc)}
                    className={cn(
                      "px-3.5 py-2 text-xs font-semibold rounded-full border transition-all min-h-[44px] flex items-center gap-1.5 cursor-pointer",
                      isSelected
                        ? "bg-[#FF6B00] text-white border-[#FF6B00] shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    )}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{loc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prize / Stipend Range */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Prize or Stipend Pool
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {prizeRanges.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFilters({ ...filters, prizeRange: p.id })}
                  className={cn(
                    "px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all min-h-[44px] cursor-pointer",
                    filters.prizeRange === p.id
                      ? "border-[#3D3BF3] bg-indigo-50/70 text-[#3D3BF3] dark:bg-indigo-950/60 dark:text-[#7A78FF] font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Deadline urgency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Registration Deadline
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {deadlineOptions.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setFilters({ ...filters, deadline: d.id })}
                  className={cn(
                    "px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all min-h-[44px] cursor-pointer",
                    filters.deadline === d.id
                      ? "border-[#FF6B00] bg-orange-50/70 text-[#FF6B00] dark:bg-orange-950/60 dark:text-[#FFA057] font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Free Only Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div>
              <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Free to Register Only
              </h5>
              <p className="text-[11px] text-slate-500">
                Hide competitions with application fees
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFilters({ ...filters, isFreeOnly: !filters.isFreeOnly })}
              className={cn(
                "w-12 h-7 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer",
                filters.isFreeOnly ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
              )}
              aria-label="Toggle free only"
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full bg-white shadow-md transform transition-transform",
                  filters.isFreeOnly ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>

        {/* Sticky Actions */}
        <div className="p-4 bg-white dark:bg-[#161922] border-t border-slate-100 dark:border-slate-800 flex gap-2.5">
          <MobileButton
            variant="outline"
            size="md"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </MobileButton>

          <MobileButton
            variant="primary"
            size="md"
            onClick={() => {
              onApply(filters);
              onClose();
            }}
            className="flex-[2]"
          >
            Apply Filters {activeCount > 0 ? `(${activeCount})` : ""}
          </MobileButton>
        </div>
      </div>
    </div>
  );
};
