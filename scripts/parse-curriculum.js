/**
 * Скрипт для парсинга учебных программ РК
 * Источники: nao.kz, sko.kz, bilimland.kz, nis.edu.kz
 */

const fs = require('fs');
const path = require('path');

// Структура для хранения данных
const curriculumData = {
  mathematics: [],
  physics: [],
  english: [],
  informatics: [],
  chemistry: [],
  biology: [],
  economics: [],
  geography: []
};

// Источники данных (добавь рабочие URL после проверки доступности)
const sources = [
  {
    name: 'NAO (Национальная Академия Образования)',
    url: 'https://nao.kz/blogs/1/181',
    description: 'Типовые учебные программы'
  },
  {
    name: 'SKO.KZ',
    url: 'https://sko.kz',
    description: 'Среднее образование РК'
  },
  {
    name: 'Bilimland',
    url: 'https://bilimland.kz/ru/courses',
    description: 'Образовательная платформа с КТП'
  },
  {
    name: 'NIS',
    url: 'https://www.nis.edu.kz/ru/about/education/',
    description: 'Программы НИШ'
  }
];

// Шаблон темы
function createTopic(subject, grade, quarter, title, description, keywords = [], order = 1) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    subject,
    grade,
    quarter,
    order,
    title,
    description,
    keywords
  };
}

// Данные по химии (7-12 классы)
const chemistryTopics = [
  // 7 класс
  { grade: 7, quarter: 1, title: 'Введение в химию', description: 'Предмет химии, вещества и их свойства', keywords: ['вещество', 'молекула', 'атом', 'химическая реакция'] },
  { grade: 7, quarter: 2, title: 'Атомы и молекулы', description: 'Строение атома, химические элементы', keywords: ['протон', 'нейтрон', 'электрон', 'периодическая система'] },
  { grade: 7, quarter: 3, title: 'Простые и сложные вещества', description: 'Классификация веществ', keywords: ['простые вещества', 'сложные вещества', 'оксиды'] },
  { grade: 7, quarter: 4, title: 'Химические реакции', description: 'Типы химических реакций', keywords: ['реакция соединения', 'разложение', 'замещение', 'обмен'] },

  // 8 класс
  { grade: 8, quarter: 1, title: 'Периодический закон', description: 'Периодическая система Менделеева', keywords: ['период', 'группа', 'металлы', 'неметаллы'] },
  { grade: 8, quarter: 2, title: 'Химическая связь', description: 'Ионная и ковалентная связь', keywords: ['ионная связь', 'ковалентная связь', 'электроотрицательность'] },
  { grade: 8, quarter: 3, title: 'Классы неорганических соединений', description: 'Оксиды, кислоты, основания, соли', keywords: ['оксиды', 'кислоты', 'основания', 'соли'] },
  { grade: 8, quarter: 4, title: 'Растворы', description: 'Растворы и их концентрация', keywords: ['раствор', 'концентрация', 'растворимость'] },

  // 9 класс
  { grade: 9, quarter: 1, title: 'Электролитическая диссоциация', description: 'Теория электролитической диссоциации', keywords: ['электролит', 'ионы', 'диссоциация'] },
  { grade: 9, quarter: 2, title: 'Реакции ионного обмена', description: 'ОВР и ионный обмен', keywords: ['окисление', 'восстановление', 'ионное уравнение'] },
  { grade: 9, quarter: 3, title: 'Неметаллы', description: 'Свойства неметаллов и их соединений', keywords: ['галогены', 'кислород', 'сера', 'азот'] },
  { grade: 9, quarter: 4, title: 'Металлы', description: 'Общие свойства металлов', keywords: ['щелочные металлы', 'алюминий', 'железо'] },

  // 10 класс
  { grade: 10, quarter: 1, title: 'Теория строения органических соединений', description: 'Основы органической химии', keywords: ['органические вещества', 'гомологи', 'изомеры'] },
  { grade: 10, quarter: 2, title: 'Углеводороды', description: 'Алканы, алкены, алкины', keywords: ['алканы', 'алкены', 'алкины', 'ароматические'] },
  { grade: 10, quarter: 3, title: 'Спирты и фенолы', description: 'Кислородсодержащие органические соединения', keywords: ['спирты', 'фенолы', 'альдегиды'] },
  { grade: 10, quarter: 4, title: 'Карбоновые кислоты', description: 'Карбоновые кислоты и эфиры', keywords: ['карбоновые кислоты', 'сложные эфиры', 'жиры'] },

  // 11 класс
  { grade: 11, quarter: 1, title: 'Азотсодержащие соединения', description: 'Амины, аминокислоты', keywords: ['амины', 'аминокислоты', 'белки'] },
  { grade: 11, quarter: 2, title: 'Углеводы', description: 'Моно- и полисахариды', keywords: ['глюкоза', 'сахароза', 'крахмал', 'целлюлоза'] },
  { grade: 11, quarter: 3, title: 'Высокомолекулярные соединения', description: 'Полимеры', keywords: ['полимеры', 'мономеры', 'пластмассы'] },
  { grade: 11, quarter: 4, title: 'Химия и жизнь', description: 'Прикладная химия', keywords: ['биохимия', 'экология', 'химическое производство'] },

  // 12 класс
  { grade: 12, quarter: 1, title: 'Химическая термодинамика', description: 'Энергетика химических реакций', keywords: ['энтальпия', 'энтропия', 'энергия Гиббса'] },
  { grade: 12, quarter: 2, title: 'Химическая кинетика', description: 'Скорость химических реакций', keywords: ['скорость реакции', 'катализ', 'равновесие'] },
  { grade: 12, quarter: 3, title: 'Электрохимия', description: 'Окислительно-восстановительные процессы', keywords: ['электролиз', 'гальванический элемент', 'коррозия'] },
  { grade: 12, quarter: 4, title: 'Обобщение курса химии', description: 'Систематизация знаний', keywords: ['неорганическая химия', 'органическая химия'] }
];

