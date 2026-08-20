'use client';

import { useState } from 'react';
import { TrendingUp, BarChart3, Calendar, Brain, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ProgressPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');

  // Mock data для графиков
  const weeklyData = [
    { day: 'Пн', score: 85, time: 45 },
    { day: 'Вт', score: 90, time: 60 },
    { day: 'Ср', score: 75, time: 30 },
    { day: 'Чт', score: 95, time: 75 },
    { day: 'Пт', score: 88, time: 50 },
    { day: 'Сб', score: 92, time: 80 },
    { day: 'Вс', score: 87, time: 55 },
  ];

  const subjectPerformance = [
    { subject: 'Математика', score: 92, progress: 85, color: 'bg-blue-500' },
    { subject: 'Физика', score: 88, progress: 75, color: 'bg-purple-500' },
    { subject: 'Химия', score: 85, progress: 70, color: 'bg-green-500' },
    { subject: 'Биология', score: 90, progress: 80, color: 'bg-yellow-500' },
    { subject: 'Информатика', score: 95, progress: 90, color: 'bg-red-500' },
    { subject: 'Английский', score: 87, progress: 78, color: 'bg-indigo-500' },
  ];

  const maxScore = 100;

  // AI анализ от Нави
  const naviAnalysis = {
    strengths: [
      'Отличная успеваемость по Информатике — 95% средний балл',
      'Стабильный прогресс по Математике, растущая динамика',
      'Высокая активность в выходные дни — 80 минут в субботу'
    ],
    weaknesses: [
      'Провал в среду — низкая активность (30 мин) и балл упал до 75%',
      'Химия требует внимания — самый низкий прогресс 70%',
      'Неравномерное распределение нагрузки в течение недели'
    ],
    recommendations: [
      'Сфокусируйся на Химии — пройди дополнительные темы по органике',
      'Планируй учёбу в среду заранее, чтобы не терять динамику',
      'Продолжай в том же духе по Информатике — ты на правильном пути к олимпиаде'
    ],
    overall: 'Жылкыбай, твой общий прогресс впечатляет — 88% средний балл! Ты в топ-15% по региону. Главное — устрани провалы в середине недели и подтяни Химию. Если сохранишь текущий темп, к концу четверти войдёшь в топ-10. Давай, ты можешь! 💪'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/student" className="text-purple-600 hover:underline mb-4 inline-block">
            ← Назад к дашборду
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="w-10 h-10 text-purple-600" />
              Прогресс
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPeriod('week')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === 'week'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 border-2 border-gray-200'
                }`}
              >
                Неделя
              </button>
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === 'month'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 border-2 border-gray-200'
                }`}
              >
                Месяц
              </button>
              <button
                onClick={() => setSelectedPeriod('quarter')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === 'quarter'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 border-2 border-gray-200'
                }`}
              >
                Четверть
              </button>
            </div>
          </div>
        </div>

        {/* Графики */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* График успеваемости */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Успеваемость за неделю
            </h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {weeklyData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-sm font-semibold text-gray-700">{data.score}%</div>
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg relative group cursor-pointer hover:from-blue-600 hover:to-blue-400 transition-colors"
                    style={{ height: `${(data.score / maxScore) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.score}% • {data.time} мин
                    </div>
                  </div>
                  <div className="text-xs font-medium text-gray-600">{data.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* График времени обучения */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-green-600" />
              Время обучения (минуты)
            </h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {weeklyData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-sm font-semibold text-gray-700">{data.time}</div>
                  <div
                    className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg relative group cursor-pointer hover:from-green-600 hover:to-green-400 transition-colors"
                    style={{ height: `${(data.time / 80) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.time} минут
                    </div>
                  </div>
                  <div className="text-xs font-medium text-gray-600">{data.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Успеваемость по предметам */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Успеваемость по предметам</h3>
          <div className="space-y-4">
            {subjectPerformance.map((subject, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{subject.subject}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Средний балл: <span className="font-bold text-gray-900">{subject.score}%</span></span>
                    <span className="text-sm text-gray-600">Прогресс: <span className="font-bold text-gray-900">{subject.progress}%</span></span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${subject.color} rounded-full transition-all duration-500`}
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Анализ от Нави */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 border-2 border-purple-300 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Анализ от AI Нави
                <Sparkles className="w-5 h-5 text-purple-600" />
              </h2>
              <p className="text-sm text-gray-600">Персональная обратная связь на основе твоих данных</p>
            </div>
          </div>

          {/* Общий анализ */}
          <div className="bg-white rounded-lg p-5 mb-6 border-l-4 border-purple-600">
            <p className="text-gray-800 leading-relaxed">{naviAnalysis.overall}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Сильные стороны */}
            <div className="bg-white rounded-lg p-5 border-2 border-green-200">
              <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                <span className="text-2xl">💪</span>
                Твои сильные стороны
              </h3>
              <ul className="space-y-2">
                {naviAnalysis.strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Что требует внимания */}
            <div className="bg-white rounded-lg p-5 border-2 border-orange-200">
              <h3 className="font-bold text-orange-700 mb-3 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                Что требует внимания
              </h3>
              <ul className="space-y-2">
                {naviAnalysis.weaknesses.map((weakness, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-orange-600">!</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Рекомендации */}
            <div className="bg-white rounded-lg p-5 border-2 border-blue-200">
              <h3 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Рекомендации
              </h3>
              <ul className="space-y-2">
                {naviAnalysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-blue-600">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 text-center">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
              Получить детальный план от Нави
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
