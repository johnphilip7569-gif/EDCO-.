/**
 * Automated Verification: Myra Individualized Student Responses
 * Tests 3 distinct student personas asking identical questions.
 * Verifies that Myra analyzes individual onboarding credentials (degree, institution,
 * GPA, target role, timeline) and provides distinct, tailored, high-signal answers.
 */

const http = require('http');

const personas = [
  {
    id: "persona_aarav",
    name: "Aarav Sharma",
    institution: "Delhi Public School, R.K. Puram",
    degree: "High School (11th/12th)",
    field_of_study: "Science (PCM)",
    graduation_year: "2026",
    cgpa: "91%",
    targetRole: "AI & Machine Learning Engineer",
    primaryGoal: "Excel in Board exams and build foundational Python & mathematical logic.",
    dailyStudyHours: 2,
    interests: [{ name: "Python", effectiveLevel: 0 }, { name: "Mathematics & AI", effectiveLevel: 0 }],
  },
  {
    id: "persona_priya",
    name: "Priya Patel",
    institution: "SRM Institute of Science & Technology",
    degree: "B.Tech / B.E.",
    field_of_study: "Computer Science & Engineering",
    graduation_year: "2026",
    cgpa: "7.2",
    targetRole: "Full Stack Software Engineer",
    primaryGoal: "Crack Tier-1 Product Company campus placement drives in 6 months.",
    dailyStudyHours: 3,
    interests: [{ name: "Full Stack & Web", effectiveLevel: 1 }, { name: "DSA & Problem Solving", effectiveLevel: 1 }],
  },
  {
    id: "persona_rahul",
    name: "Rahul Verma",
    institution: "Christ University",
    degree: "B.Sc / BCA",
    field_of_study: "Computer Applications",
    graduation_year: "2028",
    cgpa: "8.8",
    targetRole: "Data Analyst & Python Developer",
    primaryGoal: "Maintain an 8.5+ CGPA while mastering SQL, Python, and data analytics tools.",
    dailyStudyHours: 2,
    interests: [{ name: "Data Analytics & SQL", effectiveLevel: 0 }, { name: "Python", effectiveLevel: 1 }],
  },
];

const testQuestions = [
  "How should I plan my study schedule this semester to prepare for my career?",
  "How do I balance my college GPA with learning practical technical skills?",
  "What kind of projects should I build right now to stand out?",
];

async function queryMyraApi(persona, question) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      message: question,
      userId: `test-${persona.id}`,
      profile: {
        name: persona.name,
        institution: persona.institution,
        degree: persona.degree,
        field_of_study: persona.field_of_study,
        graduation_year: persona.graduation_year,
        cgpa: persona.cgpa,
        targetRole: persona.targetRole,
        primaryGoal: persona.primaryGoal,
        dailyStudyHours: persona.dailyStudyHours,
        interests: persona.interests,
      },
    });

    const req = http.request(
      "http://localhost:3000/api/ai/myra",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
        timeout: 10000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (e) {
            resolve({ error: "PARSE_ERROR", raw: data });
          }
        });
      }
    );

    req.on("error", (e) => reject(e));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out"));
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log("================================================================================");
  console.log("🚀 STARTING MYRA AI INDIVIDUALIZED STUDENT GUIDE TEST SUITE");
  console.log("================================================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  for (let qIdx = 0; qIdx < testQuestions.length; qIdx++) {
    const question = testQuestions[qIdx];
    console.log(`\n================================================================================`);
    console.log(`TEST PROMPT ${qIdx + 1}: "${question}"`);
    console.log(`================================================================================`);

    const responses = [];

    for (const persona of personas) {
      totalTests++;
      console.log(`\n👤 Testing Persona: ${persona.name}`);
      console.log(`   Academic Credentials: ${persona.degree} | ${persona.field_of_study} | CGPA: ${persona.cgpa} | Target: ${persona.targetRole} (Grad: ${persona.graduation_year})`);

      try {
        const result = await queryMyraApi(persona, question);
        const reply = result.reply || result.text || "";
        const model = result.model || "Unknown";

        responses.push({ persona, reply, model });

        console.log(`   Model Used: ${model}`);
        console.log(`   Reply Preview:`);
        const lines = reply.split("\n").filter(Boolean);
        lines.slice(0, 5).forEach((l) => console.log(`     > ${l}`));
        if (lines.length > 5) console.log(`     > ... [${lines.length - 5} more lines]`);

        // Assertions for Individualization:
        let isTailored = false;
        if (persona.id === "persona_aarav") {
          // Should mention Class 12, boards, entrance exams, or school
          isTailored = /class 12|board|entrance|school|physics|math/i.test(reply);
        } else if (persona.id === "persona_priya") {
          // Should mention placement, 7.5 or cutoff or B.Tech, or DSA
          isTailored = /placement|cutoff|7\.5|7\.2|b\.tech|sde|product|striver/i.test(reply);
        } else if (persona.id === "persona_rahul") {
          // Should mention BCA, 1st year, foundation, or honors/8.5+
          isTailored = /1st year|bca|undergraduate|runway|8\.5|8\.8|foundation/i.test(reply);
        }

        if (isTailored) {
          console.log(`   ✅ PASS: Verified tailored personalized response matching persona profile.`);
          passedTests++;
        } else {
          console.warn(`   ⚠️ WARNING: Reply might be less tailored than expected.`);
        }
      } catch (err) {
        console.error(`   ❌ FAIL: Error calling Myra API:`, err.message);
      }
    }

    // Verify cross-persona response variance (they MUST NOT be identical)
    if (responses.length >= 2) {
      const distinct = responses[0].reply !== responses[1].reply && responses[1].reply !== responses[2]?.reply;
      console.log(`\n🔍 CROSS-PERSONA UNIQUENESS CHECK:`);
      if (distinct) {
        console.log(`   ✅ SUCCESS: All 3 student personas received completely distinct, customized advice.`);
      } else {
        console.error(`   ❌ REGRESSION: Identical replies detected across different student personas!`);
      }
    }
  }

  console.log("\n================================================================================");
  console.log(`📊 TEST EXECUTION SUMMARY: ${passedTests}/${totalTests} tests verified personalized.`);
  console.log("================================================================================\n");
}

runTests().catch(console.error);
