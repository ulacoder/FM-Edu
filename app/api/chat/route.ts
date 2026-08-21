import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Student } from '@/types';

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || '';
const BASE_URL = 'https://ws-yf8sb129bygmh1i9.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1';
const STUDENTS_FILE = path.join(process.cwd(), 'data', 'students.json');

// Функция для определения вопроса с домашним заданием
function detectHomeworkQuestion(message: string, history: any[] = []): boolean {
  const lowerMessage = message.toLowerCase();

  // Ключевые фразы, указывающие на просьбу решить задачу
  const homeworkPatterns = [
    'реши',
    'решите',
    'как решить',
    'помоги решить',
    'не понимаю как',
    'не могу решить',
    'что делать с',
    'как найти',
    'вычисли',
    'вычислите',
    'найди ответ',
    'какой ответ',
    'дай ответ',
    'скажи ответ',
    'подскажи ответ'
  ];

  // Математические/научные индикаторы
  const academicIndicators = [
    'задача',
    'задание',
    'пример',
    'уравнение',
    'формул',
    'теорем',
    'доказать',
    'вычисл',
    '=',
    '+',
    'x',
    'y'
  ];

  const hasHomeworkPattern = homeworkPatterns.some(pattern => lowerMessage.includes(pattern));
  const hasAcademicIndicator = academicIndicators.some(indicator => lowerMessage.includes(indicator));

  // Если есть и просьба и академический контекст - это точно домашка
  if (hasHomeworkPattern && hasAcademicIndicator) {
    return true;
  }

  // Проверяем историю - если студент уже пытался решить что-то
  const recentHistory = history.slice(-3);
  const hasRecentAttempts = recentHistory.some((msg: any) =>
    msg.role === 'user' && (
      msg.content.toLowerCase().includes('попробовал') ||
      msg.content.toLowerCase().includes('получилось') ||
      msg.content.toLowerCase().includes('не получается')
    )
  );

  if (hasHomeworkPattern || (hasAcademicIndicator && hasRecentAttempts)) {
    return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory, studentId } = await req.json();

    console.log('📨 Received message:', message);
    console.log('📊 History length:', conversationHistory?.length || 0);
    console.log('👤 Student ID:', studentId);

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ response: "Напиши что-нибудь..." });
    }

    // Загружаем MBTI профиль студента, если передан studentId
    let mbtiContext = '';
    let burnoutContext = '';

    if (studentId) {
      try {
        const studentsData = await fs.readFile(STUDENTS_FILE, 'utf-8');
        const students: Student[] = JSON.parse(studentsData);
        const student = students.find(s => s.id === studentId);

        if (student?.mbtiProfile) {
          const { type, learningStyle, strengths, challenges } = student.mbtiProfile;
          mbtiContext = `\n\nТИП ЛИЧНОСТИ СТУДЕНТА (MBTI: ${type}):
- Стиль обучения: ${learningStyle}
- Сильные стороны: ${strengths.join(', ')}
- Возможные сложности: ${challenges.join(', ')}

ВАЖНО: Адаптируй свои объяснения под тип личности студента. Используй подходы, которые соответствуют его стилю обучения.`;
        }

        // Добавляем контекст психологической поддержки
        burnoutContext = `\n\nПСИХОЛОГИЧЕСКАЯ ПОДДЕРЖКА:
- Всегда будь позитивным и ободряющим
- Подбадривай студента, особенно если видишь, что он устал или разочарован
- Предлагай сделать перерыв или поиграть в игры, если студент выглядит уставшим
- Используй эмодзи чтобы сделать общение теплее и дружелюбнее
- Будь как друг, а не как учитель - понимай, слушай, поддерживай
- Если студент пишет о стрессе, усталости или низкой мотивации - предложи игры по предметам для разрядки
- Напоминай, что ошибки - это нормально, они помогают учиться
- Хвали даже за маленькие достижения`;

      } catch (error) {
        console.error('Error loading student context:', error);
      }
    }

    // Определяем, просит ли студент прямой ответ на задачу
    const isHomeworkQuestion = detectHomeworkQuestion(message, conversationHistory);

    const systemPrompt = `Ты - Navi, умный и добрый AI-ассистент платформы FM Edu для школьников 7-12 классов.

ПРАВИЛА:
1. Отвечай ИСКЛЮЧИТЕЛЬНО на русском языке.
2. Короткие и ясные ответы (2-4 предложения для общих вопросов).
3. Используй эмодзи для эмоций (1-2 на сообщение).
4. Помогай с вопросами о платформе, учебе, предметах.
5. ВСЕГДА ПОДДЕРЖИВАЙ И МОТИВИРУЙ студента - ты его друг и помощник!

🎯 СОКРАТОВСКИЙ МЕТОД (САМОЕ ВАЖНОЕ):
Когда студент просит помощи с задачей или не понимает тему:
- НЕ ДАВАЙ готовый ответ сразу!
- Задавай наводящие вопросы, которые приведут студента к открытию ответа самостоятельно
- Разбивай сложную задачу на маленькие шаги
- Спрашивай: "Что ты уже знаешь об этом?", "Какие способы ты пробовал?", "Что произойдет если...?"
- Хвали каждый правильный шаг в мышлении
- Давай подсказки через вопросы: "А помнишь формулу для...?", "Что общего между этим и...?"
- Только после 3-4 неудачных попыток можешь дать более прямую подсказку
- Эмпатия важна: "Понимаю, что сложно! Давай разберем по шагам 💪"

ПРИМЕРЫ СОКРАТОВСКОГО ПОДХОДА:
❌ Плохо: "Ответ: 24. Формула площади..."
✅ Хорошо: "Отличный вопрос! 🤔 Давай подумаем вместе: что ты знаешь о площади прямоугольника? Какие данные у нас есть?"

❌ Плохо: "Это решается через квадратное уравнение"
✅ Хорошо: "Интересная задача! Какой вид имеет это выражение? Видишь ли ты что-то общее с уравнениями, которые ты решал раньше?"

О ПЛАТФОРМЕ FM EDU:
- Программа: NIS (Назарбаев Интеллектуальные Школы)
- Предметы: Математика, Физика, Информатика, Химия, Биология, Экономика, География, Английский
- Диагностика уровня знаний
- Персонализированные рекомендации от AI
- Мгновенная обратная связь по заданиям
- ИГРЫ по всем предметам для отдыха и обучения - рекомендуй их, если студент устал!

НЕ ДАВАЙ прямые ответы на домашние задания — направляй к правильному мышлению через вопросы!
Будь дружелюбным, ЭМПАТИЧНЫМ и мотивирующим! Ты заботишься о студенте и его самочувствии.${mbtiContext}${burnoutContext}

${isHomeworkQuestion ? '\n⚠️ ВНИМАНИЕ: Студент просит помощь с задачей. Используй Сократовский метод - задавай наводящие вопросы вместо прямого ответа!' : ''}`;

    const recentMessages = conversationHistory?.slice(-20) || [];

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...recentMessages.map((msg: any) => ({
        role: msg.role === 'navi' ? 'assistant' : msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const requestBody = {
      model: 'qwen3.5-flash',
      messages: apiMessages,
      temperature: 0.9,
      max_tokens: 2000,
      stream: false
    };

    console.log('🚀 Calling Qwen API...');

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Qwen API error:', errorData);
      throw new Error(errorData.error?.message || 'Qwen API error');
    }

    const data = await response.json();
    let aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse || aiResponse.trim() === '') {
      throw new Error('AI не дал ответ. Попробуй еще раз.');
    }

    // Clean response
    aiResponse = aiResponse
      .replace(/^\n+/, '')
      .replace(/Here's a thinking process:[\s\S]*?(?=\n\n|$)/gi, '')
      .replace(/Thinking Process:[\s\S]*?(?=\n\n|$)/gi, '')
      .trim();

    console.log('✅ Qwen API response received');

    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    console.error('💥 Chat API error:', error);
    return NextResponse.json(
      { error: `Ошибка: ${error.message || 'Что-то пошло не так'}` },
      { status: 500 }
    );
  }
}
