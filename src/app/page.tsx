"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import ComingSoonLanding from "@/components/landing/ComingSoonLanding";
import ModernEdworldLanding from "@/components/landing/ModernEdworldLanding";

export default function HomePage() {
  const { user, profile } = useAuth();
  const [isSiteLaunched, setIsSiteLaunched] = useState<boolean | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  const isAdmin = Boolean(
    (profile as any)?.is_admin ||
    (profile as any)?.role === "ADMIN" ||
    (profile as any)?.role === "SUPER_ADMIN" ||
    (profile as any)?.role === "FOUNDER" ||
    user?.email === "edworld.eden@gmail.com"
  );

  useEffect(() => {
    // 1. Check if preview mode is requested in URL query
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("preview") === "true") {
        setPreviewMode(true);
      }
    }

    // 2. Query platform launch feature flag
    async function checkLaunchStatus() {
      try {
        const res = await fetch("/api/feature-flags");
        if (res.ok) {
          const data = await res.json();
          setIsSiteLaunched(Boolean(data.isSiteLaunched));
        } else {
          setIsSiteLaunched(false);
        }
      } catch {
        setIsSiteLaunched(false);
      }
    }

    checkLaunchStatus();
  }, []);

  // COMING SOON GATE:
  // Public visitors see Coming Soon unless site is launched or Admin preview is active.
  if ((isSiteLaunched === false || isSiteLaunched === null) && !previewMode) {
    return (
      <ComingSoonLanding
        onBypassComingSoon={isAdmin ? () => setPreviewMode(true) : undefined}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Admin Preview Mode Bar */}
      {previewMode && (
        <div className="bg-amber-400 border-b border-neutral-900 text-neutral-950 px-4 py-2 text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-2 sticky top-0 z-50 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping shrink-0" />
            <span>
              <strong>Admin Preview Active:</strong> Regular visitors see the Coming Soon page. Click &quot;Accept &amp; Launch&quot; in Admin to make features live.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin"
              className="px-3 py-1 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition"
            >
              Open Admin Console &rarr;
            </Link>
            <button
              onClick={() => setPreviewMode(false)}
              className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-neutral-900 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Exit Preview
            </button>
          </div>
        </div>
      )}

      {/* Modern, High-Performance EdWorld Landing Page */}
      <ModernEdworldLanding />
    </div>
  );
}
