const assert = require("assert");
const crypto = require("crypto");
const { Pool } = require("pg");
const http = require("http");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres.wgyscapdywroefsjenno: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@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

const BASE_URL = "http://localhost:3000";

function makePostRequest(urlPath, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const url = new URL(urlPath, BASE_URL);

    const req = http.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function runPasswordResetIntegrationSuite() {
  console.log("=== RUNNING RESEND PASSWORD RESET FLOW INTEGRATION TESTS ===");
  const client = await pool.connect();

  try {
    // 0. Find or create a dedicated test user in auth.users
    console.log("--- Setup: Ensure Dedicated Test User Exists in auth.users ---");
    const testEmail = "resend_test_user@edworld.in";
    const userRes = await client.query(
      `SELECT id, email, encrypted_password FROM auth.users WHERE LOWER(email) = LOWER($1)`,
      [testEmail]
    );

    let testUserId;
    if (userRes.rows.length === 0) {
      const createRes = await client.query(
        `INSERT INTO auth.users (
          id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud
        ) VALUES (
          gen_random_uuid(), $1, crypt('InitialPass123', gen_salt('bf', 10)), NOW(), '{"name": "Resend Test Candidate"}', 'authenticated', 'authenticated'
        ) RETURNING id`,
        [testEmail]
      );
      testUserId = createRes.rows[0].id;
      // also create profile
      await client.query(
        `INSERT INTO public.profiles (id, email, name, visual_mode, is_public) 
         VALUES ($1, $2, 'Resend Test Candidate', 'career', true)
         ON CONFLICT (id) DO NOTHING`,
        [testUserId, testEmail]
      );
    } else {
      testUserId = userRes.rows[0].id;
    }
    console.log(`[PASS] Test user ready: ${testUserId} (${testEmail})`);

    // 1. Test POST /api/auth/forgot-password with valid email
    console.log("\n--- Check 1: Request Password Reset via API (Resend Trigger) ---");
    const forgotRes = await makePostRequest("/api/auth/forgot-password", { email: testEmail });
    assert.strictEqual(forgotRes.status, 200, "Forgot password endpoint must return 200");
    assert.strictEqual(forgotRes.data.success, true, "Success flag must be true");
    assert.ok(forgotRes.data.message.includes("password recovery link"), "Must return recovery confirmation message");

    // Check token was stored in database
    const tokenDbRes = await client.query(
      `SELECT id, user_id, email, token_hash, expires_at, used
       FROM public.password_reset_tokens
       WHERE LOWER(email) = LOWER($1)
       ORDER BY created_at DESC
       LIMIT 1`,
      [testEmail]
    );
    assert.strictEqual(tokenDbRes.rows.length, 1, "Must have inserted a token record");
    const tokenRecord = tokenDbRes.rows[0];
    assert.strictEqual(tokenRecord.used, false, "Newly created token must have used = false");
    assert.strictEqual(tokenRecord.user_id, testUserId, "Token must be associated with the test user ID");
    assert.ok(new Date(tokenRecord.expires_at) > new Date(), "Expiration must be in the future");
    console.log("[PASS] Token record securely created in public.password_reset_tokens.");

    // 2. Anti-Enumeration Test: Non-existent email
    console.log("\n--- Check 2: Anti-Enumeration Defense for Non-Existent Email ---");
    const unknownRes = await makePostRequest("/api/auth/forgot-password", { email: "ghost_nonexistent_9999@edworld.in" });
    assert.strictEqual(unknownRes.status, 200, "Must return 200 even for non-existent email (zero user enumeration)");
    assert.strictEqual(unknownRes.data.success, true);
    assert.strictEqual(unknownRes.data.message, forgotRes.data.message, "Response must be identical to real email");

    const noGhostTokens = await client.query(
      `SELECT count(*) FROM public.password_reset_tokens WHERE email = 'ghost_nonexistent_9999@edworld.in'`
    );
    assert.strictEqual(parseInt(noGhostTokens.rows[0].count, 10), 0, "No token must be created for non-existent user");
    console.log("[PASS] Anti-enumeration behavior verified.");

    // 3. Invalid Email Format Rejection
    console.log("\n--- Check 3: Invalid Email Format Rejection ---");
    const invalidEmailRes = await makePostRequest("/api/auth/forgot-password", { email: "not-an-email" });
    assert.strictEqual(invalidEmailRes.status, 400, "Invalid email format must return 400");
    console.log("[PASS] Malformed email rejected.");

    // 4. Token Verification & Password Update
    console.log("\n--- Check 4: Token Verification & Password Update via API ---");
    const rawResetToken = crypto.randomBytes(32).toString("hex");
    const testTokenHash = crypto.createHash("sha256").update(rawResetToken).digest("hex");

    await client.query(
      `INSERT INTO public.password_reset_tokens (user_id, email, token_hash, expires_at, used)
       VALUES ($1, $2, $3, NOW() + INTERVAL '1 hour', false)`,
      [testUserId, testEmail, testTokenHash]
    );

    const newTestPassword = "BrandNewSecurePassword2026!";
    const resetRes = await makePostRequest("/api/auth/reset-password", {
      token: rawResetToken,
      email: testEmail,
      newPassword: newTestPassword,
    });

    assert.strictEqual(resetRes.status, 200, "Reset password must return 200");
    assert.strictEqual(resetRes.data.success, true);

    // Verify token marked used
    const checkTokenUsed = await client.query(
      `SELECT used FROM public.password_reset_tokens WHERE token_hash = $1`,
      [testTokenHash]
    );
    assert.strictEqual(checkTokenUsed.rows[0].used, true, "Token must be marked used = true after reset");

    // Verify auth.users encrypted_password matches new password
    const checkAuthPassword = await client.query(
      `SELECT (encrypted_password = crypt($1, encrypted_password)) AS password_matches
       FROM auth.users WHERE id = $2`,
      [newTestPassword, testUserId]
    );
    assert.strictEqual(checkAuthPassword.rows[0].password_matches, true, "New password must authenticate via crypt()");
    console.log("[PASS] Password successfully updated and verified in auth.users.");

    // 5. Single-Use Replay Attack Rejection
    console.log("\n--- Check 5: Single-Use Token Consumption (Replay Prevention) ---");
    const replayRes = await makePostRequest("/api/auth/reset-password", {
      token: rawResetToken,
      email: testEmail,
      newPassword: "AnotherPassword123!",
    });
    assert.strictEqual(replayRes.status, 400, "Replaying a used token must return 400");
    assert.strictEqual(replayRes.data.success, false);
    console.log("[PASS] Replay attack strictly rejected.");

    // 6. Expired Token Rejection
    console.log("\n--- Check 6: Expired Token Rejection ---");
    const expiredToken = crypto.randomBytes(32).toString("hex");
    const expiredHash = crypto.createHash("sha256").update(expiredToken).digest("hex");

    await client.query(
      `INSERT INTO public.password_reset_tokens (user_id, email, token_hash, expires_at, used)
       VALUES ($1, $2, $3, NOW() - INTERVAL '10 minutes', false)`,
      [testUserId, testEmail, expiredHash]
    );

    const expiredRes = await makePostRequest("/api/auth/reset-password", {
      token: expiredToken,
      email: testEmail,
      newPassword: "ValidPassword123!",
    });
    assert.strictEqual(expiredRes.status, 400, "Expired token must return 400");
    assert.strictEqual(expiredRes.data.success, false);
    console.log("[PASS] Expired token strictly rejected.");

    // 7. Password Complexity Validation
    console.log("\n--- Check 7: Password Complexity Validation ---");
    const freshToken = crypto.randomBytes(32).toString("hex");
    const freshHash = crypto.createHash("sha256").update(freshToken).digest("hex");
    await client.query(
      `INSERT INTO public.password_reset_tokens (user_id, email, token_hash, expires_at, used)
       VALUES ($1, $2, $3, NOW() + INTERVAL '1 hour', false)`,
      [testUserId, testEmail, freshHash]
    );

    const shortPassRes = await makePostRequest("/api/auth/reset-password", {
      token: freshToken,
      email: testEmail,
      newPassword: "short",
    });
    assert.strictEqual(shortPassRes.status, 400, "Password under 8 characters must return 400");

    const noNumPassRes = await makePostRequest("/api/auth/reset-password", {
      token: freshToken,
      email: testEmail,
      newPassword: "AllLettersOnlyHere",
    });
    assert.strictEqual(noNumPassRes.status, 400, "Password without numbers must return 400");
    console.log("[PASS] Complexity requirements strictly enforced.");

    // 8. Resend Email Template Integrity
    console.log("\n--- Check 8: Resend Email Template Formatting & Token Link ---");
    const fs = require("fs");
    const templateSource = fs.readFileSync("src/lib/email-templates.ts", "utf8");
    assert.ok(templateSource.includes("export function renderPasswordResetEmail"), "Template file must export renderPasswordResetEmail");
    assert.ok(templateSource.includes("export function renderPasswordChangedConfirmationEmail"), "Template file must export renderPasswordChangedConfirmationEmail");
    assert.ok(templateSource.includes("ctaText: \"Reset Password\""), "Template must define 'Reset Password' CTA text");
    assert.ok(templateSource.includes("ctaUrl: params.resetLink"), "Template must bind ctaUrl to params.resetLink");
    assert.ok(templateSource.includes("title: \"Reset Your Password\""), "Template must contain title");
    assert.ok(templateSource.includes("Security Notice:"), "Template must include security notice");
    console.log("[PASS] Email template functions and link bindings verified.");

    console.log("\n===========================================================");
    console.log("  ALL RESEND PASSWORD RESET INTEGRATION TESTS PASSED (100%)");
    console.log("===========================================================");
  } finally {
    client.release();
    await pool.end();
  }
}

runPasswordResetIntegrationSuite().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