// Данные по биологии (7-12 классы)
const biologyTopics = [
  // 7 класс
  { grade: 7, quarter: 1, title: 'Многообразие живых организмов', description: 'Классификация организмов', keywords: ['царства живой природы', 'систематика', 'таксономия'] },
  { grade: 7, quarter: 2, title: 'Бактерии и вирусы', description: 'Строение и значение бактерий', keywords: ['прокариоты', 'вирусы', 'бактерии'] },
  { grade: 7, quarter: 3, title: 'Грибы и лишайники', description: 'Особенности грибов', keywords: ['мицелий', 'споры', 'лишайники'] },
  { grade: 7, quarter: 4, title: 'Растения', description: 'Строение и разнообразие растений', keywords: ['водоросли', 'мхи', 'папоротники', 'голосеменные', 'покрытосеменные'] },

  // 8 класс
  { grade: 8, quarter: 1, title: 'Зоология беспозвоночных', description: 'Беспозвоночные животные', keywords: ['простейшие', 'черви', 'моллюски', 'членистоногие'] },
  { grade: 8, quarter: 2, title: 'Зоология позвоночных', description: 'Позвоночные животные', keywords: ['рыбы', 'земноводные', 'пресмыкающиеся'] },
  { grade: 8, quarter: 3, title: 'Птицы и млекопитающие', description: 'Высшие позвоночные', keywords: ['птицы', 'млекопитающие', 'теплокровные'] },
  { grade: 8, quarter: 4, title: 'Эволюция животных', description: 'Происхождение и эволюция', keywords: ['эволюция', 'дарвинизм', 'естественный отбор'] },

  // 9 класс
  { grade: 9, quarter: 1, title: 'Анатомия человека', description: 'Строение организма человека', keywords: ['ткани', 'органы', 'системы органов'] },
  { grade: 9, quarter: 2, title: 'Опорно-двигательная система', description: 'Скелет и мышцы', keywords: ['скелет', 'мышцы', 'суставы'] },
  { grade: 9, quarter: 3, title: 'Кровь и кровообращение', description: 'Сердечно-сосудистая система', keywords: ['кровь', 'сердце', 'сосуды', 'иммунитет'] },
  { grade: 9, quarter: 4, title: 'Дыхание и пищеварение', description: 'Дыхательная и пищеварительная системы', keywords: ['дыхание', 'пищеварение', 'обмен веществ'] },

  // 10 класс
  { grade: 10, quarter: 1, title: 'Клетка - основа жизни', description: 'Цитология', keywords: ['клетка', 'органоиды', 'мембрана', 'ядро'] },
  { grade: 10, quarter: 2, title: 'Обмен веществ', description: 'Метаболизм', keywords: ['фотосинтез', 'дыхание', 'синтез белка'] },
  { grade: 10, quarter: 3, title: 'Размножение и развитие', description: 'Репродукция организмов', keywords: ['митоз', 'мейоз', 'гаметогенез', 'онтогенез'] },
  { grade: 10, quarter: 4, title: 'Генетика', description: 'Основы наследственности', keywords: ['ген', 'хромосома', 'законы Менделя', 'ДНК'] },

  // 11 класс
  { grade: 11, quarter: 1, title: 'Молекулярная биология', description: 'ДНК и РНК', keywords: ['ДНК', 'РНК', 'репликация', 'транскрипция', 'трансляция'] },
  { grade: 11, quarter: 2, title: 'Изменчивость', description: 'Виды изменчивости', keywords: ['модификации', 'мутации', 'комбинативная изменчивость'] },
  { grade: 11, quarter: 3, title: 'Селекция', description: 'Основы селекции и биотехнологии', keywords: ['селекция', 'биотехнология', 'генная инженерия'] },
  { grade: 11, quarter: 4, title: 'Эволюция', description: 'Теория эволюции', keywords: ['эволюция', 'Дарвин', 'СТЭ', 'антропогенез'] },

  // 12 класс
  { grade: 12, quarter: 1, title: 'Экология организмов', description: 'Основы экологии', keywords: ['среда обитания', 'экологические факторы', 'адаптации'] },
  { grade: 12, quarter: 2, title: 'Экосистемы', description: 'Биоценозы и экосистемы', keywords: ['биоценоз', 'экосистема', 'цепи питания', 'биосфера'] },
  { grade: 12, quarter: 3, title: 'Биосфера', description: 'Учение о биосфере', keywords: ['биосфера', 'Вернадский', 'круговорот веществ'] },
  { grade: 12, quarter: 4, title: 'Охрана природы', description: 'Рациональное природопользование', keywords: ['охрана природы', 'экологические проблемы', 'устойчивое развитие'] }
];

