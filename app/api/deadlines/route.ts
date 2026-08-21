import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Deadline } from '@/types';

const DEADLINES_FILE = path.join(process.cwd(), 'data', 'deadlines.json');

// GET - получить все дедлайны студента
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'studentId required' }, { status: 400 });
    }

    const data = await fs.readFile(DEADLINES_FILE, 'utf-8');
    const deadlines: Deadline[] = JSON.parse(data);

    // Фильтруем дедлайны по студенту
    const studentDeadlines = deadlines.filter(d => d.studentId === studentId);

    // Сортируем по дате (ближайшие первые)
    studentDeadlines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({ deadlines: studentDeadlines });
  } catch (error: any) {
    console.error('Error loading deadlines:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - создать новый дедлайн
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, title, type, date, subject, description, color } = body;

    if (!studentId || !title || !type || !date) {
      return NextResponse.json(
        { error: 'studentId, title, type, and date are required' },
        { status: 400 }
      );
    }

    const data = await fs.readFile(DEADLINES_FILE, 'utf-8');
    const deadlines: Deadline[] = JSON.parse(data);

    const newDeadline: Deadline = {
      id: Date.now().toString(),
      studentId,
      title,
      type,
      date: new Date(date),
      subject,
      description,
      color: color || '#8B5CF6', // default purple
      completed: false,
      createdAt: new Date()
    };

    deadlines.push(newDeadline);

    await fs.writeFile(DEADLINES_FILE, JSON.stringify(deadlines, null, 2), 'utf-8');

    return NextResponse.json({ deadline: newDeadline });
  } catch (error: any) {
    console.error('Error creating deadline:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - удалить дедлайн
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const deadlineId = searchParams.get('id');

    if (!deadlineId) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    const data = await fs.readFile(DEADLINES_FILE, 'utf-8');
    let deadlines: Deadline[] = JSON.parse(data);

    deadlines = deadlines.filter(d => d.id !== deadlineId);

    await fs.writeFile(DEADLINES_FILE, JSON.stringify(deadlines, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting deadline:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH - обновить дедлайн (например, отметить выполненным)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, completed, title, date, description } = body;

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    const data = await fs.readFile(DEADLINES_FILE, 'utf-8');
    const deadlines: Deadline[] = JSON.parse(data);

    const deadlineIndex = deadlines.findIndex(d => d.id === id);
    if (deadlineIndex === -1) {
      return NextResponse.json({ error: 'Deadline not found' }, { status: 404 });
    }

    // Обновляем поля
    if (completed !== undefined) deadlines[deadlineIndex].completed = completed;
    if (title) deadlines[deadlineIndex].title = title;
    if (date) deadlines[deadlineIndex].date = new Date(date);
    if (description !== undefined) deadlines[deadlineIndex].description = description;

    await fs.writeFile(DEADLINES_FILE, JSON.stringify(deadlines, null, 2), 'utf-8');

    return NextResponse.json({ deadline: deadlines[deadlineIndex] });
  } catch (error: any) {
    console.error('Error updating deadline:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
