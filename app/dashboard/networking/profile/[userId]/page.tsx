'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ArrowLeft,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  TrendingUp,
  Linkedin,
  Globe,
  Users,
  BookOpen,
  Flame,
  Trophy,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  avatar_url?: string;
  personality_type?: string;
  region?: string;
  grade?: number;
  gpa?: number;
  skills: string[];
  interests: string[];
  bio?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  behance?: string;
  achievements?: Array<{ title: string; icon: string; date: string }>;
  projects?: Array<{ name: string; status: string; members: number }>;
  stats?: {
    totalPoints: number;
    completedCourses: number;
    streak: number;
    rank: string;
  };
}

const RANK_COLORS = {
  'Platinum': 'from-cyan-400 to-blue-500',
  'Gold': 'from-yellow-400 to-orange-500',
  'Silver': 'from-gray-300 to-gray-400',
  'Bronze': 'from-orange-700 to-orange-800'
};

export default function StudentProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setIsLoading(true);

    try {
      // Проверяем режим мок-данных
      const shouldUseMock = localStorage.getItem('use_mock_networking') === 'true';

      if (shouldUseMock) {
        // Загружаем из mock-данных
        const { getMockProfile } = await import('@/lib/mock-networking-data');
        const mockProfile = getMockProfile(userId);

        if (mockProfile) {
          setProfile(mockProfile);
          setUseMockData(true);
        }
      } else {
        // TODO: Реальный API запрос к Supabase
        // const response = await fetch(`/api/profiles/${userId}`);
        // const data = await response.json();
        // setProfile(data);

        // Fallback на mock если API недоступен
        const { getMockProfile } = await import('@/lib/mock-networking-data');
        const mockProfile = getMockProfile(userId);
        if (mockProfile) {
          setProfile(mockProfile);
          setUseMockData(true);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Профиль не найден</h2>
          <p className="text-muted-foreground mb-4">Пользователь не существует или данные недоступны</p>
          <Button onClick={() => router.push('/dashboard/networking')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к Networking
          </Button>
        </Card>
      </div>
    );
  }

  const rankColor = RANK_COLORS[profile.stats?.rank as keyof typeof RANK_COLORS] || 'from-gray-400 to-gray-500';

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Banner */}
      {useMockData && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2 text-center">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            📝 Режим демонстрации: отображаются тестовые данные профиля
          </p>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/networking')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к Networking
        </Button>

        {/* Header Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-6 flex-wrap">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-4 border-primary">
              <AvatarFallback className="text-3xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    {profile.region && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {profile.region}
                      </div>
                    )}
                    {profile.grade && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <GraduationCap className="w-4 h-4" />
                        {profile.grade} класс
                      </div>
                    )}
                    {profile.personality_type && (
                      <Badge variant="secondary" className="text-sm">
                        {profile.personality_type}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Rank Badge */}
                {profile.stats?.rank && (
                  <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${rankColor} text-white font-bold shadow-lg`}>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      {profile.stats.rank}
                    </div>
                  </div>
                )}
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-muted-foreground mb-4 max-w-3xl">
                  {profile.bio}
                </p>
              )}

              {/* Social Links */}
              <div className="flex items-center gap-3 flex-wrap">
                {profile.linkedin && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                )}
                {profile.github && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      GitHub
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                )}
                {profile.instagram && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Instagram
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                )}
                {profile.behance && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`https://behance.net/${profile.behance}`} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Behance
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                )}
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Написать сообщение
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats */}
          <div className="space-y-6">
            {/* Stats Card */}
            {profile.stats && (
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Статистика
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="w-4 h-4" />
                      Баллы
                    </div>
                    <span className="font-bold text-lg">{profile.stats.totalPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      Курсов завершено
                    </div>
                    <span className="font-bold text-lg">{profile.stats.completedCourses}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Flame className="w-4 h-4 text-orange-500" />
                      Streak
                    </div>
                    <span className="font-bold text-lg text-orange-500">{profile.stats.streak} дней</span>
                  </div>
                  {profile.gpa && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="w-4 h-4" />
                        GPA
                      </div>
                      <span className="font-bold text-lg">{profile.gpa.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Skills */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Навыки
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Interests */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Интересы
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <Badge key={interest} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Achievements & Projects */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements */}
            {profile.achievements && profile.achievements.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Достижения
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(achievement.date).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Projects */}
            {profile.projects && profile.projects.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Проекты
                </h3>
                <div className="space-y-3">
                  {profile.projects.map((project, index) => (
                    <div
                      key={index}
                      className="p-4 bg-muted/50 rounded-lg border border-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{project.name}</h4>
                        <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                          {project.status === 'completed' ? 'Завершён' : 'В процессе'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{project.members} {project.members === 1 ? 'участник' : 'участника'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Empty State */}
            {(!profile.projects || profile.projects.length === 0) && (
              <Card className="p-12 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Проекты не найдены</h3>
                <p className="text-sm text-muted-foreground">
                  У этого пользователя пока нет активных проектов
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
