"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Resume, ResumeContent, ResumeTemplateId } from "@/lib/types";
import { DEFAULT_RESUME_CONTENT } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import ResumeBuilderForm from "@/components/resume/ResumeBuilderForm";
import ResumePreview from "@/components/resume/ResumePreview";
import JDMatchModal from "@/components/resume/JDMatchModal";
import MyraJobMatcherModal from "@/components/resume/MyraJobMatcherModal";
import PdfExportButton from "@/components/resume/PdfExportButton";
import { 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Eye, 
  FileEdit,
  Lock,
  ArrowRight,
  Info,
  X,
  Briefcase
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { getResumeProfileDefaults } from "@/lib/services/user-profile";
import UserGreeting from "@/components/ui/UserGreeting";

export const dynamic = "force-dynamic";

export default function ResumesDirectEditorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const isNewQuery = searchParams.get("isNew") === "true";

  // Junior Track Gating (13-15 years)
  const isJuniorTrack = user?.ageBand === "13-15";

  const [resume, setResume] = useState<Resume | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<ResumeTemplateId>("classic");
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);
  const [isMyraJobModalOpen, setIsMyraJobModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [savedStatus, setSavedStatus] = useState<string>("Saved");
  const [showPreFillBanner, setShowPreFillBanner] = useState(isNewQuery);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user || isJuniorTrack) {
      setResume(null);
      return;
    }

    const loadPrimaryResume = async () => {
      // 1. Fetch primary/most recent resume from Supabase
      try {
        const { data, error } = await supabase
          .from("resumes")
          .select("*")
          .eq("user_id", user.uid)
          .order("updated_at", { ascending: false })
          .limit(1);

        if (data && data.length > 0) {
          const item = data[0];
          const loaded: Resume = {
            id: item.id,
            userId: item.user_id,
            title: item.title || "ATS Master Resume",
            templateId: (item.template_id as ResumeTemplateId) || "classic",
            content: item.content || DEFAULT_RESUME_CONTENT,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          };
          setResume(loaded);
          setActiveTemplate(loaded.templateId || "classic");
          localStorage.setItem(`edworld_${user.uid}_resumes`, JSON.stringify([loaded]));
          return;
        }
      } catch (err) {
        console.warn("[Supabase Resume Fetch Note]:", err);
      }

      // 2. Local storage cache fallback
      const cached = localStorage.getItem(`edworld_${user.uid}_resumes`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setResume(parsed[0]);
            setActiveTemplate(parsed[0].templateId || "classic");
            return;
          }
        } catch {}
      }

      // 3. Fallback: Initialize master ATS resume prefilled with real user profile defaults
      const interestSkills = profile?.interests?.map((i) => i.name) || ["TypeScript", "React", "Node.js", "REST APIs"];
      const contactDefaults = getResumeProfileDefaults(user, profile);
      const initialResume: Resume = {
        id: `resume-${user.uid}-master`,
        userId: user.uid,
        title: "ATS Master Resume",
        templateId: "classic",
        content: {
          ...DEFAULT_RESUME_CONTENT,
          contact: contactDefaults,
          skills: {
            ...DEFAULT_RESUME_CONTENT.skills,
            technical: interestSkills,
          },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        await supabase
          .from("resumes")
          .upsert({
            id: initialResume.id,
            user_id: user.uid,
            title: initialResume.title,
            template_id: initialResume.templateId,
            content: initialResume.content,
            created_at: initialResume.createdAt,
            updated_at: initialResume.updatedAt,
          });
      } catch (e) {
        console.warn("[Supabase Resume Init Note]:", e);
      }

      setResume(initialResume);
      setActiveTemplate("classic");
      localStorage.setItem(`edworld_${user.uid}_resumes`, JSON.stringify([initialResume]));
    };

    loadPrimaryResume();
  }, [user, profile, isJuniorTrack]);

  const handleContentChange = (updatedContent: ResumeContent) => {
    if (!resume || !user) return;
    const updated: Resume = {
      ...resume,
      content: updatedContent,
      templateId: activeTemplate,
      updatedAt: new Date().toISOString(),
    };
    setResume(updated);
    setSavedStatus("Saving...");

    // Debounced autosave (1000ms) to Supabase + local storage
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      // 1. Update local storage
      const cached = localStorage.getItem(`edworld_${user.uid}_resumes`);
      let list: Resume[] = cached ? JSON.parse(cached) : [];
      const index = list.findIndex((r) => r.id === resume.id);
      if (index >= 0) {
        list[index] = updated;
      } else {
        list = [updated, ...list];
      }
      localStorage.setItem(`edworld_${user.uid}_resumes`, JSON.stringify(list));

      // 2. Persist to Supabase Relational Database
      try {
        await supabase.from("resumes").upsert({
          id: resume.id,
          user_id: user.uid,
          title: updated.title,
          template_id: updated.templateId,
          content: updated.content,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn("[Supabase Resume Save Note]:", e);
      }

      // 3. Persist to Firestore if available
      if (db) {
        try {
          await setDoc(doc(db, "resumes", resume.id), updated, { merge: true });
        } catch (err) {
          console.warn("[Firestore Resume Autosave Note]:", err);
        }
      }

      setSavedStatus("Saved");
    }, 1000);
  };

  const handleTemplateChange = (tmpl: ResumeTemplateId) => {
    setActiveTemplate(tmpl);
    if (resume) {
      const updated = { ...resume, templateId: tmpl };
      setResume(updated);
      handleContentChange(resume.content);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    if (!resume) return;
    const updated = { ...resume, title: newTitle };
    setResume(updated);
    handleContentChange(resume.content);
  };

  const handleAddKeyword = (kw: string) => {
    if (!resume) return;
    const currentTech = resume.content.skills?.technical || [];
    if (currentTech.some((s) => s.toLowerCase() === kw.toLowerCase())) return;
    const updatedContent: ResumeContent = {
      ...resume.content,
      skills: {
        ...resume.content.skills,
        technical: [...currentTech, kw],
      },
    };
    handleContentChange(updatedContent);
  };

  // Junior Track Gating (13-15 years)
  if (isJuniorTrack) {
    return (
      <AuthGuard>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-white">
          <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 shadow-sm p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 text-black flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-8 h-8 text-black" />
            </div>
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#F7F8FA] text-[#6B7280] text-xs font-medium border border-[#E5E7EB]">
                Junior track (13–15)
              </span>
              <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Resume maker is for explorer &amp; career tracks</h1>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                As a Class 9-10 learner, your focus is on curious exploration, building hands-on creative projects, and learning core concepts. Resume building unlocks in the 16-18 Explorer Track.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="btn-primary w-full py-3 px-4 text-xs flex items-center justify-center gap-2"
            >
              <span>Return to dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (loading || !resume) {
    return (
      <AuthGuard>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F8FA]">
          <div className="text-center space-y-3 text-xs text-[#6B7280]">
            <div className="w-6 h-6 border-2 border-[#111827] border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading resume workspace...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-4rem)] bg-[#FFF8EE] flex flex-col font-studio text-[#1B1B2F]">
        {/* Top Action Bar */}
        <header className="bg-white border-b-2 border-[#1B1B2F] sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3.5 shadow-[0_4px_0px_#1B1B2F]">
          <div className="max-w-[1536px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                title="Back to Dashboard"
                className="p-2.5 rounded-2xl border-2 border-[#1B1B2F] text-[#1B1B2F] bg-[#FFF8EE] hover:bg-[#FFC93C] transition-colors shadow-[2px_2px_0px_#1B1B2F]"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={resume.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="font-display font-black text-[#1B1B2F] text-base sm:text-lg border-b-2 border-transparent hover:border-[#1B1B2F] focus:border-[#FF6B6B] focus:outline-none bg-transparent px-1 py-0.5"
                    aria-label="Resume Title"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-heading font-extrabold text-[#4A4A68] pl-1">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    {savedStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
              {/* Template Selector */}
              <div className="flex items-center bg-[#FFF8EE] p-1 rounded-2xl border-2 border-[#1B1B2F] text-xs font-heading font-extrabold shadow-[2px_2px_0px_#1B1B2F]">
                {(["classic", "modern", "tech"] as ResumeTemplateId[]).map((tmpl) => (
                  <button
                    key={tmpl}
                    type="button"
                    onClick={() => handleTemplateChange(tmpl)}
                    className={`px-3 py-1.5 rounded-xl text-xs capitalize transition-all cursor-pointer ${
                      activeTemplate === tmpl
                        ? "bg-[#1B1B2F] text-white shadow-xs font-black"
                        : "text-[#4A4A68] hover:text-[#1B1B2F]"
                    }`}
                  >
                    {tmpl}
                  </button>
                ))}
              </div>

              {/* Myra Smart Job Matcher Button */}
              <button
                type="button"
                onClick={() => setIsMyraJobModalOpen(true)}
                className="btn-squishy text-xs py-2 px-3.5 rounded-2xl bg-[#FFC93C] text-[#1B1B2F] font-heading font-extrabold border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F] flex items-center gap-1.5 cursor-pointer select-none"
              >
                <Briefcase className="w-3.5 h-3.5 text-[#1B1B2F]" />
                <span>Match Jobs</span>
              </button>

              {/* AI JD-Match Button */}
              <button
                type="button"
                onClick={() => setIsJDModalOpen(true)}
                className="btn-squishy text-xs py-2 px-3.5 rounded-2xl bg-white text-[#1B1B2F] font-heading font-extrabold border-2 border-[#1B1B2F] shadow-[2px_2px_0px_#1B1B2F] flex items-center gap-1.5 cursor-pointer select-none hover:bg-[#FFF8EE]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B6B]" />
                <span>JD Match</span>
              </button>

              {/* PDF Export Button */}
              <PdfExportButton
                resumeContent={resume.content}
                templateId={activeTemplate}
                fileName={`${(resume.content.contact.fullName || "Resume").replace(/\s+/g, "_")}_ATS_Resume`}
              />
            </div>
          </div>
        </header>

        {/* User Identity Greeting Context Sub-Bar */}
        <div className="bg-[#FFF8EE] border-b-2 border-[#1B1B2F]/15 px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="max-w-[1536px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFC93C] text-[#1B1B2F] text-xs font-heading font-extrabold border border-[#1B1B2F]">
                ✦ Pillar 02: 98% ATS Match
              </span>
              <UserGreeting
                context="resume"
                subtitle="All contact details &amp; skills sync seamlessly with your verified profile."
                className="text-xs"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-heading font-extrabold text-[#4A4A68] shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Google X-Y-Z Optimizer Active</span>
            </div>
          </div>
        </div>

        {/* Pre-fill Alert Banner for New Resumes */}
        {showPreFillBanner && (
          <div className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 py-3 text-xs sm:text-sm flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5 max-w-5xl mx-auto flex-1">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-brand-300 shrink-0" />
              <span>
                We&apos;ve pre-filled your contact info and starting skills from your profile — feel free to edit or add more.
              </span>
            </div>
            <button
              onClick={() => setShowPreFillBanner(false)}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}

        {/* Mobile & Portrait Tablet Tab Toggle (< 1024px) */}
        <div className="lg:hidden sticky top-[61px] z-10 flex border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md">
          <button
            onClick={() => setMobileTab("edit")}
            className={`flex-1 py-3 min-h-[44px] text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              mobileTab === "edit"
                ? "border-b-2 border-[#111827] text-[#111827] bg-[#F7F8FA]"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <FileEdit className="w-4 h-4" />
            <span>Edit sections</span>
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`flex-1 py-3 min-h-[44px] text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              mobileTab === "preview"
                ? "border-b-2 border-[#111827] text-[#111827] bg-[#F7F8FA]"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Live A4 preview</span>
          </button>
        </div>

        {/* Main Studio Grid */}
        <div className="max-w-[1536px] mx-auto w-full flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Form Column */}
          <div className={`lg:col-span-6 w-full ${mobileTab === "preview" ? "hidden lg:block" : "block"}`}>
            <ResumeBuilderForm
              content={resume.content}
              onChange={handleContentChange}
            />
          </div>

          {/* Live Preview Column */}
          <div className={`lg:col-span-6 w-full lg:sticky lg:top-36 ${mobileTab === "edit" ? "hidden lg:block" : "block"}`}>
            <div className="bg-slate-200/80 p-3 sm:p-6 lg:p-8 rounded-3xl border border-slate-300/80 shadow-inner overflow-x-auto">
              <div className="flex items-center justify-between mb-3 text-xs text-[#6B7280] px-1">
                <span>ATS preview &bull; {activeTemplate.charAt(0).toUpperCase() + activeTemplate.slice(1)}</span>
                <span>Text selectable</span>
              </div>
              <div className="shadow-2xl rounded-xl overflow-hidden bg-white">
                <ResumePreview
                  content={resume.content}
                  templateId={activeTemplate}
                />
              </div>
            </div>
          </div>
        </div>

        {/* JD Match Modal */}
        <JDMatchModal
          isOpen={isJDModalOpen}
          onClose={() => setIsJDModalOpen(false)}
          resumeContent={resume.content}
          resumeId={resume.id}
          onAddKeyword={handleAddKeyword}
        />

        {/* Myra Smart Job Matcher Modal */}
        <MyraJobMatcherModal
          isOpen={isMyraJobModalOpen}
          onClose={() => setIsMyraJobModalOpen(false)}
          resumeSkills={[
            ...(resume.content.skills?.technical || []),
            ...(resume.content.skills?.tools || []),
            ...(resume.content.skills?.soft || [])
          ]}
          targetRole={resume.title || "Software Engineer"}
          targetSector={(user as any)?.targetSector || "AI & Software Engineering"}
        />
      </div>
    </AuthGuard>
  );
}
