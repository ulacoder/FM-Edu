import { NextRequest, NextResponse } from 'next/server';
import { bountyQuestions } from '../route';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { helperId, helperName } = await request.json();

    const questionIndex = bountyQuestions.findIndex(q => q.id === params.id);

    if (questionIndex === -1) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const question = bountyQuestions[questionIndex];

    // Race condition check
    if (question.status !== 'open') {
      return NextResponse.json(
        { error: 'Question already taken by another student' },
        { status: 409 }
      );
    }

    // Update question status
    question.status = 'in_progress';
    question.helperId = helperId;
    question.helperName = helperName;
    question.acceptedAt = new Date();

    return NextResponse.json({ question, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
