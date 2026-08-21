import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Student } from '@/types';

const STUDENTS_FILE = path.join(process.cwd(), 'data', 'students.json');

export async function POST(req: NextRequest) {
  try {
    const { studentId, score, subject } = await req.json();

    if (!studentId || score === undefined || !subject) {
      return NextResponse.json(
        { error: 'Не указаны необходимые параметры' },
        { status: 400 }
      );
    }

    const studentsData = await fs.readFile(STUDENTS_FILE, 'utf-8');
    const students: Student[] = JSON.parse(studentsData);

    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
      return NextResponse.json(
        { error: 'Студент не найден' },
        { status: 404 }
      );
    }

    const student = students[studentIndex];

    // Инициализируем поля если их нет
    if (!student.totalPoints) {
      student.totalPoints = 0;
    }

    if (!student.gameStats) {
      student.gameStats = {
        totalGamesPlayed: 0,
        bestScoresBySubject: {},
        totalPointsEarned: 0
      };
    }

    // Обновляем статистику
    student.totalPoints += score;
    student.gameStats.totalGamesPlayed += 1;
    student.gameStats.totalPointsEarned += score;
    student.gameStats.lastPlayedAt = new Date();

    // Обновляем лучший результат по предмету
    const currentBest = student.gameStats.bestScoresBySubject[subject] || 0;
    if (score > currentBest) {
      student.gameStats.bestScoresBySubject[subject] = score;
    }

    // Сохраняем
    students[studentIndex] = student;
    await fs.writeFile(STUDENTS_FILE, JSON.stringify(students, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      newTotal: student.totalPoints,
      gameStats: student.gameStats
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

    const studentsData = await fs.readFile(STUDENTS_FILE, 'utf-8');
    const students: Student[] = JSON.parse(studentsData);

    const student = students.find(s => s.id === studentId);
    if (!student) {
      return NextResponse.json(
        { error: 'Студент не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      totalPoints: student.totalPoints || 0,
      gameStats: student.gameStats || {
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
