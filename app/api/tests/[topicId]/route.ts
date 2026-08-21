import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ topicId: string }> }
) {
  try {
    const { topicId } = await context.params;

    // Load pre-generated tests from JSON
    const testsPath = path.join(process.cwd(), 'data', 'tests.json');
    const allTests = JSON.parse(fs.readFileSync(testsPath, 'utf8'));

    const test = allTests[topicId];

    if (!test) {
      console.error('Test not found for topic:', topicId);
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    return NextResponse.json({ questions: test.questions });
  } catch (error) {
    console.error('Error loading test:', error);
    return NextResponse.json({ error: 'Failed to load test' }, { status: 500 });
  }
}
