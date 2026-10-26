import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { DEFAULT_FROM_EMAIL, sendSignupWelcomeEmail } from "@/lib/email-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  const isKeyConfigured = Boolean(
    apiKey &&
    !apiKey.includes("placeholder") &&
    !apiKey.includes("your-key") &&
    apiKey.startsWith("re_")
  );

  return NextResponse.json({
    status: isKeyConfigured ? "configured" : "unconfigured",
    service: "Resend",
    isWorking: isKeyConfigured,
    apiKeyDetected: Boolean(apiKey),
    keyFormatValid: isKeyConfigured,
    fromEmail: DEFAULT_FROM_EMAIL,
    deliveryMode: isKeyConfigured ? "resend_api_live" : "database_audit_log_only",
    diagnostics: {
      message: isKeyConfigured
        ? "Resend API key detected and configured. Dispatches route through Resend API."
        : "RESEND_API_KEY is not configured in .env.local. Emails currently log to system_audit_logs instead of dispatching to inboxes.",
      instructions: !isKeyConfigured
        ? "To enable live email delivery: add RESEND_API_KEY=re_... to .env.local and restart the server."
        : "To verify production deliverability, ensure edworld.co.in domain DNS records (DKIM, SPF, DMARC) are validated in Resend.",
    },
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !apiKey.startsWith("re_")) {
    return NextResponse.json(
      { success: false, error: "RESEND_API_KEY not configured or invalid." },
      { status: 400 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const testRecipient = body.to || "edworld.eden@gmail.com";

    // Handle full welcome email template test
    if (body.type === "welcome") {
      const welcomeResult = await sendSignupWelcomeEmail({
        email: testRecipient,
        name: body.name || "Test Student",
        careerStage: body.careerStage || "college",
      });

      return NextResponse.json({
        success: welcomeResult.success,
        template: "signup_welcome",
        messageId: welcomeResult.id,
        recipient: testRecipient,
        fromEmail: DEFAULT_FROM_EMAIL,
        error: welcomeResult.error,
      });
    }

    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [testRecipient],
      subject: "EdWorld Co. - Resend Integration Test",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
          <h2 style="color: #111827;">Resend Verification Successful</h2>
          <p style="color: #6B7280;">This email confirms that Resend API dispatch is operational for EdWorld Co.</p>
          <p><strong>From:</strong> ${DEFAULT_FROM_EMAIL}</p>
          <p><strong>To:</strong> ${testRecipient}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
      `,
    });

    if (result.error) {
      return NextResponse.json({
        success: false,
        error: result.error,
        fromEmail: DEFAULT_FROM_EMAIL,
        recipient: testRecipient,
        note: result.error.message?.includes("domain")
          ? "The domain edworld.co.in needs DNS verification in Resend dashboard. For testing before DNS verifies, you can temporarily set RESEND_FROM_EMAIL='onboarding@resend.dev' in .env.local."
          : result.error.message,
      }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      messageId: result.data?.id,
      fromEmail: DEFAULT_FROM_EMAIL,
      recipient: testRecipient,
      status: "delivered_to_resend",
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || String(err),
    }, { status: 500 });
  }
}
