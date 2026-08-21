import fs from 'fs';
import path from 'path';

// YouTube видео ссылки для математики (17 тем)
const videoLinks: Record<string, string> = {
  'Рациональные числа': 'https://www.youtube.com/watch?v=8JQof2M1KQk',
  'Степень с натуральным показателем': 'https://www.youtube.com/watch?v=Jq0f_3GSKKc',
  'Формулы сокращённого умножения': 'https://www.youtube.com/watch?v=hUBKXz0QQBU',
  'Линейные уравнения': 'https://www.youtube.com/watch?v=U0HH5NwqE_c',
  'Неравенства': 'https://www.youtube.com/watch?v=zR7fK9A8zco',
  'Функции и графики': 'https://www.youtube.com/watch?v=b0vQZ1YXN-w',
  'Последовательности': 'https://www.youtube.com/watch?v=9fkv_3E4q0Y',
  'Элементы статистики': 'https://www.youtube.com/watch?v=aLzKJD4nBKg',
  'Тригонометрия': 'https://www.youtube.com/watch?v=OqWGmYNxVLo',
  'Тригонометрические функции': 'https://www.youtube.com/watch?v=kp_-4U_-5sU',
  'Тригонометрические уравнения': 'https://www.youtube.com/watch?v=lp_cK8mZJAU',
  'Производная': 'https://www.youtube.com/watch?v=4rBGsFvSdgc',
  'Первообразная и интеграл': 'https://www.youtube.com/watch?v=vZwg6SfmvP0',
  'Показательная функция': 'https://www.youtube.com/watch?v=nCjyKD7OAo4',
  'Логарифмическая функция': 'https://www.youtube.com/watch?v=4DbFzF2b6Es',
  'Степенная функция': 'https://www.youtube.com/watch?v=O8k3s-IXEDY',
  'Элементы комбинаторики': 'https://www.youtube.com/watch?v=1qJVPqZN5gA',
};

async function addVideos() {
  const materialsPath = path.join(process.cwd(), 'data', 'materials.json');
  let materials = JSON.parse(fs.readFileSync(materialsPath, 'utf-8'));

  console.log('🎥 Добавляю YouTube видео...');

  let videosAdded = 0;

  for (const material of materials) {
    if (material.type === 'article' && material.topicId) {
      // Извлекаем название темы
      const titleMatch = material.title.match(/Конспект: (.+)/);
      if (titleMatch) {
        const topicName = titleMatch[1];
        const videoUrl = videoLinks[topicName];

        if (videoUrl) {
          // Добавляем видео-материал
          const videoId = `${material.topicId}-video`;
          const existingVideo = materials.find((m: any) => m.id === videoId);

          if (!existingVideo) {
            materials.push({
              id: videoId,
              topicId: material.topicId,
              type: 'video',
              title: `Видеоурок: ${topicName}`,
              url: videoUrl,
              difficulty: 'medium'
            });
            videosAdded++;
            console.log(`   ✅ Добавлено видео: ${topicName}`);
          }
        }
      }
    }
  }

  fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2));

  console.log(`\n✅ ГОТОВО!`);
  console.log(`   🎥 Видео добавлено: ${videosAdded}`);
}

addVideos().catch(console.error);
