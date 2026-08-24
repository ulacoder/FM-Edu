export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'content_manager';
  createdAt: Date;
}

export interface CourseContent {
  id: string;
  title: string;
  subject: string;
  grade: number;
  description: string;
  videoUrl?: string;
  audioUrl?: string;
  textContent?: string;
  infographicUrl?: string;
  duration?: number; // в минутах
  createdAt: Date;
  updatedAt: Date;
}

export interface SubjectAnalytics {
  subject: string;
  totalStudents: number;
  avgTimeSpent: number; // в минутах
  completionRate: number;
  popularTopics: { name: string; views: number }[];
}

export interface UserActivity {
  userId: string;
  userName: string;
  totalTimeSpent: number; // в минутах
  coursesCompleted: number;
  testsCompleted: number;
  lastActive: Date;
  skillsRadar: {
    mathematics: number;
    physics: number;
    informatics: number;
    chemistry: number;
    biology: number;
  };
}

export interface PlatformMetrics {
  totalUsers: number;
  activeUsersToday: number;
  totalCourses: number;
  offlineDownloads: number;
  avgSessionTime: number;
  topSubjects: { name: string; views: number }[];
}

export interface OfflinePackage {
  id: string;
  name: string;
  subject: string;
  grade: number;
  size: number; // в MB
  downloads: number;
  lessons: string[];
  tests: string[];
  createdAt: Date;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: 'scholarship' | 'competition' | 'internship' | 'program';
  deadline?: Date;
  eligibility: string[];
  link?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
