/**
 * EdWorld Mobile Design System Tokens & Mock Data
 * Mobile-first 390x844 responsive guidelines
 * 
 * Visual Style:
 * - Primary: Deep Indigo (#3D3BF3 / Dark: #5856FF)
 * - Accent: Warm Orange (#FF6B00) & Gold (#FFB800)
 * - Card corner radius: 16px (rounded-2xl)
 * - 8px spacing grid & 44px tap targets
 * - Light: #F8F9FD / Dark: #0E1017
 */

export const MOBILE_TOKENS = {
  colors: {
    primary: "#3D3BF3",
    primaryHover: "#2E2CD4",
    primaryLight: "#EEF0FF",
    primaryDark: "#5856FF",
    accentOrange: "#FF6B00",
    accentOrangeLight: "#FFF1E8",
    accentGold: "#FFB800",
    accentGoldLight: "#FFFBEB",
    emerald: "#10B981",
    emeraldLight: "#ECFDF5",
    rose: "#F43F5E",
    roseLight: "#FFF1F2",
    
    // Light mode surfaces
    lightBg: "#F8F9FD",
    lightCard: "#FFFFFF",
    lightCardHover: "#F1F4FB",
    lightBorder: "#E2E8F0",
    lightTextPrimary: "#0F172A",
    lightTextSecondary: "#64748B",
    lightTextMuted: "#94A3B8",

    // Dark mode surfaces
    darkBg: "#0E1017",
    darkCard: "#161922",
    darkCardHover: "#1E2230",
    darkBorder: "#242A38",
    darkTextPrimary: "#F8FAFC",
    darkTextSecondary: "#94A3B8",
    darkTextMuted: "#64748B",
  },
  radius: {
    card: "16px",
    pill: "9999px",
    input: "12px",
    button: "14px",
  },
  tapTarget: "44px",
};

export interface OpportunityItem {
  id: string;
  type: "competition" | "hackathon" | "internship" | "job" | "course" | "mentorship";
  title: string;
  organizer: string;
  organizerLogo: string;
  verified: boolean;
  tags: string[];
  prizeOrStipend: string;
  deadlineDays: number;
  deadlineText: string;
  registrations: number;
  featured?: boolean;
  recommended?: boolean;
  trending?: boolean;
  closingSoon?: boolean;
  bookmarked?: boolean;
  location: string;
}

export const MOCK_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: "opp-1",
    type: "hackathon",
    title: "AI Hackathon India 2026: Agentic LLM Challenge",
    organizer: "Google Cloud & EdWorld",
    organizerLogo: "⚡",
    verified: true,
    tags: ["Generative AI", "Full Stack", "Cash Prize"],
    prizeOrStipend: "₹5,00,000 Pool",
    deadlineDays: 3,
    deadlineText: "3 days left",
    registrations: 4280,
    featured: true,
    recommended: true,
    trending: true,
    bookmarked: false,
    location: "Online / National",
  },
  {
    id: "opp-2",
    type: "competition",
    title: "National Algorithm Sprint & DSA Championship",
    organizer: "EdWorld DSA Studio",
    organizerLogo: "📐",
    verified: true,
    tags: ["DSA", "LeetCode Hard", "Internship Fast-Track"],
    prizeOrStipend: "₹2,50,000 + FAANG Referral",
    deadlineDays: 2,
    deadlineText: "2 days left",
    registrations: 6850,
    featured: true,
    recommended: true,
    closingSoon: true,
    bookmarked: true,
    location: "Online",
  },
  {
    id: "opp-3",
    type: "internship",
    title: "Full-Stack AI Engineering Summer Intern",
    organizer: "Tata Digital",
    organizerLogo: "🔷",
    verified: true,
    tags: ["Next.js", "Python", "Paid", "PPO Offered"],
    prizeOrStipend: "₹45,000 / month",
    deadlineDays: 5,
    deadlineText: "5 days left",
    registrations: 2190,
    recommended: true,
    trending: false,
    bookmarked: false,
    location: "Bangalore / Hybrid",
  },
  {
    id: "opp-4",
    type: "competition",
    title: "FinTech Case Challenge: AI Wealth Systems",
    organizer: "Zerodha Tech Labs",
    organizerLogo: "📈",
    verified: true,
    tags: ["Case Study", "Finance", "Product"],
    prizeOrStipend: "₹3,00,000",
    deadlineDays: 1,
    deadlineText: "Closing Tomorrow",
    registrations: 3410,
    closingSoon: true,
    trending: true,
    bookmarked: false,
    location: "Online",
  },
  {
    id: "opp-5",
    type: "job",
    title: "Graduate Software Development Engineer (SDE-1)",
    organizer: "Microsoft India",
    organizerLogo: "🪟",
    verified: true,
    tags: ["Full-Time", "Freshers", "Batch '26"],
    prizeOrStipend: "₹24 LPA - ₹32 LPA",
    deadlineDays: 8,
    deadlineText: "8 days left",
    registrations: 9140,
    featured: false,
    recommended: true,
    trending: true,
    bookmarked: false,
    location: "Hyderabad / Noida",
  },
  {
    id: "opp-6",
    type: "mentorship",
    title: "1:1 Mock System Design & FAANG Career Prep",
    organizer: "Top SDE-3 Mentors & Myra AI",
    organizerLogo: "🎯",
    verified: true,
    tags: ["1-on-1", "Mock Interview", "Resume Audit"],
    prizeOrStipend: "Free with Streak",
    deadlineDays: 4,
    deadlineText: "4 days left",
    registrations: 1120,
    recommended: true,
    bookmarked: false,
    location: "Video Live Room",
  },
];

