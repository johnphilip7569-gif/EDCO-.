"use client";

import React, { useState } from "react";
import {
  MOCK_COMMUNITY_POSTS,
  MOCK_TEAMMATES,
  MOCK_MENTORS,
  CommunityPost,
  TeammateCardItem,
  MentorItem,
} from "@/lib/mobile-design-tokens";
import { MobileButton } from "../ui/MobileButton";
import {
  Users,
  MessageSquare,
  Flame,
  Sparkles,
  Share2,
  Heart,
  Star,
  Calendar,
  Check,
  UserPlus,
  Send,
  Plus,
  Vote,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const CommunityScreen: React.FC = () => {
  const [subTab, setSubTab] = useState<"feed" | "teammates" | "mentors">("feed");
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [teammates, setTeammates] = useState<TeammateCardItem[]>(MOCK_TEAMMATES);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [bookingModal, setBookingModal] = useState<MentorItem | null>(null);
  const [bookedStatus, setBookedStatus] = useState(false);

  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId || !p.pollData) return p;
        const updatedOptions = p.pollData.options.map((opt) => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });
        const newTotal = p.pollData.totalVotes + 1;
        const recalculated = updatedOptions.map((opt) => ({
          ...opt,
          percentage: Math.round((opt.votes / newTotal) * 100),
        }));

        return {
          ...p,
          pollData: {
            ...p.pollData,
            totalVotes: newTotal,
            options: recalculated,
            userVotedOption: optionId,
          },
        };
      })
    );
  };

  const handleToggleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const isNowLiked = !likedPosts[postId];
        return {
          ...p,
          likes: isNowLiked ? p.likes + 1 : p.likes - 1,
        };
      })
    );
  };

  const handleToggleInvite = (teammateId: string) => {
    setTeammates((prev) =>
      prev.map((tm) => {
        if (tm.id !== teammateId) return tm;
        return { ...tm, invited: !tm.invited };
      })
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FD] dark:bg-[#0E1017] select-none overflow-y-auto pb-10">
      {/* Mentor Booking Confirmation Modal */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-[340px] bg-white dark:bg-[#161922] rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-[#3D3BF3] flex items-center justify-center text-xl font-bold">
                {bookingModal.avatar}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {bookingModal.name}
                </h4>
                <p className="text-xs text-slate-500">{bookingModal.role} • {bookingModal.company}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Available Slot:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{bookingModal.slotsAvailable}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Streak Perk:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{bookingModal.price}</span>
              </div>
            </div>

            {bookedStatus ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center">
                ✓ 1:1 Session Confirmed! Calendar invite sent.
              </div>
            ) : (
              <div className="flex gap-2">
                <MobileButton
                  variant="outline"
                  size="sm"
                  onClick={() => setBookingModal(null)}
                  className="flex-1"
                >
                  Cancel
                </MobileButton>
                <MobileButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setBookedStatus(true);
                    setTimeout(() => {
                      setBookedStatus(false);
                      setBookingModal(null);
                    }, 1400);
                  }}
                  className="flex-[2]"
                >
                  Confirm Slot
                </MobileButton>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#161922]/95 backdrop-blur-md px-4 pt-3 pb-3 border-b border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950 text-[#FF6B00] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
                Peer Community
              </h2>
              <p className="text-[10px] text-slate-400">
                Polls, teammate match & 1:1 mentor booking
              </p>
            </div>
          </div>
        </div>

        {/* 3 Sub-tabs: Feed | Teammates | Mentors */}
        <div className="mt-3 grid grid-cols-3 p-1 bg-slate-200/70 dark:bg-slate-800/70 rounded-xl">
          {[
            { id: "feed", label: "Discussions & Polls" },
            { id: "teammates", label: "Find Teammates" },
            { id: "mentors", label: "1:1 Mentors" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id as any)}
              className={cn(
                "py-1.5 text-xs font-bold rounded-lg transition-all min-h-[36px] cursor-pointer text-center",
                subTab === tab.id
                  ? "bg-white dark:bg-[#161922] text-[#3D3BF3] dark:text-[#5856FF] shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* SUBTAB 1: FEED & POLLS */}
        {subTab === "feed" && (
          <div className="space-y-4">
            {posts.map((post) => {
              const isLiked = likedPosts[post.id];
              return (
                <div
                  key={post.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
                >
                  {/* Author info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3D3BF3] to-[#FF6B00] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {post.author.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {post.author.name}
                          </h4>
                          <span className="text-[9px] font-bold text-[#FF6B00] bg-orange-50 dark:bg-orange-950/40 px-1.5 py-0.2 rounded">
                            {post.author.badge}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {post.author.college} • {post.time}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {post.type}
                    </span>
                  </div>

                  {/* Title & Body */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-2.5">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Interactive Poll Component */}
                  {post.pollData && (
                    <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span className="flex items-center gap-1">
                          <Vote className="w-3.5 h-3.5 text-[#3D3BF3]" />
                          {post.pollData.question}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {post.pollData.totalVotes} votes
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        {post.pollData.options.map((opt) => {
                          const isVoted = post.pollData?.userVotedOption === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleVotePoll(post.id, opt.id)}
                              className={cn(
                                "relative w-full p-2.5 rounded-xl text-xs font-semibold text-left transition-all overflow-hidden flex items-center justify-between cursor-pointer min-h-[44px]",
                                isVoted
                                  ? "border border-[#3D3BF3] text-[#3D3BF3] dark:text-[#5856FF] font-bold"
                                  : "border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:border-slate-300"
                              )}
                            >
                              {/* Background percentage bar */}
                              <div
                                className="absolute left-0 top-0 bottom-0 bg-indigo-100/60 dark:bg-indigo-950/40 pointer-events-none transition-all duration-300"
                                style={{ width: `${opt.percentage}%` }}
                              />

                              <span className="relative z-10 flex items-center gap-1.5">
                                {isVoted && <Check className="w-3.5 h-3.5 text-[#3D3BF3]" />}
                                {opt.text}
                              </span>

                              <span className="relative z-10 text-[11px] font-bold text-slate-500">
                                {opt.percentage}%
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {post.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Post Interactions */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(post.id)}
                      className={cn(
                        "flex items-center gap-1.5 font-semibold transition-colors min-h-[36px] px-2 cursor-pointer",
                        isLiked ? "text-rose-500" : "hover:text-slate-600"
                      )}
                    >
                      <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-1.5 hover:text-slate-600 min-h-[36px] px-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments} comments</span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-1.5 hover:text-slate-600 min-h-[36px] px-2 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SUBTAB 2: TEAMMATE FINDER */}
        {subTab === "teammates" && (
          <div className="space-y-3">
            {teammates.map((tm) => (
              <div
                key={tm.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-[#3D3BF3] dark:text-[#5856FF] font-black text-sm flex items-center justify-center">
                      {tm.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {tm.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#3D3BF3] dark:text-[#5856FF]">
                        {tm.role} • {tm.college}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-[#FF6B00] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Flame className="w-3 h-3 fill-current" /> {tm.streak}d streak
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {tm.bio}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {tm.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleToggleInvite(tm.id)}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[44px] cursor-pointer",
                      tm.invited
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300"
                        : "bg-[#3D3BF3] hover:bg-[#2E2CD4] text-white shadow-xs"
                    )}
                  >
                    {tm.invited ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Invited to Team
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" /> Invite to Team
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SUBTAB 3: MENTOR DIRECTORY */}
        {subTab === "mentors" && (
          <div className="space-y-3">
            {MOCK_MENTORS.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 font-black text-base flex items-center justify-center">
                      {m.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {m.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {m.role} • <span className="font-bold text-slate-800 dark:text-slate-200">{m.company}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md text-amber-600 text-xs font-extrabold">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{m.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({m.reviewCount})</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {m.domains.map((dom, dIdx) => (
                    <span
                      key={dIdx}
                      className="text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-[#3D3BF3] dark:text-[#5856FF] px-2 py-0.5 rounded-md"
                    >
                      {dom}
                    </span>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Next Slot: <span className="font-bold text-slate-800 dark:text-slate-200">{m.slotsAvailable}</span></span>
                  <span className="text-[11px] font-bold text-emerald-600">{m.price}</span>
                </div>

                <div className="pt-1 flex justify-end">
                  <MobileButton
                    variant="primary"
                    size="sm"
                    onClick={() => setBookingModal(m)}
                    leftIcon={<Calendar className="w-3.5 h-3.5" />}
                  >
                    Book 1:1 Session
                  </MobileButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
