export type SubjectCategory = 'mathematics' | 'physics' | 'informatics' | 'chemistry' | 'biology' | 'geography' | 'history';

export interface TopicMastery {
  topicId: string;
  topicName: string;
  subject: SubjectCategory;
  correctCount: number;
  totalAttempts: number;
  masteryPercent: number; // 0-100
  lastAttemptAt: string;
}

export interface DailyQuestion {
  id: string;
  subject: SubjectCategory;
  topicId: string;
  topicName: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  formula?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface DailyQuestionSet {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  questions: DailyQuestion[];
  completedQuestions: string[]; // question IDs
  answers: {
    [questionId: string]: {
      selectedAnswer: 'A' | 'B' | 'C' | 'D';
      correct: boolean;
      pointsEarned: number;
      answeredAt: string;
    };
  };
  status: 'pending' | 'in_progress' | 'completed';
  totalPoints: number;
  createdAt: string;
  completedAt?: string;
  cached: boolean; // для офлайн-режима
}

export interface UserStreak {
  studentId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string; // YYYY-MM-DD
  streakMilestones: {
    days: number;
    unlockedAt: string;
    bonusPoints: number;
  }[];
}

export interface DailyQuestionAttempt {
  id: string;
  studentId: string;
  questionId: string;
  topicId: string;
  subject: SubjectCategory;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  correct: boolean;
  answeredAt: string;
  pointsEarned: number;
}

export const POINTS_PER_CORRECT = 20;
export const BONUS_FOR_DAILY_COMPLETION = 50;
export const STREAK_MILESTONES = [
  { days: 3, bonusPoints: 100 },
  { days: 7, bonusPoints: 250 },
  { days: 14, bonusPoints: 500 },
  { days: 30, bonusPoints: 1000 },
];

export const QUESTIONS_PER_DAY = 5;
