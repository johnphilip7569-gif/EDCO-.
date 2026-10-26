"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  Printer,
  Share2,
  Copy,
  ExternalLink,
  X,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export interface CertificateData {
  id: string;
  certificate_code?: string;
  certificateCode?: string;
  recipient_name?: string;
  recipientName?: string;
  course_title?: string;
  courseTitle?: string;
  course_category?: string;
  courseCategory?: string;
  course_slug?: string;
  courseSlug?: string;
  score_percentage?: number;
  scorePercentage?: number;
  verification_hash?: string;
  verificationHash?: string;
  issued_at?: string;
  issuedAt?: string;
}

interface VerifiableCertificateModalProps {
  certificate: CertificateData;
  onClose: () => void;
}

export function VerifiableCertificateModal({
  certificate,
  onClose,
}: VerifiableCertificateModalProps) {
  const [copied, setCopied] = useState(false);

  const certCode = certificate.certificate_code || certificate.certificateCode || "EDW-CERT-2026";
  const recipient = certificate.recipient_name || certificate.recipientName || "Candidate";
  const courseTitle = certificate.course_title || certificate.courseTitle || "Professional Course";
  const score = certificate.score_percentage ?? certificate.scorePercentage ?? 100;
  const rawDate = certificate.issued_at || certificate.issuedAt || new Date().toISOString();
  const dateFormatted = new Date(rawDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const hash = certificate.verification_hash || certificate.verificationHash || "";

  const verifyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/verify/${certCode}`
    : `https://learn.edworld.co.in/verify/${certCode}`;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareLinkedIn = () => {
    const text = `I just earned an official Certificate of Achievement in "${courseTitle}" from EdWorld Co. Verified Credential: ${certCode}`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}&summary=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-neutral-300 print:border-none print:shadow-none print:max-w-none print:overflow-visible">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-xs border-b border-neutral-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-600">
              Official Verifiable Credential
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy verification link"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>

            <button
              onClick={handleShareLinkedIn}
              className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Share on LinkedIn"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LinkedIn</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors ml-2 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-8 sm:p-12 text-center bg-white relative overflow-hidden select-text">
          {/* Subtle Guilloche / Luxury Border Ring */}
          <div className="absolute inset-4 rounded-2xl border-2 border-neutral-800 pointer-events-none" />
          <div className="absolute inset-5 rounded-2xl border border-neutral-300 pointer-events-none" />

          {/* Crest / Header */}
          <div className="relative z-10 space-y-3 pt-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-100 border border-neutral-300">
              <ShieldCheck className="w-4 h-4 text-neutral-900" />
              <span className="text-[11px] font-mono font-black uppercase tracking-widest text-neutral-800">
                EdWorld Co. &bull; Verified Learning Academy
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-neutral-950 uppercase pt-2">
              Certificate of Achievement
            </h1>

            <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Credential ID: <span className="font-bold text-neutral-900">{certCode}</span>
            </p>
          </div>

          {/* Recipient Details */}
          <div className="relative z-10 py-8 space-y-4 max-w-xl mx-auto">
            <p className="text-xs uppercase tracking-widest font-mono text-neutral-500">
              This is to certify that
            </p>

            <div className="border-b-2 border-neutral-950 pb-2 px-6">
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
                {recipient}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed pt-2">
              has successfully mastered the curriculum, completed interactive milestone roadmaps, and demonstrated technical rigor by passing the comprehensive assessment with a score of{" "}
              <strong className="font-bold text-neutral-950">{score}%</strong> in:
            </p>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 my-2">
              <h3 className="text-lg sm:text-xl font-black text-neutral-950">
                {courseTitle}
              </h3>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="relative z-10 grid grid-cols-3 items-end pt-6 pb-4 px-6 border-t border-neutral-200">
            {/* Verification Hash & QR Link */}
            <div className="text-left font-mono text-[10px] text-neutral-500 space-y-1">
              <div className="font-bold text-neutral-800">Tamper-Proof SHA-256:</div>
              <div className="truncate max-w-[180px] text-neutral-400 font-mono" title={hash}>
                {hash ? `${hash.slice(0, 16)}...` : "VERIFIED_RECORD"}
              </div>
              <div>Issued: <span className="text-neutral-800 font-bold">{dateFormatted}</span></div>
            </div>

            {/* Seal Badge */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-950 text-white border-4 border-white shadow-xl flex flex-col items-center justify-center p-2 relative">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span className="text-[8px] font-black tracking-widest uppercase text-center mt-0.5">
                  VERIFIED
                </span>
                <span className="text-[7px] text-neutral-300">ACADEMY</span>
              </div>
            </div>

            {/* Authority Signoff */}
            <div className="text-right space-y-1">
              <div className="font-serif italic text-lg sm:text-xl text-neutral-900 border-b border-neutral-400 pb-1">
                Adarsh Kolluru
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                Academic Director &bull; EdWorld Co.
              </div>
            </div>
          </div>

          {/* Footer Verification URL */}
          <div className="relative z-10 pt-4 text-center">
            <Link
              href={`/verify/${certCode}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-600 hover:text-black hover:underline"
            >
              <span>Verify credential authenticity at: {verifyUrl}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
