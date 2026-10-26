"use client";

import React from "react";

interface AmbientMeshBackgroundProps {
  className?: string;
  intensity?: "subtle" | "vibrant";
}

export default function AmbientMeshBackground({
  className = "",
  intensity = "subtle",
}: AmbientMeshBackgroundProps) {
  const opacityClass = intensity === "vibrant" ? "opacity-10" : "opacity-5";

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Monochrome Ambient Radial Gradients */}
      <div
        className={`absolute -top-24 -left-24 w-96 h-96 rounded-full bg-neutral-300 blur-3xl ${opacityClass}`}
      />
      <div
        className={`absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-neutral-400 blur-3xl ${opacityClass}`}
      />
      <div
        className={`absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-neutral-300 blur-3xl ${opacityClass}`}
      />
    </div>
  );
}
