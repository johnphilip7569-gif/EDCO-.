import { UniversalAI } from "@/lib/ai/universal-ai";
import { supabase } from "@/lib/supabase";

export interface RoadmapMilestone {
  id: string;
  horizon: "1_year" | "3_year" | "5_year";
  monthIndex: number;
  monthRangeLabel: string;
  title: string;
  description: string;
  skillTags: string[];
  recommendedResource?: {
    title: string;
    href: string;
  };
  isCompleted: boolean;
  completedAt?: string;
}

export interface CareerRoadmapData {
  id: string;
  userId: string;
  targetRole: string;
  currentLevel: string;
  summary: string;
  milestones: RoadmapMilestone[];
  generatedAt: string;
}

export const TARGET_ROLE_OPTIONS = [
  "Cloud Native DevOps & Platform Engineer",
  "Full-Stack Web Architect (TypeScript/Next.js/Postgres)",
  "Backend & Distributed Systems Engineer (Go/Java)",
  "AI & Large Language Model Application Engineer",
  "Data Engineer & Real-Time Analytics Specialist",
  "Cybersecurity & Cloud Security Engineer",
  "Product Engineering & Technical Founder Track"
];

const CURATED_DEFAULT_ROADMAPS: Record<string, { summary: string; milestones: Omit<RoadmapMilestone, "id" | "isCompleted">[] }> = {
  "default": {
    summary: "A battle-tested engineering blueprint calibrated to bridge academic curriculum gaps and build production-grade proof of competence for high-tier tech hiring.",
    milestones: [
      // 1-Year Horizon
      {
        horizon: "1_year",
        monthIndex: 1,
        monthRangeLabel: "Months 1 - 2",
        title: "Algorithmic Intuition & Language Mastery",
        description: "Solidify data structures (HashMaps, Two Pointers, Trees) and write idiomatic modern TypeScript or Go.",
        skillTags: ["DSA", "Time Complexity", "TypeScript", "Clean Code"],
        recommendedResource: { title: "DSA Studio & Arena", href: "/dsa" }
      },
      {
        horizon: "1_year",
        monthIndex: 3,
        monthRangeLabel: "Months 3 - 4",
        title: "Relational Modeling & Production APIs",
        description: "Design 3NF relational schemas, implement ACID database transactions, indexing, and REST/gRPC endpoints.",
        skillTags: ["PostgreSQL", "Prisma/Drizzle", "API Design", "RLS"],
        recommendedResource: { title: "Interactive Courses", href: "/learn" }
      },
      {
        horizon: "1_year",
        monthIndex: 5,
        monthRangeLabel: "Months 5 - 6",
        title: "First Flagship Engineering Project",
        description: "Build an end-to-end full-stack application featuring authentication, background queues, and rate-limiting.",
        skillTags: ["Full-Stack", "Redis Queues", "Next.js", "Docker"],
        recommendedResource: { title: "Project Studio Briefs", href: "/projectstudio" }
      },
      {
        horizon: "1_year",
        monthIndex: 7,
        monthRangeLabel: "Months 7 - 8",
        title: "Collaborative Team Sprint & Git Flow",
        description: "Participate in an EdBuild squad, conduct peer pull request reviews, and set up continuous integration pipelines.",
        skillTags: ["GitHub Actions", "CI/CD", "Team Git", "Agile"],
        recommendedResource: { title: "EdBuild Squads", href: "/edbuild" }
      },
      {
        horizon: "1_year",
        monthIndex: 9,
        monthRangeLabel: "Months 9 - 10",
        title: "Harvard-Format ATS Resume & Portfolio",
        description: "Construct single-column quantifiable impact resumes and launch your personal live engineering portfolio.",
        skillTags: ["ATS Optimization", "STAR Impact", "Tech Portfolio"],
        recommendedResource: { title: "ATS Resume Builder", href: "/resumes" }
      },
      {
        horizon: "1_year",
        monthIndex: 11,
        monthRangeLabel: "Months 11 - 12",
        title: "AI Mock Technical Interviews & Drive Applications",
        description: "Conduct adaptive behavioral and technical interview simulations with Myra AI, and apply to top tier placements.",
        skillTags: ["System Design Warmup", "STAR Behavioral", "Mock Interviews"],
        recommendedResource: { title: "AI Mock Interviews", href: "/interviews" }
      },

      // 3-Year Horizon
      {
        horizon: "3_year",
        monthIndex: 14,
        monthRangeLabel: "Year 2: Q1 - Q2",
        title: "Production Internship & High-Concurrency Systems",
        description: "Manage real-world traffic, optimize slow SQL queries, and implement Redis caching layers.",
        skillTags: ["Kafka/RabbitMQ", "Distributed Caching", "Postgres Indexing"],
        recommendedResource: { title: "EdFix Incident Labs", href: "/edfix" }
      },
      {
        horizon: "3_year",
        monthIndex: 20,
        monthRangeLabel: "Year 2: Q3 - Q4",
        title: "Distributed Microservices & Cloud Infrastructure",
        description: "Deploy containerized services on AWS/GCP with Kubernetes and observe services via Prometheus & Grafana.",
        skillTags: ["Kubernetes", "Terraform", "Observability", "Cloud SRE"],
        recommendedResource: { title: "Incident Labs", href: "/edfix" }
      },
      {
        horizon: "3_year",
        monthIndex: 30,
        monthRangeLabel: "Year 3",
        title: "SDE-1 Conversion & High Compensation Tier",
        description: "Transition from intern to core product contributor, driving feature specs from design document to release.",
        skillTags: ["RFC Writing", "Cross-Functional Comms", "System Scaling"],
        recommendedResource: { title: "Career Readiness", href: "/career/readiness" }
      },

      // 5-Year Horizon
      {
        horizon: "5_year",
        monthIndex: 42,
        monthRangeLabel: "Year 4",
        title: "Senior SDE Track: Architectural Ownership",
        description: "Own large-scale multi-region services, lead incident post-mortems, and eliminate system bottlenecks.",
        skillTags: ["Staff Architecture", "High Availability", "Fault Tolerance"],
        recommendedResource: { title: "Career OS", href: "/career" }
      },
      {
        horizon: "5_year",
        monthIndex: 54,
        monthRangeLabel: "Year 5",
        title: "Staff/Lead Engineer & Engineering Mentorship",
        description: "Influence tech strategy across multiple squads, mentor junior hires, and contribute to major open source initiatives.",
        skillTags: ["Technical Strategy", "Mentorship", "Platform Governance"],
        recommendedResource: { title: "Member Directory", href: "/network" }
      }
    ]
  }
};

