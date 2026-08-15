import { NextRequest, NextResponse } from 'next/server';
import { findById, findBy } from '@/lib/db';
import { Topic, Material, Assignment } from '@/types';
import { qwenChat } from '@/lib/qwen';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const { topicId } = await params;

    const topic = findById<Topic>('topics', topicId);
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Получаем материалы для темы (пока mock)
    let materials = findBy<Material>('materials', (m) => m.topicId === topicId);

    // Если материалов нет, генерируем через AI
    if (materials.length === 0) {
      const prompt = `Подбери 3-5 образовательных YouTube видео на русском языке по теме "${topic.title}" для ${topic.grade} класса.

Верни ТОЛЬКО JSON массив:
[
  {
    "title": "Название видео",
    "url": "https://youtube.com/watch?v=...",
    "duration": 600,
    "difficulty": "easy" | "medium" | "hard"
  }
]`;

      try {
        const aiResponse = await qwenChat([{ role: 'user', content: prompt }]);
        const jsonMatch = aiResponse.match(/\[[\s\S]*?\]/);
        if (jsonMatch) {
          const videos = JSON.parse(jsonMatch[0]);
          // Для MVP используем mock данные, так как AI не может гарантировать реальные YouTube ссылки
          materials = [
            {
              id: '1',
              topicId,
              type: 'video',
              title: `${topic.title} - Теория`,
              url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic.title + ' ' + topic.grade + ' класс')}`,
              difficulty: 'easy',
            },
            {
              id: '2',
              topicId,
              type: 'video',
              title: `${topic.title} - Практика`,
              url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic.title + ' примеры решения')}`,
              difficulty: 'medium',
            },
            {
              id: '3',
              topicId,
              type: 'video',
              title: `${topic.title} - Сложные задачи`,
              url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic.title + ' олимпиадные задачи')}`,
              difficulty: 'hard',
            },
          ];
        }
      } catch (error) {
        console.error('Error generating materials:', error);
      }
    }

    // Получаем задания для темы
    const assignments = findBy<Assignment>('assignments', (a) => a.topicId === topicId);

    return NextResponse.json({
      topic,
      materials,
      assignments,
    });
  } catch (error) {
    console.error('Topic fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching topic' },
      { status: 500 }
    );
  }
}
