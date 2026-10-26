"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Sparkles, 
  Award, 
  RotateCcw,
  BookOpen,
  ArrowRight,
  Lock,
  Pause,
  Play
} from "lucide-react";
import { FocusSessionState } from "@/hooks/useFocusLock";
import { DISTRACTION_TARGETS } from "@/lib/focus-tokens";

interface ActiveFocusRoomProps {
  session: FocusSessionState;
  onReset: () => void;
  onTriggerEmergencyUnlock: () => void;
}

export default function ActiveFocusRoom({
  session,
  onReset,
  onTriggerEmergencyUnlock,
}: ActiveFocusRoomProps) {
  // Ambient Sound Generator via Web Audio API
  const [ambientSound, setAmbientSound] = useState<"off" | "rain" | "whitenoise">("off");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodeRef = useRef<AudioNode | null>(null);

  const toggleSound = (type: "rain" | "whitenoise") => {
    if (ambientSound === type) {
      stopAmbientSound();
      setAmbientSound("off");
      return;
    }

    stopAmbientSound();
    playAmbientSound(type);
    setAmbientSound(type);
  };

  const playAmbientSound = (type: "rain" | "whitenoise") => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      if (type === "whitenoise") {
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
      } else {
        // Rain sound (Brownian noise)
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      if (type === "rain") {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
      } else {
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.Q.setValueAtTime(1, ctx.currentTime);
      }

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start(0);
      soundNodeRef.current = whiteNoise;
    } catch (e) {
      console.warn("Ambient sound initialization failed:", e);
    }
  };

  const stopAmbientSound = () => {
    try {
      if (soundNodeRef.current) {
        (soundNodeRef.current as any).stop?.();
        soundNodeRef.current.disconnect();
        soundNodeRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (e) {
      // Ignore audio teardown error
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        ((session.totalDurationSeconds - session.remainingSeconds) /
          session.totalDurationSeconds) *
          100
      )
    )
  );

  const blockedNames = DISTRACTION_TARGETS.filter((t) =>
    session.blockedTargets.includes(t.id)
  ).map((t) => t.name);

  // SESSION COMPLETED SCREEN
  if (session.isCompleted) {
    return (
      <div className="p-8 sm:p-12 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs text-center max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            Session Accomplished
          </span>
          <h2 className="text-3xl font-bold text-[#111827] tracking-tight">
            Deep Work Sprint Completed!
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] max-w-lg mx-auto leading-relaxed">
            You successfully completed your {Math.round(session.totalDurationSeconds / 60)}-minute study block on <strong>{session.subjectName}</strong> without falling into social media distractions!
          </p>
        </div>

        {/* XP Award Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>+{session.xpAwarded} Deep Work Focus XP Awarded!</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#E5E7EB]">
          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-xl bg-[#F7F8FA] hover:bg-gray-100 border border-[#E5E7EB] text-xs font-semibold text-[#111827] transition-colors cursor-pointer"
          >
            Start Another Focus Session
          </button>

          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-white text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* 1. MAIN CLOCK CANVAS */}
      <div className="p-8 sm:p-12 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs text-center space-y-6">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              Active Focus Lock
            </span>
            <span className="text-xs font-mono font-medium text-[#6B7280]">
              {Math.round(session.totalDurationSeconds / 60)}m Block
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#F7F8FA] border border-[#E5E7EB] text-[#111827] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Strikes: {session.strikeCount} / {session.maxStrikes}</span>
            </span>
          </div>
        </div>

        {/* Large Digital Clock */}
        <div className="py-4 space-y-1">
          <span className="text-6xl sm:text-7xl lg:text-8xl font-black text-[#111827] font-mono tracking-tight select-none">
            {formatTime(session.remainingSeconds)}
          </span>
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-widest font-mono">
            Focus Countdown Active
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 max-w-lg mx-auto">
          <div className="flex items-center justify-between text-xs font-medium text-[#6B7280]">
            <span>Session Progress</span>
            <span className="font-semibold text-[#111827]">{progressPercent}% Complete</span>
          </div>

          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Target Study Subject Quick Action */}
        <div className="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase">
              Target Learning Module
            </span>
            <h4 className="text-sm font-bold text-[#111827]">{session.subjectName}</h4>
          </div>

          <Link
            href={session.subjectHref}
            className="px-4 py-2 rounded-xl bg-[#111827] hover:bg-black text-white text-xs font-bold shadow-xs transition-colors inline-flex items-center justify-center gap-1.5 shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Study Arena</span>
            <ExternalLink className="w-3.5 h-3.5 text-white" />
          </Link>
        </div>

        {/* Ambient Sound Toggles & Emergency Controls */}
        <div className="pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
          
          {/* Ambient Sounds */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#6B7280] flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-[#111827]" />
              Ambient:
            </span>

            <button
              type="button"
              onClick={() => toggleSound("rain")}
              className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                ambientSound === "rain"
                  ? "bg-[#111827] text-white border-[#111827]"
                  : "bg-[#F7F8FA] text-[#111827] border-[#E5E7EB] hover:bg-gray-100"
              }`}
            >
              🌧️ Rain
            </button>

            <button
              type="button"
              onClick={() => toggleSound("whitenoise")}
              className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                ambientSound === "whitenoise"
                  ? "bg-[#111827] text-white border-[#111827]"
                  : "bg-[#F7F8FA] text-[#111827] border-[#E5E7EB] hover:bg-gray-100"
              }`}
            >
              📻 White Noise
            </button>

            {ambientSound !== "off" && (
              <button
                type="button"
                onClick={stopAmbientSound}
                className="p-1 rounded-md text-[#6B7280] hover:text-rose-600"
                title="Mute Ambient"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Emergency Unlock Trigger */}
          <button
            type="button"
            onClick={onTriggerEmergencyUnlock}
            className="text-xs font-medium text-[#6B7280] hover:text-rose-600 underline cursor-pointer"
          >
            Emergency Early Unlock
          </button>
        </div>

      </div>

      {/* 2. ACTIVE RESTRICTIONS CAPSULE */}
      <div className="p-5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-rose-600" />
            Restricted Social Media &amp; Games ({blockedNames.length})
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold">Shield Active</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {blockedNames.map((name) => (
            <span
              key={name}
              className="px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
              <span>{name}</span>
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
