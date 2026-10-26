"use client";

import React, { useState } from "react";
import { MobileButton } from "../ui/MobileButton";
import { FloatingInput } from "../ui/FloatingInput";
import { MobileChip } from "../ui/MobileChip";
import {
  ONBOARDING_PERSONAS,
  ONBOARDING_INTERESTS,
  ONBOARDING_GOALS,
} from "@/lib/mobile-design-tokens";
import {
  ArrowLeft,
  ChevronRight,
  Upload,
  Bell,
  Sparkles,
  CheckCircle,
  FileText,
  AlertCircle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Step 1: Persona
  const [selectedPersona, setSelectedPersona] = useState<string>("college");

  // Step 2: Details
  const [fullName, setFullName] = useState("Rahul Sharma");
  const [collegeOrOrg, setCollegeOrOrg] = useState("IIT Bombay");
  const [gradYear, setGradYear] = useState("2026");

  // Step 3: Interests (min 3 required)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Hackathons",
    "Coding & DSA",
    "AI & Machine Learning",
  ]);

  // Step 4: Career Goals
  const [selectedGoal, setSelectedGoal] = useState<string>("g1");

  // Step 5: Resume & Notifications
  const [resumeUploaded, setResumeUploaded] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step trigger confetti
      setShowConfetti(true);
      setTimeout(() => {
        onComplete();
      }, 1400);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step validity checks
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return Boolean(selectedPersona);
      case 2:
        return fullName.trim().length > 1 && collegeOrOrg.trim().length > 1;
      case 3:
        return selectedInterests.length >= 3;
      case 4:
        return Boolean(selectedGoal);
      case 5:
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="flex flex-col h-full justify-between bg-[#F8F9FD] dark:bg-[#0E1017] p-6 select-none relative overflow-y-auto">
      {/* Confetti overlay animation */}
      {showConfetti && (
        <div className="absolute inset-0 z-50 bg-[#3D3BF3]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 rounded-full bg-white text-[#3D3BF3] flex items-center justify-center text-4xl mb-4 shadow-xl animate-bounce">
            🎉
          </div>
          <h2 className="text-2xl font-black">All Set, {fullName.split(" ")[0]}!</h2>
          <p className="text-sm text-indigo-100 mt-2 max-w-[280px]">
            Your customized EdWorld feed with hackathons, DSA Studio, and ATS tools is ready.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs bg-white/20 px-3 py-1.5 rounded-full font-semibold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Profile 70% Complete</span>
          </div>
        </div>
      )}

      {/* Top Header: Back + Step Counter + Progress Bar */}
      <div>
        <div className="flex items-center justify-between pt-2">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="w-10 h-10 rounded-xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
              aria-label="Previous step"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-10 h-10" />
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#3D3BF3] dark:text-[#5856FF]">
              Step {currentStep}
            </span>
            <span className="text-xs text-slate-400">of {totalSteps}</span>
          </div>

          {onSkip && currentStep < totalSteps ? (
            <button
              type="button"
              onClick={onSkip}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 min-h-[44px] px-2 py-2 flex items-center"
            >
              Skip
            </button>
          ) : (
            <div className="w-10 h-10" />
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#3D3BF3] to-[#FF6B00] transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* STEP 1: Persona */}
        {currentStep === 1 && (
          <div className="mt-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              What best describes you?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              We personalize competitions, internships, and tools to your current stage.
            </p>

            <div className="grid grid-cols-1 gap-2.5 mt-5">
              {ONBOARDING_PERSONAS.map((persona) => {
                const isSelected = selectedPersona === persona.id;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => setSelectedPersona(persona.id)}
                    className={cn(
                      "flex items-center gap-3.5 p-3.5 rounded-2xl border text-left transition-all duration-150 min-h-[58px] cursor-pointer",
                      isSelected
                        ? "border-[#3D3BF3] bg-indigo-50/60 dark:bg-indigo-950/40 shadow-sm ring-1 ring-[#3D3BF3]"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161922] hover:border-slate-300"
                    )}
                  >
                    <span className="text-2xl flex-shrink-0">{persona.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {persona.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {persona.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-[#3D3BF3] dark:text-[#5856FF] flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Basic Details */}
        {currentStep === 2 && (
          <div className="mt-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Tell us about yourself
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              This info appears on your verified student profile and competition badges.
            </p>

            <div className="mt-5 space-y-4">
              <FloatingInput
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <FloatingInput
                label="College / University / School"
                value={collegeOrOrg}
                onChange={(e) => setCollegeOrOrg(e.target.value)}
              />

              <FloatingInput
                label="Graduation Year"
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 3: Interests (Pills, min 3) */}
        {currentStep === 3 && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                What interests you?
              </h2>
              <span
                className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-full",
                  selectedInterests.length >= 3
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                )}
              >
                {selectedInterests.length}/3 selected
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select at least 3 topics to unlock customized recommendations.
            </p>

            <div className="flex flex-wrap gap-2 mt-5 max-h-[320px] overflow-y-auto pr-1">
              {ONBOARDING_INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <MobileChip
                    key={interest}
                    label={interest}
                    active={isSelected}
                    onClick={() => toggleInterest(interest)}
                    size="md"
                  />
                );
              })}
            </div>

            {selectedInterests.length < 3 && (
              <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Select {3 - selectedInterests.length} more topic(s) to proceed</span>
              </p>
            )}
          </div>
        )}

        {/* STEP 4: Career Goals */}
        {currentStep === 4 && (
          <div className="mt-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              What is your primary goal?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              We will prioritize deadlines and practice drills according to this focus.
            </p>

            <div className="grid grid-cols-1 gap-2.5 mt-5">
              {ONBOARDING_GOALS.map((goal) => {
                const isSelected = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoal(goal.id)}
                    className={cn(
                      "flex items-center gap-3.5 p-3.5 rounded-2xl border text-left transition-all duration-150 min-h-[60px] cursor-pointer",
                      isSelected
                        ? "border-[#3D3BF3] bg-indigo-50/60 dark:bg-indigo-950/40 shadow-sm ring-1 ring-[#3D3BF3]"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161922] hover:border-slate-300"
                    )}
                  >
                    <span className="text-2xl flex-shrink-0">{goal.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {goal.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {goal.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-[#3D3BF3] dark:text-[#5856FF] flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Resume & Notifications */}
        {currentStep === 5 && (
          <div className="mt-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Level up your profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Upload your resume now for 1-click apply, or build one with EdWorld ATS Maker.
            </p>

            <div className="mt-5 space-y-4">
              {/* Resume Card */}
              <div
                onClick={() => setResumeUploaded(!resumeUploaded)}
                className={cn(
                  "p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center",
                  resumeUploaded
                    ? "border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20"
                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161922]"
                )}
              >
                {resumeUploaded ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                      <Check className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      Rahul_Sharma_Resume_2026.pdf
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      ATS Match Score: 88% • Click to replace
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-[#3D3BF3] mb-2" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Upload PDF Resume (Max 5MB)
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Or generate from EdWorld ATS Builder later
                    </span>
                  </>
                )}
              </div>

              {/* Push Notification Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950 text-[#FF6B00] flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Deadline Alerts & Daily Streaks
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Never miss closing hackathons & PPO rounds
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEnableNotifications(!enableNotifications)}
                  className={cn(
                    "w-12 h-7 rounded-full transition-colors relative flex items-center p-0.5 min-h-[32px] cursor-pointer",
                    enableNotifications ? "bg-[#3D3BF3]" : "bg-slate-300 dark:bg-slate-700"
                  )}
                  aria-label="Toggle notifications"
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full bg-white shadow-md transform transition-transform",
                      enableNotifications ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA Button */}
      <div className="pt-4 z-10 pb-2">
        <MobileButton
          variant="primary"
          size="lg"
          fullWidth
          disabled={!isStepValid()}
          onClick={handleNext}
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          {currentStep === totalSteps ? "Finish & Go to Feed" : "Continue"}
        </MobileButton>
      </div>
    </div>
  );
};
