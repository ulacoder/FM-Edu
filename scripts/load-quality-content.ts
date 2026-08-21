import fs from 'fs';
import path from 'path';

// Качественный контент написанный мной для математики
const qualityContent = [
  {
    topicId: 'math-7-3-3',
    topic: { subject: 'mathematics', grade: 7, quarter: 3, title: 'Формулы сокращённого умножения', order: 3 },
    summary: 'Формулы сокращённого умножения — это готовые "шаблоны" для быстрого умножения многочленов. Вместо того чтобы раскрывать скобки вручную, мы используем эти формулы и экономим время на ЕНТ и олимпиадах.',
    detailedNotes: `# Формулы сокращённого умножения

## Основные формулы

### 1. Квадрат суммы
**(a + b)² = a² + 2ab + b²**

Пример: (x + 3)² = x² + 6x + 9

### 2. Квадрат разности
**(a - b)² = a² - 2ab + b²**

Пример: (x - 5)² = x² - 10x + 25

### 3. Разность квадратов
**(a - b)(a + b) = a² - b²**

Пример: (x - 2)(x + 2) = x² - 4

### 4. Куб суммы
**(a + b)³ = a³ + 3a²b + 3ab² + b³**

### 5. Куб разности
**(a - b)³ = a³ - 3a²b + 3ab² - b³**

## Как запомнить?

**Квадрат суммы:** "Первый в квадрате + удвоенное произведение + второй в квадрате"

**Разность квадратов:** "Если скобки (a-b) и (a+b) рядом — ответ a² - b²"

## Типичные ошибки ⚠️

❌ (a + b)² = a² + b² — НЕВЕРНО! Забыли 2ab
✅ (a + b)² = a² + 2ab + b²

❌ (x - 3)² = x² - 9 — НЕВЕРНО! Забыли средний член
✅ (x - 3)² = x² - 6x + 9

## Где применяется?

- Упрощение выражений
- Разложение на множители
- Решение уравнений
- Доказательство тождеств`,
    keyPoints: [
      'Квадрат суммы: (a+b)² = a² + 2ab + b²',
      'Квадрат разности: (a-b)² = a² - 2ab + b²',
      'Разность квадратов: a² - b² = (a-b)(a+b)',
      'Не забывай средний член 2ab в квадратах!',
      'Эти формулы работают в обе стороны',
      'Можно применять несколько раз подряд'
    ],
    examples: [
      'Пример 1: Вычисли 99². Решение: 99² = (100-1)² = 100² - 2·100·1 + 1² = 10000 - 200 + 1 = 9801',
      'Пример 2: Упрости (x+2)². Решение: (x+2)² = x² + 2·x·2 + 2² = x² + 4x + 4',
      'Пример 3: Разложи x² - 16. Решение: x² - 16 = x² - 4² = (x-4)(x+4)',
      'Пример 4: Вычисли 103·97. Решение: 103·97 = (100+3)(100-3) = 100² - 3² = 10000 - 9 = 9991'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=hUBKXz0QQBU',
    test: {
      id: 'math-7-3-3-test',
      topicId: 'math-7-3-3',
      type: 'test',
      title: 'Тест: Формулы сокращённого умножения',
      difficulty: 'medium',
      questions: [
        {
          id: 'q1',
          text: 'Раскрой скобки: (x + 5)²',
          type: 'multiple_choice',
          options: ['x² + 10x + 25', 'x² + 25', 'x² + 5x + 25', 'x² + 10x + 5'],
          correctAnswer: 0,
          explanation: 'Используем формулу квадрата суммы: (a+b)² = a² + 2ab + b². Здесь a=x, b=5. Получаем: x² + 2·x·5 + 5² = x² + 10x + 25',
          points: 1
        },
        {
          id: 'q2',
          text: 'Чему равно (a - 3)²?',
          type: 'multiple_choice',
          options: ['a² - 6a + 9', 'a² - 9', 'a² + 6a + 9', 'a² - 3a + 9'],
          correctAnswer: 0,
          explanation: 'Формула квадрата разности: (a-b)² = a² - 2ab + b². Подставляем: a² - 2·a·3 + 3² = a² - 6a + 9',
          points: 1
        },
        {
          id: 'q3',
          text: 'Разложи на множители: x² - 49',
          type: 'multiple_choice',
          options: ['(x - 7)(x + 7)', '(x - 7)²', '(x + 7)²', 'x(x - 49)'],
          correctAnswer: 0,
          explanation: 'Это разность квадратов! x² - 49 = x² - 7². Формула: a² - b² = (a-b)(a+b). Ответ: (x-7)(x+7)',
          points: 1
        },
        {
          id: 'q4',
          text: 'Вычисли устно: 51²',
          type: 'multiple_choice',
          options: ['2601', '2501', '2701', '2801'],
          correctAnswer: 0,
          explanation: '51² = (50+1)² = 50² + 2·50·1 + 1² = 2500 + 100 + 1 = 2601',
          points: 2
        },
        {
          id: 'q5',
          text: 'Упрости: (m + n)² - (m - n)²',
          type: 'multiple_choice',
          options: ['4mn', '2mn', '0', '2m² + 2n²'],
          correctAnswer: 0,
          explanation: 'Раскроем: (m²+2mn+n²) - (m²-2mn+n²) = m²+2mn+n² - m²+2mn-n² = 4mn',
          points: 2
        },
        {
          id: 'q6',
          text: 'Какое выражение НЕ является формулой сокращённого умножения?',
          type: 'multiple_choice',
          options: ['(a + b)² = a² + b²', '(a - b)² = a² - 2ab + b²', 'a² - b² = (a-b)(a+b)', '(a + b)³ = a³ + 3a²b + 3ab² + b³'],
          correctAnswer: 0,
          explanation: 'Правильная формула: (a+b)² = a² + 2ab + b². Вариант (a+b)² = a² + b² — типичная ошибка!',
          points: 1
        },
        {
          id: 'q7',
          text: 'Вычисли: 104 · 96',
          type: 'multiple_choice',
          options: ['9984', '10000', '9884', '10084'],
          correctAnswer: 0,
          explanation: '104·96 = (100+4)(100-4) = 100² - 4² = 10000 - 16 = 9984',
          points: 2
        },
        {
          id: 'q8',
          text: 'Разложи на множители: 4x² - 25',
          type: 'multiple_choice',
          options: ['(2x - 5)(2x + 5)', '(4x - 5)(x + 5)', '(2x - 25)(2x + 1)', '(x - 5)(4x + 5)'],
          correctAnswer: 0,
          explanation: '4x² - 25 = (2x)² - 5² — разность квадратов. Ответ: (2x-5)(2x+5)',
          points: 2
        },
        {
          id: 'q9',
          text: 'Если (x + y)² = 36 и xy = 8, чему равно x² + y²?',
          type: 'multiple_choice',
          options: ['20', '28', '36', '44'],
          correctAnswer: 0,
          explanation: '(x+y)² = x² + 2xy + y² = 36. Значит x² + y² = 36 - 2xy = 36 - 16 = 20',
          points: 3
        },
        {
          id: 'q10',
          text: 'Упрости: (a + b + c)²',
          type: 'multiple_choice',
          options: ['a² + b² + c² + 2ab + 2ac + 2bc', 'a² + b² + c²', 'a² + b² + c² + ab + ac + bc', '(a + b)² + c²'],
          correctAnswer: 0,
          explanation: 'Раскрываем: (a+b+c)² = ((a+b)+c)² = (a+b)² + 2(a+b)c + c² = a²+2ab+b² + 2ac+2bc + c²',
          points: 3
        }
      ]
    }
  }
];

async function loadQualityContent() {
  const materialsPath = path.join(process.cwd(), 'data', 'materials.json');
  const assignmentsPath = path.join(process.cwd(), 'data', 'assignments.json');

  let materials = JSON.parse(fs.readFileSync(materialsPath, 'utf-8'));
  let assignments = JSON.parse(fs.readFileSync(assignmentsPath, 'utf-8'));

  console.log('🔥 Загружаю КАЧЕСТВЕННЫЙ контент...\n');

  for (const content of qualityContent) {
    // Удаляем старый контент
    materials = materials.filter((m: any) => !m.topicId?.includes(content.topicId));
    assignments = assignments.filter((a: any) => !a.topicId?.includes(content.topicId));

    // Добавляем конспект
    materials.push({
      id: `${content.topicId}-notes`,
      topicId: content.topicId,
      type: 'article',
      title: `Конспект: ${content.topic.title}`,
      url: '',
      difficulty: 'medium',
      content: {
        summary: content.summary,
        detailedNotes: content.detailedNotes,
        keyPoints: content.keyPoints,
        examples: content.examples
      }
    });

    // Добавляем видео
    if (content.videoUrl) {
      materials.push({
        id: `${content.topicId}-video`,
        topicId: content.topicId,
        type: 'video',
        title: `Видеоурок: ${content.topic.title}`,
        url: content.videoUrl,
        difficulty: 'medium'
      });
    }

    // Добавляем тест
    assignments.push(content.test);

    console.log(`✅ ${content.topic.title} — конспект + тест + видео`);
  }

  fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2));
  fs.writeFileSync(assignmentsPath, JSON.stringify(assignments, null, 2));

  console.log('\n🎉 ГОТОВО! Обнови страницу localhost:3000');
}

loadQualityContent().catch(console.error);
