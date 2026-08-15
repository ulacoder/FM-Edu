import { NextRequest, NextResponse } from 'next/server';
import { findById } from '@/lib/db';
import { Assignment } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const { assignmentId } = await params;

    const assignment = findById<Assignment>('assignments', assignmentId);
    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Assignment fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching assignment' },
      { status: 500 }
    );
  }
}
