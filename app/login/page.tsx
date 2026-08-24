'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Предустановленные аккаунты (admin + teacher)
      const defaultAccounts = [
        {
          id: 'admin_default',
          email: 'admin@fmedu.kz',
          password: 'admin2026',
          name: 'Администратор FM Edu',
          role: 'admin',
          createdAt: '2026-01-01T00:00:00.000Z'
        },
        {
          id: 'teacher_default',
          email: 'teacher@fmedu.kz',
          password: 'teacher2026',
          name: 'Нурсултан Алиев',
          role: 'teacher',
          subjects: ['mathematics', 'physics'],
          pointsBalance: 30000,
          createdAt: '2026-01-01T00:00:00.000Z'
        }
      ];

      // Получаем пользователей из localStorage (только ученики)
      const usersStr = localStorage.getItem('fm_edu_users');
      const users = usersStr ? JSON.parse(usersStr) : [];

      // Объединяем предустановленные + кастомные
      const allUsers = [...defaultAccounts, ...users];

      // Ищем пользователя
      const user = allUsers.find((u: any) => u.email === formData.email && u.password === formData.password);

      if (!user) {
        setError('Неверный email или пароль');
        setLoading(false);
        return;
      }

      // Логиним
      const token = `token_${user.id}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Уведомляем Header об изменении
      window.dispatchEvent(new Event('authChange'));

      // Редирект в зависимости от роли
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'student') {
        router.push('/dashboard/student');
      } else {
        router.push('/dashboard/teacher');
      }
    } catch (err) {
      setError('Ошибка входа');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-semibold text-foreground">
            FM Edu
          </Link>
        </div>

        <div className="space-y-6 bg-card p-8 rounded-lg border border-border">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Вход</h1>
            <p className="mt-2 text-sm text-muted-foreground">Войдите в свой аккаунт</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg text-sm bg-destructive/10 border border-destructive/20 text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-all bg-background border border-border focus:border-primary text-foreground"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Пароль
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-all bg-background border border-border focus:border-primary text-foreground"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white text-sm font-medium rounded-lg transition-all"
              style={{ backgroundColor: loading ? '#F5F3FF' : '#8B5CF6' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#A78BFA')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#8B5CF6')}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground">
              Нет аккаунта?{' '}
              <Link href="/register" className="font-medium text-foreground">
                Зарегистрироваться
              </Link>
            </p>

            {/* Предустановленные аккаунты */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Тестовые аккаунты:</p>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-50 dark:bg-purple-950/30 p-2 rounded">
                  <p className="font-medium text-purple-700 dark:text-purple-300">👑 Администратор</p>
                  <p className="text-gray-600 dark:text-gray-400">admin@fmedu.kz / admin2026</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/30 p-2 rounded">
                  <p className="font-medium text-blue-700 dark:text-blue-300">👨‍🏫 Учитель</p>
                  <p className="text-gray-600 dark:text-gray-400">teacher@fmedu.kz / teacher2026</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 p-2 rounded">
                  <p className="font-medium text-green-700 dark:text-green-300">👨‍🎓 Ученик</p>
                  <p className="text-gray-600 dark:text-gray-400">Создайте через регистрацию (MBTI, регион, класс)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
