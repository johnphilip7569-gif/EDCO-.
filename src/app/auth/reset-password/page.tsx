"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, AlertCircle, CheckCircle2, Lock, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import EdworldLogo from "@/components/ui/EdworldLogo";
import { useAuth, translateAuthError } from "@/lib/auth-context";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const { updateUserPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live password validation checklist
  const hasMinLen = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isPasswordValid = hasMinLen && hasUppercase && hasLowercase && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError("Please ensure your new password satisfies all requirements below.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match. Please verify both fields.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      if (token && email) {
        // Resend-verified token recovery flow
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            email,
            newPassword: password,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Unable to reset password.");
        }
      } else {
        // Fallback for native Supabase recovery session
        await updateUserPassword(password);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(translateAuthError(err) || err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3 text-center">
        <Link href="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
          <EdworldLogo />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
          Create New Password
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
          Choose a secure new password for your EdWorld account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="rounded-xl p-6 sm:p-8 bg-white border border-[#E5E5E5] space-y-5">
          {success ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 text-black flex items-center justify-center mx-auto border border-[#E5E5E5]">
                <CheckCircle2 className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-base font-bold text-black">Password Updated!</h3>
              <p className="text-xs text-neutral-600">
                Your password has been successfully reset. Redirecting you to sign in...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-300 text-black text-xs font-medium flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {email && (
                <div className="p-2.5 rounded-lg bg-neutral-50 border border-[#E5E5E5] text-xs text-neutral-600 flex items-center justify-between">
                  <span>Resetting password for:</span>
                  <span className="font-mono font-semibold text-black">{email}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-black">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-white border border-[#E5E5E5] text-xs sm:text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Checklist */}
              {password.length > 0 && (
                <div className="p-3 rounded-lg bg-neutral-50 border border-[#E5E5E5] space-y-1.5">
                  <p className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                    Requirements
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${hasMinLen ? "text-black font-semibold" : "text-neutral-400"}`}>
                      {hasMinLen ? <Check className="w-3.5 h-3.5 text-black" /> : <div className="w-2.5 h-2.5 rounded-full border border-neutral-300" />}
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-black font-semibold" : "text-neutral-400"}`}>
                      {hasUppercase ? <Check className="w-3.5 h-3.5 text-black" /> : <div className="w-2.5 h-2.5 rounded-full border border-neutral-300" />}
                      <span>1 uppercase</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasLowercase ? "text-black font-semibold" : "text-neutral-400"}`}>
                      {hasLowercase ? <Check className="w-3.5 h-3.5 text-black" /> : <div className="w-2.5 h-2.5 rounded-full border border-neutral-300" />}
                      <span>1 lowercase</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasNumber ? "text-black font-semibold" : "text-neutral-400"}`}>
                      {hasNumber ? <Check className="w-3.5 h-3.5 text-black" /> : <div className="w-2.5 h-2.5 rounded-full border border-neutral-300" />}
                      <span>1 number</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-black">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-lg bg-white border text-xs sm:text-sm text-black placeholder:text-neutral-400 focus:outline-none transition-colors ${
                      confirmPassword && !passwordsMatch ? "border-neutral-400" : "border-[#E5E5E5] focus:border-black"
                    }`}
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  {confirmPassword && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {passwordsMatch ? (
                        <Check className="w-4 h-4 text-black" />
                      ) : (
                        <span className="text-[10px] text-neutral-500 font-medium">Mismatch</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordValid || !passwordsMatch}
                className="w-full py-2.5 sm:py-3 rounded-lg bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Set New Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-[#E5E5E5] text-center">
            <Link
              href="/auth/login"
              className="text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
