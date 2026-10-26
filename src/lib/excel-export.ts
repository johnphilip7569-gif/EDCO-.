/**
 * Professional Excel & CSV Export Generator for EdWorld Co Admin Portal
 * Generates formatted, multi-column Excel spreadsheets (.xls / .xlsx compatible XML)
 * with styled headers, typed cells, UTF-8 encoding, and instant browser download.
 */

export interface ExcelUserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age_band?: string;
  career_stage?: string;
  grade?: string;
  points?: number;
  current_streak?: number;
  longest_streak?: number;
  quests_completed?: number;
  interviews_count?: number;
  avg_interview_score?: number;
  resumes_count?: number;
  badges_count?: number;
  badges_list?: string[];
  is_admin?: boolean;
  is_suspended?: boolean;
  status?: string;
  role?: string;
  created_at?: string;
}

/**
 * Escapes XML entities to prevent spreadsheet XML parsing errors
 */
function escapeXml(str: any): string {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generates an XML-based Excel Workbook (.xls) that opens natively in Microsoft Excel,
 * Apple Numbers, LibreOffice Calc, and Google Sheets with styled headers.
 */
export function generateExcelWorkbookXml(records: ExcelUserRecord[], sheetTitle = "EdWorld Users"): string {
  const headers = [
    "User ID",
    "Full Name",
    "Email Address",
    "Phone",
    "Age Band",
    "Career Stage",
    "Education / Grade",
    "Role",
    "XP Points",
    "Current Streak (Days)",
    "Longest Streak (Days)",
    "Quests Completed",
    "Mock Interviews",
    "Avg Interview Score (%)",
    "Resumes Built",
    "Badges Count",
    "Status",
    "Joined Date",
  ];

  const headerCellsXml = headers
    .map(
      (h) => `
        <Cell ss:StyleID="HeaderStyle">
          <Data ss:Type="String">${escapeXml(h)}</Data>
        </Cell>`
    )
    .join("");

  const rowsXml = records
    .map((u) => {
      const statusLabel = u.is_suspended ? "Suspended" : u.status || "Active";
      const roleLabel = u.is_admin ? "Administrator" : u.role || "Student / Learner";
      const joinedDate = u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A";

      return `
        <Row ss:AutoFitHeight="1">
          <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${escapeXml(u.id)}</Data></Cell>
          <Cell ss:StyleID="BoldDataStyle"><Data ss:Type="String">${escapeXml(u.name || "Anonymous")}</Data></Cell>
          <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${escapeXml(u.email || "N/A")}</Data></Cell>
          <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${escapeXml(u.phone || "N/A")}</Data></Cell>
          <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${escapeXml(u.age_band || "N/A")}</Data></Cell>
          <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${escapeXml(u.career_stage || "N/A")}</Data></Cell>
          <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${escapeXml(u.grade || "N/A")}</Data></Cell>
          <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${escapeXml(roleLabel)}</Data></Cell>
          <Cell ss:StyleID="NumberStyle"><Data ss:Type="Number">${Number(u.points || 0)}</Data></Cell>
          <Cell ss:StyleID="NumberStyle"><Data ss:Type="Number">${Number(u.current_streak || 0)}</Data></Cell>
          <Cell ss:StyleID="NumberStyle"><Data ss:Type="Number">${Number(u.longest_streak || 0)}</Data></Cell>
          <Cell ss:StyleID="NumberStyle"><Data ss:Type="Number">${Number(u.quests_completed || 0)}</Data></Cell>
          <Cell ss:StyleID="NumberStyle"><Data ss:Type="Number">${Number(u.interviews_count || 0)}</Data></Cell>
          <Cell ss:StyleID="NumberStyle"><Data ss:Type="Number">${Number(u.avg_interview_score || 0)}</Data></Cell>
          <Cell ss:StyleID="NumberStyle"><Data ss:Type="Number">${Number(u.resumes_count || 0)}</Data></Cell>
          <Cell ss:StyleID="NumberStyle"><Data ss:Type="Number">${Number(u.badges_count || (u.badges_list?.length || 0))}</Data></Cell>
          <Cell ss:StyleID="${u.is_suspended ? "SuspendedStyle" : "ActiveStyle"}"><Data ss:Type="String">${escapeXml(statusLabel)}</Data></Cell>
          <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${escapeXml(joinedDate)}</Data></Cell>
        </Row>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>EdWorld Co. Administration</Author>
  <Created>${new Date().toISOString()}</Created>
  <Company>EdWorld Co.</Company>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#13141B"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#00D2B4"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#13141B" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DataStyle">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#13141B"/>
  </Style>
  <Style ss:ID="BoldDataStyle">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#13141B"/>
  </Style>
  <Style ss:ID="NumberStyle">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#13141B"/>
  </Style>
  <Style ss:ID="ActiveStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#0A5245"/>
   <Interior ss:Color="#E6FBF7" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="SuspendedStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#991B1B"/>
   <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${escapeXml(sheetTitle)}">
  <Table ss:DefaultColumnWidth="120" ss:DefaultRowHeight="22">
   <Column ss:Width="160"/>
   <Column ss:Width="150"/>
   <Column ss:Width="200"/>
   <Column ss:Width="120"/>
   <Column ss:Width="100"/>
   <Column ss:Width="140"/>
   <Column ss:Width="160"/>
   <Column ss:Width="130"/>
   <Column ss:Width="90"/>
   <Column ss:Width="120"/>
   <Column ss:Width="120"/>
   <Column ss:Width="120"/>
   <Column ss:Width="110"/>
   <Column ss:Width="130"/>
   <Column ss:Width="100"/>
   <Column ss:Width="100"/>
   <Column ss:Width="90"/>
   <Column ss:Width="100"/>
   <Row ss:AutoFitHeight="1" ss:Height="26">
    ${headerCellsXml}
   </Row>
   ${rowsXml}
  </Table>
  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
   <FreezePanes/>
   <FrozenNoSplit/>
   <SplitHorizontal>1</SplitHorizontal>
   <TopRowBottomPane>1</TopRowBottomPane>
   <ActivePane>2</ActivePane>
  </WorksheetOptions>
 </Worksheet>
</Workbook>`;
}

/**
 * Downloads records as an Excel Workbook (.xls) file directly in the browser
 */
export function downloadUsersAsExcel(records: ExcelUserRecord[], fileNamePrefix = "edworld_users"): void {
  const xml = generateExcelWorkbookXml(records);
  const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `${fileNamePrefix}_${dateStr}.xls`;

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads records as a UTF-8 BOM CSV file (natively handled by Microsoft Excel without encoding glitches)
 */
export function downloadUsersAsCsv(records: ExcelUserRecord[], fileNamePrefix = "edworld_users"): void {
  const headers = [
    "User ID",
    "Full Name",
    "Email Address",
    "Phone",
    "Age Band",
    "Career Stage",
    "Education / Grade",
    "Role",
    "XP Points",
    "Current Streak",
    "Longest Streak",
    "Quests Completed",
    "Mock Interviews",
    "Avg Interview Score",
    "Resumes Built",
    "Badges Count",
    "Status",
    "Joined Date",
  ];

  const rows = records.map((u) => [
    `"${(u.id || "").replace(/"/g, '""')}"`,
    `"${(u.name || "").replace(/"/g, '""')}"`,
    `"${(u.email || "").replace(/"/g, '""')}"`,
    `"${(u.phone || "N/A").replace(/"/g, '""')}"`,
    `"${(u.age_band || "N/A").replace(/"/g, '""')}"`,
    `"${(u.career_stage || "N/A").replace(/"/g, '""')}"`,
    `"${(u.grade || "N/A").replace(/"/g, '""')}"`,
    `"${(u.is_admin ? "Administrator" : u.role || "Student").replace(/"/g, '""')}"`,
    u.points || 0,
    u.current_streak || 0,
    u.longest_streak || 0,
    u.quests_completed || 0,
    u.interviews_count || 0,
    u.avg_interview_score || 0,
    u.resumes_count || 0,
    u.badges_count || (u.badges_list?.length || 0),
    `"${u.is_suspended ? "Suspended" : u.status || "Active"}"`,
    `"${u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"}"`,
  ]);

  // \uFEFF is the UTF-8 Byte Order Mark for Excel
  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `${fileNamePrefix}_${dateStr}.csv`;

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads job listings as a clean CSV file
 */
export function downloadJobsAsCsv(
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    category: string;
    salary_range?: string;
    skills_required?: string[];
    is_active?: boolean;
    created_at?: string;
  }>,
  fileNamePrefix = "edworld_jobs"
): void {
  const headers = [
    "Job ID",
    "Role Title",
    "Company",
    "Location",
    "Type",
    "Category",
    "Salary Range",
    "Required Skills",
    "Status",
    "Date Posted",
  ];

  const rows = jobs.map((j) => [
    `"${(j.id || "").replace(/"/g, '""')}"`,
    `"${(j.title || "").replace(/"/g, '""')}"`,
    `"${(j.company || "").replace(/"/g, '""')}"`,
    `"${(j.location || "Remote").replace(/"/g, '""')}"`,
    `"${(j.type || "Full-time").replace(/"/g, '""')}"`,
    `"${(j.category || "Engineering").replace(/"/g, '""')}"`,
    `"${(j.salary_range || "N/A").replace(/"/g, '""')}"`,
    `"${(j.skills_required?.join("; ") || "N/A").replace(/"/g, '""')}"`,
    `"${j.is_active !== false ? "Active" : "Archived"}"`,
    `"${j.created_at ? new Date(j.created_at).toLocaleDateString() : "N/A"}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `${fileNamePrefix}_${dateStr}.csv`;

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads Security SOC incidents as an audited CSV report
 */
export function downloadSecurityIncidentsAsCsv(
  incidents: Array<{
    id: string;
    threatVector: string;
    riskScore: number;
    path: string;
    details: string;
    actionTaken: string;
    timestamp: string | number;
  }>,
  fileNamePrefix = "edworld_security_audit"
): void {
  const headers = [
    "Incident ID",
    "Threat Vector",
    "Risk Score (/100)",
    "Target Endpoint",
    "Forensic Details",
    "Mitigation Action",
    "Timestamp",
  ];

  const rows = incidents.map((inc) => [
    `"${(inc.id || "").replace(/"/g, '""')}"`,
    `"${(inc.threatVector || "GENERAL").replace(/"/g, '""')}"`,
    inc.riskScore || 0,
    `"${(inc.path || "/").replace(/"/g, '""')}"`,
    `"${(inc.details || "").replace(/"/g, '""')}"`,
    `"${(inc.actionTaken || "BLOCKED").replace(/"/g, '""')}"`,
    `"${inc.timestamp ? new Date(inc.timestamp).toISOString() : new Date().toISOString()}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `${fileNamePrefix}_${dateStr}.csv`;

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads EdBuild groups and submissions as a structured CSV audit log
 */
export function downloadEdbuildGroupsAsCsv(
  groups: Array<{
    id: string;
    project_name: string;
    problem_statement: string;
    access_type: string;
    team_size: number;
    current_members_count: number;
    status: string;
    leader_name: string;
    leader_email: string;
    submission_link?: string;
    submission_demo_url?: string;
    submitted_at?: string;
    created_at: string;
    members?: Array<{ name: string; email: string; role: string }>;
  }>,
  fileNamePrefix = "edworld_edbuild_teams"
): void {
  const headers = [
    "Group ID",
    "Project Name",
    "Problem Statement",
    "Access Type",
    "Team Size",
    "Active Members",
    "Status",
    "Leader Name",
    "Leader Email",
    "Submission Repo",
    "Submission Demo",
    "Submitted At",
    "Created At",
    "Teammates List",
  ];

  const rows = groups.map((g) => [
    `"${(g.id || "").replace(/"/g, '""')}"`,
    `"${(g.project_name || "").replace(/"/g, '""')}"`,
    `"${(g.problem_statement || "").replace(/"/g, '""')}"`,
    `"${(g.access_type || "public").replace(/"/g, '""')}"`,
    g.team_size || 0,
    g.current_members_count || 0,
    `"${(g.status || "OPEN").replace(/"/g, '""')}"`,
    `"${(g.leader_name || "").replace(/"/g, '""')}"`,
    `"${(g.leader_email || "").replace(/"/g, '""')}"`,
    `"${(g.submission_link || "").replace(/"/g, '""')}"`,
    `"${(g.submission_demo_url || "").replace(/"/g, '""')}"`,
    `"${g.submitted_at ? new Date(g.submitted_at).toLocaleDateString() : "Not Submitted"}"`,
    `"${g.created_at ? new Date(g.created_at).toLocaleDateString() : "N/A"}"`,
    `"${(g.members?.map((m) => `${m.name} (${m.role})`).join("; ") || "N/A").replace(/"/g, '""')}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `${fileNamePrefix}_${dateStr}.csv`;

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads College Campus Ambassadors applications and active roster as CSV
 */
export function downloadAmbassadorsAsCsv(
  ambassadors: Array<{
    id?: string;
    user_id?: string;
    name: string;
    email: string;
    college_name: string;
    status: string;
    referral_code?: string;
    joined_at?: string;
    created_at?: string;
  }>,
  fileNamePrefix = "edworld_campus_ambassadors"
): void {
  const headers = [
    "Application / User ID",
    "Candidate Name",
    "Email Address",
    "College Name",
    "Status",
    "Referral Code",
    "Date Joined / Applied",
  ];

  const rows = ambassadors.map((a) => [
    `"${(a.id || a.user_id || "").replace(/"/g, '""')}"`,
    `"${(a.name || "").replace(/"/g, '""')}"`,
    `"${(a.email || "").replace(/"/g, '""')}"`,
    `"${(a.college_name || "").replace(/"/g, '""')}"`,
    `"${(a.status || "ACTIVE").replace(/"/g, '""')}"`,
    `"${(a.referral_code || "N/A").replace(/"/g, '""')}"`,
    `"${a.joined_at || a.created_at ? new Date(a.joined_at || a.created_at!).toLocaleDateString() : "N/A"}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `${fileNamePrefix}_${dateStr}.csv`;

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads candidate job applicant roster as an audit CSV for employers
 */
export function downloadJobApplicantsAsCsv(
  applicants: Array<{
    id: string;
    jobTitle?: string;
    applicantName: string;
    applicantEmail: string;
    status: string;
    matchScore?: number;
    appliedAt: string;
    feedbackNote?: string;
  }>,
  fileNamePrefix = "edworld_recruiter_applicants"
): void {
  const headers = [
    "Application ID",
    "Candidate Name",
    "Candidate Email",
    "Target Job Title",
    "Match Score (%)",
    "Pipeline Stage",
    "Date Applied",
    "Recruiter Feedback Note",
  ];

  const rows = applicants.map((app) => [
    `"${(app.id || "").replace(/"/g, '""')}"`,
    `"${(app.applicantName || "").replace(/"/g, '""')}"`,
    `"${(app.applicantEmail || "").replace(/"/g, '""')}"`,
    `"${(app.jobTitle || "").replace(/"/g, '""')}"`,
    app.matchScore || 0,
    `"${(app.status || "submitted").replace(/"/g, '""')}"`,
    `"${app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A"}"`,
    `"${(app.feedbackNote || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `${fileNamePrefix}_${dateStr}.csv`;

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

