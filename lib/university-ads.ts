import { UniversityAd } from '@/types/university-ad';

// Мок-данные университетов с грантовыми программами
export const UNIVERSITY_ADS: UniversityAd[] = [
  {
    id: 'uni_nazarbayev',
    university_name: 'Назарбаев Университет',
    university_name_en: 'Nazarbayev University',
    logo_url: '/logos/nu-logo.svg',
    description: 'Полный грант на все программы бакалавриата',
    min_score_info: 'ЕНТ от 130 баллов',
    benefits: ['100% грант', 'Бесплатное проживание', 'Стипендия 40 000 ₸/мес'],
    target_url: 'https://nu.edu.kz/admissions',
    is_active: true,
    priority: 1,
    country: 'kz',
    created_at: '2026-08-20T00:00:00Z',
  },
  {
    id: 'uni_sdu',
    university_name: 'SDU University',
    university_name_en: 'Suleyman Demirel University',
    logo_url: '/logos/sdu-logo.svg',
    description: 'Грант 100% для отличников ЕНТ',
    min_score_info: 'ЕНТ от 125 баллов',
    benefits: ['100% грант', 'Скидка на общежитие 50%'],
    target_url: 'https://sdu.edu.kz/language/ru/applicants/',
    is_active: true,
    priority: 2,
    country: 'kz',
    created_at: '2026-08-20T00:00:00Z',
  },
  {
    id: 'uni_kimep',
    university_name: 'KIMEP University',
    university_name_en: 'KIMEP University',
    logo_url: '/logos/kimep-logo.svg',
    description: 'Полный грант + стипендия для лучших',
    min_score_info: 'SAT от 1300 или ЕНТ 120+',
    benefits: ['100% грант', 'Стипендия до 500 000 ₸/год'],
    target_url: 'https://kimep.kz/admissions/',
    is_active: true,
    priority: 3,
    country: 'kz',
    created_at: '2026-08-20T00:00:00Z',
  },
  {
    id: 'uni_astana_it',
    university_name: 'Astana IT University',
    university_name_en: 'Astana IT University',
    logo_url: '/logos/aitu-logo.svg',
    description: 'Грант для IT-специальностей',
    min_score_info: 'ЕНТ от 115 баллов',
    benefits: ['100% грант на IT', 'Практика в крупных компаниях'],
    target_url: 'https://astanait.edu.kz/ru/',
    is_active: true,
    priority: 4,
    country: 'kz',
    created_at: '2026-08-20T00:00:00Z',
  },
  {
    id: 'uni_kbtu',
    university_name: 'КБТУ',
    university_name_en: 'KBTU',
    logo_url: '/logos/kbtu-logo.svg',
    description: 'Грант на технические специальности',
    min_score_info: 'ЕНТ от 118 баллов',
    benefits: ['100% грант', 'Партнерство с нефтегазовыми компаниями'],
    target_url: 'https://www.kbtu.kz/ru/abitur/',
    is_active: true,
    priority: 5,
    country: 'kz',
    created_at: '2026-08-20T00:00:00Z',
  },
  {
    id: 'uni_bolashak',
    university_name: 'Программа "Болашак"',
    university_name_en: 'Bolashak Scholarship',
    logo_url: '/logos/bolashak-logo.svg',
    description: 'Обучение за рубежом за счет государства',
    min_score_info: 'IELTS 6.5+ или TOEFL 79+',
    benefits: ['Полная оплата обучения', 'Ежемесячная стипендия', 'Авиабилеты'],
    target_url: 'https://bolashak.gov.kz/',
    is_active: true,
    priority: 6,
    country: 'other',
    created_at: '2026-08-20T00:00:00Z',
  },
];

/**
 * Получить активные объявления университетов
 */
export function getActiveUniversityAds(): UniversityAd[] {
  const ads = localStorage.getItem('fm_edu_university_ads');
  if (ads) {
    const parsedAds: UniversityAd[] = JSON.parse(ads);
    return parsedAds.filter((ad) => ad.is_active).sort((a, b) => a.priority - b.priority);
  }

  // Первая загрузка — сохраняем дефолтные данные
  localStorage.setItem('fm_edu_university_ads', JSON.stringify(UNIVERSITY_ADS));
  return UNIVERSITY_ADS.filter((ad) => ad.is_active).sort((a, b) => a.priority - b.priority);
}

/**
 * Получить объявление по ID
 */
export function getUniversityAdById(id: string): UniversityAd | null {
  const ads = getActiveUniversityAds();
  return ads.find((ad) => ad.id === id) || null;
}

/**
 * Инициализация объявлений (вызывается при первой загрузке)
 */
export function initializeUniversityAds() {
  const existing = localStorage.getItem('fm_edu_university_ads');
  if (!existing) {
    localStorage.setItem('fm_edu_university_ads', JSON.stringify(UNIVERSITY_ADS));
  }
}
