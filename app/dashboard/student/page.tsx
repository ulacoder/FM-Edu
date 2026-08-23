'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bookmark,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Clock,
  Zap,
  CheckCircle2,
  Brain
} from 'lucide-react';
import { CountdownTimer } from '@/components/countdown-timer';
import { getTranslation, type Locale } from '@/lib/i18n';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState<Locale>('ru');

  const t = (key: keyof typeof import('@/lib/i18n').translations.ru) => getTranslation(locale, key);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role !== 'student') {
        router.push('/dashboard/teacher');
        return;
      }
      setUser(userData);

      // Загружаем актуальные баллы
      loadUserPoints(userData.id);
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/login');
    }

    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['ru', 'kk', 'en'].includes(savedLocale)) {
      setLocale(savedLocale);
    }

    const handleLocaleChange = (e: CustomEvent<Locale>) => {
      setLocale(e.detail);
    };

    window.addEventListener('localeChange', handleLocaleChange as EventListener);
    setLoading(false);

    return () => window.removeEventListener('localeChange', handleLocaleChange as EventListener);
  }, [router]);

  const loadUserPoints = async (studentId: string) => {
    try {
      const response = await fetch(`/api/student/points?studentId=${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setUser((prev: any) => ({
          ...prev,
          totalPoints: data.totalPoints,
          gameStats: data.gameStats
        }));
      }
    } catch (error) {
      console.error('Error loading points:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">{t('loading')}</div>
      </div>
    );
  }

  const stats = {
    saved: 8,
    enrolled: 3,
    points: user.totalPoints || 0,
    rank: user.rank || 42
  };

  const recentActivity = [
    { subject: 'Математика', topic: 'Квадратные уравнения', progress: 85, date: '18.08' },
    { subject: 'Физика', topic: 'Законы Ньютона', progress: 72, date: '17.08' },
    { subject: 'Информатика', topic: 'Алгоритмы', progress: 90, date: '16.08' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-1 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Welcome Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Привет, {user.name}! 👋
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {user.grade} класс • {user.email}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xl sm:text-2xl font-bold">{stats.saved}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Сохранено</p>
            </div>

            <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xl sm:text-2xl font-bold">{stats.enrolled}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Активных</p>
            </div>

            <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xl sm:text-2xl font-bold">{stats.points}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Баллов</p>
            </div>

            <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xl sm:text-2xl font-bold">#{stats.rank}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Рейтинг</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Recent Activity */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-bold">Недавняя активность</h2>
                  <Link href="/courses">
                    <button className="text-xs sm:text-sm text-primary hover:underline">
                      Все предметы
                    </button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className="bg-card border border-border/60 rounded-lg p-3 sm:p-4 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1 text-sm sm:text-base truncate">{activity.topic}</h3>
                          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground flex-wrap">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                              {activity.subject}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.date}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-primary ml-2">
                          {activity.progress}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${activity.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Start */}
              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4">Начать обучение</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Link href="/diagnostic">
                    <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors cursor-pointer min-h-[120px]">
                      <Target className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2 sm:mb-3" />
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">Диагностика</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Определи свой уровень знаний
                      </p>
                    </div>
                  </Link>

                  <Link href="/courses">
                    <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors cursor-pointer min-h-[120px]">
                      <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2 sm:mb-3" />
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">Предметы</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Изучай темы по NIS Programme
                      </p>
                    </div>
                  </Link>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 sm:space-y-8">
              {/* Countdown Timer */}
              <CountdownTimer studentId={user.id} />

              {/* Recommendations */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <h2 className="text-lg sm:text-xl font-bold">Рекомендации</h2>
                </div>
                <div className="space-y-3">
                  <div className="bg-card border border-border/60 rounded-lg p-4 hover:border-primary/40 transition-colors">
                    <h3 className="font-semibold text-sm mb-2">Тригонометрия</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Подходит твоему уровню знаний
                    </p>
                    <Link href="/learn/1">
                      <button className="w-full px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded text-sm font-medium transition-colors">
                        Начать изучение
                      </button>
                    </Link>
                  </div>
                </div>
              </section>

              {/* Quick Actions */}
              <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4">Быстрые действия</h2>
                <div className="space-y-2">
                  <Link href="/mbti-profile">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-card border border-border/60 hover:border-primary/40 rounded-lg transition-colors text-left">
                      <Brain className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">MBTI профиль</span>
                    </button>
                  </Link>
                  <Link href="/diagnostic">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-card border border-border/60 hover:border-primary/40 rounded-lg transition-colors text-left">
                      <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">Пройти диагностику</span>
                    </button>
                  </Link>
                  <Link href="/courses">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-card border border-border/60 hover:border-primary/40 rounded-lg transition-colors text-left">
                      <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">Все предметы</span>
                    </button>
                  </Link>
                  <Link href="/progress">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-card border border-border/60 hover:border-primary/40 rounded-lg transition-colors text-left">
                      <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">Мой прогресс</span>
                    </button>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2026 FM Edu. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
