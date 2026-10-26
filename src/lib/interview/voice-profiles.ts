export type VoiceChoice = "myra-neutral" | "myra-warm" | "myra-executive";

export interface VoiceConfig {
  id: VoiceChoice;
  name: string;
  defaultPitch: number;
  defaultRate: number;
  voiceHints: string[];
}

export const VOICE_PROFILES: Record<VoiceChoice, VoiceConfig> = {
  "myra-neutral": {
    id: "myra-neutral",
    name: "Myra Neutral (Clear & Balanced)",
    defaultPitch: 1.0,
    defaultRate: 1.0,
    voiceHints: ["Natural", "Google US English", "en-US-Neural2-F", "Samantha", "Karen"],
  },
  "myra-warm": {
    id: "myra-warm",
    name: "Myra Warm (Supportive & Encouraging)",
    defaultPitch: 1.05,
    defaultRate: 0.95,
    voiceHints: ["en-US-Journey-F", "Zira", "Samantha", "Victoria", "Natural"],
  },
  "myra-executive": {
    id: "myra-executive",
    name: "Myra Executive (Direct & Measured)",
    defaultPitch: 0.95,
    defaultRate: 0.98,
    voiceHints: ["Daniel", "Alex", "en-US-Neural2-C", "Google UK English Female", "Victoria"],
  },
};
