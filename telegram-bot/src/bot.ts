import { Bot } from 'grammy';
import { config } from './config';
import { initDatabase, getUser, upsertUser, updateActivity, pool } from './database';
import { messages } from './messages';
import { keyboards } from './keyboards';
import { setupCronJobs } from './cron';
import http from 'http';

const bot = new Bot(config.botToken);

// Middleware для логирования
bot.use(async (ctx, next) => {
  console.log(`[${new Date().toISOString()}] ${ctx.from?.id}: ${ctx.message?.text || ctx.callbackQuery?.data || 'unknown'}`);
  await next();
});

// Команда /start
bot.command('start', async (ctx) => {
  try {
    const telegramId = ctx.from!.id.toString();
    const name = ctx.from!.first_name || 'Друг';

    // Создаем/обновляем пользователя
    const user = await upsertUser(telegramId, name);
    await updateActivity(telegramId);

    await ctx.reply(messages.welcome, { reply_markup: keyboards.mainMenu });
  } catch (error) {
    console.error('Error in /start:', error);
    await ctx.reply(messages.error);
  }
});

// Команда /menu
bot.command('menu', async (ctx) => {
  try {
    const telegramId = ctx.from!.id.toString();
    const user = await getUser(telegramId);

    if (!user) {
      await ctx.reply('Сначала нажми /start');
      return;
    }

    await updateActivity(telegramId);
    await ctx.reply(messages.mainMenu(user), { reply_markup: keyboards.mainMenu });
  } catch (error) {
    console.error('Error in /menu:', error);
    await ctx.reply(messages.error);
  }
});

// Команда /streak
bot.command('streak', async (ctx) => {
  try {
    const telegramId = ctx.from!.id.toString();
    const user = await getUser(telegramId);

    if (!user) {
      await ctx.reply('Сначала нажми /start');
      return;
    }

    await updateActivity(telegramId);

    // Получаем самый длинный страйк (пока просто текущий)
    const longestStreak = user.current_streak;

    await ctx.reply(
      messages.streakInfo(user.current_streak, longestStreak),
      { reply_markup: keyboards.streakActions }
    );
  } catch (error) {
    console.error('Error in /streak:', error);
    await ctx.reply(messages.error);
  }
});

// Команда /deadlines
bot.command('deadlines', async (ctx) => {
  try {
    const telegramId = ctx.from!.id.toString();
    const user = await getUser(telegramId);

    if (!user) {
      await ctx.reply('Сначала нажми /start');
      return;
    }

    await updateActivity(telegramId);

    // Мок-данные дедлайнов (TODO: интеграция с FM Edu API)
    const mockDeadlines = [
      {
        id: '1',
        title: 'СОЧ по математике',
        type: 'exam',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        subject: 'mathematics',
        completed: false
      },
      {
        id: '2',
        title: 'Олимпиада по физике',
        type: 'olympiad',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        subject: 'physics',
        completed: false
      },
      {
        id: '3',
        title: 'Проект по информатике',
        type: 'project',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        subject: 'informatics',
        completed: false
      }
    ];

    await ctx.reply(
      messages.deadlinesList(mockDeadlines),
      { reply_markup: keyboards.deadlinesActions }
    );
  } catch (error) {
    console.error('Error in /deadlines:', error);
    await ctx.reply(messages.error);
  }
});

// Команда /motivate
bot.command('motivate', async (ctx) => {
  try {
    const telegramId = ctx.from!.id.toString();
    const user = await getUser(telegramId);

    if (!user) {
      await ctx.reply('Сначала нажми /start');
      return;
    }

    await updateActivity(telegramId);

    // Случайная мотивашка
    const randomMotivation = messages.motivation[
      Math.floor(Math.random() * messages.motivation.length)
    ];

    await ctx.reply(randomMotivation, { reply_markup: keyboards.motivationActions });
  } catch (error) {
    console.error('Error in /motivate:', error);
    await ctx.reply(messages.error);
  }
});

// Команда /settings
bot.command('settings', async (ctx) => {
  try {
    const telegramId = ctx.from!.id.toString();
    const user = await getUser(telegramId);

    if (!user) {
      await ctx.reply('Сначала нажми /start');
      return;
    }

    await updateActivity(telegramId);

    await ctx.reply(
      messages.settings(user),
      { reply_markup: keyboards.settingsMenu(user.reminders_enabled) }
    );
  } catch (error) {
    console.error('Error in /settings:', error);
    await ctx.reply(messages.error);
  }
});

