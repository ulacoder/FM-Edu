"use client";
import { useState, useEffect } from "react";
import { NaviAvatarStatic } from '@/components/navi-avatar';
import { ContentModeSwitcher, type ContentMode } from "@/components/content-mode-switcher";
import { InteractiveNotes } from "@/components/interactive-notes";
import { Wifi, CheckCircle } from "lucide-react";

function Quiz({ questions }: { questions: Array<{question: string, options: string[], correct: number}> }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<Array<{question: string, userAnswer: string, correctAnswer: string}>>([]);
  const [aiFeedback, setAiFeedback] = useState<string>("");

  const [shuffledQuestions, setShuffledQuestions] = useState(questions);

  useEffect(() => {
    setShuffledQuestions(
      questions.map(q => {
        const shuffled = [...q.options];
        const correctAnswer = shuffled[q.correct];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return { ...q, options: shuffled, correct: shuffled.indexOf(correctAnswer) };
      })
    );
  }, []);

  const generateAIFeedback = (isCorrect: boolean, question: string, userAnswer: string, correctAnswer: string) => {
    if (isCorrect) {
      const encouragements = [
        "Отлично! Ты правильно понял концепцию! 🎉",
        "Супер! Продолжай в том же духе! 💪",
        "Точно! Ты молодец! ⭐",
        "Правильно! У тебя хорошо получается! 🔥"
      ];
      return encouragements[Math.floor(Math.random() * encouragements.length)];
    } else {
      return `Не переживай! Правильный ответ: "${correctAnswer}". Давай разберём: возможно, ты перепутал знаки или забыл правило. Повтори эту тему и попробуй ещё раз! 📚`;
    }
  };

  const generateFinalAnalysis = (score: number, total: number, mistakes: Array<{question: string, userAnswer: string, correctAnswer: string}>) => {
    const percentage = Math.round((score / total) * 100);

    if (percentage >= 80) {
      return `Невероятно! Ты набрал ${score} из ${total} (${percentage}%)! 🎉\n\nТы отлично усвоил материал! Можешь смело переходить к следующей теме. Так держать! 💪`;
    } else if (percentage >= 60) {
      return `Хороший результат! ${score} из ${total} (${percentage}%)! 👍\n\nУ тебя неплохая база, но есть моменты которые стоит подтянуть:\n${mistakes.length > 0 ? `\n• Обрати внимание на вопросы про ${mistakes.slice(0, 2).map(m => m.question.split('?')[0]).join(' и ')}\n` : ''}\nПовтори эти темы и попробуй ещё раз! Ты на правильном пути! 🔥`;
    } else {
      return `Получилось ${score} из ${total} (${percentage}%) 📚\n\nНе расстраивайся! Все с чего-то начинают. Давай разберём что нужно подтянуть:\n\n${mistakes.length > 0 ? `• Тебе стоит повторить ${mistakes.length > 5 ? 'основные формулы и правила' : 'некоторые правила'}\n` : ''}• Перечитай конспект выше\n• Посмотри видео-урок\n• Попробуй пройти тест ещё раз!\n\nТы справишься! Главное не сдаваться! 💪`;
    }
  };

  const handleAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    const isCorrect = idx === shuffledQuestions[currentQ].correct;
    const feedback = generateAIFeedback(
      isCorrect,
      shuffledQuestions[currentQ].question,
      shuffledQuestions[currentQ].options[idx],
      shuffledQuestions[currentQ].options[shuffledQuestions[currentQ].correct]
    );
    setAiFeedback(feedback);

    if (!isCorrect) {
      setWrongAnswers([...wrongAnswers, {
        question: shuffledQuestions[currentQ].question,
        userAnswer: shuffledQuestions[currentQ].options[idx],
        correctAnswer: shuffledQuestions[currentQ].options[shuffledQuestions[currentQ].correct]
      }]);
    }

    setTimeout(() => {
      if (isCorrect) setScore(score + 1);
      if (currentQ < shuffledQuestions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelectedAnswer(null);
        setAiFeedback("");
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  if (showResult) {
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    const finalAnalysis = generateFinalAnalysis(score, shuffledQuestions.length, wrongAnswers);

    return (
      <div>
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-2">Результат: {score}/{shuffledQuestions.length}</h3>
          <div className="text-7xl mb-4">{percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "📚"}</div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
            <NaviAvatarStatic size="sm" className="inline-block" /> AI Анализ твоих результатов
          </h4>
          <p className="text-gray-800 whitespace-pre-line">{finalAnalysis}</p>
        </div>

        {wrongAnswers.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-bold mb-3">❗ Разбор ошибок:</h4>
            <div className="space-y-3">
              {wrongAnswers.map((mistake, idx) => (
                <div key={idx} className="bg-white rounded p-3">
                  <p className="font-semibold text-sm mb-1">{mistake.question}</p>
                  <p className="text-red-600 text-sm">✗ Твой ответ: {mistake.userAnswer}</p>
                  <p className="text-green-600 text-sm">✓ Правильно: {mistake.correctAnswer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => {
            setCurrentQ(0);
            setScore(0);
            setShowResult(false);
            setSelectedAnswer(null);
            setWrongAnswers([]);
            setAiFeedback("");
          }}
          className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
        >
          Пройти тест заново
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Вопрос {currentQ + 1} из {shuffledQuestions.length}</p>
        <div className="h-2 bg-gray-200 rounded-full mt-2">
          <div className="h-2 bg-purple-600 rounded-full transition-all" style={{ width: `${((currentQ + 1) / shuffledQuestions.length) * 100}%` }} />
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">{shuffledQuestions[currentQ].question}</h3>

      <div className="space-y-3 mb-4">
        {shuffledQuestions[currentQ].options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            disabled={selectedAnswer !== null}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              selectedAnswer === null ? "border-gray-300 hover:border-purple-600 hover:bg-purple-50" :
              selectedAnswer === idx ? (idx === shuffledQuestions[currentQ].correct ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50") :
              idx === shuffledQuestions[currentQ].correct ? "border-green-500 bg-green-50" : "border-gray-300"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {aiFeedback && (
        <div className={`p-4 rounded-lg ${selectedAnswer === shuffledQuestions[currentQ].correct ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <p className="flex items-start gap-2">
            <NaviAvatarStatic size="md" />
            <span className="text-sm">{aiFeedback}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default function Lesson_grade7_q1() {
  const [contentMode, setContentMode] = useState<ContentMode>('text');
  const [contentWatched, setContentWatched] = useState(false);

  const notesContent = {
    formulas: [
      {
        title: 'Модуль числа',
        formula: '|a| = a, если a ≥ 0; |a| = -a, если a < 0',
        example: '|-7| = 7, |3| = 3'
      },
      {
        title: 'Сложение чисел с разными знаками',
        formula: 'Из большего модуля вычитают меньший, ставят знак числа с большим модулем',
        example: '-2,5 + 4,7 = 2,2'
      },
      {
        title: 'Основное свойство дроби',
        formula: 'a/b = a·k / b·k',
        example: '24/36 = 2/3'
      }
    ],
    tips: [
      'Модуль числа всегда неотрицателен',
      'Произведение/деление: одинаковые знаки → плюс, разные → минус'
    ],
    commonMistakes: [
      {
        wrong: '|-5| = -5',
        correct: '|-5| = 5 (модуль всегда положительный)'
      },
      {
        wrong: '-6 + (-9) = 3',
        correct: '-6 + (-9) = -15'
      }
    ],
    examples: [
      {
        question: 'Пример 1: Найдите |-7| + |3|',
        solution: 'Решение: |-7| = 7, |3| = 3. Сумма: 7 + 3 = 10'
      },
      {
        question: 'Пример 2: Вычислите -2,5 + 4,7',
        solution: 'Решение: Знаки разные, модули 2,5 и 4,7. Из большего вычитаем меньший: 4,7 - 2,5 = 2,2. Знак у числа с большим модулем (+): ответ 2,2'
      },
      {
        question: 'Пример 3: Вычислите (-3/4) · (-8/9)',
        solution: 'Решение: Знаки одинаковые → результат положительный. (3·8)/(4·9) = 24/36 = 2/3'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Рациональные числа. Модуль числа</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Математика • 7 класс • 1 четверть</p>
        </div>

        {/* Network Warning for Video Mode */}
        {contentMode === 'video' && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Wifi className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-900 dark:text-orange-300">
                <p className="font-medium mb-1">Видео требует стабильного интернета</p>
                <p>Рекомендуем использовать текстовый конспект на медленном соединении (2G/3G)</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Mode Switcher */}
        <div className="mb-6">
          <ContentModeSwitcher
            currentMode={contentMode}
            onModeChange={setContentMode}
            videoWatched={contentWatched}
            audioAvailable={false}
          />
        </div>

        {/* Text Content */}
        {contentMode === 'text' && (
          <div className="bg-card rounded-xl border border-border/60 p-6 sm:p-8 mb-6 sm:mb-8">
            <InteractiveNotes title="Рациональные числа и модуль" content={notesContent} />

            {!contentWatched && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <button
                  onClick={() => setContentWatched(true)}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-[0.98] transition-all font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Отметить как изученное
                </button>
              </div>
            )}
          </div>
        )}

        {/* Audio Content */}
        {contentMode === 'audio' && (
          <div className="bg-card rounded-xl border border-border/60 p-6 sm:p-8 mb-6 sm:mb-8">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-900 dark:text-yellow-300">
                <strong>🚧 Скоро доступно</strong><br />
                Аудиолекции находятся в разработке. Пока используйте текстовый конспект или видео.
              </p>
            </div>
          </div>
        )}

        {/* Video Content */}
        {contentMode === 'video' && (
          <div className="bg-card rounded-xl border border-border/60 p-6 sm:p-8 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Видео-урок</h2>
            <div className="aspect-video">
              <iframe
                className="w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/YJ57Lp5MkIQ"
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => {
                  setTimeout(() => setContentWatched(true), 5000);
                }}
              />
            </div>
          </div>
        )}

        <div className="bg-card rounded-xl border border-border/60 p-8">
          <h2 className="text-2xl font-bold mb-6">Тест на понимание 📝</h2>
          <Quiz questions={[
            { question: "Чему равен модуль числа -15?", options: ["15", "10", "-15", "0"], correct: 0 },
            { question: "Является ли 0 рациональным числом?", options: ["Да, 0 = 0/1", "Нет", "Только положительные", "Только целые"], correct: 0 },
            { question: "Вычислите: -6 + (-9)", options: ["-15", "-3", "3", "15"], correct: 0 },
            { question: "Вычислите: 5 - (-3)", options: ["8", "2", "-8", "5"], correct: 0 },
            { question: "Найдите |−2,3|", options: ["2,3", "-2,3", "0", "4,6"], correct: 0 },
            { question: "Вычислите: (-4) × 5", options: ["-20", "20", "-1", "9"], correct: 0 },
            { question: "Вычислите: (-18) : (-6)", options: ["3", "-3", "24", "-24"], correct: 0 },
            { question: "Какой знак будет иметь произведение трёх отрицательных чисел?", options: ["Минус", "Плюс", "Ноль", "Зависит от чисел"], correct: 0 },
            { question: "Представьте 0,(3) в виде обыкновенной дроби", options: ["1/3", "3/10", "1/9", "0,3"], correct: 0 },
            { question: "Решите: |x| = 5", options: ["x = 5 или x = -5", "x = 5", "x = -5", "нет решений"], correct: 0 }
          ]} />
        </div>
      </div>
    </div>
  );
}