export async function generateCareerRoadmap(params: {
  userId: string;
  targetRole: string;
  currentLevel?: string;
  academicYear?: string;
}): Promise<CareerRoadmapData> {
  const { userId, targetRole, currentLevel = "Foundational", academicYear = "3rd Year" } = params;

  let summary = CURATED_DEFAULT_ROADMAPS.default.summary;
  let rawMilestones = CURATED_DEFAULT_ROADMAPS.default.milestones;

  // Attempt dynamic AI roadmap tailoring
  try {
    const prompt = `You are a Principal Software Architect and Career Strategist.
Create a tailored 1-year, 3-year, and 5-year career progression blueprint for a student aiming for:
Target Role: "${targetRole}"
Current Status: ${academicYear}, Level: ${currentLevel}.

Return valid JSON with exactly this structure:
{
  "summary": "2-sentence roadmap strategic vision",
  "milestones": [
    {
      "horizon": "1_year" | "3_year" | "5_year",
      "monthIndex": 1,
      "monthRangeLabel": "Months 1 - 2",
      "title": "Clear milestone name",
      "description": "Specific actionable outcomes",
      "skillTags": ["Skill1", "Skill2"]
    }
  ]
}
Include at least 6 milestones for 1_year, 3 milestones for 3_year, and 2 milestones for 5_year.`;

    const aiRes = await UniversalAI.complete({
      prompt,
      temperature: 0.3,
      maxTokens: 1800,
      responseFormat: "json"
    });

    const parsed = JSON.parse(aiRes.text);
    if (parsed.summary && Array.isArray(parsed.milestones) && parsed.milestones.length >= 6) {
      summary = parsed.summary;
      rawMilestones = parsed.milestones.map((m: any, idx: number) => ({
        horizon: m.horizon || (idx < 6 ? "1_year" : idx < 9 ? "3_year" : "5_year"),
        monthIndex: m.monthIndex || idx + 1,
        monthRangeLabel: m.monthRangeLabel || `Stage ${idx + 1}`,
        title: m.title,
        description: m.description,
        skillTags: m.skillTags || ["Engineering"],
        recommendedResource: { title: "Explore Module", href: "/career" }
      }));
    }
  } catch (err) {
    console.warn("[Career Roadmap AI generation fallback]:", err);
  }

  // Persist to Supabase
  let roadmapId = "local_roadmap_" + Date.now();
  try {
    const { data: insertedRoadmap, error: roadmapErr } = await supabase
      .from("career_roadmaps")
      .insert({
        user_id: userId,
        target_role: targetRole,
        current_level: currentLevel,
        timeline_json: { summary }
      })
      .select("id")
      .single();

    if (!roadmapErr && insertedRoadmap) {
      roadmapId = insertedRoadmap.id;

      // Insert milestones
      const milestonesToInsert = rawMilestones.map((m) => ({
        user_id: userId,
        roadmap_id: roadmapId,
        horizon: m.horizon,
        month_index: m.monthIndex,
        title: m.title,
        description: m.description,
        skill_tags: m.skillTags,
        is_completed: false
      }));

      await supabase.from("career_roadmap_milestones").insert(milestonesToInsert);
    }
  } catch (dbErr) {
    console.warn("[Career Roadmap DB Insert Warning]:", dbErr);
  }

  const resultMilestones: RoadmapMilestone[] = rawMilestones.map((m, idx) => ({
    id: `m_${idx + 1}`,
    ...m,
    isCompleted: false
  }));

  return {
    id: roadmapId,
    userId,
    targetRole,
    currentLevel,
    summary,
    milestones: resultMilestones,
    generatedAt: new Date().toISOString()
  };
}

