import { NextRequest, NextResponse } from "next/server";
import { VOICE_PROFILES, VoiceChoice } from "@/lib/interview/voice-profiles";

export const dynamic = "force-dynamic";

// In-memory cache for synthesized speech metadata & static prompts
const TTS_AUDIO_CACHE = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { 
      text, 
      questionId, 
      voiceId = "myra-neutral", 
      speed = 1.0 
    } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required for TTS synthesis." }, 
        { status: 400 }
      );
    }

    const chosenVoiceKey: VoiceChoice = VOICE_PROFILES[voiceId as VoiceChoice] ? (voiceId as VoiceChoice) : "myra-neutral";
    const voiceProfile = VOICE_PROFILES[chosenVoiceKey];
    
    // Clamp speed between 0.75x and 1.5x
    const numericSpeed = Math.min(Math.max(Number(speed) || 1.0, 0.75), 1.5);
    const finalRate = Math.round((voiceProfile.defaultRate * numericSpeed) * 100) / 100;

    const cacheKey = `${questionId || text.slice(0, 60)}_${chosenVoiceKey}_${finalRate}`;

    // Check cache
    if (TTS_AUDIO_CACHE.has(cacheKey)) {
      return NextResponse.json({
        success: true,
        cached: true,
        ...TTS_AUDIO_CACHE.get(cacheKey),
      });
    }

    // High quality speech synthesis parameters
    const synthesisData = {
      success: true,
      text,
      voiceId: voiceProfile.id,
      voiceName: voiceProfile.name,
      voiceHints: voiceProfile.voiceHints,
      rate: finalRate,
      pitch: voiceProfile.defaultPitch,
      clientFallbackRequired: true, // Guarantees browser native Web Speech engine executes client-side without exposing API keys
      availableVoices: Object.values(VOICE_PROFILES).map(v => ({ id: v.id, name: v.name })),
    };

    TTS_AUDIO_CACHE.set(cacheKey, synthesisData);

    return NextResponse.json(synthesisData);
  } catch (err: any) {
    // Graceful fallback to text-only mode
    return NextResponse.json({
      success: false,
      textOnlyFallback: true,
      error: err.message || "TTS error"
    });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    voices: Object.values(VOICE_PROFILES).map(v => ({
      id: v.id,
      name: v.name,
      defaultPitch: v.defaultPitch,
      defaultRate: v.defaultRate,
    })),
  });
}
