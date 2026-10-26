"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Hammer, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Users, 
  Mail, 
  Phone, 
  Github, 
  Globe, 
  Clock, 
  Award, 
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  FileText,
  Download
} from "lucide-react";
import { downloadEdbuildGroupsAsCsv } from "@/lib/excel-export";

interface Member {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface EdbuildGroup {
  id: string;
  project_name: string;
  problem_statement: string;
  access_type: "public" | "private";
  team_size: number;
  current_members_count: number;
  status: "OPEN" | "FULL" | "IN_PROGRESS" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  leader_name: string;
  leader_email: string;
  leader_phone?: string;
  submission_link?: string;
  submission_demo_url?: string;
  submission_notes?: string;
  submitted_at?: string;
  created_at: string;
  members: Member[];
}

export default function AdminEdbuildPage() {
  const [pendingGroups, setPendingGroups] = useState<EdbuildGroup[]>([]);
  const [allGroups, setAllGroups] = useState<EdbuildGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"pending" | "all" | "approved">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ groupId: string; message: string; type: "success" | "error" } | null>(null);
  const [rejectModalGroupId, setRejectModalGroupId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/edbuild");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setPendingGroups(json.pendingGroups || []);
          setAllGroups(json.allGroups || []);
        }
      }
    } catch (e) {
      console.error("Failed to fetch edbuild admin submissions:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (groupId: string, projectName: string) => {
    if (!confirm(`Are you sure you want to approve "${projectName}"? This will automatically generate certificates and email every student on the team.`)) {
      return;
    }

    setActionLoadingId(groupId);
    setActionFeedback(null);
    try {
      const res = await fetch("/api/admin/edbuild/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          decision: "accept",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionFeedback({
          groupId,
          message: `Approved! ${data.certificatesIssued || 0} certificates generated and sent to teammates.`,
          type: "success",
        });
        await fetchData();
      } else {
        setActionFeedback({
          groupId,
          message: data.error || "Failed to approve project submission.",
          type: "error",
        });
      }
    } catch (err: any) {
      setActionFeedback({
        groupId,
        message: err.message || "Network error approving submission.",
        type: "error",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModalGroupId) return;
    setActionLoadingId(rejectModalGroupId);
    try {
      const res = await fetch("/api/admin/edbuild/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId: rejectModalGroupId,
          decision: "reject",
          adminNotes: rejectReason.trim() || "Submission requires further revisions.",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionFeedback({
          groupId: rejectModalGroupId,
          message: "Project marked as rejected. Feedback posted to the group room.",
          type: "success",
        });
        setRejectModalGroupId(null);
        setRejectReason("");
        await fetchData();
      } else {
        alert(data.error || "Failed to reject submission.");
      }
    } catch (e) {
      alert("Failed to submit rejection feedback.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const displayedGroups = (
    filterTab === "pending"
      ? pendingGroups
      : filterTab === "approved"
      ? allGroups.filter((g) => g.status === "APPROVED")
      : allGroups
  ).filter((g) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      g.project_name.toLowerCase().includes(q) ||
      g.problem_statement.toLowerCase().includes(q) ||
      g.leader_name.toLowerCase().includes(q) ||
      g.leader_email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold">
              <Hammer className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">EdBuild Project Reviews</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Review student project submissions, inspect GitHub repositories, and issue official completion certificates.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => downloadEdbuildGroupsAsCsv(allGroups)}
            disabled={allGroups.length === 0}
            className="btn-secondary text-xs flex items-center gap-1.5 cursor-pointer"
            title="Download CSV report of all EdBuild teams and submissions"
          >
            <Download className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchData}
            disabled={loading}
            className="btn-secondary text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#6B7280]">Pending Submissions</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-[#111827] mt-2">{pendingGroups.length}</div>
          <span className="text-[11px] text-[#6B7280] mt-0.5 block">Awaiting admin review &amp; certification</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#6B7280]">Approved Projects</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#111827] mt-2">
            {allGroups.filter((g) => g.status === "APPROVED").length}
          </div>
          <span className="text-[11px] text-[#6B7280] mt-0.5 block">Successfully completed and certified</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#6B7280]">Total Groups Created</span>
            <Users className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-bold text-[#111827] mt-2">{allGroups.length}</div>
          <span className="text-[11px] text-[#6B7280] mt-0.5 block">Public &amp; private student teams</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg">
          <button
            onClick={() => setFilterTab("pending")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterTab === "pending"
                ? "bg-white text-[#111827] shadow-xs border border-[#E5E7EB]"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <span>Needs Review</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px]">
              {pendingGroups.length}
            </span>
          </button>
          <button
            onClick={() => setFilterTab("approved")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              filterTab === "approved"
                ? "bg-white text-[#111827] shadow-xs border border-[#E5E7EB]"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              filterTab === "all"
                ? "bg-white text-[#111827] shadow-xs border border-[#E5E7EB]"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            All Groups
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or team leaders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs text-[#111827] placeholder-[#6B7280] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#6B7280] bg-white border border-[#E5E7EB] rounded-xl">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#2563EB] mb-2" />
          Loading project submissions...
        </div>
      ) : displayedGroups.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#E5E7EB] rounded-xl">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-[#111827]">No submissions in this view</h3>
          <p className="text-xs text-[#6B7280] mt-1">
            {filterTab === "pending"
              ? "All student submissions have been reviewed! Check back when new projects are submitted."
              : "No projects match your current filter query."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedGroups.map((group) => {
            const isPending = group.status === "PENDING_REVIEW";
            const isApproved = group.status === "APPROVED";
            const isActionBusy = actionLoadingId === group.id;

            return (
              <div
                key={group.id}
                className="p-5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs space-y-4 transition-all hover:border-gray-300"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-[#111827]">{group.project_name}</h2>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                          isApproved
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : isPending
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-[#F7F8FA] text-[#6B7280] border-[#E5E7EB]"
                        }`}
                      >
                        {group.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F7F8FA] text-[#6B7280] border border-[#E5E7EB]">
                        {group.access_type.toUpperCase()} GROUP &bull; {group.current_members_count}/{group.team_size} members
                      </span>
                    </div>

                    <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                      <strong className="text-[#111827] font-medium">Problem Statement:</strong> {group.problem_statement}
                    </p>
                  </div>

                  <Link
                    href={`/edbuild/${group.id}`}
                    target="_blank"
                    className="btn-secondary text-xs flex items-center gap-1.5 self-start shrink-0"
                  >
                    <span>Open Workspace</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#6B7280]" />
                  </Link>
                </div>

                {/* Submission Links & Notes */}
                {(group.submission_link || group.submission_demo_url || group.submission_notes) && (
                  <div className="p-3.5 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] space-y-2">
                    <div className="flex items-center gap-4 flex-wrap">
                      {group.submission_link && (
                        <a
                          href={group.submission_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>View Code Repository</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      {group.submission_demo_url && (
                        <a
                          href={group.submission_demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>View Live Demo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      {group.submitted_at && (
                        <span className="text-[11px] text-[#6B7280] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Submitted on {new Date(group.submitted_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {group.submission_notes && (
                      <div className="text-xs text-[#111827] pt-1 border-t border-[#E5E7EB]/60">
                        <span className="font-semibold text-[#6B7280] block text-[11px] uppercase tracking-wider mb-0.5">
                          Student Submission Notes:
                        </span>
                        <p className="whitespace-pre-wrap">{group.submission_notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Team Members Roster */}
                <div>
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">
                    Team Members ({group.members.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {group.members.map((m) => (
                      <div
                        key={m.user_id}
                        className="p-2.5 rounded-lg border border-[#E5E7EB] bg-white flex items-start justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-[#111827] truncate">{m.name}</span>
                            {m.role === "leader" && (
                              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">
                                LEADER
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#6B7280] truncate flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span className="truncate">{m.email}</span>
                          </div>
                        </div>

                        <Link
                          href={`/portfolio/${m.user_id}`}
                          target="_blank"
                          className="text-[10px] text-[#2563EB] hover:underline shrink-0"
                        >
                          Portfolio &rarr;
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Feedback Banner */}
                {actionFeedback && actionFeedback.groupId === group.id && (
                  <div
                    className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                      actionFeedback.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {actionFeedback.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{actionFeedback.message}</span>
                  </div>
                )}

                {/* Decision Actions */}
                <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-xs text-[#6B7280]">
                    Project ID: <code className="font-mono text-[11px] text-[#111827]">{group.id}</code>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setRejectModalGroupId(group.id)}
                          disabled={isActionBusy}
                          className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-rose-50 hover:text-rose-600 text-xs font-medium text-[#6B7280] transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Request Revisions
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApprove(group.id, group.project_name)}
                          disabled={isActionBusy}
                          className="btn-primary text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isActionBusy ? "Issuing Certificates..." : "Accept & Issue Certificates"}</span>
                        </button>
                      </>
                    ) : isApproved ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accepted &bull; Certificates Issued</span>
                      </div>
                    ) : (
                      <span className="text-xs text-[#6B7280]">Group in development</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalGroupId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
              <h3 className="text-sm font-bold text-[#111827]">Request Project Revisions</h3>
              <button
                onClick={() => setRejectModalGroupId(null)}
                className="text-[#6B7280] hover:text-[#111827] text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-[#6B7280]">
              Explain what the team needs to fix or improve (e.g. broken demo link, missing test coverage, README instructions).
            </p>

            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Please deploy the live demo to Vercel/Render and ensure the GitHub repository has a public README."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalGroupId(null)}
                className="btn-secondary text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={actionLoadingId !== null}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                Send Revision Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
