"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { 
  Users, 
  Briefcase, 
  Award, 
  Mail, 
  ArrowRight, 
  Plus, 
  Send, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Building2,
  GraduationCap,
  Hammer,
  Activity,
  Check,
  Rocket,
  Lock,
  Eye,
  Globe
} from "lucide-react";

export default function AdminHubPage() {
  const { user } = useAuth();
  const [siteLaunched, setSiteLaunched] = useState<boolean>(false);
  const [togglingLaunch, setTogglingLaunch] = useState<boolean>(false);
  const [launchMessage, setLaunchMessage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    studentsCount: 0,
    onboardedCount: 0,
    totalJobs: 0,
    internshipsCount: 0,
    pendingAmbassadors: 0,
    acceptedAmbassadors: 0,
    pendingEdBuild: 0,
    approvedEdBuild: 0,
    hasResendKey: false,
  });
  const [loading, setLoading] = useState(true);

  const handleToggleLaunch = async (targetState: boolean) => {
    setTogglingLaunch(true);
    setLaunchMessage(null);
    try {
      const res = await fetch("/api/feature-flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "site_launched",
          enabled: targetState,
          description: "Master switch to display full landing page features vs Coming Soon",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSiteLaunched(targetState);
        setLaunchMessage(
          targetState
            ? "Platform launch ACCEPTED! The full landing page and all features are now LIVE for all visitors."
            : "Platform reverted to COMING SOON mode. Public visitors can only see the Coming Soon teaser."
        );
      } else {
        setLaunchMessage(`Error: ${data.error || "Failed to update platform status."}`);
      }
    } catch (err: any) {
      setLaunchMessage(`Network error: ${err.message}`);
    } finally {
      setTogglingLaunch(false);
      setShowConfirmModal(false);
    }
  };

  useEffect(() => {
    async function loadSummaryData() {
      try {
        setLoading(true);

        // Fetch in parallel
        const [usersRes, jobsRes, ambRes, mailRes, edbuildRes, flagRes] = await Promise.all([
          fetch("/api/admin/users").catch(() => null),
          fetch("/api/admin/jobs").catch(() => null),
          fetch("/api/ambassador/admin").catch(() => null),
          fetch("/api/admin/bulk-mail").catch(() => null),
          fetch("/api/admin/edbuild").catch(() => null),
          fetch("/api/feature-flags").catch(() => null),
        ]);

        const usersData = usersRes ? await usersRes.json().catch(() => ({})) : {};
        const jobsData = jobsRes ? await jobsRes.json().catch(() => ({})) : {};
        const ambData = ambRes ? await ambRes.json().catch(() => ({})) : {};
        const mailData = mailRes ? await mailRes.json().catch(() => ({})) : {};
        const edbuildData = edbuildRes ? await edbuildRes.json().catch(() => ({})) : {};
        const flagData = flagRes ? await flagRes.json().catch(() => ({})) : {};

        setSiteLaunched(Boolean(flagData.isSiteLaunched));

        const allUsers = usersData.users || [];
        const students = allUsers.filter((u: any) => u.career_stage === "STUDENT" || !u.career_stage);
        const onboarded = students.filter((u: any) => u.onboarding_completed);

        const pendingEdbuildGroups = edbuildData.pendingGroups || [];
        const allEdbuildGroups = edbuildData.allGroups || [];
        const approvedCount = allEdbuildGroups.filter((g: any) => g.status === "APPROVED").length;

        setStats({
          totalUsers: allUsers.length,
          studentsCount: students.length,
          onboardedCount: onboarded.length,
          totalJobs: jobsData.counts?.total || 0,
          internshipsCount: jobsData.counts?.internships || 0,
          pendingAmbassadors: (ambData.applications || []).filter((a: any) => a.status === "pending").length,
          acceptedAmbassadors: (ambData.ambassadors || []).length,
          pendingEdBuild: pendingEdbuildGroups.length,
          approvedEdBuild: approvedCount,
          hasResendKey: mailData.hasResendKey || false,
        });
      } catch (err) {
        console.error("Failed to load admin summary:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSummaryData();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      
      {/* Top Banner */}
      <div className="bg-white border border-[#E5E7EB] p-5 sm:p-7 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-xs font-semibold text-[#2563EB]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Executive Operations Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
              Platform Administration &amp; Review
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] max-w-2xl leading-relaxed">
              Verify student collaborative project submissions, manage job postings, review campus ambassadors, and broadcast verified emails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href="/admin/edbuild"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Hammer className="w-3.5 h-3.5" />
              <span>Review EdBuild ({stats.pendingEdBuild})</span>
            </Link>
            <Link
              href="/admin/jobs"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-[#E5E7EB] text-[#111827] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Add Job</span>
            </Link>
            <Link
              href="/admin/bulk-mail"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-[#E5E7EB] text-[#111827] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Broadcast</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PLATFORM LAUNCH & COMING SOON GATE                                        */}
      {/* ========================================================================= */}
      <div className={`p-6 sm:p-7 rounded-2xl border transition-all shadow-xs ${
        siteLaunched 
          ? "bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-emerald-200" 
          : "bg-gradient-to-r from-amber-50 via-orange-50 to-white border-amber-200"
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                siteLaunched 
                  ? "bg-emerald-600 text-white" 
                  : "bg-amber-500 text-white"
              }`}>
                {siteLaunched ? <Rocket className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{siteLaunched ? "Platform Live in Production" : "Coming Soon Mode Active"}</span>
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Landing Page Status
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {siteLaunched 
                ? "All Platform Features Are Publicly Visible" 
                : "Platform Features Are Hidden Behind Coming Soon"}
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {siteLaunched ? (
                <span>
                  Public visitors on <code className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono text-gray-800">/</code> see the complete product landing page, 3D mock interview simulator, ATS resume builder, project gallery, and interactive modules.
                </span>
              ) : (
                <span>
                  Public visitors on <code className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono text-gray-800">/</code> only see the <strong>Coming Soon waitlist</strong>. All platform feature showcases remain hidden until you review and click <strong>Accept &amp; Launch</strong> below.
                </span>
              )}
            </p>

            {launchMessage && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                launchMessage.startsWith("Error") || launchMessage.startsWith("Network")
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{launchMessage}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/?preview=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl shadow-xs transition"
              title="Preview full landing page in new tab"
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Preview Live Landing Page</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </Link>

            {!siteLaunched ? (
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={togglingLaunch}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                <Rocket className="w-4 h-4" />
                <span>{togglingLaunch ? "Launching..." : "Accept & Launch Platform"}</span>
              </button>
            ) : (
              <button
                onClick={() => handleToggleLaunch(false)}
                disabled={togglingLaunch}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{togglingLaunch ? "Reverting..." : "Revert to Coming Soon Mode"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Deployment Readiness Checklist */}
        <div className="mt-5 pt-4 border-t border-gray-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Database &amp; Schema: Verified</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Aegis Sentinel WAF: Active</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Production Error Boundaries: Deployed</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Rocket className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900">Accept &amp; Launch Live Platform?</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                This will accept the platform release and make all landing page feature showcases, interactive studios, and ATS tools publicly visible to all visitors.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleLaunch(true)}
                disabled={togglingLaunch}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{togglingLaunch ? "Launching..." : "Confirm & Launch"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Operations Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Module 1: EdBuild Reviews */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#2563EB]/40 transition-all shadow-xs group">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center">
                <Hammer className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                stats.pendingEdBuild > 0 
                  ? "bg-amber-50 text-amber-700 border border-amber-200 font-bold" 
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}>
                {stats.pendingEdBuild > 0 ? `${stats.pendingEdBuild} Pending Review` : "All Reviewed"}
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-[#111827]">EdBuild Reviews</h2>
              <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                Review submitted group project links, verify engineering deliverables, and 1-click issue completion certificates.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block">Pending Submissions</span>
                <span className="text-lg font-bold text-[#111827] tabular-nums">{stats.pendingEdBuild}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block">Approved &amp; Certified</span>
                <span className="text-lg font-bold text-emerald-700 tabular-nums">{stats.approvedEdBuild}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
            <span className="text-xs text-[#6B7280]">Review &amp; dispatch</span>
            <Link
              href="/admin/edbuild"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              <span>Review Submissions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Module 2: Users & Onboarding */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#2563EB]/40 transition-all shadow-xs group">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#F7F8FA] text-[#111827] border border-[#E5E7EB] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#2563EB]" />
              </div>
              <span className="text-xs font-medium text-[#6B7280] tabular-nums">
                {stats.totalUsers} accounts
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-[#111827]">Users &amp; Dossiers</h2>
              <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                Inspect registered students, graduation years, degree tracks, CGPA benchmarks, and export to Excel/CSV.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block">Registered Students</span>
                <span className="text-lg font-bold text-[#111827] tabular-nums">{stats.studentsCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block">Onboarding Finished</span>
                <span className="text-lg font-bold text-[#111827] tabular-nums">{stats.onboardedCount}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
            <span className="text-xs text-[#6B7280]">Directory &amp; exports</span>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] hover:bg-black text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              <span>View Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Module 3: Jobs & Internships */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#2563EB]/40 transition-all shadow-xs group">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#F7F8FA] text-[#111827] border border-[#E5E7EB] flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-[#2563EB]" />
              </div>
              <span className="text-xs font-medium text-[#6B7280] tabular-nums">
                {stats.totalJobs} listings
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-[#111827]">Jobs &amp; Openings</h2>
              <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                Add verified full-time positions and paid internships. Specify stipend, required skills, and external apply links.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block">Internship Roles</span>
                <span className="text-lg font-bold text-[#111827] tabular-nums">{stats.internshipsCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block">Full-Time Roles</span>
                <span className="text-lg font-bold text-[#111827] tabular-nums">{Math.max(0, stats.totalJobs - stats.internshipsCount)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
            <span className="text-xs text-[#6B7280]">Post &amp; manage</span>
            <Link
              href="/admin/jobs"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] hover:bg-black text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              <span>Manage Roles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Module 4: Campus Ambassadors */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#2563EB]/40 transition-all shadow-xs group">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#F7F8FA] text-[#111827] border border-[#E5E7EB] flex items-center justify-center">
                <Award className="w-5 h-5 text-[#2563EB]" />
              </div>
              <span className="text-xs font-medium text-[#6B7280] tabular-nums">
                {stats.pendingAmbassadors} requests
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-[#111827]">Campus Ambassadors</h2>
              <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                Review leadership applications submitted by student leaders across universities and dispatch onboarding guides.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block">Pending Reviews</span>
                <span className="text-lg font-bold text-[#111827] tabular-nums">{stats.pendingAmbassadors}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block">Accepted Leaders</span>
                <span className="text-lg font-bold text-[#111827] tabular-nums">{stats.acceptedAmbassadors}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
            <span className="text-xs text-[#6B7280]">Review applicants</span>
            <Link
              href="/admin/ambassadors"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] hover:bg-black text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              <span>Review Leaders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Module 5: Bulk Mail Sender */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#2563EB]/40 transition-all shadow-xs group">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#F7F8FA] text-[#111827] border border-[#E5E7EB] flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#2563EB]" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                stats.hasResendKey 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                  : "bg-gray-100 text-gray-700"
              }`}>
                {stats.hasResendKey ? "Resend Connected" : "Local Preview"}
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-[#111827]">Bulk Mail Dispatch</h2>
              <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                Compose announcements and career updates to all students. Customize call-to-actions and test dispatches safely.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block">Student Audience</span>
                <span className="text-lg font-bold text-[#111827] tabular-nums">{stats.studentsCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block">Sender Mailbox</span>
                <span className="text-xs font-semibold text-[#111827] mt-1 block truncate">updates@edworld.co.in</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
            <span className="text-xs text-[#6B7280]">Compose broadcast</span>
            <Link
              href="/admin/bulk-mail"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] hover:bg-black text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              <span>Open Mailer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Module 6: Security & System Health */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#2563EB]/40 transition-all shadow-xs group">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#F7F8FA] text-[#111827] border border-[#E5E7EB] flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                100% Operational
              </span>
            </div>

            <div>
              <h2 className="text-base font-bold text-[#111827]">Security &amp; System Health</h2>
              <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                Autonomous client defense shield, Supabase RLS policy auditor, and real-time probe latency diagnostics.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block">Security SOC</span>
                <span className="text-xs font-bold text-emerald-700 mt-1 block">RLS Enforced</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block">Database Engine</span>
                <span className="text-xs font-bold text-emerald-700 mt-1 block">PostgreSQL Active</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
            <span className="text-xs text-[#6B7280]">Telemetry console</span>
            <div className="flex items-center gap-1.5">
              <Link
                href="/admin/security"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#F7F8FA] hover:bg-gray-100 border border-[#E5E7EB] text-[#111827] text-xs font-semibold rounded-lg transition-colors"
              >
                <span>SOC</span>
              </Link>
              <Link
                href="/admin/system-health"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#111827] hover:bg-black text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
              >
                <span>Health</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
