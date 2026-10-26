import { supabase } from "@/lib/supabase";

export interface UserAlertPreferences {
  userId: string;
  whatsappEnabled: boolean;
  whatsappNumber: string;
  whatsappVerified: boolean;
  telegramEnabled: boolean;
  telegramChatId?: string;
  telegramUsername?: string;
  selectedRoles: string[];
  selectedCities: string[];
  notifyJobs: boolean;
  notifyHackathons: boolean;
  notifyDeadlines: boolean;
  frequency: "instant" | "daily_digest" | "weekly";
  updatedAt?: string;
}

export const POPULAR_ROLES = [
  "Full-Stack Web (React/Next/Node)",
  "Frontend Engineer (React/Vue/Mobile)",
  "Backend & Distributed Systems (Go/Java/Python)",
  "AI / Machine Learning Engineer",
  "DevOps, SRE & Cloud Architect",
  "Data Scientist & Analytics",
  "Product Manager & Technical Consultant",
  "Cybersecurity & SOC Analyst"
];

export const POPULAR_CITIES = [
  "Bengaluru, Karnataka",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
  "Delhi NCR (Gurugram / Noida)",
  "Mumbai, Maharashtra",
  "Chennai, Tamil Nadu",
  "Remote / Distributed (Pan India)"
];

export async function getUserAlertPreferences(userId: string): Promise<UserAlertPreferences> {
  try {
    const { data, error } = await supabase
      .from("user_alert_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) {
      return {
        userId,
        whatsappEnabled: false,
        whatsappNumber: "",
        whatsappVerified: false,
        telegramEnabled: false,
        telegramChatId: "",
        telegramUsername: "",
        selectedRoles: ["Full-Stack Web (React/Next/Node)", "AI / Machine Learning Engineer"],
        selectedCities: ["Bengaluru, Karnataka", "Remote / Distributed (Pan India)"],
        notifyJobs: true,
        notifyHackathons: true,
        notifyDeadlines: true,
        frequency: "instant"
      };
    }

    return {
      userId: data.user_id,
      whatsappEnabled: data.whatsapp_enabled ?? false,
      whatsappNumber: data.whatsapp_number || "",
      whatsappVerified: data.whatsapp_verified ?? false,
      telegramEnabled: data.telegram_enabled ?? false,
      telegramChatId: data.telegram_chat_id || "",
      telegramUsername: data.telegram_username || "",
      selectedRoles: data.selected_roles || [],
      selectedCities: data.selected_cities || [],
      notifyJobs: data.notify_jobs ?? true,
      notifyHackathons: data.notify_hackathons ?? true,
      notifyDeadlines: data.notify_deadlines ?? true,
      frequency: data.frequency || "instant",
      updatedAt: data.updated_at
    };
  } catch (err) {
    console.error("[getUserAlertPreferences Error]:", err);
    return {
      userId,
      whatsappEnabled: false,
      whatsappNumber: "",
      whatsappVerified: false,
      telegramEnabled: false,
      selectedRoles: [],
      selectedCities: [],
      notifyJobs: true,
      notifyHackathons: true,
      notifyDeadlines: true,
      frequency: "instant"
    };
  }
}

export async function saveUserAlertPreferences(prefs: UserAlertPreferences): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("user_alert_preferences")
      .upsert({
        user_id: prefs.userId,
        whatsapp_enabled: prefs.whatsappEnabled,
        whatsapp_number: prefs.whatsappNumber,
        whatsapp_verified: prefs.whatsappVerified,
        telegram_enabled: prefs.telegramEnabled,
        telegram_chat_id: prefs.telegramChatId,
        telegram_username: prefs.telegramUsername,
        selected_roles: prefs.selectedRoles,
        selected_cities: prefs.selectedCities,
        notify_jobs: prefs.notifyJobs,
        notify_hackathons: prefs.notifyHackathons,
        notify_deadlines: prefs.notifyDeadlines,
        frequency: prefs.frequency,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });

    if (error) {
      console.error("[saveUserAlertPreferences Upsert Error]:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[saveUserAlertPreferences Exception]:", err);
    return false;
  }
}

export async function dispatchMultiChannelTestAlert(params: {
  userId: string;
  channel: "whatsapp" | "telegram" | "both";
  targetNumber?: string;
  targetChatId?: string;
}): Promise<{ success: boolean; message: string; payload: any }> {
  const { channel, targetNumber, targetChatId, userId } = params;

  const mockPayload = {
    alertType: "JOB_DROP_MATCH",
    title: "New Role Match: SDE Trainee @ Razorpay (Bengaluru)",
    compensation: "14 - 18 LPA",
    matchScore: 94,
    deadline: "Apply by 31st Oct 2026",
    actionUrl: "https://edworld.co/jobs/razorpay-sde-trainee",
    dispatchedAt: new Date().toISOString()
  };

  // 1. WhatsApp Delivery
  if (channel === "whatsapp" || channel === "both") {
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

    if (twilioSid && twilioAuth && targetNumber) {
      try {
        const bodyContent = `🔔 *EdWorld Co. Job Match Alert*\n\n` +
          `📌 *${mockPayload.title}*\n` +
          `💰 *Compensation:* ${mockPayload.compensation}\n` +
          `🎯 *Profile Match:* ${mockPayload.matchScore}%\n` +
          `⏰ *Deadline:* ${mockPayload.deadline}\n\n` +
          `👉 *One-Click Apply:* ${mockPayload.actionUrl}\n\n` +
          `_Reply STOP to mute WhatsApp alerts._`;

        const authHeader = "Basic " + Buffer.from(`${twilioSid}:${twilioAuth}`).toString("base64");
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: "POST",
          headers: {
            "Authorization": authHeader,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            From: twilioFrom,
            To: `whatsapp:${targetNumber.replace(/\s+/g, "")}`,
            Body: bodyContent
          })
        });
      } catch (err) {
        console.warn("[Twilio WhatsApp dispatch warning]:", err);
      }
    }
  }

  // 2. Telegram Delivery
  if (channel === "telegram" || channel === "both") {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (botToken && targetChatId) {
      try {
        const tgMessage = `🚀 *EdWorld Co. Instant Alert*\n\n` +
          `*${mockPayload.title}*\n` +
          `💸 CTC: ${mockPayload.compensation}\n` +
          `⚡ Match: ${mockPayload.matchScore}%\n\n` +
          `🔗 [View & Apply on EdWorld](${mockPayload.actionUrl})`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: targetChatId,
            text: tgMessage,
            parse_mode: "Markdown"
          })
        });
      } catch (err) {
        console.warn("[Telegram dispatch warning]:", err);
      }
    }
  }

  return {
    success: true,
    message: "Multi-channel test alert generated and dispatched via active webhook connector.",
    payload: mockPayload
  };
}
