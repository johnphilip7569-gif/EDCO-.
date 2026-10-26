"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Briefcase,
  FileText,
  Video,
  Compass,
  Users,
  CreditCard,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function EdworldNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for shadow elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/practice", label: "Practice", icon: Video },
    { href: "/resumes", label: "ATS Resumes", icon: FileText },
    { href: "/career", label: "Career OS", icon: Compass },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/network", label: "Mentorship", icon: Users },
    { href: "/pricing", label: "Pricing", icon: CreditCard },
  ];

  const handleOpenMyra = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-myra-copilot"));
    }
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200 select-none",
          "bg-white/95 backdrop-blur-md border-b",
          scrolled
            ? "border-neutral-200/90 shadow-xs"
            : "border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Left: Brand Logo & Tagline matching Main UI Crest */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5B47B8] via-[#6351C9] to-[#7360E0] text-white flex items-center justify-center font-black text-xl shadow-[0_4px_12px_rgba(91,71,184,0.3)] group-hover:scale-105 transition-transform">
                E
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-[#111827] leading-none">
                  Ed<span className="text-[#5B47B8]">World</span>
                </span>
                <span className="text-[10px] font-bold text-neutral-500 tracking-wide mt-1">
                  Skills &amp; Career OS
                </span>
              </div>
            </Link>

            {/* Operational Status Pill matching Main UI Lavender Pill */}
            <div className="hidden xl:flex items-center gap-1.5 ml-4 px-3 py-1 rounded-full bg-[#F5F3FF] border border-[#DDD6FE] text-[11px] font-semibold text-[#5B47B8]">
              <span className="w-2 h-2 rounded-full bg-[#5B47B8] animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 text-xs font-bold rounded-full transition-all duration-150 min-h-[44px] flex items-center gap-1.5",
                    isActive
                      ? "text-[#5B47B8] bg-[#F5F3FF] border border-[#DDD6FE]/60"
                      : "text-neutral-600 hover:text-[#111827] hover:bg-neutral-50"
                  )}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions (Ask Myra, Sign In, Get Started CTA) */}
          <div className="flex items-center gap-2.5">
            {/* Ask Myra Button */}
            <button
              type="button"
              onClick={handleOpenMyra}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F5F3FF] text-[#5B47B8] border border-[#DDD6FE] text-xs font-bold hover:bg-[#EDE9FE] transition-colors min-h-[44px] cursor-pointer"
              aria-label="Ask Myra AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Ask Myra</span>
            </button>

            {/* Sign In */}
            <Link
              href="/login"
              className="hidden md:inline-flex items-center text-xs font-bold text-neutral-600 hover:text-black px-3.5 py-2 min-h-[44px]"
            >
              Sign In
            </Link>

            {/* Get Started Free CTA */}
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#18181B] hover:bg-black text-white text-xs font-bold tracking-tight shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-md transition-all active:scale-[0.98] min-h-[44px]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
            </Link>

            {/* Mobile / Tablet Menu Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-18 bg-white border-b border-neutral-200 shadow-2xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-200 z-50">
            {/* Status indicator banner */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] text-xs font-semibold text-[#5B47B8]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5B47B8] animate-pulse" />
                <span>All systems operational (99.98% uptime)</span>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-2xl text-xs font-bold transition-colors min-h-[48px]",
                      isActive
                        ? "bg-[#F5F3FF] text-[#5B47B8] border border-[#DDD6FE]/60"
                        : "text-neutral-600 hover:bg-neutral-50"
                    )}
                  >
                    <Icon className="w-4 h-4 text-[#5B47B8]" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Drawer Actions */}
            <div className="pt-2 border-t border-neutral-100 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleOpenMyra();
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#F5F3FF] text-[#5B47B8] border border-[#DDD6FE] text-xs font-bold min-h-[48px] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span>Ask Myra AI Copilot</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center p-3 rounded-full border border-neutral-200 text-xs font-bold text-neutral-700 min-h-[48px]"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center p-3 rounded-full bg-[#18181B] text-white text-xs font-bold min-h-[48px]"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
