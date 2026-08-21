import os
import re

# Тесты из PDF - правильные ответы
tests_data = {
    "grade7_q1": {  # Рациональные числа
        "title": "Рациональные числа. Модуль числа",
        "tests": [
            {"q": "Чему равен модуль числа -15?", "correct": "15", "wrong": ["10", "-15", "0"]},
            {"q": "Является ли 0 рациональным числом?", "correct": "Да, 0 = 0/1", "wrong": ["Нет", "Только положительные", "Только целые"]},
            {"q": "Вычислите: -6 + (-9)", "correct": "-15", "wrong": ["-3", "3", "15"]},
            {"q": "Вычислите: 5 - (-3)", "correct": "8", "wrong": ["2", "-8", "5"]},
            {"q": "Найдите |−2,3|", "correct": "2,3", "wrong": ["-2,3", "0", "4,6"]},
            {"q": "Вычислите: (-4) × 5", "correct": "-20", "wrong": ["20", "-1", "9"]},
            {"q": "Вычислите: (-18) : (-6)", "correct": "3", "wrong": ["-3", "24", "-24"]},
            {"q": "Какой знак будет иметь произведение трёх отрицательных чисел?", "correct": "Минус", "wrong": ["Плюс", "Ноль", "Зависит от чисел"]},
            {"q": "Представьте 0,(3) в виде обыкновенной дроби", "correct": "1/3", "wrong": ["3/10", "1/9", "0,3"]},
            {"q": "Решите: |x| = 5", "correct": "x = 5 или x = -5", "wrong": ["x = 5", "x = -5", "нет решений"]},
        ]
    },
    "grade7_q2": {  # Одночлены и многочлены
        "title": "Одночлены и многочлены",
        "tests": [
            {"q": "Чему равна степень одночлена 4x³y²?", "correct": "5", "wrong": ["6", "4", "3"]},
            {"q": "Приведите к стандартному виду: 2a·(-3ab)", "correct": "-6a²b", "wrong": ["6a²b", "-6ab", "-6a²b²"]},
            {"q": "Найдите сумму: (2x+1)+(3x-4)", "correct": "5x - 3", "wrong": ["5x + 3", "x - 3", "5x - 5"]},
            {"q": "Раскройте скобки: 3(x-2)", "correct": "3x - 6", "wrong": ["3x + 6", "x - 6", "3x - 2"]},
            {"q": "Раскройте скобки: (x+2)(x+3)", "correct": "x² + 5x + 6", "wrong": ["x² + 6", "x² + 5x", "x² + 6x + 5"]},
            {"q": "Приведите подобные: 5x² - 3x² + x²", "correct": "3x²", "wrong": ["9x²", "x²", "5x²"]},
            {"q": "Умножьте одночлены: 2x³ · 5x²", "correct": "10x⁵", "wrong": ["10x⁶", "7x⁵", "10x"]},
            {"q": "Чему равна степень многочлена 2x⁴ - 3x + 7?", "correct": "4", "wrong": ["7", "3", "1"]},
            {"q": "Вычтите: (4x-1) - (2x+3)", "correct": "2x - 4", "wrong": ["2x + 2", "6x + 2", "2x - 2"]},
            {"q": "Раскройте скобки: -2(3x - 5)", "correct": "-6x + 10", "wrong": ["-6x - 10", "6x + 10", "-6x - 5"]},
        ]
    },
    # ... добавим остальные 22 темы
}

# Функция генерации JSX для quiz
def generate_quiz_jsx(tests):
    jsx = '''
        <div className="bg-card rounded-xl border border-border/60 p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Тест на понимание 📝</h2>
          <Quiz questions={[
'''

    for i, test in enumerate(tests):
        options = [test['correct']] + test['wrong']
        # Shuffle не делаем, чтобы правильный был первым (потом в компоненте перемешаем)
        options_jsx = ', '.join([f'"{opt}"' for opt in options])
        jsx += f'''            {{
              question: "{test['q']}",
              options: [{options_jsx}],
              correct: 0  // Индекс правильного ответа (будет перемешан в компоненте)
            }},
'''

    jsx += '''          ]} />
        </div>
'''
    return jsx

# Компонент Quiz
quiz_component = '''
"use client";
import { useState } from "react";

function Quiz({ questions }: { questions: Array<{question: string, options: string[], correct: number}> }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Перемешиваем варианты при первом рендере
  const [shuffledQuestions] = useState(() =>
    questions.map(q => {
      const shuffled = [...q.options];
      const correctAnswer = shuffled[q.correct];
      // Fisher-Yates shuffle
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return {
        ...q,
        options: shuffled,
        correct: shuffled.indexOf(correctAnswer)
      };
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
'''

print("Генерирую тесты для статических страниц...")

# Пока добавлю только для первых двух
for page_id, data in tests_data.items():
    file_path = f"C:\\Users\\Ulagat\\FM-Edu\\app\\courses\\mathematics-static\\{page_id}\\page.tsx"

    if not os.path.exists(file_path):
        print(f"⚠️ Файл не найден: {file_path}")
        continue

    # Читаем файл
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Добавляем Quiz компонент в начало
    if '"use client"' not in content:
        content = '"use client";\nimport { useState } from "react";\n\n' + content
        # Добавляем функцию Quiz перед export default
        content = content.replace('export default function', quiz_component + '\n\nexport default function')

    # Добавляем quiz перед закрывающим </div></div>
    quiz_jsx = generate_quiz_jsx(data['tests'])
    content = content.replace('      </div>\n    </div>\n  );\n}', f'      </div>\n{quiz_jsx}      </div>\n    </div>\n  );\n}}')

    # Записываем
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✅ {page_id}: добавлен quiz с {len(data['tests'])} вопросами")

print("\n🎉 Готово!")
