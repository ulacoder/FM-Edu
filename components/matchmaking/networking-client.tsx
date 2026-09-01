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
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="projects">
            <Briefcase className="h-4 w-4 mr-2" />
            Открытые проекты
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
