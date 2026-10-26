"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, AlertCircle, CheckCircle2, Mail, Loader2, ArrowLeft, KeyRound } from "lucide-react";
import FigmaAuthLayout from "@/components/auth/figma/FigmaAuthLayout";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [accountExists, setAccountExists] = useState<boolean | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }
    setSubmittedEmail(cleanEmail);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to send reset instructions.");
      }
      setAccountExists(data.accountExists !== false);
      if (data.devResetUrl) {
        setDevResetUrl(data.devResetUrl);
      }
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FigmaAuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive a secure recovery link."
      activeTab="reset"
    >
      <div className="space-y-5">
        
        {sent ? (
          accountExists === false ? (
            <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
                <AlertCircle className="w-6 h-6 text-amber-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-black">No Account Found</h3>
                <p className="text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">
                  We could not find an account associated with <strong className="text-black">{submittedEmail || email}</strong>. Please check for typos or create a new student account.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <Link
                  href={`/auth/signup?email=${encodeURIComponent(submittedEmail || email)}`}
                  className="w-full py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setAccountExists(null);
                  }}
                  className="text-xs text-neutral-600 hover:text-black font-bold transition-colors cursor-pointer"
                >
                  Try a different email address
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-emerald-50/80 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-black">Recovery Link Dispatched</h3>
                <p className="text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">
                  If an account exists for <strong className="text-black">{submittedEmail || email}</strong>, you will receive an email shortly with a secure link to reset your password.
                </p>
              </div>

              {/* Developer Helper Banner */}
              {devResetUrl && (
                <div className="p-3.5 rounded-2xl bg-white border border-emerald-300 text-left space-y-2 text-xs">
                  <span className="font-bold text-emerald-800 block">
                    [Developer Mode: Instant Reset Link]
                  </span>
                  <Link
                    href={devResetUrl}
                    className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    <span>Click Here to Reset Password Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              <div className="pt-2">
                <Link
                  href="/auth/login"
                  className="text-xs font-bold text-black hover:underline"
                >
                  &larr; Return to Sign In
                </Link>
              </div>
            </div>
          )
        ) : (
          <>
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-heading font-black text-[#1B1B2F] uppercase tracking-wider">
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
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm bg-[#FFF8EE] border-2 border-[#1B1B2F] rounded-2xl text-[#1B1B2F] placeholder-[#7E7E9A] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] transition-all font-studio"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-squishy w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#1B1B2F] text-white font-heading font-extrabold text-sm border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#4D96FF] flex items-center justify-center gap-2 select-none disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Sending Recovery Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Recovery Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 border-t-2 border-[#1B1B2F]/15 text-center">
              <Link
                href="/auth/login"
                className="font-heading font-black text-xs text-[#1B1B2F] hover:text-[#FF6B6B] underline flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </>
        )}

      </div>
    </FigmaAuthLayout>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#ebe9fc] via-[#e4e2f8] to-[#eeeafc] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
