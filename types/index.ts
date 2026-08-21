// Типы пользователей
export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  createdAt: Date;
}

// Регионы Казахстана
export type Region =
  | 'astana'
  | 'almaty'
  | 'shymkent'
  | 'aktobe'
  | 'atyrau'
  | 'karaganda'
  | 'kostanay'
  | 'kyzylorda'
  | 'mangystau'
  | 'pavlodar'
  | 'petropavl'
  | 'taraz'
  | 'turkistan'
  | 'uralsk'
  | 'ustkamenogorsk'
  | 'other';

export const regionNames: Record<Region, string> = {
  astana: 'Астана',
  almaty: 'Алматы',
  shymkent: 'Шымкент',
  aktobe: 'Актобе',
  atyrau: 'Атырау',
  karaganda: 'Караганда',
  kostanay: 'Костанай',
  kyzylorda: 'Кызылорда',
  mangystau: 'Мангистау (Актау)',
  pavlodar: 'Павлодар',
  petropavl: 'Петропавловск',
  taraz: 'Тараз',
  turkistan: 'Туркестан',
  uralsk: 'Уральск',
  ustkamenogorsk: 'Усть-Каменогорск',
  other: 'Другой регион'
};

// MBTI типы личности
export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface MBTIProfile {
  type: MBTIType;
  description: string; // AI-generated full explanation
  learningStyle: string; // подробное описание стиля обучения
  strengths: string[]; // 5-6 сильных сторон
  challenges: string[]; // 5-6 возможных сложностей
  recommendations?: string[]; // практические рекомендации
  setAt: Date;
}

// Статистика по играм
export interface GameStats {
  totalGamesPlayed: number;
  bestScoresBySubject: Record<string, number>;
  totalPointsEarned: number;
  lastPlayedAt?: Date;
}

// Отстающие темы по предметам
export interface WeakTopic {
  subject: Subject;
  topicName: string;
  topicId: string;
  weaknessLevel: number; // 0-100, где 100 = самое слабое место
  lastTestScore?: number; // последний балл по теме
  gamesPlayed: number; // сколько игр по этой теме сыграно
}

export interface Student extends User {
  role: 'student';
  grade: number; // 7-12 класс
  goals: string[]; // экзамен, олимпиада, повторение
  level?: 'beginner' | 'intermediate' | 'advanced';
  region?: Region; // регион ученика
  mbtiProfile?: MBTIProfile;
  totalPoints?: number; // общие баллы за всё время
  gameStats?: GameStats; // статистика по играм
  selectedSubjects?: Subject[]; // 3 выбранных предмета для углубленного изучения
  weakTopics?: WeakTopic[]; // отстающие темы по выбранным предметам
}

export interface Teacher extends User {
  role: 'teacher';
  subjects: Subject[];
}

// Предметы по программе МОН РК
export type Subject =
  | 'mathematics'
  | 'physics'
  | 'informatics'
  | 'economics'
  | 'biology'
  | 'chemistry'
  | 'geography'
  | 'english';

export const subjectNames: Record<Subject, string> = {
  mathematics: 'Математика',
  physics: 'Физика',
  informatics: 'Информатика',
  economics: 'Экономика',
  biology: 'Биология',
  chemistry: 'Химия',
  geography: 'География',
  english: 'Английский язык',
};

// Темы по четвертям (упрощенная структура для MVP)
export interface Topic {
  id: string;
  subject: Subject;
  grade: number;
  quarter: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  order: number;
}

// Материалы (YouTube видео)
export interface Material {
  id: string;
  topicId: string;
  type: 'video' | 'article';
  title: string;
  url: string;
  duration?: number; // для видео в секундах
  difficulty: 'easy' | 'medium' | 'hard';
}

// Задания и тесты
export interface Assignment {
  id: string;
  topicId: string;
  type: 'test' | 'problem';
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  createdBy?: string; // ID учителя, если добавлено вручную
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'open_ended';
  options?: string[]; // для multiple choice
  correctAnswer: string | number; // индекс или текст
  explanation: string;
  points: number;
}

// Прогресс ученика
export interface StudentProgress {
  id: string;
  studentId: string;
  topicId: string;
  completedMaterials: string[]; // ID материалов
  completedAssignments: string[]; // ID заданий
  scores: AssignmentScore[];
  weakPoints: string[]; // темы, где есть пробелы
  lastActivity: Date;
}

export interface AssignmentScore {
  assignmentId: string;
  score: number;
  maxScore: number;
  completedAt: Date;
  answers: StudentAnswer[];
}

export interface StudentAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  aiFeedback?: string;
}

// AI-оценка и обратная связь по тесту
export interface AITestFeedback {
  id: string;
  studentId: string;
  assignmentId: string;
  score: number;
  maxScore: number;
  completedAt: Date;

  // Общий анализ
  overallAnalysis: string; // Развернутый анализ всего теста
  strengths: string[]; // Что получилось хорошо
  weaknesses: string[]; // Над чем нужно поработать

  // Детальная обратная связь по каждому вопросу
  questionFeedback: QuestionFeedback[];

  // Рекомендации
  recommendations: string[]; // Конкретные действия для улучшения
  suggestedMaterials: string[]; // ID материалов для повторения
  estimatedTimeToImprove: number; // Оценочное время на улучшение (часы)

  generatedAt: Date;
}

export interface QuestionFeedback {
  questionId: string;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string; // Объяснение правильного ответа
  mistakeAnalysis?: string; // Анализ ошибки (если ответ неверный)
  hint?: string; // Подсказка для понимания
}

