import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/server-role-guard";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") || `req-${Date.now()}`;
  try {
    const { data: flags, error } = await supabase
      .from("feature_flags")
      .select("*")
      .order("key", { ascending: true });

    if (error) {
      // In case table or connection has an issue, failsafe default is Coming Soon (site_launched = false)
      return NextResponse.json({
        success: true,
        isSiteLaunched: false,
        flags: [
          {
            key: "site_launched",
            enabled: false,
            description: "Controls whether the full landing page features are visible vs Coming Soon mode",
            rollout_percentage: 100,
          },
        ],
      });
    }

    const flagList = flags || [];
    const siteLaunchedFlag = flagList.find((f: any) => f.key === "site_launched");

    // If site_launched is not in the database yet, default is false (Coming Soon active)
    const isSiteLaunched = siteLaunchedFlag ? Boolean(siteLaunchedFlag.enabled) : false;

    if (!siteLaunchedFlag) {
      flagList.push({
        key: "site_launched",
        enabled: false,
        description: "Controls whether the full landing page features are visible vs Coming Soon mode",
        rollout_percentage: 100,
      });
    }

    return NextResponse.json({
      success: true,
      isSiteLaunched,
      flags: flagList,
      request_id: requestId,
    });
  } catch (err: any) {
    logger.warn("[feature-flags GET Warning]:", { error: err?.message, request_id: requestId });
    return NextResponse.json({
      success: true,
      isSiteLaunched: false,
      flags: [
        {
          key: "site_launched",
          enabled: false,
          description: "Controls whether the full landing page features are visible vs Coming Soon mode",
          rollout_percentage: 100,
        },
      ],
      request_id: requestId,
    });
  }
}

export async function POST(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") || `req-${Date.now()}`;
  try {
    // Restrict flag updates to ADMIN, SUPER_ADMIN, and FOUNDER
    const authCheck = await requireRole(req, ["ADMIN", "SUPER_ADMIN", "FOUNDER"]);
    if (!authCheck.authorized) {
      return NextResponse.json(
        {
          success: false,
          error: authCheck.error || "Forbidden: Only administrators can modify platform launch and feature flags.",
          request_id: requestId,
        },
        { status: authCheck.statusCode || 403 }
      );
    }

    const body = await req.json();
    const { key, enabled, rolloutPercentage = 100, description } = body;

    if (!key) {
      return NextResponse.json({ error: "Flag key is required.", request_id: requestId }, { status: 400 });
    }

    const serverClient = createClient();
    const { data: flag, error } = await serverClient
      .from("feature_flags")
      .upsert({
        key,
        enabled: Boolean(enabled),
        rollout_percentage: rolloutPercentage,
        description: description || `Feature flag: ${key}`,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // Fallback try with base client
      const { data: fallbackFlag, error: fallbackError } = await supabase
        .from("feature_flags")
        .upsert({
          key,
          enabled: Boolean(enabled),
          rollout_percentage: rolloutPercentage,
          description: description || `Feature flag: ${key}`,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (fallbackError) {
        return NextResponse.json({ error: fallbackError.message, request_id: requestId }, { status: 500 });
      }

      logger.info(`[Feature Flag Updated]: ${key} = ${enabled}`, {
        actor: authCheck.user?.email,
        key,
        enabled,
        request_id: requestId,
      });

      return NextResponse.json({
        success: true,
        flag: fallbackFlag,
        request_id: requestId,
      });
    }

    logger.info(`[Feature Flag Updated]: ${key} = ${enabled}`, {
      actor: authCheck.user?.email,
      key,
      enabled,
      request_id: requestId,
    });

    return NextResponse.json({
      success: true,
      flag,
      request_id: requestId,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, request_id: requestId }, { status: 500 });
  }
}
