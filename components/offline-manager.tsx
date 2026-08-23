'use client';

import { useState, useEffect } from 'react';
import { Download, Wifi, WifiOff, HardDrive, Trash2, CheckCircle } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { offlineStorage } from '@/lib/offlineStorage';
import { cacheUrls, getCacheSize, clearCache } from '@/lib/serviceWorker';

interface OfflineManagerProps {
  userId: string;
}

export function OfflineManager({ userId }: OfflineManagerProps) {
  const { isOnline, connectionType, isSlowConnection } = useNetworkStatus();
  const [cachedSize, setCachedSize] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [cachedLessons, setCachedLessons] = useState<any[]>([]);

  useEffect(() => {
    loadCachedData();
  }, []);

  const loadCachedData = async () => {
    try {
      const lessons = await offlineStorage.getAllLessons();
      setCachedLessons(lessons);

      const size = await getCacheSize();
      setCachedSize(size);
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  const handleDownloadForOffline = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Моковые данные для демонстрации
      const lessonsToCache = [
        {
          id: 'math-1',
          subject: 'mathematics',
          title: 'Квадратные уравнения',
          content: 'Полный урок по квадратным уравнениям...',
          examples: ['Пример 1', 'Пример 2'],
          tests: [
            { question: 'Решите: x² - 5x + 6 = 0', answer: 'x₁=2, x₂=3' }
          ]
        },
        {
          id: 'physics-1',
          subject: 'physics',
          title: 'Законы Ньютона',
          content: 'Три закона Ньютона...',
          examples: ['Пример с шайбой', 'Пример с машиной'],
          tests: [
            { question: 'Чему равна сила при массе 2кг и ускорении 5м/с²?', answer: '10Н' }
          ]
        },
        {
          id: 'informatics-1',
          subject: 'informatics',
          title: 'Алгоритмы сортировки',
          content: 'Сортировка пузырьком и бинарный поиск...',
          examples: ['Код на Python', 'Код на C++'],
          tests: [
            { question: 'Какая сложность у бинарного поиска?', answer: 'O(log n)' }
          ]
        },
      ];

      // Кэшируем уроки по одному
      for (let i = 0; i < lessonsToCache.length; i++) {
        await offlineStorage.saveLesson(lessonsToCache[i]);
        setDownloadProgress(((i + 1) / lessonsToCache.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 500)); // Симуляция загрузки
      }

      // Кэшируем статические ресурсы
      await cacheUrls([
        '/',
        '/courses',
        '/diagnostic',
        '/games',
      ]);

      await loadCachedData();
      alert('✅ Материалы успешно загружены!\n\nТеперь вы можете заниматься без интернета.');
    } catch (error) {
      console.error('Error downloading for offline:', error);
      alert('❌ Ошибка при загрузке материалов');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleClearCache = async () => {
    if (!confirm('Удалить все загруженные материалы?')) return;

    try {
      await offlineStorage.clearAll();
      await clearCache();
      await loadCachedData();
      alert('🗑️ Все загруженные материалы удалены');
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('❌ Ошибка при удалении материалов');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Б';
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-card border border-border/60 rounded-xl sm:rounded-2xl p-4 sm:p-6">
      {/* Заголовок с иконкой состояния сети */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 flex items-center gap-2">
            <HardDrive className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            Режим Офлайн
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Специально для сельских школ с плохим интернетом
          </p>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg self-start sm:self-auto ${
          isOnline ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        }`}>
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">
                {connectionType === '2g' && '2G'}
                {connectionType === '3g' && '3G'}
                {connectionType === '4g' && '4G'}
                {connectionType === 'slow' && 'Медленно'}
              </span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">Офлайн</span>
            </>
          )}
        </div>
      </div>

      {/* Предупреждение о медленном соединении */}
      {isSlowConnection && isOnline && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <p className="text-xs sm:text-sm text-orange-800 dark:text-orange-300">
            <strong>📶 Обнаружено медленное соединение ({connectionType.toUpperCase()})</strong>
            <br />
            Рекомендуем скачать материалы для работы без интернета!
          </p>
        </div>
      )}

      {/* Информация о кэше */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-muted/30 rounded-lg p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Загружено уроков</div>
          <div className="text-xl sm:text-2xl font-bold text-primary">{cachedLessons.length}</div>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Занято места</div>
          <div className="text-xl sm:text-2xl font-bold text-primary">{formatBytes(cachedSize)}</div>
        </div>
      </div>

      {/* Кнопка загрузки */}
      {cachedLessons.length === 0 ? (
        <button
          onClick={handleDownloadForOffline}
          disabled={isDownloading || !isOnline}
          className="w-full px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
        >
          {isDownloading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Загрузка... {Math.round(downloadProgress)}%
            </>
          ) : !isOnline ? (
            <>
              <WifiOff className="w-5 h-5" />
              Нужен интернет для загрузки
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Скачать материалы для офлайна
            </>
          )}
        </button>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-300 mb-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Материалы загружены!</span>
            </div>
            <p className="text-xs sm:text-sm text-green-700 dark:text-green-400">
              Теперь вы можете заниматься без интернета. Все уроки, тесты и материалы доступны офлайн.
            </p>
          </div>

          {/* Список загруженных уроков */}
          <div className="border border-border rounded-lg divide-y divide-border">
            {cachedLessons.slice(0, 5).map((lesson) => (
              <div key={lesson.id} className="p-3 flex items-center justify-between active:bg-muted/30 transition-colors">
                <div>
                  <div className="font-medium text-sm">{lesson.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {lesson.subject === 'mathematics' && '📐 Математика'}
                    {lesson.subject === 'physics' && '⚡ Физика'}
                    {lesson.subject === 'informatics' && '💻 Информатика'}
                  </div>
                </div>
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              </div>
            ))}
          </div>

          <button
            onClick={handleClearCache}
            className="w-full px-4 py-3 border border-border rounded-lg hover:bg-muted active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Удалить загруженные материалы
          </button>
        </div>
      )}

      {/* Информация о функционале */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
          <strong>💡 Как это работает:</strong>
          <br />
          • Материалы сохраняются в памяти вашего устройства
          <br />
          • Работает без интернета или при 2G/3G
          <br />
          • Занимает минимум места (~5-10 МБ)
          <br />
          • Обновляется автоматически при подключении к сети
        </p>
      </div>
    </div>
  );
}
