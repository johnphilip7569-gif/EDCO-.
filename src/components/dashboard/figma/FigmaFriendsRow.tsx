"use client";

import React from "react";
import Link from "next/link";
import { Plus, Users } from "lucide-react";

export default function FigmaFriendsRow() {
  const friends = [
    { initial: "A", bg: "bg-rose-500", ring: "ring-rose-200" },
    { initial: "K", bg: "bg-emerald-500", ring: "ring-emerald-200" },
    { initial: "R", bg: "bg-amber-500", ring: "ring-amber-200" },
    { initial: "S", bg: "bg-indigo-500", ring: "ring-indigo-200" },
    { initial: "M", bg: "bg-purple-500", ring: "ring-purple-200" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      
      {/* Overlapping Friends Avatars */}
      <div className="space-y-1">
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <span className="text-xs font-black text-black">Friends</span>
          <Link
            href="/network"
            className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center text-[10px] font-bold"
            title="Invite or Find Friends"
          >
            <Plus className="w-2.5 h-2.5" />
          </Link>
        </div>

        <div className="flex items-center -space-x-2 pt-0.5">
          {friends.map((f, idx) => (
            <div
              key={idx}
              className={`w-7 h-7 rounded-full ${f.bg} text-white ring-2 ${f.ring} flex items-center justify-center font-bold text-[10px] shadow-2xs hover:scale-110 hover:z-10 transition-transform cursor-pointer`}
              title={`Friend ${f.initial}`}
            >
              {f.initial}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cluster: Courses, Following, Followers */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Following */}
        <div className="flex flex-col leading-none">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
            Following
          </span>
          <span className="text-base sm:text-lg font-black text-black font-mono mt-0.5">
            312
          </span>
        </div>

        {/* Followers */}
        <div className="flex flex-col leading-none">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
            Followers
          </span>
          <span className="text-base sm:text-lg font-black text-black font-mono mt-0.5">
            881
          </span>
        </div>

      </div>

    </div>
  );
}
