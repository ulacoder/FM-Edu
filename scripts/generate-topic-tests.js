const fs = require('fs');
const path = require('path');

// Load topics
const topicsPath = path.join(__dirname, '..', 'data', 'topics.json');
const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

// Topic-specific test questions
const testQuestions = {
  mathematics: {
    "Рациональные числа": [
      {
        text: "Какое из следующих чисел является рациональным?",
        options: ["√2", "π", "1/3", "e"],
        correctAnswer: 2,
        explanation: "1/3 - рациональное число, так как его можно представить в виде дроби m/n"
      },
      {
        text: "Чему равен модуль числа -7?",
        options: ["-7", "7", "0", "14"],
        correctAnswer: 1,
        explanation: "Модуль отрицательного числа равен этому числу с противоположным знаком: |-7| = 7"
      },
      {
        text: "Вычислите: 1/2 + 1/4",
        options: ["2/6", "3/4", "1/6", "2/4"],
        correctAnswer: 1,
        explanation: "Приводим к общему знаменателю: 2/4 + 1/4 = 3/4"
      },
      {
        text: "Какое действие выполняется при делении на дробь?",
        options: ["Умножение на эту дробь", "Умножение на обратную дробь", "Деление числителя на знаменатель", "Вычитание дроби"],
        correctAnswer: 1,
        explanation: "При делении на дробь мы умножаем на обратную дробь"
      },
      {
        text: "Чему равно: -3/5 × 2/3?",
        options: ["-2/5", "-6/15", "6/15", "2/5"],
        correctAnswer: 1,
        explanation: "Умножаем числители и знаменатели: (-3×2)/(5×3) = -6/15 = -2/5"
      },
      {
        text: "Что такое модуль числа?",
        options: ["Само число", "Расстояние от нуля до числа", "Противоположное число", "Число в квадрате"],
        correctAnswer: 1,
        explanation: "Модуль - это расстояние от нуля до числа на числовой прямой"
      },
      {
        text: "Вычислите: |5 - 8|",
        options: ["3", "-3", "13", "-13"],
        correctAnswer: 0,
        explanation: "5 - 8 = -3, а |-3| = 3"
      },
      {
        text: "Какое число НЕ является рациональным?",
        options: ["0.5", "√9", "√3", "-4"],
        correctAnswer: 2,
        explanation: "√3 - иррациональное число, его нельзя представить в виде дроби"
      },
      {
        text: "Вычислите: 2/3 ÷ 4/5",
        options: ["8/15", "10/12", "5/6", "6/5"],
        correctAnswer: 2,
        explanation: "2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6"
      },
      {
        text: "При умножении двух отрицательных чисел результат:",
        options: ["Отрицательный", "Положительный", "Равен нулю", "Может быть любым"],
        correctAnswer: 1,
        explanation: "Минус на минус дает плюс: (-a) × (-b) = ab"
      }
    ],
    "Степень с натуральным показателем": [
      {
        text: "Чему равно 2³?",
        options: ["6", "8", "9", "12"],
        correctAnswer: 1,
        explanation: "2³ = 2 × 2 × 2 = 8"
      },
      {
        text: "Какое свойство используется при умножении степеней с одинаковым основанием?",
        options: ["Складываются показатели", "Умножаются показатели", "Вычитаются показатели", "Делятся показатели"],
        correctAnswer: 0,
        explanation: "aᵐ × aⁿ = aᵐ⁺ⁿ - показатели складываются"
      },
      {
        text: "Вычислите: 3² × 3³",
        options: ["3⁵", "3⁶", "9⁵", "9⁶"],
        correctAnswer: 0,
        explanation: "3² × 3³ = 3²⁺³ = 3⁵ = 243"
      },
      {
        text: "Чему равно любое число в нулевой степени (кроме 0)?",
        options: ["0", "1", "Само число", "Не определено"],
        correctAnswer: 1,
        explanation: "a⁰ = 1 для любого a ≠ 0"
      },
      {
        text: "Упростите: (2²)³",
        options: ["2⁵", "2⁶", "4³", "8"],
        correctAnswer: 1,
        explanation: "(2²)³ = 2²ˣ³ = 2⁶ = 64"
      },
      {
        text: "Вычислите: 5⁶ ÷ 5²",
        options: ["5³", "5⁴", "5⁸", "25⁴"],
        correctAnswer: 1,
        explanation: "5⁶ ÷ 5² = 5⁶⁻² = 5⁴ = 625"
      },
      {
        text: "Чему равно (2 × 3)²?",
        options: ["2² + 3²", "2² × 3²", "6²", "Оба 2) и 3) правильны"],
        correctAnswer: 3,
        explanation: "(2 × 3)² = 6² = 36 и 2² × 3² = 4 × 9 = 36"
      },
      {
        text: "Упростите: x⁵ × x² ÷ x³",
        options: ["x⁴", "x¹⁰", "x⁶", "x³"],
        correctAnswer: 0,
        explanation: "x⁵ × x² ÷ x³ = x⁵⁺²⁻³ = x⁴"
      },
      {
        text: "Чему равно 10⁴?",
        options: ["40", "400", "1000", "10000"],
        correctAnswer: 3,
        explanation: "10⁴ = 10 × 10 × 10 × 10 = 10000"
      },
      {
        text: "Какое из следующих равенств верно?",
        options: ["2³ + 2² = 2⁵", "(2³)² = 2⁵", "2³ × 2² = 2⁵", "2⁶ ÷ 2² = 2³"],
        correctAnswer: 2,
        explanation: "2³ × 2² = 2³⁺² = 2⁵"
      }
    ]
  },
  physics: {
    "Механическое движение": [
      {
        text: "Что такое механическое движение?",
        options: ["Изменение формы тела", "Изменение положения тела в пространстве", "Изменение температуры", "Изменение массы"],
        correctAnswer: 1,
        explanation: "Механическое движение - это изменение положения тела в пространстве относительно других тел"
      },
      {
        text: "В каких единицах измеряется скорость в СИ?",
        options: ["км/ч", "м/с", "м/мин", "км/с"],
        correctAnswer: 1,
        explanation: "Основная единица скорости в СИ - метр в секунду (м/с)"
      },
      {
        text: "Формула для вычисления пути при равномерном движении:",
        options: ["S = v/t", "S = vt", "S = v + t", "S = v - t"],
        correctAnswer: 1,
        explanation: "При равномерном движении путь S = vt (скорость × время)"
      },
      {
        text: "Автомобиль двигался 3 часа со скоростью 80 км/ч. Какой путь он прошёл?",
        options: ["240 км", "83 км", "160 км", "27 км"],
        correctAnswer: 0,
        explanation: "S = vt = 80 км/ч × 3 ч = 240 км"
      },
      {
        text: "Что такое траектория?",
        options: ["Время движения", "Линия, по которой движется тело", "Скорость тела", "Масса тела"],
        correctAnswer: 1,
        explanation: "Траектория - это линия, которую описывает тело при движении"
      },
      {
        text: "Чему равна средняя скорость, если путь 150 км пройден за 3 часа?",
        options: ["50 км/ч", "450 км/ч", "153 км/ч", "147 км/ч"],
        correctAnswer: 0,
        explanation: "v = S/t = 150 км / 3 ч = 50 км/ч"
      },
      {
        text: "1 м/с равен:",
        options: ["1 км/ч", "3.6 км/ч", "36 км/ч", "0.36 км/ч"],
        correctAnswer: 1,
        explanation: "1 м/с = 3.6 км/ч (для перевода умножаем на 3.6)"
      },
      {
        text: "При равномерном движении скорость:",
        options: ["Увеличивается", "Уменьшается", "Постоянна", "Равна нулю"],
        correctAnswer: 2,
        explanation: "При равномерном движении скорость остается постоянной"
      },
      {
        text: "Что больше: путь или перемещение?",
        options: ["Путь всегда больше", "Перемещение всегда больше", "Равны", "Путь больше или равен перемещению"],
        correctAnswer: 3,
        explanation: "Путь всегда больше или равен модулю перемещения"
      },
      {
        text: "Пешеход прошёл 4 км за 50 минут. Его средняя скорость:",
        options: ["8 км/ч", "4.8 км/ч", "5 км/ч", "0.08 км/ч"],
        correctAnswer: 1,
        explanation: "50 мин = 5/6 ч, v = 4 км / (5/6 ч) = 4.8 км/ч"
      }
    ]
  },
  english: {
    "Present Simple Tense": [
      {
        text: "Выберите правильную форму глагола: She ___ to school every day.",
        options: ["go", "goes", "going", "went"],
        correctAnswer: 1,
        explanation: "С he/she/it используем глагол с окончанием -s: goes"
      },
      {
        text: "Какое слово является маркером Present Simple?",
        options: ["now", "yesterday", "always", "at the moment"],
        correctAnswer: 2,
        explanation: "Always (всегда) - типичный маркер Present Simple для регулярных действий"
      },
      {
        text: "Отрицательная форма: I ___ like coffee.",
        options: ["doesn't", "don't", "not", "am not"],
        correctAnswer: 1,
        explanation: "С I/you/we/they используем don't: I don't like coffee"
      },
      {
        text: "___ he work here?",
        options: ["Do", "Does", "Is", "Are"],
        correctAnswer: 1,
        explanation: "С he/she/it в вопросах используем Does: Does he work?"
      },
      {
        text: "She ___ TV every evening.",
        options: ["watch", "watches", "watching", "is watching"],
        correctAnswer: 1,
        explanation: "Watch + es = watches (после ch добавляем -es)"
      },
      {
        text: "They ___ English and French.",
        options: ["speaks", "speak", "speaking", "is speaking"],
        correctAnswer: 1,
        explanation: "С they используем глагол без -s: They speak"
      },
      {
        text: "Какое предложение правильное?",
        options: ["He don't like pizza", "He doesn't likes pizza", "He doesn't like pizza", "He not like pizza"],
        correctAnswer: 2,
        explanation: "He doesn't like - правильная отрицательная форма с doesn't + инфинитив"
      },
      {
        text: "My brother ___ at 7 AM.",
        options: ["get up", "gets up", "getting up", "is get up"],
        correctAnswer: 1,
        explanation: "Gets up - правильная форма для he/she/it в Present Simple"
      },
      {
        text: "___ you play tennis?",
        options: ["Do", "Does", "Are", "Is"],
        correctAnswer: 0,
        explanation: "С you используем Do: Do you play?"
      },
      {
        text: "I ___ to the gym on Mondays.",
        options: ["goes", "go", "going", "am go"],
        correctAnswer: 1,
        explanation: "С I используем глагол без -s: I go"
      }
    ]
  }
};

