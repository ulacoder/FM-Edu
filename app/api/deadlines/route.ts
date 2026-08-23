import { NextRequest, NextResponse } from 'next/server';

// GET - получить все дедлайны студента
export async function GET(req: NextRequest) {
  try {
    // В Mentoria Hub стиле - данные не персистятся, возвращаем пустой массив
    return NextResponse.json({ deadlines: [] });
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

    const newDeadline = {
      id: Date.now().toString(),
      studentId,
      title,
      type,
      date: new Date(date),
      subject,
      description,
      color: color || '#8B5CF6',
      completed: false,
      createdAt: new Date()
    };

    // НЕ СОХРАНЯЕМ - просто возвращаем
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

    // В Mentoria Hub стиле - просто возвращаем успех
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting deadline:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH - обновить дедлайн
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, completed, title, date, description } = body;

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    // В Mentoria Hub стиле - просто возвращаем успех
    return NextResponse.json({
      deadline: {
        id,
        completed,
        title,
        date: date ? new Date(date) : undefined,
        description
      }
    });
  } catch (error: any) {
    console.error('Error updating deadline:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
