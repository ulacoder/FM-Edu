'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Teacher, Student, StudentProgress } from '@/types';
import Link from 'next/link';

export default function TeacherDashboard() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'teacher') {
      router.push('/dashboard/student');
      return;
    }

    loadData(token);
  }, []);

  const loadData = async (token: string) => {
    try {
      // Загрузка профиля учителя
      const profileRes = await fetch('/api/teacher/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileData = await profileRes.json();
      setTeacher(profileData);

      // Загрузка списка учеников
      const studentsRes = await fetch('/api/teacher/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const studentsData = await studentsRes.json();
      setStudents(studentsData.students || []);
      setProgress(studentsData.progress || []);

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              EduAI.kz
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-foreground">Панель учителя</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-foreground">{teacher?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Приветствие */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Добро пожаловать, {teacher?.name}! 👨‍🏫
          </h1>
          <p className="text-gray-600">
            Предметы: {teacher?.subjects?.join(', ') || 'Не указаны'}
          </p>
        </div>

        {/* Статистика */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-3xl font-bold text-gray-900">{students.length}</div>
            <div className="text-gray-600">Всего учеников</div>
          </div>

          <div className="bg-card rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-gray-900">
              {progress.reduce((acc, p) => acc + p.completedAssignments.length, 0)}
            </div>
            <div className="text-gray-600">Выполнено заданий</div>
          </div>

          <div className="bg-card rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-3xl font-bold text-gray-900">
              {progress.length > 0
                ? Math.round(
                    progress.reduce((acc, p) => {
                      const avgScore = p.scores.reduce((sum, s) => sum + (s.score / s.maxScore) * 100, 0) / (p.scores.length || 1);
                      return acc + avgScore;
                    }, 0) / progress.length
                  )
                : 0}%
            </div>
            <div className="text-gray-600">Средний результат</div>
          </div>
        </div>

        {/* Список учеников */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ученики</h2>

          {students.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">Пока нет учеников</p>
              <p className="text-sm">Ученики появятся после регистрации на платформе</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Имя</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Класс</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">MBTI</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Уровень</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Заданий</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Средний балл</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Активность</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => {
                    const studentProgress = progress.filter(p => p.studentId === student.id);
                    const totalAssignments = studentProgress.reduce((acc, p) => acc + p.completedAssignments.length, 0);
                    const avgScore = studentProgress.length > 0
                      ? Math.round(
                          studentProgress.reduce((acc, p) => {
                            const avg = p.scores.reduce((sum, s) => sum + (s.score / s.maxScore) * 100, 0) / (p.scores.length || 1);
                            return acc + avg;
                          }, 0) / studentProgress.length
                        )
                      : 0;
                    const lastActivity = studentProgress[0]?.lastActivity
                      ? new Date(studentProgress[0].lastActivity).toLocaleDateString('ru-RU')
                      : 'Нет активности';

                    return (
                      <tr key={student.id} className="hover:bg-muted">
                        <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student.grade} класс</td>
                        <td className="px-4 py-3 text-sm">
                          {student.mbtiProfile ? (
                            <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-700 font-medium" title={student.mbtiProfile.learningStyle}>
                              {student.mbtiProfile.type}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">Не установлен</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${
                            student.level === 'advanced' ? 'bg-green-100 text-green-700' :
                            student.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-foreground'
                          }`}>
                            {student.level === 'advanced' ? 'Продвинутый' :
                             student.level === 'intermediate' ? 'Средний' :
                             student.level === 'beginner' ? 'Начальный' : 'Не определён'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{totalAssignments}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{avgScore}%</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{lastActivity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Быстрые действия */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/teacher/classes"
            className="bg-card rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Мои классы
            </h3>
            <p className="text-sm text-gray-600">
              Управление классами и начисление баллов
            </p>
          </Link>

          <Link
            href="/teacher/assignments"
            className="bg-card rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">✍️</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Создать задание
            </h3>
            <p className="text-sm text-gray-600">
              Создайте новое задание для класса
            </p>
          </Link>

          <Link
            href="/teacher/materials"
            className="bg-card rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Добавить материалы
            </h3>
            <p className="text-sm text-gray-600">
              Загрузите новые материалы для учеников
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

