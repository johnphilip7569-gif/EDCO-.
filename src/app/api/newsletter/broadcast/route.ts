import { NextRequest, NextResponse } from "next/server";
import { broadcastToSubscribers } from "@/lib/email-service";
import { createClient } from "@/lib/supabase/server";
import { validateSession } from "@/lib/otp-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    let authUserId: string | null = null;
    let isAuthorized = false;

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      authUserId = user.id;
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin, role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.is_admin || ["ADMIN", "SUPER_ADMIN", "FOUNDER", "EXECUTIVE"].includes(profile?.role)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      const sessionCookie = req.cookies.get("edworld_session")?.value;
      if (sessionCookie) {
        const { valid, role, userId: sUid } = validateSession(sessionCookie);
        if (valid && ["ADMIN", "SUPER_ADMIN", "FOUNDER", "EXECUTIVE"].includes(role || "")) {
          isAuthorized = true;
          authUserId = sUid || "admin-session";
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Elevated administrator role required to broadcast emails." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { subject, title, contentHtml, ctaText, ctaUrl } = body;

    if (!subject || !title || !contentHtml) {
      return NextResponse.json(
        { success: false, error: "Subject, title, and contentHtml are required." },
        { status: 400 }
      );
    }

    const result = await broadcastToSubscribers({
      subject,
      title,
      contentHtml,
      ctaText,
      ctaUrl,
      sentByUserId: authUserId || "admin-system",
    });

    return NextResponse.json({
      success: result.success,
      totalSent: result.totalSent,
      failedCount: result.failedCount,
      subscribersCount: result.subscribersCount,
      message: `Broadcast completed. Sent to ${result.totalSent} subscribers.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to broadcast newsletter" },
      { status: 500 }
    );
  }
}
