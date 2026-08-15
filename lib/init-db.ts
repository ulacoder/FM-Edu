import { writeData, generateId } from './db';
import { allTopics } from './seed-topics';
import { Topic } from '@/types';

export function initializeDatabase() {
  // Инициализация тем
  const topics: Topic[] = allTopics.map((topic) => ({
    ...topic,
    id: generateId(),
  }));

  writeData('topics', topics);

  // Инициализация пустых массивов для других коллекций
  writeData('users', []);
  writeData('students', []);
  writeData('teachers', []);
  writeData('materials', []);
  writeData('assignments', []);
  writeData('student-progress', []);
  writeData('diagnostic-tests', []);
  writeData('diagnostic-results', []);
  writeData('recommendations', []);

  console.log('✅ База данных инициализирована');
  console.log(`📚 Загружено тем: ${topics.length}`);
}

// Запуск инициализации если файл запущен напрямую
if (require.main === module) {
  initializeDatabase();
}
