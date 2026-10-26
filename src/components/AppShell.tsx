"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { CURRENT_TOS_VERSION, CURRENT_PRIVACY_VERSION } from "@/lib/types";
import ReconsentModal from "@/components/legal/ReconsentModal";
import ModernEdworldNavbar from "@/components/layout/ModernEdworldNavbar";
import ModernEdworldFooter from "@/components/layout/ModernEdworldFooter";
import MyraChatbot from "@/components/ai/MyraChatbot";
import FloatingMyraSignupBuddy from "@/components/auth/FloatingMyraSignupBuddy";
import CookieConsentBanner from "@/components/ui/CookieConsentBanner";
import AegisClientShield from "@/components/security/AegisClientShield";
import MobileBottomNav from "@/components/mobile/ui/MobileBottomNav";
import { cn } from "@/lib/utils";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [showReconsent, setShowReconsent] = useState(false);

  const isLandingPage = pathname === "/";
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/auth/login" ||
    pathname === "/auth/signup" ||
    pathname?.startsWith("/auth/");

  const isSignupPage = pathname === "/signup" || pathname === "/auth/signup";
  const isMobilePrototype = pathname === "/mobile" || pathname?.startsWith("/mobile/");
  const isAdminPage = pathname === "/admin" || pathname?.startsWith("/admin/");

  const [isSiteLaunched, setIsSiteLaunched] = useState<boolean | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("preview") === "true") {
        setIsPreview(true);
      }
    }

    if (isLandingPage) {
      fetch("/api/feature-flags")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          setIsSiteLaunched(Boolean(data?.isSiteLaunched));
        })
        .catch(() => setIsSiteLaunched(false));
    }
  }, [isLandingPage]);

  useEffect(() => {
    if (user) {
      const isOutdated =
        (user.tosVersion && user.tosVersion !== CURRENT_TOS_VERSION) ||
        (user.privacyVersion && user.privacyVersion !== CURRENT_PRIVACY_VERSION);
      if (isOutdated) {
        setShowReconsent(true);
      }
    }
  }, [user]);

  const handleReconsentAccept = async () => {
    setShowReconsent(false);
  };

  // Dedicated standalone rendering for Mobile Prototype canvas
  if (isMobilePrototype) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
        {children}
        <AegisClientShield />
      </div>
    );
  }

  // Standalone clean rendering for Authentication Pages
  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full bg-white text-black font-sans antialiased relative">
        {children}
        <CookieConsentBanner />
        <AegisClientShield />
      </div>
    );
  }

  // Dedicated standalone rendering for Admin Operations Portal (No student navbar, footer, or chatbot)
  if (isAdminPage) {
    return (
      <div className="min-h-screen w-full bg-white text-[#111827] font-sans antialiased selection:bg-[#2563EB] selection:text-white relative">
        {children}
        <AegisClientShield />
      </div>
    );
  }

  // Dedicated standalone rendering for Coming Soon Landing Page
  // When Coming Soon mode is active, do NOT render the main website navbar or footer or floating chatbot.
  // The Coming Soon page renders its own focused, standalone view.
  if (isLandingPage && !isSiteLaunched && !isPreview) {
    return (
      <div className="min-h-screen w-full bg-neutral-950 text-white font-sans antialiased relative">
        {children}
        <CookieConsentBanner />
        <AegisClientShield />
      </div>
    );
  }

  // Modern Full-Width Responsive SaaS Layout
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col font-sans antialiased selection:bg-[#2563EB] selection:text-white",
        isLandingPage ? "bg-white text-[#111827]" : "edworld-bg-canvas text-slate-900"
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#2563EB] focus:text-white focus:rounded-xl focus:shadow-xl focus:font-bold focus:text-xs"
      >
        Skip to main content
      </a>

      {/* Modern Sticky Glassmorphic Navbar */}
      <ModernEdworldNavbar />

      {/* Main Workspace Container */}
      <main
        id="main-content"
        tabIndex={-1}
        className={cn(
          "flex-1 outline-none",
          isLandingPage
            ? "w-full"
            : "max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-10 lg:pb-4"
        )}
      >
        {children}
      </main>

      {/* Modern Light Footer */}
      <ModernEdworldFooter />

      {/* Mobile Bottom Navigation for Authenticated Users */}
      {user && !isLandingPage && <MobileBottomNav />}

      <ReconsentModal
        isOpen={showReconsent}
        onAccept={handleReconsentAccept}
      />

      {/* Floating AI Study Buddy & Doubt Solver */}
      {user && <MyraChatbot />}

      {/* Global Privacy & Cookie Consent */}
      <CookieConsentBanner />

      {/* Autonomous Client Cyber-Defense & Anti-Bot Telemetry Shield */}
      <AegisClientShield />
    </div>
  );
}
