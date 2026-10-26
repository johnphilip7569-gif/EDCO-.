import { NextRequest, NextResponse } from "next/server";
import { 
  sentinelLedger, 
  evaluateThreat, 
  askSentinelAnalyst, 
  DefensePosture 
} from "@/lib/security/sentinel-agent";
import { getClientIp } from "@/lib/firewall/waf";

export const dynamic = "force-dynamic";

/**
 * GET /api/security/sentinel
 * Returns live Sentinel cyber-defense telemetry, recent incident logs, and quarantine state.
 */
export async function GET(req: NextRequest) {
  try {
    const stats = sentinelLedger.getStats();
    const recentIncidents = sentinelLedger.getIncidents(35);
    const quarantinedIPs = sentinelLedger.getQuarantinedIPs();

    return NextResponse.json({
      success: true,
      data: {
        stats,
        incidents: recentIncidents,
        quarantinedIPs,
        shieldStatus: "ACTIVE",
        version: "Aegis-Sentinel-v3.4-2026",
      },
    });
  } catch (err) {
    console.error("Failed to retrieve Sentinel telemetry:", err);
    return NextResponse.json(
      { success: false, error: "Internal error retrieving Sentinel telemetry" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/security/sentinel
 * Handles telemetry reports, attack simulations, natural-language analyst queries, and posture changes.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body || {};
    const clientIp = getClientIp(req);

    // 1. Client-Side Telemetry & Honeypot Trap Reporting
    if (action === "report_telemetry") {
      const { clientTelemetry, path = "/" } = body;
      const assessment = evaluateThreat({
        ip: clientIp,
        userAgent: req.headers.get("user-agent") || "",
        path,
        clientTelemetry,
      });

      return NextResponse.json({
        success: true,
        riskScore: assessment.riskScore,
        action: assessment.action,
        blocked: assessment.blocked,
      });
    }

    // 2. Interactive Attack Simulator (Admin & Security Auditing)
    if (action === "simulate_attack") {
      const { testPayload = "", testUserAgent = "", testPath = "/api/test", testIp = "198.51.100.42" } = body;
      
      const assessment = evaluateThreat({
        ip: testIp,
        userAgent: testUserAgent || req.headers.get("user-agent") || "",
        path: testPath,
        bodyText: testPayload,
      });

      return NextResponse.json({
        success: true,
        assessment,
      });
    }

    // 3. Ask Sentinel AI Security Analyst
    if (action === "ask_sentinel") {
      const { query = "" } = body;
      if (!query.trim()) {
        return NextResponse.json({ success: false, error: "Query is required." }, { status: 400 });
      }

      const response = askSentinelAnalyst(query);
      return NextResponse.json({
        success: true,
        reply: response,
      });
    }

    // 4. Update Defense Posture (STANDARD, ELEVATED, LOCKDOWN)
    if (action === "set_posture") {
      const { posture } = body;
      if (posture === "STANDARD" || posture === "ELEVATED" || posture === "LOCKDOWN") {
        sentinelLedger.setPosture(posture as DefensePosture);
        return NextResponse.json({
          success: true,
          posture: sentinelLedger.getPosture(),
        });
      }
      return NextResponse.json({ success: false, error: "Invalid posture mode." }, { status: 400 });
    }

    // 5. IP Quarantine Management
    if (action === "quarantine_ip") {
      const { ip, durationMinutes = 60, reason = "Manual Admin Quarantine" } = body;
      if (!ip) return NextResponse.json({ success: false, error: "IP is required." }, { status: 400 });
      sentinelLedger.quarantineIP(ip, durationMinutes * 60 * 1000, reason);
      return NextResponse.json({ success: true, quarantinedIP: ip });
    }

    if (action === "unquarantine_ip") {
      const { ip } = body;
      if (!ip) return NextResponse.json({ success: false, error: "IP is required." }, { status: 400 });
      sentinelLedger.unquarantineIP(ip);
      return NextResponse.json({ success: true, unquarantinedIP: ip });
    }

    // 6. Incident Triage and Clearance
    if (action === "resolve_incidents") {
      const { ids } = body;
      if (!ids || !Array.isArray(ids)) {
        return NextResponse.json({ success: false, error: "Incident IDs array is required." }, { status: 400 });
      }
      const resolvedCount = sentinelLedger.resolveIncidents(ids);
      return NextResponse.json({ success: true, resolvedCount });
    }

    if (action === "clear_incidents") {
      sentinelLedger.clearIncidents();
      return NextResponse.json({ success: true, message: "Incident ledger cleared." });
    }

    return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err) {
    console.error("Sentinel POST handler error:", err);
    return NextResponse.json({ success: false, error: "Sentinel processing failed." }, { status: 500 });
  }
}
