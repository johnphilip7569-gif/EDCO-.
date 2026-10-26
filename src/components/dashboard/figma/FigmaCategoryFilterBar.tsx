"use client";

import React, { useState } from "react";
import { 
  Monitor, 
  TrendingUp, 
  Code2, 
  ListFilter, 
  Search, 
  SlidersHorizontal 
} from "lucide-react";

interface FigmaCategoryFilterBarProps {
  onCategoryChange?: (cat: string) => void;
  onSearchChange?: (query: string) => void;
}

export default function FigmaCategoryFilterBar({
  onCategoryChange,
  onSearchChange,
}: FigmaCategoryFilterBarProps) {
  const [activeCategory, setActiveCategory] = useState<string>("UI&UX");
  const [searchVal, setSearchVal] = useState<string>("");

  const categories = [
    {
      id: "UI&UX",
      label: "UI&UX",
      icon: Monitor,
      activeStyle: "bg-[#EDF5FF] text-[#2563EB] border-[#BFDBFE]",
      inactiveStyle: "bg-white text-neutral-600 hover:bg-[#F8FAFC] border-neutral-200/80",
    },
    {
      id: "Marketing",
      label: "Marketing",
      icon: TrendingUp,
      activeStyle: "bg-[#FFF4EC] text-[#EA580C] border-[#FED7AA]",
      inactiveStyle: "bg-white text-neutral-600 hover:bg-[#F8FAFC] border-neutral-200/80",
    },
    {
      id: "Python",
      label: "Python",
      icon: Code2,
      activeStyle: "bg-[#F5F2FD] text-[#7C3AED] border-[#DDD6FE]",
      inactiveStyle: "bg-white text-neutral-600 hover:bg-[#F8FAFC] border-neutral-200/80",
    },
    {
      id: "List",
      label: "List",
      icon: ListFilter,
      activeStyle: "bg-neutral-100 text-neutral-900 border-neutral-300",
      inactiveStyle: "bg-white text-neutral-600 hover:bg-[#F8FAFC] border-neutral-200/80",
    },
  ];

  const handleSelect = (id: string) => {
    setActiveCategory(id);
    if (onCategoryChange) onCategoryChange(id);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 select-none">
      
      {/* Title & Category Chips */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <h2 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight mr-2">
          Dashboard
        </h2>

        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelect(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:scale-95 cursor-pointer ${
                isActive ? `${cat.activeStyle} shadow-xs font-bold` : cat.inactiveStyle
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Rounded Search Bar with Filter Sliders matching reference */}
      <div className="relative min-w-[240px] sm:w-72">
        <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchVal}
          onChange={handleSearch}
          placeholder="Search"
          className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#F3F4F6] hover:bg-neutral-100 focus:bg-white border border-neutral-200/80 rounded-full text-[#111827] placeholder-neutral-400 focus:outline-none focus:border-[#5B47B8] focus:ring-1 focus:ring-[#5B47B8] transition-all shadow-inner"
        />
        <button
          type="button"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#111827] transition-colors p-1"
          title="Search filters"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
