import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDbPool } from "@/lib/db-server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Active login session required." }, { status: 401 });
    }

    const applicantId = user.id;
    const body = await req.json();
    const { applicationId } = body;

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    const db = getDbPool();
    const client = await db.connect();

    try {
      // Find application and ensure it belongs to the user
      const findRes = await client.query(
        "SELECT id, status, user_id FROM public.job_applications WHERE id = $1",
        [applicationId]
      );

      if (findRes.rowCount === 0) {
        return NextResponse.json({ error: "Application not found" }, { status: 404 });
      }

      const app = findRes.rows[0];
      if (app.user_id !== applicantId) {
        return NextResponse.json({ error: "Forbidden: You do not own this application" }, { status: 403 });
      }

      if (app.status === "withdrawn") {
        return NextResponse.json({ success: true, message: "Application already withdrawn" });
      }

      // Transition to withdrawn
      await client.query(
        "UPDATE public.job_applications SET status = 'withdrawn', status_updated_at = NOW() WHERE id = $1",
        [applicationId]
      );

      return NextResponse.json({
        success: true,
        message: "Application successfully withdrawn",
        applicationId,
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[Application Withdraw Error]:", err);
    return NextResponse.json({ error: err.message || "Failed to withdraw application" }, { status: 500 });
  }
}
