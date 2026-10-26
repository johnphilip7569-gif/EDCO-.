"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Users,
  Plus,
  Key,
  Lock,
  Globe,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Copy,
  Check,
  Search,
  User,
  AlertCircle,
  X,
  Share2
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/lib/auth-context";
import { PROBLEM_STATEMENTS_DATA } from "@/lib/projects/problem-statements-data";
import { StudioSticker } from "@/components/studio/StudioSticker";

interface GroupMember {
  user_id: string;
  name: string;
  avatar_url?: string;
  role: "LEADER" | "MEMBER";
  username?: string;
}

interface EdBuildGroup {
  id: string;
  name: string;
  access_type: "public" | "private";
  join_key?: string;
  team_size: number;
  current_members_count: number;
  leader_name: string;
  leader_email: string;
  leader_phone?: string;
  problem_statement: string;
  status: "OPEN" | "FULL" | "IN_PROGRESS" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  created_at: string;
  members?: GroupMember[];
}

function EdBuildContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();

  const [publicGroups, setPublicGroups] = useState<EdBuildGroup[]>([]);
  const [myGroups, setMyGroups] = useState<EdBuildGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinKeyModalOpen, setIsJoinKeyModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Group creation form state
  const [accessType, setAccessType] = useState<"public" | "private">("public");
  const [projectName, setProjectName] = useState("");
  const [teamSize, setTeamSize] = useState<number>(4);
  const [leaderName, setLeaderName] = useState(profile?.name || user?.name || "");
  const [leaderEmail, setLeaderEmail] = useState(profile?.email || user?.email || "");
  const [leaderPhone, setLeaderPhone] = useState(profile?.phone || "");
  const [selectedProblemPreset, setSelectedProblemPreset] = useState<string>("");
  const [problemStatement, setProblemStatement] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createSuccessData, setCreateSuccessData] = useState<{ groupId: string; joinKey?: string; accessType: string } | null>(null);

  // Private key input state
  const [enteredKey, setEnteredKey] = useState("");
  const [keyError, setKeyError] = useState<string | null>(null);
  const [isJoiningKey, setIsJoiningKey] = useState(false);

  // Filter state for public groups
  const [searchFilter, setSearchFilter] = useState("");

  // Sync profile details
  useEffect(() => {
    if (profile?.name && !leaderName) setLeaderName(profile.name);
    if (profile?.email && !leaderEmail) setLeaderEmail(profile.email);
    if (profile?.phone && !leaderPhone) setLeaderPhone(profile.phone);
  }, [profile]);

  // Handle auto-population from query params (e.g. redirected from Project Studio)
  useEffect(() => {
    const problemIdParam = searchParams.get("problemId");
    const createParam = searchParams.get("create");

    if (problemIdParam) {
      const found = PROBLEM_STATEMENTS_DATA.find((p) => p.id === problemIdParam);
      if (found) {
        setSelectedProblemPreset(found.id);
        setProjectName((prev) => prev || found.title);
        setProblemStatement(found.problemStatement);
        if (createParam === "true") {
          setIsCreateModalOpen(true);
        }
      }
    }
  }, [searchParams]);

  // Load groups data
  const loadGroups = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/edbuild/groups?userId=${user?.uid || ""}`);
      const data = await res.json();
      if (data.success) {
        setPublicGroups(data.publicGroups || []);
        setMyGroups(data.myGroups || []);
      }
    } catch (err) {
      console.warn("Failed to load EdBuild groups:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, [user]);

  // Handle problem preset selection
  const handleSelectPreset = (id: string) => {
    setSelectedProblemPreset(id);
    const found = PROBLEM_STATEMENTS_DATA.find((p) => p.id === id);
    if (found) {
      if (!projectName) setProjectName(found.title);
      setProblemStatement(found.problemStatement);
    }
  };

  // Submit group creation
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !problemStatement.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/edbuild/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          access_type: accessType,
          team_size: teamSize,
          leader_name: leaderName,
          leader_email: leaderEmail,
          leader_phone: leaderPhone,
          problem_statement: problemStatement,
          userId: user?.uid,
          avatar_url: (profile as any)?.avatar_url || (profile as any)?.photo_url,
        }),
      });

      const data = await res.json();
      if (data.success && data.group) {
        setCreateSuccessData({
          groupId: data.group.id,
          joinKey: data.group.join_key,
          accessType: data.group.access_type,
        });
        loadGroups();
      } else {
        alert(data.error || "Failed to create group");
      }
    } catch (err: any) {
      alert(err.message || "Network error creating group");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit join by key
  const handleJoinByKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredKey.trim()) return;

    setIsJoiningKey(true);
    setKeyError(null);
    try {
      const res = await fetch(`/api/edbuild/groups/by-key/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: enteredKey.trim(),
          userId: user?.uid,
          name: profile?.name || user?.name || "Student",
          email: profile?.email || user?.email,
          phone: profile?.phone,
          avatar_url: (profile as any)?.avatar_url || (profile as any)?.photo_url,
        }),
      });

      const data = await res.json();
      if (data.success && data.groupId) {
        setIsJoinKeyModalOpen(false);
        router.push(`/edbuild/${data.groupId}`);
      } else {
        setKeyError(data.error || "Invalid join key or group is full.");
      }
    } catch (err: any) {
      setKeyError(err.message || "Failed to join private group");
    } finally {
      setIsJoiningKey(false);
    }
  };

  // Join public group directly
  const handleJoinPublicGroup = async (group: EdBuildGroup) => {
    try {
      const res = await fetch(`/api/edbuild/groups/${group.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid,
          name: profile?.name || user?.name || "Student",
          email: profile?.email || user?.email,
          phone: profile?.phone,
          avatar_url: (profile as any)?.avatar_url || (profile as any)?.photo_url,
        }),
      });

      const data = await res.json();
      if (data.success && data.groupId) {
        router.push(`/edbuild/${data.groupId}`);
      } else {
        alert(data.error || "Unable to join room");
      }
    } catch (err: any) {
      alert(err.message || "Failed to join group");
    }
  };

  const handleCopyKey = (key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(key);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const filteredPublicGroups = publicGroups.filter((g) => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      g.name.toLowerCase().includes(q) ||
      g.problem_statement.toLowerCase().includes(q) ||
      g.leader_name.toLowerCase().includes(q)
    );
  });

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#FFF8EE] text-[#1B1B2F] font-sans selection:bg-[#FFC93C] selection:text-[#1B1B2F] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
          
          {/* 1. HERO & ACTION BAR */}
          <section className="bg-white rounded-2xl border-2 border-[#1B1B2F] p-6 sm:p-8 shadow-[6px_6px_0px_#1B1B2F] flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <StudioSticker text="EdBuild • Collaborative Workspace" color="#8E6CEF" rotate={-1} />
                <span className="text-xs text-[#1B1B2F]/60 font-mono font-bold">Proof-of-Work Squads</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B2F] tracking-tight">
                Team Up, Build Real Projects &amp; Earn Verified Certificates
              </h1>
              <p className="text-xs sm:text-sm text-[#1B1B2F]/70 leading-relaxed font-medium">
                Create public or private engineering squads. Collaborate with live chat and media sharing, submit your completed repository for official review, and receive your personalized Certificate of Completion.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setCreateSuccessData(null);
                  setIsCreateModalOpen(true);
                }}
                className="bg-[#1B1B2F] hover:bg-[#1B1B2F]/90 text-white text-xs font-extrabold py-3 px-5 rounded-xl border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#FFC93C] transition-all hover:translate-x-[1px] hover:translate-y-[1px] inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#FFC93C]" />
                <span>Create a Group</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setKeyError(null);
                  setEnteredKey("");
                  setIsJoinKeyModalOpen(true);
                }}
                className="bg-[#FFF8EE] hover:bg-white text-[#1B1B2F] border-2 border-[#1B1B2F] text-xs font-extrabold py-3 px-5 rounded-xl shadow-[3px_3px_0px_#1B1B2F] transition-all hover:translate-x-[1px] hover:translate-y-[1px] inline-flex items-center gap-2 cursor-pointer"
              >
                <Key className="w-4 h-4 text-[#2EC4B6]" />
                <span>Join with Private Key</span>
              </button>
            </div>
          </section>

          {/* 2. MY ACTIVE GROUPS (If User has groups) */}
          {myGroups.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#1B1B2F] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#8E6CEF]" />
                  <span>My Active EdBuild Workspaces ({myGroups.length})</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myGroups.map((group) => (
                  <div
                    key={group.id}
                    className="p-5 rounded-2xl bg-white border-2 border-[#1B1B2F] shadow-[4px_4px_0px_#1B1B2F] hover:shadow-[6px_6px_0px_#1B1B2F] hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md border-2 border-[#1B1B2F] ${
                          group.access_type === "private" ? "bg-[#FFC93C]/20 text-[#1B1B2F]" : "bg-[#4D96FF]/20 text-[#1B1B2F]"
                        }`}>
                          {group.access_type === "private" ? "Private Room" : "Public Room"}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border-2 border-[#1B1B2F] ${
                          group.status === "APPROVED"
                            ? "bg-[#6BCB77] text-white"
                            : group.status === "PENDING_REVIEW"
                            ? "bg-[#FFC93C] text-[#1B1B2F]"
                            : "bg-[#FFF8EE] text-[#1B1B2F]"
                        }`}>
                          {group.status}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-[#1B1B2F] mt-1 line-clamp-1">{group.name}</h3>
                      <p className="text-xs text-[#1B1B2F]/70 line-clamp-2 font-medium">{group.problem_statement}</p>
                    </div>

                    <div className="pt-3 border-t-2 border-[#1B1B2F]/10 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#1B1B2F]/70">
                        {group.current_members_count} / {group.team_size} Members
                      </span>
                      <Link
                        href={`/edbuild/${group.id}`}
                        className="bg-[#1B1B2F] hover:bg-[#1B1B2F]/90 text-white text-xs font-extrabold py-2 px-3.5 rounded-xl border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#FFC93C] inline-flex items-center gap-1.5 transition-all hover:translate-x-[1px] hover:translate-y-[1px]"
                      >
                        <span>Open Studio</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. PUBLIC DIRECTORY & DISCOVERY */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-[#1B1B2F]">
                  Public Project Teams Directory
                </h2>
                <p className="text-xs text-[#1B1B2F]/70 font-medium">
                  Find an open squad or join an existing build team before capacity fills up.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#1B1B2F]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search public groups..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FFF8EE] border-2 border-[#1B1B2F] rounded-xl focus:outline-none text-[#1B1B2F] placeholder:text-[#1B1B2F]/50 font-medium shadow-[2px_2px_0px_#1B1B2F]"
                />
              </div>
            </div>

            {/* Groups Grid */}
            {filteredPublicGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPublicGroups.map((group) => {
                  const isFull = Number(group.current_members_count) >= Number(group.team_size);
                  const isMember = myGroups.some((mg) => mg.id === group.id);

                  return (
                    <div
                      key={group.id}
                      className="bg-white rounded-2xl border-2 border-[#1B1B2F] p-6 shadow-[5px_5px_0px_#1B1B2F] hover:shadow-[7px_7px_0px_#1B1B2F] hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        {/* Status / Capacity Header */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#4D96FF]/20 text-[#1B1B2F] border-2 border-[#1B1B2F]">
                            Public Group
                          </span>

                          {isFull ? (
                            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FF6B6B]/20 text-[#1B1B2F] border-2 border-[#1B1B2F]">
                              Room Full
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#6BCB77]/20 text-[#1B1B2F] border-2 border-[#1B1B2F]">
                              {Number(group.team_size) - Number(group.current_members_count)} Slots Open
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-extrabold text-[#1B1B2F] leading-snug line-clamp-1">
                          {group.name}
                        </h3>

                        {/* Problem Statement */}
                        <p className="text-xs text-[#1B1B2F]/70 leading-relaxed line-clamp-3 font-medium">
                          {group.problem_statement}
                        </p>
                      </div>

                      {/* Team Members with Portfolios */}
                      <div className="pt-3 border-t-2 border-[#1B1B2F]/10 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-[#1B1B2F]/70 font-mono font-bold">
                          <span>Team Roster ({group.current_members_count}/{group.team_size}):</span>
                          <span className="font-extrabold text-[#1B1B2F]">Lead: {group.leader_name}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {group.members && group.members.length > 0 ? (
                            group.members.map((m, mIdx) => (
                              <Link
                                key={mIdx}
                                href={`/portfolio/${m.user_id}`}
                                title={`View ${m.name}'s Portfolio`}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFF8EE] border-2 border-[#1B1B2F] hover:bg-white text-[11px] text-[#1B1B2F] font-bold shadow-[2px_2px_0px_#1B1B2F] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                              >
                                {m.avatar_url ? (
                                  <img src={m.avatar_url} alt="" className="w-4 h-4 rounded-full object-cover border border-[#1B1B2F]" />
                                ) : (
                                  <User className="w-3.5 h-3.5 text-[#1B1B2F]" />
                                )}
                                <span className="truncate max-w-[90px]">{m.name.split(" ")[0]}</span>
                              </Link>
                            ))
                          ) : (
                            <span className="text-xs font-semibold text-[#1B1B2F]">{group.leader_name}</span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-3 border-t-2 border-[#1B1B2F]/10">
                        {isMember ? (
                          <Link
                            href={`/edbuild/${group.id}`}
                            className="w-full py-2.5 px-3.5 rounded-xl bg-[#1B1B2F] hover:bg-[#1B1B2F]/90 text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#FFC93C] transition-all hover:translate-x-[1px] hover:translate-y-[1px]"
                          >
                            <span>Open Workspace</span>
                            <ArrowRight className="w-3.5 h-3.5 text-white" />
                          </Link>
                        ) : isFull ? (
                          <button
                            disabled
                            className="w-full py-2.5 px-3.5 rounded-xl bg-[#FFF8EE] text-[#1B1B2F]/40 border-2 border-[#1B1B2F]/30 text-xs font-bold cursor-not-allowed text-center"
                          >
                            Room Full (Max {group.team_size})
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoinPublicGroup(group)}
                            className="w-full py-2.5 px-3.5 rounded-xl bg-[#2EC4B6] hover:bg-[#2EC4B6]/90 text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F] transition-all hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer"
                          >
                            <span>Join Squad</span>
                            <ArrowRight className="w-3.5 h-3.5 text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-[#1B1B2F] p-10 text-center space-y-3 shadow-[6px_6px_0px_#1B1B2F]">
                <div className="w-14 h-14 rounded-2xl bg-[#FFC93C] border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F] text-[#1B1B2F] flex items-center justify-center mx-auto">
                  <Users className="w-7 h-7 text-[#1B1B2F]" />
                </div>
                <h3 className="text-base font-extrabold text-[#1B1B2F]">No public groups found</h3>
                <p className="text-xs text-[#1B1B2F]/70 font-medium">
                  Be the first to launch a public team for your engineering project.
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#1B1B2F] text-white text-xs font-extrabold border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#FFC93C] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
                >
                  Create Group
                </button>
              </div>
            )}
          </section>

          {/* 4. CREATE GROUP MODAL */}
          {isCreateModalOpen && (
            <div className="fixed inset-0 z-50 bg-[#1B1B2F]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
              <div className="bg-[#FFF8EE] rounded-3xl border-2 border-[#1B1B2F] shadow-[10px_10px_0px_#1B1B2F] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-[#1B1B2F] font-sans">
                
                {/* Modal Header */}
                <div className="p-5 sm:p-6 border-b-2 border-[#1B1B2F]/10 flex items-center justify-between bg-white shrink-0">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#1B1B2F]">
                      Create an EdBuild Project Group
                    </h3>
                    <p className="text-xs text-[#1B1B2F]/70 mt-0.5 font-medium">
                      Configure your team size, access type, and engineering problem statement.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setCreateSuccessData(null);
                    }}
                    className="text-[#1B1B2F]/60 hover:text-[#1B1B2F] p-1.5 rounded-xl hover:bg-[#FFF8EE] border-2 border-transparent hover:border-[#1B1B2F] transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Success View */}
                {createSuccessData ? (
                  <div className="p-8 text-center space-y-5 my-auto">
                    <div className="w-16 h-16 rounded-2xl bg-[#6BCB77] text-white border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F] flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-extrabold text-[#1B1B2F]">
                      EdBuild Group Created Successfully!
                    </h3>

                    {createSuccessData.accessType === "private" && createSuccessData.joinKey && (
                      <div className="p-5 rounded-2xl bg-white border-2 border-[#1B1B2F] shadow-[4px_4px_0px_#1B1B2F] max-w-sm mx-auto space-y-2.5">
                        <span className="text-[11px] font-mono font-bold text-[#1B1B2F]/60 uppercase tracking-wider block">
                          Your Private Room Join Key
                        </span>
                        <div className="text-2xl font-mono font-extrabold text-[#1B1B2F] tracking-wider select-all">
                          {createSuccessData.joinKey}
                        </div>
                        <button
                          onClick={() => handleCopyKey(createSuccessData.joinKey!)}
                          className="px-4 py-1.5 rounded-xl bg-[#FFF8EE] hover:bg-white border-2 border-[#1B1B2F] text-xs font-extrabold inline-flex items-center gap-1.5 shadow-[2px_2px_0px_#1B1B2F] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
                        >
                          {copiedKey === createSuccessData.joinKey ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#2EC4B6]" />
                              <span>Key Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#1B1B2F]" />
                              <span>Copy Key</span>
                            </>
                          )}
                        </button>
                        <p className="text-[11px] text-[#1B1B2F]/70 font-medium mt-1">
                          Share this key with your teammates so they can join your workspace.
                        </p>
                      </div>
                    )}

                    <div className="pt-3 flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setIsCreateModalOpen(false);
                          router.push(`/edbuild/${createSuccessData.groupId}`);
                        }}
                        className="px-6 py-2.5 bg-[#1B1B2F] hover:bg-[#1B1B2F]/90 text-white text-xs font-extrabold rounded-xl border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#FFC93C] transition-all hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer"
                      >
                        Enter Workspace Now
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Form View */
                  <form onSubmit={handleCreateGroup} className="p-5 sm:p-6 overflow-y-auto space-y-4">
                    
                    {/* Access Type Toggle */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#1B1B2F]/70">
                        Workspace Access Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setAccessType("public")}
                          className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                            accessType === "public"
                              ? "bg-[#4D96FF]/20 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F]"
                              : "bg-white border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F] hover:bg-[#FFF8EE]"
                          }`}
                        >
                          <div className="flex items-center gap-2 font-extrabold text-xs text-[#1B1B2F]">
                            <Globe className="w-4 h-4 text-[#4D96FF]" />
                            <span>Public Group</span>
                          </div>
                          <p className="text-[11px] text-[#1B1B2F]/70 mt-1 font-medium">
                            Listed in the directory. Any student can discover and join until team size reaches limit.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAccessType("private")}
                          className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                            accessType === "private"
                              ? "bg-[#FFC93C]/20 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F]"
                              : "bg-white border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F] hover:bg-[#FFF8EE]"
                          }`}
                        >
                          <div className="flex items-center gap-2 font-extrabold text-xs text-[#1B1B2F]">
                            <Lock className="w-4 h-4 text-[#FFC93C]" />
                            <span>Private Group</span>
                          </div>
                          <p className="text-[11px] text-[#1B1B2F]/70 mt-1 font-medium">
                            Generates a private key. Only teammates with the key can join and view your workspace.
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Team Size Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#1B1B2F]/70 flex items-center justify-between">
                        <span>Max Team Size (Members)</span>
                        <span className="text-[#1B1B2F] font-extrabold">{teamSize} Members</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {[2, 3, 4, 5, 6].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setTeamSize(size)}
                            className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl border-2 transition-all cursor-pointer ${
                              teamSize === size
                                ? "bg-[#1B1B2F] text-white border-[#1B1B2F] shadow-[2px_2px_0px_#FFC93C]"
                                : "bg-white border-[#1B1B2F] text-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F] hover:bg-[#FFF8EE]"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Project Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-[#1B1B2F]">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Distributed Rate Limiting Proxy, RAG Copilot..."
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border-2 border-[#1B1B2F] rounded-xl text-[#1B1B2F] font-medium shadow-[2px_2px_0px_#1B1B2F] focus:outline-none"
                      />
                    </div>

                    {/* Leader Information (for public verification) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-extrabold text-[#1B1B2F]">Team Leader Name *</label>
                        <input
                          type="text"
                          required
                          value={leaderName}
                          onChange={(e) => setLeaderName(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-white border-2 border-[#1B1B2F] rounded-xl text-[#1B1B2F] font-medium shadow-[2px_2px_0px_#1B1B2F] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-extrabold text-[#1B1B2F]">Email ID *</label>
                        <input
                          type="email"
                          required
                          value={leaderEmail}
                          onChange={(e) => setLeaderEmail(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-white border-2 border-[#1B1B2F] rounded-xl text-[#1B1B2F] font-medium shadow-[2px_2px_0px_#1B1B2F] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-extrabold text-[#1B1B2F]">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="+91..."
                          value={leaderPhone}
                          onChange={(e) => setLeaderPhone(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-white border-2 border-[#1B1B2F] rounded-xl text-[#1B1B2F] font-medium shadow-[2px_2px_0px_#1B1B2F] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Problem Statement Preset Picker */}
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-[#1B1B2F] flex items-center justify-between">
                        <span>Select from Curated Problem Statements (Optional)</span>
                        <span className="text-[11px] text-[#2EC4B6] font-bold">Auto-fills statement</span>
                      </label>
                      <select
                        value={selectedProblemPreset}
                        onChange={(e) => handleSelectPreset(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-white border-2 border-[#1B1B2F] rounded-xl text-[#1B1B2F] font-medium shadow-[2px_2px_0px_#1B1B2F] focus:outline-none cursor-pointer"
                      >
                        <option value="">-- Choose a standard industry problem --</option>
                        {PROBLEM_STATEMENTS_DATA.map((p) => (
                          <option key={p.id} value={p.id}>
                            [{p.domain}] {p.title} ({p.difficulty})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Problem Statement Text Area */}
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-[#1B1B2F]">
                        Problem Statement &amp; Scope *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Describe the real-world technical problem your team will solve..."
                        value={problemStatement}
                        onChange={(e) => setProblemStatement(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border-2 border-[#1B1B2F] rounded-xl text-[#1B1B2F] font-medium shadow-[2px_2px_0px_#1B1B2F] focus:outline-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3 border-t-2 border-[#1B1B2F]/10 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(false)}
                        className="px-4 py-2 text-xs font-extrabold text-[#1B1B2F]/70 hover:bg-neutral-100 rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 bg-[#1B1B2F] hover:bg-[#1B1B2F]/90 text-white text-xs font-extrabold rounded-xl border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#FFC93C] transition-all hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer"
                      >
                        {isSubmitting ? "Creating Group..." : accessType === "private" ? "Create Private Group & Key" : "Publish Public Group"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* 5. JOIN WITH PRIVATE KEY MODAL */}
          {isJoinKeyModalOpen && (
            <div className="fixed inset-0 z-50 bg-[#1B1B2F]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
              <div className="bg-[#FFF8EE] rounded-3xl border-2 border-[#1B1B2F] shadow-[10px_10px_0px_#1B1B2F] w-full max-w-md overflow-hidden text-[#1B1B2F] font-sans">
                <div className="p-5 border-b-2 border-[#1B1B2F]/10 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-[#2EC4B6]" />
                    <h3 className="text-base font-extrabold text-[#1B1B2F]">
                      Join Private EdBuild Workspace
                    </h3>
                  </div>
                  <button onClick={() => setIsJoinKeyModalOpen(false)} className="text-[#1B1B2F]/60 hover:text-[#1B1B2F] cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleJoinByKey} className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#1B1B2F]">
                      Enter Private Join Key
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EDBUILD-7X9KP"
                      value={enteredKey}
                      onChange={(e) => setEnteredKey(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-3 text-center text-sm font-mono font-extrabold tracking-wider uppercase bg-white border-2 border-[#1B1B2F] rounded-xl shadow-[3px_3px_0px_#1B1B2F] focus:outline-none text-[#1B1B2F]"
                    />
                  </div>

                  {keyError && (
                    <div className="p-3 rounded-xl bg-[#FF6B6B]/20 border-2 border-[#1B1B2F] text-xs font-bold text-[#1B1B2F] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-[#FF6B6B] shrink-0" />
                      <span>{keyError}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsJoinKeyModalOpen(false)}
                      className="px-4 py-2 text-xs font-extrabold text-[#1B1B2F]/70 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isJoiningKey}
                      className="px-5 py-2.5 bg-[#1B1B2F] hover:bg-[#1B1B2F]/90 text-white text-xs font-extrabold rounded-xl border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#FFC93C] transition-all hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer"
                    >
                      {isJoiningKey ? "Verifying..." : "Join Workspace"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </AuthGuard>
  );
}

export default function EdBuildPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EdBuildContent />
    </Suspense>
  );
}
