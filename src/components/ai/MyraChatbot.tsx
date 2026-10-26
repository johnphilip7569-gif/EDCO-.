"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User as UserIcon, 
  BookOpen, 
  GraduationCap, 
  RotateCcw, 
  ChevronDown, 
  Minimize2, 
  Maximize2, 
  HelpCircle, 
  Lightbulb, 
  ArrowUpRight, 
  Loader2, 
  Globe, 
  Briefcase, 
  Layers, 
  Search,
  Brain,
  Zap,
  Flame,
  CheckCircle2,
  Trash2,
  ChevronRight,
  Copy,
  Check,
  LayoutDashboard,
  Video,
  FileText,
  Code2,
  Users,
  LogOut,
  MessageSquare,
  CreditCard,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import MyraActionCard from "@/components/ai/MyraActionCard";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sourceUrl?: string;
  sourceTitle?: string;
  actionProposal?: any;
}

interface CognitiveMemoryState {
  totalInteractions: number;
  frequentTopics: Array<{ topic: string; queryCount: number; estimatedMastery?: string }>;
  searchedTechnologies: Array<{ tech: string; searchCount: number }>;
  strugglePoints: Array<{ concept: string; severity?: string; advice?: string }>;
}

const DEFAULT_STARTERS = [
  { label: "❓ Clear a Doubt", prompt: "I have a doubt in a topic. Can you explain it step by step in simple words?" },
  { label: "📅 Personalised Study Plan", prompt: "Can you help me build a weekly study plan with revision slots for my subjects?" },
  { label: "📝 Practice & Quiz", prompt: "Give me a quick quiz question to practice and test my knowledge." },
  { label: "🎯 Exam Prep & Key Points", prompt: "Can you give me quick revision notes and formula key-points for exam prep?" },
];

