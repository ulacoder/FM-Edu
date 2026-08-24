import cron from 'node-cron';
import { Bot } from 'grammy';
import { getUsersWithReminders, logNotification, wasNotificationSentRecently, pool } from './database';
import { messages } from './messages';
import { keyboards } from './keyboards';

export function setupCronJobs(bot: Bot) {
  console.log('⏰ Setting up cron jobs...');

  // Утренние напоминания (каждый день в 8:00)
  cron.schedule('0 8 * * *', async () => {
    console.log('📨 Sending morning reminders...');
    await sendMorningReminders(bot);
  }, {
    timezone: 'Asia/Almaty'
  });

  // Вечерние напоминания (каждый день в 19:30)
  cron.schedule('30 19 * * *', async () => {
    console.log('📨 Sending evening reminders...');
    await sendEveningReminders(bot);
  }, {
    timezone: 'Asia/Almaty'
  });

  // Проверка страйков (каждый час)
  cron.schedule('0 * * * *', async () => {
    console.log('🔥 Checking streaks...');
    await checkStreaks(bot);
  }, {
    timezone: 'Asia/Almaty'
  });

  // Проверка дедлайнов (каждые 6 часов)
  cron.schedule('0 */6 * * *', async () => {
    console.log('📅 Checking deadlines...');
    await checkDeadlines(bot);
  }, {
    timezone: 'Asia/Almaty'
  });

  console.log('✅ Cron jobs started');
}

