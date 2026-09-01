// Mock recommendations generator for FM Edu
// Works offline when Supabase/Qwen is unavailable

export interface MockRecommendation {
  courseId: string;
  title: string;
  priority: number;
  reasoning: string;
  benefits: string;
  impact: string;
  matchScore: number;
}

export interface MockRecommendationsData {
  recommendations: MockRecommendation[];
  overallReasoning: string;
}

// Базовые курсы для разных профилей
const COURSE_POOL = [
  {
    id: 'mathematics',
    title: 'Алгебра и начала анализа',
    subject: 'Математика',
    difficulty: 'medium',
    topics: ['Уравнения', 'Неравенства', 'Функции', 'Производные'],
    forMBTI: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
    reasoning: 'Твой аналитический склад ума идеально подходит для изучения алгебры. Этот курс разовьёт логическое мышление и подготовит к ЕНТ.',
    benefits: 'Научишься решать сложные уравнения, работать с функциями и производными, что критично для математического анализа.',
    impact: 'Алгебра - основа для физики, программирования и экономики. Сильные навыки откроют двери в лучшие вузы.',
    matchScore: 92
  },
  {
    id: 'physics',
    title: 'Физика: Механика и Термодинамика',
    subject: 'Физика',
    difficulty: 'hard',
    topics: ['Законы Ньютона', 'Энергия', 'Температура', 'МКТ'],
    forMBTI: ['INTJ', 'INTP', 'ISTJ', 'ISTP'],
    reasoning: 'Физика требует системного подхода и глубокого понимания законов природы - это твоя сильная сторона.',
    benefits: 'Освоишь фундаментальные законы механики и термодинамики, научишься решать олимпиадные задачи.',
    impact: 'Физика критична для инженерных специальностей, робототехники и AI. НИШевская программа готовит к международным олимпиадам.',
    matchScore: 88
  },
  {
    id: 'informatics',
    title: 'Информатика: Python и Алгоритмы',
    subject: 'Информатика',
    difficulty: 'medium',
    topics: ['Python', 'Алгоритмы', 'Структуры данных', 'ООП'],
    forMBTI: ['INTP', 'ENTP', 'INTJ', 'ENTJ'],
    reasoning: 'Программирование - это чистая логика и креатив. Ты быстро схватываешь паттерны и любишь решать головоломки.',
    benefits: 'Научишься писать код на Python, работать с алгоритмами сортировки, графами и динамическим программированием.',
    impact: 'Программирование - навык №1 в 21 веке. Откроет путь в IT-стартапы, AI, Data Science и робототехнику.',
    matchScore: 95
  },
  {
    id: 'chemistry',
    title: 'Химия: Основы и Органика',
    subject: 'Химия',
    difficulty: 'medium',
    topics: ['Атомы', 'Реакции', 'Органика', 'Электрохимия'],
    forMBTI: ['ISTJ', 'INTJ', 'ISFJ', 'INFJ'],
    reasoning: 'Химия требует внимания к деталям и понимания закономерностей - это твои сильные стороны.',
    benefits: 'Разберёшься в химических реакциях, органических соединениях и сможешь решать задачи ЕНТ на высоком уровне.',
    impact: 'Химия нужна для медицины, фармацевтики, биотехнологий. НИШевская программа даёт серьёзную базу.',
    matchScore: 85
  },
  {
    id: 'biology',
    title: 'Биология: Клетка и Генетика',
    subject: 'Биология',
    difficulty: 'easy',
    topics: ['Клетка', 'ДНК', 'Эволюция', 'Генетика'],
    forMBTI: ['INFJ', 'INFP', 'ISFJ', 'ENFP'],
    reasoning: 'Биология изучает живые системы - тебе интересно понимать, как всё устроено на уровне клеток и организмов.',
    benefits: 'Узнаешь про строение клетки, ДНК, законы Менделя и эволюционные процессы.',
    impact: 'Биология открывает путь в медицину, биоинформатику, генную инженерию - перспективные области будущего.',
    matchScore: 80
  },
  {
    id: 'english',
    title: 'Английский: Грамматика и IELTS',
    subject: 'Английский',
    difficulty: 'medium',
    topics: ['Grammar', 'Vocabulary', 'IELTS', 'Writing'],
    forMBTI: ['ENFP', 'ENTP', 'INFP', 'INTP'],
    reasoning: 'Английский - это не просто язык, а ключ к мировым знаниям. Ты быстро схватываешь новые слова и паттерны.',
    benefits: 'Подготовишься к IELTS, улучшишь грамматику, научишься писать эссе и свободно общаться.',
    impact: 'Английский критичен для поступления в зарубежные вузы, работы в международных компаниях и доступа к топовым ресурсам.',
    matchScore: 90
  },
  {
    id: 'geography',
    title: 'География Казахстана и мира',
    subject: 'География',
    difficulty: 'easy',
    topics: ['Карты', 'Климат', 'Ресурсы', 'Экономика'],
    forMBTI: ['ENFP', 'ESFP', 'ENFJ', 'ESFJ'],
    reasoning: 'География помогает понять глобальные процессы и взаимосвязи между странами и регионами.',
    benefits: 'Изучишь природные ресурсы, экономические связи, климатические зоны и геополитику.',
    impact: 'География нужна для экономики, логистики, международных отношений и экологии.',
    matchScore: 75
  },
  {
    id: 'economics',
    title: 'Экономика и Предпринимательство',
    subject: 'Экономика',
    difficulty: 'medium',
    topics: ['Микро', 'Макро', 'Рынок', 'Стартапы'],
    forMBTI: ['ENTJ', 'ENTP', 'ESTJ', 'ESTP'],
    reasoning: 'Ты любишь стратегическое мышление и понимание систем - экономика раскроет механизмы бизнеса и рынков.',
    benefits: 'Научишься анализировать рынки, понимать спрос и предложение, создавать бизнес-планы.',
    impact: 'Экономика критична для предпринимательства, финансов, консалтинга. НИШ даёт отличную базу для бизнес-карьеры.',
    matchScore: 87
  }
];

