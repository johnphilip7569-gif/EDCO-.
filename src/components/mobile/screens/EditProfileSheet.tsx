"use client";

import React, { useState } from "react";
import { UserProfileData } from "@/lib/mobile-design-tokens";
import { FloatingInput } from "../ui/FloatingInput";
import { MobileButton } from "../ui/MobileButton";
import { X, Plus, Trash2, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EditProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileData;
  onSave: (updatedProfile: UserProfileData) => void;
}

export const EditProfileSheet: React.FC<EditProfileSheetProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserProfileData>({ ...profile });
  const [newSkill, setNewSkill] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.headline.trim()) errs.headline = "Headline is required";
    if (!formData.college.trim()) errs.college = "College / Institution is required";
    if (!formData.gradYear.trim()) errs.gradYear = "Graduation year is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onSave(formData);
      onClose();
    }, 600);
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    setFormData({
      ...formData,
      skills: [...formData.skills, { name: newSkill.trim(), level: newSkillLevel }],
    });
    setNewSkill("");
  };

  const handleRemoveSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet Container */}
      <div
        className="relative z-10 w-full max-w-[420px] max-h-[88vh] bg-white dark:bg-[#161922] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 border-t border-slate-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Draggable Handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Sheet Header */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Edit Profile
            </h3>
            <p className="text-xs text-slate-500">
              Update your student profile & skills
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close sheet"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="px-5 py-4 overflow-y-auto space-y-4 flex-1">
          {/* Section: Basic Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Personal Info
            </h4>
            <div className="space-y-3">
              <FloatingInput
                label="Full Name"
                value={formData.name}
                error={errors.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <FloatingInput
                label="Headline (e.g. SDE Aspirant | AI Engineer)"
                value={formData.headline}
                error={errors.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-2.5">
                <FloatingInput
                  label="College / Org"
                  value={formData.college}
                  error={errors.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                />
                <FloatingInput
                  label="Grad Year"
                  value={formData.gradYear}
                  error={errors.gradYear}
                  onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                />
              </div>

              <FloatingInput
                label="Location (City, Country)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          {/* Section: Bio / About */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              About / Bio
            </h4>
            <textarea
              rows={3}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#161922] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#3D3BF3] focus:ring-2 focus:ring-[#3D3BF3]/15 leading-relaxed"
              placeholder="Tell recruiters and peers about your passions and coding journey..."
            />
          </div>

          {/* Section: Skills & Proficiency */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Skills & Proficiency
              </h4>
              <span className="text-[11px] text-slate-400">
                {formData.skills.length} skills added
              </span>
            </div>

            {/* Current Skills Chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {formData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700"
                >
                  <span className="font-semibold">{skill.name}</span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                    ({skill.level})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-slate-400 hover:text-rose-500 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Row */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Docker, Rust)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#161922] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#3D3BF3]"
              />

              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value as any)}
                className="text-xs px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#161922] text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <button
                type="button"
                onClick={handleAddSkill}
                className="p-2 rounded-xl bg-[#3D3BF3] text-white hover:bg-[#2E2CD4] flex items-center justify-center min-w-[38px] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sticky Save Button at Bottom */}
        <div className="p-4 bg-white dark:bg-[#161922] border-t border-slate-100 dark:border-slate-800 flex gap-2.5">
          <MobileButton
            variant="outline"
            size="md"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </MobileButton>

          <MobileButton
            variant="primary"
            size="md"
            onClick={handleSave}
            isLoading={isSaving}
            className="flex-[2]"
            leftIcon={<Check className="w-4 h-4" />}
          >
            Save Changes
          </MobileButton>
        </div>
      </div>
    </div>
  );
};
