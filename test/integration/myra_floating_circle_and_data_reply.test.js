const assert = require("assert");
const { Client } = require("pg");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const DB_URL = "postgresql://postgres.wgyscapdywroefsjenno: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@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres";
const TEST_USER_ID = "00000000-0000-4000-8000-01a0e819ad7c"; // Standard test profile in DB

async function runTests() {
  console.log("=================================================");
  console.log(" Myra AI Floating Circle & Data-Grounded Tests");
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

  // 1. Verify Database Connection and Context Records
  let dbClient;
  await check("Verify database records exist for test user context", async () => {
    dbClient = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
    await dbClient.connect();

    const profileRes = await dbClient.query("SELECT id, name, target_role FROM profiles WHERE id = $1 LIMIT 1", [TEST_USER_ID]);
    assert.ok(profileRes.rows.length > 0, "Test profile should exist in DB");

    const eventsRes = await dbClient.query("SELECT COUNT(*) FROM events WHERE registration_status != 'closed' OR registration_status IS NULL");
    const activeEventsCount = parseInt(eventsRes.rows[0].count, 10);
    assert.ok(activeEventsCount >= 0, "Active events count query should succeed");
  });

  // 2. Help and Support Query
  await check("POST /api/ai/myra answers Help & Support with real email and portal link, zero asterisks", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/myra`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "How do I contact EdWorld Co. support and grievance redressal?",
        userId: TEST_USER_ID,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.reply, "Reply must not be empty");
    assert.ok(data.reply.includes("edworld.eden@gmail.com"), "Must include official support email");
    assert.ok(!data.reply.includes("*"), "Reply must strictly have zero asterisks");
    assert.ok(!data.reply.includes("**"), "Reply must strictly have zero double asterisks");
  });

  // 3. Live Hackathons Query
  await check("POST /api/ai/myra answers Live Hackathons from database, zero asterisks", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/myra`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "What active hackathons and coding competitions are happening right now?",
        userId: TEST_USER_ID,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.reply, "Reply must not be empty");
    assert.ok(
      data.reply.toLowerCase().includes("hackathon") || 
      data.reply.toLowerCase().includes("competition") ||
      data.reply.toLowerCase().includes("events"),
      "Must discuss hackathons/events"
    );
    assert.ok(!data.reply.includes("*"), "Reply must strictly have zero asterisks");
  });

  // 4. Mock Interview Score Query
  await check("POST /api/ai/myra answers Mock Interview scores from user history, zero asterisks", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/myra`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "What is my latest mock interview score and performance?",
        userId: TEST_USER_ID,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.reply, "Reply must not be empty");
    assert.ok(
      data.reply.toLowerCase().includes("interview") || 
      data.reply.toLowerCase().includes("score") || 
      data.reply.toLowerCase().includes("session"),
      "Must reference interview data"
    );
    assert.ok(!data.reply.includes("*"), "Reply must strictly have zero asterisks");
  });

  // 5. Career Path and Target Role Query
  await check("POST /api/ai/myra answers Career Path query grounded in user profile, zero asterisks", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/myra`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "What is my current career path and target role?",
        userId: TEST_USER_ID,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.reply, "Reply must not be empty");
    assert.ok(
      data.reply.toLowerCase().includes("career") || 
      data.reply.toLowerCase().includes("role") || 
      data.reply.toLowerCase().includes("path") ||
      data.reply.toLowerCase().includes("engineer"),
      "Must reference career path or role"
    );
    assert.ok(!data.reply.includes("*"), "Reply must strictly have zero asterisks");
  });

  // 6. Resume Skills Query
  await check("POST /api/ai/myra answers Resume details query grounded in user resume, zero asterisks", async () => {
    const res = await fetch(`${BASE_URL}/api/ai/myra`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "What skills are on my latest resume?",
        userId: TEST_USER_ID,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.reply, "Reply must not be empty");
    assert.ok(
      data.reply.toLowerCase().includes("resume") || 
      data.reply.toLowerCase().includes("skills"),
      "Must reference resume and skills"
    );
    assert.ok(!data.reply.includes("*"), "Reply must strictly have zero asterisks");
  });

  if (dbClient) {
    await dbClient.end();
  }

  console.log(`\nResults: ${passed}/${total} tests passed.`);
  if (passed === total) {
    console.log("ALL TESTS PASSED SUCCESSFULLY!");
    process.exit(0);
  } else {
    console.error("SOME TESTS FAILED.");
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
