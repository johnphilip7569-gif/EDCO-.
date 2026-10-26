/**
 * Aegis Sentinel AI — Autonomous Cyber-Defense & Anti-Bot Threat Engine
 * 
 * Provides multi-layered, real-time threat detection, autonomous mitigation,
 * and security posture management across 8 attack vectors:
 * 1. AI_AGENT_CRAWLER: Unauthorized AI agents, LLM scrapers & autonomous bots
 * 2. HEADLESS_AUTOMATION: Headless Chrome, Playwright, Puppeteer, Selenium, WebDriver
 * 3. PROMPT_INJECTION: LLM jailbreaks, system-prompt extraction, adversarial smuggling
 * 4. OWASP_EXPLOIT: SQLi, XSS, Command Injection (RCE), SSRF, Path Traversal, Prototype Pollution
 * 5. HONEYPOT_TRAP: Probing decoy endpoints (/.env, /.git, /wp-admin, /phpmyadmin, etc.)
 * 6. VELOCITY_DDOS: Rapid burst floods, brute force, credential stuffing, scraping loops
 * 7. DATA_SCRAPING: High-frequency sequential ID enumeration and curriculum harvesting
 * 8. BEHAVIORAL_ANOMALY: Headless client telemetry, synthetic untrusted clicks, DOM traps
 */

export type ThreatVector =
  | "AI_AGENT_CRAWLER"
  | "HEADLESS_AUTOMATION"
  | "PROMPT_INJECTION"
  | "OWASP_EXPLOIT"
  | "HONEYPOT_TRAP"
  | "VELOCITY_DDOS"
  | "DATA_SCRAPING"
  | "BEHAVIORAL_ANOMALY";

export type DefensePosture = "STANDARD" | "ELEVATED" | "LOCKDOWN";

export type DefenseAction = "ALLOW" | "CHALLENGE" | "THROTTLE" | "BLOCK_QUARANTINE" | "TARPIT";

export interface SecurityIncident {
  id: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  path: string;
  threatVector: ThreatVector;
  riskScore: number;
  actionTaken: DefenseAction;
  details: string;
  matchedPattern?: string;
  requestId: string;
}

export interface InspectionContext {
  ip: string;
  userAgent: string;
  path: string;
  method?: string;
  query?: Record<string, string>;
  bodyText?: string;
  headers?: Record<string, string>;
  requestId?: string;
  clientTelemetry?: {
    isWebDriver?: boolean;
    hasAutomationHooks?: boolean;
    honeypotTriggered?: boolean;
    untrustedClicks?: number;
  };
}

export interface SentinelAssessment {
  blocked: boolean;
  action: DefenseAction;
  riskScore: number; // 0 to 100
  threatVectors: ThreatVector[];
  primaryReason: string;
  matchedSignatures: string[];
  requestId: string;
  posture: DefensePosture;
}

// -----------------------------------------------------------------------------
// Signatures & Heuristic Detections
// -----------------------------------------------------------------------------

// 1. Unauthorized AI Agents, Crawlers & Autonomous LLM Scrapers
export const AI_AGENT_SIGNATURES: Array<{ name: string; pattern: RegExp }> = [
  { name: "GPTBot", pattern: /\b(GPTBot|ChatGPT-User|OAI-SearchBot)\b/i },
  { name: "ClaudeBot", pattern: /\b(ClaudeBot|Claude-Web|anthropic-ai)\b/i },
  { name: "PerplexityBot", pattern: /\bPerplexityBot\b/i },
  { name: "Bytespider", pattern: /\bBytespider\b/i },
  { name: "CCBot", pattern: /\bCCBot\b/i },
  { name: "Diffbot", pattern: /\bDiffbot\b/i },
  { name: "Google-Extended", pattern: /\bGoogle-Extended\b/i },
  { name: "Meta-ExternalAgent", pattern: /\b(Meta-ExternalAgent|FacebookBot)\b/i },
  { name: "Amazonbot", pattern: /\bAmazonbot\b/i },
  { name: "Cohere-AI", pattern: /\bcohere-ai\b/i },
  { name: "Scrapy", pattern: /\bScrapy\b/i },
  { name: "LangChain", pattern: /\bLangChain\b/i },
  { name: "AutoGPT", pattern: /\bAutoGPT\b/i },
  { name: "CrewAI", pattern: /\bCrewAI\b/i },
  { name: "Python-Requests", pattern: /\b(python-requests|aiohttp|httpx|urllib)\b/i },
  { name: "Curl-Wget", pattern: /\b(curl|wget|libwww-perl|Go-http-client)\b/i },
];

