"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  TestTube,
  BookOpen,
  Bot,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap
} from "lucide-react";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<'НИШ' | 'КТЛ' | 'РФМШ'>('НИШ');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    // Load selected program
    const savedProgram = localStorage.getItem('selectedProgram') as 'НИШ' | 'КТЛ' | 'РФМШ' | null;
    if (savedProgram) {
      setSelectedProgram(savedProgram);
    }
  }, []);

  const handleProgramChange = (program: 'НИШ' | 'КТЛ' | 'РФМШ') => {
    setSelectedProgram(program);
    localStorage.setItem('selectedProgram', program);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    router.push('/');
    setIsOpen(false);
  };

  const menuItems = [
    { icon: Home, label: "Главная", href: "/", auth: false },
    { icon: LayoutDashboard, label: "Дашборд", href: "/dashboard/student", auth: true },
    { icon: TestTube, label: "Диагностика", href: "/diagnostic", auth: false },
    { icon: BookOpen, label: "Предметы", href: "/courses", auth: false },
    { icon: Bot, label: "AI Ментор", href: "#", auth: false, action: "openNavi" },
    { icon: TrendingUp, label: "Прогресс", href: "/progress", auth: true },
    { icon: GraduationCap, label: "Leaderboard", href: "/leaderboard", auth: true },
    { icon: User, label: "Профиль", href: "/profile", auth: true },
    { icon: Settings, label: "Настройки", href: "/settings", auth: true },
  ];

  const handleItemClick = (item: any) => {
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
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[100] p-2 bg-white border-2 border-purple-600 rounded-lg shadow-lg hover:bg-purple-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-purple-600" />
        ) : (
          <Menu className="w-6 h-6 text-purple-600" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[90] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r-2 border-purple-600 shadow-2xl z-[95] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">FM Edu</h2>
                <p className="text-xs text-gray-600">Выберите программу</p>
              </div>
            </div>
            {/* Program Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => handleProgramChange('НИШ')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  selectedProgram === 'НИШ'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-purple-400'
                }`}
              >
                НИШ
              </button>
              <button
                onClick={() => handleProgramChange('КТЛ')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  selectedProgram === 'КТЛ'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-purple-400'
                }`}
              >
                КТЛ
              </button>
              <button
                onClick={() => handleProgramChange('РФМШ')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  selectedProgram === 'РФМШ'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-purple-400'
                }`}
              >
                РФМШ
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                // Skip auth-required items if not authenticated
                if (item.auth && !isAuthenticated) return null;

                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.label}>
                    {item.action ? (
                      <button
                        onClick={() => handleItemClick(item)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-purple-600 text-white"
                            : "text-gray-700 hover:bg-purple-50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-purple-600 text-white"
                            : "text-gray-700 hover:bg-purple-50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Выйти</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
