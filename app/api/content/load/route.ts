import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// API для загрузки сгенерированного контента в БД
export async function POST(request: NextRequest) {
  try {
    const { subject } = await request.json();

    if (!subject || !['mathematics', 'physics', 'informatics'].includes(subject)) {
      return NextResponse.json({ error: 'Invalid subject' }, { status: 400 });
    }

    const contentPath = path.join(process.cwd(), 'data', 'generated', `${subject}-content.json`);

    if (!fs.existsSync(contentPath)) {
      return NextResponse.json({ error: 'Content not generated yet' }, { status: 404 });
    }

    const generatedContent = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

    // Сохраняем в materials.json и assignments.json
    const materialsPath = path.join(process.cwd(), 'data', 'materials.json');
    const assignmentsPath = path.join(process.cwd(), 'data', 'assignments.json');

    let materials = [];
    let assignments = [];

    if (fs.existsSync(materialsPath)) {
      materials = JSON.parse(fs.readFileSync(materialsPath, 'utf-8'));
    }

    if (fs.existsSync(assignmentsPath)) {
      assignments = JSON.parse(fs.readFileSync(assignmentsPath, 'utf-8'));
    }

    let materialsAdded = 0;
    let assignmentsAdded = 0;

    // Добавляем контент
    for (const item of generatedContent) {
      const topicId = `${item.topic.subject}-${item.topic.grade}-${item.topic.quarter}-${item.topic.order}`;

      // Добавляем видео материал
      if (item.videoUrl) {
        const materialId = `${topicId}-video`;
        if (!materials.find((m: any) => m.id === materialId)) {
          materials.push({
            id: materialId,
            topicId: topicId,
            type: 'video',
            title: `Видеоурок: ${item.topic.title}`,
            url: item.videoUrl,
            difficulty: 'medium',
            content: {
              summary: item.summary,
              detailedNotes: item.detailedNotes,
              keyPoints: item.keyPoints,
              examples: item.examples
            }
          });
          materialsAdded++;
        }
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
        }
      }
    }

    // Сохраняем обратно
    fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2));
    fs.writeFileSync(assignmentsPath, JSON.stringify(assignments, null, 2));

    return NextResponse.json({
      success: true,
      subject,
      materialsAdded,
      assignmentsAdded,
      totalTopics: generatedContent.length
    });
  } catch (error) {
    console.error('Load content error:', error);
    return NextResponse.json(
      { error: 'Failed to load content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET - проверка статуса генерации
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');

    const subjects = subject ? [subject] : ['mathematics', 'physics', 'informatics'];
    const status: any = {};

    for (const subj of subjects) {
      const contentPath = path.join(process.cwd(), 'data', 'generated', `${subj}-content.json`);

      if (fs.existsSync(contentPath)) {
        const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
        status[subj] = {
          generated: true,
          topics: content.length,
          withVideo: content.filter((c: any) => c.videoUrl).length,
          withTests: content.filter((c: any) => c.test && c.test.questions && c.test.questions.length > 0).length
        };
      } else {
        status[subj] = {
          generated: false,
          topics: 0,
          withVideo: 0,
          withTests: 0
        };
      }
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error('Get status error:', error);
    return NextResponse.json(
      { error: 'Failed to get status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
