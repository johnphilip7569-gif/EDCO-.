"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Sparkles, MessageSquare, Zap, BookOpen, Compass } from "lucide-react";

interface Myra3DAvatarProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Myra3DAvatar({ className = "", size = "lg" }: Myra3DAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [bubbleText, setBubbleText] = useState("Hi! I'm Myra, your AI study buddy 🐻 Ask me any doubt!");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(20px)`
    );
    setGlare({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)");
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleOpenMyra = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-myra-copilot"));
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleOpenMyra}
      style={{ transform, transition: "transform 0.15s ease-out" }}
      className={`relative inline-block cursor-pointer select-none group ${className}`}
      title="Click to study with Myra 🐻"
    >
      {/* 3D Ambient Glowing Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/30 via-blue-500/25 to-indigo-500/20 rounded-full blur-2xl transform scale-110 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

      {/* Floating Dynamic Speech Bubble */}
      <div 
        className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap bg-white/95 backdrop-blur-md border border-blue-200/90 text-slate-800 text-xs font-bold py-1.5 px-3.5 rounded-full shadow-lg shadow-blue-500/10 flex items-center gap-1.5 animate-bounce duration-1000 group-hover:scale-105 transition-all"
        style={{ animationDuration: "3s" }}
      >
        <span className="text-sm">🐻</span>
        <span className="bg-gradient-to-r from-blue-700 to-sky-700 bg-clip-text text-transparent font-extrabold">
          {bubbleText}
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
      </div>

      {/* Main 3D Avatar Halo Card */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full p-2 bg-gradient-to-b from-white/90 via-sky-50/60 to-blue-100/40 border-2 border-white shadow-[0_20px_50px_rgba(2,132,199,0.18)] flex items-center justify-center overflow-hidden">
        {/* Dynamic Light Glare */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.8), transparent 70%)`,
            opacity: glare.opacity,
          }}
        />

        {/* 3D Rendered Myra Mascot Image */}
        <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
          <Image
            src="/images/myra-avatar.png"
            alt="Myra AI 3D Mascot Avatar"
            fill
            sizes="(max-width: 768px) 192px, 256px"
            className="object-cover object-top transform group-hover:scale-108 transition-transform duration-500"
            priority
          />
        </div>

        {/* Live Status Ring */}
        <div className="absolute bottom-2 right-6 bg-white/95 backdrop-blur-md border border-slate-200/90 px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">
            Online Buddy
          </span>
        </div>
      </div>

      {/* Floating 3D Subject Satellite Badges */}
      <div 
        className="hidden sm:flex absolute -left-6 top-8 bg-white/95 backdrop-blur-md border border-sky-200/90 text-sky-800 text-[11px] font-bold px-3 py-1.5 rounded-2xl shadow-md items-center gap-1.5 transform hover:scale-110 transition-transform -rotate-6"
      >
        <span className="text-base">📐</span>
        <span>Maths &amp; Real Numbers</span>
      </div>

      <div 
        className="hidden sm:flex absolute -right-6 top-16 bg-white/95 backdrop-blur-md border border-violet-200/90 text-violet-800 text-[11px] font-bold px-3 py-1.5 rounded-2xl shadow-md items-center gap-1.5 transform hover:scale-110 transition-transform rotate-6"
      >
        <span className="text-base">🧪</span>
        <span>Science &amp; Reactions</span>
      </div>

      <div 
        className="hidden sm:flex absolute left-8 -bottom-4 bg-white/95 backdrop-blur-md border border-amber-200/90 text-amber-900 text-[11px] font-bold px-3 py-1.5 rounded-2xl shadow-md items-center gap-1.5 transform hover:scale-110 transition-transform rotate-3"
      >
        <span className="text-base">🎯</span>
        <span>1-Question Quizzes</span>
      </div>
    </div>
  );
}
