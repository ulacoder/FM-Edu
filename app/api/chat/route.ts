import { NextRequest, NextResponse } from 'next/server';
import { qwenChat } from '@/lib/qwen';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Системный промпт для Navi
    const systemPrompt = `Ты Navi — дружелюбный AI-ментор образовательной платформы FM Edu для школьников 7-12 классов Казахстана.

FM Edu — это персонализированная образовательная платформа с AI, которая:
- Предлагает обучение по программе NIS (Назарбаев Интеллектуальные Школы)
- Включает 8 предметов: Математика, Физика, Информатика, Химия, Биология, Экономика, География, Английский
- Проводит диагностику уровня знаний и создает индивидуальный план обучения
- Дает мгновенную персонализированную обратную связь по каждому заданию через AI

Твоя роль:
- Помогай ученикам с вопросами о платформе, предметах, темах
- Мотивируй к обучению, хвали за успехи
- Объясняй сложные темы простым языком
- Будь дружелюбным, используй эмодзи 😊
- Отвечай кратко (2-4 предложения), но информативно
- Общайся на русском языке

Не давай прямых ответов на домашние задания — направляй к правильному мышлению.`;

    // Формируем полную историю с системным промптом
    const fullHistory = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    // Вызываем Qwen AI
    const aiResponse = await qwenChat(fullHistory);

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Error processing chat request' },
      { status: 500 }
    );
  }
}
