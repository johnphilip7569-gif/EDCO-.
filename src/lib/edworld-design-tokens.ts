/**
 * EdWorld Co. Design Tokens & Mock Datasets
 * Brand Identity: "Skills & Career OS for the Next Generation"
 * 
 * Visual Style:
 * - Forest Green: #1B4332 (Trustworthy, deep academic & institutional anchor)
 * - Fresh Mint: #D8F3DC (Youthful, energetic surface tint & highlight)
 * - Amber Accent: #D97706 / #F59E0B (High-converting action CTAs, streak flames, milestone awards)
 * - Card Corner Radius: 16px (rounded-2xl)
 * - Spacing Grid: 8px baseline
 * - Tap Targets: >= 44px minimum touch targets
 * - Typography: Inter (Headings: font-extrabold / font-black; Body: font-normal / font-medium)
 * - Accessibility: Exceeds WCAG AA contrast ratio (> 9.2:1 for forest green on white/mint)
 */

export const EDWORLD_TOKENS = {
  colors: {
    forest: {
      DEFAULT: "#1B4332",
      deep: "#081C15",
      dark: "#0F2A1F",
      medium: "#2D6A4F",
      light: "#40916C",
      tint: "#52B788",
    },
    mint: {
      DEFAULT: "#D8F3DC",
      soft: "#EAF9ED",
      surface: "#F2FBF4",
      border: "#B7E4C7",
      deep: "#95D5B2",
    },
    amber: {
      DEFAULT: "#D97706",
      accent: "#F59E0B",
      bright: "#FBBF24",
      light: "#FEF3C7",
      dark: "#B45309",
    },
    neutral: {
      lightBg: "#F8FAF9",
      lightCard: "#FFFFFF",
      lightBorder: "#E2EBE5",
      lightTextPrimary: "#0B1E16",
      lightTextSecondary: "#4A5D54",
      lightTextMuted: "#788B82",

      darkBg: "#0B120E",
      darkCard: "#121E18",
      darkBorder: "#1D2E25",
      darkTextPrimary: "#F1F5F3",
      darkTextSecondary: "#9EADA5",
      darkTextMuted: "#66756D",
    },
  },
  radius: {
    card: "16px",
    input: "12px",
    pill: "9999px",
    button: "14px",
  },
  spacing: {
    grid: "8px",
    minTap: "44px",
  },
};

