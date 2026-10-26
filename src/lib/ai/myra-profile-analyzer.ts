/**
 * Myra Student Profile Analyzer
 * Analyzes individual onboarding credentials (degree, institution, GPA, field of study, 
 * graduation year, target role, domain skills) to generate individualized academic guidance.
 */

export interface StudentRawProfile {
  name?: string;
  institution?: string;
  degree?: string;
  field_of_study?: string;
  graduation_year?: string;
  cgpa?: string | number;
  targetRole?: string;
  primaryGoal?: string;
  interests?: Array<{ name: string; priority?: string; selfLevel?: number; category?: string }>;
  dailyStudyHours?: number;
  careerPathsSnapshot?: {
    primaryPath?: string;
    category?: string;
  };
  resumeSkills?: string[];
}

export interface StudentProfileAnalysis {
  studentName: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
  academicStage: string;
  numericGpa: number | null;
  gpaCategory: "Honors" | "Good / Competitive" | "Cutoff Risk / Warning" | "Critical Academic Recovery" | "Not Provided";
  gpaAssessment: string;
  urgencyLevel: "CRITICAL_IMMEDIATE_PLACEMENT" | "STRATEGIC_PREPARATION" | "FOUNDATION_AND_EXPLORATION";
  urgencyDescription: string;
  targetRole: string;
  primaryGoal: string;
  dailyHours: number;
  coreSkills: string[];
  recommendedStrategy: string;
}

