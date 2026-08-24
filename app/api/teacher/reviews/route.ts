import { NextRequest, NextResponse } from 'next/server';
import { TeacherReview } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teacherId, studentId, text, category, classId } = body;

    if (!teacherId || !studentId || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Получаем имя учителя
    const usersStr = localStorage.getItem('fm_edu_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    const teacher = users.find((u: any) => u.id === teacherId);

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Проверяем существование студента
    const student = users.find((u: any) => u.id === studentId && u.role === 'student');

    if (!student) {
      return NextResponse.json({ error: 'Студент с таким ID не найден' }, { status: 404 });
    }

    // Создаём ревью
    const reviewsStr = localStorage.getItem('fm_edu_reviews');
    const reviews: TeacherReview[] = reviewsStr ? JSON.parse(reviewsStr) : [];

    const newReview: TeacherReview = {
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      teacherId,
      teacherName: teacher.name,
      studentId,
      classId,
      text,
      category: category || 'general',
      createdAt: new Date(),
    };

    reviews.push(newReview);
    localStorage.setItem('fm_edu_reviews', JSON.stringify(reviews));

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    const reviewsStr = localStorage.getItem('fm_edu_reviews');
    const reviews: TeacherReview[] = reviewsStr ? JSON.parse(reviewsStr) : [];

    const studentReviews = reviews.filter(r => r.studentId === studentId);

    return NextResponse.json({ reviews: studentReviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