// Данные по английскому языку (7-12 классы)
const englishTopics = [
  // 7 класс
  { grade: 7, quarter: 1, title: 'Our World', description: 'Describing places and people', keywords: ['present simple', 'present continuous', 'adjectives', 'prepositions of place'] },
  { grade: 7, quarter: 2, title: 'Values', description: 'Character and values', keywords: ['past simple', 'past continuous', 'comparative adjectives', 'superlatives'] },
  { grade: 7, quarter: 3, title: 'Environment', description: 'Nature and ecology', keywords: ['future forms', 'first conditional', 'modal verbs', 'environment vocabulary'] },
  { grade: 7, quarter: 4, title: 'Travel and Transport', description: 'Holidays and journeys', keywords: ['present perfect', 'travel vocabulary', 'giving directions'] },

  // 8 класс
  { grade: 8, quarter: 1, title: 'Hobbies and Leisure', description: 'Free time activities', keywords: ['present perfect continuous', 'gerunds', 'infinitives'] },
  { grade: 8, quarter: 2, title: 'Food and Health', description: 'Healthy lifestyle', keywords: ['countable/uncountable nouns', 'quantifiers', 'health vocabulary'] },
  { grade: 8, quarter: 3, title: 'Entertainment and Media', description: 'TV, films, books', keywords: ['past perfect', 'reported speech', 'media vocabulary'] },
  { grade: 8, quarter: 4, title: 'Science and Technology', description: 'Modern technology', keywords: ['passive voice', 'relative clauses', 'technology terms'] },

  // 9 класс
  { grade: 9, quarter: 1, title: 'Education', description: 'School systems and learning', keywords: ['modals of obligation', 'education vocabulary', 'used to'] },
  { grade: 9, quarter: 2, title: 'Work and Career', description: 'Jobs and professions', keywords: ['future perfect', 'career vocabulary', 'conditional sentences'] },
  { grade: 9, quarter: 3, title: 'Culture and Traditions', description: 'Cultural diversity', keywords: ['articles', 'cultural vocabulary', 'narrative tenses'] },
  { grade: 9, quarter: 4, title: 'Social Issues', description: 'Modern society problems', keywords: ['wish/if only', 'advanced modals', 'social topics'] },

  // 10 класс
  { grade: 10, quarter: 1, title: 'Global Issues', description: 'World problems and solutions', keywords: ['advanced conditionals', 'discourse markers', 'global vocabulary'] },
  { grade: 10, quarter: 2, title: 'Communication', description: 'Ways of communication', keywords: ['phrasal verbs', 'communication skills', 'idioms'] },
  { grade: 10, quarter: 3, title: 'Innovation', description: 'Scientific discoveries', keywords: ['causative form', 'scientific vocabulary', 'mixed conditionals'] },
  { grade: 10, quarter: 4, title: 'Independent Project', description: 'Extended research project', keywords: ['academic writing', 'research skills', 'presentations'] },

  // 11 класс
  { grade: 11, quarter: 1, title: 'Identity and Culture', description: 'Personal and cultural identity', keywords: ['advanced grammar', 'identity vocabulary', 'essay writing'] },
  { grade: 11, quarter: 2, title: 'Literature and Arts', description: 'Literary analysis', keywords: ['literary devices', 'critical thinking', 'analysis'] },
  { grade: 11, quarter: 3, title: 'Business and Economics', description: 'Business world', keywords: ['business English', 'economic terms', 'formal writing'] },
  { grade: 11, quarter: 4, title: 'Exam Preparation', description: 'IELTS/SAT preparation', keywords: ['exam strategies', 'academic English', 'test practice'] },

  // 12 класс
  { grade: 12, quarter: 1, title: 'Advanced Writing', description: 'Academic writing skills', keywords: ['essay types', 'argumentation', 'critical analysis'] },
  { grade: 12, quarter: 2, title: 'Public Speaking', description: 'Presentations and debates', keywords: ['rhetoric', 'persuasion', 'debate techniques'] },
  { grade: 12, quarter: 3, title: 'Research Project', description: 'Independent research', keywords: ['research methodology', 'academic integrity', 'citation'] },
  { grade: 12, quarter: 4, title: 'Preparation for University', description: 'University readiness', keywords: ['academic skills', 'study abroad', 'motivation letter'] }
];

