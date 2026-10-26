"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Layers, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { DsaTopic, getAllDsaTopics } from "@/lib/dsa/dsa-bank";

interface ContinueDsaWidgetProps {
  userId?: string;
}

export default function ContinueDsaWidget({ userId }: ContinueDsaWidgetProps) {
  const [nextTopic, setNextTopic] = useState<DsaTopic | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(20);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/dsa/topics?userId=${userId || ""}`);
        const data = await res.json();
        if (data.success && data.topics) {
          const list = data.topics;
          setTotalCount(list.length);
          const completed = list.filter((t: any) => t.status === "completed").length;
          setCompletedCount(completed);

          // Find first uncompleted or in-progress topic
          const inProgress = list.find((t: any) => t.status === "in_progress");
          const firstUnstarted = list.find((t: any) => t.status === "not_started");
          setNextTopic(inProgress || firstUnstarted || list[0]);
        } else {
          const fallback = getAllDsaTopics();
          setNextTopic(fallback[0]);
        }
      } catch (err) {
        const fallback = getAllDsaTopics();
        setNextTopic(fallback[0]);
      }
    };

    fetchProgress();
  }, [userId]);

  if (!nextTopic) return null;

  const percent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200 shadow-xs space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-black" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-black">
            Continue DSA Practice
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-neutral-500">
          {completedCount} of {totalCount} Mastered ({percent}%)
        </span>
      </div>

      <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-neutral-200 text-black">
                {nextTopic.tier}
              </span>
              {nextTopic.interview_frequency === "High" && (
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-black text-white">
                  High Freq
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-black mt-1">
              {nextTopic.name}
            </h4>
          </div>
        </div>

        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
          {nextTopic.explainer_concept}
        </p>

        <Link
          href={`/dsa/${nextTopic.slug}`}
          className="w-full py-2 px-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs"
        >
          <span>Resume Topic Drills</span>
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </Link>
      </div>
    </div>
  );
}
