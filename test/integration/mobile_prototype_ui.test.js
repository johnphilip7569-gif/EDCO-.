import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

test("Mobile Design System - Token Definitions", () => {
  const tokensPath = path.join(rootDir, "src", "lib", "mobile-design-tokens.ts");
  assert.ok(fs.existsSync(tokensPath), "mobile-design-tokens.ts exists");

  const content = fs.readFileSync(tokensPath, "utf-8");

  // Visual style tokens
  assert.match(content, /#3D3BF3/, "Primary deep indigo token defined");
  assert.match(content, /#FF6B00/, "Warm accent orange token defined");
  assert.match(content, /#FFB800/, "Warm accent gold token defined");
  assert.match(content, /16px/, "16px corner radius defined");
  assert.match(content, /44px/, "44px minimum tap target defined");
  assert.match(content, /#F8F9FD/, "Light background defined");
  assert.match(content, /#0E1017/, "Dark background defined");

  // EdWorld Core Features
  assert.match(content, /feat-dsa/, "DSA Studio feature defined");
  assert.match(content, /feat-interviews/, "AI Mock Interviews feature defined");
  assert.match(content, /feat-resumes/, "ATS Resume Maker feature defined");
  assert.match(content, /feat-myra/, "Myra AI Mentor feature defined");

  // Profile data
  assert.match(content, /completionPercent:\s*70/, "70% completion percent specified");
  assert.match(content, /streakDays:\s*12/, "12 days streak specified");
  assert.match(content, /Master Innovator/, "Level 4 title specified");
  assert.match(content, /applications:\s*14/, "14 applications stats specified");
  assert.match(content, /wins:\s*3/, "3 wins stats specified");
});

test("Mobile UI Components - Existence and 44px tap target compliance", () => {
  const uiDir = path.join(rootDir, "src", "components", "mobile", "ui");

  const requiredComponents = [
    "MobileButton.tsx",
    "MobileChip.tsx",
    "MobileCard.tsx",
    "FloatingInput.tsx",
    "OtpInputGroup.tsx",
    "OpportunityCard.tsx",
    "CircularProgressRing.tsx",
    "MobileBottomNav.tsx",
    "EdworldFeatureCard.tsx",
  ];

  for (const comp of requiredComponents) {
    const compPath = path.join(uiDir, comp);
    assert.ok(fs.existsSync(compPath), `UI Component ${comp} exists`);
  }

  // Verify button min tap target
  const buttonContent = fs.readFileSync(path.join(uiDir, "MobileButton.tsx"), "utf-8");
  assert.match(buttonContent, /min-h-\[44px\]/, "MobileButton enforces 44px minimum tap target");

  // Verify bottom nav 44px+ tap target
  const navContent = fs.readFileSync(path.join(uiDir, "MobileBottomNav.tsx"), "utf-8");
  assert.match(navContent, /min-h-\[48px\]/, "MobileBottomNav enforces 48px touch targets");

  // Verify OTP 6-box structure
  const otpContent = fs.readFileSync(path.join(uiDir, "OtpInputGroup.tsx"), "utf-8");
  assert.match(otpContent, /length\s*=\s*6/, "OtpInputGroup supports 6 boxes default");
  assert.match(otpContent, /initialCountdown\s*=\s*30/, "OtpInputGroup supports 30s resend timer");
});

test("Mobile Screens - All 6 core screens and feature integrations", () => {
  const screensDir = path.join(rootDir, "src", "components", "mobile", "screens");

  const screens = [
    "SplashScreen.tsx",
    "AuthScreen.tsx",
    "OnboardingScreen.tsx",
    "HomeScreen.tsx",
    "ExploreScreen.tsx",
    "ApplicationsScreen.tsx",
    "CommunityScreen.tsx",
    "ProfileScreen.tsx",
    "EditProfileSheet.tsx",
    "ComponentLibraryScreen.tsx",
  ];

  for (const screen of screens) {
    const screenPath = path.join(screensDir, screen);
    assert.ok(fs.existsSync(screenPath), `Screen ${screen} exists`);
  }

  // Screen 1: Splash carousel
  const splashContent = fs.readFileSync(path.join(screensDir, "SplashScreen.tsx"), "utf-8");
  assert.match(splashContent, /Discover opportunities/, "Splash includes carousel slide 1");
  assert.match(splashContent, /Compete and build your verified portfolio/, "Splash includes carousel slide 2");
  assert.match(splashContent, /Get hired and grow/, "Splash includes carousel slide 3");
  assert.match(splashContent, /Get Started/, "Splash includes Get Started CTA");
  assert.match(splashContent, /I already have an account/, "Splash includes account login CTA");

  // Screen 2: Auth OTP & Google SSO
  const authContent = fs.readFileSync(path.join(screensDir, "AuthScreen.tsx"), "utf-8");
  assert.match(authContent, /Continue with Google/, "Auth includes Google SSO");
  assert.match(authContent, /Phone OTP/, "Auth includes Phone OTP tab");
  assert.match(authContent, /OtpInputGroup/, "Auth embeds 6-box OTP input group");

  // Screen 3: Onboarding 5-Step Wizard
  const onbContent = fs.readFileSync(path.join(screensDir, "OnboardingScreen.tsx"), "utf-8");
  assert.match(onbContent, /totalSteps\s*=\s*5/, "Onboarding implements 5 steps");
  assert.match(onbContent, /selectedInterests\.length\s*>=\s*3/, "Onboarding enforces minimum 3 interest chips");
  assert.match(onbContent, /showConfetti/, "Onboarding includes confetti finish");

  // Screen 4: Home Feed with Unstop layout & EdWorld Co features
  const homeContent = fs.readFileSync(path.join(screensDir, "HomeScreen.tsx"), "utf-8");
  assert.match(homeContent, /EdworldFeatureCard/, "Home feed includes EdWorld features launchpad");
  assert.match(homeContent, /Recommended for you/, "Home feed includes Recommended section");
  assert.match(homeContent, /Closing soon/, "Home feed includes Closing Soon section");
  assert.match(homeContent, /Trending on EdWorld/, "Home feed includes Trending section");

  // Screen 5: Profile View (Main Focus)
  const profContent = fs.readFileSync(path.join(screensDir, "ProfileScreen.tsx"), "utf-8");
  assert.match(profContent, /CircularProgressRing/, "Profile includes 70% circular progress ring");
  assert.match(profContent, /profile\.streakDays/, "Profile includes streak counter");
  assert.match(profContent, /profile\.stats\.applications/, "Profile includes stats row");
  assert.match(profContent, /overview.*activity.*badges/s, "Profile includes 3 tabs: Overview, Activity, Badges");
  assert.match(profContent, /isSettingsModalOpen/, "Profile includes Settings modal with theme and privacy");

  // Screen 6: Edit Profile Sheet
  const editContent = fs.readFileSync(path.join(screensDir, "EditProfileSheet.tsx"), "utf-8");
  assert.match(editContent, /FloatingInput/, "Edit profile uses floating label inputs");
  assert.match(editContent, /Save Changes/, "Edit profile has sticky Save button");
});

test("Mobile Prototype Master Shell - 390x844 responsive chassis", () => {
  const masterPath = path.join(rootDir, "src", "app", "mobile", "page.tsx");
  assert.ok(fs.existsSync(masterPath), "src/app/mobile/page.tsx exists");

  const masterContent = fs.readFileSync(masterPath, "utf-8");
  assert.match(masterContent, /max-w-\[390px\]/, "iPhone 390px width container enforced");
  assert.match(masterContent, /h-\[844px\]/, "iPhone 844px height container enforced");
  assert.match(masterContent, /MobileBottomNav/, "Master shell includes MobileBottomNav");
  assert.match(masterContent, /activeFeatureModal/, "Master shell includes EdWorld feature modal launcher");
  assert.match(masterContent, /OpportunityDetailScreen/, "Master shell includes Opportunity detail screen");
});

test("Public Page Prefix Config - /mobile bypasses auth middleware", () => {
  const mwPath = path.join(rootDir, "src", "middleware.ts");
  const mwContent = fs.readFileSync(mwPath, "utf-8");
  assert.match(mwContent, /"\/mobile"/, "/mobile is in PUBLIC_PAGE_PREFIXES");

  const appShellPath = path.join(rootDir, "src", "components", "AppShell.tsx");
  const appShellContent = fs.readFileSync(appShellPath, "utf-8");
  assert.match(appShellContent, /isMobilePrototype/, "AppShell bypasses desktop overlay on /mobile");
});
