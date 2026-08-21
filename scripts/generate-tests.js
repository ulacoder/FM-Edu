const fs = require('fs');
const path = require('path');

// Pre-generated tests for all subjects
const testQuestions = {
  mathematics: [
    {
      text: "Решите уравнение: 2x + 5 = 13",
      options: ["x = 3", "x = 4", "x = 5", "x = 6"],
      correctAnswer: 1,
      explanation: "2x = 13 - 5 = 8, следовательно x = 4"
    },
    {
      text: "Чему равна сумма углов треугольника?",
      options: ["90°", "180°", "270°", "360°"],
      correctAnswer: 1,
      explanation: "Сумма углов любого треугольника всегда равна 180°"
    },
    {
      text: "Вычислите: 15% от 200",
      options: ["20", "25", "30", "35"],
      correctAnswer: 2,
      explanation: "200 × 0.15 = 30"
    },
    {
      text: "Какое число является простым?",
      options: ["15", "17", "18", "21"],
      correctAnswer: 1,
      explanation: "17 делится только на 1 и на себя"
    },
    {
      text: "Найдите площадь прямоугольника со сторонами 6 см и 8 см",
      options: ["42 см²", "44 см²", "46 см²", "48 см²"],
      correctAnswer: 3,
      explanation: "Площадь = 6 × 8 = 48 см²"
    },
    {
      text: "Чему равен корень из 64?",
      options: ["6", "7", "8", "9"],
      correctAnswer: 2,
      explanation: "√64 = 8, так как 8² = 64"
    },
    {
      text: "Упростите выражение: 3x + 2x",
      options: ["5x", "6x", "5x²", "6x²"],
      correctAnswer: 0,
      explanation: "При сложении подобных членов: 3x + 2x = 5x"
    },
    {
      text: "Найдите значение: 2³",
      options: ["6", "8", "9", "12"],
      correctAnswer: 1,
      explanation: "2³ = 2 × 2 × 2 = 8"
    },
    {
      text: "Какая дробь больше: 3/4 или 2/3?",
      options: ["3/4", "2/3", "Равны", "Нельзя сравнить"],
      correctAnswer: 0,
      explanation: "3/4 = 0.75, а 2/3 ≈ 0.67, поэтому 3/4 > 2/3"
    },
    {
      text: "Решите неравенство: x + 3 > 7",
      options: ["x > 3", "x > 4", "x > 5", "x > 10"],
      correctAnswer: 1,
      explanation: "x > 7 - 3, следовательно x > 4"
    }
  ],
  physics: [
    {
      text: "Формула второго закона Ньютона:",
      options: ["F = m/a", "F = ma", "F = a/m", "F = m + a"],
      correctAnswer: 1,
      explanation: "Второй закон Ньютона: Сила = масса × ускорение"
    },
    {
      text: "Единица измерения силы в СИ:",
      options: ["Джоуль", "Ньютон", "Ватт", "Паскаль"],
      correctAnswer: 1,
      explanation: "Сила измеряется в Ньютонах (Н)"
    },
    {
      text: "Скорость света в вакууме:",
      options: ["3×10⁶ м/с", "3×10⁷ м/с", "3×10⁸ м/с", "3×10⁹ м/с"],
      correctAnswer: 2,
      explanation: "Скорость света c ≈ 3×10⁸ м/с"
    },
    {
      text: "Ускорение свободного падения на Земле:",
      options: ["8.9 м/с²", "9.8 м/с²", "10.8 м/с²", "11.8 м/с²"],
      correctAnswer: 1,
      explanation: "g ≈ 9.8 м/с²"
    },
    {
      text: "Формула кинетической энергии:",
      options: ["E = mgh", "E = mv²/2", "E = mc²", "E = Pt"],
      correctAnswer: 1,
      explanation: "Кинетическая энергия E = mv²/2"
    },
    {
      text: "Что измеряется в Джоулях?",
      options: ["Сила", "Энергия", "Мощность", "Давление"],
      correctAnswer: 1,
      explanation: "Энергия и работа измеряются в Джоулях (Дж)"
    },
    {
      text: "Единица измерения давления:",
      options: ["Ньютон", "Паскаль", "Джоуль", "Ватт"],
      correctAnswer: 1,
      explanation: "Давление измеряется в Паскалях (Па)"
    },
    {
      text: "Что такое инерция?",
      options: ["Изменение скорости", "Сохранение состояния движения", "Сила трения", "Ускорение"],
      correctAnswer: 1,
      explanation: "Инерция - свойство тел сохранять состояние покоя или равномерного движения"
    },
    {
      text: "Формула потенциальной энергии:",
      options: ["E = mv²/2", "E = mgh", "E = mc²", "E = Fs"],
      correctAnswer: 1,
      explanation: "Потенциальная энергия E = mgh"
    },
    {
      text: "Частота измеряется в:",
      options: ["Ваттах", "Герцах", "Джоулях", "Ньютонах"],
      correctAnswer: 1,
      explanation: "Частота измеряется в Герцах (Гц)"
    }
  ],
  english: [
    {
      text: "Choose the correct form: I ___ to school every day",
      options: ["go", "goes", "going", "gone"],
      correctAnswer: 0,
      explanation: "Present Simple: I/you/we/they + verb"
    },
    {
      text: "Past tense of 'eat':",
      options: ["eated", "ate", "eaten", "eat"],
      correctAnswer: 1,
      explanation: "Irregular verb: eat - ate - eaten"
    },
    {
      text: "Complete: She ___ happy",
      options: ["are", "is", "am", "be"],
      correctAnswer: 1,
      explanation: "Third person singular: she/he/it + is"
    },
    {
      text: "What is the plural of 'child'?",
      options: ["childs", "children", "childrens", "childes"],
      correctAnswer: 1,
      explanation: "Irregular plural: child - children"
    },
    {
      text: "Choose the correct question:",
      options: ["Do you like pizza?", "You like pizza?", "Like you pizza?", "Pizza you like?"],
      correctAnswer: 0,
      explanation: "Question form: Do/Does + subject + verb"
    },
    {
      text: "Complete: I ___ watched TV",
      options: ["has", "have", "had", "having"],
      correctAnswer: 1,
      explanation: "Present Perfect: I/you/we/they + have + past participle"
    },
    {
      text: "Choose the correct preposition: ___ Monday",
      options: ["at", "in", "on", "to"],
      correctAnswer: 2,
      explanation: "Days of the week use 'on'"
    },
    {
      text: "Future tense: I ___ go tomorrow",
      options: ["will", "shall", "going to", "would"],
      correctAnswer: 0,
      explanation: "Future Simple: will + infinitive"
    },
    {
      text: "What does 'amazing' mean?",
      options: ["Boring", "Wonderful", "Sad", "Angry"],
      correctAnswer: 1,
      explanation: "Amazing = wonderful, удивительный"
    },
    {
      text: "Complete: They ___ playing football",
      options: ["is", "are", "am", "be"],
      correctAnswer: 1,
      explanation: "Plural subject + are"
    }
  ],
  informatics: [
    {
      text: "Сколько бит в 1 байте?",
      options: ["4", "8", "16", "32"],
      correctAnswer: 1,
      explanation: "1 байт = 8 бит"
    },
    {
      text: "Что означает CPU?",
      options: ["Память", "Процессор", "Жесткий диск", "Видеокарта"],
      correctAnswer: 1,
      explanation: "CPU - Central Processing Unit (центральный процессор)"
    },
    {
      text: "Двоичная система использует цифры:",
      options: ["0-9", "0 и 1", "0-7", "0-15"],
      correctAnswer: 1,
      explanation: "Двоичная система: только 0 и 1"
    },
    {
      text: "Сколько байт в 1 килобайте?",
      options: ["1000", "1024", "512", "2048"],
      correctAnswer: 1,
      explanation: "1 КБ = 1024 байта"
    },
    {
      text: "Что такое алгоритм?",
      options: ["Программа", "Последовательность действий", "Язык программирования", "Данные"],
      correctAnswer: 1,
      explanation: "Алгоритм - четкая последовательность действий"
    },
    {
      text: "IP адрес состоит из:",
      options: ["2 чисел", "3 чисел", "4 чисел", "5 чисел"],
      correctAnswer: 2,
      explanation: "IPv4 адрес: 4 числа (например, 192.168.1.1)"
    },
    {
      text: "HTML расшифровывается как:",
      options: ["High Text Markup Language", "HyperText Markup Language", "Hyper Transfer Language", "None"],
      correctAnswer: 1,
      explanation: "HTML = HyperText Markup Language"
    },
    {
      text: "Что делает цикл в программировании?",
      options: ["Останавливает программу", "Повторяет действия", "Выбирает вариант", "Выводит текст"],
      correctAnswer: 1,
      explanation: "Цикл повторяет блок кода несколько раз"
    },
    {
      text: "RAM это:",
      options: ["Жесткий диск", "Оперативная память", "Процессор", "Монитор"],
      correctAnswer: 1,
      explanation: "RAM - Random Access Memory (оперативная память)"
    },
    {
      text: "Какой язык НЕ является языком программирования?",
      options: ["Python", "HTML", "Java", "C++"],
      correctAnswer: 1,
      explanation: "HTML - язык разметки, не программирования"
    }
  ],
  chemistry: [
    {
      text: "Химическая формула воды:",
      options: ["CO₂", "H₂O", "O₂", "H₂"],
      correctAnswer: 1,
      explanation: "Вода: H₂O (два атома водорода, один кислорода)"
    },
    {
      text: "Элемент с символом O:",
      options: ["Золото", "Кислород", "Серебро", "Водород"],
      correctAnswer: 1,
      explanation: "O - кислород (Oxygen)"
    },
    {
      text: "pH нейтрального раствора:",
      options: ["0", "7", "14", "10"],
      correctAnswer: 1,
      explanation: "pH = 7 означает нейтральную среду"
    },
    {
      text: "Формула углекислого газа:",
      options: ["H₂O", "CO₂", "O₂", "N₂"],
      correctAnswer: 1,
      explanation: "CO₂ - углекислый газ"
    },
    {
      text: "NaCl это:",
      options: ["Сахар", "Поваренная соль", "Вода", "Кислота"],
      correctAnswer: 1,
      explanation: "NaCl - хлорид натрия (поваренная соль)"
    },
    {
      text: "Химический символ золота:",
      options: ["Ag", "Au", "Fe", "Cu"],
      correctAnswer: 1,
      explanation: "Au - золото (Aurum)"
    },
    {
      text: "Атомный номер водорода:",
      options: ["0", "1", "2", "3"],
      correctAnswer: 1,
      explanation: "Водород - первый элемент, номер 1"
    },
    {
      text: "Формула серной кислоты:",
      options: ["HCl", "H₂SO₄", "HNO₃", "H₃PO₄"],
      correctAnswer: 1,
      explanation: "H₂SO₄ - серная кислота"
    },
    {
      text: "Валентность кислорода:",
      options: ["I", "II", "III", "IV"],
      correctAnswer: 1,
      explanation: "Кислород обычно имеет валентность II"
    },
    {
      text: "Что такое катализатор?",
      options: ["Замедляет реакцию", "Ускоряет реакцию", "Останавливает реакцию", "Не влияет"],
      correctAnswer: 1,
      explanation: "Катализатор ускоряет химическую реакцию"
    }
  ],
  biology: [
    {
      text: "Основная единица жизни:",
      options: ["Орган", "Клетка", "Ткань", "Организм"],
      correctAnswer: 1,
      explanation: "Клетка - основная структурная единица всего живого"
    },
    {
      text: "Фотосинтез происходит в:",
      options: ["Митохондриях", "Хлоропластах", "Ядре", "Цитоплазме"],
      correctAnswer: 1,
      explanation: "Хлоропласты - органеллы фотосинтеза"
    },
    {
      text: "Сколько хромосом у человека?",
      options: ["23", "46", "48", "44"],
      correctAnswer: 1,
      explanation: "У человека 46 хромосом (23 пары)"
    },
    {
      text: "Главный орган кровообращения:",
      options: ["Легкие", "Сердце", "Печень", "Мозг"],
      correctAnswer: 1,
      explanation: "Сердце - главный орган кровообращения"
    },
    {
      text: "Переносчик кислорода в крови:",
      options: ["Лейкоциты", "Гемоглобин", "Тромбоциты", "Плазма"],
      correctAnswer: 1,
      explanation: "Гемоглобин в эритроцитах переносит кислород"
    },
    {
      text: "Сколько камер в сердце человека?",
      options: ["2", "4", "3", "5"],
      correctAnswer: 1,
      explanation: "Сердце человека имеет 4 камеры"
    },
    {
      text: "Что производят растения при фотосинтезе?",
      options: ["CO₂", "Кислород", "Азот", "Водород"],
      correctAnswer: 1,
      explanation: "При фотосинтезе выделяется кислород"
    },
    {
      text: "ДНК находится в:",
      options: ["Цитоплазме", "Ядре клетки", "Мембране", "Митохондриях"],
      correctAnswer: 1,
      explanation: "ДНК хранится в ядре клетки"
    },
    {
      text: "Самая большая кость в теле человека:",
      options: ["Плечевая", "Бедренная", "Позвоночник", "Череп"],
      correctAnswer: 1,
      explanation: "Бедренная кость - самая большая"
    },
    {
      text: "Какое царство НЕ относится к живым организмам?",
      options: ["Животные", "Вирусы", "Растения", "Грибы"],
      correctAnswer: 1,
      explanation: "Вирусы - неклеточные формы жизни"
    }
  ],
  economics: [
    {
      text: "Основной закон экономики:",
      options: ["Инфляция", "Спрос и предложение", "Безработица", "Налоги"],
      correctAnswer: 1,
      explanation: "Закон спроса и предложения - основа рыночной экономики"
    },
    {
      text: "Валюта Казахстана:",
      options: ["Рубль", "Тенге", "Доллар", "Евро"],
      correctAnswer: 1,
      explanation: "Национальная валюта РК - тенге"
    },
    {
      text: "Что такое ВВП?",
      options: ["Внешний валовой продукт", "Валовой внутренний продукт", "Валютный продукт", "Нет правильного"],
      correctAnswer: 1,
      explanation: "ВВП - валовой внутренний продукт"
    },
    {
      text: "Инфляция это:",
      options: ["Снижение цен", "Рост цен", "Стабильность цен", "Дефляция"],
      correctAnswer: 1,
      explanation: "Инфляция - рост общего уровня цен"
    },
    {
      text: "Монополия это:",
      options: ["Много продавцов", "Один продавец", "Два продавца", "Нет продавцов"],
      correctAnswer: 1,
      explanation: "Монополия - рынок с одним продавцом"
    },
    {
      text: "Что такое акция?",
      options: ["Валюта", "Ценная бумага", "Товар", "Услуга"],
      correctAnswer: 1,
      explanation: "Акция - ценная бумага, дающая право собственности"
    },
    {
      text: "Центральный банк РК:",
      options: ["Казкоммерцбанк", "Национальный Банк", "Халык Банк", "БТА"],
      correctAnswer: 1,
      explanation: "Национальный Банк РК - центральный банк"
    },
    {
      text: "Дефицит бюджета это:",
      options: ["Доходы > расходов", "Расходы > доходов", "Равенство", "Профицит"],
      correctAnswer: 1,
      explanation: "Дефицит - когда расходы превышают доходы"
    },
    {
      text: "Что изучает микроэкономика?",
      options: ["Государство", "Отдельные фирмы и потребителей", "Мировую экономику", "Все вместе"],
      correctAnswer: 1,
      explanation: "Микроэкономика изучает отдельные экономические единицы"
    },
    {
      text: "Безработица измеряется в:",
      options: ["Рублях", "Процентах", "Штуках", "Днях"],
      correctAnswer: 1,
      explanation: "Уровень безработицы выражается в процентах"
    }
  ],
  geography: [
    {
      text: "Столица Казахстана:",
      options: ["Алматы", "Астана", "Шымкент", "Караганда"],
      correctAnswer: 1,
      explanation: "Астана - столица Республики Казахстан"
    },
    {
      text: "Самый большой океан:",
      options: ["Атлантический", "Тихий", "Индийский", "Северный Ледовитый"],
      correctAnswer: 1,
      explanation: "Тихий океан - крупнейший на Земле"
    },
    {
      text: "Самая высокая гора в мире:",
      options: ["Килиманджаро", "Эверест", "Монблан", "Эльбрус"],
      correctAnswer: 1,
      explanation: "Эверест (Джомолунгма) - 8848 м"
    },
    {
      text: "Сколько материков на Земле?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 1,
      explanation: "6 материков: Евразия, Африка, Америки (2), Австралия, Антарктида"
    },
    {
      text: "Самая длинная река:",
      options: ["Амазонка", "Нил", "Янцзы", "Миссисипи"],
      correctAnswer: 1,
      explanation: "Нил - самая длинная река (~6650 км)"
    },
    {
      text: "Самое большое озеро:",
      options: ["Байкал", "Каспийское море", "Виктория", "Танганьика"],
      correctAnswer: 1,
      explanation: "Каспийское море - крупнейшее озеро"
    },
    {
      text: "Сколько часовых поясов в РК?",
      options: ["1", "2", "3", "4"],
      correctAnswer: 1,
      explanation: "В Казахстане 2 часовых пояса"
    },
    {
      text: "Самый маленький материк:",
      options: ["Европа", "Австралия", "Антарктида", "Африка"],
      correctAnswer: 1,
      explanation: "Австралия - самый маленький материк"
    },
    {
      text: "Крупнейшая пустыня:",
      options: ["Гоби", "Сахара", "Кызылкум", "Атакама"],
      correctAnswer: 1,
      explanation: "Сахара - крупнейшая жаркая пустыня"
    },
    {
      text: "Столица России:",
      options: ["Санкт-Петербург", "Москва", "Новосибирск", "Казань"],
      correctAnswer: 1,
      explanation: "Москва - столица Российской Федерации"
    }
  ]
};

// Create tests for all 360 topics
const topicsPath = path.join(__dirname, '..', 'data', 'topics.json');
const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));

const allTests = {};

topics.forEach(topic => {
  const subjectQuestions = testQuestions[topic.subject] || testQuestions.mathematics;

  // Add unique IDs to questions
  const questions = subjectQuestions.map((q, i) => ({
    id: `${topic.id}_q${i + 1}`,
    ...q
  }));

  allTests[topic.id] = {
    topicId: topic.id,
    subject: topic.subject,
    title: topic.title,
    questions: questions
  };
});

// Save to file
const testsPath = path.join(__dirname, '..', 'data', 'tests.json');
fs.writeFileSync(testsPath, JSON.stringify(allTests, null, 2));

console.log('✅ Created pre-generated tests for', Object.keys(allTests).length, 'topics');
console.log('📁 Saved to data/tests.json');
