"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Trophy,
  Clock,
  Target,
  Star,
  Play,
  RotateCcw,
  Calculator,
  BookOpen,
  Atom,
  AlertCircle,
  TrendingDown
} from "lucide-react";
import type { Subject, WeakTopic } from "@/types";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface StudentData {
  id: string;
  name: string;
  selectedSubjects?: Subject[];
  weakTopics?: WeakTopic[];
}

const SUBJECT_CONFIG: Record<Subject, { name: string; icon: any; color: string; emoji: string }> = {
  mathematics: { name: "Математика", icon: Calculator, color: "text-blue-500", emoji: "➕" },
  physics: { name: "Физика", icon: Atom, color: "text-purple-500", emoji: "⚡" },
  english: { name: "Английский", icon: BookOpen, color: "text-pink-500", emoji: "📚" },
  informatics: { name: "Информатика", icon: Calculator, color: "text-green-500", emoji: "💻" },
  chemistry: { name: "Химия", icon: Calculator, color: "text-orange-500", emoji: "🧪" },
  biology: { name: "Биология", icon: Calculator, color: "text-emerald-500", emoji: "🌿" },
  economics: { name: "Экономика", icon: Calculator, color: "text-yellow-500", emoji: "💰" },
  geography: { name: "География", icon: Calculator, color: "text-cyan-500", emoji: "🌍" }
};

