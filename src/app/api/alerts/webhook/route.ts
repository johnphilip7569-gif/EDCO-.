import { NextRequest, NextResponse } from "next/server";
import { dispatchMultiChannelTestAlert } from "@/lib/alerts/multi-channel-service";
import { isFeatureEnabled } from "@/lib/feature-flags";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const isEnabled = await isFeatureEnabled("multichannel_alerts");
    if (!isEnabled) {
      return NextResponse.json({ success: false, error: "Module disabled by feature flag" }, { status: 403 });
    }

    const body = await req.json();
    const { userId = "user_demo", channel = "both", targetNumber, targetChatId } = body;

    const dispatchResult = await dispatchMultiChannelTestAlert({
      userId,
      channel,
      targetNumber,
      targetChatId
    });

    return NextResponse.json({
      ...dispatchResult
    });
  } catch (err: any) {
    console.error("[API /api/alerts/webhook POST Error]:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to trigger webhook dispatcher" }, { status: 500 });
  }
}
