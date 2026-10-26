"use client";

import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  RotateCcw, 
  ShieldAlert, 
  Lock, 
  Clock, 
  ArrowRight,
  Flame,
  CheckCircle2
} from "lucide-react";

interface DistractionAlertOverlayProps {
  alertMessage: string | null;
  strikeCount: number;
  maxStrikes: number;
  remainingSeconds: number;
  subjectName: string;
  onReturnToStudy: () => void;
  onEmergencyUnlock: (reason: string) => void;
}

export default function DistractionAlertOverlay({
  alertMessage,
  strikeCount,
  maxStrikes,
  remainingSeconds,
  subjectName,
  onReturnToStudy,
  onEmergencyUnlock,
}: DistractionAlertOverlayProps) {
  const [showEmergencyUnlockForm, setShowEmergencyUnlockForm] = useState(false);
  const [unlockReason, setUnlockReason] = useState("");
  const [cooldown, setCooldown] = useState(15);
  const [isCooldownActive, setIsCooldownActive] = useState(false);

  useEffect(() => {
    let timer: any;
    if (showEmergencyUnlockForm && cooldown > 0) {
      setIsCooldownActive(true);
      timer = setInterval(() => {
        setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    } else if (cooldown === 0) {
      setIsCooldownActive(false);
    }
    return () => clearInterval(timer);
  }, [showEmergencyUnlockForm, cooldown]);

  if (!alertMessage) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const isLastWarning = strikeCount >= maxStrikes;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="max-w-lg w-full bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xl text-center space-y-5">
        
        {/* Warning Icon Banner */}
        <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
          isLastWarning ? "bg-rose-50 border border-rose-200 text-rose-600" : "bg-amber-50 border border-amber-200 text-amber-600"
        }`}>
          <AlertTriangle className="w-7 h-7" />
        </div>

        {/* Warning Content */}
        <div className="space-y-2">
          <div className="flex justify-center">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isLastWarning 
                ? "bg-rose-100 text-rose-800 border-rose-200" 
                : "bg-amber-100 text-amber-900 border-amber-200"
            }`}>
              {isLastWarning ? "Final Warning" : `Strike ${strikeCount} of ${maxStrikes}`}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            Distraction Intercepted!
          </h2>

          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed max-w-md mx-auto">
            You committed to staying off social media and games while studying <strong className="text-[#111827]">{subjectName}</strong>. 
            Keep your focus streak intact!
          </p>
        </div>

        {/* Countdown & Status Capsule */}
        <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-around text-xs font-mono">
          <div className="space-y-0.5">
            <span className="text-[#6B7280] text-[10px] uppercase block">Time Remaining</span>
            <span className="text-lg text-[#111827] font-bold">{formatTime(remainingSeconds)}</span>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="space-y-0.5">
            <span className="text-[#6B7280] text-[10px] uppercase block">Focus Strikes</span>
            <span className={`text-lg font-bold ${isLastWarning ? "text-rose-600" : "text-[#111827]"}`}>
              {strikeCount} / {maxStrikes}
            </span>
          </div>
        </div>

        {/* Primary Action Button */}
        {!showEmergencyUnlockForm ? (
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={onReturnToStudy}
              className="w-full py-3 px-5 rounded-xl bg-[#111827] hover:bg-black text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Resume Study Session (Close Distractions)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowEmergencyUnlockForm(true);
                setCooldown(15);
              }}
              className="text-[11px] font-medium text-[#6B7280] hover:text-rose-600 underline cursor-pointer"
            >
              I need to unlock early (Emergency)
            </button>
          </div>
        ) : (
          /* Emergency Unlock Cooldown Form */
          <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] space-y-3 text-left">
            <div className="flex items-center justify-between text-xs font-bold text-[#111827]">
              <span className="flex items-center gap-1.5 text-rose-600">
                <ShieldAlert className="w-4 h-4" />
                Emergency Unlock Protocol
              </span>
              {cooldown > 0 && (
                <span className="font-mono text-[11px] text-[#6B7280]">
                  Cooling down: {cooldown}s
                </span>
              )}
            </div>

            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              Early unlock forfeits session XP and resets today's deep work multiplier. Briefly enter your reason to unlock:
            </p>

            <input
              type="text"
              required
              placeholder="e.g. Urgent message from parents, emergency call..."
              value={unlockReason}
              onChange={(e) => setUnlockReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E5E7EB] rounded-lg text-[#111827] focus:outline-none focus:ring-1 focus:ring-blue-600"
            />

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowEmergencyUnlockForm(false)}
                className="px-3.5 py-1.5 text-xs text-[#6B7280] hover:text-[#111827] cursor-pointer"
              >
                Back to Focus
              </button>

              <button
                type="button"
                disabled={cooldown > 0 || !unlockReason.trim()}
                onClick={() => onEmergencyUnlock(unlockReason)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  cooldown === 0 && unlockReason.trim()
                    ? "bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {cooldown > 0 ? `Wait ${cooldown}s` : "Confirm Early Exit"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
