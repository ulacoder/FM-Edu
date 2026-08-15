import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { readData } from '@/lib/db';
import { Student, StudentProgress } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');
    const user = getUserFromToken(token || '');

    if (!user || user.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Получаем всех учеников
    const students = readData<Student>('students');

    // Получаем прогресс всех учеников
    const progress = readData<StudentProgress>('student-progress');

    // Убираем пароли из данных учеников
    const studentsWithoutPasswords = students.map(({ password, ...student }) => student);

    return NextResponse.json({
      students: studentsWithoutPasswords,
      progress,
    });
  } catch (error) {
    console.error('Students fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching students' },
      { status: 500 }
    );
  }
}
