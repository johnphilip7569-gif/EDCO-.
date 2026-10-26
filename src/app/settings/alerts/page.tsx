"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/auth/AuthGuard";
import { 
  Bell, 
  Send, 
  Smartphone, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  Globe, 
  Briefcase, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  Save,
  Check,
  RefreshCw,
  BellOff
} from "lucide-react";
import { 
  UserAlertPreferences, 
  POPULAR_ROLES, 
  POPULAR_CITIES 
} from "@/lib/alerts/multi-channel-service";

export const dynamic = "force-dynamic";

export default function MultiChannelAlertsPage() {
  const { user } = useAuth();

  const [prefs, setPrefs] = useState<UserAlertPreferences>({
    userId: user?.uid || "guest",
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
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testDispatching, setTestDispatching] = useState<string | null>(null);
  const [testOutput, setTestOutput] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const userId = user?.uid || "guest";
        const res = await fetch(`/api/alerts/preferences?userId=${userId}`);
        const data = await res.json();
        if (data.success && data.preferences) {
          setPrefs(data.preferences);
        }
      } catch (err) {
        console.error("Failed to load alert preferences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrefs();
  }, [user]);

  const handleToggleRole = (role: string) => {
    setPrefs((prev) => {
      const exists = prev.selectedRoles.includes(role);
      return {
        ...prev,
        selectedRoles: exists
          ? prev.selectedRoles.filter((r) => r !== role)
          : [...prev.selectedRoles, role]
      };
    });
  };

  const handleToggleCity = (city: string) => {
    setPrefs((prev) => {
      const exists = prev.selectedCities.includes(city);
      return {
        ...prev,
        selectedCities: exists
          ? prev.selectedCities.filter((c) => c !== city)
          : [...prev.selectedCities, city]
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      const payload = {
        ...prefs,
        userId: user?.uid || "guest"
      };

      const res = await fetch("/api/alerts/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: payload })
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMsg(data.error || "Failed to save alert preferences.");
      }
    } catch (err: any) {
      setErrorMsg("Network error saving preferences.");
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerTest = async (channel: "whatsapp" | "telegram") => {
    setTestDispatching(channel);
    setTestOutput(null);

    try {
      const res = await fetch("/api/alerts/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid || "guest",
          channel,
          targetNumber: prefs.whatsappNumber,
          targetChatId: prefs.telegramChatId
        })
      });

      const data = await res.json();
      if (data.success) {
        setTestOutput(data);
      } else {
        setErrorMsg(data.error || "Failed to trigger test alert.");
      }
    } catch (err: any) {
      setErrorMsg("Error sending test notification.");
    } finally {
      setTestDispatching(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#111827] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-[#6B7280]">Loading notification preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white text-[#111827] font-sans pb-24 selection:bg-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-in fade-in">
          
          {/* Top Breadcrumb */}
          <div className="flex items-center justify-between">
            <Link
              href="/career"
              className="text-xs font-semibold text-[#6B7280] hover:text-[#111827] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Career OS</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#F7F8FA] text-[#6B7280] border border-[#E5E7EB]">
                Push Notification Grid
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                Webhook Connected
              </span>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#2563EB]" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6B7280]">
                Direct Channel Dispatcher
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              WhatsApp &amp; Telegram Opportunity Alerts
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] max-w-2xl leading-relaxed">
              Never miss verified campus placement drives, off-campus hackathons, or deadline expirations. Choose your exact disciplines, preferred cities, and delivery speed.
            </p>
          </div>

          {/* Main Configuration Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Channel 1: WhatsApp Setup Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#111827]">WhatsApp Delivery</h3>
                      <p className="text-xs text-[#6B7280]">Verified notifications via official WhatsApp Business API</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs.whatsappEnabled}
                      onChange={(e) => setPrefs({ ...prefs, whatsappEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {prefs.whatsappEnabled && (
                  <div className="space-y-3 pt-2 border-t border-[#E5E7EB]">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#6B7280]">
                        Mobile Phone Number (with Country Code)
                      </label>
                      <input
                        type="text"
                        placeholder="+91 9876543210"
                        value={prefs.whatsappNumber}
                        onChange={(e) => setPrefs({ ...prefs, whatsappNumber: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:border-[#111827] font-mono transition-all"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#6B7280]">
                        Status: {prefs.whatsappNumber ? "Configured" : "Enter number to enable"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTriggerTest("whatsapp")}
                        disabled={testDispatching === "whatsapp" || !prefs.whatsappNumber}
                        className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F7F8FA] text-xs font-semibold text-[#111827] flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {testDispatching === "whatsapp" ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3 text-emerald-600" />
                            <span>Send Test WhatsApp</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Channel 2: Telegram Setup Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#111827]">Telegram Bot Channel</h3>
                      <p className="text-xs text-[#6B7280]">Zero spam, instant push pings with markdown previews</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs.telegramEnabled}
                      onChange={(e) => setPrefs({ ...prefs, telegramEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563EB]"></div>
                  </label>
                </div>

                {prefs.telegramEnabled && (
                  <div className="space-y-3 pt-2 border-t border-[#E5E7EB]">
                    <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111827]">Step 1: Connect to EdWorld Bot</span>
                        <a
                          href={`https://t.me/EdWorldAlertsBot?start=${user?.uid || "guest"}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-md bg-[#2563EB] text-white text-[11px] font-bold flex items-center gap-1 hover:bg-[#1D4ED8]"
                        >
                          <span>Open @EdWorldAlertsBot</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-[11px] text-[#6B7280]">
                        Click the button above to launch our bot and type <code>/start</code>. Then enter your Chat ID or handle below.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#6B7280]">
                        Telegram Chat ID or Username
                      </label>
                      <input
                        type="text"
                        placeholder="@your_telegram_handle or Chat ID"
                        value={prefs.telegramChatId || ""}
                        onChange={(e) => setPrefs({ ...prefs, telegramChatId: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:border-[#111827] font-mono transition-all"
                      />
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleTriggerTest("telegram")}
                        disabled={testDispatching === "telegram"}
                        className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F7F8FA] text-xs font-semibold text-[#111827] flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        {testDispatching === "telegram" ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3 text-[#2563EB]" />
                            <span>Send Test Telegram</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Roles Preference Section */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="text-sm font-bold text-[#111827]">
                    Target Job Roles &amp; Tracks ({prefs.selectedRoles.length})
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {POPULAR_ROLES.map((role) => {
                    const isSelected = prefs.selectedRoles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleToggleRole(role)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#111827] text-white shadow-xs"
                            : "bg-[#F7F8FA] text-[#6B7280] hover:text-[#111827] hover:bg-neutral-100 border border-[#E5E7EB]"
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cities Preference Section */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="text-sm font-bold text-[#111827]">
                    Target Locations ({prefs.selectedCities.length})
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {POPULAR_CITIES.map((city) => {
                    const isSelected = prefs.selectedCities.includes(city);
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleToggleCity(city)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#111827] text-white shadow-xs"
                            : "bg-[#F7F8FA] text-[#6B7280] hover:text-[#111827] hover:bg-neutral-100 border border-[#E5E7EB]"
                        }`}
                      >
                        {city}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Frequency Selector */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="text-sm font-bold text-[#111827]">Alert Pacing &amp; Frequency</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "instant", label: "Instant Pings", desc: "Real-time as jobs drop" },
                    { id: "daily_digest", label: "Daily Digest", desc: "Every morning at 9 AM" },
                    { id: "weekly", label: "Weekly Roundup", desc: "Every Sunday 6 PM" },
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() => setPrefs({ ...prefs, frequency: freq.id as any })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        prefs.frequency === freq.id
                          ? "border-[#111827] bg-[#F7F8FA] shadow-xs"
                          : "border-[#E5E7EB] bg-white hover:border-neutral-300"
                      }`}
                    >
                      <div className="text-xs font-bold text-[#111827]">{freq.label}</div>
                      <div className="text-[10px] text-[#6B7280] mt-0.5">{freq.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button & Feedback */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Preferences...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Alert Preferences</span>
                    </>
                  )}
                </button>

                {errorMsg && (
                  <span className="text-xs text-red-600 font-semibold">{errorMsg}</span>
                )}
              </div>

            </div>

            {/* Right Column: Live Notification Preview & Privacy Shield */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Message Payload Preview Card */}
              <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                    Live Alert Template Preview
                  </h4>
                  <span className="text-[10px] font-mono text-[#6B7280]">Direct Render</span>
                </div>

                {/* Simulated Phone Notification Bubble */}
                <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-3 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                    <span className="font-bold text-[#111827] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      EdWorld Dispatcher
                    </span>
                    <span className="text-[10px] text-[#6B7280]">Just now</span>
                  </div>

                  <div className="space-y-1.5 leading-relaxed text-[#111827]">
                    <p className="font-bold">
                      🚀 New Role Match: SDE Trainee @ Razorpay (Bengaluru)
                    </p>
                    <p className="text-[11px] text-[#4B5563]">
                      💰 <strong>Compensation:</strong> 14 - 18 LPA<br />
                      🎯 <strong>Profile Match:</strong> 94% compatibility<br />
                      ⏰ <strong>Deadline:</strong> Apply by 31st Oct 2026
                    </p>
                    <div className="pt-1">
                      <span className="inline-block px-2.5 py-1 rounded bg-[#2563EB] text-white text-[10px] font-bold">
                        One-Click Apply &rarr;
                      </span>
                    </div>
                  </div>
                </div>

                {testOutput && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1 animate-in fade-in">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{testOutput.message}</span>
                    </div>
                    <pre className="text-[10px] font-mono bg-white p-2 rounded border border-emerald-200 overflow-x-auto text-[#111827]">
                      {JSON.stringify(testOutput.payload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Privacy & Opt-Out Policy */}
              <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                    Privacy &amp; Spam Shield
                  </h4>
                </div>

                <p className="text-xs text-[#6B7280] leading-relaxed">
                  We guarantee 100% zero promotional broadcast spam. Your phone number and Telegram Chat ID are encrypted and only used for your chosen job alerts.
                </p>

                <div className="pt-2 border-t border-[#E5E7EB] space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPrefs({
                        ...prefs,
                        whatsappEnabled: false,
                        telegramEnabled: false
                      });
                    }}
                    className="w-full py-2 px-3 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BellOff className="w-3.5 h-3.5" />
                    <span>Mute &amp; Pause All Channels</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </AuthGuard>
  );
}