// Данные по географии (7-12 классы)
const geographyTopics = [
  // 7 класс
  { grade: 7, quarter: 1, title: 'Введение в географию', description: 'Источники географической информации', keywords: ['карта', 'глобус', 'масштаб', 'координаты'] },
  { grade: 7, quarter: 2, title: 'Литосфера', description: 'Строение Земли и рельеф', keywords: ['литосфера', 'рельеф', 'горы', 'равнины'] },
  { grade: 7, quarter: 3, title: 'Гидросфера', description: 'Воды Земли', keywords: ['мировой океан', 'реки', 'озёра', 'подземные воды'] },
  { grade: 7, quarter: 4, title: 'Атмосфера', description: 'Воздушная оболочка Земли', keywords: ['атмосфера', 'погода', 'климат', 'ветер'] },

  // 8 класс
  { grade: 8, quarter: 1, title: 'Материки: Африка и Австралия', description: 'Природа и население', keywords: ['Африка', 'Австралия', 'природные зоны', 'население'] },
  { grade: 8, quarter: 2, title: 'Южная Америка', description: 'Природа и страны', keywords: ['Южная Америка', 'Амазонка', 'Анды', 'латиноамериканцы'] },
  { grade: 8, quarter: 3, title: 'Северная Америка', description: 'США и Канада', keywords: ['Северная Америка', 'США', 'Канада', 'природные ресурсы'] },
  { grade: 8, quarter: 4, title: 'Евразия', description: 'Крупнейший материк', keywords: ['Евразия', 'Европа', 'Азия', 'страны'] },

  // 9 класс (География Казахстана)
  { grade: 9, quarter: 1, title: 'Географическое положение РК', description: 'Территория и границы', keywords: ['территория', 'границы', 'регионы', 'административное деление'] },
  { grade: 9, quarter: 2, title: 'Природа Казахстана', description: 'Рельеф, климат, воды', keywords: ['рельеф', 'климат', 'реки Казахстана', 'озёра'] },
  { grade: 9, quarter: 3, title: 'Природные ресурсы', description: 'Полезные ископаемые РК', keywords: ['нефть', 'газ', 'руды', 'минеральные ресурсы'] },
  { grade: 9, quarter: 4, title: 'Население и хозяйство', description: 'Демография и экономика РК', keywords: ['население', 'миграция', 'промышленность', 'сельское хозяйство'] },

  // 10 класс
  { grade: 10, quarter: 1, title: 'Экономическая география', description: 'Мировое хозяйство', keywords: ['мировое хозяйство', 'отрасли', 'международное разделение труда'] },
  { grade: 10, quarter: 2, title: 'Промышленность мира', description: 'Отрасли промышленности', keywords: ['промышленность', 'энергетика', 'металлургия', 'машиностроение'] },
  { grade: 10, quarter: 3, title: 'Сельское хозяйство', description: 'Агропромышленный комплекс', keywords: ['сельское хозяйство', 'растениеводство', 'животноводство'] },
  { grade: 10, quarter: 4, title: 'Транспорт и связь', description: 'Инфраструктура мира', keywords: ['транспорт', 'логистика', 'связь', 'торговля'] },

  // 11 класс
  { grade: 11, quarter: 1, title: 'Регионы мира', description: 'Региональная география', keywords: ['регионы', 'интеграция', 'глобализация'] },
  { grade: 11, quarter: 2, title: 'Развитые страны', description: 'США, Европа, Япония', keywords: ['развитые страны', 'постиндустриальное общество', 'инновации'] },
  { grade: 11, quarter: 3, title: 'Развивающиеся страны', description: 'Азия, Африка, Латинская Америка', keywords: ['развивающиеся страны', 'демографический взрыв', 'урбанизация'] },
  { grade: 11, quarter: 4, title: 'Глобальные проблемы', description: 'Проблемы человечества', keywords: ['глобальные проблемы', 'экология', 'ресурсы', 'бедность'] },

  // 12 класс
  { grade: 12, quarter: 1, title: 'Политическая карта мира', description: 'Страны и территории', keywords: ['государства', 'столицы', 'формы правления', 'геополитика'] },
  { grade: 12, quarter: 2, title: 'Население мира', description: 'Демография и миграция', keywords: ['население', 'демография', 'миграция', 'урбанизация'] },
  { grade: 12, quarter: 3, title: 'Устойчивое развитие', description: 'Концепция устойчивого развития', keywords: ['устойчивое развитие', 'зелёная экономика', 'SDGs'] },
  { grade: 12, quarter: 4, title: 'Казахстан в мире', description: 'Место РК в мировой экономике', keywords: ['Казахстан', 'международные отношения', 'ЕАЭС', 'экспорт'] }
];

