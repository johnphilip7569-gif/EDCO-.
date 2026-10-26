"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Briefcase,
  BookOpen,
  Zap,
  Bookmark,
  User,
  Bell,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface FigmaOrganicDockProps {
  onOpenNotifications?: () => void;
}

export default function FigmaOrganicDock({ onOpenNotifications }: FigmaOrganicDockProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [hasUnread, setHasUnread] = useState(true);

  const navLinks = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/jobs", icon: Briefcase, label: "Career & Jobs" },
    { href: "/learn", icon: BookOpen, label: "Learn Courses" },
    { href: "/problems", icon: Zap, label: "Challenges & DSA" },
    { href: "/career", icon: Bookmark, label: "Career Roadmap" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <aside className="flex flex-col items-center justify-between py-1 shrink-0 select-none">
      
      {/* 1. Organic Vertical Dark Capsule Dock matching reference UI */}
      <div className="relative w-14 sm:w-16 rounded-[34px] bg-[#121214] text-white p-2 sm:p-2.5 flex flex-col items-center gap-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.38)] border border-neutral-800/80">
        
        {/* Navigation Items */}
        {navLinks.map((item, idx) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link
              key={idx}
              href={item.href}
              className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 group ${
                isActive
                  ? "bg-[#28263B] text-white shadow-[0_0_16px_rgba(91,71,184,0.4)] border border-[#5B47B8]/40"
                  : "text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 ${isActive ? "text-[#C4B5FD]" : ""}`} />
              {isActive && (
                <span className="sr-only">(Active)</span>
              )}
            </Link>
          );
        })}

      </div>

      {/* 2. Standalone Floating Notification Bell with Coral Unread Dot */}
      <div className="pt-4 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setHasUnread(false);
            if (onOpenNotifications) onOpenNotifications();
          }}
          className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-neutral-50 border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center text-neutral-700 hover:text-black transition-all cursor-pointer active:scale-95"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          {hasUnread && (
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#FF4757] ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* 3. Standalone Bottom Collapse / Logout Arrow Button */}
        <button
          type="button"
          onClick={async () => {
            try {
              await logout();
              window.location.href = "/login";
            } catch (err) {
              console.warn("Logout note:", err);
            }
          }}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-neutral-50 border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center text-neutral-500 hover:text-black transition-all cursor-pointer active:scale-95"
          title="Sign Out"
          aria-label="Sign out"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-600" />
        </button>
      </div>

    </aside>
  );
}
