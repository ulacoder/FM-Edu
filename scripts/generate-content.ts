import { mathematicsTopics, physicsTopics, informaticsTopics } from '../lib/seed-topics.js';
import { qwenChat } from '../lib/qwen.js';
import { Topic, Assignment } from '../types/index.js';
import fs from 'fs';
import path from 'path';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyBxqVGKT7ZBnqXYvx7uZ9vKqT0pW5rB8Zc';

interface GeneratedContent {
  topic: Topic;
  summary: string;
  detailedNotes: string;
  keyPoints: string[];
  examples: string[];
  videoUrl?: string;
  test: Assignment;
}

// Генерация детального конспекта через Qwen
async function generateTopicSummary(topic: Omit<Topic, 'id'>): Promise<{ summary: string; detailedNotes: string; keyPoints: string[]; examples: string[] }> {
  const prompt = `Создай детальный конспект по теме "${topic.title}" для ${topic.grade} класса (программа МОН РК).

Описание темы: ${topic.description}

ТРЕБОВАНИЯ:
1. **Краткое введение** (2-3 предложения) — зачем эта тема нужна
2. **Основные концепции** — главные определения и формулы (если есть)
3. **Пошаговое объяснение** — как решать типичные задачи
4. **5-7 ключевых моментов** — самое важное, что нужно запомнить
5. **3-4 примера с решениями** — от простых к сложным
6. **Типичные ошибки** — на что обратить внимание

Пиши простым языком для школьников, используй примеры из жизни где возможно.
Формат ответа в JSON:
{
  "summary": "краткое введение",
  "detailedNotes": "полный конспект в markdown",
  "keyPoints": ["ключевой момент 1", ...],
  "examples": ["пример 1 с решением", ...]
}`;

  const response = await qwenChat([
    { role: 'system', content: 'Ты опытный учитель математики в НИШ Казахстана. Объясняешь доступно и с энтузиазмом.' },
    { role: 'user', content: prompt }
  ]);

  try {
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/(\{[\s\S]*\})/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    return JSON.parse(response);
  } catch (e) {
    console.error('Failed to parse Qwen response:', response);
    throw new Error('AI не вернул валидный JSON');
  }
}

// Генерация теста через Qwen
async function generateTest(topic: Omit<Topic, 'id'>, summary: string): Promise<Assignment> {
  const prompt = `Создай тест по теме "${topic.title}" для ${topic.grade} класса.

Контекст темы:
${summary}

ТРЕБОВАНИЯ:
1. **10 вопросов** — 6 легких, 3 средних, 1 сложный
2. **Типы вопросов**: multiple_choice (4 варианта ответа)
3. **Каждый вопрос должен иметь**:
   - Четкую формулировку
   - 4 варианта ответа (1 правильный, 3 похожих но неправильных)
   - Подробное объяснение правильного ответа
   - Указание типичной ошибки (если применимо)
4. **Баллы**: легкие = 1 балл, средние = 2 балла, сложный = 3 балла

Формат ответа в JSON:
{
  "title": "Тест: ${topic.title}",
  "questions": [
    {
      "text": "вопрос",
      "type": "multiple_choice",
      "options": ["вариант 1", "вариант 2", "вариант 3", "вариант 4"],
      "correctAnswer": 0,
      "explanation": "почему это правильный ответ + разбор типичной ошибки",
      "points": 1
    }
  ]
}`;

  const response = await qwenChat([
    { role: 'system', content: 'Ты составляешь тесты для НИШ. Вопросы должны проверять понимание, а не зубрежку.' },
    { role: 'user', content: prompt }
  ]);

  try {
    // Попытка 1: извлечь JSON из markdown блока
    let jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);

    // Попытка 2: найти первый JSON объект
    if (!jsonMatch) {
      jsonMatch = response.match(/\{[\s\S]*"questions"[\s\S]*\}/);
    }

    // Попытка 3: очистить от лишних символов и попробовать снова
    if (!jsonMatch) {
      const cleaned = response.replace(/```json|```/g, '').trim();
      jsonMatch = [null, cleaned];
    }

    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonStr);

      // Валидация структуры
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Missing questions array');
      }

      return {
        id: '',
        topicId: '',
        type: 'test',
        title: parsed.title || `Тест: ${topic.title}`,
        difficulty: 'medium',
        questions: parsed.questions.map((q: any, idx: number) => ({
          id: `q${idx + 1}`,
          text: q.text,
          type: q.type || 'multiple_choice',
          options: q.options || [],
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || '',
          points: q.points || 1
        }))
      };
    }
    throw new Error('No JSON found');
  } catch (e) {
    console.error('Failed to parse test for', topic.title);
    console.error('Response snippet:', response.substring(0, 500));
    console.error('Parse error:', e);

    // Возвращаем dummy тест чтобы не ломать весь процесс
    return {
      id: '',
      topicId: '',
      type: 'test',
      title: `Тест: ${topic.title}`,
      difficulty: 'medium',
      questions: [{
        id: 'q1',
        text: 'Тест временно недоступен (ошибка генерации)',
        type: 'multiple_choice',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0,
        explanation: 'Будет перегенерирован',
        points: 1
      }]
    };
  }
}

