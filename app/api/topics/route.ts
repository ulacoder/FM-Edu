import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const grade = searchParams.get('grade');
    const quarter = searchParams.get('quarter');

    const topicsPath = path.join(process.cwd(), 'data', 'topics.json');
    const allTopics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

    // Filter topics
    let topics = allTopics;

    if (subject) {
      topics = topics.filter((t: any) => t.subject === subject);
    }

    if (grade) {
      topics = topics.filter((t: any) => t.grade === parseInt(grade));
    }

    if (quarter) {
      topics = topics.filter((t: any) => t.quarter === parseInt(quarter));
    }

    // Sort by order
    topics.sort((a: any, b: any) => a.order - b.order);

    return NextResponse.json({ topics, count: topics.length });
  } catch (error) {
    console.error('Error loading topics:', error);
    return NextResponse.json({ error: 'Failed to load topics' }, { status: 500 });
  }
}
