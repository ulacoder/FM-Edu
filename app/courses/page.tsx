"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  PlayCircle,
  FileText,
  ChevronRight,
  TrendingUp,
  Clock,
  Award,
  Brain,
  Sparkles,
  ArrowRight,
  Target
} from "lucide-react";
import type { Subject } from "@/types";
import { subjectNames } from "@/types";
import { getTranslation, type Locale } from "@/lib/i18n";
import { NewFeatureBanner } from "@/components/new-feature-banner";

interface SubjectCard {
  subject: Subject;
  icon: string;
  color: string;
  gradient: string;
  status?: 'available' | 'development' | 'soon';
}

// Показываем только предметы у которых есть контент
const SUBJECTS: SubjectCard[] = [
  { subject: 'mathematics', icon: '📐', color: 'blue', gradient: 'from-blue-500 to-blue-600', status: 'available' },
  { subject: 'physics', icon: '⚛️', color: 'purple', gradient: 'from-purple-500 to-purple-600', status: 'available' },
  { subject: 'informatics', icon: '💻', color: 'green', gradient: 'from-green-500 to-green-600', status: 'development' },
  { subject: 'geography', icon: '🌍', color: 'cyan', gradient: 'from-cyan-500 to-cyan-600', status: 'soon' },
  { subject: 'economics', icon: '💰', color: 'yellow', gradient: 'from-yellow-500 to-yellow-600', status: 'soon' },
  { subject: 'chemistry', icon: '🧪', color: 'red', gradient: 'from-red-500 to-red-600', status: 'soon' },
  { subject: 'biology', icon: '🧬', color: 'emerald', gradient: 'from-emerald-500 to-emerald-600', status: 'soon' },
  { subject: 'english', icon: '🇬🇧', color: 'indigo', gradient: 'from-indigo-500 to-indigo-600', status: 'soon' },
];

