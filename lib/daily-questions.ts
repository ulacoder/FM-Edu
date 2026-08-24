import {
  DailyQuestion,
  DailyQuestionSet,
  TopicMastery,
  UserStreak,
  DailyQuestionAttempt,
  SubjectCategory,
  POINTS_PER_CORRECT,
  BONUS_FOR_DAILY_COMPLETION,
  QUESTIONS_PER_DAY,
  STREAK_MILESTONES,
} from '@/types/daily-questions';

// Мок-банк вопросов по темам
export const QUESTION_BANK: DailyQuestion[] = [
  // Математика - Квадратные уравнения
  {
    id: 'dq_math_1',
    subject: 'mathematics',
    topicId: 'math_quadratic',
    topicName: 'Квадратные уравнения',
    question: 'Решите уравнение: x² - 7x + 12 = 0',
    options: {
      A: 'x = 3 или x = 4',
      B: 'x = 2 или x = 6',
      C: 'x = 1 или x = 12',
      D: 'x = -3 или x = -4',
    },
    correctAnswer: 'A',
    explanation: 'Разложим на множители: (x - 3)(x - 4) = 0. Получаем x = 3 или x = 4',
    formula: 'x = (-b ± √D) / 2a',
    difficulty: 'medium',
  },
  {
    id: 'dq_math_2',
    subject: 'mathematics',
    topicId: 'math_quadratic',
    topicName: 'Квадратные уравнения',
    question: 'Чему равен дискриминант уравнения x² + 6x + 9 = 0?',
    options: {
      A: 'D = 0',
      B: 'D = 36',
      C: 'D = 9',
      D: 'D = -36',
    },
    correctAnswer: 'A',
    explanation: 'D = b² - 4ac = 36 - 4·1·9 = 36 - 36 = 0. Один корень: x = -3',
    formula: 'D = b² - 4ac',
    difficulty: 'easy',
  },
  {
    id: 'dq_math_3',
    subject: 'mathematics',
    topicId: 'math_quadratic',
    topicName: 'Квадратные уравнения',
    question: 'Произведение корней уравнения x² - 8x + 15 = 0 равно:',
    options: {
      A: '8',
      B: '15',
      C: '-15',
      D: '23',
    },
    correctAnswer: 'B',
    explanation: 'По теореме Виета: x₁·x₂ = c/a = 15/1 = 15',
    formula: 'x₁·x₂ = c/a',
    difficulty: 'medium',
  },

  // Математика - Системы уравнений
  {
    id: 'dq_math_4',
    subject: 'mathematics',
    topicId: 'math_systems',
    topicName: 'Системы уравнений',
    question: 'Решите систему: x + y = 5, x - y = 1',
    options: {
      A: 'x = 3, y = 2',
      B: 'x = 2, y = 3',
      C: 'x = 4, y = 1',
      D: 'x = 1, y = 4',
    },
    correctAnswer: 'A',
    explanation: 'Сложим уравнения: 2x = 6, x = 3. Тогда y = 5 - 3 = 2',
    difficulty: 'easy',
  },
  {
    id: 'dq_math_5',
    subject: 'mathematics',
    topicId: 'math_systems',
    topicName: 'Системы уравнений',
    question: 'Найдите x из системы: 2x + y = 10, x - y = 2',
    options: {
      A: 'x = 4',
      B: 'x = 3',
      C: 'x = 5',
      D: 'x = 6',
    },
    correctAnswer: 'A',
    explanation: 'Сложим уравнения: 3x = 12, x = 4',
    difficulty: 'easy',
  },

  // Физика - Кинематика
  {
    id: 'dq_phys_1',
    subject: 'physics',
    topicId: 'phys_kinematics',
    topicName: 'Кинематика',
    question: 'Тело движется со скоростью 15 м/с. Какой путь оно пройдет за 4 секунды?',
    options: {
      A: '45 м',
      B: '60 м',
      C: '75 м',
      D: '90 м',
    },
    correctAnswer: 'B',
    explanation: 'S = v·t = 15 м/с · 4 с = 60 м',
    formula: 'S = v·t',
    difficulty: 'easy',
  },
  {
    id: 'dq_phys_2',
    subject: 'physics',
    topicId: 'phys_kinematics',
    topicName: 'Кинематика',
    question: 'За какое время тело увеличит скорость с 5 м/с до 25 м/с при ускорении 4 м/с²?',
    options: {
      A: '5 с',
      B: '10 с',
      C: '7,5 с',
      D: '20 с',
    },
    correctAnswer: 'A',
    explanation: 't = Δv/a = (25-5)/4 = 20/4 = 5 с',
    formula: 't = Δv/a',
    difficulty: 'medium',
  },
  {
    id: 'dq_phys_3',
    subject: 'physics',
    topicId: 'phys_kinematics',
    topicName: 'Кинематика',
    question: 'Какое ускорение у тела, если за 6 секунд его скорость изменилась с 12 м/с до 30 м/с?',
    options: {
      A: '2 м/с²',
      B: '3 м/с²',
      C: '4 м/с²',
      D: '18 м/с²',
    },
    correctAnswer: 'B',
    explanation: 'a = Δv/t = (30-12)/6 = 18/6 = 3 м/с²',
    formula: 'a = Δv/t',
    difficulty: 'medium',
  },

  // Физика - Динамика
  {
    id: 'dq_phys_4',
    subject: 'physics',
    topicId: 'phys_dynamics',
    topicName: 'Динамика',
    question: 'Какая сила действует на тело массой 5 кг с ускорением 3 м/с²?',
    options: {
      A: '8 Н',
      B: '15 Н',
      C: '2 Н',
      D: '1,67 Н',
    },
    correctAnswer: 'B',
    explanation: 'F = m·a = 5 кг · 3 м/с² = 15 Н',
    formula: 'F = m·a (Второй закон Ньютона)',
    difficulty: 'easy',
  },
  {
    id: 'dq_phys_5',
    subject: 'physics',
    topicId: 'phys_dynamics',
    topicName: 'Динамика',
    question: 'Тело массой 10 кг движется с ускорением 2 м/с². Какая сила трения действует, если приложенная сила 30 Н?',
    options: {
      A: '5 Н',
      B: '10 Н',
      C: '20 Н',
      D: '50 Н',
    },
    correctAnswer: 'B',
    explanation: 'F_тр = F_прил - m·a = 30 - 10·2 = 30 - 20 = 10 Н',
    formula: 'F_результ = F_прил - F_тр',
    difficulty: 'hard',
  },

  // Информатика - Алгоритмы
  {
    id: 'dq_info_1',
    subject: 'informatics',
    topicId: 'info_algorithms',
    topicName: 'Алгоритмы',
    question: 'Какая временная сложность у линейного поиска в массиве из n элементов?',
    options: {
      A: 'O(1)',
      B: 'O(log n)',
      C: 'O(n)',
      D: 'O(n²)',
    },
    correctAnswer: 'C',
    explanation: 'Линейный поиск проверяет каждый элемент по порядку, в худшем случае — все n элементов',
    difficulty: 'easy',
  },
  {
    id: 'dq_info_2',
    subject: 'informatics',
    topicId: 'info_algorithms',
    topicName: 'Алгоритмы',
    question: 'Сколько сравнений нужно для сортировки пузырьком массива из 5 элементов в худшем случае?',
    options: {
      A: '5',
      B: '10',
      C: '15',
      D: '20',
    },
    correctAnswer: 'B',
    explanation: 'Для массива из n элементов: n(n-1)/2. Для n=5: 5·4/2 = 10 сравнений',
    formula: 'n(n-1)/2',
    difficulty: 'hard',
  },
  {
    id: 'dq_info_3',
    subject: 'informatics',
    topicId: 'info_algorithms',
    topicName: 'Алгоритмы',
    question: 'Что выведет: print(list(range(2, 8, 2)))?',
    options: {
      A: '[2, 4, 6]',
      B: '[2, 4, 6, 8]',
      C: '[2, 3, 4, 5, 6, 7]',
      D: '[4, 6, 8]',
    },
    correctAnswer: 'A',
    explanation: 'range(2, 8, 2) генерирует от 2 до 8 (не включая 8) с шагом 2: [2, 4, 6]',
    difficulty: 'medium',
  },

  // Информатика - Структуры данных
  {
    id: 'dq_info_4',
    subject: 'informatics',
    topicId: 'info_structures',
    topicName: 'Структуры данных',
    question: 'Какая структура данных использует принцип FIFO?',
    options: {
      A: 'Стек',
      B: 'Очередь',
      C: 'Дерево',
      D: 'Граф',
    },
    correctAnswer: 'B',
    explanation: 'FIFO (First In First Out) — первым пришел, первым вышел. Это принцип работы очереди',
    difficulty: 'easy',
  },
  {
    id: 'dq_info_5',
    subject: 'informatics',
    topicId: 'info_structures',
    topicName: 'Структуры данных',
    question: 'Что вернет len([1, 2, [3, 4], 5])?',
    options: {
      A: '3',
      B: '4',
      C: '5',
      D: 'Ошибка',
    },
    correctAnswer: 'B',
    explanation: 'len() считает элементы верхнего уровня: 1, 2, [3,4], 5 — всего 4 элемента',
    difficulty: 'medium',
  },

  // Химия - Периодическая таблица
  {
    id: 'dq_chem_1',
    subject: 'chemistry',
    topicId: 'chem_periodic',
    topicName: 'Периодическая система',
    question: 'Сколько протонов в атоме кислорода (O)?',
    options: {
      A: '6',
      B: '7',
      C: '8',
      D: '16',
    },
    correctAnswer: 'C',
    explanation: 'Количество протонов = атомный номер элемента. У кислорода атомный номер 8',
    difficulty: 'easy',
  },
  {
    id: 'dq_chem_2',
    subject: 'chemistry',
    topicId: 'chem_periodic',
    topicName: 'Периодическая система',
    question: 'Какой элемент имеет электронную конфигурацию 1s² 2s² 2p⁶?',
    options: {
      A: 'Углерод',
      B: 'Азот',
      C: 'Кислород',
      D: 'Неон',
    },
    correctAnswer: 'D',
    explanation: 'Всего 10 электронов (2+2+6=10). Это неон (Ne), атомный номер 10',
    difficulty: 'medium',
  },

  // Химия - Реакции
  {
    id: 'dq_chem_3',
    subject: 'chemistry',
    topicId: 'chem_reactions',
    topicName: 'Химические реакции',
    question: 'Укажите тип реакции: 2H₂ + O₂ → 2H₂O',
    options: {
      A: 'Разложение',
      B: 'Соединение',
      C: 'Замещение',
      D: 'Обмен',
    },
    correctAnswer: 'B',
    explanation: 'Реакция соединения — из нескольких простых веществ образуется одно сложное',
    difficulty: 'easy',
  },
];

