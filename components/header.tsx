'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { getTranslation, type Locale } from '@/lib/i18n';

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);
  const [locale, setLocale] = useState<Locale>('ru');
  const router = useRouter();

  const t = (key: keyof typeof import('@/lib/i18n').translations.ru) => getTranslation(locale, key);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const savedLocale = localStorage.getItem('locale') as Locale;

    if (savedLocale && ['ru', 'kk', 'en'].includes(savedLocale)) {
      setLocale(savedLocale);
    }

    if (token && userStr) {
      setIsAuthenticated(true);
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || '');
        setUserRole(user.role || null);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    const handleLocaleChange = (e: CustomEvent<Locale>) => {
      setLocale(e.detail);
    };

    window.addEventListener('localeChange', handleLocaleChange as EventListener);
    return () => window.removeEventListener('localeChange', handleLocaleChange as EventListener);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserName('');
    setUserRole(null);
    router.push('/');
  };

  const getDashboardLink = () => {
    if (userRole === 'teacher') return '/dashboard/teacher';
    return '/dashboard/student';
  };

  return (
    <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 gradient-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <Link href="/" className="text-base sm:text-lg font-bold">
              FM Edu
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <span className="text-xs sm:text-sm font-medium hidden md:inline">{userName}</span>
                <Link href={getDashboardLink()}>
                  <button className="px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.98] rounded-lg transition-all">
                    {t('dashboard')}
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium hover:text-primary transition-colors hidden sm:inline-block"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline-block">
                  <button className="px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium hover:text-primary transition-colors">
                    {t('login')}
                  </button>
                </Link>
                <Link href="/register">
                  <button className="px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 active:scale-[0.98] rounded-lg transition-all">
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
