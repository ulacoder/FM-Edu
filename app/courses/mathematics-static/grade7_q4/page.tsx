
"use client";
import { useState, useEffect } from "react";

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
            <span>🤖</span> AI Анализ твоих результатов
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
            <span className="text-xl">🤖</span>
            <span className="text-sm">{aiFeedback}</span>
          </p>
        </div>
      )}
    </div>
  );
}


export default function Lesson_grade7_q4() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Линейные уравнения</h1>
          <p className="text-muted-foreground">Математика • 7 класс • 4 четверть</p>
        </div>

        <div className="bg-card rounded-xl border border-border/60 p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mt-6 mb-4">Определение</h2>
            <p className="my-2">Линейное уравнение с одной переменной — уравнение вида ax + b = 0, где a и b — числа, x — переменная. Если a≠0, уравнение имеет единственный корень. Система линейных уравнений с двумя переменными — пара уравнений вида a₁x+b₁y=c₁, a₂x+b₂y=c₂; решить систему — значит найти все пары (x;y), удовлетворяющие обоим уравнениям.</p>
            <h2 className="text-2xl font-bold mt-6 mb-4">Ключевые формулы</h2>
            <p className="my-2">ax + b = 0 ⟹ x = -b/a (при a≠0)</p>
            <p className="my-2">Если a=0, b≠0 — корней нет; если a=0, b=0 — корень любое число</p>
            <p className="my-2">Способ подстановки: выразить одну переменную через другую и подставить во второе уравнение</p>
            <p className="my-2">Способ сложения: уравнения складывают/вычитают, чтобы исключить одну из переменных</p>
            <h2 className="text-2xl font-bold mt-6 mb-4">Примеры решения задач</h2>
            <p className="font-bold mt-4">Пример 1. Решите уравнение 3x - 7 = 5.</p>
            <p className="ml-4 text-muted-foreground">Решение: 3x = 5+7 = 12; x = 4.</p>
            <p className="font-bold mt-4">Пример 2. Решите систему: x+y=7, x-y=1.</p>
            <p className="ml-4 text-muted-foreground">Решение: Складываем уравнения: 2x=8, x=4. Тогда y=7-4=3. Ответ: (4;3).</p>
            <p className="font-bold mt-4">Пример 3. Решите систему методом подстановки: y=2x-1, 3x+y=9.</p>
            <p className="ml-4 text-muted-foreground">Решение: Подставляем: 3x+(2x-1)=9 → 5x=10 → x=2, y=2·2-1=3. Ответ: (2;3).</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/60 p-8">
          <h2 className="text-2xl font-bold mb-4">Видео-урок</h2>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/I7ZWxuf1Ql4"
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
  
        <div className="bg-card rounded-xl border border-border/60 p-8">
          <h2 className="text-2xl font-bold mb-6">Тест на понимание 📝</h2>
          <Quiz questions={[
            { question: "Что такое линейное уравнение?", options: ["ax+b=0", "x²=0", "a/x=b", "ax²+b=0"], correct: 0 },
            { question: "Решите: 2x-6=0", options: ["x=3", "x=-3", "x=0", "x=6"], correct: 0 },
            { question: "Решите: x/3=5", options: ["x=15", "x=3", "x=5/3", "x=5"], correct: 0 },
            { question: "Решите: 5(x-1)=10", options: ["x=3", "x=1", "x=2", "x=5"], correct: 0 },
            { question: "Решите систему: x+y=5, x-y=1", options: ["x=3, y=2", "x=2, y=3", "x=4, y=1", "x=5, y=0"], correct: 0 },
            { question: "Чему равен корень уравнения 3x=9?", options: ["x=3", "x=9", "x=6", "x=1"], correct: 0 },
            { question: "Решите: 2(x+3)=x+10", options: ["x=4", "x=2", "x=3", "x=5"], correct: 0 },
            { question: "При каком x выполнено: x-5=0?", options: ["x=5", "x=-5", "x=0", "нет решений"], correct: 0 },
            { question: "Решите: 4x=2x+6", options: ["x=3", "x=2", "x=6", "x=1"], correct: 0 },
            { question: "Сколько решений: x+1=x+2?", options: ["0 (нет решений)", "1", "2", "бесконечно много"], correct: 0 }
          ]} />
        </div>

      </div>
      </div>
    </div>
  );
}
