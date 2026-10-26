"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  BookOpen,
  Award,
  Layers,
  CheckCircle2,
  Clock,
  Search,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  X,
  RotateCcw,
  Sparkles,
  Bot,
  Cpu,
  Binary,
  Briefcase,
  TrendingUp,
  Palette,
  Activity,
  FileText,
  Rocket,
  Flame,
  Volume2,
  VolumeX,
  Zap,
  Map,
  Grid,
  Trophy,
  Swords,
  Scroll,
} from "lucide-react";
import EdworldLogo from "@/components/ui/EdworldLogo";
import AmbientMeshBackground from "@/components/ui/AmbientMeshBackground";
import { VerifiableCertificateModal, CertificateData } from "@/components/learn/VerifiableCertificateModal";
import { QuestMapView } from "@/components/learn/QuestMapView";

interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  level: string;
  duration_weeks: number;
  skills: string[];
  icon_name: string;
  phases_count: number;
  resources_count: number;
  passing_score: number;
  questions_count: number;
}

interface CourseDetail {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  level: string;
  duration_weeks: number;
  skills: string[];
  roadmap: Array<{
    phase: string;
    duration: string;
    milestones: Array<{ id: string; title: string; details: string }>;
  }>;
  resources: Array<{
    title: string;
    type: string;
    url: string;
    desc: string;
  }>;
  quiz: {
    passingScore: number;
    totalQuestions: number;
    questions: Array<{
      id: string;
      question: string;
      options: string[];
    }>;
  };
}

const FIELD_RADAR = [
  { label: "All Fields", icon: Layers },
  { label: "Tech & AI", icon: Cpu },
  { label: "Computer Science", icon: Binary },
  { label: "Core Engineering", icon: Bot },
  { label: "Business & Management", icon: Briefcase },
  { label: "Finance & Accounting", icon: TrendingUp },
  { label: "Design & Creative", icon: Palette },
  { label: "Healthcare & Science", icon: Activity },
  { label: "Law & Governance", icon: ShieldCheck },
  { label: "Entrepreneurship", icon: Rocket },
  { label: "Media & Creative", icon: FileText },
];

