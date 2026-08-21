"use client";
import { useState, useEffect } from "react";

function Quiz({ questions }: { questions: Array<{question: string, options: string[], correct: number}> }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Перемешиваем варианты при первом рендере
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

  const handleAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    setTimeout(() => {
      if (idx === shuffledQuestions[currentQ].correct) {
        setScore(score + 1);
      }

      if (currentQ < shuffledQuestions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  if (showResult) {
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    return (
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">Результат: {score}/{shuffledQuestions.length}</h3>
        <div className="text-6xl mb-4">
          {percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "📚"}
        </div>
        <p className="text-xl mb-6">
          {percentage >= 80 ? "Отлично!" : percentage >= 60 ? "Хорошо!" : "Нужно повторить материал"}
        </p>
        <button
          onClick={() => {
            setCurrentQ(0);
            setScore(0);
            setShowResult(false);
            setSelectedAnswer(null);
          }}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Пройти заново
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">Вопрос {currentQ + 1} из {shuffledQuestions.length}</p>
        <div className="h-2 bg-gray-200 rounded-full mt-2">
          <div
            className="h-2 bg-primary rounded-full transition-all"
            style={{ width: `${((currentQ + 1) / shuffledQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">{shuffledQuestions[currentQ].question}</h3>

      <div className="space-y-3">
        {shuffledQuestions[currentQ].options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            disabled={selectedAnswer !== null}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              selectedAnswer === null
                ? "border-gray-300 hover:border-primary hover:bg-primary/5"
                : selectedAnswer === idx
                ? idx === shuffledQuestions[currentQ].correct
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
                : idx === shuffledQuestions[currentQ].correct
                ? "border-green-500 bg-green-50"
                : "border-gray-300"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Lesson_grade7_q2() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Одночлены и многочлены</h1>
          <p className="text-muted-foreground">Математика • 7 класс • 2 четверть</p>
        </div>

        <div className="bg-card rounded-xl border border-border/60 p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mt-6 mb-4">Определение</h2>
            <p className="my-2">Одночлен — произведение чисел, переменных и их степеней (например, 5x²y). Стандартный вид одночлена — когда числовой коэффициент стоит на первом месте, а переменные записаны в алфавитном порядке со своими степенями. Многочлен — сумма одночленов (его членов). Степень многочлена — наибольшая из степеней входящих в него одночленов.</p>
            <h2 className="text-2xl font-bold mt-6 mb-4">Ключевые формулы</h2>
            <p className="my-2">Сложение/вычитание многочленов — приведение подобных слагаемых (слагаемых с одинаковой буквенной частью)</p>
            <p className="my-2">Умножение одночлена на многочлен: a(b+c) = ab + ac</p>
            <p className="my-2">Умножение многочлена на многочлен: (a+b)(c+d) = ac + ad + bc + bd</p>
            <p className="my-2">При умножении степеней с одинаковым основанием показатели складываются: xᵐ·xⁿ = xᵐ⁺ⁿ</p>
            <h2 className="text-2xl font-bold mt-6 mb-4">Примеры решения задач</h2>
            <p className="font-bold mt-4">Пример 1. Приведите одночлен 3x²y·(-2xy³) к стандартному виду.</p>
            <p className="ml-4 text-muted-foreground">Решение: Коэффициенты: 3·(-2) = -6. Переменные: x²·x = x³, y·y³ = y⁴. Ответ: -6x³y⁴.</p>
            <p className="font-bold mt-4">Пример 2. Упростите: (3x² + 2x - 5) + (x² - 4x + 7).</p>
            <p className="ml-4 text-muted-foreground">Решение: Складываем подобные члены: (3x²+x²) + (2x-4x) + (-5+7) = 4x² - 2x + 2.</p>
            <p className="font-bold mt-4">Пример 3. Раскройте скобки: (x+3)(x-5).</p>
            <p className="ml-4 text-muted-foreground">Решение: x·x + x·(-5) + 3·x + 3·(-5) = x² - 5x + 3x - 15 = x² - 2x - 15.</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/60 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Видео-урок</h2>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/oMIG561sv7I"
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/60 p-8">
          <h2 className="text-2xl font-bold mb-6">Тест на понимание 📝</h2>
          <Quiz questions={[
            {
              question: "Чему равна степень одночлена 4x³y²?",
              options: ["5", "6", "4", "3"],
              correct: 0
            },
            {
              question: "Приведите к стандартному виду: 2a·(-3ab)",
              options: ["-6a²b", "6a²b", "-6ab", "-6a²b²"],
              correct: 0
            },
            {
              question: "Найдите сумму: (2x+1)+(3x-4)",
              options: ["5x - 3", "5x + 3", "x - 3", "5x - 5"],
              correct: 0
            },
            {
              question: "Раскройте скобки: 3(x-2)",
              options: ["3x - 6", "3x + 6", "x - 6", "3x - 2"],
              correct: 0
            },
            {
              question: "Раскройте скобки: (x+2)(x+3)",
              options: ["x² + 5x + 6", "x² + 6", "x² + 5x", "x² + 6x + 5"],
              correct: 0
            },
            {
              question: "Приведите подобные: 5x² - 3x² + x²",
              options: ["3x²", "9x²", "x²", "5x²"],
              correct: 0
            },
            {
              question: "Умножьте одночлены: 2x³ · 5x²",
              options: ["10x⁵", "10x⁶", "7x⁵", "10x"],
              correct: 0
            },
            {
              question: "Чему равна степень многочлена 2x⁴ - 3x + 7?",
              options: ["4", "7", "3", "1"],
              correct: 0
            },
            {
              question: "Вычтите: (4x-1) - (2x+3)",
              options: ["2x - 4", "2x + 2", "6x + 2", "2x - 2"],
              correct: 0
            },
            {
              question: "Раскройте скобки: -2(3x - 5)",
              options: ["-6x + 10", "-6x - 10", "6x + 10", "-6x - 5"],
              correct: 0
            },
          ]} />
        </div>
      </div>
    </div>
  );
}
