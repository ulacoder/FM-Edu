'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Coins, TrendingUp, MessageSquare, Calendar } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  grade: number;
  totalPoints: number;
  region?: string;
  mbtiType?: string;
  goals?: string[];
}

interface Transaction {
  id: string;
  teacherId: string;
  studentId: string;
  amount: number;
  category: string;
  description?: string;
  createdAt: Date;
}

interface Review {
  id: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  text: string;
  category: 'homework' | 'behavior' | 'progress' | 'general';
  createdAt: Date;
}

export default function StudentAnalyticsPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params?.studentId as string;

  const [teacher, setTeacher] = useState<any>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
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
    loadStudentData(studentId);
  }, [router, studentId]);

  const loadStudentData = (studentId: string) => {
    try {
      const usersStr = localStorage.getItem('fm_edu_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      const foundStudent = users.find((u: any) => u.id === studentId && u.role === 'student');

      if (!foundStudent) {
        router.push('/dashboard/teacher/classes');
        return;
      }

      setStudent(foundStudent);

      const transactionsStr = localStorage.getItem('fm_edu_transactions');
      const allTransactions = transactionsStr ? JSON.parse(transactionsStr) : [];
      const studentTransactions = allTransactions.filter((t: Transaction) => t.studentId === studentId);
      setTransactions(studentTransactions.sort((a: Transaction, b: Transaction) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));

      const reviewsStr = localStorage.getItem('fm_edu_reviews');
      const allReviews = reviewsStr ? JSON.parse(reviewsStr) : [];
      const studentReviews = allReviews.filter((r: Review) => r.studentId === studentId);
      setReviews(studentReviews.sort((a: Review, b: Review) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));

      setLoading(false);
    } catch (error) {
      console.error('Error loading student data:', error);
      setLoading(false);
    }
  };

  if (loading || !teacher || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-lg text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  const totalPointsReceived = transactions.reduce((sum, t) => sum + t.amount, 0);
  const categoryBreakdown = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500'
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'homework':
        return 'bg-blue-100 text-blue-700';
      case 'behavior':
        return 'bg-green-100 text-green-700';
      case 'progress':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

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
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Аналитика: {student.name}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {student.email} • {student.grade} класс
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">ID студента</div>
              <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
                {student.id}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{student.totalPoints || 0}</span>
            </div>
            <p className="text-sm text-muted-foreground">Всего баллов</p>
          </div>

          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{totalPointsReceived}</span>
            </div>
            <p className="text-sm text-muted-foreground">Получено от учителей</p>
          </div>

          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{transactions.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Транзакций</p>
          </div>

          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{reviews.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Отзывов</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Student Info */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border/60 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{student.name}</h3>
                  <p className="text-sm text-muted-foreground">{student.grade} класс</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Email</div>
                  <div className="text-sm font-medium">{student.email}</div>
                </div>

                {student.region && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Регион</div>
                    <div className="text-sm font-medium">{student.region}</div>
                  </div>
                )}

                {student.mbtiType && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">MBTI тип</div>
                    <div className="text-sm font-medium">{student.mbtiType}</div>
                  </div>
                )}

                {student.goals && student.goals.length > 0 && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Цели обучения</div>
                    <div className="flex flex-wrap gap-2">
                      {student.goals.map((goal, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category Breakdown */}
            {Object.keys(categoryBreakdown).length > 0 && (
              <div className="bg-card border border-border/60 rounded-lg p-6 mt-6">
                <h3 className="font-semibold mb-4">Баллы по категориям</h3>
                <div className="space-y-3">
                  {Object.entries(categoryBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, points], idx) => (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm font-bold">{points}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${categoryColors[idx % categoryColors.length]}`}
                            style={{
                              width: `${(points / totalPointsReceived) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Transactions and Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Transactions */}
            <div className="bg-card border border-border/60 rounded-lg p-6">
              <h3 className="font-semibold mb-4">История начислений</h3>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Coins className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Нет начислений</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 10).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-start justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <div className="flex-1">
                        <div className="font-medium mb-1">{transaction.category}</div>
                        {transaction.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {transaction.description}
                          </p>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="text-lg font-bold text-primary">
                          +{transaction.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-card border border-border/60 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Отзывы от учителей</h3>
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Нет отзывов</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-lg bg-muted/30 border border-border/40"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium">{review.teacherName}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${getCategoryBadgeColor(review.category)}`}>
                          {review.category === 'homework' ? 'Домашка' :
                           review.category === 'behavior' ? 'Поведение' :
                           review.category === 'progress' ? 'Прогресс' : 'Общее'}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{review.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
