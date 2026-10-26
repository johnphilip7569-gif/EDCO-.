"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote, Star, CheckCircle } from "lucide-react";
import StudioSticker from "./StudioSticker";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  collegeOrSchool: string;
  quote: string;
  courseTaken: string;
  outcome: string;
  subjectColor: string;
  rating: number;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Saurabh Deshmukh",
    role: "B.Tech Final Year • ECE",
    collegeOrSchool: "Government College of Engineering, Amravati",
    quote: "Most coaching centers teach theory, then throw hard PYQs at you. EdWorld's 9-month clinic broke down signals and analog circuits into daily 1.5-hour blocks with personal mistake logs. I went from scoring 34 to 68 marks in full mocks.",
    courseTaken: "GATE (ECE) Strategy Clinic",
    outcome: "GATE AIR 148 • M.Tech IISc Bangalore Admit",
    subjectColor: "#8E6CEF",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "test-2",
    name: "Pooja V. Reddy",
    role: "Software Engineer II",
    collegeOrSchool: "VNR VJIET, Hyderabad",
    quote: "Coming from a tier-2 college, off-campus hiring felt like shouting into an abyss. Vikram and Adarsh tore down my generic resume and helped me build an idempotent webhook replay engine. That single project drove 80% of my final interview rounds.",
    courseTaken: "Full-Stack Distributed Systems",
    outcome: "Off-Campus SDE Offer • 18.5 LPA",
    subjectColor: "#FF6B6B",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "test-3",
    name: "Rajeshwar & Sunita Sen",
    role: "Parents of Class 11 Student",
    collegeOrSchool: "Delhi Public School, Ranchi",
    quote: "Our son was anxious about high-school mathematics and falling behind in school tests. The small batch size (12 students) and Karthik Sir's discrete reasoning drills restored his curiosity. He now solves problem sets before school starts.",
    courseTaken: "Algorithmic Logic & Math",
    outcome: "School Math Rank 1 • RMO Qualified",
    subjectColor: "#FFC93C",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "test-4",
    name: "Tanmay Bhattacharya",
    role: "BCA Graduate",
    collegeOrSchool: "Techno India, Kolkata",
    quote: "Everyone told me non-B.Tech students can't land high-paying software jobs. The placement sprint didn't just teach interview questions; they drilled live speech fluency, GitHub architecture documentation, and offer negotiation tactics.",
    courseTaken: "Tier-2/3 Off-Campus Sprint",
    outcome: "Frontend Platform Engineer • Zepto",
    subjectColor: "#6BCB77",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  },
];

export default function TestimonialsSlider() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prev = () => {
    setCurrentIdx((curr) => (curr === 0 ? TESTIMONIALS.length - 1 : curr - 1));
  };

  const next = () => {
    setCurrentIdx((curr) => (curr === TESTIMONIALS.length - 1 ? 0 : curr + 1));
  };

  const item = TESTIMONIALS[currentIdx];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Card with Studio Drop Shadow */}
      <div
        className="relative bg-[#FFF8EE] rounded-3xl border-2 border-[#1B1B2F] p-6 sm:p-10 shadow-[8px_8px_0px_#1B1B2F] transition-all duration-300"
        style={{ borderTop: `8px solid ${item.subjectColor}` }}
      >
        {/* Top Badges & Quote Icon */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b-2 border-[#1B1B2F]/15">
          <div className="flex items-center gap-2">
            <StudioSticker
              bgColor={item.subjectColor}
              textColor={item.subjectColor === "#FFC93C" || item.subjectColor === "#6BCB77" ? "#1B1B2F" : "#FFFFFF"}
              size="sm"
              rotate="none"
            >
              {item.courseTaken}
            </StudioSticker>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-400 text-xs font-bold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
              Verified Outcome
            </span>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1 text-amber-500">
            {[...Array(item.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
            ))}
          </div>
        </div>

        {/* Quote Content */}
        <div className="py-6 sm:py-8 space-y-4">
          <Quote className="w-10 h-10 text-[#1B1B2F]/20" />
          <p className="font-display text-lg sm:text-2xl text-[#1B1B2F] leading-relaxed italic">
            &ldquo;{item.quote}&rdquo;
          </p>
        </div>

        {/* Footer: Student Profile + Verification Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t-2 border-[#1B1B2F]/15">
          <div className="flex items-center gap-3.5">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#1B1B2F] shadow-[3px_3px_0px_#1B1B2F] shrink-0 bg-white">
              <Image
                src={item.avatar}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-base text-[#1B1B2F]">
                {item.name}
              </h4>
              <p className="font-studio text-xs text-[#4A4A68]">
                {item.role} &bull; {item.collegeOrSchool}
              </p>
              <div className="font-heading font-bold text-xs text-emerald-800 mt-0.5 flex items-center gap-1">
                <span>✦</span> {item.outcome}
              </div>
            </div>
          </div>

          {/* Controls: Prev / Next buttons */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={prev}
              aria-label="Previous Testimonial"
              className="w-10 h-10 rounded-xl bg-white border-2 border-[#1B1B2F] flex items-center justify-center text-[#1B1B2F] font-bold shadow-[2px_2px_0px_#1B1B2F] hover:bg-[#FFC93C] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-heading font-bold text-xs text-[#1B1B2F] px-2">
              {currentIdx + 1} / {TESTIMONIALS.length}
            </span>
            <button
              onClick={next}
              aria-label="Next Testimonial"
              className="w-10 h-10 rounded-xl bg-white border-2 border-[#1B1B2F] flex items-center justify-center text-[#1B1B2F] font-bold shadow-[2px_2px_0px_#1B1B2F] hover:bg-[#FFC93C] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
