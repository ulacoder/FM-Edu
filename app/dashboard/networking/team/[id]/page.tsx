// Страница командного чата

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import TeamChat from '@/components/matchmaking/team-chat';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function TeamChatPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Проверяем, является ли пользователь участником этой команды
  const { data: membership, error } = await supabase
    .from('team_room_members')
    .select('id')
    .eq('team_room_id', params.id)
    .eq('user_id', session.user.id)
    .single();

  if (error || !membership) {
    redirect('/dashboard/networking');
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Навигация */}
      <div className="mb-6">
        <Link href="/dashboard/networking">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к чату
          </Button>
        </Link>
      </div>

      {/* Командный чат */}
      <TeamChat teamRoomId={params.id} currentUserId={session.user.id} />
    </div>
  );
}
