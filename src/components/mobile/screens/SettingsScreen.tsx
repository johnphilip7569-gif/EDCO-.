"use client";

import React, { useState } from "react";
import {
  Settings,
  ArrowLeft,
  User,
  Bell,
  Shield,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
  Smartphone,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SettingsScreenProps {
  onBack: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onLogout?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  isDarkMode = false,
  onToggleTheme,
  onLogout,
}) => {
  // Local toggles
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [recruiterDiscovery, setRecruiterDiscovery] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<"English" | "Hindi">("English");

  return (
    <div className="flex flex-col h-full bg-[#F8F9FD] dark:bg-[#0E1017] select-none overflow-y-auto pb-12">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#161922]/95 backdrop-blur-md px-4 pt-3 pb-3 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
              App Settings
            </h2>
            <p className="text-[10px] text-slate-400">
              Preferences, privacy & notifications
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* SECTION 1: ACCOUNT & PROFILE */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Account & Security
          </h3>
          <div className="rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-[#3D3BF3] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    Personal Details
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    rahul.sharma@iitb.ac.in • +91 9876543210
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    Password & 2FA
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    SMS Two-factor verification active
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* SECTION 2: APPEARANCE & THEME */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Appearance & Language
          </h3>
          <div className="rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {/* Theme Toggle */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center">
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    Dark Mode
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isDarkMode ? "Dark Theme is on" : "Light Theme is on"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onToggleTheme}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer",
                  isDarkMode ? "bg-[#3D3BF3]" : "bg-slate-300 dark:bg-slate-700"
                )}
                aria-label="Toggle dark mode"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full bg-white shadow-md transform transition-transform",
                    isDarkMode ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            {/* Language Selector */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    Display Language
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    English / Hindi
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLanguage(selectedLanguage === "English" ? "Hindi" : "English")}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#3D3BF3] dark:text-[#5856FF] min-h-[36px] cursor-pointer"
              >
                {selectedLanguage}
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: NOTIFICATION PREFERENCES */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Notification Alerts
          </h3>
          <div className="rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950 text-[#FF6B00] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    Deadline Push Alerts
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Closing hackathon & PPO reminders
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPushNotifs(!pushNotifs)}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer",
                  pushNotifs ? "bg-[#3D3BF3]" : "bg-slate-300 dark:bg-slate-700"
                )}
                aria-label="Toggle push notifications"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full bg-white shadow-md transform transition-transform",
                    pushNotifs ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  Weekly Opportunity Digest
                </h4>
                <p className="text-[11px] text-slate-500">
                  Email updates with curated FAANG internships
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer",
                  emailAlerts ? "bg-[#3D3BF3]" : "bg-slate-300 dark:bg-slate-700"
                )}
                aria-label="Toggle email alerts"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full bg-white shadow-md transform transition-transform",
                    emailAlerts ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: PRIVACY */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Privacy & Recruitment
          </h3>
          <div className="rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    Recruiter Talent Search
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Allow partner companies to find your ATS resume
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRecruiterDiscovery(!recruiterDiscovery)}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer",
                  recruiterDiscovery ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                )}
                aria-label="Toggle recruiter discovery"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full bg-white shadow-md transform transition-transform",
                    recruiterDiscovery ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 5: HELP & LOGOUT */}
        <div className="space-y-2 pt-2">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  Help & FAQs
                </h4>
                <p className="text-[11px] text-slate-500">
                  Chat with Myra AI Support 24/7
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full min-h-[48px] rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out of EdWorld</span>
          </button>
        </div>
      </div>
    </div>
  );
};
