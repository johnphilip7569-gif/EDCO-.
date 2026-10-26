import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getDbPool } from "@/lib/db-server";
import { sendProjectCompletionCertificateEmail } from "@/lib/email-service";
import { createClient } from "@/lib/supabase/server";
import { validateSession } from "@/lib/otp-service";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function verifyAdminClearance(req: NextRequest): Promise<boolean> {
  try {
    const supabaseServer = createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin, role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.is_admin || ["ADMIN", "SUPER_ADMIN", "FOUNDER", "EXECUTIVE"].includes(profile?.role)) {
        return true;
      }
    }

    const sessionCookie = req.cookies.get("edworld_session")?.value;
    if (sessionCookie) {
      const { valid, role } = validateSession(sessionCookie);
      if (valid && ["ADMIN", "SUPER_ADMIN", "FOUNDER", "EXECUTIVE"].includes(role || "")) {
        return true;
      }
    }
  } catch (err) {
    console.error("[EdBuild Approve Auth Error]:", err);
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminClearance(req);
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Administrator clearance required to review projects." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { groupId, decision, adminNotes } = body;

    if (!groupId) {
      return NextResponse.json({ success: false, error: "Missing groupId" }, { status: 400 });
    }

    const pool = getDbPool();
    const client = await pool.connect();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://edworld.co.in";

    try {
      await client.query("BEGIN");

      // 1. Fetch group
      const groupRes = await client.query(
        `SELECT * FROM public.edbuild_groups WHERE id = $1::uuid LIMIT 1;`,
        [groupId]
      );

      if (groupRes.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json({ success: false, error: "Group not found" }, { status: 404 });
      }

      const group = groupRes.rows[0];

      if (decision === "reject") {
        await client.query(
          `UPDATE public.edbuild_groups 
           SET status = 'REJECTED', submission_notes = $1, updated_at = NOW() 
           WHERE id = $2::uuid;`,
          [adminNotes ? `Admin Feedback: ${adminNotes}` : "Submission requires revision.", groupId]
        );

        await client.query(
          `INSERT INTO public.edbuild_messages (
            group_id, sender_id, sender_name, message_type, content, created_at
          ) VALUES ($1::uuid, $2::uuid, 'EdWorld Reviewer', 'system', $3, NOW());`,
          [
            groupId,
            group.leader_id,
            `⚠️ Project submission requires revisions: ${adminNotes || "Please review code quality and re-submit."}`,
          ]
        );

        await client.query("COMMIT");
        return NextResponse.json({ success: true, status: "REJECTED" });
      }

      // 2. Decision is ACCEPT: Mark status = APPROVED
      await client.query(
        `UPDATE public.edbuild_groups 
         SET status = 'APPROVED', approved_at = NOW(), updated_at = NOW() 
         WHERE id = $1::uuid;`,
        [groupId]
      );

      // 3. Fetch all team members
      const membersRes = await client.query(
        `SELECT * FROM public.edbuild_members WHERE group_id = $1::uuid;`,
        [groupId]
      );

      const members = membersRes.rows;
      const certificatesIssued: any[] = [];
      const emailDispatches: any[] = [];

      for (const member of members) {
        // Generate unique certificate code
        const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
        const certCode = `EDW-CERT-2026-${randomHex}`;
        const verificationHash = crypto
          .createHash("sha256")
          .update(`${certCode}-${member.user_id}-${group.id}-${Date.now()}`)
          .digest("hex");

        // Insert into public.edbuild_certificates
        const certRes = await client.query(
          `INSERT INTO public.edbuild_certificates (
            certificate_code,
            group_id,
            user_id,
            recipient_name,
            recipient_email,
            project_name,
            issued_at,
            verification_hash
          ) VALUES ($1, $2::uuid, $3::uuid, $4, $5, $6, NOW(), $7)
          RETURNING *;`,
          [
            certCode,
            groupId,
            member.user_id,
            member.name,
            member.email,
            group.name,
            verificationHash,
          ]
        );

        const cert = certRes.rows[0];
        certificatesIssued.push(cert);

        // Also record in course_certificates for unified platform verification
        try {
          await client.query(
            `INSERT INTO public.course_certificates (
              id,
              user_id,
              course_id,
              certificate_code,
              recipient_name,
              course_title,
              course_category,
              score_percentage,
              verification_hash,
              issued_at
            ) VALUES (
              gen_random_uuid(),
              $1::uuid,
              $2::uuid,
              $3,
              $4,
              $5,
              'EdBuild Collaborative Engineering',
              100,
              $6,
              NOW()
            ) ON CONFLICT (certificate_code) DO NOTHING;`,
            [
              member.user_id,
              group.id,
              certCode,
              member.name,
              group.name,
              verificationHash,
            ]
          );
        } catch (e) {
          // Ignore duplicate if any
        }

        // 4. Send Certificate Email to the student via Resend
        if (member.email) {
          const certUrl = `${appUrl}/certificate/${certCode}`;
          try {
            const emailRes = await sendProjectCompletionCertificateEmail({
              email: member.email,
              studentName: member.name,
              projectName: group.name,
              certificateUrl: certUrl,
              certificateCode: certCode,
            });
            emailDispatches.push({
              email: member.email,
              success: emailRes.success,
              messageId: emailRes.id,
            });
          } catch (mailErr: any) {
            console.warn(`[Certificate Email Warning for ${member.email}]:`, mailErr);
          }
        }
      }

      // 5. Post celebratory in-group message
      await client.query(
        `INSERT INTO public.edbuild_messages (
          group_id, sender_id, sender_name, message_type, content, created_at
        ) VALUES ($1::uuid, $2::uuid, 'EdWorld Co. Evaluation Office', 'system', $3, NOW());`,
        [
          groupId,
          group.leader_id,
          `🎉 PROJECT ACCEPTED & CERTIFIED! Congratulations to all team members. Verified Certificates of Completion have been issued and dispatched to your email inboxes!`,
        ]
      );

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        status: "APPROVED",
        certificatesIssuedCount: certificatesIssued.length,
        emailDispatches,
      });
    } catch (e: any) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[AdminEdBuildApprove:POST] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process approval" },
      { status: 500 }
    );
  }
}
