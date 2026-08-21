import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ topicId: string }> }
) {
  try {
    const { topicId } = await context.params;

    // Читаем контент из materials.json
    const materialsPath = path.join(process.cwd(), 'data', 'materials.json');
    const materials = JSON.parse(fs.readFileSync(materialsPath, 'utf8'));

    // Ищем конспект для этой темы
    const noteMaterial = materials.find((m: any) =>
      m.topicId === topicId && m.type === 'article'
    );

    // Ищем видео для этой темы
    const videoMaterial = materials.find((m: any) =>
      m.topicId === topicId && m.type === 'video'
    );

    if (!noteMaterial) {
      console.error('Material not found for topic:', topicId);
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Формируем контент урока из materials
    const content = noteMaterial.content || {};
    let lessonContent = '';

    if (content.summary) {
      lessonContent += `${content.summary}\n\n`;
    }

    if (content.detailedNotes) {
      lessonContent += content.detailedNotes;
    }

    // Формат который ожидает UI
    const lesson = {
      topicId: topicId,
      subject: noteMaterial.subject || 'mathematics',
      grade: 7,
      quarter: 1,
      title: noteMaterial.title,
      content: lessonContent,
      youtubeQuery: '',
      keywords: content.keyPoints || [],
      videoId: videoMaterial?.url ? extractYouTubeId(videoMaterial.url) : null
    };

    return NextResponse.json({ lesson });
  } catch (error) {
    console.error('Error loading lesson:', error);
    return NextResponse.json({ error: 'Failed to load lesson' }, { status: 500 });
  }
}

// Извлекаем YouTube ID из URL
function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
}
