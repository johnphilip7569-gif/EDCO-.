import React from "react";
import Link from "next/link";
import { queryDb } from "@/lib/db-server";
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowLeft, ExternalLink, Sparkles } from "lucide-react";
import { PrintCertificateButton } from "@/components/learn/PrintCertificateButton";

export const dynamic = "force-dynamic";

interface VerifyPageProps {
  params: { certificateId: string };
}

export default async function CertificateVerifyPage({ params }: VerifyPageProps) {
  const rawId = (params.certificateId || "").trim();

  let certificate: any = null;
  let isVerified = false;

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawId);
    const sql = isUuid
      ? `SELECT c.*, co.skills, co.duration_weeks, co.level
         FROM public.course_certificates c
         LEFT JOIN public.courses co ON c.course_id = co.id
         WHERE c.id = $1
         LIMIT 1`
      : `SELECT c.*, co.skills, co.duration_weeks, co.level
         FROM public.course_certificates c
         LEFT JOIN public.courses co ON c.course_id = co.id
         WHERE LOWER(c.certificate_code) = LOWER($1)
         LIMIT 1`;

    const { rows } = await queryDb(sql, [rawId]);
    if (rows && rows.length > 0) {
      certificate = rows[0];
      isVerified = true;
    }
  } catch (err) {
    console.error("[Certificate Verification Query Error]:", err);
  }

  const dateFormatted = certificate
    ? new Date(certificate.issued_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-neutral-800 selection:text-white antialiased">
      {/* Top Header */}
      <header className="border-b border-neutral-800 bg-black/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/learn"
            className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>EdWorld Academy</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-neutral-400">
              Credential Verification Registry
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {isVerified && certificate ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Status Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                        Verified Valid
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">
                        {certificate.certificate_code}
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                      Authentic EdWorld Credential
                    </h1>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono text-xs text-neutral-400">
                  <div>Issued on</div>
                  <div className="text-neutral-200 font-bold">{dateFormatted}</div>
                </div>
              </div>

              {/* Certificate Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className="p-4 rounded-2xl bg-black/50 border border-neutral-800/80">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    Recipient Name
                  </span>
                  <div className="text-lg font-black text-white mt-1">
                    {certificate.recipient_name}
                  </div>
                  <div className="text-xs text-neutral-400 font-mono mt-0.5">
                    Verified Learner
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/50 border border-neutral-800/80">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    Assessment Performance
                  </span>
                  <div className="text-lg font-black text-emerald-400 mt-1">
                    {certificate.score_percentage}% Score
                  </div>
                  <div className="text-xs text-neutral-400 font-mono mt-0.5">
                    Passing threshold: 75%
                  </div>
                </div>

                <div className="sm:col-span-2 p-5 rounded-2xl bg-black/50 border border-neutral-800/80">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    Completed Course Curriculum
                  </span>
                  <div className="text-xl font-black text-white mt-1">
                    {certificate.course_title}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-medium">
                      {certificate.course_category}
                    </span>
                    {certificate.level && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-medium">
                        {certificate.level} Level
                      </span>
                    )}
                    {certificate.duration_weeks && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-medium">
                        {certificate.duration_weeks} Weeks
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              {Array.isArray(certificate.skills) && certificate.skills.length > 0 && (
                <div className="pt-6 border-t border-neutral-800 mt-6">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-2">
                    Demonstrated Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {certificate.skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-neutral-800 text-neutral-200 text-xs font-mono font-medium border border-neutral-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cryptographic Hash */}
              <div className="pt-6 border-t border-neutral-800 mt-6 font-mono text-[11px] text-neutral-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="text-neutral-400 font-bold">SHA-256 Hash: </span>
                  <span className="text-neutral-300 break-all select-all">
                    {certificate.verification_hash}
                  </span>
                </div>
                <div className="shrink-0 text-emerald-400 font-bold">
                  Immutable Record
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/learn"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white text-xs font-bold text-center transition-colors"
              >
                Browse All Academy Courses
              </Link>

              <PrintCertificateButton />
            </div>
          </div>
        ) : (
          /* Invalid / Not Found State */
          <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h1 className="text-2xl font-black text-white">
              Credential Verification Failed
            </h1>

            <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
              We could not find an authentic certificate matching the code{" "}
              <code className="px-2 py-0.5 rounded bg-black text-neutral-200 font-mono">
                {rawId || "UNKNOWN"}
              </code>
              . Please verify the code or contact support.
            </p>

            <div className="pt-4">
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Learn Academy</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
