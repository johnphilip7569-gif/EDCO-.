"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, translateAuthError } from "@/lib/auth-context";
import { 
  ArrowRight, 
  AlertCircle, 
  Lock,
  Eye,
  EyeOff,
  Mail,
  Loader2,
  Sparkles
} from "lucide-react";
import FigmaAuthLayout from "@/components/auth/figma/FigmaAuthLayout";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both your email address and password.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { role, redirectUrl, onboardingCompleted } = await loginWithEmail(email, password);
      
      const explicitRedirect = searchParams?.get("redirectUrl");
      if (explicitRedirect && !explicitRedirect.startsWith("/auth") && !explicitRedirect.startsWith("/login")) {
        router.push(explicitRedirect);
        return;
      }

      if (role && role !== "CLIENT") {
        router.push(redirectUrl);
      } else if (onboardingCompleted === false) {
        router.push("/onboarding");
      } else {
        router.push(redirectUrl || "/dashboard");
      }
    } catch (err: any) {
      const friendlyMsg = translateAuthError(err);
      setError(friendlyMsg);
      if (friendlyMsg.includes("verify your email")) {
        setTimeout(() => {
          router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
        }, 1800);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FigmaAuthLayout
      title="Welcome Back"
      subtitle="Sign in to your career dashboard, mock interviews, and ATS resumes."
      activeTab="login"
    >
      <div className="space-y-5">
        
        {/* Error Alert Box */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-600 text-rose-900 text-xs font-heading font-bold flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <div>{error}</div>
              {error.includes("No account found") && (
                <div className="pt-0.5">
                  <Link
                    href={`/auth/signup?email=${encodeURIComponent(email)}`}
                    className="inline-flex items-center gap-1 font-extrabold text-[#FF6B6B] hover:underline"
                  >
                    Create an account now <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
              {error.includes("Incorrect password") && (
                <div className="pt-0.5">
                  <Link
                    href={`/auth/forgot-password?email=${encodeURIComponent(email)}`}
                    className="inline-flex items-center gap-1 font-extrabold text-[#4D96FF] hover:underline"
                  >
                    Forgot your password? Reset it here <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Address */}
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

          {/* Password with Show/Hide Toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-heading font-black text-[#1B1B2F] uppercase tracking-wider">
                Password
              </label>
              <Link
                href={`/auth/forgot-password?email=${encodeURIComponent(email)}`}
                className="text-xs font-heading font-bold text-[#4A4A68] hover:text-[#FF6B6B] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7E7E9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 sm:py-3 text-xs sm:text-sm bg-[#FFF8EE] border-2 border-[#1B1B2F] rounded-2xl text-[#1B1B2F] placeholder-[#7E7E9A] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] transition-all font-studio"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7E7E9A] hover:text-[#1B1B2F] transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Tactile Squishy Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-squishy w-full mt-2 py-3 px-6 rounded-2xl bg-[#1B1B2F] text-white font-heading font-extrabold text-sm border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#FFC93C] flex items-center justify-center gap-2 select-none disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Bottom Switcher */}
        <div className="pt-3 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-500">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/auth/signup"
              className="font-black text-black hover:underline underline-offset-2"
            >
              Create free student account
            </Link>
          </p>
        </div>

      </div>
    </FigmaAuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#ebe9fc] via-[#e4e2f8] to-[#eeeafc] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
