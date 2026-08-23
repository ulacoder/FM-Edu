export type InteractiveMode = 'individual' | 'team';

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  subject: string;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  studentIds: string[];
  score: number;
}

export interface InteractiveSession {
  id: string;
  teacherId: string;
  classId: string;
  mode: InteractiveMode;
  quizId: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  teams?: Team[];
  currentTeamIndex?: number;
  studentAnswers: {
    [studentId: string]: {
      correctCount: number;
      totalAnswered: number;
      pointsEarned: number;
    };
  };
  teamScores?: {
    [teamId: string]: number;
  };
  startedAt: string;
  completedAt?: string;
}

export interface QuizTemplate {
  id: string;
  title: string;
  subject: string;
  grade: number;
  questions: QuizQuestion[];
  createdBy: string;
  createdAt: string;
}

export const TEAM_COLORS = [
  { name: 'Команда 1', color: 'bg-blue-500', textColor: 'text-blue-600', borderColor: 'border-blue-500' },
  { name: 'Команда 2', color: 'bg-green-500', textColor: 'text-green-600', borderColor: 'border-green-500' },
  { name: 'Команда 3', color: 'bg-purple-500', textColor: 'text-purple-600', borderColor: 'border-purple-500' },
  { name: 'Команда 4', color: 'bg-orange-500', textColor: 'text-orange-600', borderColor: 'border-orange-500' },
];

export const POINTS_PER_CORRECT_ANSWER = 50;
