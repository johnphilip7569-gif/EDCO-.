"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Calendar, 
  Sparkles,
  RefreshCw,
  Download,
  CheckSquare,
  Square,
  Check,
  Archive,
  SlidersHorizontal
} from "lucide-react";
import { downloadJobsAsCsv } from "@/lib/excel-export";

interface AdminRoleRecord {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  salary_range?: string;
  skills_required?: string[];
  description: string;
  application_deadline?: string;
  external_url?: string;
  created_at: string;
  is_active: boolean;
}

export default function AdminJobsManagementPage() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AdminRoleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "job" | "internship">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const [batchActionLoading, setBatchActionLoading] = useState(false);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = useState(false);
  
  // Add Role Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [roleType, setRoleType] = useState<"job" | "internship">("job");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("Hyderabad, Telangana / Remote");
  const [category, setCategory] = useState("Engineering");
  const [salaryRange, setSalaryRange] = useState("");
  const [skillsStr, setSkillsStr] = useState("TypeScript, React, Node.js");
  const [description, setDescription] = useState("");
  const [deadlineDays, setDeadlineDays] = useState(30);
  const [externalUrl, setExternalUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Delete Confirmation Modal
  const [deletingRole, setDeletingRole] = useState<AdminRoleRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/jobs");
      const data = await res.json();
      if (data.success && Array.isArray(data.roles)) {
        setRoles(data.roles);
      }
    } catch (err) {
      console.error("Failed to load roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) {
      setActionError("Title and Company name are required.");
      return;
    }

    setSubmitting(true);
    setActionError(null);
    try {
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + Number(deadlineDays));

      const payload = {
        title: title.trim(),
        company: company.trim(),
        location: location.trim(),
        type: roleType === "internship" ? "internship" : "full-time",
        category: category.trim(),
        salaryRange: salaryRange.trim() || (roleType === "internship" ? "₹25,000 / month" : "₹12 - ₹18 LPA"),
        skillsRequired: skillsStr.split(",").map(s => s.trim()).filter(Boolean),
        description: description.trim() || "Verified opening posted via EdWorld Admin Portal.",
        applicationDeadline: deadlineDate.toISOString(),
        externalUrl: externalUrl.trim() || null,
      };

      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Failed to create role.");
      } else {
        setActionSuccess(`Role "${title}" successfully published!`);
        setShowAddModal(false);
        // Reset form
        setTitle("");
        setCompany("");
        setSalaryRange("");
        setDescription("");
        setExternalUrl("");
        fetchRoles();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to post role.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!deletingRole) return;

    setIsDeleting(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/jobs?id=${deletingRole.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        setActionSuccess(`Role "${deletingRole.title}" deleted.`);
        setDeletingRole(null);
        fetchRoles();
        setTimeout(() => setActionSuccess(null), 3500);
      } else {
        setActionError(data.error || "Failed to delete role.");
      }
    } catch (err: any) {
      setActionError(err.message || "Network error while deleting role.");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectRole = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedJobIds.size === filteredRoles.length && filteredRoles.length > 0) {
      setSelectedJobIds(new Set());
    } else {
      setSelectedJobIds(new Set(filteredRoles.map((r) => r.id)));
    }
  };

  const handleBatchStatusUpdate = async (isActive: boolean) => {
    if (selectedJobIds.size === 0) return;
    setBatchActionLoading(true);
    setActionError(null);
    try {
      const ids = Array.from(selectedJobIds);
      const res = await fetch("/api/admin/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, is_active: isActive }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionSuccess(`Updated status for ${ids.length} role(s).`);
        setSelectedJobIds(new Set());
        fetchRoles();
        setTimeout(() => setActionSuccess(null), 3500);
      } else {
        setActionError(data.error || "Failed to update role status.");
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to batch update roles.");
    } finally {
      setBatchActionLoading(false);
    }
  };

  const handleBatchDeleteConfirm = async () => {
    if (selectedJobIds.size === 0) return;
    setBatchActionLoading(true);
    setActionError(null);
    try {
      const ids = Array.from(selectedJobIds);
      const res = await fetch("/api/admin/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionSuccess(`Successfully deleted ${ids.length} role(s).`);
        setSelectedJobIds(new Set());
        setShowBatchDeleteModal(false);
        fetchRoles();
        setTimeout(() => setActionSuccess(null), 3500);
      } else {
        setActionError(data.error || "Failed to delete selected roles.");
      }
    } catch (err: any) {
      setActionError(err.message || "Failed to batch delete roles.");
    } finally {
      setBatchActionLoading(false);
    }
  };

  const handleExportCsv = () => {
    downloadJobsAsCsv(filteredRoles);
  };

  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      const matchesSearch = 
        r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const isIntern = r.type?.toLowerCase().includes("intern");
      const matchesType = 
        filterType === "all" ||
        (filterType === "internship" && isIntern) ||
        (filterType === "job" && !isIntern);

      const matchesCategory = 
        filterCategory === "all" ||
        r.category?.toLowerCase() === filterCategory.toLowerCase();

      const matchesStatus = 
        filterStatus === "all" ||
        (filterStatus === "active" && r.is_active !== false) ||
        (filterStatus === "archived" && r.is_active === false);

      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    });
  }, [roles, searchQuery, filterType, filterCategory, filterStatus]);

  const internshipCount = roles.filter(r => r.type?.toLowerCase().includes("intern")).length;
  const jobCount = roles.length - internshipCount;
  const allSelected = filteredRoles.length > 0 && selectedJobIds.size === filteredRoles.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header Banner */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5 text-black" />
              <span>Job Board &amp; Internship Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Jobs &amp; Internships Manager
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600">
              Manage enterprise roles, student internships, batch statuses, and export verified datasets.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={fetchRoles}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 hover:border-black text-black text-xs font-bold transition-all flex items-center gap-1.5 bg-white cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleExportCsv}
              disabled={filteredRoles.length === 0}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 hover:border-black text-black text-xs font-bold transition-all flex items-center gap-1.5 bg-white cursor-pointer disabled:opacity-40"
              title="Download filtered jobs as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                setShowAddModal(true);
                setActionError(null);
              }}
              className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Role</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {actionSuccess && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {actionError && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-6 pt-6 border-t border-neutral-100">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black text-xs font-medium text-black placeholder:text-neutral-400 bg-white"
            />
          </div>

          <div className="sm:col-span-3 flex items-center gap-1 p-1 rounded-xl bg-neutral-100 border border-neutral-200">
            <button
              onClick={() => setFilterType("all")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === "all" ? "bg-white text-black shadow-2xs" : "text-neutral-600 hover:text-black"
              }`}
            >
              All ({roles.length})
            </button>
            <button
              onClick={() => setFilterType("job")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === "job" ? "bg-white text-black shadow-2xs" : "text-neutral-600 hover:text-black"
              }`}
            >
              Jobs ({jobCount})
            </button>
            <button
              onClick={() => setFilterType("internship")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === "internship" ? "bg-white text-black shadow-2xs" : "text-neutral-600 hover:text-black"
              }`}
            >
              Intern ({internshipCount})
            </button>
          </div>

          <div className="sm:col-span-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black text-xs font-bold text-black bg-white cursor-pointer"
            >
              <option value="all">All Disciplines</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product &amp; Design</option>
              <option value="Data">Data &amp; AI</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black text-xs font-bold text-black bg-white cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="archived">Archived Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batch Operations Toolbar */}
      {selectedJobIds.size > 0 && (
        <div className="bg-neutral-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="p-1 rounded text-white hover:text-neutral-300 transition-colors"
              title={allSelected ? "Deselect All" : "Select All"}
            >
              {allSelected ? (
                <CheckSquare className="w-5 h-5 text-blue-400" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
            <span className="text-xs font-mono font-bold">
              {selectedJobIds.size} of {filteredRoles.length} role(s) selected
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleBatchStatusUpdate(true)}
              disabled={batchActionLoading}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mark Active</span>
            </button>
            <button
              onClick={() => handleBatchStatusUpdate(false)}
              disabled={batchActionLoading}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Archive className="w-3.5 h-3.5 text-amber-400" />
              <span>Archive</span>
            </button>
            <button
              onClick={() => setShowBatchDeleteModal(true)}
              disabled={batchActionLoading}
              className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete ({selectedJobIds.size})</span>
            </button>
            <button
              onClick={() => setSelectedJobIds(new Set())}
              className="px-2.5 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Role Listings Grid */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white border border-neutral-200 rounded-3xl text-center py-24 space-y-3 shadow-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-black mx-auto" />
            <p className="text-xs font-mono text-neutral-500">Retrieving active job &amp; internship listings...</p>
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-3xl text-center py-24 space-y-3 shadow-xs">
            <Briefcase className="w-10 h-10 text-neutral-300 mx-auto" />
            <p className="text-sm font-bold text-black">No roles found matching criteria.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Role</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles.map((role) => {
              const isIntern = role.type?.toLowerCase().includes("intern");
              const isSelected = selectedJobIds.has(role.id);
              return (
                <div 
                  key={role.id}
                  className={`bg-white border rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all shadow-xs space-y-4 relative ${
                    isSelected ? "border-blue-600 ring-2 ring-blue-500/20" : "border-neutral-200 hover:border-black"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => toggleSelectRole(role.id, e)}
                          className="p-1 text-neutral-400 hover:text-black cursor-pointer"
                          title={isSelected ? "Deselect" : "Select"}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          isIntern 
                            ? "bg-purple-100 text-purple-900 border border-purple-200"
                            : "bg-neutral-100 text-black border border-neutral-200"
                        }`}>
                          {isIntern ? "Internship" : "Full-Time"}
                        </span>
                        {role.is_active === false && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            Archived
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {new Date(role.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-black tracking-tight leading-snug">
                        {role.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{role.company}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{role.location}</span>
                    </div>

                    {role.salary_range && (
                      <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono font-bold text-black">
                        {role.salary_range}
                      </div>
                    )}

                    {role.skills_required && role.skills_required.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {role.skills_required.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 text-neutral-700 font-mono">
                            {skill}
                          </span>
                        ))}
                        {role.skills_required.length > 3 && (
                          <span className="text-[10px] text-neutral-400 font-mono">
                            +{role.skills_required.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                    {role.external_url ? (
                      <a
                        href={role.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-neutral-600 hover:text-black inline-flex items-center gap-1"
                      >
                        <span>Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-neutral-400 font-mono">Direct Portal</span>
                    )}

                    <button
                      onClick={() => setDeletingRole(role)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      title="Delete this role from platform"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD ROLE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white border border-neutral-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-black">Add New Role</h2>
                <p className="text-xs text-neutral-500">Publish a job or internship opportunity for students &amp; professionals.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-black hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
              
              {/* Type Switcher */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-neutral-100 border border-neutral-200">
                <button
                  type="button"
                  onClick={() => setRoleType("job")}
                  className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${
                    roleType === "job" ? "bg-black text-white shadow-xs" : "text-neutral-600 hover:text-black"
                  }`}
                >
                  Full-Time Job
                </button>
                <button
                  type="button"
                  onClick={() => setRoleType("internship")}
                  className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${
                    roleType === "internship" ? "bg-black text-white shadow-xs" : "text-neutral-600 hover:text-black"
                  }`}
                >
                  Internship Opening
                </button>
              </div>

              {/* Title & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-black uppercase text-[10px] tracking-wider">Role Title *</label>
                  <input
                    type="text"
                    required
                    placeholder={roleType === "internship" ? "e.g. Software Engineer Intern" : "e.g. Full-Stack Developer"}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black text-xs font-semibold text-black bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-black uppercase text-[10px] tracking-wider">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EdWorld Labs / Google"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black text-xs font-semibold text-black bg-white"
                  />
                </div>
              </div>

              {/* Location & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-black uppercase text-[10px] tracking-wider">Location</label>
                  <input
                    type="text"
                    placeholder="Hyderabad, Telangana / Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black text-xs font-medium text-black bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-black uppercase text-[10px] tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black text-xs font-bold text-black bg-white cursor-pointer"
                  >
                    <option value="Engineering">Software Engineering</option>
                    <option value="AI & Machine Learning">AI &amp; Machine Learning</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Product Management">Product Management</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                  </select>
                </div>
              </div>

              {/* Salary Range / Stipend & Deadline Days */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-black uppercase text-[10px] tracking-wider">
                    {roleType === "internship" ? "Monthly Stipend" : "Annual CTC / Salary"}
                  </label>
                  <input
                    type="text"
                    placeholder={roleType === "internship" ? "₹25,000 - ₹35,000 / month" : "₹12 - ₹18 LPA"}
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black text-xs font-medium text-black bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-black uppercase text-[10px] tracking-wider">Application Window (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={deadlineDays}
                    onChange={(e) => setDeadlineDays(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black text-xs font-medium text-black bg-white"
                  />
                </div>
              </div>

              {/* Skills Required */}
              <div className="space-y-1">
                <label className="font-bold text-black uppercase text-[10px] tracking-wider">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="TypeScript, Next.js, Node.js, SQL"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black text-xs font-medium text-black bg-white"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-black uppercase text-[10px] tracking-wider">Description &amp; Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Responsibilities, requirements, and candidate expectations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black text-xs font-medium text-black bg-white"
                />
              </div>

              {/* External URL */}
              <div className="space-y-1">
                <label className="font-bold text-black uppercase text-[10px] tracking-wider">Direct Application Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://company.careers/apply/role-123"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black text-xs font-medium text-black bg-white"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:text-black font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-xs"
                >
                  {submitting ? "Publishing Role..." : "Publish Role"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white border border-neutral-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-black">Confirm Role Deletion</h3>
                <p className="text-xs text-neutral-500">This action will remove the listing permanently.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-1">
              <div className="font-extrabold text-black">{deletingRole.title}</div>
              <div className="text-neutral-600">{deletingRole.company} • {deletingRole.location}</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingRole(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 font-bold text-xs hover:border-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteRole}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BATCH DELETE CONFIRMATION MODAL */}
      {showBatchDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white border border-neutral-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-black">Delete Selected Roles?</h3>
                <p className="text-xs text-neutral-500">
                  You are about to permanently remove {selectedJobIds.size} job opening(s).
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
              This action cannot be undone. Active candidates viewing these opportunities will no longer have access.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBatchDeleteModal(false)}
                disabled={batchActionLoading}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 font-bold text-xs hover:border-black cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBatchDeleteConfirm}
                disabled={batchActionLoading}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                {batchActionLoading ? "Deleting..." : `Delete ${selectedJobIds.size} Roles`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
