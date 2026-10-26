"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, MapPin, Mail, Cookie } from "lucide-react";
import EdworldLogo from "@/components/ui/EdworldLogo";

export default function Footer() {
  const handleOpenCookiePreferences = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("edworld-open-cookie-preferences"));
    }
  };

  return (
    <footer className="border-t border-neutral-200 py-12 px-4 sm:px-6 lg:px-8 text-xs text-neutral-600 bg-white font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Grid: Company Info, Statutory Disclosures & Legal Nav */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Statutory Entity */}
          <div className="space-y-3 md:col-span-2">
            <EdworldLogo size="md" />
            <p className="text-xs text-neutral-600 max-w-md leading-relaxed">
              Technical interview and career preparation platform. ATS resume builder, lockdown mock interviews, hands-on production engineering drills, and verified peer networking.
            </p>
            <div className="space-y-1 text-xs text-neutral-600 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>Operating Headquarters: <strong>Hyderabad, Telangana, India</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>Grievance &amp; Support: <a href="mailto:edworld.eden@gmail.com" className="font-bold text-black hover:underline">edworld.eden@gmail.com</a></span>
              </div>
            </div>
          </div>

          {/* Legal Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-black">Legal &amp; Privacy</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-black transition-colors">
                  Privacy Policy (DPDP 2023)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-black transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-black transition-colors">
                  Refund &amp; Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-black transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleOpenCookiePreferences}
                  className="hover:text-black transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <Cookie className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Cookie Preferences</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-black">Trust &amp; Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  Grievance Officer Redressal
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-black transition-colors">
                  Transparent Pricing (GST Included)
                </Link>
              </li>
              <li>
                <Link href="/consent/verify" className="hover:text-black transition-colors">
                  Minor Guardian Verification
                </Link>
              </li>
              <li className="pt-1 text-[11px] text-neutral-500">
                Typography: Inter &amp; Fraunces (SIL OFL 1.1)
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Badges, Compliance */}
        <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} EdWorld Co. All rights reserved. Registered in India.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-black font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              DPDP Act 2023 Compliant
            </span>
            <span className="flex items-center gap-1 text-black font-semibold">
              <Lock className="w-3.5 h-3.5" />
              PCI-DSS Level 1 via Razorpay
            </span>
            <span className="text-neutral-500">
              WCAG 2.1 AA Accessible
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
