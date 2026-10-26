/**
 * Myra AI Dataset Loader & Retrieval Layer
 * Consumes Hugging Face 'datasets' exported benchmarks, technical problem sets,
 * and EdWorld Academic Guidance frameworks for students.
 */

import benchmarkData from "@/lib/ai/data/myra-benchmark-dataset.json";
import guidanceData from "@/lib/ai/data/myra-academic-guidance-dataset.json";
import qaTrainingData from "@/lib/ai/data/myra-qa-training-dataset.json";

export interface MyraBenchmarkRecord {
  id: string;
  category: string;
  topic: string;
  question: string;
  ideal_approach: string;
  difficulty: "junior" | "mid" | "senior";
  edge_cases: string[];
}

export interface MyraGuidanceRecord {
  id: string;
  category: string;
  topic: string;
  question: string;
  ideal_approach: string;
  target_stages?: string[];
  key_pitfalls?: string[];
}

export interface MyraQATrainingRecord {
  id: string;
  category: string;
  question: string;
  answer: string;
  examKeywords?: string[];
  branchKeywords?: string[];
  durationKeywords?: string[];
}

export interface MyraDatasetPayload {
  generator: string;
  datasets_version?: string;
  record_count: number;
  updated_at: string;
  records: MyraBenchmarkRecord[];
}

export class MyraDatasetService {
  private static cachedBenchmarks: MyraBenchmarkRecord[] = (benchmarkData as any).records || [];
  private static cachedGuidance: MyraGuidanceRecord[] = (guidanceData as any).records || [];
  private static cachedQATraining: MyraQATrainingRecord[] = (qaTrainingData as any).records || [];

  /**
   * Retrieves all benchmark questions from Hugging Face datasets pipeline
   */
  public static getAllRecords(): MyraBenchmarkRecord[] {
    return this.cachedBenchmarks;
  }

  /**
   * Retrieves all academic guidance records
   */
  public static getAllGuidance(): MyraGuidanceRecord[] {
    return this.cachedGuidance;
  }

