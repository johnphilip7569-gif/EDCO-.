import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getDbPool } from "@/lib/db-server";
import { sendEmailNotification } from "@/lib/email-service";
import { renderPasswordResetEmail } from "@/lib/email-templates";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!rawEmail || !emailRegex.test(rawEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const pool = getDbPool();

    // 1. Check if user exists in auth.users
    const userRes = await pool.query(
      `SELECT u.id, u.email, u.raw_user_meta_data, p.name 
       FROM auth.users u
       LEFT JOIN public.profiles p ON p.id = u.id
       WHERE LOWER(u.email) = LOWER($1)
       LIMIT 1`,
      [rawEmail]
    );

    const user = userRes.rows[0];

    // If user does not exist in the database, notify caller clearly
    if (!user) {
      return NextResponse.json({
        success: true,
        accountExists: false,
        message: "If an account exists with this email address, a password recovery link has been sent.",
      });
    }

    // User exists: generate cryptographically secure token & dispatch email
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    // Invalidate existing unused tokens for this email
    await pool.query(
      `UPDATE public.password_reset_tokens 
       SET used = true 
       WHERE email = $1 AND used = false`,
      [user.email]
    );

    // Insert new token with 1 hour expiration
    await pool.query(
      `INSERT INTO public.password_reset_tokens 
       (user_id, email, token_hash, expires_at, used) 
       VALUES ($1, $2, $3, NOW() + INTERVAL '1 hour', false)`,
      [user.id, user.email, tokenHash]
    );

    // Resolve base origin for the reset link
    const origin = req.headers.get("origin") || req.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${origin}/auth/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

    // Resolve user's display name
    const meta = user.raw_user_meta_data || {};
    const displayName = user.name || meta.full_name || meta.name || user.email.split("@")[0] || "Learner";

    // 1. Channel A: Dispatch via Resend
    const emailHtml = renderPasswordResetEmail({
      name: displayName,
      resetLink,
      expiresIn: "1 hour",
    });

    try {
      await sendEmailNotification({
        to: user.email,
        subject: "Reset your EdWorld Co. account password",
        html: emailHtml,
        category: "auth",
        metadata: {
          action: "PASSWORD_RESET_REQUEST",
          userId: user.id,
        },
      });
    } catch (emailErr) {
      console.warn("[Password Reset Resend Dispatch Note]:", emailErr);
    }

    // 2. Channel B: Dispatch via Supabase Native Auth Mailer as verified fallback
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wgyscapdywroefsjenno.supabase.co";
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
      if (supabaseUrl && supabaseAnonKey) {
        const supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey);
        await supabaseAuthClient.auth.resetPasswordForEmail(user.email, {
          redirectTo: `${origin}/auth/reset-password`,
        });
      }
    } catch (sbErr) {
      console.warn("[Supabase Auth Mailer Reset Note]:", sbErr);
    }

    // Log recovery link to console for immediate developer access in testing
    console.log(`\n======================================================`);
    console.log(`[PASSWORD RECOVERY LINK DISPATCHED]`);
    console.log(`Target Email: ${user.email}`);
    console.log(`Reset URL:    ${resetLink}`);
    console.log(`======================================================\n`);

    const isDev = process.env.NODE_ENV !== "production" || origin.includes("localhost") || origin.includes("127.0.0.1");

    return NextResponse.json({
      success: true,
      accountExists: true,
      devResetUrl: isDev ? resetLink : undefined,
      message: "If an account exists with this email address, a password recovery link has been sent.",
    });
  } catch (err: any) {
    console.error("[Forgot Password API Error]:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
