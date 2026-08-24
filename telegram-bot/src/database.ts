// Временное хранилище в памяти (пока без БД)
// TODO: Позже подключить PostgreSQL

export interface BotUser {
  id: string;
  telegram_id: string;
  name: string;
  class_grade: number;
  total_points: number;
  current_streak: number;
  last_active: Date;
  reminders_enabled: boolean;
  morning_time: string;
  evening_time: string;
  created_at: Date;
  fm_edu_user_id?: string;
}

export interface Deadline {
  id: string;
  student_id: string;
  title: string;
  type: string;
  date: Date;
  subject?: string;
  completed: boolean;
}

interface NotificationLog {
  telegram_id: string;
  type: string;
  sent_at: Date;
}

// In-memory storage
const users = new Map<string, BotUser>();
const notifications = new Map<string, NotificationLog[]>();

// Инициализация (заглушка)
export async function initDatabase() {
  console.log('✅ Database initialized (in-memory mode)');
}

// Получить пользователя
export async function getUser(telegramId: string): Promise<BotUser | null> {
  return users.get(telegramId) || null;
}

// Создать/обновить пользователя
export async function upsertUser(telegramId: string, name: string): Promise<BotUser> {
  const existing = users.get(telegramId);

  if (existing) {
    existing.name = name;
    existing.last_active = new Date();
    return existing;
  }

  const newUser: BotUser = {
    id: Math.random().toString(36).substring(7),
    telegram_id: telegramId,
    name,
    class_grade: 10,
    total_points: 0,
    current_streak: 0,
    last_active: new Date(),
    reminders_enabled: true,
    morning_time: '08:00',
    evening_time: '19:30',
    created_at: new Date(),
  };

  users.set(telegramId, newUser);
  return newUser;
}

// Обновить активность
export async function updateActivity(telegramId: string) {
  const user = users.get(telegramId);
  if (user) {
    user.last_active = new Date();
  }
}

// Получить всех пользователей с включенными напоминаниями
export async function getUsersWithReminders(): Promise<BotUser[]> {
  return Array.from(users.values()).filter(u => u.reminders_enabled);
}

// Логировать отправку уведомления
export async function logNotification(telegramId: string, type: string) {
  const logs = notifications.get(telegramId) || [];
  logs.push({
    telegram_id: telegramId,
    type,
    sent_at: new Date(),
  });
  notifications.set(telegramId, logs);
}

// Проверить, было ли уведомление отправлено недавно
export async function wasNotificationSentRecently(
  telegramId: string,
  type: string,
  hoursAgo: number
): Promise<boolean> {
  const logs = notifications.get(telegramId) || [];
  const threshold = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

  return logs.some(log =>
    log.type === type && log.sent_at > threshold
  );
}

// Обновить страйк
export async function updateStreak(telegramId: string, streak: number) {
  const user = users.get(telegramId);
  if (user) {
    user.current_streak = streak;
  }
}

// Обновить настройки
export async function updateReminders(telegramId: string, enabled: boolean) {
  const user = users.get(telegramId);
  if (user) {
    user.reminders_enabled = enabled;
  }
}

// Mock для совместимости
export const pool = {
  query: async () => ({ rows: [] }),
  end: () => {},
};
