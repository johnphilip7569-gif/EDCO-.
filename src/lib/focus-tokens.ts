export interface DistractionTarget {
  id: string;
  name: string;
  category: "Social Media" | "Video & Streaming" | "Gaming & Chat" | "Short Form";
  iconName: string;
  domains: string[];
  defaultBlocked: boolean;
  color: string;
}

export const DISTRACTION_TARGETS: DistractionTarget[] = [
  {
    id: "instagram",
    name: "Instagram",
    category: "Social Media",
    iconName: "Instagram",
    domains: ["instagram.com", "www.instagram.com"],
    defaultBlocked: true,
    color: "#FF6B6B",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    category: "Social Media",
    iconName: "Ghost",
    domains: ["snapchat.com", "www.snapchat.com", "web.snapchat.com"],
    defaultBlocked: true,
    color: "#FFC93C",
  },
  {
    id: "youtube",
    name: "YouTube & Shorts",
    category: "Video & Streaming",
    iconName: "Youtube",
    domains: ["youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"],
    defaultBlocked: true,
    color: "#FF6B6B",
  },
  {
    id: "discord",
    name: "Discord",
    category: "Gaming & Chat",
    iconName: "MessageSquare",
    domains: ["discord.com", "www.discord.com"],
    defaultBlocked: true,
    color: "#8E6CEF",
  },
  {
    id: "gaming",
    name: "Steam & Web Games",
    category: "Gaming & Chat",
    iconName: "Gamepad2",
    domains: [
      "store.steampowered.com",
      "steamcommunity.com",
      "poki.com",
      "crazygames.com",
      "roblox.com",
      "twitch.tv",
    ],
    defaultBlocked: true,
    color: "#2EC4B6",
  },
  {
    id: "reddit",
    name: "Reddit",
    category: "Social Media",
    iconName: "Globe",
    domains: ["reddit.com", "www.reddit.com", "old.reddit.com"],
    defaultBlocked: true,
    color: "#FF6B6B",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    category: "Social Media",
    iconName: "Twitter",
    domains: ["twitter.com", "x.com"],
    defaultBlocked: true,
    color: "#1B1B2F",
  },
  {
    id: "netflix",
    name: "Netflix & OTT",
    category: "Video & Streaming",
    iconName: "Tv",
    domains: ["netflix.com", "www.netflix.com", "hotstar.com", "primevideo.com"],
    defaultBlocked: false,
    color: "#FF6B6B",
  },
];

export interface FocusPreset {
  id: string;
  label: string;
  minutes: number;
  description: string;
  tag: string;
  xpReward: number;
}

export const FOCUS_PRESETS: FocusPreset[] = [
  {
    id: "pomodoro-25",
    label: "25 Mins",
    minutes: 25,
    description: "Classic Pomodoro sprint. Perfect for DSA problems or quick aptitude drills.",
    tag: "High Focus",
    xpReward: 35,
  },
  {
    id: "standard-45",
    label: "45 Mins",
    minutes: 45,
    description: "Full mock interview simulation or completing an EdFix debugging task.",
    tag: "Recommended",
    xpReward: 60,
  },
  {
    id: "deep-60",
    label: "60 Mins",
    minutes: 60,
    description: "Comprehensive system design review or deep algorithmic practice.",
    tag: "Deep Work",
    xpReward: 85,
  },
  {
    id: "mastery-90",
    label: "90 Mins",
    minutes: 90,
    description: "End-to-end project building sprint in EdBuild or full aptitude assessment.",
    tag: "Mastery",
    xpReward: 130,
  },
  {
    id: "hackathon-120",
    label: "120 Mins",
    minutes: 120,
    description: "Multi-module milestone sprint with zero social interruptions.",
    tag: "Marathon",
    xpReward: 175,
  },
];

export interface StudySubject {
  id: string;
  name: string;
  recommendedHref: string;
  color: string;
}

export const STUDY_SUBJECTS: StudySubject[] = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    recommendedHref: "/dsa",
    color: "#FFC93C",
  },
  {
    id: "interview",
    name: "Mock Interview Practice",
    recommendedHref: "/interviews",
    color: "#FF6B6B",
  },
  {
    id: "edfix",
    name: "EdFix Production Engineering Labs",
    recommendedHref: "/edfix",
    color: "#8E6CEF",
  },
  {
    id: "aptitude",
    name: "Daily Aptitude & Logic Assessment",
    recommendedHref: "/aptitude",
    color: "#FFC93C",
  },
  {
    id: "projects",
    name: "Project Studio & EdBuild Capstone",
    recommendedHref: "/projects",
    color: "#2EC4B6",
  },
  {
    id: "resume",
    name: "ATS Resume & Career Roadmapping",
    recommendedHref: "/resumes",
    color: "#4D96FF",
  },
];
