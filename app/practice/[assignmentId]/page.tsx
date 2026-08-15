'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Assignment, StudentAnswer } from '@/types';

export default function PracticePage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.assignmentId as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    maxScore: number;
    percentage: number;
    answers: StudentAnswer[];
  } | null>(null);

  useEffect(() => {
    if (assignmentId) {
      loadAssignment();
    }
  }, [assignmentId]);

  const loadAssignment = async () => {
    try {
      const response = await fetch(`/api/assignments/${assignmentId}`);
      if (response.ok) {
        const data = await response.json();
        setAssignment(data);
        setAnswers(new Array(data.questions.length).fill(-1));
      } else {
        // Если эндпоинт не существует, получаем из базы напрямую
        // Для MVP используем mock данные
        alert('Задание не найдено');
        router.push('/dashboard/student');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading assignment:', error);
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (assignment?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/assignments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ assignmentId, answers }),
      });

      if (!response.ok) {
        alert('Ошибка отправки результатов');
        setSubmitting(false);
        return;
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert('Ошибка соединения');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Задание не найдено</div>
      </div>
    );
  }

  // Результаты
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {result.percentage >= 80 ? '🎉' : result.percentage >= 60 ? '👍' : '💪'}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Задание выполнено!
              </h1>
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {result.score} / {result.maxScore}
              </div>
              <div className="text-xl text-gray-600">
                {result.percentage}% правильных ответов
              </div>
            </div>

            {/* Разбор ответов */}
            <div className="space-y-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Разбор заданий</h2>
              {result.answers.map((answer, index) => {
                const question = assignment.questions[index];
                return (
                  <div
                    key={question.id}
                    className={`border-2 rounded-lg p-6 ${
                      answer.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`text-2xl ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {answer.isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Вопрос {index + 1}: {question.text}
                        </h3>
                        {question.options && (
                          <div className="space-y-2 mb-3">
                            <div className="text-sm">
                              <span className="font-medium">Ваш ответ: </span>
                              <span className={answer.isCorrect ? 'text-green-700' : 'text-red-700'}>
                                {question.options[parseInt(answer.answer)]}
                              </span>
                            </div>
                            {!answer.isCorrect && (
                              <div className="text-sm">
                                <span className="font-medium">Правильный ответ: </span>
                                <span className="text-green-700">
                                  {question.options[question.correctAnswer as number]}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="bg-white rounded p-4 text-sm text-gray-700">
                          <span className="font-medium">💡 Объяснение: </span>
                          {answer.aiFeedback || question.explanation}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <Link
                href={`/learn/${assignment.topicId}`}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg text-center hover:bg-gray-300"
              >
                Вернуться к теме
              </Link>
              <Link
                href="/dashboard/student"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700"
              >
                К дашборду
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Прохождение теста
  const question = assignment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assignment.questions.length) * 100;
  const allAnswered = !answers.includes(-1);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">{assignment.title}</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Прогресс */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Вопрос {currentQuestion + 1} из {assignment.questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Вопрос */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
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
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
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
                className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Назад
              </button>

              <div className="text-sm text-gray-500">
                {answers.filter(a => a !== -1).length} / {assignment.questions.length} ответов
              </div>

              {currentQuestion === assignment.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {submitting ? 'Отправка...' : 'Завершить'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