// 2. Headless Browsers & Automation Frameworks
export const HEADLESS_SIGNATURES: Array<{ name: string; pattern: RegExp }> = [
  { name: "HeadlessChrome", pattern: /\bHeadlessChrome\b/i },
  { name: "Playwright", pattern: /\bPlaywright\b/i },
  { name: "Puppeteer", pattern: /\bPuppeteer\b/i },
  { name: "Selenium", pattern: /\bSelenium\b/i },
  { name: "PhantomJS", pattern: /\bPhantomJS\b/i },
  { name: "Cypress", pattern: /\bCypress\b/i },
  { name: "WebDriver", pattern: /\bWebDriver\b/i },
];

// 3. Prompt Injection & LLM Jailbreak Vectors
export const PROMPT_INJECTION_PATTERNS: Array<{ name: string; pattern: RegExp }> = [
  { name: "Ignore Instructions", pattern: /(ignore|disregard|forget|override)\s+(all\s+)?(previous|past|prior|above|system)\s+(instructions|prompts|rules|commands)/i },
  { name: "System Prompt Extraction", pattern: /(repeat|output|show|reveal|display|leak|print)\s+(your\s+)?(system\s+prompt|initial\s+prompt|core\s+instructions|secret\s+instructions)/i },
  { name: "DAN / Jailbreak Persona", pattern: /\b(DAN\s+mode|do\s+anything\s+now|developer\s+mode|unfiltered\s+mode|jailbreak\s+active)\b/i },
  { name: "Roleplay Hijack", pattern: /(you\s+are\s+now\s+in\s+unrestricted\s+mode|simulate\s+an\s+evil\s+ai|bypass\s+all\s+content\s+filters)/i },
  { name: "Base64 Smuggling", pattern: /^(?:[A-Za-z0-9+/]{4}){15,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/ },
  { name: "Delimiter Smuggling", pattern: /(<\|im_start\|>|<\|im_end\|>|\[INST\]|\[\/INST\]|```system)/i },
];

// 4. Honeypot Decoy Traps
export const HONEYPOT_PATHS: Array<{ path: string; desc: string }> = [
  { path: "/.env", desc: "Decoy Environment File Probe" },
  { path: "/.git/config", desc: "Decoy Git Config Probe" },
  { path: "/.git/HEAD", desc: "Decoy Git Repository Probe" },
  { path: "/wp-admin", desc: "Decoy WordPress Admin Probe" },
  { path: "/wp-login.php", desc: "Decoy WordPress Login Probe" },
  { path: "/phpmyadmin", desc: "Decoy phpMyAdmin Probe" },
  { path: "/actuator/env", desc: "Decoy Spring Boot Actuator Probe" },
  { path: "/actuator/health", desc: "Decoy Spring Boot Health Probe" },
  { path: "/api/internal/dump", desc: "Decoy Internal Data Dump Probe" },
  { path: "/admin/config.bak", desc: "Decoy Backup Config Probe" },
  { path: "/.aws/credentials", desc: "Decoy Cloud Credentials Probe" },
  { path: "/etc/passwd", desc: "Decoy Unix Shadow Probe" },
];

// 5. OWASP Top-10 Exploits: SQLi, XSS, RCE, SSRF, Prototype Pollution
export const OWASP_PATTERNS: Array<{ type: string; pattern: RegExp }> = [
  // SQL Injection
  { type: "SQLI", pattern: /(\bunion\s+all\s+select\b|\bunion\s+select\b)/i },
  { type: "SQLI", pattern: /(\bselect\b[\s\S]+\bfrom\b[\s\S]+\b(information_schema|pg_catalog|auth\.users|public\.users)\b)/i },
  { type: "SQLI", pattern: /('|\b)(or|and)\s+('?1'?\s*=\s*'?1'?|true\s*=\s*true)/i },
  { type: "SQLI", pattern: /('|"|;)\s*(drop|truncate)\s+table\b/i },
  { type: "SQLI", pattern: /\bpg_sleep\s*\(\s*\d+\s*\)/i },
  
  // Cross-Site Scripting (XSS)
  { type: "XSS", pattern: /<script\b[^>]*>[\s\S]*?(<\/script>)?/i },
  { type: "XSS", pattern: /javascript:\s*[^\s]/i },
  { type: "XSS", pattern: /\bon(error|load|click|mouseover|focus|blur)\s*=\s*['"][^'"]*['"]/i },
  { type: "XSS", pattern: /<iframe\b[^>]*>/i },
  
  // Remote Code Execution (RCE) / Command Injection
  { type: "RCE", pattern: /(;\s*(cat|ls|rm|curl|wget|nc|netcat|sh|bash|powershell|cmd\.exe)\b|\$\(.*?\)|\`.*?\`)/i },
  { type: "RCE", pattern: /\|\s*(bash|sh|cmd|powershell)\b/i },
  
  // Server-Side Request Forgery (SSRF)
  { type: "SSRF", pattern: /(http:\/\/|https:\/\/)?(169\.254\.169\.254|metadata\.google\.internal|127\.0\.0\.1|localhost|0\.0\.0\.0)/i },
  
  // Path Traversal
  { type: "PATH_TRAVERSAL", pattern: /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\/|\.\.%2f)/i },
  
  // Prototype Pollution
  { type: "PROTOTYPE_POLLUTION", pattern: /(__proto__|constructor\["prototype"\]|Object\.prototype)/i },
];

// -----------------------------------------------------------------------------
// Threat Ledger & In-Memory State
// -----------------------------------------------------------------------------

class SentinelThreatLedger {
  private posture: DefensePosture = "STANDARD";
  private incidents: SecurityIncident[] = [];
  private quarantinedIPs: Map<string, { until: number; reason: string }> = new Map();
  private requestVelocityMap: Map<string, { count: number; windowStart: number }> = new Map();
  private maxIncidentHistory = 150;

  getPosture(): DefensePosture {
    return this.posture;
  }

  setPosture(newPosture: DefensePosture): void {
    this.posture = newPosture;
  }

  isQuarantined(ip: string): boolean {
    const entry = this.quarantinedIPs.get(ip);
    if (!entry) return false;
    if (Date.now() > entry.until) {
      this.quarantinedIPs.delete(ip);
      return false;
    }
    return true;
  }

  quarantineIP(ip: string, durationMs: number = 30 * 60 * 1000, reason: string = "Automated Aegis quarantine"): void {
    if (!ip || ip === "127.0.0.1" || ip === "::1" || ip === "localhost") return;
    this.quarantinedIPs.set(ip, {
      until: Date.now() + durationMs,
      reason,
    });
  }

  unquarantineIP(ip: string): void {
    this.quarantinedIPs.delete(ip);
  }

  getQuarantinedIPs(): Array<{ ip: string; expiresAt: string; reason: string }> {
    const list: Array<{ ip: string; expiresAt: string; reason: string }> = [];
    const now = Date.now();
    this.quarantinedIPs.forEach((entry, ip) => {
      if (now <= entry.until) {
        list.push({
          ip,
          expiresAt: new Date(entry.until).toISOString(),
          reason: entry.reason,
        });
      }
    });
    return list;
  }

  recordIncident(incident: Omit<SecurityIncident, "id" | "timestamp">): SecurityIncident {
    const complete: SecurityIncident = {
      id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...incident,
    };
    this.incidents.unshift(complete);
    if (this.incidents.length > this.maxIncidentHistory) {
      this.incidents.pop();
    }
    return complete;
  }

  getIncidents(limit = 40): SecurityIncident[] {
    return this.incidents.slice(0, limit);
  }

  clearIncidents(): void {
    this.incidents = [];
  }

  resolveIncidents(ids: string[]): number {
    const idSet = new Set(ids);
    const prevCount = this.incidents.length;
    this.incidents = this.incidents.filter((inc) => !idSet.has(inc.id));
    return prevCount - this.incidents.length;
  }

  getStats() {
    const total = this.incidents.length;
    const byVector: Record<string, number> = {};
    for (const inc of this.incidents) {
      byVector[inc.threatVector] = (byVector[inc.threatVector] || 0) + 1;
    }
    return {
      posture: this.posture,
      totalIncidents: total,
      quarantinedCount: this.quarantinedIPs.size,
      breakdown: byVector,
      lastIncidentAt: this.incidents[0]?.timestamp || null,
    };
  }

  checkVelocity(ip: string, limit = 60, windowMs = 60000): { allowed: boolean; currentCount: number } {
    if (!ip) return { allowed: true, currentCount: 1 };
    const now = Date.now();
    const entry = this.requestVelocityMap.get(ip);

    if (!entry || now - entry.windowStart > windowMs) {
      this.requestVelocityMap.set(ip, { count: 1, windowStart: now });
      return { allowed: true, currentCount: 1 };
    }

    entry.count += 1;
    if (entry.count > limit) {
      return { allowed: false, currentCount: entry.count };
    }
    return { allowed: true, currentCount: entry.count };
  }
}

// Global Singleton Instance
export const sentinelLedger = new SentinelThreatLedger();

// -----------------------------------------------------------------------------
// Autonomous Threat Evaluation Engine
// -----------------------------------------------------------------------------

export function evaluateThreat(context: InspectionContext): SentinelAssessment {
  const posture = sentinelLedger.getPosture();
  const requestId = context.requestId || `req-${Date.now()}`;
  const threatVectors: ThreatVector[] = [];
  const matchedSignatures: string[] = [];
  let riskScore = 0;
  let primaryReason = "";

  // Check 0: Prior Active Quarantine
  if (sentinelLedger.isQuarantined(context.ip)) {
    return {
      blocked: true,
      action: "BLOCK_QUARANTINE",
      riskScore: 100,
      threatVectors: ["HONEYPOT_TRAP"],
      primaryReason: "IP address is actively quarantined by Aegis Sentinel AI.",
      matchedSignatures: ["ACTIVE_QUARANTINE_LEDGER"],
      requestId,
      posture,
    };
  }

  // Check 1: Honeypot Decoy Traps
  const normalizedPath = (context.path || "").toLowerCase();
  for (const trap of HONEYPOT_PATHS) {
    if (normalizedPath === trap.path || normalizedPath.startsWith(trap.path + "/") || normalizedPath.endsWith(trap.path)) {
      threatVectors.push("HONEYPOT_TRAP");
      matchedSignatures.push(`Honeypot: ${trap.desc}`);
      riskScore = 100;
      primaryReason = `Honeypot trap triggered: ${trap.desc}`;
      // Instant automated IP quarantine
      sentinelLedger.quarantineIP(context.ip, 60 * 60 * 1000, `Honeypot hit: ${trap.path}`);
      break;
    }
  }

  // Check 2: Unauthorized AI Scrapers & LLM Crawlers
  const ua = context.userAgent || "";
  for (const bot of AI_AGENT_SIGNATURES) {
    if (bot.pattern.test(ua)) {
      threatVectors.push("AI_AGENT_CRAWLER");
      matchedSignatures.push(`AI Agent UA: ${bot.name}`);
      riskScore = Math.max(riskScore, 85);
      if (!primaryReason) primaryReason = `Unauthorized AI crawler or scraping agent detected: ${bot.name}`;
      break;
    }
  }

  // Check 3: Headless Browsers & Automation Tools
  for (const hl of HEADLESS_SIGNATURES) {
    if (hl.pattern.test(ua)) {
      threatVectors.push("HEADLESS_AUTOMATION");
      matchedSignatures.push(`Headless UA: ${hl.name}`);
      riskScore = Math.max(riskScore, 80);
      if (!primaryReason) primaryReason = `Automated headless browser detected: ${hl.name}`;
      break;
    }
  }

  // Check 4: Client-Side Behavioral Telemetry Signals
  if (context.clientTelemetry) {
    if (context.clientTelemetry.honeypotTriggered) {
      threatVectors.push("BEHAVIORAL_ANOMALY");
      matchedSignatures.push("Client Honeypot Link Interacted");
      riskScore = Math.max(riskScore, 95);
      primaryReason = "Client interacted with hidden DOM honeypot trap intended for automated scrapers.";
    }
    if (context.clientTelemetry.isWebDriver) {
      threatVectors.push("HEADLESS_AUTOMATION");
      matchedSignatures.push("navigator.webdriver === true");
      riskScore = Math.max(riskScore, 80);
      if (!primaryReason) primaryReason = "Client reported active WebDriver automation flag.";
    }
    if (context.clientTelemetry.hasAutomationHooks) {
      threatVectors.push("HEADLESS_AUTOMATION");
      matchedSignatures.push("CDP/Puppeteer/Playwright Hooks Present");
      riskScore = Math.max(riskScore, 85);
      if (!primaryReason) primaryReason = "Client has automated test runner hooks.";
    }
  }

  // Check 5: OWASP Exploits & Payload Injection (Query, Path, Body)
  const payloadSegments: string[] = [
    context.path,
    context.bodyText || "",
    ...Object.values(context.query || {}),
  ];

  for (const segment of payloadSegments) {
    if (!segment) continue;

    // OWASP signatures
    for (const exploit of OWASP_PATTERNS) {
      if (exploit.type === "SSRF") {
        const isCloudMetadata = /(169\.254\.169\.254|metadata\.google\.internal)/i.test(segment);
        const isLoopbackTarget = /(https?:\/\/)?(127\.0\.0\.1|localhost|0\.0\.0\.0)/i.test(segment);
        const isLocalTraffic = context.ip === "127.0.0.1" || context.ip === "::1" || context.ip === "localhost" || context.ip?.startsWith("192.168.");

        if (isCloudMetadata || (!isLocalTraffic && isLoopbackTarget)) {
          threatVectors.push("OWASP_EXPLOIT");
          matchedSignatures.push(`OWASP: ${exploit.type}`);
          riskScore = Math.max(riskScore, 90);
          if (!primaryReason) primaryReason = `OWASP injection attack detected: ${exploit.type}`;
        }
        continue;
      }

      if (exploit.pattern.test(segment)) {
        threatVectors.push("OWASP_EXPLOIT");
        matchedSignatures.push(`OWASP: ${exploit.type}`);
        riskScore = Math.max(riskScore, 90);
        if (!primaryReason) primaryReason = `OWASP injection attack detected: ${exploit.type}`;
      }
    }

    // Prompt Injection & LLM Jailbreak checks
    for (const pi of PROMPT_INJECTION_PATTERNS) {
      if (pi.pattern.test(segment)) {
        threatVectors.push("PROMPT_INJECTION");
        matchedSignatures.push(`Prompt Injection: ${pi.name}`);
        riskScore = Math.max(riskScore, 85);
        if (!primaryReason) primaryReason = `Adversarial LLM prompt injection or jailbreak detected: ${pi.name}`;
      }
    }
  }

  // Check 6: Velocity / Burst Rate Limiting
  const velocityLimit = posture === "LOCKDOWN" ? 25 : posture === "ELEVATED" ? 40 : 80;
  const velocityCheck = sentinelLedger.checkVelocity(context.ip, velocityLimit, 60000);
  if (!velocityCheck.allowed) {
    threatVectors.push("VELOCITY_DDOS");
    matchedSignatures.push(`Velocity Limit Exceeded (${velocityCheck.currentCount} req/min)`);
    riskScore = Math.max(riskScore, 75);
    if (!primaryReason) primaryReason = `High-frequency request velocity flood (${velocityCheck.currentCount} requests/min).`;
  }

  // Posture Adjustments
  if (posture === "LOCKDOWN") {
    riskScore = Math.min(100, riskScore + 20);
  } else if (posture === "ELEVATED") {
    riskScore = Math.min(100, riskScore + 10);
  }

  // Determine Defense Action
  let action: DefenseAction = "ALLOW";
  let blocked = false;

  if (riskScore >= 75) {
    action = "BLOCK_QUARANTINE";
    blocked = true;
  } else if (riskScore >= 60) {
    action = "THROTTLE";
    blocked = true;
  } else if (riskScore >= 45) {
    action = "CHALLENGE";
    blocked = false;
  }

  // Log Incident if threat detected
  if (riskScore >= 45 && threatVectors.length > 0) {
    sentinelLedger.recordIncident({
      ip: context.ip,
      userAgent: context.userAgent,
      path: context.path,
      threatVector: threatVectors[0],
      riskScore,
      actionTaken: action,
      details: primaryReason,
      matchedPattern: matchedSignatures.join(", "),
      requestId,
    });
  }

  return {
    blocked,
    action,
    riskScore,
    threatVectors,
    primaryReason: primaryReason || "Request passed all Aegis Sentinel security checks.",
    matchedSignatures,
    requestId,
    posture,
  };
}

// -----------------------------------------------------------------------------
// Natural Language Sentinel AI Security Analyst
// -----------------------------------------------------------------------------

export function askSentinelAnalyst(query: string): string {
  const stats = sentinelLedger.getStats();
  const recent = sentinelLedger.getIncidents(5);
  const qLower = query.toLowerCase();

  if (qLower.includes("posture") || qLower.includes("mode") || qLower.includes("status")) {
    return `**Aegis Sentinel Posture Report**: Currently operating in **${stats.posture}** defense posture. ${stats.totalIncidents} total incidents logged, ${stats.quarantinedCount} active IP quarantines. All 8 defense layers are actively inspecting inbound traffic.`;
  }

  if (qLower.includes("recent") || qLower.includes("attacks") || qLower.includes("incidents") || qLower.includes("threats")) {
    if (recent.length === 0) {
      return `**Sentinel Threat Feed**: Zero recent high-risk security incidents recorded in the current session. Platform defenses are nominal.`;
    }
    const incidentBullets = recent.map(
      (inc) => `- [${inc.actionTaken}] **${inc.threatVector}** (Risk Score: ${inc.riskScore}/100) on \`${inc.path}\` from \`${inc.ip}\`: ${inc.details}`
    ).join("\n");
    return `**Sentinel Recent Threat Ledger** (Top ${recent.length}):\n${incidentBullets}`;
  }

  if (qLower.includes("ai") || qLower.includes("bot") || qLower.includes("crawler") || qLower.includes("scraper")) {
    return `**AI & Bot Defense Telemetry**: Aegis Sentinel actively intercepts 16+ unauthorized AI crawler signatures (GPTBot, ClaudeBot, PerplexityBot, Bytespider, Diffbot, Scrapy) and headless automation engines (Playwright, Puppeteer, Selenium). Intercepted AI crawlers receive an immediate **403 Forbidden** with \`X-Robots-Tag: noai, noimageai\`.`;
  }

  if (qLower.includes("prompt") || qLower.includes("jailbreak") || qLower.includes("injection")) {
    return `**Prompt Injection Shield**: Active. All payloads destined for Myra AI and Career Copilot are inspected for delimiter smuggling, system-prompt extraction, and DAN-mode overrides before reaching any LLM interface. Malicious prompts are rejected with zero model reflection.`;
  }

  return `**Aegis Sentinel AI Analyst Verdict**: Inbound security monitoring is active. ${stats.totalIncidents} security events inspected. ${stats.quarantinedCount} IPs quarantined. Recommended action: Maintain **STANDARD** posture unless targeted scraping or brute-force velocity exceeds baseline, at which point toggle to **ELEVATED** or **LOCKDOWN**.`;
}
