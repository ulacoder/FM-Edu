'use client';

import { useState } from 'react';
import { Send, Check } from 'lucide-react';

export function TelegramBotBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleConnect = () => {
    const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : 'guest';
    const botUrl = `https://t.me/fm_edu_bot?start=${userId}`;
    window.open(botUrl, '_blank');
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border border-purple-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 relative">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        {/* Telegram Icon */}
        <div className="relative flex-shrink-0 mx-auto sm:mx-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
            <Send className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
            <span className="text-xs text-white font-bold">✓</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">
              ⚡ Новая фича!
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">
            Подключи Telegram бота 🚀
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Получай мгновенные уведомления о новых возможностях, курсах и изменениях в рейтинге прямо в Telegram!
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-muted-foreground">Уведомления о дедлайнах</span>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-muted-foreground">Новые возможности</span>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-5 h-5 bg-purple-100 dark:bg-purple-900 rounded flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-muted-foreground">Обновления рейтинга</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleConnect}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 active:scale-[0.98] transition-all font-medium flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />
              Привязать Telegram
            </button>

            <button
              onClick={handleDismiss}
              className="w-full sm:w-auto px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Больше не показывать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
