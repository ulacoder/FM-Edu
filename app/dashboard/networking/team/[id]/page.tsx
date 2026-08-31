'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import TeamChat from '@/components/matchmaking/team-chat';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TeamChatPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUserId(userData.id);
      checkMembership(userData.id, params.id);
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/login');
    }
  }, [router, params.id]);

  const checkMembership = async (userId: string, teamRoomId: string) => {
    setIsLoading(true);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Проверяем, является ли пользователь участником этой команды
    const { data: membership, error } = await supabase
      .from('team_room_members')
      .select('id')
      .eq('team_room_id', teamRoomId)
      .eq('user_id', userId)
      .single();

    if (error || !membership) {
      router.push('/dashboard/networking');
      return;
    }

    setHasAccess(true);
    setIsLoading(false);
  };

  if (isLoading || !userId || !hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Загрузка чата...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Навигация */}
      <div className="mb-6">
        <Link href="/dashboard/networking">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к нетворкингу
          </Button>
        </Link>
      </div>

      {/* Командный чат */}
      <TeamChat teamRoomId={params.id} currentUserId={userId} />
    </div>
  );
}
