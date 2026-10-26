/**
 * Next.js Edge Web Application Firewall (WAF) & Aegis Sentinel Gateway
 * 
 * Provides real-time request inspection against OWASP Top 10 web injection vectors,
 * autonomous AI scrapers, headless automation frameworks, honeypot decoy probes,
 * and high-frequency velocity floods.
 */

import { NextRequest } from "next/server";
import { 
  evaluateThreat, 
  ThreatVector, 
  SentinelAssessment 
} from "@/lib/security/sentinel-agent";

export interface FirewallResult {
  blocked: boolean;
  statusCode: number;
  threatType?: "SQLI" | "XSS" | "PATH_TRAVERSAL" | "MALICIOUS_BOT" | "AI_CRAWLER" | "HONEYPOT_TRAP" | "RCE" | "SSRF" | "VELOCITY_LIMIT" | "SUSPICIOUS_PAYLOAD";
  threatVector?: ThreatVector;
  riskScore?: number;
  reason?: string;
  matchedPattern?: string;
  assessment?: SentinelAssessment;
}

/**
 * Extracts client IP from NextRequest with multi-proxy fallback
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Evaluates an incoming request through the Aegis Sentinel Security Grid
 */
export function evaluateFirewall(req: NextRequest): FirewallResult {
  const url = req.nextUrl;
  const rawUrl = req.url;
  const pathname = url.pathname;
  const userAgent = req.headers.get("user-agent") || "";
  const ip = getClientIp(req);
  const searchParams = url.searchParams;

  // Convert searchParams to Record
  const queryObj: Record<string, string> = {};
  searchParams.forEach((val, key) => {
    queryObj[key] = val;
  });

  // Collect request ID
  const requestId = req.headers.get("x-request-id") || `req-${Date.now()}`;

  // Evaluate through Sentinel AI Threat Engine
  const assessment = evaluateThreat({
    ip,
    userAgent,
    path: pathname,
    method: req.method,
    query: queryObj,
    bodyText: url.search ? decodeURIComponent(url.search) : "",
    requestId,
  });

  if (assessment.blocked) {
    const primaryVector = assessment.threatVectors[0];
    let threatType: FirewallResult["threatType"] = "SUSPICIOUS_PAYLOAD";
    let statusCode = 403;

    if (primaryVector === "HONEYPOT_TRAP") {
      threatType = "HONEYPOT_TRAP";
      statusCode = 403;
    } else if (primaryVector === "AI_AGENT_CRAWLER") {
      threatType = "AI_CRAWLER";
      statusCode = 403;
    } else if (primaryVector === "HEADLESS_AUTOMATION") {
      threatType = "MALICIOUS_BOT";
      statusCode = 403;
    } else if (primaryVector === "VELOCITY_DDOS") {
      threatType = "VELOCITY_LIMIT";
      statusCode = 429;
    } else if (primaryVector === "OWASP_EXPLOIT") {
      const matchStr = assessment.matchedSignatures.join(" ");
      if (matchStr.includes("SQLI")) threatType = "SQLI";
      else if (matchStr.includes("XSS")) threatType = "XSS";
      else if (matchStr.includes("RCE")) threatType = "RCE";
      else if (matchStr.includes("SSRF")) threatType = "SSRF";
      else if (matchStr.includes("PATH_TRAVERSAL")) threatType = "PATH_TRAVERSAL";
      statusCode = 403;
    }

    return {
      blocked: true,
      statusCode,
      threatType,
      threatVector: primaryVector,
      riskScore: assessment.riskScore,
      reason: assessment.primaryReason,
      matchedPattern: assessment.matchedSignatures[0] || "Aegis Threat Signature",
      assessment,
    };
  }

  return {
    blocked: false,
    statusCode: 200,
    assessment,
  };
}
