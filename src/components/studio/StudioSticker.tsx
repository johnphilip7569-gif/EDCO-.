"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StudioStickerProps {
  children?: React.ReactNode;
  text?: string;
  color?: string;
  bgColor?: string;
  textColor?: string;
  rotate?: "left" | "right" | "slight-left" | "slight-right" | "none" | number;
  size?: "sm" | "md" | "lg";
  className?: string;
  shadow?: boolean;
}

export function StudioSticker({
  children,
  text,
  color,
  bgColor = color || "#FFC93C",
  textColor = "#1B1B2F",
  rotate = "slight-left",
  size = "md",
  className = "",
  shadow = true,
}: StudioStickerProps) {
  const rotationClass = typeof rotate === "string" ? {
    left: "-rotate-3",
    right: "rotate-3",
    "slight-left": "-rotate-1.5",
    "slight-right": "rotate-1.5",
    none: "rotate-0",
  }[rotate] : undefined;

  const dynamicRotationStyle = typeof rotate === "number" ? { transform: `rotate(${rotate}deg)` } : undefined;

  const sizeClass = {
    sm: "px-2.5 py-0.5 text-[10px] font-bold",
    md: "px-3 py-1 text-xs sm:text-sm font-bold",
    lg: "px-4 py-1.5 text-sm sm:text-base font-extrabold",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-2 border-[#1B1B2F] font-heading uppercase tracking-wide select-none transition-transform duration-200 hover:rotate-0 hover:scale-105",
        rotationClass,
        sizeClass,
        shadow && "shadow-[3px_3px_0px_#1B1B2F]",
        className
      )}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        ...dynamicRotationStyle,
      }}
    >
      {text || children}
    </span>
  );
}

export default StudioSticker;
