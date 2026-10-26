"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Compass, Users, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export type MobileTab =
  | "home"
  | "explore"
  | "applications"
  | "community"
  | "profile"
  | "dashboard"
  | "learn"
  | "career"
  | "network"
  | "messages";

interface MobileBottomNavProps {
  className?: string;
  activeTab?: MobileTab;
  onTabChange?: (tab: MobileTab) => void;
  applicationsBadge?: number;
}

export function MobileBottomNav({
  className,
  activeTab,
  onTabChange,
  applicationsBadge,
}: MobileBottomNavProps) {
  const pathname = usePathname();

  // If onTabChange is provided, we are in prototype / simulator mode
  if (onTabChange) {
    const protoTabs: { id: MobileTab; label: string; icon: any; badge?: number }[] = [
      { id: "home", label: "Home", icon: LayoutDashboard },
      { id: "explore", label: "Explore", icon: Compass },
      { id: "applications", label: "Applications", icon: BookOpen, badge: applicationsBadge },
      { id: "community", label: "Community", icon: Users },
      { id: "profile", label: "Profile", icon: MessageSquare },
    ];

    return (
      <nav
        aria-label="Mobile Bottom Navigation"
        className={cn(
          "bg-white border-t border-[#E5E7EB] px-2 py-1 flex items-center justify-around shadow-sm select-none",
          className
        )}
      >
        {protoTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-lg transition-colors duration-150 outline-none",
                isActive ? "text-[#2563EB]" : "text-[#6B7280] hover:text-[#111827]"
              )}
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-150",
                    isActive ? "stroke-[2.2]" : "stroke-[1.7]"
                  )}
                />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#2563EB] text-white text-[9px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] mt-1 font-medium",
                  isActive ? "font-bold text-[#2563EB]" : "text-[#6B7280]"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    );
  }

  // Real responsive mobile bottom nav for the live app
  const tabs = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/learn", label: "Learning", icon: BookOpen },
    { href: "/career", label: "Career", icon: Compass },
    { href: "/network", label: "Network", icon: Users },
    { href: "/messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] px-2 py-1 flex items-center justify-around shadow-sm select-none",
        className
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          tab.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname?.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-lg transition-colors duration-150 outline-none",
              isActive
                ? "text-[#2563EB]"
                : "text-[#6B7280] hover:text-[#111827]"
            )}
            aria-label={tab.label}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon
              className={cn(
                "w-5 h-5 transition-transform duration-150",
                isActive ? "stroke-[2.2]" : "stroke-[1.7]"
              )}
            />
            <span
              className={cn(
                "text-[11px] mt-0.5 tracking-tight",
                isActive ? "font-semibold text-[#2563EB]" : "font-medium text-[#6B7280]"
              )}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export default MobileBottomNav;
