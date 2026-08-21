import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Student, MBTIType, MBTIProfile } from '@/types';
import { qwenChat } from '@/lib/qwen';

const STUDENTS_FILE = path.join(process.cwd(), 'data', 'students.json');

const MBTI_DESCRIPTIONS: Record<MBTIType, { title: string; traits: string }> = {
  'INTJ': { title: 'Архитектор', traits: 'Стратегический мыслитель с жаждой знаний' },
  'INTP': { title: 'Логик', traits: 'Инновационные изобретатели с неутолимой жаждой знаний' },
  'ENTJ': { title: 'Командир', traits: 'Смелые, образные и волевые лидеры' },
  'ENTP': { title: 'Полемист', traits: 'Умные и любопытные мыслители' },
  'INFJ': { title: 'Активист', traits: 'Тихие и мистические идеалисты' },
  'INFP': { title: 'Посредник', traits: 'Поэтические, добрые и альтруистичные личности' },
  'ENFJ': { title: 'Тренер', traits: 'Харизматичные и вдохновляющие лидеры' },
  'ENFP': { title: 'Борец', traits: 'Энтузиасты, креативные и общительные' },
  'ISTJ': { title: 'Администратор', traits: 'Практичные и ориентированные на факты' },
  'ISFJ': { title: 'Защитник', traits: 'Очень преданные и теплые защитники' },
  'ESTJ': { title: 'Менеджер', traits: 'Превосходные администраторы' },
  'ESFJ': { title: 'Консул', traits: 'Заботливые, общительные и популярные' },
  'ISTP': { title: 'Виртуоз', traits: 'Смелые и практичные экспериментаторы' },
  'ISFP': { title: 'Артист', traits: 'Гибкие и очаровательные художники' },
  'ESTP': { title: 'Предприниматель', traits: 'Умные, энергичные и перцептивные' },
  'ESFP': { title: 'Развлекатель', traits: 'Спонтанные, энергичные и энтузиасты' }
};

export async function POST(req: NextRequest) {
  try {
    const { studentId, mbtiType } = await req.json();

    if (!studentId || !mbtiType) {
      return NextResponse.json(
        { error: 'Не указан ID студента или MBTI тип' },
        { status: 400 }
      );
    }

    const studentsData = await fs.readFile(STUDENTS_FILE, 'utf-8');
    const students: Student[] = JSON.parse(studentsData);

    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
      return NextResponse.json(
        { error: 'Студент не найден' },
        { status: 404 }
      );
    }

    const student = students[studentIndex];
    const mbtiInfo = MBTI_DESCRIPTIONS[mbtiType as MBTIType];

    // Генерируем детальный анализ через AI (как в Mentoria Hub)
    const prompt = `Ты эксперт по психологии и типологии MBTI, работающий с платформой FM Edu для школьников.

**Профиль студента:**
- Имя: ${student.name}
- Класс: ${student.grade}
- MBTI тип: ${mbtiType} (${mbtiInfo.title})

**Твоя задача:**
Создай детальный персонализированный анализ для этого студента на основе его MBTI типа. Используй знания о том, как ${mbtiType} учатся, общаются, принимают решения и работают.

Верни ТОЛЬКО валидный JSON в таком формате:
{
  "feedback": "Персональное приветствие и общий анализ личности студента (200-300 слов). Обращайся к студенту напрямую на 'ты'. Объясни что значит быть ${mbtiType}, как это проявляется в учебе и жизни. Будь теплым и мотивирующим. Начни с 'Привет, ${student.name}!'",
  "strengths": [
    "Конкретная сильная сторона 1 специфичная для ${mbtiType} в учебе",
    "Сильная сторона 2 в социальном взаимодействии",
    "Сильная сторона 3 в решении задач",
    "Сильная сторона 4 в организации"
  ],
  "challenges": [
    "Область для развития 1 (формулируй позитивно, как возможность роста)",
    "Область для развития 2 специфичная для ${mbtiType}",
    "Область для развития 3 в учебном процессе"
  ],
  "recommendations": [
    "Практическая рекомендация 1 для эффективного обучения",
    "Рекомендация 2 по организации времени",
    "Рекомендация 3 по работе с мотивацией",
    "Рекомендация 4 специфичная для ${mbtiType}"
  ],
  "learningStyle": "Подробное описание как ${mbtiType} лучше всего усваивает информацию, какие методы обучения наиболее эффективны, оптимальная среда для учебы (100-150 слов)"
}

НЕ ПИШИ НИЧЕГО КРОМЕ JSON. Начинай ответ с {. Весь текст на русском языке.`;

    const aiResponse = await qwenChat([
      {
        role: 'system',
        content: 'Ты педагог-психолог, эксперт по MBTI и индивидуальным методам обучения. Твои ответы конкретные, теплые, мотивирующие и адаптированы под школьников.'
      },
      { role: 'user', content: prompt }
    ]);

    // Парсим JSON ответ
    let cleanedResponse = aiResponse.trim();

    // Убираем markdown обертки если есть
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    // Находим JSON объект
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI не вернул валидный JSON');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Создаем профиль
    const mbtiProfile: MBTIProfile = {
      type: mbtiType as MBTIType,
      description: analysis.feedback || `Ты ${mbtiType} - ${mbtiInfo.title}. ${mbtiInfo.traits}.`,
      learningStyle: analysis.learningStyle || 'Адаптивный подход к обучению с учетом личных особенностей',
      strengths: analysis.strengths || [
        mbtiInfo.traits,
        'Способность к самостоятельному обучению',
        'Адаптивность к различным методам'
      ],
      challenges: analysis.challenges || [
        'Индивидуальные особенности требуют персонализированного подхода',
        'Важно найти оптимальный темп работы'
      ],
      recommendations: analysis.recommendations || [],
      setAt: new Date()
    };

    students[studentIndex].mbtiProfile = mbtiProfile;

    await fs.writeFile(STUDENTS_FILE, JSON.stringify(students, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      profile: mbtiProfile
    });

  } catch (error: any) {
    console.error('Error setting MBTI profile:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при сохранении MBTI профиля' },
      { status: 500 }
    );
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

    const studentsData = await fs.readFile(STUDENTS_FILE, 'utf-8');
    const students: Student[] = JSON.parse(studentsData);

    const student = students.find(s => s.id === studentId);
    if (!student) {
      return NextResponse.json(
        { error: 'Студент не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      profile: student.mbtiProfile || null
    });

  } catch (error: any) {
    console.error('Error getting MBTI profile:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при получении MBTI профиля' },
      { status: 500 }
    );
  }
}
