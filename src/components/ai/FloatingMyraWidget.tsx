"use client";

import React, { useState } from "react";
import {
  Sparkles,
  X,
  Send,
  Globe,
  Briefcase,
  Layers,
  ArrowUpRight,
  Bot,
  User,
  RotateCcw,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type MyraMode = "doubt_solver" | "web" | "careers";

export interface ChatMsg {
  id: string;
  sender: "user" | "myra";
  text: string;
  mode?: MyraMode;
  timestamp: string;
}

export default function FloatingMyraWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<MyraMode>("doubt_solver");
  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  React.useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    window.addEventListener("open-myra-copilot", handleOpen);
    window.addEventListener("close-myra-copilot", handleClose);
    return () => {
      window.removeEventListener("open-myra-copilot", handleOpen);
      window.removeEventListener("close-myra-copilot", handleClose);
    };
  }, []);

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "init",
      sender: "myra",
      text: "Hi, I'm Myra from EdWorld Co. Tell me your goal (for example JEE, NEET, CUET, boards, semester exams, GATE, CAT, placements), how many months you have, and how many hours a day you can study. I'll build your timetable and roadmap.",
      timestamp: "Just now",
      mode: "doubt_solver",
    },
  ]);

  const modes = [
    { id: "doubt_solver" as MyraMode, label: "Doubt Solver", icon: Layers, desc: "DSA & System Design" },
    { id: "web" as MyraMode, label: "Web", icon: Globe, desc: "Live Tech Trends" },
    { id: "careers" as MyraMode, label: "Careers", icon: Briefcase, desc: "ATS & Interviews" },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const userMsg: ChatMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg("");
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "";
      if (activeMode === "doubt_solver") {
        botResponse = `[Doubt Solver: Direct Solution]\nFor "${userText}", optimal time complexity is O(N log N) using divide-and-conquer or dynamic programming memoization. Keep recursion stack balanced to avoid stack overflow.`;
      } else if (activeMode === "web") {
        botResponse = `[Web Mode: Live Intelligence]\nFound 3 latest 2026 industry benchmarks: Agentic LLM frameworks (LangGraph/CrewAI) and Vector RAG pipelines have surged by +140% in tech hiring drives.`;
      } else {
        botResponse = `[Careers Mode: Calibrated Guidance]\nBased on current recruiter benchmarks, highlight measurable outcomes (e.g. latency reduced by 28%, 120k users) in single-column format. Your ATS readiness is currently high.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          sender: "myra",
          text: botResponse,
          mode: activeMode,
          timestamp: "Just now",
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <aside aria-label="Myra AI Assistant Widget" className="fixed bottom-6 right-6 z-50 select-none font-sans">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1B4332] text-white shadow-xl hover:shadow-2xl hover:bg-[#2D6A4F] transition-all duration-200 active:scale-95 cursor-pointer border border-[#52B788]/30 min-h-[48px]"
          aria-label="Open Myra AI Chat"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-[#F59E0B] group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#1B4332] animate-ping" />
          </div>
          <span className="text-xs font-bold tracking-tight">Ask Myra AI</span>
          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#D8F3DC] text-[#1B4332]">
            Online
          </span>
        </button>
      )}

      {/* Floating Modal Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] max-h-[85vh] bg-white dark:bg-[#0B120E] rounded-3xl shadow-2xl border border-[#E2EBE5] dark:border-[#1D2E25] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-base">
                🐻
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                  Myra — Study &amp; Career Mentor
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#D8F3DC] text-[#1B4332] rounded">
                    Active
                  </span>
                </h3>
                <p className="text-[10px] text-white/80">Learn, revise &amp; feel confident</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
              aria-label="Close Myra"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Selector Tabs */}
          <div className="p-2 bg-[#F8FAF9] dark:bg-[#121E18] border-b border-[#E2EBE5] dark:border-[#1D2E25] grid grid-cols-3 gap-1">
            {modes.map((m) => {
              const Icon = m.icon;
              const isActive = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveMode(m.id)}
                  className={cn(
                    "flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-bold transition-all min-h-[44px] cursor-pointer",
                    isActive
                      ? "bg-white dark:bg-[#0B120E] text-[#1B4332] dark:text-[#52B788] shadow-xs border border-[#E2EBE5] dark:border-[#1D2E25]"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 mb-0.5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2 max-w-[85%]",
                  msg.sender === "user" ? "ml-auto justify-end" : "justify-start"
                )}
              >
                {msg.sender === "myra" && (
                  <div className="w-6 h-6 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    M
                  </div>
                )}
                <div
                  className={cn(
                    "p-3 rounded-2xl whitespace-pre-wrap leading-relaxed",
                    msg.sender === "user"
                      ? "bg-[#1B4332] text-white rounded-tr-none"
                      : "bg-[#F2FBF4] dark:bg-[#121E18] text-[#0B1E16] dark:text-[#F1F5F3] border border-[#B7E4C7]/50 dark:border-[#1D2E25] rounded-tl-none shadow-xs"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-[10px] font-bold">
                  M
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse">
                  Myra is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input form */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#E2EBE5] dark:border-[#1D2E25] bg-white dark:bg-[#0B120E] flex gap-2">
            <input
              type="text"
              placeholder={`Ask in ${modes.find((m) => m.id === activeMode)?.label} mode...`}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#E2EBE5] dark:border-[#1D2E25] bg-[#F8FAF9] dark:bg-[#121E18] text-[#0B1E16] dark:text-white focus:outline-none focus:border-[#1B4332] min-h-[44px]"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className="p-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white disabled:opacity-50 flex items-center justify-center min-w-[44px] cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}
