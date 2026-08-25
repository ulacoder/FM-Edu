import { NextRequest, NextResponse } from 'next/server';
import type { BountyQuestion, BountyThreadMessage } from '@/types';

// Shared storage across all bounty endpoints
export let bountyQuestions: BountyQuestion[] = [];
export let threadMessages: BountyThreadMessage[] = [];

// Get specific question
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const question = bountyQuestions.find(q => q.id === params.id);

  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }

  return NextResponse.json({ question });
}
