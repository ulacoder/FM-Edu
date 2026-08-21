import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const topicsPath = path.join(process.cwd(), 'data', 'topics.json');
    const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

    // Count topics by subject
    const counts: Record<string, number> = {};
    topics.forEach((topic: any) => {
      counts[topic.subject] = (counts[topic.subject] || 0) + 1;
    });

    return NextResponse.json({ counts, total: topics.length });
  } catch (error) {
    console.error('Error loading topics:', error);
    return NextResponse.json({ error: 'Failed to load topics' }, { status: 500 });
  }
}
