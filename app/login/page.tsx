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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ошибка входа');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'student') {
        router.push('/dashboard/student');
      } else {
        router.push('/dashboard/teacher');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F5F3FF' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-semibold" style={{ color: '#1F1B2E' }}>
            FM Edu
          </Link>
        </div>

        <div className="space-y-6" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', border: '2px solid #8B5CF6' }}>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1F1B2E' }}>Вход</h1>
            <p className="mt-2 text-sm" style={{ color: '#10B981' }}>Войдите в свой аккаунт</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#F5F3FF', border: '1px solid #10B981', color: '#1F1B2E' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1F1B2E' }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                style={{ border: '2px solid #8B5CF6' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#10B981'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#8B5CF6'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1F1B2E' }}>
                Пароль
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                style={{ border: '2px solid #8B5CF6' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#10B981'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#8B5CF6'}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white text-sm font-medium rounded-lg transition-all"
              style={{ backgroundColor: loading ? '#F5F3FF' : '#8B5CF6' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#10B981')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#8B5CF6')}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <p className="text-center text-sm" style={{ color: '#10B981' }}>
            Нет аккаунта?{' '}
            <Link href="/register" className="font-medium" style={{ color: '#1F1B2E' }}>
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
