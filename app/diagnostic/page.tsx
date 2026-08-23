'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { Subject, subjectNames, DiagnosticTest } from '@/types';

export default function DiagnosticPage() {
  const router = useRouter();
  const [step, setStep] = useState<'select' | 'test' | 'result'>('select');
  const [subject, setSubject] = useState<Subject>('mathematics');
  const [grade, setGrade] = useState(7);
  const [test, setTest] = useState<DiagnosticTest | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleStartTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/diagnostic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, grade }),
      });

      if (!response.ok) {
        alert('Ошибка генерации теста');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setTest(data);
      setAnswers(new Array(data.questions.length).fill(-1));
      setStep('test');
    } catch (error) {
      alert('Ошибка соединения');
    }
    setLoading(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (test?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/diagnostic/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ testId: test?.id, answers }),
      });

      if (!response.ok) {
        alert('Ошибка отправки результатов');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setResult(data);
      setStep('result');
    } catch (error) {
      alert('Ошибка соединения');
    }
    setLoading(false);
  };

  // Шаг 1: Выбор предмета и класса
  if (step === 'select') {
    return (
      <div className="min-h-screen flex flex-col">{/* Content */}
        <div className="flex-1 py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border/60 rounded-lg p-8 shadow-lg">
              <h1 className="text-3xl font-bold mb-2">Диагностика уровня знаний</h1>
              <p className="text-muted-foreground mb-8">
                Пройдите короткий тест, чтобы мы могли подобрать материалы под ваш уровень
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Выберите предмет
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as Subject)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  >
                    {Object.entries(subjectNames).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ваш класс
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  >
                    {[7, 8, 9, 10, 11, 12].map(g => (
                      <option key={g} value={g}>{g} класс</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleStartTest}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Генерация теста...' : 'Начать диагностику'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Шаг 2: Прохождение теста
  if (step === 'test' && test) {
    const question = test.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / test.questions.length) * 100;

    return (
      <div className="min-h-screen flex flex-col">{/* Content */}
        <div className="flex-1 py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card border border-border/60 rounded-lg p-8 shadow-lg">
              {/* Прогресс */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Вопрос {currentQuestion + 1} из {test.questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Вопрос */}
              <h2 className="text-2xl font-bold mb-6">
                {question.text}
              </h2>

              {/* Варианты ответа */}
              <div className="space-y-3 mb-8">
                {question.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left px-6 py-4 border-2 rounded-lg transition-all ${
                      answers[currentQuestion] === index
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                ))}
              </div>

              {/* Навигация */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2 border border-border rounded-lg disabled:opacity-50 hover:bg-muted transition-colors"
                >
                  Назад
                </button>

                {currentQuestion === test.questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={answers.includes(-1) || loading}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Отправка...' : 'Завершить'}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Далее
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Шаг 3: Результаты
  if (step === 'result' && result) {
    const levelText: Record<string, string> = {
      beginner: 'Начальный',
      intermediate: 'Средний',
      advanced: 'Продвинутый',
    };
    const displayLevel = levelText[result.level] || 'Не определён';

    // Генерация мок-анализа на основе результата
    const getAnalysis = () => {
      if (result.score >= 75) {
        return "Отлично справился с диагностикой! Твои знания на высоком уровне. Особенно хорошо у тебя идут основные темы - продолжай в том же духе! Советую перейти к более сложным задачам и олимпиадным заданиям. У тебя большой потенциал! 🎯";
      } else if (result.score >= 50) {
        return "Хороший результат! Ты показал средний уровень знаний, это отличная база для дальнейшего роста. Обрати внимание на темы, где были ошибки - повтори теорию и порешай задачки. Практика делает мастера! 💪";
      } else {
        return "Не переживай, это только начало! Диагностика показала темы, над которыми нужно поработать. Советую начать с базовых тем и постепенно двигаться дальше. Главное - практика и регулярные занятия. Ты точно справишься! 🚀";
      }
    };

    return (
      <div className="min-h-screen flex flex-col">{/* Content */}
        <div className="flex-1 py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border/60 rounded-lg p-8 shadow-lg text-center">
              <div className="text-6xl mb-4">
                {result.score >= 75 ? '🎉' : result.score >= 50 ? '👍' : '💪'}
              </div>
              <h1 className="text-3xl font-bold mb-2">
                Диагностика завершена!
              </h1>
              <p className="text-muted-foreground mb-8">
                Ваш результат: {result.correctCount} из {result.totalQuestions} правильных ответов
              </p>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
                <div className="text-4xl font-bold text-primary mb-2">
                  {Math.round(result.score)}%
                </div>
                <div className="text-lg">
                  Ваш уровень: <span className="font-semibold">{displayLevel}</span>
                </div>
              </div>

              {/* AI Анализ */}
              <div className="bg-card border border-border rounded-lg p-6 mb-8 text-left shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-foreground">Анализ от AI-преподавателя</h3>
                    <p className="text-foreground leading-relaxed">
                      {getAnalysis()}
                    </p>
                  </div>
                </div>
              </div>

              {result.weakTopics.length > 0 && (
                <div className="text-left mb-8 bg-card border border-border rounded-lg p-5 shadow-sm">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                    <span className="text-xl">📚</span>
                    Рекомендуем повторить:
                  </h3>
                  <ul className="space-y-2 text-foreground">
                    {result.weakTopics.slice(0, 3).map((topic: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => router.push('/dashboard/student')}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Перейти к обучению
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
