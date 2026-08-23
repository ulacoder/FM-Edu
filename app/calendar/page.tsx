'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Deadline, DeadlineType, Subject, subjectNames } from '@/types';

const deadlineTypes: { value: DeadlineType; label: string }[] = [
  { value: 'exam', label: 'Экзамен' },
  { value: 'olympiad', label: 'Олимпиада' },
  { value: 'contest', label: 'Конкурс' },
  { value: 'project', label: 'Проект' },
  { value: 'custom', label: 'Другое' }
];

const colors = [
  { value: '#8B5CF6', label: 'Фиолетовый' },
  { value: '#EF4444', label: 'Красный' },
  { value: '#F59E0B', label: 'Оранжевый' },
  { value: '#10B981', label: 'Зеленый' },
  { value: '#3B82F6', label: 'Синий' },
  { value: '#EC4899', label: 'Розовый' }
];

export default function CalendarPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: 'exam' as DeadlineType,
    date: '',
    subject: '' as Subject | '',
    description: '',
    color: '#8B5CF6'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role !== 'student') {
        router.push('/dashboard/teacher');
        return;
      }
      setUser(userData);
      loadDeadlines(userData.id);
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const loadDeadlines = async (studentId: string) => {
    try {
      // Загружаем из localStorage
      const cached = localStorage.getItem(`deadlines_${studentId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Конвертируем date строки обратно в Date объекты
        const deadlinesWithDates = parsed.map((d: any) => ({
          ...d,
          date: new Date(d.date),
          createdAt: new Date(d.createdAt)
        }));
        setDeadlines(deadlinesWithDates);
      }

      const res = await fetch(`/api/deadlines?studentId=${studentId}`);
      const data = await res.json();
      setDeadlines(data.deadlines || []);
    } catch (error) {
      console.error('Error loading deadlines:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch('/api/deadlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          studentId: user.id,
          subject: formData.subject || undefined
        })
      });

      if (res.ok) {
        const data = await res.json();
        const updatedDeadlines = [...deadlines, data.deadline];
        setDeadlines(updatedDeadlines);
        // Сохраняем в localStorage
        localStorage.setItem(`deadlines_${user.id}`, JSON.stringify(updatedDeadlines));
        setFormData({
          title: '',
          type: 'exam',
          date: '',
          subject: '',
          description: '',
          color: '#8B5CF6'
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating deadline:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить дедлайн?')) return;

    try {
      await fetch(`/api/deadlines?id=${id}`, { method: 'DELETE' });
      if (user) loadDeadlines(user.id);
    } catch (error) {
      console.error('Error deleting deadline:', error);
    }
  };

  const handleToggleComplete = async (deadline: Deadline) => {
    try {
      await fetch('/api/deadlines', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: deadline.id,
          completed: !deadline.completed
        })
      });
      if (user) loadDeadlines(user.id);
    } catch (error) {
      console.error('Error updating deadline:', error);
    }
  };

  const getTimeUntil = (date: Date) => {
    const now = new Date();
    const target = new Date(date);
    const diff = target.getTime() - now.getTime();

    if (diff < 0) return 'Прошло';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `Через ${days} дн.`;
    if (hours > 0) return `Через ${hours} ч.`;
    return 'Сегодня';
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Календарь дедлайнов</h1>
              <p className="text-gray-600">Отслеживай важные даты экзаменов и олимпиад</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Добавить
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Новый дедлайн</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="ЕНТ по математике"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тип *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as DeadlineType })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    required
                  >
                    {deadlineTypes.map(dt => (
                      <option key={dt.value} value={dt.value}>{dt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дата *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Предмет (опционально)
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value as Subject })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="">Не выбрано</option>
                    {Object.entries(subjectNames).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Цвет
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    {colors.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание (опционально)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  rows={3}
                  placeholder="Дополнительная информация..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Создать
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Deadlines List */}
        <div className="space-y-4">
          {deadlines.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Нет дедлайнов. Добавь свой первый!</p>
            </div>
          ) : (
            deadlines.map(deadline => (
              <div
                key={deadline.id}
                className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
                style={{ borderLeft: `4px solid ${deadline.color}` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-lg font-bold ${deadline.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {deadline.title}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded">
                        {deadlineTypes.find(dt => dt.value === deadline.type)?.label}
                      </span>
                      {deadline.subject && (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                          {subjectNames[deadline.subject]}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(deadline.date).toLocaleDateString('ru-RU')}</span>
                      </div>
                      <div className={`font-medium ${
                        getTimeUntil(deadline.date) === 'Прошло' ? 'text-red-500' :
                        getTimeUntil(deadline.date) === 'Сегодня' ? 'text-orange-500' :
                        'text-purple-600'
                      }`}>
                        {getTimeUntil(deadline.date)}
                      </div>
                    </div>

                    {deadline.description && (
                      <p className="text-sm text-gray-600">{deadline.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleComplete(deadline)}
                      className={`p-2 rounded-lg transition-colors ${
                        deadline.completed
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={deadline.completed ? 'Отметить как невыполненное' : 'Отметить как выполненное'}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(deadline.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
