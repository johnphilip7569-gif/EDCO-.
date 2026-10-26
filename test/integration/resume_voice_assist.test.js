const assert = require("assert");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const INTERNAL_SECRET = "edworld-internal-k8s-secret-2026";

async function runTests() {
  console.log("=================================================");
  console.log(" Resume ATS Voice Assist & Context Flow Tests");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  async function check(desc, fn) {
    total++;
    try {
      await fn();
      console.log(`  PASS: [${total}] ${desc}`);
      passed++;
    } catch (err) {
      console.error(`  FAIL: [${total}] ${desc}`);
      console.error(`        ${err.message}`);
    }
  }

  // 1. Context passing from Resume + JD to Question Generation
  await check("Resume and JD context pass seamlessly into question generation with source tags", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/generate-questions`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-internal-secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({
        category: "Software Engineering",
        targetRole: "Senior Backend Engineer",
        sector: "Cloud & DevOps",
        effectiveLevel: 2,
        candidateName: "Adarsh Kolluru",
        jobDescription: "Must have deep expertise in PostgreSQL indexing, Redis caching, and Docker orchestration.",
        resumeContent: {
          title: "Senior Backend Resume",
          summary: "Experienced in building high-throughput microservices using Node.js and PostgreSQL.",
          skills: {
            technical: ["PostgreSQL", "Node.js", "Redis", "Docker"],
            tools: ["Git", "Kubernetes"]
          },
          projects: [
            {
              title: "Distributed Caching Layer",
              technologies: ["Redis", "Node.js", "Docker"]
            }
          ]
        }
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.questions), "questions must be an array");
    assert.ok(data.questions.length >= 3, "At least 3 questions should be returned");
    
    // Check that questions contain source attribution
    const hasSource = data.questions.some(q => q.contextSource || q.type);
    assert.ok(hasSource, "Questions must contain contextSource or type attribution");
  });

  // 2. TTS synthesis for ATS read-aloud
  await check("TTS endpoint synthesizes ATS feedback and JD match summary", async () => {
    const sampleCritique = "Your resume currently matches 82% of the job requirements. Consider highlighting Redis caching and connection pooling in your experience bullets.";
    const res = await fetch(`${BASE_URL}/api/interview/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: sampleCritique,
        voiceId: "myra-neutral",
        speed: 1.0,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.text, sampleCritique);
    assert.ok(data.voiceHints && data.voiceHints.length > 0);
  });

  // 3. Entitlement check handles live_voice_interview
  await check("Shared entitlement checker handles live_voice_interview action", async () => {
    const testUserId = "5f7b4a48-a2fd-427f-8bf4-6c45b6e23ddb";
    const res = await fetch(`${BASE_URL}/api/billing/check-entitlement?userId=${testUserId}&action=live_voice_interview`, {
      headers: {
        "x-internal-secret": INTERNAL_SECRET,
      },
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(typeof body.data.allowed === "boolean", "allowed must be boolean");
    assert.ok(body.data.plan === "free" || body.data.plan === "pro");
  });

  console.log(`\nResults: ${passed}/${total} tests passed (${Math.round((passed / total) * 100)}%)\n`);
  if (passed !== total) process.exit(1);
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
