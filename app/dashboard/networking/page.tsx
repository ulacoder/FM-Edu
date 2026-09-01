'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import NetworkingClient from '@/components/matchmaking/networking-client';

export default function NetworkingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

      // Мгновенная загрузка из кэша
      const cachedData = localStorage.getItem('networking_cache');
      if (cachedData) {
        try {
          const cache = JSON.parse(cachedData);
          const cacheAge = Date.now() - cache.timestamp;

          if (cacheAge < 120000) { // 2 минуты
            setProfile(cache.profile);
            setProjectRequests(cache.projectRequests);
            setUserTeams(cache.userTeams);
            setIsLoading(false);
          }
        } catch (e) {
          console.error('Cache parse error:', e);
        }
      }

      // Загружаем свежие данные в фоне
      loadData(userData.id);
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/login');
    }
  }, []); // Убрал router из зависимостей - грузим ОДИН РАЗ

  const loadData = async (userId: string) => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Параллельная загрузка
      const [
        { data: profileData },
        { data: requests },
        { data: teams }
      ] = await Promise.all([
        supabase.from('profiles').select('id, name, avatar_url, personality_type, region').eq('id', userId).single(),
        supabase.from('project_requests').select('*, author:profiles!project_requests_author_id_fkey(id, name, avatar_url, personality_type)').eq('status', 'open').order('created_at', { ascending: false }).limit(20),
        supabase.from('team_room_members').select('team_room_id, role, team_rooms(id, name, description, project_request_id, project_requests(current_members_count, max_members))').eq('user_id', userId)
      ]);

      setProfile(profileData || null);
      setProjectRequests(requests || []);
      setUserTeams(teams || []);

      // Кэшируем
      localStorage.setItem('networking_cache', JSON.stringify({
        timestamp: Date.now(),
        profile: profileData || null,
        projectRequests: requests || [],
        userTeams: teams || [],
      }));
    } catch (error) {
      console.error('Error loading networking data:', error);
      setError('Не удалось загрузить данные. Проверьте подключение.');
    } finally {
      setIsLoading(false);
    }
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-500 text-5xl">⚠️</div>
          <h2 className="text-xl font-semibold">Ошибка подключения</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Обновить страницу
          </button>
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
