'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Bell,
  Globe,
  Volume2,
  Lock,
  Shield,
  Database,
  Smartphone,
  Save,
  RefreshCw
} from 'lucide-react';

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
    <div className="min-h-screen flex flex-col"><div className="flex-1 bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Настройки</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Управляйте параметрами вашего аккаунта</p>
          </div>

          {/* Save/Reset Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-4 sm:px-6 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saveStatus === 'saving' ? 'Сохранение...' : saveStatus === 'saved' ? 'Сохранено!' : 'Сохранить'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 sm:px-6 py-2 text-sm bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Сбросить</span>
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <h2 className="text-lg sm:text-xl font-bold">Уведомления</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {Object.entries({
                email: 'Email уведомления',
                push: 'Push уведомления',
                weeklyReport: 'Еженедельный отчет',
                achievements: 'Достижения',
                reminders: 'Напоминания о занятиях',
              }).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between p-3 sm:p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors touch-manipulation">
                  <span className="font-medium text-sm sm:text-base">{label}</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications[key as keyof typeof settings.notifications]}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, [key]: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary/50"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-card border border-border/60 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Предпочтения</h2>
            </div>
            <div className="space-y-4">
              {/* Language */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <label className="block font-medium mb-2">Язык интерфейса</label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, language: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="ru">Русский</option>
                  <option value="kk">Қазақша</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Theme */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <label className="block font-medium mb-2">Тема оформления</label>
                <select
                  value={settings.preferences.theme}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, theme: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="light">Светлая</option>
                  <option value="dark">Темная</option>
                  <option value="system">Системная</option>
                </select>
              </div>

              {/* Sound Effects */}
              <label className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Звуковые эффекты</span>
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
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary/50"
                />
              </label>

              {/* Auto Save */}
              <label className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Автосохранение прогресса</span>
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
                  className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary/50"
                />
              </label>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-card border border-border/60 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Приватность</h2>
            </div>
            <div className="space-y-4">
              {Object.entries({
                profileVisible: 'Публичный профиль',
                showProgress: 'Показывать прогресс',
                allowAnalytics: 'Разрешить аналитику',
              }).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <span className="font-medium">{label}</span>
                  <input
                    type="checkbox"
                    checked={settings.privacy[key as keyof typeof settings.privacy]}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, [key]: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary/50"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-card border border-border/60 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Безопасность</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-left font-medium flex items-center gap-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                Изменить пароль
              </button>
              <button className="w-full px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-left font-medium flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                Двухфакторная аутентификация
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
