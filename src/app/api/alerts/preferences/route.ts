import { NextRequest, NextResponse } from "next/server";
import { getUserAlertPreferences, saveUserAlertPreferences } from "@/lib/alerts/multi-channel-service";
import { isFeatureEnabled } from "@/lib/feature-flags";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const isEnabled = await isFeatureEnabled("multichannel_alerts");
    if (!isEnabled) {
      return NextResponse.json({ success: false, error: "Module disabled by feature flag" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "anonymous_user";

    const preferences = await getUserAlertPreferences(userId);

    return NextResponse.json({
      success: true,
      preferences
    });
  } catch (err: any) {
    console.error("[API /api/alerts/preferences GET Error]:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch alert preferences" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isEnabled = await isFeatureEnabled("multichannel_alerts");
    if (!isEnabled) {
      return NextResponse.json({ success: false, error: "Module disabled by feature flag" }, { status: 403 });
    }

    const body = await req.json();
    const { preferences } = body;

    if (!preferences || !preferences.userId) {
      return NextResponse.json({ success: false, error: "Invalid alert preferences body" }, { status: 400 });
    }

    const ok = await saveUserAlertPreferences(preferences);
    if (!ok) {
      return NextResponse.json({ success: false, error: "Failed to persist alert preferences" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Alert preferences updated successfully."
    });
  } catch (err: any) {
    console.error("[API /api/alerts/preferences POST Error]:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal error saving preferences" }, { status: 500 });
  }
}