// Данные по экономике (10-12 классы)
const economicsTopics = [
  // 10 класс
  { grade: 10, quarter: 1, title: 'Основы экономики', description: 'Экономические системы', keywords: ['экономика', 'ресурсы', 'потребности', 'блага', 'экономические системы'] },
  { grade: 10, quarter: 2, title: 'Рынок и конкуренция', description: 'Рыночная экономика', keywords: ['спрос', 'предложение', 'цена', 'конкуренция', 'рынок'] },
  { grade: 10, quarter: 3, title: 'Предпринимательство', description: 'Формы организации бизнеса', keywords: ['предприниматель', 'бизнес-план', 'ИП', 'ТОО', 'АО'] },
  { grade: 10, quarter: 4, title: 'Деньги и банки', description: 'Финансовая система', keywords: ['деньги', 'банки', 'кредит', 'инфляция'] },

  // 11 класс
  { grade: 11, quarter: 1, title: 'Макроэкономика', description: 'Национальная экономика', keywords: ['ВВП', 'экономический рост', 'безработица', 'циклы'] },
  { grade: 11, quarter: 2, title: 'Государство в экономике', description: 'Роль государства', keywords: ['налоги', 'бюджет', 'государственное регулирование', 'фискальная политика'] },
  { grade: 11, quarter: 3, title: 'Международная экономика', description: 'Мировая экономика', keywords: ['международная торговля', 'валюта', 'глобализация', 'ВТО'] },
  { grade: 11, quarter: 4, title: 'Финансовые рынки', description: 'Инвестиции и биржа', keywords: ['акции', 'облигации', 'биржа', 'инвестиции', 'портфель'] },

  // 12 класс
  { grade: 12, quarter: 1, title: 'Личные финансы', description: 'Финансовая грамотность', keywords: ['бюджет', 'сбережения', 'инвестиции', 'пенсия', 'кредиты'] },
  { grade: 12, quarter: 2, title: 'Экономика Казахстана', description: 'Национальная экономика РК', keywords: ['экономика РК', 'нефтегазовый сектор', 'диверсификация', 'индустриализация'] },
  { grade: 12, quarter: 3, title: 'Предпринимательский проект', description: 'Разработка бизнес-проекта', keywords: ['бизнес-план', 'стартап', 'маркетинг', 'финансовый план'] },
  { grade: 12, quarter: 4, title: 'Современные экономические проблемы', description: 'Вызовы XXI века', keywords: ['неравенство', 'безработица', 'экологизация', 'цифровая экономика'] }
];

