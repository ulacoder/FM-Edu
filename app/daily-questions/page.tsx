'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flame, Check, X, ChevronRight, Trophy, Target } from 'lucide-react';
import {
  DailyQuestionSet,
  DailyQuestion,
  UserStreak,
  POINTS_PER_CORRECT,
  BONUS_FOR_DAILY_COMPLETION,
} from '@/types/daily-questions';
import {
  generateDailyQuestionSet,
  submitDailyAnswer,
  getStreak,
  getTodaySet,
} from '@/lib/daily-questions';

export default function DailyQuestionsPage() {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dailySet, setDailySet] = useState<DailyQuestionSet | null>(null);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answerResult, setAnswerResult] = useState<{
    correct: boolean;
    pointsEarned: number;
    explanation: string;
    formula?: string;
  } | null>(null);
  const [celebrateMilestone, setCelebrateMilestone] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'student') {
      router.push('/dashboard/teacher');
      return;
    }

    setStudent(user);

    // Загружаем или генерируем сет на сегодня
    let todaySet = getTodaySet(user.id);
    if (!todaySet) {
      todaySet = generateDailyQuestionSet(user.id);
    }
    setDailySet(todaySet);

    // Загружаем streak
    const userStreak = getStreak(user.id);
    setStreak(userStreak);

    // Если сет завершен, показываем статистику
    if (todaySet.status === 'completed') {
      setCurrentQuestionIndex(todaySet.questions.length);
    } else {
      // Продолжаем с первого невыполненного
      setCurrentQuestionIndex(todaySet.completedQuestions.length);
    }

    setLoading(false);
  }, [router]);

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    if (!dailySet || !selectedAnswer) return;

    const currentQuestion = dailySet.questions[currentQuestionIndex];
    const result = submitDailyAnswer(dailySet.id, currentQuestion.id, selectedAnswer);

    setAnswerResult(result);
    setShowResult(true);

    // Обновляем сет
    const updatedSet = getTodaySet(student.id);
    setDailySet(updatedSet);

    // Если сет завершен, обновляем streak и проверяем milestone
    if (updatedSet?.status === 'completed') {
      const updatedStreak = getStreak(student.id);
      setStreak(updatedStreak);

      // Проверяем, был ли достигнут новый milestone
      const lastMilestone = updatedStreak?.streakMilestones[updatedStreak.streakMilestones.length - 1];
      if (lastMilestone && new Date(lastMilestone.unlockedAt).toDateString() === new Date().toDateString()) {
        setCelebrateMilestone(lastMilestone.days);
      }
    }
  };

  const handleNextQuestion = () => {
    if (!dailySet) return;

    setShowResult(false);
    setSelectedAnswer(null);
    setAnswerResult(null);

    if (currentQuestionIndex + 1 < dailySet.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Все вопросы пройдены
      setCurrentQuestionIndex(dailySet.questions.length);
    }
  };

  if (loading || !dailySet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-lg text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  const currentQuestion = dailySet.questions[currentQuestionIndex];
  const progress = (dailySet.completedQuestions.length / dailySet.questions.length) * 100;
  const isCompleted = dailySet.status === 'completed';

  // Экран завершения
  if (isCompleted || currentQuestionIndex >= dailySet.questions.length) {
    const correctCount = Object.values(dailySet.answers).filter((a) => a.correct).length;
    const accuracy = Math.round((correctCount / dailySet.questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          {/* Milestone Celebration */}
          {celebrateMilestone && (
            <div className="mb-12 p-8 rounded-2xl bg-yellow-500/20 border-4 border-yellow-400 text-center animate-bounce">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-5xl font-black mb-4">🎉 Новое достижение!</h2>
              <p className="text-3xl mb-4">
                Серия {celebrateMilestone} {celebrateMilestone === 3 ? 'дня' : 'дней'}! 🔥
              </p>
              <p className="text-xl text-gray-300">
                Бонус:{' '}
                <span className="text-yellow-400 font-bold">
                  +{streak?.streakMilestones.find((m) => m.days === celebrateMilestone)?.bonusPoints} баллов
                </span>
              </p>
            </div>
          )}

          {/* Success Card */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
              <h1 className="text-6xl font-black bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500 bg-clip-text text-transparent">
                Отличная работа!
              </h1>
              <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
            </div>
            <p className="text-2xl text-gray-300 mb-2">Вы завершили вопросы дня</p>
            <div className="flex items-center justify-center gap-2 text-yellow-400 text-3xl font-bold">
              <Flame className="w-8 h-8" />
              Серия: {streak?.currentStreak || 1} {streak?.currentStreak === 1 ? 'день' : 'дней'}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-xl bg-green-600/20 border-2 border-green-500 text-center">
              <Check className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <div className="text-4xl font-bold mb-1">{correctCount}/{dailySet.questions.length}</div>
              <div className="text-gray-300">Правильных ответов</div>
            </div>
            <div className="p-6 rounded-xl bg-blue-600/20 border-2 border-blue-500 text-center">
              <Target className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <div className="text-4xl font-bold mb-1">{accuracy}%</div>
              <div className="text-gray-300">Точность</div>
            </div>
            <div className="p-6 rounded-xl bg-yellow-600/20 border-2 border-yellow-500 text-center">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <div className="text-4xl font-bold mb-1">+{dailySet.totalPoints}</div>
              <div className="text-gray-300">Баллов заработано</div>
            </div>
          </div>

          {/* Points Breakdown */}
          <div className="mb-12 p-6 rounded-xl bg-gray-800/50 border-2 border-gray-700">
            <h3 className="text-2xl font-bold mb-4">Разбор баллов</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg">За правильные ответы ({correctCount} × {POINTS_PER_CORRECT})</span>
                <span className="text-xl font-bold text-green-400">+{correctCount * POINTS_PER_CORRECT}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg">Бонус за завершение дня</span>
                <span className="text-xl font-bold text-yellow-400">+{BONUS_FOR_DAILY_COMPLETION}</span>
              </div>
              {celebrateMilestone && (
                <div className="flex items-center justify-between">
                  <span className="text-lg">Бонус за серию {celebrateMilestone} дней 🔥</span>
                  <span className="text-xl font-bold text-yellow-400">
                    +{streak?.streakMilestones.find((m) => m.days === celebrateMilestone)?.bonusPoints}
                  </span>
                </div>
              )}
              <div className="pt-3 border-t-2 border-gray-600 flex items-center justify-between">
                <span className="text-xl font-bold">Итого</span>
                <span className="text-3xl font-black text-yellow-400">+{dailySet.totalPoints}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-6">
            <Link href="/dashboard/student">
              <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-xl font-semibold transition-colors">
                Вернуться к дашборду
              </button>
            </Link>
          </div>

          <div className="mt-8 text-center text-gray-400 text-sm">
            Возвращайтесь завтра за новыми вопросами! 🚀
          </div>
        </div>
      </div>
    );
  }

  // Основной экран вопросов
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/student"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Вернуться к дашборду
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Вопросы дня 📚</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Закрепите пробелы за 5 минут
              </p>
            </div>
            {streak && streak.currentStreak > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 border-2 border-orange-500 rounded-xl">
                <Flame className="w-6 h-6 text-orange-500" />
                <div className="text-center">
                  <div className="text-2xl font-black text-orange-500">{streak.currentStreak}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">дней</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Вопрос {currentQuestionIndex + 1} из {dailySet.questions.length}
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-card border border-border/60 rounded-lg p-6 mb-6">
          <div className="mb-2 text-xs font-medium text-primary">
            {currentQuestion.topicName}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-6">{currentQuestion.question}</h2>

          {/* Answer Options */}
          {!showResult && (
            <div className="space-y-3 mb-6">
              {(['A', 'B', 'C', 'D'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedAnswer === option
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${
                        selectedAnswer === option ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      {option}
                    </div>
                    <div className="text-base font-medium flex-1">
                      {currentQuestion.options[option]}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Result Display */}
          {showResult && answerResult && (
            <div
              className={`p-6 rounded-xl border-2 mb-6 ${
                answerResult.correct
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-red-500 bg-red-500/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                {answerResult.correct ? (
                  <>
                    <Check className="w-8 h-8 text-green-500" />
                    <span className="text-2xl font-bold text-green-500">Правильно!</span>
                  </>
                ) : (
                  <>
                    <X className="w-8 h-8 text-red-500" />
                    <span className="text-2xl font-bold text-red-500">Неправильно</span>
                  </>
                )}
              </div>

              {answerResult.correct && (
                <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
                  +{answerResult.pointsEarned} баллов
                </div>
              )}

              <div className="mb-3">
                <span className="font-semibold">Правильный ответ: </span>
                <span className="text-primary font-bold">{currentQuestion.correctAnswer}</span>
              </div>

              <div className="mb-3">
                <span className="font-semibold">Объяснение:</span>
                <p className="text-muted-foreground mt-1">{answerResult.explanation}</p>
              </div>

              {answerResult.formula && (
                <div className="p-3 bg-muted rounded-lg">
                  <span className="font-semibold">Формула: </span>
                  <code className="text-sm">{answerResult.formula}</code>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-center">
            {!showResult ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!selectedAnswer}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
              >
                Проверить
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-semibold flex items-center gap-2"
              >
                {currentQuestionIndex + 1 < dailySet.questions.length ? (
                  <>
                    Следующий вопрос
                    <ChevronRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Завершить
                    <Check className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
          <div className="font-semibold mb-2">💡 Как это работает:</div>
          <ul className="space-y-1 ml-4">
            <li>• За каждый правильный ответ: +{POINTS_PER_CORRECT} баллов</li>
            <li>• За завершение всех вопросов: +{BONUS_FOR_DAILY_COMPLETION} баллов (бонус)</li>
            <li>• Серия дней 🔥: выполняйте каждый день без перерывов для бонусов</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
