import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { findById } from '@/lib/db';
import { Teacher } from '@/types';

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

    const teacher = findById<Teacher>('teachers', user.userId);

    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }

    // Не возвращаем пароль
    const { password, ...teacherData } = teacher;

    return NextResponse.json(teacherData);
  } catch (error) {
    console.error('Teacher profile fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching profile' },
      { status: 500 }
    );
  }
}
