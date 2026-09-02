'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  Briefcase,
  Sparkles,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ProjectRequestWithAuthor } from '@/types/matchmaking';
import {
  formatMBTIMatchMode,
  checkMBTICompatibility,
  getMBTIMatchEmoji,
} from '@/lib/mbti-matcher';

interface ProjectCardProps {
  project: ProjectRequestWithAuthor;
  currentUserMBTI?: string;
  currentUserSkills?: string[];
  onJoinSuccess?: () => void;
  useMockData?: boolean;
}

export default function ProjectCard({
  project,
  currentUserMBTI,
  currentUserSkills = [],
  onJoinSuccess,
  useMockData = false,
}: ProjectCardProps) {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isUserMember, setIsUserMember] = useState(false);
  const [compatibilityResult, setCompatibilityResult] = useState<{
    isMatch: boolean;
    matchScore: number;
    message?: string;
  } | null>(null);

  // Проверяем состояние участия при загрузке
  useEffect(() => {
    if (useMockData) {
      const { isUserInTeam } = require('@/lib/mock-networking-data');
      setIsUserMember(isUserInTeam(project.id));
    }
  }, [project.id, useMockData]);

  // Проверка совместимости MBTI
  // Для хакатона - всегда считаем совместимым
  const compatibility = { isMatch: true, matchScore: 4, message: "Совместимость 100% для демо" };

  const isFull = project.current_members_count >= project.max_members;
  const isAuthor = false; // Это нужно получить из session

  const handleJoinClick = () => {
    // Для хакатона - сразу запускаем вступление
    handleJoin();
  };

  const handleJoin = async (force = false) => {
    setIsJoining(true);
    setShowConfirmDialog(false);

    try {
      if (useMockData) {
        // Mock режим - симулируем вступление
        const { joinMockTeam } = await import('@/lib/mock-networking-data');

        await new Promise(resolve => setTimeout(resolve, 800)); // Имитация загрузки

        const success = joinMockTeam(project.id);

        if (!success) {
          throw new Error('Команда заполнена или вы уже в ней');
        }

        setIsUserMember(true);
        setShowSuccessDialog(true);
        toast.success('✅ Вы вступили в команду! (демо режим)');

        if (onJoinSuccess) {
          onJoinSuccess();
        }

        return;
      }

      const response = await fetch('/api/matchmaking/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_request_id: project.id,
          user_mbti: currentUserMBTI,
          user_skills: currentUserSkills,
          force_join: force,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Если требуется подтверждение
        if (data.requiresConfirmation && !force) {
          setCompatibilityResult({
            isMatch: false,
            matchScore: data.matchScore,
            message: data.message,
          });
          setShowConfirmDialog(true);
          return;
        }

        throw new Error(data.error || 'Не удалось вступить в команду');
      }

      setIsUserMember(true);
      setShowSuccessDialog(true);
      toast.success('Вы успешно присоединились к команде!');

      // Переходим в командный чат
      if (data.teamRoomId) {
        router.push(`/dashboard/networking/team/${data.teamRoomId}`);
      }

      if (onJoinSuccess) {
        onJoinSuccess();
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Error joining team:', error);
      toast.error(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
      setIsJoining(false);
    }
  };

  const memberProgress = `${project.current_members_count}/${project.max_members}`;
  const progressPercentage =
    (project.current_members_count / project.max_members) * 100;

  return (
    <>
      <Card className="p-4 space-y-4 hover:shadow-lg transition-shadow">
        {/* Заголовок с автором */}
        <div className="flex items-start gap-3">
          <Link href={`/dashboard/networking/profile/${project.author.id}`}>
            <Avatar className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
              <AvatarImage src={project.author.avatar_url} />
              <AvatarFallback>
                {project.author.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg leading-tight">
                {project.title}
              </h3>
              {project.author.personality_type && (
                <Badge variant="outline" className="text-xs">
                  {project.author.personality_type}
                </Badge>
              )}
            </div>
            <Link
              href={`/dashboard/networking/profile/${project.author?.id || 'demo-user'}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {project.author?.name || 'Неизвестный автор'}
            </Link>
          </div>

          <Badge
            variant={project.status === 'open' ? 'default' : 'secondary'}
            className="shrink-0"
          >
            {project.status === 'open' ? 'Открыто' : 'Закрыто'}
          </Badge>
        </div>

        {/* Сфера */}
        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="font-medium">{project.domain}</span>
        </div>

        {/* Описание */}
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Навыки автора */}
        {project.user_skills.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Навыки автора:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.user_skills.slice(0, 5).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {project.user_skills.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.user_skills.length - 5}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Кого ищут */}
        {project.looking_for_skills.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Ищут:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.looking_for_skills.slice(0, 5).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {project.looking_for_skills.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{project.looking_for_skills.length - 5}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* MBTI фильтр */}
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
          <Sparkles className="h-4 w-4 text-purple-500 shrink-0" />
          <span className="text-xs font-medium">
            {formatMBTIMatchMode(
              project.mbti_match_mode,
              project.target_mbti_filter
            )}
          </span>
          {currentUserMBTI && (
            <span className="ml-auto text-xs">
              {getMBTIMatchEmoji(compatibility.matchScore)} {compatibility.matchScore}/4
            </span>
          )}
        </div>

        {/* Прогресс заполнения команды */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Участники</span>
            </div>
            <span
              className={`font-bold ${
                isFull ? 'text-orange-500' : 'text-green-500'
              }`}
            >
              {memberProgress}
            </span>
          </div>

          {/* Прогресс-бар */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isFull ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Кнопка вступления */}
        {!isAuthor && (
          <Button
            onClick={isUserMember ? () => router.push(`/dashboard/networking/team/${project.id}`) : handleJoinClick}
            disabled={isJoining || (isFull && !isUserMember) || (project.status !== 'open' && !isUserMember)}
            className={`w-full ${isUserMember ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
            size="lg"
          >
            {isJoining ? (
              'Вступление...'
            ) : isUserMember ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Вы участвуете - Перейти в чат
              </>
            ) : isFull ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Команда заполнена
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-5 w-5" />
                Принять участие
              </>
            )}
          </Button>
        )}

        {/* Предупреждение о несовместимости */}
        {!compatibility.isMatch && compatibility.matchScore < 2 && (
          <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-md">
            <AlertCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
            <p className="text-xs text-orange-700 dark:text-orange-400">
              {compatibility.message}
            </p>
          </div>
        )}
      </Card>

      {/* Диалог подтверждения */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтвердите вступление</DialogTitle>
            <DialogDescription>
              {compatibilityResult?.message}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Ваш MBTI тип не полностью совпадает с предпочтениями команды, но вы
              можете всё равно отправить заявку. Автор команды увидит ваш запрос.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Отмена
            </Button>
            <Button onClick={() => handleJoin(true)} disabled={isJoining}>
              {isJoining ? 'Отправка...' : 'Всё равно вступить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог успешного вступления */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-center text-2xl">Поздравляем! 🎉</DialogTitle>
            <DialogDescription className="text-center">
              Вы успешно вступили в команду проекта
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4 text-center">
              <h3 className="font-bold text-lg mb-1">{project.title}</h3>
              <p className="text-sm text-muted-foreground">
                Автор: {project.author.name}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Участников в команде:</span>
                <span className="font-semibold">{project.current_members_count}/{project.max_members}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ваш статус:</span>
                <Badge variant="secondary">Участник</Badge>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 Теперь вы можете перейти в командный чат и начать общение с участниками проекта!
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false);
                if (onJoinSuccess) onJoinSuccess();
              }}
              className="w-full sm:w-auto"
            >
              Остаться на странице
            </Button>
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                router.push(`/dashboard/networking/team/${project.id}`);
              }}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Перейти в чат
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
