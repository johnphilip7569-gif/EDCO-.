"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80",
        className
      )}
      {...props}
    />
  );
};

export const OpportunityCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3 w-28 rounded" />
          <Skeleton className="h-2.5 w-16 rounded" />
        </div>
        <Skeleton className="w-7 h-7 rounded-full" />
      </div>

      <Skeleton className="h-4 w-5/6 rounded" />
      <Skeleton className="h-3 w-4/6 rounded" />

      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>

      <Skeleton className="h-9 w-full rounded-xl" />

      <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
      </div>
    </div>
  );
};

export const NotificationSkeleton: React.FC = () => {
  return (
    <div className="p-3.5 rounded-2xl bg-white dark:bg-[#161922] border border-slate-100 dark:border-slate-800 flex items-start gap-3">
      <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-3/4 rounded" />
        <Skeleton className="h-2.5 w-full rounded" />
        <Skeleton className="h-2 w-16 rounded mt-1" />
      </div>
    </div>
  );
};

export const ProfileHeaderSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="h-28 w-full rounded-b-2xl" />
      <div className="px-4">
        <div className="flex justify-between items-end -mt-10">
          <Skeleton className="w-20 h-20 rounded-2xl" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
        <Skeleton className="h-5 w-40 rounded mt-3" />
        <Skeleton className="h-3 w-60 rounded mt-2" />
        <Skeleton className="h-16 w-full rounded-2xl mt-4" />
      </div>
    </div>
  );
};
