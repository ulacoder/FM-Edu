# FM Edu Telegram Bot

Telegram-бот для платформы FM Edu с мотивацией, напоминаниями и трекингом дедлайнов.

## Возможности

🔥 **Мотивация и поддержка**
- Утренние и вечерние напоминания о занятиях
- Мотивационные сообщения
- Поддержка страйков (ежедневная активность)

📅 **Дедлайны**
- Автоматические напоминания за 3 дня, 1 день и в день дедлайна
- Интеграция с календарем FM Edu
- Уведомления о СОЧ/СОР и других важных датах

⚡ **Умные уведомления**
- Проверка активности каждый час
- Предупреждения о сгорающем страйке (24ч, 6ч)
- Персонализированные сообщения

## Установка

### 1. Установить зависимости

```bash
cd telegram-bot
npm install
```

### 2. Создать `.env` файл

Скопируй `.env.example` в `.env` и заполни:

```bash
cp .env.example .env
```

Файл `.env`:
```
BOT_TOKEN=твой_токен_от_BotFather
FM_EDU_URL=https://fm-edu.vercel.app
DATABASE_URL=твой_postgresql_url
PORT=3000
```

### 3. Получить токен бота

1. Открой [@BotFather](https://t.me/BotFather) в Telegram
2. Отправь `/newbot`
3. Придумай имя: `FM Edu Bot`
4. Придумай username: `fm_edu_bot` (должен заканчиваться на `_bot`)
5. Скопируй токен в `.env`

### 4. Настроить базу данных

Бот автоматически создаст нужные таблицы при первом запуске.

Используется PostgreSQL (Neon).

## Запуск

### Development (с авто-перезагрузкой)

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## Команды бота

- `/start` — Начать работу с ботом
- `/menu` — Главное меню
- `/streak` — Посмотреть свой страйк
- `/deadlines` — Ближайшие дедлайны
- `/motivate` — Получить мотивашку
- `/settings` — Настройки напоминаний

## Автоматические уведомления

### Утренние напоминания (8:00)
Каждое утро бот присылает мотивационное сообщение и план на день.

### Вечерние напоминания (19:30)
Если пользователь не заходил на платформу больше 12 часов, бот напоминает.

### Проверка страйков (каждый час)
- За 24 часа — мягкое напоминание
- За 6 часов — критическое предупреждение
- Через 48 часов — страйк сгорает

### Проверка дедлайнов (каждые 6 часов)
- За 3 дня до дедлайна
- За 1 день до дедлайна
- В день дедлайна

## Структура проекта

```
telegram-bot/
├── src/
│   ├── bot.ts          # Главный файл бота
│   ├── config.ts       # Конфигурация
│   ├── database.ts     # База данных
│   ├── messages.ts     # Тексты сообщений
│   ├── keyboards.ts    # Клавиатуры
│   └── cron.ts         # Крон-задачи
├── package.json
├── tsconfig.json
└── .env
```

## База данных

### Таблица `bot_users`

```sql
- id (UUID)
- telegram_id (TEXT, уникальный)
- fm_edu_user_id (TEXT, связь с FM Edu)
- name (TEXT)
- class_grade (INTEGER)
- total_points (INTEGER)
- current_streak (INTEGER)
- last_active (TIMESTAMP)
- reminders_enabled (BOOLEAN)
- morning_time (TEXT, default: '08:00')
- evening_time (TEXT, default: '19:30')
- created_at (TIMESTAMP)
```

### Таблица `notification_logs`

```sql
- id (UUID)
- telegram_id (TEXT)
- type (TEXT)
- sent_at (TIMESTAMP)
```

## Интеграция с FM Edu

Бот интегрируется с платформой FM Edu через:

1. **Deep linking**: `fm-edu.vercel.app` → бот
2. **API** (TODO): получение данных о страйках, баллах, дедлайнах
3. **Webhook** (TODO): обновление активности пользователя

### TODO: Интеграция

1. Создать API endpoint в FM Edu для получения данных пользователя
2. Создать webhook для обновления `last_active` при заходе на платформу
3. Интегрировать календарь дедлайнов
4. Синхронизировать страйки и баллы

## Деплой

### Vercel / Railway / Render

1. Создай новый проект
2. Подключи репозиторий
3. Укажи команду сборки: `cd telegram-bot && npm run build`
4. Укажи команду запуска: `cd telegram-bot && npm start`
5. Добавь переменные окружения (`.env`)

### Heroku

```bash
heroku create fm-edu-bot
heroku config:set BOT_TOKEN=...
heroku config:set DATABASE_URL=...
git push heroku main
```

## Мониторинг

Логи бота показывают:
- Время отправки каждого уведомления
- Ошибки (если пользователь заблокировал бота)
- Активность пользователей

```
[2026-08-23T23:00:00.000Z] 123456789: /start
📨 Sending morning reminders...
⏰ Checking streaks...
📅 Checking deadlines...
```

## Troubleshooting

### Бот не отвечает

1. Проверь токен в `.env`
2. Убедись, что бот запущен: `npm run dev`
3. Проверь логи на ошибки

### Уведомления не приходят

1. Проверь настройки: `/settings`
2. Убедись, что `reminders_enabled = true`
3. Проверь timezone в `cron.ts` (Asia/Almaty)

### База данных не подключается

1. Проверь `DATABASE_URL` в `.env`
2. Убедись, что PostgreSQL доступен
3. Проверь SSL настройки в `database.ts`

## Лицензия

MIT

---

**Создано для FM Edu** 🔥
Помогаем школьникам не забрасывать учебу!
