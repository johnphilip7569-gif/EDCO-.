import { UniversalAI } from "@/lib/ai/universal-ai";
import { supabase } from "@/lib/supabase";

export interface RedFlagItem {
  category: "FINANCIAL_EXTORTION" | "DOMAIN_SPOOFING" | "CONTRACTUAL_VAGUENESS" | "UNREALISTIC_OFFER" | "HIGH_PRESSURE";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  matchedSnippet?: string;
}

export interface ScamCheckResult {
  riskScore: number; // 0 - 100
  verdict: "SAFE_INDICATORS" | "MODERATE_RISK" | "HIGH_RISK_SCAM";
  summary: string;
  companyName?: string;
  redFlags: RedFlagItem[];
  safetyChecklist: string[];
  mcaVerificationUrl?: string;
  checkedAt: string;
}

export const SAMPLE_SCAM_PRESETS = [
  {
    id: "scam_deposit",
    title: "Fake Tech Mahindra Laptop Security Deposit",
    companyName: "Tech Mahindra Careers Online (Spoofed)",
    contactEmail: "hr.techmahindra.recruiting@gmail.com",
    text: `Congratulations! You have been selected for the position of Junior Software Trainee at Tech Mahindra without any interview. Your monthly stipend will be Rs. 65,000/- per month. To confirm your joining and dispatch your company Apple MacBook Pro and welcome kit, you must deposit a refundable security caution amount of Rs. 6,800 to our verification account within 3 hours. Offer expires today. UPI ID: techcorp.verify@okhdfcbank`,
  },
  {
    id: "scam_data_entry",
    title: "Telegram Part-Time Typist 40k/Week",
    companyName: "Global Ad Solutions Ltd",
    contactEmail: "recruiter_priya_889@yahoo.in",
    text: `Urgent Requirement! Simple copy-paste and captchas typing work from home. Earn Rs 8,000 to Rs 15,000 daily directly into your Google Pay. No technical qualification needed. Registration charges: Rs 1,499 for software license key. Work starts instantly after payment. Contact manager on Telegram @EarnFastIndia_HR`,
  },
  {
    id: "safe_verified_offer",
    title: "Legitimate Infosys Specialist Programmer Offer",
    companyName: "Infosys Limited",
    contactEmail: "offer_support@infosys.com",
    text: `Dear Candidate, Following your performance in the InfyTQ National Qualifier Test and subsequent technical interview rounds held on 14th October 2026, we are pleased to extend an offer for the role of Specialist Programmer with an annual compensation of 9.5 LPA. Please review the enclosed annexure detailing your base pay, provident fund, and corporate insurance. No fees or deposits are requested at any stage of Infosys onboarding. All documentation should be submitted via our official careers portal at career.infosys.com.`,
  }
];

