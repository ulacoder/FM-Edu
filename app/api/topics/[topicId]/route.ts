import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ topicId: string }> }
) {
  try {
    const { topicId } = await context.params;

    const topicsPath = path.join(process.cwd(), 'data', 'topics.json');
    const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

    const topic = topics.find((t: any) => t.id === topicId);

    if (!topic) {
      console.error('Topic not found:', topicId);
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    return NextResponse.json({ topic });
  } catch (error) {
    console.error('Error loading topic:', error);
    return NextResponse.json({ error: 'Failed to load topic' }, { status: 500 });
  }
}
