import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db-server";
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
    console.error("[Admin EdBuild Auth Error]:", err);
  }
  return false;
}

export async function GET(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminClearance(req);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Forbidden: Administrator clearance required to view project dossiers." },
        { status: 403 }
      );
    }

    const pool = getDbPool();
    const client = await pool.connect();

    try {
      // 1. Fetch pending reviews
      const pendingRes = await client.query(
        `SELECT g.*, 
                COALESCE(
                  json_agg(
                    json_build_object(
                      'user_id', m.user_id,
                      'name', m.name,
                      'email', m.email,
                      'phone', m.phone,
                      'role', m.role
                    )
                  ) FILTER (WHERE m.id IS NOT NULL), '[]'
                ) as members
         FROM public.edbuild_groups g
         LEFT JOIN public.edbuild_members m ON m.group_id = g.id
         WHERE g.status = 'PENDING_REVIEW'
         GROUP BY g.id
         ORDER BY g.submitted_at ASC;`
      );

      // 2. Fetch all groups (including approved & open)
      const allRes = await client.query(
        `SELECT g.*, 
                COALESCE(
                  json_agg(
                    json_build_object(
                      'user_id', m.user_id,
                      'name', m.name,
                      'email', m.email,
                      'role', m.role
                    )
                  ) FILTER (WHERE m.id IS NOT NULL), '[]'
                ) as members
         FROM public.edbuild_groups g
         LEFT JOIN public.edbuild_members m ON m.group_id = g.id
         GROUP BY g.id
         ORDER BY g.created_at DESC
         LIMIT 50;`
      );

      return NextResponse.json({
        success: true,
        pendingGroups: pendingRes.rows,
        allGroups: allRes.rows,
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[AdminEdBuild:GET] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load admin EdBuild data" },
      { status: 500 }
    );
  }
}