// Поиск видео на YouTube - просто первое видео из результатов
async function findYouTubeVideo(topic: Omit<Topic, 'id'>): Promise<string | undefined> {
  try {
    const query = `${topic.title} ${topic.grade} класс урок`;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&relevanceLanguage=ru&maxResults=1&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    // Просто берём первое видео
    if (data.items && data.items.length > 0) {
      return `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`;
    }
  } catch (e) {
    console.error(`Failed to find video for ${topic.title}:`, e);
  }
  return undefined;
}

// Генерация контента для одной темы
async function generateTopicContent(topic: Omit<Topic, 'id'>, index: number, total: number): Promise<GeneratedContent> {
  console.log(`\n[${index + 1}/${total}] Генерирую контент: ${topic.title} (${topic.grade} класс, ${topic.quarter} четверть)`);

  console.log('  → Генерирую конспект...');
  const { summary, detailedNotes, keyPoints, examples } = await generateTopicSummary(topic);

  console.log('  → Генерирую тест...');
  const test = await generateTest(topic, summary);

  console.log('  → Ищу видео на YouTube...');
  const videoUrl = await findYouTubeVideo(topic);

  console.log(`  ✓ Готово! ${videoUrl ? 'Видео найдено' : 'Видео не найдено'}`);

  return {
    topic: { ...topic, id: '' },
    summary,
    detailedNotes,
    keyPoints,
    examples,
    videoUrl,
    test
  };
}

// Основная функция генерации
async function generateAllContent(subject: 'mathematics' | 'physics' | 'informatics') {
  const topics = subject === 'mathematics' ? mathematicsTopics :
                 subject === 'physics' ? physicsTopics : informaticsTopics;

  const subjectNames = {
    mathematics: 'Математика',
    physics: 'Физика',
    informatics: 'Информатика'
  };

  console.log(`\n🚀 Начинаю генерацию контента: ${subjectNames[subject]}`);
  console.log(`   Всего тем: ${topics.length}\n`);

  const results: GeneratedContent[] = [];

  for (let i = 0; i < topics.length; i++) {
    try {
      const content = await generateTopicContent(topics[i], i, topics.length);
      results.push(content);

      if (i < topics.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`   ✗ Ошибка при генерации темы ${topics[i].title}:`, error);
    }
  }

  const outputDir = path.join(process.cwd(), 'data', 'generated');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFile = path.join(outputDir, `${subject}-content.json`);
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf-8');

  console.log(`\n✅ ГОТОВО! Сгенерировано ${results.length}/${topics.length} тем`);
  console.log(`   Результаты сохранены: ${outputFile}`);

  const withVideo = results.filter(r => r.videoUrl).length;
  console.log(`\n📊 Статистика:`);
  console.log(`   - Конспектов: ${results.length}`);
  console.log(`   - Тестов: ${results.length}`);
  console.log(`   - Видео найдено: ${withVideo}/${results.length}`);
}

const subject = process.argv[2] as 'mathematics' | 'physics' | 'informatics';
if (!subject || !['mathematics', 'physics', 'informatics'].includes(subject)) {
  console.error('Usage: ts-node scripts/generate-content.ts <mathematics|physics|informatics>');
  process.exit(1);
}

generateAllContent(subject).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
