"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  MessageCircle,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import StudioSticker from "@/components/studio/StudioSticker";
import Card3DTilt from "@/components/studio/Card3DTilt";
import {
  ScribbleUnderline,
  DoodleStar,
  DoodleSparkle,
} from "@/components/studio/DoodleAccents";
import confetti from "canvas-confetti";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("General Support");
  const [message, setMessage] = useState("");
  const [consentAgreed, setConsentAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    if (!consentAgreed) {
      setErrorMsg("Please grant consent for processing your contact details to submit this inquiry.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          category,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        if (typeof window !== "undefined") {
          confetti({
            particleCount: 60,
            spread: 50,
            origin: { y: 0.8 },
            colors: ["#FFC93C", "#FF6B6B", "#2EC4B6"],
          });
        }
      } else {
        setErrorMsg(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error occurred. Please try again or email edworld.eden@gmail.com directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <StudioSticker bgColor="#2EC4B6" textColor="#1B1B2F" rotate="slight-left" size="sm">
            ✦ Studio Office &amp; Support
          </StudioSticker>
          <StudioSticker bgColor="#FFC93C" textColor="#1B1B2F" rotate="slight-right" size="sm">
            DPDP Grievance Redressal
          </StudioSticker>
        </div>

        <h1 className="font-display font-black text-4xl sm:text-6xl text-[#1B1B2F] tracking-tight">
          We're here to{" "}
          <span className="relative inline-block text-[#FF6B6B]">
            help you thrive.
            <ScribbleUnderline color="#FF6B6B" className="absolute -bottom-2 left-0 w-full" />
          </span>
        </h1>

        <p className="font-studio text-sm sm:text-base text-[#4A4A68] leading-relaxed">
          Have questions about your mock interviews, resume optimization, institutional partnerships, or data privacy? Reach our Hyderabad studio team directly.
        </p>
      </section>

      {/* Grid: Details Left, Form Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
        
        {/* Left Column: Studio Details & Statutory Redressal */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Studio Office Details Card */}
          <div className="rounded-3xl bg-white border-2 border-[#1B1B2F] p-6 sm:p-7 shadow-[6px_6px_0px_#1B1B2F] space-y-4">
            <span className="font-heading font-extrabold text-[10px] uppercase text-[#7E7E9A] tracking-wider block">
              Physical Operations
            </span>
            <div className="space-y-3 text-xs font-studio text-[#1B1B2F]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#FF6B6B] shrink-0 mt-0.5" />
                <span>
                  <strong>Operating Studio:</strong><br />
                  HITEC City, Madhapur, Hyderabad, Telangana 500081, India
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#4D96FF] shrink-0" />
                <span>
                  <strong>Support Email:</strong><br />
                  <a href="mailto:edworld.eden@gmail.com" className="font-bold underline hover:text-[#FF6B6B]">
                    edworld.eden@gmail.com
                  </a>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-[#2EC4B6] shrink-0" />
                <span>
                  <strong>Student WhatsApp:</strong><br />
                  <a
                    href="https://wa.me/919999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline hover:text-[#2EC4B6]"
                  >
                    Direct Student Hotline
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Statutory DPDP Grievance Officer Card */}
          <div className="rounded-3xl bg-[#FFF8EE] border-2 border-[#1B1B2F] p-6 shadow-[4px_4px_0px_#1B1B2F] space-y-3">
            <div className="flex items-center gap-2 text-xs font-heading font-extrabold text-[#1B1B2F]">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <span>Statutory Grievance Officer (DPDP Act)</span>
            </div>
            <p className="font-studio text-[11px] text-[#4A4A68] leading-relaxed">
              In accordance with the Digital Personal Data Protection Act 2023 &amp; IT Act 2000:
            </p>
            <div className="p-3 rounded-2xl bg-white border border-[#1B1B2F]/20 text-[11px] font-studio space-y-1">
              <div><strong>Designation:</strong> Head of Compliance &amp; Data Privacy</div>
              <div><strong>Email:</strong> edworld.eden@gmail.com</div>
              <div><strong>Response SLA:</strong> Within 24–48 working hours</div>
            </div>
          </div>

        </div>

        {/* Right Column: Tactile Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-white border-2 border-[#1B1B2F] p-6 sm:p-9 shadow-[8px_8px_0px_#1B1B2F]">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl border-2 border-emerald-600 flex items-center justify-center mx-auto shadow-[3px_3px_0px_#1B1B2F]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-black text-xl text-[#1B1B2F]">
                  Inquiry Successfully Received!
                </h3>
                <p className="font-studio text-xs sm:text-sm text-[#4A4A68] max-w-sm mx-auto">
                  Thank you, <strong>{name}</strong>. Your message has been logged. Our Hyderabad team will respond to <strong>{email}</strong> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h2 className="font-heading font-black text-xl text-[#1B1B2F]">
                    Send a Message to the Studio
                  </h2>
                  <p className="font-studio text-xs text-[#7E7E9A]">
                    Fill in your query details below for immediate routing.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-2xl bg-rose-50 border-2 border-rose-600 text-rose-900 text-xs font-heading font-bold">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-heading font-extrabold text-xs text-[#1B1B2F]">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ananya Roy"
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] text-xs font-studio text-[#1B1B2F] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-heading font-extrabold text-xs text-[#1B1B2F]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ananya@example.com"
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] text-xs font-studio text-[#1B1B2F] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-heading font-extrabold text-xs text-[#1B1B2F]">
                    Inquiry Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] text-xs font-studio text-[#1B1B2F] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  >
                    <option value="General Support">General Platform Support</option>
                    <option value="Data Privacy & Consent">Data Privacy &amp; Consent (DPDP)</option>
                    <option value="Mock Interview Issue">3D Mock Interview Studio Assistance</option>
                    <option value="Resume Tailoring">ATS Resume Builder Support</option>
                    <option value="Institutional Partnership">University / Campus Partnership</option>
                    <option value="Billing & Subscription">Billing &amp; Subscription Inquiries</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-heading font-extrabold text-xs text-[#1B1B2F]">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry with relevant details..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF8EE] border-2 border-[#1B1B2F] text-xs font-studio text-[#1B1B2F] focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="contactConsent"
                    required
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-2 border-[#1B1B2F] text-[#FF6B6B] focus:ring-[#FF6B6B] cursor-pointer"
                  />
                  <label htmlFor="contactConsent" className="text-xs font-studio text-[#4A4A68] cursor-pointer leading-tight">
                    I consent to EdWorld Co. processing my name, email, and inquiry details to resolve this request in accordance with the{" "}
                    <Link href="/privacy" className="font-bold underline text-[#1B1B2F]" target="_blank">
                      Privacy Notice
                    </Link>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-squishy w-full py-3.5 rounded-2xl bg-[#FF6B6B] text-white font-heading font-extrabold text-sm border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F] flex items-center justify-center gap-2 select-none disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Sending to Studio..." : "Submit Inquiry"}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
