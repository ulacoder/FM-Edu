import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { findById, findBy, create } from '@/lib/db';
import { Student, Topic, Material, Assignment, Recommendation } from '@/types';
import { qwenChat } from '@/lib/qwen';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');
    const user = getUserFromToken(token || '');

    if (!user || user.role !== 'student') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const student = findById<Student>('students', user.userId);
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Получаем темы для класса ученика
    const topics = findBy<Topic>('topics', (t) => t.grade === student.grade);

    // Получаем результаты диагностики
    const diagnosticResults = findBy<any>('diagnostic-results', (r) => r.studentId === student.id);
    const latestResult = diagnosticResults.sort((a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )[0];

    // Генерация рекомендаций через AI
    const prompt = `Ученик ${student.grade} класса прошёл диагностику.
Уровень: ${student.level || 'не определён'}
Цели: ${student.goals.join(', ')}
${latestResult ? `Слабые темы: ${latestResult.weakTopics.join(', ')}` : ''}

Доступные темы для изучения:
${topics.slice(0, 10).map(t => `- ${t.title}: ${t.description}`).join('\n')}

Порекомендуй 5-7 тем для изучения в порядке приоритета. Верни ТОЛЬКО JSON массив ID тем в порядке рекомендации:
["topic-id-1", "topic-id-2", ...]`;

    let suggestedTopicIds: string[] = [];
    try {
      const aiResponse = await qwenChat([{ role: 'user', content: prompt }]);
      const jsonMatch = aiResponse.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        suggestedTopicIds = JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('AI recommendation error:', error);
      // Fallback: просто берём первые темы по порядку
      suggestedTopicIds = topics.slice(0, 5).map(t => t.id);
    }

    // Получаем рекомендованные темы
    const recommendedTopics = suggestedTopicIds
      .map(id => topics.find(t => t.id === id))
      .filter(Boolean) as Topic[];

    // Получаем материалы для этих тем (mock данные пока)
    const materials: Material[] = [];
    const assignments: Assignment[] = [];

    const recommendation: Recommendation = {
      studentId: student.id,
      materials,
      assignments,
      suggestedPath: recommendedTopics.map(t => t.id),
      generatedAt: new Date(),
      reasoning: latestResult
        ? `На основе результатов диагностики (${Math.round(latestResult.score)}%) рекомендуем начать с этих тем`
        : 'Рекомендации на основе программы для вашего класса'
    };

    return NextResponse.json({
      topics: recommendedTopics,
      reasoning: recommendation.reasoning,
      level: student.level,
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Error generating recommendations' },
      { status: 500 }
    );
  }
}
