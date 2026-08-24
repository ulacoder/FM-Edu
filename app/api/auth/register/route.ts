import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role, grade, subjects, goals, region, mbtiType } = body;

    // Валидация
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    // Создаём профиль
    const userId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    let fullProfile: any = {
      id: userId,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    };

    if (role === 'student') {
      fullProfile = {
        ...fullProfile,
        grade: grade || 7,
        goals: goals || [],
        region: region || 'astana',
        mbtiType: mbtiType || null,
        totalPoints: 0,
      };
    } else if (role === 'teacher') {
      fullProfile = {
        ...fullProfile,
        subjects: subjects || [],
      };
    }

    // Простой токен
    const token = `token_${userId}`;

    return NextResponse.json({
      success: true,
      token,
      user: fullProfile,
      password, // Возвращаем пароль для localStorage
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Ошибка регистрации' },
      { status: 500 }
    );
  }
}
