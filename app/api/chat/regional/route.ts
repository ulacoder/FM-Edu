import { NextRequest, NextResponse } from 'next/server';
import { RegionalChatMessage, Region } from '@/types';

// Мок данные для региональных чатов с разнообразными участниками
// Студенты из сел, обычных школ, НИШ, КТЛ - для всех регионов
const createMockMessages = (region: Region): RegionalChatMessage[] => [
  {
    id: 'msg_1',
    region,
    studentId: 'student_1',
    studentName: 'Айгерим',
    message: 'Привет всем! Я из села Шортанды, готовлюсь к ЕНТ по математике. Кто еще?',
    timestamp: new Date('2026-08-23T10:00:00Z')
  },
  {
    id: 'msg_2',
    region,
    studentId: 'student_2',
    studentName: 'Ержан',
    message: 'Я из 25 школы в городе! Тоже готовлюсь к ЕНТ, решаю квадратные уравнения',
    timestamp: new Date('2026-08-23T10:05:00Z')
  },
  {
    id: 'msg_3',
    region,
    studentId: 'student_3',
    studentName: 'Мадина',
    message: 'Привет! Я из НИШ ФМН. Давайте вместе готовиться, могу помочь с физикой',
    timestamp: new Date('2026-08-23T10:10:00Z')
  },
  {
    id: 'msg_4',
    region,
    studentId: 'student_4',
    studentName: 'Нурбол',
    message: 'Салем! Я из аульной школы в Жамбылской области. Интернет не очень, но стараюсь учиться',
    timestamp: new Date('2026-08-23T10:15:00Z')
  },
  {
    id: 'msg_5',
    region,
    studentId: 'student_5',
    studentName: 'Алия',
    message: 'Всем привет из гимназии №5! Кто-нибудь проходил диагностический тест?',
    timestamp: new Date('2026-08-23T10:20:00Z')
  },
  {
    id: 'msg_6',
    region,
    studentId: 'student_2',
    studentName: 'Ержан',
    message: 'Я прошел, показало мой уровень и дало рекомендации. Очень помогает!',
    timestamp: new Date('2026-08-23T10:25:00Z')
  },
  {
    id: 'msg_7',
    region,
    studentId: 'student_6',
    studentName: 'Асель',
    message: 'Я из обычной школы в районном центре. У кого-нибудь есть советы по информатике?',
    timestamp: new Date('2026-08-23T10:30:00Z')
  },
  {
    id: 'msg_8',
    region,
    studentId: 'student_7',
    studentName: 'Дияр',
    message: 'Я из КТЛ, могу помочь с программированием! Проходите темы на платформе по порядку',
    timestamp: new Date('2026-08-23T10:35:00Z')
  },
  {
    id: 'msg_9',
    region,
    studentId: 'student_8',
    studentName: 'Жанар',
    message: 'Спасибо за платформу! Я из малокомплектной школы, у нас нет многих предметов. Здесь могу учиться!',
    timestamp: new Date('2026-08-23T10:40:00Z')
  },
  {
    id: 'msg_10',
    region,
    studentId: 'student_1',
    studentName: 'Айгерим',
    message: 'Да, платформа реально помогает! В селе учителя не всегда есть, а тут все доступно',
    timestamp: new Date('2026-08-23T10:45:00Z')
  },
  {
    id: 'msg_11',
    region,
    studentId: 'student_9',
    studentName: 'Санжар',
    message: 'Кто готовится к олимпиадам? Я из обычной школы, но хочу попробовать',
    timestamp: new Date('2026-08-23T10:50:00Z')
  },
  {
    id: 'msg_12',
    region,
    studentId: 'student_3',
    studentName: 'Мадина',
    message: 'Санжар, давай вместе! Я помогу подготовиться, в олимпиадах главное - практика',
    timestamp: new Date('2026-08-23T10:55:00Z')
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

    // Создаем сообщения для конкретного региона
    const messages = createMockMessages(region).slice(-limit);

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
