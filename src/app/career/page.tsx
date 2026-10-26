"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Cpu,
  Layers,
  Terminal,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ShieldAlert,
  Bell
} from "lucide-react";

export default function CareerOsPage() {
  const [activeQuarter, setActiveQuarter] = useState<number>(2);

  const radarMetrics = [
    { label: "Algorithms & DSA", candidate: 92, target: 85 },
    { label: "System Design", candidate: 78, target: 80 },
    { label: "STAR Communication", candidate: 88, target: 80 },
    { label: "Databases & Storage", candidate: 82, target: 75 },
    { label: "DevOps & CI/CD", candidate: 70, target: 75 },
  ];

  const milestones = [
    {
      q: 1,
      title: "Foundations & Algorithmic Patterns",
      status: "completed",
      badge: "Completed",
      description: "Mastered essential patterns: Sliding Window, Two Pointers, Dynamic Programming, and Graph Traversals.",
      tasks: ["45 Practice Drills Cleared", "Time/Space Complexity Profiling", "Zero-Code Visualizer Exercises"],
    },
    {
      q: 2,
      title: "High-Concurrency Distributed Systems",
      status: "active",
      badge: "Current Milestone • 85%",
      description: "Architecting resilient distributed primitives: Redis Sliding Windows, Idempotent Kafka Consumers, and Partition Pruning.",
      tasks: ["Production Incident Labs (EdFix)", "Cache Stampede Prevention Drill", "Simulated Technical System Rounds"],
    },
    {
      q: 3,
      title: "Production Chaos & Security Drills",
      status: "upcoming",
      badge: "Upcoming Q3",
      description: "Mitigating race conditions, thread starvation, SQL deadlock resolution, and proactive client security.",
      tasks: ["Security Sentinel Labs", "Load Balancing Under P0 Latency Spike", "Microservice Failover Simulation"],
    },
    {
      q: 4,
      title: "Executive STAR & Staff Calibration",
      status: "upcoming",
      badge: "Upcoming Q4",
      description: "Calibrated engineering metrics: System Trade-Off Negotiations, STAR Incident Debriefs, and Architecture RFCs.",
      tasks: ["Executive Panel Simulation", "Live Whiteboard Defense", "Full-Scope Placement Verification"],
    },
  ];

  const studioProjects = [
    {
      id: "proj-1",
      title: "Distributed Rate Limiter with Sliding Window Counter",
      tags: ["Go", "Redis", "Docker", "gRPC"],
      xp: "+350 XP",
      difficulty: "Advanced",
      summary: "Engineer an in-memory token bucket rate limiter sustaining 50,000 req/sec with atomicity under split-brain network scenarios.",
      status: "Verified",
    },
    {
      id: "proj-2",
      title: "Real-Time Collaborative Code Editor with CRDTs",
      tags: ["TypeScript", "WebSockets", "CRDT (Yjs)", "React"],
      xp: "+400 XP",
      difficulty: "Intermediate",
      summary: "Build an operational conflict-free document editor supporting multi-cursor live synchronization and offline reconciliation.",
      status: "In Progress",
    },
    {
      id: "proj-3",
      title: "High-Throughput Kafka Event Bus with Idempotent Consumer",
      tags: ["Java / Spring", "Apache Kafka", "PostgreSQL"],
      xp: "+500 XP",
      difficulty: "Hard",
      summary: "Prevent duplicate financial transactions during network partitions using distributed deduplication tables and outbox patterns.",
      status: "Ready to Start",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 bg-white text-[#111827] font-sans pb-12">
      {/* Header Banner */}
      <div className="space-y-2.5 text-center max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F7F8FA] border border-[#E5E7EB] text-[#2563EB] text-xs font-medium">
          <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Career operating system &bull; Competency &amp; milestones</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight">
          Competency roadmaps &amp; career calibration
        </h1>
        <p className="text-sm text-[#6B7280]">
          Continuous skills tracking, milestone assessments, and verifiable engineering studios.
        </p>
      </div>

      {/* Level, XP & Streak Bento Banner */}
      <div className="rounded-xl bg-white border border-[#E5E7EB] p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Level Card */}
          <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-[#E5E7EB] pb-4 md:pb-0 md:pr-6">
            <div className="w-12 h-12 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-[#111827] flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-[#2563EB]" />
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-medium text-[#6B7280]">Current tier</div>
              <div className="text-lg font-bold text-[#111827]">Level 4 Scholar</div>
              <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-[#F7F8FA] border border-[#E5E7EB] text-[#2563EB]">
                Top 8th percentile
              </span>
            </div>
          </div>

          {/* XP Progress */}
          <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-[#E5E7EB] pb-4 md:pb-0 md:pr-6">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-[#6B7280]">Experience progress</span>
              <span className="font-semibold text-[#111827] tabular-nums">3,450 / 5,000 XP</span>
            </div>
            <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div className="h-full bg-[#2563EB] rounded-full" style={{ width: "69%" }} />
            </div>
            <div className="text-xs text-[#6B7280] flex items-center justify-between">
              <span>+350 XP this week</span>
              <span className="text-[#2563EB] font-medium">1,550 XP to Level 5</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center justify-start md:justify-end gap-3">
            <Link
              href="/interviews"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium py-2 px-4 rounded-lg transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <span>Mock Interview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/resumes"
              className="bg-white hover:bg-[#F7F8FA] text-[#111827] border border-[#E5E7EB] text-xs font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <span>ATS Resume</span>
            </Link>
          </div>
        </div>
      </div>

      {/* High-Impact Career Tools Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/career/roadmap"
          className="p-5 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#111827] transition-all group shadow-xs space-y-2 block"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#F7F8FA] border border-[#E5E7EB] text-[#6B7280]">
              1 / 3 / 5 Yr
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors flex items-center gap-1">
            <span>AI Career Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:translate-x-0.5 transition-transform" />
          </h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Generate customized multi-horizon milestones, month-by-month checklists, and skill progression.
          </p>
        </Link>

        <Link
          href="/career/scam-checker"
          className="p-5 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#111827] transition-all group shadow-xs space-y-2 block"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
              Fraud Shield
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#111827] group-hover:text-red-600 transition-colors flex items-center gap-1">
            <span>Scam Offer Checker</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:translate-x-0.5 transition-transform" />
          </h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Scan job offers or recruiter emails for fee extortion, fake domains, and unofficial communications.
          </p>
        </Link>

        <Link
          href="/settings/alerts"
          className="p-5 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#111827] transition-all group shadow-xs space-y-2 block"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Push Pings
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#111827] group-hover:text-emerald-600 transition-colors flex items-center gap-1">
            <span>WhatsApp &amp; Telegram Alerts</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:translate-x-0.5 transition-transform" />
          </h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Get instant opportunity pings, hackathons, and application deadlines filtered by your roles and cities.
          </p>
        </Link>
      </div>

      {/* Main Grid: Competency Radar vs Milestone Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Radar & Competencies */}
        <div className="lg:col-span-5 rounded-xl bg-white border border-[#E5E7EB] p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-[#111827]">
              Competency Radar &amp; Calibration
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Benchmarked against campus placement standards
            </p>
          </div>

          {/* Metric Bars */}
          <div className="space-y-3.5 pt-2">
            {radarMetrics.map((m) => (
              <div key={m.label} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium text-[#111827]">{m.label}</span>
                  <span className="font-semibold text-[#111827]">
                    {m.candidate}% <span className="text-[#6B7280] font-normal">/ target {m.target}%</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      m.candidate >= m.target ? "bg-[#2563EB]" : "bg-amber-500"
                    }`}
                    style={{ width: `${m.candidate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] text-xs text-[#6B7280] space-y-1">
            <div className="font-semibold text-[#111827] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Myra AI Calibration Insight</span>
            </div>
            <p className="leading-relaxed">
              Your algorithmic problem solving exceeds the benchmark. Focus on distributed systems and incident mitigations to optimize your placement readiness.
            </p>
          </div>
        </div>

        {/* Milestone Quarter Tabs & Roadmaps */}
        <div className="lg:col-span-7 rounded-xl bg-white border border-[#E5E7EB] p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#111827]">
                Milestone Roadmap
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Structured path toward engineering placement readiness
              </p>
            </div>

            {/* Quarter Pill Selector */}
            <div className="flex items-center gap-1 bg-[#F7F8FA] p-1 rounded-lg border border-[#E5E7EB]">
              {[1, 2, 3, 4].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setActiveQuarter(q)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    activeQuarter === q
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-[#6B7280] hover:text-[#111827]"
                  }`}
                >
                  Q{q}
                </button>
              ))}
            </div>
          </div>

          {/* Active Milestone Card */}
          {milestones
            .filter((m) => m.q === activeQuarter)
            .map((m) => (
              <div key={m.q} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#111827]">{m.title}</h3>
                  <span
                    className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md border ${
                      m.status === "completed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : m.status === "active"
                        ? "bg-blue-50 text-[#2563EB] border-blue-200"
                        : "bg-[#F7F8FA] text-[#6B7280] border-[#E5E7EB]"
                    }`}
                  >
                    {m.badge}
                  </span>
                </div>

                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {m.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
                  <div className="text-xs font-semibold text-[#111827]">Verification Checkpoints:</div>
                  <div className="space-y-1.5">
                    {m.tasks.map((task, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#6B7280]">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 ${
                            m.status === "completed" || (m.status === "active" && idx === 0)
                              ? "text-emerald-500"
                              : "text-gray-300"
                          }`}
                        />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Proof-of-Work Projects Studio */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#111827]">Proof-of-Work Project Studios</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Production-grade systems projects designed to demonstrate engineering rigor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {studioProjects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-xl p-5 bg-white border border-[#E5E7EB] shadow-xs flex flex-col justify-between hover:border-gray-400 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#F7F8FA] border border-[#E5E7EB] text-[#6B7280]">
                    {proj.difficulty}
                  </span>
                  <span className="text-xs font-semibold text-[#2563EB]">{proj.xp}</span>
                </div>
                <h3 className="font-semibold text-sm text-[#111827] leading-snug">{proj.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{proj.summary}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-[#F7F8FA] text-[#6B7280] text-[10px] border border-[#E5E7EB]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#111827]">{proj.status}</span>
                <Link
                  href="/edfix"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8]"
                >
                  <span>Open Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
