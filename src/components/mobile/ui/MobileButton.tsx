"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
}

export function MobileButton({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  isLoading = false,
  icon,
  leftIcon,
  rightIcon,
  iconPosition = "left",
  children,
  className = "",
  disabled,
  ...props
}: MobileButtonProps) {
  const isCurrentlyLoading = loading || isLoading;
  const effectiveLeftIcon = leftIcon || (iconPosition === "left" ? icon : null);
  const effectiveRightIcon = rightIcon || (iconPosition === "right" ? icon : null);

  // Variant styles
  const variantStyles = {
    primary: "bg-[#3D3BF3] hover:bg-[#2E2CD4] text-white shadow-[0_4px_14px_rgba(61,59,243,0.30)] active:shadow-none border border-transparent",
    accent: "bg-[#FF6B00] hover:bg-[#E56000] text-white shadow-[0_4px_14px_rgba(255,107,0,0.30)] active:shadow-none border border-transparent",
    gold: "bg-[#FFB800] hover:bg-[#E5A500] text-black shadow-[0_4px_14px_rgba(255,184,0,0.30)] active:shadow-none border border-transparent font-black",
    secondary: "bg-[#EEF0FF] dark:bg-[#1E2238] text-[#3D3BF3] dark:text-[#7A78FF] hover:bg-[#E0E4FF] border border-transparent",
    outline: "bg-transparent border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-[#3D3BF3] hover:text-[#3D3BF3]",
    ghost: "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent",
  };

  // Size styles (guarantee 44px min tap target)
  const sizeStyles = {
    sm: "min-h-[44px] px-3.5 py-1.5 text-xs rounded-xl gap-1.5",
    md: "min-h-[44px] px-5 py-2.5 text-sm rounded-2xl gap-2",
    lg: "min-h-[50px] px-6 py-3.5 text-base rounded-2xl gap-2.5 font-bold",
  };

  return (
    <button
      disabled={disabled || isCurrentlyLoading}
      className={`
        inline-flex items-center justify-center font-bold tracking-tight select-none cursor-pointer
        transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {isCurrentlyLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        <>
          {effectiveLeftIcon && <span className="shrink-0">{effectiveLeftIcon}</span>}
          <span>{children}</span>
          {effectiveRightIcon && <span className="shrink-0">{effectiveRightIcon}</span>}
        </>
      )}
    </button>
  );
}

export default MobileButton;
