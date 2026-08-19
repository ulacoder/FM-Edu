'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  Bookmark,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Clock,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  const stats = {
    saved: 8,
    enrolled: 3,
    points: 1250,
    rank: user.rank || 42
  };

  const recentActivity = [
    { subject: 'Математика', topic: 'Квадратные уравнения', progress: 85, date: '18.08' },
    { subject: 'Физика', topic: 'Законы Ньютона', progress: 72, date: '17.08' },
    { subject: 'Информатика', topic: 'Алгоритмы', progress: 90, date: '16.08' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 ml-16">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <Link href="/" className="text-lg font-bold">
                FM Edu
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/profile">
                <button className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                  Профиль
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Привет, {user.name}! 👋
            </h1>
            <p className="text-muted-foreground">
              {user.grade} класс • {user.email}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Bookmark className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">{stats.saved}</span>
              </div>
              <p className="text-sm text-muted-foreground">Сохранено тем</p>
            </div>

            <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">{stats.enrolled}</span>
              </div>
              <p className="text-sm text-muted-foreground">Активных курсов</p>
            </div>

            <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">{stats.points}</span>
              </div>
              <p className="text-sm text-muted-foreground">Баллов</p>
            </div>

            <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">#{stats.rank}</span>
              </div>
              <p className="text-sm text-muted-foreground">Место в рейтинге</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Activity */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Недавняя активность</h2>
                  <Link href="/courses">
                    <button className="text-sm text-primary hover:underline">
                      Все предметы
                    </button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className="bg-card border border-border/60 rounded-lg p-4 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{activity.topic}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                              {activity.subject}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.date}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-primary">
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
                <h2 className="text-xl font-bold mb-4">Начать обучение</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/diagnostic">
                    <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors cursor-pointer">
                      <Target className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-2">Диагностика</h3>
                      <p className="text-sm text-muted-foreground">
                        Определи свой уровень знаний
                      </p>
                    </div>
                  </Link>

                  <Link href="/courses">
                    <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors cursor-pointer">
                      <BookOpen className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-2">Предметы</h3>
                      <p className="text-sm text-muted-foreground">
                        Изучай темы по NIS Programme
                      </p>
                    </div>
                  </Link>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Recommendations */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">Рекомендации</h2>
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
                <h2 className="text-xl font-bold mb-4">Быстрые действия</h2>
                <div className="space-y-2">
                  <Link href="/diagnostic">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-card border border-border/60 hover:border-primary/40 rounded-lg transition-colors text-left">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Пройти диагностику</span>
                    </button>
                  </Link>
                  <Link href="/courses">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-card border border-border/60 hover:border-primary/40 rounded-lg transition-colors text-left">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Все предметы</span>
                    </button>
                  </Link>
                  <Link href="/progress">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-card border border-border/60 hover:border-primary/40 rounded-lg transition-colors text-left">
                      <TrendingUp className="w-4 h-4 text-primary" />
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