export default function CoursesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [topicsCount, setTopicsCount] = useState<Record<string, number>>({});
  const [locale, setLocale] = useState<Locale>('ru');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  const t = (key: keyof typeof import('@/lib/i18n').translations.ru) => getTranslation(locale, key);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    loadTopicsCount();
    loadRecommendations(userData.id);

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

  const loadTopicsCount = async () => {
    try {
      const response = await fetch('/api/topics/count');
      if (response.ok) {
        const data = await response.json();
        setTopicsCount(data.counts);
      }
    } catch (error) {
      console.error('Error loading topics count:', error);
    }
  };

  const loadRecommendations = async (userId: string) => {
    setLoadingRecommendations(true);
    try {
      const response = await fetch(`/api/recommendations?userId=${userId}`);
      const data = await response.json();

      if (data.hasRecommendations && data.recommendations) {
        setRecommendations(data.recommendations.slice(0, 2)); // Показываем топ-2
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      // Временно скрываем блок если API недоступен
      setRecommendations([]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
              <BookOpen className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('coursesTitle')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('coursesSubtitle')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-card border border-border/60 rounded-lg p-6 text-center">
              <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">180</div>
              <div className="text-sm text-muted-foreground">{t('totalTopics')}</div>
            </div>
            <div className="bg-card border border-border/60 rounded-lg p-6 text-center">
              <PlayCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">180</div>
              <div className="text-sm text-muted-foreground">{t('videoLessonsCount')}</div>
            </div>
            <div className="bg-card border border-border/60 rounded-lg p-6 text-center">
              <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">1800</div>
              <div className="text-sm text-muted-foreground">{t('testsCount')}</div>
            </div>
            <div className="bg-card border border-border/60 rounded-lg p-6 text-center">
              <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">{user.totalPoints || 0}</div>
              <div className="text-sm text-muted-foreground">{t('yourPoints')}</div>
            </div>
          </div>

          {/* New Feature Banner */}
          <div className="mb-12">
            <NewFeatureBanner />
          </div>

          {/* AI Recommendations Block - "Для тебя" */}
          <div className="mb-12">
            {loadingRecommendations ? (
              // Loading state
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-center justify-center gap-3 py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                  <p className="text-lg font-medium">AI анализирует твой профиль...</p>
                </div>
              </div>
            ) : recommendations.length > 0 ? (
              // Recommendations loaded
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">✨ Для тебя</h2>
                      <p className="text-white/90 text-sm">AI-подобранные курсы специально под твой уровень</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/recommendations')}
                    className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors font-medium"
                  >
                    Смотреть все
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.map((rec, index) => (
                    <div
                      key={rec.courseId}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                      onClick={() => router.push(`/learn/${rec.courseId}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-400 text-yellow-900' : 'bg-purple-400 text-purple-900'
                          }`}>
                            #{rec.priority}
                          </div>
                          <h3 className="font-bold text-lg">{rec.title}</h3>
                        </div>
                        <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                          <Target className="w-3 h-3" />
                          {rec.matchScore}%
                        </div>
                      </div>

                      <p className="text-sm text-white/90 mb-3 line-clamp-2">
                        {rec.reasoning}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Brain className="w-4 h-4" />
                          <span className="text-white/80">Персонализация</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium">
                          Начать
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // No recommendations - show CTA
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex flex-col items-center text-center gap-6 py-4">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-10 h-10" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold mb-3">✨ Персональные рекомендации</h2>
                    <p className="text-white/90 text-lg max-w-2xl mx-auto mb-2">
                      AI проанализирует твой профиль, диагностику и прогресс, чтобы подобрать идеальные курсы специально для тебя
                    </p>
                    <p className="text-white/70 text-sm">
                      Учитывается твой MBTI, цели, слабые места и успеваемость
                    </p>
                  </div>

                  <div className="flex gap-4 flex-wrap justify-center">
                    <button
                      onClick={() => router.push('/dashboard/recommendations')}
                      className="flex items-center gap-2 px-8 py-4 bg-white text-purple-600 hover:bg-white/90 rounded-xl transition-colors font-bold text-lg shadow-xl"
                    >
                      <Sparkles className="w-5 h-5" />
                      Получить рекомендации
                    </button>
                    <button
                      onClick={() => router.push('/diagnostic')}
                      className="flex items-center gap-2 px-8 py-4 bg-white/20 hover:bg-white/30 rounded-xl transition-colors font-medium text-lg border-2 border-white/30"
                    >
                      <Target className="w-5 h-5" />
                      Пройти диагностику
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full max-w-3xl">
                    <div className="bg-white/10 rounded-lg p-4 text-center border border-white/20">
                      <Brain className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Анализ MBTI</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center border border-white/20">
                      <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Учет прогресса</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center border border-white/20">
                      <Target className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Под твои цели</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Школьная программа РК */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              {t('schoolProgram')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SUBJECTS.map((subjectCard) => {
              const count = topicsCount[subjectCard.subject] || 0;
              const isSelected = user.selectedSubjects?.includes(subjectCard.subject);
              const isDisabled = subjectCard.status === 'soon';
              const isDev = subjectCard.status === 'development';

              const statusBadge = subjectCard.status === 'available'
                ? <span className="absolute top-3 left-3 px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-full">✓ {t('available')}</span>
                : subjectCard.status === 'development'
                ? <span className="absolute top-3 left-3 px-2 py-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-bold rounded-full">⚠ {t('development')}</span>
                : <span className="absolute top-3 left-3 px-2 py-1 bg-gray-500/20 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-full">⏳ {t('soon')}</span>;

              return (
                <button
                  key={subjectCard.subject}
                  onClick={() => {
                    if (isDisabled) {
                      router.push(`/courses/coming-soon?course=${subjectCard.subject}`);
                    } else {
                      router.push(`/courses/${subjectCard.subject}`);
                    }
                  }}
                  className={`group relative bg-card border-2 rounded-xl p-6 transition-all ${
                    isDisabled
                      ? 'opacity-75 cursor-pointer hover:scale-105 hover:shadow-lg border-dashed'
                      : isDev
                      ? 'hover:scale-105 hover:shadow-xl border-border hover:border-yellow-400'
                      : 'hover:scale-105 hover:shadow-xl border-border hover:border-primary'
                  } ${
                    isSelected && !isDisabled
                      ? `border-${subjectCard.color}-500`
                      : ''
                  }`}
                >
                  {/* Status Badge */}
                  {statusBadge}

                  {/* Selected Badge */}
                  {isSelected && !isDisabled && (
                    <div className={`absolute top-3 right-3 px-2 py-1 bg-gradient-to-r ${subjectCard.gradient} text-white text-xs font-bold rounded-full`}>
                      ⭐ {t('selected')}
                    </div>
                  )}

                  {/* Icon */}
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform mt-6">
                    {subjectCard.icon}
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold mb-3">
                    {subjectNames[subjectCard.subject]}
                  </h3>

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      <span>{count} {t('topics')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="w-4 h-4" />
                      <span>7-12 {t('class')}</span>
                    </div>
                  </div>

                  {/* Action */}
                  {!isDisabled && (
                    <div className="flex items-center justify-between text-primary font-medium">
                      <span>{t('openCourse')}</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                  {isDisabled && (
                    <div className="text-sm font-medium text-center text-purple-600 dark:text-purple-400">
                      Узнать больше →
                    </div>
                  )}
                  {isDev && (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 text-center mt-2">
                      {t('possibleErrors')}
                    </div>
                  )}
                </button>
              );
            })}
            </div>
          </div>

          {/* SAT Подготовка */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              {t('satPreparation')}
              <span className="text-sm font-normal text-muted-foreground ml-2">({t('soon').toLowerCase()})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SAT Math */}
              <button
                onClick={() => router.push('/courses/coming-soon?course=sat-math')}
                className="group relative bg-card border-2 border-dashed border-border/60 rounded-xl p-6 opacity-75 hover:opacity-100 hover:scale-105 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="text-6xl mb-4">🧮</div>
                <h3 className="text-xl font-bold mb-3">{t('satMath')}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>{t('satMathDesc')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{t('inDevelopment')}</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-center text-purple-600 dark:text-purple-400">
                  Узнать больше →
                </div>
              </button>

              {/* SAT English */}
              <button
                onClick={() => router.push('/courses/coming-soon?course=sat-english')}
                className="group relative bg-card border-2 border-dashed border-border/60 rounded-xl p-6 opacity-75 hover:opacity-100 hover:scale-105 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold mb-3">{t('satEnglish')}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>{t('satEnglishDesc')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{t('inDevelopment')}</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-center text-purple-600 dark:text-purple-400">
                  Узнать больше →
                </div>
              </button>
            </div>
          </div>

          {/* AI Recommendation */}
          {user.weakTopics && user.weakTopics.length > 0 && (
            <div className="mt-12 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Brain className="w-12 h-12 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-orange-900">
                    🎯 {t('aiRecommendations')}
                  </h3>
                  <p className="text-orange-800 mb-4">
                    {t('aiRecommendationsDesc')}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {user.weakTopics.slice(0, 3).map((weakTopic: any) => (
                      <button
                        key={weakTopic.topicId}
                        onClick={() => router.push(`/courses/${weakTopic.subject}`)}
                        className="bg-white border-2 border-orange-300 rounded-lg p-4 text-left hover:border-orange-500 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-orange-900">
                            {subjectNames[weakTopic.subject as Subject]}
                          </span>
                          <TrendingUp className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="text-sm text-orange-700 mb-2">
                          {weakTopic.topicName}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-orange-600">
                          <Clock className="w-3 h-3" />
                          <span>{t('weakness')}: {weakTopic.weaknessLevel}%</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
