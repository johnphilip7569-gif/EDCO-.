"use client";

import React, { useState } from "react";
import { MobileButton } from "../ui/MobileButton";
import { Sparkles, ArrowRight, Trophy, Briefcase, Rocket, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SplashScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted, onLogin }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Trophy,
      badge: "Discover & Compete",
      title: "Discover opportunities tailored for you",
      description: "Explore curated national hackathons, coding contests, and case studies with real cash prizes and PPO offers.",
      gradient: "from-[#3D3BF3]/15 via-indigo-500/5 to-transparent",
      accentColor: "#3D3BF3",
      heroEmoji: "🏆",
    },
    {
      icon: Rocket,
      badge: "EdWorld Studio",
      title: "Compete and build your verified portfolio",
      description: "Master algorithms with the interactive DSA Studio, crack drills, and showcase verified wins to recruiters.",
      gradient: "from-[#FF6B00]/15 via-orange-500/5 to-transparent",
      accentColor: "#FF6B00",
      heroEmoji: "📐",
    },
    {
      icon: Briefcase,
      badge: "Hiring & Mentorship",
      title: "Get hired and grow with Myra AI Copilot",
      description: "Generate 88%+ ATS resumes, simulate real voice interviews, and receive 24/7 instant doubt clearing.",
      gradient: "from-[#FFB800]/15 via-amber-500/5 to-transparent",
      accentColor: "#FFB800",
      heroEmoji: "💼",
    },
  ];

  const slide = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onGetStarted();
    }
  };

  return (
    <div className="flex flex-col h-full justify-between bg-[#F8F9FD] dark:bg-[#0E1017] p-6 select-none relative overflow-hidden transition-colors">
      {/* Background ambient glow */}
      <div className={cn("absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 bg-gradient-to-br", slide.gradient)} />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl bg-indigo-500/10 dark:bg-indigo-500/5 pointer-events-none" />

      {/* Top Header: Logo + Skip */}
      <div className="flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3D3BF3] to-[#FF6B00] flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20">
            E
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">
              Ed<span className="text-[#3D3BF3] dark:text-[#5856FF]">World</span>
            </span>
            <span className="ml-1 text-[9px] font-bold uppercase tracking-wider text-[#FF6B00] bg-[#FF6B00]/10 px-1 py-0.2 rounded">
              Beta
            </span>
          </div>
        </div>

        {currentSlide < slides.length - 1 && (
          <button
            type="button"
            onClick={onGetStarted}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 min-h-[44px] px-3 py-2 flex items-center"
          >
            Skip
          </button>
        )}
      </div>

      {/* Middle: Hero Illustration & Slide Card */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 z-10">
        {/* Animated Hero Illustration Container */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 animate-[spin_30s_linear_infinite]" />
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-indigo-100/50 via-white to-orange-50/50 dark:from-indigo-950/30 dark:via-[#161922] dark:to-orange-950/20 shadow-inner flex items-center justify-center">
            <span className="text-6xl sm:text-7xl filter drop-shadow-lg transform transition-transform duration-300 hover:scale-110">
              {slide.heroEmoji}
            </span>
          </div>
          <div className="absolute bottom-2 right-2 p-2.5 rounded-2xl bg-white dark:bg-[#161922] shadow-lg border border-slate-100 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-[#FF6B00] animate-pulse" />
          </div>
        </div>

        {/* Badge */}
        <span className="text-xs font-bold text-[#3D3BF3] dark:text-[#5856FF] bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/40 mb-3">
          {slide.badge}
        </span>

        {/* Slide Title */}
        <h2 className="text-xl sm:text-2xl font-black text-center text-slate-900 dark:text-slate-100 px-2 tracking-tight leading-snug">
          {slide.title}
        </h2>

        {/* Slide Description */}
        <p className="text-xs sm:text-sm text-center text-slate-600 dark:text-slate-300 px-4 mt-2.5 leading-relaxed">
          {slide.description}
        </p>

        {/* Dots pagination */}
        <div className="flex items-center gap-2 mt-6">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 min-h-[16px]",
                currentSlide === idx
                  ? "w-8 bg-[#3D3BF3] dark:bg-[#5856FF]"
                  : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex flex-col gap-3 z-10 pb-2">
        <MobileButton
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleNext}
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Continue"}
        </MobileButton>

        <MobileButton
          variant="outline"
          size="md"
          fullWidth
          onClick={onLogin}
        >
          I already have an account
        </MobileButton>

        <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 pt-1">
          By signing in you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};