// Дополнение для физики (11-12 классы)
const physicsAdditionalTopics = [
  // 11 класс
  { grade: 11, quarter: 1, title: 'Магнитное поле', description: 'Магнитное поле тока, индукция', keywords: ['магнитное поле', 'сила Ампера', 'сила Лоренца', 'магнитная индукция'] },
  { grade: 11, quarter: 2, title: 'Электромагнитная индукция', description: 'Закон электромагнитной индукции', keywords: ['индукция', 'закон Фарадея', 'правило Ленца', 'самоиндукция'] },
  { grade: 11, quarter: 3, title: 'Электромагнитные колебания', description: 'Колебательный контур, переменный ток', keywords: ['колебательный контур', 'переменный ток', 'резонанс', 'трансформатор'] },
  { grade: 11, quarter: 4, title: 'Электромагнитные волны', description: 'Излучение и распространение ЭМВ', keywords: ['электромагнитные волны', 'радиоволны', 'свет', 'интерференция'] },

  // 12 класс
  { grade: 12, quarter: 1, title: 'Геометрическая оптика', description: 'Законы отражения и преломления', keywords: ['отражение', 'преломление', 'линзы', 'оптические приборы'] },
  { grade: 12, quarter: 2, title: 'Волновая оптика', description: 'Интерференция, дифракция', keywords: ['интерференция', 'дифракция', 'дисперсия', 'поляризация'] },
  { grade: 12, quarter: 3, title: 'Квантовая физика', description: 'Фотоэффект, атомная физика', keywords: ['фотоэффект', 'кванты', 'атом Бора', 'спектры'] },
  { grade: 12, quarter: 4, title: 'Ядерная физика', description: 'Строение ядра, радиоактивность', keywords: ['ядро', 'радиоактивность', 'ядерные реакции', 'энергия связи'] }
];

