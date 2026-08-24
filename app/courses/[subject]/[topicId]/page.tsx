"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  PlayCircle,
  FileText,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Brain,
  Trophy,
  Clock,
  BookOpen,
  AlertCircle,
  ChevronRight,
  Wifi
} from "lucide-react";
import type { Subject } from "@/types";
import { subjectNames } from "@/types";
import { ContentModeSwitcher, type ContentMode } from "@/components/content-mode-switcher";
import { AudioPlayer } from "@/components/audio-player";
import { InteractiveNotes } from "@/components/interactive-notes";
import { ContentDownloadManager } from "@/components/content-download-manager";

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

interface Lesson {
  topicId: string;
  subject: string;
  grade: number;
  quarter: number;
  title: string;
  content: string;
  youtubeQuery: string;
  keywords: string[];
  videoId: string | null;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface TestResult {
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  answers: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
}

const PASSING_SCORE = 80; // 80% для прохождения

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const subject = params.subject as Subject;
  const topicId = params.topicId as string;

  const [user, setUser] = useState<any>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoWatched, setVideoWatched] = useState(false);
  const [contentMode, setContentMode] = useState<ContentMode>('text');
  const [showTest, setShowTest] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [generatingTest, setGeneratingTest] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    loadTopic();
    checkProgress(userData.id);
  }, [router, topicId]);

  const loadTopic = async () => {
    try {
      // Load topic
      const topicResponse = await fetch(`/api/topics/${topicId}`);
      if (topicResponse.ok) {
        const topicData = await topicResponse.json();
        setTopic(topicData.topic);

        // Load lesson content
        const lessonResponse = await fetch(`/api/lessons/${topicId}`);
        if (lessonResponse.ok) {
          const lessonData = await lessonResponse.json();
          setLesson(lessonData.lesson);

          // Load YouTube video
          if (lessonData.lesson.youtubeQuery) {
            const videoResponse = await fetch(`/api/youtube/search?q=${encodeURIComponent(lessonData.lesson.youtubeQuery)}`);
            if (videoResponse.ok) {
              const videoData = await videoResponse.json();
              setVideoId(videoData.videoId);
            }
          }
        }

        setLoading(false);
      } else {
        console.error('Failed to load topic:', topicResponse.status);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading topic:', error);
      setLoading(false);
    }
  };

  const checkProgress = (studentId: string) => {
    const progressKey = `progress_${studentId}_${subject}`;
    const saved = localStorage.getItem(progressKey);
    if (saved) {
      const progress = JSON.parse(saved);
      const topicProgress = progress.find((p: any) => p.topicId === topicId);
      if (topicProgress) {
        setVideoWatched(topicProgress.videoWatched || false);
      }
    }
  };

  const handleVideoEnd = () => {
    setVideoWatched(true);
    setContentMode('text');
    saveProgress({ videoWatched: true });

    // Track video with AI automation
    fetch('/api/ai/automation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: user.id,
        action: 'track_video_watched',
        data: {
          topicId,
          subject,
          topicTitle: topic?.title,
          watchDuration: 0
        }
      })
    }).catch(err => console.error('Failed to track video:', err));
  };

  const handleAudioComplete = () => {
    setVideoWatched(true);
    saveProgress({ videoWatched: true });
  };

  const startTest = async () => {
    if (!videoWatched) {
      alert('Сначала изучите материал урока!');
      return;
    }

    setGeneratingTest(true);
    try {
      // Load pre-generated test from static data
      const response = await fetch(`/api/tests/${topicId}`);

      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
        setShowTest(true);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setTestResult(null);
      } else {
        throw new Error('Test not found');
      }
    } catch (error) {
      console.error('Error loading test:', error);
      alert('Ошибка при загрузке теста. Попробуйте снова.');
    }
    setGeneratingTest(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitTest(newAnswers);
    }
  };

  const submitTest = async (finalAnswers: number[]) => {
    let correctCount = 0;
    const detailedAnswers = finalAnswers.map((answer, index) => {
      const isCorrect = answer === questions[index].correctAnswer;
      if (isCorrect) correctCount++;
      return {
        questionId: questions[index].id,
        selectedAnswer: answer,
        isCorrect
      };
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= PASSING_SCORE;

    const result: TestResult = {
      score: correctCount,
      maxScore: questions.length,
      percentage,
      passed,
      answers: detailedAnswers
    };

    setTestResult(result);

    // Save progress
    saveProgress({
      videoWatched: true,
      completed: passed,
      testScore: percentage
    });

    // Save test result to AI database
    await fetch('/api/ai/automation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: user.id,
        action: 'save_test_result',
        data: {
          topicId,
          subject,
          topicTitle: topic?.title,
          score: correctCount,
          maxScore: questions.length,
          percentage,
          passed,
          answers: detailedAnswers
        }
      })
    }).catch(err => console.error('Failed to save test result:', err));

    // Save lesson completion if passed
    if (passed) {
      await fetch('/api/ai/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          action: 'save_lesson_completion',
          data: {
            topicId,
            subject,
            topicTitle: topic?.title,
            videoWatched: true,
            testPassed: true,
            testScore: percentage
          }
        })
      }).catch(err => console.error('Failed to save completion:', err));
    }

    // Get AI feedback if not passed
    if (!passed) {
      await getAIFeedback(result);
    }
  };

  const getAIFeedback = async (result: TestResult) => {
    try {
      const response = await fetch('/api/tests/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          topicId,
          subject,
          topicTitle: topic?.title,
          testResult: result,
          questions: questions
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiFeedback(data.feedback);
      }
    } catch (error) {
      console.error('Error getting AI feedback:', error);
    }
  };

  const saveProgress = (progressData: any) => {
    if (!user) return;

    const progressKey = `progress_${user.id}_${subject}`;
    const saved = localStorage.getItem(progressKey);
    let progress = saved ? JSON.parse(saved) : [];

    const existingIndex = progress.findIndex((p: any) => p.topicId === topicId);
    const newProgress = {
      topicId,
      ...progressData
    };

    if (existingIndex >= 0) {
      progress[existingIndex] = { ...progress[existingIndex], ...newProgress };
    } else {
      progress.push(newProgress);
    }

    localStorage.setItem(progressKey, JSON.stringify(progress));
  };

  const retryTest = () => {
    setShowTest(false);
    setTestResult(null);
    setAiFeedback("");
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
  };

  const goToNextTopic = () => {
    router.push(`/courses/${subject}`);
  };

  if (loading || !topic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Загрузка урока...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Mock data for interactive notes
  const notesContent = {
    formulas: [
      {
        title: '1. Квадрат суммы',
        formula: '(a + b)² = a² + 2ab + b²',
        example: '(x + 3)² = x² + 6x + 9'
      },
      {
        title: '2. Квадрат разности',
        formula: '(a - b)² = a² - 2ab + b²',
        example: '(x - 5)² = x² - 10x + 25'
      },
      {
        title: '3. Разность квадратов',
        formula: '(a - b)(a + b) = a² - b²',
        example: '(x - 2)(x + 2) = x² - 4'
      }
    ],
    tips: [
      'Квадрат суммы: "Первый в квадрате + удвоенное произведение + второй в квадрате"',
      'Разность квадратов: "Если скобки (a-b) и (a+b) рядом — ответ a² - b²"'
    ],
    commonMistakes: [
      {
        wrong: '(a + b)² = a² + b² — НЕВЕРНО! Забыли 2ab',
        correct: '(a + b)² = a² + 2ab + b²'
      },
      {
        wrong: '(x - 3)² = x² - 9 — НЕВЕРНО! Забыли средний член',
        correct: '(x - 3)² = x² - 6x + 9'
      }
    ],
    examples: [
      {
        question: 'Пример 1: Вычисли 99²',
        solution: 'Решение: 99² = (100-1)² = 100² - 2·100·1 + 1² = 10000 - 200 + 1 = 9801'
      },
      {
        question: 'Пример 2: Упрости (x+2)²',
        solution: 'Решение: (x+2)² = x² + 2·x·2 + 2² = x² + 4x + 4'
      },
      {
        question: 'Пример 3: Разложи x² - 16',
        solution: 'Решение: x² - 16 = x² - 4² = (x-4)(x+4)'
      },
      {
        question: 'Пример 4: Вычисли 103·97',
        solution: 'Решение: 103·97 = (100+3)(100-3) = 100² - 3² = 10000 - 9 = 9991'
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push(`/courses/${subject}`)}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Назад к темам</span>
            </button>

            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  {subjectNames[subject]} • {topic.grade} класс • {topic.quarter} четверть
                </div>
                <h1 className="text-4xl font-bold mb-2">{topic.title}</h1>
                <p className="text-lg text-muted-foreground">{topic.description}</p>
              </div>
            </div>

            {topic.keywords && topic.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {topic.keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Main Content */}
          {!showTest && !testResult && (
            <div className="space-y-6">
              {/* Network Warning for Video Mode */}
              {contentMode === 'video' && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Wifi className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-orange-900 dark:text-orange-300">
                      <p className="font-medium mb-1">Видео требует стабильного интернета</p>
                      <p>Рекомендуем использовать текстовый конспект или аудио на медленном соединении (2G/3G)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Mode Switcher */}
              <ContentModeSwitcher
                currentMode={contentMode}
                onModeChange={setContentMode}
                videoWatched={videoWatched}
                audioAvailable={false}
              />

              {/* Text Content */}
              {contentMode === 'text' && (
                <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 sm:p-6 border-b">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold">Интерактивный конспект</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Легкий формат • Работает без интернета
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 lg:p-8">
                    <InteractiveNotes title={topic.title} content={notesContent} />

                    {!videoWatched && (
                      <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                        <button
                          onClick={() => {
                            setVideoWatched(true);
                            saveProgress({ videoWatched: true });
                          }}
                          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-[0.98] transition-all font-medium flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Отметить как изученное
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Audio Content */}
              {contentMode === 'audio' && (
                <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-4 sm:p-6 border-b">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">🎧</div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold">Аудиолекция</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Сжатый формат • ~3 МБ • Слушай в дороге
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                      <p className="text-sm text-yellow-900 dark:text-yellow-300">
                        <strong>🚧 Скоро доступно</strong><br />
                        Аудиолекции находятся в разработке. Пока используйте текстовый конспект или видео.
                      </p>
                    </div>

                    {/* Placeholder for future audio player */}
                    {/* <AudioPlayer
                      audioUrl="/audio/lessons/math-formulas.mp3"
                      title={topic.title}
                      onComplete={handleAudioComplete}
                    /> */}
                  </div>
                </div>
              )}

              {/* Video Content */}
              {contentMode === 'video' && (
                <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 sm:p-6 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold">Видео-урок</h2>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            HD качество • ~50 МБ
                          </p>
                        </div>
                      </div>
                      {videoWatched && (
                        <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="font-medium text-xs sm:text-sm">Просмотрено</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    {videoId ? (
                      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          onLoad={() => {
                            setTimeout(() => {
                              setVideoWatched(true);
                              saveProgress({ videoWatched: true });
                            }, 5000);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                        <div className="text-center text-white">
                          <PlayCircle className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 opacity-50" />
                          <p className="text-base sm:text-lg mb-2">Загрузка видео...</p>
                          <button
                            onClick={handleVideoEnd}
                            className="px-4 py-2 sm:px-6 bg-white text-gray-900 rounded-lg hover:bg-gray-100 active:scale-95 transition-all text-sm sm:text-base"
                          >
                            Отметить как просмотренное
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Download Manager */}
              <ContentDownloadManager
                lessonId={topicId}
                availableFormats={{
                  text: true,
                  audio: false,
                  video: videoId ? true : false,
                }}
                sizes={{
                  textKB: 15,
                  audioMB: 3,
                  videoMB: 48,
                }}
              />

              {/* Test Section */}
              <div className="bg-card border-2 border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-purple-600" />
                    <div>
                      <h2 className="text-2xl font-bold">Тест на понимание</h2>
                      <p className="text-sm text-muted-foreground">
                        10 вопросов • Минимум {PASSING_SCORE}% для прохождения
                      </p>
                    </div>
                  </div>
                </div>

                {!videoWatched && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-orange-900 dark:text-orange-300">
                        <p className="font-medium mb-1">Сначала изучите материал урока</p>
                        <p>Тест станет доступен после изучения материала</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={startTest}
                  disabled={!videoWatched || generatingTest}
                  className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-medium"
                >
                  {generatingTest ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Генерация теста...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-6 h-6" />
                      <span>Начать тест</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Test Questions */}
          {showTest && !testResult && currentQuestion && (
            <div className="bg-card border-2 border-primary/40 rounded-lg p-8">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Вопрос {currentQuestionIndex + 1} из {questions.length}</span>
                  <span>{Math.round(((currentQuestionIndex) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6">{currentQuestion.text}</h3>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === index
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === index
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswer === index && (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-medium"
              >
                <span>{currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Test Results */}
          {testResult && (
            <div className="space-y-6">
              {/* Result Card */}
              <div className={`bg-card border-2 rounded-lg p-8 ${
                testResult.passed ? 'border-green-500 bg-green-50/50' : 'border-red-500 bg-red-50/50'
              }`}>
                <div className="text-center mb-6">
                  <div className={`inline-block p-4 rounded-full mb-4 ${
                    testResult.passed ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {testResult.passed ? (
                      <Trophy className="w-16 h-16 text-green-600" />
                    ) : (
                      <XCircle className="w-16 h-16 text-red-600" />
                    )}
                  </div>

                  <h2 className="text-3xl font-bold mb-2">
                    {testResult.passed ? 'Тест пройден!' : 'Тест не пройден'}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-4">
                    {testResult.passed
                      ? 'Отличная работа! Можете переходить к следующей теме.'
                      : `Вам нужно набрать минимум ${PASSING_SCORE}% для прохождения.`
                    }
                  </p>

                  <div className="inline-flex items-center gap-4 px-6 py-3 bg-white border-2 border-border rounded-lg">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{testResult.percentage}%</div>
                      <div className="text-sm text-muted-foreground">Ваш результат</div>
                    </div>
                    <div className="h-12 w-px bg-border"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{testResult.score}/{testResult.maxScore}</div>
                      <div className="text-sm text-muted-foreground">Правильных</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  {testResult.passed ? (
                    <button
                      onClick={goToNextTopic}
                      className="flex-1 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-lg font-medium"
                    >
                      <Trophy className="w-6 h-6" />
                      <span>Перейти к следующей теме</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={retryTest}
                        className="flex-1 px-6 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 text-lg font-medium"
                      >
                        <FileText className="w-6 h-6" />
                        <span>Пересдать тест</span>
                      </button>
                      <button
                        onClick={() => {
                          setTestResult(null);
                          setShowTest(false);
                        }}
                        className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg font-medium"
                      >
                        <BookOpen className="w-6 h-6" />
                        <span>Пересмотреть урок</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* AI Feedback */}
              {!testResult.passed && aiFeedback && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <Brain className="w-12 h-12 text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-blue-900">
                        Персональные рекомендации от AI
                      </h3>
                      <div className="text-blue-800 whitespace-pre-line">
                        {aiFeedback}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
