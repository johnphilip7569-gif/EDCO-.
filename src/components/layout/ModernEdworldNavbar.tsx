"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Menu,
  X,
  BookOpen,
  Code2,
  Compass,
  Briefcase,
  FileText,
  Video,
  User as UserIcon,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Sparkles,
  Users,
  MessageSquare,
  ShieldCheck,
  Terminal,
  Layers,
  ShieldAlert,
  Bell,
  Lock,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import RoleScopedNotifications from "@/components/notifications/RoleScopedNotifications";
import { useFocusLock } from "@/hooks/useFocusLock";

export default function ModernEdworldNavbar() {
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();
  const { isSessionActive, formattedTimeLeft } = useFocusLock();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenMyra = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-myra-copilot"));
    }
  };

  const studentName = profile?.name || user?.name || "Student";
  const initials = studentName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isLandingPage = pathname === "/";

  // Dropdown groups
  const learningItems = [
    { href: "/learn", label: "Interactive Courses", icon: BookOpen, desc: "CS tracks & verified certs" },
    { href: "/problems", label: "Practice & DSA", icon: Code2, desc: "Algorithmic problem catalog" },
    { href: "/focus", label: "Focus Lock Studio", icon: Lock, desc: "Distraction blocker & timer" },
    { href: "/projectstudio", label: "Project Studio", icon: Layers, desc: "Engineering problem briefs" },
    { href: "/edfix", label: "EdFix Incident Labs", icon: Terminal, desc: "Live production debugging" },
  ];

  const careerItems = [
    { href: "/career", label: "Career OS Overview", icon: Compass, desc: "Role readiness & milestones" },
    { href: "/career/roadmap", label: "AI Career Roadmap", icon: Compass, desc: "1, 3, & 5-year progression" },
    { href: "/career/scam-checker", label: "Scam Offer Checker", icon: ShieldAlert, desc: "Verify offers & fraud flags" },
    { href: "/settings/alerts", label: "WhatsApp & Telegram Alerts", icon: Bell, desc: "Push alerts by role & city" },
    { href: "/interviews", label: "AI Mock Interviews", icon: Video, desc: "Adaptive behavioral & coding" },
    { href: "/resumes", label: "ATS Resume Builder", icon: FileText, desc: "Single-column Harvard format" },
    { href: "/jobs", label: "Opportunities & Jobs", icon: Briefcase, desc: "Curated internships & roles" },
  ];

  const networkItems = [
    { href: "/edbuild", label: "EdBuild Squads", icon: Users, desc: "Collaborate on projects & get verified" },
    { href: "/network", label: "Member Directory", icon: Users, desc: "Connect with peers & mentors" },
  ];

  return (
    <header
      ref={navRef}
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200 select-none bg-white",
        scrolled
          ? "border-b border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
          : "border-b border-[#E5E7EB]"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Official EdWorld Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center border border-[#111827] transition-transform group-hover:scale-105 duration-200 shrink-0">
              <Image
                src="/images/edworld-mark.png"
                alt="EdWorld Co. Logo"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-base tracking-tight text-[#111827]">
                EdWorld
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#F7F8FA] border border-[#E5E7EB] text-[#6B7280]">
                Co.
              </span>
              <span className="hidden sm:inline-block text-xs text-[#6B7280] font-normal border-l border-[#E5E7EB] pl-2 ml-1">
                Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Main Navigation */}
        {isLandingPage ? (
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <a
              href="#features"
              className="px-3 py-1.5 text-sm font-medium text-[#6B7280] hover:text-[#111827] rounded-md transition-colors duration-150"
            >
              Features
            </a>
            <Link
              href="/learn"
              className="px-3 py-1.5 text-sm font-medium text-[#6B7280] hover:text-[#111827] rounded-md transition-colors duration-150"
            >
              Courses
            </Link>
            <Link
              href="/career"
              className="px-3 py-1.5 text-sm font-medium text-[#6B7280] hover:text-[#111827] rounded-md transition-colors duration-150"
            >
              Career
            </Link>
            <button
              type="button"
              onClick={handleOpenMyra}
              className="px-3 py-1.5 text-sm font-medium text-[#6B7280] hover:text-[#2563EB] rounded-md transition-colors duration-150 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Myra AI</span>
            </button>
          </nav>
        ) : (
          <nav className="hidden lg:flex items-center gap-1">
            {/* 1. Dashboard */}
            <Link
              href="/dashboard"
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150",
                pathname === "/dashboard"
                  ? "bg-[#F7F8FA] text-[#2563EB] border border-[#E5E7EB]"
                  : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FA]"
              )}
            >
              Dashboard
            </Link>

            {/* 2. Learning Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "learning" ? null : "learning")}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150 flex items-center gap-1 cursor-pointer",
                  pathname.startsWith("/learn") || pathname.startsWith("/problems") || pathname.startsWith("/dsa") || pathname.startsWith("/edfix") || pathname.startsWith("/projectstudio") || pathname.startsWith("/projects")
                    ? "bg-[#F7F8FA] text-[#2563EB] border border-[#E5E7EB]"
                    : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FA]"
                )}
              >
                <span>Learning</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openDropdown === "learning" && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#E5E7EB] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {learningItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#F7F8FA] transition-colors"
                      >
                        <div className="w-7 h-7 rounded-md bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5 text-[#111827]">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#111827]">{item.label}</div>
                          <div className="text-xs text-[#6B7280]">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Career Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "career" ? null : "career")}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150 flex items-center gap-1 cursor-pointer",
                  pathname.startsWith("/career") || pathname.startsWith("/interviews") || pathname.startsWith("/resume") || pathname.startsWith("/jobs")
                    ? "bg-[#F7F8FA] text-[#2563EB] border border-[#E5E7EB]"
                    : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FA]"
                )}
              >
                <span>Career</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openDropdown === "career" && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#E5E7EB] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {careerItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#F7F8FA] transition-colors"
                      >
                        <div className="w-7 h-7 rounded-md bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5 text-[#111827]">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#111827]">{item.label}</div>
                          <div className="text-xs text-[#6B7280]">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Network Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "network" ? null : "network")}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150 flex items-center gap-1 cursor-pointer",
                  pathname.startsWith("/network") || pathname.startsWith("/edbuild")
                    ? "bg-[#F7F8FA] text-[#2563EB] border border-[#E5E7EB]"
                    : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FA]"
                )}
              >
                <span>Network</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openDropdown === "network" && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#E5E7EB] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {networkItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#F7F8FA] transition-colors"
                      >
                        <div className="w-7 h-7 rounded-md bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5 text-[#111827]">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#111827]">{item.label}</div>
                          <div className="text-xs text-[#6B7280]">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 5. Messages */}
            <Link
              href="/messages"
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150 flex items-center gap-1.5",
                pathname.startsWith("/messages")
                  ? "bg-[#F7F8FA] text-[#2563EB] border border-[#E5E7EB]"
                  : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FA]"
              )}
            >
              <span>Messages</span>
            </Link>

            {/* 6. Profile */}
            <Link
              href="/profile"
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150",
                pathname === "/profile"
                  ? "bg-[#F7F8FA] text-[#2563EB] border border-[#E5E7EB]"
                  : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FA]"
              )}
            >
              Profile
            </Link>
          </nav>
        )}

        {/* Right: Actions & User Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Ask Myra button */}
          <button
            type="button"
            onClick={handleOpenMyra}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7F8FA] hover:bg-gray-100 text-[#111827] border border-[#E5E7EB] text-xs font-medium transition-colors duration-150 cursor-pointer"
            aria-label="Ask Myra AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="hidden sm:inline">Ask Myra</span>
          </button>

          {/* Live Focus Lock Session Pill */}
          {isSessionActive && (
            <Link
              href="/focus"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-mono font-bold transition-colors animate-pulse"
              title="Focus Lock Active - Return to Study Room"
            >
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>{formattedTimeLeft}</span>
            </Link>
          )}

          {/* Real-time Notification Bell */}
          {user && <RoleScopedNotifications />}

          {/* User Auth States */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg bg-[#F7F8FA] hover:bg-gray-100 border border-[#E5E7EB] transition-colors text-xs font-semibold text-[#111827] cursor-pointer"
              >
                <div className="w-7 h-7 rounded-md bg-[#111827] text-white flex items-center justify-center font-bold text-xs">
                  {initials || "U"}
                </div>
                <span className="hidden md:inline max-w-[100px] truncate">{studentName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#E5E7EB] py-1.5 animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="px-4 py-2 border-b border-[#E5E7EB]">
                    <p className="text-xs font-bold text-[#111827] truncate">{studentName}</p>
                    <p className="text-[11px] text-[#6B7280] truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#111827] hover:bg-[#F7F8FA] hover:text-[#2563EB] transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#111827] hover:bg-[#F7F8FA] hover:text-[#2563EB] transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Profile &amp; Settings</span>
                  </Link>

                  <div className="my-1 border-t border-[#E5E7EB]" />

                  <button
                    type="button"
                    onClick={async () => {
                      setIsProfileMenuOpen(false);
                      await logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[#111827] hover:text-[#2563EB] px-3 py-1.5 transition-colors duration-150"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150 shadow-xs inline-flex items-center gap-1.5"
              >
                <span>Get Started</span>
              </Link>
            </>
          )}

          {/* Mobile Drawer Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-[#E5E7EB] text-[#111827] hover:bg-[#F7F8FA] transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#111827]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5E7EB] px-4 py-4 space-y-2 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#F7F8FA] rounded-lg"
            >
              Dashboard
            </Link>
            <Link
              href="/learn"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#F7F8FA] rounded-lg"
            >
              Learning (Courses &amp; DSA)
            </Link>
            <Link
              href="/career"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#F7F8FA] rounded-lg"
            >
              Career OS &amp; Interviews
            </Link>
            <Link
              href="/projectstudio"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#F7F8FA] rounded-lg"
            >
              Project Studio
            </Link>
            <Link
              href="/edbuild"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#F7F8FA] rounded-lg"
            >
              EdBuild (Group Projects)
            </Link>
            <Link
              href="/network"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#F7F8FA] rounded-lg"
            >
              Network &amp; Peers
            </Link>
            <Link
              href="/messages"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#F7F8FA] rounded-lg"
            >
              Messages
            </Link>
            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#F7F8FA] rounded-lg"
            >
              Profile &amp; Settings
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleOpenMyra();
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-[#2563EB] hover:bg-[#F7F8FA] rounded-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span>Ask Myra AI Copilot</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