// Диагностика
export interface DiagnosticTest {
  id: string;
  subject: Subject;
  grade: number;
  questions: Question[];
}

export interface DiagnosticResult {
  id: string;
  studentId: string;
  testId: string;
  score: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  weakTopics: string[];
  completedAt: Date;
}

// Рекомендации AI
export interface Recommendation {
  studentId: string;
  materials: Material[];
  assignments: Assignment[];
  suggestedPath: string[]; // ID тем в рекомендуемом порядке
  generatedAt: Date;
  reasoning: string; // почему такие рекомендации
}

// Региональные чаты
export interface RegionalChatMessage {
  id: string;
  region: Region;
  studentId: string;
  studentName: string;
  message: string;
  timestamp: Date;
}

// Лидерборд
export interface LeaderboardEntry {
  studentId: string;
  studentName: string;
  grade: number;
  region: Region;
  totalPoints: number;
  rank: number;
}

// Роадмап для достижения целей
export type RoadmapGoalType =
  | 'university' // Поступление в университет
  | 'olympiad' // Победа в олимпиаде
  | 'grades' // Выйти на пятерки
  | 'exam' // Подготовка к экзамену
  | 'custom'; // Кастомная цель

export type TaskPriority = 'high' | 'medium' | 'low';

// Активность студента для проактивного ИИ
export interface StudentActivity {
  id: string;
  studentId: string;
  type: 'topic_view' | 'chat_message' | 'test_attempt' | 'game_play' | 'material_view';
  topicId?: string;
  subject?: Subject;
  duration?: number; // миллисекунды
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Интервенция ИИ-агента
export interface AIIntervention {
  id: string;
  studentId: string;
  type: 'help_offer' | 'format_change' | 'break_suggestion' | 'test_suggestion' | 'motivation';
  reason: string; // почему ИИ решил вмешаться
  message: string; // сообщение студенту
  triggerActivity?: string; // ID активности, вызвавшей интервенцию
  timestamp: Date;
  dismissed?: boolean;
  actionTaken?: string; // что сделал студент
}

// Сессия обучения
export interface LearningSession {
  id: string;
  studentId: string;
  subject?: Subject;
  topicId?: string;
  startTime: Date;
  endTime?: Date;
  activities: StudentActivity[];
  interventions: AIIntervention[];
  stuckDuration?: number; // сколько времени студент "застрял"
  engagementScore?: number; // 0-100
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  deadline: string; // например "9 класс, 1 четверть"
  priority: TaskPriority; // high = красный, medium = желтый, low = зеленый
  completed: boolean;
  grade: number; // В каком классе нужно выполнить
  quarter?: 1 | 2 | 3 | 4; // В какой четверти (опционально)
}

// Портфолио для университета
export interface UniversityPortfolio {
  gpa: number; // Средний балл (0-5)
  achievements: string[]; // Достижения (призы олимпиад, конкурсов)
  activities: string[]; // Внеклассная активность (клубы, волонтерство)
  projects: string[]; // Проекты (научные, творческие)
  certifications: string[]; // Сертификаты (курсы, языки)
  leadership: string[]; // Лидерство (президент класса, капитан команды)
  testScores?: {
    ent?: number; // ЕНТ балл
    sat?: number; // SAT балл
    ielts?: number; // IELTS балл
    toefl?: number; // TOEFL балл
  };
}

export interface RoadmapGoal {
  id: string;
  studentId: string;
  type: RoadmapGoalType;
  title: string; // "Поступить в Назарбаев Университет", "Выиграть республиканскую олимпиаду по математике"
  targetUniversity?: string; // Для type === 'university'
  targetSubject?: Subject; // Для type === 'olympiad' или 'exam'
  targetDate?: Date; // Целевая дата достижения (дедлайн цели)
  aiAnalysis: string; // Развернутый анализ от ИИ
  alternativeUniversities?: string[]; // Рекомендации альтернативных университетов (для type === 'university')
  tasks: RoadmapTask[];
  portfolio?: UniversityPortfolio; // Детальное портфолио (для университета)
  createdAt: Date;
  updatedAt: Date;
}

// Календарные дедлайны
export type DeadlineType = 'exam' | 'olympiad' | 'contest' | 'project' | 'custom';

export interface Deadline {
  id: string;
  studentId: string;
  title: string; // "ЕНТ по математике", "Республиканская олимпиада"
  type: DeadlineType;
  date: Date; // Дата дедлайна
  subject?: Subject; // Если связано с предметом
  description?: string; // Дополнительная информация
  color?: string; // Цвет в календаре (hex)
  completed?: boolean;
  createdAt: Date;
}

// Магазин
export type ShopItemCategory = 'merch' | 'profile_frame' | 'badge' | 'avatar' | 'theme' | 'boost';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ShopItemCategory;
  price: number; // цена в баллах
  imageUrl: string;
  stock?: number; // для мерча (футболки, худи)
  isLimited?: boolean; // лимитированный товар
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  createdAt: Date;
}

export interface StudentInventory {
  studentId: string;
  ownedItems: OwnedItem[];
  equippedFrame?: string; // ID рамки профиля
  equippedBadge?: string; // ID бейджа
  equippedAvatar?: string; // ID аватара
  equippedTheme?: string; // ID темы
}

export interface OwnedItem {
  itemId: string;
  purchasedAt: Date;
  isEquipped?: boolean;
}

export interface Purchase {
  id: string;
  studentId: string;
  itemId: string;
  pointsSpent: number;
  purchasedAt: Date;
  status: 'pending' | 'completed' | 'shipped'; // для физического мерча
  shippingInfo?: {
    address: string;
    city: string;
    phone: string;
  };
}
