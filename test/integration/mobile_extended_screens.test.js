import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

test("Extended Mobile Tokens - Detail, Community, Notifications", () => {
  const tokensPath = path.join(rootDir, "src", "lib", "mobile-design-tokens.ts");
  assert.ok(fs.existsSync(tokensPath), "tokens file exists");

  const content = fs.readFileSync(tokensPath, "utf-8");

  // Detailed Opportunity Data
  assert.match(content, /DETAILED_OPPORTUNITY_MOCK/, "DETAILED_OPPORTUNITY_MOCK defined");
  assert.match(content, /timelineRounds/, "Timeline rounds array present");
  assert.match(content, /rewards/, "Rewards array present");
  assert.match(content, /faqs/, "FAQs array present");
  assert.match(content, /discussions/, "Discussions thread present");
  assert.match(content, /socialProofCount:\s*2450/, "2,450 students social proof defined");

  // Search tokens
  assert.match(content, /RECENT_SEARCHES/, "Recent searches defined");
  assert.match(content, /TRENDING_KEYWORDS/, "Trending keywords defined");

  // Community & Mentors
  assert.match(content, /MOCK_COMMUNITY_POSTS/, "Community posts defined");
  assert.match(content, /pollData/, "Interactive poll structure defined");
  assert.match(content, /MOCK_TEAMMATES/, "Teammates dataset defined");
  assert.match(content, /MOCK_MENTORS/, "Mentors dataset defined");

  // Notifications
  assert.match(content, /MOCK_NOTIFICATIONS/, "Notifications dataset defined");
  assert.match(content, /today:/, "Today notifications grouped");
  assert.match(content, /earlier:/, "Earlier notifications grouped");
});

