"use client";

export const dynamic = "force-dynamic";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Lock, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Flame, 
  ArrowRight, 
  BookOpen,
  Sliders,
  Laptop,
  CheckCircle2
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { 
  DISTRACTION_TARGETS, 
  FOCUS_PRESETS, 
  STUDY_SUBJECTS, 
  DistractionTarget, 
  FocusPreset, 
  StudySubject 
} from "@/lib/focus-tokens";
import { useFocusLock } from "@/hooks/useFocusLock";
import FocusPermissionModal from "@/components/focus/FocusPermissionModal";
import DistractionAlertOverlay from "@/components/focus/DistractionAlertOverlay";
import BlockedSiteRedirectCard from "@/components/focus/BlockedSiteRedirectCard";
import ExtensionDownloadCard from "@/components/focus/ExtensionDownloadCard";
import ActiveFocusRoom from "@/components/focus/ActiveFocusRoom";

function FocusStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blockedQuery = searchParams.get("blocked");

  const {
    session,
    startFocusSession,
    emergencyUnlock,
    resetSession,
    dismissDistractionAlert,
    triggerDistractionStrike,
  } = useFocusLock();

  // Setup form state
  const [selectedPresetId, setSelectedPresetId] = useState<string>("standard-45");
  const [customMinutes, setCustomMinutes] = useState<number>(30);
  const [isCustomTime, setIsCustomTime] = useState<boolean>(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("dsa");
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>(
    DISTRACTION_TARGETS.filter((t) => t.defaultBlocked).map((t) => t.id)
  );

  // Permission modal state
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  // Computed values
  const currentPreset = FOCUS_PRESETS.find((p) => p.id === selectedPresetId);
  const currentMinutes = isCustomTime ? customMinutes : (currentPreset?.minutes || 45);
  const currentSubject = STUDY_SUBJECTS.find((s) => s.id === selectedSubjectId) || STUDY_SUBJECTS[0];
  const computedXpReward = Math.round(currentMinutes * 1.3);

  const toggleTarget = (id: string) => {
    setSelectedTargetIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenPermissionModal = () => {
    setIsPermissionModalOpen(true);
  };

  const handleConfirmAndStart = () => {
    setIsPermissionModalOpen(false);
    startFocusSession({
      minutes: currentMinutes,
      subjectName: currentSubject.name,
      subjectHref: currentSubject.recommendedHref,
      blockedTargetIds: selectedTargetIds,
      xpReward: computedXpReward,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
        
        {/* 1. STUDIO HEADER */}
        <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                EdWorld Focus Lock
              </span>
              <span className="text-xs text-[#6B7280] font-medium">
                Distraction Blocker &amp; Deep Work Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight">
              Study Without Social Media Interruptions
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed font-normal">
              Lock in your learning goals. Set your target duration, restrict Instagram, Snapchat, Discord, and games, and earn Focus XP for every uninterrupted sprint.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] hover:bg-white text-xs font-semibold text-[#111827] shadow-xs transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </section>

        {/* 2. BLOCKED SITE REDIRECT VIEW (If query has ?blocked=xxx) */}
        {blockedQuery && (
          <BlockedSiteRedirectCard
            blockedDomain={blockedQuery}
            remainingSeconds={session?.remainingSeconds || 0}
            subjectName={session?.subjectName}
            subjectHref={session?.subjectHref}
            onClearQuery={() => router.push("/focus")}
          />
        )}

        {/* 3. ACTIVE FOCUS SESSION VIEW */}
        {session && session.isActive ? (
          <ActiveFocusRoom
            session={session}
            onReset={resetSession}
            onTriggerEmergencyUnlock={() => triggerDistractionStrike("Requested emergency unlock")}
          />
        ) : (
          /* 4. SETUP & CONFIGURATION SUITE */
          <div className="space-y-6 lg:space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Preset Duration & Subject (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Duration Presets */}
                <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider block">
                        Step 1
                      </span>
                      <h2 className="text-lg font-bold text-[#111827]">
                        Choose Focus Duration
                      </h2>
                    </div>

                    <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
                      {currentMinutes} Minutes Selected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {FOCUS_PRESETS.map((preset) => {
                      const isSelected = !isCustomTime && selectedPresetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setIsCustomTime(false);
                            setSelectedPresetId(preset.id);
                          }}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#111827] text-white border-[#111827] shadow-xs"
                              : "bg-[#F8F9FA] text-[#111827] border-[#E5E7EB] hover:border-gray-400 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-base font-bold">{preset.label}</span>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              isSelected ? "bg-amber-400 text-black font-bold" : "bg-white border border-[#E5E7EB] text-[#6B7280]"
                            }`}>
                              +{preset.xpReward} XP
                            </span>
                          </div>
                          <span className={`text-[10px] uppercase font-semibold block mt-1 ${
                            isSelected ? "text-neutral-300" : "text-[#6B7280]"
                          }`}>
                            {preset.tag}
                          </span>
                        </button>
                      );
                    })}

                    {/* Custom Minutes Option */}
                    <button
                      type="button"
                      onClick={() => setIsCustomTime(true)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        isCustomTime
                          ? "bg-[#111827] text-white border-[#111827] shadow-xs"
                          : "bg-[#F8F9FA] text-[#111827] border-[#E5E7EB] hover:border-gray-400 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold">Custom</span>
                        <Sliders className={`w-4 h-4 ${isCustomTime ? "text-amber-400" : "text-[#6B7280]"}`} />
                      </div>
                      <span className={`text-[10px] uppercase font-semibold block mt-1 ${
                        isCustomTime ? "text-neutral-300" : "text-[#6B7280]"
                      }`}>
                        Set Your Time
                      </span>
                    </button>
                  </div>

                  {/* Custom Minutes Slider if selected */}
                  {isCustomTime && (
                    <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>Custom Duration:</span>
                        <span className="text-sm font-bold text-[#111827]">{customMinutes} Minutes</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="180"
                        step="5"
                        value={customMinutes}
                        onChange={(e) => setCustomMinutes(Number(e.target.value))}
                        className="w-full accent-[#2563EB] cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] font-medium text-[#6B7280]">
                        <span>10m</span>
                        <span>60m</span>
                        <span>120m</span>
                        <span>180m</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Study Subject Picker */}
                <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider block">
                      Step 2
                    </span>
                    <h2 className="text-lg font-bold text-[#111827]">
                      Select Your Learning Target
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {STUDY_SUBJECTS.map((subject) => {
                      const isSelected = selectedSubjectId === subject.id;
                      return (
                        <button
                          key={subject.id}
                          type="button"
                          onClick={() => setSelectedSubjectId(subject.id)}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? "bg-[#111827] text-white border-[#111827] shadow-xs"
                              : "bg-[#F8F9FA] text-[#111827] border-[#E5E7EB] hover:border-gray-400 hover:bg-white"
                          }`}
                        >
                          <div className="space-y-1">
                            <span className="text-xs font-bold block">{subject.name}</span>
                            <span className={`text-[10px] block ${
                              isSelected ? "text-neutral-300" : "text-[#6B7280]"
                            }`}>
                              Arena: {subject.recommendedHref}
                            </span>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                              isSelected ? "bg-[#2563EB] border-[#2563EB] text-white" : "bg-white border-[#E5E7EB]"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Distraction Blacklist & Protocol Trigger (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-5">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider block">
                      Step 3
                    </span>
                    <h2 className="text-lg font-bold text-[#111827]">
                      Distraction Blacklist
                    </h2>
                    <p className="text-xs text-[#6B7280]">
                      Select which apps and sites you commit to locking during this study session:
                    </p>
                  </div>

                  {/* Target List */}
                  <div className="space-y-2">
                    {DISTRACTION_TARGETS.map((target) => {
                      const isBlocked = selectedTargetIds.includes(target.id);
                      return (
                        <div
                          key={target.id}
                          onClick={() => toggleTarget(target.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer select-none ${
                            isBlocked
                              ? "bg-rose-50/60 border-rose-200"
                              : "bg-[#F8F9FA] border-[#E5E7EB] opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">
                              {target.id === "instagram" ? "📸" :
                               target.id === "snapchat" ? "👻" :
                               target.id === "youtube" ? "🔴" :
                               target.id === "discord" ? "💬" :
                               target.id === "gaming" ? "🎮" :
                               target.id === "reddit" ? "👾" :
                               target.id === "twitter" ? "✖️" : "🎬"}
                            </span>
                            <div>
                              <strong className="text-xs text-[#111827] block font-semibold">{target.name}</strong>
                              <span className="text-[10px] text-[#6B7280]">
                                {target.domains.slice(0, 2).join(", ")}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                              isBlocked ? "bg-rose-600 border-rose-600 text-white" : "bg-white border-[#E5E7EB]"
                            }`}
                          >
                            {isBlocked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Protocol Initiation Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={selectedTargetIds.length === 0}
                      onClick={handleOpenPermissionModal}
                      className="w-full py-3 px-5 rounded-xl bg-[#111827] hover:bg-black text-white font-bold text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Review Protocol &amp; Lock Distractions</span>
                    </button>
                    <p className="text-[11px] text-center text-[#6B7280] mt-2">
                      Requires explicit permission confirmation
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* 5. EXTENSION COMPANION CARD */}
            <ExtensionDownloadCard />

          </div>
        )}

      </div>

      {/* Permission & Confirmation Modal */}
      <FocusPermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        targetMinutes={currentMinutes}
        subjectName={currentSubject.name}
        selectedTargets={selectedTargetIds}
        xpReward={computedXpReward}
        onConfirmAndStart={handleConfirmAndStart}
      />

      {/* Real-time Distraction Alert Overlay */}
      {session && session.activeDistractionAlert && (
        <DistractionAlertOverlay
          alertMessage={session.activeDistractionAlert}
          strikeCount={session.strikeCount}
          maxStrikes={session.maxStrikes}
          remainingSeconds={session.remainingSeconds}
          subjectName={session.subjectName}
          onReturnToStudy={dismissDistractionAlert}
          onEmergencyUnlock={(reason) => emergencyUnlock(reason)}
        />
      )}

    </div>
  );
}

export default function FocusStudioPage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-[#2563EB] rounded-full animate-spin" />
          </div>
        }
      >
        <FocusStudioContent />
      </Suspense>
    </AuthGuard>
  );
}
