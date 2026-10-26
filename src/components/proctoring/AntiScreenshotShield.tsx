"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ShieldAlert, EyeOff, Lock } from "lucide-react";

interface AntiScreenshotShieldProps {
  children?: React.ReactNode;
  watermarkLabel?: string;
  enabled?: boolean;
  onSecurityEvent?: (eventType: string, detail: string) => void;
  className?: string;
}

export default function AntiScreenshotShield({
  children,
  watermarkLabel = "EDWORLD PROTECTED ASSESSMENT",
  enabled = true,
  onSecurityEvent,
  className = "",
}: AntiScreenshotShieldProps) {
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [shieldReason, setShieldReason] = useState<string>("Protected Session");

  const poisonClipboard = useCallback(() => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(
          "Protected Assessment Content — Screenshots & Copying Prohibited by EdWorld Security."
        ).catch(() => {});
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // 1. Pre-Snip Modifier & Shortcut Interception (<16ms blackout before Win+Shift+S / Cmd+Shift+4)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isPrintScreen = e.key === "PrintScreen" || e.code === "PrintScreen";
      const isMetaKey = e.key === "Meta" || e.key === "OS" || e.metaKey;
      const isSnipCombo =
        (e.ctrlKey && e.shiftKey) ||
        (e.metaKey && e.shiftKey) ||
        (e.altKey && isPrintScreen);
      const isPrintOrSave =
        (e.ctrlKey || e.metaKey) &&
        (e.key === "p" || e.key === "P" || e.key === "s" || e.key === "S" || e.key === "u" || e.key === "U");

      if (isPrintScreen || isSnipCombo) {
        e.preventDefault();
        poisonClipboard();
        setShieldReason("Screenshot / Snipping Shortcut Intercepted");
        setIsShieldActive(true);
        onSecurityEvent?.("SCREENSHOT_ATTEMPT", `Key combo intercepted: ${e.key}`);
      } else if (isMetaKey) {
        // Immediate curtain while Win/Cmd key is depressed to block Win+Shift+S / Cmd+Shift+4
        setShieldReason("System Modifier Key Detected — Content Obscured");
        setIsShieldActive(true);
      } else if (isPrintOrSave) {
        e.preventDefault();
        setShieldReason("Print / Save Page Blocked");
        setIsShieldActive(true);
        onSecurityEvent?.("PRINT_OR_SAVE_BLOCKED", `Blocked shortcut Ctrl/Cmd+${e.key}`);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        poisonClipboard();
      }
      // Restore after brief delay only if window still has focus
      setTimeout(() => {
        if (document.hasFocus() && !document.hidden) {
          setIsShieldActive(false);
        }
      }, 650);
    };

    // 2. Instant Focus-Loss Blackout (triggers when Snipping Tool overlay or external app steals focus)
    const handleWindowBlur = () => {
      setShieldReason("Window Focus Lost — Anti-Screenshot & Anti-Camera Curtain Active");
      setIsShieldActive(true);
    };

    const handleWindowFocus = () => {
      if (!document.hidden) {
        setIsShieldActive(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShieldReason("Tab Hidden — Content Locked");
        setIsShieldActive(true);
      } else if (document.hasFocus()) {
        setIsShieldActive(false);
      }
    };

    const handleCopyCut = (e: ClipboardEvent) => {
      e.preventDefault();
      poisonClipboard();
      onSecurityEvent?.("CLIPBOARD_BLOCKED", "Copy/Cut attempt blocked");
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("copy", handleCopyCut, true);
    document.addEventListener("cut", handleCopyCut, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("copy", handleCopyCut, true);
      document.removeEventListener("cut", handleCopyCut, true);
    };
  }, [enabled, onSecurityEvent, poisonClipboard]);

  return (
    <div
      className={`relative select-none edworld-protected-view ${className}`}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
    >
      {/* Print-to-PDF Blocker Style */}
      <style jsx global>{`
        @media print {
          .edworld-protected-view,
          .edworld-protected-view * {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
          body::before {
            content: "PROTECTED ASSESSMENT CONTENT — PRINTING & PDF EXPORT PROHIBITED BY EDWORLD SECURITY";
            display: block !important;
            padding: 48px;
            font-family: monospace;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
          }
        }
      `}</style>

      {/* Protected Content Layer */}
      <div
        className={`transition-none ${
          isShieldActive ? "blur-2xl brightness-[0.03] pointer-events-none select-none" : ""
        }`}
      >
        {children}
      </div>

      {/* Instant Blackout Curtain Overlay */}
      {isShieldActive && (
        <div
          onClick={() => setIsShieldActive(false)}
          className="absolute inset-0 z-30 rounded-2xl bg-neutral-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center text-white border border-neutral-800 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-3">
            <EyeOff className="w-6 h-6 text-red-400" />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-red-400 mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Anti-Screenshot &amp; Anti-Camera Shield</span>
          </div>
          <h4 className="text-base font-extrabold text-white max-w-md">
            {shieldReason}
          </h4>
          <p className="text-xs text-neutral-400 max-w-sm mt-1.5 leading-relaxed">
            Question text and code traces are optically protected against screenshots, snipping tools, and external cameras. Click anywhere inside this window to resume.
          </p>
          <button
            type="button"
            onClick={() => setIsShieldActive(false)}
            className="mt-4 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold flex items-center gap-1.5 hover:bg-neutral-200 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Click to Resume Session</span>
          </button>
        </div>
      )}

      {/* Subtle Forensic Watermark Bar */}
      <div className="mt-2 flex items-center justify-between px-2 text-[10px] font-mono text-neutral-400 pointer-events-none">
        <span>{watermarkLabel}</span>
        <span>Optical Moiré • Screenshot &amp; Clipboard Guard Active</span>
      </div>
    </div>
  );
}
