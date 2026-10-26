const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres: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@db.wgyscapdywroefsjenno.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

// Transpile or load dsa-bank
async function main() {
  // Read TypeScript file and strip types or evaluate
  const fs = require("fs");
  const tsContent = fs.readFileSync("src/lib/dsa/dsa-bank.ts", "utf8");
  
  // Quick dynamic eval by transpiling TS to JS using typescript or regex
  const ts = require("typescript");
  const jsContent = ts.transpileModule(tsContent, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  
  const m = { exports: {} };
  const fn = new Function("module", "exports", jsContent);
  fn(m, m.exports);
  const { DSA_TOPICS, DSA_QUESTIONS } = m.exports;

  console.log(`Seeding ${DSA_TOPICS.length} topics and ${DSA_QUESTIONS.length} questions...`);

  for (const t of DSA_TOPICS) {
    await pool.query(
      `INSERT INTO public.dsa_topics (id, name, slug, tier, difficulty_level, interview_frequency, prerequisite_topic_ids, explainer_concept, explainer_why_it_matters, explainer_common_use, worked_example, visualizer_type, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         tier = EXCLUDED.tier,
         difficulty_level = EXCLUDED.difficulty_level,
         interview_frequency = EXCLUDED.interview_frequency,
         prerequisite_topic_ids = EXCLUDED.prerequisite_topic_ids,
         explainer_concept = EXCLUDED.explainer_concept,
         explainer_why_it_matters = EXCLUDED.explainer_why_it_matters,
         explainer_common_use = EXCLUDED.explainer_common_use,
         worked_example = EXCLUDED.worked_example,
         visualizer_type = EXCLUDED.visualizer_type,
         order_index = EXCLUDED.order_index`,
      [t.id, t.name, t.slug, t.tier, t.difficulty_level, t.interview_frequency, t.prerequisite_topic_ids, t.explainer_concept, t.explainer_why_it_matters, t.explainer_common_use, JSON.stringify(t.worked_example), t.visualizer_type, t.order_index]
    );
  }

  for (const q of DSA_QUESTIONS) {
    await pool.query(
      `INSERT INTO public.dsa_questions (id, topic_id, difficulty_level, question_type, question_text, code_snippet, options, correct_answer, explanation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         topic_id = EXCLUDED.topic_id,
         difficulty_level = EXCLUDED.difficulty_level,
         question_type = EXCLUDED.question_type,
         question_text = EXCLUDED.question_text,
         code_snippet = EXCLUDED.code_snippet,
         options = EXCLUDED.options,
         correct_answer = EXCLUDED.correct_answer,
         explanation = EXCLUDED.explanation`,
      [q.id, q.topic_id, q.difficulty_level, q.question_type, q.question_text, q.code_snippet || "", JSON.stringify(q.options), q.correct_answer, q.explanation]
    );
  }

  console.log("Database seeded successfully!");
  await pool.end();
}

main().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
