"use client";

import React, { useState } from "react";
import { UserProfileData, INITIAL_USER_PROFILE } from "@/lib/mobile-design-tokens";
import { CircularProgressRing } from "../ui/CircularProgressRing";
import { MobileButton } from "../ui/MobileButton";
import { EditProfileSheet } from "./EditProfileSheet";
import {
  Settings,
  Share2,
  Edit3,
  Camera,
  MapPin,
  GraduationCap,
  Calendar,
  Briefcase,
  Flame,
  Award,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Code2,
  CheckCircle2,
  Moon,
  Sun,
  Shield,
  LogOut,
  X,
  Trophy,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProfileScreenProps {
  initialProfile?: UserProfileData;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onLogout?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  initialProfile = INITIAL_USER_PROFILE,
  isDarkMode = false,
  onToggleTheme,
  onLogout,
}) => {
  const [profile, setProfile] = useState<UserProfileData>(initialProfile);
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "badges">("overview");
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile.name}'s EdWorld Profile`,
        text: profile.headline,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleTogglePrivacy = () => {
    setProfile((prev) => ({
      ...prev,
      privacy: prev.privacy === "public" ? "private" : "public",
    }));
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FD] dark:bg-[#0E1017] select-none overflow-y-auto pb-8">
      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-[340px] bg-white dark:bg-[#161922] rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#3D3BF3]" />
                Settings
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                {isDarkMode ? (
                  <Moon className="w-4 h-4 text-indigo-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Theme Mode
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isDarkMode ? "Dark Theme Active" : "Light Theme Active"}
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
                aria-label="Toggle dark/light mode"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full bg-white shadow-md transform transition-transform",
                    isDarkMode ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-emerald-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Profile Visibility
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {profile.privacy === "public" ? "Public (Recruiters can view)" : "Private (Hidden)"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTogglePrivacy}
                className={cn(
                  "w-12 h-7 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer",
                  profile.privacy === "public" ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                )}
                aria-label="Toggle profile privacy"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full bg-white shadow-md transform transition-transform",
                    profile.privacy === "public" ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            {/* Logout Action */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  onLogout?.();
                }}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of EdWorld</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Bottom Sheet */}
      <EditProfileSheet
        isOpen={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        profile={profile}
        onSave={(updated) => setProfile(updated)}
      />

      {/* Profile Header & Cover Photo */}
      <div className="relative">
        {/* Cover Gradient */}
        <div
          className={cn(
            "h-28 w-full bg-gradient-to-r relative",
            profile.coverGradient
          )}
        >
          {/* Top Bar Floating Controls */}
          <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10">
            <span className="text-[11px] font-bold text-white/90 bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1">
              {profile.privacy === "public" ? (
                <>
                  <Globe className="w-3 h-3" /> Public Profile
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" /> Private Profile
                </>
              )}
            </span>

            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/45 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Avatar & Edit Trigger */}
        <div className="px-4">
          <div className="flex justify-between items-end -mt-11">
            <div className="relative">
              <div className="w-22 h-22 rounded-2xl bg-white dark:bg-[#161922] p-1 shadow-lg ring-4 ring-white dark:ring-[#161922]">
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#3D3BF3] via-[#5856FF] to-[#FF6B00] flex items-center justify-center text-white text-3xl font-black shadow-inner">
                  {profile.name.charAt(0)}
                </div>
              </div>

              {/* Camera edit icon */}
              <button
                type="button"
                onClick={() => setIsEditSheetOpen(true)}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#FF6B00] text-white flex items-center justify-center shadow-md hover:bg-[#E05E00] cursor-pointer"
                aria-label="Change photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Action Buttons: Edit Profile + Share */}
            <div className="flex items-center gap-2 mb-1">
              <MobileButton
                variant="outline"
                size="sm"
                onClick={handleShare}
                aria-label="Share profile"
                leftIcon={<Share2 className="w-3.5 h-3.5" />}
              >
                {copiedLink ? "Copied" : "Share"}
              </MobileButton>

              <MobileButton
                variant="primary"
                size="sm"
                onClick={() => setIsEditSheetOpen(true)}
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              >
                Edit
              </MobileButton>
            </div>
          </div>

          {/* User Headline & College Info */}
          <div className="mt-3">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {profile.name}
              </h2>
              <CheckCircle2 className="w-4 h-4 text-[#3D3BF3] dark:text-[#5856FF]" />
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
              {profile.headline}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.college}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Batch of {profile.gradYear}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>

          {/* 70% Profile Completion Ring */}
          <div className="mt-4">
            <CircularProgressRing
              percentage={profile.completionPercent}
              onCompleteClick={() => setIsEditSheetOpen(true)}
            />
          </div>

          {/* Gamification: Streak & Level */}
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {/* Streak Card */}
            <div className="p-3 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-[#FF6B00]/30">
                🔥
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00]">
                  Daily Streak
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {profile.streakDays} Days Strong
                </h4>
              </div>
            </div>

            {/* Level Card */}
            <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D3BF3] dark:text-[#5856FF]">
                  Level {profile.level.current}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {profile.level.xp}/{profile.level.nextLevelXp} XP
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {profile.level.title}
                </h4>
                {/* XP Bar */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3D3BF3] to-[#FF6B00] rounded-full"
                    style={{ width: `${(profile.level.xp / profile.level.nextLevelXp) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row: Applications, Wins, Certificates, Followers */}
          <div className="mt-4 grid grid-cols-4 p-3 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-center divide-x divide-slate-100 dark:divide-slate-800">
            <div>
              <span className="block text-base font-black text-slate-900 dark:text-slate-100">
                {profile.stats.applications}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">
                Applied
              </span>
            </div>
            <div>
              <span className="block text-base font-black text-[#FF6B00]">
                {profile.stats.wins}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">
                Wins 🏆
              </span>
            </div>
            <div>
              <span className="block text-base font-black text-slate-900 dark:text-slate-100">
                {profile.stats.certificates}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">
                Certs
              </span>
            </div>
            <div>
              <span className="block text-base font-black text-[#3D3BF3] dark:text-[#5856FF]">
                {profile.stats.followers}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">
                Followers
              </span>
            </div>
          </div>

          {/* 3 Tabs: Overview | Activity | Badges */}
          <div className="mt-5 grid grid-cols-3 p-1 bg-slate-200/70 dark:bg-slate-800/70 rounded-xl">
            {(["overview", "activity", "badges"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-2 text-xs font-bold rounded-lg capitalize transition-all min-h-[38px] cursor-pointer",
                  activeTab === tab
                    ? "bg-white dark:bg-[#161922] text-[#3D3BF3] dark:text-[#5856FF] shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 mt-4 space-y-4">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            {/* Section: About */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  About
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditSheetOpen(true)}
                  className="p-1 text-slate-400 hover:text-[#3D3BF3] cursor-pointer"
                  aria-label="Edit about"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {profile.about}
              </p>
            </div>

            {/* Section: Skills with Proficiency Levels */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Skills & Proficiency
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditSheetOpen(true)}
                  className="p-1 text-slate-400 hover:text-[#3D3BF3] cursor-pointer"
                  aria-label="Edit skills"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700"
                  >
                    <span className="font-semibold">{skill.name}</span>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1 py-0.2 rounded",
                        skill.level === "Advanced"
                          ? "bg-indigo-100 text-[#3D3BF3] dark:bg-indigo-950 dark:text-indigo-400"
                          : skill.level === "Intermediate"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                          : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                      )}
                    >
                      {skill.level}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Section: Experience */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Experience
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditSheetOpen(true)}
                  className="p-1 text-slate-400 hover:text-[#3D3BF3] cursor-pointer"
                  aria-label="Edit experience"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              {profile.experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {exp.role}
                      </h4>
                      <p className="text-xs font-semibold text-[#3D3BF3] dark:text-[#5856FF]">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-0.5 pt-1">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Section: Education */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Education
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditSheetOpen(true)}
                  className="p-1 text-slate-400 hover:text-[#3D3BF3] cursor-pointer"
                  aria-label="Edit education"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  {profile.education.degree}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {profile.education.institution}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                  <span>{profile.education.dates}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    CGPA: {profile.education.cgpa}
                  </span>
                </div>
              </div>
            </div>

            {/* Section: Projects */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Projects
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditSheetOpen(true)}
                  className="p-1 text-slate-400 hover:text-[#3D3BF3] cursor-pointer"
                  aria-label="Edit projects"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {profile.projects.map((proj, idx) => (
                  <div key={idx} className="pb-2 border-b last:border-b-0 border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {proj.description}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {proj.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-[#3D3BF3] dark:text-[#5856FF] font-medium px-2 py-0.2 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Achievements */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Achievements
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditSheetOpen(true)}
                  className="p-1 text-slate-400 hover:text-[#3D3BF3] cursor-pointer"
                  aria-label="Edit achievements"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {profile.achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Trophy className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {ach.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {ach.event} • {ach.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Social Links */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Social Links
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditSheetOpen(true)}
                  className="p-1 text-slate-400 hover:text-[#3D3BF3] cursor-pointer"
                  aria-label="Edit socials"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {profile.socials.github && (
                  <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 text-xs text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <Github className="w-4 h-4" />
                    <span className="truncate">GitHub</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                  </a>
                )}
                {profile.socials.linkedin && (
                  <a
                    href={profile.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 text-xs text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <Linkedin className="w-4 h-4 text-[#0077b5]" />
                    <span className="truncate">LinkedIn</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                  </a>
                )}
                {profile.socials.leetcode && (
                  <a
                    href={profile.socials.leetcode}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 text-xs text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <Code2 className="w-4 h-4 text-[#FFA116]" />
                    <span className="truncate">LeetCode</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                  </a>
                )}
                {profile.socials.portfolio && (
                  <a
                    href={profile.socials.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 text-xs text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <Globe className="w-4 h-4 text-emerald-500" />
                    <span className="truncate">Portfolio</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                  </a>
                )}
              </div>
            </div>
          </>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === "activity" && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-sm">
                ⚡
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-slate-400">2 hours ago</span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  Applied to AI Hackathon India 2026
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submission reviewed and registered under team "AlphaCoderz"
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-[#FF6B00] flex items-center justify-center font-bold text-sm">
                🔥
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-slate-400">Yesterday</span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  Completed 12-day practice streak
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Solved 3 Binary Tree drills on EdWorld DSA Studio
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-sm">
                📄
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-slate-400">3 days ago</span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  Generated ATS Single-Column Resume
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scored 88% recruiter ATS compatibility
                </p>
              </div>
            </div>
          </div>
        )}

        {/* BADGES TAB */}
        {activeTab === "badges" && (
          <div className="grid grid-cols-2 gap-2.5">
            {profile.badges.map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  "p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all",
                  badge.unlocked
                    ? "bg-white dark:bg-[#161922] border-indigo-100 dark:border-indigo-950 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-900/40 border-dashed border-slate-200 dark:border-slate-800 opacity-60"
                )}
              >
                <span className="text-3xl mb-1.5 filter drop-shadow">
                  {badge.icon}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {badge.title}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {badge.desc}
                </p>
                <span
                  className={cn(
                    "mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                    badge.unlocked
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  )}
                >
                  {badge.unlocked ? "Unlocked" : "Locked"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
