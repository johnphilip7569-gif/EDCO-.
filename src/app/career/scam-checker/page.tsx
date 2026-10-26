"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/auth/AuthGuard";
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileSearch, 
  ArrowLeft, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Copy,
  Check,
  Building,
  Mail,
  RefreshCw,
  Info
} from "lucide-react";
import { ScamCheckResult, SAMPLE_SCAM_PRESETS } from "@/lib/scam-checker/scam-detector";
import StudioSticker from "@/components/studio/StudioSticker";

export const dynamic = "force-dynamic";

export default function ScamOfferCheckerPage() {
  const { user } = useAuth();
  
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [offerText, setOfferText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScamCheckResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleRunAnalysis = async (customText?: string, customComp?: string, customEmail?: string) => {
    const textToAnalyze = customText !== undefined ? customText : offerText;
    const compToAnalyze = customComp !== undefined ? customComp : companyName;
    const emailToAnalyze = customEmail !== undefined ? customEmail : contactEmail;

    if (!textToAnalyze.trim()) {
      setErrorMsg("Please paste the job description, offer letter, or recruiter message to analyze.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/scam-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToAnalyze,
          companyName: compToAnalyze,
          contactEmail: emailToAnalyze,
          userId: user?.uid
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setErrorMsg(data.error || "Unable to complete scam analysis.");
      }
    } catch (err: any) {
      console.error("Scam analysis failed:", err);
      setErrorMsg("Network error occurred while analyzing offer. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadPreset = (preset: typeof SAMPLE_SCAM_PRESETS[0]) => {
    setCompanyName(preset.companyName);
    setContactEmail(preset.contactEmail);
    setOfferText(preset.text);
    handleRunAnalysis(preset.text, preset.companyName, preset.contactEmail);
  };

  const handleReset = () => {
    setCompanyName("");
    setContactEmail("");
    setOfferText("");
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#FFF8EE] text-[#1B1B2F] font-sans pb-24 selection:bg-[#4D96FF] selection:text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-in fade-in">
          
          {/* Top Breadcrumb */}
          <div className="flex items-center justify-between">
            <Link
              href="/career"
              className="text-xs font-bold text-[#1B1B2F]/70 hover:text-[#1B1B2F] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Career OS</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-[10px] font-mono font-extrabold uppercase bg-white text-[#1B1B2F] border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]">
                Student Protection Sentinel
              </span>
              <span className="px-3 py-1 rounded-lg text-[10px] font-mono font-extrabold uppercase bg-[#4D96FF]/20 text-[#1B1B2F] border-2 border-[#1B1B2F]">
                AI + Heuristics
              </span>
            </div>
          </div>

          {/* Hero Header */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-[#1B1B2F] space-y-3 shadow-[6px_6px_0px_#1B1B2F]">
            <div className="flex items-center gap-2 flex-wrap">
              <StudioSticker bgColor="#4D96FF" textColor="#FFFFFF" rotate="slight-left" size="sm">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-white" />
                  Scam Sentinel AI
                </span>
              </StudioSticker>
              <span className="text-xs font-bold text-[#1B1B2F] bg-[#FFF8EE] px-3 py-1 rounded-lg border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]">
                Offer Letter &amp; Recruiter Audit
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1B1B2F] tracking-tight">
              Scam Offer Checker
            </h1>
            <p className="text-xs sm:text-sm text-[#1B1B2F]/75 max-w-2xl leading-relaxed font-medium">
              Verify campus placement offers, internships, and remote opportunities. Our engine scans for upfront fee extortion, free webmail impersonation, fake direct selection, and unregistered shadow recruiters.
            </p>
          </div>

          {/* Quick Presets for Instant Testing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#1B1B2F]">
                Test with Real-World Campus Presets
              </span>
              <span className="text-[11px] font-bold text-[#1B1B2F]/60">1-Click Simulation</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAMPLE_SCAM_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleLoadPreset(preset)}
                  className="p-4 rounded-xl border-2 border-[#1B1B2F] bg-white hover:bg-[#FFF8EE] text-left transition-all space-y-1.5 group cursor-pointer shadow-[3px_3px_0px_#1B1B2F] hover:shadow-[5px_5px_0px_#1B1B2F] hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#1B1B2F] group-hover:text-[#4D96FF] transition-colors">
                      {preset.title}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-[#1B1B2F]/60 group-hover:text-[#4D96FF]" />
                  </div>
                  <p className="text-[11px] text-[#1B1B2F]/70 line-clamp-2 font-medium">
                    {preset.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Main Inspection Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Form Column */}
            <div className="lg:col-span-6 space-y-5">
              <div className="p-6 sm:p-7 rounded-2xl bg-white border-2 border-[#1B1B2F] shadow-[6px_6px_0px_#1B1B2F] space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-[#1B1B2F]">
                    Paste Offer Details or Recruiter Message
                  </h3>
                  <p className="text-xs text-[#1B1B2F]/70 font-medium">
                    Include full email text, WhatsApp transcript, or compensation breakdown.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#1B1B2F] flex items-center gap-1">
                      <Building className="w-3 h-3 text-[#1B1B2F]" />
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Infosys, Tech Mahindra"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border-2 border-[#1B1B2F] bg-[#FFF8EE] font-medium text-[#1B1B2F] focus:outline-none shadow-[2px_2px_0px_#1B1B2F]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#1B1B2F] flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#1B1B2F]" />
                      Recruiter Email / Contact
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. hr@tcs.com or gmail ID"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border-2 border-[#1B1B2F] bg-[#FFF8EE] font-medium text-[#1B1B2F] focus:outline-none shadow-[2px_2px_0px_#1B1B2F]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#1B1B2F]">
                    Offer Letter / Email Transcript / JD Content *
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Paste the offer letter body, stipend terms, deposit requirements, or WhatsApp message here..."
                    value={offerText}
                    onChange={(e) => setOfferText(e.target.value)}
                    className="w-full p-3.5 text-xs rounded-xl border-2 border-[#1B1B2F] bg-[#FFF8EE] focus:bg-white focus:outline-none font-mono leading-relaxed shadow-[2px_2px_0px_#1B1B2F] text-[#1B1B2F]"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-[#FF6B6B]/20 border-2 border-[#1B1B2F] text-[#1B1B2F] text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_#1B1B2F]">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-[#FF6B6B]" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => handleRunAnalysis()}
                    disabled={isLoading || !offerText.trim()}
                    className="btn-squishy flex-1 py-3 px-5 rounded-xl bg-[#4D96FF] hover:bg-[#3d85ee] text-white text-xs font-black transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F]"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Analyzing Offer Safety...</span>
                      </>
                    ) : (
                      <>
                        <FileSearch className="w-4 h-4 text-white" />
                        <span>Run Threat Inspection</span>
                      </>
                    )}
                  </button>

                  {(offerText || result) && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn-squishy px-4 py-3 rounded-xl border-2 border-[#1B1B2F] bg-[#FFF8EE] hover:bg-white text-xs font-bold text-[#1B1B2F] transition-all cursor-pointer shadow-[2px_2px_0px_#1B1B2F]"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Verified Safeguards Banner */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/60 text-xs text-[#111827] space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-[#2563EB]">
                  <Info className="w-4 h-4" />
                  <span>Golden Rule for Campus Placement Safety</span>
                </div>
                <p className="text-[11px] text-[#4B5563] leading-relaxed">
                  Legitimate Indian &amp; Global IT companies <strong>NEVER</strong> demand security deposits for laptops, testing software, ID cards, or training. Any demand for UPI transfers is an immediate sign of fraud.
                </p>
              </div>
            </div>

            {/* Results Output Column */}
            <div className="lg:col-span-6 space-y-5">
              {!result && !isLoading && (
                <div className="p-10 rounded-2xl border-2 border-dashed border-[#1B1B2F] text-center space-y-3 bg-white shadow-[4px_4px_0px_#1B1B2F]">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF8EE] border-2 border-[#1B1B2F] flex items-center justify-center mx-auto text-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-[#1B1B2F]">
                    No Active Inspection
                  </h4>
                  <p className="text-xs text-[#1B1B2F]/70 max-w-sm mx-auto font-medium">
                    Paste offer text on the left or click one of the pre-loaded campus scenario cards above to run an instant safety audit.
                  </p>
                </div>
              )}

              {isLoading && (
                <div className="p-12 rounded-2xl border-2 border-[#1B1B2F] bg-white text-center space-y-4 shadow-[6px_6px_0px_#1B1B2F]">
                  <div className="w-10 h-10 border-4 border-[#1B1B2F] border-t-[#4D96FF] rounded-full animate-spin mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-[#1B1B2F]">Evaluating Against Threat Vectors...</h4>
                    <p className="text-xs text-[#1B1B2F]/70 font-medium">
                      Scanning free domains, payment demands, MCA registration, and high-pressure phrasing.
                    </p>
                  </div>
                </div>
              )}

              {result && !isLoading && (
                <div className="space-y-5 animate-in fade-in">
                  
                  {/* Score Card Header */}
                  <div className={`p-6 sm:p-7 rounded-2xl border-2 border-[#1B1B2F] shadow-[6px_6px_0px_#1B1B2F] ${
                    result.verdict === "HIGH_RISK_SCAM" 
                      ? "bg-[#FF6B6B]/15" 
                      : result.verdict === "MODERATE_RISK"
                      ? "bg-[#FFC93C]/20"
                      : "bg-[#6BCB77]/20"
                  } space-y-4`}>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-[#1B1B2F]/70">
                        Security Audit Verdict
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#1B1B2F]/70">
                        {new Date(result.checkedAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          {result.verdict === "HIGH_RISK_SCAM" ? (
                            <XCircle className="w-6 h-6 text-[#FF6B6B]" />
                          ) : result.verdict === "MODERATE_RISK" ? (
                            <AlertTriangle className="w-6 h-6 text-[#FFC93C]" />
                          ) : (
                            <CheckCircle2 className="w-6 h-6 text-[#6BCB77]" />
                          )}
                          <h2 className="text-lg sm:text-xl font-black text-[#1B1B2F]">
                            {result.verdict === "HIGH_RISK_SCAM" 
                              ? "Critical Threat: Probable Scam" 
                              : result.verdict === "MODERATE_RISK" 
                              ? "Moderate Risk: Caution Advised" 
                              : "Verified: Low Risk Profile"}
                          </h2>
                        </div>
                        <p className="text-xs text-[#1B1B2F]/80 mt-1 font-medium">
                          Audited Entity: <strong>{result.companyName}</strong>
                        </p>
                      </div>

                      {/* Visual Circular/Gauge Meter */}
                      <div className="text-center shrink-0">
                        <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F] font-mono ${
                          result.verdict === "HIGH_RISK_SCAM"
                            ? "bg-[#FF6B6B] text-white"
                            : result.verdict === "MODERATE_RISK"
                            ? "bg-[#FFC93C] text-[#1B1B2F]"
                            : "bg-[#6BCB77] text-[#1B1B2F]"
                        }`}>
                          <span className="text-xl font-black leading-none">{result.riskScore}</span>
                          <span className="text-[9px] font-extrabold uppercase mt-0.5">/ 100 Risk</span>
                        </div>
                      </div>
                    </div>

                    {/* Summary text */}
                    <div className="p-4 rounded-xl bg-white border-2 border-[#1B1B2F] text-xs text-[#1B1B2F] font-medium leading-relaxed shadow-[2px_2px_0px_#1B1B2F]">
                      {result.summary}
                    </div>
                  </div>

                  {/* Red Flags Pill List */}
                  {result.redFlags.length > 0 && (
                    <div className="p-6 rounded-2xl bg-white border-2 border-[#1B1B2F] space-y-4 shadow-[5px_5px_0px_#1B1B2F]">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#1B1B2F] flex items-center justify-between">
                        <span>Detected Red Flags ({result.redFlags.length})</span>
                        <span className="text-[10px] text-[#FF6B6B] font-mono font-extrabold">Immediate Inspection</span>
                      </h4>

                      <div className="space-y-3">
                        {result.redFlags.map((flag, idx) => (
                          <div 
                            key={idx}
                            className="p-3.5 rounded-xl border-2 border-[#1B1B2F] bg-[#FFF8EE] space-y-1 shadow-[2px_2px_0px_#1B1B2F]"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-[#1B1B2F]">
                                {flag.title}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase bg-[#FF6B6B]/20 text-[#1B1B2F] border border-[#1B1B2F]">
                                {flag.severity}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#1B1B2F]/75 leading-relaxed font-medium">
                              {flag.description}
                            </p>
                            {flag.matchedSnippet && (
                              <div className="text-[10px] font-mono text-[#1B1B2F] bg-white px-2 py-0.5 rounded border border-[#1B1B2F] w-fit font-bold">
                                Matched: &ldquo;{flag.matchedSnippet}&rdquo;
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Checklist & External Verifications */}
                  <div className="p-6 rounded-2xl bg-white border-2 border-[#1B1B2F] space-y-4 shadow-[5px_5px_0px_#1B1B2F]">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#1B1B2F]">
                      Student Due Diligence Checklist
                    </h4>
                    
                    <ul className="space-y-2.5">
                      {result.safetyChecklist.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-[#1B1B2F] font-medium">
                          <CheckCircle2 className="w-4 h-4 text-[#6BCB77] shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-3 flex flex-wrap items-center gap-2.5 border-t-2 border-[#1B1B2F]/10">
                      <a
                        href={result.mcaVerificationUrl || "https://www.mca.gov.in"}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-squishy px-3.5 py-2 rounded-xl border-2 border-[#1B1B2F] bg-[#FFF8EE] hover:bg-white text-xs font-bold text-[#1B1B2F] flex items-center gap-1.5 transition-all cursor-pointer shadow-[2px_2px_0px_#1B1B2F]"
                      >
                        <span>Check MCA Company Database</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#1B1B2F]" />
                      </a>

                      <a
                        href="https://cybercrime.gov.in"
                        target="_blank"
                        rel="noreferrer"
                        className="btn-squishy px-3.5 py-2 rounded-xl border-2 border-[#1B1B2F] bg-[#FF6B6B]/20 hover:bg-[#FF6B6B]/30 text-xs font-bold text-[#1B1B2F] flex items-center gap-1.5 transition-all cursor-pointer shadow-[2px_2px_0px_#1B1B2F]"
                      >
                        <span>Report to National Cyber Crime Portal</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#1B1B2F]" />
                      </a>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </AuthGuard>
  );
}
