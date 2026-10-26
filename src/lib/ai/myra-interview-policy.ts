/**
 * Myra Interviewer Conversation Policy & Persona Engine
 * 
 * Defines the conversational rules, pacing, transitions, grounded follow-up generation,
 * and safety boundaries for Myra (AI Interviewer).
 * 
 * Versioned: myra-interviewer-v3.2
 */

export const MYRA_INTERVIEWER_VERSION = process.env.MYRA_MODEL_VERSION || "myra-interviewer-v3.2";

export interface TurnEvaluationInput {
  questionText: string;
  candidateTranscript: string;
  isFollowUp: boolean;
  questionIndex: number;
  totalQuestions: number;
  targetRole: string;
  category: string;
  resumeContext?: string;
  candidateName?: string;
}

export interface TurnEvaluationResult {
  action: "follow_up" | "next" | "repeat" | "skip";
  spokenText: string;
  followUpQuestion?: string;
  reasoning: string;
  referencedPhrase?: string;
  modelVersion: string;
}

const TRANSITION_BRIDGES = [
  "Thanks, that gives me helpful context. Let's move to the next question.",
  "Understood. That's a clear breakdown. Let's look at the next area.",
  "Got it, thank you for walking me through that. Let's continue.",
  "I see. That makes sense. Let's move forward to our next topic.",
  "Thanks for detailing that approach. Let's move on."
];

const DISCRIMINATORY_PATTERNS = [
  /\b(how old are you|what is your age|date of birth)\b/i,
  /\b(are you married|marital status|spouse|husband|wife)\b/i,
  /\b(religion|caste|faith|god|praying|temple|church|mosque)\b/i,
  /\b(pregnant|children|planning a family)\b/i,
  /\b(disability|medical condition|health issue)\b/i,
  /\b(political party|who did you vote for)\b/i,
];

export class MyraInterviewPolicy {
  /**
   * System Prompt defining Myra's voice, pacing, and pedagogical tone.
   */
  public static getSystemPrompt(): string {
    return `You are Myra, AI interviewer at EdWorld Co.
Identity & Transparency:
- You are an AI interviewer, and you always sound natural, supportive, and professional.
- You NEVER claim to be human, and you never imitate a real person's voice.
- You do NOT provide scoring feedback mid-interview. Feedback stays exclusively at the final results screen.
- You keep spoken dialogue concise: one idea at a time, clear natural sentences, no bullet points read aloud.

Conversation Rules:
1. Always acknowledge the candidate's response neutrally and warmly ("I see," "Understood," "Thanks for explaining that").
2. Follow-ups: When generating a follow-up, ask AT MOST ONE follow-up that references something specific the candidate actually said.
3. Keep questions grounded in the candidate's resume, the target role, or the job description.
4. If the candidate asks to repeat the question ("can you repeat that?", "say again"), repeat it cleanly.
5. If the candidate says "skip" or "next", move forward politely with no judgment.
6. Strictly avoid discriminatory or illegal questions (age, marital status, religion, caste, health).
7. If the candidate goes off-topic, gently steer them back to the question.`;
  }

  /**
   * Evaluates candidate speech for meta-intents (repeat, skip)
   */
  public static detectMetaIntent(transcript: string): "repeat" | "skip" | null {
    const clean = transcript.trim().toLowerCase();
    
    // Repeat intent
    if (
      clean === "repeat" ||
      clean.includes("repeat that") ||
      clean.includes("repeat the question") ||
      clean.includes("can you say that again") ||
      clean.includes("say that again") ||
      clean.includes("pardon") ||
      clean.includes("what was the question")
    ) {
      return "repeat";
    }

    // Skip intent
    if (
      clean === "skip" ||
      clean.startsWith("skip this") ||
      clean.includes("pass this question") ||
      clean.includes("i want to skip") ||
      clean.includes("let's skip")
    ) {
      return "skip";
    }

    return null;
  }

  /**
   * Checks if candidate's text contains off-limits or discriminatory topics
   */
  public static containsDiscriminatoryTopic(text: string): boolean {
    return DISCRIMINATORY_PATTERNS.some((pattern) => pattern.test(text));
  }

