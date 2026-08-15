import { NextRequest, NextResponse } from 'next/server';
import { qwenChat } from '@/lib/qwen';
import { findById, generateId, create } from '@/lib/db';
import { Topic, Assignment, Question } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topicId, difficulty = 'medium', count = 5 } = body;

    const topic = findById<Topic>('topics', topicId);
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Генерация заданий через Qwen AI
    const prompt = `Создай ${count} задач по теме "${topic.title}" (${topic.description}) для ${topic.grade} класса.
Уровень сложности: ${difficulty}

Требования:
- Задачи должны соответствовать программе МОН РК
- Формат: multiple choice с 4 вариантами ответа
- Каждая задача проверяет понимание темы
- Добавь подробное объяснение к каждому ответу

Верни СТРОГО JSON (без markdown):
{
  "questions": [
    {
      "text": "Текст задачи",
      "options": ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"],
      "correctAnswer": 0,
      "explanation": "Подробное объяснение правильного ответа",
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
        { error: 'Failed to generate assignment. Please try again.' },
        { status: 500 }
      );
    }

    // Создание задания
    const assignment: Assignment = {
      id: generateId(),
      topicId,
      type: 'test',
      title: `Тест: ${topic.title}`,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      questions,
    };

    create('assignments', assignment);

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Assignment generation error:', error);
    return NextResponse.json(
      { error: 'Error generating assignment' },
      { status: 500 }
    );
  }
}
