"use client";

import React, { useState } from "react";
import { MobileButton } from "../ui/MobileButton";
import { FloatingInput } from "../ui/FloatingInput";
import { OtpInputGroup } from "../ui/OtpInputGroup";
import { ArrowLeft, Phone, Mail, ShieldCheck, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuthScreenProps {
  initialMode?: "login" | "signup";
  onSuccess: () => void;
  onBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = "signup",
  onSuccess,
  onBack,
}) => {
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [phoneStep, setPhoneStep] = useState<"enter-phone" | "enter-otp">("enter-phone");
  const [phoneNumber, setPhoneNumber] = useState("9876543210");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPhoneStep("enter-otp");
    }, 600);
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (otpCode.length < 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 700);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 700);
  };

  const handleGoogleSso = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 600);
  };

  return (
    <div className="flex flex-col h-full justify-between bg-[#F8F9FD] dark:bg-[#0E1017] p-6 select-none overflow-y-auto">
      {/* Top Bar with back action */}
      <div>
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={phoneStep === "enter-otp" ? () => setPhoneStep("enter-phone") : onBack}
            className="w-10 h-10 rounded-xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {initialMode === "signup" ? "Create Account" : "Welcome Back"}
          </span>
        </div>

        {/* Header Title */}
        <div className="mt-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {phoneStep === "enter-otp"
              ? "Verify your number"
              : initialMode === "signup"
              ? "Start your journey on EdWorld"
              : "Log in to your account"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            {phoneStep === "enter-otp" ? (
              <span>
                Enter the 6-digit code sent via SMS to{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  +91 {phoneNumber}
                </span>
              </span>
            ) : (
              "Access hackathons, DSA Studio, AI mock interviews and ATS resume tools."
            )}
          </p>
        </div>

        {/* Content based on step */}
        {phoneStep === "enter-otp" ? (
          <div className="mt-8 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-[#3D3BF3] dark:text-[#5856FF] mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <OtpInputGroup
              length={6}
              value={otpCode}
              onChange={setOtpCode}
              onComplete={() => handleVerifyOtp()}
              error={error || undefined}
              initialCountdown={30}
              onResend={() => setError(null)}
            />

            <div className="w-full mt-6">
              <MobileButton
                variant="primary"
                size="lg"
                fullWidth
                isLoading={loading}
                disabled={otpCode.length < 6}
                onClick={() => handleVerifyOtp()}
              >
                Verify & Continue
              </MobileButton>

              <button
                type="button"
                onClick={() => setPhoneStep("enter-phone")}
                className="w-full mt-3 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-center py-2 min-h-[44px] flex items-center justify-center"
              >
                Change mobile number
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            {/* Quick Google SSO */}
            <button
              type="button"
              onClick={handleGoogleSso}
              disabled={loading}
              className="w-full min-h-[48px] px-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#161922] text-slate-800 dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-3 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative bg-[#F8F9FD] dark:bg-[#0E1017] px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Or continue with
              </span>
            </div>

            {/* Method Tabs: Phone vs Email */}
            <div className="grid grid-cols-2 p-1 bg-slate-200/70 dark:bg-slate-800/70 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("phone");
                  setError(null);
                }}
                className={cn(
                  "py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 min-h-[38px] cursor-pointer",
                  authMethod === "phone"
                    ? "bg-white dark:bg-[#161922] text-[#3D3BF3] dark:text-[#5856FF] shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                )}
              >
                <Phone className="w-3.5 h-3.5" /> Phone OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("email");
                  setError(null);
                }}
                className={cn(
                  "py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 min-h-[38px] cursor-pointer",
                  authMethod === "email"
                    ? "bg-white dark:bg-[#161922] text-[#3D3BF3] dark:text-[#5856FF] shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                )}
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </button>
            </div>

            {/* Phone Form */}
            {authMethod === "phone" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-20 min-h-[52px] rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#161922] flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                    🇮🇳 +91
                  </div>
                  <div className="flex-1">
                    <FloatingInput
                      label="Mobile Number"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      error={error || undefined}
                      clearable
                      onClear={() => setPhoneNumber("")}
                    />
                  </div>
                </div>

                <MobileButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={loading}
                >
                  Send 6-Digit OTP
                </MobileButton>
              </form>
            ) : (
              /* Email Form */
              <form onSubmit={handleEmailAuth} className="space-y-3.5">
                <FloatingInput
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                />
                <FloatingInput
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  error={error || undefined}
                />

                <MobileButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={loading}
                >
                  {initialMode === "signup" ? "Create Account" : "Log In"}
                </MobileButton>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-4 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Bank-grade 256-bit encrypted authentication</span>
        </p>
      </div>
    </div>
  );
};
