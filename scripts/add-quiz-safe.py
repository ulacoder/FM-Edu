import os
import glob

# Quiz компонент (один раз в начале файла)
quiz_component = '''
"use client";
import { useState } from "react";

function Quiz({ questions }: { questions: Array<{question: string, options: string[], correct: number}> }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const [shuffledQuestions] = useState(() =>
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
        <div className="text-6xl mb-4">{percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "📚"}</div>
        <p className="text-xl mb-6">{percentage >= 80 ? "Отлично!" : percentage >= 60 ? "Хорошо!" : "Нужно повторить материал"}</p>
        <button onClick={() => { setCurrentQ(0); setScore(0); setShowResult(false); setSelectedAnswer(null); }} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Пройти заново</button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Вопрос {currentQ + 1} из {shuffledQuestions.length}</p>
        <div className="h-2 bg-gray-200 rounded-full mt-2"><div className="h-2 bg-purple-600 rounded-full transition-all" style={{ width: `${((currentQ + 1) / shuffledQuestions.length) * 100}%` }} /></div>
      </div>
      <h3 className="text-xl font-semibold mb-4">{shuffledQuestions[currentQ].question}</h3>
      <div className="space-y-3">
        {shuffledQuestions[currentQ].options.map((opt, idx) => (
          <button key={idx} onClick={() => handleAnswer(idx)} disabled={selectedAnswer !== null}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              selectedAnswer === null ? "border-gray-300 hover:border-purple-600 hover:bg-purple-50" :
              selectedAnswer === idx ? (idx === shuffledQuestions[currentQ].correct ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50") :
              idx === shuffledQuestions[currentQ].correct ? "border-green-500 bg-green-50" : "border-gray-300"
            }`}>{opt}</button>
        ))}
      </div>
    </div>
  );
}
'''

# Тесты для 7 класс Q1 (Рациональные числа)
tests_grade7_q1 = '''
            {
              question: "Чему равен модуль числа -15?",
              options: ["15", "10", "-15", "0"],
              correct: 0
            },
            {
              question: "Является ли 0 рациональным числом?",
              options: ["Да, 0 = 0/1", "Нет", "Только положительные", "Только целые"],
              correct: 0
            },
            {
              question: "Вычислите: -6 + (-9)",
              options: ["-15", "-3", "3", "15"],
              correct: 0
            },
            {
              question: "Вычислите: 5 - (-3)",
              options: ["8", "2", "-8", "5"],
              correct: 0
            },
            {
              question: "Найдите |−2,3|",
              options: ["2,3", "-2,3", "0", "4,6"],
              correct: 0
            },
            {
              question: "Вычислите: (-4) × 5",
              options: ["-20", "20", "-1", "9"],
              correct: 0
            },
            {
              question: "Вычислите: (-18) : (-6)",
              options: ["3", "-3", "24", "-24"],
              correct: 0
            },
            {
              question: "Какой знак будет иметь произведение трёх отрицательных чисел?",
              options: ["Минус", "Плюс", "Ноль", "Зависит от чисел"],
              correct: 0
            },
            {
              question: "Представьте 0,(3) в виде обыкновенной дроби",
              options: ["1/3", "3/10", "1/9", "0,3"],
              correct: 0
            },
            {
              question: "Решите: |x| = 5",
              options: ["x = 5 или x = -5", "x = 5", "x = -5", "нет решений"],
              correct: 0
            }'''

# Находим файл grade7_q1
file_path = r'C:\Users\Ulagat\FM-Edu\app\courses\mathematics-static\grade7_q1\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Добавляем "use client" и Quiz компонент в начало
if '"use client"' not in content:
    content = quiz_component + '\n\n' + content

# Находим последний </div> перед закрывающей скобкой export default function
# Добавляем тест ПЕРЕД закрытием <div className="max-w-4xl...">
test_section = f'''
        <div className="bg-card rounded-xl border border-border/60 p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Тест на понимание 📝</h2>
          <Quiz questions={{[
{tests_grade7_q1}
          ]}} />
        </div>'''

# Вставляем перед последним закрытием </div></div>
content = content.replace('      </div>\n    </div>\n  );\n}', f'{test_section}\n      </div>\n    </div>\n  );\n}}')

# Записываем обратно
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Добавлен тест в grade7_q1")
