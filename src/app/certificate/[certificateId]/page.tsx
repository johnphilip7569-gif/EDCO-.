"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ShieldCheck, 
  Printer, 
  Share2, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  Award,
  Layers,
  ExternalLink
} from "lucide-react";

interface CertificateData {
  certificate_code: string;
  recipient_name: string;
  project_name: string;
  issued_at: string;
  verification_hash: string;
  problem_statement?: string;
  submission_repo_url?: string;
}

export default function CertificatePage() {
  const params = useParams();
  const certId = (params?.certificateId as string) || "";

  const [cert, setCert] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadCert() {
      try {
        setLoading(true);
        const res = await fetch(`/api/certificate/${certId}`);
        const data = await res.json();
        if (data.success && data.certificate) {
          setCert(data.certificate);
        } else {
          setError(data.error || "Certificate not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load certificate");
      } finally {
        setLoading(false);
      }
    }

    if (certId) {
      loadCert();
    }
  }, [certId]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const recipientName = cert?.recipient_name || "Valued Engineer";
  const projectName = cert?.project_name || "EdBuild Engineering Project";
  const certCode = cert?.certificate_code || certId;
  const issueDateFormatted = cert?.issued_at
    ? new Date(cert.issued_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#111827] font-sans selection:bg-[#2563EB] selection:text-white pb-20">
      
      {/* Top Navbar / Controls (Hidden when printing) */}
      <nav className="print:hidden bg-white border-b border-[#E5E7EB] sticky top-0 z-40 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/edbuild"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to EdBuild Hub</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#111827] bg-[#F7F8FA] hover:bg-gray-200 border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* Verification Status Alert (Hidden when printing) */}
        <section className="print:hidden p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-[#111827]">
                  Official Verified Credential
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  AUTHENTIC
                </span>
              </div>
              <p className="text-xs text-[#6B7280] font-mono mt-0.5">
                Credential ID: {certCode} &bull; Issued {issueDateFormatted}
              </p>
            </div>
          </div>

          <div className="text-xs text-[#6B7280]">
            Project: <strong className="text-[#111827]">{projectName}</strong>
          </div>
        </section>

        {/* Certificate Display Canvas */}
        <section className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E5E7EB] print:shadow-none print:border-none print:rounded-none">
          
          {/* Certificate Aspect-Ratio Wrapper (Matches certificate image proportions ~ 1.414 : 1) */}
          <div className="relative w-full aspect-[1.414/1] bg-white overflow-hidden select-none">
            
            {/* Background Template Image */}
            <img
              src="/images/certificate-template.jpg"
              alt="EdWorld Co. Certificate of Completion"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />

            {/* DYNAMIC NAME OVERLAY (Placed precisely over "your name") */}
            <div 
              className="absolute left-0 right-0 text-center"
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                paddingLeft: "8%",
                paddingRight: "8%",
              }}
            >
              <span 
                className="inline-block text-[#356bb0] font-normal tracking-wide transform -rotate-1"
                style={{
                  fontFamily: "'Dancing Script', 'Caveat', 'Brush Script MT', 'Segoe Script', cursive",
                  fontSize: "clamp(24px, 4.2vw, 54px)",
                  lineHeight: "1.2",
                  textShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                {recipientName}
              </span>
            </div>

            {/* Metadata Footer Code Overlay */}
            <div 
              className="absolute bottom-[4%] left-[6%] text-[10px] sm:text-xs font-mono text-gray-500 tracking-wider"
            >
              ID: {certCode}
            </div>

            <div 
              className="absolute bottom-[4%] right-[6%] text-[10px] sm:text-xs font-mono text-gray-500 tracking-wider"
            >
              {issueDateFormatted}
            </div>
          </div>
        </section>

        {/* Certificate Credential Verification Details (Hidden when printing) */}
        {cert && (
          <section className="print:hidden bg-white rounded-xl border border-[#E5E7EB] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#2563EB]" />
              <span>Credential &amp; Project Verification Record</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[#6B7280] block mb-1">Recipient Name</span>
                <strong className="text-sm text-[#111827]">{cert.recipient_name}</strong>
              </div>

              <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[#6B7280] block mb-1">Project Milestone</span>
                <strong className="text-sm text-[#111827]">{cert.project_name}</strong>
              </div>

              <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[#6B7280] block mb-1">Issuing Authority</span>
                <strong className="text-sm text-[#111827]">EdWorld Co. Learn / Grow / Build</strong>
              </div>

              <div className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[#6B7280] block mb-1">Signed By</span>
                <strong className="text-sm text-[#111827]">Adarsh Kolluru, Founder</strong>
              </div>
            </div>

            {cert.verification_hash && (
              <div className="pt-2 border-t border-[#E5E7EB] text-[11px] text-[#6B7280] font-mono break-all">
                SHA-256 Authenticity Hash: {cert.verification_hash}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
