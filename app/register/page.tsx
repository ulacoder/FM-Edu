'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { subjectNames, Subject, regionNames, Region, MBTIType } from '@/types';

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
    region: 'astana' as Region,
    mbtiType: '' as MBTIType | '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const goalOptions = ['Подготовка к экзаменам', 'Подготовка к олимпиадам', 'Повторение материала', 'Углубленное изучение'];

  const mbtiTypes: MBTIType[] = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Проверяем существующих пользователей
      const usersStr = localStorage.getItem('fm_edu_users');
      const users = usersStr ? JSON.parse(usersStr) : [];

      // Проверка на дубликат email
      if (users.find((u: any) => u.email === formData.email)) {
        setError('Пользователь с таким email уже существует');
        setLoading(false);
        return;
      }

      // Создаём нового пользователя
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newUser = {
        id: userId,
        email: formData.email,
        password: formData.password, // В реальном проекте нужно хешировать
        name: formData.name,
        role: formData.role,
        grade: formData.role === 'student' ? formData.grade : undefined,
        goals: formData.role === 'student' ? formData.goals : undefined,
        region: formData.role === 'student' ? formData.region : undefined,
        mbtiType: formData.role === 'student' ? formData.mbtiType : undefined,
        subjects: formData.role === 'teacher' ? formData.subjects : undefined,
        totalPoints: formData.role === 'student' ? 0 : undefined,
        createdAt: new Date().toISOString(),
      };

      // Сохраняем в localStorage
      users.push(newUser);
      localStorage.setItem('fm_edu_users', JSON.stringify(users));

      // Логиним пользователя
      const token = `token_${userId}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Уведомляем Header об изменении
      window.dispatchEvent(new Event('authChange'));

      // Редирект
      if (formData.role === 'student') {
        router.push('/dashboard/student');
      } else {
        router.push('/dashboard/teacher');
      }
    } catch (err) {
      setError('Ошибка регистрации');
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-semibold text-foreground">
            FM Edu
          </Link>
        </div>

        <div className="space-y-6 bg-card p-8 rounded-lg border border-border">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Создать аккаунт</h1>
            <p className="mt-2 text-sm text-muted-foreground">Начните персонализированное обучение</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg text-sm bg-destructive/10 border border-destructive/20 text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Имя
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-all bg-background border border-border focus:border-primary text-foreground"
                required
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium mb-3 text-foreground">
                Роль
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  className="px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-all"
                  style={{
                    borderColor: formData.role === 'student' ? '#8B5CF6' : '#F5F3FF',
                    backgroundColor: formData.role === 'student' ? '#8B5CF6' : 'white',
                    color: formData.role === 'student' ? 'white' : '#18181b'
                  }}
                >
                  Ученик
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'teacher' })}
                  className="px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-all"
                  style={{
                    borderColor: formData.role === 'teacher' ? '#8B5CF6' : '#F5F3FF',
                    backgroundColor: formData.role === 'teacher' ? '#8B5CF6' : 'white',
                    color: formData.role === 'teacher' ? 'white' : '#18181b'
                  }}
                >
                  Учитель
                </button>
              </div>
            </div>

            {formData.role === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Класс
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-lg outline-none border border-border text-foreground bg-background"
                  >
                    {[7, 8, 9, 10, 11, 12].map(grade => (
                      <option key={grade} value={grade}>{grade} класс</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-foreground">
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
                          style={{ accentColor: '#8B5CF6' }}
                        />
                        <span className="ml-3 text-sm text-foreground">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Регион
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value as Region })}
                    className="w-full px-4 py-2.5 rounded-lg outline-none border border-border text-foreground bg-background"
                  >
                    {Object.entries(regionNames).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    MBTI тип личности
                  </label>
                  <select
                    value={formData.mbtiType}
                    onChange={(e) => setFormData({ ...formData, mbtiType: e.target.value as MBTIType })}
                    className="w-full px-4 py-2.5 rounded-lg outline-none border border-border text-foreground bg-background"
                    required
                  >
                    <option value="">Выберите тип</option>
                    {mbtiTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Не знаешь свой тип? Пройди тест на{' '}
                    <a href="https://www.16personalities.com/ru" target="_blank" rel="noopener noreferrer" className="underline">
                      16personalities.com
                    </a>
                  </p>
                </div>
              </>
            )}

            {formData.role === 'teacher' && (
              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">
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
                        style={{ accentColor: '#8B5CF6' }}
                      />
                      <span className="ml-3 text-sm text-foreground">{name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white text-sm font-medium rounded-lg transition-all"
              style={{ backgroundColor: loading ? '#F5F3FF' : '#8B5CF6' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#A78BFA')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#8B5CF6')}
            >
              {loading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="font-medium text-foreground">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
