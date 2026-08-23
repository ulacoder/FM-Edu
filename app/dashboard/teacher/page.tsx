'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, TrendingUp, BookOpen, FileText, FolderOpen, Presentation } from 'lucide-react';

export default function TeacherDashboard() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
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

    setTeacher(user);
    loadMockData(user.id);
  }, [router]);

  const loadMockData = (teacherId: string) => {
    const classesStr = localStorage.getItem('fm_edu_classes');
    if (!classesStr) {
      const mockClass = {
        id: `class_mock_${Date.now()}`,
        teacherId: teacherId,
        name: '9 А — Математика',
        description: 'Углубленная математика для 9 класса',
        studentIds: ['student_mock_1', 'student_mock_2', 'student_mock_3', 'student_mock_4', 'student_mock_5'],
        createdAt: new Date('2026-08-20'),
        updatedAt: new Date('2026-08-23'),
      };
      localStorage.setItem('fm_edu_classes', JSON.stringify([mockClass]));

      const usersStr = localStorage.getItem('fm_edu_users');
      const users = usersStr ? JSON.parse(usersStr) : [];

      const mockStudents = [
        {
          id: 'student_mock_1',
          email: 'aidar.k@example.com',
          name: 'Айдар Кенжебаев',
          role: 'student',
          grade: 9,
          totalPoints: 850,
          region: 'almaty_city',
          mbtiType: 'INTJ',
          createdAt: new Date('2026-08-15').toISOString(),
        },
        {
          id: 'student_mock_2',
          email: 'asel.t@example.com',
          name: 'Асель Токтарова',
          role: 'student',
          grade: 9,
          totalPoints: 920,
          region: 'astana',
          mbtiType: 'ENFJ',
          createdAt: new Date('2026-08-16').toISOString(),
        },
        {
          id: 'student_mock_3',
          email: 'dias.s@example.com',
          name: 'Диас Сапаров',
          role: 'student',
          grade: 9,
          totalPoints: 730,
          region: 'almaty_city',
          mbtiType: 'ISTP',
          createdAt: new Date('2026-08-17').toISOString(),
        },
        {
          id: 'student_mock_4',
          email: 'dana.m@example.com',
          name: 'Дана Мухамедова',
          role: 'student',
          grade: 9,
          totalPoints: 880,
          region: 'shymkent',
          mbtiType: 'ENFP',
          createdAt: new Date('2026-08-18').toISOString(),
        },
        {
          id: 'student_mock_5',
          email: 'arman.b@example.com',
          name: 'Арман Бекенов',
          role: 'student',
          grade: 9,
          totalPoints: 650,
          region: 'karaganda',
          mbtiType: 'ISTJ',
          createdAt: new Date('2026-08-19').toISOString(),
        },
      ];

      users.push(...mockStudents);
      localStorage.setItem('fm_edu_users', JSON.stringify(users));

      const mockTransactions = [
        {
          id: 'trans_1',
          teacherId: teacherId,
          studentId: 'student_mock_1',
          classId: mockClass.id,
          amount: 150,
          category: 'За активность на уроке',
          description: 'Отлично решил задачу у доски',
          createdAt: new Date('2026-08-21T10:30:00'),
        },
        {
          id: 'trans_2',
          teacherId: teacherId,
          studentId: 'student_mock_2',
          classId: mockClass.id,
          amount: 200,
          category: 'За домашнее задание',
          description: 'Все задачи выполнены правильно',
          createdAt: new Date('2026-08-21T14:20:00'),
        },
        {
          id: 'trans_3',
          teacherId: teacherId,
          studentId: 'student_mock_3',
          classId: mockClass.id,
          amount: 100,
          category: 'За участие в олимпиаде',
          description: '3 место в школьной олимпиаде',
          createdAt: new Date('2026-08-22T09:15:00'),
        },
        {
          id: 'trans_4',
          teacherId: teacherId,
          studentId: 'student_mock_4',
          classId: mockClass.id,
          amount: 180,
          category: 'За помощь однокласснику',
          description: 'Помогла разобраться с темой',
          createdAt: new Date('2026-08-22T11:45:00'),
        },
        {
          id: 'trans_5',
          teacherId: teacherId,
          studentId: 'student_mock_1',
          classId: mockClass.id,
          amount: 120,
          category: 'За самостоятельную работу',
          description: 'Высокий балл за контрольную',
          createdAt: new Date('2026-08-23T10:00:00'),
        },
      ];
      localStorage.setItem('fm_edu_transactions', JSON.stringify(mockTransactions));

      const mockReviews = [
        {
          id: 'review_1',
          teacherId: teacherId,
          teacherName: 'Учитель',
          studentId: 'student_mock_1',
          classId: mockClass.id,
          text: 'Айдар показывает отличные результаты в алгебре. Рекомендую продолжать в том же духе.',
          category: 'progress',
          createdAt: new Date('2026-08-21T15:00:00'),
        },
        {
          id: 'review_2',
          teacherId: teacherId,
          teacherName: 'Учитель',
          studentId: 'student_mock_2',
          classId: mockClass.id,
          text: 'Асель активно участвует на уроках, помогает одноклассникам. Молодец!',
          category: 'behavior',
          createdAt: new Date('2026-08-22T16:30:00'),
        },
        {
          id: 'review_3',
          teacherId: teacherId,
          teacherName: 'Учитель',
          studentId: 'student_mock_5',
          classId: mockClass.id,
          text: 'Арман, нужно больше внимания уделять домашним заданиям. Потенциал есть.',
          category: 'homework',
          createdAt: new Date('2026-08-23T12:00:00'),
        },
      ];
      localStorage.setItem('fm_edu_reviews', JSON.stringify(mockReviews));
    }

    const allClasses = JSON.parse(localStorage.getItem('fm_edu_classes') || '[]');
    const teacherClasses = allClasses.filter((c: any) => c.teacherId === teacherId);
    setClasses(teacherClasses);

    const allUsers = JSON.parse(localStorage.getItem('fm_edu_users') || '[]');
    const allStudents = allUsers.filter((u: any) => u.role === 'student');
    setStudents(allStudents);

    setLoading(false);
  };

  if (loading || !teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-lg text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  const totalStudents = students.length;
  const totalClasses = classes.length;
  const averagePoints = totalStudents > 0
    ? Math.round(students.reduce((sum: number, s: any) => sum + (s.totalPoints || 0), 0) / totalStudents)
    : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Привет, {teacher?.name}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Предметы: {teacher?.subjects?.join(', ') || 'Не указаны'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl sm:text-3xl font-bold">{totalStudents}</span>
            </div>
            <p className="text-sm text-muted-foreground">Всего учеников</p>
          </div>

          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              <span className="text-2xl sm:text-3xl font-bold">{totalClasses}</span>
            </div>
            <p className="text-sm text-muted-foreground">Активных классов</p>
          </div>

          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-2xl sm:text-3xl font-bold">{averagePoints}</span>
            </div>
            <p className="text-sm text-muted-foreground">Средний балл</p>
          </div>
        </div>

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
                    <th className="px-4 py-3 text-left text-sm font-semibold">Баллы</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">MBTI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.slice(0, 5).map((student: any) => (
                    <tr key={student.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium">{student.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{student.grade} класс</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded font-medium">
                          {student.totalPoints || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {student.mbtiType ? (
                          <span className="text-xs font-medium">{student.mbtiType}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link
            href="/dashboard/teacher/classes"
            className="bg-card border border-primary/60 rounded-lg p-4 sm:p-6 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
          >
            <Users className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              Мои классы
            </h3>
            <p className="text-sm text-muted-foreground">
              Управление классами и начисление баллов
            </p>
          </Link>

          <Link
            href="/dashboard/teacher/interactive"
            className="bg-card border border-green-500/60 rounded-lg p-4 sm:p-6 hover:border-green-500 hover:bg-green-500/5 transition-all cursor-pointer group"
          >
            <Presentation className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-2 group-hover:text-green-600 transition-colors">
              Классный интерактив
            </h3>
            <p className="text-sm text-muted-foreground">
              Запустите квиз на проекторе для класса
            </p>
          </Link>

          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 opacity-60 cursor-not-allowed relative">
            <div className="absolute top-3 right-3 px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded">
              Скоро
            </div>
            <FileText className="w-8 h-8 text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-2">
              Создать задание
            </h3>
            <p className="text-sm text-muted-foreground">
              Создайте новое задание для класса
            </p>
          </div>

          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6 opacity-60 cursor-not-allowed relative">
            <div className="absolute top-3 right-3 px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded">
              Скоро
            </div>
            <BookOpen className="w-8 h-8 text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-2">
              Добавить материалы
            </h3>
            <p className="text-sm text-muted-foreground">
              Загрузите новые материалы для учеников
            </p>
          </div>
        </div>
      </div>
    </div>

    <footer className="border-t border-border/40 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
        <p>© 2026 FM Edu. Все права защищены.</p>
      </div>
    </footer>
  </div>
  );
}