export default function MyraChatbot() {
  const { user, profile, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "menu">("chat");
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toolState, setToolState] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [memoryState, setMemoryState] = useState<CognitiveMemoryState>({
    totalInteractions: 0,
    frequentTopics: [],
    searchedTechnologies: [],
    strugglePoints: [],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize greeting with context awareness
  useEffect(() => {
    const studentName = profile?.name || user?.name || "Student";
    const targetRole = profile?.targetRole || "Software Engineer";
    const initialGreeting: ChatMessage = {
      id: "initial-welcome",
      role: "assistant",
      content: profile?.name
        ? `Hi ${profile.name}! I'm Myra from EdWorld Co. Tell me your goal (for example JEE, NEET, CUET, boards, semester exams, GATE, CAT, placements), how many months you have, and how many hours a day you can study. I'll build your timetable and roadmap.`
        : "Hi, I'm Myra from EdWorld Co. Tell me your goal (for example JEE, NEET, CUET, boards, semester exams, GATE, CAT, placements), how many months you have, and how many hours a day you can study. I'll build your timetable and roadmap.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([initialGreeting]);

    // Load initial user learning memory if logged in
    if (user?.uid) {
      fetch(`/api/ai/myra?userId=${user.uid}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.memory) {
            setMemoryState({
              totalInteractions: d.memory.totalInteractions || 0,
              frequentTopics: d.memory.frequentTopics || [],
              searchedTechnologies: d.memory.searchedTechnologies || [],
              strugglePoints: d.memory.strugglePoints || [],
            });
          }
        })
        .catch(() => {});
    }
  }, [user?.name, user?.uid, profile?.name]);

  const handleSendRef = useRef<(customPrompt?: string) => Promise<void>>(null as any);

  // Listen for open-myra-copilot / close-myra-copilot triggers from header or navigation
  useEffect(() => {
    const handleOpenCopilot = (e: any) => {
      setIsOpen(true);
      if (e?.detail?.prompt) {
        setInput(e.detail.prompt);
        if (e.detail.autoSend) {
          handleSendRef.current?.(e.detail.prompt);
        }
      }
    };
    const handleCloseCopilot = () => {
      setIsOpen(false);
    };
    window.addEventListener("open-myra-copilot", handleOpenCopilot as EventListener);
    window.addEventListener("close-myra-copilot", handleCloseCopilot as EventListener);
    return () => {
      window.removeEventListener("open-myra-copilot", handleOpenCopilot as EventListener);
      window.removeEventListener("close-myra-copilot", handleCloseCopilot as EventListener);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput("");
    setIsLoading(true);

    const lowerQuery = textToSend.toLowerCase();
    if (lowerQuery.includes("search") || lowerQuery.includes("google") || lowerQuery.includes("browse") || lowerQuery.includes("latest")) {
      setToolState("🌐 Searching live web & documentation...");
    } else if (lowerQuery.includes("resume") || lowerQuery.includes("job")) {
      setToolState("📄 Inspecting resume & matching sector opportunities...");
    } else if (lowerQuery.includes("interview")) {
      setToolState("🎙️ Calibrating mock interview questions...");
    } else {
      setToolState("🧠 Synthesizing pedagogical response...");
    }

    try {
      // Build student profile context
      const profileContext = {
        name: profile?.name || user?.name || "Student",
        gradeLevel: profile?.gradeLevel || user?.gradeLevel || "College / Undergraduate",
        careerStage: profile?.careerStage || user?.careerStage || "STUDENT",
        cgpa: profile?.cgpa || 8.5,
        degree: profile?.degree,
        field_of_study: profile?.field_of_study,
        graduation_year: profile?.graduation_year,
        primaryGoal: profile?.primaryGoal,
        targetSector: (profile as any)?.targetSector || "AI & Software Engineering",
        targetRole: profile?.targetRole || "Software Engineer",
        interests: profile?.interests || [],
        dailyStudyHours: 2,
        institution: profile?.institution || "University Partner",
        frequentTopics: memoryState.frequentTopics,
        searchedTechnologies: memoryState.searchedTechnologies,
        strugglePoints: memoryState.strugglePoints,
      };

      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/myra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          userId: user?.uid,
          profile: profileContext,
          history: historyPayload,
        }),
      });

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I am here to help you solve doubts, match jobs, and practice interviews. Please try asking again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sourceUrl: data.webReach?.url,
        sourceTitle: data.webReach?.title,
        actionProposal: data.actionProposal || null,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      if (!isOpen) setHasUnread(true);

      // Sync updated cognitive memory if returned
      if (data.memory) {
        setMemoryState({
          totalInteractions: data.memory.totalInteractions || memoryState.totalInteractions + 1,
          frequentTopics: data.memory.frequentTopics || memoryState.frequentTopics,
          searchedTechnologies: data.memory.searchedTechnologies || memoryState.searchedTechnologies,
          strugglePoints: data.memory.strugglePoints || memoryState.strugglePoints,
        });
      }
    } catch (err) {
      console.error("Myra chatbot fetch error:", err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "I ran into a temporary connection issue. You can practice in our [3D Mock Interview Studio](/interviews) or explore [Resume Studio](/resumes) while I reconnect!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setToolState(null);
    }
  };
  handleSendRef.current = handleSend;

  const handleClearChat = () => {
    const studentName = profile?.name || user?.name || "Student";
    setMessages([
      {
        id: `clear-${Date.now()}`,
        role: "assistant",
        content: `Chat cleared! Ready for your next inquiry, **${studentName}**. Ask me any doubt, search the web, or match jobs with your resume!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleResetMemory = async () => {
    if (!user?.uid) return;
    try {
      await fetch(`/api/ai/myra?userId=${user.uid}&action=reset`);
      setMemoryState({
        totalInteractions: 0,
        frequentTopics: [],
        searchedTechnologies: [],
        strugglePoints: [],
      });
      setIsMemoryOpen(false);
    } catch (e) {
      console.warn("Reset memory note:", e);
    }
  };

  // Generate dynamic starter prompts based on user's target role, struggle points, or searched technologies
  const targetRole = profile?.targetRole || "Software Engineer";
  const dynamicStarters = memoryState.strugglePoints.length > 0
    ? [
        {
          label: `⚡ Practice ${memoryState.strugglePoints[0].concept} Drill`,
          prompt: `Can you give me a step-by-step intuitive breakdown and practice problem for ${memoryState.strugglePoints[0].concept}?`,
        },
        {
          label: `🎙️ ${targetRole} Mock Interview`,
          prompt: `I want to practice a STAR behavioral and technical mock interview for a ${targetRole} role. What should I prepare?`,
        },
        {
          label: `🎯 Audit Resume for ${targetRole}`,
          prompt: `Can you analyze my resume background and recommend the best matching keywords and metrics for a ${targetRole}?`,
        },
        {
          label: `📐 System Design: Caching & Latency`,
          prompt: `Can you explain how Redis distributed caching prevents database latency spikes under high concurrent traffic?`,
        },
        {
          label: `💻 Explain Agent-Reach Architecture`,
          prompt: `Can you explain what Agent-Reach (https://github.com/Panniantong/Agent-Reach.git) is and how it enables 0-cost platform access?`,
        },
      ]
    : memoryState.searchedTechnologies.length > 0
    ? [
        {
          label: `🔍 Deep Dive ${memoryState.searchedTechnologies[0].tech} Interview Questions`,
          prompt: `What are the top senior engineering interview questions asked about ${memoryState.searchedTechnologies[0].tech}?`,
        },
        {
          label: `🎙️ ${targetRole} Mock Interview`,
          prompt: `I want to practice a STAR behavioral and technical mock interview for a ${targetRole} role. What should I prepare?`,
        },
        {
          label: `🎯 Match Resume for ${targetRole}`,
          prompt: `Can you analyze my resume background and recommend the best matching keywords and metrics for a ${targetRole}?`,
        },
        {
          label: `⚡ Quick Aptitude Sprint`,
          prompt: `Give me 3 high-yield speed math and quantitative aptitude questions with 30-second shortcut techniques.`,
        },
        {
          label: `💻 Explain Agent-Reach Architecture`,
          prompt: `Can you explain what Agent-Reach (https://github.com/Panniantong/Agent-Reach.git) is and how it enables 0-cost platform access?`,
        },
      ]
    : [
        {
          label: `📅 Timetable: 5 hrs/day`,
          prompt: `Make a realistic daily study timetable for my exams with 5 hours of study per day.`,
        },
        {
          label: `🗺️ 6-Month Roadmap`,
          prompt: `Build a 6-month phase-by-phase roadmap for my syllabus and preparation.`,
        },
        {
          label: `🎓 Courses & College Choice`,
          prompt: `How should I evaluate courses, colleges, and branch selection for my career?`,
        },
        {
          label: `🎯 Placement Prep Roadmap`,
          prompt: `I want to prepare for campus placements in 3 months. What should my roadmap be?`,
        },
        {
          label: `🧘 Overcoming Study Stress`,
          prompt: `I have fallen behind in the syllabus and feel overwhelmed. How do I catch up?`,
        },
      ];

  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetIndex(idx);
    setTimeout(() => setCopiedSnippetIndex(null), 2000);
  };

  // Inline token renderer for links, bold, italic, and inline code
  const renderInlineTokens = (text: string) => {
    // Regex splits by:
    // 1. In-app/external links: [text](url)
    // 2. Bold text: **bold**
    // 3. Italic text: *italic*
    // 4. Inline code: `code`
    const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+?\*\*|\*[^*]+?\*|`[^`]+?`)/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, pIdx) => {
      if (!part) return null;

      // In-app route vs external link
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const isInAppRoute = href.startsWith("/");
        if (isInAppRoute) {
          return (
            <Link
              key={pIdx}
              href={href}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 my-0.5 rounded-lg bg-zinc-900 hover:bg-black text-white text-[10.5px] font-semibold shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] mr-1 align-middle"
            >
              <span className="text-[#00D2B4]">✦</span>
              <span>{label}</span>
              <ArrowUpRight className="w-2.5 h-2.5 text-zinc-400" />
            </Link>
          );
        }
        return (
          <Link
            key={pIdx}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 underline font-semibold hover:opacity-80 inline-flex items-center gap-0.5"
          >
            {label}
            <ArrowUpRight className="w-3 h-3 inline" />
          </Link>
        );
      }

      // Bold text: **content**
      if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
        return (
          <strong key={pIdx} className="font-semibold text-zinc-950">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Italic text: *content*
      if (part.startsWith("*") && part.endsWith("*") && part.length >= 2 && !part.slice(1, -1).includes("*")) {
        return (
          <em key={pIdx} className="italic text-zinc-800">
            {part.slice(1, -1)}
          </em>
        );
      }

      // Inline code: `content`
      if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
        return (
          <code key={pIdx} className="px-1.5 py-0.5 mx-0.5 rounded bg-zinc-100 font-mono text-[11px] text-zinc-800 border border-zinc-200/60">
            {part.slice(1, -1)}
          </code>
        );
      }

      return <span key={pIdx}>{part}</span>;
    });
  };

  const isTableSeparatorLine = (line: string) => {
    return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line);
  };

  const isTableRowLine = (line: string) => {
    return /^\s*\|.+?\|\s*$/.test(line);
  };

  const parseTableCells = (line: string) => {
    return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
  };

  // Structured block renderer: processes markdown tables, headings, lists, and paragraphs
  const renderTextBlock = (rawText: string, blockKey: string | number) => {
    const lines = rawText.split(/\r?\n/);
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // 1. Markdown Table Detection (Header line followed by separator line)
      if (isTableRowLine(line) && i + 1 < lines.length && isTableSeparatorLine(lines[i + 1])) {
        const headers = parseTableCells(line);
        i += 2;
        const rows: string[][] = [];
        while (i < lines.length && isTableRowLine(lines[i])) {
          rows.push(parseTableCells(lines[i]));
          i++;
        }

        elements.push(
          <div key={`table-${blockKey}-${i}`} className="overflow-x-auto my-3 rounded-xl border border-zinc-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 font-semibold">
                  {headers.map((h, hIdx) => (
                    <th key={hIdx} className="py-2.5 px-3 text-xs font-semibold text-zinc-900 whitespace-nowrap">
                      {renderInlineTokens(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 1 ? "bg-zinc-50/50 hover:bg-zinc-100/50 transition-colors" : "bg-white hover:bg-zinc-50/50 transition-colors"}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2 px-3 text-xs align-top leading-relaxed">
                        {renderInlineTokens(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }

      // 2. Heading 3
      if (line.startsWith("### ")) {
        elements.push(
          <h4 key={`h3-${blockKey}-${i}`} className="font-semibold text-zinc-950 text-xs sm:text-[13.5px] mt-3.5 mb-1 tracking-tight font-sans">
            {renderInlineTokens(line.replace(/^###\s+/, ""))}
          </h4>
        );
        i++;
        continue;
      }

      // 3. Heading 4
      if (line.startsWith("#### ")) {
        elements.push(
          <h5 key={`h4-${blockKey}-${i}`} className="font-semibold text-zinc-800 text-xs mt-2.5 mb-0.5 tracking-tight font-sans">
            {renderInlineTokens(line.replace(/^####\s+/, ""))}
          </h5>
        );
        i++;
        continue;
      }

      // 4. Bullet Item (- or *)
      const bulletMatch = line.match(/^(\s*)[-*]\s+(.*)$/);
      if (bulletMatch) {
        elements.push(
          <div key={`bullet-${blockKey}-${i}`} className="flex items-start gap-2 my-1 text-[13px] leading-relaxed text-zinc-800 pl-1 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
            <span className="flex-1">{renderInlineTokens(bulletMatch[2])}</span>
          </div>
        );
        i++;
        continue;
      }

      // 5. Numbered List Item
      const numMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
      if (numMatch) {
        elements.push(
          <div key={`num-${blockKey}-${i}`} className="flex items-start gap-2 my-1 text-[13px] leading-relaxed text-zinc-800 pl-1 font-sans">
            <span className="font-semibold text-zinc-900 text-xs mt-0.5 shrink-0 w-4">{numMatch[2]}.</span>
            <span className="flex-1">{renderInlineTokens(numMatch[3])}</span>
          </div>
        );
        i++;
        continue;
      }

      // 6. Blank line
      if (!line.trim()) {
        elements.push(<div key={`sp-${blockKey}-${i}`} className="h-1.5" />);
        i++;
        continue;
      }

      // 7. Standard Paragraph Line
      elements.push(
        <p key={`p-${blockKey}-${i}`} className="my-1 text-[13px] leading-relaxed text-zinc-800 font-sans">
          {renderInlineTokens(line)}
        </p>
      );
      i++;
    }

    return elements;
  };

  // Enhanced text renderer for code blocks, markdown tables, section headers, and in-app action pills
  const renderFormattedContent = (content: string) => {
    // 1. Split code blocks (```lang ... ```)
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const segments: Array<{ type: "code" | "text"; content: string; lang?: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content || "")) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: "text", content: (content || "").slice(lastIndex, match.index) });
      }
      segments.push({ type: "code", lang: match[1] || "code", content: match[2].trim() });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < (content || "").length) {
      segments.push({ type: "text", content: (content || "").slice(lastIndex) });
    }

    return segments.map((seg, sIdx) => {
      if (seg.type === "code") {
        return (
          <div key={`code-${sIdx}`} className="my-2.5 rounded-xl bg-zinc-950 text-zinc-100 overflow-hidden border border-zinc-800 shadow-md">
            <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-[10px] font-mono text-zinc-400">
              <span className="uppercase">{seg.lang || "code"}</span>
              <button
                onClick={() => handleCopyCode(seg.content, sIdx)}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                title="Copy code"
              >
                {copiedSnippetIndex === sIdx ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 text-[11px] font-mono leading-relaxed overflow-x-auto text-zinc-200">
              <code>{seg.content}</code>
            </pre>
          </div>
        );
      }

      return <div key={`text-seg-${sIdx}`}>{renderTextBlock(seg.content, sIdx)}</div>;
    });
  };

  // Strict Minor Protection (Career Track Only per Part E)
  if (user?.ageBand === "13-15" || user?.ageBand === "16-18") {
    return null;
  }

  return (
    <div className={`fixed bottom-6 ${isOpen ? "right-3 sm:right-6" : "right-6"} z-50 font-sans print:hidden safe-bottom`}>
      {/* Floating Circular Trigger Button (Bottom Right) */}
      {!isOpen && (
        <div className="relative group">
          <button
            onClick={() => {
              setIsOpen(true);
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-myra-copilot"));
              }
            }}
            className="w-14 h-14 sm:w-15 sm:h-15 touch-target rounded-full bg-black text-white border-2 border-neutral-700 shadow-[0_16px_40px_rgba(0,0,0,0.35)] flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group relative focus:outline-none focus:ring-4 focus:ring-neutral-400/30"
            aria-label="Open Myra Mentor & Platform Menu"
            title="Myra Mentor & Platform Menu"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-neutral-700 bg-neutral-900 shrink-0">
              <Image
                src="/images/myra-avatar.png"
                alt="Myra Mentor"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform"
              />
            </div>
            {/* Live Pulsing Status Ring */}
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#00D2B4] border-2 border-black flex items-center justify-center shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
            </span>
          </button>
        </div>
      )}

      {/* Floating Chat & Menu Modal */}
      {isOpen && (
        <div className="relative w-[calc(100vw-1.5rem)] sm:w-[420px] max-w-[430px] h-[calc(100dvh-5.5rem)] sm:h-[620px] max-h-[82dvh] sm:max-h-[85vh] bg-white text-zinc-950 rounded-3xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-zinc-50 px-4 py-3 flex items-center justify-between border-b border-zinc-200">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-2xl overflow-hidden border border-zinc-300 bg-zinc-100 shadow-xs shrink-0">
                <Image
                  src="/images/myra-avatar.png"
                  alt="Myra Mentor"
                  fill
                  className="object-cover object-top"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00B49B] border-2 border-white rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-zinc-950 leading-none">Myra</h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                    Study &amp; Career Mentor
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1 leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  Class 12 • College • Placements • Higher-Ed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-zinc-500">
              {activeTab === "chat" && (
                <>
                  <button
                    onClick={() => setIsMemoryOpen(!isMemoryOpen)}
                    title="View what Myra learned about you"
                    className={`px-2 py-1 rounded-xl text-[10px] font-bold border flex items-center gap-1 transition-all ${
                      isMemoryOpen 
                        ? "bg-zinc-950 text-white border-zinc-900"
                        : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    <Brain className="w-3 h-3 text-[#00B49B]" />
                    <span className="hidden sm:inline">Memory</span>
                  </button>

                  <button
                    onClick={handleClearChat}
                    title="Clear conversation"
                    className="p-1.5 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                    aria-label="Clear chat"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize window"
                className="p-1.5 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Close window"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Segmented Dual-Tab Switcher: [Ask Myra] & [Menu & Tools] */}
          <div className="bg-zinc-100/90 border-b border-zinc-200 px-3 py-1.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-zinc-200 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "chat"
                    ? "bg-black text-white shadow-2xs"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Ask Myra</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("menu")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "menu"
                    ? "bg-black text-white shadow-2xs"
                    : "text-zinc-600 hover:text-black"
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Menu &amp; Tools</span>
              </button>
            </div>

            <span className="hidden sm:inline-block text-[10px] text-zinc-500 font-mono">
              {activeTab === "chat" ? "Study & Career Mentor" : "Directory & Help"}
            </span>
          </div>

          {/* TAB 1: CHAT WITH MYRA */}
          {activeTab === "chat" && (
            <>

          {/* Student Profile Context & Calibration Ribbon */}
          {user && (
            <div className="bg-zinc-100/90 border-b border-zinc-200 px-4 py-2 flex items-center justify-between text-[11px] text-zinc-700">
              <div className="flex items-center gap-1.5 font-medium truncate">
                <Brain className="w-3.5 h-3.5 text-[#00B49B] shrink-0" />
                <span className="truncate">
                  Calibrated for <strong className="text-zinc-950 font-bold">{profile?.name || user?.name || "Student"}</strong> &bull; {targetRole}
                </span>
              </div>
              <span className="text-[10px] bg-white text-zinc-800 border border-zinc-200 font-semibold px-2 py-0.5 rounded-full shrink-0 shadow-2xs">
                {memoryState.totalInteractions > 0 ? `${memoryState.totalInteractions} Learned Signals` : "Personalized Signals Active"}
              </span>
            </div>
          )}

          {/* MYRA COGNITIVE MEMORY INSPECTOR DRAWER */}
          {isMemoryOpen && (
            <div className="p-4 bg-zinc-50 border-b border-zinc-200 space-y-3 animate-in slide-in-from-top-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-zinc-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-[#00B49B]" /> Your Learning Profile & Signals
                </span>
                <button
                  onClick={handleResetMemory}
                  className="text-[10px] text-rose-600 hover:text-rose-800 flex items-center gap-1 font-bold cursor-pointer"
                  title="Reset Myra's memory"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Reset Memory</span>
                </button>
              </div>

              {/* Frequent Topics */}
              {memoryState.frequentTopics.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Frequently Explored Concepts:</span>
                  <div className="flex flex-wrap gap-1">
                    {memoryState.frequentTopics.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono bg-white border border-zinc-200 px-2 py-0.5 rounded text-zinc-800">
                        {t.topic} ({t.queryCount}x)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Searched Tech */}
              {memoryState.searchedTechnologies.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Searched Tech Stacks:</span>
                  <div className="flex flex-wrap gap-1">
                    {memoryState.searchedTechnologies.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono text-zinc-900 bg-white border border-zinc-200 px-2 py-0.5 rounded font-bold">
                        {t.tech} ({t.searchCount}x)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Growth Areas */}
              {memoryState.strugglePoints.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-zinc-200">
                  <span className="text-[10px] text-amber-700 font-bold uppercase flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" /> Recommended Practice Area:
                  </span>
                  <div className="p-2 rounded-xl bg-white border border-zinc-200 flex items-center justify-between gap-2 shadow-2xs">
                    <span className="text-[11px] text-zinc-800 truncate">{memoryState.strugglePoints[0].concept}</span>
                    <button
                      onClick={() => handleSend(`Can you give me a 5-minute practice drill on ${memoryState.strugglePoints[0].concept}?`)}
                      className="text-[10px] font-bold text-zinc-950 hover:underline shrink-0 cursor-pointer"
                    >
                      Start Drill &rarr;
                    </button>
                  </div>
                </div>
              )}

              {memoryState.frequentTopics.length === 0 && memoryState.searchedTechnologies.length === 0 && (
                <p className="text-[11px] text-zinc-500 italic">
                  Ask doubts, search technologies, or practice mock interviews. Myra will continuously extract concepts to personalize your sessions.
                </p>
              )}
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-zinc-50/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-zinc-300 bg-zinc-100 shrink-0 mt-0.5">
                    <Image
                      src="/images/myra-avatar.png"
                      alt="Myra"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                )}
                
                <div
                  className={`w-full max-w-[88%] sm:max-w-[92%] rounded-2xl px-4 py-3 text-[13px] leading-[1.65] font-sans antialiased shadow-xs ${
                    msg.role === "user"
                      ? "bg-zinc-950 text-white rounded-tr-none font-normal ml-auto max-w-[85%]"
                      : "bg-white border border-zinc-200/90 text-[#111827] rounded-tl-none font-normal"
                  }`}
                >
                  <div className="break-words">
                    {renderFormattedContent(msg.content)}
                  </div>

                  {msg.actionProposal && (
                    <MyraActionCard
                      proposal={msg.actionProposal}
                      userId={user?.uid}
                    />
                  )}

                  {msg.sourceUrl && (
                    <div className="mt-2 pt-2 border-t border-zinc-200 text-[10px] text-zinc-500 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-[#00B49B]" />
                      <span className="truncate">Source: {msg.sourceTitle || msg.sourceUrl}</span>
                    </div>
                  )}

                  <div
                    className={`text-[9px] mt-1.5 text-right ${
                      msg.role === "user" ? "text-zinc-400" : "text-zinc-400"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center">
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-zinc-300 bg-zinc-100 shrink-0">
                  <Image
                    src="/images/myra-avatar.png"
                    alt="Myra"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-zinc-700 flex items-center gap-2 shadow-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-950" />
                  <span>{toolState || "Myra is thinking..."}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Chips */}
          <div className="p-2.5 bg-zinc-50 border-t border-zinc-200">
            <div className="flex items-center gap-1.5 mb-1.5 text-[10px] text-zinc-500 font-semibold px-1">
              <Lightbulb className="w-3 h-3 text-zinc-800" />
              <span>Personalized Adaptive Prompts</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {dynamicStarters.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.prompt)}
                  disabled={isLoading}
                  className="whitespace-nowrap px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-zinc-100 hover:text-zinc-950 border border-zinc-200 rounded-xl text-zinc-700 transition-colors shrink-0 disabled:opacity-50 cursor-pointer shadow-2xs"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a doubt, search the web, or match jobs..."
              disabled={isLoading}
              className="flex-1 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-2.5 text-xs text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/20 focus:border-zinc-900 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl disabled:opacity-40 transition-all shadow-md shrink-0 flex items-center justify-center font-bold cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
            </form>
          </>
        )}

        {/* TAB 2: PLATFORM MENU & HELP/SUPPORT */}
        {activeTab === "menu" && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50">
            
            {/* Directory Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Core Platform Navigation
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">Quick Directory</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Dashboard", href: "/dashboard", desc: "Goals & Progress", icon: LayoutDashboard },
                  { label: "DSA Curriculum", href: "/dsa", desc: "Curriculum & Drills", icon: Layers, badge: "New" },
                  { label: "Mock Interviews", href: "/interviews", desc: "Live Voice AI", icon: Video },
                  { label: "ATS Resume", href: "/resumes", desc: "Single-Column Builder", icon: FileText },
                  { label: "Coding Sandbox", href: "/problems", desc: "Algorithm Tests", icon: Code2 },
                  { label: "Jobs & Internships", href: "/jobs", desc: "Verified Roles", icon: Briefcase },
                  { label: "Peer Network", href: "/network", desc: "Colleagues & Mentors", icon: Users },
                  { label: "Pricing & Plans", href: "/pricing", desc: "Pro Membership", icon: CreditCard },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="p-2.5 rounded-2xl bg-white hover:bg-zinc-100 border border-zinc-200 hover:border-black transition-all flex flex-col justify-between group shadow-2xs cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="w-7 h-7 rounded-xl bg-zinc-100 group-hover:bg-black group-hover:text-white text-zinc-800 flex items-center justify-center transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-700">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-950 group-hover:text-black flex items-center justify-between">
                          <span>{item.label}</span>
                          <ChevronRight className="w-3 h-3 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                        <p className="text-[10px] text-zinc-500 truncate mt-0.5">{item.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Dedicated HELP & SUPPORT Card */}
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4 text-[#00D2B4]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-zinc-950">Help &amp; Support</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
                    Official grievance redressal, technical assistance &amp; student support.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] space-y-1">
                <div className="flex items-center justify-between font-mono text-[10px] text-zinc-600">
                  <span>Direct Email:</span>
                  <a href="mailto:edworld.eden@gmail.com" className="font-bold text-black hover:underline">
                    edworld.eden@gmail.com
                  </a>
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span>Hours:</span>
                  <span>Mon - Sat, 9:00 AM - 6:00 PM IST</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 px-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>Open Help Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("chat");
                    handleSend("How do I contact EdWorld Co. support and grievance redressal?");
                  }}
                  className="py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Ask Myra about support"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-black" />
                  <span>Ask in Chat</span>
                </button>
              </div>
            </div>

            {/* Account Profile & Sign Out */}
            {user ? (
              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {(user.name || profile?.name || "U")[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-950 truncate">
                      {user.name || profile?.name || "Student"}
                    </div>
                    <div className="text-[10px] text-zinc-500 truncate">
                      {targetRole}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="px-2.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-all"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      setIsOpen(false);
                      await logout();
                      router.push("/login");
                    }}
                    className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-white border border-zinc-200 flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-600">Access your personalized study tools</span>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all shadow-xs"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        )}
        </div>
      )}
    </div>
  );
}
