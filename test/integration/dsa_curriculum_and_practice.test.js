/**
 * Integration Test Suite: Feature 28 — DSA (Data Structures & Algorithms) Learning Page
 *
 * Verifies:
 * 1. Complete 20-topic curriculum in Part A (all required fields: concept, why it matters, common use, worked examples).
 * 2. Topic metadata: tier (Beginner, Intermediate, Advanced), difficulty level (0, 1, 2), interview frequency (High, Medium, Low), prerequisites.
 * 3. Question bank: non-execution drills across 3 types (trace, big-o, conceptual) and personalization adaptation by skill level.
 * 4. Strict Security Guardrail: Zero code execution, no eval(), no Function(), no child_process, no code sandbox.
 * 5. Track Gating: Career & Explorer tracks have access; Junior track is properly restricted.
 * 6. Live Supabase DB check: dsa_topics, dsa_questions, dsa_progress tables with correct rows.
 * 7. Shared Gamification: dsa_practice awards shared XP via awardPoints.
 * 8. Dashboard integration & Navigation: ContinueDsaWidget & FloatingNav links.
 */

const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { describe, it } = require("node:test");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres.wgyscapdywroefsjenno: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@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

describe("Feature 28: DSA Learning Page & Curriculum Engine", () => {
  const rootDir = path.resolve(__dirname, "../..");

  it("1. Verifies all 20 topics exist with concept triad, real-world context, and worked examples", () => {
    const bankFile = path.join(rootDir, "src/lib/dsa/dsa-bank.ts");
    assert(fs.existsSync(bankFile), "dsa-bank.ts must exist");
    const content = fs.readFileSync(bankFile, "utf8");

    const expectedSlugs = [
      "big-o",
      "arrays-strings",
      "searching",
      "sorting-intuition",
      "recursion-basics",
      "basic-math",
      "linked-lists",
      "stacks-queues",
      "hashing",
      "trees",
      "heaps",
      "merge-quick-sort",
      "two-pointer-sliding-window",
      "backtracking",
      "graphs",
      "graph-algorithms",
      "dynamic-programming",
      "greedy-algorithms",
      "tries",
      "advanced-trees"
    ];

    assert.strictEqual(expectedSlugs.length, 20, "Must specify exactly 20 topics");

    expectedSlugs.forEach((slug) => {
      assert(content.includes(`slug: "${slug}"`), `Topic "${slug}" must exist in dsa-bank`);
    });

    // Check required concept triad and worked example fields in schema
    assert(content.includes("explainer_concept"), "Must have explainer_concept (What it is)");
    assert(content.includes("explainer_why_it_matters"), "Must have explainer_why_it_matters (Why it matters in production)");
    assert(content.includes("explainer_common_use"), "Must have explainer_common_use (When to reach for it)");
    assert(content.includes("worked_example"), "Must have worked_example");
  });

  it("2. Verifies topic difficulty tiers, interview frequencies, and prerequisites are defined", () => {
    const bankFile = path.join(rootDir, "src/lib/dsa/dsa-bank.ts");
    const content = fs.readFileSync(bankFile, "utf8");

    // Tiers
    assert(content.includes('tier: "Beginner"'), "Must include Beginner tier");
    assert(content.includes('tier: "Intermediate"'), "Must include Intermediate tier");
    assert(content.includes('tier: "Advanced"'), "Must include Advanced tier");

    // Interview frequencies
    assert(content.includes('interview_frequency: "High"'), "Must include High frequency");
    assert(content.includes('interview_frequency: "Medium"'), "Must include Medium frequency");
    assert(content.includes('interview_frequency: "Low"'), "Must include Low frequency");

    // Prerequisites defined
    assert(content.includes("prerequisite_topic_ids:"), "Topics must define prerequisites");
    assert(content.includes('"big-o"'), "Prerequisites must reference prior topic slugs");
  });

  it("3. Verifies Question Bank has 3 drill types and personalized level adaptation", () => {
    const bankFile = path.join(rootDir, "src/lib/dsa/dsa-bank.ts");
    const content = fs.readFileSync(bankFile, "utf8");

    // 3 Question types
    assert(content.includes('"trace_output"'), "Question bank must include trace / predict-output drills");
    assert(content.includes('"complexity"'), "Question bank must include Big-O complexity drills");
    assert(content.includes('"conceptual_ordering"'), "Question bank must include conceptual / ordering drills");

    // Adaptive difficulty levels (0, 1, 2)
    assert(content.includes("difficulty_level: 0"), "Question bank must have difficulty level 0 (Foundational)");
    assert(content.includes("difficulty_level: 1"), "Question bank must have difficulty level 1 (Core)");
    assert(content.includes("difficulty_level: 2"), "Question bank must have difficulty level 2 (Hard)");

    // Adapt function
    assert(content.includes("getQuestionsForTopic"), "Must export getQuestionsForTopic function");
  });

  it("4. Strict Security Verification: Zero user code execution, zero sandboxes, zero eval()", () => {
    const dsaDir = path.join(rootDir, "src/components/dsa");
    const dsaLibDir = path.join(rootDir, "src/lib/dsa");
    const dsaApiDir = path.join(rootDir, "src/app/api/dsa");

    const checkDirFiles = (dir) => {
      if (!fs.existsSync(dir)) return [];
      let results = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          results = results.concat(checkDirFiles(fullPath));
        } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
          results.push(fullPath);
        }
      }
      return results;
    };

    const allDsaFiles = [
      ...checkDirFiles(dsaDir),
      ...checkDirFiles(dsaLibDir),
      ...checkDirFiles(dsaApiDir)
    ];

    assert(allDsaFiles.length > 5, "DSA components, lib, and API files must be found");

    for (const filePath of allDsaFiles) {
      const code = fs.readFileSync(filePath, "utf8");
      assert(!code.includes("eval("), `eval() is strictly forbidden in DSA feature: ${filePath}`);
      assert(!code.includes("Function("), `new Function() is strictly forbidden in DSA feature: ${filePath}`);
      assert(!code.includes("child_process"), `child_process is strictly forbidden in DSA feature: ${filePath}`);
      assert(!code.includes("Judge0"), `Judge0 execution engine is forbidden: ${filePath}`);
      assert(!code.includes("runCode("), `Arbitrary code runner is forbidden: ${filePath}`);
    }
  });

  it("5. Verifies Track Gating: Career & Explorer tracks allowed, Junior restricted", () => {
    const dsaPage = path.join(rootDir, "src/app/dsa/page.tsx");
    assert(fs.existsSync(dsaPage), "src/app/dsa/page.tsx must exist");
    const content = fs.readFileSync(dsaPage, "utf8");

    assert(content.includes("isJuniorTrack"), "Must check for junior track");
    assert(content.includes("Advanced DSA is on Explorer"), "Junior lock screen must explain reason");
    assert(content.includes("Return to Dashboard"), "Must provide return button");
  });

  it("6. Verifies Shared Gamification Integration (25 XP for DSA drills)", () => {
    const gamificationFile = path.join(rootDir, "src/lib/gamification-service.ts");
    const content = fs.readFileSync(gamificationFile, "utf8");
    assert(content.includes('"dsa_practice"'), 'gamification-service must accept "dsa_practice" as award source');

    const submitRoute = path.join(rootDir, "src/app/api/dsa/submit-answer/route.ts");
    const submitContent = fs.readFileSync(submitRoute, "utf8");
    assert(submitContent.includes("awardPoints"), "submit-answer route must call awardPoints");
    assert(submitContent.includes('sourceFeature: "dsa_practice"'), "Must specify sourceFeature dsa_practice");
    assert(submitContent.includes("points: 25"), "Must award 25 XP per answered drill");
  });

  it("7. Verifies Dashboard & FloatingNav Integration", () => {
    const dashboardPage = path.join(rootDir, "src/app/dashboard/page.tsx");
    const dashboardContent = fs.readFileSync(dashboardPage, "utf8");
    assert(dashboardContent.includes("ContinueDsaWidget"), "Dashboard must import and render ContinueDsaWidget");
    assert(dashboardContent.includes('href="/dsa"'), "Dashboard Quick Actions must link to /dsa");
    assert(dashboardContent.includes('"continue_dsa"'), "Dashboard must support continue_dsa section layout");

    const navFile = path.join(rootDir, "src/components/layout/FloatingNav.tsx");
    const navContent = fs.readFileSync(navFile, "utf8");
    assert(navContent.includes('href: "/dsa"'), "FloatingNav must link to /dsa");
    assert(navContent.includes('label: "Data Structures & Algorithms"'), "FloatingNav item label must be present");
  });

  it("8. Verifies Live Database: dsa_topics, dsa_questions, and dsa_progress exist and are populated", async () => {
    const client = await pool.connect();
    try {
      const topicCountRes = await client.query("SELECT COUNT(*) FROM public.dsa_topics;");
      const count = parseInt(topicCountRes.rows[0].count, 10);
      assert(count >= 20, `Database must contain at least 20 topics, found: ${count}`);

      const questionsCountRes = await client.query("SELECT COUNT(*) FROM public.dsa_questions;");
      const qCount = parseInt(questionsCountRes.rows[0].count, 10);
      assert(qCount >= 20, `Database must contain questions, found: ${qCount}`);

      // Verify progress table exists and schema is intact
      const progressTableCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'dsa_progress';
      `);
      const columns = progressTableCheck.rows.map(r => r.column_name);
      assert(columns.includes("user_id"), "dsa_progress must have user_id");
      assert(columns.includes("topic_id"), "dsa_progress must have topic_id");
      assert(columns.includes("status"), "dsa_progress must have status");
      assert(columns.includes("questions_answered"), "dsa_progress must have questions_answered");
    } finally {
      client.release();
    }
  });

  it("9. Verifies Anti-Camera OCR & Anti-Screenshot Protection in DSA Practice & Proctoring Suite", () => {
    const quizPath = path.join(rootDir, "src/components/dsa/DsaPracticeQuiz.tsx");
    const quizContent = fs.readFileSync(quizPath, "utf8");

    // Must use AntiOcrQuestionCanvas, AntiOcrCodeCanvas, and AntiScreenshotShield
    assert(quizContent.includes("AntiOcrQuestionCanvas"), "DsaPracticeQuiz must render questions via AntiOcrQuestionCanvas");
    assert(quizContent.includes("AntiOcrCodeCanvas"), "DsaPracticeQuiz must render code snippets via AntiOcrCodeCanvas");
    assert(quizContent.includes("AntiScreenshotShield"), "DsaPracticeQuiz must wrap content in AntiScreenshotShield");
    assert(quizContent.includes("useExamProctoring"), "DsaPracticeQuiz must enforce useExamProctoring");
    assert(!quizContent.includes("<code>{currentQ.code_snippet}</code>"), "Must not leak raw DOM <code> for code snippets");

    // Verify AntiOcrCodeCanvas exists and renders onto HTML5 canvas with Moiré grating
    const codeCanvasPath = path.join(rootDir, "src/components/proctoring/AntiOcrCodeCanvas.tsx");
    assert(fs.existsSync(codeCanvasPath), "AntiOcrCodeCanvas.tsx must exist");
    const codeCanvasContent = fs.readFileSync(codeCanvasPath, "utf8");
    assert(codeCanvasContent.includes("<canvas"), "AntiOcrCodeCanvas must use HTML5 canvas");
    assert(codeCanvasContent.includes("PrintScreen"), "AntiOcrCodeCanvas must intercept PrintScreen");

    // Verify AntiScreenshotShield exists and enforces blackout curtain + print blocker
    const shieldPath = path.join(rootDir, "src/components/proctoring/AntiScreenshotShield.tsx");
    assert(fs.existsSync(shieldPath), "AntiScreenshotShield.tsx must exist");
    const shieldContent = fs.readFileSync(shieldPath, "utf8");
    assert(shieldContent.includes("@media print"), "AntiScreenshotShield must block print-to-PDF via @media print");
    assert(shieldContent.includes("blur-2xl"), "AntiScreenshotShield must apply instant blur/blackout curtain");
    assert(shieldContent.includes("poisonClipboard"), "AntiScreenshotShield must poison clipboard on capture attempts");
  });

  it("10. Verifies Backend API Security Hardening (Anti-XP-Farming, Rate Limiting & Filter Injection Protection)", () => {
    const submitRoute = path.join(rootDir, "src/app/api/dsa/submit-answer/route.ts");
    const submitContent = fs.readFileSync(submitRoute, "utf8");

    assert(submitContent.includes("deterministicSourceId"), "Must use deterministic sourceId to prevent repeat XP farming");
    assert(submitContent.includes("submissionHistory"), "Must enforce rate limiting against brute-force guessing");
    assert(submitContent.includes("status: 429"), "Must return 429 Too Many Requests on rate limit violation");
    assert(submitContent.includes("Cache-Control"), "Must include no-store Cache-Control security header");

    const slugRoute = path.join(rootDir, "src/app/api/dsa/topics/[slug]/route.ts");
    const slugContent = fs.readFileSync(slugRoute, "utf8");
    assert(slugContent.includes("/^[a-z0-9-]+$/"), "Must validate slug format to prevent PostgREST filter injection");
    assert(slugContent.includes("X-Content-Type-Options"), "Must return X-Content-Type-Options: nosniff header");
  });
});
