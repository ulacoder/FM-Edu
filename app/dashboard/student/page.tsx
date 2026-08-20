'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Student, Topic } from '@/types';
import Link from 'next/link';
import {
  TrendingUp,
  Target,
  Clock,
  Award,
  Flame,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Trophy
} from 'lucide-react';

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [recommendations, setRecommendations] = useState<{
    topics: Topic[];
    reasoning: string;
    level?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock stats - в реальности будут из API
  const stats = {
    streak: 7,
    totalPoints: 1250,
    studyTimeHours: 24,
    completedTopics: 12,
    totalTopics: 48,
    progressPercentage: 25
  };

  const activityData = [
    { day: 'Пн', active: true },
    { day: 'Вт', active: true },
    { day: 'Ср', active: false },
    { day: 'Чт', active: true },
    { day: 'Пт', active: true },
    { day: 'Сб', active: true },
    { day: 'Вс', active: true },
  ];

  const achievements = [
    { icon: '🔥', title: 'Неделя подряд', description: '7 дней активности' },
    { icon: '🎯', title: 'Первые 100', description: '100 задач решено' },
    { icon: '⭐', title: 'Отличник', description: '10 тестов на 90%+' },
  ];

  const recentActivity = [
    { subject: 'Математика', topic: 'Квадратные уравнения', score: 95, date: '18.08' },
    { subject: 'Физика', topic: 'Законы Ньютона', score: 88, date: '17.08' },
    { subject: 'Информатика', topic: 'Алгоритмы', score: 92, date: '16.08' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'student') {
      router.push('/dashboard/teacher');
      return;
    }

    loadData(token);
  }, []);

  const loadData = async (token: string) => {
    try {
      const profileRes = await fetch('/api/student/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileData = await profileRes.json();
      setStudent(profileData);

      const recsRes = await fetch('/api/student/recommendations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const recsData = await recsRes.json();
      setRecommendations(recsData);

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-xl text-gray-900">Загрузка...</div>
      </div>
    );
  }

  const levelText = {
    beginner: 'Начальный',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
  }[student?.level || 'beginner'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">
              Привет, {student?.name}! 👋
            </h1>
            <p className="text-gray-600">{student?.grade} класс • Уровень: {levelText}</p>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-3 border-2 border-green-400 shadow-sm">
            <Trophy className="w-6 h-6 text-green-600" />
            <span className="text-3xl font-bold text-green-600">{stats.totalPoints}</span>
          </div>
        </div>

        {/* Stats Grid - Top 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Subjects - Purple */}
          <div className="bg-white rounded-xl p-6 border-2 border-purple-300 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">6</p>
            <p className="text-sm text-gray-600 font-medium">My courses</p>
            <p className="text-xs text-gray-500 mt-2">{stats.completedTopics}/{stats.totalTopics} lessons completed</p>
          </div>

          {/* Study Time - Yellow */}
          <div className="bg-white rounded-xl p-6 border-2 border-yellow-300 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-1">22h</p>
            <p className="text-sm text-gray-600 font-medium">Study time</p>
            <p className="text-xs text-gray-500 mt-2">1317 minutes total</p>
          </div>

          {/* Progress - Green with circular chart */}
          <div className="bg-white rounded-xl p-6 border-2 border-green-300 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-1">58.7%</p>
                <p className="text-sm text-gray-600 font-medium">Progress Overview</p>
                <p className="text-xs text-gray-500 mt-2">236/402 steps completed</p>
              </div>
              <div className="relative w-24 h-24">
                <svg className="transform -rotate-90 w-24 h-24">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - 58.7 / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">58.7%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - 4 Small Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Streak */}
          <div className="bg-white rounded-xl p-6 border-2 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.streak}</p>
                <p className="text-xs text-gray-600">дней подряд</p>
              </div>
            </div>
          </div>

          {/* Points */}
          <div className="bg-white rounded-xl p-6 border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPoints}</p>
                <p className="text-xs text-gray-600">баллов</p>
              </div>
            </div>
          </div>

          {/* Study Time */}
          <div className="bg-white rounded-xl p-6 border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.studyTimeHours}ч</p>
                <p className="text-xs text-gray-600">обучения</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-xl p-6 border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completedTopics}/{stats.totalTopics}</p>
                <p className="text-xs text-gray-600">тем</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Общий прогресс</h3>
            <span className="text-sm font-medium text-purple-600">{stats.progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${stats.progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Activity Calendar */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Активность за неделю
            </h3>
            <div className="flex justify-between gap-2">
              {activityData.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-lg ${day.active ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <span className="text-xs text-gray-600">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm lg:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Достижения
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {achievements.map((achievement, idx) => (
                <div key={idx} className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <p className="font-semibold text-sm text-gray-900">{achievement.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Недавняя активность</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.topic}</p>
                    <p className="text-sm text-gray-600">{activity.subject}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{activity.score}%</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Card */}
        <Link href="/leaderboard" className="block mb-8 hover:opacity-90 transition-opacity">
          <div className="bg-white rounded-xl p-6 border-2 border-yellow-300 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="w-7 h-7 text-yellow-600" />
                Leaderboard
              </h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">
                  My Group
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">
                  All Students
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">YOUR RANK</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-gray-900">#454</span>
                  <span className="text-lg text-gray-600 font-semibold flex items-center gap-1">
                    GRINDING 💪
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">RANK</p>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  454 / 1185
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Next Level</span>
                <span className="text-sm font-semibold text-blue-600">2 points needed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: '85%' }}
                />
              </div>
            </div>
          </div>
        </Link>

        {/* Recommendations */}
        {recommendations && recommendations.topics.length > 0 && (
          <div className="bg-white rounded-xl p-6 border-2 border-purple-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-600" />
              Рекомендованные темы
            </h2>
            <p className="text-sm text-gray-600 mb-6">{recommendations.reasoning}</p>

            <div className="space-y-3">
              {recommendations.topics.slice(0, 5).map((topic, index) => (
                <div
                  key={topic.id}
                  className="border-2 border-gray-200 rounded-lg p-5 hover:border-purple-400 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{topic.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{topic.description}</p>
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span>Класс {topic.grade}</span>
                        <span>•</span>
                        <span>Четверть {topic.quarter}</span>
                      </div>
                    </div>
                    <Link
                      href={`/learn/${topic.id}`}
                      className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 whitespace-nowrap transition-colors"
                    >
                      Изучить
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
