import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const requestId = req.headers.get("x-request-id") || `req-${Date.now()}`;

  // Internal token check — detailed health info only for authorized internal consumers
  const healthToken = process.env.HEALTH_CHECK_TOKEN;
  const providedToken = req.headers.get("x-health-token");
  const isInternalRequest = !!healthToken && providedToken === healthToken;

  // 1. Secrets check (only computed — not exposed publicly)
  const criticalSecrets = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ];
  const missingSecrets = criticalSecrets.filter((s) => !process.env[s]);
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NODE_ENV === "production") {
    missingSecrets.push("SUPABASE_SERVICE_ROLE_KEY");
  }

  // 2. Database ping check
  let dbStatus: "pass" | "fail" = "pass";
  let dbLatency = 0;
  let dbErrorMessage: string | null = null;

  try {
    const dbStart = Date.now();
    const { error: dbError } = await supabase.from("profiles").select("id").limit(1);
    dbLatency = Date.now() - dbStart;

    if (dbError) {
      dbStatus = "fail";
      dbErrorMessage = dbError.message;
    }
  } catch (err: any) {
    dbStatus = "fail";
    dbErrorMessage = err?.message || "DB ping failed";
  }

  // 3. Cache check
  const cacheStatus = process.env.REDIS_URL ? "pass" : "not_configured";

  // Determine overall status
  const isHealthy = dbStatus === "pass" && missingSecrets.length === 0;
  const isDegraded = dbStatus === "pass" && missingSecrets.length > 0;
  const overallStatus: "healthy" | "degraded" | "unhealthy" = isHealthy
    ? "healthy"
    : isDegraded
    ? "degraded"
    : "unhealthy";

  const statusCode = overallStatus === "unhealthy" ? 503 : 200;

  // Public response payload with safe operational checks
  const publicPayload = {
    status: overallStatus,
    service: "edworld",
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || process.env.npm_package_version || "1.0.0",
    uptime_seconds: Math.round(process.uptime ? process.uptime() : 0),
    request_id: requestId,
    total_latency_ms: Date.now() - startTime,
    checks: {
      database: {
        status: dbStatus,
        latency_ms: dbLatency,
        ...(isInternalRequest && dbErrorMessage ? { error: dbErrorMessage } : {}),
      },
      cache: {
        status: cacheStatus,
        latency_ms: 0,
      },
      secrets: {
        status: missingSecrets.length === 0 ? "pass" : "fail",
        missing: isInternalRequest ? missingSecrets : [],
      },
    },
  };

  return NextResponse.json(publicPayload, {
    status: statusCode,
    headers: {
      "x-request-id": requestId,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}

