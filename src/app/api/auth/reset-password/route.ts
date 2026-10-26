import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getDbPool } from "@/lib/db-server";
import { sendEmailNotification } from "@/lib/email-service";
import { renderPasswordChangedConfirmationEmail } from "@/lib/email-templates";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawToken = typeof body.token === "string" ? body.token.trim() : "";
    const rawEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

    if (!rawToken || !rawEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required token or email parameter." },
        { status: 400 }
      );
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      return NextResponse.json(
        { success: false, error: "Password must contain at least one uppercase letter, one lowercase letter, and one number." },
        { status: 400 }
      );
    }

    const pool = getDbPool();
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    // 1. Verify token existence, email match, and unused state
    const tokenRes = await pool.query(
      `SELECT id, user_id, email, expires_at, used
       FROM public.password_reset_tokens
       WHERE token_hash = $1 
         AND LOWER(email) = LOWER($2)
       ORDER BY created_at DESC
       LIMIT 1`,
      [tokenHash, rawEmail]
    );

    const tokenRecord = tokenRes.rows[0];

    if (!tokenRecord) {
      return NextResponse.json(
        { success: false, error: "Invalid password reset link. Please request a new one." },
        { status: 400 }
      );
    }

    if (tokenRecord.used) {
      return NextResponse.json(
        { success: false, error: "This password reset link has already been used. Please request a new link." },
        { status: 400 }
      );
    }

    const expiresAt = new Date(tokenRecord.expires_at).getTime();
    if (Date.now() > expiresAt) {
      return NextResponse.json(
        { success: false, error: "This password reset link has expired. Links are valid for 1 hour." },
        { status: 400 }
      );
    }

    // 2. Update user's password in auth.users using pgcrypto Blowfish crypt
    await pool.query(
      `UPDATE auth.users 
       SET encrypted_password = crypt($1, gen_salt('bf', 10)),
           updated_at = NOW()
       WHERE id = $2`,
      [newPassword, tokenRecord.user_id]
    );

    // 3. Mark token as consumed
    await pool.query(
      `UPDATE public.password_reset_tokens 
       SET used = true 
       WHERE id = $1`,
      [tokenRecord.id]
    );

    // 4. Fetch display name for confirmation email
    const profileRes = await pool.query(
      `SELECT name FROM public.profiles WHERE id = $1`,
      [tokenRecord.user_id]
    );
    const displayName = profileRes.rows[0]?.name || tokenRecord.email.split("@")[0] || "Learner";

    // 5. Send confirmation email via Resend
    try {
      const confirmationHtml = renderPasswordChangedConfirmationEmail({
        name: displayName,
      });

      await sendEmailNotification({
        to: tokenRecord.email,
        subject: "Your EdWorld Co. account password has been updated",
        html: confirmationHtml,
        category: "auth",
        metadata: {
          action: "PASSWORD_CHANGED_NOTIFICATION",
          userId: tokenRecord.user_id,
        },
      });
    } catch (emailErr) {
      console.warn("[Password Reset Confirmation Email Note]:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Your password has been successfully reset. You may now sign in.",
    });
  } catch (err: any) {
    console.error("[Reset Password API Error]:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while resetting your password." },
      { status: 500 }
    );
  }
}
