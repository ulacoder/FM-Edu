import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { studentId, score, subject } = await req.json();

    if (!studentId || score === undefined || !subject) {
      return NextResponse.json(
        { error: 'Не указаны необходимые параметры' },
        { status: 400 }
      );
    }

    // Просто возвращаем успех - данные управляются на фронте через localStorage
    return NextResponse.json({
      success: true,
      newTotal: score,
      gameStats: {
        totalGamesPlayed: 1,
        bestScoresBySubject: { [subject]: score },
        totalPointsEarned: score
      }
    });

  } catch (error: any) {
    console.error('Error saving game score:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при сохранении результата' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Не указан ID студента' },
        { status: 400 }
      );
    }

    // Возвращаем дефолтные значения - данные управляются на фронте
    return NextResponse.json({
      totalPoints: 0,
      gameStats: {
        totalGamesPlayed: 0,
        bestScoresBySubject: {},
        totalPointsEarned: 0
      }
    });

  } catch (error: any) {
    console.error('Error getting points:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при получении баллов' },
      { status: 500 }
    );
  }
}
