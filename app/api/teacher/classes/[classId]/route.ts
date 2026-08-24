import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const { classId } = await params;

    const classesStr = localStorage.getItem('fm_edu_classes');
    const classes = classesStr ? JSON.parse(classesStr) : [];

    const classData = classes.find((c: any) => c.id === classId);

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // Получаем студентов класса
    const usersStr = localStorage.getItem('fm_edu_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    const students = users.filter((u: any) => classData.studentIds.includes(u.id));

    return NextResponse.json({ class: classData, students });
  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json({ error: 'Failed to fetch class' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const { classId } = await params;
    const body = await request.json();
    const { studentId, action } = body;

    if (!studentId || !action) {
      return NextResponse.json({ error: 'Student ID and action required' }, { status: 400 });
    }

    const classesStr = localStorage.getItem('fm_edu_classes');
    const classes = classesStr ? JSON.parse(classesStr) : [];

    const classIndex = classes.findIndex((c: any) => c.id === classId);

    if (classIndex === -1) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    if (action === 'add') {
      // Проверяем существование студента
      const usersStr = localStorage.getItem('fm_edu_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      const student = users.find((u: any) => u.id === studentId && u.role === 'student');

      if (!student) {
        return NextResponse.json({ error: 'Студент с таким ID не найден' }, { status: 404 });
      }

      if (classes[classIndex].studentIds.includes(studentId)) {
        return NextResponse.json({ error: 'Студент уже добавлен в класс' }, { status: 400 });
      }

      classes[classIndex].studentIds.push(studentId);
      classes[classIndex].updatedAt = new Date();
    } else if (action === 'remove') {
      classes[classIndex].studentIds = classes[classIndex].studentIds.filter((id: string) => id !== studentId);
      classes[classIndex].updatedAt = new Date();
    }

    localStorage.setItem('fm_edu_classes', JSON.stringify(classes));

    return NextResponse.json({ success: true, class: classes[classIndex] });
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json({ error: 'Failed to update class' }, { status: 500 });
  }
}
