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
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-1 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Добро пожаловать, {teacher?.name}! 👨‍🏫
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Предметы: {teacher?.subjects?.join(', ') || 'Не указаны'}
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">👥</span>
              <span className="text-2xl sm:text-3xl font-bold">{students.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Всего учеников</p>
          </div>

          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">✅</span>
              <span className="text-2xl sm:text-3xl font-bold">
                {progress.reduce((acc, p) => acc + p.completedAssignments.length, 0)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Выполнено заданий</p>
          </div>

          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📊</span>
              <span className="text-2xl sm:text-3xl font-bold">
                {progress.length > 0
                  ? Math.round(
                      progress.reduce((acc, p) => {
                        const avgScore = p.scores.reduce((sum, s) => sum + (s.score / s.maxScore) * 100, 0) / (p.scores.length || 1);
                        return acc + avgScore;
                      }, 0) / progress.length
                    )
                  : 0}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Средний результат</p>
          </div>
        </div>

        {/* Список учеников */}
        <div className="bg-card border border-border/60 rounded-lg mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 border-b border-border">
            <h2 className="text-lg sm:text-xl font-bold">Ученики</h2>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-muted-foreground mb-4">Пока нет учеников</p>
              <p className="text-sm text-muted-foreground">Ученики появятся после регистрации на платформе</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Имя</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Класс</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">MBTI</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Уровень</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Заданий</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Средний балл</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Активность</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
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
                      <tr key={student.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-sm font-medium">{student.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{student.grade} класс</td>
                        <td className="px-4 py-3 text-sm">
                          {student.mbtiProfile ? (
                            <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary font-medium" title={student.mbtiProfile.learningStyle}>
                              {student.mbtiProfile.type}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Не установлен</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${
                            student.level === 'advanced' ? 'bg-green-100 text-green-700' :
                            student.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-muted text-foreground'
                          }`}>
                            {student.level === 'advanced' ? 'Продвинутый' :
                             student.level === 'intermediate' ? 'Средний' :
                             student.level === 'beginner' ? 'Начальный' : 'Не определён'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{totalAssignments}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{avgScore}%</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{lastActivity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Быстрые действия */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Link
            href="/dashboard/teacher/classes"
            className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors"
          >
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-semibold mb-2">
              Мои классы
            </h3>
            <p className="text-sm text-muted-foreground">
              Управление классами и начисление баллов
            </p>
          </Link>

          <Link
            href="/teacher/assignments"
            className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors"
          >
            <div className="text-3xl mb-3">✍️</div>
            <h3 className="font-semibold mb-2">
              Создать задание
            </h3>
            <p className="text-sm text-muted-foreground">
              Создайте новое задание для класса
            </p>
          </Link>

          <Link
            href="/teacher/materials"
            className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors"
          >
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold mb-2">
              Добавить материалы
            </h3>
            <p className="text-sm text-muted-foreground">
              Загрузите новые материалы для учеников
            </p>
          </Link>
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer className="border-t border-border/40 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
        <p>© 2026 FM Edu. Все права защищены.</p>
      </div>
    </footer>
  </div>
  );
}

