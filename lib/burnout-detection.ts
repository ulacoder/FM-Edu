// Система отслеживания активности и выгорания

export interface ActivityLog {
  type: 'study' | 'game' | 'test' | 'chat';
  subject?: string;
  score?: number;
  duration?: number;
  timestamp: string;
}

export interface BurnoutDetectionResult {
  isBurnedOut: boolean;
  burnoutLevel: 'none' | 'low' | 'medium' | 'high';
  indicators: {
    activityDrop: boolean;
    lowScores: boolean;
    shortSessions: boolean;
    inactivityDays: number;
  };
  suggestions: string[];
}

export function trackActivity(userId: string, activity: ActivityLog) {
  const key = `activity_${userId}`;
  const activities = JSON.parse(localStorage.getItem(key) || '[]') as ActivityLog[];

  activities.push(activity);

  // Keep only last 100 activities
  const recentActivities = activities.slice(-100);
  localStorage.setItem(key, JSON.stringify(recentActivities));

  return recentActivities;
}

export function detectBurnout(userId: string): BurnoutDetectionResult {
  const key = `activity_${userId}`;
  const activities = JSON.parse(localStorage.getItem(key) || '[]') as ActivityLog[];

  if (activities.length < 5) {
    return {
      isBurnedOut: false,
      burnoutLevel: 'none',
      indicators: {
        activityDrop: false,
        lowScores: false,
        shortSessions: false,
        inactivityDays: 0
      },
      suggestions: []
    };
  }

  const now = new Date();
  const lastWeek = activities.filter(a => {
    const activityDate = new Date(a.timestamp);
    const daysDiff = (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  });

  const lastTwoWeeks = activities.filter(a => {
    const activityDate = new Date(a.timestamp);
    const daysDiff = (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 14 && daysDiff > 7;
  });

  // Индикаторы выгорания
  const activityDrop = lastWeek.length < lastTwoWeeks.length * 0.5; // Снижение активности >50%

  const recentScores = lastWeek
    .filter(a => a.score !== undefined)
    .map(a => a.score!);
  const avgRecentScore = recentScores.length > 0
    ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length
    : 100;
  const lowScores = avgRecentScore < 50;

  const recentDurations = lastWeek
    .filter(a => a.duration !== undefined)
    .map(a => a.duration!);
  const avgDuration = recentDurations.length > 0
    ? recentDurations.reduce((a, b) => a + b, 0) / recentDurations.length
    : 30;
  const shortSessions = avgDuration < 10; // Сессии меньше 10 минут

  const lastActivity = activities[activities.length - 1];
  const lastActivityDate = new Date(lastActivity.timestamp);
  const inactivityDays = Math.floor((now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));

  // Определение уровня выгорания
  let burnoutLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
  const burnoutIndicators = [activityDrop, lowScores, shortSessions, inactivityDays > 3].filter(Boolean).length;

  if (burnoutIndicators >= 3) {
    burnoutLevel = 'high';
  } else if (burnoutIndicators === 2) {
    burnoutLevel = 'medium';
  } else if (burnoutIndicators === 1) {
    burnoutLevel = 'low';
  }

  const isBurnedOut = burnoutLevel !== 'none';

  // Рекомендации
  const suggestions: string[] = [];

  if (activityDrop) {
    suggestions.push('Попробуй игры - это весело и помогает учиться без стресса! 🎮');
  }

  if (lowScores) {
    suggestions.push('Давай отдохнём от сложных тем. Попробуй игры по твоим любимым предметам! 🌟');
  }

  if (shortSessions) {
    suggestions.push('Короткие сессии - это нормально! Главное - регулярность. Может, начнём с игры? 🎯');
  }

  if (inactivityDays > 3) {
    suggestions.push('Я скучал по тебе! Давай начнём с чего-нибудь лёгкого - например, с игры! 💪');
  }

  if (isBurnedOut) {
    suggestions.push('Ты молодец, что продолжаешь учиться! Не забывай отдыхать и играть 🎉');
  }

  return {
    isBurnedOut,
    burnoutLevel,
    indicators: {
      activityDrop,
      lowScores,
      shortSessions,
      inactivityDays
    },
    suggestions
  };
}

export function getBurnoutMessage(burnoutData: BurnoutDetectionResult, userName: string): string {
  if (!burnoutData.isBurnedOut) {
    return `Привет, ${userName}! 👋 Ты отлично справляешься! Продолжай в том же духе! 🌟`;
  }

  const { burnoutLevel, suggestions } = burnoutData;

  let message = `Привет, ${userName}! `;

  switch (burnoutLevel) {
    case 'high':
      message += `😊 Кажется, ты устал... Это нормально! Давай сделаем перерыв?\n\n`;
      message += `💡 Я заметил:\n`;
      if (burnoutData.indicators.activityDrop) {
        message += `• Ты стал реже заходить на платформу\n`;
      }
      if (burnoutData.indicators.lowScores) {
        message += `• Задания даются сложнее обычного\n`;
      }
      if (burnoutData.indicators.inactivityDays > 0) {
        message += `• Последний раз ты был здесь ${burnoutData.indicators.inactivityDays} ${burnoutData.indicators.inactivityDays === 1 ? 'день' : 'дня'} назад\n`;
      }
      message += `\n🎮 Предлагаю отдохнуть с пользой - попробуй наши игры! Это весело и поможет восстановить мотивацию.\n\n`;
      break;

    case 'medium':
      message += `🌈 Я вижу, что тебе сейчас непросто. Но ты справляешься!\n\n`;
      message += `💪 Может, сделаем небольшой перерыв? Игры помогут расслабиться и вернуть интерес к учёбе.\n\n`;
      break;

    case 'low':
      message += `✨ Всё хорошо, но давай добавим немного разнообразия?\n\n`;
      message += `🎯 Попробуй игры - они помогут учиться легко и весело!\n\n`;
      break;
  }

  if (suggestions.length > 0) {
    message += `Мои советы:\n${suggestions.map(s => `• ${s}`).join('\n')}`;
  }

  return message;
}

export function shouldShowBurnoutSupport(userId: string): boolean {
  const lastShownKey = `burnout_support_shown_${userId}`;
  const lastShown = localStorage.getItem(lastShownKey);

  if (!lastShown) {
    return true;
  }

  const lastShownDate = new Date(lastShown);
  const now = new Date();
  const hoursSinceLastShown = (now.getTime() - lastShownDate.getTime()) / (1000 * 60 * 60);

  // Показываем не чаще раза в 12 часов
  return hoursSinceLastShown >= 12;
}

export function markBurnoutSupportShown(userId: string) {
  const key = `burnout_support_shown_${userId}`;
  localStorage.setItem(key, new Date().toISOString());
}
