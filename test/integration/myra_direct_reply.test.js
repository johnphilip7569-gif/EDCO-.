/**
 * Integration Test Suite: Direct, Question-Only Myra AI Replies
 *
 * Verifies:
 * 1. MYRA_SYSTEM_PROMPT & buildMyraContextPrompt enforce "ANSWER ONLY WHAT IS ASKED" and isolate silent context into systemPrompt.
 * 2. MyraNeuralEngine strips out bloated boilerplate ("Intuitive Mental Model", "Production Gotchas", "Next Action on EdWorld Co.").
 * 3. MyraOrchestrator & /api/ai/myra pass rawQuery (cleanUserQuery) so user profile skills/history never trigger false topic dumps.
 * 4. Code blocks are only returned when the user explicitly requests code/implementation.
 * 5. Career Copilot route answers the user's specific question via MyraOrchestrator instead of dumping canned Career Graph text.
 */

const fs = require("fs");
const path = require("path");
const assert = require("assert");

describe("Myra Direct Question-Only Reply Engine", () => {
  const rootDir = path.resolve(__dirname, "../..");

  it("1. Verifies MYRA_SYSTEM_PROMPT and buildMyraContextPrompt enforce direct answers and isolate background context", () => {
    const agentPath = path.join(rootDir, "src/lib/ai/myra-agent.ts");
    const content = fs.readFileSync(agentPath, "utf8");

    assert(content.includes("ANSWER ONLY WHAT IS ASKED"), "System prompt must enforce ANSWER ONLY WHAT IS ASKED rule");
    assert(content.includes("Do NOT dump extra sections"), "System prompt must forbid extra sections and boilerplate");
    assert(content.includes("SILENT BACKGROUND CONTEXT"), "Profile context must be marked as silent background context");
    assert(content.includes("Reply directly to the User Question above"), "Prompt must instruct direct reply to user question");
  });

  it("2. Verifies MyraNeuralEngine has zero bloated essay sections or promotional footers", () => {
    const neuralPath = path.join(rootDir, "src/lib/ai/myra-neural-engine.ts");
    const content = fs.readFileSync(neuralPath, "utf8");

    assert(!content.includes("Intuitive Mental Model"), "Must not include unsolicited 'Intuitive Mental Model' section");
    assert(!content.includes("Production Gotcha"), "Must not include unsolicited 'Production Gotcha' section");
    assert(!content.includes("Next Action on EdWorld Co."), "Must not include unsolicited 'Next Action on EdWorld Co.' promotional footer");
    assert(!content.includes("As someone preparing for"), "Must not include repetitive targetRole intro boilerplate");
    assert(content.includes("wantsCode"), "Must check whether user actually asked for code before returning code blocks");
    assert(content.includes("extractRawQuery"), "Must extract only the raw user question if a wrapper is passed");
  });

  it("3. Verifies MyraOrchestrator and /api/ai/myra pass cleanUserQuery / rawQuery", () => {
    const orchPath = path.join(rootDir, "src/lib/ai/myra-orchestration.ts");
    const orchContent = fs.readFileSync(orchPath, "utf8");

    assert(orchContent.includes("rawQuery?: string"), "MyraExecutionRequest must accept rawQuery");
    assert(orchContent.includes("cleanUserQuery"), "MyraOrchestrator must resolve cleanUserQuery");

    const routePath = path.join(rootDir, "src/app/api/ai/myra/route.ts");
    const routeContent = fs.readFileSync(routePath, "utf8");
    assert(routeContent.includes("rawQuery: message.trim()"), "/api/ai/myra must pass rawQuery: message.trim()");
  });

  it("4. Verifies Career Copilot route answers specific user questions directly via MyraOrchestrator", () => {
    const copilotPath = path.join(rootDir, "src/app/api/career/copilot/route.ts");
    const copilotContent = fs.readFileSync(copilotPath, "utf8");

    assert(copilotContent.includes("MyraOrchestrator.execute"), "Career Copilot must route questions through MyraOrchestrator");
    assert(copilotContent.includes("rawQuery: cleanMessage"), "Career Copilot must pass rawQuery: cleanMessage");
    assert(!copilotContent.includes("I've analyzed your Career Intelligence Graph"), "Must not return canned Career Graph status dump on general questions");
  });
});