export interface EdworldFeatureItem {
  id: string;
  name: string;
  tagline: string;
  iconName: string;
  href: string;
  badge: string;
  badgeColor: "indigo" | "orange" | "gold" | "emerald";
  description: string;
  metrics: string;
}

export const EDWORLD_CORE_FEATURES: EdworldFeatureItem[] = [
  {
    id: "feat-dsa",
    name: "DSA Studio",
    tagline: "Interactive Visualizer & Practice",
    iconName: "Layers",
    href: "/dsa",
    badge: "20 Topics",
    badgeColor: "indigo",
    description: "Step-through visual algorithms, zero code execution sandbox, server-graded predict drills.",
    metrics: "20 Modules • 6 Visualizers",
  },
  {
    id: "feat-interviews",
    name: "AI Mock Interviews",
    tagline: "Audio & Video Technical Rounds",
    iconName: "Video",
    badge: "AI Powered",
    badgeColor: "orange",
    href: "/interviews",
    description: "Realistic STAR behavioral and system design interview rounds with live feedback.",
    metrics: "12 Categories • Score Report",
  },
  {
    id: "feat-resumes",
    name: "ATS Resume Maker",
    tagline: "Single-Column Vector Builder",
    iconName: "FileText",
    badge: "Live ATS 88%",
    badgeColor: "emerald",
    href: "/resumes",
    description: "Recruiter-calibrated single-column resume builder with JD keyword matching.",
    metrics: "100% Text Selectable",
  },
  {
    id: "feat-myra",
    name: "Myra AI Mentor",
    tagline: "Doubt Solver & Career Copilot",
    iconName: "Sparkles",
    badge: "Active 24/7",
    badgeColor: "gold",
    href: "/career/copilot",
    description: "Direct answers to coding doubts, technical concepts, and interview practice questions.",
    metrics: "Instant Answers • Zero Fluff",
  },
];

export interface UserProfileData {
  name: string;
  headline: string;
  college: string;
  course: string;
  gradYear: string;
  location: string;
  avatarUrl: string;
  coverGradient: string;
  completionPercent: number;
  stats: {
    applications: number;
    wins: number;
    certificates: number;
    followers: number;
  };
  streakDays: number;
  level: {
    current: number;
    title: string;
    xp: number;
    nextLevelXp: number;
  };
  about: string;
  skills: Array<{ name: string; level: "Beginner" | "Intermediate" | "Advanced" }>;
  education: {
    degree: string;
    institution: string;
    dates: string;
    cgpa: string;
  };
  experience: Array<{
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }>;
  projects: Array<{
    title: string;
    description: string;
    techStack: string[];
    githubUrl?: string;
    liveUrl?: string;
  }>;
  achievements: Array<{
    title: string;
    event: string;
    year: string;
    rank: string;
  }>;
  socials: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    leetcode?: string;
  };
  badges: Array<{
    id: string;
    title: string;
    desc: string;
    icon: string;
    unlocked: boolean;
  }>;
  privacy: "public" | "private";
}

