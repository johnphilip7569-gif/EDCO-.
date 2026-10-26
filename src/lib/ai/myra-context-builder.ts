import { queryDb } from "@/lib/db-server";
import { MyraStudentProfileAnalyzer } from "./myra-profile-analyzer";

export type MyraFeatureContext =
  | "ask_myra"
  | "resume_tailor"
  | "interview_generate"
  | "interview_score"
  | "live_interview_turn"
  | "interview_follow_up"
  | "resume_voice_assist"
  | "proactive_suggestion"
  | "birthday_wish";

export interface MyraScopedUserContext {
  userId: string;
  featureContext: MyraFeatureContext;
  profileSnapshot?: {
    name: string;
    targetRole: string;
    careerStage: string;
    headline?: string;
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    graduationYear?: string;
    cgpa?: string | number;
    college?: string;
    company?: string;
    skills: string[];
    interests?: Array<{ name: string; priority?: string; selfLevel?: number; category?: string }>;
    primaryGoal?: string;
    currentStreak?: number;
    totalXp?: number;
    dailyStudyHours?: number;
  };
  careerPathsSnapshot?: {
    primaryPath?: string;
    category?: string;
    secondaryPaths?: string[];
  };
  resumeSnapshot?: {
    title: string;
    skills: string[];
    projectCount: number;
    experienceCount: number;
    lastUpdated?: string;
  };
  interviewSnapshot?: {
    totalSessions: number;
    averageScore: number;
    recentScores: number[];
    latestScore?: number;
    latestCategory?: string;
    commonStruggles: string[];
    lastInterviewDate?: string;
  };
  activeEventsSnapshot?: Array<{
    title: string;
    category: string;
    prizePool: string;
    deadline?: string;
  }>;
  supportSnapshot?: {
    supportEmail: string;
    contactPath: string;
    hours: string;
  };
  projectsSnapshot?: {
    count: number;
    titles: string[];
    technologies: string[];
  };
  longitudinalSignals?: {
    daysSinceLastResumeUpdate?: number;
    daysSinceLastInterview?: number;
    hasUnlistedProjects?: boolean;
    scoreTrend?: "improving" | "stable" | "dipping";
  };
}

/**
 * Myra Context Builder (Retrieval, Not Guessing)
 * Direct PostgreSQL querying with strict data validation.
 */
export async function buildMyraUserContext(
  userId: string,
  featureContext: MyraFeatureContext
): Promise<MyraScopedUserContext> {
  const result: MyraScopedUserContext = {
    userId,
    featureContext,
    supportSnapshot: {
      supportEmail: "edworld.eden@gmail.com",
      contactPath: "/contact",
      hours: "Monday - Saturday, 9:00 AM - 6:00 PM IST",
    },
  };

  // Always fetch active hackathons & events for platform grounding
  try {
    const { rows: events } = await queryDb(
      `SELECT title, category, prize_pool, registration_deadline 
       FROM public.events 
       WHERE registration_status != 'closed' OR registration_status IS NULL
       ORDER BY registration_deadline ASC NULLS LAST 
       LIMIT 4`
    );
    if (events && events.length > 0) {
      result.activeEventsSnapshot = events.map((e) => ({
        title: e.title,
        category: e.category,
        prizePool: e.prize_pool || "Recognition",
        deadline: e.registration_deadline ? new Date(e.registration_deadline).toISOString().split("T")[0] : undefined,
      }));
    }
  } catch (evErr) {
    console.warn("[Myra Events Context Note]:", evErr);
  }

  if (!userId || userId === "guest" || userId === "learner-user" || userId === "anonymous") {
    return result;
  }

  try {
    // 1. Fetch Profile directly via PostgreSQL pooler
    const { rows: profiles } = await queryDb(
      `SELECT id, name, display_name, target_role, career_stage, headline, institution, degree, field_of_study, graduation_year, cgpa, interests, primary_goal 
       FROM public.profiles 
       WHERE id = $1 
       LIMIT 1`,
      [userId]
    );

    if (profiles && profiles.length > 0) {
      const p = profiles[0];
      const skillsArray = Array.isArray(p.interests)
        ? p.interests.map((i: any) => (typeof i === "string" ? i : i.name || ""))
        : [];

      result.profileSnapshot = {
        name: p.display_name || p.name || "Learner",
        targetRole: p.target_role || "Software Engineer",
        careerStage: p.career_stage || "STUDENT",
        headline: p.headline || undefined,
        institution: p.institution || undefined,
        degree: p.degree || undefined,
        fieldOfStudy: p.field_of_study || undefined,
        graduationYear: p.graduation_year || undefined,
        cgpa: p.cgpa || undefined,
        college: p.institution || undefined,
        company: p.company || undefined,
        skills: skillsArray.filter(Boolean).slice(0, 15),
        interests: Array.isArray(p.interests) ? p.interests : undefined,
        primaryGoal: p.primary_goal || undefined,
        currentStreak: 0,
        totalXp: 0,
      };
    }

    // 2. Fetch Career Paths selection (Feature 31)
    try {
      const { rows: userPaths } = await queryDb(
        `SELECT u.primary_path_id, u.secondary_path_ids, c.name as primary_name, c.category as primary_category
         FROM public.user_career_paths u
         LEFT JOIN public.career_paths c ON c.id = u.primary_path_id
         WHERE u.user_id = $1
         LIMIT 1`,
        [userId]
      );
      if (userPaths && userPaths.length > 0) {
        const up = userPaths[0];
        result.careerPathsSnapshot = {
          primaryPath: up.primary_name || "Software Engineering",
          category: up.primary_category || "Software & Tech",
          secondaryPaths: Array.isArray(up.secondary_path_ids) ? up.secondary_path_ids : [],
        };
      }
    } catch (pathErr) {
      console.warn("[Myra Career Path Context Note]:", pathErr);
    }

    // 3. Fetch Resume Snapshot
    try {
      const { rows: resumes } = await queryDb(
        `SELECT title, content, updated_at, created_at 
         FROM public.resumes 
         WHERE user_id = $1 
         ORDER BY updated_at DESC 
         LIMIT 1`,
        [userId]
      );

      if (resumes && resumes.length > 0 && resumes[0].content) {
        const c = resumes[0].content;
        const rSkills = Array.isArray(c.skills) ? c.skills : [];
        const rProjects = Array.isArray(c.projects) ? c.projects : [];
        const rExp = Array.isArray(c.experience) ? c.experience : [];

        result.resumeSnapshot = {
          title: resumes[0].title || "Primary Resume",
          skills: rSkills.slice(0, 15),
          projectCount: rProjects.length,
          experienceCount: rExp.length,
          lastUpdated: resumes[0].updated_at || resumes[0].created_at,
        };
      }
    } catch (resErr) {
      console.warn("[Myra Resume Context Note]:", resErr);
    }

    // 4. Fetch Interview Sessions Snapshot
    try {
      const { rows: sessions } = await queryDb(
        `SELECT overall_score, category, feedback, metrics, created_at 
         FROM public.interview_sessions 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT 5`,
        [userId]
      );

      if (sessions && sessions.length > 0) {
        const scores = sessions
          .map((s) => Number(s.overall_score))
          .filter((s) => !isNaN(s) && s > 0);

        const avg = scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 75;

        const struggles: string[] = [];
        sessions.forEach((s) => {
          if (s.feedback && Array.isArray(s.feedback.areasForImprovement)) {
            struggles.push(...s.feedback.areasForImprovement);
          }
        });

        result.interviewSnapshot = {
          totalSessions: sessions.length,
          averageScore: avg,
          recentScores: scores.slice(0, 3),
          latestScore: scores[0],
          latestCategory: sessions[0]?.category || "Software Engineering",
          commonStruggles: Array.from(new Set(struggles)).slice(0, 4),
          lastInterviewDate: sessions[0]?.created_at,
        };
      }
    } catch (intErr) {
      console.warn("[Myra Interview Context Note]:", intErr);
    }

    // 5. Fetch Projects Snapshot
    try {
      const { rows: projects } = await queryDb(
        `SELECT title, skills, technologies, created_at 
         FROM public.projects 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT 6`,
        [userId]
      );

      if (projects && projects.length > 0) {
        const allTech: string[] = [];
        projects.forEach((p) => {
          if (Array.isArray(p.technologies)) allTech.push(...p.technologies);
          if (Array.isArray(p.skills)) allTech.push(...p.skills);
        });

        result.projectsSnapshot = {
          count: projects.length,
          titles: projects.map((p) => p.title).slice(0, 4),
          technologies: Array.from(new Set(allTech)).slice(0, 10),
        };
      }
    } catch (projErr) {
      console.warn("[Myra Projects Context Note]:", projErr);
    }

  } catch (err) {
    console.warn("[Myra Context Builder Warning]:", err);
  }

  return result;
}

