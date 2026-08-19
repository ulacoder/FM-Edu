'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  TrendingUp,
  Calendar,
  Award,
  Target,
  Clock,
  BarChart3,
  CheckCircle2,
  Brain,
  Flame
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

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

  // Mock data - в реальности из API
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
    { name: 'Математика', progress: 85, level: 'Продвинутый', color: 'bg-blue-500' },
    { name: 'Физика', progress: 72, level: 'Средний', color: 'bg-purple-500' },
    { name: 'Информатика', progress: 90, level: 'Продвинутый', color: 'bg-green-500' },
    { name: 'Химия', progress: 65, level: 'Средний', color: 'bg-orange-500' },
    { name: 'Биология', progress: 78, level: 'Средний', color: 'bg-teal-500' },
    { name: 'Английский', progress: 82, level: 'Продвинутый', color: 'bg-pink-500' },
  ];

  const achievements = [
    {
      icon: '🔥',
      title: '7 дней подряд',
      description: 'Занимались неделю без пропусков',
      date: '19 авг',
      unlocked: true
    },
    {
      icon: '🎯',
      title: '100 задач',
      description: 'Решили первые 100 задач',
      date: '15 авг',
      unlocked: true
    },
    {
      icon: '⭐',
      title: 'Отличник',
      description: '10 тестов на 90%+',
      date: '12 авг',
      unlocked: true
    },
    {
      icon: '🏆',
      title: 'Марафонец',
      description: '30 дней подряд',
      date: 'Не открыто',
      unlocked: false
    },
  ];

  const maxHours = Math.max(...weeklyActivity.map(d => d.hours));

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 ml-16">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <Link href="/" className="text-lg font-bold text-gray-900">
                FM Edu
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <span className="text-sm font-medium text-gray-700">{userName}</span>
              <Link href="/dashboard/student">
                <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                  Дашборд
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Ваш прогресс</h1>
          <p className="text-gray-600">Отслеживайте свои достижения и динамику обучения</p>
        </div>

        {/* Weekly Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border-2 border-orange-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">7</p>
                <p className="text-xs text-gray-600">дней подряд</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-purple-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">19.5</p>
                <p className="text-xs text-gray-600">часов за неделю</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-green-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">70</p>
                <p className="text-xs text-gray-600">задач решено</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-blue-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">86%</p>
                <p className="text-xs text-gray-600">точность</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Активность за неделю</h2>
          </div>
          <div className="flex items-end justify-between gap-4 h-48">
            {weeklyActivity.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full flex flex-col items-center justify-end flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all hover:from-purple-700 hover:to-purple-500"
                    style={{ height: `${(day.hours / maxHours) * 100}%` }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">{day.hours}ч</p>
                  <p className="text-xs text-gray-500">{day.day}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Progress */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Прогресс по предметам</h2>
          </div>
          <div className="space-y-4">
            {subjectProgress.map((subject, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{subject.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{subject.level}</span>
                    <span className="text-sm font-bold text-purple-600">{subject.progress}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`${subject.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Достижения</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-xl border-2 transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-300 hover:border-purple-400'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="text-4xl mb-3 text-center">{achievement.icon}</div>
                <h3 className="font-bold text-sm text-gray-900 mb-1 text-center">
                  {achievement.title}
                </h3>
                <p className="text-xs text-gray-600 mb-2 text-center">
                  {achievement.description}
                </p>
                <p className="text-xs text-purple-600 font-medium text-center">
                  {achievement.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