export const INITIAL_USER_PROFILE: UserProfileData = {
  name: "Rahul Sharma",
  headline: "Aspiring Full-Stack & AI Engineer",
  college: "IIT Bombay",
  course: "B.Tech Computer Science",
  gradYear: "2026",
  location: "Mumbai, India",
  avatarUrl: "/images/myra-avatar.png",
  coverGradient: "from-[#3D3BF3] via-[#5F5EFF] to-[#FF6B00]",
  completionPercent: 70,
  stats: {
    applications: 14,
    wins: 3,
    certificates: 6,
    followers: 420,
  },
  streakDays: 12,
  level: {
    current: 4,
    title: "Master Innovator",
    xp: 780,
    nextLevelXp: 1000,
  },
  about: "Pre-final year Computer Science undergraduate passionate about building scalable full-stack applications, distributed systems, and real-time generative AI interfaces. Hackathon enthusiast and open-source contributor.",
  skills: [
    { name: "React.js / Next.js", level: "Advanced" },
    { name: "TypeScript", level: "Advanced" },
    { name: "Data Structures & Algos", level: "Advanced" },
    { name: "Python", level: "Intermediate" },
    { name: "PostgreSQL / Supabase", level: "Intermediate" },
    { name: "Docker & Cloud", level: "Beginner" },
  ],
  education: {
    degree: "Bachelor of Technology in Computer Science and Engineering",
    institution: "Indian Institute of Technology, Bombay",
    dates: "2022 – 2026",
    cgpa: "8.9 / 10.0",
  },
  experience: [
    {
      role: "Software Engineering Intern",
      company: "Tata Digital",
      period: "May 2025 – July 2025",
      bullets: [
        "Architected serverless API workflows reducing catalog latency by 28%.",
        "Built responsive mobile web components used by 120k+ daily users.",
      ],
    },
  ],
  projects: [
    {
      title: "Agent-Reach: Zero-Cost Multi-Platform Crawler",
      description: "Distributed crawler architecture enabling fast discovery across platforms without expensive API overhead.",
      techStack: ["Next.js", "TypeScript", "TailwindCSS"],
      githubUrl: "https://github.com",
      liveUrl: "https://edworld.co.in",
    },
    {
      title: "EdWorld DSA Interactive Visualizer",
      description: "Deterministic step-through animation engine for binary trees, graph traversals, and dynamic programming tables.",
      techStack: ["React", "SVG", "Web Workers"],
    },
  ],
  achievements: [
    {
      title: "1st Place Winner (₹1,50,000 Prize)",
      event: "Smart India Hackathon (SIH 2024)",
      year: "2024",
      rank: "National Winner",
    },
    {
      title: "Top 1% Global Rank (Candidate Master)",
      event: "CodeForces Annual Collegiate Cup",
      year: "2025",
      rank: "Top 0.8%",
    },
  ],
  socials: {
    linkedin: "https://linkedin.com/in/rahul-sharma",
    github: "https://github.com/rahul-sharma",
    portfolio: "https://rahulsharma.dev",
    leetcode: "https://leetcode.com/rahul_sharma",
  },
  badges: [
    { id: "b1", title: "Hackathon Champion", desc: "Won 1st place in a national hackathon", icon: "🏆", unlocked: true },
    { id: "b2", title: "DSA Algorithm Ace", desc: "Solved 100+ DSA interview problems", icon: "📐", unlocked: true },
    { id: "b3", title: "12-Day Practice Streak", desc: "Practiced 12 consecutive days", icon: "🔥", unlocked: true },
    { id: "b4", title: "ATS Resume Verified", desc: "Scored 85+ on ATS recruiter check", icon: "📄", unlocked: true },
    { id: "b5", title: "Grandmaster Solver", desc: "Reach Level 5 Innovator", icon: "👑", unlocked: false },
    { id: "b6", title: "Community Leader", desc: "Help 50+ students in peer network", icon: "🌟", unlocked: false },
  ],
  privacy: "public",
};

