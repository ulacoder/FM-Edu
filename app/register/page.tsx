'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { subjectNames, Subject } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'student' | 'teacher',
    grade: 7,
    subjects: [] as Subject[],
    goals: [] as string[],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const goalOptions = ['Подготовка к экзаменам', 'Подготовка к олимпиадам', 'Повторение материала', 'Углубленное изучение'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ошибка регистрации');
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
      setError('Ошибка соединения');
      setLoading(false);
    }
  };

  const handleSubjectToggle = (subject: Subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#E6C7E6' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-semibold" style={{ color: '#2E1A47' }}>
            FM Edu
          </Link>
        </div>

        <div className="space-y-6" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', border: '2px solid #663399' }}>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#2E1A47' }}>Создать аккаунт</h1>
            <p className="mt-2 text-sm" style={{ color: '#A3779D' }}>Начните персонализированное обучение</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#E6C7E6', border: '1px solid #A3779D', color: '#2E1A47' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2E1A47' }}>
                Имя
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                style={{ border: '2px solid #663399' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#A3779D'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#663399'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2E1A47' }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                style={{ border: '2px solid #663399' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#A3779D'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#663399'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2E1A47' }}>
                Пароль
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                style={{ border: '2px solid #663399' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#A3779D'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#663399'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: '#2E1A47' }}>
                Роль
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  className="px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-all"
                  style={{
                    borderColor: formData.role === 'student' ? '#663399' : '#E6C7E6',
                    backgroundColor: formData.role === 'student' ? '#663399' : 'white',
                    color: formData.role === 'student' ? 'white' : '#2E1A47'
                  }}
                >
                  Ученик
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'teacher' })}
                  className="px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-all"
                  style={{
                    borderColor: formData.role === 'teacher' ? '#663399' : '#E6C7E6',
                    backgroundColor: formData.role === 'teacher' ? '#663399' : 'white',
                    color: formData.role === 'teacher' ? 'white' : '#2E1A47'
                  }}
                >
                  Учитель
                </button>
              </div>
            </div>

            {formData.role === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2E1A47' }}>
                    Класс
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-lg outline-none"
                    style={{ border: '2px solid #663399', color: '#2E1A47' }}
                  >
                    {[7, 8, 9, 10, 11, 12].map(grade => (
                      <option key={grade} value={grade}>{grade} класс</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: '#2E1A47' }}>
                    Цели обучения
                  </label>
                  <div className="space-y-2">
                    {goalOptions.map(goal => (
                      <label key={goal} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.goals.includes(goal)}
                          onChange={() => handleGoalToggle(goal)}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: '#663399' }}
                        />
                        <span className="ml-3 text-sm" style={{ color: '#2E1A47' }}>{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {formData.role === 'teacher' && (
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: '#2E1A47' }}>
                  Предметы
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(subjectNames).map(([key, name]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.subjects.includes(key as Subject)}
                        onChange={() => handleSubjectToggle(key as Subject)}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#663399' }}
                      />
                      <span className="ml-3 text-sm" style={{ color: '#2E1A47' }}>{name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white text-sm font-medium rounded-lg transition-all"
              style={{ backgroundColor: loading ? '#E6C7E6' : '#663399' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#A3779D')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#663399')}
            >
              {loading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="text-center text-sm" style={{ color: '#A3779D' }}>
            Уже есть аккаунт?{' '}
            <Link href="/login" className="font-medium" style={{ color: '#2E1A47' }}>
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
