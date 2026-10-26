"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, ShieldCheck, Check, Send, ArrowRight } from "lucide-react";

export default function EdworldFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const handleOpenCookiePreferences = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("edworld-open-cookie-preferences"));
    }
  };

  return (
    <footer className="border-t border-[#E2EBE5] dark:border-[#1D2E25] bg-[#F8FAF9] dark:bg-[#08120D] text-xs text-[#4A5D54] dark:text-[#9EADA5] select-none font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1B4332] to-[#2D6A4F] text-white flex items-center justify-center font-black text-base shadow-xs">
                E
              </div>
              <span className="font-black text-base tracking-tight text-[#0B1E16] dark:text-[#F1F5F3]">
                Ed<span className="text-[#1B4332] dark:text-[#52B788]">World Co.</span>
              </span>
            </div>

            <p className="text-xs text-[#4A5D54] dark:text-[#9EADA5] max-w-sm leading-relaxed">
              The unified Skills & Career Operating System for students, researchers, and early professionals. Calibrate real-world skills with proctored AI mock interviews and single-column ATS resumes.
            </p>

            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#1B4332] dark:text-[#52B788] shrink-0" />
                <span>Operating Headquarters: <strong>Hyderabad, Telangana, India</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#1B4332] dark:text-[#52B788] shrink-0" />
                <span>Grievance & Support: <a href="mailto:edworld.eden@gmail.com" className="font-bold text-[#0B1E16] dark:text-white hover:underline">edworld.eden@gmail.com</a></span>
              </div>
            </div>

            {/* Real-time Status line */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF9ED] dark:bg-[#121E18] border border-[#B7E4C7] dark:border-[#1D2E25] text-[11px] font-bold text-[#1B4332] dark:text-[#52B788]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>All systems operational &bull; 99.98% uptime</span>
            </div>
          </div>

          {/* Column 2: Products & Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0B1E16] dark:text-[#F1F5F3]">
              Products & Studios
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/practice" className="hover:text-[#1B4332] dark:hover:text-[#52B788] transition-colors">
                  AI Mock Interviews
                </Link>
              </li>
              <li>
                <Link href="/resumes" className="hover:text-[#1B4332] dark:hover:text-[#52B788] transition-colors">
                  ATS Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/career" className="hover:text-[#1B4332] dark:hover:text-[#52B788] transition-colors">
                  Career OS & Radar
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-[#1B4332] dark:hover:text-[#52B788] transition-colors">
                  Verified Job Board
                </Link>
              </li>
              <li>
                <Link href="/dsa" className="hover:text-[#1B4332] dark:hover:text-[#52B788] transition-colors">
                  DSA Interactive Studio
                </Link>
              </li>
              <li>
                <Link href="/mobile" className="hover:text-[#1B4332] dark:hover:text-[#52B788] transition-colors font-semibold text-[#D97706]">
                  Mobile Prototype (390×844)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0B1E16] dark:text-[#F1F5F3]">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-[#1B4332] dark:hover:text-[#52B788] transition-colors">
                  Privacy Policy (DPDP 2023)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#1B4332] dark:hover:text-[#52B788] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-[#1B4332] dark:hover:text-[#52B788] transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleOpenCookiePreferences}
                  className="hover:text-[#1B4332] dark:hover:text-[#52B788] transition-colors text-left cursor-pointer"
                >
                  Cookie Preferences
                </button>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#1B4332] dark:hover:text-[#52B788] transition-colors">
                  About EdWorld Co.
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Community */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0B1E16] dark:text-[#F1F5F3]">
              Stay Calibrated
            </h4>
            <p className="text-xs text-[#4A5D54] dark:text-[#9EADA5]">
              Weekly newsletter with FAANG mock questions, hiring trends, and contest dates.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter college email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E2EBE5] dark:border-[#1D2E25] bg-white dark:bg-[#121E18] text-[#0B1E16] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1B4332] min-h-[44px]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-[#1B4332] text-white flex items-center justify-center hover:bg-[#2D6A4F] transition-colors cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {subscribed && (
                <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" />
                  <span>Subscribed! Check your inbox.</span>
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Security Certification */}
        <div className="pt-6 border-t border-[#E2EBE5] dark:border-[#1D2E25] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#788B82]">
          <p>
            &copy; {new Date().getFullYear()} EdWorld Co. (edworld.co.in). All rights reserved. Registered Indian Digital Educational Entity.
          </p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-semibold text-[#1B4332] dark:text-[#52B788]">
              <ShieldCheck className="w-3.5 h-3.5" /> 99.98% Uptime &bull; ISO 27001 &amp; DPDP 2023 Aligned
            </span>
            <Link href="/terms" className="hover:underline">Legal Disclaimers</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
