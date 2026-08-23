'use client';

import { useState, useEffect } from 'react';
import { Send, X, Check } from 'lucide-react';

export function TelegramBotBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Проверяем, не был ли баннер закрыт ранее
    const dismissed = localStorage.getItem('telegram_banner_dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Показываем баннер через 2 секунды после загрузки
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('telegram_banner_dismissed', 'true');
  };

  const handleConnect = () => {
    const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : 'guest';
    // TODO: Генерировать уникальный токен для каждого пользователя
    const botUrl = `https://t.me/fm_edu_bot?start=${userId}`;
    window.open(botUrl, '_blank');
    handleDismiss();
  };

  if (isDismissed) return null;

  return (
    <div className="w-full px-4 mb-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-200 dark:border-purple-800 rounded-2xl shadow-lg p-6 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-6">
          {/* Telegram Icon */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Send className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
              <span className="text-xs text-white font-bold">✓</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">
                ⚡ Новая фича!
              </span>
            </div>

            <h3 className="text-xl font-bold mb-2 text-foreground">
              Подключи Telegram бота 🚀
            </h3>

            <p className="text-sm text-muted-foreground mb-4">
              Получай мгновенные уведомления о новых возможностях, курсах и изменениях в рейтинге прямо в Telegram!
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-muted-foreground">Уведомления о дедлайнах</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-muted-foreground">Новые возможности</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-muted-foreground">Обновления рейтинга</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleConnect}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Send className="w-4 h-4" />
                Привязать Telegram
              </button>

              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Перейти в дашборд
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
