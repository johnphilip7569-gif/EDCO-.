"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Sparkles } from "lucide-react";

export default function ModernEdworldFooter() {
  const handleOpenMyra = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-myra-copilot"));
    }
  };

  return (
    <footer className="border-t border-[#E5E7EB] bg-white text-sm text-[#6B7280] font-sans mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 sm:pt-10 sm:pb-5">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Group 1: EdWorld Co. */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-black flex items-center justify-center border border-[#111827]">
                <Image
                  src="/images/edworld-mark.png"
                  alt="EdWorld Co. Logo"
                  width={28}
                  height={28}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-semibold text-sm tracking-tight text-[#111827]">
                EdWorld <span className="text-[#6B7280] font-normal">Co.</span>
              </span>
            </div>

            <p className="text-sm text-[#6B7280] leading-relaxed">
              A unified platform to learn, practice, and prepare for your future with
              personalized learning paths and career tools.
            </p>

            <div className="space-y-1.5 pt-1 text-sm text-[#6B7280]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#111827] shrink-0" />
                <span>Hyderabad, Telangana, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#111827] shrink-0" />
                <a
                  href="mailto:edworld.eden@gmail.com"
                  className="hover:text-[#2563EB] transition-colors"
                >
                  edworld.eden@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Group 2: Learning */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#111827]">
              Learning
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/learn" className="hover:text-[#111827] transition-colors">
                  Interactive Courses
                </Link>
              </li>
              <li>
                <Link href="/problems" className="hover:text-[#111827] transition-colors">
                  Practice &amp; DSA
                </Link>
              </li>
              <li>
                <Link href="/career" className="hover:text-[#111827] transition-colors">
                  Career Roadmaps
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleOpenMyra}
                  className="hover:text-[#2563EB] transition-colors text-left flex items-center gap-1.5 cursor-pointer text-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Myra AI Study Buddy</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Group 3: Career */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#111827]">
              Career
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/interviews" className="hover:text-[#111827] transition-colors">
                  Adaptive AI Interviews
                </Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-[#111827] transition-colors">
                  ATS Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-[#111827] transition-colors">
                  Opportunities &amp; Internships
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#111827] transition-colors">
                  Student Digital ID
                </Link>
              </li>
            </ul>
          </div>

          {/* Group 4: Support & Legal */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#111827]">
              Support &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/contact" className="hover:text-[#111827] transition-colors">
                  Contact &amp; Grievances
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#111827] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#111827] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-[#111827] transition-colors">
                  Cookie Preferences
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 mt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-[#6B7280]">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} EdWorld Co. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Systems fully operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
