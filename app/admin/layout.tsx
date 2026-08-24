'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  BarChart3,
  Package,
  Lightbulb,
  Settings,
  LogOut
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role !== 'admin' && userData.role !== 'teacher') {
        router.push('/dashboard/student');
        return;
      }
      setUser(userData);
    } catch (e) {
      router.push('/login');
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: BarChart3, label: 'Аналитика', href: '/admin/analytics' },
    { icon: BookOpen, label: 'Курсы', href: '/admin/courses' },
    { icon: FileText, label: 'Предметы', href: '/admin/subjects' },
    { icon: Lightbulb, label: 'Возможности', href: '/admin/opportunities' },
    { icon: Users, label: 'Пользователи', href: '/admin/users' },
    { icon: Package, label: 'Офлайн-пакеты', href: '/admin/offline-packages' },
    { icon: Settings, label: 'Настройки', href: '/admin/settings' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-purple-600">FM Edu Admin</h1>
          <p className="text-sm text-gray-600 mt-1">{user.name}</p>
        </div>

        <nav className="px-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-purple-600 mb-1"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-red-600 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
