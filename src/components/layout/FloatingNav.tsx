"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Menu,
  X,
  LayoutDashboard,
  Video,
  Target,
  Code2,
  FileText,
  Users,
  Briefcase,
  User,
  LogOut,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Award,
  CreditCard,
  Search,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Layers
} from "lucide-react";
import EdworldLogo from "@/components/ui/EdworldLogo";

interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function FloatingNav() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    profile,
    isAdmin,
    logout
  } = useAuth();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isPublicLanding =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/pricing" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/for-college" ||
    pathname === "/for-professionals" ||
    pathname === "/for-career" ||
    pathname === "/consent/verify" ||
    pathname?.startsWith("/sector-landing");

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  // Close drawer on Escape key press or when Myra Copilot opens
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };
    const handleMyraOpened = () => {
      setIsDrawerOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-myra-copilot", handleMyraOpened as EventListener);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-myra-copilot", handleMyraOpened as EventListener);
    };
  }, []);

  // Prevent background scrolling when paper menu is open & notify Myra to close on mobile
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("close-myra-copilot"));
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  const handleSignOut = async () => {
    try {
      await logout();
      setIsDrawerOpen(false);
      router.push("/login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const userInitials = (user?.name || profile?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const homeHref = user ? "/dashboard" : "/";

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Close profile dropdown on route change
  useEffect(() => {
    setIsProfileOpen(false);
  }, [pathname]);

  // Desktop quick links matching Quixel reference pill bar
  const desktopQuickLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Courses", href: "/learn", icon: GraduationCap },
    { label: "Challenges", href: "/problems", icon: Code2 },
    { label: "Career Paths", href: "/career", icon: Target },
    { label: "Job Board", href: "/jobs", icon: Briefcase },
  ];

  // Apple HIG & Android Material 3 Mobile Thumb-Zone Quick Dock items
  const mobileDockLinks = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "DSA", href: "/dsa", icon: Layers },
    { label: "Interview", href: "/interviews", icon: Video },
    { label: "Resume", href: "/resumes", icon: FileText },
  ];

  // Client-safe navigation sections (internal founder/employee/hr strictly excluded)
  const sections: NavSection[] = [
    {
      title: "Core Career Tools",
      items: [
        { href: "/dashboard", label: "Dashboard", description: "Personalized metrics & daily goals", icon: LayoutDashboard },
        { href: "/dsa", label: "Data Structures & Algorithms", description: "Visual explainers & interview drills", icon: Layers, badge: "New" },
        { href: "/interviews", label: "Mock Interview Studio", description: "AI video/audio technical rounds", icon: Video, badge: "AI Powered" },
        { href: "/resumes", label: "ATS Resume Maker", description: "Keyword-calibrated single-column builder", icon: FileText },
        { href: "/problems", label: "Coding Sandbox", description: "Algorithm drills with live test runners", icon: Code2 },
        { href: "/jobs", label: "Jobs & Opportunities", description: "Curated internships & full-time roles", icon: Briefcase },
        { href: "/network", label: "Peer Network", description: "Connect with verified colleagues", icon: Users },
      ],
    },
    {
      title: "Programs & Solutions",
      items: [
        { href: "/ambassador", label: "Campus Ambassador Program", description: "Apply to represent EdWorld on your campus", icon: Award, badge: "Apply Now" },
        { href: "/colleges", label: "For Colleges & Universities", description: "Campus placement telemetry", icon: GraduationCap },
        { href: "/for-professionals", label: "For Working Professionals", description: "Senior engineering acceleration", icon: Target },
        ...(isAdmin ? [{ href: "/admin", label: "Admin Operations Portal", description: "Operations, users & platform management", icon: ShieldCheck }] : []),
      ],
    },
  ];

  // Search filtered sections
  const filteredSections = sections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter(
        (it) =>
          it.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          it.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((sec) => sec.items.length > 0);

  return (
    <>
      {/* 1. MASTER FLOATING ISLAND HEADER BAR (Apple Dynamic Island & Android Status-Bar Safe) */}
      <header className="fixed top-0 inset-x-0 z-40 pointer-events-none pt-[max(0.5rem,env(safe-area-inset-top))] sm:pt-3 px-3 sm:px-6 font-sans print:hidden">
        <div className="max-w-7xl mx-auto w-full pointer-events-auto bg-neutral-950/95 backdrop-blur-xl border border-neutral-800/90 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.5)] py-2 px-3 sm:px-6 flex items-center justify-between gap-3 transition-all text-white">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-4 shrink-0">
            <EdworldLogo size="md" href={homeHref} />
          </div>

          {/* Center: Desktop Quixel Pill Navigation Dock */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold" aria-label="Primary Navigation">
            {desktopQuickLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all ${
                    isActive
                      ? "bg-neutral-800 text-white font-bold border border-neutral-700 shadow-xs"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900/80"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-neutral-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* More / All Tools Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-neutral-400 hover:text-white hover:bg-neutral-900/80 transition-all cursor-pointer font-medium"
              title="All Tools & Directory"
            >
              <span>•••</span>
            </button>
          </nav>

          {/* Right Action Cluster: Quixel User Profile Chip */}
          <div className="relative flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white text-xs transition-all cursor-pointer shadow-xs"
                  aria-label="User profile options"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-black flex items-center justify-center font-black text-[11px] shrink-0 font-mono shadow-xs">
                    {userInitials}
                  </div>
                  <div className="hidden md:flex flex-col text-left leading-tight">
                    <span className="font-bold text-white text-[11px] truncate max-w-[120px]">
                      Hi, {(user.name || profile?.name || "Explorer").split(" ")[0]}!
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono truncate max-w-[120px]">
                      {user.email}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {/* Profile Options Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl py-2 z-50 text-xs font-sans animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-neutral-800">
                      <div className="font-bold text-white truncate">
                        {user.name || profile?.name || "Student"}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono truncate">
                        {user.email}
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Account Profile</span>
                    </Link>

                    <Link
                      href="/learn"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>My Academy Certificates</span>
                    </Link>

                    <Link
                      href="/career"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      <Target className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Target Role Preferences</span>
                    </Link>

                    <div className="border-t border-neutral-800 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-1.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all shadow-xs"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="lg:hidden p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Open menu drawer"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* 1B. APPLE iOS / ANDROID MATERIAL 3 MOBILE THUMB-ZONE QUICK DOCK (< 768px) */}
      {!isPublicLanding && (
        <nav
          aria-label="Mobile Quick Navigation Dock"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex md:hidden items-center gap-0.5 px-1.5 py-1 rounded-full bg-white/95 backdrop-blur-xl border border-neutral-200/90 shadow-[0_12px_32px_rgba(0,0,0,0.16)] max-w-[calc(100vw-9.25rem)] overflow-x-auto no-scrollbar print:hidden safe-bottom"
        >
          {mobileDockLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 px-2.5 py-2 min-h-[40px] rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-black text-white shadow-2xs"
                    : "text-neutral-600 hover:text-black hover:bg-neutral-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xs:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* 3. ORIGAMI PAPER UNFOLDING MENU MODAL */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 font-sans flex items-end justify-start p-3 sm:p-6 pointer-events-auto safe-bottom">
          
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Origami Unfolded Paper Sheet */}
          <div
            className="relative z-10 w-full max-w-lg max-h-[82dvh] sm:max-h-[85vh] bg-white rounded-3xl border border-neutral-300 shadow-[0_24px_64px_rgba(0,0,0,0.28)] flex flex-col overflow-hidden origin-bottom-left transition-all duration-300"
            style={{
              animation: "origamiUnfold 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            {/* Origami Diagonal Paper Fold Crease Line Decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-100/70 border-b border-l border-neutral-200 transform rotate-45 translate-x-16 -translate-y-16" />
            </div>

            {/* Paper Header */}
            <div className="p-5 sm:p-6 border-b border-neutral-200 bg-neutral-50/80 flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <EdworldLogo size="sm" showText={false} />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-extrabold text-black leading-none">
                      Navigation &amp; Directory
                    </h2>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black text-white uppercase tracking-wider">
                      Paper Menu
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 leading-none">
                    EdWorld Co. Ecosystem &bull; Single-Tap Access
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card (if authenticated) */}
            {user && (
              <div className="p-3.5 mx-5 mt-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {userInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-black truncate">
                      {user.name || profile?.name || "Student"}
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate">
                      {user.email}
                    </div>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl bg-white border border-neutral-200 hover:border-black text-black text-xs font-bold transition-all"
                  title="Account Settings"
                >
                  <User className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Instant Search Bar */}
            <div className="px-5 pt-3 pb-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tools & features..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>

            {/* Navigation Items List */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-5 max-h-[48vh]">
              {filteredSections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider px-1">
                    {section.title}
                  </h3>

                  <div className="space-y-1.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsDrawerOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all ${
                            isActive
                              ? "bg-black border-black text-white shadow-xs"
                              : "bg-white hover:bg-neutral-50 border-neutral-200 hover:border-black text-black"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isActive
                                ? "bg-neutral-900 text-white"
                                : "bg-neutral-100 text-black"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="text-xs font-bold leading-none truncate">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none ${
                                    isActive
                                      ? "bg-neutral-800 text-white"
                                      : "bg-neutral-100 text-black border border-neutral-300"
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className={`text-[11px] mt-1 leading-snug truncate ${isActive ? "text-neutral-300" : "text-neutral-500"}`}>
                              {item.description}
                            </p>
                          </div>

                          <ChevronRight className={`w-3.5 h-3.5 self-center shrink-0 ${isActive ? "text-neutral-400" : "text-neutral-300"}`} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Origami Paper Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-neutral-600 font-medium">
                <Link
                  href="/pricing"
                  onClick={() => setIsDrawerOpen(false)}
                  className="hover:text-black flex items-center gap-1.5 font-bold"
                >
                  <CreditCard className="w-3.5 h-3.5 text-black" />
                  <span>Pricing Plans</span>
                </Link>

                <div className="flex items-center gap-2.5 text-[11px] text-neutral-500">
                  <Link href="/privacy" onClick={() => setIsDrawerOpen(false)} className="hover:text-black">Privacy</Link>
                  <span>&bull;</span>
                  <Link href="/terms" onClick={() => setIsDrawerOpen(false)} className="hover:text-black">Terms</Link>
                  <span>&bull;</span>
                  <Link href="/for-college" onClick={() => setIsDrawerOpen(false)} className="hover:text-black">Colleges</Link>
                </div>
              </div>

              {user ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-black text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-2 px-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

          </div>

          <style jsx>{`
            @keyframes origamiUnfold {
              0% {
                transform: scale(0.12) rotate(-8deg) skew(4deg, 4deg);
                opacity: 0;
              }
              70% {
                transform: scale(1.02) rotate(1deg) skew(-0.5deg, -0.5deg);
                opacity: 1;
              }
              100% {
                transform: scale(1) rotate(0deg) skew(0, 0);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
