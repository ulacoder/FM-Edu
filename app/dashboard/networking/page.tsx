'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import NetworkingClient from '@/components/matchmaking/networking-client';

export default function NetworkingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [projectRequests, setProjectRequests] = useState<any[]>([]);
  const [userTeams, setUserTeams] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      loadData(userData.id);
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/login');
    }
  }, [router]);

  const loadData = async (userId: string) => {
    setIsLoading(true);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Получаем профиль пользователя
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, personality_type, region')
      .eq('id', userId)
      .single();

    // Получаем активные заявки на поиск команды
    const { data: requests } = await supabase
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
    const { data: teams } = await supabase
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
      .eq('user_id', userId);

    setProfile(profileData || null);
    setProjectRequests(requests || []);
    setUserTeams(teams || []);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <NetworkingClient
      profile={profile}
      projectRequests={projectRequests}
      userTeams={userTeams}
    />
  );
}
