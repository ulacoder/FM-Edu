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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              EduAI.kz
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-gray-700">Личный кабинет</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{student?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Приветствие */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Привет, {student?.name}! 👋
          </h1>
          <p className="text-gray-600">
            {student?.grade} класс • Уровень: {levelText}
          </p>
        </div>

        {/* Кнопка диагностики */}
        {!student?.level && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">
              Пройдите диагностику
            </h3>
            <p className="text-blue-700 mb-4">
              Пройдите короткий тест, чтобы мы могли подобрать материалы под ваш уровень
            </p>
            <Link
              href="/diagnostic"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Начать диагностику
            </Link>
          </div>
        )}

        {/* Цели */}
        {student?.goals && student.goals.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ваши цели</h2>
            <div className="flex flex-wrap gap-2">
              {student.goals.map((goal, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {goal}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Рекомендации */}
        {recommendations && recommendations.topics.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Рекомендованные темы
                </h2>
                <p className="text-gray-600 text-sm">
                  {recommendations.reasoning}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {recommendations.topics.map((topic, index) => (
                <div
                  key={topic.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {topic.description}
                      </p>
                      <div className="flex gap-2 text-xs text-gray-500">
                        <span>Класс {topic.grade}</span>
                        <span>•</span>
                        <span>Четверть {topic.quarter}</span>
                      </div>
                    </div>
                    <Link
                      href={`/learn/${topic.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Изучить
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Быстрые действия */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/diagnostic"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Пройти диагностику
            </h3>
            <p className="text-sm text-gray-600">
              Определите свой уровень знаний
            </p>
          </Link>

          <Link
            href="/practice"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">✍️</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Практика
            </h3>
            <p className="text-sm text-gray-600">
              Решайте задачи и тесты
            </p>
          </Link>

          <Link
            href="/progress"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">📈</div>
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
  );
}
