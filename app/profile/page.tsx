'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  User,
  Mail,
  School,
  Award,
  Edit,
  Save,
  X,
  Trophy,
  Target,
  BookOpen,
  MapPin
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Region, regionNames } from '@/types';

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
    localStorage.setItem('user', JSON.stringify(user));
    setIsEditing(false);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const stats = [
    { icon: Trophy, label: 'Баллы', value: '1,250' },
    { icon: Target, label: 'Задач решено', value: '127' },
    { icon: BookOpen, label: 'Тем изучено', value: '18' },
    { icon: Award, label: 'Достижений', value: '8' },
  ];

  const levelText: Record<string, string> = {
    beginner: 'Начальный',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
  };

  const displayLevel = levelText[user.level || 'beginner'] || 'Начальный';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <Link href="/" className="text-base sm:text-lg font-bold">
                FM Edu
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Link href="/dashboard/student">
                <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors">
                  Дашборд
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Профиль</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Управляйте информацией о себе</p>
          </div>

          {/* Profile Card */}
          <div className="bg-card border border-border/60 rounded-lg overflow-hidden mb-6 sm:mb-8">
            {/* Header with gradient */}
            <div className="h-24 sm:h-32 gradient-primary" />

            <div className="px-4 sm:px-8 pb-6 sm:pb-8">
              {/* Avatar and Edit Button */}
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start -mt-12 sm:-mt-16 mb-6 gap-4">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-card border-4 border-card rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-0 sm:mt-20 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Редактировать
                  </button>
                ) : (
                  <div className="mt-0 sm:mt-20 flex gap-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Save className="w-4 h-4" />
                      Сохранить
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2 text-sm"
                    >
                      <X className="w-4 h-4" />
                      Отмена
                    </button>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      Имя
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    ) : (
                      <p className="text-base sm:text-lg font-semibold">{user.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                      Email
                    </label>
                    <p className="text-base sm:text-lg break-all">{user.email}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Email нельзя изменить</p>
                  </div>

                  {/* Grade */}
                  <div>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                      <School className="w-3 h-3 sm:w-4 sm:h-4" />
                      Класс
                    </label>
                    {isEditing ? (
                      <select
                        value={user.grade}
                        onChange={(e) => setUser({ ...user, grade: parseInt(e.target.value) })}
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      >
                        {[7, 8, 9, 10, 11, 12].map(g => (
                          <option key={g} value={g}>{g} класс</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-base sm:text-lg font-semibold">{user.grade} класс</p>
                    )}
                  </div>

                  {/* Level */}
                  <div>
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                      <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                      Уровень
                    </label>
                    <p className="text-base sm:text-lg font-semibold">{displayLevel}</p>
                  </div>

                  {/* Region */}
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      Регион
                    </label>
                    {isEditing ? (
                      <select
                        value={user.region || 'astana'}
                        onChange={(e) => setUser({ ...user, region: e.target.value as Region })}
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      >
                        {Object.entries(regionNames).map(([key, name]) => (
                          <option key={key} value={key}>{name}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-base sm:text-lg font-semibold">
                        {user.region ? regionNames[user.region as Region] : 'Не указан'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-all">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2 sm:mb-3" />
                  <p className="text-xl sm:text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Account Actions */}
          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Действия с аккаунтом</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-left font-medium text-sm">
                Изменить пароль
              </button>
              <button className="w-full px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-left font-medium text-sm">
                Настройки уведомлений
              </button>
              <button className="w-full px-4 py-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors text-left font-medium text-sm">
                Удалить аккаунт
              </button>
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
