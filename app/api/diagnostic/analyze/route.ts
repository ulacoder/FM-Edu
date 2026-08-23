import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { subject, score, level, correctCount, totalQuestions, weakTopics, studentName } = await request.json();

    const prompt = `Ты - мотивирующий преподаватель по предмету "${subject}". Ученик только что завершил диагностический тест.

Результаты теста:
- Правильных ответов: ${correctCount} из ${totalQuestions}
- Процент: ${Math.round(score)}%
- Уровень: ${level === 'beginner' ? 'Начальный' : level === 'intermediate' ? 'Средний' : 'Продвинутый'}
- Слабые места: ${weakTopics.length > 0 ? weakTopics.join(', ') : 'нет явных слабых мест'}

Напиши короткий (3-4 предложения), мотивирующий анализ результатов:
1. Начни с подбадривания и похвалы за пройденный тест
2. Укажи сильные стороны (если score > 50%)
3. Мягко укажи на слабые места и дай конкретную рекомендацию что повторить
4. Закончи мотивирующей фразой про дальнейшее обучение

Пиши на русском языке, дружелюбным тоном, без формальностей. Обращайся на "ты".`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const analysis = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('AI Analysis error:', error);
    return NextResponse.json(
      { error: 'Error generating analysis' },
      { status: 500 }
    );
  }
}
