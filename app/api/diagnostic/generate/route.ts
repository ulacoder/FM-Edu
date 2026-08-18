import { NextRequest, NextResponse } from 'next/server';
import { Subject, subjectNames, Question, DiagnosticTest } from '@/types';
import { generateId, create } from '@/lib/db';
import diagnosticTests from '@/data/diagnostic-tests.json';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, grade } = body as { subject: Subject; grade: number };

    if (!subject || !grade) {
      return NextResponse.json(
        { error: 'Subject and grade are required' },
        { status: 400 }
      );
    }

    console.log(`Generating diagnostic test for ${subjectNames[subject]}, grade ${grade}`);

    // Получаем статические вопросы из JSON
    const testData = diagnosticTests[subject as keyof typeof diagnosticTests];

    if (!testData || !testData[String(grade) as keyof typeof testData]) {
      return NextResponse.json(
        { error: `Тест для предмета ${subjectNames[subject]} и класса ${grade} пока не доступен. Попробуйте другой предмет или класс.` },
        { status: 404 }
      );
    }

    const staticQuestions = testData[String(grade) as keyof typeof testData] as any[];

    // Преобразуем в нужный формат с уникальными ID
    const questions: Question[] = staticQuestions.map((q: any) => ({
      id: generateId(),
      text: q.text,
      type: 'multiple_choice' as const,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      points: q.points || 10,
    }));

    console.log(`Successfully loaded ${questions.length} questions from static data`);

    // Создание диагностического теста
    const test: DiagnosticTest = {
      id: generateId(),
      subject,
      grade,
      questions,
    };

    create('diagnostic-tests', test);

    return NextResponse.json(test);
  } catch (error: any) {
    console.error('Diagnostic generation error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Error generating diagnostic test' },
      { status: 500 }
    );
  }
}
