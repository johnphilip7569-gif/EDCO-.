"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Video,
  FileText,
  Terminal,
  Send,
  Phone,
  Mail,
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

export default function ForCollegePage() {
  const [formData, setFormData] = useState({
    collegeName: "",
    contactName: "",
    role: "Placement Officer / TPO",
    email: "",
    phone: "",
    studentCount: "500-1000",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (typeof window !== "undefined") {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#FFC93C", "#FF6B6B", "#2EC4B6", "#8E6CEF"],
      });
    }
  };

  const institutionalPillars = [
    {
      icon: BarChart3,
      title: "TPO Placement Telemetry Dashboard",
      description:
        "Track cohort readiness in real time. Filter students by branch, CGPA, target tech stack, and STAR mock interview percentile before recruiters arrive on campus.",
      color: "#2EC4B6", // Teal
      textColor: "#1B1B2F",
      tag: "Live Analytics",
    },
    {
      icon: Video,
      title: "Campus-Wide 3D Lockdown Mock Drives",
      description:
        "Run standardized mock assessment drives in true fullscreen lockdown mode. Spoken AI questions with tab-switch anti-cheat telemetry and instant scorecards.",
      color: "#FF6B6B", // Coral
      textColor: "#FFFFFF",
      tag: "Anti-Cheat Drives",
    },
    {
      icon: FileText,
      title: "Google X-Y-Z Resume Calibration",
      description:
        "Ensure zero resumes are discarded by corporate applicant tracking systems. Automated batch parsing, keyword scoring, and bullet point rewrites for all students.",
      color: "#FFC93C", // Sunshine Yellow
      textColor: "#1B1B2F",
      tag: "ATS Standardizer",
    },
    {
      icon: Terminal,
      title: "Production Incident Engineering Labs",
      description:
        "Equip your computer science students with practical debugging experience. Hands-on EdFix labs simulate real PostgreSQL concurrency locks and memory leaks.",
      color: "#8E6CEF", // Grape
      textColor: "#FFFFFF",
      tag: "Applied Engineering",
    },
  ];

  const collegeSteps = [
    {
      step: "01",
      title: "Domain Whitelisting & Batch Onboarding",
      description:
        "Provide your college email domain (e.g. @college.edu.in). Students register with instant institutional SSO, immediately receiving full platform access.",
    },
    {
      step: "02",
      title: "Baseline Diagnostics & Skill Heatmaps",
      description:
        "Students complete baseline ATS resume reviews and technical mock interviews. TPO dashboard aggregates branch-wise strengths and knowledge gaps.",
    },
    {
      step: "03",
      title: "Corporate Matchmaking & Hiring Drives",
      description:
        "Share pre-screened, verified candidate shortlists with our corporate hiring partners, dramatically improving off-campus and on-campus conversion rates.",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-20 sm:space-y-28">
      
      {/* ========================================================================= */}
      {/* 1. HERO HEADER                                                            */}
      {/* ========================================================================= */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <StudioSticker bgColor="#FF6B6B" textColor="#FFFFFF" rotate="slight-left" size="sm">
            ✦ For Universities &amp; TPOs
          </StudioSticker>
          <StudioSticker bgColor="#FFC93C" textColor="#1B1B2F" rotate="slight-right" size="sm">
            Campus Placement Intelligence
          </StudioSticker>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-[#1B1B2F] leading-[1.08] tracking-tight">
          Equip your campus cohorts with{" "}
          <span className="relative inline-block text-[#2EC4B6]">
            placement velocity.
            <ScribbleUnderline color="#2EC4B6" className="absolute -bottom-2 sm:-bottom-3 left-0 w-full" />
          </span>
        </h1>

        <p className="font-studio text-base sm:text-xl text-[#4A4A68] leading-relaxed max-w-2xl mx-auto">
          EdWorld Co. partners with leading universities and training institutes to provide real-time cohort telemetry, automated 3D lockdown mock drives, and Harvard-standard ATS resume verification.
        </p>

        {/* Trust Badges Strip */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl bg-white border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#FFC93C]">
            <div className="font-display font-black text-2xl text-[#1B1B2F]">94.2%</div>
            <div className="text-[10px] font-heading font-extrabold uppercase text-[#4A4A68]">Drive Shortlist Rate</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#FF6B6B]">
            <div className="font-display font-black text-2xl text-[#1B1B2F]">100%</div>
            <div className="text-[10px] font-heading font-extrabold uppercase text-[#4A4A68]">Lockdown Anti-Cheat</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#2EC4B6]">
            <div className="font-display font-black text-2xl text-[#1B1B2F]">14,800+</div>
            <div className="text-[10px] font-heading font-extrabold uppercase text-[#4A4A68]">Students Mentored</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#8E6CEF]">
            <div className="font-display font-black text-2xl text-[#1B1B2F]">0-Friction</div>
            <div className="text-[10px] font-heading font-extrabold uppercase text-[#4A4A68]">Domain Whitelisting</div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE 4 INSTITUTIONAL PILLARS (3D TILT CARDS)                            */}
      {/* ========================================================================= */}
      <section className="space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <StudioSticker bgColor="#8E6CEF" textColor="#FFFFFF">
            Institutional Capabilities
          </StudioSticker>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1B1B2F]">
            Complete placement intelligence for TPOs.
          </h2>
          <p className="font-studio text-xs sm:text-sm text-[#4A4A68]">
            Move beyond messy spreadsheets. Track real engineering competencies across departments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {institutionalPillars.map((pillar, idx) => {
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
                  <span>Real-time TPO portal sync</span>
                </div>
              </Card3DTilt>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW CAMPUS PARTNERSHIP WORKS (3 STEPS)                                 */}
      {/* ========================================================================= */}
      <section className="bg-white border-2 border-[#1B1B2F] rounded-3xl p-8 sm:p-14 shadow-[8px_8px_0px_#1B1B2F] space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <StudioSticker bgColor="#FFC93C" textColor="#1B1B2F">
            Simple 3-Step Setup
          </StudioSticker>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1B1B2F]">
            How campus onboarding works.
          </h2>
          <p className="font-studio text-xs sm:text-sm text-[#4A4A68]">
            Zero hardware required. Full rollout across hundreds of students in under 48 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collegeSteps.map((s, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] p-6 space-y-3 shadow-[4px_4px_0px_#1B1B2F]"
            >
              <span className="w-10 h-10 rounded-2xl bg-[#FF6B6B] border-2 border-[#1B1B2F] font-heading font-black text-base text-white flex items-center justify-center shadow-[2px_2px_0px_#1B1B2F]">
                {s.step}
              </span>
              <h3 className="font-heading font-extrabold text-base text-[#1B1B2F]">
                {s.title}
              </h3>
              <p className="font-studio text-xs text-[#4A4A68] leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CAMPUS DEMO REQUEST FORM                                              */}
      {/* ========================================================================= */}
      <section className="max-w-3xl mx-auto">
        <div className="rounded-3xl bg-white border-2 border-[#1B1B2F] p-8 sm:p-12 shadow-[8px_8px_0px_#1B1B2F] space-y-8">
          <div className="text-center space-y-2">
            <StudioSticker bgColor="#2EC4B6" textColor="#1B1B2F">
              ✦ Partner With EdWorld
            </StudioSticker>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1B1B2F]">
              Request an Institutional Campus Demo
            </h2>
            <p className="font-studio text-xs sm:text-sm text-[#4A4A68]">
              Speak directly with our university relations team to schedule a custom walkthrough for your faculty or placement cell.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-600 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-heading font-black text-lg text-emerald-950">
                Institutional Request Received!
              </h3>
              <p className="font-studio text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                Thank you, {formData.contactName}. Our University Placement Liaison will reach out to {formData.email} within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-heading font-extrabold text-xs text-[#1B1B2F]">
                    College / University Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    placeholder="e.g. Osmania University College of Engg."
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] text-xs font-studio text-[#1B1B2F] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-heading font-extrabold text-xs text-[#1B1B2F]">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="e.g. Dr. Ramesh Kumar"
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] text-xs font-studio text-[#1B1B2F] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-heading font-extrabold text-xs text-[#1B1B2F]">
                    Official Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. tpo@university.ac.in"
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] text-xs font-studio text-[#1B1B2F] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-heading font-extrabold text-xs text-[#1B1B2F]">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] text-xs font-studio text-[#1B1B2F] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-heading font-extrabold text-xs text-[#1B1B2F]">
                    Your Designation
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] text-xs font-studio text-[#1B1B2F] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  >
                    <option value="Placement Officer / TPO">Placement Officer / TPO</option>
                    <option value="Dean / Principal">Dean / Principal</option>
                    <option value="Department HOD">Department HOD</option>
                    <option value="Student Placement Coordinator">Student Placement Coordinator</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-heading font-extrabold text-xs text-[#1B1B2F]">
                    Expected Student Cohort Size
                  </label>
                  <select
                    value={formData.studentCount}
                    onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] text-xs font-studio text-[#1B1B2F] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  >
                    <option value="100-500">100 – 500 Students</option>
                    <option value="500-1000">500 – 1,000 Students</option>
                    <option value="1000-3000">1,000 – 3,000 Students</option>
                    <option value="3000+">3,000+ Students</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-heading font-extrabold text-xs text-[#1B1B2F]">
                  Specific Requirements or Target Companies (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your upcoming campus drives or specific focus areas (e.g. Fullstack, DSA, Core Engg)..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] text-xs font-studio text-[#1B1B2F] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                />
              </div>

              <button
                type="submit"
                className="btn-squishy w-full py-4 rounded-2xl bg-[#FF6B6B] text-white font-heading font-extrabold text-sm border-2 border-[#1B1B2F] shadow-[4px_4px_0px_#1B1B2F] flex items-center justify-center gap-2 select-none"
              >
                <Send className="w-4 h-4" />
                <span>Submit Campus Partnership Request</span>
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
