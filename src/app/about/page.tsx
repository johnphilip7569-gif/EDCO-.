"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Target,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Code2,
  Lock,
  Compass,
  CheckCircle2,
  Terminal,
  Users,
  MapPin,
  Mail,
  Award,
} from "lucide-react";
import StudioSticker from "@/components/studio/StudioSticker";
import Card3DTilt from "@/components/studio/Card3DTilt";
import {
  ScribbleUnderline,
  DoubleScribble,
  DoodleStar,
  DoodleArrow,
  DoodleSparkle,
} from "@/components/studio/DoodleAccents";
import confetti from "canvas-confetti";

export default function AboutPage() {
  const triggerConfetti = () => {
    if (typeof window !== "undefined") {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#FFC93C", "#FF6B6B", "#2EC4B6", "#4D96FF", "#8E6CEF"],
      });
    }
  };

  const corePillars = [
    {
      icon: Target,
      title: "Stage-Aware Progression",
      description:
        "Distinct calibrated tracks for pre-college explorers (Ages 16–18) and university/working engineers (Placement Track). Clear rubrics tailored to where you actually stand.",
      color: "#FFC93C", // Sunshine Yellow
      textColor: "#1B1B2F",
      tag: "Calibrated Tracks",
    },
    {
      icon: ShieldCheck,
      title: "DPDP Privacy by Design",
      description:
        "Full DPDP Act 2023 and COPPA compliance. Minors under 18 have strict privacy boundaries with parental consent. Your audio recordings and telemetry remain strictly private to you.",
      color: "#2EC4B6", // Teal
      textColor: "#1B1B2F",
      tag: "Data Sovereign",
    },
    {
      icon: Sparkles,
      title: "Objective STAR Rubrics",
      description:
        "No arbitrary impressions. Myra evaluates Situation, Task, Action, and Result with neural voice transcription, filler word cadence analysis, and model answer rewrites.",
      color: "#FF6B6B", // Coral
      textColor: "#FFFFFF",
      tag: "STAR Methodology",
    },
    {
      icon: HeartHandshake,
      title: "Institutional Integrity",
      description:
        "Campus placement telemetry and cohort benchmarks without individual learner surveillance. Real-time readiness indices for university Training & Placement Officers.",
      color: "#8E6CEF", // Grape
      textColor: "#FFFFFF",
      tag: "Campus Standards",
    },
  ];

  const studioPrinciples = [
    {
      number: "01",
      title: "Proof of Work Over Paper",
      description:
        "We believe an engineer is proven through code that compiles, production incidents diagnosed under pressure, and live STAR communication — not multiple-choice certificates.",
      badgeColor: "#FF6B6B",
    },
    {
      number: "02",
      title: "Pressure Without Panic",
      description:
        "High-stakes tech rounds are stressful. By practicing in true browser fullscreen lockdown with neural speech questions, students turn interview anxiety into calm muscle memory.",
      badgeColor: "#FFC93C",
    },
    {
      number: "03",
      title: "Democratizing Tier-2/3 Off-Campus Placements",
      description:
        "Exceptional talent isn't restricted to top metros or elite institutes. We give tier-2 and tier-3 students the exact same ATS tooling, Google X-Y-Z resume engineering, and interview rigor used by engineers at FAANG.",
      badgeColor: "#2EC4B6",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-20 sm:space-y-28">
      
      {/* ========================================================================= */}
      {/* 1. HERO HEADER                                                            */}
      {/* ========================================================================= */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6">
        
        {/* Top Eyebrow Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <StudioSticker bgColor="#FFC93C" rotate="slight-left" size="sm">
            ✦ The EdWorld Manifesto
          </StudioSticker>
          <StudioSticker bgColor="#2EC4B6" rotate="slight-right" size="sm">
            Built by Engineers for Engineers
          </StudioSticker>
          <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-[#4A4A68]">
            HITEC City &bull; Hyderabad
          </span>
        </div>

        {/* Display Title */}
        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-[#1B1B2F] leading-[1.08] tracking-tight">
          Career acceleration built with{" "}
          <span className="relative inline-block text-[#FF6B6B]">
            human craftsmanship,
            <ScribbleUnderline color="#FF6B6B" className="absolute -bottom-2 sm:-bottom-3 left-0 w-full" />
          </span>{" "}
          not corporate clichés.
        </h1>

        {/* Narrative Subtitle */}
        <p className="font-studio text-base sm:text-xl text-[#4A4A68] leading-relaxed max-w-3xl mx-auto">
          We grew tired of generic interview checklists, broken multiple-choice assessments, and disconnected chatbots. EdWorld Co. is an interconnected engineering intelligence platform designed to eliminate guesswork from your tech career journey.
        </p>

        {/* Metrics Strip */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl bg-white border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#FFC93C]">
            <div className="font-display font-black text-2xl text-[#1B1B2F]">14,800+</div>
            <div className="text-[10px] font-heading font-extrabold uppercase text-[#4A4A68]">Students Mentored</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#FF6B6B]">
            <div className="font-display font-black text-2xl text-[#1B1B2F]">100%</div>
            <div className="text-[10px] font-heading font-extrabold uppercase text-[#4A4A68]">Lockdown Anti-Cheat</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#2EC4B6]">
            <div className="font-display font-black text-2xl text-[#1B1B2F]">98%</div>
            <div className="text-[10px] font-heading font-extrabold uppercase text-[#4A4A68]">ATS Parser Match</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#8E6CEF]">
            <div className="font-display font-black text-2xl text-[#1B1B2F]">0-Cost</div>
            <div className="text-[10px] font-heading font-extrabold uppercase text-[#4A4A68]">Student Starter</div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE 4 FOUNDATIONAL PILLARS (3D TILT CARDS)                             */}
      {/* ========================================================================= */}
      <section className="space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <StudioSticker bgColor="#8E6CEF" textColor="#FFFFFF">
            Our Core Architecture
          </StudioSticker>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1B1B2F]">
            Four commitments to genuine mastery.
          </h2>
          <p className="font-studio text-xs sm:text-sm text-[#4A4A68]">
            Every line of code and feature we build adheres to these non-negotiable architectural principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card3DTilt
                key={idx}
                className="bg-white border-2 border-[#1B1B2F] p-7 sm:p-8 space-y-5 flex flex-col justify-between"
                shadowColor="#1B1B2F"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl border-2 border-[#1B1B2F] flex items-center justify-center shadow-[3px_3px_0px_#1B1B2F]"
                      style={{ backgroundColor: pillar.color }}
                    >
                      <Icon className="w-6 h-6" style={{ color: pillar.textColor }} />
                    </div>

                    <StudioSticker
                      bgColor={pillar.color}
                      textColor={pillar.textColor}
                      size="sm"
                      rotate="none"
                    >
                      {pillar.tag}
                    </StudioSticker>
                  </div>

                  <h3 className="font-display font-black text-2xl text-[#1B1B2F]">
                    {pillar.title}
                  </h3>

                  <p className="font-studio text-xs sm:text-sm text-[#4A4A68] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t-2 border-[#1B1B2F]/15 flex items-center gap-2 text-xs font-heading font-extrabold text-[#1B1B2F]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Production verified across all modules</span>
                </div>
              </Card3DTilt>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. EDITORIAL PRINCIPLES: HOW WE THINK                                    */}
      {/* ========================================================================= */}
      <section className="rounded-3xl bg-white border-2 border-[#1B1B2F] p-8 sm:p-14 shadow-[8px_8px_0px_#1B1B2F] space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFC93C] border-2 border-[#1B1B2F] text-xs font-heading font-extrabold uppercase shadow-[2px_2px_0px_#1B1B2F]">
            <DoodleStar className="w-3.5 h-3.5" />
            <span>Editorial Standards</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-[#1B1B2F]">
            How we approach engineering education.
          </h2>
          <p className="font-studio text-sm sm:text-base text-[#4A4A68]">
            We refuse to treat software engineering as memorization. Here is what drives our curriculum and tooling decisions:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {studioPrinciples.map((principle, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] p-6 space-y-4 shadow-[4px_4px_0px_#1B1B2F]"
            >
              <div
                className="w-10 h-10 rounded-2xl border-2 border-[#1B1B2F] font-heading font-black text-base flex items-center justify-center shadow-[2px_2px_0px_#1B1B2F]"
                style={{ backgroundColor: principle.badgeColor }}
              >
                {principle.number}
              </div>
              <h3 className="font-heading font-black text-lg text-[#1B1B2F]">
                {principle.title}
              </h3>
              <p className="font-studio text-xs sm:text-sm text-[#4A4A68] leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. STUDIO LOCATION & CONTACT QUICK STRIP                                 */}
      {/* ========================================================================= */}
      <section className="rounded-3xl bg-[#FFF8EE] border-2 border-[#1B1B2F] p-8 sm:p-10 shadow-[6px_6px_0px_#1B1B2F]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-1">
            <span className="font-heading font-extrabold text-[10px] uppercase tracking-wider text-[#7E7E9A]">
              Physical Studio Location
            </span>
            <div className="flex items-start gap-2 pt-1">
              <MapPin className="w-5 h-5 text-[#FF6B6B] shrink-0 mt-0.5" />
              <p className="font-studio text-xs sm:text-sm font-semibold text-[#1B1B2F]">
                HITEC City, Madhapur, Hyderabad, Telangana 500081
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-heading font-extrabold text-[10px] uppercase tracking-wider text-[#7E7E9A]">
              Direct Inquiries
            </span>
            <div className="flex items-center gap-2 pt-1">
              <Mail className="w-5 h-5 text-[#4D96FF] shrink-0" />
              <a
                href="mailto:edworld.eden@gmail.com"
                className="font-studio text-xs sm:text-sm font-bold text-[#1B1B2F] hover:underline"
              >
                edworld.eden@gmail.com
              </a>
            </div>
          </div>

          <div className="text-left md:text-right">
            <Link
              href="/contact"
              className="btn-squishy inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border-2 border-[#1B1B2F] font-heading font-extrabold text-xs text-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F]"
            >
              <span>Visit Contact Office</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HIGH-CONTRAST BOTTOM CALL TO ACTION                                    */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-[#1B1B2F] text-white border-4 border-[#1B1B2F] p-8 sm:p-14 text-center space-y-6 shadow-[10px_10px_0px_#FFC93C]">
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <StudioSticker bgColor="#FFC93C" textColor="#1B1B2F">
            ✦ Start Free Today
          </StudioSticker>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Ready to Accelerate Your Career?
          </h2>
          <p className="font-studio text-xs sm:text-sm text-[#E2E1EC] max-w-xl mx-auto">
            Create your account in seconds to build ATS resumes, take 3D mock interviews, and access verified peer networking.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <Link
            href="/auth/signup"
            onClick={triggerConfetti}
            className="btn-squishy px-8 py-4 rounded-2xl bg-[#FF6B6B] text-white font-heading font-extrabold text-sm border-2 border-white shadow-[4px_4px_0px_white] flex items-center gap-2 select-none"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>

          <Link
            href="/pricing"
            className="btn-squishy px-7 py-4 rounded-2xl bg-white text-[#1B1B2F] font-heading font-extrabold text-sm border-2 border-white select-none hover:bg-[#FFF8EE]"
          >
            View Student &amp; Pro Plans
          </Link>
        </div>

        <div className="absolute top-6 left-6 opacity-30 pointer-events-none">
          <DoodleSparkle color="#FFC93C" className="w-8 h-8" />
        </div>
        <div className="absolute bottom-6 right-6 opacity-30 pointer-events-none">
          <DoodleStar color="#FF6B6B" className="w-10 h-10" />
        </div>
      </section>

    </div>
  );
}
