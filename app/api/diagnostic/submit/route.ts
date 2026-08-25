import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { findById, create, update, generateId } from '@/lib/db';
import { DiagnosticTest, DiagnosticResult, Student } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');

    // Simple token validation - check if token exists
    if (!token || !token.startsWith('Bearer ')) {
      console.error('No token or invalid format:', token);
      return NextResponse.json(
        { error: 'Unauthorized - No valid token' },
        { status: 401 }
      );
    }

    // Extract token (remove "Bearer " prefix)
    const actualToken = token.replace('Bearer ', '');

    // Validate token format (should start with "token_")
    if (!actualToken.startsWith('token_')) {
      console.error('Token does not start with token_:', actualToken);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token format' },
        { status: 401 }
      );
    }

    // Extract user ID from token
    const userId = actualToken.replace('token_', '');

    const body = await request.json();
    const { testId, answers } = body as { testId: string; answers: number[] };

    // Get test from the request (it's generated on client)
    // For now, just calculate results based on answers
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Invalid answers format' },
        { status: 400 }
      );
    }

    // Mock test data - in real app would fetch from DB
    const totalQuestions = answers.length;
    const correctCount = answers.filter((answer, index) => {
      // Simple mock: every 2nd question is correct if answered with index 0
      return answer === 0 || Math.random() > 0.5;
    }).length;

    const score = Math.round((correctCount / totalQuestions) * 100);

    // Determine level
    let level: 'beginner' | 'intermediate' | 'advanced';
    if (score < 50) {
      level = 'beginner';
    } else if (score < 75) {
      level = 'intermediate';
    } else {
      level = 'advanced';
    }

    // Mock weak topics
    const weakTopics = answers
      .map((answer, index) => (answer !== 0 && Math.random() > 0.5 ? `Тема ${index + 1}` : null))
      .filter(Boolean)
      .slice(0, 3);

    return NextResponse.json({
      score,
      level,
      correctCount,
      totalQuestions,
      weakTopics,
    });
  } catch (error) {
    console.error('Diagnostic submit error:', error);
    return NextResponse.json(
      { error: 'Error submitting diagnostic' },
      { status: 500 }
    );
  }
}
