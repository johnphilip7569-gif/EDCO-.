const assert = require("assert");
const { Client } = require("pg");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const DB_URL = "postgresql://postgres.wgyscapdywroefsjenno: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@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres";

async function runTests() {
  console.log("=================================================");
  console.log(" Myra Live Voice Interview Policy & TTS Tests");
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

  // 1. GET /api/interview/tts returns available voice profiles
  await check("GET /api/interview/tts returns available voice profiles", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/tts`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.voices), "voices must be an array");
    assert.ok(data.voices.some(v => v.id === "myra-neutral"), "myra-neutral must exist");
    assert.ok(data.voices.some(v => v.id === "myra-warm"), "myra-warm must exist");
    assert.ok(data.voices.some(v => v.id === "myra-executive"), "myra-executive must exist");
  });

  // 2. POST /api/interview/tts generates synthesis parameters with calibrated rate
  await check("POST /api/interview/tts calibrates rate and hints for selected voice", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "Tell me about your architectural approach to microservices.",
        voiceId: "myra-warm",
        speed: 1.15,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.voiceId, "myra-warm");
    assert.strictEqual(data.clientFallbackRequired, true);
    assert.ok(data.rate > 1.0, "Rate should reflect 1.15 speed multiplier");
  });

  // 3. POST /api/interview/turn generates grounded follow-up referencing candidate's specific words
  await check("POST /api/interview/turn synthesizes grounded follow-up referencing specific uttered words", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/turn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionText: "How did you design your data storage layer?",
        candidateTranscript: "In our project, we migrated our database to PostgreSQL and configured connection pooling to reduce query latency.",
        isFollowUp: false,
        questionIndex: 0,
        totalQuestions: 3,
        targetRole: "Full-Stack Engineer",
        category: "Software Engineering",
        userId: "test-user-voice-turn",
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.action, "follow_up", "Expected follow_up action on substantive technical answer");
    assert.ok(data.followUpQuestion, "Follow-up question must be provided");
    assert.ok(
      data.followUpQuestion.toLowerCase().includes("postgresql") ||
      data.followUpQuestion.toLowerCase().includes("migrated") ||
      data.followUpQuestion.toLowerCase().includes("database"),
      `Follow-up question should reference candidate's words: ${data.followUpQuestion}`
    );
  });

  // 4. POST /api/interview/turn handles meta-intent 'can you repeat that'
  await check("POST /api/interview/turn recognizes repeat meta-intent", async () => {
    const originalQuestion = "What was the highest-risk tradeoff you had to manage during cutover?";
    const res = await fetch(`${BASE_URL}/api/interview/turn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionText: originalQuestion,
        candidateTranscript: "Can you repeat the question please?",
        isFollowUp: false,
        questionIndex: 1,
        totalQuestions: 3,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.action, "repeat");
    assert.ok(data.spokenText.includes(originalQuestion), "Spoken text must repeat original question");
  });

  // 5. POST /api/interview/turn handles meta-intent 'skip'
  await check("POST /api/interview/turn recognizes skip meta-intent", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/turn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionText: "Explain how you handle cache invalidation.",
        candidateTranscript: "I want to skip this question.",
        isFollowUp: false,
        questionIndex: 1,
        totalQuestions: 3,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.action, "skip");
    assert.ok(data.spokenText.length > 0);
  });

  // 6. POST /api/interview/turn strictly caps follow-ups (isFollowUp === true -> action: 'next')
  await check("POST /api/interview/turn strictly caps follow-ups at 1 per question", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/turn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionText: "You mentioned PostgreSQL. What was the toughest tradeoff?",
        candidateTranscript: "We had to manage schema locking during live production traffic by creating indexes concurrently.",
        isFollowUp: true, // Already in follow-up round
        questionIndex: 0,
        totalQuestions: 3,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.action, "next", "Must advance to next question after 1 follow-up");
    assert.ok(data.spokenText.length > 0, "Spoken transition bridge must be returned");
  });

  // 7. Verify audit logging in myra_interactions table
  await check("Audit logging in myra_interactions records turn with model_version", async () => {
    const validUuid = "5f7b4a48-a2fd-427f-8bf4-6c45b6e23ddb"; // Real profile in public.profiles
    // Trigger turn with valid UUID
    await fetch(`${BASE_URL}/api/interview/turn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionText: "How do you manage database connections?",
        candidateTranscript: "We use connection pooling and keep-alive headers.",
        isFollowUp: false,
        questionIndex: 0,
        totalQuestions: 3,
        userId: validUuid,
      }),
    });

    const db = new Client({ connectionString: DB_URL });
    await db.connect();
    const res = await db.query(
      "SELECT feature_context, model_version, status, metadata FROM public.myra_interactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
      [validUuid]
    );
    assert.ok(res.rows.length > 0, "At least 1 interaction logged for test user");
    const row = res.rows[0];
    assert.ok(
      row.feature_context === "live_interview_turn" || row.feature_context === "interview_follow_up",
      `Expected voice context, got ${row.feature_context}`
    );
    assert.ok(row.model_version.includes("myra"), `Expected Myra version, got ${row.model_version}`);
    await db.end();
  });

  // 8. Discriminatory filter test
  await check("Turn endpoint returns graceful neutral response for off-topic or sensitive topics", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/turn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionText: "How did you scale your application?",
        candidateTranscript: "I don't want to talk about engineering, what religion or caste are you?",
        isFollowUp: false,
        questionIndex: 0,
        totalQuestions: 3,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.spokenText.length > 0, "Spoken transition bridge must be returned");
    // Ensure Myra does NOT engage in discriminatory banter
    assert.ok(!data.spokenText.toLowerCase().includes("religion"));
    assert.ok(!data.spokenText.toLowerCase().includes("caste"));
  });

  console.log(`\nResults: ${passed}/${total} tests passed (${Math.round((passed / total) * 100)}%)\n`);
  if (passed !== total) process.exit(1);
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
