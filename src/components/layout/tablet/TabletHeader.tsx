"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Bell, GraduationCap } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface TabletHeaderProps {
  onSearch?: (query: string) => void;
  onOpenNotifications?: () => void;
}

export default function TabletHeader({ onSearch, onOpenNotifications }: TabletHeaderProps) {
  const { user, profile } = useAuth();
  const [searchVal, setSearchVal] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchVal);
  };

  const studentName = profile?.name || user?.name || "Kacie Velasquez";
  const studentHandle = profile?.username 
    ? `@${profile.username.toLowerCase()}` 
    : user?.email 
      ? `@${user.email.split("@")[0]}` 
      : "@k_velasquez";

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 pt-1 select-none border-b border-neutral-100">
      {/* 1. Left Welcome & Logo */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <span className="text-base sm:text-lg font-medium text-neutral-400">Welcome to</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight group-hover:text-[#ff5733] transition-colors">
              EdWorld
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#ff5733]">
              Co.
            </span>
          </div>
        </Link>
      </div>

      {/* 2. Middle Search Pill */}
      <form
        onSubmit={handleSearchSubmit}
        className="relative flex-1 max-w-md w-full mx-auto md:mx-0"
      >
        <div className="relative flex items-center w-full">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            placeholder="Search courses, mentors, skills..."
            className="w-full bg-white border border-neutral-300/80 rounded-full py-2.5 pl-5 pr-12 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-neutral-500 transition-colors shadow-2xs"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#ff5733] hover:bg-[#ff4019] text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-xs"
            title="Search"
            aria-label="Search"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </form>

      {/* 3. Right Notifications & User Profile */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        {/* Notification Bell Pill */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-full bg-white hover:bg-neutral-50 border border-neutral-300/80 flex items-center justify-center text-neutral-700 hover:text-black transition-all shadow-2xs cursor-pointer active:scale-95"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 stroke-[2]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff5733] ring-2 ring-white" />
        </button>

        {/* User Profile Pill */}
        <Link
          href="/profile"
          className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-white hover:bg-neutral-50 border border-neutral-200 shadow-2xs transition-all group"
          title="View Profile"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-amber-100 border border-amber-300/60 shrink-0">
            {/* Fallback avatar visual */}
            <div className="w-full h-full flex items-center justify-center text-xs font-black text-amber-800 bg-gradient-to-tr from-[#ffe27a] to-[#fed049]">
              {studentName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex flex-col text-left leading-tight pr-1">
            <span className="text-xs font-black text-neutral-900 group-hover:text-[#ff5733] transition-colors truncate max-w-[120px]">
              {studentName}
            </span>
            <span className="text-[10px] text-neutral-400 font-medium truncate max-w-[120px]">
              {studentHandle}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
