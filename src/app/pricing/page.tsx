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
        colors: ["#2563EB", "#10B981", "#F59E0B", "#6366F1"],
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24 font-sans text-[#111827]">
      
      {/* 1. HERO HEADER */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Honest Student Pricing
          </span>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-[#4B5563] border border-gray-200">
            No Hidden Fees &bull; GST Included
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-[#111827] tracking-tight">
          Fair, predictable plans for every student.
        </h1>

        <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-2xl mx-auto">
          Start completely free with foundational resume optimization and AI mock interviews. Upgrade to Career Pro for unlimited interview reps and production labs.
        </p>

        {/* Monthly / Annual Billing Toggle */}
        <div className="pt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-[#111827] text-white border-[#111827] shadow-xs"
                : "bg-white text-[#4B5563] hover:bg-gray-50 border-[#E5E7EB]"
            }`}
          >
            Monthly Billing
          </button>
          
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
              billingCycle === "annual"
                ? "bg-[#111827] text-white border-[#111827] shadow-xs"
                : "bg-white text-[#4B5563] hover:bg-gray-50 border-[#E5E7EB]"
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
              Save 20%
            </span>
          </button>
        </div>
      </section>

      {/* 2. THREE PRICING TIERS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all relative ${
              p.isPopular
                ? "bg-white border-2 border-[#2563EB] shadow-lg ring-1 ring-[#2563EB]/20"
                : "bg-white border border-[#E5E7EB] shadow-xs hover:border-gray-300"
            }`}
          >
            {p.isPopular && (
              <div className="absolute -top-3 right-6">
                <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB] text-white text-[11px] font-semibold shadow-xs">
                  {p.badge}
                </span>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                    {p.name}
                  </span>
                  {!p.isPopular && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-[#4B5563] border border-gray-200">
                      {p.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-4xl sm:text-5xl font-bold text-[#111827] tracking-tight">
                    {p.priceInr === null ? "Custom" : `₹${p.priceInr}`}
                  </span>
                  <span className="text-xs text-[#6B7280]">
                    / {p.period}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed pt-1">
                  {p.description}
                </p>
              </div>

              {/* Included Features List */}
              <div className="space-y-3 pt-4 border-t border-[#F3F4F6]">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] block">
                  Included Capabilities:
                </span>
                <div className="space-y-2.5">
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#374151]">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          p.isPopular ? "text-[#2563EB]" : "text-emerald-600"
                        }`}
                      />
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F3F4F6]">
              <Link
                href={p.ctaHref}
                onClick={p.isPopular ? triggerConfetti : undefined}
                className={`w-full py-3 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-2 transition-colors shadow-xs ${
                  p.isPopular
                    ? "bg-[#2563EB] hover:bg-blue-700 text-white"
                    : "bg-[#111827] hover:bg-black text-white"
                }`}
              >
                <span>{p.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* 3. FEATURE COMPARISON MATRIX TABLE */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] p-6 sm:p-8 shadow-xs max-w-5xl mx-auto space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Side-by-Side Entitlements</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
            Plan Feature Matrix
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Detailed breakdown of limits and capabilities across tiers.
          </p>
        </div>

        <div className="overflow-x-auto border border-[#E5E7EB] rounded-xl">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[#111827] font-semibold uppercase">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Free Starter</th>
                <th className="py-3 px-4 bg-blue-50/60 text-[#2563EB] font-bold">
                  Career Pro (₹49)
                </th>
                <th className="py-3 px-4">Campus Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {comparisonRows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#111827]">{row.feature}</td>
                  <td className="py-3.5 px-4 text-[#4B5563]">{row.free}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#2563EB] bg-blue-50/30">
                    {row.pro}
                  </td>
                  <td className="py-3.5 px-4 text-[#4B5563]">{row.campus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. 100% TRANSPARENT BILLING GUARANTEE */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E7EB] text-center space-y-3 max-w-4xl mx-auto shadow-xs">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-[#111827]">
          <span>✦ All prices inclusive of applicable GST (18%)</span>
          <span className="text-gray-300">&bull;</span>
          <span>Zero hidden platform surcharges</span>
          <span className="text-gray-300">&bull;</span>
          <span>1-Click self-service cancellation</span>
        </div>
        <p className="text-xs text-[#6B7280] max-w-xl mx-auto leading-relaxed">
          All paid tiers are backed by our transparent 7-Day Money-Back Guarantee. Subscriptions may be cancelled anytime with zero penalty. View our full{" "}
          <Link href="/terms" className="font-semibold underline text-[#111827]">
            Terms of Learning
          </Link>.
        </p>
      </section>

      {/* 5. PRICING FAQS ACCORDION */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
            Pricing Questions &amp; Answers
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Everything you need to know about plans, billing, and cancellations.
          </p>
        </div>

        <div className="space-y-3">
          {pricingFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-white border border-[#E5E7EB] transition-colors shadow-xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-semibold text-sm sm:text-base text-[#111827] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-[#2563EB]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed mt-3 pt-3 border-t border-[#F3F4F6] animate-in fade-in">
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
