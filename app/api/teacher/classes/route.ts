import { NextRequest, NextResponse } from 'next/server';
import { TeacherClass } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const teacherId = request.nextUrl.searchParams.get('teacherId');

    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID required' }, { status: 400 });
    }

    const classesStr = localStorage.getItem('fm_edu_classes');
    const classes: TeacherClass[] = classesStr ? JSON.parse(classesStr) : [];

    const teacherClasses = classes.filter(c => c.teacherId === teacherId);

    return NextResponse.json({ classes: teacherClasses });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teacherId, name, description } = body;

    if (!teacherId || !name) {
      return NextResponse.json({ error: 'Teacher ID and name required' }, { status: 400 });
    }

    const classesStr = localStorage.getItem('fm_edu_classes');
    const classes: TeacherClass[] = classesStr ? JSON.parse(classesStr) : [];

    const newClass: TeacherClass = {
      id: `class_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      teacherId,
      name,
      description: description || '',
      studentIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    classes.push(newClass);
    localStorage.setItem('fm_edu_classes', JSON.stringify(classes));

    return NextResponse.json({ success: true, class: newClass });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
  }
}
