/**
 * Apple (iOS / iPadOS HIG) & Android (Material 3) Adaptive UI/UX & Multi-Device Sizing Test Suite
 * Verifies:
 * 1. Native shell viewportFit: "cover", dual themeColor, appleWebApp PWA metadata, and manifest shortcuts.
 * 2. Safe-area inset utilities (.safe-top, .safe-bottom, .pb-safe-dock), touch-target rules, and iOS 16px input zoom prevention in globals.css.
 * 3. FloatingNav.tsx: Mobile Thumb-Zone Quick-Dock, preserved Origami Paper Menu (bottom-6 left-6, origamiUnfold, origin-bottom-left), mobile Ask Myra trigger, and mutual modal coordination.
 * 4. MyraChatbot.tsx: Mobile-safe viewport sizing (w-[calc(100vw-1.5rem)], 100dvh) and close-myra-copilot synchronization.
 * 5. Feature-by-feature multi-device responsiveness across DSA Studio, Anti-OCR Canvases, Resume Studio (<1024px switcher), and Proctored Aptitude.
 */

const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { describe, it } = require("node:test");

describe("Apple (iOS/iPadOS) & Android Adaptive UI/UX & Multi-Device Responsiveness", () => {
  const rootDir = path.resolve(__dirname, "../..");

  it("1. Layout & PWA Manifest configure Apple iOS/iPadOS and Android native shell properties", () => {
    const layoutContent = fs.readFileSync(
      path.join(rootDir, "src/app/layout.tsx"),
      "utf8"
    );
    assert(
      layoutContent.includes('viewportFit: "cover"'),
      "layout.tsx must set viewportFit: cover for Apple Dynamic Island & Home Indicator safe areas"
    );
    assert(
      layoutContent.includes("appleWebApp:"),
      "layout.tsx must include appleWebApp metadata for iOS standalone web app support"
    );

    const manifestRaw = fs.readFileSync(
      path.join(rootDir, "public/manifest.json"),
      "utf8"
    );
    const manifest = JSON.parse(manifestRaw);
    assert.strictEqual(manifest.display, "standalone");
    assert.strictEqual(manifest.orientation, "any", "manifest must support any orientation for iPadOS Split View and foldables");
    assert(Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 4, "manifest must provide quick app shortcuts");
  });

  it("2. Global CSS provides safe-area inset classes, Apple/Android touch targets, and iOS input zoom prevention", () => {
    const cssContent = fs.readFileSync(
      path.join(rootDir, "src/app/globals.css"),
      "utf8"
    );
    assert(cssContent.includes(".safe-top"), "globals.css must define .safe-top");
    assert(cssContent.includes(".safe-bottom"), "globals.css must define .safe-bottom");
    assert(cssContent.includes(".touch-target"), "globals.css must define .touch-target (min 44x44px)");
    assert(
      cssContent.includes("font-size: 16px !important"),
      "globals.css must enforce 16px input font size on mobile (<640px) to prevent iOS Safari auto-zoom"
    );
  });

  it("3. FloatingNav & MyraChatbot provide thumb-zone dock, Origami unfold, and non-overlapping modal coordination", () => {
    const navContent = fs.readFileSync(
      path.join(rootDir, "src/components/layout/FloatingNav.tsx"),
      "utf8"
    );

    // Preserve Origami menu invariants
    assert(navContent.includes("bottom-6 left-6"), "FloatingNav must preserve bottom-left Origami trigger");
    assert(navContent.includes("origamiUnfold"), "FloatingNav must preserve origamiUnfold animation");
    assert(navContent.includes("origin-bottom-left"), "FloatingNav must preserve origin-bottom-left");

    // Mobile Thumb-Zone Quick Dock
    assert(
      navContent.includes("Mobile Quick Navigation Dock"),
      "FloatingNav must include the Apple/Android Mobile Thumb-Zone Quick Dock"
    );
    assert(
      navContent.includes("close-myra-copilot"),
      "FloatingNav must dispatch close-myra-copilot when Origami menu opens"
    );

    // Strictly exclude internal routes
    assert(!navContent.includes('href: "/founder"'));
    assert(!navContent.includes('href: "/employee"'));
    assert(!navContent.includes('href: "/hr"'));

    const myraContent = fs.readFileSync(
      path.join(rootDir, "src/components/ai/MyraChatbot.tsx"),
      "utf8"
    );
    assert(
      myraContent.includes("w-[calc(100vw-1.5rem)]"),
      "MyraChatbot must use responsive viewport width on compact 320px-430px phones"
    );
    assert(
      myraContent.includes("close-myra-copilot"),
      "MyraChatbot must listen for close-myra-copilot to prevent overlapping modals on mobile"
    );
  });

  it("4. Feature pages & Anti-OCR canvases adapt cleanly across compact mobile, tablet, and desktop", () => {
    const qCanvas = fs.readFileSync(
      path.join(rootDir, "src/components/proctoring/AntiOcrQuestionCanvas.tsx"),
      "utf8"
    );
    assert(
      qCanvas.includes("isCompactMobile"),
      "AntiOcrQuestionCanvas must dynamically scale typography on compact mobile viewports (<420px)"
    );

    const codeCanvas = fs.readFileSync(
      path.join(rootDir, "src/components/proctoring/AntiOcrCodeCanvas.tsx"),
      "utf8"
    );
    assert(
      codeCanvas.includes("isCompactMobile"),
      "AntiOcrCodeCanvas must dynamically scale code font size and gutter width on compact mobile viewports (<420px)"
    );

    const resumePage = fs.readFileSync(
      path.join(rootDir, "src/app/resumes/page.tsx"),
      "utf8"
    );
    assert(
      resumePage.includes("lg:hidden") && resumePage.includes("hidden lg:block"),
      "Resume Studio must provide the Edit Sections / Live A4 Preview switcher across phones and portrait tablets (<1024px)"
    );

    const aptitudePage = fs.readFileSync(
      path.join(rootDir, "src/app/aptitude/page.tsx"),
      "utf8"
    );
    assert(
      aptitudePage.includes("grid-cols-5 sm:grid-cols-10"),
      "Aptitude question navigator must use 5 columns on phones and 10 columns on larger screens"
    );
  });
});
