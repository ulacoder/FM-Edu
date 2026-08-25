import { NextRequest, NextResponse } from 'next/server';
import type { BountyQuestion, Student } from '@/types';

// Mock storage
let bountyQuestions: BountyQuestion[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region');

  if (!region) {
    return NextResponse.json({ error: 'Region required' }, { status: 400 });
  }

  // Filter by region, exclude cancelled
  const regionQuestions = bountyQuestions
    .filter(q => q.region === region && q.status !== 'cancelled')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ questions: regionQuestions });
}

export async function POST(request: NextRequest) {
  try {
    const question: BountyQuestion = await request.json();

    // Validate bounty amount
    if (![100, 200, 300].includes(question.bountyAmount)) {
      return NextResponse.json({ error: 'Invalid bounty amount' }, { status: 400 });
    }

    // Add to storage
    bountyQuestions.push(question);

    // TODO: Freeze points on user balance

    return NextResponse.json({ question, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
