import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { RegionalChatMessage, Region } from '@/types';

const CHAT_FILE = path.join(process.cwd(), 'data', 'regional-chats.json');

// Инициализация файла если не существует
async function ensureChatFile() {
  try {
    await fs.access(CHAT_FILE);
  } catch {
    await fs.writeFile(CHAT_FILE, JSON.stringify([]), 'utf-8');
  }
}

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

    await ensureChatFile();
    const chatData = await fs.readFile(CHAT_FILE, 'utf-8');
    const allMessages: RegionalChatMessage[] = JSON.parse(chatData);

    // Фильтруем по региону и берем последние N сообщений
    const messages = allMessages
      .filter(m => m.region === region)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
      .reverse(); // В хронологическом порядке

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

    await ensureChatFile();
    const chatData = await fs.readFile(CHAT_FILE, 'utf-8');
    const allMessages: RegionalChatMessage[] = JSON.parse(chatData);

    const newMessage: RegionalChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      region,
      studentId,
      studentName,
      message,
      timestamp: new Date()
    };

    allMessages.push(newMessage);

    // Ограничиваем общее количество сообщений (последние 1000)
    const limitedMessages = allMessages.slice(-1000);

    await fs.writeFile(CHAT_FILE, JSON.stringify(limitedMessages, null, 2), 'utf-8');

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
