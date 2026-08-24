import { InlineKeyboard } from 'grammy';
import { config } from './config';

export const keyboards = {
  // Главное меню
  mainMenu: new InlineKeyboard()
    .url('📚 Открыть платформу', config.fmEduUrl)
    .row()
    .text('🔥 Мой страйк', 'streak')
    .text('📅 Дедлайны', 'deadlines')
    .row()
    .text('💪 Мотивашка', 'motivate')
    .text('⚙️ Настройки', 'settings'),

  // Кнопка для открытия платформы
  openPlatform: new InlineKeyboard()
    .url('📚 Открыть FM Edu', config.fmEduUrl),

  // Кнопки для страйка
  streakActions: new InlineKeyboard()
    .url('🔥 Сохранить страйк', config.fmEduUrl)
    .row()
    .text('🏠 Главное меню', 'menu'),

  // Кнопки для дедлайнов
  deadlinesActions: new InlineKeyboard()
    .url('📅 Открыть календарь', `${config.fmEduUrl}/calendar`)
    .row()
    .text('🏠 Главное меню', 'menu'),

  // Кнопки для мотивации
  motivationActions: new InlineKeyboard()
    .url('📚 Го заниматься!', config.fmEduUrl)
    .row()
    .text('💪 Еще мотивашку', 'motivate')
    .text('🏠 Меню', 'menu'),

  // Настройки
  settingsMenu: (remindersEnabled: boolean) => {
    const keyboard = new InlineKeyboard();

    if (remindersEnabled) {
      keyboard.text('⏸ Отключить напоминания', 'reminders_off');
    } else {
      keyboard.text('▶️ Включить напоминания', 'reminders_on');
    }

    return keyboard.row().text('🏠 Главное меню', 'menu');
  },

  // Подтверждение действия
  confirm: (action: string) => new InlineKeyboard()
    .text('✅ Да', `confirm_${action}`)
    .text('❌ Нет', 'menu'),

  // Назад в меню
  backToMenu: new InlineKeyboard()
    .text('🏠 Главное меню', 'menu'),
};
