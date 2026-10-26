"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface ProctoringState {
  violationCount: number;
  maxViolations: number;
  isDisqualified: boolean;
  activeWarning: string | null;
  isFullscreen: boolean;
  history: Array<{ timestamp: string; type: string; details: string }>;
}

interface UseExamProctoringOptions {
  enabled?: boolean;
  maxViolations?: number;
  onDisqualify?: (reason: string) => void;
  onViolation?: (count: number, type: string) => void;
}

export function useExamProctoring(options: UseExamProctoringOptions = {}) {
  const {
    enabled = true,
    maxViolations = 2,
    onDisqualify,
    onViolation
  } = options;

  const [violationCount, setViolationCount] = useState(0);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [activeWarning, setActiveWarning] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const violationHistoryRef = useRef<Array<{ timestamp: string; type: string; details: string }>>([]);
  const hasTriggeredDisqualifyRef = useRef(false);

  // Record a violation strike
  const triggerViolation = useCallback((type: string, details: string) => {
    if (!enabled || hasTriggeredDisqualifyRef.current) return;

    const timestamp = new Date().toISOString();
    violationHistoryRef.current.push({ timestamp, type, details });

    setViolationCount((prev) => {
      const newCount = prev + 1;
      
      if (onViolation) {
        onViolation(newCount, type);
      }

      if (newCount > maxViolations) {
        // Disqualification triggered
        hasTriggeredDisqualifyRef.current = true;
        setIsDisqualified(true);
        setActiveWarning(`DISQUALIFIED: You switched tabs or windows ${newCount} times. The session has been locked and submitted for proctor review.`);
        if (onDisqualify) {
          onDisqualify(`Maximum tab/window switch violations exceeded (${newCount}/${maxViolations})`);
        }
      } else {
        const remaining = maxViolations - newCount + 1;
        setActiveWarning(
          `STRIKE ${newCount} OF ${maxViolations}: Tab switch or window blur detected (${details}). Return to fullscreen exam mode immediately. ${remaining === 1 ? "This is your FINAL warning." : ""}`
        );
      }

      return newCount;
    });
  }, [enabled, maxViolations, onDisqualify, onViolation]);

  // Request Fullscreen
  const requestFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.warn("[Proctoring Fullscreen Note]:", err);
    }
  }, []);

  // Exit warning dismiss
  const dismissWarning = useCallback(() => {
    if (!isDisqualified) {
      setActiveWarning(null);
      // Auto-re-request fullscreen if lost
      if (!document.fullscreenElement) {
        requestFullscreen();
      }
    }
  }, [isDisqualified, requestFullscreen]);

  useEffect(() => {
    if (!enabled) return;

    // 1. Tab visibility switch detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation("TAB_SWITCH", "User switched browser tab or minimized window");
      }
    };

    // 2. Window blur detection (switching to another app or clicking out)
    const handleWindowBlur = () => {
      // Delay slightly to prevent false positive on native dialogs
      setTimeout(() => {
        if (!document.hasFocus()) {
          triggerViolation("WINDOW_BLUR", "Focus lost to another desktop application or monitor");
        }
      }, 100);
    };

    // 3. Fullscreen exit detection
    const handleFullscreenChange = () => {
      const inFullscreen = !!document.fullscreenElement;
      setIsFullscreen(inFullscreen);
      if (!inFullscreen && !hasTriggeredDisqualifyRef.current) {
        triggerViolation("FULLSCREEN_EXIT", "Candidate exited required fullscreen lockdown");
      }
    };

    // 4. Intercept copy, cut, print, snipping tools, and DevTools shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen or Snipping Tool (Win+Shift+S / Cmd+Shift+3/4/5)
      const isSnipShortcut =
        e.key === "PrintScreen" ||
        ((e.metaKey || e.ctrlKey) &&
          e.shiftKey &&
          (e.key === "S" || e.key === "s" || e.key === "3" || e.key === "4" || e.key === "5"));

      if (isSnipShortcut) {
        e.preventDefault();
        triggerViolation("SCREENSHOT_ATTEMPT", "Screenshot or Snipping Tool shortcut intercepted");
        try {
          navigator.clipboard?.writeText("Protected Assessment Content — Screenshots Prohibited");
        } catch (_) {}
      }

      // Ctrl+C / Cmd+C / Ctrl+X / Cmd+X
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C" || e.key === "x" || e.key === "X")) {
        e.preventDefault();
        triggerViolation("CLIPBOARD_COPY", "Text copy/cut shortcut intercepted");
      }

      // Ctrl+P / Cmd+P / Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P" || e.key === "s" || e.key === "S")) {
        e.preventDefault();
        triggerViolation("PRINT_ATTEMPT", "Browser print or save dialog intercepted");
      }

      // F12, Ctrl+Shift+I/J/C, or Ctrl+U (DevTools & View Source)
      if (
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) ||
        ((e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          (e.key === "I" || e.key === "i" || e.key === "C" || e.key === "c" || e.key === "J" || e.key === "j"))
      ) {
        e.preventDefault();
        triggerViolation("DEVTOOLS_ATTEMPT", "Developer tools or source inspection intercepted");
      }
    };

    // 5. Intercept context menu (Right click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [enabled, triggerViolation]);

  return {
    violationCount,
    maxViolations,
    isDisqualified,
    activeWarning,
    isFullscreen,
    violationHistory: violationHistoryRef.current,
    requestFullscreen,
    dismissWarning,
  };
}
