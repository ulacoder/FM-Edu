'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  User,
  Mail,
  School,
  Calendar,
  Award,
  Edit,
  Save,
  X,
  Trophy,
  Target,
  BookOpen
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ProfilePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    setIsAuthenticated(true);
    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }, [router]);

  const handleSave = () => {
    // В реальности здесь будет API запрос
    localStorage.setItem('user', JSON.stringify(user));
    setIsEditing(false);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const stats = [
    { icon: Trophy, label: 'Баллы', value: '1,250', color: 'bg-purple-100 text-purple-600' },
    { icon: Target, label: 'Задач решено', value: '127', color: 'bg-blue-100 text-blue-600' },
    { icon: BookOpen, label: 'Тем изучено', value: '18', color: 'bg-green-100 text-green-600' },
    { icon: Award, label: 'Достижений', value: '8', color: 'bg-orange-100 text-orange-600' },
  ];

  const levelText: Record<string, string> = {
    beginner: 'Начальный',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
  };

  const displayLevel = levelText[user.level || 'beginner'] || 'Начальный';

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
              <Link href="/dashboard/student">
                <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                  Дашборд
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Профиль</h1>
          <p className="text-gray-600">Управляйте информацией о себе</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden mb-8">
          {/* Header with gradient */}
          <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600" />

          <div className="px-8 pb-8">
            {/* Avatar and Edit Button */}
            <div className="flex justify-between items-start -mt-16 mb-6">
              <div className="w-32 h-32 bg-white border-4 border-white rounded-full flex items-center justify-center shadow-lg">
                <User className="w-16 h-16 text-purple-600" />
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-20 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Редактировать
                </button>
              ) : (
                <div className="mt-20 flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Сохранить
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Отмена
                  </button>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Имя
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <p className="text-lg text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Email нельзя изменить</p>
                </div>

                {/* Grade */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <School className="w-4 h-4" />
                    Класс
                  </label>
                  {isEditing ? (
                    <select
                      value={user.grade}
                      onChange={(e) => setUser({ ...user, grade: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                    >
                      {[7, 8, 9, 10, 11, 12].map(g => (
                        <option key={g} value={g}>{g} класс</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">{user.grade} класс</p>
                  )}
                </div>

                {/* Level */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Award className="w-4 h-4" />
                    Уровень
                  </label>
                  <p className="text-lg font-semibold text-gray-900">{displayLevel}</p>
                </div>

                {/* Registration Date */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    Дата регистрации
                  </label>
                  <p className="text-lg text-gray-900">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm hover:border-purple-300 transition-all">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Действия с аккаунтом</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors text-left font-medium">
              Изменить пароль
            </button>
            <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors text-left font-medium">
              Настройки уведомлений
            </button>
            <button className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-left font-medium">
              Удалить аккаунт
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
