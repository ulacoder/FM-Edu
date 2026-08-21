import { NextRequest, NextResponse } from 'next/server';

const QWEN_API_KEY = process.env.QWEN_API_KEY;
const QWEN_API_URL = process.env.QWEN_API_URL;

export async function POST(request: NextRequest) {
  try {
    const { topicId, subject, topicTitle, difficulty, questionCount } = await request.json();

    console.log('Generating test:', { topicId, subject, topicTitle, difficulty, questionCount });

    // Generate test using Qwen AI
    const prompt = `Ты — эксперт по образованию. Создай тест из ${questionCount} вопросов по теме "${topicTitle}" для предмета "${subject}".

Требования:
- Уровень сложности: ${difficulty}
- Вопросы на русском языке
- Формат: множественный выбор (4 варианта ответа)
- Только ОДИН правильный ответ
- Вопросы должны проверять понимание темы, а не просто факты
- Включи объяснение для каждого правильного ответа

Верни ТОЛЬКО валидный JSON массив в формате:
[
  {
    "id": "q1",
    "text": "Текст вопроса?",
    "options": ["вариант1", "вариант2", "вариант3", "вариант4"],
    "correctAnswer": 0,
    "explanation": "Объяснение правильного ответа"
  }
]

НЕ добавляй никаких комментариев или пояснений, только чистый JSON массив.`;

    const response = await fetch(`${QWEN_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [
          {
            role: 'system',
            content: 'Ты — профессиональный преподаватель, который создает качественные тесты для проверки знаний учеников. Всегда возвращай только валидный JSON без дополнительных комментариев.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Qwen API error:', response.status, errorText);
      throw new Error(`Qwen API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('Raw AI response:', content);

    // Parse JSON from response
    let questions;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[1]);
      } else {
        // Try direct parse
        questions = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Content:', content);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid questions format from AI');
    }

    // Ensure all questions have required fields
    questions = questions.map((q: any, index: number) => ({
      id: q.id || `q${index + 1}`,
      text: q.text || q.question || '',
      options: q.options || [],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      explanation: q.explanation || 'Объяснение недоступно'
    }));

    console.log('Generated questions:', questions.length);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Test generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate test', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
