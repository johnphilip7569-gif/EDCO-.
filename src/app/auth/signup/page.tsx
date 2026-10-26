"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, translateAuthError } from "@/lib/auth-context";
import { 
  ArrowRight, 
  AlertCircle, 
  Lock, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Mail, 
  User, 
  Phone,
  Loader2,
  Gift,
  CheckCircle2,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import FigmaAuthLayout from "@/components/auth/figma/FigmaAuthLayout";
import FloatingMyraSignupBuddy from "@/components/auth/FloatingMyraSignupBuddy";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signupWithEmail } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(searchParams?.get("email") || "");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [ageConsent, setAgeConsent] = useState(false);
  const [referralCode, setReferralCode] = useState(searchParams.get("ref") || "");

  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [loadingStep, setLoadingStep] = useState("Creating your account...");
  const [error, setError] = useState<string | null>(null);

  // Password validation rules
  const hasMinLen = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLen && hasLetter && hasNumber;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed) {
      setError("Please agree to the Terms of Service, Privacy Policy, and Refund Policy.");
      return;
    }
    if (!ageConsent) {
      setError("Please confirm your age eligibility / guardian consent to proceed.");
      return;
    }
    if (!isPasswordValid) {
      setError("Password must be at least 8 characters long and contain both letters and numbers.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setLoadingStep("Creating your secure account...");

      await signupWithEmail(name.trim(), email.trim().toLowerCase(), password, undefined, undefined, phone.trim() || undefined);

      // Record referral code if present
      if (referralCode.trim()) {
        setLoadingStep("Applying referral benefits...");
        try {
          const { data: authData } = await supabase.auth.getUser();
          const userId = authData?.user?.id;
          if (userId) {
            await fetch("/api/ambassador/record-referral", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                referralCode: referralCode.trim(),
                newUserId: userId
              })
            });
          }
        } catch (refErr) {
          console.error("Failed to record referral:", refErr);
        }
      }

      setAccountCreated(true);
      setTimeout(() => {
        router.push("/onboarding");
      }, 2000);
    } catch (err: any) {
      const friendlyMsg = translateAuthError(err);
      setError(friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FigmaAuthLayout
        title="Create Account"
        subtitle="Join thousands of students and engineers mastering their future."
        activeTab="signup"
      >
      <div className="space-y-5">
        
        {/* Success Message Banner */}
        {accountCreated ? (
          <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-600 text-center space-y-3 animate-in zoom-in-95 shadow-[4px_4px_0px_#1B1B2F]">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm border-2 border-[#1B1B2F]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-lg text-emerald-950">
              Account Created Successfully!
            </h3>
            <p className="font-studio text-xs text-emerald-800">
              Setting up your customized learning workspace and directing you to onboarding...
            </p>
            <div className="pt-2">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600 mx-auto" />
            </div>
          </div>
        ) : (
          <>
            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-600 text-rose-900 text-xs font-heading font-bold flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-heading font-black text-[#1B1B2F] uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#7E7E9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FFF8EE] border-2 border-[#1B1B2F] rounded-2xl text-[#1B1B2F] placeholder-[#7E7E9A] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] transition-all font-studio"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-[11px] font-heading font-black text-[#1B1B2F] uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7E7E9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FFF8EE] border-2 border-[#1B1B2F] rounded-2xl text-[#1B1B2F] placeholder-[#7E7E9A] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] transition-all font-studio"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-[11px] font-heading font-black text-[#1B1B2F] uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7E7E9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#FFF8EE] border-2 border-[#1B1B2F] rounded-2xl text-[#1B1B2F] placeholder-[#7E7E9A] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] transition-all font-studio"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7E7E9A] hover:text-[#1B1B2F] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-[11px] font-heading font-black text-[#1B1B2F] uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7E7E9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FFF8EE] border-2 border-[#1B1B2F] rounded-2xl text-[#1B1B2F] placeholder-[#7E7E9A] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] transition-all font-studio"
                  />
                </div>
              </div>

              {/* Password Quality Checklist */}
              {password.length > 0 && (
                <div className="p-2.5 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F]/30 text-[11px] space-y-1 font-mono">
                  <div className="flex items-center gap-1.5">
                    {hasMinLen ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-neutral-400" />}
                    <span className={hasMinLen ? "text-emerald-700 font-bold" : "text-neutral-500"}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {hasLetter && hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-neutral-400" />}
                    <span className={hasLetter && hasNumber ? "text-emerald-700 font-bold" : "text-neutral-500"}>Letters and numbers</span>
                  </div>
                  {confirmPassword.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      {passwordsMatch ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-rose-500" />}
                      <span className={passwordsMatch ? "text-emerald-700 font-bold" : "text-rose-600"}>Passwords match</span>
                    </div>
                  )}
                </div>
              )}

              {/* Terms & Age Eligibility Checkboxes */}
              <div className="space-y-2 pt-1 font-studio">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#4A4A68]">
                  <input
                    type="checkbox"
                    required
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-2 border-[#1B1B2F] text-[#FF6B6B] focus:ring-[#FF6B6B] cursor-pointer"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" target="_blank" className="font-bold text-[#1B1B2F] underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" target="_blank" className="font-bold text-[#1B1B2F] underline">Privacy Policy</Link>.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#4A4A68]">
                  <input
                    type="checkbox"
                    required
                    checked={ageConsent}
                    onChange={(e) => setAgeConsent(e.target.checked)}
                    className="mt-0.5 rounded border-2 border-[#1B1B2F] text-[#FF6B6B] focus:ring-[#FF6B6B] cursor-pointer"
                  />
                  <span>
                    I confirm I am eligible or have parental/guardian consent to use EdWorld Co.
                  </span>
                </label>
              </div>

              {/* Tactile Squishy Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-squishy w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#FF6B6B] text-white font-heading font-extrabold text-xs sm:text-sm border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F] flex items-center justify-center gap-2 select-none disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{loadingStep}</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Student Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Bottom Switcher */}
            <div className="pt-3 border-t-2 border-[#1B1B2F]/15 text-center">
              <p className="text-xs font-studio text-[#4A4A68]">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-heading font-black text-[#1B1B2F] hover:text-[#FF6B6B] underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </>
        )}

      </div>
    </FigmaAuthLayout>
    <FloatingMyraSignupBuddy />
  </>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#ebe9fc] via-[#e4e2f8] to-[#eeeafc] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