// Обработка callback queries (кнопки)
bot.on('callback_query:data', async (ctx) => {
  try {
    const data = ctx.callbackQuery.data;
    const telegramId = ctx.from!.id.toString();
    const user = await getUser(telegramId);

    if (!user) {
      await ctx.answerCallbackQuery({ text: 'Сначала нажми /start' });
      return;
    }

    await updateActivity(telegramId);

    // Главное меню
    if (data === 'menu') {
      await ctx.editMessageText(messages.mainMenu(user), {
        reply_markup: keyboards.mainMenu
      });
      await ctx.answerCallbackQuery();
      return;
    }

    // Страйк
    if (data === 'streak') {
      const longestStreak = user.current_streak;

      await ctx.editMessageText(
        messages.streakInfo(user.current_streak, longestStreak),
        { reply_markup: keyboards.streakActions }
      );
      await ctx.answerCallbackQuery();
      return;
    }

    // Дедлайны
    if (data === 'deadlines') {
      const mockDeadlines = [
        {
          id: '1',
          title: 'СОЧ по математике',
          type: 'exam',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          subject: 'mathematics',
          completed: false
        },
        {
          id: '2',
          title: 'Олимпиада по физике',
          type: 'olympiad',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          subject: 'physics',
          completed: false
        }
      ];

      await ctx.editMessageText(
        messages.deadlinesList(mockDeadlines),
        { reply_markup: keyboards.deadlinesActions }
      );
      await ctx.answerCallbackQuery();
      return;
    }

    // Мотивация
    if (data === 'motivate') {
      const randomMotivation = messages.motivation[
        Math.floor(Math.random() * messages.motivation.length)
      ];

      await ctx.editMessageText(randomMotivation, {
        reply_markup: keyboards.motivationActions
      });
      await ctx.answerCallbackQuery({ text: '💪 Держи мотивашку!' });
      return;
    }

    // Настройки
    if (data === 'settings') {
      await ctx.editMessageText(messages.settings(user), {
        reply_markup: keyboards.settingsMenu(user.reminders_enabled)
      });
      await ctx.answerCallbackQuery();
      return;
    }

    // Включить напоминания
    if (data === 'reminders_on') {
      const { updateReminders } = await import('./database');
      await updateReminders(telegramId, true);

      await ctx.editMessageText(messages.remindersEnabled, {
        reply_markup: keyboards.backToMenu
      });
      await ctx.answerCallbackQuery({ text: '✅ Напоминания включены!' });
      return;
    }

    // Выключить напоминания
    if (data === 'reminders_off') {
      const { updateReminders } = await import('./database');
      await updateReminders(telegramId, false);

      await ctx.editMessageText(messages.remindersDisabled, {
        reply_markup: keyboards.backToMenu
      });
      await ctx.answerCallbackQuery({ text: '⏸ Напоминания выключены' });
      return;
    }

    // Неизвестная команда
    await ctx.answerCallbackQuery({ text: 'Неизвестная команда' });
  } catch (error: any) {
    console.error('Error in callback query:', error);
    if (error.error_code !== 400) {
      await ctx.answerCallbackQuery({ text: 'Произошла ошибка' });
    }
  }
});

// Обработка обычных сообщений
bot.on('message:text', async (ctx) => {
  try {
    const telegramId = ctx.from!.id.toString();
    const user = await getUser(telegramId);

    if (!user) {
      await ctx.reply('Привет! Нажми /start чтобы начать 👋');
      return;
    }

    await updateActivity(telegramId);

    // Простые ответы на обычные сообщения
    const text = ctx.message.text.toLowerCase();

    if (text.includes('привет') || text.includes('хай') || text.includes('здравствуй')) {
      await ctx.reply(`Привет, ${user.name}! 👋\n\nИспользуй /menu чтобы открыть главное меню`);
    } else if (text.includes('помощь') || text.includes('help')) {
      await ctx.reply(`Вот что я умею:\n\n/menu — главное меню\n/streak — твой страйк\n/deadlines — ближайшие дедлайны\n/motivate — получить мотивашку\n/settings — настройки напоминаний`);
    } else if (text.includes('спасибо') || text.includes('благодар')) {
      await ctx.reply('Всегда рад помочь! 💪');
    } else {
      await ctx.reply('Используй /menu чтобы открыть главное меню 😊');
    }
  } catch (error) {
    console.error('Error in message handler:', error);
  }
});

// Обработка ошибок
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  console.error('Error:', e);
});

// Запуск бота
async function start() {
  try {
    console.log('🚀 Starting FM Edu Telegram Bot...');

    // Инициализация БД
    await initDatabase();

    // Запуск крон-задач
    setupCronJobs(bot);

    // Запуск бота
    await bot.start();

    console.log('✅ Bot is running!');

    // Запуск HTTP сервера для Render (чтобы видел что сервис живой)
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('FM Edu Telegram Bot is running! 🤖');
    });

    const PORT = config.port || 3000;
    server.listen(PORT, () => {
      console.log(`✅ HTTP server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('\n👋 Stopping bot...');
  bot.stop();
  pool.end();
  process.exit(0);
});

process.once('SIGTERM', () => {
  console.log('\n👋 Stopping bot...');
  bot.stop();
  pool.end();
  process.exit(0);
});

start();