  /**
   * Evaluates the candidate's answer and determines the next spoken turn
   */
  public static evaluateTurn(input: TurnEvaluationInput): TurnEvaluationResult {
    const {
      questionText,
      candidateTranscript,
      isFollowUp,
      questionIndex,
      targetRole,
      category,
    } = input;

    const transcript = candidateTranscript.trim();
    const modelVersion = MYRA_INTERVIEWER_VERSION;

    // 1. Meta-Intent: Repeat
    const meta = this.detectMetaIntent(transcript);
    if (meta === "repeat") {
      return {
        action: "repeat",
        spokenText: `Sure, here is the question again: ${questionText}`,
        reasoning: "Candidate explicitly requested the question to be repeated.",
        modelVersion,
      };
    }

    // 2. Meta-Intent: Skip
    if (meta === "skip") {
      const bridge = "No problem at all, let's move forward.";
      return {
        action: "skip",
        spokenText: bridge,
        reasoning: "Candidate requested to skip this question.",
        modelVersion,
      };
    }

    // 3. Short or empty answer check
    const wordCount = transcript.split(/\s+/).filter(Boolean).length;
    if (wordCount < 4) {
      return {
        action: "next",
        spokenText: "Thanks. Let's move to our next question.",
        reasoning: "Brief answer provided; advancing to next question without follow-up.",
        modelVersion,
      };
    }

    // 4. Follow-Up Evaluation: Capped at exactly ONE follow-up per base question
    if (!isFollowUp) {
      const extractedFollowUp = this.synthesizeGroundedFollowUp(transcript, questionText, targetRole || category);
      if (extractedFollowUp) {
        return {
          action: "follow_up",
          spokenText: extractedFollowUp.spokenText,
          followUpQuestion: extractedFollowUp.question,
          referencedPhrase: extractedFollowUp.referencedPhrase,
          reasoning: `Candidate mentioned '${extractedFollowUp.referencedPhrase}'; asking 1 grounded follow-up on tradeoffs/depth.`,
          modelVersion,
        };
      }
    }

    // 5. Otherwise, advance to next question with a natural verbal bridge
    const bridgeIndex = questionIndex % TRANSITION_BRIDGES.length;
    const spokenBridge = TRANSITION_BRIDGES[bridgeIndex];

    return {
      action: "next",
      spokenText: spokenBridge,
      reasoning: isFollowUp 
        ? "Follow-up already completed; advancing to next base question."
        : "Answer was clear; advancing to next question.",
      modelVersion,
    };
  }

  /**
   * Synthesizes a natural, spoken follow-up question referencing specific words the candidate uttered.
   * Spoken question is short and tests real depth.
   */
  private static synthesizeGroundedFollowUp(
    transcript: string,
    baseQuestion: string,
    roleContext: string
  ): { spokenText: string; question: string; referencedPhrase: string } | null {
    const lower = transcript.toLowerCase();

    // Check for architecture, design, and technology mentions
    const keyPhrases = [
      { pattern: /\b(react|next\.?js|vue|angular)\b/i, label: "frontend architecture", question: "You mentioned using your frontend framework. What was the toughest state management or rendering bottleneck you solved?" },
      { pattern: /\b(postgresql|postgres|sql|database|schema|indexing)\b/i, label: "database design", question: "You mentioned your database implementation. How did you structure your indexing to prevent slow queries as data grew?" },
      { pattern: /\b(redis|cache|caching|memcached)\b/i, label: "caching strategy", question: "You mentioned caching. What was your invalidation strategy when data changed?" },
      { pattern: /\b(microservices?|api|rest|graphql|docker|kubernetes)\b/i, label: "service architecture", question: "You mentioned your service architecture. How did you handle service failures or unexpected latency between services?" },
      { pattern: /\b(migrated|migration|refactor|overhaul)\b/i, label: "migration/refactor", question: "You mentioned leading a migration. What was the highest-risk tradeoff you had to manage during cutover?" },
      { pattern: /\b(team|collaborat\w+|stakeholders?|pm|product manager)\b/i, label: "team collaboration", question: "You mentioned working across teams. When technical priorities clashed with timelines, how did you reach alignment?" },
      { pattern: /\b(scale|scaling|thousands|users|throughput)\b/i, label: "scalability", question: "You noted scaling challenges. What metrics did you monitor to verify the system stayed stable under peak load?" },
      { pattern: /\b(test\w+|unit test|coverage|ci\/cd|pipeline)\b/i, label: "testing rigor", question: "You mentioned your testing workflow. How did you balance rapid shipping with automated test reliability?" },
    ];

    for (const item of keyPhrases) {
      const match = transcript.match(item.pattern);
      if (match) {
        const word = match[0];
        const spoken = `I see. You mentioned ${word}. ${item.question}`;
        return {
          spokenText: spoken,
          question: spoken,
          referencedPhrase: word,
        };
      }
    }

    // Heuristic fallback referencing candidate's first action verb phrase
    const sentences = transcript.split(/[.?!]/).map(s => s.trim()).filter(Boolean);
    if (sentences.length > 0) {
      const firstSentence = sentences[0];
      const words = firstSentence.split(/\s+/).slice(0, 6).join(" ");
      if (words.length > 10) {
        const spoken = `Got it. Building on what you said about "${words}", what was the primary constraint or lesson learned from that experience?`;
        return {
          spokenText: spoken,
          question: spoken,
          referencedPhrase: words,
        };
      }
    }

    return null;
  }
}
