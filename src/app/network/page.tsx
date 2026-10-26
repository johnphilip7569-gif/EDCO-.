"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { PublicUserProfile } from "@/lib/types";
import EdIdBadge from "@/components/ui/EdIdBadge";
import UserProfileDetailModal from "@/components/networking/UserProfileDetailModal";
import DirectMessageModal from "@/components/networking/DirectMessageModal";
import {
  Users,
  Search,
  UserPlus,
  Check,
  GraduationCap,
  Building2,
  MapPin,
  Clock,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  MessageSquare
} from "lucide-react";
import StudioSticker from "@/components/studio/StudioSticker";

export default function NetworkPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"all" | "students" | "professionals" | "connections" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState<PublicUserProfile[]>([]);
  const [professionals, setProfessionals] = useState<PublicUserProfile[]>([]);
  const [activeConnections, setActiveConnections] = useState<any[]>([]);
  const [pendingReceived, setPendingReceived] = useState<any[]>([]);
  const [pendingSent, setPendingSent] = useState<any[]>([]);

  // Modals state
  const [selectedUserDetail, setSelectedUserDetail] = useState<PublicUserProfile | null>(null);
  const [selectedDmPeer, setSelectedDmPeer] = useState<PublicUserProfile | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [notificationToast, setNotificationToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Fetch real network members from database
  const loadNetworkData = useCallback(async (query = "") => {
    setLoading(true);
    try {
      const url = `/api/network/members?query=${encodeURIComponent(query)}`;
      const headers: Record<string, string> = {};
      if (user?.uid) {
        headers["x-user-id"] = user.uid;
      }
      const res = await fetch(url, { headers });
      const data = await res.json();

      if (data.success) {
        setStudents(data.students || []);
        setProfessionals(data.professionals || []);
      }
    } catch (err) {
      console.warn("Failed to load network members:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch real connections
  const loadConnections = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/network/connections", {
        headers: { "x-user-id": user.uid },
      });
      const data = await res.json();
      if (data.success) {
        setActiveConnections(data.connections || []);
        setPendingReceived(data.pendingReceived || []);
        setPendingSent(data.pendingSent || []);
      }
    } catch (err) {
      console.warn("Failed to load connections:", err);
    }
  }, [user]);

  useEffect(() => {
    loadNetworkData();
    if (user) {
      loadConnections();
    }
  }, [user, loadNetworkData, loadConnections]);

  // Handle Search Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      loadNetworkData(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery, loadNetworkData]);

  // Trigger Toast Notification
  const showToast = (message: string, type: "success" | "info" = "success") => {
    setNotificationToast({ message, type });
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  // Handle Connect Request
  const handleConnect = async (targetUserId: string) => {
    if (!user) {
      showToast("Please sign in or create an account to connect with peers.", "info");
      return;
    }
    if (actionInProgress) return;
    setActionInProgress(targetUserId);

    try {
      const res = await fetch("/api/network/connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.uid,
        },
        body: JSON.stringify({
          receiverId: targetUserId,
          message: "Let's connect on Edworld Co. verified network!",
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Connection request sent.");
        await loadConnections();
        await loadNetworkData(searchQuery);
      } else {
        showToast(data.error || "Unable to send request.", "info");
      }
    } catch (err) {
      console.error("Connection error:", err);
    } finally {
      setActionInProgress(null);
    }
  };

  // Handle Accept Connection
  const handleAcceptConnection = async (connectionId: string, partnerName: string) => {
    if (!user || actionInProgress) return;
    setActionInProgress(connectionId);

    try {
      const res = await fetch("/api/network/connections", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.uid,
        },
        body: JSON.stringify({
          connectionId,
          action: "accept",
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Connected with ${partnerName}.`);
        await loadConnections();
        await loadNetworkData(searchQuery);
      }
    } catch (err) {
      console.error("Accept connection error:", err);
    } finally {
      setActionInProgress(null);
    }
  };

  // Combine and filter list
  const allMembers = [...students, ...professionals];

  // Collect unique skills for filtering
  const allSkills = Array.from(
    new Set(allMembers.flatMap((m) => m.skills || []).filter(Boolean))
  ).slice(0, 10);

  const filterBySkill = (members: PublicUserProfile[]) => {
    if (selectedSkillFilter === "All") return members;
    return members.filter((m) => m.skills?.includes(selectedSkillFilter));
  };

  const getDisplayedMembers = () => {
    switch (activeTab) {
      case "students":
        return filterBySkill(students);
      case "professionals":
        return filterBySkill(professionals);
      case "connections": {
        const connIds = new Set(activeConnections.map((c) => c.partnerId));
        return filterBySkill(allMembers.filter((m) => connIds.has(m.userId)));
      }
      case "pending": {
        const pendingIds = new Set(pendingReceived.map((p) => p.partnerId));
        return filterBySkill(allMembers.filter((m) => pendingIds.has(m.userId)));
      }
      case "all":
      default:
        return filterBySkill(allMembers);
    }
  };

  const displayedList = getDisplayedMembers();

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#1B1B2F] font-sans pb-24 selection:bg-[#6BCB77] selection:text-[#1B1B2F]">
      {/* Real-Time Toast Notification */}
      {notificationToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#1B1B2F] text-white px-4 py-3 rounded-xl shadow-[4px_4px_0px_#FFC93C] border-2 border-[#1B1B2F] flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-[#6BCB77]" />
          <p className="text-xs font-bold text-white">{notificationToast.message}</p>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6">
        {/* Header Station */}
        <div className="bg-white border-2 border-[#1B1B2F] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[6px_6px_0px_#1B1B2F]">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <StudioSticker bgColor="#6BCB77" textColor="#1B1B2F" rotate="slight-left" size="sm">
                Verified Student Network
              </StudioSticker>
              <span className="text-xs font-bold px-3 py-1 rounded-lg border-2 border-[#1B1B2F] bg-[#FFF8EE] text-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]">
                Institutional Directory
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B2F] tracking-tight">
              Community &amp; Member Directory
            </h1>
            <p className="text-xs sm:text-sm text-[#1B1B2F]/75 leading-relaxed font-medium">
              Connect with university students, researchers, and engineering peers. Real profiles only.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto bg-[#FFF8EE] p-3 rounded-xl border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F]">
            <div className="px-4 py-1.5 text-center border-r-2 border-[#1B1B2F]/20">
              <div className="text-base sm:text-lg font-black text-[#1B1B2F] tabular-nums">
                {allMembers.length}
              </div>
              <div className="text-[11px] font-bold text-[#1B1B2F]/70">Members</div>
            </div>
            <div className="px-4 py-1.5 text-center border-r-2 border-[#1B1B2F]/20">
              <div className="text-base sm:text-lg font-black text-[#1B1B2F] tabular-nums">
                {activeConnections.length}
              </div>
              <div className="text-[11px] font-bold text-[#1B1B2F]/70">Connected</div>
            </div>
            <div className="px-4 py-1.5 text-center">
              <div className="text-base sm:text-lg font-black text-[#1B1B2F] tabular-nums">
                {pendingReceived.length}
              </div>
              <div className="text-[11px] font-bold text-[#1B1B2F]/70">Pending</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border-2 border-[#1B1B2F] rounded-2xl p-5 space-y-4 shadow-[4px_4px_0px_#1B1B2F]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#1B1B2F]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, skills..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FFF8EE] border-2 border-[#1B1B2F] rounded-xl text-[#1B1B2F] placeholder-[#1B1B2F]/40 focus:outline-none shadow-[2px_2px_0px_#1B1B2F] font-medium"
              />
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: "all", label: "All Members", count: allMembers.length },
                { id: "students", label: "Students", count: students.length },
                { id: "professionals", label: "Professionals", count: professionals.length },
                { id: "connections", label: "Connections", count: activeConnections.length },
                { id: "pending", label: "Requests", count: pendingReceived.length },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`btn-squishy px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border-2 border-[#1B1B2F] ${
                      isActive
                        ? "bg-[#6BCB77] text-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F]"
                        : "bg-[#FFF8EE] text-[#1B1B2F] hover:bg-white shadow-[1px_1px_0px_#1B1B2F]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold border ${
                        isActive ? "bg-white text-[#1B1B2F] border-[#1B1B2F]" : "bg-white text-[#1B1B2F]/70 border-[#1B1B2F]/20"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skill Filter Chips */}
          {allSkills.length > 0 && (
            <div className="flex items-center gap-1.5 pt-3 border-t-2 border-[#1B1B2F]/10 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold text-[#1B1B2F] pr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#1B1B2F]" />
                Skills:
              </span>
              <button
                onClick={() => setSelectedSkillFilter("All")}
                className={`btn-squishy px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer border-2 border-[#1B1B2F] ${
                  selectedSkillFilter === "All"
                    ? "bg-[#FFC93C] text-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]"
                    : "bg-white text-[#1B1B2F] hover:bg-[#FFF8EE]"
                }`}
              >
                All
              </button>
              {allSkills.map((sk, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSkillFilter(sk)}
                  className={`btn-squishy px-3 py-1 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer border-2 border-[#1B1B2F] ${
                    selectedSkillFilter === sk
                      ? "bg-[#FFC93C] text-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]"
                      : "bg-white text-[#1B1B2F] hover:bg-[#FFF8EE]"
                  }`}
                >
                  {sk}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Member Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-[#E5E5E5] animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-neutral-100"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-neutral-100 rounded w-3/4"></div>
                    <div className="h-3 bg-neutral-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-8 bg-neutral-50 rounded"></div>
              </div>
            ))}
          </div>
        ) : displayedList.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-[#E5E5E5] text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-lg bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-black">
                {searchQuery ? "No members found" : "No public profiles"}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {searchQuery
                  ? `No members matched "${searchQuery}". Try clearing your search.`
                  : "No members have shared a public profile yet — be the first."}
              </p>
            </div>
            <div>
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors"
              >
                Update Profile Settings
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedList.map((member) => {
              const initials = (member.name || "U")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              const isConnected = member.connectionStatus === "accepted";
              const isPendingSent = member.connectionStatus === "pending_sent";
              const isPendingReceived = member.connectionStatus === "pending_received";

              return (
                <div
                  key={member.userId}
                  className="bg-white border-2 border-[#1B1B2F] rounded-2xl p-5 transition-all flex flex-col justify-between group shadow-[4px_4px_0px_#1B1B2F] hover:shadow-[6px_6px_0px_#1B1B2F] hover:-translate-y-0.5"
                >
                  <div className="space-y-3.5">
                    {/* Top Identity Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative">
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-11 h-11 rounded-xl object-cover border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-[#6BCB77] border-2 border-[#1B1B2F] text-[#1B1B2F] flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#1B1B2F]">
                              {initials}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-sm font-black text-[#1B1B2F] truncate leading-tight">
                            {member.name}
                          </h3>
                          <p className="text-[11px] text-[#1B1B2F]/70 truncate mt-0.5 font-medium">
                            {member.headline || (member.userType === "STUDENT" ? "Student" : "Technology Professional")}
                          </p>
                          {member.edId && (
                            <div className="mt-1">
                              <EdIdBadge userId={member.userId} customId={member.edId} size="sm" variant="pill" />
                            </div>
                          )}
                        </div>
                      </div>

                      <span
                        className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border-2 border-[#1B1B2F] bg-[#FFF8EE] text-[#1B1B2F] shrink-0 shadow-[1px_1px_0px_#1B1B2F]"
                      >
                        {member.userType === "STUDENT" ? "Student" : "Career"}
                      </span>
                    </div>

                    {/* Metadata tags */}
                    <div className="space-y-1 text-xs text-[#1B1B2F]/70 pt-1 font-medium">
                      {member.college && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[#1B1B2F]/70 truncate">
                          <GraduationCap className="w-3.5 h-3.5 text-[#1B1B2F]/60 shrink-0" />
                          <span className="truncate">{member.college}</span>
                        </div>
                      )}
                      {member.company && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[#1B1B2F]/70 truncate">
                          <Building2 className="w-3.5 h-3.5 text-[#1B1B2F]/60 shrink-0" />
                          <span className="truncate">{member.company}</span>
                        </div>
                      )}
                      {member.location && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[#1B1B2F]/70 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#1B1B2F]/60 shrink-0" />
                          <span className="truncate">{member.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Skills preview */}
                    {member.skills && member.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {member.skills.slice(0, 3).map((sk, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF8EE] text-[#1B1B2F] border border-[#1B1B2F]"
                          >
                            {sk}
                          </span>
                        ))}
                        {member.skills.length > 3 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-[#1B1B2F]/60">
                            +{member.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="mt-5 pt-3.5 border-t-2 border-[#1B1B2F]/10 flex items-center gap-2">
                    {/* View Full Profile Button */}
                    <button
                      onClick={() => setSelectedUserDetail(member)}
                      className="btn-squishy flex-1 py-1.5 px-3 rounded-xl bg-[#FFF8EE] hover:bg-white border-2 border-[#1B1B2F] text-[#1B1B2F] text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-[2px_2px_0px_#1B1B2F]"
                    >
                      <span>Profile</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#1B1B2F]" />
                    </button>

                    {/* Direct Message (E2E DM) */}
                    <Link
                      href={`/messages?peerId=${member.userId}`}
                      className="btn-squishy p-2 rounded-xl bg-white hover:bg-[#FFF8EE] border-2 border-[#1B1B2F] text-[#1B1B2F] transition-all shadow-[2px_2px_0px_#1B1B2F]"
                      title="Send Direct Message"
                    >
                      <MessageSquare className="w-4 h-4 text-[#1B1B2F]" />
                    </Link>

                    {/* Connect / Pending Action */}
                    {isPendingReceived ? (
                      <button
                        onClick={() => handleAcceptConnection(member.connectionId || "", member.name)}
                        disabled={actionInProgress === member.connectionId}
                        className="btn-squishy py-1.5 px-3 rounded-xl bg-[#6BCB77] text-[#1B1B2F] border-2 border-[#1B1B2F] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_#1B1B2F]"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnect(member.userId)}
                        disabled={isConnected || isPendingSent || actionInProgress === member.userId}
                        className={`btn-squishy py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border-2 border-[#1B1B2F] ${
                          isConnected
                            ? "bg-[#FFF8EE] text-[#1B1B2F]/60 cursor-default"
                            : isPendingSent
                            ? "bg-[#FFF8EE] text-[#1B1B2F]/60 cursor-default"
                            : "bg-[#6BCB77] hover:bg-[#5bb866] text-[#1B1B2F] cursor-pointer shadow-[2px_2px_0px_#1B1B2F]"
                        }`}
                      >
                        {isConnected ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#1B1B2F]" />
                            <span>Connected</span>
                          </>
                        ) : isPendingSent ? (
                          <>
                            <Clock className="w-3.5 h-3.5 text-[#1B1B2F]" />
                            <span>Pending</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5 text-[#1B1B2F]" />
                            <span>Connect</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Profile Detail Modal */}
      <UserProfileDetailModal
        user={selectedUserDetail}
        isOpen={Boolean(selectedUserDetail)}
        onClose={() => setSelectedUserDetail(null)}
        onConnect={(uid) => handleConnect(uid)}
        onOpenMessage={(u) => setSelectedDmPeer(u)}
        isConnecting={Boolean(actionInProgress)}
      />

      {/* Direct Messaging Modal */}
      <DirectMessageModal
        peer={selectedDmPeer}
        isOpen={Boolean(selectedDmPeer)}
        onClose={() => setSelectedDmPeer(null)}
        onMessageSent={() => showToast("Message sent.")}
      />
    </div>
  );
}
