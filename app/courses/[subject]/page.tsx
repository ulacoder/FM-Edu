"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  ArrowLeft,
  ChevronRight,
  Lock,
  CheckCircle,
  Clock,
  Award,
  PlayCircle,
  FileText
} from "lucide-react";
import type { Subject } from "@/types";
import { subjectNames } from "@/types";
import { MATH_LESSON_MAP } from "@/lib/math-lesson-map";
import { PHYSICS_LESSON_MAP } from "@/lib/physics-lesson-map";
import { INFORMATICS_LESSON_MAP } from "@/lib/informatics-lesson-map";

interface Topic {
  id: string;
  subject: Subject;
  grade: number;
  quarter: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  order: number;
  keywords?: string[];
}

interface Progress {
  topicId: string;
  completed: boolean;
  testScore?: number;
  videoWatched: boolean;
}

const SUBJECT_COLORS: Record<string, string> = {
  mathematics: 'blue',
  physics: 'purple',
  english: 'pink',
  informatics: 'green',
  chemistry: 'orange',
  biology: 'emerald',
  economics: 'yellow',
  geography: 'cyan'
};

export default function SubjectCoursePage() {
  const params = useParams();
  const router = useRouter();
  const subject = params.subject as Subject;

  const [user, setUser] = useState<any>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState<number | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  const color = SUBJECT_COLORS[subject] || 'primary';

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userStr));
    loadProgress(JSON.parse(userStr).id);
  }, [router]);

  useEffect(() => {
    if (selectedGrade && selectedQuarter) {
      loadTopics();
    }
  }, [selectedGrade, selectedQuarter]);

  const loadProgress = (studentId: string) => {
    const saved = localStorage.getItem(`progress_${studentId}_${subject}`);
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  };

  const loadTopics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/topics?subject=${subject}&grade=${selectedGrade}&quarter=${selectedQuarter}`);
      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics);
      }
    } catch (error) {
      console.error('Error loading topics:', error);
    }
    setLoading(false);
  };

  const getTopicProgress = (topicId: string): Progress | undefined => {
    return progress.find(p => p.topicId === topicId);
  };

  const isTopicUnlocked = (topic: Topic): boolean => {
    if (topic.order === 1) return true;

    const prevTopic = topics.find(t => t.order === topic.order - 1);
    if (!prevTopic) return true;

    const prevProgress = getTopicProgress(prevTopic.id);
    return prevProgress?.completed || false;
  };

  const getTotalProgress = () => {
    if (topics.length === 0) return 0;
    const completed = topics.filter(t => getTopicProgress(t.id)?.completed).length;
    return Math.round((completed / topics.length) * 100);
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/courses')}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Назад к курсам</span>
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {subjectNames[subject]}
                </h1>
                <p className="text-lg text-muted-foreground">
                  Выберите класс и четверть для начала обучения
                </p>
              </div>

              {selectedGrade && selectedQuarter && (
                <div className="bg-card border border-border/60 rounded-lg p-4 min-w-[200px]">
                  <div className="text-sm text-muted-foreground mb-1">Прогресс</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`bg-${color}-500 h-3 rounded-full transition-all`}
                          style={{ width: `${getTotalProgress()}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{getTotalProgress()}%</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grade and Quarter Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Grade Selection */}
            <div className="bg-card border-2 border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                Выберите класс
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[7, 8, 9, 10, 11, 12].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => {
                      setSelectedGrade(grade);
                      setSelectedQuarter(null);
                      setTopics([]);
                    }}
                    className={`p-4 rounded-lg font-bold text-lg transition-all ${
                      selectedGrade === grade
                        ? `bg-${color}-500 text-white shadow-lg scale-105`
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            {/* Quarter Selection */}
            <div className={`bg-card border-2 rounded-lg p-6 ${selectedGrade ? 'border-border' : 'border-dashed border-border/40 opacity-50'}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Выберите четверть
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((quarter) => (
                  <button
                    key={quarter}
                    disabled={!selectedGrade}
                    onClick={() => setSelectedQuarter(quarter)}
                    className={`p-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedQuarter === quarter
                        ? `bg-${color}-500 text-white shadow-lg scale-105`
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {quarter} четверть
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Topics List */}
          {selectedGrade && selectedQuarter && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Темы: {selectedGrade} класс, {selectedQuarter} четверть
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="w-4 h-4" />
                  <span>
                    Пройдено: {topics.filter(t => getTopicProgress(t.id)?.completed).length} из {topics.length}
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-muted-foreground">Загрузка тем...</p>
                </div>
              ) : topics.length === 0 ? (
                <div className="text-center py-12 bg-card border border-border/60 rounded-lg">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">Темы для этой четверти скоро появятся</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topics.map((topic, index) => {
                    const topicProgress = getTopicProgress(topic.id);
                    const isUnlocked = isTopicUnlocked(topic);
                    const isCompleted = topicProgress?.completed || false;

                    return (
                      <div
                        key={topic.id}
                        className={`group bg-card border-2 rounded-lg p-6 transition-all ${
                          isUnlocked
                            ? isCompleted
                              ? 'border-green-500 bg-green-50/50'
                              : 'border-border hover:border-primary hover:shadow-lg cursor-pointer'
                            : 'border-dashed border-border/40 opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => {
                          if (!isUnlocked) return;
                          // For mathematics and physics, use static pages
                          if (subject === 'mathematics' && MATH_LESSON_MAP[topic.id]) {
                            router.push(MATH_LESSON_MAP[topic.id]);
                          } else if (subject === 'physics' && PHYSICS_LESSON_MAP[topic.id]) {
                            router.push(PHYSICS_LESSON_MAP[topic.id]);
                          } else if (subject === 'informatics' && INFORMATICS_LESSON_MAP[topic.id]) {
                            router.push(INFORMATICS_LESSON_MAP[topic.id]);
                          } else {
                            router.push(`/courses/${subject}/${topic.id}`);
                          }
                        }}
                      >
                        <div className="flex items-start gap-4">
                          {/* Number Badge */}
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : isUnlocked
                              ? `bg-${color}-500 text-white`
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {isCompleted ? <CheckCircle className="w-6 h-6" /> : index + 1}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-bold">{topic.title}</h3>
                              {!isUnlocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                              {isCompleted && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Завершено</span>
                                </div>
                              )}
                            </div>

                            <p className="text-muted-foreground mb-3">{topic.description}</p>

                            {topic.keywords && topic.keywords.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {topic.keywords.map((keyword, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 bg-muted text-xs rounded-md"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Progress Info */}
                            {isUnlocked && topicProgress && (
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {topicProgress.videoWatched && (
                                  <div className="flex items-center gap-1">
                                    <PlayCircle className="w-4 h-4 text-blue-500" />
                                    <span>Видео просмотрено</span>
                                  </div>
                                )}
                                {topicProgress.testScore !== undefined && (
                                  <div className="flex items-center gap-1">
                                    <FileText className="w-4 h-4 text-purple-500" />
                                    <span>Тест: {topicProgress.testScore}%</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {isUnlocked && !isCompleted && (
                              <div className="flex items-center gap-2 text-primary font-medium mt-3 group-hover:translate-x-1 transition-transform">
                                <span>Начать урок</span>
                                <ChevronRight className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
