"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { useAuth } from "@/lib/auth-context";
import { 
  LayoutDashboard,
  Hammer,
  Users, 
  Briefcase, 
  Award, 
  Mail, 
  ShieldCheck, 
  Activity,
  ArrowLeft, 
  LogOut,
  Menu, 
  X,
  ExternalLink
} from "lucide-react";

const ADMIN_NAV_LINKS = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/edbuild",
    label: "EdBuild Reviews",
    icon: Hammer,
  },
  {
    href: "/admin/users",
    label: "Users & Dossiers",
    icon: Users,
  },
  {
    href: "/admin/jobs",
    label: "Jobs & Openings",
    icon: Briefcase,
  },
  {
    href: "/admin/ambassadors",
    label: "Ambassadors",
    icon: Award,
  },
  {
    href: "/admin/bulk-mail",
    label: "Bulk Mailer",
    icon: Mail,
  },
  {
    href: "/admin/security",
    label: "Security SOC",
    icon: ShieldCheck,
  },
  {
    href: "/admin/system-health",
    label: "System Health",
    icon: Activity,
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminName = profile?.name || user?.name || user?.email?.split("@")[0] || "Administrator";
  const adminRole = role || "ADMIN";

  const handleSignOut = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <AuthGuard allowedRoles={["ADMIN", "SUPER_ADMIN", "FOUNDER"]}>
      <ErrorBoundary moduleName="Admin Operations Portal" fallbackTitle="Admin Hub Notice">
        <div className="min-h-screen bg-[#F7F8FA] text-[#111827] flex flex-col font-sans selection:bg-[#2563EB] selection:text-white">
          
          {/* Top Dedicated Admin Navigation Header (Pure SaaS Minimal) */}
          <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-2xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16 gap-4">
                
                {/* Brand & Admin Badge */}
                <div className="flex items-center gap-3 shrink-0">
                  <Link href="/admin" className="flex items-center gap-2.5 group">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center border border-[#111827] transition-transform group-hover:scale-105 duration-150 shrink-0">
                      <Image
                        src="/images/edworld-mark.png"
                        alt="EdWorld Co. Logo"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                    <div className="flex items-center gap-1.5 leading-none">
                      <span className="font-bold text-base tracking-tight text-[#111827]">
                        EdWorld
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#111827] text-white">
                        Admin OS
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Desktop Admin Tabs (All Features) */}
                <nav className="hidden xl:flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                  {ADMIN_NAV_LINKS.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact 
                      ? pathname === item.href 
                      : pathname === item.href || pathname.startsWith(item.href + "/");

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 shrink-0 ${
                          isActive
                            ? "bg-[#F7F8FA] text-[#2563EB] border border-[#E5E7EB] shadow-2xs"
                            : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FA]"
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#2563EB]" : "text-[#6B7280]"}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Right Controls: Identity, App Switcher, Sign Out */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  
                  {/* Identity Badge */}
                  <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-[#111827] max-w-[120px] truncate" title={adminName}>
                      {adminName}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-white border border-[#E5E7EB] text-[#2563EB]">
                      {adminRole}
                    </span>
                  </div>

                  {/* Return to Student App */}
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#111827] bg-white hover:bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer shadow-2xs"
                    title="Exit Admin to Student Dashboard"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span className="hidden sm:inline">Exit to App</span>
                  </Link>

                  {/* Sign Out */}
                  <button
                    onClick={handleSignOut}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-[#6B7280] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Sign Out of Admin"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>

                  {/* Mobile Drawer Toggle */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="xl:hidden p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F7F8FA] border border-[#E5E7EB]"
                    aria-label="Toggle admin navigation menu"
                  >
                    {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </button>
                </div>

              </div>
            </div>

            {/* Tablet Sub-Navigation Strip (Visible on md & lg, hidden on xl and mobile) */}
            <div className="hidden md:flex xl:hidden border-t border-[#E5E7EB] bg-[#F7F8FA] px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto no-scrollbar gap-1">
              {ADMIN_NAV_LINKS.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact 
                  ? pathname === item.href 
                  : pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? "bg-white text-[#2563EB] border border-[#E5E7EB] shadow-2xs"
                        : "text-[#6B7280] hover:text-[#111827] hover:bg-white/60"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#2563EB]" : "text-[#6B7280]"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
              <div className="xl:hidden border-t border-[#E5E7EB] bg-white px-4 py-3 space-y-1 shadow-md animate-in slide-in-from-top-2 duration-150">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Admin Modules
                </div>
                {ADMIN_NAV_LINKS.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact 
                    ? pathname === item.href 
                    : pathname === item.href || pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-[#F7F8FA] text-[#2563EB] border border-[#E5E7EB]"
                          : "text-[#111827] hover:bg-[#F7F8FA]"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#2563EB]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <div className="pt-2 border-t border-[#E5E7EB] space-y-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#111827] hover:bg-[#F7F8FA] rounded-lg"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Exit Admin to Student Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </header>

          {/* Main Admin Workspace Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>

        </div>
      </ErrorBoundary>
    </AuthGuard>
  );
}
