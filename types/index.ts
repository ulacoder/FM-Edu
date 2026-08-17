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

export interface Student extends User {
  role: 'student';
  grade: number; // 7-12 класс
  goals: string[]; // экзамен, олимпиада, повторение
  level?: 'beginner' | 'intermediate' | 'advanced';
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
  | 'english';

export const subjectNames: Record<Subject, string> = {
  mathematics: 'Математика',
  physics: 'Физика',
  informatics: 'Информатика',
  economics: 'Экономика',
  biology: 'Биология',
  chemistry: 'Химия',
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
