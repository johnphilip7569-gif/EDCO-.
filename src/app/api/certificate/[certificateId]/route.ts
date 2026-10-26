import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db-server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { certificateId: string } }
) {
  try {
    const rawId = (params.certificateId || "").trim();
    if (!rawId) {
      return NextResponse.json({ success: false, error: "Missing certificate ID" }, { status: 400 });
    }

    const pool = getDbPool();
    const client = await pool.connect();

    try {
      // 1. Try edbuild_certificates first
      let certRes = await client.query(
        `SELECT c.*, g.problem_statement, g.submission_repo_url, g.submission_live_url
         FROM public.edbuild_certificates c
         LEFT JOIN public.edbuild_groups g ON g.id = c.group_id
         WHERE LOWER(c.certificate_code) = LOWER($1) OR c.id::text = $1
         LIMIT 1;`,
        [rawId]
      );

      if (certRes.rows.length > 0) {
        return NextResponse.json({
          success: true,
          certificate: certRes.rows[0],
          type: "edbuild",
        });
      }

      // 2. Fallback to course_certificates
      const courseCertRes = await client.query(
        `SELECT * FROM public.course_certificates 
         WHERE LOWER(certificate_code) = LOWER($1) OR id::text = $1
         LIMIT 1;`,
        [rawId]
      );

      if (courseCertRes.rows.length > 0) {
        const c = courseCertRes.rows[0];
        return NextResponse.json({
          success: true,
          certificate: {
            certificate_code: c.certificate_code,
            recipient_name: c.recipient_name,
            project_name: c.course_title,
            issued_at: c.issued_at,
            verification_hash: c.verification_hash,
          },
          type: "course",
        });
      }

      return NextResponse.json(
        { success: false, error: "Authentic certificate not found" },
        { status: 404 }
      );
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[CertificateAPI:GET] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to retrieve certificate" },
      { status: 500 }
    );
  }
}
