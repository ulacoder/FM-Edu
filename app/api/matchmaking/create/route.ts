// API Route: Создание заявки на поиск команды

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { CreateProjectRequestPayload } from '@/types/matchmaking';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Проверяем аутентификацию
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload: CreateProjectRequestPayload = await request.json();

    // Валидация
    if (!payload.domain || !payload.title) {
      return NextResponse.json(
        { error: 'Domain and title are required' },
        { status: 400 }
      );
    }

    if (payload.max_members < 1 || payload.max_members > 5) {
      return NextResponse.json(
        { error: 'Max members must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Получаем MBTI пользователя из профиля
    const { data: profile } = await supabase
      .from('profiles')
      .select('personality_type')
      .eq('id', session.user.id)
      .single();

    const userMBTI = profile?.personality_type;

    // Создаем заявку
    const { data: projectRequest, error: createError } = await supabase
      .from('project_requests')
      .insert({
        author_id: session.user.id,
        domain: payload.domain,
        title: payload.title,
        description: payload.description,
        user_skills: payload.user_skills,
        looking_for_skills: payload.looking_for_skills,
        max_members: payload.max_members,
        target_mbti_filter: payload.target_mbti_filter || userMBTI,
        mbti_match_mode: payload.mbti_match_mode,
        current_members_count: 1,
        status: 'open',
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating project request:', createError);
      return NextResponse.json(
        { error: 'Failed to create project request' },
        { status: 500 }
      );
    }

    // Создаем командную комнату
    const { data: teamRoom, error: roomError } = await supabase
      .from('team_rooms')
      .insert({
        project_request_id: projectRequest.id,
        name: payload.title,
        description: payload.description,
      })
      .select()
      .single();

    if (roomError) {
      console.error('Error creating team room:', roomError);
      // Откатываем создание заявки
      await supabase.from('project_requests').delete().eq('id', projectRequest.id);
      return NextResponse.json(
        { error: 'Failed to create team room' },
        { status: 500 }
      );
    }

    // Добавляем автора как первого участника
    const { error: memberError } = await supabase.from('team_room_members').insert({
      team_room_id: teamRoom.id,
      user_id: session.user.id,
      project_request_id: projectRequest.id,
      role: 'creator',
      user_mbti: userMBTI,
      user_skills: payload.user_skills,
    });

    if (memberError) {
      console.error('Error adding creator to team:', memberError);
      // Откатываем
      await supabase.from('team_rooms').delete().eq('id', teamRoom.id);
      await supabase.from('project_requests').delete().eq('id', projectRequest.id);
      return NextResponse.json(
        { error: 'Failed to add creator to team' },
        { status: 500 }
      );
    }

    // Создаем системное приветственное сообщение
    await supabase.from('team_chat_messages').insert({
      team_room_id: teamRoom.id,
      user_id: session.user.id,
      content: `🎉 Команда "${payload.title}" создана! Ожидаем участников...`,
      message_type: 'system',
    });

    return NextResponse.json({
      success: true,
      projectRequest,
      teamRoom,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
