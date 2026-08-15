import { NextRequest, NextResponse } from 'next/server';
import { findBy } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';
import { User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Валидация
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Введите email и пароль' },
        { status: 400 }
      );
    }

    // Поиск пользователя
    const users = findBy<User>('users', (u) => u.email === email);
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Проверка пароля
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Генерация токена
    const token = generateToken(user.id, user.role);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ошибка входа' },
      { status: 500 }
    );
  }
}