export const ONBOARDING_PERSONAS = [
  { id: "school", title: "School Student", desc: "Class 9–12 • Olympiads, STEM & coding", icon: "🎒" },
  { id: "college", title: "College Student", desc: "B.Tech, B.Sc, MBA • Hackathons & placements", icon: "🎓" },
  { id: "fresher", title: "Fresher / Graduate", desc: "Entry-level jobs & off-campus drives", icon: "🚀" },
  { id: "working", title: "Working Professional", desc: "Career acceleration & tech transitions", icon: "💼" },
];

export const ONBOARDING_INTERESTS = [
  "Hackathons",
  "Coding & DSA",
  "UI/UX Design",
  "Finance & FinTech",
  "Case Studies",
  "Marketing & Growth",
  "Internships",
  "AI & Machine Learning",
  "Web3 & Blockchain",
  "Product Management",
  "Cloud & DevOps",
  "Open Source",
];

export const ONBOARDING_GOALS = [
  { id: "g1", title: "Win Hackathons & Competitions", desc: "Build national portfolio & win cash prizes", icon: "🏆" },
  { id: "g2", title: "Land a High-Paying Internship", desc: "Find verified paid internships with stipend", icon: "💼" },
  { id: "g3", title: "Crack Full-Time Tech Roles", desc: "Ace SDE interviews and resume screening", icon: "🚀" },
  { id: "g4", title: "Master DSA & New Skills", desc: "Learn via visual step-through studios", icon: "🧠" },
];

export interface OpportunityDetailData extends OpportunityItem {
  heroBannerGradient: string;
  mode: "Online" | "In-Person" | "Hybrid";
  teamSize: string;
  eligibility: string;
  isRegistered?: boolean;
  socialProofCount: number;
  aboutHtml: string;
  timelineRounds: Array<{
    roundNumber: number;
    title: string;
    dates: string;
    description: string;
    status: "completed" | "active" | "upcoming";
  }>;
  rewards: Array<{
    place: string;
    amount: string;
    perks: string[];
    icon: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  discussions: Array<{
    id: string;
    author: string;
    avatar: string;
    time: string;
    content: string;
    likes: number;
    replies: number;
  }>;
}

export const DETAILED_OPPORTUNITY_MOCK: OpportunityDetailData = {
  ...MOCK_OPPORTUNITIES[0],
  heroBannerGradient: "from-[#3D3BF3] via-[#5F5EFF] to-[#FF6B00]",
  mode: "Online",
  teamSize: "1–4 Members",
  eligibility: "All college students & recent graduates (Batch 2024–2028)",
  isRegistered: false,
  socialProofCount: 2450,
  aboutHtml: "AI Hackathon India 2026 is the nation's premier generative AI challenge, organized by Google Cloud in partnership with EdWorld. Build production-ready Agentic AI systems, fine-tune multimodal LLMs, or construct real-time vector search pipelines. Shortlisted finalists receive FAANG interview fast-tracks and cloud credits.",
  timelineRounds: [
    {
      roundNumber: 1,
      title: "Idea PPT & Architecture Submission",
      dates: "Oct 15 – Oct 22, 2026",
      description: "Submit a 5-slide deck describing your problem statement, LLM architecture, tech stack, and expected impact.",
      status: "active",
    },
    {
      roundNumber: 2,
      title: "Prototype Build & Video Walkthrough",
      dates: "Oct 25 – Nov 05, 2026",
      description: "Deploy your code to a live staging URL, link public GitHub repository, and record a 3-minute Loom demo.",
      status: "upcoming",
    },
    {
      roundNumber: 3,
      title: "National Grand Finale & Live Jury Pitch",
      dates: "Nov 12, 2026",
      description: "Top 20 teams present live to a jury of Google Cloud directors and EdWorld engineering leaders.",
      status: "upcoming",
    },
  ],
  rewards: [
    {
      place: "1st Place Winner",
      amount: "₹2,50,000 Cash",
      perks: ["Google Cloud Direct SDE Interview", "₹1,00,000 Cloud Credits", "National Winner Trophy & Certificate"],
      icon: "🥇",
    },
    {
      place: "1st Runner Up",
      amount: "₹1,50,000 Cash",
      perks: ["PPO Consideration with Partner Tier-1 Startups", "₹50,000 Cloud Credits", "Silver Certificate"],
      icon: "🥈",
    },
    {
      place: "2nd Runner Up",
      amount: "₹1,00,000 Cash",
      perks: ["Direct Fast-Track to Final Round Interview", "₹25,000 Cloud Credits", "Bronze Certificate"],
      icon: "🥉",
    },
  ],
  faqs: [
    {
      question: "Can I participate solo or is a team required?",
      answer: "You can participate either solo or in teams of up to 4 members. Cross-college teams are welcome!",
    },
    {
      question: "Is there any registration fee?",
      answer: "No, participation in AI Hackathon India 2026 is 100% free for all verified students on EdWorld.",
    },
    {
      question: "What APIs and models are allowed?",
      answer: "You can use any open-source or proprietary models including Gemini 2.0, Claude 3.5, Llama 3, OpenAI, or local weights.",
    },
  ],
  discussions: [
    {
      id: "disc-1",
      author: "Priya Menon",
      avatar: "P",
      time: "2 hours ago",
      content: "Looking for 1 Backend/Python teammate skilled in LangChain and FastAPI! Ping me on EdWorld peer chat.",
      likes: 12,
      replies: 5,
    },
    {
      id: "disc-2",
      author: "Devendra Verma",
      avatar: "D",
      time: "5 hours ago",
      content: "Is it okay if our dataset is scraped from open academic sources? Yes, verified with organizers in guidelines.",
      likes: 8,
      replies: 2,
    },
  ],
};

export const RECENT_SEARCHES = [
  "SIH 2026",
  "Google Cloud",
  "DSA Studio",
  "Tata Digital Intern",
  "Remote Hackathons",
];

export const TRENDING_KEYWORDS = [
  "Agentic AI",
  "FAANG Referral",
  "₹5 Lakh Prize",
  "System Design",
  "Summer Intern 2026",
  "Web3",
];

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "deadline" | "status" | "match" | "mention";
  actionHref?: string;
}

