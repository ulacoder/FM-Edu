import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Возвращаем пустой лидерборд - данные не персистятся
    return NextResponse.json({
      leaderboard: [],
      region: 'all',
      totalStudents: 0
    });

  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при загрузке лидерборда' },
      { status: 500 }
    );
  }
}
