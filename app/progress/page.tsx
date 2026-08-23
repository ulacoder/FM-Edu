'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Award,
  Target,
  BookOpen,
  Brain,
  Zap
} from 'lucide-react';
import { getTranslation, type Locale } from '@/lib/i18n';

export default function ProgressPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [locale, setLocale] = useState<Locale>('ru');

  const t = (key: keyof typeof import('@/lib/i18n').translations.ru) => getTranslation(locale, key);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    setIsAuthenticated(true);
    try {
      const user = JSON.parse(userStr);
      setUserName(user.name || '');
    } catch (e) {
      console.error('Error parsing user data:', e);
    }

    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['ru', 'kk', 'en'].includes(savedLocale)) {
      setLocale(savedLocale);
    }

    const handleLocaleChange = (e: CustomEvent<Locale>) => {
      setLocale(e.detail);
    };

    window.addEventListener('localeChange', handleLocaleChange as EventListener);
    return () => window.removeEventListener('localeChange', handleLocaleChange as EventListener);
  }, [router]);

  // Mock данные для аналитики
  const analytics = {
    overallAccuracy: 61,
    readingWritingAvg: 58,
    mathAvg: 63,
    percentile: 74,
    testsCompleted: 9,
    accuracyTrend: 7
  };

  // Данные для радарного графика (сильные и слабые стороны)
  const topicStrengths = [
    { topic: 'Квадратные уравнения', math: 85, verbal: 45 },
    { topic: 'Тригонометрия', math: 72, verbal: 38 },
    { topic: 'Геометрия', math: 90, verbal: 42 },
    { topic: 'Алгебра', math: 78, verbal: 50 },
    { topic: 'Логика', math: 65, verbal: 88 },
    { topic: 'Анализ текста', math: 40, verbal: 92 },
    { topic: 'Грамматика', math: 35, verbal: 85 },
  ];

  // Данные для линейного графика тренда
  const scoreTrend = [
    { date: '16.08', verbal: 45, math: 30, avg: 38 },
    { date: '19.08', verbal: 50, math: 40, avg: 45 },
    { date: '20.08', verbal: 78, math: 48, avg: 63 },
    { date: '21.08', verbal: 80, math: 75, avg: 78 },
    { date: '22.08', verbal: 65, math: 80, avg: 73 },
    { date: '23.08', verbal: 72, math: 85, avg: 79 },
  ];

  // Прогресс по предметам
  const subjectProgress = [
    { name: t('mathematics'), progress: 85, color: 'bg-green-500', level: t('advanced') },
    { name: t('physics'), progress: 72, color: 'bg-blue-500', level: t('intermediate') },
    { name: t('informatics'), progress: 90, color: 'bg-purple-500', level: t('advanced') },
    { name: t('chemistry'), progress: 65, color: 'bg-yellow-500', level: t('intermediate') },
    { name: t('biology'), progress: 78, color: 'bg-pink-500', level: t('intermediate') },
    { name: t('english'), progress: 82, color: 'bg-indigo-500', level: t('advanced') },
  ];

  const renderCircularProgress = (percentage: number, size: number, color: string) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
    );
  };

  const renderRadarChart = () => {
    const centerX = 150;
    const centerY = 150;
    const maxRadius = 120;
    const numPoints = topicStrengths.length;

    const getPoint = (index: number, value: number) => {
      const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
      const radius = (value / 100) * maxRadius;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    };

    const mathPoints = topicStrengths.map((t, i) => getPoint(i, t.math));
    const verbalPoints = topicStrengths.map((t, i) => getPoint(i, t.verbal));

    const mathPath = mathPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
    const verbalPath = verbalPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

    return (
      <svg width="300" height="300" className="mx-auto">
        {/* Grid circles */}
        {[25, 50, 75, 100].map(percent => (
          <circle
            key={percent}
            cx={centerX}
            cy={centerY}
            r={(percent / 100) * maxRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border"
          />
        ))}

        {/* Axis lines */}
        {topicStrengths.map((_, index) => {
          const point = getPoint(index, 100);
          return (
            <line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={point.x}
              y2={point.y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-border"
            />
          );
        })}

        {/* Math polygon */}
        <path
          d={mathPath}
          fill="#10b981"
          fillOpacity="0.3"
          stroke="#10b981"
          strokeWidth="2"
        />

        {/* Verbal polygon */}
        <path
          d={verbalPath}
          fill="#3b82f6"
          fillOpacity="0.3"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Labels */}
        {topicStrengths.map((topic, index) => {
          const labelPoint = getPoint(index, 130);
          return (
            <text
              key={index}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              className="text-[10px] fill-current text-foreground"
            >
              {topic.topic.split(' ')[0]}
            </text>
          );
        })}
      </svg>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">{t('yourAnalytics')}</h1>
            </div>
            <p className="text-muted-foreground">{analytics.testsCompleted} {t('testsCompleted')}</p>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border/60 rounded-2xl p-6 hover:border-primary/40 transition-colors">
              <div className="text-5xl font-bold text-blue-500 mb-2">{analytics.overallAccuracy}%</div>
              <div className="text-sm text-muted-foreground mb-2">{t('overallAccuracy')}</div>
              <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                +{analytics.accuracyTrend}% {t('trend')}
              </div>
            </div>

            <div className="bg-card border border-border/60 rounded-2xl p-6 hover:border-primary/40 transition-colors">
              <div className="text-5xl font-bold text-cyan-500 mb-2">{analytics.readingWritingAvg}%</div>
              <div className="text-sm text-muted-foreground">{t('readingWritingAvg')}</div>
            </div>

            <div className="bg-card border border-border/60 rounded-2xl p-6 hover:border-primary/40 transition-colors">
              <div className="text-5xl font-bold text-green-500 mb-2">{analytics.mathAvg}%</div>
              <div className="text-sm text-muted-foreground">{t('mathAvg')}</div>
            </div>

            <div className="bg-card border border-border/60 rounded-2xl p-6 hover:border-primary/40 transition-colors">
              <div className="text-5xl font-bold text-purple-500 mb-2">{analytics.percentile}%</div>
              <div className="text-sm text-muted-foreground">{t('percentile')}</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Score Trend Over Time */}
            <div className="bg-card border border-border/60 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">{t('scoreTrendOverTime')}</h2>

              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>{t('verbal')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>{t('math')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span>{t('groupAvg')}</span>
                </div>
              </div>

              <div className="relative h-64">
                <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible">
                  {/* Grid lines */}
                  {[0, 20, 40, 60, 80, 100].map(y => (
                    <g key={y}>
                      <line
                        x1="0"
                        y1={200 - (y * 2)}
                        x2="400"
                        y2={200 - (y * 2)}
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-border opacity-30"
                      />
                      <text
                        x="-5"
                        y={200 - (y * 2)}
                        textAnchor="end"
                        className="text-[10px] fill-current text-muted-foreground"
                      >
                        {y}%
                      </text>
                    </g>
                  ))}

                  {/* Lines */}
                  <polyline
                    points={scoreTrend.map((d, i) => `${i * 66 + 40},${200 - d.verbal * 2}`).join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                  />
                  <polyline
                    points={scoreTrend.map((d, i) => `${i * 66 + 40},${200 - d.math * 2}`).join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                  />
                  <polyline
                    points={scoreTrend.map((d, i) => `${i * 66 + 40},${200 - d.avg * 2}`).join(' ')}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />

                  {/* Points */}
                  {scoreTrend.map((d, i) => (
                    <g key={i}>
                      <circle cx={i * 66 + 40} cy={200 - d.verbal * 2} r="4" fill="#3b82f6" />
                      <circle cx={i * 66 + 40} cy={200 - d.math * 2} r="4" fill="#10b981" />
                    </g>
                  ))}

                  {/* X-axis labels */}
                  {scoreTrend.map((d, i) => (
                    <text
                      key={i}
                      x={i * 66 + 40}
                      y="215"
                      textAnchor="middle"
                      className="text-[10px] fill-current text-muted-foreground"
                    >
                      {d.date}
                    </text>
                  ))}
                </svg>
              </div>
            </div>

            {/* Topic Strengths & Weaknesses */}
            <div className="bg-card border border-border/60 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">{t('topicStrengthsWeaknesses')}</h2>

              <div className="flex items-center justify-center gap-6 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>{t('verbal')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>{t('math')}</span>
                </div>
              </div>

              {renderRadarChart()}
            </div>
          </div>

          {/* Subject Progress */}
          <div className="bg-card border border-border/60 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">{t('subjectProgress')}</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectProgress.map(subject => (
                <div key={subject.name} className="relative">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      {renderCircularProgress(subject.progress, 120,
                        subject.progress >= 85 ? '#10b981' :
                        subject.progress >= 70 ? '#3b82f6' : '#f59e0b'
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold">{subject.progress}%</div>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground">{subject.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
