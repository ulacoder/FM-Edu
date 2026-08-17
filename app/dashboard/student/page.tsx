'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Student, Topic } from '@/types';
import Link from 'next/link';

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [recommendations, setRecommendations] = useState<{
    topics: Topic[];
    reasoning: string;
    level?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

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
      // Загрузка профиля
      const profileRes = await fetch('/api/student/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileData = await profileRes.json();
      setStudent(profileData);

      // Загрузка рекомендаций
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  const levelText = {
    beginner: 'Начальный',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
  }[student?.level || 'beginner'];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold tracking-tight text-gray-900">
            FM Edu
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-700">{student?.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Добро пожаловать, {student?.name}
          </h1>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>{student?.grade} класс</span>
            <span>•</span>
            <span>Уровень: {levelText}</span>
          </div>
        </div>

        {/* Diagnostic CTA */}
        {!student?.level && (
          <div className="mb-12 p-6 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              Пройдите диагностику
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Короткий тест для определения вашего уровня и подбора материалов
            </p>
            <Link
              href="/diagnostic"
              className="inline-block px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
            >
              Начать диагностику
            </Link>
          </div>
        )}

        {/* Goals */}
        {student?.goals && student.goals.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ваши цели</h2>
            <div className="flex flex-wrap gap-2">
              {student.goals.map((goal, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-100 text-gray-900 rounded-md text-sm"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.topics.length > 0 && (
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Рекомендованные темы
              </h2>
              <p className="text-sm text-gray-600">
                {recommendations.reasoning}
              </p>
            </div>

            <div className="space-y-3">
              {recommendations.topics.map((topic, index) => (
                <div
                  key={topic.id}
                  className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {topic.description}
                      </p>
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span>Класс {topic.grade}</span>
                        <span>•</span>
                        <span>Четверть {topic.quarter}</span>
                      </div>
                    </div>
                    <Link
                      href={`/learn/${topic.id}`}
                      className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 whitespace-nowrap"
                    >
                      Изучить
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/diagnostic"
              className="p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Диагностика
              </h3>
              <p className="text-sm text-gray-600">
                Определите свой уровень знаний
              </p>
            </Link>

            <Link
              href="/practice"
              className="p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Практика
              </h3>
              <p className="text-sm text-gray-600">
                Решайте задачи и тесты
              </p>
            </Link>

            <Link
              href="/progress"
              className="p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Прогресс
              </h3>
              <p className="text-sm text-gray-600">
                Отслеживайте свои достижения
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
