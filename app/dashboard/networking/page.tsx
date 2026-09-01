'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import NetworkingClient from '@/components/matchmaking/networking-client';
import { getMockData } from '@/lib/mock-networking-data';

export default function NetworkingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [projectRequests, setProjectRequests] = useState<any[]>([]);
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);

      // Проверяем настройку использования мок-данных
      const shouldUseMock = localStorage.getItem('use_mock_networking') === 'true';

      if (shouldUseMock) {
        // Используем мок-данные сразу
        const mockData = getMockData();
        setProfile(mockData.profile);
        setProjectRequests(mockData.projectRequests);
        setUserTeams(mockData.userTeams);
        setUseMockData(true);
        setIsLoading(false);
        return;
      }

      // Мгновенная загрузка из кэша
      const cachedData = localStorage.getItem('networking_cache');
      if (cachedData) {
        try {
          const cache = JSON.parse(cachedData);
          const cacheAge = Date.now() - cache.timestamp;

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
  }, []);

  const loadData = async (userId: string) => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Параллельная загрузка
      const [
        { data: profileData, error: profileError },
        { data: requests, error: requestsError },
        { data: teams, error: teamsError }
      ] = await Promise.all([
        supabase.from('profiles').select('id, name, avatar_url, personality_type, region').eq('id', userId).single(),
        supabase.from('project_requests').select('*, author:profiles!project_requests_author_id_fkey(id, name, avatar_url, personality_type)').eq('status', 'open').order('created_at', { ascending: false }).limit(20),
        supabase.from('team_room_members').select('team_room_id, role, team_rooms(id, name, description, project_request_id, project_requests(current_members_count, max_members))').eq('user_id', userId)
      ]);

      // Если таблицы не существуют, переключаемся на мок-данные
      if (profileError?.code === 'PGRST116' || requestsError?.code === '42P01' || profileError?.code === '42P01') {
        console.log('Supabase tables not found, using mock data');
        localStorage.setItem('use_mock_networking', 'true');
        const mockData = getMockData();
        setProfile(mockData.profile);
        setProjectRequests(mockData.projectRequests);
        setUserTeams(mockData.userTeams);
        setUseMockData(true);
        setIsLoading(false);
        return;
      }

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

      // Fallback на мок-данные при ошибке
      console.log('Error connecting to Supabase, using mock data');
      localStorage.setItem('use_mock_networking', 'true');
      const mockData = getMockData();
      setProfile(mockData.profile);
      setProjectRequests(mockData.projectRequests);
      setUserTeams(mockData.userTeams);
      setUseMockData(true);
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

  return (
    <>
      {useMockData && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2 text-center">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            📝 Режим демонстрации: используются тестовые данные.
            <button
              onClick={() => {
                localStorage.removeItem('use_mock_networking');
                window.location.reload();
              }}
              className="ml-2 underline hover:no-underline"
            >
              Попробовать подключиться к базе
            </button>
          </p>
        </div>
      )}
      <NetworkingClient
        profile={profile}
        projectRequests={projectRequests}
        userTeams={userTeams}
        useMockData={useMockData}
      />
    </>
  );
}
