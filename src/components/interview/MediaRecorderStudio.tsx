"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Play, 
  Square, 
  RotateCcw, 
  Send, 
  Sparkles,
  Volume2,
  VolumeX,
  AlertCircle,
  Clock,
  Radio,
  CheckCircle2,
  Check,
  Activity,
  ChevronRight,
  Keyboard,
  ArrowRight,
  ShieldCheck,
  Flame,
  HelpCircle
} from "lucide-react";
import MyraInterviewerAvatar, { MyraState } from "./MyraInterviewerAvatar";
import FullScreenLockdownModal from "./FullScreenLockdownModal";
import { VoiceChoice } from "@/lib/interview/voice-profiles";

interface MediaRecorderStudioProps {
  questionText: string;
  category: string;
  difficultyLevel: 0 | 1 | 2;
  suggestedDurationSeconds?: number;
  userId?: string;
  sessionId?: string;
  questionId?: string;
  currentQuestionIndex?: number;
  totalQuestions?: number;
  adaptiveFocus?: string;
  targetRole?: string;
  resumeContext?: string;
  voiceChoice?: VoiceChoice;
  speakingSpeed?: number;
  audioOptIn?: boolean;
  initialUseKeyboardFallback?: boolean;
  onSubmitSession: (sessionData: {
    audioBase64?: string;
    videoUrl?: string;
    transcript: string;
    durationSeconds: number;
    isAudioOnly?: boolean;
    voiceOptIn?: boolean;
    fullscreenExitEvents?: Array<{ timestamp: string; questionIndex: number }>;
  }) => Promise<void>;
}

