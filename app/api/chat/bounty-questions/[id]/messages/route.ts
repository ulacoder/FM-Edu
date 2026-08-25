import { NextRequest, NextResponse } from 'next/server';
import type { BountyThreadMessage } from '@/types';

// Mock storage for thread messages
let threadMessages: BountyThreadMessage[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get messages for specific bounty question
  const messages = threadMessages.filter(m => m.bountyQuestionId === params.id);

  return NextResponse.json({ messages });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const message: BountyThreadMessage = await request.json();

    // Add to storage
    threadMessages.push(message);

    return NextResponse.json({ message, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
