// API Route: Вступление в команду

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { checkMBTICompatibility } from '@/lib/mbti-matcher';
import type { JoinTeamPayload } from '@/types/matchmaking';

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

    const payload: JoinTeamPayload = await request.json();

    // Получаем заявку
    const { data: projectRequest, error: fetchError } = await supabase
      .from('project_requests')
      .select('*, team_rooms(id)')
      .eq('id', payload.project_request_id)
      .single();

    if (fetchError || !projectRequest) {
      return NextResponse.json(
        { error: 'Project request not found' },
        { status: 404 }
      );
    }

    // Проверяем статус заявки
    if (projectRequest.status !== 'open') {
      return NextResponse.json(
        { error: 'This team is no longer accepting members' },
        { status: 400 }
      );
    }

    // Проверяем, не заполнена ли команда
    if (projectRequest.current_members_count >= projectRequest.max_members) {
      return NextResponse.json(
        { error: 'Team is full' },
        { status: 400 }
      );
    }

    // Проверяем, не состоит ли пользователь уже в команде
    const teamRoomId = projectRequest.team_rooms[0]?.id;
    if (!teamRoomId) {
      return NextResponse.json(
        { error: 'Team room not found' },
        { status: 404 }
      );
    }

    const { data: existingMember } = await supabase
      .from('team_room_members')
      .select('id')
      .eq('team_room_id', teamRoomId)
      .eq('user_id', session.user.id)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: 'You are already a member of this team' },
        { status: 400 }
      );
    }

    // Получаем MBTI пользователя из профиля
    const { data: profile } = await supabase
      .from('profiles')
      .select('personality_type, name')
      .eq('id', session.user.id)
      .single();

    const userMBTI = payload.user_mbti || profile?.personality_type;

    // Проверяем совместимость MBTI
    const compatibility = checkMBTICompatibility(
      userMBTI,
      projectRequest.target_mbti_filter,
      projectRequest.mbti_match_mode
    );

    if (!compatibility.isMatch) {
      return NextResponse.json(
        {
          error: 'MBTI compatibility check failed',
          message: compatibility.message,
          matchScore: compatibility.matchScore,
          requiresConfirmation: compatibility.matchScore >= 2, // Если 2+ совпадения, можно предложить подтверждение
        },
        { status: 403 }
      );
    }

    // Добавляем участника в команду
    const { error: memberError } = await supabase.from('team_room_members').insert({
      team_room_id: teamRoomId,
      user_id: session.user.id,
      project_request_id: payload.project_request_id,
      role: 'member',
      user_mbti: userMBTI,
      user_skills: payload.user_skills,
    });

    if (memberError) {
      console.error('Error adding member:', memberError);
      return NextResponse.json(
        { error: 'Failed to join team' },
        { status: 500 }
      );
    }

    // Увеличиваем счетчик участников
    const newCount = projectRequest.current_members_count + 1;
    const newStatus = newCount >= projectRequest.max_members ? 'full' : 'open';

    const { error: updateError } = await supabase
      .from('project_requests')
      .update({
        current_members_count: newCount,
        status: newStatus,
      })
      .eq('id', payload.project_request_id);

    if (updateError) {
      console.error('Error updating project request:', updateError);
    }

    // Создаем системное сообщение о присоединении
    await supabase.from('team_chat_messages').insert({
      team_room_id: teamRoomId,
      user_id: session.user.id,
      content: `🎊 ${profile?.name || 'Новый участник'} присоединился к команде! MBTI: ${userMBTI || 'не указан'}`,
      message_type: 'system',
    });

    return NextResponse.json({
      success: true,
      teamRoomId,
      compatibility,
      newMemberCount: newCount,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
