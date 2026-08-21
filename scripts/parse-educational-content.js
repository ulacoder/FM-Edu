const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Load topics
const topicsPath = path.join(__dirname, '..', 'data', 'topics.json');
const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

// Qwen API config
const QWEN_API_KEY = process.env.QWEN_API_KEY || 'sk-4f4a6bbdf70f47e38168c5e1a2c4a825';
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';

// Parse content from opiq.kz
async function parseOpiq(browser, topic) {
  console.log(`\n📚 Парсинг opiq.kz для темы: ${topic.title}`);

  const page = await browser.newPage();
  let content = null;
  let sources = [];

  try {
    // Search on opiq.kz
    const searchQuery = `${topic.title} ${topic.grade} класс`;
    await page.goto(`https://opiq.kz/search?q=${encodeURIComponent(searchQuery)}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get page content
    const pageContent = await page.evaluate(() => {
      return document.body.innerText;
    });

    if (pageContent && pageContent.length > 200) {
      content = pageContent.substring(0, 5000); // First 5000 chars
      sources.push(page.url());
      console.log(`✅ Найден контент на opiq.kz`);
    } else {
      console.log(`⚠️ Мало контента на opiq.kz`);
    }

  } catch (error) {
    console.log(`❌ Ошибка парсинга opiq.kz: ${error.message}`);
  } finally {
    await page.close();
  }

  return { content, sources };
}

// Parse content from bilimland.kz
async function parseBilimland(browser, topic) {
  console.log(`📚 Парсинг bilimland.kz для темы: ${topic.title}`);

  const page = await browser.newPage();
  let content = null;
  let sources = [];

  try {
    // Try direct subject pages
    const subjectUrls = {
      'mathematics': 'https://bilimland.kz/ru/courses/math-ru',
      'physics': 'https://bilimland.kz/ru/courses/physics-ru',
      'chemistry': 'https://bilimland.kz/ru/courses/chemistry-ru',
      'biology': 'https://bilimland.kz/ru/courses/biologiya-ru',
      'english': 'https://bilimland.kz/ru/courses/english-language'
    };

    const url = subjectUrls[topic.subject];
    if (url) {
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      const pageContent = await page.evaluate(() => {
        return document.body.innerText;
      });

      if (pageContent && pageContent.length > 200) {
        content = pageContent.substring(0, 5000);
        sources.push(page.url());
        console.log(`✅ Найден контент на bilimland.kz`);
      }
    }

  } catch (error) {
    console.log(`❌ Ошибка парсинга bilimland.kz: ${error.message}`);
  } finally {
    await page.close();
  }

  return { content, sources };
}

// Search YouTube videos
async function searchYouTube(browser, topic) {
  console.log(`🎥 Поиск YouTube видео для: ${topic.title}`);

  const page = await browser.newPage();
  let videos = [];

  try {
    const query = `${topic.title} ${topic.subject} ${topic.grade} класс урок`;
    await page.goto(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await page.waitForTimeout(3000);

    // Extract video links
    videos = await page.evaluate(() => {
      const results = [];
      const videoElements = document.querySelectorAll('a#video-title');

      for (let i = 0; i < Math.min(3, videoElements.length); i++) {
        const el = videoElements[i];
        const title = el.getAttribute('title');
        const href = el.getAttribute('href');

        if (title && href) {
          results.push({
            title: title,
            url: `https://www.youtube.com${href}`
          });
        }
      }

      return results;
    });

    console.log(`✅ Найдено ${videos.length} YouTube видео`);

  } catch (error) {
    console.log(`❌ Ошибка поиска YouTube: ${error.message}`);
  } finally {
    await page.close();
  }

  return videos;
}

// Generate lesson content using Qwen AI
async function generateLessonContent(topic, parsedContent) {
  console.log(`🤖 Генерация конспекта через Qwen AI...`);

  const prompt = `Создай подробный конспект урока для ${topic.grade} класса по теме "${topic.title}" (предмет: ${topic.subject}).

${parsedContent ? `Используй эту информацию из учебных материалов:\n${parsedContent}\n\n` : ''}

ТРЕБОВАНИЯ:
- Объём: 800-1500 слов
- Язык: Русский
- Структура:

# ${topic.title}

## Определение и основные понятия
[Чёткие определения всех терминов]

## Теоретический материал
[Подробное объяснение с примерами]

### Формулы и правила
[ВСЕ формулы с расшифровкой переменных]
Например: v = S/t, где v - скорость (м/с), S - путь (м), t - время (с)

## Примеры решения задач
[Минимум 3 ПОЛНЫХ примера с пошаговым решением и числами]

**Пример 1:** [условие с конкретными числами]
Решение:
1. [шаг с вычислениями]
2. [шаг с вычислениями]
Ответ: [число с единицами]

## Важные моменты для запоминания
[Ключевые факты, правила, частые ошибки]

ВАЖНО: Все примеры с РЕАЛЬНЫМИ числами, все формулы ПОЛНЫЕ!`;

  try {
    const response = await fetch(`${QWEN_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      console.log(`❌ Ошибка Qwen API: ${JSON.stringify(data)}`);
      return null;
    }

    const lessonContent = data.choices[0].message.content;

    console.log(`✅ Конспект сгенерирован (${lessonContent.length} символов)`);
    return lessonContent;

  } catch (error) {
    console.log(`❌ Ошибка генерации конспекта: ${error.message}`);
    return null;
  }
}

// Generate test questions using Qwen AI
async function generateTestQuestions(topic, lessonContent) {
  console.log(`🤖 Генерация тестов через Qwen AI...`);

  const prompt = `Создай 10 тестовых вопросов по теме "${topic.title}" для ${topic.grade} класса.

Материал урока:
${lessonContent}

ТРЕБОВАНИЯ:
- Ровно 10 вопросов
- Каждый вопрос проверяет ПОНИМАНИЕ материала
- 4 варианта ответа
- 1 правильный ответ
- Объяснение почему правильно

ФОРМАТ JSON:
[
  {
    "text": "Вопрос здесь",
    "options": ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"],
    "correctAnswer": 0,
    "explanation": "Объяснение"
  }
]

❌ НЕ ДЕЛАЙ такие вопросы:
- "Что является основной темой?"
- "В каком классе изучается?"
- "К какому предмету относится?"

✅ ДЕЛАЙ вопросы по материалу:
- Математика: вычисления, формулы
- Физика: задачи с числами
- Языки: грамматика с примерами
- Химия: формулы веществ

Выведи ТОЛЬКО JSON массив, без дополнительного текста!`;

  try {
    const response = await fetch(`${QWEN_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    let questionsText = data.choices[0].message.content;

    // Extract JSON from response
    const jsonMatch = questionsText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0]);
      console.log(`✅ Сгенерировано ${questions.length} вопросов`);
      return questions;
    } else {
      console.log(`⚠️ Не удалось извлечь JSON из ответа`);
      return [];
    }

  } catch (error) {
    console.log(`❌ Ошибка генерации тестов: ${error.message}`);
    return [];
  }
}

