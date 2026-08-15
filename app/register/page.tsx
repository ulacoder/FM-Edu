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

      // Сохранение токена
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Перенаправление
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

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleSubjectToggle = (subject: Subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Регистрация</h1>
        <p className="text-gray-600 mb-6">Создайте аккаунт для начала обучения</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Имя */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Имя
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Пароль */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Роль */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Я —
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="student"
                  checked={formData.role === 'student'}
                  onChange={(e) => setFormData({ ...formData, role: 'student' })}
                  className="mr-2"
                />
                Ученик
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="teacher"
                  checked={formData.role === 'teacher'}
                  onChange={(e) => setFormData({ ...formData, role: 'teacher' })}
                  className="mr-2"
                />
                Учитель
              </label>
            </div>
          </div>

          {/* Для ученика: класс и цели */}
          {formData.role === 'student' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Класс
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[7, 8, 9, 10, 11, 12].map(grade => (
                    <option key={grade} value={grade}>{grade} класс</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цели обучения
                </label>
                <div className="space-y-2">
                  {goalOptions.map(goal => (
                    <label key={goal} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.goals.includes(goal)}
                        onChange={() => handleGoalToggle(goal)}
                        className="mr-2"
                      />
                      {goal}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Для учителя: предметы */}
          {formData.role === 'teacher' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Предметы
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(subjectNames).map(([key, name]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(key as Subject)}
                      onChange={() => handleSubjectToggle(key as Subject)}
                      className="mr-2"
                    />
                    {name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
