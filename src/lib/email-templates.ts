/**
 * Centralized Branded Email Template Generator
 * Follows EdWorld Co. strict two-color visual standard:
 * Single-column responsive HTML layout, pure white background (#ffffff),
 * pure black foreground (#000000), structural hairline borders (#e5e5e5),
 * and high-contrast solid black CTAs.
 */

export interface EmailLayoutProps {
  previewText: string;
  title: string;
  contentHtml: string;
  ctaText?: string;
  ctaUrl?: string;
  footerNote?: string;
  logoUrl?: string;
}

export function renderBrandedEmailHtml(props: EmailLayoutProps): string {
  const { previewText, title, contentHtml, ctaText, ctaUrl, footerNote } = props;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://edworld.co.in";
  const defaultLogoUrl = `${appUrl}/images/edworld-logo.png`;
  const logoUrl = props.logoUrl || defaultLogoUrl;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F7F8FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827; }
    .wrapper { width: 100%; max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #E5E7EB; }
    .header { padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #E5E7EB; background-color: #ffffff; }
    .logo-img { display: block; margin: 0 auto 10px; max-width: 140px; height: auto; border: 0; }
    .logo-text { font-size: 20px; font-weight: 800; color: #111827; letter-spacing: -0.4px; }
    .body-content { padding: 32px; font-size: 14px; line-height: 1.6; color: #374151; background-color: #ffffff; }
    .body-content h1 { font-size: 20px; font-weight: 800; color: #111827; margin-top: 0; margin-bottom: 16px; }
    .body-content p { margin-bottom: 16px; }
    .body-content strong { color: #111827; }
    .cta-container { text-align: center; margin: 32px 0 16px; }
    .cta-button { display: inline-block; background-color: #2563EB; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
    .footer { padding: 24px 32px; text-align: center; font-size: 11px; color: #6B7280; border-top: 1px solid #E5E7EB; background-color: #F7F8FA; }
    .footer a { color: #4B5563; text-decoration: underline; }
  </style>
</head>
<body>
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${previewText}
  </div>
  <table width="100%" border="0" cellspacing="0" cellpadding="24" style="background-color: #F7F8FA;">
    <tr>
      <td align="center">
        <div class="wrapper">
          <div class="header">
            <a href="${appUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
              <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 12px;">
                <tr>
                  <td align="center" valign="middle" style="background-color: #000000; border-radius: 18px; width: 68px; height: 68px; padding: 10px;">
                    <img src="${logoUrl}" alt="EdWorld Co. Logo" width="48" height="48" style="display: block; border: 0; outline: none; width: 48px; height: 48px; object-fit: contain;" />
                  </td>
                </tr>
              </table>
            </a>
            <div class="logo-text">EdWorld Co.</div>
            <div style="font-size: 10px; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">Study &amp; Career Acceleration</div>
          </div>
          <div class="body-content">
            <h1>${title}</h1>
            ${contentHtml}
            ${ctaText && ctaUrl ? `
              <div class="cta-container">
                <a href="${ctaUrl}" class="cta-button" target="_blank">${ctaText}</a>
              </div>
            ` : ""}
          </div>
          <div class="footer">
            <p>${footerNote || "You received this email because of your verified account on Edworld Co."}</p>
            <p>EdWorld Co. &bull; Operating Headquarters: Hyderabad, Telangana 500081, India</p>
            <p>Support &amp; Grievance Redressal: <a href="mailto:edworld.eden@gmail.com">edworld.eden@gmail.com</a></p>
            <p>
              &copy; ${new Date().getFullYear()} EdWorld Co. All rights reserved. &bull; 
              <a href="${appUrl}/privacy">Privacy Policy</a> &bull; 
              <a href="${appUrl}/terms">Terms</a> &bull; 
              <a href="${appUrl}/refund">Refunds</a> &bull; 
              <a href="${appUrl}/newsletter/unsubscribe" style="color: #737373; text-decoration: underline;">Unsubscribe</a>
            </p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generates branded email for Ambassador Approval notification
 */
export function renderAmbassadorApprovedEmail(params: { name: string; collegeName: string; referralCode: string }): string {
  return renderBrandedEmailHtml({
    previewText: "Congratulations! You are officially an EdWorld Campus Ambassador.",
    title: "Welcome to the EdWorld Campus Ambassador Program",
    contentHtml: `
      <p>Hi <strong>${params.name}</strong>,</p>
      <p>We are excited to inform you that your application to represent <strong>${params.collegeName}</strong> has been reviewed and <strong>approved</strong>.</p>
      <div style="background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 12px; padding: 18px; margin: 20px 0; text-align: center;">
        <div style="font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 1px;">Your Exclusive Campus Referral Code</div>
        <div style="font-size: 22px; font-weight: 900; color: #000000; font-family: monospace; margin-top: 6px;">${params.referralCode}</div>
      </div>
      <p>You can now access your Ambassador Resource Hub to share materials and track signups in real time.</p>
    `,
    ctaText: "Open Ambassador Hub",
    ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://edworldco.in"}/ambassador/hub`,
  });
}

/**
 * Generates branded email for Mock Interview Performance Scorecard
 */
export function renderInterviewScorecardEmail(params: { name: string; sessionTitle: string; overallScore: number; sessionId: string }): string {
  return renderBrandedEmailHtml({
    previewText: `Your scorecard for ${params.sessionTitle} is now available.`,
    title: "Your Mock Interview Performance Summary",
    contentHtml: `
      <p>Hi <strong>${params.name}</strong>,</p>
      <p>Your mock interview session <strong>${params.sessionTitle}</strong> has been evaluated.</p>
      <div style="background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 12px; padding: 18px; margin: 20px 0; text-align: center;">
        <div style="font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 1px;">Overall Performance Score</div>
        <div style="font-size: 32px; font-weight: 900; color: #000000; margin-top: 4px;">${params.overallScore} <span style="font-size: 16px; color: #737373;">/ 100</span></div>
      </div>
      <p>Review your detailed question-by-question breakdown, speech pacing analysis, and STAR answer models.</p>
    `,
    ctaText: "View Full Scorecard",
    ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://edworldco.in"}/interviews/results/${params.sessionId}`,
  });
}

/**
 * Generates branded email when someone receives a connection request
 */
export function renderConnectionRequestReceivedEmail(params: {
  recipientName: string;
  requesterName: string;
  requesterHeadline?: string;
  requesterCollegeOrCompany?: string;
  message?: string;
}): string {
  return renderBrandedEmailHtml({
    previewText: `${params.requesterName} wants to connect with you on EdWorld Co.`,
    title: "New Connection Request",
    contentHtml: `
      <p>Hi <strong>${params.recipientName}</strong>,</p>
      <p><strong>${params.requesterName}</strong> sent you a connection request on EdWorld Co.</p>
      
      <div style="background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 12px; padding: 18px; margin: 20px 0;">
        <div style="font-size: 16px; font-weight: 800; color: #000000;">${params.requesterName}</div>
        ${params.requesterHeadline ? `<div style="font-size: 13px; color: #525252; margin-top: 2px;">${params.requesterHeadline}</div>` : ""}
        ${params.requesterCollegeOrCompany ? `<div style="font-size: 12px; color: #737373; margin-top: 4px; font-family: monospace;">${params.requesterCollegeOrCompany}</div>` : ""}
        ${params.message ? `
          <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #e5e5e5; font-size: 13px; font-style: italic; color: #404040;">
            &ldquo;${params.message}&rdquo;
          </div>
        ` : ""}
      </div>
      
      <p>Connect with peers and engineers to collaborate on technical projects and expand your verified network.</p>
    `,
    ctaText: "Review & Respond to Request",
    ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://edworldco.in"}/network`,
  });
}

/**
 * Generates branded email when a connection request is accepted
 */
export function renderConnectionAcceptedEmail(params: {
  recipientName: string;
  accepterName: string;
  accepterHeadline?: string;
  accepterCollegeOrCompany?: string;
}): string {
  return renderBrandedEmailHtml({
    previewText: `${params.accepterName} accepted your connection request on EdWorld Co.`,
    title: "Connection Request Accepted",
    contentHtml: `
      <p>Hi <strong>${params.recipientName}</strong>,</p>
      <p><strong>${params.accepterName}</strong> has accepted your connection request.</p>
      
      <div style="background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 12px; padding: 18px; margin: 20px 0;">
        <div style="font-size: 16px; font-weight: 800; color: #000000;">${params.accepterName}</div>
        ${params.accepterHeadline ? `<div style="font-size: 13px; color: #525252; margin-top: 2px;">${params.accepterHeadline}</div>` : ""}
        ${params.accepterCollegeOrCompany ? `<div style="font-size: 12px; color: #737373; margin-top: 4px; font-family: monospace;">${params.accepterCollegeOrCompany}</div>` : ""}
      </div>
      
      <p>You are now connected in the EdWorld Co. network. You can view their public profile and send direct messages.</p>
    `,
    ctaText: "View Network & Profile",
    ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://edworldco.in"}/network`,
  });
}

/**
 * Generates branded email for Password Reset Recovery Link
 */
export function renderPasswordResetEmail(params: {
  name: string;
  resetLink: string;
  expiresIn?: string;
}): string {
  const expiry = params.expiresIn || "1 hour";
  return renderBrandedEmailHtml({
    previewText: "Reset your EdWorld Co. account password",
    title: "Reset Your Password",
    contentHtml: `
      <p>Hi <strong>${params.name}</strong>,</p>
      <p>We received a request to reset the password for your EdWorld Co. account.</p>
      <p>Click the button below to choose a new password. For security reasons, this link will expire in <strong>${expiry}</strong>.</p>
      <div style="background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 12px; padding: 14px; margin: 20px 0; font-size: 12px; color: #737373;">
        <strong>Security Notice:</strong> If you did not request a password reset, you can safely disregard this email. Your account password will remain unchanged.
      </div>
    `,
    ctaText: "Reset Password",
    ctaUrl: params.resetLink,
    footerNote: "This link was generated securely upon request from the EdWorld Co. account recovery system.",
  });
}

/**
 * Generates branded email confirming password update
 */
export function renderPasswordChangedConfirmationEmail(params: {
  name: string;
}): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://edworldco.in";
  return renderBrandedEmailHtml({
    previewText: "Your EdWorld Co. account password was successfully updated",
    title: "Password Updated Successfully",
    contentHtml: `
      <p>Hi <strong>${params.name}</strong>,</p>
      <p>This is a confirmation that the password for your EdWorld Co. account was recently changed.</p>
      <p>If you made this change, no further action is required.</p>
      <div style="background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 12px; padding: 14px; margin: 20px 0; font-size: 12px; color: #737373;">
        <strong>Did not make this change?</strong> Please contact support immediately at <a href="mailto:edworld.eden@gmail.com" style="color: #000000; text-decoration: underline;">edworld.eden@gmail.com</a> to secure your account.
      </div>
    `,
    ctaText: "Sign In to Your Account",
    ctaUrl: `${appUrl}/auth/login`,
    footerNote: "Automated account security alert from EdWorld Co.",
  });
}

/**
 * Generates custom branded email for newly signed-up users
 * Features official EdWorld Co. logo, student greeting, 3 core pillars, and dashboard CTA.
 */
export function renderSignupWelcomeEmail(params: {
  name: string;
  email: string;
  careerStage?: string;
}): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://edworld.co.in";
  const dashboardUrl = `${appUrl}/dashboard`;
  const firstName = params.name ? params.name.trim().split(" ")[0] : "Learner";

  return renderBrandedEmailHtml({
    previewText: `Welcome to EdWorld Co., ${firstName}! Your study schedule and career roadmap are ready.`,
    title: `Welcome to EdWorld Co., ${firstName}!`,
    contentHtml: `
      <p style="font-size: 15px; color: #111827; line-height: 1.6; margin-top: 0;">
        Hi <strong>${firstName}</strong>,
      </p>
      <p style="font-size: 14px; color: #4B5563; line-height: 1.6;">
        Welcome to <strong>EdWorld Co.</strong> — your all-in-one ecosystem for academic discipline, exam readiness, and career acceleration. We're thrilled to have you in the community.
      </p>

      <div style="background-color: #F7F8FA; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 14px;">
          <tr>
            <td valign="middle" style="background-color: #000000; border-radius: 10px; width: 36px; height: 36px; text-align: center; padding: 4px;">
              <img src="${appUrl}/images/edworld-logo.png" alt="EdWorld Logo" width="28" height="28" style="display: block; margin: 0 auto; object-fit: contain;" />
            </td>
            <td valign="middle" style="padding-left: 12px;">
              <span style="font-size: 11px; font-weight: 700; color: #2563EB; text-transform: uppercase; letter-spacing: 1px; display: block;">What's Waiting In Your Workspace</span>
              <span style="font-size: 13px; font-weight: 800; color: #111827; display: block;">EdWorld Unified Learning Operating System</span>
            </td>
          </tr>
        </table>
        
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; color: #374151;">
          <tr>
            <td style="padding: 10px 0; vertical-align: top; width: 32px; font-size: 18px;">📅</td>
            <td style="padding: 10px 0;">
              <strong style="color: #111827; font-size: 14px;">Personalized Study Timetable</strong><br />
              <span style="color: #6B7280; font-size: 12px; line-height: 1.4; display: block; margin-top: 2px;">
                Daily smart schedule calibrated to your academic year, target exams, and available study hours (2h, 3h, 4.5h/day) with interactive task tracking.
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; vertical-align: top; width: 32px; font-size: 18px;">🎯</td>
            <td style="padding: 10px 0;">
              <strong style="color: #111827; font-size: 14px;">Career Trajectory &amp; Milestones</strong><br />
              <span style="color: #6B7280; font-size: 12px; line-height: 1.4; display: block; margin-top: 2px;">
                Choose your target specialization (Software Engineering, AI/ML, Cloud DevOps, Product Management, etc.) and master industry-verified competencies.
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; vertical-align: top; width: 32px; font-size: 18px;">🤖</td>
            <td style="padding: 10px 0;">
              <strong style="color: #111827; font-size: 14px;">Myra AI Mentor</strong><br />
              <span style="color: #6B7280; font-size: 12px; line-height: 1.4; display: block; margin-top: 2px;">
                Your 24/7 AI guide to build realistic timetables, recover from backlogs, prepare for mocks, and resolve doubts with honest, practical steps.
              </span>
            </td>
          </tr>
        </table>
      </div>

      <div style="background-color: #FFFFFF; border: 1px dashed #D1D5DB; border-radius: 10px; padding: 16px; margin: 20px 0;">
        <div style="font-size: 12px; font-weight: 700; color: #111827; margin-bottom: 8px;">
          Next Steps to Kickstart Your Learning:
        </div>
        <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #4B5563; line-height: 1.6;">
          <li>Review today's time blocks on your <strong>Personalized Timetable</strong>.</li>
          <li>Confirm your active <strong>Target Career Path</strong> on your dashboard.</li>
          <li>Ask <strong>Myra AI</strong> to adjust your weekly schedule for your target exam or interview.</li>
        </ol>
      </div>

      <p style="font-size: 13px; color: #6B7280; line-height: 1.5; margin-top: 20px;">
        If you ever need any help, simply reply to this email or reach our support team anytime at <a href="mailto:edworld.eden@gmail.com" style="color: #2563EB; text-decoration: underline;">edworld.eden@gmail.com</a>.
      </p>
    `,
    ctaText: "Go to Your Dashboard",
    ctaUrl: dashboardUrl,
    footerNote: `This welcome email was sent to ${params.email} upon creating an account on EdWorld Co.`,
  });
}

/**
 * Generates custom branded email for EdBuild project completion & certificate issuance
 */
export function renderProjectCompletionCertificateEmail(params: {
  studentName: string;
  projectName: string;
  certificateUrl: string;
  certificateCode: string;
}): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://edworld.co.in";
  const firstName = params.studentName ? params.studentName.trim().split(" ")[0] : "Learner";

  return renderBrandedEmailHtml({
    previewText: `Congratulations ${firstName}! Your Certificate of Completion for "${params.projectName}" is ready.`,
    title: `Official Certificate of Completion: ${params.projectName}`,
    contentHtml: `
      <p style="font-size: 15px; color: #111827; line-height: 1.6; margin-top: 0;">
        Dear <strong>${firstName}</strong>,
      </p>
      <p style="font-size: 14px; color: #4B5563; line-height: 1.6;">
        We are thrilled to inform you that your engineering team submission for <strong>${params.projectName}</strong> has been officially reviewed and <strong style="color: #059669;">ACCEPTED</strong> by the EdWorld Co. evaluation team!
      </p>
      
      <div style="background-color: #F7F8FA; border: 1px solid #E5E7EB; border-radius: 12px; padding: 22px; margin: 24px 0; text-align: center;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 12px;">
          <tr>
            <td align="center" valign="middle" style="background-color: #000000; border-radius: 14px; width: 52px; height: 52px; padding: 8px;">
              <img src="${appUrl}/images/edworld-logo.png" alt="EdWorld Seal" width="36" height="36" style="display: block; border: 0; outline: none; object-fit: contain;" />
            </td>
          </tr>
        </table>
        <div style="font-size: 11px; font-weight: 700; color: #2563EB; text-transform: uppercase; letter-spacing: 1.5px;">
          Verified Credential Issued
        </div>
        <div style="font-size: 18px; font-weight: 800; color: #111827; margin: 8px 0 4px;">
          Certificate of Completion &amp; Participation
        </div>
        <div style="font-size: 12px; font-family: monospace; color: #6B7280;">
          Credential ID: <strong style="color: #111827;">${params.certificateCode}</strong>
        </div>
      </div>

      <p style="font-size: 14px; color: #4B5563; line-height: 1.6;">
        In recognition of your dedication, consistent teamwork, and technical execution, we proudly present your official certificate signed by our founder.
      </p>

      <blockquote style="margin: 20px 0; padding: 12px 16px; border-left: 3px solid #2563EB; background-color: #F7F8FA; font-style: italic; color: #374151; font-size: 13px;">
        &ldquo;Keep learning. Keep building.&rdquo; &mdash; <strong>Adarsh Kolluru</strong>, Founder, EdWorld Co.
      </blockquote>
    `,
    ctaText: "View & Download Your Official Certificate",
    ctaUrl: params.certificateUrl,
    footerNote: `This official verified credential was issued to ${params.studentName} for the project "${params.projectName}" and dispatched from certificate@edworld.co.in.`,
  });
}


