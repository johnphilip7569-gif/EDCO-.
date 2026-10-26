"use client";

import React, { useState } from "react";
import { MOCK_NOTIFICATIONS, NotificationItem } from "@/lib/mobile-design-tokens";
import {
  Bell,
  Clock,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  ArrowLeft,
  CheckCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotificationsScreenProps {
  onBack: () => void;
  onSelectNotification?: (notif: NotificationItem) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onBack,
  onSelectNotification,
}) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications({
      today: notifications.today.map((n) => ({ ...n, read: true })),
      earlier: notifications.earlier.map((n) => ({ ...n, read: true })),
    });
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "deadline":
        return <Clock className="w-4 h-4 text-[#FF6B00]" />;
      case "status":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "match":
        return <Sparkles className="w-4 h-4 text-[#3D3BF3] dark:text-[#5856FF]" />;
      case "mention":
      default:
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
    }
  };

  const getIconBg = (type: NotificationItem["type"]) => {
    switch (type) {
      case "deadline":
        return "bg-orange-100 dark:bg-orange-950/60";
      case "status":
        return "bg-emerald-100 dark:bg-emerald-950/60";
      case "match":
        return "bg-indigo-100 dark:bg-indigo-950/60";
      case "mention":
      default:
        return "bg-purple-100 dark:bg-purple-950/60";
    }
  };

  const renderNotifItem = (notif: NotificationItem) => (
    <div
      key={notif.id}
      onClick={() => onSelectNotification?.(notif)}
      className={cn(
        "p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer",
        notif.read
          ? "bg-white dark:bg-[#161922] border-slate-100 dark:border-slate-800"
          : "bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/50 shadow-xs"
      )}
    >
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5", getIconBg(notif.type))}>
        {getIcon(notif.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <h4 className={cn("text-xs sm:text-sm font-bold truncate", notif.read ? "text-slate-800 dark:text-slate-200" : "text-[#3D3BF3] dark:text-[#7A78FF]")}>
            {notif.title}
          </h4>
          {!notif.read && (
            <span className="w-2 h-2 rounded-full bg-[#3D3BF3] flex-shrink-0" />
          )}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {notif.description}
        </p>

        <span className="text-[10px] text-slate-400 block mt-1.5 font-medium">
          {notif.time}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8F9FD] dark:bg-[#0E1017] select-none overflow-y-auto pb-10">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#161922]/95 backdrop-blur-md px-4 pt-3 pb-3 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
              Notifications
            </h2>
            <p className="text-[10px] text-slate-400">
              Deadlines, status updates & opportunities
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="text-xs font-semibold text-[#3D3BF3] dark:text-[#5856FF] flex items-center gap-1 min-h-[38px] px-2 cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark all read</span>
        </button>
      </div>

      <div className="px-4 pt-4 space-y-6">
        {/* Today Section */}
        {notifications.today.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Today
            </h3>
            <div className="space-y-2.5">
              {notifications.today.map(renderNotifItem)}
            </div>
          </div>
        )}

        {/* Earlier Section */}
        {notifications.earlier.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Earlier
            </h3>
            <div className="space-y-2.5">
              {notifications.earlier.map(renderNotifItem)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
