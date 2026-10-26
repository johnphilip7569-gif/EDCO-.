import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDbPool } from "@/lib/db-server";

export const dynamic = "force-dynamic";

async function resolveUserId(req: NextRequest, bodyUserId?: string): Promise<string | null> {
  // 1. Try Supabase session via cookies
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      return user.id;
    }
  } catch (e) {
    // Continue to fallback
  }

  // 2. Authorization header token
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const supabase = createClient();
      const token = authHeader.substring(7);
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user?.id) {
        return user.id;
      }
    } catch (e) {
      // Continue
    }
  }

  // 3. Fallback for testing/onboarding with passed userId
  if (bodyUserId) {
    return bodyUserId;
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const queryUserId = searchParams.get("userId") || undefined;
    const userId = await resolveUserId(req, queryUserId);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to view career paths." },
        { status: 401 }
      );
    }

    const pool = getDbPool();
    const client = await pool.connect();

    try {
      // Fetch user's selected career paths with full path details
      const pathsResult = await client.query(
        `SELECT 
           ucp.id as selection_id,
           ucp.career_path_id,
           ucp.is_primary,
           ucp.selected_at,
           cp.name,
           cp.category,
           cp.description,
           cp.typical_skills,
           cp.display_order
         FROM public.user_career_paths ucp
         JOIN public.career_paths cp ON cp.id = ucp.career_path_id
         WHERE ucp.user_id = $1
         ORDER BY ucp.is_primary DESC, cp.display_order ASC;`,
        [userId]
      );

      const selectedPaths = pathsResult.rows;
      const primaryPath = selectedPaths.find((p) => p.is_primary) || selectedPaths[0] || null;

      let widgetMap = null;
      if (primaryPath) {
        const widgetResult = await client.query(
          `SELECT priority_widgets, secondary_widgets, focus_areas
           FROM public.career_path_widget_map
           WHERE career_path_id = $1;`,
          [primaryPath.career_path_id]
        );
        widgetMap = widgetResult.rows[0] || null;
      }

      return NextResponse.json({
        success: true,
        userId,
        selectedPaths,
        primaryPath,
        widgetMap,
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[UserCareerPathsAPI:GET] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve user career paths" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { selectedPathIds, primaryPathId, userId: bodyUserId } = body;

    const userId = await resolveUserId(req, bodyUserId);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to save career paths." },
        { status: 401 }
      );
    }

    if (!Array.isArray(selectedPathIds)) {
      return NextResponse.json(
        { success: false, error: "selectedPathIds must be an array of career path IDs." },
        { status: 400 }
      );
    }

    // Strict constraint: max 3 total (1 primary + up to 2 secondary)
    if (selectedPathIds.length > 3) {
      return NextResponse.json(
        {
          success: false,
          error: "You can select up to 3 career paths (1 primary + 2 secondary). Please deselect one before adding another.",
        },
        { status: 400 }
      );
    }

    if (selectedPathIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please select at least 1 career path or choose 'Other / Not Sure Yet'.",
        },
        { status: 400 }
      );
    }

    // Exactly 1 primary must be selected and must be in the list
    if (!primaryPathId || !selectedPathIds.includes(primaryPathId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please designate one of your selected career paths as your primary focus.",
        },
        { status: 400 }
      );
    }

    const pool = getDbPool();
    const client = await pool.connect();

    try {
      await client.query("BEGIN;");

      // Verify all selectedPathIds exist in public.career_paths
      const checkPaths = await client.query(
        `SELECT id, name FROM public.career_paths WHERE id = ANY($1::text[]);`,
        [selectedPathIds]
      );

      if (checkPaths.rows.length !== selectedPathIds.length) {
        await client.query("ROLLBACK;");
        return NextResponse.json(
          { success: false, error: "One or more selected career paths are invalid or discontinued." },
          { status: 400 }
        );
      }

      const primaryRow = checkPaths.rows.find((r) => r.id === primaryPathId);
      const primaryName = primaryRow ? primaryRow.name : null;

      // Delete existing selections for this user
      await client.query(
        `DELETE FROM public.user_career_paths WHERE user_id = $1;`,
        [userId]
      );

      // Insert new selections
      for (const pathId of selectedPathIds) {
        const isPrimary = pathId === primaryPathId;
        await client.query(
          `INSERT INTO public.user_career_paths (user_id, career_path_id, is_primary, selected_at)
           VALUES ($1, $2, $3, NOW());`,
          [userId, pathId, isPrimary]
        );
      }

      // Sync profiles.target_role with primary path name
      if (primaryName) {
        await client.query(
          `UPDATE public.profiles
           SET target_role = $1, updated_at = NOW()
           WHERE id = $2;`,
          [primaryName, userId]
        );
      }

      // Fetch the updated priority widget configuration
      const widgetMapResult = await client.query(
        `SELECT priority_widgets, secondary_widgets, focus_areas
         FROM public.career_path_widget_map
         WHERE career_path_id = $1;`,
        [primaryPathId]
      );

      await client.query("COMMIT;");

      return NextResponse.json({
        success: true,
        message: "Career paths saved successfully",
        userId,
        selectedPathIds,
        primaryPathId,
        targetRole: primaryName,
        widgetMap: widgetMapResult.rows[0] || null,
      });
    } catch (txError: any) {
      await client.query("ROLLBACK;");
      throw txError;
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[UserCareerPathsAPI:POST] Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save career paths" },
      { status: 500 }
    );
  }
}
