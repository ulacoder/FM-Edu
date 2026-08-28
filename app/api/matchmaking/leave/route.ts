// API Route: Выход из команды

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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

    const { team_room_id, project_request_id } = await request.json();

    if (!team_room_id || !project_request_id) {
      return NextResponse.json(
        { error: 'team_room_id and project_request_id are required' },
        { status: 400 }
      );
    }

    // Проверяем, состоит ли пользователь в команде
    const { data: member, error: memberFetchError } = await supabase
      .from('team_room_members')
      .select('*, profiles(name)')
      .eq('team_room_id', team_room_id)
      .eq('user_id', session.user.id)
      .single();

    if (memberFetchError || !member) {
      return NextResponse.json(
        { error: 'You are not a member of this team' },
        { status: 404 }
      );
    }

    // Проверяем, не является ли пользователь создателем
    if (member.role === 'creator') {
      return NextResponse.json(
        {
          error: 'Creator cannot leave the team. You can close the project instead.',
        },
        { status: 400 }
      );
    }

    // Получаем текущую заявку
    const { data: projectRequest } = await supabase
      .from('project_requests')
      .select('current_members_count')
      .eq('id', project_request_id)
      .single();

    if (!projectRequest) {
      return NextResponse.json(
        { error: 'Project request not found' },
        { status: 404 }
      );
    }

    // Удаляем участника из команды
    const { error: deleteError } = await supabase
      .from('team_room_members')
      .delete()
      .eq('team_room_id', team_room_id)
      .eq('user_id', session.user.id);

    if (deleteError) {
      console.error('Error removing member:', deleteError);
      return NextResponse.json(
        { error: 'Failed to leave team' },
        { status: 500 }
      );
    }

    // Уменьшаем счетчик участников
    const newCount = Math.max(1, projectRequest.current_members_count - 1);

    const { error: updateError } = await supabase
      .from('project_requests')
      .update({
        current_members_count: newCount,
        status: 'open', // Возвращаем статус в 'open', если была 'full'
      })
      .eq('id', project_request_id);

    if (updateError) {
      console.error('Error updating project request:', updateError);
    }

    // Создаем системное сообщение о выходе
    await supabase.from('team_chat_messages').insert({
      team_room_id,
      user_id: session.user.id,
      content: `👋 ${member.profiles?.name || 'Участник'} покинул команду`,
      message_type: 'system',
    });

    return NextResponse.json({
      success: true,
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
