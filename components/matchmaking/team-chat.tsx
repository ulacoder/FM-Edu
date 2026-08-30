'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send,
  Users,
  LogOut,
  Sparkles,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type {
  TeamRoom,
  TeamChatMessageWithUser,
  TeamRoomMemberWithUser,
} from '@/types/matchmaking';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TeamChatProps {
  teamRoomId: string;
  currentUserId: string;
}

export default function TeamChat({ teamRoomId, currentUserId }: TeamChatProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [teamRoom, setTeamRoom] = useState<TeamRoom | null>(null);
  const [members, setMembers] = useState<TeamRoomMemberWithUser[]>([]);
  const [messages, setMessages] = useState<TeamChatMessageWithUser[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentMember = members.find((m) => m.user_id === currentUserId);
  const isCreator = currentMember?.role === 'creator';

  // Загрузка данных
  useEffect(() => {
    loadTeamData();
    loadMembers();
    loadMessages();

    // Подписка на новые сообщения
    const messagesSubscription = supabase
      .channel(`team_chat_${teamRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_chat_messages',
          filter: `team_room_id=eq.${teamRoomId}`,
        },
        (payload) => {
          loadMessages();
        }
      )
      .subscribe();

    // Подписка на изменения участников
    const membersSubscription = supabase
      .channel(`team_members_${teamRoomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_room_members',
          filter: `team_room_id=eq.${teamRoomId}`,
        },
        () => {
          loadMembers();
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
      membersSubscription.unsubscribe();
    };
  }, [teamRoomId]);

  // Автоскролл при новых сообщениях
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadTeamData = async () => {
    const { data, error } = await supabase
      .from('team_rooms')
      .select('*')
      .eq('id', teamRoomId)
      .single();

    if (error) {
      console.error('Error loading team room:', error);
      toast.error('Не удалось загрузить команду');
    } else {
      setTeamRoom(data);
    }
  };

  const loadMembers = async () => {
    const { data, error } = await supabase
      .from('team_room_members')
      .select(`
        *,
        user:profiles(id, name, avatar_url)
      `)
      .eq('team_room_id', teamRoomId)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('Error loading members:', error);
    } else {
      setMembers(data as any);
    }
  };

  const loadMessages = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('team_chat_messages')
      .select(`
        *,
        user:profiles(id, name, avatar_url)
      `)
      .eq('team_room_id', teamRoomId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      console.error('Error loading messages:', error);
      toast.error('Не удалось загрузить сообщения');
    } else {
      setMessages(data as any);
    }

    setIsLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || isSending) return;

    setIsSending(true);

    try {
      const { error } = await supabase.from('team_chat_messages').insert({
        team_room_id: teamRoomId,
        user_id: currentUserId,
        content: newMessage.trim(),
        message_type: 'user',
      });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Не удалось отправить сообщение');
    } finally {
      setIsSending(false);
    }
  };

  const handleLeaveTeam = async () => {
    setIsLeaving(true);

    try {
      const response = await fetch('/api/matchmaking/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_room_id: teamRoomId,
          project_request_id: teamRoom?.project_request_id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Не удалось покинуть команду');
      }

      toast.success('Вы покинули команду');
      router.push('/dashboard/networking');
      router.refresh();
    } catch (error) {
      console.error('Error leaving team:', error);
      toast.error(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
      setIsLeaving(false);
      setShowLeaveDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Загрузка чата...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Заголовок */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate">{teamRoom?.name}</h2>
            {teamRoom?.description && (
              <p className="text-sm text-muted-foreground truncate">
                {teamRoom.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">{members.length}</span>
            </div>

            {!isCreator && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLeaveDialog(true)}
                disabled={isLeaving}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Покинуть
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
        {/* Чат */}
        <Card className="lg:col-span-3 flex flex-col">
          {/* Сообщения */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => {
                const isSystem = message.message_type === 'system';
                const isOwn = message.user_id === currentUserId;

                if (isSystem) {
                  return (
                    <div
                      key={message.id}
                      className="flex justify-center py-2"
                    >
                      <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-xs text-muted-foreground">
                        <Sparkles className="h-3 w-3" />
                        {message.content}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={message.user.avatar_url} />
                      <AvatarFallback>
                        {message.user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`flex flex-col gap-1 max-w-[70%] ${
                        isOwn ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs">
                        {!isOwn && (
                          <span className="font-medium">{message.user.name}</span>
                        )}
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(message.created_at), {
                            addSuffix: true,
                            locale: ru,
                          })}
                        </span>
                      </div>

                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Форма отправки */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Напишите сообщение..."
                disabled={isSending}
                className="flex-1"
                maxLength={1000}
              />
              <Button type="submit" disabled={isSending || !newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Card>

        {/* Список участников */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Участники ({members.length})
          </h3>

          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-start gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={member.user.avatar_url} />
                  <AvatarFallback>
                    {member.user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm truncate">
                      {member.user.name}
                    </p>
                    {member.role === 'creator' && (
                      <Badge variant="secondary" className="text-xs">
                        Создатель
                      </Badge>
                    )}
                  </div>

                  {member.user_mbti && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {member.user_mbti}
                    </Badge>
                  )}

                  {member.user_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {member.user_skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Диалог подтверждения выхода */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Покинуть команду?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите покинуть эту команду? Вы можете вернуться
              позже, если в команде останутся свободные места.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveTeam} disabled={isLeaving}>
              {isLeaving ? 'Выход...' : 'Покинуть'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
