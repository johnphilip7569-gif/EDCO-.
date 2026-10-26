"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import Button from "@/components/ui/Button";

interface AccessDeniedPortalProps {
  portalName?: string;
  requiredRole?: string;
  userRole?: string;
  redirectTo?: string;
}

export default function AccessDeniedPortal({
  portalName = "Internal Operations",
  requiredRole = "Staff Member",
  userRole = "CLIENT",
  redirectTo = "/dashboard"
}: AccessDeniedPortalProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-white text-black selection:bg-black selection:text-white">
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-8 space-y-5 text-center animate-in fade-in duration-200">
        
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 text-black flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-bold text-black">
            <Lock className="w-3 h-3" />
            <span>403 Forbidden &bull; Restricted Portal</span>
          </div>
          <h1 className="text-2xl font-black font-sans text-black tracking-tight">
            Access Denied
          </h1>
          <p className="text-xs text-neutral-600 leading-relaxed font-normal">
            You do not have permission to access the <strong className="text-black">{portalName}</strong>. This portal is strictly restricted to authorized {requiredRole} personnel.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-left text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-[11px]">Your Active Role:</span>
            <span className="font-bold font-mono text-black bg-white px-2 py-0.5 rounded-md border border-neutral-200 text-[11px]">
              {userRole || "STUDENT / CLIENT"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-[11px]">Security Policy:</span>
            <span className="text-black font-bold text-[11px]">Strict Role Separation</span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            href={redirectTo}
            variant="primary"
            size="md"
            className="w-full justify-center shadow-xs"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            <span>Return to Permitted Workspace</span>
          </Button>
        </div>

      </div>
    </div>
  );
}
