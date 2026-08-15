import { Topic, Subject } from '@/types';

// Темы по математике для классов 7-12 (программа МОН РК)
export const mathematicsTopics: Omit<Topic, 'id'>[] = [
  // 7 класс
  { subject: 'mathematics', grade: 7, quarter: 1, title: 'Рациональные числа', description: 'Действия с рациональными числами, модуль числа', order: 1 },
  { subject: 'mathematics', grade: 7, quarter: 1, title: 'Степень с натуральным показателем', description: 'Свойства степеней, действия со степенями', order: 2 },
  { subject: 'mathematics', grade: 7, quarter: 2, title: 'Одночлены и многочлены', description: 'Действия с одночленами и многочленами', order: 3 },
  { subject: 'mathematics', grade: 7, quarter: 3, title: 'Формулы сокращённого умножения', description: 'Квадрат суммы, разность квадратов', order: 4 },
  { subject: 'mathematics', grade: 7, quarter: 4, title: 'Линейные уравнения', description: 'Решение линейных уравнений и систем', order: 5 },

  // 8 класс
  { subject: 'mathematics', grade: 8, quarter: 1, title: 'Квадратные корни', description: 'Арифметический квадратный корень, свойства', order: 1 },
  { subject: 'mathematics', grade: 8, quarter: 2, title: 'Квадратные уравнения', description: 'Решение квадратных уравнений, теорема Виета', order: 2 },
  { subject: 'mathematics', grade: 8, quarter: 3, title: 'Неравенства', description: 'Линейные и квадратные неравенства', order: 3 },
  { subject: 'mathematics', grade: 8, quarter: 4, title: 'Функции и графики', description: 'Линейная и квадратичная функции', order: 4 },

  // 9 класс
  { subject: 'mathematics', grade: 9, quarter: 1, title: 'Уравнения и неравенства', description: 'Решение уравнений высших степеней', order: 1 },
  { subject: 'mathematics', grade: 9, quarter: 2, title: 'Последовательности', description: 'Арифметическая и геометрическая прогрессии', order: 2 },
  { subject: 'mathematics', grade: 9, quarter: 3, title: 'Элементы статистики', description: 'Статистические характеристики', order: 3 },
  { subject: 'mathematics', grade: 9, quarter: 4, title: 'Тригонометрия', description: 'Основы тригонометрии', order: 4 },

  // 10 класс
  { subject: 'mathematics', grade: 10, quarter: 1, title: 'Тригонометрические функции', description: 'Свойства и графики тригонометрических функций', order: 1 },
  { subject: 'mathematics', grade: 10, quarter: 2, title: 'Тригонометрические уравнения', description: 'Решение тригонометрических уравнений', order: 2 },
  { subject: 'mathematics', grade: 10, quarter: 3, title: 'Производная', description: 'Определение производной, правила дифференцирования', order: 3 },
  { subject: 'mathematics', grade: 10, quarter: 4, title: 'Применение производной', description: 'Исследование функций с помощью производной', order: 4 },

  // 11 класс
  { subject: 'mathematics', grade: 11, quarter: 1, title: 'Первообразная и интеграл', description: 'Неопределённый и определённый интеграл', order: 1 },
  { subject: 'mathematics', grade: 11, quarter: 2, title: 'Показательная функция', description: 'Свойства и графики, показательные уравнения', order: 2 },
  { subject: 'mathematics', grade: 11, quarter: 3, title: 'Логарифмическая функция', description: 'Логарифмы, логарифмические уравнения', order: 3 },
  { subject: 'mathematics', grade: 11, quarter: 4, title: 'Степенная функция', description: 'Свойства, иррациональные уравнения', order: 4 },

  // 12 класс (НИС программа)
  { subject: 'mathematics', grade: 12, quarter: 1, title: 'Комплексные числа', description: 'Действия с комплексными числами', order: 1 },
  { subject: 'mathematics', grade: 12, quarter: 2, title: 'Элементы комбинаторики', description: 'Перестановки, размещения, сочетания', order: 2 },
  { subject: 'mathematics', grade: 12, quarter: 3, title: 'Теория вероятностей', description: 'Классическая вероятность, теоремы', order: 3 },
  { subject: 'mathematics', grade: 12, quarter: 4, title: 'Математическая статистика', description: 'Статистические методы обработки данных', order: 4 },
];

