import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock users database
    const users = [
      {
        id: '1',
        name: 'Айгерим Сатпаева',
        email: 'aigerim@student.kz',
        role: 'student',
        grade: 11,
        region: 'г. Астана',
        totalTimeSpent: 2340,
        coursesCompleted: 24,
        testsCompleted: 67,
        lastActive: '2026-08-24T18:30:00Z',
        skillsRadar: {
          mathematics: 85,
          physics: 78,
          informatics: 92,
          chemistry: 71,
          biology: 68
        }
      },
      {
        id: '2',
        name: 'Ержан Нурланов',
        email: 'erzhan@student.kz',
        role: 'student',
        grade: 10,
        region: 'г. Алматы',
        totalTimeSpent: 1890,
        coursesCompleted: 18,
        testsCompleted: 52,
        lastActive: '2026-08-23T15:20:00Z',
        skillsRadar: {
          mathematics: 72,
          physics: 88,
          informatics: 76,
          chemistry: 65,
          biology: 70
        }
      },
      {
        id: '3',
        name: 'Мадина Жумабекова',
        email: 'madina@student.kz',
        role: 'student',
        grade: 12,
        region: 'г. Шымкент',
        totalTimeSpent: 3120,
        coursesCompleted: 31,
        testsCompleted: 89,
        lastActive: '2026-08-24T20:15:00Z',
        skillsRadar: {
          mathematics: 90,
          physics: 82,
          informatics: 78,
          chemistry: 88,
          biology: 85
        }
      },
      {
        id: '4',
        name: 'Нурсултан Алиев',
        email: 'nursultan@teacher.kz',
        role: 'teacher',
        region: 'г. Астана',
        totalTimeSpent: 1560,
        coursesCompleted: 0,
        testsCompleted: 0,
        lastActive: '2026-08-24T16:45:00Z',
        skillsRadar: {
          mathematics: 95,
          physics: 92,
          informatics: 88,
          chemistry: 90,
          biology: 87
        }
      },
      {
        id: '5',
        name: 'Алия Камалова',
        email: 'aliya@student.kz',
        role: 'student',
        grade: 10,
        region: 'г. Алматы',
        totalTimeSpent: 2670,
        coursesCompleted: 22,
        testsCompleted: 71,
        lastActive: '2026-08-24T19:30:00Z',
        skillsRadar: {
          mathematics: 88,
          physics: 75,
          informatics: 90,
          chemistry: 79,
          biology: 82
        }
      },
      {
        id: '6',
        name: 'Даурен Бектемиров',
        email: 'dauren@student.kz',
        role: 'student',
        grade: 11,
        region: 'г. Астана',
        totalTimeSpent: 2010,
        coursesCompleted: 19,
        testsCompleted: 58,
        lastActive: '2026-08-22T14:20:00Z',
        skillsRadar: {
          mathematics: 76,
          physics: 82,
          informatics: 85,
          chemistry: 68,
          biology: 72
        }
      }
    ];

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json(
      { error: 'Failed to load users' },
      { status: 500 }
    );
  }
}
