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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const courseIndex = courses.findIndex(c => c.id === params.id);

    if (courseIndex === -1) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    courses[courseIndex] = {
      ...courses[courseIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, course: courses[courseIndex] });
  } catch (error) {
    console.error('Update course error:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseIndex = courses.findIndex(c => c.id === params.id);

    if (courseIndex === -1) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    courses = courses.filter(c => c.id !== params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
