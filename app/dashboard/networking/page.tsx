// Страница Networking с интегрированным Matchmaking

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import NetworkingClient from '@/components/matchmaking/networking-client';

export const metadata = {
  title: 'Networking | FM Edu',
  description: 'Региональный чат и поиск команды',
};

export default async function NetworkingPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Получаем профиль пользователя
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, name, avatar_url, personality_type, region')
    .eq('id', session.user.id)
    .single();

  // Получаем активные заявки на поиск команды
  const { data: projectRequests } = await supabase
    .from('project_requests')
    .select(`
      *,
      author:profiles!project_requests_author_id_fkey(
        id,
        name,
        avatar_url,
        personality_type
      )
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(20);

  // Получаем команды пользователя
  const { data: userTeams } = await supabase
    .from('team_room_members')
    .select(`
      team_room_id,
      role,
      team_rooms(
        id,
        name,
        description,
        project_request_id,
        project_requests(
          current_members_count,
          max_members
        )
      )
    `)
    .eq('user_id', session.user.id);

  return (
    <NetworkingClient
      profile={profile || null}
      projectRequests={projectRequests || []}
      userTeams={userTeams || []}
    />
  );
}
