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
  console.log(" Featured Hackathons & Events Integration Tests");
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

  // 1. Catalog Endpoint
  await test("GET /api/events returns active competitions with required metadata", async () => {
    const res = await request("GET", "/api/events");
    assert.strictEqual(res.status, 200, "Should return HTTP 200");
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.total >= 6, `Expected at least 6 events, got ${res.body.total}`);
    assert.ok(Array.isArray(res.body.events));

    const hdfc = res.body.events.find((e) => e.title.includes("HDFC"));
    assert.ok(hdfc, "HDFC Life's Aspire 3.0 must be present");
    assert.strictEqual(hdfc.organizer, "HDFC Life");
    assert.strictEqual(hdfc.prize_pool, "₹1.8 Lakhs");
    assert.strictEqual(hdfc.mode, "Online");
    assert.strictEqual(hdfc.is_free, true);

    const eurogrip = res.body.events.find((e) => e.title.includes("Eurogrip"));
    assert.ok(eurogrip, "Eurogrip TORQ Challenge 4.0 must be present");
    assert.strictEqual(eurogrip.prize_pool, "₹3 Lakhs + PPIs");

    const djx = res.body.events.find((e) => e.title.includes("DJXHack"));
    assert.ok(djx, "DJXHack Residency must be present");
  });

  // 2. Category filtering
  await test("GET /api/events?category=Case+Competition filters accurately", async () => {
    const res = await request("GET", "/api/events?category=Case+Competition");
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.events.length >= 2);
    for (const event of res.body.events) {
      assert.strictEqual(event.category, "Case Competition");
    }
  });

  // 3. Hackathon category filtering
  await test("GET /api/events?category=Hackathon filters hackathons", async () => {
    const res = await request("GET", "/api/events?category=Hackathon");
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.events.length >= 2);
    for (const event of res.body.events) {
      assert.strictEqual(event.category, "Hackathon");
    }
  });

  // 4. Search query filtering
  await test("GET /api/events?search=Flipkart returns matching challenge", async () => {
    const res = await request("GET", "/api/events?search=Flipkart");
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.events.length >= 1);
    assert.ok(res.body.events[0].title.includes("Flipkart"));
  });

  // 5. Bookmark toggle - Add bookmark
  const testEventId = "10000000-0000-0000-0000-000000000001";
  await test("POST /api/events/save bookmarks an event for user", async () => {
    // Ensure clean initial state
    const dbClient = await pool.connect();
    try {
      await dbClient.query("DELETE FROM public.user_saved_events WHERE user_id = $1 AND event_id = $2;", [TEST_USER_ID, testEventId]);
    } finally {
      dbClient.release();
    }

    const res = await request("POST", "/api/events/save", {
      userId: TEST_USER_ID,
      eventId: testEventId,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.is_saved, true, "Should report is_saved: true");

    // Verify in database
    const checkClient = await pool.connect();
    try {
      const dbRes = await checkClient.query(
        "SELECT id FROM public.user_saved_events WHERE user_id = $1 AND event_id = $2;",
        [TEST_USER_ID, testEventId]
      );
      assert.strictEqual(dbRes.rows.length, 1, "Bookmark record must exist in DB");
    } finally {
      checkClient.release();
    }
  });

  // 6. User-scoped GET reflects is_saved: true
  await test("GET /api/events?userId=... annotates bookmarked event with is_saved = true", async () => {
    const res = await request("GET", `/api/events?userId=${TEST_USER_ID}`);
    assert.strictEqual(res.status, 200);
    const targetEvent = res.body.events.find((e) => e.id === testEventId);
    assert.ok(targetEvent, "Target event should be returned");
    assert.strictEqual(targetEvent.is_saved, true, "is_saved must be true for bookmarked event");
  });

  // 7. Bookmark toggle - Remove bookmark
  await test("POST /api/events/save unbookmarks when called again", async () => {
    const res = await request("POST", "/api/events/save", {
      userId: TEST_USER_ID,
      eventId: testEventId,
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.is_saved, false, "Should report is_saved: false");

    // Verify removed from database
    const checkClient = await pool.connect();
    try {
      const dbRes = await checkClient.query(
        "SELECT id FROM public.user_saved_events WHERE user_id = $1 AND event_id = $2;",
        [TEST_USER_ID, testEventId]
      );
      assert.strictEqual(dbRes.rows.length, 0, "Bookmark record must be deleted");
    } finally {
      checkClient.release();
    }
  });

  // 8. Rejection when eventId is missing
  await test("POST /api/events/save rejects missing eventId with HTTP 400", async () => {
    const res = await request("POST", "/api/events/save", {
      userId: TEST_USER_ID,
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
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