export interface AudienceTabItem {
  id: "school" | "college" | "fresher" | "professional";
  label: string;
  badge: string;
  headline: string;
  subhead: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export const AUDIENCE_TABS_DATA: AudienceTabItem[] = [
  {
    id: "school",
    label: "9th–12th Grade",
    badge: "Foundation & STEM",
    headline: "Discover Your Career DNA Early & Build Proof of Skill",
    subhead: "Olympiad training, introductory DSA studios, and AI-guided career direction before college entrance exams.",
    features: [
      "Introductory Python & Logic Visualizers",
      "Career Fit & Curiosity Diagnostic Quests",
      "Verified Student Portfolio & National Badges",
      "Parent & Educator Milestone Reporting",
    ],
    ctaLabel: "Start School Foundation",
    ctaHref: "/practice",
  },
  {
    id: "college",
    label: "B.Tech / Degree Students",
    badge: "Most Popular",
    headline: "Crush Campus Placements with Calibrated AI Mock Gauntlets",
    subhead: "Master algorithms with zero-code visualizers, generate 88%+ ATS resumes, and simulate intense proctored technical rounds.",
    features: [
      "AI Mock Interviews with Live Audio Waveforms & Cadence Analytics",
      "Single-Column Vector ATS Resume Builder (100% Parser Compliant)",
      "20 DSA Interactive Simulation Studios & Incident Fire Drills",
      "1:1 FAANG Mentorship Sessions with Verified Engineers",
    ],
    ctaLabel: "Get Placement Ready",
    ctaHref: "/auth/signup",
  },
  {
    id: "fresher",
    label: "Fresh Graduates (Batch '26)",
    badge: "Fast-Track Hiring",
    headline: "Zero Ghosting. Direct PPO and Off-Campus Tech Drives",
    subhead: "Stop throwing generic resumes into ATS black holes. Apply to vetted startups and enterprises scored dynamically against your calibrated profile.",
    features: [
      "Job Description Keyword Alignment Score & Parser Benchmark",
      "Direct Applications to Vetted High-Growth Engineering Teams",
      "STAR Structure Behavioral & System Design Simulator",
      "Alumni Referral Pods from Top Tech Campuses",
    ],
    ctaLabel: "Find Vetted Jobs",
    ctaHref: "/jobs",
  },
  {
    id: "professional",
    label: "Early Professionals & Switchers",
    badge: "Career Switch OS",
    headline: "Accelerate to SDE-2 and Leadership Roles with Real Proof",
    subhead: "Simulate distributed system design rounds, production chaos incident fire drills, and negotiate offers with benchmark intelligence.",
    features: [
      "Distributed System Design Whiteboard Simulations",
      "Production Chaos Drills: Deadlocks, Race Conditions, Cache Stampedes",
      "Offer Comparison & Compensation Calibration Index",
      "Confidential Executive Portfolio at edworld.co.in/u/handle",
    ],
    ctaLabel: "Accelerate Career",
    ctaHref: "/career",
  },
];

export interface FeatureCardItem {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  badgeColor: "forest" | "amber" | "mint";
  description: string;
  metrics: string;
  href: string;
  iconName: string;
}

export const EDWORLD_WEBSITE_FEATURES: FeatureCardItem[] = [
  {
    id: "feat-interview",
    title: "AI Mock Interview Studio",
    tagline: "Proctored Voice & Video Technical Rounds",
    badge: "Live Waveform",
    badgeColor: "amber",
    description: "Simulate realistic STAR behavioral and system design interview rounds with real-time speech cadence, filler-word counters, and rubric scores.",
    metrics: "88% Avg Confidence Boost • 12 Categories",
    href: "/interviews",
    iconName: "Video",
  },
  {
    id: "feat-resume",
    title: "ATS Resume Builder",
    tagline: "Single-Column Vector Format (100% Parser Safe)",
    badge: "88%+ ATS Match",
    badgeColor: "forest",
    description: "Paste any job description to calculate your keyword match score, uncover missing technical terms, and craft Google X-Y-Z bullet points.",
    metrics: "100% Selectable Text • Recruiter Calibrated",
    href: "/resumes",
    iconName: "FileText",
  },
  {
    id: "feat-career-os",
    title: "Career OS & Skill Gap Radar",
    tagline: "Quarterly Milestones & Level Progression",
    badge: "Gamified XP",
    badgeColor: "mint",
    description: "Map your journey from beginner to FAANG-ready engineer. Compare your current competencies against target role matrices with SVG radar charts.",
    metrics: "Quarterly Roadmaps • Level 4 Innovator",
    href: "/career",
    iconName: "Compass",
  },
  {
    id: "feat-jobs",
    title: "Verified Tech Job Board",
    tagline: "Direct-to-Hiring Teams with Match %",
    badge: "Zero Ghosting",
    badgeColor: "forest",
    description: "Curated internships and full-time roles from verified engineering teams, pre-scored with your EdWorld resume and test benchmark.",
    metrics: "1,200+ Openings • Verified Source",
    href: "/jobs",
    iconName: "Briefcase",
  },
];

export const TESTIMONIALS_DATA = [
  {
    id: "test-1",
    name: "Aditya Rao",
    role: "Software Development Engineer (SDE-1)",
    company: "Microsoft India",
    college: "BITS Pilani '25",
    avatar: "A",
    quote: "EdWorld's live waveform mock interviews gave me the exact confidence I needed. The cadence analytics pointed out my pace was too fast during System Design, and correcting that sealed my SDE-1 offer.",
    verifiedBadge: "Verified Microsoft Offer",
  },
  {
    id: "test-2",
    name: "Sneha Patel",
    role: "Full-Stack AI Engineering Intern",
    company: "Tata Digital",
    college: "IIT Delhi '26",
    avatar: "S",
    quote: "The single-column ATS resume builder is pure gold. My resume score jumped from 62% to 91% by adding the suggested missing keywords. Got shortlisted within 48 hours of applying!",
    verifiedBadge: "Verified PPO Intern",
  },
  {
    id: "test-3",
    name: "Rohan Kulkarni",
    role: "Junior Backend Engineer",
    company: "Zerodha Tech Labs",
    college: "DTU Delhi '25",
    avatar: "R",
    quote: "The Career OS skill gap radar showed me exactly what I was missing in Redis caching and Docker orchestration before the final round. No other platform offers this level of calibration.",
    verifiedBadge: "Verified Zerodha Offer",
  },
];

export const COLLEGE_MARQUEE = [
  "IIT Bombay",
  "IIT Delhi",
  "BITS Pilani",
  "IIT Madras",
  "DTU Delhi",
  "NIT Trichy",
  "IIIT Hyderabad",
  "VIT Vellore",
];

export const RECRUITER_MARQUEE = [
  "Google Cloud",
  "Microsoft",
  "Tata Digital",
  "Zerodha Tech",
  "Amazon",
  "Adobe",
  "Swiggy",
  "Razorpay",
];

export const FAQ_DATA = [
  {
    question: "How is EdWorld Co. different from traditional course platforms?",
    answer: "EdWorld is not a video course catalog. It is a live Skills & Career OS combining real-time AI mock interview simulation with speech cadence tracking, recruiter-calibrated single-column ATS resume synthesis, hands-on production engineering drills, and verified peer networking.",
  },
  {
    question: "Is there a completely free plan for students?",
    answer: "Yes! Our Free Student Starter plan costs ₹0/month forever. It includes 1 ATS Resume with live scoring, 2 full AI Mock Interviews per month with complete rubric scorecards, curiosity quests, and access to the verified student network.",
  },
  {
    question: "How does the ATS Resume Maker guarantee 100% parser pass rate?",
    answer: "Our engine uses a single-column, table-free vector layout calibrated to top enterprise ATS parsers (Workday, Greenhouse, Lever, Taleo). It produces 100% selectable, machine-readable text and highlights missing job description keywords in real time.",
  },
  {
    question: "What is Myra AI and how do the three modes work?",
    answer: "Myra is EdWorld's built-in conversational Copilot equipped with three dedicated neural modes: (1) Doubt Solver for algorithms and code debugging, (2) Web for live tech trends and research papers, and (3) Careers for instant resume feedback and interview prep.",
  },
];
