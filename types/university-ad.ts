export interface UniversityAd {
  id: string;
  university_name: string;
  university_name_en?: string; // Английское название
  logo_url: string;
  description: string; // Краткое описание программы
  min_score_info: string; // "ЕНТ от 120 баллов" или "SAT от 1400"
  benefits: string[]; // ["100% грант", "Бесплатное проживание", "Стипендия"]
  target_url: string; // Внешняя ссылка на сайт университета
  is_active: boolean;
  priority: number; // Для сортировки (чем меньше, тем выше)
  country: 'kz' | 'us' | 'uk' | 'eu' | 'other';
  created_at: string;
}

export const UNIVERSITY_COLORS = {
  gold: {
    border: 'border-yellow-500',
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-600',
    gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
  },
};