export default function LearnAcademyPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Fields");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [isLoading, setIsLoading] = useState(true);

  // Gamification Player State
  const [userXp, setUserXp] = useState(1250);
  const [streakDays, setStreakDays] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [floatingXp, setFloatingXp] = useState<{ id: number; text: string } | null>(null);

  // Active Studio Modal State
  const [activeCourse, setActiveCourse] = useState<CourseDetail | null>(null);
  const [activeTab, setActiveTab] = useState<"roadmap" | "resources" | "quiz">("roadmap");
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>({});

  // Boss Arena Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [recipientName, setRecipientName] = useState("");
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [bossHp, setBossHp] = useState(100);

  // Certificate Modal State
  const [issuedCertificate, setIssuedCertificate] = useState<CertificateData | null>(null);

  // Audio synthesizer helper (Web Audio API)
  const playSound = (type: "chime" | "victory" | "hit" | "fail") => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === "chime") {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "hit") {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "victory") {
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === "fail") {
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {}
  };

  // 1. Fetch courses catalog on mount & load user XP
  useEffect(() => {
    fetchCourses();
    if (typeof window !== "undefined") {
      const storedXp = localStorage.getItem("edw_gamer_xp");
      if (storedXp) setUserXp(parseInt(storedXp, 10));
      const storedQuests = localStorage.getItem("edw_completed_quests");
      if (storedQuests) {
        try {
          setCompletedQuests(JSON.parse(storedQuests));
        } catch {}
      }
    }
  }, [selectedCategory]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const url = selectedCategory === "All Fields"
        ? "/api/learn/courses"
        : `/api/learn/courses?category=${encodeURIComponent(selectedCategory)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.courses)) {
        setCourses(data.courses);
      }
    } catch (e) {
      console.error("Failed to load courses:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Open Course Studio
  const handleOpenCourse = async (slug: string) => {
    try {
      const res = await fetch(`/api/learn/courses/${slug}`);
      const data = await res.json();
      if (data.success && data.course) {
        setActiveCourse(data.course);
        setActiveTab("roadmap");
        setQuizAnswers({});
        setQuizResult(null);
        setBossHp(100);

        if (typeof window !== "undefined") {
          const saved = localStorage.getItem(`edw_milestones_${slug}`);
          if (saved) {
            try {
              setCompletedMilestones(JSON.parse(saved));
            } catch {}
          } else {
            setCompletedMilestones({});
          }
        }
      }
    } catch (err) {
      console.error("Error opening course:", err);
    }
  };

  // Milestone check-off with XP rewards
  const toggleMilestone = (milestoneId: string) => {
    if (!activeCourse) return;
    const isNowChecked = !completedMilestones[milestoneId];
    const updated = {
      ...completedMilestones,
      [milestoneId]: isNowChecked,
    };
    setCompletedMilestones(updated);

    if (isNowChecked) {
      const newXp = userXp + 50;
      setUserXp(newXp);
      playSound("chime");
      triggerFloatingXp("+50 XP");
      if (typeof window !== "undefined") {
        localStorage.setItem("edw_gamer_xp", newXp.toString());
      }
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(`edw_milestones_${activeCourse.slug}`, JSON.stringify(updated));
    }
  };

  const triggerFloatingXp = (text: string) => {
    setFloatingXp({ id: Date.now(), text });
    setTimeout(() => setFloatingXp(null), 1800);
  };

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    setQuizAnswers((prev) => {
      const updated = { ...prev, [questionId]: optionIndex };
      // Decrease boss HP proportionally
      const totalQ = activeCourse?.quiz?.questions?.length || 4;
      const answered = Object.keys(updated).length;
      const remainingHp = Math.max(10, Math.round(100 - (answered / totalQ) * 90));
      setBossHp(remainingHp);
      playSound("hit");
      return updated;
    });
  };

  const handleSubmitQuiz = async () => {
    if (!activeCourse) return;
    if (!recipientName.trim()) {
      alert("Please enter your name as you wish it to appear on the official certificate.");
      return;
    }

    const totalQuestions = activeCourse.quiz?.questions?.length || 0;
    const answeredCount = Object.keys(quizAnswers).length;
    if (answeredCount < totalQuestions) {
      const proceed = confirm(`You have answered ${answeredCount} of ${totalQuestions} questions. Submit anyway?`);
      if (!proceed) return;
    }

    setIsSubmittingQuiz(true);
    try {
      const res = await fetch("/api/learn/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: activeCourse.slug,
          recipientName: recipientName.trim(),
          answers: quizAnswers,
        }),
      });
      const data = await res.json();
      setQuizResult(data);

      if (data.passed) {
        setBossHp(0);
        playSound("victory");
        const newXp = userXp + 250;
        setUserXp(newXp);
        triggerFloatingXp("+250 XP • QUEST CLEARED!");

        const updatedQuests = { ...completedQuests, [activeCourse.slug]: true };
        setCompletedQuests(updatedQuests);

        if (typeof window !== "undefined") {
          localStorage.setItem("edw_gamer_xp", newXp.toString());
          localStorage.setItem("edw_completed_quests", JSON.stringify(updatedQuests));
        }

        if (data.certificate) {
          setIssuedCertificate(data.certificate);
        }
      } else {
        playSound("fail");
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Error evaluating assessment. Please try again.");
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.tagline.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  // Calculate user level tier
  const playerLevel = Math.floor(userXp / 500) + 1;
  const nextTierXp = playerLevel * 500;
  const currentLevelProgress = Math.round(((userXp % 500) / 500) * 100);

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#111827] font-sans antialiased relative">
      {/* Floating XP Notification Animation */}
      {floatingXp && (
        <div className="fixed top-20 right-8 z-50 px-4 py-2 rounded-xl bg-[#111827] text-white font-medium text-xs shadow-lg animate-bounce flex items-center gap-1.5 border border-[#374151]">
          <Zap className="w-4 h-4 text-[#2563EB] fill-current" />
          <span>{floatingXp.text}</span>
        </div>
      )}

      {/* Header Section */}
      <header className="px-4 sm:px-8 pt-8 pb-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E5E7EB]">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white border border-[#E5E7EB] text-[#2563EB] text-xs font-medium">
              <Trophy className="w-3.5 h-3.5" />
              <span>Academic &amp; industry tracks</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#111827]">
              Courses &amp; learning roadmaps
            </h1>

            <p className="text-sm text-[#6B7280] leading-relaxed">
              Explore multi-disciplinary engineering, data science, and career paths. Track milestones, access curated resources, and earn verifiable credentials.
            </p>
          </div>

          {/* Right Status Capsule: Scholar Level & Streak */}
          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0 flex-wrap">
            {/* Level & XP Capsule */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
              <div className="w-6 h-6 rounded-md bg-[#2563EB] text-white font-bold text-[11px] flex items-center justify-center">
                L{playerLevel}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-between text-[11px] gap-3 leading-none">
                  <span className="font-semibold text-[#111827]">Level {playerLevel} Scholar</span>
                  <span className="text-[#2563EB] font-bold">{userXp} XP</span>
                </div>
                <div className="w-24 h-1.5 rounded-full bg-[#F7F8FA] mt-1 overflow-hidden border border-[#E5E7EB]">
                  <div
                    className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
                    style={{ width: `${currentLevelProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] text-xs font-semibold shadow-xs" title="Daily Streak Active">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{streakDays}d streak</span>
            </div>

            {/* Sound FX Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#D1D5DB] transition-colors cursor-pointer shadow-xs"
              title={soundEnabled ? "Mute Sound Effects" : "Unmute Sound Effects"}
              aria-label="Toggle sound effects"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#111827]" /> : <VolumeX className="w-4 h-4 text-[#9CA3AF]" />}
            </button>
          </div>
        </div>

        {/* Search, Filter & View Controls */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, skill, or course name..."
              className="w-full bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111827] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors"
            />
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-[#E5E7EB] self-start md:self-auto shrink-0 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#2563EB] text-white"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "map"
                  ? "bg-[#2563EB] text-white"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Learning Map</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FIELD_RADAR.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setSelectedCategory(cat.label)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? "bg-[#111827] text-white border-[#111827]"
                    : "bg-white text-[#6B7280] hover:text-[#111827] hover:border-[#D1D5DB] border-[#E5E7EB]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-[#6B7280]"}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-8 pb-20 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-7 h-7 rounded-full border-2 border-[#E5E7EB] border-t-[#2563EB] animate-spin mx-auto mb-3" />
            <span className="text-xs text-[#6B7280]">Loading courses...</span>
          </div>
        ) : viewMode === "map" ? (
          <QuestMapView
            courses={courses}
            completedQuests={completedQuests}
            onSelectCourse={handleOpenCourse}
          />
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-[#E5E7EB] text-center space-y-3">
            <Layers className="w-8 h-8 text-[#6B7280] mx-auto" />
            <h3 className="text-sm font-semibold text-[#111827]">No courses found</h3>
            <p className="text-xs text-[#6B7280]">Try selecting a different domain or clearing your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course, idx) => {
              const isMastered = !!completedQuests[course.slug];
              const xpBounty = 350 + (idx % 4) * 50;

              return (
                <div
                  key={course.id}
                  className={`group p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-xs hover:shadow-sm bg-white hover:border-[#2563EB]/40 ${
                    isMastered
                      ? "border-emerald-200 bg-emerald-50/20"
                      : "border-[#E5E7EB]"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-[#F7F8FA] border border-[#E5E7EB] text-[#6B7280] text-[10px] font-semibold uppercase tracking-wider">
                        {course.category}
                      </span>

                      {isMastered ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Completed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-[#2563EB] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                          <Zap className="w-3 h-3 text-[#2563EB]" />
                          +{xpBounty} XP
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed line-clamp-2">
                        {course.tagline}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {course.skills.slice(0, 3).map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-[#F7F8FA] text-[#6B7280] text-[11px] border border-[#E5E7EB]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#6B7280] text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
                      <span>{course.duration_weeks}w</span>
                      <span>&bull;</span>
                      <span>{course.level}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenCourse(course.slug)}
                      className="btn-primary text-xs py-1.5 px-3.5 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{isMastered ? "Review" : "Start Course"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Interactive Course Detail Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden bg-white border border-[#E5E7EB] rounded-2xl shadow-xl flex flex-col text-[#111827]">
            
            {/* Header */}
            <div className="p-5 sm:p-6 bg-white border-b border-[#E5E7EB] flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-[#F7F8FA] text-[#2563EB] text-[10px] font-semibold uppercase tracking-wider border border-[#E5E7EB]">
                    {activeCourse.category}
                  </span>
                  <span className="text-xs text-[#6B7280]">
                    {activeCourse.duration_weeks} Weeks &bull; {activeCourse.level} Level
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                  {activeCourse.title}
                </h2>
                <p className="text-xs text-[#6B7280] mt-1 max-w-2xl leading-relaxed">
                  {activeCourse.tagline}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveCourse(null)}
                className="p-1.5 rounded-lg bg-[#F7F8FA] hover:bg-neutral-200 text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer border border-[#E5E7EB]"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 py-2.5 bg-[#F7F8FA] border-b border-[#E5E7EB] text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("roadmap")}
                className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "roadmap"
                    ? "bg-[#2563EB] text-white font-semibold"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                <Scroll className="w-3.5 h-3.5" />
                <span>Course Roadmap</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("resources")}
                className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "resources"
                    ? "bg-[#2563EB] text-white font-semibold"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Resources ({activeCourse.resources?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("quiz")}
                className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "quiz"
                    ? "bg-[#2563EB] text-white font-semibold"
                    : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Assessment &amp; Certification</span>
              </button>
            </div>

            {/* Studio Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              
              {/* TAB 1: ROADMAP QUEST STAGES */}
              {activeTab === "roadmap" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                    <div>
                      <h4 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
                        Curriculum Milestones
                      </h4>
                      <p className="text-xs text-[#6B7280]">
                        Check off each milestone to track your progression and prepare for final certification.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {activeCourse.roadmap.map((phase, pIdx) => (
                      <div key={pIdx} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#111827] uppercase tracking-wider">
                            Stage {pIdx + 1}: {phase.phase.replace(/^Phase\s*\d+:\s*/i, "")}
                          </span>
                          <span className="text-[11px] text-[#6B7280]">
                            {phase.duration}
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {phase.milestones.map((m) => {
                            const isChecked = !!completedMilestones[m.id];
                            return (
                              <div
                                key={m.id}
                                onClick={() => toggleMilestone(m.id)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                                  isChecked
                                    ? "bg-blue-50/40 border-[#2563EB] text-[#111827]"
                                    : "bg-white hover:bg-[#F7F8FA] border-[#E5E7EB] text-[#111827]"
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                                    isChecked
                                      ? "bg-[#2563EB] border-[#2563EB] text-white"
                                      : "border-[#D1D5DB] bg-white"
                                  }`}
                                >
                                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                                </div>
                                <div className="space-y-0.5 flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="text-xs font-semibold leading-tight text-[#111827]">
                                      {m.title}
                                    </div>
                                    <span className="text-[10px] text-[#2563EB] bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded font-medium">
                                      +50 XP
                                    </span>
                                  </div>
                                  <p className="text-xs text-[#6B7280] leading-relaxed">
                                    {m.details}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-xs text-[#6B7280]">
                      Completed all stages? Take the assessment to claim your verifiable credential.
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("quiz")}
                      className="btn-primary text-xs py-2 px-4 cursor-pointer flex items-center gap-1.5"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span>Take Assessment</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: ARMORY & RESOURCES */}
              {activeTab === "resources" && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-[#E5E7EB]">
                    <h4 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
                      Course Resources &amp; Documentation
                    </h4>
                    <p className="text-xs text-[#6B7280]">
                      Official documentation, references, and starter projects.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {activeCourse.resources.map((res, rIdx) => (
                      <a
                        key={rIdx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl bg-white hover:bg-[#F7F8FA] border border-[#E5E7EB] hover:border-[#2563EB] transition-colors flex flex-col justify-between group shadow-xs cursor-pointer"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded-md bg-[#F7F8FA] border border-[#E5E7EB] text-[10px] font-semibold text-[#111827]">
                              {res.type}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2563EB] transition-colors" />
                          </div>
                          <h5 className="text-xs font-semibold text-[#111827]">
                            {res.title}
                          </h5>
                          <p className="text-xs text-[#6B7280] leading-relaxed">
                            {res.desc}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: QUIZ & CERTIFICATION */}
              {activeTab === "quiz" && (
                <div className="space-y-6">
                  {/* Assessment Info Banner */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Swords className="w-4 h-4 text-[#2563EB]" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#111827]">
                          Assessment: {activeCourse.title}
                        </span>
                      </div>
                      <span className="text-xs text-[#2563EB] font-bold">
                        Target: {activeCourse.quiz?.passingScore || 80}% Passing
                      </span>
                    </div>

                    <p className="text-xs text-[#6B7280]">
                      Answer the questions below to evaluate your proficiency and issue your tamper-proof certificate of completion.
                    </p>
                  </div>

                  {/* Recipient Information Form */}
                  <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111827]">
                      Certificate Recipient Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Adarsh Kolluru"
                      className="w-full sm:max-w-md bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg px-3.5 py-2 text-xs text-[#111827] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors"
                    />
                  </div>

                  {/* Assessment Questions */}
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                      <h4 className="text-xs font-semibold text-[#111827] uppercase tracking-wider">
                        Questions &bull; Minimum passing: {activeCourse.quiz?.passingScore}%
                      </h4>
                      <span className="text-xs text-[#6B7280]">
                        {Object.keys(quizAnswers).length} of {activeCourse.quiz?.questions?.length} answered
                      </span>
                    </div>

                    {activeCourse.quiz?.questions?.map((q, qIdx) => (
                      <div
                        key={q.id}
                        className="p-5 rounded-xl bg-white border border-[#E5E7EB] space-y-3.5 shadow-xs"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#F7F8FA] text-[#111827] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#E5E7EB]">
                            {qIdx + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-[#111827] leading-relaxed">
                            {q.question}
                          </span>
                        </div>

                        <div className="space-y-2 pl-7">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = quizAnswers[q.id] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => handleSelectQuizOption(q.id, optIdx)}
                                className={`w-full p-3 rounded-lg border text-left text-xs transition-colors flex items-center gap-3 cursor-pointer ${
                                  isSelected
                                    ? "bg-[#2563EB] text-white border-[#2563EB] font-medium"
                                    : "bg-white hover:bg-[#F7F8FA] border-[#E5E7EB] text-[#111827]"
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] ${
                                  isSelected ? "border-white text-white" : "border-[#D1D5DB] text-[#6B7280]"
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Submission and Result Card */}
                  {quizResult && (
                    <div
                      className={`p-5 rounded-xl border ${
                        quizResult.passed
                          ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                          : "bg-rose-50 border-rose-200 text-rose-950"
                      } space-y-3`}
                    >
                      <div className="flex items-center gap-2">
                        {quizResult.passed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <RotateCcw className="w-5 h-5 text-rose-600" />
                        )}
                        <h4 className="font-bold text-sm">
                          {quizResult.passed
                            ? `Passed with ${quizResult.scorePercentage}% score!`
                            : `Score: ${quizResult.scorePercentage}%. (Passing threshold: ${quizResult.passingScore}%)`}
                        </h4>
                      </div>

                      <p className="text-xs leading-relaxed opacity-90">
                        {quizResult.passed
                          ? "Congratulations! You have demonstrated proficiency and unlocked your verifiable certificate of achievement."
                          : "You did not reach the passing threshold this time. Review the course materials and try again."}
                      </p>

                      {quizResult.passed && quizResult.certificate && (
                        <button
                          type="button"
                          onClick={() => setIssuedCertificate(quizResult.certificate)}
                          className="btn-primary text-xs py-2 px-4 shadow-xs flex items-center gap-2 cursor-pointer mt-2"
                        >
                          <Award className="w-4 h-4" />
                          <span>View Official Certificate</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isSubmittingQuiz}
                      onClick={handleSubmitQuiz}
                      className="btn-primary text-xs py-2.5 px-6 shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      {isSubmittingQuiz ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Evaluating...</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4" />
                          <span>Submit Assessment</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Verifiable Certificate Modal */}
      {issuedCertificate && (
        <VerifiableCertificateModal
          certificate={issuedCertificate}
          onClose={() => setIssuedCertificate(null)}
        />
      )}

    </div>
  );
}
