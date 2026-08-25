import { NextRequest, NextResponse } from 'next/server';
import { bountyQuestions } from '../route';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const questionIndex = bountyQuestions.findIndex(q => q.id === id);

    if (questionIndex === -1) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const question = bountyQuestions[questionIndex];

    // Update question status
    question.status = 'cancelled';

    // TODO: Unfreeze and return bounty points to author

    return NextResponse.json({ question, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
