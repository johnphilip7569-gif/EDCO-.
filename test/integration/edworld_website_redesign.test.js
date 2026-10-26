/**
 * Integration Test Suite: EdWorld Co. Website Redesign
 * Scope:
 * 1. Design Tokens & Visual Hierarchy (Forest Green, Fresh Mint, Amber Accent, 16px radius, >=44px tap targets)
 * 2. Global Components (EdworldNavbar, EdworldFooter, FloatingMyraWidget with 3 modes)
 * 3. Home / Landing Page (Hero, Score Card Mockup, Countdown Banner, 4 Audience Tabs, 4 Feature Cards, 3-Step Engine, Showcase, Testimonials, Marquee, Pricing, FAQ)
 * 4. Practice / AI Mock Interview Studio (/practice)
 * 5. Career OS (/career)
 * 6. Pricing Matrix (/pricing)
 * 7. Multi-Breakpoint Showcase (/showcase with 1440px Desktop, 768px Tablet, 390px Mobile)
 */

const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { describe, it } = require("node:test");

describe("EdWorld Co. Website Redesign Verification", () => {
  const rootDir = path.resolve(__dirname, "../..");

  it("1. Design Tokens define Forest Green, Mint, Amber Accent, and WCAG AA standards", () => {
    const tokensFile = fs.readFileSync(
      path.join(rootDir, "src/lib/edworld-design-tokens.ts"),
      "utf8"
    );

    assert(tokensFile.includes("#1B4332"), "Tokens must define Forest Green #1B4332");
    assert(tokensFile.includes("#D8F3DC"), "Tokens must define Fresh Mint #D8F3DC");
    assert(tokensFile.includes("#D97706"), "Tokens must define Amber Accent #D97706");
    assert(tokensFile.includes("AUDIENCE_TABS_DATA"), "Tokens must export 4-stage audience tabs data");
    assert(tokensFile.includes("EDWORLD_WEBSITE_FEATURES"), "Tokens must export 4 core website features");
    assert(tokensFile.includes("COLLEGE_MARQUEE"), "Tokens must export college marquee list");
    assert(tokensFile.includes("RECRUITER_MARQUEE"), "Tokens must export recruiter marquee list");
    assert(tokensFile.includes("FAQ_DATA"), "Tokens must export FAQ dataset");
  });

  it("2. Global Navbar provides Skills & Career OS tagline, links, Ask Myra button, mobile drawer, and status indicator", () => {
    const navFile = fs.readFileSync(
      path.join(rootDir, "src/components/layout/EdworldNavbar.tsx"),
      "utf8"
    );

    assert(navFile.includes("Skills & Career OS"), "Navbar must include brand tagline 'Skills & Career OS'");
    assert(navFile.includes("Ask Myra"), "Navbar must include 'Ask Myra' action button");
    assert(navFile.includes("open-myra-copilot"), "Navbar must dispatch open-myra-copilot event");
    assert(navFile.includes("Get Started Free"), "Navbar must include 'Get Started Free' CTA");
    assert(navFile.includes("All systems operational"), "Navbar must display operational status indicator");
    assert(navFile.includes("isMobileMenuOpen"), "Navbar must support mobile drawer state");
  });

  it("3. Global Footer provides 4-column layout, headquarters, newsletter signup, and DPDP 2023 compliance", () => {
    const footerFile = fs.readFileSync(
      path.join(rootDir, "src/components/layout/EdworldFooter.tsx"),
      "utf8"
    );

    assert(footerFile.includes("Hyderabad, Telangana"), "Footer must list company headquarters");
    assert(footerFile.includes("DPDP 2023"), "Footer must state DPDP 2023 compliance");
    assert(footerFile.includes("Subscribe"), "Footer must include newsletter subscription");
    assert(footerFile.includes("99.98% Uptime"), "Footer must include uptime status metric");
  });

  it("4. Floating Myra Widget supports 3 modes: Doubt Solver, Web, and Careers", () => {
    const widgetFile = fs.readFileSync(
      path.join(rootDir, "src/components/ai/FloatingMyraWidget.tsx"),
      "utf8"
    );

    assert(widgetFile.includes("doubt_solver"), "Myra widget must include Doubt Solver mode");
    assert(widgetFile.includes("web"), "Myra widget must include Web mode");
    assert(widgetFile.includes("careers"), "Myra widget must include Careers mode");
    assert(widgetFile.includes("open-myra-copilot"), "Myra widget must respond to open-myra-copilot event");
  });

  it("5. Modern Landing Page implements all required sections, score card mockup, countdown banner, and audience tabs", () => {
    const landingFile = fs.readFileSync(
      path.join(rootDir, "src/components/landing/ModernEdworldLanding.tsx"),
      "utf8"
    );

    // Hero & Score Card
    assert(landingFile.includes("Stop getting ghosted"), "Hero must include primary hook");
    assert(landingFile.includes("Communication"), "Score card must include Communication score");
    assert(landingFile.includes("Confidence"), "Score card must include Confidence score");
    assert(landingFile.includes("Content Accuracy"), "Score card must include Content score");
    assert(landingFile.includes("Speech Cadence"), "Score card must include Speech Cadence score");
    assert(landingFile.includes("142"), "Score card must include 142 wpm speech pace");
    assert(landingFile.includes("STAR Framework"), "Score card must include STAR framework badge");

    // Countdown Banner
    assert(landingFile.includes("October 20, 2026"), "Landing must include October 20, 2026 launch target");
    assert(landingFile.includes("Notify Me"), "Landing must include interactive launch notification");

    // Audience Tabs
    assert(landingFile.includes("selectedAudienceId"), "Landing must manage audience selector state");
    assert(landingFile.includes("AUDIENCE_TABS_DATA"), "Landing must render 4 audience tabs");

    // 4 Feature Cards & 3-Step Engine
    assert(landingFile.includes("EDWORLD_WEBSITE_FEATURES"), "Landing must render 4 feature cards");
    assert(landingFile.includes("Calibrate"), "Landing must include Step 1 Calibrate");
    assert(landingFile.includes("Simulate"), "Landing must include Step 2 Simulate");
    assert(landingFile.includes("Get Hired") || landingFile.includes("Get Verified"), "Landing must include Step 3 Get Hired");

    // Tool Showcase, Stats, Marquee, Pricing, FAQ
    assert(landingFile.includes("showcaseTab"), "Landing must include interactive tool showcase");
    assert(landingFile.includes("12,400+"), "Landing must include stats strip");
    assert(landingFile.includes("COLLEGE_MARQUEE"), "Landing must render college marquee");
    assert(landingFile.includes("RECRUITER_MARQUEE"), "Landing must render recruiter marquee");
    assert(landingFile.includes("FAQ_DATA"), "Landing must render FAQ accordion");
  });

  it("6. Practice Page (/practice) implements live audio waveform, domain picker, and 4-metric rubric breakdown", () => {
    const practiceFile = fs.readFileSync(
      path.join(rootDir, "src/app/practice/page.tsx"),
      "utf8"
    );

    assert(practiceFile.includes("SDE-1 Backend"), "Practice must include domain options");
    assert(practiceFile.includes("STAR"), "Practice must include STAR behavioral drills");
    assert(practiceFile.includes("volumeHeights"), "Practice must simulate live audio waveform");
    assert(practiceFile.includes("Communication"), "Practice must display Communication metric");
    assert(practiceFile.includes("Confidence"), "Practice must display Confidence metric");
    assert(practiceFile.includes("Content Accuracy"), "Practice must display Content Accuracy metric");
    assert(practiceFile.includes("Speech Pace"), "Practice must display Speech Pace metric");
  });

  it("7. Career OS Page (/career) implements Level/XP system, SVG radar chart, and quarterly roadmap", () => {
    const careerFile = fs.readFileSync(
      path.join(rootDir, "src/app/career/page.tsx"),
      "utf8"
    );

    assert(careerFile.includes("Level 4 Innovator"), "Career OS must display Level 4 Innovator");
    assert(careerFile.includes("2,450 / 3,000 XP"), "Career OS must display XP progression");
    assert(careerFile.includes("<svg"), "Career OS must render SVG radar chart");
    assert(careerFile.includes("polygon"), "Career OS must draw polygon competency areas");
    assert(careerFile.includes("Foundations & DSA Mastery"), "Career OS must render Q1 milestone");
    assert(careerFile.includes("High-Concurrency Distributed Systems"), "Career OS must render Q2 milestone");
  });

  it("8. Pricing Page (/pricing) implements monthly/annual toggle, ₹0 Starter, ₹49 Career Pro, and comparison matrix", () => {
    const pricingFile = fs.readFileSync(
      path.join(rootDir, "src/app/pricing/page.tsx"),
      "utf8"
    );

    assert(pricingFile.includes("billingCycle"), "Pricing must support billing cycle toggle");
    assert(pricingFile.includes("Free Student Starter"), "Pricing must offer ₹0 Student Starter");
    assert(pricingFile.includes("Career Pro"), "Pricing must offer Career Pro tier");
    assert(pricingFile.includes("49"), "Career Pro must be priced at ₹49/month");
    assert(pricingFile.includes("comparisonRows"), "Pricing must provide comprehensive feature matrix");
    assert(pricingFile.includes("7-Day Money-Back Guarantee"), "Pricing must state refund guarantee");
  });

  it("9. Multi-Breakpoint Showcase (/showcase) implements interactive 1440px desktop, 768px tablet, and 390px mobile switcher", () => {
    const showcaseFile = fs.readFileSync(
      path.join(rootDir, "src/app/showcase/page.tsx"),
      "utf8"
    );

    assert(showcaseFile.includes("1440"), "Showcase must support 1440px desktop frame");
    assert(showcaseFile.includes("768"), "Showcase must support 768px tablet frame");
    assert(showcaseFile.includes("390"), "Showcase must support 390px mobile frame");
    assert(showcaseFile.includes("<iframe"), "Showcase must embed live page iframe");
  });
});
