import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { findById } from '@/lib/db';
import { Student } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');
    const user = getUserFromToken(token || '');

    if (!user || user.role !== 'student') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const student = findById<Student>('students', user.userId);

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Не возвращаем пароль
    const { password, ...studentData } = student;

    return NextResponse.json(studentData);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching profile' },
      { status: 500 }
    );
  }
}
