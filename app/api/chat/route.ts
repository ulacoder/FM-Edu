import { NextRequest, NextResponse } from 'next/server';
import { generateMentorResponse, ChatMessage, MentorContext } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('📨 Received message:', message);
    console.log('📜 Conversation history length:', conversationHistory?.length || 0);

    const context: MentorContext = {
      conversationHistory: conversationHistory || [],
    };

    const response = await generateMentorResponse(message, context);

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('💥 Chat API error:', error);
    return NextResponse.json(
      { error: 'Ошибка обработки запроса' },
      { status: 500 }
    );
  }
}