export const MOCK_NOTIFICATIONS: { today: NotificationItem[]; earlier: NotificationItem[] } = {
  today: [
    {
      id: "notif-1",
      title: "Closing Tomorrow: FinTech Case Challenge",
      description: "Only 24 hours left to submit Round 1 executive summary for Zerodha Tech Labs.",
      time: "10 mins ago",
      read: false,
      type: "deadline",
    },
    {
      id: "notif-2",
      title: "Shortlisted for Tata Digital Round 1",
      description: "Your ATS Single-Column resume scored 88%. Complete the technical screening by Friday.",
      time: "2 hours ago",
      read: false,
      type: "status",
    },
    {
      id: "notif-3",
      title: "New Hackathon Match for You",
      description: "Google Cloud Agentic Challenge aligns 96% with your React, Python, and DSA skills.",
      time: "4 hours ago",
      read: true,
      type: "match",
    },
  ],
  earlier: [
    {
      id: "notif-4",
      title: "Streak Maintained: 12 Days 🔥",
      description: "You're 2 days away from unlocking the FAANG 1:1 System Design Mock session.",
      time: "Yesterday",
      read: true,
      type: "status",
    },
    {
      id: "notif-5",
      title: "Sneha Patel mentioned you in Team Finder",
      description: "'Would love to team up with @Rahul for Smart India Hackathon!'",
      time: "3 days ago",
      read: true,
      type: "mention",
    },
  ],
};

