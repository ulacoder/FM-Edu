import pdfplumber
import os
import re

pdf_path = r'C:\Users\Ulagat\Downloads\Математика 7-12 класс - конспект по темам.pdf'
output_dir = r'C:\Users\Ulagat\FM-Edu\app\courses\mathematics'

# All 24 topics mapping
topics = [
    {"slug": "racionalnye-chisla", "grade": "7", "quarter": "2", "title": "Рациональные числа. Модуль числа", "desc": "Действия с рациональными числами, модуль числа"},
    {"slug": "odnochlen-mnogochlen", "grade": "7", "quarter": "2", "title": "Одночлены и многочлены", "desc": "Стандартный вид одночлена, операции с многочленами"},
    {"slug": "formuly-sokr-umnozh", "grade": "7", "quarter": "3", "title": "Формулы сокращённого умножения", "desc": "Квадрат суммы и разности, разность квадратов"},
    {"slug": "razlozhenie-mnozhiteli", "grade": "7", "quarter": "3", "title": "Разложение на множители", "desc": "Вынесение за скобки, группировка, формулы"},
    {"slug": "lineynye-uravneniya", "grade": "7", "quarter": "4", "title": "Линейные уравнения", "desc": "Решение линейных уравнений с одной переменной"},
    {"slug": "funkcii-grafiki", "grade": "8", "quarter": "1", "title": "Функции и их графики", "desc": "Понятие функции, способы задания, график функции"},
    {"slug": "kvadratnye-korni", "grade": "8", "quarter": "2", "title": "Квадратные корни", "desc": "Арифметический квадратный корень, его свойства"},
    {"slug": "kvadratnye-uravneniya", "grade": "8", "quarter": "3", "title": "Квадратные уравнения", "desc": "Решение квадратных уравнений через дискриминант"},
    {"slug": "neravenstva", "grade": "8", "quarter": "4", "title": "Неравенства", "desc": "Линейные и квадратные неравенства, системы неравенств"},
    {"slug": "posledovatelnosti", "grade": "9", "quarter": "1", "title": "Последовательности", "desc": "Числовые последовательности, способы задания"},
    {"slug": "progressii", "grade": "9", "quarter": "2", "title": "Арифметическая и геометрическая прогрессии", "desc": "Формулы n-го члена и суммы прогрессий"},
    {"slug": "elementy-statistiki", "grade": "9", "quarter": "3", "title": "Элементы статистики", "desc": "Среднее значение, медиана, мода, размах"},
    {"slug": "irracionalnye-uravneniya", "grade": "10", "quarter": "1", "title": "Иррациональные уравнения", "desc": "Решение уравнений с корнями"},
    {"slug": "pokazatelnye-uravneniya", "grade": "10", "quarter": "2", "title": "Показательные уравнения", "desc": "Решение уравнений с показательной функцией"},
    {"slug": "logarifmy", "grade": "10", "quarter": "3", "title": "Логарифмы", "desc": "Определение логарифма, свойства логарифмов"},
    {"slug": "logarifmicheskie-uravneniya", "grade": "10", "quarter": "4", "title": "Логарифмические уравнения", "desc": "Решение уравнений с логарифмами"},
    {"slug": "trigonometriya-osnovy", "grade": "11", "quarter": "1", "title": "Тригонометрия: основы", "desc": "Радианная мера, единичная окружность, синус и косинус"},
    {"slug": "trigonometricheskie-formuly", "grade": "11", "quarter": "2", "title": "Тригонометрические формулы", "desc": "Формулы приведения, сложения, двойного угла"},
    {"slug": "trigonometricheskie-uravneniya", "grade": "11", "quarter": "3", "title": "Тригонометрические уравнения", "desc": "Решение простейших и сложных тригонометрических уравнений"},
    {"slug": "proizvodnaya", "grade": "11", "quarter": "4", "title": "Производная функции", "desc": "Определение производной, правила дифференцирования"},
    {"slug": "primenenie-proizvodnoy", "grade": "12", "quarter": "1", "title": "Применение производной", "desc": "Исследование функций, экстремумы, построение графиков"},
    {"slug": "integral", "grade": "12", "quarter": "2", "title": "Первообразная и интеграл", "desc": "Неопределённый и определённый интеграл"},
    {"slug": "teoriya-veroyatnostey", "grade": "12", "quarter": "3", "title": "Теория вероятностей", "desc": "Случайные события, вероятность, комбинаторика"},
    {"slug": "mat-statistika", "grade": "12", "quarter": "4", "title": "Математическая статистика", "desc": "Среднее, дисперсия, статистические характеристики"}
]