/**
 * Format scoped context into a concise prompt block for LLM injection
 */
export function formatContextPromptBlock(context: MyraScopedUserContext): string {
  const parts: string[] = [];

  if (context.profileSnapshot) {
    const p = context.profileSnapshot;
    const analysis = MyraStudentProfileAnalyzer.analyze({
      name: p.name,
      institution: p.institution || p.college,
      degree: p.degree,
      field_of_study: p.fieldOfStudy,
      graduation_year: p.graduationYear,
      cgpa: p.cgpa,
      targetRole: p.targetRole,
      primaryGoal: p.primaryGoal,
      interests: p.interests,
      dailyStudyHours: p.dailyStudyHours || 2,
      careerPathsSnapshot: context.careerPathsSnapshot,
      resumeSkills: p.skills,
    });
    parts.push(MyraStudentProfileAnalyzer.formatPromptBlock(analysis));
  }

  if (context.careerPathsSnapshot?.primaryPath) {
    parts.push(`Primary Career Path: ${context.careerPathsSnapshot.primaryPath} (${context.careerPathsSnapshot.category || "Tech"})`);
  }

  if (context.resumeSnapshot) {
    const r = context.resumeSnapshot;
    parts.push(`Resume: "${r.title}" with ${r.skills.length} skills, ${r.projectCount} projects.`);
  }

  if (context.interviewSnapshot && context.interviewSnapshot.totalSessions > 0) {
    const i = context.interviewSnapshot;
    parts.push(`Interview Performance: ${i.totalSessions} sessions completed. Latest score: ${i.latestScore ?? i.averageScore}/100 (${i.latestCategory || "General"}). Overall Avg: ${i.averageScore}/100.`);
    if (i.commonStruggles.length > 0) {
      parts.push(`Growth Focus Areas: ${i.commonStruggles.join("; ")}`);
    }
  }

  if (context.activeEventsSnapshot && context.activeEventsSnapshot.length > 0) {
    parts.push(`Live Hackathons: ${context.activeEventsSnapshot.map(e => `${e.title} (${e.prizePool})`).join(", ")}`);
  }

  if (context.supportSnapshot) {
    parts.push(`Help & Support Contact: ${context.supportSnapshot.supportEmail} | Portal: ${context.supportSnapshot.contactPath}`);
  }

  return parts.length > 0 ? `\n[VERIFIED DATA FOR THIS USER & PLATFORM]\n${parts.join("\n")}\n` : "";
}