// Main parsing function
async function parseTopicContent(browser, topic, index, total) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📖 [${index + 1}/${total}] ${topic.title} (${topic.subject}, ${topic.grade} класс)`);
  console.log(`${'='.repeat(60)}`);

  try {
    // 1. Parse educational sites
    const opiqData = await parseOpiq(browser, topic);
    const bilimlandData = await parseBilimland(browser, topic);

    // Combine parsed content
    let parsedContent = '';
    const sources = [];

    if (opiqData.content) {
      parsedContent += opiqData.content + '\n\n';
      sources.push(...opiqData.sources);
    }

    if (bilimlandData.content) {
      parsedContent += bilimlandData.content;
      sources.push(...bilimlandData.sources);
    }

    // 2. Search YouTube
    const videos = await searchYouTube(browser, topic);

    // 3. Generate lesson content with AI
    const lessonContent = await generateLessonContent(topic, parsedContent);

    if (!lessonContent) {
      console.log(`❌ Не удалось сгенерировать конспект для темы: ${topic.title}`);
      return null;
    }

    // 4. Generate test questions
    const testQuestions = await generateTestQuestions(topic, lessonContent);

    if (testQuestions.length === 0) {
      console.log(`⚠️ Нет тестовых вопросов для темы: ${topic.title}`);
    }

    // 5. Prepare result
    const result = {
      topicId: topic.id,
      subject: topic.subject,
      grade: topic.grade,
      quarter: topic.quarter,
      title: topic.title,
      lessonContent: lessonContent,
      youtubeQuery: `${topic.title} ${topic.subject} ${topic.grade} класс урок`,
      youtubeVideos: videos,
      sources: sources,
      testQuestions: testQuestions.map((q, idx) => ({
        id: `${topic.id}-q${idx + 1}`,
        ...q
      }))
    };

    console.log(`✅ Тема обработана успешно!`);
    return result;

  } catch (error) {
    console.log(`❌ Критическая ошибка обработки темы: ${error.message}`);
    return null;
  }
}

// Main function
async function main() {
  console.log('🚀 Начинаем парсинг образовательного контента...\n');
  console.log(`📊 Всего тем для обработки: ${topics.length}`);
  console.log(`⚠️ ВНИМАНИЕ: Это займёт МНОГО времени!\n`);

  // Process first 10 topics as a test
  const topicsToProcess = topics.slice(0, 10);
  console.log(`🔬 Тестовый режим: обрабатываем первые ${topicsToProcess.length} тем\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];
  const sourcesTable = [];

  for (let i = 0; i < topicsToProcess.length; i++) {
    const topic = topicsToProcess[i];
    const result = await parseTopicContent(browser, topic, i, topicsToProcess.length);

    if (result) {
      results.push(result);

      // Add to sources table
      sourcesTable.push({
        topicId: topic.id,
        title: topic.title,
        subject: topic.subject,
        grade: topic.grade,
        sources: result.sources,
        videos: result.youtubeVideos
      });
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  await browser.close();

  // Save results
  const outputPath = path.join(__dirname, '..', 'data', 'parsed-content.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Результаты сохранены: ${outputPath}`);
  console.log(`📦 Обработано тем: ${results.length}`);

  // Save sources table
  const sourcesPath = path.join(__dirname, '..', 'data', 'sources-table.json');
  fs.writeFileSync(sourcesPath, JSON.stringify(sourcesTable, null, 2));
  console.log(`📋 Таблица источников: ${sourcesPath}`);

  // Generate markdown table
  let markdownTable = `# Источники и Материалы\n\n`;
  markdownTable += `| ID темы | Название | Предмет | Класс | Источники | YouTube видео |\n`;
  markdownTable += `|---------|----------|---------|-------|-----------|---------------|\n`;

  sourcesTable.forEach(item => {
    const sources = item.sources.map(s => `[Ссылка](${s})`).join('<br>');
    const videos = item.videos.map(v => `[${v.title}](${v.url})`).join('<br>');
    markdownTable += `| ${item.topicId} | ${item.title} | ${item.subject} | ${item.grade} | ${sources || 'Нет'} | ${videos || 'Нет'} |\n`;
  });

  const tablePath = path.join(__dirname, '..', 'data', 'sources-table.md');
  fs.writeFileSync(tablePath, markdownTable);
  console.log(`📄 Markdown таблица: ${tablePath}`);

  console.log(`\n🎉 Парсинг завершён!`);
}

main().catch(console.error);
