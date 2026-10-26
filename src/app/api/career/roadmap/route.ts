import { NextRequest, NextResponse } from "next/server";
import { 
  generateCareerRoadmap, 
  getActiveCareerRoadmap, 
  toggleRoadmapMilestone,
  TARGET_ROLE_OPTIONS 
} from "@/lib/career/roadmap-generator";
import { isFeatureEnabled } from "@/lib/feature-flags";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const isEnabled = await isFeatureEnabled("ai_career_roadmap");
    if (!isEnabled) {
      return NextResponse.json({ success: false, error: "Module disabled by feature flag" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "guest_user";

    const roadmap = await getActiveCareerRoadmap(userId);

    return NextResponse.json({
      success: true,
      roadmap,
      targetRoles: TARGET_ROLE_OPTIONS
    });
  } catch (err: any) {
    console.error("[API /api/career/roadmap GET Error]:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch career roadmap" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isEnabled = await isFeatureEnabled("ai_career_roadmap");
    if (!isEnabled) {
      return NextResponse.json({ success: false, error: "Module disabled by feature flag" }, { status: 403 });
    }

    const body = await req.json();
    const { userId = "guest_user", targetRole, currentLevel, academicYear } = body;

    if (!targetRole) {
      return NextResponse.json({ success: false, error: "targetRole is required" }, { status: 400 });
    }

    const roadmap = await generateCareerRoadmap({
      userId,
      targetRole,
      currentLevel,
      academicYear
    });

    return NextResponse.json({
      success: true,
      roadmap
    });
  } catch (err: any) {
    console.error("[API /api/career/roadmap POST Error]:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to generate roadmap" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const isEnabled = await isFeatureEnabled("ai_career_roadmap");
    if (!isEnabled) {
      return NextResponse.json({ success: false, error: "Module disabled by feature flag" }, { status: 403 });
    }

    const body = await req.json();
    const { milestoneId, isCompleted, userId = "guest_user" } = body;

    if (!milestoneId) {
      return NextResponse.json({ success: false, error: "milestoneId is required" }, { status: 400 });
    }

    const ok = await toggleRoadmapMilestone({
      milestoneId,
      isCompleted: Boolean(isCompleted),
      userId
    });

    return NextResponse.json({
      success: ok
    });
  } catch (err: any) {
    console.error("[API /api/career/roadmap PATCH Error]:", err);
    return NextResponse.json({ success: false, error: "Failed to update milestone" }, { status: 500 });
  }
}
