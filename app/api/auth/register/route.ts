import { NextRequest, NextResponse } from 'next/server';
import { generateId, create, findBy } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { User, Student, Teacher } from '@/types';

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

    // Проверка существующего пользователя
    const existingUsers = findBy<User>('users', (u) => u.email === email);
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    // Хеширование пароля
    const hashedPassword = await hashPassword(password);

    // Создание пользователя
    const userId = generateId();
    const user: User = {
      id: userId,
      email,
      password: hashedPassword,
      role,
      name,
      createdAt: new Date(),
    };

    create('users', user);

    // Создание профиля в зависимости от роли
    if (role === 'student') {
      const student: Student = {
        ...user,
        role: 'student',
        grade: grade || 7,
        goals: goals || [],
        region: region || 'astana',
        mbtiProfile: mbtiType ? {
          type: mbtiType,
          description: '',
          learningStyle: '',
          strengths: [],
          challenges: [],
          setAt: new Date()
        } : undefined,
      };
      create('students', student);
    } else if (role === 'teacher') {
      const teacher: Teacher = {
        ...user,
        role: 'teacher',
        subjects: subjects || [],
      };
      create('teachers', teacher);
    }

    // Генерация токена
    const token = generateToken(userId, role);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: userId,
        email,
        name,
        role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Ошибка регистрации' },
      { status: 500 }
    );
  }
}
