import { NextRequest, NextResponse } from 'next/server';

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || '';
const BASE_URL = 'https://ws-yf8sb129bygmh1i9.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1';

// POST - распознать речь и получить ответ AI
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const conversationHistory = JSON.parse(formData.get('history') as string || '[]');
    const studentId = formData.get('studentId') as string;

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file required' }, { status: 400 });
    }

    // Конвертируем аудио в base64 для отправки в Qwen
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    // Используем Qwen для распознавания речи и генерации ответа
    const systemPrompt = `Ты - Navi, умный и добрый AI-ассистент платформы FM Edu для школьников 7-12 классов.

ГОЛОСОВОЙ РЕЖИМ:
- Говори естественно, как в живом разговоре
- Короткие фразы (1-2 предложения за раз)
- Используй разговорный стиль
- Будь энергичным и дружелюбным
- Отвечай быстро и по делу

ПРАВИЛА:
1. Отвечай ИСКЛЮЧИТЕЛЬНО на русском языке.
2. Короткие и ясные ответы (2-3 предложения).
3. Используй эмодзи для эмоций (1-2 на сообщение).
4. Помогай с вопросами о платформе, учебе, предметах.
5. ВСЕГДА ПОДДЕРЖИВАЙ И МОТИВИРУЙ студента!

О ПЛАТФОРМЕ FM EDU:
- Программа: NIS (Назарбаев Интеллектуальные Школы)
- Предметы: Математика, Физика, Информатика, Химия, Биология, Экономика, География, Английский
- Диагностика уровня знаний
- Персонализированные рекомендации от AI
- Игры по всем предметам для отдыха и обучения

Будь дружелюбным, эмпатичным и мотивирующим!`;

    // Временно используем простое распознавание через текст
    // TODO: Интегрировать Whisper API или другой STT сервис

    const userMessage = `[Голосовое сообщение от студента - требуется распознавание]`;

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === 'navi' ? 'assistant' : msg.role,
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    const requestBody = {
      model: 'qwen3.6-flash',
      messages: apiMessages,
      temperature: 0.9,
      max_tokens: 500, // Короче для голоса
      stream: false
    };

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
      console.error('Qwen API error:', errorData);
      throw new Error(errorData.error?.message || 'Qwen API error');
    }

    const data = await response.json();
    let aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse || aiResponse.trim() === '') {
      throw new Error('AI не дал ответ. Попробуй еще раз.');
    }

    aiResponse = aiResponse
      .replace(/^\n+/, '')
      .trim();

    return NextResponse.json({
      text: aiResponse,
      // В реальной версии здесь будет audioUrl от FishAudio TTS
      audioUrl: null
    });

  } catch (error: any) {
    console.error('Voice API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
