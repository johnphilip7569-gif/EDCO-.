"use client";

import React from "react";

interface ShimmerBadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "violet" | "cyan" | "amber" | "emerald" | "slate";
  className?: string;
}

export default function ShimmerBadge({
  children,
  icon,
  variant = "slate",
  className = "",
}: ShimmerBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-neutral-100 text-black border border-neutral-200 shadow-2xs transition-transform duration-200 ${className}`}
    >
      {icon && <span className="flex-shrink-0 text-black">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
