import { NextRequest, NextResponse } from 'next/server';
import { qwenChat } from '@/lib/qwen';
import { Subject, subjectNames, Question, DiagnosticTest } from '@/types';
import { generateId, create } from '@/lib/db';

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

    // Генерация теста через Qwen AI
    const prompt = `Создай диагностический тест по предмету "${subjectNames[subject]}" для ${grade} класса (программа МОН РК).

Требования:
- 10 вопросов разного уровня сложности (3 легких, 4 средних, 3 сложных)
- Формат: multiple choice с 4 вариантами ответа
- Покрывают основные темы программы для этого класса
- Вопросы должны помочь определить уровень ученика (начальный/средний/продвинутый)

Верни ответ СТРОГО в формате JSON (без дополнительного текста):
{
  "questions": [
    {
      "text": "Текст вопроса",
      "options": ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"],
      "correctAnswer": 0,
      "explanation": "Объяснение правильного ответа",
      "difficulty": "easy" | "medium" | "hard",
      "points": 10
    }
  ]
}`;

    const response = await qwenChat([
      { role: 'user', content: prompt }
    ]);

    // Парсинг ответа
    let questions: Question[];
    try {
      // Извлекаем JSON из ответа (может быть обёрнут в markdown блок)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      const parsed = JSON.parse(jsonMatch[0]);
      questions = parsed.questions.map((q: any) => ({
        id: generateId(),
        text: q.text,
        type: 'multiple_choice' as const,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: q.points || 10,
      }));
    } catch (parseError) {
      console.error('Failed to parse AI response:', response);
      return NextResponse.json(
        { error: 'Failed to generate test. Please try again.' },
        { status: 500 }
      );
    }

    // Создание диагностического теста
    const test: DiagnosticTest = {
      id: generateId(),
      subject,
      grade,
      questions,
    };

    create('diagnostic-tests', test);

    return NextResponse.json(test);
  } catch (error) {
    console.error('Diagnostic generation error:', error);
    return NextResponse.json(
      { error: 'Error generating diagnostic test' },
      { status: 500 }
    );
  }
}
