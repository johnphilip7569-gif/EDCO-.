/**
 * Integration Test: GenZ Landing, Origami Paper Menu, Internal Role Purge,
 * Resume-First Interview Flow & Anti-Cheating Proctoring Suite.
 */

const fs = require("fs");
const path = require("path");
const assert = require("assert");

describe("Feature 28: GenZ Landing, Origami Menu, Resume-First Interview & Proctoring", () => {
  const rootDir = path.resolve(__dirname, "../..");

  it("1. Verifies Landing Page contains high-energy GenZ copy and capabilities", () => {
    const landingPath = path.join(rootDir, "src/components/landing/ModernEdworldLanding.tsx");
    assert(fs.existsSync(landingPath), "ModernEdworldLanding.tsx must exist");
    const content = fs.readFileSync(landingPath, "utf8");

    // GenZ Hero
    assert(content.includes("Stop getting ghosted. Lock in your engineering offer."), "Hero headline must match GenZ copy");
    assert(content.includes("Lock In Before Placements"), "Must include GenZ energy pill");
    assert(content.includes("Cook your technical rounds before they cook you"), "Must include punchy copy");

    // Feature Badges
    assert(content.includes("ATS Boss Fight Resume Maker"), "Must have ATS Boss Fight card");
    assert(content.includes("Production Chaos Labs (EdFix)"), "Must have Production Chaos Labs card");
    assert(content.includes("Vetted Tech Jobs & Internships"), "Must have Vetted Tech Jobs card");
    assert(content.includes("Builder Network & Peer Clout"), "Must have Builder Network card");
  });

  it("2. Verifies FloatingNav has bottom-left floating circle button and origami paper unfolding", () => {
    const navPath = path.join(rootDir, "src/components/layout/FloatingNav.tsx");
    assert(fs.existsSync(navPath), "FloatingNav.tsx must exist");
    const content = fs.readFileSync(navPath, "utf8");

    // Bottom-left position
    assert(content.includes("bottom-6 left-6"), "Menu trigger must be fixed at bottom-left");
    assert(content.includes("origamiUnfold"), "Must implement origami unfold animation keyframes");
    assert(content.includes("origin-bottom-left"), "Paper menu must expand from bottom-left");
  });

  it("3. Verifies internal founder, employee, and hr pages are completely purged from client navigation", () => {
    const floatingNav = fs.readFileSync(path.join(rootDir, "src/components/layout/FloatingNav.tsx"), "utf8");
    assert(!floatingNav.includes('href: "/founder"'), "FloatingNav must not link to /founder");
    assert(!floatingNav.includes('href: "/employee"'), "FloatingNav must not link to /employee");
    assert(!floatingNav.includes('href: "/hr"'), "FloatingNav must not link to /hr");

    const appSidebar = fs.readFileSync(path.join(rootDir, "src/components/layout/AppSidebar.tsx"), "utf8");
    assert(!appSidebar.includes('href: "/founder"'), "AppSidebar must not link to /founder");
    assert(!appSidebar.includes('href: "/employee"'), "AppSidebar must not link to /employee");
    assert(!appSidebar.includes('href: "/hr"'), "AppSidebar must not link to /hr");

    const navbar = fs.readFileSync(path.join(rootDir, "src/components/navbar.tsx"), "utf8");
    assert(!navbar.includes('href: "/founder"'), "navbar must not link to /founder");
    assert(!navbar.includes('href: "/employee"'), "navbar must not link to /employee");
    assert(!navbar.includes('href: "/hr"'), "navbar must not link to /hr");
  });

  it("4. Verifies Resume-First JD-Calibrated Interview Flow", () => {
    const interviewCatPath = path.join(rootDir, "src/app/interviews/[category]/page.tsx");
    assert(fs.existsSync(interviewCatPath), "Interviews category page must exist");
    const catContent = fs.readFileSync(interviewCatPath, "utf8");

    // Step 1: Resume First
    assert(catContent.includes("Step 1: Your Active ATS Resume (Mandatory)"), "Step 1 must be Resume requirement");
    assert(catContent.includes("Build Your ATS Resume First") || catContent.includes("Build ATS Resume First"), "Must offer resume builder link");
    
    // Step 2: Target JD
    assert(catContent.includes("Step 2: Target Job Description (JD)"), "Step 2 must be Job Description");

    // Step 3: Calibrated Generation
    assert(catContent.includes("Step 3: Generate Questions & Launch"), "Step 3 must generate from Resume & JD");

    const hubPath = path.join(rootDir, "src/app/interviews/page.tsx");
    const hubContent = fs.readFileSync(hubPath, "utf8");
    assert(hubContent.includes("Resume-First Step Progression Banner"), "Hub page must include resume-first progression banner");
  });

  it("5. Verifies Anti-Cheating & Proctoring Suite (Anti-OCR canvas & tab-switch blocking)", () => {
    // AntiOcrQuestionCanvas exists and renders on HTML5 Canvas
    const canvasPath = path.join(rootDir, "src/components/proctoring/AntiOcrQuestionCanvas.tsx");
    assert(fs.existsSync(canvasPath), "AntiOcrQuestionCanvas.tsx must exist");
    const canvasContent = fs.readFileSync(canvasPath, "utf8");
    assert(canvasContent.includes("<canvas"), "Must render HTML5 canvas");
    assert(canvasContent.includes("antiOcrStrength"), "Must support anti-OCR settings");
    assert(canvasContent.includes("userSelect: \"none\"") || canvasContent.includes("select-none"), "Must disable text selection");

    // useExamProctoring hook exists and monitors events
    const proctorHookPath = path.join(rootDir, "src/hooks/useExamProctoring.ts");
    assert(fs.existsSync(proctorHookPath), "useExamProctoring.ts must exist");
    const hookContent = fs.readFileSync(proctorHookPath, "utf8");
    assert(hookContent.includes("visibilitychange"), "Must listen to visibilitychange for tab switching");
    assert(hookContent.includes("blur"), "Must listen to window blur");
    assert(hookContent.includes("requestFullscreen"), "Must enforce fullscreen mode");
    assert(hookContent.includes("maxViolations"), "Must support strike violation threshold");

    // Aptitude page integrates both
    const aptitudePath = path.join(rootDir, "src/app/aptitude/page.tsx");
    const aptitudeContent = fs.readFileSync(aptitudePath, "utf8");
    assert(aptitudeContent.includes("AntiOcrQuestionCanvas"), "Aptitude page must use AntiOcrQuestionCanvas");
    assert(aptitudeContent.includes("useExamProctoring"), "Aptitude page must use useExamProctoring");
    assert(aptitudeContent.includes("Lockdown Violation Detected") || aptitudeContent.includes("activeWarning"), "Aptitude page must have proctoring modal");

    // Interview page integrates proctoring
    const interviewCatPath = path.join(rootDir, "src/app/interviews/[category]/page.tsx");
    const interviewCatContent = fs.readFileSync(interviewCatPath, "utf8");
    assert(interviewCatContent.includes("useExamProctoring"), "Interview page must use useExamProctoring");
  });
});
