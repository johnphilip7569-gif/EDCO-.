"use client";

import React, { useState } from "react";
import MyraTeddyMascot from "@/components/ui/figma/MyraTeddyMascot";

interface MyraTeddyLeftCompanionProps {
  onOpenMyra?: () => void;
}

export default function MyraTeddyLeftCompanion({ onOpenMyra }: MyraTeddyLeftCompanionProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onOpenMyra) {
      onOpenMyra();
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-myra-copilot"));
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col items-center group cursor-pointer select-none pb-2"
      title="Click to learn with Myra Teddy!"
    >
      {/* Speech Bubble */}
      <div className="relative mb-1 px-2.5 py-1 rounded-xl bg-amber-100/90 border border-amber-300/80 text-amber-950 text-[10px] font-black shadow-2xs transition-transform duration-200 group-hover:scale-105 whitespace-nowrap">
        <span>Hi, I&apos;m Myra! ⚡</span>
        {/* Pointer down triangle */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-100 border-r border-b border-amber-300/80 rotate-45" />
      </div>

      {/* Mini Teddy Mascot */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#fefce8] border border-amber-200 shadow-xs flex items-center justify-center p-1 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
        <MyraTeddyMascot className="w-full h-full" interactive={false} />
      </div>
    </div>
  );
}
