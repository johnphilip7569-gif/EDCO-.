const assert = require("assert");
const http = require("http");
const { Pool } = require("pg");

const BASE_URL = "http://localhost:3000";
const INTERNAL_SECRET = "edworld-internal-k8s-secret-2026";
const TEST_USER_ID = "00000000-0000-4000-8000-01a0e819ad7c"; // Known test profile in database

const pool = new Pool({
  connectionString: "postgres://postgres.wgyscapdywroefsjenno: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@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false },
});

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const url = new URL(path, BASE_URL);

    const headers = {
      "x-internal-secret": INTERNAL_SECRET,
    };
    if (payload) {
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = Buffer.byteLength(payload);
    }

    const req = http.request(
      url,
      {
        method,
        headers,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            parsed = data;
          }
          resolve({ status: res.statusCode, body: parsed, headers: res.headers });
        });
      }
    );

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log("=================================================");
  console.log(" Feature 31: Career Path Selection & Dashboard Integration Tests");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  PASS: [${total}] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  FAIL: [${total}] ${name}`);
      console.error("  ", err.message || err);
    }
  }

  // 1. Career catalog endpoint
  await test("GET /api/career/paths returns active paths grouped by category", async () => {
    const res = await request("GET", "/api/career/paths");
    assert.strictEqual(res.status, 200, "Should return HTTP 200");
    assert.strictEqual(res.body.success, true, "Body success should be true");
    assert.ok(res.body.total >= 36, `Expected at least 36 career paths, got ${res.body.total}`);
    assert.ok(Array.isArray(res.body.categories), "Expected categories array");
    assert.ok(res.body.categories.length >= 10, "Expected at least 10 categories");

    const swePath = res.body.paths.find((p) => p.id === "swe_fullstack");
    assert.ok(swePath, "swe_fullstack path should be present");
    assert.strictEqual(swePath.category, "Software & Tech");
    assert.ok(swePath.typical_skills.length >= 3, "Should have typical skills");
  });

  // 2. Reject 4 selections (Max 3 constraint)
  await test("POST /api/user/career-paths rejects 4 selections with HTTP 400", async () => {
    const res = await request("POST", "/api/user/career-paths", {
      userId: TEST_USER_ID,
      selectedPathIds: ["swe_fullstack", "data_scientist", "uiux_designer", "product_manager"],
      primaryPathId: "swe_fullstack",
    });
    assert.strictEqual(res.status, 400, "Should return HTTP 400 on 4 paths");
    assert.strictEqual(res.body.success, false);
    assert.ok(
      res.body.error.includes("up to 3 career paths"),
      `Expected error about max 3, got: ${res.body.error}`
    );
  });

  // 3. Reject empty selection
  await test("POST /api/user/career-paths rejects empty selection with HTTP 400", async () => {
    const res = await request("POST", "/api/user/career-paths", {
      userId: TEST_USER_ID,
      selectedPathIds: [],
      primaryPathId: "swe_fullstack",
    });
    assert.strictEqual(res.status, 400, "Should return HTTP 400 on empty selection");
    assert.strictEqual(res.body.success, false);
  });

  // 4. Reject primary path not in selectedPathIds
  await test("POST /api/user/career-paths rejects primaryPathId not in selectedPathIds", async () => {
    const res = await request("POST", "/api/user/career-paths", {
      userId: TEST_USER_ID,
      selectedPathIds: ["swe_fullstack", "swe_backend"],
      primaryPathId: "investment_banking",
    });
    assert.strictEqual(res.status, 400, "Should return HTTP 400 when primary not selected");
    assert.strictEqual(res.body.success, false);
  });

  // 5. Reject invalid/non-existent career path ID
  await test("POST /api/user/career-paths rejects non-existent career path ID", async () => {
    const res = await request("POST", "/api/user/career-paths", {
      userId: TEST_USER_ID,
      selectedPathIds: ["swe_fullstack", "non_existent_path_xyz"],
      primaryPathId: "swe_fullstack",
    });
    assert.strictEqual(res.status, 400, "Should return HTTP 400 for invalid path ID");
    assert.strictEqual(res.body.success, false);
  });

  // 6. Valid selection (1 primary + 2 secondary = 3 paths)
  await test("POST /api/user/career-paths saves 1 primary + 2 secondary paths and syncs target_role", async () => {
    const res = await request("POST", "/api/user/career-paths", {
      userId: TEST_USER_ID,
      selectedPathIds: ["swe_fullstack", "ai_ml_engineer", "cloud_devops"],
      primaryPathId: "swe_fullstack",
    });
    assert.strictEqual(res.status, 200, "Should return HTTP 200");
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.targetRole, "Full Stack Software Engineer");
    assert.ok(res.body.widgetMap, "Should return mapped widget priority");
    assert.ok(res.body.widgetMap.priority_widgets.includes("continue_dsa"), "Should have continue_dsa priority");

    // Verify in database directly
    const dbClient = await pool.connect();
    try {
      const userPaths = await dbClient.query(
        "SELECT career_path_id, is_primary FROM public.user_career_paths WHERE user_id = $1 ORDER BY is_primary DESC;",
        [TEST_USER_ID]
      );
      assert.strictEqual(userPaths.rows.length, 3, "Database should have 3 user_career_paths records");
      assert.strictEqual(userPaths.rows[0].career_path_id, "swe_fullstack");
      assert.strictEqual(userPaths.rows[0].is_primary, true);

      const profileRes = await dbClient.query(
        "SELECT target_role FROM public.profiles WHERE id = $1;",
        [TEST_USER_ID]
      );
      assert.strictEqual(
        profileRes.rows[0].target_role,
        "Full Stack Software Engineer",
        "profiles.target_role must sync with primary path"
      );
    } finally {
      dbClient.release();
    }
  });

  // 7. 1-Click "Other / Not sure yet" path
  await test("POST /api/user/career-paths supports 1-click 'other_exploring' path", async () => {
    const res = await request("POST", "/api/user/career-paths", {
      userId: TEST_USER_ID,
      selectedPathIds: ["other_exploring"],
      primaryPathId: "other_exploring",
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.targetRole, "Other / Not Sure Yet");
    assert.ok(
      res.body.widgetMap.priority_widgets.includes("daily_practice_sprint"),
      "Exploratory path should prioritize daily_practice_sprint"
    );
  });

  // 8. GET /api/user/career-paths retrieves saved primary path & widget configuration
  await test("GET /api/user/career-paths retrieves user selections and widget map", async () => {
    // Re-save tech path
    await request("POST", "/api/user/career-paths", {
      userId: TEST_USER_ID,
      selectedPathIds: ["swe_backend", "swe_frontend"],
      primaryPathId: "swe_backend",
    });

    const res = await request("GET", `/api/user/career-paths?userId=${TEST_USER_ID}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.selectedPaths.length, 2);
    assert.strictEqual(res.body.primaryPath.career_path_id, "swe_backend");
    assert.strictEqual(res.body.primaryPath.name, "Backend Systems Engineer");
    assert.ok(Array.isArray(res.body.widgetMap.priority_widgets));
  });

  console.log(`\nResults: ${passed}/${total} tests passed (${Math.round((passed / total) * 100)}%)`);

  await pool.end();
  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
