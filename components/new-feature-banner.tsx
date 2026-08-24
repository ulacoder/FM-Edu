'use client';

import { Video, FileText, Headphones, Sparkles } from 'lucide-react';

export function NewFeatureBanner() {
  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-teal-950/30 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-purple-600 rounded-xl">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">
              ⚡ НОВИНКА
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Специально для 2G/3G</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            3 формата обучения на выбор
          </h3>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
            Теперь каждый урок доступен в текстовом, аудио и видео форматах. Выбирай удобный способ в зависимости от скорости интернета!
          </p>

          {/* Format Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-100 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-sm text-gray-900 dark:text-white">📚 Текст</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">~15 КБ • Без трафика</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-100 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-1">
                <Headphones className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-sm text-gray-900 dark:text-white">🎧 Аудио</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">~3 МБ • Скоро</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-100 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-1">
                <Video className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-sm text-gray-900 dark:text-white">🎥 Видео</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">~50 МБ • HD</p>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-xs sm:text-sm text-green-800 dark:text-green-300">
              <strong>✓ Доступно прямо сейчас</strong> в математике 7 класс, 1 четверть. Остальные уроки скоро.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
