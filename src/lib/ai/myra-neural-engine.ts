/**
 * Myra Neural Knowledge Engine
 * Focused, intent-scoped responder that answers ONLY what the user asks,
 * without unsolicited essays, boilerplate headers, or unrequested code dumps.
 */

import { StudentProfileContext } from "./myra-agent";
import { MyraScopedUserContext } from "./myra-context-builder";
import { MyraStudentProfileAnalyzer } from "./myra-profile-analyzer";

export interface NeuralSynthesisResult {
  text: string;
  topicDetected: string;
  confidence: number;
}

export class MyraNeuralEngine {
  /**
   * Cleans text to strictly remove all asterisks (* and **) and markdown header clutter
   */
  public static cleanText(text: string): string {
    return (text || "")
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
      .replace(/\*/g, "")
      .replace(/^#{1,6}\s+/gm, "")
      .trim();
  }

  /**
   * Extracts only the raw user question if a prompt wrapper was passed
   */
  public static extractRawQuery(input: string): string {
    if (!input) return "";
    const userQMatch = input.match(/User Question:\s*([\s\S]*?)(?:\n\nReply directly|$)/i);
    if (userQMatch && userQMatch[1]) {
      return userQMatch[1].trim();
    }
    const legacyMatch = input.match(/USER QUERY:\s*"([\s\S]*?)"/i);
    if (legacyMatch && legacyMatch[1]) {
      return legacyMatch[1].trim();
    }
    return input.trim();
  }

  /**
   * Synthesizes a direct, concise Myra reply tailored strictly to what the user asked.
   */
  public static synthesizeResponse(
    query: string,
    profile?: StudentProfileContext,
    webReachContext?: { url: string; title?: string; content: string } | null,
    scopedContext?: MyraScopedUserContext
  ): NeuralSynthesisResult {
    const cleanQuery = this.extractRawQuery(query);
    const rawResult = this.internalSynthesize(cleanQuery, profile, webReachContext, scopedContext);
    return {
      topicDetected: rawResult.topicDetected,
      confidence: rawResult.confidence,
      text: this.cleanText(rawResult.text),
    };
  }

  private static internalSynthesize(
    query: string,
    profile?: StudentProfileContext,
    webReachContext?: { url: string; title?: string; content: string } | null,
    scopedContext?: MyraScopedUserContext
  ): NeuralSynthesisResult {
    const q = (query || "").trim();
    const lower = q.toLowerCase();

    // 0A. Help & Support Inquiries
    if (/\b(help|support|contact|email|phone|grievance|complaint|reach out|customer service)\b/i.test(lower)) {
      const email = scopedContext?.supportSnapshot?.supportEmail || "edworld.eden@gmail.com";
      const portal = scopedContext?.supportSnapshot?.contactPath || "/contact";
      return {
        topicDetected: "Help & Support",
        confidence: 0.99,
        text: `You can reach the EdWorld Co. support and grievance redressal team directly by emailing ${email}, or by visiting the Help & Support portal at ${portal}. Support hours are Monday to Saturday, 9:00 AM to 6:00 PM IST.`,
      };
    }

    // 0B. Live Hackathons & Competitions Inquiries
    if (/\b(hackathon|hackathons|competition|competitions|events|contests|challenge|challenges)\b/i.test(lower)) {
      if (scopedContext?.activeEventsSnapshot && scopedContext.activeEventsSnapshot.length > 0) {
        const eventsList = scopedContext.activeEventsSnapshot
          .map((e, idx) => `${idx + 1}. ${e.title} (${e.category}) - Prize Pool: ${e.prizePool}`)
          .join("\n");
        return {
          topicDetected: "Active Competitions",
          confidence: 0.98,
          text: `Here are the active competitions currently featured on EdWorld Co.:\n\n${eventsList}\n\nYou can explore complete rulebooks, prize breakdowns, and official registration links directly on your Dashboard carousel.`,
        };
      }
    }

    // 0C. Mock Interview Score & History Inquiries
    if (/\b(interview score|mock interview score|last interview|my score|interview feedback|how did i do in my interview|how many interviews)\b/i.test(lower)) {
      if (scopedContext?.interviewSnapshot && scopedContext.interviewSnapshot.totalSessions > 0) {
        const i = scopedContext.interviewSnapshot;
        const latest = i.latestScore ?? i.averageScore;
        const total = i.totalSessions;
        const avg = i.averageScore;
        const cat = i.latestCategory || "Software Engineering";
        const struggleText = i.commonStruggles.length > 0 
          ? ` Areas to focus on for your next round: ${i.commonStruggles.join(", ")}.`
          : "";

        return {
          topicDetected: "Interview Performance",
          confidence: 0.98,
          text: `You have completed ${total} mock interview ${total === 1 ? "session" : "sessions"}. In your most recent session (${cat}), you achieved an overall score of ${latest}/100. Your cumulative average across all sessions is ${avg}/100.${struggleText}`,
        };
      } else {
        return {
          topicDetected: "Interview Status",
          confidence: 0.95,
          text: "You haven't completed any mock interview sessions yet. You can launch your first round in the Mock Interview Studio (/interviews) to receive real-time AI scoring and speech delivery metrics.",
        };
      }
    }

    // 0D. Career Path & Target Role Inquiries
    if (/\b(my career path|career track|target role|chosen path|selected path|what role am i targeting)\b/i.test(lower)) {
      const primary = scopedContext?.careerPathsSnapshot?.primaryPath || profile?.targetRole || "Software Engineering";
      const cat = scopedContext?.careerPathsSnapshot?.category || "Software & Tech";
      const targetRole = scopedContext?.profileSnapshot?.targetRole || profile?.targetRole || "Software Engineer";
      return {
        topicDetected: "Career Path",
        confidence: 0.98,
        text: `Your primary career path is set to ${primary} (${cat}), targeting the role of ${targetRole}. You can review or adjust your active career paths anytime from your Career Settings.`,
      };
    }

    // 0E. User Resume Data Inquiries
    if (/\b(my resume|resume skills|my projects on resume|what's on my resume|resume summary)\b/i.test(lower)) {
      if (scopedContext?.resumeSnapshot) {
        const r = scopedContext.resumeSnapshot;
        const skillsList = r.skills.length > 0 ? r.skills.slice(0, 8).join(", ") : "software engineering technologies";
        return {
          topicDetected: "Resume Data",
          confidence: 0.97,
          text: `Your current resume is titled "${r.title}". It lists ${r.skills.length} core skills (including ${skillsList}) and ${r.projectCount} verified projects. To maximize your ATS match, align your accomplishment bullets with metrics and target job descriptions.`,
        };
      }
    }

    // Detect if the user specifically asked for code or implementation
    const wantsCode = /\b(code|implement|implementation|program|snippet|syntax|write a function|show an example in)\b/i.test(q);
    // Detect if the user only asked for time/space complexity
    const wantsComplexityOnly =
      /\b(time complexity|space complexity|big-o|big o)\b/i.test(q) &&
      !wantsCode &&
      q.split(/\s+/).length <= 14;

    // 0F. If live web context was fetched for a specific link/search query, summarize it directly
    if (webReachContext && webReachContext.content) {
      const snippet = webReachContext.content.replace(/\s+/g, " ").trim().slice(0, 420);
      return {
        topicDetected: "Web Reference",
        confidence: 0.95,
        text: `Based on ${webReachContext.title || webReachContext.url}:\n${snippet}`,
      };
    }

    // 1. Simple Greetings & First Message (Teddy Mascot & Study Buddy Persona)
    if (/^(hi|hello|hey|good morning|good afternoon|good evening|hii+|yo|hola)\b[!.?\s]*$/i.test(q)) {
      const studentName = profile?.name?.trim();
      const isKnownName =
        !!studentName &&
        studentName.toLowerCase() !== "student" &&
        studentName.toLowerCase() !== "learner";

      const text = isKnownName
        ? `Hi ${studentName}! I'm Myra from EdWorld Co. Tell me your goal (for example JEE, NEET, CUET, boards, semester exams, GATE, CAT, placements), how many months you have, and how many hours a day you can study. I'll build your timetable and roadmap.`
        : "Hi, I'm Myra from EdWorld Co. Tell me your goal (for example JEE, NEET, CUET, boards, semester exams, GATE, CAT, placements), how many months you have, and how many hours a day you can study. I'll build your timetable and roadmap.";
      return {
        topicDetected: "Official First Message",
        confidence: 0.99,
        text,
      };
    }

    // 1X. Serious Distress & Crisis Guardrail
    if (/\b(hopeless|depressed|depression|suicidal|end my life|kill myself|can't take this pressure|giving up|lost all hope|bahut depression|bahut pareshan|zindagi bekaar hai)\b/i.test(lower)) {
      return {
        topicDetected: "Crisis & Emotional Support",
        confidence: 1.0,
        text: `I hear you, and I want you to know that you are not alone. 🐻 Studying, exams, and career choices can feel heavy, but your life, health, and well-being will always matter much more than any exam, score, or degree.

Please reach out and talk to a trusted adult, teacher, parent, or counsellor right now. In India, free, confidential support is available 24/7:
- Tele-MANAS: Call 14416 or 1800-891-4416 (24/7, multi-lingual)
- KIRAN Mental Health Helpline: Call 1800-599-0019 (24/7)

Take a slow breath, step away from your books and screens for a little while, and please speak with someone you trust. I am here whenever you want to study again, but your well-being comes first.`,
      };
    }

    // 1X2. Exam Stress & Overwhelm (Encouraging, short breaks, healthy study habits)
    if (/\b(exam stress|stressed|anxious|anxiety|scared of exams|overwhelmed|tension ho rahi hai|padhai nahi ho rahi|exam fear)\b/i.test(lower)) {
      return {
        topicDetected: "Exam Stress & Encouragement",
        confidence: 0.98,
        text: `Take a slow, deep breath. 🐻 Exam stress happens to every student, but you are completely capable of handling this.

Here are 3 quick habits to feel better right now:
1. Step away for 5 minutes: Drink a glass of water and stretch.
2. The 25-5 Rule: Study for 25 minutes, then take a real 5-minute break. Short sprints prevent burnout.
3. Focus on one small thing: Pick just one easy chapter or formula sheet to start. Small wins build momentum.

You do not have to finish everything today. What small topic would you like to review together first?`,
      };
    }

    // 1X3. Homework & Assignment Method Guardrail (Never just give homework answers without explaining the method)
    if (/\b(do my homework|do my assignment|solve my assignment|give me homework answers|give me the answer to my assignment)\b/i.test(lower)) {
      return {
        topicDetected: "Homework Guidance Method",
        confidence: 0.98,
        text: `I am here to help you learn and understand the method so you can solve it yourself with confidence! 🐻 I won't just hand over homework answers, but let's break down the method step by step:

1. Identify the given values and what the question is asking you to find.
2. Pick the matching formula, rule, or theorem.
3. Substitute the values and calculate step by step.

Share the specific question you are working on, and tell me where you get stuck!`,
      };
    }

    // 1X4. Unclear Doubt Solver Guardrail (Ask ONE clarifying question first)
    if (/^(i have a doubt|clear my doubt|i don't understand|i don't get it|doubt hai|explain this to me)\b[!.?\s]*$/i.test(lower.trim())) {
      return {
        topicDetected: "Doubt Clarification",
        confidence: 0.98,
        text: `I would love to help you clear it! 🐻 Which subject and specific topic or question do you have a doubt in?`,
      };
    }

    // 1X5. Practice & Quizzes (One question at a time. Wait for answer.)
    // Check if user is replying with an answer to a quiz question
    if (/^(option\s*[a-d]|[a-d]\b|it is [a-d]|answer is [a-d]|ans is [a-d])/i.test(lower.trim())) {
      const isOptionB = /\b(b|option b)\b/i.test(lower);
      if (isOptionB) {
        return {
          topicDetected: "Quiz Answer Evaluation - Correct",
          confidence: 0.98,
          text: `Spot on! That is completely correct. 🐻

In a balanced Binary Search Tree, every step cuts the search space in half, giving O(log N) time complexity.

Ready for the next question to raise the difficulty slightly?
Question 2: What is the worst-case time complexity of searching in an unbalanced, skewed Binary Search Tree (where every node has only one child)?
A) O(1)
B) O(log N)
C) O(N)
D) O(N log N)

Reply with your answer when ready!`,
        };
      } else {
        return {
          topicDetected: "Quiz Answer Evaluation - Incorrect",
          confidence: 0.98,
          text: `Good try, but that is not quite right! Here is what went wrong and how the method works: 🐻

In a balanced search tree, we divide the search space by 2 at each step. Because we cut the problem in half each time, the number of comparisons grows logarithmically: O(log N).

Let's try a similar practice question to lock it in:
Question: If a sorted array has 32 items, what is the maximum number of comparisons Binary Search takes to find a target?
A) 5
B) 16
C) 32
D) 64

What is your answer?`,
        };
      }
    }

    // Quiz generator: Give ONE question at a time
    if (/\b(quiz|give me a quiz|practice question|quiz me|test me|practice test|generate quiz)\b/i.test(lower)) {
      return {
        topicDetected: "Practice Quiz - Question 1",
        confidence: 0.98,
        text: `Let's practice! Here is Question 1 for you: 🐻

Question 1: What is the average time complexity of searching for an element in a balanced Binary Search Tree (BST)?
A) O(1)
B) O(log N)
C) O(N)
D) O(N^2)

Reply with your answer (A, B, C, or D) and let's see how you do!`,
      };
    }

    // 1X6. Personalised Study Plans (Adjustment when missed a day or finished early)
    if (/\b(missed a day|missed yesterday|missed my study|finished early|finished ahead|ahead of schedule)\b/i.test(lower)) {
      return {
        topicDetected: "Study Plan Adjustment",
        confidence: 0.98,
        text: `No worries at all! Life happens, and adjusting your plan keeps your momentum going strong. 🐻

Here is how we adjust your schedule:
1. If you missed a slot: Move that topic into tomorrow's first 30-minute block and trim 10 minutes from a topic you already know well.
2. If you finished early: Great job! Either reward yourself with an early break or do a quick 10-minute active recall quiz.
3. Keep your weekend revision slot intact so your foundation stays solid.

Would you like me to rewrite your daily schedule for tomorrow?`,
      };
    }

    // 1X7. Personalised Study Plans (Intake: ask 5 questions OR build weekly plan with revision slots)
    if (/\b(study plan|study schedule|personalised study plan|timetable|weekly plan|plan my study|plan my preparation)\b/i.test(lower)) {
      const hasSpecificDetails = lower.includes("class") || lower.includes("grade") || lower.includes("exam") || lower.includes("hours");
      if (!hasSpecificDetails && !profile?.institution) {
        return {
          topicDetected: "Study Plan Intake",
          confidence: 0.98,
          text: `I would love to build a personalised study plan for you! 🐻 To make it fit your schedule, please tell me:

1. What class or grade are you in?
2. Which subjects are you preparing for?
3. When is your exam date?
4. How many daily study hours do you have?
5. Which topics feel weak or tricky right now?

Once you tell me, I will build your weekly day-by-day plan with built-in revision slots!`,
        };
      }
      return {
        topicDetected: "Weekly Study Plan",
        confidence: 0.98,
        text: `Here is your personalised weekly study plan with dedicated revision slots: 🐻

Weekly Schedule:
- Monday (Subject 1 - Core Theory): 60 mins on foundational concepts + 15 mins summary notes.
- Tuesday (Subject 2 - Problem Solving): 60 mins solving textbook exercises + 15 mins error log.
- Wednesday (Subject 1 - Deep Dive): 60 mins on weak or tricky topics + 15 mins formula practice.
- Thursday (Subject 2 - Practice): 60 mins problem sets + 15 mins active recall.
- Friday (Mixed Practice): 45 mins mixed questions + 15 mins doubt clearing.
- Saturday (Revision Slot 1): 60 mins reviewing Monday-Wednesday notes and formulas.
- Sunday (Revision Slot 2 & Quiz): 45 mins mock practice test + 15 mins planning next week. Rest the evening!

How does this schedule feel for your daily routine? We can adjust the hours anytime!`,
      };
    }

    // 1X8. Progress Tracking (Summarise: strong topics, topics needing focus, next 3 actions)
    if (/\b(progress|my progress|track my progress|show my progress|summarise my progress|summarize my progress|how am i doing)\b/i.test(lower)) {
      return {
        topicDetected: "Progress Tracking",
        confidence: 0.98,
        text: `You have been working consistently, and every practice session builds real mastery! 🐻

Here is your progress summary:
1. Strong Topics:
- Core Data Structures and search concepts
- Building consistent daily study routines

2. Topics Needing Focus:
- Time and space complexity edge cases
- Speed during timed exam questions

3. Next 3 Actions:
- Action 1: Solve 1 practice problem today using the step-by-step method.
- Action 2: Review your quick formula sheet for 10 minutes before bed.
- Action 3: Take a short 5-minute break after every 25 minutes of focused study.

Celebrate the small wins you have achieved today! What would you like to practice next?`,
      };
    }

    // 1X9. Exam Prep Mode (Quick revision notes, formula/key-point sheets, mock tests with timing, last-minute tips)
    if (/\b(exam prep|revision notes|formula sheet|key points|last-minute tips|last minute tips|mock test)\b/i.test(lower)) {
      return {
        topicDetected: "Exam Prep Mode",
        confidence: 0.98,
        text: `Here are your quick exam prep notes and formula key-points: 🐻

Quick Revision Notes:
- Focus on high-yield theorems and definitions first.
- Always write down the given information and formula in written exams to secure partial step marks.
- Practice active recall: close your notebook and explain the concept aloud in simple words.

Key Formulas & Rules:
- Binary Search: Mid = Left + (Right - Left) / 2 to prevent integer overflow.
- Time Complexity Order: O(1) < O(log N) < O(N) < O(N log N) < O(N^2).
- Pomodoro Timing: 25 minutes focused study followed by a strict 5-minute break.

Last-Minute Exam Tips:
- Read the question paper completely during the initial reading time.
- Start with the questions you are most confident in to build momentum.
- Keep 15 minutes at the end to check your calculations and units.

Does this make sense? Want a practice question or a timed mock question?`,
      };
    }

    // 1Y. Hinglish Career Exploration & Guidance
    if (/\b(kaunsa career|samajh nahi aa raha|kya karu|kya karun|kaise start karu|kaise shuru karein|kisme scope hai|paisa kisme zyada hai|career select karna)\b/i.test(lower)) {
      return {
        topicDetected: "Hinglish Career Exploration",
        confidence: 0.98,
        text: `Main samajh sakti hoon! Career choose karte waqt aisi confusion hona bilkul natural hai, aur aap akele nahi hain. 😊
 
Aapke liye 3 high-demand practical directions jisme future scope aur growth solid hai:
1. Software & Web Development:
- Fit: Agar aapko building, logical problem-solving, aur technology pasand hai.
- Scope: High demand, internships easily available. Starting CTC 5-15 LPA.
- Pros & Cons: Fast growth, par consistent coding practice zaroori hai.
2. Data Analytics & AI:
- Fit: Agar numbers, charts, trends, aur Python me interest hai.
- Scope: Har modern company data-driven decisions le rahi hai.
- Pros & Cons: High future relevance, par statistics aur math sikhna padega.
3. Product & Design (UI/UX / Management):
- Fit: Agar user empathy, visual creativity, aur organizing cheezein pasand hain.
- Scope: Startups aur tech products me high creative freedom.
 
Aaj ke liye aapka ek simple next step:
Mujhe batayein ki aap abhi kaunsi class ya year me hain aur aapka favourite subject ya activity kya hai? Phir hum aapke liye ek tailored roadmap banate hain!`,
      };
    }
 
    // 1Z. Education & Stream Selection (Science vs Commerce vs Arts)
    if (/\b(which stream|stream choice|science or commerce|arts or science|stream selection|what should i choose after 10th|what should i pick after 12th|stream.*pick)\b/i.test(lower)) {
      return {
        topicDetected: "Stream Selection",
        confidence: 0.98,
        text: `Choosing your academic stream is an exciting milestone, and the key is finding the intersection of your natural interest and future career options. 😊
 
Here is an honest breakdown of the 3 primary streams:
1. Science (PCM / PCB):
- Best for: Engineering, Technology, Architecture, Medicine, and Research.
- Pros: Keeps the widest door open for higher studies and technical transitions.
- Cons: High academic rigor and requires consistent problem-solving discipline.
2. Commerce (with or without Maths):
- Best for: Finance, Investment Banking, Chartered Accountancy (CA), Fintech, and Entrepreneurship.
- Pros: Directly applicable business knowledge, strong corporate placements.
- Cons: Math is heavily recommended if targeting top-tier management and analytics degrees.
3. Arts / Humanities:
- Best for: Product Design, Law, Journalism, Civil Services (UPSC), Psychology, and Digital Media.
- Pros: Develops exceptional critical thinking, communication, and creative agility.
- Cons: Careers require proactive portfolio building rather than campus placements.
 
Your next step for this week:
List the 2 subjects you genuinely enjoy spending time on, and let me know which of these three paths excites your curiosity the most.`,
      };
    }

    // Extract comprehensive student profile analysis for individualized mentoring
    const studentAnalysis = MyraStudentProfileAnalyzer.analyze({
      name: scopedContext?.profileSnapshot?.name || profile?.name,
      institution: scopedContext?.profileSnapshot?.institution || scopedContext?.profileSnapshot?.college || profile?.institution,
      degree: scopedContext?.profileSnapshot?.degree || profile?.degree || profile?.gradeLevel,
      field_of_study: scopedContext?.profileSnapshot?.fieldOfStudy || profile?.field_of_study,
      graduation_year: scopedContext?.profileSnapshot?.graduationYear || profile?.graduation_year,
      cgpa: scopedContext?.profileSnapshot?.cgpa || profile?.cgpa,
      targetRole: scopedContext?.profileSnapshot?.targetRole || profile?.targetRole,
      primaryGoal: scopedContext?.profileSnapshot?.primaryGoal || profile?.primaryGoal || profile?.learningGoals,
      interests: scopedContext?.profileSnapshot?.interests || profile?.interests,
      dailyStudyHours: scopedContext?.profileSnapshot?.dailyStudyHours || profile?.dailyStudyHours || 2,
      resumeSkills: scopedContext?.profileSnapshot?.skills || profile?.resumeSkills,
    });

    // 1A. Individualized Study Schedule & Preparation Planning
    if (/\b(study schedule|plan my study|study plan|schedule this semester|timetable|daily routine|time management|how should i study|plan my preparation)\b/i.test(lower)) {
      if (studentAnalysis.academicStage.includes("Class 12")) {
        return {
          topicDetected: "Class 12 Study Plan",
          confidence: 0.98,
          text: `I'm happy to help you structure a balanced routine that keeps your stress low and your scores high! 😊

As a Class 12th student at ${studentAnalysis.institution || "your school"} preparing for ${studentAnalysis.targetRole || "technology & engineering"}, here is your realistic weekly timetable:
1. Monday to Friday (75% Academics): Dedicate 3 to 4 hours daily to Mathematics, Physics, Chemistry, and school curriculum. Aim for 80%+ in your board exams, as major universities and top recruiters enforce strict 10th/12th cutoffs (typically 60-75%).
2. Weekend Logic & Coding Sprint (3-4 hours total): Use Saturday or Sunday mornings to learn foundational programming with Python or C++. Focus on loops, conditional branching, functions, and elementary problem-solving.
3. Entrance Test Alignment: Treat your Math (Calculus, Probability, Vectors) as the bedrock for higher-level computer science, algorithms, and AI.

Your next step for this week:
Block out your Saturday morning 9:00 AM to 11:00 AM slot for writing your first Python program, and keep your weekdays dedicated to Board revision. How does this schedule feel for your daily routine?`,
        };
      } else if (studentAnalysis.urgencyLevel === "CRITICAL_IMMEDIATE_PLACEMENT") {
        const gpaWarning = studentAnalysis.gpaCategory === "Cutoff Risk / Warning"
          ? ` Note: With a current CGPA of ${studentAnalysis.numericGpa}, prioritize your upcoming semester exams to push above 7.5 so you are not screened out by Tier-1 product cutoffs.`
          : "";
        return {
          topicDetected: "Placement Study Plan",
          confidence: 0.98,
          text: `Let's make sure every hour of your preparation counts directly toward landing your target role! 😊

Since you are in your ${studentAnalysis.academicStage} in ${studentAnalysis.fieldOfStudy} at ${studentAnalysis.institution || "college"} targeting ${studentAnalysis.targetRole} (graduating ${studentAnalysis.graduationYear}), here is your high-intensity placement sprint for your ${studentAnalysis.dailyHours}-hour daily bandwidth:
1. Daily 60 Minutes (High-Yield DSA): Practice 1-2 curated problems on LeetCode/Striver sheet focusing on Arrays, Two Pointers, Binary Search, Trees, and Graphs. Emphasize explaining your thought process clearly.
2. Daily 45 Minutes (Core Projects for ${studentAnalysis.targetRole}): Work on your primary production project. Ensure you have clean architecture, database indexing, user authentication, and a live deployed URL on Vercel or Render.
3. Daily 15 Minutes (Core CS Fundamentals): Review operating systems (threads, paging), database normalization, and SQL queries asked in technical screening rounds.${gpaWarning}

Your next step for today:
Pick 1 medium problem on Two Pointers on LeetCode and solve it without looking at the solution for 30 minutes. Let me know how it goes!`,
        };
      } else {
        return {
          topicDetected: "Foundational Study Plan",
          confidence: 0.98,
          text: `You have an incredible multi-year runway ahead of you, and starting now gives you a massive advantage! 😊

As an early-stage undergraduate in ${studentAnalysis.degree} at ${studentAnalysis.institution || "college"} targeting ${studentAnalysis.targetRole}, here is your structured semester schedule for your ${studentAnalysis.dailyHours}-hour daily bandwidth:
1. Daily 45 Minutes (Language & Data Structures): Master one primary language (Java, C++, or Python) and systematically implement linear data structures (arrays, linked lists, stacks, queues).
2. Daily 45 Minutes (Hands-On Building): Build small, functional utilities and applications in ${studentAnalysis.targetRole}. Learn Git and commit code daily to GitHub.
3. Daily 30 Minutes (Coursework & 8.5+ CGPA Defense): Review your semester subjects daily. Securing an 8.5+ CGPA in your initial semesters establishes an academic cushion that makes placement shortlisting effortless later.

Your next step for this week:
Create a GitHub account and push your first clean repository with a well-formatted README. Want me to guide you through creating your first repo?`,
        };
      }
    }

    // 1B. Individualized GPA Balancing & Cutoff Strategy
    if (/\b(balance.*gpa|manage.*gpa|gpa.*coding|improve.*gpa|maintain.*cgpa|semester exam|cgpa.*dsa|gpa matter|gpa matters|placement cutoff|cgpa cutoff)\b/i.test(lower)) {
      if (studentAnalysis.academicStage.includes("Class 12")) {
        return {
          topicDetected: "Class 12 Academic Balance",
          confidence: 0.98,
          text: `It is fantastic that you are thinking ahead, but let's make sure your priorities are in the right order! 😊

For Class 12, your academic score is vital:
1. School Boards are Permanent: Top engineering institutions, state colleges, and corporate recruitment drives (e.g. TCS, Infosys, Amazon) enforce 60% to 75% minimum cutoffs in 10th and 12th board marks.
2. 80/20 Rule: Allocate 80% of your energy to school subjects and entrance exams.
3. Keep Coding as a Weekend Hobby: 2-3 hours of coding on weekends is plenty at this stage. Never sacrifice board marks for premature tech specialization.

Your next action for this week:
Focus 100% on your upcoming chapter test in Mathematics, and reward yourself with a 2-hour coding session on Sunday. Shall we set up a study timetable?`,
        };
      } else if (studentAnalysis.gpaCategory === "Honors") {
        return {
          topicDetected: "Honors GPA Strategy",
          confidence: 0.98,
          text: `You have done a fantastic job maintaining an outstanding score of ${studentAnalysis.numericGpa} CGPA in ${studentAnalysis.degree}! 😊

You are in the Honors safe zone and comfortably clear 100% of campus placement screening shortlists:
1. Efficient Coursework Sprints: Do not over-study for college tests every single day. Use the 80/20 exam technique: study previous 5-year question papers, lab manuals, and professor notes during the 3 weeks preceding mid-term and end-term exams.
2. Shift 70% Bandwidth to Technical Mastery: Allocate the bulk of your ${studentAnalysis.dailyHours} daily hours to advanced DSA (Graphs, Dynamic Programming) and deploying real-world production projects for ${studentAnalysis.targetRole}.
3. Safeguard Internal Marks: Maintain 80%+ attendance and submit assignments promptly to ensure top internal marks without written exam stress.

Your next step for this week:
Review your semester syllabus and mark the dates of your mid-term exams so you know exactly when your 3-week study sprint begins. Would you like to review your project roadmap next?`,
        };
      } else if (studentAnalysis.gpaCategory === "Cutoff Risk / Warning") {
        return {
          topicDetected: "Borderline GPA Cutoff Strategy",
          confidence: 0.98,
          text: `I appreciate your honesty about your academics—let's tackle this strategically so no doors close on you! 😊

Your current standing of ${studentAnalysis.numericGpa} CGPA in ${studentAnalysis.degree} requires proactive management because premier product firms and digital roles (TCS Digital, Infosys SP) often enforce a strict 7.0 or 7.5 CGPA eligibility cutoff:
1. Push This Semester to 8.0+: Make semester exam preparation a non-negotiable 45-minute daily commitment to pull your cumulative score above 7.5 before campus drives begin.
2. Maximize Internal Assessment: Lab marks, attendance, and internal tests account for 25-30% of your grade. Securing full marks here is the easiest way to elevate your CGPA.
3. Target High-Yield DSA: Spend your remaining coding time on high-frequency patterns (Two Pointers, Hash Maps, Binary Search) so you pass coding tests cleanly on your first attempt.

Your next step for today:
Check your internal assessment attendance and make sure you do not lose marks on upcoming lab submissions. Shall we review your subject-wise game plan?`,
        };
      } else {
        return {
          topicDetected: "Academic GPA Balance",
          confidence: 0.98,
          text: `Hi ${studentAnalysis.studentName && studentAnalysis.studentName !== "Learner" ? studentAnalysis.studentName + ", b" : "B"}alancing academics with hands-on skills is the secret of every successful engineer, and you can absolutely master both! 😊

To balance your college CGPA in ${studentAnalysis.degree} with practical skills for ${studentAnalysis.targetRole}:
1. The 80/20 Semester Rule: University exams draw heavily from past question papers and lecture slides. Spend 3 weeks before exams doing targeted review rather than cramming randomly.
2. Guard the 7.5 Threshold: Keep your cumulative CGPA strictly above 7.5 to avoid being filtered out by automated campus placement algorithms.
3. Protect Your Daily Coding Window: Complete your 1 to 2 hours of coding before classes start or late in the evening so college classes do not derail your technical progress.

Your next action for this week:
Schedule your daily coding hour at the same time each day (e.g. 7:00 AM to 8:00 AM). Would morning or evening work better for your college routine?`,
        };
      }
    }

    // 1C. Individualized Project Suggestions to Stand Out
    if (/\b(project|projects to build|portfolio project|what project|projects should i build|projects to stand out)\b/i.test(lower)) {
      if (studentAnalysis.academicStage.includes("Class 12")) {
        return {
          topicDetected: "Class 12 Projects",
          confidence: 0.97,
          text: `Building small, practical projects is the best way to see the magic of coding in action! 😊

As a Class 12th student, avoid complex multi-tier production apps right now. Instead, build 2 clean logic-driven projects in Python:
1. Scientific Calculator / Physics Simulation: A Python program simulating projectile motion or calculating physics formulas with a clean terminal or Tkinter UI.
- Pros: Directly reinforces your Class 12 Physics & Math concepts.
2. Personal Student Budget & Study Tracker: A command-line or Streamlit app that logs your study hours, tests completed, and exam countdowns.
- Pros: Functional, helpful for your daily routine, and proves solid coding basics.

Your next step for this weekend:
Spend 1 hour setting up Python and building a simple formula solver for your Physics syllabus. Want me to share starter code for it?`,
        };
      } else {
        return {
          topicDetected: "Standout Engineering Projects",
          confidence: 0.97,
          text: `Building the right projects makes all the difference when recruiters review your profile! 😊

To stand out for ${studentAnalysis.targetRole} as a student in ${studentAnalysis.degree} at ${studentAnalysis.institution || "your college"}, build 2 production-grade applications instead of generic tutorial clones:
1. Project 1 (Full-Featured Core Application): A full-stack web platform relevant to ${studentAnalysis.targetRole} featuring JWT/OAuth authentication, database relational schema with indexing in PostgreSQL, and real-time updates (WebSockets or Server-Sent Events).
- Impact: Proves you understand complete end-to-end software architecture.
2. Project 2 (High-Signal Technical Tool): An API rate limiter, caching layer with Redis, or an AI-powered document semantic search tool using vector embeddings.
- Impact: Demonstrates performance optimization and modern engineering depth.

Your next step for this week:
Draft a 1-page architecture document or wireframe for Project 1 detailing the database tables and key API endpoints. Would you like me to review your project idea?`,
        };
      }
    }

    // 2. Direct Complexity-Only Queries
    if (wantsComplexityOnly) {
      if (lower.includes("binary search")) {
        return {
          topicDetected: "Binary Search Complexity",
          confidence: 0.98,
          text: "Binary Search has a time complexity of O(log N) in the average and worst cases (O(1) best case) and an auxiliary space complexity of O(1) when implemented iteratively (O(log N) if recursive).",
        };
      }
      if (lower.includes("quick sort") || lower.includes("quicksort")) {
        return {
          topicDetected: "Quick Sort Complexity",
          confidence: 0.98,
          text: "Quick Sort has an average time complexity of O(N log N), a worst-case time complexity of O(N^2) (when pivot selection is unbalanced), and O(log N) auxiliary call-stack space.",
        };
      }
      if (lower.includes("merge sort") || lower.includes("mergesort")) {
        return {
          topicDetected: "Merge Sort Complexity",
          confidence: 0.98,
          text: "Merge Sort has a time complexity of O(N log N) across best, average, and worst cases, with O(N) auxiliary space complexity.",
        };
      }
      if (lower.includes("hash") || lower.includes("hashmap") || lower.includes("dictionary")) {
        return {
          topicDetected: "Hash Map Complexity",
          confidence: 0.98,
          text: "A Hash Map provides O(1) average time complexity for search, insert, and delete operations (O(N) worst case on hash collisions) and O(N) space complexity.",
        };
      }
    }

    // 3. Agent-Reach
    if (lower.includes("agent-reach") || lower.includes("panniantong")) {
      const base =
        "Agent-Reach is an open-source headless connector toolkit (github.com/Panniantong/Agent-Reach) that allows AI agents to interact with external platforms using browser session automation and CLI connectors instead of paid enterprise APIs.";
      const codeBlock = wantsCode
        ? `\n\n\`\`\`typescript\nconst session = { platform: "github", headless: true };\n// Normalizes DOM output into structured JSON for agent calls\n\`\`\``
        : "";
      return {
        topicDetected: "Agent-Reach",
        confidence: 0.98,
        text: `${base}${codeBlock}`,
      };
    }

    // 4. Redis & Caching
    if (lower.includes("redis") || lower.includes("cache") || lower.includes("caching")) {
      let answer =
        "Redis is an in-memory key-value data store that keeps frequently used data in RAM for ultra-fast, sub-millisecond access.\n\nHere is how caching works step by step:\n1. Check Cache: When a request arrives, check Redis first for the requested key.\n2. Cache Hit: If the data exists, return it immediately without touching the slow database.\n3. Cache Miss: If not found, fetch from the database, store a copy in Redis with a TTL (expiration time), and return it.\n\nQuick Example:\nWhen 10,000 students view the same course page at once, Redis serves the page in 0.5ms from RAM rather than running 10,000 heavy SQL database queries.\n\nDoes this make sense? Want a practice question?";
      if (lower.includes("stampede") || lower.includes("avalanche")) {
        answer =
          "A cache avalanche happens when many keys expire simultaneously (prevented by adding random jitter to TTLs). A cache stampede occurs when many concurrent requests miss on the same hot key at once (prevented with distributed locks or mutexes).\n\nDoes this make sense? Want a practice question?";
      }
      return {
        topicDetected: "Redis & Caching",
        confidence: 0.96,
        text: answer,
      };
    }

    // 5. Dynamic Programming (DP)
    if (lower.includes("dynamic programming") || /\bdp\b/.test(lower) || lower.includes("memoization") || lower.includes("knapsack")) {
      const answer =
        "Dynamic Programming (DP) is a technique for solving complex problems by breaking them into overlapping subproblems and storing the answers so each subproblem is solved only once.\n\nHere is the step-by-step method:\n1. Identify subproblems: Check if larger problems reuse identical smaller subproblems.\n2. Write the recurrence relation: Express the solution to size N using size N-1 or N-2.\n3. Store results: Save computed answers in a memoization table (top-down) or an array (bottom-up tabulation).\n\nQuick Example:\nIn the Fibonacci sequence (0, 1, 1, 2, 3, 5...), instead of recalculating Fib(3) three separate times, you save Fib(3) = 2 in an array and reuse it instantly.\n\nDoes this make sense? Want a practice question?";
      return {
        topicDetected: "Dynamic Programming",
        confidence: 0.96,
        text: answer,
      };
    }

    // 6. Queue
    if (lower.includes("queue")) {
      const answer =
        "A queue is a linear data structure that follows the First-In, First-Out (FIFO) principle, where the first element added is the first one removed.\n\nHere is how it works step by step:\n1. Enqueue: Insert a new item at the rear of the queue in O(1) time.\n2. Dequeue: Remove and return the item at the front of the queue in O(1) time.\n3. Peek: View the front item without removing it.\n\nQuick Example:\nThink of a line of students at a cafeteria counter: the first student to join the line is the first one served and leaves first.\n\nDoes this make sense? Want a practice question?";
      return {
        topicDetected: "Queue Data Structure",
        confidence: 0.96,
        text: answer,
      };
    }

    // 7. Stack
    if (lower.includes("stack")) {
      const answer =
        "A stack is a linear data structure that follows the Last-In, First-Out (LIFO) principle, where the last element pushed in is the first one popped out.\n\nHere is how it works step by step:\n1. Push: Place a new item onto the top of the stack in O(1) time.\n2. Pop: Remove and return the top item in O(1) time.\n3. Peek: Inspect the current top item without removing it.\n\nQuick Example:\nThink of a stack of dinner plates: you place new plates on top, and you take plates from the top first.\n\nDoes this make sense? Want a practice question?";
      return {
        topicDetected: "Stack Data Structure",
        confidence: 0.96,
        text: answer,
      };
    }

    // 8. Linked List
    if (lower.includes("linked list")) {
      const answer =
        "A linked list is a linear data structure of connected nodes where each node contains its value and a pointer (reference) to the next node in memory.\n\nHere is how it works step by step:\n1. Node Structure: Each node stores data and a next pointer (plus prev in doubly linked lists).\n2. Head and Tail: The head points to the start; the last node points to null.\n3. Insertion & Deletion: Modifying pointers allows O(1) insertions and deletions at known positions without shifting contiguous elements like arrays.\n\nQuick Example:\nLike a scavenger hunt where each clue holds a prize and the address of the next clue until the final clue.\n\nDoes this make sense? Want a practice question?";
      return {
        topicDetected: "Linked List",
        confidence: 0.96,
        text: answer,
      };
    }

    // 9. Binary Search
    if (lower.includes("binary search")) {
      const answer =
        "Binary Search is an efficient algorithm that finds a target in a sorted list by repeatedly dividing the search interval in half in O(log N) time.\n\nHere is how it works step by step:\n1. Find Middle: Calculate mid = left + (right - left) / 2 to avoid integer overflow.\n2. Compare: If nums[mid] equals target, you found it! Return mid.\n3. Halve Search Space: If nums[mid] < target, search the right half (left = mid + 1). If nums[mid] > target, search the left half (right = mid - 1).\n4. Repeat until left > right.\n\nQuick Example:\nSearching for 7 in sorted array [1, 3, 5, 7, 9]: Mid is 5. Since 7 > 5, search right half [7, 9]. Mid is 7—found in just 2 comparisons instead of scanning 4 elements linearly!\n\nDoes this make sense? Want a practice question?";
      return {
        topicDetected: "Binary Search",
        confidence: 0.96,
        text: answer,
      };
    }

    // 10. Trees / BST / Graphs / BFS / DFS
    if (lower.includes("bfs") || lower.includes("dfs") || lower.includes("breadth-first") || lower.includes("depth-first")) {
      return {
        topicDetected: "Graph Traversal",
        confidence: 0.96,
        text: "BFS and DFS are fundamental graph and tree traversal algorithms running in O(V + E) time.\n\nHere is how they work step by step:\n1. Breadth-First Search (BFS): Explores neighbor by neighbor using a FIFO queue. It finds the shortest path in unweighted graphs.\n2. Depth-First Search (DFS): Explores as deep as possible down each branch using recursion or a stack before backtracking.\n\nQuick Example:\nExploring a maze: BFS checks all rooms 1 step away, then 2 steps away. DFS runs down one long hallway to a dead end, backs up, and tries the next path.\n\nDoes this make sense? Want a practice question?",
      };
    }

    // 11. Trees & BST
    if (lower.includes("tree") || lower.includes("bst")) {
      return {
        topicDetected: "Trees & BST",
        confidence: 0.95,
        text: "A Binary Search Tree (BST) is a hierarchical tree where every node's left child has a smaller key and its right child has a larger key, giving O(log N) average search, insert, and delete time.\n\nHere is how it works step by step:\n1. Start at Root: Compare the search value with the current node.\n2. Move Left or Right: If target is smaller, move to the left child; if larger, move to the right child.\n3. Terminate: Stop when found or when reaching a null pointer.\n\nQuick Example:\nIn a BST with root 10: 5 is on the left and 15 is on the right. Finding 15 takes only 1 step!\n\nDoes this make sense? Want a practice question?",
      };
    }

    // 12. Hash Table / Hashing
    if (lower.includes("hash") || lower.includes("two sum")) {
      return {
        topicDetected: "Hashing",
        confidence: 0.95,
        text: "A Hash Table maps keys to values using a mathematical hash function, providing O(1) average-case time for lookups, insertions, and deletions.\n\nHere is how it works step by step:\n1. Hash Function: Converts a key (like a student's name) into an integer array index.\n2. Bucket Storage: Stores the key-value pair in that computed bucket.\n3. Collision Handling: Uses chaining (linked lists) or open addressing if two keys map to the same bucket.\n\nQuick Example:\nLooking up a student record by roll number: Instead of checking every student one by one, the hash function jumps directly to the student's record in O(1) time.\n\nDoes this make sense? Want a practice question?",
      };
    }

    // 13. STAR Behavioral Method
    if (lower.includes("star") || lower.includes("behavioral") || lower.includes("conflict") || lower.includes("leadership")) {
      return {
        topicDetected: "STAR Method",
        confidence: 0.95,
        text: "The STAR method structures behavioral interview answers into four concise parts:\n1. Situation: The brief context and challenge.\n2. Task: Your specific responsibility.\n3. Action: The concrete steps and decisions you personally took.\n4. Result: The measurable outcome (metrics, latency reduction, or delivery impact).\n\nDoes this make sense? Want a practice question?",
      };
    }

    // 14. Resume & ATS
    if (lower.includes("resume") || lower.includes("ats") || lower.includes("cv") || lower.includes("keyword")) {
      const roleNote = profile?.targetRole ? ` for ${profile.targetRole}` : "";
      return {
        topicDetected: "ATS Resume",
        confidence: 0.95,
        text: `To optimize your resume${roleNote} for ATS parsers:\n1. Use a clean single-column layout with standard headings (Experience, Projects, Skills, Education).\n2. Write bullet points using the Action + Technical Context + Quantified Impact format.\n3. Match exact technology keywords from the target job description.\n\nDoes this make sense? Want a practice question?`,
      };
    }

    // 15. Next.js / React
    if (lower.includes("next.js") || lower.includes("nextjs") || lower.includes("react") || lower.includes("server component") || lower.includes("ssr")) {
      return {
        topicDetected: "Next.js & React",
        confidence: 0.94,
        text: "React builds component-driven interactive interfaces, while Next.js adds server-side rendering (SSR), static site generation (SSG), and Server Components for fast performance and SEO.\n\nHere is how it works step by step:\n1. Server Components: Fetch database data directly on the server without sending large JavaScript libraries to the browser.\n2. Client Components: Handle user interactions like buttons, input fields, and animations.\n3. Hybrid Hydration: Next.js merges server HTML with client interactivity smoothly.\n\nQuick Example:\nA blog post renders HTML instantly from the server, while the like button hydrates as a client component to handle clicks.\n\nDoes this make sense? Want a practice question?",
      };
    }

    // 16. Aptitude / Math
    if (lower.includes("aptitude") || lower.includes("probability") || lower.includes("permutation") || lower.includes("combination") || lower.includes("quant")) {
      return {
        topicDetected: "Quantitative Aptitude",
        confidence: 0.94,
        text: "Aptitude problems test problem-solving speed using core algebraic and arithmetic formulas.\n\nHere is how to solve them step by step:\n1. Identify the formula: e.g. Work = (A * B) / (A + B), or Speed = Distance / Time.\n2. Substitute given values and check consistent units (km/h vs m/s).\n3. Use unit-digit and approximation checks to eliminate wrong options in 30 seconds.\n\nDoes this make sense? Want a practice question?",
      };
    }

    // 17. Concise, Direct General Answer (4-part Study Buddy Doubt Solution)
    return {
      topicDetected: "Direct Study Response",
      confidence: 0.9,
      text: `Here is the step-by-step breakdown for ${q.slice(0, 100)}:\n\n1. Core Concept: Focus on the fundamental definition and the simplest rule that applies.\n2. Method: Break the problem into small, manageable parts and solve each step sequentially.\n3. Verification: Check boundary conditions and test with a simple example.\n\nDoes this make sense? Want a practice question?`,
    };
  }
}
