import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { RoadmapGoal } from '@/types';

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || '';
const BASE_URL = 'https://ws-yf8sb129bygmh1i9.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1';
const ROADMAPS_FILE = path.join(process.cwd(), 'data', 'roadmaps.json');

// Инициализация файла если не существует
async function ensureRoadmapsFile() {
  try {
    await fs.access(ROADMAPS_FILE);
  } catch {
    await fs.writeFile(ROADMAPS_FILE, JSON.stringify([]), 'utf-8');
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Не указан ID студента' },
        { status: 400 }
      );
    }

    await ensureRoadmapsFile();
    const roadmapsData = await fs.readFile(ROADMAPS_FILE, 'utf-8');
    const roadmaps: RoadmapGoal[] = JSON.parse(roadmapsData);

    const studentRoadmaps = roadmaps.filter(r => r.studentId === studentId);

    return NextResponse.json({ roadmaps: studentRoadmaps });

  } catch (error: any) {
    console.error('Error fetching roadmaps:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при загрузке роадмапов' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, type, title, targetUniversity, targetSubject, portfolio, studentGrade, targetDate } = body;

    console.log('Roadmap creation request:', { studentId, type, title, targetUniversity, targetSubject, portfolio, studentGrade, targetDate });

    if (!studentId || !type || !title) {
      return NextResponse.json(
        { error: 'Не указаны необходимые параметры' },
        { status: 400 }
      );
    }

    // Для университета проверяем наличие портфолио
    if (type === 'university' && !portfolio) {
      return NextResponse.json(
        { error: 'Для поступления в университет необходимо заполнить портфолио' },
        { status: 400 }
      );
    }

    await ensureRoadmapsFile();
    const roadmapsData = await fs.readFile(ROADMAPS_FILE, 'utf-8');
    const roadmaps: RoadmapGoal[] = JSON.parse(roadmapsData);

    // Формируем промпт для AI
    let portfolioText = '';
    if (portfolio && type === 'university') {
      portfolioText = `
ТЕКУЩЕЕ ПОРТФОЛИО СТУДЕНТА:
- GPA (средний балл): ${portfolio.gpa}/5.0
- Достижения: ${portfolio.achievements.length > 0 ? portfolio.achievements.join('; ') : 'нет'}
- Внеклассная активность: ${portfolio.activities.length > 0 ? portfolio.activities.join('; ') : 'нет'}
- Проекты: ${portfolio.projects.length > 0 ? portfolio.projects.join('; ') : 'нет'}
- Сертификаты: ${portfolio.certifications.length > 0 ? portfolio.certifications.join('; ') : 'нет'}
- Лидерство: ${portfolio.leadership.length > 0 ? portfolio.leadership.join('; ') : 'нет'}
${portfolio.testScores ? `- Результаты тестов: ${Object.entries(portfolio.testScores).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join(', ')}` : ''}
`;
    }

    console.log('Calling Qwen AI API...');

    // Генерируем роадмап с помощью AI
    const aiResponse = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen3.5-flash',
        messages: [
          {
            role: 'system',
            content: `Ты - карьерный консультант и эксперт по образованию в Казахстане.
Твоя задача - создать детальный план действий для ученика.

ВАЖНО: Ответь ТОЛЬКО в формате JSON, без дополнительного текста. Формат:
{
  "analysis": "Подробный анализ (2-3 абзаца): что нужно, какие требования, сложность цели, оценка текущего портфолио",
  ${type === 'university' ? '"alternativeUniversities": ["Университет 1", "Университет 2", "Университет 3"],' : ''}
  "tasks": [
    {
      "title": "Краткое название задачи",
      "description": "Детальное описание что делать",
      "deadline": "Класс и четверть (например '10 класс, 1 четверть')",
      "priority": "high/medium/low",
      "grade": число_класса,
      "quarter": номер_четверти_или_null
    }
  ]
}

${type === 'university' ? 'alternativeUniversities - список 3-5 альтернативных университетов в Казахстане и за рубежом, которые подходят студенту по профилю и уровню.' : ''}

Приоритеты:
- high (красный) = критически важно, без этого цель недостижима
- medium (желтый) = важно, значительно повышает шансы
- low (зеленый) = желательно, дает преимущество

Создай 8-12 конкретных задач с реалистичными дедлайнами.`
          },
          {
            role: 'user',
            content: `Создай роадмап для ученика ${studentGrade} класса.
Цель: ${title}
${type === 'university' ? `Целевой университет: ${targetUniversity}` : ''}
${type === 'olympiad' ? `Предмет олимпиады: ${targetSubject}` : ''}
${portfolioText}

Учитывай, что ученик сейчас в ${studentGrade} классе. Анализируй портфолио и давай конкретные рекомендации.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      throw new Error(`Ошибка AI API: ${aiResponse.status} ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received:', aiData);

    const aiContent = aiData.choices[0].message.content;

    let parsedAI;
    try {
      parsedAI = JSON.parse(aiContent);
    } catch (e) {
      console.error('Failed to parse AI content:', aiContent);
      // Если AI вернул текст с JSON внутри, пытаемся извлечь
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedAI = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('AI вернул некорректный формат');
      }
    }

    const newRoadmap: RoadmapGoal = {
      id: `roadmap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      studentId,
      type,
      title,
      targetUniversity: type === 'university' ? targetUniversity : undefined,
      targetSubject: (type === 'olympiad' || type === 'exam') ? targetSubject : undefined,
      targetDate: targetDate ? new Date(targetDate) : undefined,
      aiAnalysis: parsedAI.analysis,
      alternativeUniversities: type === 'university' && parsedAI.alternativeUniversities ? parsedAI.alternativeUniversities : undefined,
      tasks: parsedAI.tasks.map((task: any, index: number) => ({
        id: `task_${Date.now()}_${index}`,
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        priority: task.priority,
        completed: false,
        grade: task.grade,
        quarter: task.quarter
      })),
      portfolio: portfolio || undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    roadmaps.push(newRoadmap);
    await fs.writeFile(ROADMAPS_FILE, JSON.stringify(roadmaps, null, 2), 'utf-8');

    console.log('Roadmap created successfully:', newRoadmap.id);

    return NextResponse.json({
      success: true,
      roadmap: newRoadmap
    });

  } catch (error: any) {
    console.error('Error creating roadmap:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при создании роадмапа' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { roadmapId, taskId, completed } = await req.json();

    if (!roadmapId || !taskId || completed === undefined) {
      return NextResponse.json(
        { error: 'Не указаны необходимые параметры' },
        { status: 400 }
      );
    }

    await ensureRoadmapsFile();
    const roadmapsData = await fs.readFile(ROADMAPS_FILE, 'utf-8');
    const roadmaps: RoadmapGoal[] = JSON.parse(roadmapsData);

    const roadmapIndex = roadmaps.findIndex(r => r.id === roadmapId);
    if (roadmapIndex === -1) {
      return NextResponse.json(
        { error: 'Роадмап не найден' },
        { status: 404 }
      );
    }

    const taskIndex = roadmaps[roadmapIndex].tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Задача не найдена' },
        { status: 404 }
      );
    }

    roadmaps[roadmapIndex].tasks[taskIndex].completed = completed;
    roadmaps[roadmapIndex].updatedAt = new Date();

    await fs.writeFile(ROADMAPS_FILE, JSON.stringify(roadmaps, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      roadmap: roadmaps[roadmapIndex]
    });

  } catch (error: any) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при обновлении задачи' },
      { status: 500 }
    );
  }
}
