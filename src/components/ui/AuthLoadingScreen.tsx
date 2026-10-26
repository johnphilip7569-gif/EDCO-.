"use client";

import React from "react";
import Image from "next/image";

interface AuthLoadingScreenProps {
  message?: string;
}

export default function AuthLoadingScreen({ message = "Checking session..." }: AuthLoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#ebe9fc] via-[#e4e2f8] to-[#eeeafc] text-[#111827] select-none px-4 font-sans selection:bg-neutral-800 selection:text-white">
      
      {/* Ambient background glow accents */}
      <div className="absolute w-96 h-96 rounded-full bg-[#5B47B8]/15 blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 rounded-full bg-[#8B5CF6]/15 blur-3xl pointer-events-none -bottom-20 -right-20" />

      {/* Pristine 3D White Floating Card */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full bg-white rounded-[36px] sm:rounded-[44px] p-8 sm:p-10 shadow-[0_32px_90px_rgba(100,90,170,0.18)] border border-white/80 space-y-6 animate-in fade-in duration-300">
        
        {/* Brand Crest Emblem with Official Logo */}
        <div className="relative group">
          <div className="w-20 h-20 rounded-3xl bg-black p-3.5 flex items-center justify-center shadow-[0_12px_28px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:scale-105 transition-transform border border-neutral-800">
            {/* Subtle concentric line overlay */}
            <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />
            <Image
              src="/images/edworld-logo.png"
              alt="EdWorld Logo"
              width={54}
              height={54}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          {/* Subtle animated halo */}
          <div className="absolute -inset-1 rounded-3xl bg-[#5B47B8] opacity-25 blur-md animate-pulse pointer-events-none" />
        </div>

        {/* Brand Text */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-[#111827]">
            Ed<span className="text-[#5B47B8]">World</span>
          </h1>
          <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-neutral-400 uppercase">
            SKILLS &amp; CAREER OS
          </p>
        </div>

        {/* Circular Purple & Lavender Spinner */}
        <div className="flex flex-col items-center space-y-3 pt-2">
          <div className="relative w-8 h-8">
            <div className="w-8 h-8 rounded-full border-2 border-neutral-100" />
            <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-transparent border-t-[#5B47B8] border-r-[#7C3AED] animate-spin" />
          </div>
          <span className="text-xs font-bold text-neutral-500 tracking-wider uppercase font-mono">
            {message}
          </span>
        </div>

      </div>

      {/* Subtle footer */}
      <div className="relative z-10 pt-6 text-[11px] font-mono text-neutral-400">
        EdWorld Co. &bull; Learning Studio
      </div>

    </div>
  );
}
