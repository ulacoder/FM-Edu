import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const classId = request.nextUrl.searchParams.get('classId');
    const studentId = request.nextUrl.searchParams.get('studentId');

    if (classId) {
      // Аналитика по классу
      const classesStr = localStorage.getItem('fm_edu_classes');
      const classes = classesStr ? JSON.parse(classesStr) : [];
      const classData = classes.find((c: any) => c.id === classId);

      if (!classData) {
        return NextResponse.json({ error: 'Class not found' }, { status: 404 });
      }

      const usersStr = localStorage.getItem('fm_edu_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      const students = users.filter((u: any) => classData.studentIds.includes(u.id));

      // Считаем среднюю успеваемость
      const totalPoints = students.reduce((sum: number, s: any) => sum + (s.totalPoints || 0), 0);
      const averagePoints = students.length > 0 ? Math.round(totalPoints / students.length) : 0;

      return NextResponse.json({
        class: classData,
        studentsCount: students.length,
        averagePoints,
        students: students.map((s: any) => ({
          id: s.id,
          name: s.name,
          grade: s.grade,
          totalPoints: s.totalPoints || 0,
          region: s.region,
          mbtiType: s.mbtiType
        }))
      });
    } else if (studentId) {
      // Детальная аналитика студента
      const usersStr = localStorage.getItem('fm_edu_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      const student = users.find((u: any) => u.id === studentId && u.role === 'student');

      if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }

      // Транзакции баллов
      const transactionsStr = localStorage.getItem('fm_edu_transactions');
      const transactions = transactionsStr ? JSON.parse(transactionsStr) : [];
      const studentTransactions = transactions.filter((t: any) => t.studentId === studentId);

      // Ревью
      const reviewsStr = localStorage.getItem('fm_edu_reviews');
      const reviews = reviewsStr ? JSON.parse(reviewsStr) : [];
      const studentReviews = reviews.filter((r: any) => r.studentId === studentId);

      return NextResponse.json({
        student: {
          id: student.id,
          name: student.name,
          email: student.email,
          grade: student.grade,
          totalPoints: student.totalPoints || 0,
          region: student.region,
          mbtiType: student.mbtiType,
          goals: student.goals || []
        },
        transactions: studentTransactions,
        reviews: studentReviews,
        stats: {
          totalPointsReceived: studentTransactions.reduce((sum: number, t: any) => sum + t.amount, 0),
          transactionsCount: studentTransactions.length,
          reviewsCount: studentReviews.length
        }
      });
    } else {
      return NextResponse.json({ error: 'Class ID or Student ID required' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
