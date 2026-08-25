import { NextRequest, NextResponse } from 'next/server';
import type { RegionalChatMessage } from '@/types';

// Mock storage
let messages: RegionalChatMessage[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region');

  if (!region) {
    return NextResponse.json({ error: 'Region required' }, { status: 400 });
  }

  // Filter messages by region
  const regionMessages = messages.filter(m => m.region === region);

  return NextResponse.json({ messages: regionMessages });
}

export async function POST(request: NextRequest) {
  try {
    const message: RegionalChatMessage = await request.json();

    // Add to storage
    messages.push(message);

    // Keep only last 100 messages per region
    if (messages.length > 100) {
      messages = messages.slice(-100);
    }

    return NextResponse.json({ message, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