export interface CommunityPost {
  id: string;
  author: {
    name: string;
    college: string;
    avatar: string;
    badge: string;
  };
  time: string;
  type: "post" | "poll" | "question";
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  pollData?: {
    question: string;
    totalVotes: number;
    options: Array<{ id: string; text: string; votes: number; percentage: number }>;
    userVotedOption?: string;
  };
}

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    author: {
      name: "Arjun Nair",
      college: "IIT Madras",
      avatar: "A",
      badge: "Level 4 Solver",
    },
    time: "1 hour ago",
    type: "poll",
    title: "Best framework for Agentic AI in 2026 hackathons?",
    content: "Which orchestration engine are you all planning to use for AI Hackathon India?",
    tags: ["Agentic AI", "Hackathons", "TechStack"],
    likes: 42,
    comments: 18,
    pollData: {
      question: "Which agent stack will you use?",
      totalVotes: 320,
      options: [
        { id: "opt-1", text: "LangGraph / LangChain", votes: 140, percentage: 44 },
        { id: "opt-2", text: "CrewAI / AutoGen", votes: 96, percentage: 30 },
        { id: "opt-3", text: "Direct Gemini / OpenAI SDK", votes: 64, percentage: 20 },
        { id: "opt-4", text: "Custom State Machine", votes: 20, percentage: 6 },
      ],
      userVotedOption: "opt-1",
    },
  },
  {
    id: "post-2",
    author: {
      name: "Pooja Hegde",
      college: "BITS Pilani",
      avatar: "P",
      badge: "Hackathon Winner",
    },
    time: "3 hours ago",
    type: "post",
    title: "How our team built an ATS-cracking resume on EdWorld and landed Microsoft SDE-1",
    content: "Key tips: keep it strictly single-column, ensure 100% selectable text, lead with measurable metrics ($/latency/users), and mirror JD keywords.",
    tags: ["Resume", "SDE-1", "PlacementAdvice"],
    likes: 128,
    comments: 34,
  },
];

export interface TeammateCardItem {
  id: string;
  name: string;
  college: string;
  role: string;
  skills: string[];
  bio: string;
  avatar: string;
  streak: number;
  invited?: boolean;
}

export const MOCK_TEAMMATES: TeammateCardItem[] = [
  {
    id: "tm-1",
    name: "Karan Johar",
    college: "IIT Roorkee",
    role: "Full-Stack + Cloud",
    skills: ["React", "FastAPI", "Docker", "PostgreSQL"],
    bio: "Pre-final year builder. Built 3 production web apps. Looking for ML teammate for SIH 2026.",
    avatar: "K",
    streak: 15,
    invited: false,
  },
  {
    id: "tm-2",
    name: "Ananya Roy",
    college: "DTU Delhi",
    role: "AI/ML Engineer",
    skills: ["PyTorch", "LangChain", "Vector DBs", "Python"],
    bio: "Passionate about RAG architectures and multi-agent workflows. Won SIH 2024 regional round.",
    avatar: "A",
    streak: 9,
    invited: false,
  },
  {
    id: "tm-3",
    name: "Vikas Sethi",
    college: "NIT Trichy",
    role: "UI/UX & Frontend",
    skills: ["Figma", "TailwindCSS", "Next.js", "Design Systems"],
    bio: "Specializing in micro-animations and WCAG AA mobile-first design. Let's win together!",
    avatar: "V",
    streak: 22,
    invited: true,
  },
];

export interface MentorItem {
  id: string;
  name: string;
  company: string;
  role: string;
  rating: number;
  reviewCount: number;
  domains: string[];
  slotsAvailable: string;
  avatar: string;
  price: string;
}

export const MOCK_MENTORS: MentorItem[] = [
  {
    id: "m-1",
    name: "Siddharth Rao",
    company: "Google India",
    role: "Staff Software Engineer",
    rating: 4.9,
    reviewCount: 142,
    domains: ["System Design", "Distributed Systems", "FAANG Mock"],
    slotsAvailable: "Tomorrow, 6:00 PM",
    avatar: "S",
    price: "Free with 10d streak",
  },
  {
    id: "m-2",
    name: "Neha Sundaram",
    company: "Microsoft",
    role: "Senior Engineering Manager",
    rating: 4.8,
    reviewCount: 98,
    domains: ["Resume Audit", "STAR Behavioral", "Off-Campus Strategy"],
    slotsAvailable: "Friday, 7:30 PM",
    avatar: "N",
    price: "Free with 7d streak",
  },
  {
    id: "m-3",
    name: "Aditi Mathur",
    company: "Tata Digital",
    role: "Lead Product Designer",
    rating: 5.0,
    reviewCount: 65,
    domains: ["Portfolio Review", "UI/UX Case Study", "Design Critique"],
    slotsAvailable: "Saturday, 11:00 AM",
    avatar: "A",
    price: "Free with 5d streak",
  },
];
