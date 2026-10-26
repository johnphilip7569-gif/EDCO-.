const assert = require("assert");
const crypto = require("crypto");
const { Client } = require("pg");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const DB_URL = "postgresql://postgres.wgyscapdywroefsjenno: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@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres";
const INTERNAL_SECRET = "edworld-internal-k8s-secret-2026";

async function runTests() {
  console.log("=================================================");
  console.log(" Voice Privacy, Consent & Retention Tests");
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

  const db = new Client({ connectionString: DB_URL });
  await db.connect();

  // Test session IDs
  const testUserId = "5f7b4a48-a2fd-427f-8bf4-6c45b6e23ddb"; // Real profile in public.profiles
  const otherUserId = "00000000-0000-4000-8000-01a0e819ad7c";
  let optInSessionId = "";
  let noOptInSessionId = "";

  // 1. Verify Database Schema for Voice Privacy
  await check("PostgreSQL schema contains voice consent & retention columns", async () => {
    const resConsent = await db.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'consents' AND column_name IN ('voice_recording_consent', 'voice_retention_days', 'voice_consent_accepted_at')"
    );
    assert.strictEqual(resConsent.rows.length, 3, "consents table must have all 3 voice columns");

    const resSession = await db.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'interview_sessions' AND column_name IN ('voice_opt_in', 'retention_expires_at', 'audio_deleted_at', 'audio_url')"
    );
    assert.strictEqual(resSession.rows.length, 4, "interview_sessions table must have all 4 voice audit columns");
  });

  // 2. Score session with voiceOptIn = false -> audio deleted immediately
  await check("Session without audio opt-in discards audio immediately", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/score-session`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-internal-secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({
        userId: testUserId,
        category: "Software Engineering",
        difficultyLevel: 1,
        questions: [{ id: "q1", text: "Walk me through your database indexing strategy." }],
        transcript: "I used composite indexes on foreign keys to optimize query execution plans.",
        durationSeconds: 60,
        voiceOptIn: false,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.sessionId);
    noOptInSessionId = data.sessionId;

    // Verify DB row
    const row = (await db.query("SELECT voice_opt_in, audio_url, audio_deleted_at, retention_expires_at FROM public.interview_sessions WHERE id = $1", [noOptInSessionId])).rows[0];
    assert.strictEqual(row.voice_opt_in, false);
    assert.strictEqual(row.audio_url, null);
    assert.ok(row.audio_deleted_at !== null, "audio_deleted_at must be populated immediately");
    assert.strictEqual(row.retention_expires_at, null);
  });

  // 3. Score session with voiceOptIn = true -> retention_expires_at is set to ~7 days
  await check("Session with audio opt-in sets 7-day retention expiry", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/score-session`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-internal-secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({
        userId: testUserId,
        category: "Software Engineering",
        difficultyLevel: 1,
        questions: [{ id: "q1", text: "Walk me through your caching architecture." }],
        transcript: "We implemented Redis write-through caching to lower latency under 20ms.",
        durationSeconds: 45,
        voiceOptIn: true,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.sessionId);
    optInSessionId = data.sessionId;

    // Verify DB row
    const row = (await db.query("SELECT voice_opt_in, audio_deleted_at, retention_expires_at FROM public.interview_sessions WHERE id = $1", [optInSessionId])).rows[0];
    assert.strictEqual(row.voice_opt_in, true);
    assert.strictEqual(row.audio_deleted_at, null, "audio_deleted_at must be null while within retention period");
    assert.ok(row.retention_expires_at !== null, "retention_expires_at must be set");

    const daysUntilExpiry = (new Date(row.retention_expires_at) - new Date()) / (1000 * 60 * 60 * 24);
    assert.ok(daysUntilExpiry > 6.5 && daysUntilExpiry <= 7.1, `Expected ~7 days retention, got ${daysUntilExpiry.toFixed(2)} days`);
  });

  // 4. User Self-Service Deletion: DELETE /api/interview/cleanup-audio
  await check("Candidate can permanently delete session audio on demand", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/cleanup-audio`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "x-internal-secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({
        sessionId: optInSessionId,
        userId: testUserId,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.deletedAt);

    // Verify DB row updated
    const row = (await db.query("SELECT audio_deleted_at, audio_url FROM public.interview_sessions WHERE id = $1", [optInSessionId])).rows[0];
    assert.ok(row.audio_deleted_at !== null, "audio_deleted_at must now be set");
    assert.strictEqual(row.audio_url, null);
  });

  // 5. User Self-Service Deletion Authorization: Non-owner cannot delete
  await check("Candidate cannot delete audio belonging to another user", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/cleanup-audio`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "x-internal-secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({
        sessionId: noOptInSessionId,
        userId: otherUserId, // Not owner
      }),
    });
    assert.strictEqual(res.status, 403, `Expected 403 Unauthorized, got ${res.status}`);
  });

  // 6. Scheduled Cleanup Job: POST /api/interview/cleanup-audio
  await check("Scheduled audio cleanup endpoint executes and purges expired records", async () => {
    // Create an expired dummy session with valid UUID
    const expiredId = crypto.randomUUID();
    await db.query(`
      INSERT INTO public.interview_sessions (
        id, user_id, category, difficulty_level, overall_score, voice_opt_in, 
        audio_url, retention_expires_at, audio_deleted_at, created_at
      ) VALUES (
        $1, $2, 'Software Engineering', 1, 80, true,
        'https://storage.supabase.co/mock/audio.webm',
        NOW() - INTERVAL '1 day',
        NULL,
        NOW() - INTERVAL '8 days'
      )
    `, [expiredId, testUserId]);

    const res = await fetch(`${BASE_URL}/api/interview/cleanup-audio`, {
      method: "POST",
      headers: {
        "x-internal-secret": INTERNAL_SECRET,
      },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.purgedCount >= 1, `Expected at least 1 purged session, got ${data.purgedCount}`);

    // Verify expired session was purged
    const row = (await db.query("SELECT audio_deleted_at, audio_url FROM public.interview_sessions WHERE id = $1", [expiredId])).rows[0];
    assert.ok(row.audio_deleted_at !== null);
    assert.strictEqual(row.audio_url, null);

    // Clean up dummy record
    await db.query("DELETE FROM public.interview_sessions WHERE id = $1", [expiredId]);
  });

  await db.end();

  console.log(`\nResults: ${passed}/${total} tests passed (${Math.round((passed / total) * 100)}%)\n`);
  if (passed !== total) process.exit(1);
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
