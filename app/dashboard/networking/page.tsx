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

      // Загружаем кэшированные данные мгновенно
      const cachedData = localStorage.getItem('networking_cache');
      if (cachedData) {
        try {
          const cache = JSON.parse(cachedData);
          const cacheAge = Date.now() - cache.timestamp;

          // Используем кэш если ему меньше 2 минут
          if (cacheAge < 120000) {
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
  }, [router]);

  const loadData = async (userId: string, retryCount = 0) => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Параллельно загружаем все данные
      const [
        { data: profileData, error: profileError },
        { data: requests, error: requestsError },
        { data: teams, error: teamsError }
      ] = await Promise.all([
        // Получаем профиль пользователя
        supabase
          .from('profiles')
          .select('id, name, avatar_url, personality_type, region')
          .eq('id', userId)
          .single(),

        // Получаем активные заявки на поиск команды
        supabase
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
          .limit(20),

        // Получаем команды пользователя
        supabase
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
          .eq('user_id', userId)
      ]);

      // Проверяем критические ошибки
      if (profileError && profileError.code !== 'PGRST116') {
        throw new Error(`Ошибка загрузки профиля: ${profileError.message}`);
      }
      if (requestsError) console.error('Requests load error:', requestsError);
      if (teamsError) console.error('Teams load error:', teamsError);

      setProfile(profileData || null);
      setProjectRequests(requests || []);
      setUserTeams(teams || []);

      // Кэшируем данные
      try {
        localStorage.setItem('networking_cache', JSON.stringify({
          timestamp: Date.now(),
          profile: profileData || null,
          projectRequests: requests || [],
          userTeams: teams || [],
        }));
      } catch (e) {
        console.error('Cache save error:', e);
      }
    } catch (error) {
      console.error('Error loading networking data:', error);

      // Retry логика при ошибках подключения
      if (retryCount < 2) {
        console.log(`Retrying... (attempt ${retryCount + 1}/2)`);
        setTimeout(() => loadData(userId, retryCount + 1), 1000 * (retryCount + 1));
        return;
      }

      // Показываем ошибку пользователю после всех попыток
      setError('Не удалось загрузить данные. Проверьте подключение к интернету.');
      setProfile(null);
      setProjectRequests([]);
      setUserTeams([]);
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
            onClick={() => {
              const userStr = localStorage.getItem('user');
              if (userStr) {
                const userData = JSON.parse(userStr);
                loadData(userData.id);
              }
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Повторить попытку
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
