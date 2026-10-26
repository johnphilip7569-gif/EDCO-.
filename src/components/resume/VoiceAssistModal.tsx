"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Check, 
  X, 
  RotateCcw, 
  Volume2, 
  Square,
  Sparkles,
  Edit3
} from "lucide-react";

interface VoiceDictationModalProps {
  isOpen: boolean;
  fieldLabel: string;
  initialText?: string;
  onApply: (text: string) => void;
  onClose: () => void;
}

export function VoiceDictationModal({
  isOpen,
  fieldLabel,
  initialText = "",
  onApply,
  onClose,
}: VoiceDictationModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(initialText);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      stopRecording();
      return;
    }
    setTranscript(initialText);

    // Initialize Web Speech API
    if (typeof window !== "undefined") {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        const recog = new SpeechRec();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = "en-US";

        recog.onresult = (event: any) => {
          let full = "";
          for (let i = 0; i < event.results.length; i++) {
            full += event.results[i][0].transcript + " ";
          }
          setTranscript(full.trim());
        };

        recog.onerror = (err: any) => {
          console.warn("[Dictation Recognition Error]:", err?.error);
        };

        recognitionRef.current = recog;
      } else {
        setSpeechSupported(false);
      }
    }

    return () => {
      stopRecording();
    };
  }, [isOpen, initialText]);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (e) {
      console.warn("Recog start note:", e);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsRecording(false);
  };

  const handleApply = () => {
    stopRecording();
    onApply(transcript.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-lg w-full p-6 space-y-4 text-black">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-black">Voice Dictation &bull; {fieldLabel}</h3>
              <p className="text-[10px] text-neutral-500">Dictate aloud, review your text, and confirm before saving.</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-black cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recording Controls */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? "bg-red-500 animate-ping" : "bg-neutral-300"}`} />
            <span className="text-xs font-bold text-neutral-800">
              {isRecording ? "Listening to your voice..." : "Microphone paused"}
            </span>
          </div>

          {isRecording ? (
            <button
              type="button"
              onClick={stopRecording}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Mic className="w-3 h-3" />
              <span>Start Dictating</span>
            </button>
          )}
        </div>

        {/* Editable Transcript Area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600">
            <span className="flex items-center gap-1">
              <Edit3 className="w-3 h-3 text-black" />
              <span>Review &amp; Edit Text:</span>
            </span>
            <span className="font-mono text-neutral-500">
              {transcript.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            rows={5}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Speak into your microphone... your dictated words will appear here for review."
            className="w-full p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-black focus:outline-none focus:ring-1 focus:ring-black leading-relaxed"
          />
        </div>

        {/* Safety Note */}
        <p className="text-[11px] text-neutral-500">
          Nothing is saved to your resume until you click <strong>Review &amp; Insert</strong> below.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:text-black transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!transcript.trim()}
            className="px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-40 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Review &amp; Insert</span>
          </button>
        </div>

      </div>
    </div>
  );
}

/**
 * Text-To-Speech Read-Aloud Helper Hook
 */
export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const speak = (text: string, onEnd?: () => void) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = synthRef.current.getVoices();
    const matched = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha"))
    );
    if (matched) utterance.voice = matched;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      onEnd?.();
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      onEnd?.();
    };

    synthRef.current.speak(utterance);
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
  };

  return { isPlaying, speak, stop };
}