// ===== АЛГОРИТМ АНАЛИЗА ПРОБЕЛОВ =====

/**
 * Получить статистику усвоения тем по всем источникам данных:
 * - результаты интерактивов
 * - результаты тестов (квизов)
 * - ежедневные вопросы
 */
export function getTopicMastery(studentId: string): TopicMastery[] {
  const attempts: DailyQuestionAttempt[] = JSON.parse(
    localStorage.getItem('fm_edu_daily_attempts') || '[]'
  ).filter((a: DailyQuestionAttempt) => a.studentId === studentId);

  // Группируем по темам
  const topicStats: { [topicId: string]: TopicMastery } = {};

  attempts.forEach((attempt) => {
    if (!topicStats[attempt.topicId]) {
      topicStats[attempt.topicId] = {
        topicId: attempt.topicId,
        topicName: QUESTION_BANK.find((q) => q.topicId === attempt.topicId)?.topicName || attempt.topicId,
        subject: attempt.subject,
        correctCount: 0,
        totalAttempts: 0,
        masteryPercent: 0,
        lastAttemptAt: attempt.answeredAt,
      };
    }

    topicStats[attempt.topicId].totalAttempts++;
    if (attempt.correct) {
      topicStats[attempt.topicId].correctCount++;
    }
    if (new Date(attempt.answeredAt) > new Date(topicStats[attempt.topicId].lastAttemptAt)) {
      topicStats[attempt.topicId].lastAttemptAt = attempt.answeredAt;
    }
  });

  // Рассчитываем процент усвоения
  Object.values(topicStats).forEach((topic) => {
    topic.masteryPercent =
      topic.totalAttempts > 0 ? Math.round((topic.correctCount / topic.totalAttempts) * 100) : 0;
  });

  return Object.values(topicStats);
}

