"use client";

import React, { useState } from "react";
import { OpportunityDetailData, DETAILED_OPPORTUNITY_MOCK } from "@/lib/mobile-design-tokens";
import { MobileButton } from "../ui/MobileButton";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle2,
  MapPin,
  Users,
  Calendar,
  Clock,
  Trophy,
  Flame,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ThumbsUp,
  Send,
  Sparkles,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface OpportunityDetailScreenProps {
  opportunity?: OpportunityDetailData;
  onBack: () => void;
  onRegisterClick: (opp: OpportunityDetailData) => void;
  isRegistered?: boolean;
}

export const OpportunityDetailScreen: React.FC<OpportunityDetailScreenProps> = ({
  opportunity = DETAILED_OPPORTUNITY_MOCK,
  onBack,
  onRegisterClick,
  isRegistered = false,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "timeline" | "rewards" | "faqs" | "discussion">("details");
  const [isBookmarked, setIsBookmarked] = useState(opportunity.bookmarked || false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(opportunity.discussions);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: opportunity.title,
        text: `Check out ${opportunity.title} on EdWorld!`,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      {
        id: `disc-${Date.now()}`,
        author: "Rahul Sharma (You)",
        avatar: "R",
        time: "Just now",
        content: newComment.trim(),
        likes: 0,
        replies: 0,
      },
      ...comments,
    ]);
    setNewComment("");
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FD] dark:bg-[#0E1017] select-none overflow-y-auto pb-24">
      {/* Top Hero Banner */}
      <div className={cn("relative h-44 w-full bg-gradient-to-r p-4 text-white flex flex-col justify-between", opportunity.heroBannerGradient)}>
        {/* Floating Top Nav */}
        <div className="flex items-center justify-between z-10 pt-1">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="w-10 h-10 rounded-xl bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors cursor-pointer"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={cn(
                "w-10 h-10 rounded-xl bg-black/30 backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer",
                isBookmarked ? "text-[#FF6B00]" : "text-white hover:bg-black/50"
              )}
              aria-label="Bookmark"
            >
              <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
            </button>
          </div>
        </div>

        {/* Hero Bottom Tags */}
        <div className="flex items-center gap-2 z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/30 backdrop-blur-md">
            {opportunity.type}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#FF6B00]" /> {opportunity.deadlineText}
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="px-4">
        {/* Header Card (overlapping banner) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.06)] -mt-8 relative z-20">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
              {opportunity.organizerLogo}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">
                  {opportunity.organizer}
                </span>
                {opportunity.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3D3BF3] dark:text-[#5856FF] flex-shrink-0" />
                )}
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5 leading-snug">
                {opportunity.title}
              </h1>
            </div>
          </div>

          {/* Social Proof Strip */}
          <div className="mt-3 p-2.5 rounded-xl bg-orange-50/80 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 flex items-center gap-2 text-xs">
            <Flame className="w-4 h-4 text-[#FF6B00] fill-current flex-shrink-0 animate-pulse" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Registered by <span className="font-extrabold text-[#FF6B00]">{opportunity.socialProofCount.toLocaleString()}</span> students across 180+ colleges
            </span>
          </div>

          {/* Info Chips Grid */}
          <div className="mt-3.5 grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#3D3BF3]" />
              <div>
                <span className="block text-[10px] text-slate-400">Mode</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{opportunity.mode}</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#FF6B00]" />
              <div>
                <span className="block text-[10px] text-slate-400">Team Size</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{opportunity.teamSize}</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <div>
                <span className="block text-[10px] text-slate-400">Prize Pool</span>
                <span className="font-bold text-[#3D3BF3] dark:text-[#5856FF]">{opportunity.prizeOrStipend}</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <div>
                <span className="block text-[10px] text-slate-400">Eligibility</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">College / Grads</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky 5-Tab Bar */}
        <div className="sticky top-0 z-30 bg-[#F8F9FD] dark:bg-[#0E1017] pt-4 pb-2">
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#161922] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-x-auto no-scrollbar">
            {[
              { id: "details", label: "Details" },
              { id: "timeline", label: "Timeline" },
              { id: "rewards", label: "Rewards" },
              { id: "faqs", label: "FAQs" },
              { id: "discussion", label: `Discussion (${comments.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all min-h-[36px] cursor-pointer",
                  activeTab === tab.id
                    ? "bg-[#3D3BF3] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-3 space-y-4">
          {/* TAB 1: DETAILS */}
          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  About the Opportunity
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {opportunity.aboutHtml}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Tags & Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {opportunity.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-indigo-50 dark:bg-indigo-950/60 text-[#3D3BF3] dark:text-[#5856FF] font-semibold px-2.5 py-1 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Eligibility Criteria
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {opportunity.eligibility}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE (Round-by-round stepper) */}
          {activeTab === "timeline" && (
            <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Round-by-Round Timeline
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                {opportunity.timelineRounds.map((round) => {
                  const isActive = round.status === "active";
                  return (
                    <div key={round.roundNumber} className="relative">
                      {/* Stepper Dot */}
                      <span
                        className={cn(
                          "absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-[#161922]",
                          isActive
                            ? "bg-[#FF6B00] text-white shadow-sm shadow-[#FF6B00]/40"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                        )}
                      >
                        <span className="text-[10px] font-bold">{round.roundNumber}</span>
                      </span>

                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                            {round.title}
                          </h4>
                          {isActive && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-orange-100 text-[#FF6B00]">
                              Active Now
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold text-[#3D3BF3] dark:text-[#5856FF] mt-0.5">
                          {round.dates}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {round.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: REWARDS */}
          {activeTab === "rewards" && (
            <div className="space-y-3">
              {opportunity.rewards.map((reward, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{reward.icon}</span>
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                        {reward.place}
                      </span>
                      <h4 className="text-base font-black text-[#3D3BF3] dark:text-[#5856FF]">
                        {reward.amount}
                      </h4>
                    </div>
                  </div>

                  <ul className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {reward.perks.map((perk, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: FAQS ACCORDION */}
          {activeTab === "faqs" && (
            <div className="space-y-2.5">
              {opportunity.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 cursor-pointer min-h-[38px]"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 5: DISCUSSION */}
          {activeTab === "discussion" && (
            <div className="space-y-4">
              {/* Add comment */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question or find teammates..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161922] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#3D3BF3]"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="p-2.5 rounded-xl bg-[#3D3BF3] text-white disabled:opacity-50 flex items-center justify-center min-w-[44px] cursor-pointer"
                  aria-label="Send comment"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Comments stream */}
              <div className="space-y-3">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-[#3D3BF3] flex items-center justify-center text-xs font-bold">
                          {c.avatar}
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {c.author}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{c.time}</span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                      {c.content}
                    </p>

                    <div className="mt-2.5 flex items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button type="button" className="flex items-center gap-1 hover:text-[#3D3BF3]">
                        <ThumbsUp className="w-3.5 h-3.5" /> {c.likes}
                      </button>
                      <button type="button" className="flex items-center gap-1 hover:text-[#3D3BF3]">
                        <MessageSquare className="w-3.5 h-3.5" /> {c.replies} replies
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-3.5 bg-white/95 dark:bg-[#161922]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-40 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="block text-[10px] text-slate-400 uppercase font-semibold">
            Registration Status
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {isRegistered ? "Application Submitted" : "100% Free Entry"}
          </span>
        </div>

        <div className="w-44">
          {isRegistered ? (
            <button
              type="button"
              disabled
              className="w-full min-h-[46px] rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm opacity-90 cursor-default"
            >
              <Check className="w-4 h-4" /> Registered ✓
            </button>
          ) : (
            <MobileButton
              variant="accent"
              size="md"
              fullWidth
              onClick={() => onRegisterClick(opportunity)}
            >
              Register Now
            </MobileButton>
          )}
        </div>
      </div>
    </div>
  );
};
