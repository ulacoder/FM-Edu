import { NextRequest, NextResponse } from 'next/server';

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || '';
const BASE_URL = 'https://ws-yf8sb129bygmh1i9.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1';

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

    console.log('📨 Received message:', message);
    console.log('📜 Conversation history length:', conversationHistory?.length || 0);

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

    // Формируем сообщения для API
    const recentMessages = conversationHistory?.slice(-20) || [];

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...recentMessages,
      { role: 'user', content: message }
    ];

    const requestBody = {
      model: 'qwen3.8-max',
      messages: apiMessages,
      temperature: 0.7,
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
      throw new Error(errorData.error?.message || JSON.stringify(errorData) || 'Qwen API error');
    }

    const data = await response.json();
    let aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse || aiResponse.trim() === '') {
      throw new Error('AI не дал ответ. Попробуй еще раз.');
    }

    console.log('✅ Qwen API response received');

    return NextResponse.json({
      response: aiResponse.trim(),
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('💥 Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка обработки запроса' },
      { status: 500 }
    );
  }
}
