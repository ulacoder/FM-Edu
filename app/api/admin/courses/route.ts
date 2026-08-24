import { NextRequest, NextResponse } from 'next/server';

// Mock courses database
let courses = [
  {
    id: '1',
    title: 'Квадратные уравнения',
    subject: 'mathematics',
    grade: 10,
    description: 'Решение квадратных уравнений различными методами',
    videoUrl: 'https://youtube.com/watch?v=example1',
    audioUrl: 'https://example.com/audio1.mp3',
    textContent: '# Квадратные уравнения\n\nКвадратное уравнение имеет вид: ax² + bx + c = 0',
    infographicUrl: 'https://example.com/infographic1.png',
    duration: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Законы Ньютона',
    subject: 'physics',
    grade: 10,
    description: 'Три закона движения Ньютона',
    videoUrl: 'https://youtube.com/watch?v=example2',
    textContent: '# Законы Ньютона\n\n1. Закон инерции\n2. F = ma\n3. Действие и противодействие',
    duration: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Courses API error:', error);
    return NextResponse.json(
      { error: 'Failed to load courses' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newCourse = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    courses.push(newCourse);

    return NextResponse.json({ success: true, course: newCourse });
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
