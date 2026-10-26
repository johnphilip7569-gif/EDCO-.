"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { 
  Bell, 
  Check, 
  Info, 
  AlertTriangle, 
  Briefcase, 
  Video, 
  FileText, 
  CheckSquare, 
  X,
  Award,
  Sparkles,
  ExternalLink,
  Code2
} from "lucide-react";

export interface RoleNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "action" | "alert" | "success";
  href?: string;
  allowedRoles: string[];
}

export default function RoleScopedNotifications() {
  const { role, isEmployee, isHR, isFounder, isCollegeAdmin, isAdmin, isSuperAdmin, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Active role
  const effectiveRole = role || (isSuperAdmin ? "SUPER_ADMIN" : isAdmin ? "ADMIN" : isFounder ? "FOUNDER" : isHR ? "HR" : isEmployee ? "EMPLOYEE" : isCollegeAdmin ? "COLLEGE_ADMIN" : "STUDENT");

  // Notifications state with persistence
  const [notifications, setNotifications] = useState<RoleNotification[]>([
    {
      id: "notif-app-1",
      title: "Job Application Update",
      message: "Stripe Alumni Syndicate moved your application for Systems Engineer to Interviewing.",
      timestamp: "15m ago",
      read: false,
      type: "success",
      href: "/career/applications",
      allowedRoles: ["STUDENT", "CLIENT", "ADMIN", "SUPER_ADMIN"]
    },
    {
      id: "notif-edbuild-1",
      title: "EdBuild Project Certified",
      message: "Your capstone sprint has been officially approved! Digital Certificate is ready.",
      timestamp: "1h ago",
      read: false,
      type: "action",
      href: "/edbuild",
      allowedRoles: ["STUDENT", "CLIENT", "ADMIN", "SUPER_ADMIN"]
    },
    {
      id: "notif-interview-1",
      title: "AI Diagnostic Finalized",
      message: "Myra evaluated your Level 1 SWE practice round. STAR structure score: 88%.",
      timestamp: "3h ago",
      read: false,
      type: "info",
      href: "/interviews",
      allowedRoles: ["STUDENT", "CLIENT", "ADMIN", "SUPER_ADMIN"]
    },
    {
      id: "notif-dsa-1",
      title: "Daily DSA Problem Ready",
      message: "Today's challenge: 'LRU Cache Design & Concurrency' is now unlocked.",
      timestamp: "5h ago",
      read: true,
      type: "info",
      href: "/problems",
      allowedRoles: ["STUDENT", "CLIENT", "ADMIN", "SUPER_ADMIN"]
    },
    {
      id: "notif-emp-1",
      title: "Candidate Dossier Review",
      message: "3 new verified applicant dossiers submitted for Full-Stack SaaS Developer.",
      timestamp: "45m ago",
      read: false,
      type: "action",
      href: "/jobs/employer",
      allowedRoles: ["EMPLOYEE", "HR", "FOUNDER", "ADMIN", "SUPER_ADMIN"]
    },
    {
      id: "notif-founder-1",
      title: "Platform Health & Metrics",
      message: "Zero downtime maintained across 113 production routes. P99 latency: 28ms.",
      timestamp: "2h ago",
      read: true,
      type: "info",
      href: "/admin/system-health",
      allowedRoles: ["FOUNDER", "ADMIN", "SUPER_ADMIN"]
    }
  ]);

  // Load read state from localStorage if available
  useEffect(() => {
    if (user?.uid) {
      try {
        const saved = localStorage.getItem(`edworld_notifs_read_${user.uid}`);
        if (saved) {
          const readIds: string[] = JSON.parse(saved);
          setNotifications(prev => prev.map(n => readIds.includes(n.id) ? { ...n, read: true } : n));
        }
      } catch (e) {}
    }
  }, [user?.uid]);

  // Filter for authenticated user's role
  const userNotifications = notifications.filter((n) =>
    n.allowedRoles.includes(effectiveRole)
  );

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      if (user?.uid) {
        try {
          localStorage.setItem(`edworld_notifs_read_${user.uid}`, JSON.stringify(updated.map(u => u.id)));
        } catch (e) {}
      }
      return updated;
    });
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => n.id === id ? { ...n, read: true } : n);
      if (user?.uid) {
        try {
          const readIds = updated.filter(u => u.read).map(u => u.id);
          localStorage.setItem(`edworld_notifs_read_${user.uid}`, JSON.stringify(readIds));
        } catch (e) {}
      }
      return updated;
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FA] border border-transparent hover:border-[#E5E7EB] transition-colors cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2563EB] rounded-full ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-3.5 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#111827]">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E7EB]">
              {userNotifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#6B7280]">
                  No notifications for your portal right now.
                </div>
              ) : (
                userNotifications.map((notif) => {
                  const getIcon = () => {
                    if (notif.type === "success") return <Award className="w-3.5 h-3.5 text-emerald-600" />;
                    if (notif.type === "action") return <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />;
                    if (notif.type === "alert") return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
                    return <Info className="w-3.5 h-3.5 text-[#2563EB]" />;
                  };

                  return (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-3.5 flex items-start gap-3 transition-colors ${
                        notif.read ? "bg-white hover:bg-[#F7F8FA]" : "bg-blue-50/40 hover:bg-blue-50/70"
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5">
                        {getIcon()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-[#111827] truncate">{notif.title}</p>
                          <span className="text-[10px] text-[#6B7280] shrink-0 font-medium">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{notif.message}</p>
                        
                        {notif.href && (
                          <Link
                            href={notif.href}
                            onClick={() => setIsOpen(false)}
                            className="text-[11px] font-semibold text-[#2563EB] hover:underline mt-1.5 inline-flex items-center gap-1"
                          >
                            <span>Open Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>

                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0 mt-1.5" />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-[#F7F8FA] border-t border-[#E5E7EB] text-center">
              <span className="text-[11px] text-[#6B7280]">
                Real-time updates calibrated to your EdWorld activity
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
