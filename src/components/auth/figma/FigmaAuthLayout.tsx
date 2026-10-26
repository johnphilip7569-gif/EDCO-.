"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Star, BookOpen, Clock, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import StudioSticker from "@/components/studio/StudioSticker";
import { ScribbleUnderline, DoodleStar } from "@/components/studio/DoodleAccents";

interface FigmaAuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  activeTab: "login" | "signup" | "reset";
}

export default function FigmaAuthLayout({
  children,
  title,
  subtitle,
  activeTab,
}: FigmaAuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#FFF8EE] text-[#1B1B2F] flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-studio selection:bg-[#FFC93C] selection:text-[#1B1B2F]">
      
      {/* Master Tactile Studio Canvas */}
      <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl sm:rounded-[36px] border-2 border-[#1B1B2F] shadow-[8px_8px_0px_#1B1B2F] overflow-hidden animate-in fade-in duration-300">
        
        {/* Top Mini Brand Navigation with Studio Mark */}
        <div className="px-6 sm:px-10 pt-6 sm:pt-7 pb-4 flex items-center justify-between border-b-2 border-[#1B1B2F]/15 bg-[#FFF8EE]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-[#1B1B2F] p-1 border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#FFC93C] group-hover:rotate-6 transition-transform">
              <Image
                src="/images/edworld-mark.png"
                alt="EdWorld Co. Mark"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-lg text-[#1B1B2F] leading-none">
                EdWorld <span className="text-[#FF6B6B]">Co.</span>
              </span>
              <span className="font-heading font-extrabold text-[9px] uppercase tracking-wider text-[#4A4A68] mt-0.5">
                Meet • Connect • Play
              </span>
            </div>
          </Link>

          {/* Quick Switcher Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border-2 border-[#1B1B2F] text-xs font-heading font-extrabold shadow-[2px_2px_0px_#1B1B2F]">
            <Link
              href="/auth/login"
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "login"
                  ? "bg-[#1B1B2F] text-white shadow-xs"
                  : "text-[#4A4A68] hover:text-[#1B1B2F]"
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "signup"
                  ? "bg-[#FF6B6B] text-white shadow-xs"
                  : "text-[#4A4A68] hover:text-[#1B1B2F]"
              }`}
            >
              Start Free
            </Link>
          </div>
        </div>

        {/* 2-Column Split: Showcase on Left, Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* LEFT COLUMN: Clean Minimal Showcase with 3D Myra Mascot */}
          <div className="lg:col-span-5 bg-[#FFF8EE]/60 p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-[#1B1B2F] relative overflow-hidden">
            
            {/* Header Showcase Text */}
            <div className="space-y-3 relative z-10">
              <div className="flex flex-wrap items-center gap-2">
                <StudioSticker bgColor="#2EC4B6" textColor="#1B1B2F" size="sm" rotate="slight-left">
                  ✦ Grounded AI Copilot
                </StudioSticker>
                <StudioSticker bgColor="#FFC93C" textColor="#1B1B2F" size="sm" rotate="slight-right">
                  14,800+ Students
                </StudioSticker>
              </div>

              <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1B1B2F] tracking-tight leading-tight">
                Level Up with Myra
              </h2>
              <p className="font-studio text-xs text-[#4A4A68] leading-relaxed max-w-xs">
                3D lockdown mock interviews, Google X-Y-Z resume optimization, and hands-on production incident drills with your personal career mentor.
              </p>
            </div>

            {/* Center Mascot: High-Resolution 3D Myra Teddy AI */}
            <div className="py-6 flex items-center justify-center relative z-10 group">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-white p-2.5 shadow-[5px_5px_0px_#1B1B2F] border-2 border-[#1B1B2F] hover:rotate-2 transition-transform duration-300">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#FFF8EE] flex items-center justify-center">
                  <Image
                    src="/images/myra-avatar.png"
                    alt="Myra AI Career Copilot"
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-300"
                    priority
                  />
                </div>
                {/* Floating Online Badge */}
                <div className="absolute -bottom-2.5 -right-2 px-3 py-1 rounded-full bg-[#1B1B2F] text-white text-[10px] font-heading font-extrabold border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#FFC93C] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Myra AI Active</span>
                </div>
              </div>
            </div>

            {/* Bottom Milestone Badges Row */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FFC93C] text-[#1B1B2F] flex items-center justify-center font-black text-xs font-mono border-2 border-[#1B1B2F]">
                    4.9
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-heading font-black text-[#1B1B2F]">Student Rating</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-2.5 h-2.5 fill-[#FFC93C] text-[#1B1B2F]" />
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-heading font-extrabold text-white bg-[#FF6B6B] px-2.5 py-0.5 rounded-full border border-[#1B1B2F]">
                  Tier-2/3 Placements
                </span>
              </div>

              {/* Quick Trust Badges */}
              <div className="flex items-center justify-between text-[11px] text-[#4A4A68] font-heading font-bold pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>DPDP Act 2023</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#4D96FF]" />
                  <span>0-Cost Starter</span>
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Form Canvas */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-6">
            
            {/* Form Header */}
            <div className="space-y-1">
              <h1 className="font-display font-black text-2xl sm:text-3xl text-[#1B1B2F] tracking-tight">
                {title}
              </h1>
              <p className="font-studio text-xs sm:text-sm text-[#4A4A68] font-medium">
                {subtitle}
              </p>
            </div>

            {/* Form Slot */}
            <div className="w-full">
              {children}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
