"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Mail, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  Sparkles,
  Heart,
  Send,
  CheckCircle2
} from "lucide-react";
import { SUBJECT_THEMES } from "@/lib/design-tokens";
import { ScribbleUnderline, DoodleStar } from "./DoodleAccents";

export default function StudioFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative bg-[#FFF8EE] text-[#1B1B2F] border-t-4 border-[#1B1B2F] pt-14 pb-8 overflow-hidden select-none">
      
      {/* Subtle paper-cut border topper */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFC93C]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter & Studio Callout Box */}
        <div className="relative rounded-3xl bg-white border-2 border-[#1B1B2F] p-6 sm:p-10 shadow-[6px_6px_0px_#1B1B2F] mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFC93C] border-2 border-[#1B1B2F] text-xs font-heading font-extrabold uppercase shadow-[2px_2px_0px_#1B1B2F]">
                <DoodleStar className="w-3.5 h-3.5" />
                <span>The Engineering Dispatch</span>
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#1B1B2F] leading-tight">
                Technical interview breakdowns &amp; ATS playbooks.
              </h3>
              <p className="font-studio text-sm sm:text-base text-[#4A4A68]">
                Weekly system design walkthroughs, campus placement interview debriefs, and Google X-Y-Z resume optimization tips. Read by 14,000+ ambitious students and engineers.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-600 text-emerald-950 flex items-center gap-2 font-heading font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>You're on the list! First dispatch arrives this Sunday.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your student email..."
                    required
                    className="flex-1 px-4 py-3 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] text-sm font-studio text-[#1B1B2F] placeholder-[#7E7E9A] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  />
                  <button
                    type="submit"
                    className="btn-squishy px-5 py-3 rounded-2xl bg-[#FF6B6B] text-white font-heading font-extrabold text-sm border-2 border-[#1B1B2F] flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Subscribe</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* 4-Column Editorial Directory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b-2 border-[#1B1B2F]/15">
          
          {/* Col 1: Studio Identity */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl bg-[#1B1B2F] p-1 border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#FFC93C]">
                <Image
                  src="/images/edworld-mark.png"
                  alt="EdWorld Co. Logo"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-display font-black text-xl text-[#1B1B2F]">
                EdWorld <span className="text-[#FF6B6B]">Co.</span>
              </span>
            </Link>

            <p className="font-studio text-xs sm:text-sm text-[#4A4A68] leading-relaxed">
              The unified career acceleration engine for engineers and students: 3D lockdown mock interviews, smart ATS resume matching, hands-on production labs, and verified peer networking.
            </p>

            <div className="space-y-2 text-xs font-studio text-[#4A4A68] pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FF6B6B] shrink-0 mt-0.5" />
                <span>HITEC City, Madhapur, Hyderabad, Telangana 500081</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#4D96FF] shrink-0" />
                <a href="mailto:edworld.eden@gmail.com" className="hover:underline font-bold text-[#1B1B2F]">
                  edworld.eden@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#2EC4B6] shrink-0" />
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-bold text-[#1B1B2F]"
                >
                  WhatsApp Student Hotline
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Core Platform Capabilities */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-[#1B1B2F]">
              Platform Capabilities
            </h4>
            <ul className="space-y-2 text-xs font-studio">
              {Object.values(SUBJECT_THEMES).map((pillar) => (
                <li key={pillar.id}>
                  <Link
                    href={pillar.href}
                    className="flex items-center gap-2 hover:text-[#FF6B6B] transition-colors group"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-[#1B1B2F] shrink-0 group-hover:scale-125 transition-transform"
                      style={{ backgroundColor: pillar.color }}
                    />
                    <span className="text-[#1B1B2F] font-medium">{pillar.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Career OS Tools */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-[#1B1B2F]">
              Career OS Tools
            </h4>
            <ul className="space-y-2 text-xs font-studio text-[#4A4A68]">
              <li>
                <Link href="/career/scam-checker" className="hover:text-[#1B1B2F] hover:underline flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Scam Offer Detector</span>
                </Link>
              </li>
              <li>
                <Link href="/career/roadmap" className="hover:text-[#1B1B2F] hover:underline flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Multi-Horizon Roadmap</span>
                </Link>
              </li>
              <li>
                <Link href="/settings/alerts" className="hover:text-[#1B1B2F] hover:underline flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>WhatsApp &amp; Telegram Alerts</span>
                </Link>
              </li>
              <li>
                <Link href="/interviews" className="hover:text-[#1B1B2F] hover:underline flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Adaptive Mock Interviews</span>
                </Link>
              </li>
              <li>
                <Link href="/resumes" className="hover:text-[#1B1B2F] hover:underline flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Harvard ATS Resume Maker</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Solutions & Trust */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-[#1B1B2F]">
              Solutions &amp; Trust
            </h4>
            <ul className="space-y-2 text-xs font-studio text-[#4A4A68]">
              <li>
                <Link href="/for-college" className="hover:text-[#1B1B2F] hover:underline">
                  Campus Placement Hub
                </Link>
              </li>
              <li>
                <Link href="/network" className="hover:text-[#1B1B2F] hover:underline">
                  Verified Student ID Card
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#1B1B2F] hover:underline">
                  Project Studio &amp; EdBuild
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#1B1B2F] hover:underline">
                  Student Starter &amp; Plans
                </Link>
              </li>
              <li>
                <Link href="/styleguide" className="hover:text-[#FF6B6B] font-bold flex items-center gap-1">
                  <span>Design System Style Guide</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FFC93C] text-[#1B1B2F] border border-[#1B1B2F]">✦</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-studio text-[#4A4A68]">
          <p className="flex items-center gap-1.5">
            <span>&copy; {new Date().getFullYear()} EdWorld Co. Hand-crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#FF6B6B] fill-[#FF6B6B]" />
            <span>for curious minds.</span>
          </p>

          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">
              Privacy Notice
            </Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:underline">
              Terms of Learning
            </Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:underline">
              Contact Office
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
