import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const QWEN_API_KEY = process.env.QWEN_API_KEY;
const QWEN_API_URL = process.env.QWEN_API_URL;

export async function POST(request: NextRequest) {
  try {
    const { studentId, topicId, subject, topicTitle, testResult, questions } = await request.json();

    console.log('AI Analysis for student:', studentId, 'Topic:', topicTitle);

    // Prepare detailed analysis data
    const wrongAnswers = testResult.answers
      .map((answer: any, index: number) => {
        if (!answer.isCorrect) {
          const question = questions[index];
          return {
            question: question.text,
            studentAnswer: question.options[answer.selectedAnswer],
            correctAnswer: question.options[question.correctAnswer],
            explanation: question.explanation
          };
        }
        return null;
      })
      .filter((item: any) => item !== null);

    // Generate AI feedback with emotional intelligence
    const correctCount = testResult.answers.filter((a: any) => a.isCorrect).length;
    const totalQuestions = testResult.answers.length;

    const prompt = `Ты — Navi, персональный AI-преподаватель FM Edu из НИШ Казахстана. Ты анализируешь результаты теста с эмоциональным интеллектом.

**Контекст:**
- Тема: ${topicTitle} (${subject})
- Результат: ${testResult.percentage}% (${testResult.score}/${testResult.maxScore} баллов)
- Правильных ответов: ${correctCount}/${totalQuestions}
- Проходной балл: 80%

${wrongAnswers.length > 0 ? `**Разбор ошибок:**
${wrongAnswers.map((wa: any, i: number) => `
${i + 1}. ВОПРОС: ${wa.question}
   ❌ Твой ответ: ${wa.studentAnswer}
   ✅ Правильный ответ: ${wa.correctAnswer}
   📝 Почему: ${wa.explanation}
`).join('\n')}` : '🎉 Все ответы правильные!'}

**ТВОЯ ЗАДАЧА — создать УДИВИТЕЛЬНЫЙ фидбек:**

1. **ПЕРВАЯ РЕАКЦИЯ (1-2 предложения):**
   ${testResult.percentage >= 90 ? '- ВОСТОРГ! Отметь какой результат крутой, используй эмодзи 🔥🎯💪' :
     testResult.percentage >= 80 ? '- Похвала с конкретикой — что именно хорошо получилось' :
     testResult.percentage >= 60 ? '- Поддержка + подчеркни что уже понял базу' :
     '- Эмпатия + мотивация "это нормально, все через это проходят"'}

2. **ЧТО ПОНЯЛ ХОРОШО (2-3 пункта):**
   - Проанализируй правильные ответы
   - Конкретные концепции/типы задач которые освоил
   - Похвали КОНКРЕТНО (не "молодец", а "круто решил задачу на...")

3. **ДЕТАЛЬНЫЙ РАЗБОР ОШИБОК (для каждой):**
   - Почему именно так думал (предположи логику)
   - Что упустил/не учёл
   - ЛАЙФХАК как запомнить правильно (мнемоника/аналогия/пример)
   - Типичная ли это ошибка (успокой если да)

4. **ПЛАН ПРОКАЧКИ (конкретный):**
   - Какие 2-3 минитемы повторить (не общие слова)
   - Какие видео пересмотреть (таймкоды если можешь)
   - Сколько задач прорешать (конкретное число)
   - Время на подготовку (реалистичное)

5. **МОТИВАЦИОННЫЙ ФИНАЛ:**
   ${testResult.percentage >= 80 ? '- Отметь РОСТ, дай челлендж на следующий тест' :
     '- Вдохновляющая история/факт + "ты справишься, вот план"'}

**СТИЛЬ:**
- Пиши как старший брат/сестра из НИШ, который сам через это прошёл
- Используй эмодзи (но не переборщи)
- Никаких шаблонов типа "молодец", "так держать" — только КОНКРЕТИКА
- Если результат <60% — НЕ сахарить, но и НЕ демотивировать. Честно + план

**ФОРМАТ:** обычный текст с эмодзи, БЕЗ markdown заголовков, БЕЗ JSON.
**ДЛИНА:** 200-300 слов (насыщенно но не простыня)`;

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
            content: 'Ты — AI-преподаватель FM Edu, который анализирует результаты тестов и дает персональную обратную связь. Ты всегда мотивируешь учеников и даешь конкретные рекомендации.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status}`);
    }

    const data = await response.json();
    const feedback = data.choices[0].message.content;

    // Save to AI memory/database
    await saveToAIMemory({
      studentId,
      topicId,
      subject,
      topicTitle,
      testResult,
      wrongAnswers,
      aiFeedback: feedback,
      timestamp: new Date().toISOString()
    });

    console.log('AI feedback generated and saved to memory');

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('AI feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to generate feedback', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Save AI analysis to memory database
async function saveToAIMemory(data: any) {
  try {
    const memoryPath = path.join(process.cwd(), 'data', 'ai-memory.json');

    let memory = [];
    if (fs.existsSync(memoryPath)) {
      memory = JSON.parse(fs.readFileSync(memoryPath, 'utf8'));
    }

    memory.push({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...data
    });

    // Keep last 1000 entries
    if (memory.length > 1000) {
      memory = memory.slice(-1000);
    }

    fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
    console.log('✅ Saved to AI memory database');
  } catch (error) {
    console.error('Failed to save to AI memory:', error);
  }
}
