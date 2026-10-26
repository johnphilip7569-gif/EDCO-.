import { NextRequest, NextResponse } from "next/server";
import { executeMCPTool } from "@/lib/mcp/engine";
import { verifyUserRole } from "@/lib/server-role-guard";
import { MCPAuthContext } from "@/lib/mcp/types";
import { createClient } from "@/lib/supabase/server";
import { validateSession } from "@/lib/otp-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tool, params } = body;

    if (!tool || typeof tool !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing required 'tool' parameter." },
        { status: 400 }
      );
    }

    // Authenticate caller strictly from verified session
    let authenticatedUserId: string | null = null;
    let verifiedSessionRole: string | undefined = undefined;

    try {
      const supabaseServer = createClient();
      const { data: { user } } = await supabaseServer.auth.getUser();
      if (user?.id) {
        authenticatedUserId = user.id;
      }
    } catch {}

    if (!authenticatedUserId) {
      const sessionCookie = 
        req.cookies.get("edworld_session")?.value ||
        req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

      if (sessionCookie && sessionCookie.startsWith("edw_sess_")) {
        const sessRes = validateSession(sessionCookie);
        if (sessRes.valid && sessRes.userId) {
          authenticatedUserId = sessRes.userId;
          verifiedSessionRole = sessRes.role;
        }
      }
    }

    if (!authenticatedUserId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Active authenticated session required to execute MCP tools." },
        { status: 401 }
      );
    }

    const userId = authenticatedUserId;
    const organizationId = req.headers.get("x-organization-id") || body.organizationId;
    const correlationId = req.headers.get("x-correlation-id") || `mcp_${Date.now()}`;

    // Validate database role & status (never trust client-supplied role claims blindly)
    const roleCheck = await verifyUserRole(userId, [
      "CLIENT", "EMPLOYEE", "HR", "FOUNDER", "EXECUTIVE", "TEACHER", "COLLEGE_ADMIN", "PLACEMENT_OFFICER", "ADMIN", "SUPER_ADMIN"
    ]);

    if (!roleCheck.authorized && roleCheck.statusCode === 401) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: User not found." },
        { status: 401 }
      );
    }

    const verifiedRole = roleCheck.user?.role || "CLIENT";
    const authContext: MCPAuthContext = {
      userId,
      email: roleCheck.user?.email,
      role: verifiedRole,
      organizationId,
      correlationId,
      timestamp: new Date().toISOString()
    };

    // Execute MCP tool via central engine with full RBAC & audit logging
    const result = await executeMCPTool(tool, params || {}, authContext);

    return NextResponse.json(result, { status: result.statusCode || (result.success ? 200 : 400) });
  } catch (err: any) {
    console.error("[MCP Execute API Exception]:", err);
    return NextResponse.json(
      { success: false, error: `Internal MCP Execution Error: ${err.message}` },
      { status: 500 }
    );
  }
}
