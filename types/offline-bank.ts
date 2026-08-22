export type SubjectCategory =
  | 'mathematics'
  | 'physics'
  | 'informatics'
  | 'biology'
  | 'chemistry'
  | 'economics'
  | 'english'
  | 'geography'
  | 'sat';

export type FileFormat = 'pdf' | 'docx' | 'pptx' | 'xlsx';

export interface OfflineMaterial {
  id: string;
  title: string;
  subject: SubjectCategory;
  file_url: string;
  file_size: number; // в байтах
  file_format: FileFormat;
  target_class_id?: string; // если не указан — публичный материал
  teacher_id?: string; // кто загрузил (только для приватных)
  teacher_name?: string;
  teacher_note?: string; // записка от учителя
  is_public: boolean;
  created_at: string;
  cached_locally?: boolean; // для офлайн-статуса
}

export const SUBJECT_NAMES: Record<SubjectCategory, string> = {
  mathematics: 'Математика',
  physics: 'Физика',
  informatics: 'Информатика',
  biology: 'Биология',
  chemistry: 'Химия',
  economics: 'Экономика',
  english: 'Английский язык',
  geography: 'География',
  sat: 'SAT',
};

export const ACTIVE_SUBJECTS: SubjectCategory[] = ['mathematics', 'physics', 'informatics'];
export const COMING_SOON_SUBJECTS: SubjectCategory[] = ['biology', 'chemistry', 'economics', 'english', 'geography', 'sat'];

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