// Темы по физике
export const physicsTopics: Omit<Topic, 'id'>[] = [
  // 7 класс
  { subject: 'physics', grade: 7, quarter: 1, title: 'Физические величины и измерения', description: 'Введение в физику, измерительные приборы', order: 1 },
  { subject: 'physics', grade: 7, quarter: 2, title: 'Механическое движение', description: 'Скорость, путь, время', order: 2 },
  { subject: 'physics', grade: 7, quarter: 3, title: 'Плотность вещества', description: 'Масса, объём, плотность', order: 3 },
  { subject: 'physics', grade: 7, quarter: 4, title: 'Давление', description: 'Давление твёрдых тел, жидкостей и газов', order: 4 },

  // 8 класс
  { subject: 'physics', grade: 8, quarter: 1, title: 'Тепловые явления', description: 'Внутренняя энергия, теплопередача', order: 1 },
  { subject: 'physics', grade: 8, quarter: 2, title: 'Агрегатные состояния', description: 'Плавление, парообразование', order: 2 },
  { subject: 'physics', grade: 8, quarter: 3, title: 'Электрические явления', description: 'Электрический ток, сопротивление', order: 3 },
  { subject: 'physics', grade: 8, quarter: 4, title: 'Закон Ома', description: 'Закон Ома для участка цепи', order: 4 },

  // 9 класс
  { subject: 'physics', grade: 9, quarter: 1, title: 'Кинематика', description: 'Равномерное и равноускоренное движение', order: 1 },
  { subject: 'physics', grade: 9, quarter: 2, title: 'Динамика', description: 'Законы Ньютона', order: 2 },
  { subject: 'physics', grade: 9, quarter: 3, title: 'Законы сохранения', description: 'Импульс, энергия', order: 3 },
  { subject: 'physics', grade: 9, quarter: 4, title: 'Колебания и волны', description: 'Механические колебания и волны', order: 4 },

  // 10 класс
  { subject: 'physics', grade: 10, quarter: 1, title: 'Молекулярная физика', description: 'МКТ, газовые законы', order: 1 },
  { subject: 'physics', grade: 10, quarter: 2, title: 'Термодинамика', description: 'Законы термодинамики', order: 2 },
  { subject: 'physics', grade: 10, quarter: 3, title: 'Электростатика', description: 'Электрическое поле, конденсаторы', order: 3 },
  { subject: 'physics', grade: 10, quarter: 4, title: 'Постоянный ток', description: 'Законы постоянного тока', order: 4 },
];

// Темы по информатике
export const informaticsTopics: Omit<Topic, 'id'>[] = [
  // 7 класс
  { subject: 'informatics', grade: 7, quarter: 1, title: 'Компьютерные системы', description: 'Устройство компьютера, операционные системы', order: 1 },
  { subject: 'informatics', grade: 7, quarter: 2, title: 'Алгоритмизация', description: 'Понятие алгоритма, блок-схемы', order: 2 },
  { subject: 'informatics', grade: 7, quarter: 3, title: 'Введение в программирование', description: 'Основы Python или Scratch', order: 3 },
  { subject: 'informatics', grade: 7, quarter: 4, title: 'Работа с данными', description: 'Типы данных, переменные', order: 4 },

  // 8 класс
  { subject: 'informatics', grade: 8, quarter: 1, title: 'Условные операторы', description: 'Ветвления в программах', order: 1 },
  { subject: 'informatics', grade: 8, quarter: 2, title: 'Циклы', description: 'For, while циклы', order: 2 },
  { subject: 'informatics', grade: 8, quarter: 3, title: 'Списки и массивы', description: 'Работа с массивами данных', order: 3 },
  { subject: 'informatics', grade: 8, quarter: 4, title: 'Функции', description: 'Создание и использование функций', order: 4 },

  // 9 класс
  { subject: 'informatics', grade: 9, quarter: 1, title: 'Сложность алгоритмов', description: 'O-нотация, эффективность', order: 1 },
  { subject: 'informatics', grade: 9, quarter: 2, title: 'Сортировка и поиск', description: 'Алгоритмы сортировки', order: 2 },
  { subject: 'informatics', grade: 9, quarter: 3, title: 'Рекурсия', description: 'Рекурсивные алгоритмы', order: 3 },
  { subject: 'informatics', grade: 9, quarter: 4, title: 'Базы данных', description: 'Основы SQL', order: 4 },

  // 10 класс
  { subject: 'informatics', grade: 10, quarter: 1, title: 'ООП', description: 'Объектно-ориентированное программирование', order: 1 },
  { subject: 'informatics', grade: 10, quarter: 2, title: 'Структуры данных', description: 'Стеки, очереди, деревья', order: 2 },
  { subject: 'informatics', grade: 10, quarter: 3, title: 'Графы', description: 'Представление и обход графов', order: 3 },
  { subject: 'informatics', grade: 10, quarter: 4, title: 'Web-разработка', description: 'HTML, CSS, JavaScript основы', order: 4 },
];

export const allTopics = [...mathematicsTopics, ...physicsTopics, ...informaticsTopics];
