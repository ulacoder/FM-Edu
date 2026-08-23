import { NextRequest, NextResponse } from 'next/server';
import { RegionalChatMessage, Region } from '@/types';

// Мок данные для всех регионов (одни и те же сообщения)
const MOCK_MESSAGES: RegionalChatMessage[] = [
  {
    id: 'msg_1',
    region: 'astana' as Region,
    studentId: 'student_1',
    studentName: 'Айдар',
    message: 'Привет всем! Кто готовится к экзаменам по математике?',
    timestamp: new Date('2026-08-23T10:00:00Z')
  },
  {
    id: 'msg_2',
    region: 'astana' as Region,
    studentId: 'student_2',
    studentName: 'Мадина',
    message: 'Я! Решаю задачи на квадратные уравнения, очень помогает платформа',
    timestamp: new Date('2026-08-23T10:05:00Z')
  },
  {
    id: 'msg_3',
    region: 'astana' as Region,
    studentId: 'student_3',
    studentName: 'Данияр',
    message: 'Есть кто из НИШ Астана? Давайте вместе готовиться к олимпиадам',
    timestamp: new Date('2026-08-23T10:10:00Z')
  },
  {
    id: 'msg_4',
    region: 'astana' as Region,
    studentId: 'student_1',
    studentName: 'Айдар',
    message: 'Я из НИШ ФМН! Тоже готовлюсь к олимпиаде по физике',
    timestamp: new Date('2026-08-23T10:15:00Z')
  },
  {
    id: 'msg_5',
    region: 'astana' as Region,
    studentId: 'student_4',
    studentName: 'Арина',
    message: 'Кто-нибудь проходил диагностический тест? Какие результаты?',
    timestamp: new Date('2026-08-23T10:20:00Z')
  },
  {
    id: 'msg_6',
    region: 'astana' as Region,
    studentId: 'student_2',
    studentName: 'Мадина',
    message: 'Я прошла, показало мой уровень и дало персональные рекомендации. Очень полезно!',
    timestamp: new Date('2026-08-23T10:25:00Z')
  },
  {
    id: 'msg_7',
    region: 'astana' as Region,
    studentId: 'student_5',
    studentName: 'Темирлан',
    message: 'У кого-нибудь есть советы по подготовке к ЕНТ по информатике?',
    timestamp: new Date('2026-08-23T10:30:00Z')
  },
  {
    id: 'msg_8',
    region: 'astana' as Region,
    studentId: 'student_3',
    studentName: 'Данияр',
    message: 'Проходи все темы по порядку на платформе, там алгоритмы очень хорошо объясняют',
    timestamp: new Date('2026-08-23T10:35:00Z')
  }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get('region') as Region;
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!region) {
      return NextResponse.json(
        { error: 'Регион не указан' },
        { status: 400 }
      );
    }

    // Возвращаем те же мок сообщения для любого региона
    const messages = MOCK_MESSAGES
      .map(msg => ({ ...msg, region })) // Подставляем нужный регион
      .slice(-limit);

    return NextResponse.json({ messages });

  } catch (error: any) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при загрузке чата' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { region, studentId, studentName, message } = await req.json();

    if (!region || !studentId || !studentName || !message) {
      return NextResponse.json(
        { error: 'Не указаны необходимые параметры' },
        { status: 400 }
      );
    }

    // Создаем новое сообщение но не сохраняем (нет персистентности)
    const newMessage: RegionalChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      region,
      studentId,
      studentName,
      message,
      timestamp: new Date()
    };

    return NextResponse.json({
      success: true,
      message: newMessage
    });

  } catch (error: any) {
    console.error('Error posting chat message:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при отправке сообщения' },
      { status: 500 }
    );
  }
}
