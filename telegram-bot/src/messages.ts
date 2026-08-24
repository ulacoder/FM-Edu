export const messages = {
  // Приветствие
  welcome: `👋 Йоу! Я FM — твой учебный бадди

Буду помогать тебе:
✅ Не забывать про учебу
✅ Напоминать про дедлайны
✅ Мотивировать сохранять страйк
✅ Подбадривать, когда тяжко

Команды:
/start — главное меню
/streak — твой страйк
/deadlines — ближайшие дедлайны
/motivate — получить мотивашку
/settings — настройки напоминаний

Го начнем! 🔥`,

  // Главное меню
  mainMenu: (user: any) => `Привет, ${user.name}! 👋

Твой статус:
🔥 Страйк: ${user.current_streak} дней
⚡ Баллы: ${user.total_points}

Что делаем?`,

  // Страйк
  streakInfo: (streak: number, longestStreak: number) => {
    if (streak === 0) {
      return `Твой страйк пока 0 дней 😔

Но это не проблема! Начни заниматься сегодня и запусти новый страйк 🔥

Зайди на платформу прямо сейчас:
${process.env.FM_EDU_URL}`;
    }

    let emoji = '🔥';
    let message = '';

    if (streak >= 30) {
      emoji = '🏆';
      message = 'ЛЕГЕНДА! 30+ дней подряд!';
    } else if (streak >= 14) {
      emoji = '💪';
      message = 'Красава! 2 недели подряд!';
    } else if (streak >= 7) {
      emoji = '⚡';
      message = 'Неделя подряд! Так держать!';
    } else if (streak >= 3) {
      emoji = '🔥';
      message = 'Отличное начало!';
    }

    return `${emoji} Твой страйк: ${streak} ${streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'}

${message}

Рекорд: ${longestStreak} ${longestStreak === 1 ? 'день' : longestStreak < 5 ? 'дня' : 'дней'}

Продолжай в том же духе! 💪`;
  },

  // Мотивационные сообщения
  motivation: [
    `💪 Каждый день учебы — это шаг к твоей цели!

Не сдавайся, даже если сложно. Все великие результаты начинаются с маленьких шагов.

Давай, ты справишься! 🔥`,

    `🎯 Помни: ты учишься не для школы, а для себя!

Каждая новая тема, которую ты освоишь — это инвестиция в твое будущее.

Верю в тебя! 💪`,

    `⚡ Сложно? Это нормально!

Мозг растет именно тогда, когда тебе трудно. Ты не слабый — ты тренируешься!

Продолжай, красавчик! 🔥`,

    `🚀 Знаешь, что круче всего?

Ты уже здесь. Ты уже занимаешься. Ты уже на пути к успеху!

Просто не останавливайся 💪`,

    `🌟 Маленькая тайна успеха:

Не обязательно быть лучшим. Главное — каждый день становиться чуть лучше, чем вчера.

Ты молодец! Так держать! 🔥`,

    `💡 Когда кажется, что не получается...

Вспомни: ты уже прошел столько сложных тем! Это просто еще одна ступенька.

Верю в тебя! ⚡`,

    `🎓 Ты знаешь, почему я в тебя верю?

Потому что ты не сдался. Ты здесь. Ты продолжаешь.

Это уже круто! Давай дальше! 💪`,

    `🔥 Хочешь секрет?

Разница между "хорошим" и "отличным" учеником — это всего 15 минут в день.

Ты можешь! Го заниматься! ⚡`
  ],

  // Напоминание о заходе (утро)
  morningReminder: (user: any) => `Доброе утро, ${user.name}! ☀️

Новый день — новые возможности!

Твой страйк: ${user.current_streak} ${user.current_streak === 1 ? 'день' : user.current_streak < 5 ? 'дня' : 'дней'} 🔥

План на сегодня:
📚 Пройти хотя бы 1 урок (10-15 мин)
⚡ Решить пару задач
🎮 Можешь поиграть в мини-игру

Начнем?
${process.env.FM_EDU_URL}`,

  // Напоминание о заходе (вечер)
  eveningReminder: (user: any) => `Привет, ${user.name}! 🌙

Как дела? Сегодня еще не заходил на платформу 👀

Твой страйк ${user.current_streak} ${user.current_streak === 1 ? 'день' : user.current_streak < 5 ? 'дня' : 'дней'} может сгореть! 🔥

Всего 5-10 минут — и страйк сохранен:
• Пройди 1 урок
• Реши пару задач
• Поиграй в игру

Го не теряй прогресс!
${process.env.FM_EDU_URL}`,

  // Страйк под угрозой (24 часа)
  streakWarning24h: (user: any) => `⚠️ Йоу, ${user.name}!

Твой страйк ${user.current_streak} ${user.current_streak === 1 ? 'день' : user.current_streak < 5 ? 'дня' : 'дней'} сгорит через 24 часа! 🔥

Ты так долго сохранял его, не дай ему пропасть!

Зайди на платформу прямо сейчас:
${process.env.FM_EDU_URL}

Даже 5 минут — это уже победа! 💪`,

  // Страйк под угрозой (6 часов)
  streakWarningCritical: (user: any) => `🚨 АЛЯРМ! ${user.name}!

Твой страйк ${user.current_streak} ${user.current_streak === 1 ? 'день' : user.current_streak < 5 ? 'дня' : 'дней'} сгорит через 6 часов! 🔥🔥🔥

Не дай ему пропасть! Ты так старался!

СПАСИ СТРАЙК ПРЯМО СЕЙЧАС:
${process.env.FM_EDU_URL}

Я в тебя верю! ⚡`,

  // Страйк сгорел
  streakBurned: (oldStreak: number) => `😔 Эх, страйк ${oldStreak} ${oldStreak === 1 ? 'день' : oldStreak < 5 ? 'дня' : 'дней'} сгорел...

Но знаешь что? Это не конец!

Твои знания никуда не делись. Прогресс остался. Просто начнем новый страйк 🔥

Давай стартанем заново! Я знаю, ты можешь! 💪

${process.env.FM_EDU_URL}`,

  // Дедлайн близко (3 дня)
  deadline3Days: (deadline: any) => `📅 Напоминалка!

${deadline.title} через 3 дня!
📆 ${new Date(deadline.date).toLocaleDateString('ru-RU')}

Еще есть время хорошо подготовиться! 💪

Го закроем тему:
${process.env.FM_EDU_URL}/calendar`,

  // Дедлайн близко (1 день)
  deadline1Day: (deadline: any) => `⏰ Внимание!

${deadline.title} завтра!
📆 ${new Date(deadline.date).toLocaleDateString('ru-RU')}

Последний шанс подготовиться! Давай повторим материал! 🔥

${process.env.FM_EDU_URL}/calendar`,

  // Дедлайн сегодня
  deadlineToday: (deadline: any) => `🚨 ${deadline.title} СЕГОДНЯ!

Последний рывок! Ты готов! 💪

Повтори главное перед экзаменом:
${process.env.FM_EDU_URL}/calendar

Удачи! Ты справишься! 🔥`,

  // Список дедлайнов
  deadlinesList: (deadlines: any[]) => {
    if (deadlines.length === 0) {
      return `📅 Дедлайнов пока нет

Добавь важные даты в календарь:
${process.env.FM_EDU_URL}/calendar`;
    }

    let message = '📅 Твои ближайшие дедлайны:\n\n';

    deadlines.forEach((d, i) => {
      const daysLeft = Math.ceil(
        (new Date(d.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      let emoji = '📌';
      if (daysLeft <= 1) emoji = '🔴';
      else if (daysLeft <= 3) emoji = '🟡';
      else if (daysLeft <= 7) emoji = '🟢';

      message += `${emoji} ${d.title}\n`;
      message += `   📆 ${new Date(d.date).toLocaleDateString('ru-RU')}`;

      if (daysLeft === 0) {
        message += ' (СЕГОДНЯ!)\n';
      } else if (daysLeft === 1) {
        message += ' (завтра)\n';
      } else {
        message += ` (через ${daysLeft} ${daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'})\n`;
      }

      if (i < deadlines.length - 1) message += '\n';
    });

    message += `\n\nСмотреть все:\n${process.env.FM_EDU_URL}/calendar`;

    return message;
  },

  // Настройки
  settings: (user: any) => `⚙️ Настройки напоминаний

Статус: ${user.reminders_enabled ? '✅ Включены' : '❌ Выключены'}

⏰ Утренние: ${user.morning_time}
🌙 Вечерние: ${user.evening_time}

Используй кнопки ниже для управления:`,

  settingsUpdated: '✅ Настройки обновлены!',

  remindersEnabled: '✅ Напоминания включены!\n\nБуду мотивировать тебя каждый день! 💪',

  remindersDisabled: '⏸ Напоминания отключены\n\nМожешь включить их снова в /settings',

  // Поздравления
  achievement: (type: string) => {
    const achievements: any = {
      'streak_7': '🎉 АЧИВКА: Неделя подряд!\n\nТы занимался 7 дней подряд! Так держать! 🔥',
      'streak_14': '🏆 АЧИВКА: Две недели!\n\n14 дней подряд — это серьезно! Красава! 💪',
      'streak_30': '👑 АЧИВКА: ЛЕГЕНДА!\n\n30 дней подряд! Ты просто машина! 🔥🔥🔥',
      'points_1000': '⚡ АЧИВКА: 1000 баллов!\n\nТы набрал первую тысячу! Продолжай! 💪',
      'points_5000': '💎 АЧИВКА: 5000 баллов!\n\nПять тысяч! Ты в топе! 🔥',
    };

    return achievements[type] || '🎉 Новая ачивка разблокирована!';
  },

  // Ошибка
  error: 'Упс, что-то пошло не так 😅\n\nПопробуй еще раз или напиши /start'
};
