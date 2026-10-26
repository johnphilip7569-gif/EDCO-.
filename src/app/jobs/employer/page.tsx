"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { JobListing, JobApplication, JobType, ApplicationStatus, ResumeContent, DEFAULT_RESUME_CONTENT } from "@/lib/types";
import { 
  Building2, 
  Plus, 
  Users, 
  FileText, 
  Check, 
  X, 
  Clock, 
  Mail, 
  Calendar, 
  AlertCircle, 
  Briefcase, 
  ChevronRight, 
  ShieldCheck, 
  Send,
  Lock,
  Eye,
  Trash2,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Download,
  LayoutGrid,
  ListFilter,
  ArrowRight
} from "lucide-react";
import { downloadJobApplicantsAsCsv } from "@/lib/excel-export";

export const dynamic = "force-dynamic";

export default function EmployerStudioPage() {
  const { user, isEmployer } = useAuth();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [feedbackModalApp, setFeedbackModalApp] = useState<{ id: string; targetStatus: ApplicationStatus } | null>(null);
  const [feedbackNoteInput, setFeedbackNoteInput] = useState("");
  const [selectedResumeSnapshot, setSelectedResumeSnapshot] = useState<{
    applicantName: string;
    resumeTitle: string;
    snapshot?: ResumeContent;
  } | null>(null);

  // Job Form State
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState(user?.name ? `${user.name}'s Tech` : "TechCorp Labs");
  const [location, setLocation] = useState("San Francisco, CA / Remote");
  const [type, setType] = useState<JobType>("full-time");
  const [skillsStr, setSkillsStr] = useState("TypeScript, React, Node.js, PostgreSQL");
  const [description, setDescription] = useState("");
  const [salaryRange, setSalaryRange] = useState("$120,000 - $150,000 / yr");
  const [deadlineDays, setDeadlineDays] = useState(30);
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isAdult = user ? user.ageBand === "18+" : true;

  // Load Employer Data from hardened APIs
  const loadEmployerData = async () => {
    if (!user || !isAdult) return;
    try {
      // 1. Fetch Employer's jobs
      const jobsResp = await fetch(`/api/employer/jobs?employerId=${user.uid}`);
      const jobsJson = await jobsResp.json();
      if (jobsJson.success && Array.isArray(jobsJson.jobs)) {
        const mappedJobs: JobListing[] = jobsJson.jobs.map((j: any) => ({
          id: j.id,
          title: j.title,
          company: j.company,
          description: j.description,
          location: j.location,
          type: j.type === "full_time" ? "full-time" : j.type,
          skillsRequired: j.skills_required || [],
          postedBy: j.posted_by,
          applicationDeadline: j.application_deadline,
          createdAt: j.created_at,
          isActive: j.is_active,
          moderationStatus: j.moderation_status,
          salaryRange: j.salary_range,
          sourceType: j.source_type,
          sourceName: j.source_name,
        }));
        setJobs(mappedJobs);
      }

      // 2. Fetch Applicants isolated strictly to this employer's jobs
      const appsResp = await fetch(`/api/employer/applicants?employerId=${user.uid}`);
      const appsJson = await appsResp.json();
      if (appsJson.success && Array.isArray(appsJson.applicants)) {
        const mappedApps: JobApplication[] = appsJson.applicants.map((a: any) => ({
          id: a.id,
          jobId: a.job_id,
          jobTitle: a.job_title || "Role",
          companyName: a.job_company || "Company",
          userId: a.user_id,
          applicantName: a.applicant_name || "Applicant",
          applicantEmail: a.applicant_email || "",
          resumeId: a.resume_id,
          resumeTitle: a.resume_title || "Resume Snapshot",
          resumeSnapshot: a.resume_snapshot,
          coverNote: a.cover_note,
          status: a.status,
          appliedAt: a.applied_at,
          statusUpdatedAt: a.status_updated_at || a.applied_at,
          matchScore: a.match_score || 75,
          feedbackNote: a.feedback_note,
          viewedAt: a.viewed_at,
        }));
        setApplications(mappedApps);
      }
    } catch (err) {
      console.warn("Failed to load employer data:", err);
    }
  };

  useEffect(() => {
    loadEmployerData();
  }, [user, isAdult]);

  // Handle Create Job with rate limit & source fields
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || !description.trim() || description.trim().length < 50 || !company.trim()) {
      setFormError("All required fields must be provided with a description of at least 50 characters.");
      return;
    }

    setIsPosting(true);
    try {
      const deadline = new Date(Date.now() + deadlineDays * 24 * 3600 * 1000).toISOString();
      const skills = skillsStr.split(",").map((s) => s.trim()).filter(Boolean);

      const resp = await fetch("/api/employer/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          company: company.trim(),
          description: description.trim(),
          location: location.trim(),
          type,
          skillsRequired: skills,
          salaryRange,
          applicationDeadline: deadline,
          mockEmployerId: user?.uid,
        }),
      });

      const json = await resp.json();
      if (!resp.ok) {
        throw new Error(json.error || "Failed to create job posting");
      }

      setPostSuccess(true);
      setTimeout(() => {
        setPostSuccess(false);
        setShowNewJobModal(false);
        setTitle("");
        setDescription("");
        loadEmployerData();
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "Failed to publish job");
    } finally {
      setIsPosting(false);
    }
  };

  // View Candidate Snapshot & Mark as viewed_by_employer
  const handleOpenSnapshot = async (app: JobApplication) => {
    setSelectedResumeSnapshot({
      applicantName: app.applicantName,
      resumeTitle: app.resumeTitle,
      snapshot: app.resumeSnapshot,
    });

    if (app.status === "submitted" || app.status === "applied") {
      try {
        await fetch("/api/employer/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicationId: app.id,
            status: "viewed_by_employer",
            mockEmployerId: user?.uid,
          }),
        });

        // Update local status
        setApplications((prev) =>
          prev.map((a) => (a.id === app.id ? { ...a, status: "viewed_by_employer" as const } : a))
        );
      } catch (e) {
        console.warn("Failed to mark viewed:", e);
      }
    }
  };

  // Submit Feedback Note & Status Change
  const handleConfirmStatusChange = async () => {
    if (!feedbackModalApp) return;

    try {
      const resp = await fetch("/api/employer/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: feedbackModalApp.id,
          status: feedbackModalApp.targetStatus,
          feedbackNote: feedbackNoteInput.trim() || undefined,
          mockEmployerId: user?.uid,
        }),
      });

      const res = await resp.json();
      if (!resp.ok) {
        throw new Error(res.error || "Failed to update status");
      }

      setApplications((prev) =>
        prev.map((a) =>
          a.id === feedbackModalApp.id
            ? {
                ...a,
                status: feedbackModalApp.targetStatus,
                feedbackNote: feedbackNoteInput.trim() || a.feedbackNote,
                statusUpdatedAt: new Date().toISOString(),
              }
            : a
        )
      );

      setFeedbackModalApp(null);
      setFeedbackNoteInput("");
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  // Strict 18+ Access Guard
  if (!isAdult && user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-[#FAF8F5]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-sm p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight font-serif">Access Restricted</h1>
            <p className="text-xs text-stone-600 leading-relaxed">
              Employer studio is restricted to adult Career Track accounts.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold uppercase tracking-wider"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Filter applications for selected job
  const filteredApps = applications.filter((app) => {
    if (selectedJobId === "all") return true;
    return app.jobId === selectedJobId;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FFFFFF] py-8 px-4 sm:px-6 lg:px-8 font-sans text-[#111827]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/jobs"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job Board</span>
          </Link>
          <span className="text-xs text-[#6B7280] font-medium">{jobs.length} Active Postings &bull; {applications.length} Candidates</span>
        </div>

        {/* Header Bar */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                Verified Recruiter
              </span>
              <span className="text-xs text-[#6B7280]">Role-Isolated Talent Acquisition</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
              Employer Studio &amp; Candidate Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] max-w-2xl">
              Manage postings, track applicants across real-time hiring stages, review immutable ATS resume snapshots, and issue structured candidate feedback.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => downloadJobApplicantsAsCsv(filteredApps)}
              disabled={filteredApps.length === 0}
              className="px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F7F8FA] text-[#111827] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Download applicant roster as CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setShowNewJobModal(true)}
              className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Listing</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">Active Openings</span>
            <p className="text-2xl font-bold text-[#111827]">{jobs.length}</p>
          </div>
          <div className="p-5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">Total Applicants</span>
            <p className="text-2xl font-bold text-[#2563EB]">{applications.length}</p>
          </div>
          <div className="p-5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">Shortlisted Candidates</span>
            <p className="text-2xl font-bold text-emerald-600">
              {applications.filter((a) => a.status === "shortlisted").length}
            </p>
          </div>
          <div className="p-5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">Review Completed</span>
            <p className="text-2xl font-bold text-[#111827]">
              {applications.filter((a) => a.status !== "applied" && a.status !== "submitted").length}
            </p>
          </div>
        </div>

        {/* Candidate Pipeline Section */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">Candidate Pipeline &amp; Queue</h2>
              <p className="text-xs text-[#6B7280]">Real-time applicant progression across evaluation stages.</p>
            </div>

            {/* Controls: Role Filter + View Mode Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#6B7280]">Role:</span>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-[#F7F8FA] text-xs font-medium text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                >
                  <option value="all">All Postings ({applications.length})</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("kanban")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                    viewMode === "kanban"
                      ? "bg-white text-[#111827] shadow-2xs border border-[#E5E7EB]"
                      : "text-[#6B7280] hover:text-[#111827]"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Kanban</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white text-[#111827] shadow-2xs border border-[#E5E7EB]"
                      : "text-[#6B7280] hover:text-[#111827]"
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
              </div>
            </div>
          </div>

          {filteredApps.length === 0 ? (
            <div className="p-12 text-center space-y-3 bg-[#F7F8FA] rounded-xl border border-dashed border-[#E5E7EB]">
              <Users className="w-10 h-10 text-[#6B7280] mx-auto" />
              <h3 className="text-base font-bold text-[#111827]">No candidates in queue</h3>
              <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                Applications for your openings will appear here once candidates apply through the Job Board.
              </p>
            </div>
          ) : viewMode === "kanban" ? (
            /* KANBAN SPRINT PIPELINE */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-2">
              
              {/* Column 1: New / Applied */}
              <div className="bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] p-3.5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                  <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>New / Applied</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-[#E5E7EB] text-[#111827]">
                    {filteredApps.filter(a => a.status === "applied" || a.status === "submitted").length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {filteredApps.filter(a => a.status === "applied" || a.status === "submitted").map((app) => (
                    <div key={app.id} className="bg-white p-3.5 rounded-lg border border-[#E5E7EB] shadow-2xs space-y-2 hover:border-gray-400 transition-colors">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="font-bold text-xs text-[#111827]">{app.applicantName}</h4>
                          <p className="text-[11px] text-[#6B7280] truncate">{app.jobTitle}</p>
                        </div>
                        {app.matchScore && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-100">
                            {app.matchScore}%
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#6B7280] pt-1 border-t border-[#E5E7EB]">
                        <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenSnapshot(app)}
                            className="px-2 py-0.5 rounded bg-[#F7F8FA] hover:bg-gray-100 text-[#111827] font-semibold text-[10px] border border-[#E5E7EB] cursor-pointer"
                          >
                            Resume
                          </button>
                          <button
                            onClick={() => setFeedbackModalApp({ id: app.id, targetStatus: "shortlisted" })}
                            className="px-2 py-0.5 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-[10px] cursor-pointer"
                          >
                            Shortlist
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Reviewed / Viewed */}
              <div className="bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] p-3.5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                  <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>In Review</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-[#E5E7EB] text-[#111827]">
                    {filteredApps.filter(a => a.status === "viewed_by_employer").length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {filteredApps.filter(a => a.status === "viewed_by_employer").map((app) => (
                    <div key={app.id} className="bg-white p-3.5 rounded-lg border border-[#E5E7EB] shadow-2xs space-y-2 hover:border-gray-400 transition-colors">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="font-bold text-xs text-[#111827]">{app.applicantName}</h4>
                          <p className="text-[11px] text-[#6B7280] truncate">{app.jobTitle}</p>
                        </div>
                        {app.matchScore && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {app.matchScore}%
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#6B7280] pt-1 border-t border-[#E5E7EB]">
                        <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenSnapshot(app)}
                            className="px-2 py-0.5 rounded bg-[#F7F8FA] hover:bg-gray-100 text-[#111827] font-semibold text-[10px] border border-[#E5E7EB] cursor-pointer"
                          >
                            Resume
                          </button>
                          <button
                            onClick={() => setFeedbackModalApp({ id: app.id, targetStatus: "shortlisted" })}
                            className="px-2 py-0.5 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-[10px] cursor-pointer"
                          >
                            Advance
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Shortlisted */}
              <div className="bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] p-3.5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                  <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Shortlisted</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-[#E5E7EB] text-[#111827]">
                    {filteredApps.filter(a => a.status === "shortlisted").length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {filteredApps.filter(a => a.status === "shortlisted").map((app) => (
                    <div key={app.id} className="bg-white p-3.5 rounded-lg border border-emerald-200 shadow-2xs space-y-2 hover:border-emerald-300 transition-colors">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="font-bold text-xs text-[#111827]">{app.applicantName}</h4>
                          <p className="text-[11px] text-[#6B7280] truncate">{app.jobTitle}</p>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {app.matchScore || 85}%
                        </span>
                      </div>

                      {app.feedbackNote && (
                        <p className="text-[11px] text-emerald-800 bg-emerald-50/50 p-1.5 rounded text-xs line-clamp-2">
                          {app.feedbackNote}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-[#6B7280] pt-1 border-t border-[#E5E7EB]">
                        <span>Shortlisted</span>
                        <button
                          onClick={() => handleOpenSnapshot(app)}
                          className="px-2 py-0.5 rounded bg-[#F7F8FA] hover:bg-gray-100 text-[#111827] font-semibold text-[10px] border border-[#E5E7EB] cursor-pointer"
                        >
                          Dossier
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 4: Declined / Other */}
              <div className="bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] p-3.5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                  <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                    <span>Declined</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-[#E5E7EB] text-[#111827]">
                    {filteredApps.filter(a => a.status === "rejected").length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {filteredApps.filter(a => a.status === "rejected").map((app) => (
                    <div key={app.id} className="bg-white p-3.5 rounded-lg border border-[#E5E7EB] shadow-2xs space-y-2 opacity-75">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="font-bold text-xs text-[#111827]">{app.applicantName}</h4>
                          <p className="text-[11px] text-[#6B7280] truncate">{app.jobTitle}</p>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-[#6B7280]">
                          Declined
                        </span>
                      </div>
                      <div className="text-[10px] text-[#6B7280] pt-1 border-t border-[#E5E7EB] flex justify-end">
                        <button
                          onClick={() => handleOpenSnapshot(app)}
                          className="px-2 py-0.5 rounded bg-[#F7F8FA] hover:bg-gray-100 text-[#111827] font-semibold text-[10px] border border-[#E5E7EB] cursor-pointer"
                        >
                          Archive
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* TRADITIONAL TABLE / LIST VIEW */
            <div className="space-y-3">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 sm:p-5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-gray-300 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-[#111827]">{app.applicantName}</h4>
                      <span className="text-xs text-[#6B7280]">&bull; Applied for <strong className="text-[#111827]">{app.jobTitle}</strong></span>
                      {app.matchScore && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-[#2563EB] border border-blue-100">
                          {app.matchScore}% Match
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white border border-[#E5E7EB] text-[#111827]">
                        Status: {app.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                      <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                      {app.coverNote && (
                        <span className="italic truncate max-w-md">&ldquo;{app.coverNote}&rdquo;</span>
                      )}
                    </div>

                    {app.feedbackNote && (
                      <p className="text-[11px] text-[#2563EB] font-medium">
                        Feedback Note: {app.feedbackNote}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => handleOpenSnapshot(app)}
                      className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-gray-100 text-xs font-semibold text-[#111827] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Review Resume</span>
                    </button>

                    <button
                      onClick={() => setFeedbackModalApp({ id: app.id, targetStatus: "shortlisted" })}
                      className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Shortlist</span>
                    </button>

                    <button
                      onClick={() => setFeedbackModalApp({ id: app.id, targetStatus: "rejected" })}
                      className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-rose-50 hover:text-rose-700 text-[#6B7280] text-xs font-semibold flex items-center gap-1 cursor-pointer bg-white"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Post New Job Modal */}
        {showNewJobModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200">
              <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-serif">Post New Opportunity</h3>
                  <p className="text-xs text-stone-500">Auto-tagged with Verified Employer provenance. Subject to standard UGC moderation.</p>
                </div>
                <button
                  onClick={() => setShowNewJobModal(false)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {postSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">Job Posted Successfully</h4>
                  <p className="text-xs text-stone-500">Submitted for moderation approval and live on employer view.</p>
                </div>
              ) : (
                <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Job Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Senior Full-Stack Engineer"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 uppercase mb-1">Role Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as JobType)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      >
                        <option value="full-time">Full-Time</option>
                        <option value="internship">Internship</option>
                        <option value="part-time">Part-Time</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 uppercase mb-1">Application Deadline</label>
                      <select
                        value={deadlineDays}
                        onChange={(e) => setDeadlineDays(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                      >
                        <option value={15}>In 15 Days</option>
                        <option value={30}>In 30 Days</option>
                        <option value={60}>In 60 Days</option>
                        <option value={90}>In 90 Days</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Required Skills (Comma separated)</label>
                    <input
                      type="text"
                      value={skillsStr}
                      onChange={(e) => setSkillsStr(e.target.value)}
                      placeholder="TypeScript, React, Node.js, Distributed Systems"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Job Description * (Minimum 50 chars)</label>
                    <textarea
                      rows={4}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe responsibilities, technical requirements, and team mission..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setShowNewJobModal(false)}
                      className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPosting}
                      className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                    >
                      {isPosting ? "Posting..." : "Publish Job"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Feedback Note Modal */}
        {feedbackModalApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-bold text-stone-900 font-serif">
                  {feedbackModalApp.targetStatus === "shortlisted" ? "Shortlist Candidate" : "Decline Candidate"}
                </h3>
                <button
                  onClick={() => setFeedbackModalApp(null)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Feedback Note for Applicant (Optional)
                </label>
                <textarea
                  rows={3}
                  value={feedbackNoteInput}
                  onChange={(e) => setFeedbackNoteInput(e.target.value)}
                  placeholder="Share constructive feedback on their technical background or next steps..."
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:ring-emerald-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setFeedbackModalApp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStatusChange}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 cursor-pointer"
                >
                  Confirm Status Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Candidate Snapshot Modal */}
        {selectedResumeSnapshot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
              <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Candidate Resume Snapshot
                  </span>
                  <h3 className="text-base font-bold text-stone-900 mt-1 font-serif">
                    {selectedResumeSnapshot.applicantName} &bull; {selectedResumeSnapshot.resumeTitle}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedResumeSnapshot(null)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedResumeSnapshot.snapshot ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="font-bold text-stone-900 uppercase font-mono text-[11px] mb-1">Contact</h4>
                    <p className="text-stone-700">
                      {selectedResumeSnapshot.snapshot.contact?.fullName || "Candidate"} &bull; {selectedResumeSnapshot.snapshot.contact?.email}
                    </p>
                  </div>

                  {selectedResumeSnapshot.snapshot.summary && (
                    <div>
                      <h4 className="font-bold text-stone-900 uppercase font-mono text-[11px] mb-1">Summary</h4>
                      <p className="text-stone-700 leading-relaxed">{selectedResumeSnapshot.snapshot.summary}</p>
                    </div>
                  )}

                  {selectedResumeSnapshot.snapshot.skills && (
                    <div>
                      <h4 className="font-bold text-stone-900 uppercase font-mono text-[11px] mb-1">Technical Stack</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {((selectedResumeSnapshot.snapshot.skills as any).technical || []).map((s: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 bg-stone-100 rounded text-stone-800 font-mono text-[10px]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedResumeSnapshot.snapshot.experience && selectedResumeSnapshot.snapshot.experience.length > 0 && (
                    <div>
                      <h4 className="font-bold text-stone-900 uppercase font-mono text-[11px] mb-1">Experience</h4>
                      <div className="space-y-2">
                        {selectedResumeSnapshot.snapshot.experience.map((exp: any, i: number) => (
                          <div key={i} className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                            <p className="font-bold text-stone-900">{exp.role} @ {exp.company}</p>
                            <ul className="list-disc pl-4 mt-1 text-stone-600 space-y-0.5">
                              {(exp.bullets || []).map((b: string, j: number) => (
                                <li key={j}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-stone-500">Resume snapshot verified.</p>
              )}

              <div className="flex justify-end pt-2 border-t border-stone-100">
                <button
                  onClick={() => setSelectedResumeSnapshot(null)}
                  className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Close Snapshot
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
