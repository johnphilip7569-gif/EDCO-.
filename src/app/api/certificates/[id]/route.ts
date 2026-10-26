import { NextRequest, NextResponse } from "next/server";
import { queryDb } from "@/lib/db-server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id;
    if (!rawId) {
      return NextResponse.json({ success: false, error: "Certificate ID or code is required" }, { status: 400 });
    }

    const cleanId = rawId.trim();

    // Query either by certificate_code (case-insensitive) or by UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);

    const sql = isUuid
      ? `SELECT c.*, co.skills, co.duration_weeks, co.level
         FROM public.course_certificates c
         LEFT JOIN public.courses co ON c.course_id = co.id
         WHERE c.id = $1
         LIMIT 1`
      : `SELECT c.*, co.skills, co.duration_weeks, co.level
         FROM public.course_certificates c
         LEFT JOIN public.courses co ON c.course_id = co.id
         WHERE LOWER(c.certificate_code) = LOWER($1)
         LIMIT 1`;

    const { rows } = await queryDb(sql, [cleanId]);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Certificate not found or invalid verification code" },
        { status: 404 }
      );
    }

    const cert = rows[0];

    return NextResponse.json({
      success: true,
      verified: true,
      certificate: {
        id: cert.id,
        certificateCode: cert.certificate_code,
        recipientName: cert.recipient_name,
        courseTitle: cert.course_title,
        courseCategory: cert.course_category,
        courseSlug: cert.course_slug,
        scorePercentage: cert.score_percentage,
        skills: cert.skills || [],
        durationWeeks: cert.duration_weeks || 6,
        level: cert.level || "Intermediate",
        verificationHash: cert.verification_hash,
        issuedAt: cert.issued_at,
        organization: "Edworld Co.",
        accreditation: "Verified Career & Engineering Academy",
      },
    });
  } catch (err: any) {
    console.error("[API Certificate Verify Error]:", err);
    return NextResponse.json(
      { success: false, error: "Failed to verify certificate" },
      { status: 500 }
    );
  }
}