test("Extended Mobile UI Components - Skeletons, Offline Banner, Error State, Filter Sheet", () => {
  const uiDir = path.join(rootDir, "src", "components", "mobile", "ui");

  // FilterBottomSheet
  const filterPath = path.join(uiDir, "FilterBottomSheet.tsx");
  assert.ok(fs.existsSync(filterPath), "FilterBottomSheet exists");
  const filterContent = fs.readFileSync(filterPath, "utf-8");
  assert.match(filterContent, /Opportunity Type/, "Filter sheet includes Opportunity Type");
  assert.match(filterContent, /Mode \/ Location/, "Filter sheet includes Mode / Location");
  assert.match(filterContent, /Prize or Stipend Pool/, "Filter sheet includes Prize Range");
  assert.match(filterContent, /Registration Deadline/, "Filter sheet includes Deadline options");
  assert.match(filterContent, /Free to Register Only/, "Filter sheet includes Free Only toggle");
  assert.match(filterContent, /Sort Opportunities/, "Filter sheet includes Sort By");

  // SkeletonLoader
  const skelPath = path.join(uiDir, "SkeletonLoader.tsx");
  assert.ok(fs.existsSync(skelPath), "SkeletonLoader exists");
  const skelContent = fs.readFileSync(skelPath, "utf-8");
  assert.match(skelContent, /OpportunityCardSkeleton/, "Exports OpportunityCardSkeleton");
  assert.match(skelContent, /NotificationSkeleton/, "Exports NotificationSkeleton");

  // OfflineBanner
  const offlinePath = path.join(uiDir, "OfflineBanner.tsx");
  assert.ok(fs.existsSync(offlinePath), "OfflineBanner exists");
  const offlineContent = fs.readFileSync(offlinePath, "utf-8");
  assert.match(offlineContent, /You're offline/, "Offline banner includes warning text");
  assert.match(offlineContent, /Retry/, "Offline banner includes retry CTA");

  // ErrorStateView
  const errorPath = path.join(uiDir, "ErrorStateView.tsx");
  assert.ok(fs.existsSync(errorPath), "ErrorStateView exists");
  const errorContent = fs.readFileSync(errorPath, "utf-8");
  assert.match(errorContent, /Retry Now/, "Error state includes Retry Now action");
});

test("Extended Screens - Explore, Detail, Registration Flow, Applications", () => {
  const screensDir = path.join(rootDir, "src", "components", "mobile", "screens");

  // ExploreScreen
  const exploreContent = fs.readFileSync(path.join(screensDir, "ExploreScreen.tsx"), "utf-8");
  assert.match(exploreContent, /Recent Searches/, "Explore includes Recent Searches");
  assert.match(exploreContent, /Trending Searches/, "Explore includes Trending Searches");
  assert.match(exploreContent, /FilterBottomSheet/, "Explore includes FilterBottomSheet trigger");
  assert.match(exploreContent, /No opportunities match your criteria/, "Explore includes empty state fallback");

  // OpportunityDetailScreen
  const detailPath = path.join(screensDir, "OpportunityDetailScreen.tsx");
  assert.ok(fs.existsSync(detailPath), "OpportunityDetailScreen exists");
  const detailContent = fs.readFileSync(detailPath, "utf-8");
  assert.match(detailContent, /Registered by.*socialProofCount.*students/s, "Detail includes social proof strip");
  assert.match(detailContent, /Details.*Timeline.*Rewards.*FAQs.*Discussion/s, "Detail includes 5-tab sticky bar");
  assert.match(detailContent, /Round-by-Round Timeline/, "Detail includes timeline stepper");
  assert.match(detailContent, /Register Now/, "Detail includes Register Now sticky CTA");
  assert.match(detailContent, /Registered ✓/, "Detail supports registered state");

  // RegistrationFlowModal
  const regPath = path.join(screensDir, "RegistrationFlowModal.tsx");
  assert.ok(fs.existsSync(regPath), "RegistrationFlowModal exists");
  const regContent = fs.readFileSync(regPath, "utf-8");
  assert.match(regContent, /Confirm Profile & Resume/, "Step 1 confirms profile");
  assert.match(regContent, /Organizer Questions/, "Step 2 asks extra questions");
  assert.match(regContent, /Participation Mode/, "Step 3 supports Solo vs Team Create/Join");
  assert.match(regContent, /Add to Google Calendar/, "Success screen includes Add to Calendar button");

  // ApplicationsScreen
  const appContent = fs.readFileSync(path.join(screensDir, "ApplicationsScreen.tsx"), "utf-8");
  assert.match(appContent, /Active.*Shortlisted.*Finished.*Saved/s, "Applications includes 4 tabs");
  assert.match(appContent, /Next Milestone/, "Applications card includes next milestone date");
  assert.match(appContent, /countdown/, "Applications card includes live countdown");
});

test("Extended Screens - Community, Notifications, Settings, Home Tooltips", () => {
  const screensDir = path.join(rootDir, "src", "components", "mobile", "screens");

  // CommunityScreen
  const commContent = fs.readFileSync(path.join(screensDir, "CommunityScreen.tsx"), "utf-8");
  assert.match(commContent, /Discussions & Polls/, "Community includes polls & feed");
  assert.match(commContent, /Find Teammates/, "Community includes teammate finder");
  assert.match(commContent, /Invite to Team/, "Teammate cards have Invite button");
  assert.match(commContent, /1:1 Mentors/, "Community includes mentor directory");
  assert.match(commContent, /Book 1:1 Session/, "Mentors have Book Session button");

  // NotificationsScreen
  const notifPath = path.join(screensDir, "NotificationsScreen.tsx");
  assert.ok(fs.existsSync(notifPath), "NotificationsScreen exists");
  const notifContent = fs.readFileSync(notifPath, "utf-8");
  assert.match(notifContent, /Today/, "Notifications groups Today");
  assert.match(notifContent, /Earlier/, "Notifications groups Earlier");
  assert.match(notifContent, /Mark all read/, "Notifications includes mark all read button");

  // SettingsScreen
  const settingsPath = path.join(screensDir, "SettingsScreen.tsx");
  assert.ok(fs.existsSync(settingsPath), "SettingsScreen exists");
  const settingsContent = fs.readFileSync(settingsPath, "utf-8");
  assert.match(settingsContent, /Personal Details/, "Settings includes personal details");
  assert.match(settingsContent, /Dark Mode/, "Settings includes dark mode toggle");
  assert.match(settingsContent, /Deadline Push Alerts/, "Settings includes push preferences");
  assert.match(settingsContent, /Recruiter Talent Search/, "Settings includes privacy toggle");
  assert.match(settingsContent, /Display Language/, "Settings includes language switcher");
  assert.match(settingsContent, /Log Out of EdWorld/, "Settings includes logout button");

  // HomeScreen Tooltips
  const homeContent = fs.readFileSync(path.join(screensDir, "HomeScreen.tsx"), "utf-8");
  assert.match(homeContent, /Quick Onboarding Tip/, "Home includes first-time user tour tooltips");
  assert.match(homeContent, /onNotificationsClick/, "Home connects notifications bell handler");
});

test("Master Prototype Page - Edge States Simulator and Screen Routing", () => {
  const pagePath = path.join(rootDir, "src", "app", "mobile", "page.tsx");
  const pageContent = fs.readFileSync(pagePath, "utf-8");

  // 390x844 chassis
  assert.match(pageContent, /max-w-\[390px\]/, "Chassis 390px width enforced");
  assert.match(pageContent, /h-\[844px\]/, "Chassis 844px height enforced");

  // Edge state simulators
  assert.match(pageContent, /isSimulatingOffline/, "Includes offline simulator");
  assert.match(pageContent, /isSimulatingSkeleton/, "Includes skeleton simulator");
  assert.match(pageContent, /isSimulatingError/, "Includes error simulator");

  // Extended screens integration
  assert.match(pageContent, /OpportunityDetailScreen/, "Master imports OpportunityDetailScreen");
  assert.match(pageContent, /RegistrationFlowModal/, "Master imports RegistrationFlowModal");
  assert.match(pageContent, /NotificationsScreen/, "Master imports NotificationsScreen");
  assert.match(pageContent, /SettingsScreen/, "Master imports SettingsScreen");
});