export async function analyzeJobOffer(params: {
  text: string;
  companyName?: string;
  contactEmail?: string;
  userId?: string;
}): Promise<ScamCheckResult> {
  const { text, companyName = "", contactEmail = "", userId } = params;

  // 1. Deterministic Heuristic Scoring
  const redFlags: RedFlagItem[] = [];
  let score = 5; // Baseline minimum

  const lowerText = text.toLowerCase();
  const lowerEmail = contactEmail.toLowerCase();

  // Vector 1: Upfront Payment Demands (Critical)
  const paymentKeywords = [
    "security deposit", "refundable amount", "registration fee", "caution money",
    "training fee", "laptop deposit", "courier fee", "processing charges",
    "pay rs", "deposit rs", "upi id", "google pay", "phonepe", "bank transfer before joining"
  ];
  for (const kw of paymentKeywords) {
    if (lowerText.includes(kw)) {
      redFlags.push({
        category: "FINANCIAL_EXTORTION",
        severity: "CRITICAL",
        title: "Upfront Monetary Demand Detected",
        description: `Legitimate employers NEVER ask candidates to pay for laptops, registration, or onboarding. Found reference to: "${kw}".`,
        matchedSnippet: kw
      });
      score += 40;
      break;
    }
  }

  // Vector 2: Free Email Domains for Corporate Recruitment
  const freeWebmailDomains = ["@gmail.com", "@yahoo.com", "@yahoo.in", "@hotmail.com", "@outlook.com", "@proton.me", "@rediffmail.com"];
  const matchedDomain = freeWebmailDomains.find(d => lowerEmail.includes(d) || lowerText.includes(d));
  if (matchedDomain) {
    redFlags.push({
      category: "DOMAIN_SPOOFING",
      severity: "HIGH",
      title: "Free Public Webmail Domain Used",
      description: `Official enterprise hiring is dispatched via company domains (e.g., @tcs.com, @infosys.com), not public webmail like "${matchedDomain}".`,
      matchedSnippet: matchedDomain
    });
    score += 25;
  }

  // Vector 3: Immediate Selection without Formal Technical Rounds
  const noInterviewKeywords = ["without any interview", "direct selection", "no interview needed", "congratulations selected directly", "urgent hiring without test"];
  for (const kw of noInterviewKeywords) {
    if (lowerText.includes(kw)) {
      redFlags.push({
        category: "UNREALISTIC_OFFER",
        severity: "HIGH",
        title: "Unconditional Direct Selection",
        description: "Scammers entice students by offering high salaries without technical screening or HR vetting.",
        matchedSnippet: kw
      });
      score += 20;
      break;
    }
  }

  // Vector 4: High Pressure Urgency & Telegram/WhatsApp only routing
  if (lowerText.includes("within 3 hours") || lowerText.includes("offer expires today") || lowerText.includes("urgent payment") || lowerText.includes("telegram @")) {
    redFlags.push({
      category: "HIGH_PRESSURE",
      severity: "MEDIUM",
      title: "Artificial Urgency or Shadow Chat Redirection",
      description: "Scammers create false panic deadlines or demand communications over private Telegram channels to avoid corporate audit trails."
    });
    score += 15;
  }

  // Cap score at 100
  score = Math.min(100, score);

  let verdict: ScamCheckResult["verdict"] = "SAFE_INDICATORS";
  if (score >= 65) {
    verdict = "HIGH_RISK_SCAM";
  } else if (score >= 30) {
    verdict = "MODERATE_RISK";
  }

  // 2. Synthesize with AI if text is comprehensive
  let summary = "";
  if (verdict === "HIGH_RISK_SCAM") {
    summary = `CRITICAL WARNING: This document exhibits severe hallmarks of employment fraud. Immediate monetary demands (${redFlags[0]?.matchedSnippet || "fees"}) and unofficial communications strongly suggest a financial extortion scam. Do not transfer funds.`;
  } else if (verdict === "MODERATE_RISK") {
    summary = `CAUTION ADVISED: Several indicators warrant scrutiny, such as unofficial email domains or vague compensation terms. Independently verify the recruiter via LinkedIn and official company portals before sharing Aadhaar, PAN, or banking details.`;
  } else {
    summary = `POSITIVE INDICATORS: The text appears consistent with standard corporate communications. Standard onboarding procedures, formal job titles, and absence of upfront payment requests were observed.`;
  }

  // Optional AI Enrichment for deep context
  if (text.length > 80) {
    try {
      const aiPrompt = `You are a corporate fraud and cybersecurity investigator for university placement cells.
Analyze this job/offer snippet:
Company: ${companyName}
Contact: ${contactEmail}
Offer Snippet: "${text.slice(0, 800)}"

Return a 2-sentence executive summary and 3 bulleted actionable verification steps in JSON format:
{
  "summary": "...",
  "actionSteps": ["step 1", "step 2", "step 3"]
}`;

      const aiResponse = await UniversalAI.complete({
        prompt: aiPrompt,
        temperature: 0.2,
        maxTokens: 350,
        responseFormat: "json"
      });

      const parsed = JSON.parse(aiResponse.text);
      if (parsed.summary) summary = parsed.summary;
    } catch {
      // Graceful fallback to heuristic summary
    }
  }

  const result: ScamCheckResult = {
    riskScore: score,
    verdict,
    summary,
    companyName: companyName || "Unknown Entity",
    redFlags,
    safetyChecklist: [
      "Never pay any money for job applications, laptops, test links, or onboarding paperwork.",
      "Check the Ministry of Corporate Affairs (MCA) database to confirm company registration (CIN/LLPIN).",
      "Verify recruiter identity on LinkedIn; check if their corporate email domain matches company website.",
      "Cross-check active job openings on the company's official career portal (e.g. company.com/careers).",
      "Do not provide OTPs, UPI PINs, or bank account credentials under any circumstances."
    ],
    mcaVerificationUrl: "https://www.mca.gov.in/content/mca/global/en/mca/fo-llp-services/company-llp-name-search.html",
    checkedAt: new Date().toISOString()
  };

  // 3. Persist audit to Supabase
  try {
    await supabase.from("scam_check_audits").insert({
      user_id: userId || null,
      company_name: companyName,
      contact_source: contactEmail,
      risk_score: result.riskScore,
      verdict: result.verdict,
      red_flags: result.redFlags,
      raw_text_snippet: text.slice(0, 500)
    });
  } catch (err) {
    console.warn("[ScamAudit Insert Warning]:", err);
  }

  return result;
}
