"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  ArrowRight,
  GraduationCap,
  Layers,
  ChevronDown,
  Lock
} from "lucide-react";
import { SUBJECT_THEMES } from "@/lib/design-tokens";
import StudioSticker from "./StudioSticker";

export default function StudioNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
  const [activeFocusTime, setActiveFocusTime] = useState<string | null>(null);

  useEffect(() => {
    const checkFocus = () => {
      try {
        const raw = localStorage.getItem("edworld_active_focus_session");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.isActive && !parsed.isCompleted) {
            const end = new Date(parsed.endTime).getTime();
            const now = Date.now();
            if (now < end) {
              const secs = Math.floor((end - now) / 1000);
              const m = Math.floor(secs / 60);
              const s = secs % 60;
              setActiveFocusTime(`${m}:${s < 10 ? "0" : ""}${s}`);
              return;
            }
          }
        }
        setActiveFocusTime(null);
      } catch (_) {}
    };

    checkFocus();
    const interval = setInterval(checkFocus, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCoursesDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Mock Studio", href: "/interviews" },
    { label: "ATS Resumes", href: "/resumes" },
    { label: "EdFix Labs", href: "/edfix" },
    { label: "Focus Lock", href: "/focus", badge: activeFocusTime || "Study Shield" },
    { label: "Scam Checker", href: "/career/scam-checker" },
    { label: "Network", href: "/network" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-[#FFF8EE]/95 backdrop-blur-md border-b-2 border-[#1B1B2F] shadow-[0_4px_0px_#1B1B2F]"
          : "bg-[#FFF8EE] border-b-2 border-[#1B1B2F]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Logo & Studio Mark */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 rounded-2xl bg-[#1B1B2F] p-1 border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#FFC93C] group-hover:rotate-6 transition-transform">
              <Image
                src="/images/edworld-mark.png"
                alt="EdWorld Co. Mark"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl text-[#1B1B2F] tracking-tight leading-none">
                EdWorld <span className="text-[#FF6B6B] font-bold">Co.</span>
              </span>
              <span className="font-heading font-extrabold text-[10px] uppercase tracking-wider text-[#4A4A68] mt-0.5">
                Meet • Connect • Play
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            
            {/* Platform Capabilities Dropdown Trigger */}
            <div className="relative" onMouseLeave={() => setIsCoursesDropdownOpen(false)}>
              <button
                type="button"
                onClick={() => setIsCoursesDropdownOpen(!isCoursesDropdownOpen)}
                onMouseEnter={() => setIsCoursesDropdownOpen(true)}
                className="flex items-center gap-1.5 font-heading font-bold text-sm text-[#1B1B2F] hover:text-[#FF6B6B] transition-colors py-2 cursor-pointer"
              >
                <span>Platform Capabilities</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCoursesDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Subject Category Mega Menu */}
              {isCoursesDropdownOpen && (
                <div className="absolute top-full left-0 w-88 p-3 bg-[#FFF8EE] rounded-2xl border-2 border-[#1B1B2F] shadow-[6px_6px_0px_#1B1B2F] grid grid-cols-1 gap-1.5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="px-2 py-1 text-[10px] font-heading font-extrabold uppercase tracking-wider text-[#4A4A68]">
                    6 Core Platform Engines
                  </div>
                  {Object.values(SUBJECT_THEMES).map((pillar) => (
                    <Link
                      key={pillar.id}
                      href={pillar.href}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white border border-transparent hover:border-[#1B1B2F] transition-all group"
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-[#1B1B2F] shrink-0"
                        style={{ backgroundColor: pillar.color }}
                      />
                      <div className="flex flex-col">
                        <span className="font-heading font-bold text-xs text-[#1B1B2F] group-hover:translate-x-0.5 transition-transform">
                          {pillar.name}
                        </span>
                        <span className="font-studio text-[10px] text-[#4A4A68] line-clamp-1">
                          {pillar.tagline}
                        </span>
                      </div>
                    </Link>
                  ))}
                  <div className="pt-2 mt-1 border-t border-[#1B1B2F]/15 flex items-center justify-between px-2">
                    <Link
                      href="/interviews"
                      className="text-xs font-heading font-bold text-[#FF6B6B] hover:underline flex items-center gap-1"
                    >
                      <span>Explore Mock Interview Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Standard Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-heading font-bold text-sm text-[#1B1B2F] hover:text-[#FF6B6B] transition-colors relative py-2"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[#FFC93C] text-[#1B1B2F] border border-[#1B1B2F] text-[9px] font-extrabold uppercase tracking-tight shadow-[1px_1px_0px_#1B1B2F]">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {activeFocusTime && (
              <Link
                href="/focus"
                className="btn-squishy inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFC93C] text-[#1B1B2F] font-mono font-black text-xs border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F] hover:translate-x-[1px] hover:translate-y-[1px]"
              >
                <Lock className="w-3.5 h-3.5 text-[#1B1B2F] animate-pulse" />
                <span>{activeFocusTime} Focused</span>
              </Link>
            )}

            <Link
              href="/auth/login"
              className="font-heading font-bold text-sm text-[#1B1B2F] hover:text-[#FF6B6B] px-3 py-2 transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/auth/signup"
              className="btn-squishy inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#FF6B6B] text-white font-heading font-extrabold text-sm border-2 border-[#1B1B2F] select-none"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Free</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-white border-2 border-[#1B1B2F] text-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FFF8EE] border-b-2 border-[#1B1B2F] px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <div className="font-heading font-extrabold text-xs uppercase text-[#4A4A68] px-2 py-1">
              Platform Capabilities
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(SUBJECT_THEMES).map((pillar) => (
                <Link
                  key={pillar.id}
                  href={pillar.href}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-[#1B1B2F] shrink-0"
                    style={{ backgroundColor: pillar.color }}
                  />
                  <span className="font-heading font-bold text-xs text-[#1B1B2F] truncate">
                    {pillar.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#1B1B2F]/15 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border-2 border-[#1B1B2F] font-heading font-bold text-sm text-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-[#4A4A68]" />
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-[#1B1B2F]/15 flex flex-col gap-2.5">
            <Link
              href="/auth/signup"
              className="w-full text-center py-3 rounded-2xl bg-[#FF6B6B] text-white font-heading font-extrabold text-sm border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F]"
            >
              Start Practicing Free
            </Link>
            <Link
              href="/auth/login"
              className="w-full text-center py-2.5 rounded-2xl bg-white text-[#1B1B2F] font-heading font-bold text-sm border-2 border-[#1B1B2F]"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
