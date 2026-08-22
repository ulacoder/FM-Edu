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
  Brain
} from "lucide-react";
import type { Subject } from "@/types";
import { subjectNames } from "@/types";
import { getTranslation, type Locale } from "@/lib/i18n";

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

  const t = (key: keyof typeof import('@/lib/i18n').translations.ru) => getTranslation(locale, key);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userStr));
    loadTopicsCount();

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
                  onClick={() => !isDisabled && router.push(`/courses/${subjectCard.subject}`)}
                  disabled={isDisabled}
                  className={`group relative bg-card border-2 rounded-xl p-6 transition-all ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed'
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
                    <div className="text-sm text-muted-foreground text-center">
                      {t('contentInProgress')}
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
              <div className="group relative bg-card border-2 border-dashed border-border/60 rounded-xl p-6 opacity-60">
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
              </div>

              {/* SAT English */}
              <div className="group relative bg-card border-2 border-dashed border-border/60 rounded-xl p-6 opacity-60">
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
              </div>
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
