"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Mic, 
  Radio, 
  Brain, 
  CheckCircle2
} from "lucide-react";
import { VOICE_PROFILES, VoiceChoice } from "@/lib/interview/voice-profiles";

export type MyraState = "idle" | "speaking" | "listening" | "thinking" | "feedback";
export type TeddyState = MyraState;

interface MyraInterviewerAvatarProps {
  state: MyraState;
  questionText?: string;
  isAudioMuted?: boolean;
  voiceChoice?: VoiceChoice;
  speakingSpeed?: number;
  onToggleMute?: () => void;
  onSpeechEnd?: () => void;
}

export default function MyraInterviewerAvatar({
  state,
  questionText = "",
  isAudioMuted = false,
  voiceChoice = "myra-neutral",
  speakingSpeed = 1.0,
  onToggleMute,
  onSpeechEnd,
}: MyraInterviewerAvatarProps) {
  const [speechActive, setSpeechActive] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Text-To-Speech triggered when Myra speaks
  useEffect(() => {
    if (!synthRef.current) return;

    if (state === "speaking" && questionText && !isAudioMuted) {
      synthRef.current.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(questionText);
      const profile = VOICE_PROFILES[voiceChoice] || VOICE_PROFILES["myra-neutral"];
      
      utterance.rate = Math.round((profile.defaultRate * speakingSpeed) * 100) / 100;
      utterance.pitch = profile.defaultPitch;

      // Select matching voice
      const voices = synthRef.current.getVoices();
      const matchedVoice = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          profile.voiceHints.some((hint) => v.name.toLowerCase().includes(hint.toLowerCase()))
      );
      if (matchedVoice) utterance.voice = matchedVoice;

      utterance.onstart = () => setSpeechActive(true);
      utterance.onend = () => {
        setSpeechActive(false);
        onSpeechEnd?.();
      };
      utterance.onerror = () => {
        setSpeechActive(false);
        onSpeechEnd?.();
      };

      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    } else {
      if (synthRef.current) synthRef.current.cancel();
      setSpeechActive(false);
    }

    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [state, questionText, isAudioMuted, voiceChoice, speakingSpeed, onSpeechEnd]);

  // Status Badge Configuration adhering to Feature 27 Black/White system
  const getStatusBadge = () => {
    switch (state) {
      case "speaking":
        return {
          label: "Speaking Question",
          color: "bg-black text-white border-black",
          icon: Radio,
          dotColor: "bg-white animate-ping",
        };
      case "listening":
        return {
          label: "Listening to You...",
          color: "bg-neutral-100 text-black border-neutral-300",
          icon: Mic,
          dotColor: "bg-black animate-pulse",
        };
      case "thinking":
        return {
          label: "Analyzing Response...",
          color: "bg-neutral-100 text-black border-neutral-300",
          icon: Brain,
          dotColor: "bg-neutral-500 animate-pulse",
        };
      case "feedback":
        return {
          label: "Processing Feedback",
          color: "bg-neutral-100 text-black border-neutral-300",
          icon: Sparkles,
          dotColor: "bg-black",
        };
      case "idle":
      default:
        return {
          label: "Ready",
          color: "bg-white text-neutral-800 border-neutral-200",
          icon: Sparkles,
          dotColor: "bg-neutral-400",
        };
    }
  };

  const badge = getStatusBadge();
  const IconComponent = badge.icon;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-5 sm:p-6 bg-white border border-neutral-200 rounded-3xl shadow-sm text-black select-none">
      
      {/* Top Header: Badge + Audio Mute Controls */}
      <div className="w-full flex items-center justify-between z-10">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${badge.color}`}>
          <span className={`w-2 h-2 rounded-full ${badge.dotColor}`} />
          <IconComponent className="w-3.5 h-3.5" />
          <span>{badge.label}</span>
        </div>

        {onToggleMute && (
          <button
            type="button"
            onClick={onToggleMute}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isAudioMuted
                ? "bg-neutral-100 border-neutral-300 text-neutral-600 hover:bg-neutral-200"
                : "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50"
            }`}
            title={isAudioMuted ? "Unmute Myra Voice" : "Mute Myra Voice"}
            aria-label={isAudioMuted ? "Unmute Myra Voice" : "Mute Myra Voice"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Center Avatar View with Monochrome Pulse Waveform */}
      <div className="relative flex flex-col items-center justify-center my-auto z-10">
        
        {/* Subtle breathing ring during speech */}
        {state === "speaking" && (
          <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-3xl border-2 border-black/20 animate-ping pointer-events-none" />
        )}

        {/* Avatar Image Frame */}
        <div
          className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 transition-all duration-300 shadow-md bg-neutral-100 ${
            state === "speaking"
              ? "border-black scale-105"
              : state === "listening"
              ? "border-neutral-400 scale-100"
              : "border-neutral-200"
          }`}
        >
          <Image
            src="/images/myra-avatar.png"
            alt="Myra, AI interviewer"
            fill
            priority
            className="object-cover object-top"
          />

          {/* Monochrome Waveform when speaking */}
          {state === "speaking" && (
            <div className="absolute bottom-0 inset-x-0 h-9 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-2 gap-1 px-4">
              <span className="w-1 bg-white rounded-full h-3 animate-[bounce_0.6s_infinite_100ms]" />
              <span className="w-1 bg-white rounded-full h-5 animate-[bounce_0.6s_infinite_200ms]" />
              <span className="w-1 bg-white rounded-full h-3.5 animate-[bounce_0.6s_infinite_300ms]" />
              <span className="w-1 bg-white rounded-full h-6 animate-[bounce_0.6s_infinite_150ms]" />
              <span className="w-1 bg-white rounded-full h-4 animate-[bounce_0.6s_infinite_250ms]" />
            </div>
          )}
        </div>

        {/* Permanent Required Transparent AI Identity Label */}
        <div className="mt-3.5 flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full text-xs font-bold text-neutral-800 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-black" />
          <span>Myra, AI interviewer</span>
        </div>
      </div>

      {/* Bottom Context Hint */}
      <div className="w-full text-center z-10 pt-2 border-t border-neutral-100">
        <p className="text-[11px] text-neutral-500 font-medium tracking-wide">
          {state === "speaking"
            ? "Listen carefully to Myra's spoken question."
            : state === "listening"
            ? "Microphone open — speak aloud. Live transcript will appear."
            : state === "thinking"
            ? "Evaluating your answer and preparing next turn..."
            : "Live voice interview session active."}
        </p>
      </div>

    </div>
  );
}