// Дополнение для информатики (11-12 классы)
const informaticsAdditionalTopics = [
  // 11 класс
  { grade: 11, quarter: 1, title: 'Сети и интернет', description: 'Компьютерные сети', keywords: ['IP', 'протоколы', 'топология', 'интернет'] },
  { grade: 11, quarter: 2, title: 'Кибербезопасность', description: 'Защита информации', keywords: ['шифрование', 'хеширование', 'аутентификация', 'вирусы'] },
  { grade: 11, quarter: 3, title: 'Искусственный интеллект', description: 'Основы AI и ML', keywords: ['машинное обучение', 'нейронные сети', 'AI', 'большие данные'] },
  { grade: 11, quarter: 4, title: 'Мобильная разработка', description: 'Создание мобильных приложений', keywords: ['мобильные приложения', 'React Native', 'Flutter', 'UI/UX'] },

  // 12 класс
  { grade: 12, quarter: 1, title: 'Проектирование ПО', description: 'Жизненный цикл разработки', keywords: ['SDLC', 'UML', 'проектирование', 'тестирование'] },
  { grade: 12, quarter: 2, title: 'Облачные технологии', description: 'Cloud computing', keywords: ['облако', 'SaaS', 'API', 'микросервисы'] },
  { grade: 12, quarter: 3, title: 'Итоговый проект', description: 'Разработка полноценного приложения', keywords: ['проект', 'разработка', 'командная работа', 'презентация'] },
  { grade: 12, quarter: 4, title: 'Подготовка к олимпиадам', description: 'Олимпиадное программирование', keywords: ['алгоритмы', 'олимпиады', 'competitive programming', 'задачи'] }
];

// Функция для генерации JSON
function generateCurriculumJSON() {
  const subjects = {
    chemistry: chemistryTopics,
    biology: biologyTopics,
    english: englishTopics,
    geography: geographyTopics,
    economics: economicsTopics,
    physics_additional: physicsAdditionalTopics,
    informatics_additional: informaticsAdditionalTopics
  };

  const output = [];

  Object.entries(subjects).forEach(([subjectKey, topics]) => {
    topics.forEach((topic, index) => {
      const subjectName = subjectKey.replace('_additional', '');
      output.push(createTopic(
        subjectName,
        topic.grade,
        topic.quarter,
        topic.title,
        topic.description,
        topic.keywords,
        topic.order || index + 1
      ));
    });
  });

  return output;
}

// Генерация и сохранение
const newTopics = generateCurriculumJSON();
console.log(`Сгенерировано ${newTopics.length} новых тем`);

// Сохранение в файл
const outputPath = path.join(__dirname, '..', 'data', 'curriculum-extended.json');
fs.writeFileSync(outputPath, JSON.stringify(newTopics, null, 2), 'utf8');
console.log(`Данные сохранены в ${outputPath}`);

// Статистика
const stats = {};
newTopics.forEach(topic => {
  if (!stats[topic.subject]) {
    stats[topic.subject] = { total: 0, grades: {} };
  }
  stats[topic.subject].total++;
  if (!stats[topic.subject].grades[topic.grade]) {
    stats[topic.subject].grades[topic.grade] = 0;
  }
  stats[topic.subject].grades[topic.grade]++;
});

console.log('\n=== Статистика по предметам ===');
Object.entries(stats).forEach(([subject, data]) => {
  console.log(`\n${subject.toUpperCase()}: ${data.total} тем`);
  Object.entries(data.grades).forEach(([grade, count]) => {
    console.log(`  Класс ${grade}: ${count} тем`);
  });
});

module.exports = { generateCurriculumJSON, createTopic };