/**
 * Генерация ежедневного сета вопросов на основе пробелов
 */
export function generateDailyQuestionSet(studentId: string): DailyQuestionSet {
  const today = new Date().toISOString().split('T')[0];
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Проверяем, есть ли уже сет на сегодня
  const existingSets: DailyQuestionSet[] = JSON.parse(
    localStorage.getItem('fm_edu_daily_sets') || '[]'
  );
  const todaySet = existingSets.find((s) => s.studentId === studentId && s.date === today);
  if (todaySet) {
    return todaySet;
  }

  // Получаем статистику пробелов
  const topicMastery = getTopicMastery(studentId);

  let selectedQuestions: DailyQuestion[] = [];

  if (topicMastery.length === 0) {
    // Новый ученик — базовые вопросы по выбранным предметам
    const preferredSubjects: SubjectCategory[] = user?.preferredSubjects || ['mathematics', 'physics', 'informatics'];

    // Берем по 1-2 легких вопроса на каждый предмет
    preferredSubjects.forEach((subject) => {
      const subjectQuestions = QUESTION_BANK.filter(
        (q) => q.subject === subject && q.difficulty === 'easy'
      );
      const picked = subjectQuestions.slice(0, 2);
      selectedQuestions.push(...picked);
    });

    // Дополняем до QUESTIONS_PER_DAY
    if (selectedQuestions.length < QUESTIONS_PER_DAY) {
      const remaining = QUESTION_BANK.filter(
        (q) => !selectedQuestions.includes(q) && q.difficulty === 'easy'
      ).slice(0, QUESTIONS_PER_DAY - selectedQuestions.length);
      selectedQuestions.push(...remaining);
    }

    selectedQuestions = selectedQuestions.slice(0, QUESTIONS_PER_DAY);
  } else {
    // Есть история — выбираем вопросы по самым слабым темам
    const weakTopics = topicMastery
      .filter((t) => t.masteryPercent < 70) // пробелы — меньше 70%
      .sort((a, b) => a.masteryPercent - b.masteryPercent); // от худших к лучшим

    if (weakTopics.length > 0) {
      // Выбираем вопросы по слабым темам
      weakTopics.forEach((topic) => {
        const topicQuestions = QUESTION_BANK.filter((q) => q.topicId === topic.topicId);
        if (topicQuestions.length > 0) {
          const randomQ = topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
          if (!selectedQuestions.includes(randomQ)) {
            selectedQuestions.push(randomQ);
          }
        }
      });
    }

    // Если слабых тем нет или вопросов мало — добавляем случайные
    if (selectedQuestions.length < QUESTIONS_PER_DAY) {
      const remainingQuestions = QUESTION_BANK.filter((q) => !selectedQuestions.includes(q));
      const shuffled = remainingQuestions.sort(() => Math.random() - 0.5);
      selectedQuestions.push(...shuffled.slice(0, QUESTIONS_PER_DAY - selectedQuestions.length));
    }

    selectedQuestions = selectedQuestions.slice(0, QUESTIONS_PER_DAY);
  }

  // Создаем новый сет
  const newSet: DailyQuestionSet = {
    id: `dq_set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    studentId,
    date: today,
    questions: selectedQuestions,
    completedQuestions: [],
    answers: {},
    status: 'pending',
    totalPoints: 0,
    createdAt: new Date().toISOString(),
    cached: true, // помечаем для офлайн-доступа
  };

  // Сохраняем
  existingSets.push(newSet);
  localStorage.setItem('fm_edu_daily_sets', JSON.stringify(existingSets));

  return newSet;
}

/**
 * Сохранить ответ на вопрос
 */
export function submitDailyAnswer(
  setId: string,
  questionId: string,
  selectedAnswer: 'A' | 'B' | 'C' | 'D'
): { correct: boolean; pointsEarned: number; explanation: string; formula?: string } {
  const sets: DailyQuestionSet[] = JSON.parse(localStorage.getItem('fm_edu_daily_sets') || '[]');
  const setIndex = sets.findIndex((s) => s.id === setId);

  if (setIndex === -1) {
    throw new Error('Сет не найден');
  }

  const currentSet = sets[setIndex];
  const question = currentSet.questions.find((q) => q.id === questionId);

  if (!question) {
    throw new Error('Вопрос не найден');
  }

  const correct = selectedAnswer === question.correctAnswer;
  const pointsEarned = correct ? POINTS_PER_CORRECT : 0;

  // Обновляем сет
  currentSet.answers[questionId] = {
    selectedAnswer,
    correct,
    pointsEarned,
    answeredAt: new Date().toISOString(),
  };
  currentSet.completedQuestions.push(questionId);
  currentSet.totalPoints += pointsEarned;
  currentSet.status = currentSet.completedQuestions.length === currentSet.questions.length ? 'completed' : 'in_progress';

  if (currentSet.status === 'completed') {
    currentSet.completedAt = new Date().toISOString();
    // Бонус за завершение дня
    currentSet.totalPoints += BONUS_FOR_DAILY_COMPLETION;
  }

  sets[setIndex] = currentSet;
  localStorage.setItem('fm_edu_daily_sets', JSON.stringify(sets));

  // Сохраняем попытку для статистики
  const attempts: DailyQuestionAttempt[] = JSON.parse(
    localStorage.getItem('fm_edu_daily_attempts') || '[]'
  );
  attempts.push({
    id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    studentId: currentSet.studentId,
    questionId,
    topicId: question.topicId,
    subject: question.subject,
    selectedAnswer,
    correctAnswer: question.correctAnswer,
    correct,
    answeredAt: new Date().toISOString(),
    pointsEarned,
  });
  localStorage.setItem('fm_edu_daily_attempts', JSON.stringify(attempts));

  // Обновляем баллы студента
  const usersStr = localStorage.getItem('fm_edu_users');
  const users = usersStr ? JSON.parse(usersStr) : [];
  const studentIndex = users.findIndex((u: any) => u.id === currentSet.studentId);
  if (studentIndex !== -1) {
    users[studentIndex].totalPoints = (users[studentIndex].totalPoints || 0) + pointsEarned;
    if (currentSet.status === 'completed') {
      users[studentIndex].totalPoints += BONUS_FOR_DAILY_COMPLETION;
    }
    localStorage.setItem('fm_edu_users', JSON.stringify(users));
  }

  // Обновляем streak, если сет завершен
  if (currentSet.status === 'completed') {
    updateStreak(currentSet.studentId);
  }

  return {
    correct,
    pointsEarned,
    explanation: question.explanation,
    formula: question.formula,
  };
}

/**
 * Обновить streak ученика
 */
export function updateStreak(studentId: string): UserStreak {
  const streaks: UserStreak[] = JSON.parse(localStorage.getItem('fm_edu_streaks') || '[]');
  let streak = streaks.find((s) => s.studentId === studentId);
  const today = new Date().toISOString().split('T')[0];

  if (!streak) {
    // Первый streak
    streak = {
      studentId,
      currentStreak: 1,
      longestStreak: 1,
      lastCompletedDate: today,
      streakMilestones: [],
    };
    streaks.push(streak);
  } else {
    const lastDate = new Date(streak.lastCompletedDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Уже выполнено сегодня — ничего не меняем
    } else if (diffDays === 1) {
      // Продолжение серии
      streak.currentStreak++;
      streak.lastCompletedDate = today;
      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }

      // Проверяем milestone
      const milestone = STREAK_MILESTONES.find((m) => m.days === streak!.currentStreak);
      if (milestone && !streak.streakMilestones.find((sm) => sm.days === milestone.days)) {
        streak.streakMilestones.push({
          days: milestone.days,
          unlockedAt: new Date().toISOString(),
          bonusPoints: milestone.bonusPoints,
        });

        // Начисляем бонус
        const usersStr = localStorage.getItem('fm_edu_users');
        const users = usersStr ? JSON.parse(usersStr) : [];
        const studentIndex = users.findIndex((u: any) => u.id === studentId);
        if (studentIndex !== -1) {
          users[studentIndex].totalPoints = (users[studentIndex].totalPoints || 0) + milestone.bonusPoints;
          localStorage.setItem('fm_edu_users', JSON.stringify(users));
        }
      }
    } else {
      // Серия прервана
      streak.currentStreak = 1;
      streak.lastCompletedDate = today;
    }
  }

  localStorage.setItem('fm_edu_streaks', JSON.stringify(streaks));
  return streak;
}

/**
 * Получить streak студента
 */
export function getStreak(studentId: string): UserStreak | null {
  const streaks: UserStreak[] = JSON.parse(localStorage.getItem('fm_edu_streaks') || '[]');
  return streaks.find((s) => s.studentId === studentId) || null;
}

/**
 * Получить сет на сегодня
 */
export function getTodaySet(studentId: string): DailyQuestionSet | null {
  const today = new Date().toISOString().split('T')[0];
  const sets: DailyQuestionSet[] = JSON.parse(localStorage.getItem('fm_edu_daily_sets') || '[]');
  return sets.find((s) => s.studentId === studentId && s.date === today) || null;
}