export class MyraStudentProfileAnalyzer {
  /**
   * Parses numerical GPA or percentage from string or number
   */
  public static parseGpa(val?: string | number): number | null {
    if (val === undefined || val === null) return null;
    if (typeof val === "number") return val;
    const clean = String(val).replace(/[^0-9.]/g, "");
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Analyzes student academic stage from degree, field of study, and graduation year
   */
  public static determineStage(degree: string = "", field: string = "", gradYear: string = ""): string {
    const dLower = degree.toLowerCase();
    const fLower = field.toLowerCase();
    const currentYear = new Date().getFullYear();
    const grad = parseInt(gradYear.replace(/[^0-9]/g, ""), 10);

    if (dLower.includes("high school") || dLower.includes("11th") || dLower.includes("12th") || fLower.includes("pcm") || fLower.includes("pcb")) {
      return "Class 12th / Pre-College (Entrance & Board Stage)";
    }
    if (dLower.includes("m.tech") || dLower.includes("mca") || dLower.includes("m.sc") || dLower.includes("mba")) {
      return "Postgraduate Specialist (M.Tech / MCA / Master's)";
    }

    if (!isNaN(grad)) {
      const diff = grad - currentYear;
      if (diff <= 0 || gradYear.toLowerCase().includes("graduated")) {
        return "Graduating / Recent Graduate (Active Placement Conversion)";
      } else if (diff === 1) {
        return "Pre-Final / Final Year (Campus Placement Drive Stage)";
      } else if (diff === 2) {
        return "2nd Year / Sophomore (Core DSA & Portfolio Building)";
      } else if (diff >= 3) {
        return "1st Year / Freshman (Exploration, Math & CS Fundamentals)";
      }
    }

    return "College / Undergraduate Student";
  }

  /**
   * Analyzes GPA health and provides campus placement cutoff benchmark
   */
  public static evaluateGpa(gpa: number | null): { category: StudentProfileAnalysis["gpaCategory"]; assessment: string } {
    if (gpa === null) {
      return {
        category: "Not Provided",
        assessment: "Maintain a minimum 7.5 CGPA (or 75%) to clear company eligibility cutoffs for 90%+ campus recruitment drives.",
      };
    }

    // Percentage scale (> 10) vs 10-point scale
    const normalized = gpa > 10 ? gpa / 10 : gpa;

    if (normalized >= 8.5) {
      return {
        category: "Honors",
        assessment: `Outstanding academic score (${gpa}). Clears 100% of campus placement shortlists and top-tier product company cutoffs. Allocate 70% of study time to advanced DSA, system design, and production projects, and 30% to maintaining GPA.`,
      };
    } else if (normalized >= 7.5) {
      return {
        category: "Good / Competitive",
        assessment: `Strong academic score (${gpa}). Fully clears the 7.0-7.5 CGPA eligibility criteria for Tier-1 product firms and MNCs. Use structured 80/20 exam prep to hold this score stable while accelerating project milestones.`,
      };
    } else if (normalized >= 6.5) {
      return {
        category: "Cutoff Risk / Warning",
        assessment: `Borderline score (${gpa}). Many premium product companies (and TCS Digital/Infosys SP) enforce a strict 7.0 or 7.5 CGPA threshold. Proactively prioritize upcoming semester exams to push your cumulative CGPA above 7.5, while mastering core DSA.`,
      };
    } else {
      return {
        category: "Critical Academic Recovery",
        assessment: `Academic recovery alert (${gpa}). Below standard campus placement cutoffs. Immediate priority: clear any backlogs and push semester GPA to 7.0+. Simultaneously build verified, high-signal GitHub projects to qualify for off-campus and startup opportunities.`,
      };
    }
  }

  /**
   * Computes placement & preparation urgency based on timeline
   */
  public static evaluateUrgency(gradYear: string = "", stage: string = ""): { level: StudentProfileAnalysis["urgencyLevel"]; desc: string } {
    const currentYear = new Date().getFullYear();
    const grad = parseInt(gradYear.replace(/[^0-9]/g, ""), 10);

    if (stage.includes("Class 12")) {
      return {
        level: "FOUNDATION_AND_EXPLORATION",
        desc: "Class 12th phase: Priority is balancing Board exams and Engineering/Tech Entrance tests (JEE/State CETs) with beginner programming logic.",
      };
    }

    if (!isNaN(grad) && grad <= currentYear + 1) {
      return {
        level: "CRITICAL_IMMEDIATE_PLACEMENT",
        desc: "High placement urgency: Campus placement season or off-campus recruitment is imminent. Immediate focus on DSA problem solving, resume tailoring, and mock technical interviews.",
      };
    } else if (!isNaN(grad) && grad === currentYear + 2) {
      return {
        level: "STRATEGIC_PREPARATION",
        desc: "Medium runway: 2nd-year stage. Ideal time to master Data Structures & Algorithms, build 2 comprehensive full-stack/AI portfolio projects, and prepare for summer internships.",
      };
    }

    return {
      level: "FOUNDATION_AND_EXPLORATION",
      desc: "Long runway: 1st-year stage. Focus on core CS fundamentals, discrete math, exploratory tech stacks, maintaining a high GPA (8.5+), and participating in campus clubs.",
    };
  }

  /**
   * Generates a complete comprehensive analysis of a student profile
   */
  public static analyze(raw: StudentRawProfile): StudentProfileAnalysis {
    const name = raw.name || "Student";
    const institution = raw.institution || "College / University";
    const degree = raw.degree || "B.Tech / B.E.";
    const fieldOfStudy = raw.field_of_study || "Computer Science";
    const graduationYear = raw.graduation_year || "2026";
    const targetRole = raw.targetRole || "Software Engineer";
    const primaryGoal = raw.primaryGoal || "Prepare for technical interviews and build a high-signal ATS resume.";
    const dailyHours = raw.dailyStudyHours || 2;

    const numericGpa = this.parseGpa(raw.cgpa);
    const academicStage = this.determineStage(degree, fieldOfStudy, graduationYear);
    const gpaEval = this.evaluateGpa(numericGpa);
    const urgencyEval = this.evaluateUrgency(graduationYear, academicStage);

    const skills: string[] = [];
    if (raw.interests && Array.isArray(raw.interests)) {
      raw.interests.forEach((i) => {
        if (i.name) skills.push(i.name);
      });
    }
    if (raw.resumeSkills && Array.isArray(raw.resumeSkills)) {
      skills.push(...raw.resumeSkills);
    }

    let recommendedStrategy = "";
    if (academicStage.includes("Class 12")) {
      recommendedStrategy = `Allocate 75% focus to school syllabus, Mathematics, and entrance exams. Spend remaining 25% (3-4 hours on weekends) learning foundational Python and problem-solving logic.`;
    } else if (urgencyEval.level === "CRITICAL_IMMEDIATE_PLACEMENT") {
      recommendedStrategy = `Execute a placement-sprint routine: ${dailyHours} hours daily. Dedicate 60% of time to high-frequency DSA (arrays, trees, graphs, DP), 25% to core CS fundamentals (OS, DBMS, CN), and 15% to polishing 2 portfolio projects with live deployed URLs.`;
    } else if (urgencyEval.level === "STRATEGIC_PREPARATION") {
      recommendedStrategy = `Balanced progression: ${dailyHours} hours daily. Dedicate 50% to DSA mastery, 35% to hands-on project development (${targetRole}), and 15% to weekly course revision to keep GPA solid.`;
    } else {
      recommendedStrategy = `Foundational exploration: ${dailyHours} hours daily. Build strong programming syntax, participate in hackathons, maintain an 8.5+ CGPA, and learn version control (Git & GitHub).`;
    }

    return {
      studentName: name,
      institution,
      degree,
      fieldOfStudy,
      graduationYear,
      academicStage,
      numericGpa,
      gpaCategory: gpaEval.category,
      gpaAssessment: gpaEval.assessment,
      urgencyLevel: urgencyEval.level,
      urgencyDescription: urgencyEval.desc,
      targetRole,
      primaryGoal,
      dailyHours,
      coreSkills: Array.from(new Set(skills)).slice(0, 10),
      recommendedStrategy,
    };
  }

  /**
   * Formats the student profile analysis into an authoritative grounding block for Myra's prompt
   */
  public static formatPromptBlock(analysis: StudentProfileAnalysis): string {
    return `
================ STUDENT ACADEMIC PROFILE & INDIVIDUALIZED MENTOR CONTEXT ================
- Student Name: ${analysis.studentName}
- Institution: ${analysis.institution}
- Degree & Stream: ${analysis.degree} in ${analysis.fieldOfStudy}
- Academic Stage: ${analysis.academicStage} (Graduation: ${analysis.graduationYear})
- Current Academic Standing / GPA: ${analysis.numericGpa !== null ? analysis.numericGpa : "Unspecified"} (${analysis.gpaCategory})
- Academic Health Assessment: ${analysis.gpaAssessment}
- Placement & Timeline Urgency: ${analysis.urgencyLevel} - ${analysis.urgencyDescription}
- Target Career Role: ${analysis.targetRole}
- Primary Stated Goal: ${analysis.primaryGoal}
- Daily Available Study Bandwidth: ${analysis.dailyHours} hours/day
- Core Declared Skills / Interests: ${analysis.coreSkills.length > 0 ? analysis.coreSkills.join(", ") : "Technology Fundamentals"}
- Tailored Strategic Blueprint: ${analysis.recommendedStrategy}
==========================================================================================
CRITICAL PERSONALIZATION RULE:
You are this student's personal Academic Guide & Career Manager.
Every recommendation, study plan, timetable, GPA balancing tip, and project suggestion MUST be directly customized to this student's specific academic stage (${analysis.academicStage}), degree (${analysis.degree}), GPA status (${analysis.gpaCategory}), and target role (${analysis.targetRole}).
Do NOT provide generic one-size-fits-all answers. Speak directly to their exact academic situation and timeline.
`.trim();
  }
}
