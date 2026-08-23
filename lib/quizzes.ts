import { QuizTemplate, QuizQuestion } from '@/types/interactive';

// Мок-квизы по предметам
export const MOCK_QUIZZES: QuizTemplate[] = [
  {
    id: 'quiz_math_1',
    title: 'Алгебра 9 класс: Квадратные уравнения',
    subject: 'mathematics',
    grade: 9,
    createdBy: 'teacher_default',
    createdAt: new Date('2026-08-20').toISOString(),
    questions: [
      {
        id: 'q1',
        question: 'Решите уравнение: x² - 5x + 6 = 0',
        options: {
          A: 'x = 2 или x = 3',
          B: 'x = 1 или x = 6',
          C: 'x = -2 или x = -3',
          D: 'x = 5 или x = 1',
        },
        correctAnswer: 'A',
        explanation: 'Разложим на множители: (x - 2)(x - 3) = 0, откуда x = 2 или x = 3',
        subject: 'mathematics',
      },
      {
        id: 'q2',
        question: 'Чему равен дискриминант уравнения 2x² + 3x - 5 = 0?',
        options: {
          A: 'D = 9',
          B: 'D = 49',
          C: 'D = 29',
          D: 'D = 19',
        },
        correctAnswer: 'B',
        explanation: 'D = b² - 4ac = 3² - 4·2·(-5) = 9 + 40 = 49',
        subject: 'mathematics',
      },
      {
        id: 'q3',
        question: 'Сколько корней имеет уравнение x² + 4x + 4 = 0?',
        options: {
          A: 'Два различных корня',
          B: 'Один корень (два совпадающих)',
          C: 'Нет корней',
          D: 'Бесконечно много корней',
        },
        correctAnswer: 'B',
        explanation: 'D = 16 - 16 = 0, значит один корень x = -2',
        subject: 'mathematics',
      },
      {
        id: 'q4',
        question: 'Решите уравнение: x² - 9 = 0',
        options: {
          A: 'x = 9',
          B: 'x = ±3',
          C: 'x = 3',
          D: 'x = ±9',
        },
        correctAnswer: 'B',
        explanation: 'x² = 9, откуда x = ±3',
        subject: 'mathematics',
      },
      {
        id: 'q5',
        question: 'Чему равна сумма корней уравнения x² - 7x + 10 = 0?',
        options: {
          A: '10',
          B: '7',
          C: '-7',
          D: '17',
        },
        correctAnswer: 'B',
        explanation: 'По теореме Виета: x₁ + x₂ = -b/a = 7/1 = 7',
        subject: 'mathematics',
      },
    ],
  },
  {
    id: 'quiz_phys_1',
    title: 'Физика 9 класс: Кинематика',
    subject: 'physics',
    grade: 9,
    createdBy: 'teacher_default',
    createdAt: new Date('2026-08-21').toISOString(),
    questions: [
      {
        id: 'q1',
        question: 'Тело движется равномерно со скоростью 20 м/с. Какой путь оно пройдет за 5 секунд?',
        options: {
          A: '100 м',
          B: '25 м',
          C: '4 м',
          D: '200 м',
        },
        correctAnswer: 'A',
        explanation: 'S = v·t = 20 м/с · 5 с = 100 м',
        subject: 'physics',
      },
      {
        id: 'q2',
        question: 'Ускорение тела 2 м/с². За какое время оно увеличит скорость с 10 м/с до 30 м/с?',
        options: {
          A: '5 с',
          B: '10 с',
          C: '20 с',
          D: '15 с',
        },
        correctAnswer: 'B',
        explanation: 't = Δv/a = (30-10)/2 = 20/2 = 10 с',
        subject: 'physics',
      },
      {
        id: 'q3',
        question: 'Тело падает с высоты без начальной скорости. g = 10 м/с². Какова его скорость через 3 с?',
        options: {
          A: '10 м/с',
          B: '30 м/с',
          C: '90 м/с',
          D: '15 м/с',
        },
        correctAnswer: 'B',
        explanation: 'v = g·t = 10 м/с² · 3 с = 30 м/с',
        subject: 'physics',
      },
      {
        id: 'q4',
        question: 'Какая физическая величина измеряется в м/с²?',
        options: {
          A: 'Скорость',
          B: 'Перемещение',
          C: 'Ускорение',
          D: 'Сила',
        },
        correctAnswer: 'C',
        explanation: 'Ускорение — это изменение скорости в единицу времени, измеряется в м/с²',
        subject: 'physics',
      },
      {
        id: 'q5',
        question: 'Автомобиль проехал 180 км за 2 часа. Какова его средняя скорость?',
        options: {
          A: '360 км/ч',
          B: '90 км/ч',
          C: '45 км/ч',
          D: '180 км/ч',
        },
        correctAnswer: 'B',
        explanation: 'v = S/t = 180 км / 2 ч = 90 км/ч',
        subject: 'physics',
      },
    ],
  },
  {
    id: 'quiz_info_1',
    title: 'Информатика 9 класс: Алгоритмы',
    subject: 'informatics',
    grade: 9,
    createdBy: 'teacher_default',
    createdAt: new Date('2026-08-22').toISOString(),
    questions: [
      {
        id: 'q1',
        question: 'Какая структура данных работает по принципу LIFO (Last In First Out)?',
        options: {
          A: 'Очередь',
          B: 'Стек',
          C: 'Массив',
          D: 'Дерево',
        },
        correctAnswer: 'B',
        explanation: 'Стек — структура данных, где последний добавленный элемент извлекается первым',
        subject: 'informatics',
      },
      {
        id: 'q2',
        question: 'Сколько итераций выполнит цикл: for i in range(5)?',
        options: {
          A: '4',
          B: '5',
          C: '6',
          D: '0',
        },
        correctAnswer: 'B',
        explanation: 'range(5) генерирует последовательность 0, 1, 2, 3, 4 — всего 5 элементов',
        subject: 'informatics',
      },
      {
        id: 'q3',
        question: 'Какая сложность у бинарного поиска?',
        options: {
          A: 'O(n)',
          B: 'O(n²)',
          C: 'O(log n)',
          D: 'O(1)',
        },
        correctAnswer: 'C',
        explanation: 'Бинарный поиск делит массив пополам на каждой итерации — сложность O(log n)',
        subject: 'informatics',
      },
      {
        id: 'q4',
        question: 'Что выведет код: print(10 // 3)?',
        options: {
          A: '3.33',
          B: '3',
          C: '4',
          D: '1',
        },
        correctAnswer: 'B',
        explanation: 'Оператор // выполняет целочисленное деление: 10 // 3 = 3',
        subject: 'informatics',
      },
      {
        id: 'q5',
        question: 'Какой результат: len("Hello")?',
        options: {
          A: '4',
          B: '5',
          C: '6',
          D: 'Ошибка',
        },
        correctAnswer: 'B',
        explanation: 'Функция len() возвращает длину строки. "Hello" содержит 5 символов',
        subject: 'informatics',
      },
    ],
  },
];

// Инициализация квизов в localStorage
export function initializeQuizzes() {
  const existingQuizzes = localStorage.getItem('fm_edu_quizzes');
  if (!existingQuizzes) {
    localStorage.setItem('fm_edu_quizzes', JSON.stringify(MOCK_QUIZZES));
  }
}

// Получить все квизы
export function getAllQuizzes(): QuizTemplate[] {
  const quizzesStr = localStorage.getItem('fm_edu_quizzes');
  return quizzesStr ? JSON.parse(quizzesStr) : MOCK_QUIZZES;
}

// Получить квиз по ID
export function getQuizById(quizId: string): QuizTemplate | null {
  const quizzes = getAllQuizzes();
  return quizzes.find((q) => q.id === quizId) || null;
}
