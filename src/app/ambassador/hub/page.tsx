"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { 
  Award, 
  ArrowLeft, 
  Copy, 
  Check, 
  Share2, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function AmbassadorHubPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCopyText, setCopiedCopyText] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchHub = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/ambassador/hub?userId=${user.uid}`);
        const json = await res.json();
        if (res.ok) {
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHub();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-6 text-xs text-[#6B7280]">
        Loading your ambassador hub...
      </div>
    );
  }

  if (!data || !data.ambassador) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-6">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-md w-full p-8 text-center space-y-4 shadow-xs">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="text-lg font-bold text-[#111827]">Ambassador Access Required</h2>
          <p className="text-xs text-[#6B7280]">
            This hub is strictly reserved for approved Campus Ambassadors.
          </p>
          <Link href="/ambassador" className="btn-primary inline-block">
            Apply to be an Ambassador
          </Link>
        </div>
      </div>
    );
  }

  const { ambassador, totalReferrals, referrals } = data;
  const referralLink = `https://edworld.co.in/signup?ref=${ambassador.referral_code}`;

  const copyToClipboard = (text: string, type: "link" | "code") => {
    navigator.clipboard.writeText(text);
    if (type === "link") {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const PROMO_TEMPLATES = [
    {
      title: "Campus WhatsApp / Telegram Group Message",
      copy: `Hey everyone! 🚀 Preparing for placements and technical interviews? Check out EdWorld Co — it has AI Mock Panel Interviews, ATS Resume Maker, and real company interview experiences: ${referralLink}`
    },
    {
      title: "LinkedIn Post / Peer Recommendation",
      copy: `Excited to represent ${ambassador.college_name} as an official EdWorld Co Campus Ambassador! 🎓 If you are gearing up for software engineering, system design, or tech placements, join using my link to unlock curated interview prep drills: ${referralLink}`
    },
    {
      title: "1:1 Direct Message to Classmates",
      copy: `Hey! If you are practicing DSA or mock interviews for placement drives, try EdWorld Co with my ambassador referral code '${ambassador.referral_code}': ${referralLink}`
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link href="/ambassador" className="inline-flex items-center text-xs font-semibold text-[#2563EB] hover:underline mb-1">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Ambassador Portal
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#111827]">Ambassador Resource Hub</h1>
                <p className="text-xs text-[#6B7280]">{ambassador.college_name} • Private Ambassador Console</p>
              </div>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Active Ambassador
          </span>
        </div>

        {/* Referral Link & Code Banner */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#2563EB]">Your ambassador referral link</span>
            <span className="text-xs font-medium text-[#6B7280]">Code: <span className="font-mono">{ambassador.referral_code}</span></span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] font-mono text-xs text-[#111827] truncate">
              {referralLink}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => copyToClipboard(referralLink, "link")}
                className="btn-primary flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
              </button>
              <button
                onClick={() => copyToClipboard(ambassador.referral_code, "code")}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F7F8FA] text-[#111827] text-xs font-medium border border-[#E5E7EB] flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? "Copied" : "Copy Code"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Referral Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-1 shadow-xs">
            <span className="text-xs font-medium text-[#6B7280]">Total Attributed Campus Signups</span>
            <div className="text-2xl font-semibold text-[#111827] tabular-nums">{totalReferrals}</div>
            <p className="text-xs text-[#6B7280] pt-1">Students registered using your campus referral code</p>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-1 shadow-xs">
            <span className="text-xs font-medium text-[#2563EB]">Ambassador Recognition Badge</span>
            <div className="text-sm font-semibold text-[#111827] flex items-center gap-2 pt-1">
              <Award className="w-5 h-5 text-[#2563EB]" />
              <span>Campus Ambassador Badge Active</span>
            </div>
            <p className="text-xs text-[#6B7280]">Featured on your verified student profile</p>
          </div>
        </div>

        {/* Promotional Templates */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
            <Share2 className="w-5 h-5 text-[#2563EB]" />
            <h2 className="text-base font-semibold text-[#111827]">Promotional materials &amp; copy templates</h2>
          </div>

          <div className="space-y-3">
            {PROMO_TEMPLATES.map((tmpl, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#111827]">{tmpl.title}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(tmpl.copy);
                      setCopiedCopyText(idx);
                      setTimeout(() => setCopiedCopyText(null), 2000);
                    }}
                    className="text-xs font-medium text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCopyText === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCopyText === idx ? "Copied!" : "Copy Text"}</span>
                  </button>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed font-sans">{tmpl.copy}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Referral Activity Table */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <h2 className="text-base font-semibold text-[#111827]">Recent campus signups</h2>
            <span className="text-xs font-medium text-[#6B7280] tabular-nums">{totalReferrals} total</span>
          </div>

          {referrals.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#6B7280] italic">
              No signups attributed to your code yet. Share your referral link with classmates to start building campus traction.
            </div>
          ) : (
            <div className="space-y-2">
              {referrals.map((r: any) => (
                <div key={r.id} className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold">
                      {r.users?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <span className="font-semibold text-[#111827]">{r.users?.name || "Student"}</span>
                      <p className="text-xs text-[#6B7280]">{r.users?.email ? r.users.email.split('@')[0] + '@...' : "Joined"}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#6B7280] tabular-nums">
                    {new Date(r.signed_up_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
