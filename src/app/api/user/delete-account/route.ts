import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import { validateSession } from "@/lib/otp-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 0. Authenticate the caller strictly from session/token
    const supabaseServer = createClient();
    let authUserId: string | null = null;
    let isCallerAdmin = false;

    const { data: { user } } = await supabaseServer.auth.getUser();
    if (user) {
      authUserId = user.id;
    } else {
      const sessionToken =
        req.cookies.get("edworld_session")?.value ||
        req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
        req.headers.get("x-session-token");
      if (sessionToken) {
        const { valid, userId: sessUid } = validateSession(sessionToken);
        if (valid && sessUid) {
          authUserId = sessUid;
        }
      }
    }

    if (!authUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized: Active login session required." }, { status: 401 });
    }

    // Check if caller is platform admin (can delete on behalf with consent)
    const { data: callerProfile } = await supabase
      .from("profiles")
      .select("is_admin, role")
      .eq("id", authUserId)
      .maybeSingle();

    if (callerProfile?.is_admin || ["ADMIN", "SUPER_ADMIN", "FOUNDER"].includes(callerProfile?.role)) {
      isCallerAdmin = true;
    }

    const body = await req.json();
    const { userId, confirmationPhrase, reason } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    // Authorization check: User can only delete their OWN account unless admin
    if (authUserId !== userId && !isCallerAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You are not authorized to delete another user's account." },
        { status: 403 }
      );
    }

    if (confirmationPhrase !== "DELETE MY ACCOUNT") {
      return NextResponse.json({
        success: false,
        error: "Confirmation phrase does not match. Please type 'DELETE MY ACCOUNT' to confirm."
      }, { status: 400 });
    }

    // 1. Purge user data across application tables in compliance with DPDP Act & GDPR Right to Erasure
    try {
      await supabase.from("resumes").delete().eq("user_id", userId);
    } catch (e) {
      console.warn("[Purge Resumes Note]:", e);
    }

    try {
      await supabase.from("mock_interview_sessions").delete().eq("user_id", userId);
    } catch (e) {
      console.warn("[Purge Mock Interviews Note]:", e);
    }

    try {
      await supabase.from("user_submissions").delete().eq("user_id", userId);
    } catch (e) {
      console.warn("[Purge Submissions Note]:", e);
    }

    try {
      await supabase.from("newsletter_subscribers").delete().eq("user_id", userId);
    } catch (e) {
      console.warn("[Purge Newsletter Note]:", e);
    }

    try {
      await supabase.from("profiles").delete().eq("id", userId);
    } catch (e) {
      console.warn("[Purge Profile Note]:", e);
    }

    // 2. Insert statutory non-identifiable audit log entry
    try {
      await supabase.from("system_audit_logs").insert({
        action: "DPDP_USER_DATA_ERASURE_COMPLETED",
        actor_id: "user_self_service",
        target_id: userId,
        metadata: {
          erasure_reason: reason || "User self-service request",
          executed_at: new Date().toISOString(),
          jurisdiction: "Hyderabad, Telangana, India",
        },
      });
    } catch (e) {
      console.warn("[Audit Log Note]:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Account and associated data have been permanently erased in compliance with data privacy regulations."
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