  /**
   * Searches benchmark questions by topic or category
   */
  public static findRelevantBenchmarks(query: string, limit: number = 3): MyraBenchmarkRecord[] {
    const q = query.toLowerCase();
    const scored = this.cachedBenchmarks.map((r) => {
      let score = 0;
      if (r.topic.toLowerCase().includes(q)) score += 5;
      if (r.category.toLowerCase().includes(q)) score += 3;
      if (r.question.toLowerCase().includes(q)) score += 4;
      if (r.ideal_approach.toLowerCase().includes(q)) score += 2;
      return { record: r, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.record);
  }

  /**
   * Searches student academic guidance dataset by topic, question, or academic stage
   */
  public static findRelevantGuidance(query: string, stage: string = "", limit: number = 2): MyraGuidanceRecord[] {
    const q = query.toLowerCase();
    const sLower = stage.toLowerCase();

    const scored = this.cachedGuidance.map((g) => {
      let score = 0;
      if (g.topic.toLowerCase().includes(q)) score += 6;
      if (g.category.toLowerCase().includes(q)) score += 4;
      if (g.question.toLowerCase().includes(q)) score += 5;
      if (g.ideal_approach.toLowerCase().includes(q)) score += 3;

      // Matching target academic stage boost
      if (stage && g.target_stages && g.target_stages.some((st) => sLower.includes(st.toLowerCase()) || st.toLowerCase().includes(sLower))) {
        score += 5;
      }

      // Keyword associations
      if ((q.includes("gpa") || q.includes("cgpa") || q.includes("score")) && g.id.includes("gpa")) score += 8;
      if ((q.includes("placement") || q.includes("job") || q.includes("cutoff")) && g.id.includes("placement")) score += 8;
      if ((q.includes("schedule") || q.includes("time") || q.includes("timetable") || q.includes("balance")) && (g.id.includes("time") || g.id.includes("gpa"))) score += 7;
      if ((q.includes("12") || q.includes("school") || q.includes("board")) && g.id.includes("class_12")) score += 9;
      if ((q.includes("bca") || q.includes("non-btech")) && g.id.includes("bca")) score += 9;
      if ((q.includes("roadmap") || q.includes("semester")) && g.id.includes("roadmap")) score += 8;

      return { record: g, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.record);
  }

  /**
   * Retrieves all training Q&A benchmark records
   */
  public static getAllTrainingQA(): MyraQATrainingRecord[] {
    return this.cachedQATraining;
  }

  /**
   * Searches the 158-record training Q&A dataset by question, category, exam, branch, and duration keywords
   */
  public static findRelevantTrainingQA(query: string, limit: number = 2): MyraQATrainingRecord[] {
    const q = query.toLowerCase();
    const words = q.split(/\s+/).filter((w) => w.length > 2);

    const scored = this.cachedQATraining.map((item) => {
      let score = 0;
      const itemQ = item.question.toLowerCase();
      const itemCat = item.category.toLowerCase();
      const itemAns = item.answer.toLowerCase();

      // Category matching
      if (q.includes("timetable") || q.includes("schedule") || q.includes("routine") || q.includes("time table")) {
        if (itemCat === "timetable") score += 10;
      }
      if (q.includes("roadmap") || q.includes("plan") || q.includes("strategy") || q.includes("months") || q.includes("years")) {
        if (itemCat === "roadmap") score += 8;
      }
      if (q.includes("note") || q.includes("subject") || q.includes("how to study") || q.includes("doubt") || q.includes("prepare")) {
        if (itemCat === "subject_help" || itemCat === "notes") score += 8;
      }

      // Exact phrase match in question
      if (itemQ.includes(q)) score += 30;

      // Exam keyword matches
      if (item.examKeywords && item.examKeywords.length > 0) {
        for (const kw of item.examKeywords) {
          if (q.includes(kw.toLowerCase())) score += 15;
        }
      }

      // Branch keyword matches
      if (item.branchKeywords && item.branchKeywords.length > 0) {
        for (const kw of item.branchKeywords) {
          if (q.includes(kw.toLowerCase())) score += 12;
        }
      }

      // Duration keyword matches
      if (item.durationKeywords && item.durationKeywords.length > 0) {
        for (const kw of item.durationKeywords) {
          if (q.includes(kw.toLowerCase())) score += 14;
        }
      }

      // General word overlap
      for (const word of words) {
        if (itemQ.includes(word)) score += 4;
        if (itemAns.includes(word)) score += 1;
      }

      return { record: item, score };
    });

    return scored
      .filter((s) => s.score > 8)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.record);
  }

  /**
   * Formats relevant dataset examples and academic guidance into prompt grounding block
   */
  public static formatDatasetGroundingPrompt(query: string, stage: string = ""): string {
    const trainingQAMatches = this.findRelevantTrainingQA(query, 2);
    const guidanceMatches = this.findRelevantGuidance(query, stage, 2);
    const benchmarkMatches = this.findRelevantBenchmarks(query, 2);

    const blocks: string[] = [];

    if (trainingQAMatches.length > 0) {
      blocks.push(
        `OFFICIAL EDWORLD MENTOR REFERENCE EXAMPLES (Exemplary Response Structure & Style from Training Dataset):\n` +
        trainingQAMatches.map((m, i) => `[Mentor Example ${i + 1}] Category: ${m.category}
Student Question: ${m.question}
Exemplary Response:
${m.answer}`).join("\n\n---\n\n")
      );
    }

    if (guidanceMatches.length > 0) {
      blocks.push(
        `ACADEMIC & CAREER GUIDANCE BENCHMARK DATASET (EdWorld Academic Frameworks):\n` +
        guidanceMatches.map((m, i) => `[Guidance Reference ${i + 1}] Topic: ${m.topic} (${m.category})
Core Strategy:
${m.ideal_approach}
${m.key_pitfalls && m.key_pitfalls.length > 0 ? `Key Pitfalls: ${m.key_pitfalls.join("; ")}` : ""}`).join("\n\n")
      );
    }

    if (benchmarkMatches.length > 0) {
      blocks.push(
        `TECHNICAL BENCHMARK GROUNDING (via Hugging Face datasets):\n` +
        benchmarkMatches.map((m, i) => `[Technical Reference ${i + 1}] Topic: ${m.topic} (${m.difficulty})
Question: ${m.question}
Ideal Technical Approach: ${m.ideal_approach}
Key Failure Modes & Edge Cases: ${m.edge_cases.join("; ")}`).join("\n\n")
      );
    }

    return blocks.length > 0 ? `\n${blocks.join("\n\n")}\n` : "";
  }
}
