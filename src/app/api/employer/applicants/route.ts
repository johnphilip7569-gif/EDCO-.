import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDbPool } from "@/lib/db-server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Active employer login required." }, { status: 401 });
    }

    const employerId = user.id;
    const url = new URL(req.url);
    const jobId = url.searchParams.get("jobId");

    const db = getDbPool();
    const client = await db.connect();
    try {
      // Strictly isolate: applicant rows must belong to jobs where posted_by = employerId
      // and status is not 'withdrawn'
      let query = `
        SELECT a.*,
               j.title as job_title,
               j.company as job_company,
               j.posted_by as job_posted_by
        FROM public.job_applications a
        INNER JOIN public.jobs j ON j.id = a.job_id
        WHERE j.posted_by = $1
          AND a.status != 'withdrawn'
      `;
      const params: any[] = [employerId];

      if (jobId) {
        query += ` AND a.job_id = $2`;
        params.push(jobId);
      }

      query += ` ORDER BY a.match_score DESC NULLS LAST, a.applied_at DESC`;

      const res = await client.query(query, params);

      return NextResponse.json({
        success: true,
        applicants: res.rows,
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[Employer Applicants GET Error]:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch applicants" }, { status: 500 });
  }
}
