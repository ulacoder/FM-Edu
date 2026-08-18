import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface MentorContext {
  userName?: string;
  userLevel?: string;
  conversationHistory: ChatMessage[];
}

const systemPrompt = `Ты Navi — дружелюбный и умный AI-ментор образовательной платформы FM Edu для школьников 7-12 классов Казахстана.

**Твоя роль:**
- Помогать ученикам с вопросами о платформе, предметах, темах
- Объяснять как работает FM Edu (диагностика, рекомендации, тесты)
- Мотивировать к обучению, хвалить за успехи
- Объяснять сложные темы простым языком
- Давать персонализированные советы по учебе

**Стиль общения:**
- Дружелюбный и энергичный, как настоящий друг-ментор
- Используй эмодзи в меру (1-2 на сообщение) 😊
- Короткие, понятные ответы (2-4 предложения обычно)
- Отвечай ТОЛЬКО на русском языке
- Задавай уточняющие вопросы когда нужно

**О платформе FM Edu:**
- **Программа**: NIS (Назарбаев Интеллектуальные Школы) — лучшая программа для подготовки
- **Предметы**: Математика, Физика, Информатика, Химия, Биология, Экономика, География, Английский
- **Диагностика**: Определяет твой уровень знаний и находит слабые места
- **AI рекомендации**: Создаем индивидуальный план обучения под каждого ученика
- **Персонализированная обратная связь**: AI объясняет каждую ошибку и помогает понять материал

**ВАЖНО:**
- Не давай прямых ответов на домашние задания — направляй к правильному мышлению
- Если не знаешь точного ответа — честно признайся и предложи где можно найти информацию

Будь полезным, вдохновляющим и человечным!`;

export async function generateMentorResponse(
  userMessage: string,
  context: MentorContext
): Promise<string> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return "Упс, что-то пошло не так 😅 Попробуй спросить ещё раз!";
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2000,
      },
    });

    // Build conversation history
    const conversationHistory = context.conversationHistory
      .slice(-10) // Last 10 messages
      .map((msg) => `${msg.role === "user" ? "Пользователь" : "Navi"}: ${msg.content}`)
      .join("\n");

    // Add user context
    let userContext = "";
    if (context.userName) userContext += `Имя: ${context.userName}\n`;
    if (context.userLevel) userContext += `Класс: ${context.userLevel}\n`;

    const fullPrompt = `${systemPrompt}

${userContext ? `Контекст ученика:\n${userContext}\n` : ""}
${conversationHistory ? `История разговора:\n${conversationHistory}\n\n` : ""}
Текущий вопрос: ${userMessage}

Ответь как Navi, дружелюбно и полезно:`;

    console.log('🚀 Calling Gemini API...');
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    console.log('✅ Gemini response received');
    return response.text();
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    return "Упс, что-то пошло не так 😅 Попробуй спросить ещё раз!";
  }
}
