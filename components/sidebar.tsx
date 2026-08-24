"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  TestTube,
  BookOpen,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Brain,
  Gamepad2,
  Trophy,
  MessageCircle,
  Target,
  Sparkles,
  Calendar,
  ShoppingBag,
  Lightbulb,
  Download
} from "lucide-react";
import { getTranslation, type Locale } from "@/lib/i18n";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [locale, setLocale] = useState<Locale>('ru');
  const pathname = usePathname();
  const router = useRouter();

  const t = (key: keyof typeof import('@/lib/i18n').translations.ru) => getTranslation(locale, key);

  useEffect(() => {
    // Check authentication status on mount and when pathname changes
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    checkAuth();

    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['ru', 'kk', 'en'].includes(savedLocale)) {
      setLocale(savedLocale);
    }

    const handleLocaleChange = (e: CustomEvent<Locale>) => {
      setLocale(e.detail);
    };

    // Listen for storage changes (for cross-tab auth sync)
    window.addEventListener('storage', checkAuth);
    window.addEventListener('localeChange', handleLocaleChange as EventListener);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('localeChange', handleLocaleChange as EventListener);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    router.push('/');
    setIsOpen(false);
  };

  const menuItems: Array<{
    icon: any;
    labelKey: keyof typeof import('@/lib/i18n').translations.ru;
    href: string;
    auth: boolean;
    action?: string;
  }> = [
    { icon: Home, labelKey: "home", href: "/", auth: false },
    { icon: LayoutDashboard, labelKey: "dashboard", href: "/dashboard/student", auth: true },
    { icon: Sparkles, labelKey: "aiAgentDemo", href: "/ai-agent-demo", auth: true },
    { icon: TestTube, labelKey: "diagnostic", href: "/diagnostic", auth: false },
    { icon: BookOpen, labelKey: "courses", href: "/courses", auth: false },
    { icon: Download, labelKey: "offlineBank", href: "/offline-bank", auth: false },
    { icon: Gamepad2, labelKey: "games", href: "/games", auth: false },
    { icon: Target, labelKey: "roadmap", href: "/roadmap", auth: true },
    { icon: Lightbulb, labelKey: "opportunities", href: "/opportunities", auth: false },
    { icon: Calendar, labelKey: "calendar", href: "/calendar", auth: true },
    { icon: ShoppingBag, labelKey: "shop", href: "/shop", auth: true },
    { icon: Trophy, labelKey: "leaderboard", href: "/leaderboard", auth: true },
    { icon: MessageCircle, labelKey: "regionalChat", href: "/regional-chat", auth: true },
    { icon: Brain, labelKey: "mbtiProfile", href: "/mbti-profile", auth: true },
    { icon: TrendingUp, labelKey: "progress", href: "/progress", auth: true },
    { icon: User, labelKey: "profile", href: "/profile", auth: true },
    { icon: Settings, labelKey: "settings", href: "/settings", auth: true },
  ];

  const handleItemClick = (item: any, e: React.MouseEvent) => {
    // If auth required and user not authenticated, redirect to login
    if (item.auth && !isAuthenticated) {
      e.preventDefault();
      router.push('/login');
      setIsOpen(false);
      return;
    }

    if (item.action === "openNavi") {
      // Trigger Navi to open - we'll dispatch a custom event
      window.dispatchEvent(new CustomEvent('openNavi'));
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Hamburger Button - только когда sidebar закрыт */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-3 left-3 sm:top-4 sm:left-4 z-[100] p-1.5 sm:p-2 bg-card border-2 border-purple-600 rounded-lg shadow-lg hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[90] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 sm:w-72 bg-card border-r-2 border-border shadow-2xl z-[95] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header с кнопкой закрытия */}
          <div className="p-4 sm:p-6 border-b border-border bg-muted/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">FM Edu</h2>
                  <p className="text-xs text-muted-foreground">NIS Programme</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-card/50 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-3 sm:p-4">
            <ul className="space-y-0.5 sm:space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.labelKey}>
                    {item.action ? (
                      <button
                        onClick={(e) => handleItemClick(item, e)}
                        className={`w-full flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-purple-600 text-white"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium truncate">{t(item.labelKey)}</span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={(e) => handleItemClick(item, e)}
                        className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-purple-600 text-white"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium truncate">{t(item.labelKey)}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-border">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">{t('logout')}</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-3 sm:px-4 py-2 text-sm sm:text-base text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-muted transition-colors font-medium"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-3 sm:px-4 py-2 text-sm sm:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
