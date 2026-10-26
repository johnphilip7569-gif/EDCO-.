import { NextRequest, NextResponse } from "next/server";
import { analyzeJobOffer, SAMPLE_SCAM_PRESETS } from "@/lib/scam-checker/scam-detector";
import { isFeatureEnabled } from "@/lib/feature-flags";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const isEnabled = await isFeatureEnabled("scam_offer_checker");
    if (!isEnabled) {
      return NextResponse.json({ success: false, error: "Module disabled by feature flag" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      presets: SAMPLE_SCAM_PRESETS,
      verifiedAdvice: [
        "No verified Fortune 500 or Indian IT major (TCS, Infosys, Wipro, Google, Microsoft) requests security deposits.",
        "Check MCA master data for registered corporate email and official directors.",
        "Report cyber fraud to National Cyber Crime Reporting Portal at 1930 or cybercrime.gov.in."
      ]
    });
  } catch (error: any) {
    console.error("[API /api/scam-checker GET Error]:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isEnabled = await isFeatureEnabled("scam_offer_checker");
    if (!isEnabled) {
      return NextResponse.json({ success: false, error: "Module disabled by feature flag" }, { status: 403 });
    }

    const body = await req.json();
    const { text, companyName, contactEmail, userId } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Job description or offer letter text is required for analysis." },
        { status: 400 }
      );
    }

    const analysis = await analyzeJobOffer({
      text,
      companyName,
      contactEmail,
      userId
    });

    return NextResponse.json({
      success: true,
      data: analysis
    });
  } catch (error: any) {
    console.error("[API /api/scam-checker POST Error]:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to inspect offer" }, { status: 500 });
  }
}
