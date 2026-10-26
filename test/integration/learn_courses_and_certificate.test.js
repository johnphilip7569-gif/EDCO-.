const assert = require("assert");
const { Client } = require("pg");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const DB_URL = "postgresql://postgres.wgyscapdywroefsjenno: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@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres";

async function runTests() {
  console.log("=================================================");
  console.log(" Learn Academy (learn.edworld.co.in) Test Suite");
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

  // 1. Verify Database Schema and Seeded Multi-Field Catalog
  let dbClient;
  await check("PostgreSQL database contains courses across all major fields", async () => {
    dbClient = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
    await dbClient.connect();

    const res = await dbClient.query("SELECT COUNT(*) FROM public.courses WHERE is_active = true");
    const count = parseInt(res.rows[0].count, 10);
    assert.ok(count >= 10, `Expected at least 10 courses, found ${count}`);

    const categoriesRes = await dbClient.query("SELECT DISTINCT category FROM public.courses");
    const categories = categoriesRes.rows.map(r => r.category);
    assert.ok(categories.includes("Tech & AI"), "Tech & AI category must exist");
    assert.ok(categories.includes("Business & Management"), "Business category must exist");
    assert.ok(categories.includes("Finance & Accounting"), "Finance category must exist");
    assert.ok(categories.includes("Core Engineering"), "Core Engineering category must exist");
    assert.ok(categories.includes("Healthcare & Science"), "Healthcare category must exist");
    assert.ok(categories.includes("Law & Governance"), "Law category must exist");
    assert.ok(categories.includes("Entrepreneurship"), "Entrepreneurship category must exist");
  });

  // 2. GET /api/learn/courses returns catalog
  await check("GET /api/learn/courses returns active courses with required metadata", async () => {
    const res = await fetch(`${BASE_URL}/api/learn/courses`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.courses), "courses must be an array");
    assert.ok(data.courses.length >= 10, "Should contain at least 10 courses");

    const sample = data.courses[0];
    assert.ok(sample.slug, "Course must have slug");
    assert.ok(sample.title, "Course must have title");
    assert.ok(sample.category, "Course must have category");
    assert.ok(Array.isArray(sample.skills), "Course must have skills");
    assert.ok(sample.phases_count > 0, "Course must have phases count");
  });

  // 3. Category and search filtering
  await check("GET /api/learn/courses filters by category and search", async () => {
    const catRes = await fetch(`${BASE_URL}/api/learn/courses?category=Finance%20%26%20Accounting`);
    const catData = await catRes.json();
    assert.ok(catData.courses.length > 0, "Must return finance courses");
    assert.ok(catData.courses.every(c => c.category === "Finance & Accounting"), "Must only match category");

    const searchRes = await fetch(`${BASE_URL}/api/learn/courses?search=bioinformatics`);
    const searchData = await searchRes.json();
    assert.ok(searchData.courses.length > 0, "Must return bioinformatics course");
    assert.ok(searchData.courses[0].slug.includes("bioinformatics"), "Must match bioinformatics slug");
  });

  // 4. GET /api/learn/courses/[slug] details & sanitized quiz
  await check("GET /api/learn/courses/[slug] returns roadmap, resources, and sanitized quiz", async () => {
    const res = await fetch(`${BASE_URL}/api/learn/courses/fullstack-nextjs-typescript`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.course, "course detail must exist");
    assert.ok(Array.isArray(data.course.roadmap), "roadmap must be array");
    assert.ok(Array.isArray(data.course.resources), "resources must be array");
    assert.ok(data.course.quiz, "quiz must exist");
    assert.strictEqual(data.course.quiz.passingScore, 75);

    // Verify correct_index is NOT leaked to client
    const sampleQ = data.course.quiz.questions[0];
    assert.strictEqual(sampleQ.correct_index, undefined, "correct_index must not be exposed to client");
  });

  // 5. POST /api/learn/quiz/submit with failing answers
  await check("POST /api/learn/quiz/submit rejects failing score with diagnostic review", async () => {
    const res = await fetch(`${BASE_URL}/api/learn/quiz/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "fullstack-nextjs-typescript",
        recipientName: "Test Candidate",
        answers: {
          q1: 0, // incorrect
          q2: 0, // incorrect
          q3: 0, // correct
          q4: 0, // incorrect
        },
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.passed, false);
    assert.ok(data.scorePercentage < 75, "Score percentage must be under passing threshold");
    assert.strictEqual(data.certificate, null, "No certificate should be issued on failure");
    assert.ok(Array.isArray(data.review), "Review diagnostics should be returned");
  });

  // 6. POST /api/learn/quiz/submit with passing score issues verifiable certificate
  let issuedCertCode = "";
  await check("POST /api/learn/quiz/submit issues verifiable certificate on 100% score", async () => {
    const res = await fetch(`${BASE_URL}/api/learn/quiz/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "fullstack-nextjs-typescript",
        recipientName: "Adarsh Kolluru",
        answers: {
          q1: 1, // correct: React Server Components reduce bundle size
          q2: 1, // correct: "use server"
          q3: 0, // correct: Connection pooler prevents exhausting max_connections
          q4: 1, // correct: SameSite cookie and Origin verification
        },
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.passed, true);
    assert.strictEqual(data.scorePercentage, 100);
    assert.ok(data.certificate, "Certificate must be issued");
    assert.ok(data.certificate.certificate_code.startsWith("EDW-CERT-2026-"), "Must have standard code format");
    assert.ok(data.certificate.verification_hash, "Must have SHA-256 verification hash");
    assert.strictEqual(data.certificate.recipient_name, "Adarsh Kolluru");
    issuedCertCode = data.certificate.certificate_code;
  });

  // 7. GET /api/certificates/[id] verifies authentic credential
  await check("GET /api/certificates/[id] verifies authentic credential", async () => {
    assert.ok(issuedCertCode, "Previous test should have issued certificate");
    const res = await fetch(`${BASE_URL}/api/certificates/${issuedCertCode}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.verified, true);
    assert.strictEqual(data.certificate.certificateCode, issuedCertCode);
    assert.strictEqual(data.certificate.recipientName, "Adarsh Kolluru");
    assert.strictEqual(data.certificate.scorePercentage, 100);
    assert.ok(data.certificate.verificationHash, "Verification hash must be present");
  });

  // 8. Subdomain host rewriting check (learn.localhost)
  await check("Subdomain Host header 'learn.localhost:3000' successfully resolves /learn", async () => {
    const res = await fetch(`${BASE_URL}/`, {
      headers: {
        "x-forwarded-host": "learn.localhost:3000",
      },
    });
    assert.strictEqual(res.status, 200, `Expected 200 from subdomain rewrite, got ${res.status}`);
    const html = await res.text();
    assert.ok(html.includes("EdWorld Learn") || html.includes("learn.edworld.co.in"), "Must render Learn academy page");
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
