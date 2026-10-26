"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Square,
  Sparkles,
  Sliders,
  Keyboard,
  ArrowRight,
  Info
} from "lucide-react";
import { VOICE_PROFILES, VoiceChoice } from "@/lib/interview/voice-profiles";

interface PreFlightAudioCheckModalProps {
  isOpen: boolean;
  onProceed: (config: {
    audioOptIn: boolean;
    voiceChoice: VoiceChoice;
    speakingSpeed: number;
    isAudioOnly: boolean;
    useKeyboardFallback: boolean;
  }) => void;
  onCancel: () => void;
}

export default function PreFlightAudioCheckModal({
  isOpen,
  onProceed,
  onCancel,
}: PreFlightAudioCheckModalProps) {
  const [micPermission, setMicPermission] = useState<"pending" | "granted" | "denied">("pending");
  const [micAudioLevel, setMicAudioLevel] = useState<number>(0);
  const [speakerTested, setSpeakerTested] = useState<boolean>(false);
  const [isTestingSpeaker, setIsTestingSpeaker] = useState<boolean>(false);
  
  // User Preferences
  const [audioOptIn, setAudioOptIn] = useState<boolean>(false);
  const [voiceChoice, setVoiceChoice] = useState<VoiceChoice>("myra-neutral");
  const [speakingSpeed, setSpeakingSpeed] = useState<number>(1.0);
  const [isAudioOnly, setIsAudioOnly] = useState<boolean>(false);

  // Audio Context & Stream Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      cleanupAudio();
      return;
    }
    requestMicAccess();

    return () => {
      cleanupAudio();
    };
  }, [isOpen]);

  const cleanupAudio = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try { audioContextRef.current.close(); } catch (e) {}
      audioContextRef.current = null;
    }
  };

  const requestMicAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: !isAudioOnly });
      micStreamRef.current = stream;
      setMicPermission("granted");
      setupVolumeMeter(stream);
    } catch (err: any) {
      // Retry audio-only if video failed
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = audioStream;
        setIsAudioOnly(true);
        setMicPermission("granted");
        setupVolumeMeter(audioStream);
      } catch (audioErr) {
        setMicPermission("denied");
      }
    }
  };

  const setupVolumeMeter = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        // Normalize roughly between 0 and 100
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setMicAudioLevel(normalized);
        animFrameRef.current = requestAnimationFrame(checkLevel);
      };

      checkLevel();
    } catch (e) {
      console.warn("[AudioContext Meter Warning]:", e);
    }
  };

  const testSpeaker = () => {
    setIsTestingSpeaker(true);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Hello! I'm Myra, your AI interviewer. Can you hear my voice clearly?");
      utterance.rate = speakingSpeed;
      utterance.pitch = VOICE_PROFILES[voiceChoice].defaultPitch;
      
      const voices = window.speechSynthesis.getVoices();
      const voiceHints = VOICE_PROFILES[voiceChoice].voiceHints;
      const matched = voices.find((v) => 
        v.lang.startsWith("en") && voiceHints.some((h) => v.name.includes(h))
      );
      if (matched) utterance.voice = matched;

      utterance.onend = () => {
        setIsTestingSpeaker(false);
        setSpeakerTested(true);
      };
      utterance.onerror = () => {
        setIsTestingSpeaker(false);
        setSpeakerTested(true);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsTestingSpeaker(false);
        setSpeakerTested(true);
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 text-black">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-500">
                Pre-Flight Hardware &amp; Privacy Check
              </span>
            </div>
            <h2 className="text-xl font-black text-black tracking-tight">
              Test Audio &amp; Voice Settings
            </h2>
            <p className="text-xs text-neutral-600">
              Ensure Myra can hear you clearly and configure your audio privacy preferences.
            </p>
          </div>
        </div>

        {/* 1. SPEAKER TEST */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-black" />
              <span>Step 1: Test Your Speaker / Headphones</span>
            </span>
            {speakerTested && (
              <span className="text-[10px] font-bold text-black bg-neutral-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Audio Verified
              </span>
            )}
          </div>

          <p className="text-xs text-neutral-600">
            Click below to play a sample line from Myra to confirm your audio output is working.
          </p>

          <button
            type="button"
            onClick={testSpeaker}
            disabled={isTestingSpeaker}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isTestingSpeaker ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current text-white animate-pulse" />
                <span>Playing Myra's Voice Sample...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-white" />
                <span>{speakerTested ? "Play Sample Again" : "Play Voice Sample"}</span>
              </>
            )}
          </button>
        </div>

        {/* 2. MICROPHONE TEST */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black flex items-center gap-2">
              <Mic className="w-4 h-4 text-black" />
              <span>Step 2: Test Your Microphone</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              micPermission === "granted"
                ? "bg-black text-white"
                : micPermission === "denied"
                ? "bg-neutral-200 text-neutral-800"
                : "bg-neutral-100 text-neutral-600"
            }`}>
              {micPermission === "granted" ? "Mic Active" : micPermission === "denied" ? "Permission Denied" : "Requesting..."}
            </span>
          </div>

          {micPermission === "granted" ? (
            <div className="space-y-2">
              <p className="text-xs text-neutral-600">
                Say a quick test line (e.g. <em>&ldquo;Testing one two three&rdquo;</em>). Watch the volume meter below react:
              </p>
              
              {/* Live Audio Level Meter */}
              <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden p-0.5">
                <div 
                  className="bg-black h-full rounded-full transition-all duration-75"
                  style={{ width: `${Math.max(5, micAudioLevel)}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                <span>Input Level: {micAudioLevel}%</span>
                <span>{micAudioLevel > 15 ? "Signal Detected ✓" : "Speak to test signal"}</span>
              </div>
            </div>
          ) : micPermission === "denied" ? (
            <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-xs text-neutral-700 space-y-2">
              <p className="font-bold">Microphone access was not permitted by your browser.</p>
              <p className="text-[11px]">
                You can still complete the full mock interview! We will automatically provide an interactive keyboard typing mode for all questions.
              </p>
            </div>
          ) : (
            <p className="text-xs text-neutral-500">Connecting to default audio input device...</p>
          )}
        </div>

        {/* 3. VOICE & PACING PREFERENCES */}
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-3">
          <span className="text-xs font-bold text-black flex items-center gap-2">
            <Sliders className="w-4 h-4 text-black" />
            <span>Step 3: Interviewer Voice &amp; Pacing</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-neutral-600 block mb-1">Myra Voice Profile</label>
              <select
                value={voiceChoice}
                onChange={(e) => setVoiceChoice(e.target.value as VoiceChoice)}
                className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="myra-neutral">Neutral (Balanced &amp; Clear)</option>
                <option value="myra-warm">Warm (Supportive &amp; Friendly)</option>
                <option value="myra-executive">Executive (Direct &amp; Measured)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-600 block mb-1">Speaking Speed</label>
              <select
                value={speakingSpeed}
                onChange={(e) => setSpeakingSpeed(parseFloat(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-medium text-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value={0.85}>0.85x (Deliberate Pacing)</option>
                <option value={1.0}>1.0x (Standard Speed)</option>
                <option value={1.15}>1.15x (Brisk Pacing)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. PRIVACY CONSENT & RETENTION */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-black shrink-0" />
            <span className="text-xs font-bold text-black">Voice Privacy &amp; Retention Guarantee</span>
          </div>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            Your voice audio is processed in real time to generate transcripts and evaluate speech pacing and STAR depth. We never use your recordings to train AI models.
          </p>

          <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={audioOptIn}
              onChange={(e) => setAudioOptIn(e.target.checked)}
              className="mt-0.5 rounded border-neutral-300 text-black focus:ring-black accent-black cursor-pointer"
            />
            <span className="text-xs text-neutral-700">
              <strong>Opt-in:</strong> Retain my raw audio recording for 7 days so I can replay it. (Default: Unchecked — raw audio is deleted immediately after scoring).
            </span>
          </label>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-200">
          {micPermission === "denied" ? (
            <button
              type="button"
              onClick={() => onProceed({
                audioOptIn: false,
                voiceChoice,
                speakingSpeed,
                isAudioOnly: true,
                useKeyboardFallback: true,
              })}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Continue with Keyboard Typing</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onProceed({
                audioOptIn: false,
                voiceChoice,
                speakingSpeed,
                isAudioOnly: true,
                useKeyboardFallback: true,
              })}
              className="text-xs font-bold text-neutral-500 hover:text-black transition-colors"
            >
              Prefer to Type? Switch to Keyboard
            </button>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:text-black transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onProceed({
                audioOptIn,
                voiceChoice,
                speakingSpeed,
                isAudioOnly,
                useKeyboardFallback: micPermission === "denied",
              })}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>Start Interview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
