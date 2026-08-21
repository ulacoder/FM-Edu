const fs = require('fs');
const path = require('path');

// Read existing topics
const topicsPath = path.join(__dirname, '..', 'data', 'topics.json');
const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

console.log('Current topics:', topics.length);

// Group topics by subject, grade, quarter
const grouped = {};
topics.forEach(topic => {
  const key = `${topic.subject}_${topic.grade}_${topic.quarter}`;
  if (!grouped[key]) {
    grouped[key] = [];
  }
  grouped[key].push(topic);
});

// Find quarters that need more topics
const newTopics = [];
const subjects = ['mathematics', 'physics', 'english', 'informatics', 'chemistry', 'biology', 'economics', 'geography'];
const subjectTitles = {
  mathematics: ['Числа и вычисления', 'Алгебраические выражения', 'Уравнения', 'Функции', 'Геометрия', 'Статистика'],
  physics: ['Механика', 'Динамика', 'Энергия', 'Электричество', 'Оптика', 'Термодинамика'],
  english: ['Grammar Basics', 'Present Tenses', 'Past Tenses', 'Future Forms', 'Vocabulary', 'Reading Skills'],
  informatics: ['Алгоритмы', 'Программирование', 'Структуры данных', 'Базы данных', 'Сети', 'Безопасность'],
  chemistry: ['Атомы и молекулы', 'Химические реакции', 'Кислоты и основания', 'Органическая химия', 'Периодическая система', 'Растворы'],
  biology: ['Клетка', 'Генетика', 'Эволюция', 'Экология', 'Организм человека', 'Растения'],
  economics: ['Спрос и предложение', 'Рыночная экономика', 'Деньги и банки', 'Международная торговля', 'Инфляция', 'Налоги'],
  geography: ['Физическая география', 'Климат', 'Население', 'Экономическая география', 'Природные ресурсы', 'Страны мира']
};

for (const subject of subjects) {
  const startGrade = subject === 'economics' ? 10 : 7;
  const endGrade = 12;

  for (let grade = startGrade; grade <= endGrade; grade++) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      const key = `${subject}_${grade}_${quarter}`;
      const existing = grouped[key] || [];
      const needed = 2 - existing.length;

      if (needed > 0) {
        const maxOrder = existing.length > 0 ? Math.max(...existing.map(t => t.order)) : 0;

        for (let i = 0; i < needed; i++) {
          const titleIndex = (quarter - 1) * 2 + i;
          const titles = subjectTitles[subject];
          const title = titles[titleIndex % titles.length];

          newTopics.push({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            subject: subject,
            grade: grade,
            quarter: quarter,
            order: maxOrder + i + 1,
            title: `${title} (часть ${i + 1 + existing.length})`,
            description: `Продолжение изучения темы ${title}`,
            keywords: [title.split(' ')[0].toLowerCase(), 'практика', 'упражнения']
          });
        }
      }
    }
  }
}

console.log('Adding new topics:', newTopics.length);

// Merge and save
const allTopics = [...topics, ...newTopics];
fs.writeFileSync(topicsPath, JSON.stringify(allTopics, null, 2));

console.log('Total topics now:', allTopics.length);
console.log('✅ Done! All quarters now have at least 2 topics.');
