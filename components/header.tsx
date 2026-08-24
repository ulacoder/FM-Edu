'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Timer } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { getTranslation, type Locale } from '@/lib/i18n';

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);
  const [locale, setLocale] = useState<Locale>('ru');
  const router = useRouter();

  const handleOpenPomodoroTimer = () => {
    window.dispatchEvent(new CustomEvent('openPomodoroTimer'));
  };

  const t = (key: keyof typeof import('@/lib/i18n').translations.ru) => getTranslation(locale, key);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        setIsAuthenticated(true);
        try {
          const user = JSON.parse(userStr);
          setUserName(user.name || '');
          setUserRole(user.role || null);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      } else {
        setIsAuthenticated(false);
        setUserName('');
        setUserRole(null);
      }
    };

    // Check auth on mount
    checkAuth();

    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['ru', 'kk', 'en'].includes(savedLocale)) {
      setLocale(savedLocale);
    }

    // Listen for locale changes
    const handleLocaleChange = (e: CustomEvent<Locale>) => {
      setLocale(e.detail);
    };

    // Listen for auth changes (login/logout)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('localeChange', handleLocaleChange as EventListener);
    window.addEventListener('authChange', handleAuthChange as EventListener);

    return () => {
      window.removeEventListener('localeChange', handleLocaleChange as EventListener);
      window.removeEventListener('authChange', handleAuthChange as EventListener);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserName('');
    setUserRole(null);

    // Уведомляем Header об изменении
    window.dispatchEvent(new Event('authChange'));

    router.push('/');
  };

  const getDashboardLink = () => {
    if (userRole === 'teacher') return '/dashboard/teacher';
    return '/dashboard/student';
  };

  return (
    <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 sm:h-16">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 gradient-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
            </div>
            <Link href="/" className="text-sm sm:text-lg font-bold">
              FM Edu
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Pomodoro Timer Button - только на мобиле */}
            <button
              onClick={handleOpenPomodoroTimer}
              className="md:hidden p-1.5 hover:bg-muted rounded-lg transition-colors"
              title="Pomodoro Timer"
            >
              <Timer className="w-4 h-4 text-purple-600" />
            </button>

            <LanguageSwitcher />
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <span className="text-xs sm:text-sm font-medium hidden md:inline">{userName}</span>
                <Link href={getDashboardLink()}>
                  <button className="px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.98] rounded-lg transition-all">
                    {t('dashboard')}
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:text-primary transition-colors hidden sm:inline-block"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline-block">
                  <button className="px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium hover:text-primary transition-colors">
                    {t('login')}
                  </button>
                </Link>
                <Link href="/register">
                  <button className="px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.98] rounded-lg transition-all">
                    {t('start')}
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
