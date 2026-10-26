/**
 * Curated courses & learning tracks for EdWorld Co.
 * Written with specific, authentic, high-rigor educational copy.
 */

export interface StudioCourse {
  id: string;
  slug: string;
  title: string;
  subjectId: "math" | "coding" | "science" | "english" | "higher_ed" | "career";
  tagline: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Comprehensive";
  targetAge: "Class 9-10" | "Class 11-12" | "College Undergrad" | "Early Career";
  durationWeeks: number;
  totalHours: number;
  liveSessionsCount: number;
  batchSize: number;
  mentor: {
    name: string;
    role: string;
    institution: string;
    avatar: string;
  };
  rating: number;
  reviewCount: number;
  priceInr: number;
  featured: boolean;
  syllabusHighlights: string[];
  capstoneProject: string;
}

export const STUDIO_COURSES: StudioCourse[] = [
  {
    id: "course-cs-systems",
    slug: "applied-systems-and-web-architecture",
    title: "Full-Stack Distributed Systems & Production Engineering",
    subjectId: "coding",
    tagline: "Build high-throughput event buses, database caches, and cloud web services from first principles.",
    description: "Move beyond boilerplate tutorials. You'll architect production-grade microservices with PostgreSQL concurrency locks, Redis cluster caching, and containerized deployments with real load tests.",
    level: "Intermediate",
    targetAge: "College Undergrad",
    durationWeeks: 10,
    totalHours: 60,
    liveSessionsCount: 20,
    batchSize: 18,
    mentor: {
      name: "Vikram Shenoy",
      role: "Staff Infrastructure Engineer",
      institution: "Ex-Razorpay / IIIT Hyderabad",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    rating: 4.95,
    reviewCount: 142,
    priceInr: 12499,
    featured: true,
    syllabusHighlights: [
      "ACID transactions, isolation levels & deadlock prevention in PostgreSQL",
      "Designing distributed idempotent webhook handlers with exponential backoff",
      "Kafka & Redis pub/sub queueing for multi-tenant data pipelines",
      "System design trade-offs: CAP theorem, sharding, and latency budgets",
    ],
    capstoneProject: "Autonomous Webhook Dispatcher with Resilient Zero-Loss Replay",
  },
  {
    id: "course-gate-ece",
    slug: "gate-ece-and-signals-accelerator",
    title: "GATE (ECE) 9-Month Comprehensive Strategy & Problem Clinic",
    subjectId: "higher_ed",
    tagline: "Topic-wise concept mastering with deep pyq dissection and timed mock diagnostics.",
    description: "Designed for engineering students with weak core fundamentals who need structured 4-phase scaffolding across Analog, Digital, Signals & Systems, and Electromagnetics.",
    level: "Comprehensive",
    targetAge: "College Undergrad",
    durationWeeks: 36,
    totalHours: 240,
    liveSessionsCount: 72,
    batchSize: 22,
    mentor: {
      name: "Dr. Ananya Mukherjee",
      role: "GATE AIR 42 • Senior Academician",
      institution: "IIT Kharagpur Alumna",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    },
    rating: 4.92,
    reviewCount: 98,
    priceInr: 18999,
    featured: true,
    syllabusHighlights: [
      "Signals decomposition: Continuous & Discrete Fourier, Laplace, and Z-transforms",
      "Small-signal BJT/MOSFET amplifiers, frequency response & feedback topologies",
      "Digital FSM design, setup/hold time analysis, and clock skew mitigation",
      "Weekly Sunday full-length timed tests with personalized error logs",
    ],
    capstoneProject: "Complete 15-Year PYQ Dissection Workbook + Error Matrix",
  },
  {
    id: "course-math-foundations",
    slug: "discrete-math-and-algorithmic-logic",
    title: "Discrete Mathematics & Algorithmic Problem Solving",
    subjectId: "math",
    tagline: "Rigorous proofs, graph theory, combinatorics, and dynamic programming intuitions.",
    description: "Stop guessing algorithmic complexity. Learn how to construct mathematical induction proofs, model real-world networks with graph theory, and conquer Olympiad and competitive coding logic.",
    level: "Intermediate",
    targetAge: "Class 11-12",
    durationWeeks: 8,
    totalHours: 48,
    liveSessionsCount: 16,
    batchSize: 15,
    mentor: {
      name: "Karthik Subramanian",
      role: "Mathematics Educator & ICPC Finalist",
      institution: "CMI / Chennai",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    rating: 4.88,
    reviewCount: 76,
    priceInr: 8999,
    featured: true,
    syllabusHighlights: [
      "Propositional & predicate logic, proof by contradiction, and strong induction",
      "Recurrence relations, master theorem, and generating functions",
      "Graph traversals, DAG topological ordering, and bipartite matchings",
      "Combinatorial identities, pigeonhole principle, and probability fundamentals",
    ],
    capstoneProject: "Algorithmic Graph Theory Engine for Optimal Campus Transport",
  },
  {
    id: "course-science-robotics",
    slug: "embedded-robotics-and-iot-systems",
    title: "Applied Embedded Robotics & Sensor Micro-Controllers",
    subjectId: "science",
    tagline: "Hands-on ESP32 and ARM Cortex firmware development, telemetry, and hardware debugging.",
    description: "Code directly on bare metal. Interface digital I2C/SPI sensors, control dual-H-bridge DC motors, and stream wireless telemetry to local dashboards via MQTT.",
    level: "Beginner",
    targetAge: "Class 9-10",
    durationWeeks: 6,
    totalHours: 36,
    liveSessionsCount: 12,
    batchSize: 12,
    mentor: {
      name: "Rohan Varma",
      role: "Hardware & Robotics Lab Lead",
      institution: "Makers Guild / BITS Pilani",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    },
    rating: 4.97,
    reviewCount: 64,
    priceInr: 9499,
    featured: true,
    syllabusHighlights: [
      "Embedded C fundamentals, register-level GPIO configuration, and timers",
      "Analog-to-digital conversions (ADC) and PWM motor speed control",
      "I2C sensor integration: Gyroscope, Ultrasonic, and Infrared distance",
      "Wi-Fi telemetry broadcasting over lightweight MQTT broker",
    ],
    capstoneProject: "Self-Balancing Autonomous Rover with Obstacle Avoidance",
  },
  {
    id: "course-english-fluency",
    slug: "debate-executive-communication-and-fluency",
    title: "Executive Spoken English, Pronunciation & Debate Lab",
    subjectId: "english",
    tagline: "Active speaking drills, impromptu articulation, and interview turn-taking mastery.",
    description: "Designed for students from non-metro colleges and regional language schooling. We focus on natural accent clarity, vocal pacing, structured elevator pitches, and group discussion control.",
    level: "Beginner",
    targetAge: "College Undergrad",
    durationWeeks: 6,
    totalHours: 30,
    liveSessionsCount: 18,
    batchSize: 10,
    mentor: {
      name: "Meera Krishnan",
      role: "Senior Debate Coach & Voice Consultant",
      institution: "Toastmasters International District Winner",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    },
    rating: 4.96,
    reviewCount: 118,
    priceInr: 6999,
    featured: false,
    syllabusHighlights: [
      "Overcoming hesitation & filler words: 60-second impromptu drills",
      "Phonetics, vowel elongation, and vocal pitch modulation",
      "Framing arguments with the PREP framework (Point, Reason, Example, Point)",
      "Simulated campus GD (Group Discussion) rounds with personalized turn-taking review",
    ],
    capstoneProject: "5-Minute Recorded Keynote & Professional Audio Portfolio",
  },
  {
    id: "course-career-placements",
    slug: "tier-2-tier-3-placement-sprint",
    title: "Tier-2/3 Off-Campus Placements & Harvard ATS Sprint",
    subjectId: "career",
    tagline: "Turn modest college backgrounds into high-leverage software engineering offers.",
    description: "Get noticed by product companies without on-campus luxury. From ATS resume refactoring and open-source contribution proof to behavioral STAR stories and salary negotiations.",
    level: "Advanced",
    targetAge: "Early Career",
    durationWeeks: 8,
    totalHours: 40,
    liveSessionsCount: 16,
    batchSize: 20,
    mentor: {
      name: "Adarsh Nair",
      role: "Lead Platform Engineer & Career Mentor",
      institution: "EdWorld Co. Engineering",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    },
    rating: 4.98,
    reviewCount: 210,
    priceInr: 10999,
    featured: true,
    syllabusHighlights: [
      "Single-column ATS resume engineering with quantified business impact bullets",
      "GitHub repo curation: writing READMEs that make hiring managers stop scrolling",
      "Cracking machine-coding and live pair-programming rounds under time pressure",
      "Cold outreach on LinkedIn & X: 35%+ response rate frameworks",
    ],
    capstoneProject: "Live Public Portfolio & 3 Verified Industry-Grade Project Case Studies",
  },
];
