"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  X,
  CreditCard,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Building2,
  GraduationCap,
  ChevronDown,
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

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

  const plans = [
    {
      id: "free",
      name: "Free Student Starter",
      priceInr: 0,
      period: "forever",
      description: "Essential foundational tools for interview practice and resume parsing.",
      color: "#6BCB77", // Leaf Green
      textColor: "#1B1B2F",
      badge: "Zero Cost",
      features: [
        "1 Single-Column ATS Vector Resume",
        "2 AI Mock Interviews / month",
        "View-Only Job & Internship Board",
        "Community Discord & Pod Access",
        "Basic STAR Rubric Feedback",
      ],
      ctaLabel: "Start For Free",
      ctaHref: "/auth/signup",
      isPopular: false,
    },
    {
      id: "pro",
      name: "Career Pro",
      priceInr: billingCycle === "monthly" ? 49 : 39,
      period: "month",
      description: "Maximum velocity for campus placements and off-campus tech drives.",
      color: "#FFC93C", // Sunshine Yellow
      textColor: "#1B1B2F",
      badge: "✦ Most Popular",
      features: [
        "Unlimited ATS Resumes & Job Tailoring",
        "Unlimited AI Voice & Video Mock Interviews",
        "Real-Time Waveform & Speech Cadence",
        "Direct Applications to Verified Jobs",
        "Production Incident Labs (EdFix)",
        "Priority Recruiter Visibility Badge",
      ],
      ctaLabel: billingCycle === "monthly" ? "Upgrade to Pro (₹49)" : "Upgrade to Pro (₹39/mo)",
      ctaHref: "/billing?plan=pro",
      isPopular: true,
    },
    {
      id: "institutional",
      name: "Universities & Campus",
      priceInr: null,
      period: "Custom Cohort",
      description: "End-to-end placement telemetry and cohort training for universities.",
      color: "#FF6B6B", // Coral
      textColor: "#FFFFFF",
      badge: "Campus Partner",
      features: [
        "TPO Placement Readiness Dashboard",
        "Campus-wide Mock Assessment Drives",
        "Bulk Student Calibrated Profiles",
        "Direct Corporate Partner Matchmaking",
        "Dedicated Placement Account Manager",
        "Custom College Domain Whitelisting",
      ],
      ctaLabel: "Contact Campus Team",
      ctaHref: "/for-college",
      isPopular: false,
    },
  ];

  const comparisonRows = [
    { feature: "Single-Column Vector ATS Resumes", free: "1 Resume", pro: "Unlimited", campus: "Unlimited" },
    { feature: "Job Description Keyword Matcher", free: "Basic Match", pro: "Deep Parser & Chips", campus: "Deep Parser & Chips" },
    { feature: "AI Mock Interviews (Voice + Video)", free: "2 / month", pro: "Unlimited", campus: "Unlimited" },
    { feature: "Speech Cadence & Filler-Word Counter", free: "✗", pro: "✓ (130-160 WPM Target)", campus: "✓ (130-160 WPM Target)" },
    { feature: "Direct Verified Job Applications", free: "View Only", pro: "✓ Direct Apply", campus: "✓ Priority Cohort Pools" },
    { feature: "Production Incident Labs (EdFix)", free: "✗", pro: "✓ Full Access", campus: "✓ Custom Curriculum" },
    { feature: "TPO Placement Analytics Portal", free: "✗", pro: "✗", campus: "✓ Real-Time Telemetry" },
    { feature: "Support SLA", free: "Community", pro: "Priority Email", campus: "Dedicated Account Manager" },
  ];

  const pricingFaqs = [
    {
      q: "Can I use EdWorld completely for free?",
      a: "Yes! Our Free Student Starter is ₹0 forever. It includes 1 vector ATS resume, 2 AI mock interviews every month, and complete access to the curated job board and community.",
    },
    {
      q: "How does Career Pro billing work?",
      a: "Career Pro is ₹49 per month (or ₹39 per month billed annually). You get unlimited AI mock interviews in 3D lockdown mode, unlimited resume tailoring, and full access to EdFix production engineering drills.",
    },
    {
      q: "Are there any hidden platform charges or lock-ins?",
      a: "Zero hidden charges. All prices include 18% GST. You can cancel your subscription anytime with a single click from your billing settings without questions or penalties.",
    },
    {
      q: "How do university licenses and TPO plans work?",
      a: "Colleges and training institutes can partner with EdWorld to provision batches of students. TPOs receive a dedicated analytics portal to track student readiness and conduct campus-wide screening rounds.",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-20 sm:space-y-28">
      
      {/* ========================================================================= */}
      {/* 1. HERO HEADER                                                            */}
      {/* ========================================================================= */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <StudioSticker bgColor="#FFC93C" rotate="slight-left" size="sm">
            ✦ Honest Student Pricing
          </StudioSticker>
          <StudioSticker bgColor="#2EC4B6" rotate="slight-right" size="sm">
            No Hidden Fees &bull; GST Included
          </StudioSticker>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-[#1B1B2F] leading-[1.08] tracking-tight">
          Fair, predictable plans for{" "}
          <span className="relative inline-block text-[#FF6B6B]">
            every student.
            <ScribbleUnderline color="#FF6B6B" className="absolute -bottom-2 sm:-bottom-3 left-0 w-full" />
          </span>
        </h1>

        <p className="font-studio text-base sm:text-xl text-[#4A4A68] leading-relaxed max-w-2xl mx-auto">
          Start completely free with foundational resume optimization and AI mock interviews. Upgrade to Career Pro for unlimited interview reps and production labs.
        </p>

        {/* Monthly / Annual Billing Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`btn-squishy px-5 py-2.5 rounded-2xl font-heading font-extrabold text-xs border-2 border-[#1B1B2F] transition-all cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-[#1B1B2F] text-white shadow-[3px_3px_0px_#FFC93C]"
                : "bg-white text-[#1B1B2F] hover:bg-[#FFF8EE]"
            }`}
          >
            Monthly Billing
          </button>
          
          <button
            onClick={() => setBillingCycle("annual")}
            className={`btn-squishy px-5 py-2.5 rounded-2xl font-heading font-extrabold text-xs border-2 border-[#1B1B2F] transition-all cursor-pointer flex items-center gap-2 ${
              billingCycle === "annual"
                ? "bg-[#1B1B2F] text-white shadow-[3px_3px_0px_#2EC4B6]"
                : "bg-white text-[#1B1B2F] hover:bg-[#FFF8EE]"
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full bg-[#FFC93C] text-[#1B1B2F] text-[10px] font-mono font-extrabold border border-[#1B1B2F]">
              Save 20%
            </span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THREE PRICING TIERS (3D TILT CARDS)                                    */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((p) => (
          <Card3DTilt
            key={p.id}
            className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-6 border-2 border-[#1B1B2F] transition-all relative ${
              p.isPopular
                ? "bg-white shadow-[8px_8px_0px_#1B1B2F] ring-4 ring-[#FFC93C]"
                : "bg-white shadow-[6px_6px_0px_#1B1B2F]"
            }`}
            shadowColor="#1B1B2F"
          >
            {p.isPopular && (
              <div className="absolute -top-3.5 right-6">
                <StudioSticker bgColor="#FFC93C" textColor="#1B1B2F" size="sm" rotate="slight-right">
                  {p.badge}
                </StudioSticker>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#7E7E9A]">
                    {p.name}
                  </span>
                  {!p.isPopular && (
                    <StudioSticker bgColor={p.color} textColor={p.textColor} size="sm" rotate="none">
                      {p.badge}
                    </StudioSticker>
                  )}
                </div>

                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="font-display font-black text-4xl sm:text-5xl text-[#1B1B2F]">
                    {p.priceInr === null ? "Custom" : `₹${p.priceInr}`}
                  </span>
                  <span className="font-studio text-xs text-[#7E7E9A]">
                    / {p.period}
                  </span>
                </div>

                <p className="font-studio text-xs sm:text-sm text-[#4A4A68] leading-relaxed pt-1">
                  {p.description}
                </p>
              </div>

              {/* Included Features List */}
              <div className="space-y-3 pt-4 border-t-2 border-[#1B1B2F]/15">
                <span className="font-heading font-extrabold text-[10px] uppercase text-[#7E7E9A] block">
                  Included Capabilities:
                </span>
                <div className="space-y-2.5">
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs font-studio text-[#1B1B2F]">
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: p.color }}
                      />
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-[#1B1B2F]/15">
              <Link
                href={p.ctaHref}
                onClick={p.isPopular ? triggerConfetti : undefined}
                className="btn-squishy w-full py-3.5 rounded-2xl font-heading font-extrabold text-sm text-center flex items-center justify-center gap-2 select-none border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F]"
                style={{
                  backgroundColor: p.isPopular ? "#FFC93C" : p.color,
                  color: p.textColor,
                }}
              >
                <span>{p.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card3DTilt>
        ))}
      </section>

      {/* ========================================================================= */}
      {/* 3. FEATURE COMPARISON MATRIX TABLE                                       */}
      {/* ========================================================================= */}
      <section className="rounded-3xl bg-white border-2 border-[#1B1B2F] p-6 sm:p-10 shadow-[8px_8px_0px_#1B1B2F] max-w-5xl mx-auto space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2EC4B6] border-2 border-[#1B1B2F] text-xs font-heading font-extrabold uppercase shadow-[2px_2px_0px_#1B1B2F]">
            <DoodleStar className="w-3.5 h-3.5" />
            <span>Side-by-Side Entitlements</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#1B1B2F]">
            Plan Feature Matrix
          </h2>
          <p className="font-studio text-xs sm:text-sm text-[#4A4A68]">
            Detailed breakdown of limits and capabilities across tiers.
          </p>
        </div>

        <div className="overflow-x-auto border-2 border-[#1B1B2F] rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FFF8EE] border-b-2 border-[#1B1B2F] text-[#1B1B2F] font-heading font-extrabold uppercase">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Free Starter</th>
                <th className="py-3 px-4 bg-[#FFC93C]/40 border-x-2 border-[#1B1B2F] text-[#1B1B2F]">
                  Career Pro (₹49)
                </th>
                <th className="py-3 px-4">Campus Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B1B2F]/15 font-studio">
              {comparisonRows.map((row, i) => (
                <tr key={i} className="hover:bg-[#FFF8EE]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#1B1B2F]">{row.feature}</td>
                  <td className="py-3.5 px-4 text-[#4A4A68]">{row.free}</td>
                  <td className="py-3.5 px-4 font-bold text-[#1B1B2F] bg-[#FFC93C]/20 border-x-2 border-[#1B1B2F]">
                    {row.pro}
                  </td>
                  <td className="py-3.5 px-4 text-[#4A4A68]">{row.campus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. 100% TRANSPARENT BILLING GUARANTEE                                     */}
      {/* ========================================================================= */}
      <section className="p-7 sm:p-9 rounded-3xl bg-[#FFF8EE] border-2 border-[#1B1B2F] text-center space-y-3 max-w-4xl mx-auto shadow-[5px_5px_0px_#1B1B2F]">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-heading font-extrabold text-[#1B1B2F]">
          <span>✦ All prices inclusive of applicable GST (18%)</span>
          <span className="text-[#FF6B6B]">&bull;</span>
          <span>Zero hidden platform surcharges</span>
          <span className="text-[#FF6B6B]">&bull;</span>
          <span>1-Click self-service cancellation</span>
        </div>
        <p className="font-studio text-xs text-[#4A4A68] max-w-xl mx-auto leading-relaxed">
          All paid tiers are backed by our transparent 7-Day Money-Back Guarantee. Subscriptions may be cancelled anytime with zero penalty. View our full{" "}
          <Link href="/terms" className="font-bold underline text-[#1B1B2F]">
            Terms of Learning
          </Link>.
        </p>
      </section>

      {/* ========================================================================= */}
      {/* 5. PRICING FAQS ACCORDION                                                 */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1B1B2F]">
            Pricing Questions &amp; Answers
          </h2>
          <p className="font-studio text-xs sm:text-sm text-[#4A4A68]">
            Everything you need to know about plans, billing, and cancellations.
          </p>
        </div>

        <div className="space-y-3">
          {pricingFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border-2 border-[#1B1B2F] transition-all shadow-[3px_3px_0px_#1B1B2F]"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-heading font-bold text-sm sm:text-base text-[#1B1B2F] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#4A4A68] transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-[#FF6B6B]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm font-studio text-[#4A4A68] leading-relaxed mt-3 pt-3 border-t border-[#1B1B2F]/15 animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
