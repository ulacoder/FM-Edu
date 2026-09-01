'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const [compatibilityResult, setCompatibilityResult] = useState<{
    isMatch: boolean;
    matchScore: number;
    message?: string;
  } | null>(null);

  // Проверка совместимости MBTI
  const compatibility = checkMBTICompatibility(
    currentUserMBTI,
    project.target_mbti_filter,
    project.mbti_match_mode
  );

  const isFull = project.current_members_count >= project.max_members;
  const isAuthor = false; // Это нужно получить из session

  const handleJoinClick = () => {
    // Если MBTI не совпадает, но близко (2+ совпадения), показываем диалог подтверждения
    if (!compatibility.isMatch && compatibility.matchScore >= 2) {
      setCompatibilityResult(compatibility);
      setShowConfirmDialog(true);
    } else if (!compatibility.isMatch) {
      toast.error(compatibility.message || 'Несовместимость по MBTI');
    } else {
      handleJoin();
    }
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

        toast.success('✅ Вы вступили в команду! (демо режим)');

        // Переходим в командный чат (mock)
        router.push(`/dashboard/networking/team/${project.id}`);

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
          <Avatar className="h-12 w-12">
            <AvatarImage src={project.author.avatar_url} />
            <AvatarFallback>
              {project.author.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

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
            <p className="text-sm text-muted-foreground">
              {project.author.name}
            </p>
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
            onClick={handleJoinClick}
            disabled={isJoining || isFull || project.status !== 'open'}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {isJoining ? (
              'Вступление...'
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
    </>
  );
}
