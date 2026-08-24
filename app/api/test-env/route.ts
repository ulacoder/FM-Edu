import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.FISH_AUDIO_API_KEY;
  const voiceId = process.env.FISH_AUDIO_VOICE_ID;

  return NextResponse.json({
    hasApiKey: !!apiKey,
    hasVoiceId: !!voiceId,
    apiKeyPrefix: apiKey?.substring(0, 15) || 'NOT SET',
    voiceIdPrefix: voiceId?.substring(0, 15) || 'NOT SET',
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('FISH'))
  });
}