export function generateMockRecommendations(userData?: {
  name?: string;
  grade?: number;
  personality_type?: string;
  selectedSubjects?: string[];
}): MockRecommendationsData {
  const mbti = userData?.personality_type || 'INTJ';
  const selectedSubjects = userData?.selectedSubjects || [];

  // Фильтруем курсы по MBTI и исключаем уже выбранные
  let filteredCourses = COURSE_POOL.filter(course =>
    course.forMBTI.includes(mbti) && !selectedSubjects.includes(course.id)
  );

  // Если после фильтрации осталось мало курсов, добавляем остальные
  if (filteredCourses.length < 5) {
    const remaining = COURSE_POOL.filter(c => !filteredCourses.includes(c) && !selectedSubjects.includes(c.id));
    filteredCourses = [...filteredCourses, ...remaining];
  }

  // Берём топ-5 с наивысшим matchScore
  const topCourses = filteredCourses
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

  const recommendations: MockRecommendation[] = topCourses.map((course, index) => ({
    courseId: course.id,
    title: course.title,
    priority: index + 1,
    reasoning: course.reasoning,
    benefits: course.benefits,
    impact: course.impact,
    matchScore: course.matchScore - (index * 2) // Плавное снижение score
  }));

  let overallReasoning = `На основе твоего MBTI типа (${mbti}) и профиля`;

  if (mbti.startsWith('I')) {
    overallReasoning += ', я подобрал курсы с глубоким погружением в теорию и самостоятельной работой.';
  } else {
    overallReasoning += ', я подобрал курсы с практическими задачами и групповыми проектами.';
  }

  if (mbti.includes('N')) {
    overallReasoning += ' Фокус на абстрактном мышлении и концепциях.';
  } else {
    overallReasoning += ' Фокус на конкретных примерах и практике.';
  }

  return {
    recommendations,
    overallReasoning
  };
}

// Функция для сохранения рекомендаций в localStorage
export function saveMockRecommendations(recommendations: MockRecommendationsData) {
  try {
    localStorage.setItem('recommendations_cache', JSON.stringify({
      timestamp: Date.now(),
      data: {
        hasRecommendations: true,
        recommendations: recommendations.recommendations,
        reasoning: recommendations.overallReasoning,
        generatedAt: new Date().toISOString()
      }
    }));
    return true;
  } catch (e) {
    console.error('Failed to save recommendations to cache:', e);
    return false;
  }
}

// Функция для получения сохранённых рекомендаций
export function getCachedRecommendations(): MockRecommendationsData | null {
  try {
    const cached = localStorage.getItem('recommendations_cache');
    if (!cached) return null;

    const cache = JSON.parse(cached);
    const cacheAge = Date.now() - cache.timestamp;

    // Кэш валиден 5 минут
    if (cacheAge < 300000 && cache.data?.hasRecommendations) {
      return {
        recommendations: cache.data.recommendations,
        overallReasoning: cache.data.reasoning
      };
    }

    return null;
  } catch (e) {
    console.error('Failed to load cached recommendations:', e);
    return null;
  }
}
