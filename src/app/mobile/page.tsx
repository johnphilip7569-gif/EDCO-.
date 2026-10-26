"use client";

import React, { useState } from "react";
import { SplashScreen } from "@/components/mobile/screens/SplashScreen";
import { AuthScreen } from "@/components/mobile/screens/AuthScreen";
import { OnboardingScreen } from "@/components/mobile/screens/OnboardingScreen";
import { HomeScreen } from "@/components/mobile/screens/HomeScreen";
import { ExploreScreen } from "@/components/mobile/screens/ExploreScreen";
import { OpportunityDetailScreen } from "@/components/mobile/screens/OpportunityDetailScreen";
import { RegistrationFlowModal } from "@/components/mobile/screens/RegistrationFlowModal";
import { ApplicationsScreen } from "@/components/mobile/screens/ApplicationsScreen";
import { CommunityScreen } from "@/components/mobile/screens/CommunityScreen";
import { NotificationsScreen } from "@/components/mobile/screens/NotificationsScreen";
import { SettingsScreen } from "@/components/mobile/screens/SettingsScreen";
import { ProfileScreen } from "@/components/mobile/screens/ProfileScreen";
import { ComponentLibraryScreen } from "@/components/mobile/screens/ComponentLibraryScreen";
import { MobileBottomNav, MobileTab } from "@/components/mobile/ui/MobileBottomNav";
import { OfflineBanner } from "@/components/mobile/ui/OfflineBanner";
import { OpportunityCardSkeleton, NotificationSkeleton } from "@/components/mobile/ui/SkeletonLoader";
import { ErrorStateView } from "@/components/mobile/ui/ErrorStateView";
import {
  EdworldFeatureItem,
  OpportunityItem,
  OpportunityDetailData,
  DETAILED_OPPORTUNITY_MOCK,
} from "@/lib/mobile-design-tokens";
import {
  Smartphone,
  Moon,
  Sun,
  RotateCcw,
  Sparkles,
  Wifi,
  Battery,
  ExternalLink,
  Layers,
  ChevronRight,
  X,
  Share2,
  WifiOff,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ActiveScreen =
  | "splash"
  | "auth"
  | "onboarding"
  | "app"
  | "detail"
  | "notifications"
  | "settings"
  | "components";

export default function MobilePrototypePage() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("app");
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [activeTab, setActiveTab] = useState<MobileTab>("home");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityDetailData>(DETAILED_OPPORTUNITY_MOCK);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [registeredOppIds, setRegisteredOppIds] = useState<string[]>([]);
  const [activeFeatureModal, setActiveFeatureModal] = useState<EdworldFeatureItem | null>(null);

  // Edge state simulators
  const [isSimulatingOffline, setIsSimulatingOffline] = useState(false);
  const [isSimulatingSkeleton, setIsSimulatingSkeleton] = useState(false);
  const [isSimulatingError, setIsSimulatingError] = useState(false);

  // Time in status bar
  const currentTime = "9:41";

  // Handlers
  const handleFeatureLaunch = (feature: EdworldFeatureItem) => {
    setActiveFeatureModal(feature);
  };

  const handleOpportunityClick = (opp: OpportunityItem) => {
    setSelectedOpportunity({
      ...DETAILED_OPPORTUNITY_MOCK,
      ...opp,
    });
    setActiveScreen("detail");
  };

  const handleRegisterSuccess = (data: any) => {
    if (selectedOpportunity) {
      setRegisteredOppIds((prev) => [...prev, selectedOpportunity.id]);
    }
    setActiveScreen("app");
    setActiveTab("applications");
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full flex flex-col items-center justify-center transition-colors duration-300 py-6 px-3 select-none",
        isDarkMode ? "bg-[#08090D] text-slate-100" : "bg-slate-100/90 text-slate-800"
      )}
    >
      {/* Top Prototype Control Bar (Quick Jump + Simulator Tools) */}
      <div className="w-full max-w-[500px] mb-3 flex flex-col items-center gap-2">
        <div className="flex items-center justify-between w-full px-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#3D3BF3] to-[#FF6B00] text-white flex items-center justify-center font-black text-xs shadow-sm">
              E
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                EdWorld Mobile Prototype
              </span>
              <span className="ml-1 text-[10px] font-semibold text-[#FF6B00]">
                390 × 844
              </span>
            </div>
          </div>

          {/* Quick theme & reset tools */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm hover:scale-105 transition-all text-xs flex items-center gap-1 cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
              <span className="hidden sm:inline text-[11px] font-bold">
                {isDarkMode ? "Light" : "Dark"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveScreen("splash");
                setActiveTab("home");
                setIsSimulatingOffline(false);
                setIsSimulatingSkeleton(false);
                setIsSimulatingError(false);
              }}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm hover:scale-105 transition-all text-xs flex items-center gap-1 cursor-pointer"
              aria-label="Reset prototype"
              title="Reset to Splash Screen"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-bold">Reset</span>
            </button>
          </div>
        </div>

        {/* Screen Quick Jump Switcher Bar */}
        <div className="w-full flex items-center gap-1 p-1 bg-white dark:bg-[#161922] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
          {[
            { id: "splash", label: "1. Splash" },
            { id: "auth", label: "2. Sign Up / OTP" },
            { id: "onboarding", label: "3. Onboarding" },
            { id: "home_feed", label: "4. Home Feed" },
            { id: "explore", label: "5. Explore & Search" },
            { id: "detail", label: "6. Opp Detail" },
            { id: "applications", label: "7. Applications" },
            { id: "community", label: "8. Community" },
            { id: "notifications", label: "9. Notifications" },
            { id: "settings", label: "10. Settings" },
            { id: "profile_view", label: "11. Profile" },
            { id: "components", label: "12. Design Tokens" },
          ].map((screen) => {
            let isCurrent = false;
            if (screen.id === "splash") isCurrent = activeScreen === "splash";
            if (screen.id === "auth") isCurrent = activeScreen === "auth";
            if (screen.id === "onboarding") isCurrent = activeScreen === "onboarding";
            if (screen.id === "home_feed") isCurrent = activeScreen === "app" && activeTab === "home";
            if (screen.id === "explore") isCurrent = activeScreen === "app" && activeTab === "explore";
            if (screen.id === "detail") isCurrent = activeScreen === "detail";
            if (screen.id === "applications") isCurrent = activeScreen === "app" && activeTab === "applications";
            if (screen.id === "community") isCurrent = activeScreen === "app" && activeTab === "community";
            if (screen.id === "notifications") isCurrent = activeScreen === "notifications";
            if (screen.id === "settings") isCurrent = activeScreen === "settings";
            if (screen.id === "profile_view") isCurrent = activeScreen === "app" && activeTab === "profile";
            if (screen.id === "components") isCurrent = activeScreen === "components";

            return (
              <button
                key={screen.id}
                type="button"
                onClick={() => {
                  if (screen.id === "splash") setActiveScreen("splash");
                  else if (screen.id === "auth") setActiveScreen("auth");
                  else if (screen.id === "onboarding") setActiveScreen("onboarding");
                  else if (screen.id === "home_feed") {
                    setActiveScreen("app");
                    setActiveTab("home");
                  } else if (screen.id === "explore") {
                    setActiveScreen("app");
                    setActiveTab("explore");
                  } else if (screen.id === "detail") setActiveScreen("detail");
                  else if (screen.id === "applications") {
                    setActiveScreen("app");
                    setActiveTab("applications");
                  } else if (screen.id === "community") {
                    setActiveScreen("app");
                    setActiveTab("community");
                  } else if (screen.id === "notifications") setActiveScreen("notifications");
                  else if (screen.id === "settings") setActiveScreen("settings");
                  else if (screen.id === "profile_view") {
                    setActiveScreen("app");
                    setActiveTab("profile");
                  } else if (screen.id === "components") setActiveScreen("components");
                }}
                className={cn(
                  "px-2.5 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all duration-150 cursor-pointer min-h-[30px]",
                  isCurrent
                    ? "bg-[#3D3BF3] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                {screen.label}
              </button>
            );
          })}
        </div>

        {/* Edge State Simulator Bar */}
        <div className="w-full flex items-center justify-between gap-1 px-3 py-1 bg-white/70 dark:bg-[#161922]/70 rounded-xl border border-slate-200/80 dark:border-slate-800 text-[10px] text-slate-500">
          <span className="font-bold uppercase tracking-wider text-slate-400">
            Simulate Edge States:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsSimulatingOffline(!isSimulatingOffline)}
              className={cn(
                "px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer",
                isSimulatingOffline
                  ? "bg-rose-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              )}
            >
              Offline {isSimulatingOffline ? "ON" : "OFF"}
            </button>

            <button
              type="button"
              onClick={() => setIsSimulatingSkeleton(!isSimulatingSkeleton)}
              className={cn(
                "px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer",
                isSimulatingSkeleton
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              )}
            >
              Skeleton {isSimulatingSkeleton ? "ON" : "OFF"}
            </button>

            <button
              type="button"
              onClick={() => setIsSimulatingError(!isSimulatingError)}
              className={cn(
                "px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer",
                isSimulatingError
                  ? "bg-amber-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              )}
            >
              Error {isSimulatingError ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>

      {/* 390 × 844 iPhone Chassis Container */}
      <div
        className={cn(
          "relative flex flex-col shadow-[0_25px_70px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.7)] transition-all",
          "w-full max-w-[390px] h-[844px] rounded-[48px] overflow-hidden border-[8px]",
          isDarkMode
            ? "border-[#1F2430] bg-[#0E1017] dark"
            : "border-[#E2E8F0] bg-[#F8F9FD]"
        )}
      >
        {/* Dynamic Island / Speaker Notch Bar */}
        <div className="absolute top-0 left-0 right-0 z-40 h-11 px-7 flex items-center justify-between pointer-events-none select-none">
          {/* Time */}
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {currentTime}
          </span>

          {/* Dynamic Island Pill */}
          <div className="w-28 h-6 bg-black rounded-full mx-auto flex items-center justify-center px-2 pointer-events-auto shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 mr-2" />
            <div className="w-2 h-2 rounded-full bg-indigo-900/60" />
          </div>

          {/* Status Icons: 5G, Wifi, Battery */}
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
            <span className="text-[10px] font-black">5G</span>
            {isSimulatingOffline ? (
              <WifiOff className="w-3.5 h-3.5 text-rose-500" />
            ) : (
              <Wifi className="w-3.5 h-3.5" />
            )}
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Offline Banner when active */}
        {isSimulatingOffline && (
          <div className="pt-11 z-30">
            <OfflineBanner onRetry={() => setIsSimulatingOffline(false)} />
          </div>
        )}

        {/* Device Viewport Body */}
        <div className={cn("relative flex-1 flex flex-col overflow-hidden", !isSimulatingOffline && "pt-11")}>
          {/* Edge State: Error Simulator */}
          {isSimulatingError ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <ErrorStateView onRetry={() => setIsSimulatingError(false)} />
            </div>
          ) : isSimulatingSkeleton ? (
            /* Edge State: Skeleton Loaders */
            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="space-y-1">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-3 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>
              <OpportunityCardSkeleton />
              <OpportunityCardSkeleton />
              <NotificationSkeleton />
            </div>
          ) : (
            <>
              {/* Screen 1: Splash */}
              {activeScreen === "splash" && (
                <SplashScreen
                  onGetStarted={() => setActiveScreen("onboarding")}
                  onLogin={() => {
                    setAuthMode("login");
                    setActiveScreen("auth");
                  }}
                />
              )}

              {/* Screen 2: Auth (Phone OTP / Email / Google) */}
              {activeScreen === "auth" && (
                <AuthScreen
                  initialMode={authMode}
                  onSuccess={() => {
                    setActiveScreen("app");
                    setActiveTab("home");
                  }}
                  onBack={() => setActiveScreen("splash")}
                />
              )}

              {/* Screen 3: Onboarding 5-Step Wizard */}
              {activeScreen === "onboarding" && (
                <OnboardingScreen
                  onComplete={() => {
                    setActiveScreen("app");
                    setActiveTab("home");
                  }}
                  onSkip={() => {
                    setActiveScreen("app");
                    setActiveTab("home");
                  }}
                />
              )}

              {/* Screen 6: Opportunity Detail Screen */}
              {activeScreen === "detail" && (
                <OpportunityDetailScreen
                  opportunity={selectedOpportunity}
                  isRegistered={registeredOppIds.includes(selectedOpportunity.id)}
                  onBack={() => setActiveScreen("app")}
                  onRegisterClick={() => setIsRegistrationModalOpen(true)}
                />
              )}

              {/* Screen 9: Notifications Screen */}
              {activeScreen === "notifications" && (
                <NotificationsScreen
                  onBack={() => setActiveScreen("app")}
                />
              )}

              {/* Screen 10: Settings Screen */}
              {activeScreen === "settings" && (
                <SettingsScreen
                  onBack={() => setActiveScreen("app")}
                  isDarkMode={isDarkMode}
                  onToggleTheme={() => setIsDarkMode(!isDarkMode)}
                  onLogout={() => setActiveScreen("splash")}
                />
              )}

              {/* Screen 4, 5, 7, 8: Main App Shell with Bottom Nav */}
              {activeScreen === "app" && (
                <div className="flex flex-col h-full justify-between overflow-hidden">
                  <div className="flex-1 overflow-hidden">
                    {activeTab === "home" && (
                      <HomeScreen
                        onProfileClick={() => setActiveTab("profile")}
                        onNotificationsClick={() => setActiveScreen("notifications")}
                        onFeatureLaunch={handleFeatureLaunch}
                        onOpportunityClick={handleOpportunityClick}
                      />
                    )}

                    {activeTab === "explore" && (
                      <ExploreScreen
                        onFeatureLaunch={handleFeatureLaunch}
                        onOpportunityClick={handleOpportunityClick}
                      />
                    )}

                    {activeTab === "applications" && <ApplicationsScreen />}

                    {activeTab === "community" && <CommunityScreen />}

                    {activeTab === "profile" && (
                      <ProfileScreen
                        isDarkMode={isDarkMode}
                        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
                        onLogout={() => setActiveScreen("splash")}
                      />
                    )}
                  </div>

                  {/* Persistent 5-Tab Bottom Navigation Bar */}
                  <MobileBottomNav
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    applicationsBadge={2}
                  />
                </div>
              )}

              {/* Screen 12: Design Tokens & Component Library */}
              {activeScreen === "components" && <ComponentLibraryScreen />}
            </>
          )}
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1 left-0 right-0 h-5 flex items-center justify-center pointer-events-none z-50">
          <div className="w-32 h-1 bg-slate-400/80 dark:bg-slate-600 rounded-full" />
        </div>

        {/* 3-Step Registration Flow Modal */}
        <RegistrationFlowModal
          isOpen={isRegistrationModalOpen}
          opportunity={selectedOpportunity}
          onClose={() => setIsRegistrationModalOpen(false)}
          onSuccess={handleRegisterSuccess}
        />

        {/* EdWorld Feature Launch Modal */}
        {activeFeatureModal && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-3 animate-in fade-in duration-200">
            <div className="w-full bg-white dark:bg-[#161922] rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D3BF3] dark:text-[#5856FF] bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                    EdWorld Co. Signature Studio
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mt-1">
                    {activeFeatureModal.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeFeatureModal.tagline}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveFeatureModal(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeFeatureModal.description}
              </p>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Included in Free Student Plan
                </span>
                <span className="text-[#FF6B00] font-bold">
                  {activeFeatureModal.metrics}
                </span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveFeatureModal(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Dismiss
                </button>
                <a
                  href={activeFeatureModal.href}
                  className="flex-[2] py-2.5 rounded-xl bg-[#3D3BF3] text-white hover:bg-[#2E2CD4] text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#3D3BF3]/20"
                >
                  Open {activeFeatureModal.name}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Helper Footer Note */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <span>Mobile Prototype Standard: 390×844 (iPhone 14 / 15)</span>
          <span>•</span>
          <span className="text-[#3D3BF3] dark:text-[#5856FF] font-semibold">
            EdWorld Co.
          </span>
        </p>
      </div>
    </div>
  );
}
