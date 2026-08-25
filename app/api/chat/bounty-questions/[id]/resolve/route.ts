import { NextRequest, NextResponse } from 'next/server';
import { bountyQuestions } from '../route';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questionIndex = bountyQuestions.findIndex(q => q.id === params.id);

    if (questionIndex === -1) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const question = bountyQuestions[questionIndex];

    // Only author can resolve
    if (question.status !== 'in_progress') {
      return NextResponse.json({ error: 'Question not in progress' }, { status: 400 });
    }

    // Update question status
    question.status = 'resolved';
    question.resolvedAt = new Date();

    // TODO: Transfer bounty points from author to helper

    return NextResponse.json({ question, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
