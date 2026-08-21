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
    setShuffledQuestions(questions.map(q => {
      const shuffled = [...q.options];
      const correctAnswer = shuffled[q.correct];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return { ...q, options: shuffled, correct: shuffled.indexOf(correctAnswer) };
    }));
  }, []);

  const generateAIFeedback = (isCorrect: boolean, question: string, userAnswer: string, correctAnswer: string) => {
    if (isCorrect) {
      const encouragements = ["Отлично! Ты правильно понял концепцию! 🎉", "Супер! Продолжай в том же духе! 💪", "Точно! Ты молодец! ⭐", "Правильно! У тебя хорошо получается! 🔥"];
      return encouragements[Math.floor(Math.random() * encouragements.length)];
    } else {
      return `Не переживай! Правильный ответ: "${correctAnswer}". Повтори эту тему и попробуй ещё раз! 📚`;
    }
  };

  const generateFinalAnalysis = (score: number, total: number, mistakes: Array<{question: string, userAnswer: string, correctAnswer: string}>) => {
    const percentage = Math.round((score / total) * 100);
    if (percentage >= 80) {
      return `Невероятно! Ты набрал ${score} из ${total} (${percentage}%)! 🎉\n\nТы отлично усвоил материал! Можешь смело переходить к следующей теме. Так держать! 💪`;
    } else if (percentage >= 60) {
      return `Хороший результат! ${score} из ${total} (${percentage}%)! 👍\n\nУ тебя неплохая база, но есть моменты которые стоит подтянуть. Повтори эти темы и попробуй ещё раз! Ты на правильном пути! 🔥`;
    } else {
      return `Получилось ${score} из ${total} (${percentage}%) 📚\n\nНе расстраивайся! Все с чего-то начинают. Повтори материал по этим темам, посмотри видео-урок ещё раз, и попробуй снова! У тебя всё получится! 💪`;
    }
  };

  const handleAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    const isCorrect = idx === shuffledQuestions[currentQ].correct;
    const feedback = generateAIFeedback(isCorrect, shuffledQuestions[currentQ].question, shuffledQuestions[currentQ].options[idx], shuffledQuestions[currentQ].options[shuffledQuestions[currentQ].correct]);
    setAiFeedback(feedback);
    if (!isCorrect) {
      setWrongAnswers([...wrongAnswers, {question: shuffledQuestions[currentQ].question, userAnswer: shuffledQuestions[currentQ].options[idx], correctAnswer: shuffledQuestions[currentQ].options[shuffledQuestions[currentQ].correct]}]);
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
          <h4 className="text-xl font-bold mb-3 flex items-center gap-2"><span>🤖</span> AI Анализ твоих результатов</h4>
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
        <button onClick={() => {setCurrentQ(0); setScore(0); setShowResult(false); setSelectedAnswer(null); setWrongAnswers([]); setAiFeedback("");}} className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">Пройти тест заново</button>
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
          <button key={idx} onClick={() => handleAnswer(idx)} disabled={selectedAnswer !== null} className={`w-full p-4 text-left rounded-lg border-2 transition-all ${selectedAnswer === null ? "border-gray-300 hover:border-purple-600 hover:bg-purple-50" : selectedAnswer === idx ? (idx === shuffledQuestions[currentQ].correct ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50") : idx === shuffledQuestions[currentQ].correct ? "border-green-500 bg-green-50" : "border-gray-300"}`}>{opt}</button>
        ))}
      </div>
      {aiFeedback && (
        <div className={`p-4 rounded-lg ${selectedAnswer === shuffledQuestions[currentQ].correct ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <p className="flex items-start gap-2"><span className="text-xl">🤖</span><span className="text-sm">{aiFeedback}</span></p>
        </div>
      )}
    </div>
  );
}
export default function Lesson_grade8_q3() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Электрические явления</h1>
          <p className="text-muted-foreground">Физика • 8 класс • 3 четверть</p>
        </div>

        <div className="bg-card rounded-xl border border-border/60 p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mt-6 mb-4">Определения</h2>
<p className="my-2"><strong>Электрический ток</strong> — упорядоченное движение заряженных частиц.</p>
<p className="my-2"><strong>Сила тока (I)</strong> — физическая величина, равная отношению заряда, прошедшего через проводник, ко времени.</p>
<p className="my-2"><strong>Напряжение (U)</strong> — работа электрического поля по перемещению единичного заряда.</p>
<p className="my-2"><strong>Сопротивление (R)</strong> — физическая величина, характеризующая противодействие проводника электрическому току.</p>
            <h2 className="text-2xl font-bold mt-6 mb-4">Ключевые формулы</h2>
<p className="my-2">I = q/t — сила тока, Ампер (А)</p>
<p className="my-2">U = A/q — напряжение, Вольт (В)</p>
<p className="my-2">R = ρl/S — сопротивление проводника, Ом</p>
            <h2 className="text-2xl font-bold mt-6 mb-4">Примеры решения задач</h2>
<p className="font-bold mt-4">Пример 1. Через проводник за 2 с прошёл заряд 4 Кл. Найдите силу тока.</p>
<p className="ml-4 text-muted-foreground">Решение: I = q/t = 4 Кл / 2 с = 2 А.</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/60 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Видео-урок</h2>
          <div className="aspect-video">
            <iframe className="w-full h-full rounded-lg" src="https://www.youtube.com/embed/WHlvMDh5v3U" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/60 p-8">
          <h2 className="text-2xl font-bold mb-6">Тест на понимание 📝</h2>
          <Quiz questions={[
{ question: "Что такое электрический ток?", options: ["Упорядоченное движение заряженных частиц", "Беспорядочное движение частиц", "Движение электронов", "Движение протонов"], correct: 0 },
{ question: "Единица силы тока?", options: ["Ампер (А)", "Вольт (В)", "Ом (Ом)", "Ватт (Вт)"], correct: 0 },
{ question: "Формула силы тока?", options: ["I = q/t", "I = U/R", "I = P/U", "I = A/t"], correct: 0 },
{ question: "Единица напряжения?", options: ["Вольт (В)", "Ампер (А)", "Ом (Ом)", "Джоуль (Дж)"], correct: 0 }
          ]} />
        </div>
      </div>
    </div>
  );
}