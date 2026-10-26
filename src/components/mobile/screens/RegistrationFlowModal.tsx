"use client";

import React, { useState } from "react";
import { OpportunityDetailData, INITIAL_USER_PROFILE } from "@/lib/mobile-design-tokens";
import { MobileButton } from "../ui/MobileButton";
import { FloatingInput } from "../ui/FloatingInput";
import {
  X,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Users,
  Copy,
  Sparkles,
  ShieldCheck,
  FileText,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RegistrationFlowModalProps {
  isOpen: boolean;
  opportunity: OpportunityDetailData;
  onClose: () => void;
  onSuccess: (registrationData: any) => void;
}

export const RegistrationFlowModal: React.FC<RegistrationFlowModalProps> = ({
  isOpen,
  opportunity,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | "success">(1);
  const totalSteps = 3;

  // Step 1: Profile details
  const [fullName, setFullName] = useState(INITIAL_USER_PROFILE.name);
  const [college, setCollege] = useState(INITIAL_USER_PROFILE.college);
  const [gradYear, setGradYear] = useState(INITIAL_USER_PROFILE.gradYear);
  const [resumeName] = useState("Rahul_Sharma_Resume_2026.pdf (ATS 88%)");

  // Step 2: Extra questions
  const [motivation, setMotivation] = useState("We aim to build an agentic LLM debugger that autonomously pinpoints latency bottlenecks in distributed microservices.");
  const [githubUrl, setGithubUrl] = useState("https://github.com/rahul-sharma/agent-trace");
  const [selectedTrack, setSelectedTrack] = useState("track-ai");

  // Step 3: Team option
  const [participationMode, setParticipationMode] = useState<"solo" | "team_create" | "team_join">("team_create");
  const [teamName, setTeamName] = useState("AlphaCoderz");
  const [teamCode] = useState("EDW-7892");
  const [joinCode, setJoinCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(teamCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep("success");
      }, 700);
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else onClose();
  };

  const handleAddToCalendar = () => {
    // Generates a standard Google Calendar event deep link
    const title = encodeURIComponent(opportunity.title);
    const details = encodeURIComponent(`EdWorld Registration ID: #EDW-84920\nOrganizer: ${opportunity.organizer}\nRound 1 Due: Oct 22, 2026`);
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=20261022T043000Z/20261022T123000Z`;
    window.open(gCalUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={step === "success" ? onClose : undefined} />

      <div
        className="relative z-10 w-full max-w-[420px] max-h-[92vh] bg-white dark:bg-[#161922] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 border-t border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {step !== "success" && step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-2" />
            )}
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">
                {step === "success" ? "Registration Confirmed!" : "Registration & Application"}
              </h3>
              {step !== "success" && (
                <p className="text-[11px] text-slate-400">
                  Step {step} of {totalSteps} • {opportunity.title.slice(0, 26)}...
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar (if not success) */}
        {step !== "success" && (
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-[#3D3BF3] to-[#FF6B00] transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        )}

        {/* Content */}
        <div className="px-5 py-4 overflow-y-auto space-y-4 flex-1">
          {/* SUCCESS SCREEN */}
          {step === "success" ? (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00] bg-orange-50 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-full">
                  Registration #EDW-84920
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2">
                  You're in the Hackathon!
                </h3>
                <p className="text-xs text-slate-500 max-w-[280px] mt-1 leading-relaxed">
                  Confirmation sent to your email. Team code <span className="font-bold text-slate-800 dark:text-slate-200">{teamCode}</span> is active for AlphaCoderz.
                </p>
              </div>

              {/* Event card badge */}
              <div className="w-full p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400">Next Action</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  Round 1: Idea PPT & Architecture
                </h4>
                <p className="text-[11px] text-[#3D3BF3] dark:text-[#5856FF] font-semibold mt-0.5">
                  Due: October 22, 2026 (6 days remaining)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-2 pt-2">
                <MobileButton
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleAddToCalendar}
                  leftIcon={<Calendar className="w-4 h-4" />}
                >
                  Add to Google Calendar
                </MobileButton>

                <MobileButton
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => {
                    onSuccess({ id: opportunity.id, title: opportunity.title, teamCode });
                    onClose();
                  }}
                >
                  View in My Applications
                </MobileButton>
              </div>
            </div>
          ) : step === 1 ? (
            /* STEP 1: CONFIRM PROFILE DETAILS */
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  1. Confirm Profile & Resume
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Organizers review verified details submitted from your EdWorld profile.
                </p>
              </div>

              <FloatingInput
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-2">
                <FloatingInput
                  label="College / Org"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                />
                <FloatingInput
                  label="Grad Year"
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                />
              </div>

              {/* Verified Resume Card */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                      {resumeName}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Verified Single-Column ATS Format
                    </span>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          ) : step === 2 ? (
            /* STEP 2: EXTRA QUESTIONS */
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  2. Organizer Questions
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Required by Google Cloud review committee.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Challenge Track
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: "track-ai", title: "Autonomous Agentic Systems", desc: "Multi-agent workflows, code synthesis" },
                    { id: "track-rag", title: "Multimodal Vector RAG", desc: "Video, audio & real-time search" },
                    { id: "track-social", title: "AI for Social Impact & Healthcare", desc: "Clinical & student tools" },
                  ].map((track) => (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setSelectedTrack(track.id)}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all min-h-[48px] cursor-pointer",
                        selectedTrack === track.id
                          ? "border-[#3D3BF3] bg-indigo-50/70 dark:bg-indigo-950/60 ring-1 ring-[#3D3BF3]"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161922]"
                      )}
                    >
                      <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">{track.title}</h5>
                      <p className="text-[11px] text-slate-500">{track.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  What do you plan to build? (Brief Idea)
                </label>
                <textarea
                  rows={3}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161922] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#3D3BF3]"
                />
              </div>

              <FloatingInput
                label="GitHub or Portfolio Repository URL"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>
          ) : (
            /* STEP 3: TEAM SELECTION & SUBMIT */
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  3. Participation Mode
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Participate as a solo innovator or form a team (max 4).
                </p>
              </div>

              <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
                {[
                  { id: "solo", label: "Solo" },
                  { id: "team_create", label: "Create Team" },
                  { id: "team_join", label: "Join Team" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setParticipationMode(mode.id as any)}
                    className={cn(
                      "py-2 text-xs font-bold rounded-lg transition-all min-h-[38px] cursor-pointer",
                      participationMode === mode.id
                        ? "bg-white dark:bg-[#161922] text-[#3D3BF3] dark:text-[#5856FF] shadow-xs"
                        : "text-slate-600 dark:text-slate-400"
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {participationMode === "team_create" && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 space-y-3">
                  <FloatingInput
                    label="Team Name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />

                  <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Generated Team Code
                      </span>
                      <div className="text-sm font-black text-[#3D3BF3] dark:text-[#5856FF]">
                        {teamCode}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 rounded-lg bg-[#3D3BF3] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Share this code with up to 3 teammates so they can join your team.
                  </p>
                </div>
              )}

              {participationMode === "team_join" && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 space-y-3">
                  <FloatingInput
                    label="Enter 8-Character Team Code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="e.g. EDW-7892"
                  />
                  <p className="text-[11px] text-slate-500">
                    Get the team code from your team leader to link your registration.
                  </p>
                </div>
              )}

              {/* Review summary */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Event:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{opportunity.title.slice(0, 24)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registration Fee:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">₹0 (Free Entry)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Bar */}
        {step !== "success" && (
          <div className="p-4 bg-white dark:bg-[#161922] border-t border-slate-100 dark:border-slate-800 flex gap-2.5">
            <MobileButton
              variant="outline"
              size="md"
              onClick={handleBack}
              className="flex-1"
            >
              {step === 1 ? "Cancel" : "Back"}
            </MobileButton>

            <MobileButton
              variant="primary"
              size="md"
              onClick={handleNext}
              isLoading={isSubmitting}
              className="flex-[2]"
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              {step === totalSteps ? "Submit Application" : "Continue"}
            </MobileButton>
          </div>
        )}
      </div>
    </div>
  );
};
