"use client";

import React, { useState } from "react";
import { PublicUserProfile } from "@/lib/types";
import EdIdBadge from "@/components/ui/EdIdBadge";
import {
  X,
  MapPin,
  Building2,
  GraduationCap,
  Briefcase,
  Github,
  Linkedin,
  Code2,
  Globe,
  Award,
  Clock,
  Send,
  UserPlus,
  Check,
  ShieldCheck,
  ExternalLink,
  FolderGit2
} from "lucide-react";

interface UserProfileDetailModalProps {
  user: PublicUserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (userId: string) => void;
  onOpenMessage?: (user: PublicUserProfile) => void;
  isConnecting?: boolean;
}

export default function UserProfileDetailModal({
  user,
  isOpen,
  onClose,
  onConnect,
  onOpenMessage,
  isConnecting = false,
}: UserProfileDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "certifications" | "schedule" | "education">("overview");

  if (!isOpen || !user) return null;

  const initials = (user.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isConnected = user.connectionStatus === "accepted";
  const isPending = user.connectionStatus === "pending_sent";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
        <div className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-2xl border border-[#E5E5E5] transition-all flex flex-col max-h-[90vh]">
          {/* Top Banner & Header */}
          <div className="relative bg-black p-6 sm:p-7 text-white border-b border-neutral-800">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              aria-label="Close profile modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg object-cover border border-neutral-700"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg bg-neutral-900 text-white border border-neutral-700 flex items-center justify-center font-bold text-xl">
                      {initials}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                      {user.name}
                    </h2>
                    {user.edId && (
                      <EdIdBadge userId={user.userId} customId={user.edId} size="sm" variant="pill" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-300 font-medium mt-1 leading-snug">
                    {user.headline || (user.userType === "STUDENT" ? "Student" : "Technology Professional")}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-neutral-400 font-medium">
                    {user.college && (
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-neutral-400" />
                        {user.college}
                      </span>
                    )}
                    {user.company && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                        {user.company}
                      </span>
                    )}
                    {user.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        {user.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-stretch sm:self-center shrink-0">
                {onOpenMessage && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenMessage(user);
                    }}
                    className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-neutral-700"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span>Message</span>
                  </button>
                )}

                {onConnect && (
                  <button
                    onClick={() => onConnect(user.userId)}
                    disabled={isConnected || isPending || isConnecting}
                    className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isConnected
                        ? "bg-neutral-800 text-neutral-300 cursor-default"
                        : isPending
                        ? "bg-neutral-800 text-neutral-400 cursor-default"
                        : "bg-white hover:bg-neutral-200 text-black"
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </>
                    ) : isPending ? (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Links Bar */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-neutral-800 text-xs">
              {user.githubUrl && (
                <a
                  href={user.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 flex items-center gap-1.5 transition-colors border border-neutral-700"
                >
                  <Github className="w-3 h-3 text-white" />
                  <span>GitHub</span>
                </a>
              )}
              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 flex items-center gap-1.5 transition-colors border border-neutral-700"
                >
                  <Linkedin className="w-3 h-3 text-white" />
                  <span>LinkedIn</span>
                </a>
              )}
              {user.leetcodeUrl && (
                <a
                  href={user.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 flex items-center gap-1.5 transition-colors border border-neutral-700"
                >
                  <Code2 className="w-3 h-3 text-white" />
                  <span>LeetCode</span>
                </a>
              )}
              {user.portfolioUrl && (
                <a
                  href={user.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 flex items-center gap-1.5 transition-colors border border-neutral-700"
                >
                  <Globe className="w-3 h-3 text-white" />
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex items-center gap-1 px-6 border-b border-[#E5E5E5] bg-white overflow-x-auto no-scrollbar">
            {[
              { id: "overview", label: "Overview", icon: Briefcase },
              { id: "projects", label: `Projects (${user.projects?.length || 0})`, icon: FolderGit2 },
              { id: "certifications", label: `Certifications (${user.certifications?.length || 0})`, icon: Award },
              { id: "schedule", label: "Schedule", icon: Clock },
              { id: "education", label: "Education", icon: GraduationCap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                    isActive
                      ? "border-black text-black"
                      : "border-transparent text-neutral-500 hover:text-black"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-black" : "text-neutral-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Modal Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. OVERVIEW & BIO */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Bio</h3>
                  <p className="text-xs text-black leading-relaxed mt-2 bg-white p-4 rounded-lg border border-[#E5E5E5]">
                    {user.bio || "No bio added yet."}
                  </p>
                </div>

                {user.skills && user.skills.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2.5">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-[#E5E5E5] text-black"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white border border-[#E5E5E5]">
                    <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Career Stage</span>
                    <p className="text-xs font-semibold text-black mt-1 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-black" />
                      {user.userType === "STUDENT" ? "Student" : "Technology Professional"}
                    </p>
                  </div>

                  {user.cgpa && (
                    <div className="p-4 rounded-lg bg-white border border-[#E5E5E5]">
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Academic Metric</span>
                      <p className="text-xs font-semibold text-black mt-1 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-black" />
                        CGPA: {user.cgpa} / 10
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. PROJECTS */}
            {activeTab === "projects" && (
              <div className="space-y-4">
                {user.projects && user.projects.length > 0 ? (
                  user.projects.map((proj, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-white border border-[#E5E5E5] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-black">{proj.title}</h4>
                        <div className="flex items-center gap-2">
                          {proj.githubRepo && (
                            <a
                              href={proj.githubRepo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1"
                            >
                              <Github className="w-3.5 h-3.5" />
                              <span>Code</span>
                            </a>
                          )}
                          {proj.demoUrl && (
                            <a
                              href={proj.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-black hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Demo</span>
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed">{proj.description}</p>
                      {proj.technologies && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.technologies.map((t, tIdx) => (
                            <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg border border-[#E5E5E5] text-neutral-500 text-xs">
                    <FolderGit2 className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                    <p>No public portfolio projects listed yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* 3. CERTIFICATIONS */}
            {activeTab === "certifications" && (
              <div className="space-y-3">
                {user.certifications && user.certifications.length > 0 ? (
                  user.certifications.map((cert, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-neutral-100 text-black border border-[#E5E5E5] flex items-center justify-center shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-black">{cert.name}</h4>
                          <p className="text-[11px] text-neutral-500 mt-0.5">{cert.issuer} • Issued {cert.issueDate}</p>
                        </div>
                      </div>
                      {cert.url && (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded bg-white hover:bg-neutral-50 border border-[#E5E5E5] text-xs font-semibold text-black transition-colors flex items-center gap-1"
                        >
                          <span>Verify</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg border border-[#E5E5E5] text-neutral-500 text-xs">
                    <Award className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                    <p>No verified certifications listed yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* 4. SCHEDULE */}
            {activeTab === "schedule" && (
              <div className="space-y-3">
                {user.timetable && user.timetable.length > 0 ? (
                  user.timetable.map((slot, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 text-black flex items-center justify-center shrink-0 font-mono text-xs font-semibold">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">{slot.timeOfDay}</div>
                          <h4 className="text-xs font-semibold text-black mt-0.5">{slot.focus}</h4>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded bg-neutral-100 text-neutral-700 border border-[#E5E5E5]">
                        {slot.duration}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-white rounded-lg border border-[#E5E5E5] text-neutral-500 text-xs">
                    <Clock className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                    <p>No timetable set.</p>
                  </div>
                )}
              </div>
            )}

            {/* 5. EDUCATION */}
            {activeTab === "education" && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white border border-[#E5E5E5] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-black">
                    <GraduationCap className="w-4 h-4 text-black" />
                    <span>Education</span>
                  </div>
                  <div className="pl-6 text-xs text-neutral-700 space-y-1">
                    <p className="font-semibold text-black">{user.college || "University"}</p>
                    {user.degree && <p className="text-neutral-500">{user.degree}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-white border-t border-[#E5E5E5] flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Verified Profile</span>
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-black text-white font-semibold hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
