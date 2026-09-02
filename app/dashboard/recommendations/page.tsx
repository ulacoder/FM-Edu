'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sparkles,
  Users,
  Plus,
  Briefcase,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Zap,
  ArrowRight,
  Brain,
} from 'lucide-react';
import Link from 'next/link';
import { getMockData } from '@/lib/mock-networking-data';

interface Recommendation {
  id: string;
  type: 'project' | 'course' | 'skill' | 'opportunity';
  title: string;
  description: string;
  matchScore: number;
  reasons: string[];
  icon: any;
  action: {
    label: string;
    href: string;
  };
  metadata?: any;
}

export default function RecommendationsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    loadRecommendations();
  }, []);

  const loadRecommendations = () => {
    try {
      const mockData = getMockData();
      setProfile(mockData.profile);

      // Генерируем персонализированные рекомендации
      const allRecommendations: Recommendation[] = [];

      // 1. Рекомендации проектов (из networking)
      mockData.projectRequests.forEach(project => {
        let score = 0;
        let reasons: string[] = [];

        // MBTI совместимость
        if (mockData.profile.personality_type && project.author.personality_type) {
          const userMBTI = mockData.profile.personality_type;
          const authorMBTI = project.author.personality_type;
          const matches = [0, 1, 2, 3].filter(i => userMBTI[i] === authorMBTI[i]).length;

          if (matches >= 3) {
            score += 40;
            reasons.push(`MBTI совпадение ${matches}/4 букв`);
          } else if (matches >= 2) {
            score += 20;
            reasons.push(`MBTI совпадение ${matches}/4 букв`);
          }
        }

        // Интересы
        const userInterests = mockData.profile.interests || [];
        const domainLower = project.domain.toLowerCase();
        if (userInterests.some((interest: string) =>
          domainLower.includes(interest.toLowerCase()) ||
          project.title.toLowerCase().includes(interest.toLowerCase())
        )) {
          score += 30;
          reasons.push('Совпадает с вашими интересами');
        }

        // Свободные места
        const spotsLeft = project.max_members - project.current_members_count;
        if (spotsLeft > 0) {
          score += 20;
          reasons.push(`${spotsLeft} ${spotsLeft === 1 ? 'место' : 'мест'} свободно`);
        }

        // Навыки
        if (project.looking_for_skills.some((skill: string) =>
          mockData.profile.skills.some((userSkill: string) =>
            skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        )) {
          score += 10;
          reasons.push('Ищут ваши навыки');
        }

        if (score > 30) {
          allRecommendations.push({
            id: `project-${project.id}`,
            type: 'project',
            title: project.title,
            description: project.description || `Проект в сфере ${project.domain}`,
            matchScore: score,
            reasons,
            icon: Users,
            action: {
              label: 'Присоединиться',
              href: '/dashboard/networking'
            },
            metadata: project
          });
        }
      });

      // 2. Рекомендации курсов (основано на навыках и интересах)
      const courseRecommendations: Recommendation[] = [
        {
          id: 'course-1',
          type: 'course',
          title: 'Продвинутое машинное обучение',
          description: 'Углубленный курс по ML и нейронным сетям для опытных разработчиков',
          matchScore: 85,
          reasons: [
            'Соответствует вашим навыкам: AI, Python',
            'Продолжение изученных тем',
            'Подходит для вашего уровня (Platinum)'
          ],
          icon: Brain,
          action: {
            label: 'Начать курс',
            href: '/courses?subject=informatics'
          }
        },
        {
          id: 'course-2',
          type: 'course',
          title: 'Стартап менеджмент',
          description: 'Как создать и масштабировать EdTech стартап от идеи до инвестиций',
          matchScore: 75,
          reasons: [
            'Совпадает с интересами: Startups, Education Tech',
            'Полезно для FM Edu проекта',
            'Развитие Product Design навыков'
          ],
          icon: Target,
          action: {
            label: 'Начать курс',
            href: '/courses?subject=business'
          }
        },
        {
          id: 'course-3',
          type: 'course',
          title: 'Advanced React & Next.js',
          description: 'Профессиональная разработка на React с использованием Next.js 15',
          matchScore: 70,
          reasons: [
            'Усиление навыка Full-Stack',
            'Актуально для FM Edu',
            'Следующий шаг после основ'
          ],
          icon: Lightning,
          action: {
            label: 'Начать курс',
            href: '/courses?subject=informatics'
          }
        }
      ];

      allRecommendations.push(...courseRecommendations);

      // 3. Рекомендации навыков для развития
      const skillRecommendations: Recommendation[] = [
        {
          id: 'skill-1',
          type: 'skill',
          title: 'TypeScript для больших проектов',
          description: 'Освойте продвинутые паттерны TypeScript для масштабируемых приложений',
          matchScore: 80,
          reasons: [
            'Дополнит Full-Stack навыки',
            'Востребовано в индустрии',
            'Повысит качество кода FM Edu'
          ],
          icon: Award,
          action: {
            label: 'Изучить',
            href: '/courses?subject=informatics'
          }
        },
        {
          id: 'skill-2',
          type: 'skill',
          title: 'UI/UX дизайн систем',
          description: 'Создание консистентных дизайн-систем для продуктов',
          matchScore: 65,
          reasons: [
            'Улучшит Product Design',
            'Полезно для стартапов',
            'Новый навык для портфолио'
          ],
          icon: Sparkles,
          action: {
            label: 'Изучить',
            href: '/courses?subject=design'
          }
        }
      ];

      allRecommendations.push(...skillRecommendations);

      // 4. Возможности (олимпиады, хакатоны, стажировки)
      const opportunityRecommendations: Recommendation[] = [
        {
          id: 'opp-1',
          type: 'opportunity',
          title: 'Google Summer of Code 2027',
          description: 'Летняя стажировка в open-source проектах Google с оплатой',
          matchScore: 90,
          reasons: [
            'Идеально для Full-Stack разработчиков',
            'Platinum ранг - высокие шансы',
            '152 дня streak показывает мотивацию'
          ],
          icon: TrendingUp,
          action: {
            label: 'Узнать больше',
            href: '/opportunities'
          }
        },
        {
          id: 'opp-2',
          type: 'opportunity',
          title: 'Y Combinator Startup School',
          description: 'Бесплатный онлайн-курс от YC о создании стартапов',
          matchScore: 85,
          reasons: [
            'Интерес к стартапам',
            'FM Edu - активный проект',
            'Подготовка к будущему запуску'
          ],
          icon: Briefcase,
          action: {
            label: 'Зарегистрироваться',
            href: '/opportunities'
          }
        }
      ];

      allRecommendations.push(...opportunityRecommendations);

      // Сортируем по релевантности
      allRecommendations.sort((a, b) => b.matchScore - a.matchScore);

      setRecommendations(allRecommendations);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setIsLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project': return 'Проект';
      case 'course': return 'Курс';
      case 'skill': return 'Навык';
      case 'opportunity': return 'Возможность';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'course': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'skill': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'opportunity': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Загрузка рекомендаций...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Заголовок */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Персонализированные рекомендации</h1>
            <p className="text-muted-foreground">
              Подобрано специально для вас на основе AI анализа
            </p>
          </div>
        </div>
      </div>

      {/* Профиль пользователя - краткая сводка */}
      {profile && (
        <Card className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-4 border-white dark:border-gray-800">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                {profile.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{profile.name}</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.personality_type && (
                  <Badge variant="outline">MBTI: {profile.personality_type}</Badge>
                )}
                {profile.stats?.rank && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    {profile.stats.rank}
                  </Badge>
                )}
                {profile.stats?.streak && (
                  <Badge variant="secondary">
                    🔥 {profile.stats.streak} дней streak
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.slice(0, 5).map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Проекты</p>
              <p className="text-2xl font-bold">
                {recommendations.filter(r => r.type === 'project').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Курсы</p>
              <p className="text-2xl font-bold">
                {recommendations.filter(r => r.type === 'course').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Навыки</p>
              <p className="text-2xl font-bold">
                {recommendations.filter(r => r.type === 'skill').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Возможности</p>
              <p className="text-2xl font-bold">
                {recommendations.filter(r => r.type === 'opportunity').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Рекомендации */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <Card
              key={rec.id}
              className="p-6 hover:shadow-xl transition-all border-2 hover:border-purple-300 dark:hover:border-purple-700"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                  <Icon className="h-6 w-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(rec.type)}>
                          {getTypeLabel(rec.type)}
                        </Badge>
                        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                          {rec.matchScore}% совпадение
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {rec.description}
                      </p>
                    </div>
                  </div>

                  {/* Причины рекомендации */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-4">
                    <p className="text-xs font-semibold text-purple-900 dark:text-purple-200 mb-2">
                      Почему это вам подходит:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {rec.reasons.map((reason, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Действие */}
                  <Link href={rec.action.href}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      {rec.action.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
