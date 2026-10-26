"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { 
  Award, 
  Search, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Video, 
  Send, 
  Building2, 
  X, 
  AlertCircle, 
  Users, 
  RefreshCw,
  Download
} from "lucide-react";
import { downloadAmbassadorsAsCsv } from "@/lib/excel-export";

interface AmbassadorApplication {
  id: string;
  user_id: string;
  college_name: string;
  why_ambassador: string;
  relevant_experience?: string;
  social_links?: {
    instagram?: string;
    linkedin?: string;
  };
  status: "pending" | "approved" | "rejected";
  created_at: string;
  users?: {
    name: string;
    email: string;
  };
}

interface AcceptedAmbassador {
  user_id: string;
  college_name: string;
  referral_code: string;
  is_active: boolean;
  joined_at: string;
  users?: {
    name: string;
    email: string;
  };
}

export default function AdminAmbassadorsManagementPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"requests" | "accepted" | "mailer">("requests");
  const [applications, setApplications] = useState<AmbassadorApplication[]>([]);
  const [ambassadors, setAmbassadors] = useState<AcceptedAmbassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Review modal
  const [reviewApp, setReviewApp] = useState<AmbassadorApplication | null>(null);
  const [reviewAction, setReviewAction] = useState<"approved" | "rejected">("approved");
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // 1-Click Meeting / Task Mailer Form State
  const [broadcastType, setBroadcastType] = useState<"meeting" | "task">("meeting");
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("https://meet.google.com/");
  const [agenda, setAgenda] = useState("");
  const [sendTestOnly, setSendTestOnly] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastFeedback, setBroadcastFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ambassador/admin?status=all");
      const data = await res.json();
      if (data.applications) setApplications(data.applications);
      if (data.ambassadors) setAmbassadors(data.ambassadors);
    } catch (err) {
      console.error("Failed to load ambassador data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReviewSubmit = async () => {
    if (!reviewApp) return;

    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/ambassador/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: reviewApp.id,
          reviewerId: user?.uid,
          action: reviewAction,
          reviewNotes: reviewNotes.trim() || null,
        }),
      });

      if (res.ok) {
        setReviewApp(null);
        setReviewNotes("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleOneClickBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) return;

    setBroadcasting(true);
    setBroadcastFeedback(null);
    try {
      const res = await fetch("/api/admin/ambassadors/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: broadcastType,
          title: broadcastTitle.trim(),
          scheduledAt: scheduledAt.trim() || undefined,
          meetingUrl: broadcastType === "meeting" ? meetingUrl.trim() : undefined,
          agenda: agenda.trim(),
          sendTestToAdmin: sendTestOnly,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBroadcastFeedback({
          success: true,
          message: `Successfully dispatched to ${data.deliveredToCount} ambassador(s) via Resend!`,
        });
        setBroadcastTitle("");
        setAgenda("");
      } else {
        setBroadcastFeedback({
          success: false,
          message: data.error || "Broadcast delivery failed.",
        });
      }
    } catch (err: any) {
      setBroadcastFeedback({
        success: false,
        message: err.message || "Failed to trigger broadcast.",
      });
    } finally {
      setBroadcasting(false);
    }
  };

  const pendingRequests = applications.filter((a) => a.status === "pending");
  const filteredRequests = pendingRequests.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.college_name.toLowerCase().includes(q) ||
      a.users?.name?.toLowerCase().includes(q) ||
      a.users?.email?.toLowerCase().includes(q) ||
      a.why_ambassador.toLowerCase().includes(q)
    );
  });

  const filteredAccepted = ambassadors.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.college_name.toLowerCase().includes(q) ||
      a.referral_code.toLowerCase().includes(q) ||
      a.users?.name?.toLowerCase().includes(q) ||
      a.users?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Student Community Leadership</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
              Campus Ambassadors Hub
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Review student applications, manage verified campus leaders, and dispatch meeting or task emails in one click.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const dataset = activeTab === "accepted" 
                  ? ambassadors.map(a => ({ ...a, name: a.users?.name || "N/A", email: a.users?.email || "N/A", status: a.is_active ? "ACTIVE" : "INACTIVE" }))
                  : applications.map(app => ({ ...app, name: app.users?.name || "N/A", email: app.users?.email || "N/A" }));
                downloadAmbassadorsAsCsv(dataset, activeTab === "accepted" ? "edworld_accepted_ambassadors" : "edworld_ambassador_applications");
              }}
              disabled={loading || (activeTab === "accepted" ? ambassadors.length === 0 : applications.length === 0)}
              className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] hover:bg-[#F7F8FA] text-[#111827] text-xs font-semibold transition-all flex items-center gap-1.5 bg-white cursor-pointer"
              title="Download CSV report of ambassadors and applications"
            >
              <Download className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] hover:bg-[#F7F8FA] text-[#111827] text-xs font-semibold transition-all flex items-center gap-1.5 bg-white cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setActiveTab("mailer")}
              className="btn-primary flex items-center gap-2 cursor-pointer text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>1-Click Mailer</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-[#E5E7EB] overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "requests"
                ? "bg-[#2563EB] text-white"
                : "bg-[#F7F8FA] text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <span>Student Requests</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono ${
              activeTab === "requests" ? "bg-white text-[#2563EB] font-bold" : "bg-[#E5E7EB] text-[#111827]"
            }`}>
              {pendingRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("accepted")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "accepted"
                ? "bg-[#2563EB] text-white"
                : "bg-[#F7F8FA] text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <span>Accepted Ambassadors</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono ${
              activeTab === "accepted" ? "bg-white text-[#2563EB] font-bold" : "bg-[#E5E7EB] text-[#111827]"
            }`}>
              {ambassadors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("mailer")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "mailer"
                ? "bg-[#2563EB] text-white"
                : "bg-[#F7F8FA] text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>1-Click Task &amp; Meeting Mailer</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PENDING STUDENT REQUESTS */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search applications by student name, college, email, or motivation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#2563EB] text-xs font-medium text-[#111827] bg-white"
            />
          </div>

          {loading ? (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl text-center py-16 space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#2563EB] mx-auto" />
              <p className="text-xs text-[#6B7280]">Loading student applications...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl text-center py-16 space-y-2 shadow-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-semibold text-[#111827]">No pending student requests.</p>
              <p className="text-xs text-[#6B7280]">All submitted campus ambassador applications have been reviewed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRequests.map((app) => (
                <div
                  key={app.id}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col justify-between hover:border-[#2563EB] transition-all shadow-xs space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] font-bold text-xs flex items-center justify-center shrink-0">
                          {(app.users?.name || "S").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#111827] text-sm">{app.users?.name || "Student"}</h3>
                          <p className="text-[#6B7280] text-[11px] font-mono">{app.users?.email}</p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        Pending Review
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-1 text-xs">
                      <div className="text-[10px] font-semibold text-[#6B7280] uppercase">College / Campus</div>
                      <div className="font-semibold text-[#111827] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#6B7280]" />
                        <span>{app.college_name}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="text-[10px] font-semibold text-[#6B7280] uppercase">Why Campus Ambassador?</div>
                      <p className="text-[#111827] leading-relaxed bg-[#F7F8FA] p-3 rounded-xl border border-[#E5E7EB] text-xs">
                        {app.why_ambassador}
                      </p>
                    </div>

                    {app.relevant_experience && (
                      <div className="space-y-1 text-xs">
                        <div className="text-[10px] font-semibold text-[#6B7280] uppercase">Leadership Experience</div>
                        <p className="text-[#6B7280] text-[11px] leading-relaxed">
                          {app.relevant_experience}
                        </p>
                      </div>
                    )}

                    {app.social_links && (app.social_links.linkedin || app.social_links.instagram) && (
                      <div className="flex items-center gap-2 pt-1 text-[11px]">
                        {app.social_links.linkedin && (
                          <a
                            href={app.social_links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2563EB] hover:underline font-medium flex items-center gap-1"
                          >
                            <span>LinkedIn</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {app.social_links.instagram && (
                          <span className="text-[#6B7280]">IG: {app.social_links.instagram}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-[10px] text-[#6B7280] font-mono">
                      Applied {new Date(app.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setReviewApp(app);
                          setReviewAction("rejected");
                        }}
                        className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-red-700 hover:border-red-200 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          setReviewApp(app);
                          setReviewAction("approved");
                        }}
                        className="btn-primary px-3.5 py-1.5 text-xs font-semibold cursor-pointer"
                      >
                        Accept &amp; Onboard
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACCEPTED AMBASSADORS */}
      {activeTab === "accepted" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search accepted leaders by name, college, or referral code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#2563EB] text-xs font-medium text-[#111827] bg-white"
            />
          </div>

          {filteredAccepted.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl text-center py-16 space-y-2 shadow-xs">
              <Users className="w-8 h-8 text-[#6B7280] mx-auto" />
              <p className="text-sm font-semibold text-[#111827]">No accepted ambassadors found.</p>
              <p className="text-xs text-[#6B7280]">Review pending requests to appoint your first campus ambassador.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAccepted.map((amb) => (
                <div
                  key={amb.user_id}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-3 hover:border-[#2563EB] transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-[#111827] text-base">{amb.users?.name || "Ambassador"}</h3>
                      <p className="text-xs text-[#6B7280] font-mono">{amb.users?.email}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Active Leader
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-1 text-xs">
                    <span className="text-[10px] font-semibold text-[#6B7280] uppercase block">College Campus</span>
                    <span className="font-semibold text-[#111827] block">{amb.college_name}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-1 text-xs">
                    <span className="text-[10px] font-semibold text-[#6B7280] uppercase block">Custom Referral Code</span>
                    <span className="font-mono font-bold text-[#2563EB] text-sm block tracking-wider">{amb.referral_code}</span>
                  </div>

                  <div className="pt-2 text-[10px] text-[#6B7280] font-mono">
                    Leader since {new Date(amb.joined_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: 1-CLICK TASK & MEETING MAILER */}
      {activeTab === "mailer" && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl mx-auto">
          <div className="space-y-1 border-b border-[#E5E7EB] pb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#2563EB]/10 text-[#2563EB] text-[10px] font-semibold uppercase tracking-wider">
              <Send className="w-3 h-3" />
              <span>Direct Ambassador Mailer</span>
            </div>
            <h2 className="text-xl font-bold text-[#111827] tracking-tight">
              Dispatch Task or Meeting to All Accepted Ambassadors
            </h2>
            <p className="text-xs text-[#6B7280]">
              Transmit a meeting invite or project assignment via Resend to every accepted student ambassador ({ambassadors.length} active recipients).
            </p>
          </div>

          {broadcastFeedback && (
            <div className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              broadcastFeedback.success 
                ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
                : "bg-red-50 border-red-200 text-red-900"
            }`}>
              {broadcastFeedback.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{broadcastFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handleOneClickBroadcast} className="space-y-4 text-xs">
            {/* Broadcast Type Selector */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setBroadcastType("meeting")}
                className={`flex-1 py-2 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  broadcastType === "meeting" ? "bg-[#2563EB] text-white" : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Schedule Team Meeting</span>
              </button>
              <button
                type="button"
                onClick={() => setBroadcastType("task")}
                className={`flex-1 py-2 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  broadcastType === "task" ? "bg-[#2563EB] text-white" : "text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Assign Campus Task</span>
              </button>
            </div>

            {/* Title / Topic */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">
                {broadcastType === "meeting" ? "Meeting Topic & Title *" : "Task Assignment Title *"}
              </label>
              <input
                type="text"
                required
                placeholder={broadcastType === "meeting" ? "e.g. Campus Growth & Hackathon Coordination" : "e.g. Distribute Tech Symposium Registration Posters"}
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] focus:outline-none focus:border-[#2563EB] text-xs font-medium text-[#111827]"
              />
            </div>

            {/* Scheduled Date/Time or Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">
                  {broadcastType === "meeting" ? "Session Date & Time" : "Task Due Date"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Saturday, 12 Oct at 5:00 PM IST"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] focus:outline-none focus:border-[#2563EB] text-xs font-medium text-[#111827]"
                />
              </div>

              {broadcastType === "meeting" ? (
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">Google Meet / Zoom URL</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/abc-defg-hij"
                    value={meetingUrl}
                    onChange={(e) => setMeetingUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] focus:outline-none focus:border-[#2563EB] text-xs font-medium text-[#111827]"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">Estimated Effort</label>
                  <input
                    type="text"
                    placeholder="e.g. 2-3 hours over the weekend"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] focus:outline-none focus:border-[#2563EB] text-xs font-medium text-[#111827]"
                  />
                </div>
              )}
            </div>

            {/* Agenda / Detailed Instructions */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">
                {broadcastType === "meeting" ? "Meeting Agenda & Coordinates" : "Task Description & Submission Instructions"}
              </label>
              <textarea
                rows={4}
                required
                placeholder="Detail the agenda points, action items, target deliverables, or materials required..."
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] focus:outline-none focus:border-[#2563EB] text-xs font-medium text-[#111827]"
              />
            </div>

            {/* Test Toggle */}
            <div className="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#111827] text-xs block">Admin Test Delivery Mode</span>
                <span className="text-[11px] text-[#6B7280]">Send only to master admin first to test formatting.</span>
              </div>
              <input
                type="checkbox"
                checked={sendTestOnly}
                onChange={(e) => setSendTestOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
              <span className="text-[11px] text-[#6B7280] font-mono">
                {sendTestOnly 
                  ? "Target: Admin Only" 
                  : `Target: All ${ambassadors.length} Accepted Ambassadors`}
              </span>

              <button
                type="submit"
                disabled={broadcasting}
                className="btn-primary flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {broadcasting 
                    ? "Dispatching Emails..." 
                    : sendTestOnly 
                    ? "Send Test Email to Admin" 
                    : `Send to All ${ambassadors.length} Accepted Ambassadors`}
                </span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* REVIEW APPLICATION MODAL */}
      {reviewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div 
            className="bg-white border border-[#E5E7EB] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  {reviewAction === "approved" ? "Accept Campus Ambassador" : "Decline Application"}
                </h3>
                <p className="text-xs text-[#6B7280]">
                  {reviewApp.users?.name} • {reviewApp.college_name}
                </p>
              </div>
              <button
                onClick={() => setReviewApp(null)}
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FA] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">
                  Review Notes / Welcoming Message
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    reviewAction === "approved"
                      ? "Congratulations on being accepted! You will receive your official campus referral code."
                      : "Reason for declining at this time..."
                  }
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] focus:outline-none focus:border-[#2563EB] text-xs font-medium text-[#111827]"
                />
              </div>

              {reviewAction === "approved" && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                  Upon approval, a unique campus referral code will automatically be assigned (e.g. <code>EDW-CAMPUS-XXXX</code>) and the student will unlock the full Ambassador Hub.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setReviewApp(null)}
                className="px-3.5 py-1.5 rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReviewSubmit}
                disabled={reviewSubmitting}
                className={`px-4 py-1.5 rounded-xl font-semibold text-xs text-white shadow-xs cursor-pointer ${
                  reviewAction === "approved"
                    ? "bg-[#2563EB] hover:bg-[#1D4ED8]"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {reviewSubmitting ? "Processing..." : `Confirm ${reviewAction === "approved" ? "Acceptance" : "Rejection"}`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
