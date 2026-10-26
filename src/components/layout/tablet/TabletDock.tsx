"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Folder,
  PenSquare,
  Clock,
  Boxes,
  User,
  Headphones,
  Settings,
  LogOut,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface TabletDockProps {
  onOpenMyra?: () => void;
}

export default function TabletDock({ onOpenMyra }: TabletDockProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleOpenMyra = () => {
    if (onOpenMyra) {
      onOpenMyra();
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-myra-copilot"));
    }
  };

  const navItems = [
    {
      id: "dashboard",
      href: "/dashboard",
      icon: LayoutGrid,
      label: "Dashboard",
      isActive: pathname === "/dashboard" || pathname === "/",
    },
    {
      id: "courses",
      href: "/learn",
      icon: Folder,
      label: "Courses & Learning",
      isActive: pathname === "/learn" || pathname?.startsWith("/courses") || pathname?.startsWith("/learn/"),
    },
    {
      id: "problems",
      href: "/problems",
      icon: PenSquare,
      label: "Practice & DSA Challenges",
      isActive: pathname?.startsWith("/problems"),
    },
    {
      id: "career",
      href: "/career",
      icon: Clock,
      label: "Career Roadmap & Schedule",
      isActive: pathname?.startsWith("/career"),
    },
    {
      id: "projects",
      href: "/projects",
      icon: Boxes,
      label: "Projects & Labs",
      isActive: pathname?.startsWith("/projects") || pathname?.startsWith("/interviews"),
    },
    {
      id: "profile",
      href: "/profile",
      icon: User,
      label: "Student Profile & Digital ID",
      isActive: pathname === "/profile" || pathname?.startsWith("/profile/"),
    },
  ];

  return (
    <aside
      className="w-16 sm:w-20 bg-[#1c1d21] text-white flex flex-col items-center justify-between py-6 px-2 select-none shrink-0 rounded-l-[32px] sm:rounded-l-[40px] border-r border-neutral-800/60"
      aria-label="Navigation dock"
    >
      {/* Top Nav Cluster */}
      <div className="flex flex-col items-center gap-3 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-200 group rounded-2xl ${
                item.isActive
                  ? "bg-[#fed049] text-neutral-900 shadow-md font-bold scale-105"
                  : "text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  item.isActive ? "text-neutral-900 stroke-[2.4]" : "stroke-[1.8]"
                }`}
              />
            </Link>
          );
        })}

        {/* Myra AI Copilot Action Button */}
        <button
          type="button"
          onClick={handleOpenMyra}
          className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-neutral-400 hover:text-[#fed049] hover:bg-white/10 transition-all rounded-2xl cursor-pointer group"
          title="Myra AI Career Guide & Copilot"
          aria-label="Ask Myra AI"
        >
          <Headphones className="w-5 h-5 transition-transform group-hover:scale-110 stroke-[1.8]" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#ff5733] ring-2 ring-[#1c1d21] animate-pulse" />
        </button>
      </div>

      {/* Bottom Settings & Sign Out Cluster */}
      <div className="flex flex-col items-center gap-3 w-full pt-4 border-t border-neutral-800/60">
        <Link
          href="/settings"
          className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center transition-all rounded-2xl group ${
            pathname?.startsWith("/settings")
              ? "bg-[#fed049] text-neutral-900"
              : "text-neutral-400 hover:text-white hover:bg-white/10"
          }`}
          title="Settings"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 stroke-[1.8] group-hover:rotate-45 transition-transform" />
        </Link>

        <button
          type="button"
          onClick={async () => {
            try {
              await logout();
              router.push("/login");
            } catch (err) {
              console.warn("Logout error:", err);
            }
          }}
          className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-2xl cursor-pointer group"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <LogOut className="w-5 h-5 stroke-[1.8] group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>
    </aside>
  );
}
