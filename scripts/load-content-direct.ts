import fs from 'fs';
import path from 'path';

// Прямая загрузка сгенерированного контента в БД
async function loadContentDirectly() {
  // Читаем сгенерированный контент
  const contentPath = path.join(process.cwd(), 'data', 'generated', 'mathematics-content.json');
  const generatedContent = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

  // Читаем существующие данные
  const materialsPath = path.join(process.cwd(), 'data', 'materials.json');
  const assignmentsPath = path.join(process.cwd(), 'data', 'assignments.json');

  let materials: any[] = [];
  let assignments: any[] = [];

  if (fs.existsSync(materialsPath)) {
    materials = JSON.parse(fs.readFileSync(materialsPath, 'utf-8'));
  }

  if (fs.existsSync(assignmentsPath)) {
    assignments = JSON.parse(fs.readFileSync(assignmentsPath, 'utf-8'));
  }

  console.log('📥 Загружаю контент в БД...');
  console.log(`   Найдено тем: ${generatedContent.length}`);

  let materialsAdded = 0;
  let assignmentsAdded = 0;

  // Добавляем контент
  for (const item of generatedContent) {
    const topicId = `math-${item.topic.grade}-${item.topic.quarter}-${item.topic.order}`;

    // Добавляем материал (конспект)
    const materialId = `${topicId}-notes`;
    if (!materials.find((m: any) => m.id === materialId)) {
      materials.push({
        id: materialId,
        topicId: topicId,
        type: 'article',
        title: `Конспект: ${item.topic.title}`,
        url: '', // Будет храниться в content
        difficulty: 'medium',
        content: {
          summary: item.summary,
          detailedNotes: item.detailedNotes,
          keyPoints: item.keyPoints,
          examples: item.examples
        }
      });
      materialsAdded++;
      console.log(`   ✅ Добавлен конспект: ${item.topic.title}`);
    }

    // Добавляем тест
    if (item.test && item.test.questions && item.test.questions.length > 0) {
      const testId = `${topicId}-test`;
      if (!assignments.find((a: any) => a.id === testId)) {
        assignments.push({
          id: testId,
          topicId: topicId,
          type: 'test',
          title: item.test.title,
          difficulty: item.test.difficulty,
          questions: item.test.questions
        });
        assignmentsAdded++;
        console.log(`   ✅ Добавлен тест: ${item.test.title}`);
      }
    }
  }

  // Сохраняем
  fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2));
  fs.writeFileSync(assignmentsPath, JSON.stringify(assignments, null, 2));

  console.log(`\n✅ ГОТОВО!`);
  console.log(`   📚 Конспектов добавлено: ${materialsAdded}`);
  console.log(`   📝 Тестов добавлено: ${assignmentsAdded}`);
}

loadContentDirectly().catch(console.error);