print("📖 Читаю PDF...")
with pdfplumber.open(pdf_path) as pdf:
    full_text = ''
    for page in pdf.pages:
        text = page.extract_text()
        if text:
            full_text += text + '\n'

print(f"✅ Извлечено {len(full_text)} символов")

# Split by topic headers (numbered topics)
topic_pattern = r'\n\d+\.\s+([А-Яа-яёЁ\s\.\,\-]+)\n'
topic_splits = re.split(topic_pattern, full_text)

print(f"📑 Найдено разделов: {len(topic_splits)}")

# Parse each topic
for i, topic_info in enumerate(topics):
    print(f"\n🔨 Создаю урок {i+1}/24: {topic_info['title']}")

    # Find corresponding section in PDF
    section_idx = (i * 2) + 1
    if section_idx + 1 < len(topic_splits):
        section_title = topic_splits[section_idx].strip()
        section_content = topic_splits[section_idx + 1]
    else:
        print(f"⚠️ Секция не найдена для {topic_info['title']}, пропускаю")
        continue

    # Extract test questions
    tests = []
    test_match = re.search(r'Тестовые вопросы.*?\n(.*?)(?=Видео по теме|$|\n\d+\.\s+[А-Я])', section_content, re.DOTALL)

    if test_match:
        test_block = test_match.group(1)
        # Parse table: question lines start with number, answer is next line
        lines = [l.strip() for l in test_block.split('\n') if l.strip()]

        current_q = None
        for line in lines:
            if re.match(r'^\d+\.', line):
                if current_q and current_q['answer']:
                    tests.append(current_q)
                current_q = {'question': re.sub(r'^\d+\.\s*', '', line), 'answer': ''}
            elif current_q and not current_q['answer'] and not line.startswith('Вопрос') and not line.startswith('Ответ'):
                current_q['answer'] = line

        if current_q and current_q['answer']:
            tests.append(current_q)

    print(f"   📝 Найдено {len(tests)} тестовых вопросов")

    # Extract video URL
    video_id = "8JQof2M1KQk"  # default
    video_match = re.search(r'youtube\.com/watch\?v=([A-Za-z0-9_-]+)', section_content)
    if video_match:
        video_id = video_match.group(1)

    # Escape special chars for JSX
    def escape_jsx(text):
        return text.replace('{', '{{').replace('}', '}}').replace('<', "{'<'}").replace('>', "{'>'}")

    # Generate TSX
    test_items_jsx = ''
    for idx, test in enumerate(tests[:10]):
        q = escape_jsx(test['question'])
        a = escape_jsx(test['answer'])
        test_items_jsx += f'''    {{ question: "{q}", answer: "{a}" }},\n'''

    jsx_code = f'''"use client";

import {{ useRouter }} from "next/navigation";
import {{ ArrowLeft, BookOpen, PlayCircle, FileText }} from "lucide-react";
import {{ useState }} from "react";

export default function Lesson{topic_info['slug'].replace('-', '_').title()}() {{
  const router = useRouter();
  const [showTest, setShowTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const testQuestions = [
{test_items_jsx}  ];

  const handleStartTest = () => {{
    setShowTest(true);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResults(false);
  }};

  const handleAnswer = (answer: string) => {{
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    if (currentQuestion < testQuestions.length - 1) {{
      setCurrentQuestion(currentQuestion + 1);
    }} else {{
      setShowResults(true);
    }}
  }};

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={{() => router.push('/courses/mathematics')}}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Назад к темам</span>
          </button>

          <div className="mb-8">
            <div className="text-sm text-muted-foreground mb-2">
              Математика • {topic_info['grade']} класс • {topic_info['quarter']} четверть
            </div>
            <h1 className="text-4xl font-bold mb-2">{escape_jsx(topic_info['title'])}</h1>
            <p className="text-lg text-muted-foreground">{escape_jsx(topic_info['desc'])}</p>
          </div>

          <div className="space-y-6">
            <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  <div>
                    <h2 className="text-2xl font-bold">Конспект урока</h2>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="lesson-content prose prose-lg max-w-none">
                  <p className="text-muted-foreground">Контент урока из PDF будет здесь...</p>
                </div>
              </div>
            </div>

            <div className="bg-card border-2 border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <PlayCircle className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-bold">Видео-урок</h2>
              </div>
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/{video_id}"
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="bg-card border-2 border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
                <div>
                  <h2 className="text-2xl font-bold">Тест на понимание</h2>
                  <p className="text-sm text-muted-foreground">{{testQuestions.length}} вопросов • Проверь свои знания</p>
                </div>
              </div>

              {{!showTest ? (
                <button
                  onClick={{handleStartTest}}
                  className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Начать тест
                </button>
              ) : !showResults ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">
                      Вопрос {{currentQuestion + 1}} из {{testQuestions.length}}
                    </span>
                    <div className="h-2 flex-1 max-w-xs bg-gray-200 rounded-full ml-4">
                      <div
                        className="h-2 bg-primary rounded-full transition-all"
                        style={{{{ width: `${{((currentQuestion + 1) / testQuestions.length) * 100}}%` }}}}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-6">
                      {{testQuestions[currentQuestion].question}}
                    </h3>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Введи свой ответ..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                        onKeyDown={{(e) => {{
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {{
                            handleAnswer(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }}
                        }}}}
                        autoFocus
                      />

                      <button
                        onClick={{(e) => {{
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (input.value.trim()) {{
                            handleAnswer(input.value);
                            input.value = '';
                          }}
                        }}}}
                        className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        {{currentQuestion < testQuestions.length - 1 ? 'Далее' : 'Завершить'}}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                    <h3 className="text-2xl font-bold mb-2">Тест завершён! 🎉</h3>
                    <p className="text-lg text-muted-foreground mb-4">
                      Вот твои ответы и правильные варианты:
                    </p>
                  </div>

                  <div className="space-y-3">
                    {{testQuestions.map((q, idx) => (
                      <details key={{idx}} className="bg-gray-50 p-4 rounded-lg">
                        <summary className="font-medium cursor-pointer">
                          {{idx + 1}}. {{q.question}}
                        </summary>
                        <div className="mt-3 space-y-2">
                          <p className="text-gray-600">
                            <strong>Твой ответ:</strong> {{userAnswers[idx] || '(не ответил)'}}
                          </p>
                          <p className="text-green-600">
                            <strong>Правильный ответ:</strong> {{q.answer}}
                          </p>
                        </div>
                      </details>
                    ))}}
                  </div>

                  <button
                    onClick={{() => {{
                      setShowTest(false);
                      setShowResults(false);
                      setCurrentQuestion(0);
                      setUserAnswers([]);
                    }}}}
                    className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Пройти тест заново
                  </button>
                </div>
              )}}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}}
'''

    # Create folder and file
    folder_path = os.path.join(output_dir, topic_info['slug'])
    os.makedirs(folder_path, exist_ok=True)

    file_path = os.path.join(folder_path, 'page.tsx')
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(jsx_code)

    print(f"   ✅ Создан файл: {file_path}")

print("\n🎉 ГОТОВО! Создано 24 урока с тестами!")
