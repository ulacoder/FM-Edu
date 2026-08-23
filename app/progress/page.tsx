'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  TrendingUp,
  Award,
  Target,
  Clock,
  BarChart3,
  CheckCircle2,
  Flame
} from 'lucide-react';

export default function ProgressPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    setIsAuthenticated(true);
    try {
      const user = JSON.parse(userStr);
      setUserName(user.name || '');
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }, [router]);

  // Mock data
  const weeklyActivity = [
    { day: 'Пн', hours: 2.5, completed: 8 },
    { day: 'Вт', hours: 3.0, completed: 12 },
    { day: 'Ср', hours: 1.5, completed: 5 },
    { day: 'Чт', hours: 4.0, completed: 15 },
    { day: 'Пт', hours: 2.0, completed: 7 },
    { day: 'Сб', hours: 3.5, completed: 14 },
    { day: 'Вс', hours: 2.5, completed: 9 },
  ];

  const subjectProgress = [
    { name: 'Математика', progress: 85, level: 'Продвинутый' },
    { name: 'Физика', progress: 72, level: 'Средний' },
    { name: 'Информатика', progress: 90, level: 'Продвинутый' },
    { name: 'Химия', progress: 65, level: 'Средний' },
    { name: 'Биология', progress: 78, level: 'Средний' },
    { name: 'Английский', progress: 82, level: 'Продвинутый' },
  ];

  const achievements = [
    {
      icon: '🔥',
      title: '7 дней подряд',
      description: 'Занимались неделю без пропусков',
      unlocked: true
    },
    {
      icon: '🎯',
      title: '100 задач',
      description: 'Решили первые 100 задач',
      unlocked: true
    },
    {
      icon: '⭐',
      title: 'Отличник',
      description: '10 тестов на 90%+',
      unlocked: true
    },
    {
      icon: '🏆',
      title: 'Марафонец',
      description: '30 дней подряд',
      unlocked: false
    },
  ];

  const maxHours = Math.max(...weeklyActivity.map(d => d.hours));

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col"><div className="flex-1 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Ваш прогресс</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Отслеживайте свои достижения и динамику обучения</p>
          </div>

          {/* Weekly Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xl sm:text-2xl font-bold">7</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">дней подряд</p>
            </div>

            <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xl sm:text-2xl font-bold">19.5</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">часов</p>
            </div>

            <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xl sm:text-2xl font-bold">70</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">задач</p>
            </div>

            <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xl sm:text-2xl font-bold">86%</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">точность</p>
            </div>
          </div>

          {/* Weekly Activity Chart */}
          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-bold">Активность за неделю</h2>
            </div>
            <div className="flex items-end justify-between gap-2 sm:gap-4 h-32 sm:h-48">
              {weeklyActivity.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 sm:gap-3">
                  <div className="w-full flex flex-col items-center justify-end flex-1">
                    <div
                      className="w-full bg-primary/80 hover:bg-primary rounded-t-lg transition-all"
                      style={{ height: `${(day.hours / maxHours) * 100}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-semibold">{day.hours}ч</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{day.day}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Progress */}
          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-bold">Прогресс по предметам</h2>
            </div>
            <div className="space-y-4">
              {subjectProgress.map((subject, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm sm:text-base">{subject.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground">{subject.level}</span>
                      <span className="text-xs sm:text-sm font-bold text-primary">{subject.progress}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-bold">Достижения</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {achievements.map((achievement, idx) => (
                <div
                  key={idx}
                  className={`p-4 sm:p-6 rounded-lg border transition-all ${
                    achievement.unlocked
                      ? 'bg-primary/5 border-primary/30 hover:border-primary/50'
                      : 'bg-muted/20 border-border/60 opacity-60'
                  }`}
                >
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 text-center">{achievement.icon}</div>
                  <h3 className="font-bold text-xs sm:text-sm mb-1 text-center">
                    {achievement.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2026 FM Edu. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
