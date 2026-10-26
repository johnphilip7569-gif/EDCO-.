"use client";

import React from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Clock,
  Flame,
  Award
} from "lucide-react";

interface SpeakingHabitsProps {
  metricsHistory?: Array<{
    interviewId: string;
    date: string;
    languageScore: number;
    clarityScore: number;
    fillerCount: number;
    wpm: number;
  }>;
  profileSummary?: {
    languageScore: number;
    grammarScore: number;
    clarityScore: number;
    fluencyScore: number;
    vocabularyScore: number;
    professionalScore: number;
    totalInterviews: number;
    averageWpm: number;
    topFillers: string[];
    strengths: string[];
    recommendedFocus: string[];
  };
}

export default function SpeakingHabitsTracker({
  metricsHistory = [],
  profileSummary
}: SpeakingHabitsProps) {
  const hasData = metricsHistory.length > 0 || !!profileSummary;

  if (!hasData) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-7 space-y-4 text-[#111827] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-[#2563EB]" />
            <span>Cross-Interview Communication Tracker</span>
          </span>
        </div>
        <h2 className="text-xl font-bold text-[#111827]">Spoken English &amp; Communication Habits</h2>
        <p className="text-xs text-[#6B7280] leading-relaxed max-w-2xl">
          Real speech telemetry tracked across your mock interviews to eliminate recurring filler words, optimize speaking pace (WPM), and master concise STAR structure.
        </p>

        <div className="p-6 rounded-xl bg-[#F7F8FA] border border-dashed border-[#E5E7EB] text-center space-y-2">
          <MessageSquare className="w-8 h-8 text-[#6B7280] mx-auto" />
          <p className="text-xs font-bold text-[#111827]">No Interview Audio Sessions Recorded Yet</p>
          <p className="text-[11px] text-[#6B7280] max-w-md mx-auto">
            Complete your first live mock interview drill to unlock personalized speech cadence, filler word reduction charts, and language recommendations.
          </p>
        </div>
      </div>
    );
  }

  const history = metricsHistory;
  const currentScore = profileSummary?.languageScore || (history.length > 0 ? history[history.length - 1].languageScore : 0);
  const currentFillers = profileSummary?.topFillers || [];

  const fillerDelta = history.length >= 2 
    ? Math.round(((history[0].fillerCount - history[history.length - 1].fillerCount) / Math.max(1, history[0].fillerCount)) * 100)
    : null;

  const clarityDelta = history.length >= 2
    ? history[history.length - 1].clarityScore - history[0].clarityScore
    : null;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-7 space-y-6 text-[#111827] shadow-xs">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[#2563EB]" />
              <span>Cross-Interview Communication Tracker</span>
            </span>
            <span className="text-xs text-[#6B7280] font-medium">
              {profileSummary?.totalInterviews || history.length} Interviews Analyzed
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#111827]">Spoken English &amp; Communication Habits</h2>
          <p className="text-xs text-[#6B7280]">
            Real speech telemetry tracked across your mock interviews to eliminate recurring filler words and master concise structure.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F7F8FA] px-4 py-2 rounded-xl border border-[#E5E7EB]">
          <span className="text-[11px] font-medium text-[#6B7280]">Comm Score:</span>
          <span className="text-xl font-bold text-[#2563EB]">{currentScore}/100</span>
        </div>
      </div>

      {/* 3 Key Longitudinal Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* 1. Filler Words Reduction Progression */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Filler Words Trend</span>
            {fillerDelta !== null && (
              <span className={`text-xs font-semibold flex items-center gap-1 ${fillerDelta >= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                {fillerDelta >= 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                {fillerDelta >= 0 ? `-${fillerDelta}% Reduction` : `+${Math.abs(fillerDelta)}%`}
              </span>
            )}
          </div>

          <div className="space-y-2 pt-1">
            {history.map((h, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">{h.date}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#2563EB] h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (h.fillerCount / 20) * 100)}%` }}
                    />
                  </div>
                  <span className="font-semibold text-[#111827] w-6 text-right">{h.fillerCount}</span>
                </div>
              </div>
            ))}
          </div>

          {currentFillers.length > 0 && (
            <div className="text-[11px] text-[#6B7280] border-t border-[#E5E7EB] pt-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#2563EB] shrink-0" />
              <span>Top detected filler: <strong className="text-[#111827]">&ldquo;{currentFillers[0]}&rdquo;</strong></span>
            </div>
          )}
        </div>

        {/* 2. Clarity & Structure Score Trajectory */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Clarity &amp; STAR Growth</span>
            {clarityDelta !== null && (
              <span className={`text-xs font-semibold flex items-center gap-1 ${clarityDelta >= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                <TrendingUp className="w-3.5 h-3.5" />
                {clarityDelta >= 0 ? `+${clarityDelta} pts` : `${clarityDelta} pts`}
              </span>
            )}
          </div>

          <div className="space-y-2 pt-1">
            {history.map((h, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">{h.date}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{ width: `${h.clarityScore}%` }}
                    />
                  </div>
                  <span className="font-semibold text-[#111827] w-6 text-right">{h.clarityScore}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-[#6B7280] border-t border-[#E5E7EB] pt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Clarity evaluated against concise STAR framework structure</span>
          </div>
        </div>

        {/* 3. Speaking Cadence / WPM Calibration */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Speaking Cadence</span>
            <span className="text-xs font-semibold text-[#2563EB] flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" />
              {profileSummary?.averageWpm ? `${profileSummary.averageWpm} WPM Avg` : "Real Pace"}
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {history.map((h, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">{h.date}</span>
                <span className="font-semibold text-[#111827]">{h.wpm} WPM</span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-[#6B7280] border-t border-[#E5E7EB] pt-2 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#2563EB] shrink-0" />
            <span>Target range: 120–150 words per minute</span>
          </div>
        </div>

      </div>

      {/* Persistent Focus & Strengths Row */}
      {(profileSummary?.strengths?.length || profileSummary?.recommendedFocus?.length) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {profileSummary?.strengths && profileSummary.strengths.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 space-y-1 text-xs">
              <span className="font-semibold text-emerald-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Confirmed Speaking Strengths</span>
              </span>
              <p className="text-emerald-900 font-medium">
                {profileSummary.strengths.join(" • ")}
              </p>
            </div>
          )}

          {profileSummary?.recommendedFocus && profileSummary.recommendedFocus.length > 0 && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/80 space-y-1 text-xs">
              <span className="font-semibold text-[#2563EB] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Next Communication Focus</span>
              </span>
              <p className="text-[#111827] font-medium">
                {profileSummary.recommendedFocus.join(" • ")}
              </p>
            </div>
          )}
        </div>
      ) : null}

    </div>
  );
}