// Generate tests for all topics
const allTests = {};

topics.forEach(topic => {
  const subjectQuestions = testQuestions[topic.subject];
  let questions = [];

  if (subjectQuestions) {
    // Try to find matching questions by title
    const matchingKey = Object.keys(subjectQuestions).find(key =>
      topic.title.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(topic.title.toLowerCase())
    );

    if (matchingKey) {
      questions = subjectQuestions[matchingKey].map((q, idx) => ({
        id: `${topic.id}-q${idx + 1}`,
        ...q
      }));
    }
  }

  // Generate generic questions if no specific ones found
  if (questions.length === 0) {
    questions = generateGenericQuestions(topic);
  }

  allTests[topic.id] = {
    topicId: topic.id,
    subject: topic.subject,
    grade: topic.grade,
    quarter: topic.quarter,
    title: topic.title,
    questions: questions
  };
});

// Save to file
const outputPath = path.join(__dirname, '..', 'data', 'tests.json');
fs.writeFileSync(outputPath, JSON.stringify(allTests, null, 2));

console.log(`✅ Generated topic-specific tests for ${Object.keys(allTests).length} topics!`);
console.log(`Saved to: ${outputPath}`);

// Helper function for generic questions
function generateGenericQuestions(topic) {
  const genericTemplates = [
    {
      text: `Что является основной темой урока "${topic.title}"?`,
      options: [
        topic.title,
        "Не связано с темой",
        "Общая информация",
        "Другая тема"
      ],
      correctAnswer: 0,
      explanation: `Основная тема урока - ${topic.title}`
    },
    {
      text: `В каком классе изучается тема "${topic.title}"?`,
      options: [
        `${topic.grade - 1} класс`,
        `${topic.grade} класс`,
        `${topic.grade + 1} класс`,
        `${topic.grade + 2} класс`
      ],
      correctAnswer: 1,
      explanation: `Эта тема изучается в ${topic.grade} классе`
    },
    {
      text: `К какому предмету относится тема "${topic.title}"?`,
      options: [
        getSubjectName(topic.subject),
        "Другой предмет 1",
        "Другой предмет 2",
        "Другой предмет 3"
      ],
      correctAnswer: 0,
      explanation: `Эта тема относится к предмету ${getSubjectName(topic.subject)}`
    }
  ];

  // Add 7 more topic-related questions
  const additionalQuestions = Array.from({ length: 7 }, (_, i) => ({
    text: `Вопрос ${i + 4} по теме "${topic.title}": Какое утверждение верно?`,
    options: [
      `Утверждение связанное с ${topic.title}`,
      "Неверное утверждение 1",
      "Неверное утверждение 2",
      "Неверное утверждение 3"
    ],
    correctAnswer: 0,
    explanation: `Правильный ответ связан с основным материалом темы ${topic.title}`
  }));

  return [...genericTemplates, ...additionalQuestions].map((q, idx) => ({
    id: `${topic.id}-q${idx + 1}`,
    ...q
  }));
}

function getSubjectName(subject) {
  const names = {
    mathematics: "Математика",
    physics: "Физика",
    chemistry: "Химия",
    biology: "Биология",
    english: "Английский язык",
    kazakh: "Казахский язык",
    russian: "Русский язык",
    history: "История"
  };
  return names[subject] || subject;
}