export default function MediaRecorderStudio({
  questionText,
  category,
  difficultyLevel,
  suggestedDurationSeconds = 120,
  userId = "user",
  sessionId = "session",
  questionId = "q",
  currentQuestionIndex = 1,
  totalQuestions = 3,
  adaptiveFocus,
  targetRole = "Software Engineer",
  resumeContext = "",
  voiceChoice = "myra-neutral",
  speakingSpeed = 1.0,
  audioOptIn = false,
  initialUseKeyboardFallback = false,
  onSubmitSession,
}: MediaRecorderStudioProps) {
  // Media streams & modes
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [useKeyboardMode, setUseKeyboardMode] = useState(initialUseKeyboardFallback);

  // Active question & follow-up state
  const [activePromptText, setActivePromptText] = useState(questionText);
  const [isFollowUpRound, setIsFollowUpRound] = useState(false);
  const [followUpReference, setFollowUpReference] = useState<string | null>(null);

  // Continuous Live Voice Loop State
  const [recordingState, setRecordingState] = useState<"idle" | "speaking_question" | "recording" | "evaluating_turn" | "submitting">("idle");
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [silenceCountdown, setSilenceCountdown] = useState<number | null>(null);

  // Myra Voice Avatar State
  const [isMyraVoiceMuted, setIsMyraVoiceMuted] = useState(false);
  const [isMyraSpeaking, setIsMyraSpeaking] = useState(false);
  const [bargeInDetected, setBargeInDetected] = useState(false);

  // Fullscreen Lockdown State
  const [isLockdownActive, setIsLockdownActive] = useState(true);
  const [fullscreenExitEvents, setFullscreenExitEvents] = useState<Array<{ timestamp: string; questionIndex: number }>>([]);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const lastSpokenTimestampRef = useRef<number>(Date.now());
  const activePromptRef = useRef<string>(questionText);

  // Keep activePromptRef in sync
  useEffect(() => {
    activePromptRef.current = activePromptText;
  }, [activePromptText]);

  // Update prompt whenever incoming base question changes
  useEffect(() => {
    setActivePromptText(questionText);
    setIsFollowUpRound(false);
    setFollowUpReference(null);
    setLiveTranscript("");
    setSecondsElapsed(0);
    // Begin vocalizing new question
    triggerQuestionSpeech(questionText);
  }, [questionText]);

  // 1. Initialize Camera & Mic
  useEffect(() => {
    if (useKeyboardMode) return;

    async function startMedia() {
      try {
        const userMedia = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(userMedia);
        setIsAudioOnly(false);
        if (videoRef.current) videoRef.current.srcObject = userMedia;
      } catch (err) {
        try {
          const audioMedia = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
          setStream(audioMedia);
          setIsAudioOnly(true);
        } catch (e) {
          console.warn("[Media Permissions Note]:", e);
          setUseKeyboardMode(true);
        }
      }
    }
    startMedia();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (silenceTimerRef.current) clearInterval(silenceTimerRef.current);
    };
  }, [useKeyboardMode]);

  // 2. Setup Web Speech Recognition
  useEffect(() => {
    if (useKeyboardMode) return;

    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = "en-US";

        recog.onresult = (event: any) => {
          let fullText = "";
          for (let i = 0; i < event.results.length; i++) {
            fullText += event.results[i][0].transcript + " ";
          }
          const trimmed = fullText.trim();
          setLiveTranscript(trimmed);
          lastSpokenTimestampRef.current = Date.now();

          // BARGE-IN: If user speaks while Myra is speaking, halt Myra immediately
          if (isMyraSpeaking) {
            handleBargeIn();
          }

          // Reset silence detection
          resetSilenceDetection();
        };

        recog.onerror = (err: any) => {
          console.warn("[Speech Recognition Event Note]:", err?.error);
        };

        recog.onend = () => {
          if (recordingState === "recording" && !useKeyboardMode) {
            try { recog.start(); } catch (e) {}
          }
        };

        recognitionRef.current = recog;
      } else {
        console.warn("[Web Speech Not Supported - Switching to Typed Mode]");
        setUseKeyboardMode(true);
      }
    }
  }, [isMyraSpeaking, recordingState, useKeyboardMode]);

  // 3. Trigger Question Speech by Myra
  const triggerQuestionSpeech = (promptToSpeak: string) => {
    setIsMyraSpeaking(true);
    setRecordingState("speaking_question");
    setSilenceCountdown(null);

    // Cancel any previous Web Speech recognition during Myra prompt
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
  };

  // 4. Handle Barge-In: Candidate speaks over Myra
  const handleBargeIn = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsMyraSpeaking(false);
    setBargeInDetected(true);
    if (recordingState !== "recording") {
      startListeningToCandidate();
    }
    setTimeout(() => setBargeInDetected(false), 2000);
  };

  // 5. Speech Finished -> Open Mic & Start Listening
  const handleMyraSpeechEnd = () => {
    setIsMyraSpeaking(false);
    startListeningToCandidate();
  };

  const startListeningToCandidate = () => {
    setRecordingState("recording");
    lastSpokenTimestampRef.current = Date.now();

    // Start Web Speech Recognition
    if (recognitionRef.current && !useKeyboardMode) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }

    // Start Timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    // Reset silence timer
    resetSilenceDetection();
  };

  // 6. Silence Detection Timer (~2.5s of silence after speech)
  const resetSilenceDetection = useCallback(() => {
    if (silenceTimerRef.current) clearInterval(silenceTimerRef.current);
    setSilenceCountdown(null);

    // Only activate silence countdown if candidate has spoken at least 5 words
    silenceTimerRef.current = setInterval(() => {
      const elapsedSinceSpoken = Date.now() - lastSpokenTimestampRef.current;
      const wordCount = liveTranscript.trim().split(/\s+/).filter(Boolean).length;

      if (wordCount >= 5 && elapsedSinceSpoken >= 1800) {
        // Show 1-second countdown
        setSilenceCountdown(1);
        if (elapsedSinceSpoken >= 2800) {
          clearInterval(silenceTimerRef.current!);
          setSilenceCountdown(null);
          handleFinishAnswer();
        }
      }
    }, 500);
  }, [liveTranscript]);

  // 7. Candidate Finishes Answer (Automatic Silence or Manual Click)
  const handleFinishAnswer = async () => {
    if (silenceTimerRef.current) clearInterval(silenceTimerRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    setRecordingState("evaluating_turn");

    const answerText = liveTranscript.trim() || "I have completed my response for this question.";

    // Autosave transcript state
    try {
      const savedSession = JSON.parse(localStorage.getItem(`edworld_active_session_${userId}`) || "{}");
      savedSession[currentQuestionIndex] = answerText;
      localStorage.setItem(`edworld_active_session_${userId}`, JSON.stringify(savedSession));
    } catch (e) {}

    try {
      // Call interactive turn handler
      const res = await fetch("/api/interview/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: activePromptRef.current,
          candidateTranscript: answerText,
          isFollowUp: isFollowUpRound,
          questionIndex: currentQuestionIndex,
          totalQuestions,
          targetRole,
          category,
          resumeContext,
          userId,
          sessionId,
        }),
      });

      const data = await res.json();

      if (data.action === "repeat") {
        // Re-speak current question
        triggerQuestionSpeech(activePromptRef.current);
        return;
      }

      if (data.action === "follow_up" && data.followUpQuestion && !isFollowUpRound) {
        // One grounded follow-up from Myra
        setIsFollowUpRound(true);
        setFollowUpReference(data.referencedPhrase || null);
        setActivePromptText(data.followUpQuestion);
        setLiveTranscript("");
        triggerQuestionSpeech(data.followUpQuestion);
        return;
      }

      // Action is "next" or follow-up is complete -> Submit turn
      await submitCurrentQuestion(answerText);
    } catch (turnErr) {
      console.warn("[Turn Evaluation Fallback]:", turnErr);
      await submitCurrentQuestion(answerText);
    }
  };

  const submitCurrentQuestion = async (finalTranscript: string) => {
    setRecordingState("submitting");
    await onSubmitSession({
      transcript: finalTranscript,
      durationSeconds: Math.max(15, secondsElapsed),
      isAudioOnly,
      voiceOptIn: audioOptIn,
      fullscreenExitEvents,
    });
  };

  // Derive Myra State for Avatar
  const getMyraState = (): MyraState => {
    if (recordingState === "submitting" || recordingState === "evaluating_turn") return "thinking";
    if (recordingState === "recording") return "listening";
    if (isMyraSpeaking || recordingState === "speaking_question") return "speaking";
    return "idle";
  };

  const currentWordCount = liveTranscript.trim().split(/\s+/).filter(Boolean).length;
  const currentPaceWpm = secondsElapsed > 0 ? Math.round((currentWordCount / secondsElapsed) * 60) : 0;

  return (
    <div className="relative bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-sm text-black select-none font-sans">
      
      {/* Fullscreen Lockdown Controller */}
      <FullScreenLockdownModal
        isActive={isLockdownActive}
        onExitConfirmed={() => {
          setIsLockdownActive(false);
          window.location.href = "/interviews";
        }}
        onWarningTriggered={(count, reason) => {
          setFullscreenExitEvents((prev) => [
            ...prev,
            { timestamp: new Date().toISOString(), questionIndex: currentQuestionIndex },
          ]);
        }}
      />

      {/* Top Header & Telemetry Bar (Feature 27 Monochrome) */}
      <div className="p-4 sm:p-5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-black text-white">
            Question {currentQuestionIndex} of {totalQuestions}
          </span>
          {isFollowUpRound && (
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-200 text-black border border-neutral-300 flex items-center gap-1.5 animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Grounded Follow-Up {followUpReference ? `("${followUpReference}")` : ""}</span>
            </span>
          )}
          {bargeInDetected && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-200 text-black border border-neutral-300 animate-pulse">
              Barge-in detected: Myra paused
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="text-xs font-mono font-bold bg-white px-3 py-1.5 rounded-xl border border-neutral-200 flex items-center gap-1.5 text-black">
            <Clock className="w-3.5 h-3.5 text-black" />
            <span>
              {recordingState === "recording" ? `${secondsElapsed}s / ${suggestedDurationSeconds}s` : `${suggestedDurationSeconds}s Target`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => triggerQuestionSpeech(activePromptText)}
            disabled={isMyraSpeaking || recordingState === "evaluating_turn"}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-all text-neutral-800 disabled:opacity-40 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-black" />
            <span>Repeat Question</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Panel Grid: Myra Avatar (Left) + Candidate Video/Mic (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 sm:p-6 items-stretch">
        
        {/* LEFT PANEL: Myra AI Lead Interviewer */}
        <div className="lg:col-span-5 min-h-[380px] sm:min-h-[460px]">
          <MyraInterviewerAvatar
            state={getMyraState()}
            questionText={activePromptText}
            isAudioMuted={isMyraVoiceMuted}
            voiceChoice={voiceChoice}
            speakingSpeed={speakingSpeed}
            onToggleMute={() => setIsMyraVoiceMuted(!isMyraVoiceMuted)}
            onSpeechEnd={handleMyraSpeechEnd}
          />
        </div>

        {/* RIGHT PANEL: Candidate Live Speech & Video Workspace */}
        <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[460px] bg-neutral-50 rounded-3xl overflow-hidden border border-neutral-200 flex flex-col justify-between p-4 sm:p-5 shadow-xs">
          
          {/* Candidate Stream or Audio Placeholder */}
          {!useKeyboardMode && !isAudioOnly && stream ? (
            <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-900 shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${recordingState === "recording" ? "bg-red-500 animate-ping" : "bg-neutral-400"}`} />
                <span>{recordingState === "recording" ? "Live Recording" : "Camera Ready"}</span>
              </div>
            </div>
          ) : !useKeyboardMode ? (
            <div className="p-4 rounded-2xl bg-white border border-neutral-200 text-center space-y-2">
              <Mic className="w-8 h-8 text-black mx-auto animate-pulse" />
              <div className="text-xs font-bold text-black">Microphone Active &bull; Audio-Only Mode</div>
              <p className="text-[11px] text-neutral-500">Speak clearly into your microphone when answering.</p>
            </div>
          ) : null}

          {/* Prompt Banner */}
          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 space-y-1 mt-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block">
              {isFollowUpRound ? "Myra's Grounded Follow-Up" : "Current Question"}
            </span>
            <p className="text-xs sm:text-sm font-bold text-black leading-snug">
              {activePromptText}
            </p>
          </div>

          {/* KEYBOARD / TYPED MODE FALLBACK */}
          {useKeyboardMode ? (
            <div className="space-y-3 mt-3">
              <div className="flex items-center justify-between text-xs font-bold text-black">
                <span className="flex items-center gap-1.5">
                  <Keyboard className="w-4 h-4 text-black" />
                  <span>Type Your Response:</span>
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  {currentWordCount} words
                </span>
              </div>
              <textarea
                rows={5}
                value={liveTranscript}
                onChange={(e) => setLiveTranscript(e.target.value)}
                placeholder="Type your answer using the STAR method (Situation, Task, Action, Result)..."
                className="w-full p-3 rounded-2xl bg-white border border-neutral-200 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>
          ) : (
            /* LIVE SPEECH-TO-TEXT STREAM */
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600">
                <span className="flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-black" />
                  <span>Live Speech-to-Text:</span>
                </span>
                {recordingState === "recording" && (
                  <span className="font-mono text-black">
                    {currentWordCount} words &bull; ~{currentPaceWpm} WPM
                  </span>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 min-h-[90px] max-h-36 overflow-y-auto">
                <p className="text-xs text-neutral-800 leading-relaxed italic">
                  {liveTranscript || (
                    <span className="text-neutral-400 not-italic">
                      {recordingState === "recording"
                        ? "Listening... speak your response aloud."
                        : isMyraSpeaking
                        ? "Listen to Myra's question above."
                        : "Ready to answer."}
                    </span>
                  )}
                </p>
              </div>

              {/* Silence Detection Countdown Indicator */}
              {silenceCountdown !== null && (
                <div className="p-2 rounded-xl bg-neutral-100 border border-neutral-300 text-[11px] font-bold text-neutral-800 text-center animate-pulse">
                  Silence detected &bull; Advancing in {silenceCountdown}s... (or click &ldquo;I'm Done&rdquo; below)
                </div>
              )}
            </div>
          )}

          {/* Action Button Controls */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between flex-wrap gap-2 mt-3">
            {!useKeyboardMode && (
              <button
                type="button"
                onClick={() => setUseKeyboardMode(true)}
                className="text-[11px] font-bold text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                Switch to Typing
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => submitCurrentQuestion(liveTranscript || "[Skipped question]")}
                disabled={recordingState === "submitting" || recordingState === "evaluating_turn"}
                className="px-3.5 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:text-black text-xs font-bold transition-all cursor-pointer"
              >
                Skip Question
              </button>

              <button
                type="button"
                onClick={handleFinishAnswer}
                disabled={recordingState === "submitting" || recordingState === "evaluating_turn" || isMyraSpeaking}
                className="px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {recordingState === "evaluating_turn" ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Myra is evaluating...</span>
                  </>
                ) : (
                  <>
                    <span>I'm Done Answering</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
