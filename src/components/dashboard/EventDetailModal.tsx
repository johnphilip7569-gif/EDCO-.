"use client";

import React, { useEffect } from "react";
import { 
  X, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Trophy, 
  Users, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Heart,
  Share2
} from "lucide-react";
import { EventRecord } from "@/app/api/events/route";

interface EventDetailModalProps {
  event: EventRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleSave?: (eventId: string) => void;
}

export default function EventDetailModal({
  event,
  isOpen,
  onClose,
  onToggleSave
}: EventDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const deadlineDate = event.registration_deadline ? new Date(event.registration_deadline) : null;
  const daysLeft = deadlineDate 
    ? Math.max(0, Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Poster Banner */}
        <div className={`p-6 sm:p-8 bg-gradient-to-br ${event.banner_style?.bgGradient || "from-neutral-900 to-black"} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs">
                {event.category}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs">
                {event.mode}
              </span>
              {daysLeft !== null && (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-black/40 text-neutral-200">
                  {daysLeft > 0 ? `${daysLeft} Days Left` : "Closing Soon"}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
              {event.title}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 font-medium">
              Organized by <strong className="text-white">{event.organizer}</strong>
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-black">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono block">
                Prize Pool
              </span>
              <span className="text-sm font-extrabold text-black font-mono mt-0.5 block">
                {event.prize_pool}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono block">
                Participation
              </span>
              <span className="text-sm font-extrabold text-black font-mono mt-0.5 block">
                {event.is_free ? "Free Entry" : "Standard"}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono block">
                Team Size
              </span>
              <span className="text-sm font-extrabold text-black font-mono mt-0.5 block">
                {event.team_size}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono block">
                Status
              </span>
              <span className="text-sm font-extrabold text-black font-mono mt-0.5 block">
                {event.registration_status}
              </span>
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
              About The Competition
            </h3>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Eligibility */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
              Eligibility &amp; Target Cohort
            </h3>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {event.eligibility}
            </p>
          </div>

          {/* Key Skills & Focus Areas */}
          {event.skills && event.skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Skills &amp; Domains Tested
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {event.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-neutral-100 border border-neutral-200 text-neutral-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(event.id)}
                className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-medium ${
                  event.is_saved
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-neutral-300 hover:border-black"
                }`}
              >
                <Heart className={`w-4 h-4 ${event.is_saved ? "fill-current" : ""}`} />
                <span>{event.is_saved ? "Saved" : "Save Event"}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 text-black text-xs font-semibold hover:bg-neutral-100 transition-all"
            >
              Close
            </button>
            <a
              href={event.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Register Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
