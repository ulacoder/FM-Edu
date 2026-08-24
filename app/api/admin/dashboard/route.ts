import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock dashboard statistics
    const stats = {
      totalUsers: 1247,
      activeToday: 389,
      totalCourses: 156,
      offlineDownloads: 842,
      avgSessionTime: 47,
      topSubjects: [
        { name: 'Математика', students: 456, color: '#8b5cf6' },
        { name: 'Физика', students: 389, color: '#ec4899' },
        { name: 'Информатика', students: 312, color: '#f59e0b' },
        { name: 'Химия', students: 267, color: '#10b981' },
        { name: 'Биология', students: 198, color: '#3b82f6' }
      ],
      weeklyActivity: [
        { day: 'Пн', students: 234 },
        { day: 'Вт', students: 312 },
        { day: 'Ср', students: 289 },
        { day: 'Чт', students: 367 },
        { day: 'Пт', students: 421 },
        { day: 'Сб', students: 156 },
        { day: 'Вс', students: 98 }
      ],
      skillsDistribution: [
        { subject: 'Математика', avgScore: 78, fullMark: 100 },
        { subject: 'Физика', avgScore: 72, fullMark: 100 },
        { subject: 'Информатика', avgScore: 85, fullMark: 100 },
        { subject: 'Химия', avgScore: 68, fullMark: 100 },
        { subject: 'Биология', avgScore: 74, fullMark: 100 }
      ]
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard stats' },
      { status: 500 }
    );
  }
}
