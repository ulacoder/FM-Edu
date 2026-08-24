export interface LessonContent {
  id: string;
  topicId: string;
  subject: string;
  grade: number;
  quarter: number;

  // Text content
  title: string;
  description: string;
  textContent: {
    formulas?: Array<{
      title: string;
      formula: string;
      example: string;
    }>;
    tips?: string[];
    commonMistakes?: Array<{
      wrong: string;
      correct: string;
    }>;
    examples?: Array<{
      question: string;
      solution: string;
    }>;
    infographics?: string[]; // URLs to infographic images
  };

  // Audio content
  audioUrl?: string;
  audioDuration?: number; // in seconds
  audioSize?: number; // in MB

  // Video content
  videoId?: string;
  youtubeQuery?: string;
  videoDuration?: number;
  videoSize?: number; // estimated in MB

  // Metadata
  estimatedReadTime?: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  keywords: string[];
}

export interface ContentStats {
  textSizeKB: number;
  audioSizeMB: number;
  videoSizeMB: number;
  offlineSupport: {
    text: boolean;
    audio: boolean;
    video: boolean;
  };
}
