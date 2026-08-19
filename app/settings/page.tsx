'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Bell,
  Moon,
  Sun,
  Globe,
  Volume2,
  Lock,
  Shield,
  Database,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  Save,
  RefreshCw
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function SettingsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      weeklyReport: true,
      achievements: true,
      reminders: true,
    },
    preferences: {
      language: 'ru',
      theme: 'system',
      soundEffects: true,
      autoSave: true,
    },
    privacy: {
      profileVisible: true,
      showProgress: true,
      allowAnalytics: true,
    },
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

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

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  }, [router]);

  const handleSave = () => {
    setSaveStatus('saving');
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleReset = () => {
    if (confirm('Сбросить все настройки до значений по умолчанию?')) {
      setSettings({
        notifications: {
          email: true,
          push: true,
          weeklyReport: true,
          achievements: true,
          reminders: true,
        },
        preferences: {
          language: 'ru',
          theme: 'system',
          soundEffects: true,
          autoSave: true,
        },
        privacy: {
          profileVisible: true,
          showProgress: true,
          allowAnalytics: true,
        },
      });
      localStorage.removeItem('userSettings');
    }
  };

  if (!isAuthenticated || !user) {
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
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
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
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Настройки</h1>
          <p className="text-gray-600">Управляйте параметрами вашего аккаунта</p>
        </div>

        {/* Save/Reset Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saveStatus === 'saving' ? 'Сохранение...' : saveStatus === 'saved' ? 'Сохранено!' : 'Сохранить'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Сбросить
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Уведомления</h2>
          </div>
          <div className="space-y-4">
            {Object.entries({
              email: 'Email уведомления',
              push: 'Push уведомления',
              weeklyReport: 'Еженедельный отчет',
              achievements: 'Достижения',
              reminders: 'Напоминания о занятиях',
            }).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="font-medium text-gray-900">{label}</span>
                <input
                  type="checkbox"
                  checked={settings.notifications[key as keyof typeof settings.notifications]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, [key]: e.target.checked },
                    })
                  }
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Предпочтения</h2>
          </div>
          <div className="space-y-4">
            {/* Language */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block font-medium text-gray-900 mb-2">Язык интерфейса</label>
              <select
                value={settings.preferences.language}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, language: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              >
                <option value="ru">Русский</option>
                <option value="kk">Қазақша</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Theme */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block font-medium text-gray-900 mb-2">Тема оформления</label>
              <select
                value={settings.preferences.theme}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, theme: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              >
                <option value="light">Светлая</option>
                <option value="dark">Темная</option>
                <option value="system">Системная</option>
              </select>
            </div>

            {/* Sound Effects */}
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Звуковые эффекты</span>
              </div>
              <input
                type="checkbox"
                checked={settings.preferences.soundEffects}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, soundEffects: e.target.checked },
                  })
                }
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
            </label>

            {/* Auto Save */}
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Автосохранение прогресса</span>
              </div>
              <input
                type="checkbox"
                checked={settings.preferences.autoSave}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, autoSave: e.target.checked },
                  })
                }
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
            </label>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Приватность</h2>
          </div>
          <div className="space-y-4">
            {Object.entries({
              profileVisible: 'Публичный профиль',
              showProgress: 'Показывать прогресс',
              allowAnalytics: 'Разрешить аналитику',
            }).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <span className="font-medium text-gray-900">{label}</span>
                <input
                  type="checkbox"
                  checked={settings.privacy[key as keyof typeof settings.privacy]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, [key]: e.target.checked },
                    })
                  }
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Безопасность</h2>
          </div>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors text-left font-medium flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-600" />
              Изменить пароль
            </button>
            <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors text-left font-medium flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-600" />
              Двухфакторная аутентификация
            </button>
            <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors text-left font-medium flex items-center gap-3">
              <Eye className="w-5 h-5 text-gray-600" />
              Активные сеансы
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
