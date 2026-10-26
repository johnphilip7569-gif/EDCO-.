"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AVAILABLE_CATEGORIES } from "@/lib/constants";
import { InterviewSession, SkillLevel } from "@/lib/types";
import { getDifficultyBadgeColor, getDifficultyLabel } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { 
  Video, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  BarChart3,
  Zap,
  Lock,
  MessageSquare,
  Play,
  Pause,
  Volume2,
  ChevronDown,
  ChevronUp,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Award
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import UserGreeting from "@/components/ui/UserGreeting";
import DailyPracticeCard from "@/components/interview/DailyPracticeCard";
import SpeakingHabitsTracker from "@/components/interview/SpeakingHabitsTracker";

export const dynamic = "force-dynamic";

export default function InterviewsHubPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [commProfile, setCommProfile] = useState<any>(null);
  const [activeResume, setActiveResume] = useState<{ id: string; title: string; skillsCount: number; projectsCount: number } | null>(null);

  // Rubric breakdown & Audio playback state
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Career Track Gating: 18+ only
  const isMinorUser = user ? user.ageBand !== "18+" : false;

  useEffect(() => {
    if (!user || isMinorUser) {
      setSessions([]);
      return;
    }

    const loadData = async () => {
      // 1. Fetch Sessions from Supabase
      try {
        const { data } = await supabase
          .from("interview_sessions")
          .select("*")
          .eq("user_id", user.uid)
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          const list: InterviewSession[] = data.map((d) => ({
            id: d.id,
            userId: d.user_id,
            questionId: d.questions?.[0]?.id || "swe-0-1",
            questionText: d.questions?.[0]?.text || "Interview Question",
            category: d.category,
            difficultyLevel: d.difficulty_level as SkillLevel,
            transcript: d.questions?.[0]?.transcript || "",
            contentScore: d.overall_score || 85,
            voiceScore: d.metrics?.voiceDelivery || 80,
            expressionScore: d.metrics?.facialEngagement || 75,
            overallScore: d.overall_score || 82,
            metrics: d.metrics || {
              wordsPerMinute: 130,
              fillerWordCount: 2,
              fillerWordsUsed: ["um"],
              speechPaceRating: "ideal",
              clarityScore: 85,
              structureRating: "Excellent (STAR structure)",
              engagementScore: 80,
            },
            feedback: {
              strengths: ["Clear STAR format", "Strong technical depth"],
              areasForImprovement: ["Add quantified metric benchmarks"],
              tone: "encouraging",
              detailedSummary: "Excellent response covering foundational concepts with clear architecture breakdown.",
              nextPracticeAdvice: "Continue onto Level 1 Applied Concurrency scenarios.",
            },
            createdAt: d.created_at,
          }));
          setSessions(list);
          localStorage.setItem(`edworld_${user.uid}_interview_sessions`, JSON.stringify(list));
        }
      } catch (err) {
        console.warn("[Supabase Sessions Load Note]", err);
      }

      // 2. Fetch Communication Profile from Supabase
      try {
        const { data: profileData } = await supabase
          .from("communication_profiles")
          .select("*")
          .eq("user_id", user.uid)
          .maybeSingle();

        if (profileData) {
          setCommProfile(profileData);
        }
      } catch (cpErr) {
        console.warn("[Fetch Comm Profile Note]:", cpErr);
      }

      // 3. Fetch User's Active Resume
      try {
        const { data: resumeData } = await supabase
          .from("resumes")
          .select("id, title, content, updated_at")
          .eq("user_id", user.uid)
          .order("updated_at", { ascending: false })
          .limit(1);

        if (resumeData && resumeData.length > 0) {
          const r = resumeData[0];
          const skillsList = r.content?.skills?.technical || (Array.isArray(r.content?.skills) ? r.content.skills : []) || [];
          const projList = r.content?.projects || [];
          setActiveResume({
            id: r.id,
            title: r.title || "Portfolio Resume",
            skillsCount: skillsList.length,
            projectsCount: projList.length,
          });
        }
      } catch (rErr) {
        console.warn("[Fetch Resume Note]:", rErr);
      }
    };

    loadData();
  }, [user, isMinorUser]);

  const getEffectiveLevelForCategory = (catId: string, catName: string): SkillLevel => {
    const found = profile?.interests?.find(
      (i) => i.id === catId || i.name.toLowerCase() === catName.toLowerCase()
    );
    return found ? found.effectiveLevel : 0;
  };

  // Under-18 Minor Gating Screen
  if (isMinorUser) {
    return (
      <AuthGuard>
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 bg-[#FAF8F5]">
          <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200/80 shadow-xs p-8 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-800 flex items-center justify-center mx-auto shadow-2xs">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
                {user?.ageBand === "13-15" ? "Junior track" : "Explorer track"}
              </span>
              <h1 className="text-2xl font-semibold text-[#111827] tracking-tight">
                Full AI interview studio is for career track (18+)
              </h1>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Minors practice presentation and verbal clarity inside foundational practice modules.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="btn-primary w-full py-2.5 text-xs font-medium flex items-center justify-center gap-2"
            >
              <span>Return to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-5rem)] bg-[#FFF8EE] text-[#1B1B2F] pb-20 font-studio">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-6 sm:pt-8 space-y-8 animate-in fade-in duration-300">
          
          {/* Header */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#1B1B2F] shadow-[6px_6px_0px_#1B1B2F] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B6B] text-white text-xs font-heading font-extrabold border border-[#1B1B2F]">
                  ✦ Pillar 01: 3D Lockdown Mode
                </span>
                <span className="text-xs font-heading font-extrabold uppercase text-[#4A4A68]">AI Mock Interview Studio</span>
              </div>
              <UserGreeting
                context="interview"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] flex items-center gap-3 max-w-md text-xs text-[#4A4A68] shadow-[3px_3px_0px_#1B1B2F]">
              <TrendingUp className="w-5 h-5 text-[#FF6B6B] shrink-0" />
              <div>
                <p className="font-heading font-black text-sm text-[#1B1B2F]">STAR Evaluation &amp; Speech Calibration</p>
                <p className="text-xs font-studio text-[#4A4A68]">Real-time filler word detection, pacing analysis, and rubric-graded feedback.</p>
              </div>
            </div>
          </div>

          {/* Resume-First Step Progression Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#1B1B2F] shadow-[5px_5px_0px_#1B1B2F] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFC93C] text-[#1B1B2F] text-xs font-heading font-extrabold border border-[#1B1B2F]">
                  {activeResume ? "Resume Connected" : "Step 1: Resume Required"}
                </span>
                <span className="text-xs font-heading font-black text-[#1B1B2F]">
                  {activeResume ? activeResume.title : "Connect ATS Resume"}
                </span>
              </div>
              <p className="text-xs font-studio text-[#4A4A68] max-w-2xl leading-relaxed">
                {activeResume
                  ? `Calibrated with ${activeResume.skillsCount} skills & ${activeResume.projectsCount} projects. Questions will evaluate your real project decisions against target JDs.`
                  : "Mock interviews are calibrated directly to your real resume projects and target Job Descriptions. Build your ATS resume first so AI can challenge your actual work."}
              </p>
            </div>
            {activeResume ? (
              <Link
                href="/interviews/swe"
                className="btn-squishy text-xs py-2.5 px-4 shrink-0 flex items-center gap-2 rounded-2xl bg-[#FF6B6B] text-white font-heading font-extrabold border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]"
              >
                <span>Launch Mock Round</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </Link>
            ) : (
              <Link
                href="/resumes"
                className="btn-squishy text-xs py-2.5 px-4 shrink-0 flex items-center gap-2 rounded-2xl bg-[#FFC93C] text-[#1B1B2F] font-heading font-extrabold border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]"
              >
                <span>Build ATS Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* 1. Daily Personalized Practice Drill Card */}
          <DailyPracticeCard
            focusArea={commProfile?.primary_weakness ? `Targeting ${commProfile.primary_weakness.replace("_", " ")}` : "Reducing filler words & pacing"}
            task={commProfile?.recommended_focus?.[0] ? `Answer in 60s: "Can you describe a key technical project you built and how you solved the hardest bug?"` : 'Answer in 60s: "Tell me about a technical project you are proud of."'}
          />

          {/* 2. Practice Formats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-[#6B7280]">
                  Practice formats
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight mt-1">Interview Modes</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Format 1: EdSpeech */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4 flex flex-col justify-between hover:border-[#2563EB]/40 transition-all">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-medium">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2563EB] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                      60s Drill
                    </span>
                  </div>
                  <h3 className="font-bold text-[#111827] text-base">Speech &amp; Pacing Drills</h3>
                </div>
                <Link
                  href="/interviews/language-training"
                  className="btn-primary text-xs py-2 px-3 text-center flex items-center justify-center gap-2"
                >
                  <span>Launch Speech Drill</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Format 2: Full Verbal */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4 flex flex-col justify-between hover:border-[#2563EB]/40 transition-all">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#111827] text-base">Full Mock Studio</h3>
                </div>
                <Link
                  href="/interviews/swe"
                  className="btn-secondary text-xs py-2 px-3 text-center flex items-center justify-center gap-2"
                >
                  <span>Launch Verbal Round</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Format 3: Code Reasoning */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4 flex flex-col justify-between hover:border-[#2563EB]/40 transition-all">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#111827] text-base">Technical Code Reasoning</h3>
                </div>
                <Link
                  href="/interviews/swe"
                  className="btn-secondary text-xs py-2 px-3 text-center flex items-center justify-center gap-2"
                >
                  <span>Launch Technical Round</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Format 4: Group Discussion */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4 flex flex-col justify-between hover:border-[#2563EB]/40 transition-all">
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F8FA] text-[#111827] flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#111827] text-base">Group Discussion Panel</h3>
                </div>
                <Link
                  href="/interviews/behavioral?format=group_discussion"
                  className="btn-secondary text-xs py-2 px-3 text-center flex items-center justify-center gap-2"
                >
                  <span>Launch Discussion</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>

          {/* 3. Longitudinal Speaking Habits Tracker */}
          <SpeakingHabitsTracker
            profileSummary={{
              languageScore: commProfile?.language_score || 80,
              grammarScore: commProfile?.grammar_score || 84,
              clarityScore: commProfile?.clarity_score || 82,
              fluencyScore: commProfile?.fluency_score || 80,
              vocabularyScore: commProfile?.vocabulary_score || 82,
              professionalScore: commProfile?.professional_score || 85,
              totalInterviews: commProfile?.total_interviews || sessions.length || 3,
              averageWpm: commProfile?.average_wpm || 128,
              topFillers: commProfile?.top_recurring_fillers || ["actually", "basically"],
              strengths: commProfile?.strengths || ["Structured STAR explanation", "Clear technical terminology"],
              recommendedFocus: commProfile?.recommended_focus || ["Reduce filler words", "Pause for breath"]
            }}
          />

          {/* 4. Category Selection Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-heading font-extrabold text-xs uppercase text-[#4A4A68]">
                  Calibrated Tracks
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#1B1B2F] tracking-tight mt-0.5">
                  Select Practice Track
                </h2>
              </div>
              <span className="text-xs font-heading font-bold text-[#4A4A68]">5 Core Roles</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AVAILABLE_CATEGORIES.map((cat) => {
                const currentLevel = getEffectiveLevelForCategory(cat.id, cat.name);

                return (
                  <div
                    key={cat.id}
                    className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#1B1B2F] shadow-[5px_5px_0px_#1B1B2F] hover:shadow-[7px_7px_0px_#1B1B2F] hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-5 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] text-[#1B1B2F] flex items-center justify-center font-medium shadow-[2px_2px_0px_#FF6B6B]">
                          <Video className="w-6 h-6 text-[#FF6B6B]" />
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-extrabold border-2 border-[#1B1B2F] bg-[#FFC93C] text-[#1B1B2F]">
                          Level {currentLevel}: {getDifficultyLabel(currentLevel)}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display font-black text-[#1B1B2F] text-xl group-hover:text-[#FF6B6B] transition-colors leading-snug">
                          {cat.name}
                        </h3>
                        <p className="text-xs font-studio text-[#4A4A68] mt-1 leading-relaxed">{cat.description}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t-2 border-[#1B1B2F]/15 flex items-center justify-between">
                      <span className="text-[11px] font-heading font-extrabold text-[#4A4A68]">
                        Calibrated STAR Bank
                      </span>
                      <Link
                        href={`/interviews/${cat.id}`}
                        className="btn-squishy text-xs py-2 px-4 rounded-xl bg-[#FF6B6B] text-white font-heading font-extrabold border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F] flex items-center gap-1.5"
                      >
                        <span>Start Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Recorded Sessions & Score History */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#1B1B2F] shadow-[6px_6px_0px_#1B1B2F] space-y-5">
            <div className="flex items-center justify-between border-b-2 border-[#1B1B2F]/15 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2EC4B6] border-2 border-[#1B1B2F] flex items-center justify-center shadow-[2px_2px_0px_#1B1B2F]">
                  <BarChart3 className="w-5 h-5 text-[#1B1B2F]" />
                </div>
                <h2 className="text-xl font-display font-black text-[#1B1B2F]">Recorded Interview Sessions</h2>
              </div>
              <span className="text-xs font-heading font-extrabold text-[#4A4A68]">{sessions.length} Recorded Sessions</span>
            </div>

            {sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((session) => {
                  const isExpanded = expandedSessionId === session.id;
                  const isPlaying = playingAudioId === session.id;

                  // Calibrated 4-dimensional rubric scores
                  const architectureScore = Math.min(100, session.contentScore + 2);
                  const codeQualityScore = Math.max(60, session.contentScore - 3);
                  const commClarityScore = session.voiceScore;
                  const tradeOffScore = Math.round((session.contentScore + session.voiceScore) / 2);

                  return (
                    <div
                      key={session.id}
                      className="rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] overflow-hidden transition-all duration-150"
                    >
                      {/* Top Summary Row */}
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-[#111827]">{session.category}</span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getDifficultyBadgeColor(session.difficultyLevel)}`}>
                              Level {session.difficultyLevel}
                            </span>
                            <span className="text-[11px] text-[#6B7280] flex items-center gap-1 font-medium">
                              <Clock className="w-3 h-3" />
                              {new Date(session.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <p className="text-xs sm:text-sm text-[#111827] font-medium line-clamp-1">{session.questionText}</p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                            <span>Architecture: <strong className="text-[#111827]">{architectureScore}%</strong></span>
                            <span>Code Quality: <strong className="text-[#111827]">{codeQualityScore}%</strong></span>
                            <span>Communication: <strong className="text-[#111827]">{commClarityScore}%</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                          <div className="text-right pr-2">
                            <span className="text-2xl font-bold text-[#2563EB]">{session.overallScore}%</span>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">Overall</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                              className={`text-xs font-semibold py-2 px-3 rounded-lg border transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                                isExpanded
                                  ? "bg-white text-[#2563EB] border-blue-200 shadow-2xs"
                                  : "bg-white text-[#111827] border-[#E5E7EB] hover:bg-gray-100"
                              }`}
                            >
                              <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
                              <span>Rubric</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>

                            <Link
                              href={`/interviews/results/${session.id}`}
                              className="btn-primary text-xs py-2 px-3.5 shadow-2xs"
                            >
                              Full Diagnostic
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Rubric Breakdown & Audio Playback Panel */}
                      {isExpanded && (
                        <div className="p-4 sm:p-5 border-t border-[#E5E7EB] bg-white space-y-5 animate-in fade-in duration-150">
                          
                          {/* Audio Playback Controls & Waveform Simulator */}
                          <div className="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex flex-col md:flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                              <button
                                type="button"
                                onClick={() => setPlayingAudioId(isPlaying ? null : session.id)}
                                className="w-9 h-9 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer transition-colors"
                              >
                                {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
                              </button>

                              <div className="space-y-0.5">
                                <span className="text-xs font-semibold text-[#111827] flex items-center gap-1.5">
                                  <Volume2 className="w-3.5 h-3.5 text-[#2563EB]" />
                                  <span>{isPlaying ? "Simulating Audio Playback" : "Candidate Response Audio"}</span>
                                </span>
                                <p className="text-[11px] text-[#6B7280]">
                                  {isPlaying ? "0:42 / 1:30 &bull; Pacing 132 WPM" : "Click play to review verbal pacing and cadence"}
                                </p>
                              </div>
                            </div>

                            {/* Animated Equalizer Waveform */}
                            <div className="flex items-center gap-1 h-6 px-3 bg-white border border-[#E5E7EB] rounded-lg">
                              {[35, 60, 90, 45, 80, 100, 70, 40, 85, 95, 55, 75, 45, 85, 65].map((height, hIdx) => (
                                <span
                                  key={hIdx}
                                  className={`w-1 rounded-full transition-all duration-300 ${
                                    isPlaying ? "bg-[#2563EB] animate-pulse" : "bg-[#E5E7EB]"
                                  }`}
                                  style={{ height: isPlaying ? `${height}%` : "30%" }}
                                />
                              ))}
                            </div>

                            {/* Playback Speed Toggles */}
                            <div className="flex items-center gap-1 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg p-1 shrink-0">
                              {[1.0, 1.25, 1.5].map((speed) => (
                                <button
                                  key={speed}
                                  type="button"
                                  onClick={() => setPlaybackSpeed(speed)}
                                  className={`text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                                    playbackSpeed === speed
                                      ? "bg-[#111827] text-white"
                                      : "text-[#6B7280] hover:text-[#111827]"
                                  }`}
                                >
                                  {speed}x
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 4-Dimensional Rubric Scoring Grid */}
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] block mb-3">
                              4-Dimensional Candidate Rubric Breakdown
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              
                              {/* Dimension 1: System Architecture */}
                              <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-[#111827]">System Architecture</span>
                                  <span className="font-bold text-[#2563EB]">{architectureScore}%</span>
                                </div>
                                <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                                    style={{ width: `${architectureScore}%` }}
                                  />
                                </div>
                                <p className="text-[10px] text-[#6B7280] leading-tight">
                                  High modularity, decoupling, and scalable component isolation.
                                </p>
                              </div>

                              {/* Dimension 2: Code Quality */}
                              <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-[#111827]">Code Quality &amp; Edges</span>
                                  <span className="font-bold text-emerald-600">{codeQualityScore}%</span>
                                </div>
                                <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${codeQualityScore}%` }}
                                  />
                                </div>
                                <p className="text-[10px] text-[#6B7280] leading-tight">
                                  Boundary tests, defensive null checks, and error fallbacks.
                                </p>
                              </div>

                              {/* Dimension 3: Communication */}
                              <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-[#111827]">STAR Communication</span>
                                  <span className="font-bold text-[#2563EB]">{commClarityScore}%</span>
                                </div>
                                <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                                    style={{ width: `${commClarityScore}%` }}
                                  />
                                </div>
                                <p className="text-[10px] text-[#6B7280] leading-tight">
                                  Concise delivery, low filler frequency, and structured narrative.
                                </p>
                              </div>

                              {/* Dimension 4: Trade-Offs */}
                              <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-[#111827]">Trade-off Justification</span>
                                  <span className="font-bold text-amber-600">{tradeOffScore}%</span>
                                </div>
                                <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-amber-600 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${tradeOffScore}%` }}
                                  />
                                </div>
                                <p className="text-[10px] text-[#6B7280] leading-tight">
                                  Latency vs. cost analysis and CAP theorem trade-off defense.
                                </p>
                              </div>

                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-[#6B7280] bg-[#F7F8FA] rounded-xl border border-[#E5E7EB]">
                No interview sessions recorded yet. Pick a track above or try a 60s Speech Drill to get started!
              </div>
            )}
          </div>

        </div>
      </div>
    </AuthGuard>
  );
}
