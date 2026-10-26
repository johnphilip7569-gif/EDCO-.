"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, Eye, EyeOff, X } from "lucide-react";

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      clearable = false,
      onClear,
      type = "text",
      value,
      defaultValue,
      onChange,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue || "");

    const actualValue = value !== undefined ? value : internalValue;
    const hasValue = String(actualValue).length > 0;
    const isFloating = isFocused || hasValue;
    const isPasswordType = type === "password";
    const currentType = isPasswordType ? (showPassword ? "text" : "password") : type;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      if (value === undefined) {
        setInternalValue("");
      }
      onClear?.();
    };

    return (
      <div className="w-full">
        <div
          className={cn(
            "relative flex items-center min-h-[52px] w-full rounded-xl border bg-white dark:bg-[#161922] transition-all duration-200 px-3.5",
            error
              ? "border-rose-500 focus-within:ring-2 focus-within:ring-rose-400/20"
              : isFocused
              ? "border-[#3D3BF3] ring-2 ring-[#3D3BF3]/15 dark:border-[#5856FF]"
              : "border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600",
            disabled && "opacity-60 bg-slate-50 dark:bg-slate-900 cursor-not-allowed",
            className
          )}
        >
          {leftIcon && (
            <div className="mr-2 text-slate-400 flex items-center justify-center flex-shrink-0">
              {leftIcon}
            </div>
          )}

          <div className="relative flex-1 py-1">
            <label
              className={cn(
                "absolute left-0 pointer-events-none transition-all duration-150 origin-left text-slate-500 dark:text-slate-400 select-none",
                isFloating
                  ? "top-0 text-[11px] font-semibold text-[#3D3BF3] dark:text-[#5856FF]"
                  : "top-1/2 -translate-y-1/2 text-sm"
              )}
            >
              {label}
            </label>

            <input
              ref={ref}
              type={currentType}
              value={actualValue}
              onChange={handleChange}
              disabled={disabled}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={cn(
                "w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-transparent focus:outline-none",
                isFloating ? "pt-3.5 pb-0.5" : "py-2"
              )}
              {...props}
            />
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Clear text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {isPasswordType && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}

            {error && (
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            )}
          </div>
        </div>

        {error && (
          <p className="mt-1 text-xs text-rose-500 font-medium px-1 flex items-center gap-1">
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 px-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";