// Утренние напоминания
async function sendMorningReminders(bot: Bot) {
  try {
    const users = await getUsersWithReminders();

    for (const user of users) {
      try {
        // Проверяем, не отправляли ли уже сегодня
        const alreadySent = await wasNotificationSentRecently(
          user.telegram_id,
          'morning_reminder',
          12
        );

        if (alreadySent) continue;

        await bot.api.sendMessage(
          user.telegram_id,
          messages.morningReminder(user),
          { reply_markup: keyboards.openPlatform }
        );

        await logNotification(user.telegram_id, 'morning_reminder');

        // Задержка между сообщениями
        await sleep(1000);
      } catch (error: any) {
        if (error.error_code === 403) {
          // Пользователь заблокировал бота
          console.log(`User ${user.telegram_id} blocked the bot`);
        } else {
          console.error(`Error sending to ${user.telegram_id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error in sendMorningReminders:', error);
  }
}

// Вечерние напоминания
async function sendEveningReminders(bot: Bot) {
  try {
    const users = await getUsersWithReminders();

    for (const user of users) {
      try {
        // Проверяем активность за последние 24 часа
        const hoursInactive = (Date.now() - new Date(user.last_active).getTime()) / (1000 * 60 * 60);

        // Отправляем только если не заходил сегодня (более 12 часов)
        if (hoursInactive < 12) continue;

        // Проверяем, не отправляли ли уже сегодня
        const alreadySent = await wasNotificationSentRecently(
          user.telegram_id,
          'evening_reminder',
          12
        );

        if (alreadySent) continue;

        await bot.api.sendMessage(
          user.telegram_id,
          messages.eveningReminder(user),
          { reply_markup: keyboards.openPlatform }
        );

        await logNotification(user.telegram_id, 'evening_reminder');

        await sleep(1000);
      } catch (error: any) {
        if (error.error_code === 403) {
          console.log(`User ${user.telegram_id} blocked the bot`);
        } else {
          console.error(`Error sending to ${user.telegram_id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error in sendEveningReminders:', error);
  }
}

// Проверка страйков
async function checkStreaks(bot: Bot) {
  try {
    const users = await getUsersWithReminders();

    for (const user of users) {
      try {
        const hoursInactive = (Date.now() - new Date(user.last_active).getTime()) / (1000 * 60 * 60);

        // Предупреждение за 24 часа
        if (hoursInactive >= 24 && hoursInactive < 25 && user.current_streak > 0) {
          const alreadySent = await wasNotificationSentRecently(
            user.telegram_id,
            'streak_warning_24h',
            2
          );

          if (!alreadySent) {
            await bot.api.sendMessage(
              user.telegram_id,
              messages.streakWarning24h(user),
              { reply_markup: keyboards.streakActions }
            );

            await logNotification(user.telegram_id, 'streak_warning_24h');
          }
        }

        // Критическое предупреждение за 6 часов
        if (hoursInactive >= 42 && hoursInactive < 43 && user.current_streak > 0) {
          const alreadySent = await wasNotificationSentRecently(
            user.telegram_id,
            'streak_warning_critical',
            2
          );

          if (!alreadySent) {
            await bot.api.sendMessage(
              user.telegram_id,
              messages.streakWarningCritical(user),
              { reply_markup: keyboards.streakActions }
            );

            await logNotification(user.telegram_id, 'streak_warning_critical');
          }
        }

        // Страйк сгорел (48 часов)
        if (hoursInactive >= 48 && user.current_streak > 0) {
          const oldStreak = user.current_streak;

          // Обнуляем страйк
          const { updateStreak } = await import('./database');
          await updateStreak(user.telegram_id, 0);

          const alreadySent = await wasNotificationSentRecently(
            user.telegram_id,
            'streak_burned',
            24
          );

          if (!alreadySent) {
            await bot.api.sendMessage(
              user.telegram_id,
              messages.streakBurned(oldStreak),
              { reply_markup: keyboards.openPlatform }
            );

            await logNotification(user.telegram_id, 'streak_burned');
          }
        }

        await sleep(500);
      } catch (error: any) {
        if (error.error_code === 403) {
          console.log(`User ${user.telegram_id} blocked the bot`);
        } else {
          console.error(`Error checking streak for ${user.telegram_id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error in checkStreaks:', error);
  }
}

// Проверка дедлайнов
async function checkDeadlines(bot: Bot) {
  try {
    const users = await getUsersWithReminders();

    for (const user of users) {
      try {
        if (!user.fm_edu_user_id) continue;

        // Получаем дедлайны пользователя из календаря
        const deadlines = await getUpcomingDeadlines(user.fm_edu_user_id);

        for (const deadline of deadlines) {
          const daysUntil = Math.ceil(
            (new Date(deadline.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );

          // За 3 дня
          if (daysUntil === 3) {
            const alreadySent = await wasNotificationSentRecently(
              user.telegram_id,
              `deadline_3d_${deadline.id}`,
              24
            );

            if (!alreadySent) {
              await bot.api.sendMessage(
                user.telegram_id,
                messages.deadline3Days(deadline),
                { reply_markup: keyboards.deadlinesActions }
              );

              await logNotification(user.telegram_id, `deadline_3d_${deadline.id}`);
            }
          }

          // За 1 день
          if (daysUntil === 1) {
            const alreadySent = await wasNotificationSentRecently(
              user.telegram_id,
              `deadline_1d_${deadline.id}`,
              24
            );

            if (!alreadySent) {
              await bot.api.sendMessage(
                user.telegram_id,
                messages.deadline1Day(deadline),
                { reply_markup: keyboards.deadlinesActions }
              );

              await logNotification(user.telegram_id, `deadline_1d_${deadline.id}`);
            }
          }

          // Сегодня
          if (daysUntil === 0) {
            const alreadySent = await wasNotificationSentRecently(
              user.telegram_id,
              `deadline_today_${deadline.id}`,
              12
            );

            if (!alreadySent) {
              await bot.api.sendMessage(
                user.telegram_id,
                messages.deadlineToday(deadline),
                { reply_markup: keyboards.deadlinesActions }
              );

              await logNotification(user.telegram_id, `deadline_today_${deadline.id}`);
            }
          }
        }

        await sleep(500);
      } catch (error: any) {
        if (error.error_code === 403) {
          console.log(`User ${user.telegram_id} blocked the bot`);
        } else {
          console.error(`Error checking deadlines for ${user.telegram_id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error in checkDeadlines:', error);
  }
}

// Получить ближайшие дедлайны (моковые данные, замени на реальный API)
async function getUpcomingDeadlines(fmEduUserId: string) {
  // TODO: Интегрировать с FM Edu API или базой данных
  // Сейчас возвращаем моковые данные
  const mockDeadlines = [
    {
      id: '1',
      title: 'СОЧ по математике',
      type: 'exam',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 дня
      subject: 'mathematics',
      completed: false
    },
    {
      id: '2',
      title: 'Олимпиада по физике',
      type: 'olympiad',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 дней
      subject: 'physics',
      completed: false
    }
  ];

  return mockDeadlines.filter(d => !d.completed);
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
