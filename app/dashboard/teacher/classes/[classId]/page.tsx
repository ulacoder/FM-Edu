'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, TrendingUp, Plus, Coins, MessageSquare, BarChart3 } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  grade: number;
  totalPoints: number;
  region?: string;
  mbtiType?: string;
}

interface TeacherClass {
  id: string;
  name: string;
  description?: string;
  studentIds: string[];
}

export default function ClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params?.classId as string;

  const [teacher, setTeacher] = useState<any>(null);
  const [classData, setClassData] = useState<TeacherClass | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentId, setStudentId] = useState('');
  const [pointsAmount, setPointsAmount] = useState('');
  const [pointsCategory, setPointsCategory] = useState('');
  const [pointsDescription, setPointsDescription] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewCategory, setReviewCategory] = useState<'homework' | 'behavior' | 'progress' | 'general'>('general');
  const [error, setError] = useState('');

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
    loadClassData(classId);
  }, [router, classId]);

  const loadClassData = (classId: string) => {
    try {
      const classesStr = localStorage.getItem('fm_edu_classes');
      const classes = classesStr ? JSON.parse(classesStr) : [];
      const foundClass = classes.find((c: any) => c.id === classId);

      if (!foundClass) {
        router.push('/dashboard/teacher/classes');
        return;
      }

      setClassData(foundClass);

      const usersStr = localStorage.getItem('fm_edu_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      const classStudents = users.filter((u: any) => foundClass.studentIds.includes(u.id));
      setStudents(classStudents);

      setLoading(false);
    } catch (error) {
      console.error('Error loading class:', error);
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setError('');

    if (!studentId.trim()) {
      setError('Введите ID студента');
      return;
    }

    try {
      const usersStr = localStorage.getItem('fm_edu_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      const student = users.find((u: any) => u.id === studentId && u.role === 'student');

      if (!student) {
        setError('Студент с таким ID не найден');
        return;
      }

      if (classData?.studentIds.includes(studentId)) {
        setError('Студент уже добавлен в класс');
        return;
      }

      const classesStr = localStorage.getItem('fm_edu_classes');
      const classes = classesStr ? JSON.parse(classesStr) : [];
      const classIndex = classes.findIndex((c: any) => c.id === classId);

      if (classIndex === -1) return;

      classes[classIndex].studentIds.push(studentId);
      classes[classIndex].updatedAt = new Date();
      localStorage.setItem('fm_edu_classes', JSON.stringify(classes));

      setStudents([...students, student]);
      setClassData(classes[classIndex]);
      setStudentId('');
      setShowAddStudentModal(false);
      setError('');
    } catch (error) {
      setError('Ошибка при добавлении студента');
    }
  };

  const handleAwardPoints = () => {
    setError('');

    if (!selectedStudent || !pointsAmount || !pointsCategory) {
      setError('Заполните все обязательные поля');
      return;
    }

    const amount = parseInt(pointsAmount);
    if (amount <= 0) {
      setError('Количество баллов должно быть больше нуля');
      return;
    }

    if ((teacher.pointsBalance || 0) < amount) {
      setError('Недостаточно баллов на балансе');
      return;
    }

    try {
      const transactionsStr = localStorage.getItem('fm_edu_transactions');
      const transactions = transactionsStr ? JSON.parse(transactionsStr) : [];

      const newTransaction = {
        id: `transaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        teacherId: teacher.id,
        studentId: selectedStudent.id,
        classId: classId,
        amount,
        category: pointsCategory,
        description: pointsDescription,
        createdAt: new Date(),
      };

      transactions.push(newTransaction);
      localStorage.setItem('fm_edu_transactions', JSON.stringify(transactions));

      const usersStr = localStorage.getItem('fm_edu_users');
      const users = usersStr ? JSON.parse(usersStr) : [];

      const teacherIndex = users.findIndex((u: any) => u.id === teacher.id);
      const studentIndex = users.findIndex((u: any) => u.id === selectedStudent.id);

      if (teacherIndex !== -1 && studentIndex !== -1) {
        users[teacherIndex].pointsBalance = (users[teacherIndex].pointsBalance || 0) - amount;
        users[studentIndex].totalPoints = (users[studentIndex].totalPoints || 0) + amount;

        localStorage.setItem('fm_edu_users', JSON.stringify(users));
        localStorage.setItem('user', JSON.stringify(users[teacherIndex]));

        setTeacher(users[teacherIndex]);
        const updatedStudents = students.map(s =>
          s.id === selectedStudent.id ? { ...s, totalPoints: users[studentIndex].totalPoints } : s
        );
        setStudents(updatedStudents);
      }

      setPointsAmount('');
      setPointsCategory('');
      setPointsDescription('');
      setSelectedStudent(null);
      setShowPointsModal(false);
      setError('');
    } catch (error) {
      setError('Ошибка при начислении баллов');
    }
  };

  const handleAddReview = () => {
    setError('');

    if (!selectedStudent || !reviewText.trim()) {
      setError('Введите текст отзыва');
      return;
    }

    try {
      const reviewsStr = localStorage.getItem('fm_edu_reviews');
      const reviews = reviewsStr ? JSON.parse(reviewsStr) : [];

      const newReview = {
        id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        teacherId: teacher.id,
        teacherName: teacher.name,
        studentId: selectedStudent.id,
        classId: classId,
        text: reviewText,
        category: reviewCategory,
        createdAt: new Date(),
      };

      reviews.push(newReview);
      localStorage.setItem('fm_edu_reviews', JSON.stringify(reviews));

      setReviewText('');
      setReviewCategory('general');
      setSelectedStudent(null);
      setShowReviewModal(false);
      setError('');
    } catch (error) {
      setError('Ошибка при добавлении отзыва');
    }
  };

  if (loading || !teacher || !classData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-lg text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  const averagePoints = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + (s.totalPoints || 0), 0) / students.length)
    : 0;

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/teacher/classes"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к классам
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{classData.name}</h1>
              {classData.description && (
                <p className="text-sm sm:text-base text-muted-foreground">
                  {classData.description}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Добавить студента</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{students.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Студентов</p>
          </div>

          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{averagePoints}</span>
            </div>
            <p className="text-sm text-muted-foreground">Средний балл</p>
          </div>

          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{teacher.pointsBalance || 0}</span>
            </div>
            <p className="text-sm text-muted-foreground">Баллов доступно</p>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-card border border-border/60 rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Список студентов</h2>
          </div>

          {students.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Нет студентов</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Добавьте первого студента по его ID
              </p>
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Добавить студента
              </button>
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
                    <th className="px-4 py-3 text-left text-sm font-semibold">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.map((student) => (
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
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowPointsModal(true);
                            }}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Начислить баллы"
                          >
                            <Coins className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowReviewModal(true);
                            }}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Оставить отзыв"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <Link href={`/dashboard/teacher/analytics/${student.id}`}>
                            <button
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                              title="Посмотреть аналитику"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-md w-full p-6 border border-border">
            <h2 className="text-xl font-bold mb-4">Добавить студента</h2>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg text-sm bg-destructive/10 border border-destructive/20 text-destructive">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                ID студента *
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="user_123456789_abc"
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-all bg-background border border-border focus:border-primary text-foreground"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Студент может найти свой ID в профиле
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddStudentModal(false);
                  setStudentId('');
                  setError('');
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleAddStudent}
                disabled={!studentId.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Award Points Modal */}
      {showPointsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-md w-full p-6 border border-border">
            <h2 className="text-xl font-bold mb-4">
              Начислить баллы: {selectedStudent.name}
            </h2>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg text-sm bg-destructive/10 border border-destructive/20 text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Количество баллов *
                </label>
                <input
                  type="number"
                  value={pointsAmount}
                  onChange={(e) => setPointsAmount(e.target.value)}
                  min="1"
                  placeholder="100"
                  className="w-full px-4 py-2.5 rounded-lg outline-none transition-all bg-background border border-border focus:border-primary text-foreground"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Доступно: {teacher.pointsBalance || 0} баллов
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Категория *
                </label>
                <input
                  type="text"
                  value={pointsCategory}
                  onChange={(e) => setPointsCategory(e.target.value)}
                  placeholder="За активность на уроке"
                  className="w-full px-4 py-2.5 rounded-lg outline-none transition-all bg-background border border-border focus:border-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Описание (опционально)
                </label>
                <textarea
                  value={pointsDescription}
                  onChange={(e) => setPointsDescription(e.target.value)}
                  placeholder="Дополнительная информация"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg outline-none transition-all bg-background border border-border focus:border-primary text-foreground"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPointsModal(false);
                  setSelectedStudent(null);
                  setPointsAmount('');
                  setPointsCategory('');
                  setPointsDescription('');
                  setError('');
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleAwardPoints}
                disabled={!pointsAmount || !pointsCategory}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Начислить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-md w-full p-6 border border-border">
            <h2 className="text-xl font-bold mb-4">
              Оставить отзыв: {selectedStudent.name}
            </h2>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg text-sm bg-destructive/10 border border-destructive/20 text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Категория
                </label>
                <select
                  value={reviewCategory}
                  onChange={(e) => setReviewCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-lg outline-none border border-border bg-background text-foreground"
                >
                  <option value="general">Общее</option>
                  <option value="homework">Домашнее задание</option>
                  <option value="behavior">Поведение</option>
                  <option value="progress">Прогресс</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Отзыв *
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Напишите ваш отзыв..."
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg outline-none transition-all bg-background border border-border focus:border-primary text-foreground"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedStudent(null);
                  setReviewText('');
                  setReviewCategory('general');
                  setError('');
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleAddReview}
                disabled={!reviewText.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