export default function GamesPage() {
  const router = useRouter();
  const [user, setUser] = useState<StudentData | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [bestScore, setBestScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);
  }, [router]);

  useEffect(() => {
    if (selectedSubject && user) {
      const saved = localStorage.getItem(`game_best_${selectedSubject}_${user.id}`);
      if (saved) {
        setBestScore(parseInt(saved));
      }
    }
  }, [selectedSubject, user]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameStarted, timeLeft]);

  const generateQuestionForTopic = async (subject: Subject, topicId: string): Promise<Question> => {
    // Генерируем вопрос через AI по конкретной теме
    try {
      const response = await fetch('/api/games/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topicId })
      });

      if (response.ok) {
        const data = await response.json();
        return data.question;
      }
    } catch (error) {
      console.error('Error generating question:', error);
    }

    // Fallback к статическим вопросам
    return getStaticQuestion(subject);
  };

  const getStaticQuestion = (subject: Subject): Question => {
    const questions = STATIC_QUESTIONS[subject] || STATIC_QUESTIONS.mathematics;
    return questions[Math.floor(Math.random() * questions.length)];
  };

  const startGame = async () => {
    if (!selectedSubject || !user) return;

    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setSelectedOption(null);
    setIsCorrect(null);
    setQuestionCount(0);

    const weakTopic = user.weakTopics?.find(t => t.subject === selectedSubject);
    if (weakTopic) {
      const question = await generateQuestionForTopic(selectedSubject, weakTopic.topicId);
      setCurrentQuestion(question);
    } else {
      setCurrentQuestion(getStaticQuestion(selectedSubject));
    }
  };

  const checkAnswer = async () => {
    if (!currentQuestion || selectedOption === null || !selectedSubject || !user) return;

    setQuestionCount(questionCount + 1);

    if (selectedOption === currentQuestion.correctAnswer) {
      const points = streak >= 5 ? 15 : 10;
      setScore(score + points);
      setStreak(streak + 1);
      setIsCorrect(true);

      setTimeout(async () => {
        const weakTopic = user.weakTopics?.find(t => t.subject === selectedSubject);
        if (weakTopic) {
          const question = await generateQuestionForTopic(selectedSubject, weakTopic.topicId);
          setCurrentQuestion(question);
        } else {
          setCurrentQuestion(getStaticQuestion(selectedSubject));
        }
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1000);
    } else {
      setStreak(0);
      setIsCorrect(false);
      setTimeout(async () => {
        setIsCorrect(null);
        setSelectedOption(null);
        const weakTopic = user.weakTopics?.find(t => t.subject === selectedSubject);
        if (weakTopic) {
          const question = await generateQuestionForTopic(selectedSubject, weakTopic.topicId);
          setCurrentQuestion(question);
        } else {
          setCurrentQuestion(getStaticQuestion(selectedSubject));
        }
      }, 1500);
    }
  };

  const endGame = () => {
    setGameStarted(false);

    if (user && selectedSubject && score > 0) {
      saveGameScore(user.id, score, selectedSubject);
    }

    if (score > bestScore && selectedSubject && user) {
      setBestScore(score);
      localStorage.setItem(`game_best_${selectedSubject}_${user.id}`, score.toString());
    }

    const now = new Date().toISOString();
    const activityLog = JSON.parse(localStorage.getItem(`activity_${user?.id}`) || '[]');
    activityLog.push({ type: 'game', subject: selectedSubject, score, timestamp: now });
    localStorage.setItem(`activity_${user?.id}`, JSON.stringify(activityLog.slice(-50)));
  };

  const saveGameScore = async (studentId: string, score: number, subject: string) => {
    try {
      const response = await fetch('/api/student/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, score, subject })
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = { ...user, totalPoints: data.newTotal, gameStats: data.gameStats };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error saving points:', error);
    }
  };

  if (!user) return null;

  const config = selectedSubject ? SUBJECT_CONFIG[selectedSubject] : null;
  const Icon = config?.icon;
  const weakTopic = selectedSubject ? user.weakTopics?.find(t => t.subject === selectedSubject) : null;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!selectedSubject ? (
            // Subject Selection
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                  <Zap className="w-16 h-16 text-primary" />
                </div>
                <h1 className="text-4xl font-bold mb-3">Образовательные игры</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Игры автоматически подбираются по твоим отстающим темам
                </p>

                {/* Объяснение системы */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-left text-sm text-blue-900">
                      <p className="font-semibold mb-1">💡 Как это работает:</p>
                      <p>Игры связаны с темами, в которых ты отстаёшь. Система анализирует твои результаты тестов и автоматически генерирует вопросы по слабым местам. Чем больше играешь — тем сильнее становишься в этих темах!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Все предметы */}
              <div className="space-y-6">
                {/* Выбранные предметы с отстающими темами */}
                {user.selectedSubjects && user.selectedSubjects.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 text-left max-w-2xl mx-auto">
                      🎯 Твои выбранные предметы (с отстающими темами)
                    </h2>
                    <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
                      {user.selectedSubjects.map((subject) => {
                        const config = SUBJECT_CONFIG[subject];
                        const SubjectIcon = config.icon;
                        const weakTopic = user.weakTopics?.find(t => t.subject === subject);

                        return (
                          <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className="bg-card border-2 border-primary hover:border-primary/80 rounded-lg p-6 transition-all hover:scale-[1.02] text-left shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="text-4xl">{config.emoji}</div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold mb-2">{config.name}</h3>

                                  {weakTopic ? (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-sm">
                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                        <span className="font-medium text-red-600">
                                          Отстающая тема: {weakTopic.topicName}
                                        </span>
                                      </div>

                                      <div className="text-xs text-muted-foreground space-y-1">
                                        <div>Последний балл: {weakTopic.lastTestScore}%</div>
                                        <div>Игр сыграно: {weakTopic.gamesPlayed}</div>
                                      </div>

                                      {/* Уровень слабости */}
                                      <div className="mt-3">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                          <span className="text-muted-foreground">Уровень отставания:</span>
                                          <span className="font-bold text-red-600">{weakTopic.weaknessLevel}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                          <div
                                            className="bg-red-500 h-2 rounded-full transition-all"
                                            style={{ width: `${weakTopic.weaknessLevel}%` }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">
                                      Пока нет данных об отстающих темах
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex-shrink-0">
                                <SubjectIcon className={`w-12 h-12 ${config.color}`} />
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Остальные предметы */}
                <div>
                  <h2 className="text-xl font-bold mb-4 text-left max-w-2xl mx-auto">
                    📚 Остальные предметы
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
                    {(Object.keys(SUBJECT_CONFIG) as Subject[])
                      .filter(subject => !user.selectedSubjects?.includes(subject))
                      .map((subject) => {
                        const config = SUBJECT_CONFIG[subject];
                        const SubjectIcon = config.icon;

                        return (
                          <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className="bg-card border-2 border-border hover:border-primary rounded-lg p-6 transition-all hover:scale-105"
                          >
                            <div className="text-4xl mb-3">{config.emoji}</div>
                            <SubjectIcon className={`w-12 h-12 ${config.color} mx-auto mb-3`} />
                            <h3 className="text-lg font-bold">{config.name}</h3>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          ) : !gameStarted ? (
            // Game Start Screen
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                  {Icon && <Icon className={`w-16 h-16 ${config.color}`} />}
                </div>
                <h1 className="text-4xl font-bold mb-3">
                  {config?.name} - Квиз
                </h1>

                {weakTopic && (
                  <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">
                      Игры по тематике: <span className="font-bold">{weakTopic.topicName}</span> (из-за отставания)
                    </span>
                  </div>
                )}

                <p className="text-lg text-muted-foreground">
                  Проверь свои знания и зарабатывай очки!
                </p>
              </div>

              <button
                onClick={() => setSelectedSubject(null)}
                className="mb-6 text-primary hover:underline"
              >
                ← Назад к выбору предмета
              </button>

              {/* Rules */}
              <div className="bg-card border border-border/60 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
                <h3 className="text-lg font-bold mb-4">Правила</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>У тебя есть 60 секунд</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>За каждый правильный ответ +10 очков</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Серия из 5+ правильных ответов дает +15 очков</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="font-medium text-orange-600">
                      Все вопросы по теме {weakTopic?.topicName || 'которая отстаёт'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Best Score */}
              {bestScore > 0 && (
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm">
                      Лучший результат: <span className="font-bold">{bestScore}</span>
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={startGame}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
              >
                <Play className="w-5 h-5 mr-2 inline" />
                Начать игру
              </button>
            </div>
          ) : (
            // Game Screen
            <div>
              {/* Game Header */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-card border border-border/60 rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Очки</div>
                  <div className="text-2xl font-bold">{score}</div>
                </div>
                <div className="bg-card border border-border/60 rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Время</div>
                  <div className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-500" : ""}`}>
                    {timeLeft}с
                  </div>
                </div>
                <div className="bg-card border border-border/60 rounded-lg p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Серия</div>
                  <div className="text-2xl font-bold">{streak} 🔥</div>
                </div>
              </div>

              {/* Question */}
              {currentQuestion && (
                <div className="bg-card border-2 border-primary/40 rounded-lg p-8 mb-8">
                  <div className="text-xl font-bold mb-6 text-center">
                    {currentQuestion.question}
                  </div>

                  <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedOption(index);
                          setTimeout(() => checkAnswer(), 100);
                        }}
                        disabled={isCorrect !== null}
                        className={`p-4 rounded-lg border-2 text-base font-semibold transition-all ${
                          selectedOption === index && isCorrect === true
                            ? "border-green-500 bg-green-500/20"
                            : selectedOption === index && isCorrect === false
                            ? "border-red-500 bg-red-500/20"
                            : selectedOption === index
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {isCorrect === true && (
                    <div className="mt-6 text-2xl text-green-500 font-bold animate-bounce text-center">
                      ✓ Правильно!
                    </div>
                  )}
                  {isCorrect === false && (
                    <div className="mt-6 text-center">
                      <div className="text-2xl text-red-500 font-bold mb-2">
                        ✗ Неправильно
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Правильный ответ: {currentQuestion.options[currentQuestion.correctAnswer]}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={endGame}
                  className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2 inline" />
                  Завершить игру
                </button>
              </div>
            </div>
          )}

          {/* Game Over Screen */}
          {!gameStarted && score > 0 && (
            <div className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/40 rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Игра окончена!</h2>
              <div className="text-5xl font-bold mb-2">{score}</div>
              <div className="text-lg text-muted-foreground mb-4">очков</div>
              <div className="text-sm text-muted-foreground mb-6">
                Правильных ответов: {Math.floor(score / 10)} / {questionCount}
              </div>

              {score > bestScore && (
                <div className="mb-6 text-yellow-500 font-bold text-xl">
                  🏆 Новый рекорд!
                </div>
              )}

              <button
                onClick={startGame}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Play className="w-5 h-5 mr-2 inline" />
                Играть снова
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Static fallback questions
const STATIC_QUESTIONS: Record<Subject, Question[]> = {
  mathematics: [
    { question: "sin²x + cos²x = ?", options: ["0", "1", "2", "π"], correctAnswer: 1 },
    { question: "Чему равен sin(30°)?", options: ["0", "0.5", "1", "√3/2"], correctAnswer: 1 },
    { question: "cos(0°) = ?", options: ["0", "1", "-1", "0.5"], correctAnswer: 1 },
    { question: "Период функции sin(x):", options: ["π", "2π", "π/2", "4π"], correctAnswer: 1 },
    { question: "Чему равно 15 × 8?", options: ["115", "120", "125", "130"], correctAnswer: 1 },
    { question: "Решите: 144 ÷ 12", options: ["11", "13", "12", "14"], correctAnswer: 2 },
    { question: "Чему равен корень из 64?", options: ["6", "7", "8", "10"], correctAnswer: 2 },
    { question: "25% от 200 это:", options: ["25", "75", "50", "100"], correctAnswer: 2 }
  ],
  physics: [
    { question: "Единица измерения силы:", options: ["Джоуль", "Ньютон", "Ватт", "Паскаль"], correctAnswer: 1 },
    { question: "Формула второго закона Ньютона:", options: ["F = m/a", "F = ma", "F = a/m", "F = m+a"], correctAnswer: 1 },
    { question: "Формула скорости:", options: ["v = s×t", "v = t/s", "v = s/t", "v = s+t"], correctAnswer: 2 },
    { question: "Скорость света в вакууме:", options: ["3×10⁶ м/с", "3×10⁷ м/с", "3×10⁸ м/с", "3×10⁹ м/с"], correctAnswer: 2 },
    { question: "Единица измерения мощности:", options: ["Джоуль", "Ньютон", "Ватт", "Ампер"], correctAnswer: 2 },
    { question: "Частота измеряется в:", options: ["Ваттах", "Герцах", "Джоулях", "Вольтах"], correctAnswer: 1 },
    { question: "Ускорение свободного падения:", options: ["9.8 м/с²", "10 м/с²", "8.9 м/с²", "11 м/с²"], correctAnswer: 0 },
    { question: "Единица измерения давления:", options: ["Ватт", "Паскаль", "Джоуль", "Ньютон"], correctAnswer: 1 }
  ],
  english: [
    { question: "I ___ seen this movie before.", options: ["has", "have", "had", "having"], correctAnswer: 1 },
    { question: "She ___ already ___ her homework.", options: ["has/done", "have/did", "had/do", "has/do"], correctAnswer: 0 },
    { question: "What does 'amazing' mean?", options: ["Скучный", "Удивительный", "Грустный", "Злой"], correctAnswer: 1 },
    { question: "Choose: I ___ to school every day.", options: ["goes", "go", "going", "went"], correctAnswer: 1 },
    { question: "Opposite of 'hot':", options: ["Warm", "Cold", "Cool", "Big"], correctAnswer: 1 },
    { question: "Complete: She ___ a book now.", options: ["read", "is reading", "reads", "reading"], correctAnswer: 1 },
    { question: "Past tense of 'go':", options: ["goed", "went", "go", "going"], correctAnswer: 1 },
    { question: "Choose: They ___ playing.", options: ["is", "are", "am", "be"], correctAnswer: 1 }
  ],
  informatics: [
    { question: "Сколько бит в 1 байте?", options: ["16", "8", "4", "32"], correctAnswer: 1 },
    { question: "Какой язык не является языком программирования?", options: ["Python", "HTML", "Java", "C++"], correctAnswer: 1 },
    { question: "Что означает CPU?", options: ["Память", "Центральный процессор", "Жесткий диск", "Видеокарта"], correctAnswer: 1 },
    { question: "Двоичная система использует цифры:", options: ["0-9", "0 и 1", "0-7", "0-15"], correctAnswer: 1 },
    { question: "RAM это:", options: ["Жесткий диск", "Оперативная память", "Процессор", "Монитор"], correctAnswer: 1 },
    { question: "Сколько байт в 1 килобайте?", options: ["1000", "1024", "512", "2048"], correctAnswer: 1 },
    { question: "Что такое алгоритм?", options: ["Программа", "Последовательность действий", "Язык программирования", "Данные"], correctAnswer: 1 },
    { question: "IP адрес состоит из:", options: ["3 чисел", "4 чисел", "5 чисел", "2 чисел"], correctAnswer: 1 }
  ],
  chemistry: [
    { question: "Химический символ воды:", options: ["CO₂", "H₂O", "O₂", "H₂"], correctAnswer: 1 },
    { question: "Элемент с символом O:", options: ["Золото", "Кислород", "Серебро", "Водород"], correctAnswer: 1 },
    { question: "pH нейтрального раствора:", options: ["0", "7", "14", "10"], correctAnswer: 1 },
    { question: "Формула углекислого газа:", options: ["H₂O", "CO₂", "O₂", "N₂"], correctAnswer: 1 },
    { question: "Валентность кислорода:", options: ["I", "II", "III", "IV"], correctAnswer: 1 },
    { question: "NaCl это:", options: ["Сахар", "Поваренная соль", "Вода", "Кислота"], correctAnswer: 1 },
    { question: "Химический символ золота:", options: ["Ag", "Au", "Fe", "Cu"], correctAnswer: 1 },
    { question: "Атомный номер водорода:", options: ["2", "1", "3", "0"], correctAnswer: 1 }
  ],
  biology: [
    { question: "Основная единица жизни:", options: ["Орган", "Клетка", "Ткань", "Организм"], correctAnswer: 1 },
    { question: "Фотосинтез происходит в:", options: ["Митохондриях", "Хлоропластах", "Ядре", "Цитоплазме"], correctAnswer: 1 },
    { question: "Сколько хромосом у человека?", options: ["23", "46", "48", "44"], correctAnswer: 1 },
    { question: "Главный орган кровообращения:", options: ["Легкие", "Сердце", "Печень", "Мозг"], correctAnswer: 1 },
    { question: "Переносчик кислорода в крови:", options: ["Лейкоциты", "Гемоглобин", "Тромбоциты", "Плазма"], correctAnswer: 1 },
    { question: "Сколько камер в сердце человека?", options: ["2", "4", "3", "5"], correctAnswer: 1 },
    { question: "Что производят растения при фотосинтезе?", options: ["CO₂", "Кислород", "Азот", "Водород"], correctAnswer: 1 },
    { question: "ДНК находится в:", options: ["Цитоплазме", "Ядре клетки", "Мембране", "Митохондриях"], correctAnswer: 1 }
  ],
  economics: [
    { question: "Основной закон экономики:", options: ["Инфляция", "Спрос и предложение", "Безработица", "Налоги"], correctAnswer: 1 },
    { question: "Валюта Казахстана:", options: ["Рубль", "Тенге", "Доллар", "Евро"], correctAnswer: 1 },
    { question: "Что такое ВВП?", options: ["Внешний валовой продукт", "Валовой внутренний продукт", "Валютный продукт", "Нет правильного"], correctAnswer: 1 },
    { question: "Инфляция это:", options: ["Снижение цен", "Рост цен", "Стабильность цен", "Дефляция"], correctAnswer: 1 },
    { question: "Монополия это:", options: ["Много продавцов", "Один продавец", "Два продавца", "Нет продавцов"], correctAnswer: 1 },
    { question: "Что такое акция?", options: ["Валюта", "Ценная бумага", "Товар", "Услуга"], correctAnswer: 1 },
    { question: "Центральный банк РК:", options: ["Казкоммерцбанк", "Национальный Банк", "Халык Банк", "БТА"], correctAnswer: 1 },
    { question: "Дефицит бюджета это:", options: ["Доходы > расходов", "Расходы > доходов", "Равенство", "Профицит"], correctAnswer: 1 }
  ],
  geography: [
    { question: "Столица Казахстана:", options: ["Алматы", "Астана", "Шымкент", "Караганда"], correctAnswer: 1 },
    { question: "Самый большой океан:", options: ["Атлантический", "Тихий", "Индийский", "Северный Ледовитый"], correctAnswer: 1 },
    { question: "Самая высокая гора в мире:", options: ["Килиманджаро", "Эверест", "Монблан", "Эльбрус"], correctAnswer: 1 },
    { question: "Сколько материков на Земле?", options: ["5", "6", "7", "8"], correctAnswer: 1 },
    { question: "Самая длинная река:", options: ["Амазонка", "Нил", "Янцзы", "Миссисипи"], correctAnswer: 1 },
    { question: "Самое большое озеро:", options: ["Байкал", "Каспийское море", "Виктория", "Танганьика"], correctAnswer: 1 },
    { question: "Сколько часовых поясов в РК?", options: ["1", "2", "3", "4"], correctAnswer: 1 },
    { question: "Самый маленький материк:", options: ["Европа", "Австралия", "Антарктида", "Африка"], correctAnswer: 1 }
  ]
};
