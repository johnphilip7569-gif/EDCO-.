"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

export interface OtpInputGroupProps {
  length?: number;
  value?: string;
  onChange?: (otp: string) => void;
  onComplete?: (otp: string) => void;
  error?: string;
  initialCountdown?: number;
  onResend?: () => void;
  className?: string;
}

export const OtpInputGroup: React.FC<OtpInputGroupProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  error,
  initialCountdown = 30,
  onResend,
  className,
}) => {
  const [internalOtp, setInternalOtp] = useState<string[]>(Array(length).fill(""));
  const [countdown, setCountdown] = useState(initialCountdown);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const digits = value !== undefined ? value.split("").slice(0, length) : internalOtp;

  const updateOtp = (newDigits: string[]) => {
    if (value === undefined) {
      setInternalOtp(newDigits);
    }
    const combined = newDigits.join("");
    onChange?.(combined);
    if (combined.length === length && !newDigits.includes("")) {
      onComplete?.(combined);
    }
  };

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const char = rawVal.slice(-1); // Last typed character

    if (!/^\d*$/.test(char)) return; // Only numbers

    const newDigits = [...digits];
    // Fill empty slots up to length
    while (newDigits.length < length) newDigits.push("");

    newDigits[index] = char;
    updateOtp(newDigits);

    // Auto-focus next input if filled
    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Move back and clear previous
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        updateOtp(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        updateOtp(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const pastedDigits = pastedData.slice(0, length).split("");
    const newDigits = [...digits];
    pastedDigits.forEach((digit, i) => {
      newDigits[i] = digit;
    });
    updateOtp(newDigits);

    // Focus last filled or next
    const targetIdx = Math.min(pastedDigits.length, length - 1);
    inputRefs.current[targetIdx]?.focus();
  };

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(initialCountdown);
    setCanResend(false);
    onResend?.();
  };

  return (
    <div className={cn("flex flex-col items-center w-full", className)}>
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 w-full max-w-[340px]">
        {Array.from({ length }).map((_, index) => {
          const val = digits[index] || "";
          const isFilled = val.length > 0;
          return (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={val}
              onChange={(e) => handleInputChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              autoFocus={index === 0}
              className={cn(
                "w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl transition-all duration-150 select-none",
                "border focus:outline-none focus:ring-2",
                isFilled
                  ? "bg-indigo-50/50 dark:bg-indigo-950/30 border-[#3D3BF3] text-[#3D3BF3] dark:text-[#5856FF]"
                  : "bg-white dark:bg-[#161922] border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100",
                error
                  ? "border-rose-500 focus:ring-rose-400/20"
                  : "focus:border-[#3D3BF3] focus:ring-[#3D3BF3]/20"
              )}
              aria-label={`Digit ${index + 1}`}
            />
          );
        })}
      </div>

      {error && (
        <p className="mt-2 text-xs text-rose-500 font-medium text-center">
          {error}
        </p>
      )}

      {/* Resend timer */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold text-[#3D3BF3] dark:text-[#5856FF] hover:underline inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Resend OTP</span>
          </button>
        ) : (
          <span className="text-slate-500 dark:text-slate-400">
            Resend OTP in <span className="font-semibold text-slate-800 dark:text-slate-200">{countdown}s</span>
          </span>
        )}
      </div>
    </div>
  );
};
