import { NextRequest, NextResponse } from 'next/server';

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || '';
const BASE_URL = 'https://ws-yf8sb129bygmh1i9.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1';

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory } = await req.json();

    console.log('📨 Received message:', message);
    console.log('📊 History length:', conversationHistory?.length || 0);

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ response: "Напиши что-нибудь..." });
    }

    const systemPrompt = `Ты - Navi, умный и добрый AI-ассистент платформы FM Edu для школьников 7-12 классов.

ПРАВИЛА:
1. Отвечай ИСКЛЮЧИТЕЛЬНО на русском языке.
2. Короткие и ясные ответы (2-4 предложения).
3. Используй эмодзи для эмоций (1-2 на сообщение).
4. Помогай с вопросами о платформе, учебе, предметах.

О ПЛАТФОРМЕ FM EDU:
- Программа: NIS (Назарбаев Интеллектуальные Школы)
- Предметы: Математика, Физика, Информатика, Химия, Биология, Экономика, География, Английский
- Диагностика уровня знаний
- Персонализированные рекомендации от AI
- Мгновенная обратная связь по заданиям

НЕ ДАВАЙ прямые ответы на домашние задания — направляй к правильному мышлению.
Будь дружелюбным и мотивирующим!`;

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
