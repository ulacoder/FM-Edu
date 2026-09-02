'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Users, Plus, MessageSquare, Briefcase } from 'lucide-react';
import CreateProjectForm from '@/components/matchmaking/create-project-form';
import ProjectCard from '@/components/matchmaking/project-card';
import type { ProjectRequestWithAuthor } from '@/types/matchmaking';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NetworkingClientProps {
  profile: {
    id: string;
    name: string;
    avatar_url?: string;
    personality_type?: string;
    region?: string;
  } | null;
  projectRequests: ProjectRequestWithAuthor[];
  userTeams: any[];
  useMockData?: boolean;
}

export default function NetworkingClient({
  profile,
  projectRequests,
  userTeams,
  useMockData = false,
}: NetworkingClientProps) {
  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    if (useMockData) {
      // В режиме мока просто обновляем страницу
      window.location.reload();
    } else {
      router.refresh();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Заголовок */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold">Networking</h1>
            <p className="text-muted-foreground">
              Найди команду или создай свой проект
            </p>
          </div>

          <Button
            onClick={() => setShowCreateDialog(true)}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-5 w-5" />
            Найти команду
          </Button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Активные проекты</p>
                <p className="text-2xl font-bold">{projectRequests.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Мои команды</p>
                <p className="text-2xl font-bold">{userTeams.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Мой MBTI</p>
                <p className="text-2xl font-bold">
                  {profile?.personality_type || 'Не указан'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Вкладки */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="projects">
            <Briefcase className="h-4 w-4 mr-2" />
            Открытые проекты
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <MessageSquare className="h-4 w-4 mr-2" />
            Рекомендации
          </TabsTrigger>
          <TabsTrigger value="my-teams">
            <Users className="h-4 w-4 mr-2" />
            Мои команды ({userTeams.length})
          </TabsTrigger>
        </TabsList>

        {/* Открытые проекты */}
        <TabsContent value="projects" className="space-y-4">
          {projectRequests.length === 0 ? (
            <Card className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Нет активных проектов</h3>
              <p className="text-muted-foreground mb-4">
                Будь первым, кто создаст проект и соберёт команду!
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Создать проект
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {projectRequests.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  currentUserMBTI={profile?.personality_type}
                  currentUserSkills={[]} // TODO: добавить навыки из профиля
                  onJoinSuccess={() => useMockData ? window.location.reload() : router.refresh()}
                  useMockData={useMockData}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Персональные рекомендации */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card className="p-6 mb-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Персональные рекомендации для вас</h3>
                <p className="text-sm text-muted-foreground">
                  На основе вашего MBTI типа ({profile?.personality_type || 'INTJ'}), навыков и интересов мы подобрали проекты, которые могут вам подойти
                </p>
              </div>
            </div>
          </Card>

          {(() => {
            // Фильтруем проекты по совместимости
            const recommendedProjects = projectRequests
              .map(project => {
                let score = 0;
                let reasons: string[] = [];

                // MBTI совместимость (40 баллов)
                if (profile?.personality_type && project.author.personality_type) {
                  const userMBTI = profile.personality_type;
                  const authorMBTI = project.author.personality_type;
                  const matches = [0, 1, 2, 3].filter(i => userMBTI[i] === authorMBTI[i]).length;

                  if (matches >= 3) {
                    score += 40;
                    reasons.push(`🎯 MBTI совпадение ${matches}/4 букв`);
                  } else if (matches >= 2) {
                    score += 20;
                    reasons.push(`✨ MBTI совпадение ${matches}/4 букв`);
                  }
                }

                // Интерес к сфере (30 баллов)
                const userInterests = ['AI', 'Startups', 'Education Tech', 'Full-Stack'];
                const domainKeywords = project.domain.toLowerCase();
                if (userInterests.some(interest =>
                  domainKeywords.includes(interest.toLowerCase()) ||
                  project.title.toLowerCase().includes(interest.toLowerCase())
                )) {
                  score += 30;
                  reasons.push('💡 Совпадает с вашими интересами');
                }

                // Наличие свободных мест (20 баллов)
                const spotsLeft = project.max_members - project.current_members_count;
                if (spotsLeft > 0) {
                  score += 20;
                  reasons.push(`🎫 ${spotsLeft} ${spotsLeft === 1 ? 'место' : 'мест'} свободно`);
                }

                // Навыки, которые ищут (10 баллов)
                const userSkillsSet = ['Full-Stack', 'AI', 'Product Design', 'Python', 'React'];
                if (project.looking_for_skills.some(skill =>
                  userSkillsSet.some(userSkill =>
                    skill.toLowerCase().includes(userSkill.toLowerCase())
                  )
                )) {
                  score += 10;
                  reasons.push('🛠️ Ищут ваши навыки');
                }

                return { ...project, matchScore: score, matchReasons: reasons };
              })
              .filter(p => p.matchScore > 0)
              .sort((a, b) => b.matchScore - a.matchScore);

            if (recommendedProjects.length === 0) {
              return (
                <Card className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Пока нет персональных рекомендаций</h3>
                  <p className="text-muted-foreground mb-4">
                    Заполните свой профиль (MBTI, навыки, интересы) чтобы получать подходящие рекомендации проектов
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('projects')}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Смотреть все проекты
                  </Button>
                </Card>
              );
            }

            return (
              <div className="space-y-6">
                {recommendedProjects.map((project) => (
                  <Card key={project.id} className="p-4 border-2 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                            {project.matchScore}% совпадение
                          </Badge>
                          <Badge variant="outline">
                            {project.domain}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Причины рекомендации */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 mb-4">
                      <p className="text-xs font-semibold text-purple-900 dark:text-purple-200 mb-2">
                        Почему этот проект вам подходит:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.matchReasons.map((reason, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Автор проекта */}
                    <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
                      <Link href={`/dashboard/networking/profile/${project.author.id}`}>
                        <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                          <AvatarImage src={project.author.avatar_url} />
                          <AvatarFallback>
                            {project.author.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1">
                        <Link
                          href={`/dashboard/networking/profile/${project.author.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {project.author.name}
                        </Link>
                        {project.author.personality_type && (
                          <p className="text-xs text-muted-foreground">
                            MBTI: {project.author.personality_type}
                          </p>
                        )}
                      </div>
                      <Badge variant={project.status === 'open' ? 'default' : 'secondary'}>
                        {project.status === 'open' ? 'Открыто' : 'Закрыто'}
                      </Badge>
                    </div>

                    {/* Навыки */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {project.user_skills.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Навыки автора:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {project.user_skills.slice(0, 4).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {project.user_skills.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{project.user_skills.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      {project.looking_for_skills.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            Ищут:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {project.looking_for_skills.slice(0, 4).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {project.looking_for_skills.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{project.looking_for_skills.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Прогресс команды */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Участники</span>
                        </div>
                        <span className="font-bold text-green-500">
                          {project.current_members_count}/{project.max_members}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                          style={{ width: `${(project.current_members_count / project.max_members) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Кнопка действия */}
                    <Button
                      onClick={() => {
                        // Открываем детальную карточку проекта
                        setActiveTab('projects');
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      size="lg"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Присоединиться к проекту
                    </Button>
                  </Card>
                ))}
              </div>
            );
          })()}
        </TabsContent>

        {/* Мои команды */}
        <TabsContent value="my-teams" className="space-y-4">
          {userTeams.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">У вас пока нет команд</h3>
              <p className="text-muted-foreground mb-4">
                Присоединяйтесь к существующим проектам или создайте свой!
              </p>
              <Button
                variant="outline"
                onClick={() => setActiveTab('projects')}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Смотреть проекты
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {userTeams.map((team: any) => (
                <Link
                  key={team.team_room_id}
                  href={`/dashboard/networking/team/${team.team_room_id}`}
                >
                  <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {team.team_rooms?.name}
                        </h3>
                        {team.team_rooms?.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {team.team_rooms.description}
                          </p>
                        )}
                      </div>
                      {team.role === 'creator' && (
                        <Badge variant="secondary">Создатель</Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {team.team_rooms?.project_requests?.current_members_count}/
                          {team.team_rooms?.project_requests?.max_members}
                        </span>
                      </div>

                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Открыть чат
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Диалог создания проекта */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Создать проект / Найти команду</DialogTitle>
            <DialogDescription>
              Заполните форму, чтобы найти участников для своего проекта
            </DialogDescription>
          </DialogHeader>

          <CreateProjectForm
            userMBTI={profile?.personality_type}
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateDialog(false)}
            useMockData={useMockData}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