export async function getActiveCareerRoadmap(userId: string): Promise<CareerRoadmapData | null> {
  try {
    const { data: roadmap, error } = await supabase
      .from("career_roadmaps")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !roadmap) {
      return null;
    }

    const { data: milestoneRows } = await supabase
      .from("career_roadmap_milestones")
      .select("*")
      .eq("roadmap_id", roadmap.id)
      .order("month_index", { ascending: true });

    const milestones: RoadmapMilestone[] = (milestoneRows || []).map((row) => ({
      id: row.id,
      horizon: row.horizon,
      monthIndex: row.month_index,
      monthRangeLabel: `Month ${row.month_index}`,
      title: row.title,
      description: row.description || "",
      skillTags: row.skill_tags || [],
      isCompleted: row.is_completed ?? false,
      completedAt: row.completed_at
    }));

    return {
      id: roadmap.id,
      userId: roadmap.user_id,
      targetRole: roadmap.target_role,
      currentLevel: roadmap.current_level,
      summary: roadmap.timeline_json?.summary || "",
      milestones,
      generatedAt: roadmap.created_at
    };
  } catch (err) {
    console.error("[getActiveCareerRoadmap Error]:", err);
    return null;
  }
}

export async function toggleRoadmapMilestone(params: {
  milestoneId: string;
  isCompleted: boolean;
  userId: string;
}): Promise<boolean> {
  const { milestoneId, isCompleted, userId } = params;

  try {
    const { error } = await supabase
      .from("career_roadmap_milestones")
      .update({
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null
      })
      .eq("id", milestoneId);

    if (error) {
      console.warn("[toggleRoadmapMilestone DB Error]:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[toggleRoadmapMilestone Exception]:", err);
    return false;
  }
}
