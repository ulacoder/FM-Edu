import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { findById, create, update, generateId } from '@/lib/db';
import { DiagnosticTest, DiagnosticResult, Student } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');
    const user = getUserFromToken(token || '');

    if (!user || user.role !== 'student') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { testId, answers } = body as { testId: string; answers: number[] };

    // Получаем тест
    const test = findById<DiagnosticTest>('diagnostic-tests', testId);
    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // Подсчёт правильных ответов
    let correctCount = 0;
    const weakTopics: string[] = [];

    test.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      } else {
        weakTopics.push(question.text.slice(0, 50)); // Сохраняем начало вопроса как слабую тему
      }
    });

    const score = (correctCount / test.questions.length) * 100;

    // Определение уровня
    let level: 'beginner' | 'intermediate' | 'advanced';
    if (score < 50) {
      level = 'beginner';
    } else if (score < 75) {
      level = 'intermediate';
    } else {
      level = 'advanced';
    }

    // Сохранение результата
    const result: DiagnosticResult = {
      id: generateId(),
      studentId: user.userId,
      testId,
      score,
      level,
      weakTopics,
      completedAt: new Date(),
    };

    create('diagnostic-results', result);

    // Обновление профиля ученика
    update<Student>('students', user.userId, { level });

    return NextResponse.json({
      score,
      level,
      correctCount,
      totalQuestions: test.questions.length,
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
