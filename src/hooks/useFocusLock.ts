"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DistractionTarget, DISTRACTION_TARGETS } from "@/lib/focus-tokens";

export interface FocusSessionState {
  id: string;
  isActive: boolean;
  isCompleted: boolean;
  subjectName: string;
  subjectHref: string;
  totalDurationSeconds: number;
  remainingSeconds: number;
  startTime: string;
  endTime: string;
  blockedTargets: string[]; // ids of distraction targets
  strikeCount: number;
  maxStrikes: number;
  activeDistractionAlert: string | null;
  xpAwarded: number;
}

const STORAGE_KEY = "edworld_active_focus_session";

export function useFocusLock() {
  const [session, setSession] = useState<FocusSessionState | null>(null);
  const [isEmergencyUnlocked, setIsEmergencyUnlocked] = useState(false);
  const strikeHistoryRef = useRef<Array<{ timestamp: string; reason: string }>>([]);

  // Load active session from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const now = Date.now();
        const end = new Date(parsed.endTime).getTime();
        if (now < end && parsed.isActive && !parsed.isCompleted) {
          const remaining = Math.max(0, Math.floor((end - now) / 1000));
          setSession({ ...parsed, remainingSeconds: remaining });
        } else if (parsed.isActive && now >= end) {
          // Auto complete
          setSession({
            ...parsed,
            isActive: false,
            isCompleted: true,
            remainingSeconds: 0,
          });
        }
      }
    } catch (e) {
      console.warn("Failed to load active focus session:", e);
    }
  }, []);

  // Broadcast state to Chrome extension via window.postMessage & localStorage event
  const broadcastToExtension = useCallback((active: boolean, blockedDomains: string[], endTime: string) => {
    if (typeof window !== "undefined") {
      window.postMessage(
        {
          type: "EDWORLD_FOCUS_LOCK_UPDATE",
          active,
          blockedDomains,
          endTime,
        },
        "*"
      );
      try {
        localStorage.setItem(
          "edworld_focus_guard_sync",
          JSON.stringify({ active, blockedDomains, endTime, updated: Date.now() })
        );
      } catch (_) {}
    }
  }, []);

  // Timer interval
  useEffect(() => {
    if (!session || !session.isActive || session.isCompleted || session.remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setSession((prev) => {
        if (!prev || !prev.isActive) return prev;
        if (prev.remainingSeconds <= 1) {
          clearInterval(interval);
          const completedSession: FocusSessionState = {
            ...prev,
            isActive: false,
            isCompleted: true,
            remainingSeconds: 0,
          };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(completedSession));
          } catch (_) {}
          broadcastToExtension(false, [], "");
          return completedSession;
        }

        const updated: FocusSessionState = {
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1,
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session?.isActive, session?.isCompleted, session?.remainingSeconds, broadcastToExtension]);

  // Tab switch & Window blur detection while focus lock is active
  useEffect(() => {
    if (!session || !session.isActive || session.isCompleted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerDistractionStrike("Tab switched away from EdWorld study session");
      }
    };

    const handleWindowBlur = () => {
      setTimeout(() => {
        if (!document.hasFocus() && session?.isActive) {
          triggerDistractionStrike("Lost window focus (clicked another app or browser window)");
        }
      }, 300);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (session?.isActive && !session.isCompleted) {
        e.preventDefault();
        e.returnValue = "Focus Lock is active! Leaving now will forfeit your Deep Work XP.";
        return e.returnValue;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [session?.isActive, session?.isCompleted]);

  // Record a distraction strike
  const triggerDistractionStrike = useCallback((reason: string) => {
    setSession((prev) => {
      if (!prev || !prev.isActive || prev.isCompleted) return prev;

      const newStrikeCount = prev.strikeCount + 1;
      const timestamp = new Date().toISOString();
      strikeHistoryRef.current.push({ timestamp, reason });

      const alertMsg = `Distraction Alert (Strike ${newStrikeCount} of ${prev.maxStrikes}): ${reason}. Stay focused on your study goal!`;

      const updated: FocusSessionState = {
        ...prev,
        strikeCount: newStrikeCount,
        activeDistractionAlert: alertMsg,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}

      return updated;
    });
  }, []);

  // Dismiss active distraction alert
  const dismissDistractionAlert = useCallback(() => {
    setSession((prev) => {
      if (!prev) return null;
      const updated = { ...prev, activeDistractionAlert: null };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  }, []);

  // Start new focus session
  const startFocusSession = useCallback(
    (params: {
      minutes: number;
      subjectName: string;
      subjectHref: string;
      blockedTargetIds: string[];
      xpReward: number;
    }) => {
      const now = new Date();
      const endTime = new Date(now.getTime() + params.minutes * 60 * 1000);
      const totalSeconds = params.minutes * 60;

      // Extract all domains from selected targets
      const blockedDomains: string[] = [];
      DISTRACTION_TARGETS.forEach((target) => {
        if (params.blockedTargetIds.includes(target.id)) {
          blockedDomains.push(...target.domains);
        }
      });

      const newSession: FocusSessionState = {
        id: `focus_${Date.now()}`,
        isActive: true,
        isCompleted: false,
        subjectName: params.subjectName,
        subjectHref: params.subjectHref,
        totalDurationSeconds: totalSeconds,
        remainingSeconds: totalSeconds,
        startTime: now.toISOString(),
        endTime: endTime.toISOString(),
        blockedTargets: params.blockedTargetIds,
        strikeCount: 0,
        maxStrikes: 3,
        activeDistractionAlert: null,
        xpAwarded: params.xpReward,
      };

      setSession(newSession);
      setIsEmergencyUnlocked(false);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      } catch (_) {}

      broadcastToExtension(true, blockedDomains, endTime.toISOString());
    },
    [broadcastToExtension]
  );

  // Emergency unlock
  const emergencyUnlock = useCallback(
    (reason: string) => {
      setSession((prev) => {
        if (!prev) return null;
        const ended: FocusSessionState = {
          ...prev,
          isActive: false,
          isCompleted: false,
          activeDistractionAlert: null,
        };
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (_) {}
        return ended;
      });
      setIsEmergencyUnlocked(true);
      broadcastToExtension(false, [], "");
    },
    [broadcastToExtension]
  );

  // Clear session after review
  const resetSession = useCallback(() => {
    setSession(null);
    setIsEmergencyUnlocked(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
    broadcastToExtension(false, [], "");
  }, [broadcastToExtension]);

  const isSessionActive = Boolean(session?.isActive && !session?.isCompleted);
  const minutes = session ? Math.floor(session.remainingSeconds / 60) : 0;
  const seconds = session ? session.remainingSeconds % 60 : 0;
  const formattedTimeLeft = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    session,
    isSessionActive,
    formattedTimeLeft,
    isEmergencyUnlocked,
    startFocusSession,
    emergencyUnlock,
    resetSession,
    dismissDistractionAlert,
    triggerDistractionStrike,
  };
}
