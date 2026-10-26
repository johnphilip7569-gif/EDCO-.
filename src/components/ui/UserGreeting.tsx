"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import { formatUserGreeting, normalizeDisplayName } from "@/lib/services/user-profile";

export interface UserGreetingProps {
  context?: "dashboard" | "resume" | "interview" | "portfolio" | "general";
  subtitle?: string;
  className?: string;
  showBadge?: boolean;
  badgeText?: string;
}

export const UserGreeting: React.FC<UserGreetingProps> = ({
  context = "general",
  subtitle,
  className = "",
  showBadge = false,
  badgeText,
}) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className={`space-y-1 animate-pulse ${className}`}>
        <div className="h-7 w-48 bg-neutral-200 rounded-lg" />
        {subtitle && <div className="h-4 w-72 bg-neutral-100 rounded-md" />}
      </div>
    );
  }

  const { displayName, firstName } = normalizeDisplayName(undefined, undefined, profile?.name || user?.name);
  const greetingText = formatUserGreeting(displayName || firstName, context);

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-black">
          {greetingText}
        </h1>
        {showBadge && (
          <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-neutral-100 text-black border border-neutral-200">
            {badgeText || user?.careerStage || "VERIFIED"}
          </span>
        )}
      </div>
    </div>
  );
};

export default UserGreeting;
