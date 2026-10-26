"use client";

import React, { useState } from "react";
import { MOBILE_TOKENS, MOCK_OPPORTUNITIES, EDWORLD_CORE_FEATURES } from "@/lib/mobile-design-tokens";
import { MobileButton } from "../ui/MobileButton";
import { MobileChip } from "../ui/MobileChip";
import { MobileCard } from "../ui/MobileCard";
import { FloatingInput } from "../ui/FloatingInput";
import { OtpInputGroup } from "../ui/OtpInputGroup";
import { CircularProgressRing } from "../ui/CircularProgressRing";
import { OpportunityCard } from "../ui/OpportunityCard";
import { EdworldFeatureCard } from "../ui/EdworldFeatureCard";
import { Layers, Palette, Sparkles, Check, Flame } from "lucide-react";

export const ComponentLibraryScreen: React.FC = () => {
  const [activeChip, setActiveChip] = useState("Hackathons");
  const [otpVal, setOtpVal] = useState("123456");
  const [inputText, setInputText] = useState("Rahul Sharma");

  return (
    <div className="flex flex-col h-full bg-[#F8F9FD] dark:bg-[#0E1017] select-none overflow-y-auto pb-10">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#161922]/95 backdrop-blur-md px-4 pt-3 pb-3 border-b border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3D3BF3] to-[#FF6B00] text-white flex items-center justify-center font-bold text-xs">
            UI
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
              EdWorld Design System
            </h2>
            <p className="text-[10px] text-slate-400">
              390×844 Mobile-First Tokens & Component Spec
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-6">
        {/* Design System Tokens Summary */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-[#3D3BF3]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Visual Tokens
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#3D3BF3]" />
              <div>
                <span className="block font-bold">Primary Indigo</span>
                <span className="text-[10px] text-slate-400">#3D3BF3</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#FF6B00]" />
              <div>
                <span className="block font-bold">Warm Accent</span>
                <span className="text-[10px] text-slate-400">#FF6B00</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
              <span className="w-4 h-4 rounded-lg border-2 border-indigo-400" />
              <div>
                <span className="block font-bold">16px Radius</span>
                <span className="text-[10px] text-slate-400">rounded-2xl</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">
                44
              </span>
              <div>
                <span className="block font-bold">Tap Target</span>
                <span className="text-[10px] text-slate-400">≥ 44px standard</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Mobile Buttons */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            1. Mobile Buttons (44px min touch target)
          </h3>
          <div className="space-y-2">
            <MobileButton variant="primary" fullWidth>
              Primary Button (#3D3BF3)
            </MobileButton>
            <MobileButton variant="accent" fullWidth>
              Warm Accent CTA (#FF6B00)
            </MobileButton>
            <MobileButton variant="outline" fullWidth>
              Outline Button
            </MobileButton>
            <MobileButton variant="primary" fullWidth isLoading>
              Loading State
            </MobileButton>
          </div>
        </div>

        {/* 2. Chips & Pills */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            2. Category Chips & Count Badges
          </h3>
          <div className="flex flex-wrap gap-2">
            {["Hackathons", "DSA Studio", "Internships", "AI Mock Interviews"].map((chip) => (
              <MobileChip
                key={chip}
                label={chip}
                count={chip === "Hackathons" ? 14 : undefined}
                active={activeChip === chip}
                onClick={() => setActiveChip(chip)}
              />
            ))}
          </div>
        </div>

        {/* 3. Floating Label Input */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            3. Floating Label Input
          </h3>
          <FloatingInput
            label="Full Legal Name"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            clearable
            onClear={() => setInputText("")}
          />
        </div>

        {/* 4. 6-Box OTP Input with Resend */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            4. 6-Digit Auto-Focus OTP Input
          </h3>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800">
            <OtpInputGroup
              length={6}
              value={otpVal}
              onChange={setOtpVal}
              initialCountdown={28}
            />
          </div>
        </div>

        {/* 5. Circular Progress Ring (70%) */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            5. Circular Progress Ring (Profile 70%)
          </h3>
          <CircularProgressRing percentage={70} />
        </div>

        {/* 6. Unstop Opportunity Card */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            6. Unstop-Inspired Opportunity Card
          </h3>
          <OpportunityCard opportunity={MOCK_OPPORTUNITIES[0]} />
        </div>

        {/* 7. EdWorld Feature Cards */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            7. EdWorld Co Feature Launchpad Cards
          </h3>
          <div className="space-y-3">
            <EdworldFeatureCard feature={EDWORLD_CORE_FEATURES[0]} variant="banner" />
            <EdworldFeatureCard feature={EDWORLD_CORE_FEATURES[1]} variant="banner" />
          </div>
        </div>
      </div>
    </div>
  );
};
