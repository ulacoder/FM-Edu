'use client';

import { Download, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface ContentDownloadManagerProps {
  lessonId: string;
  availableFormats: {
    text: boolean;
    audio: boolean;
    video: boolean;
  };
  sizes: {
    textKB: number;
    audioMB: number;
    videoMB: number;
  };
}

export function ContentDownloadManager({
  lessonId,
  availableFormats,
  sizes,
}: ContentDownloadManagerProps) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());

  const handleDownload = async (format: 'text' | 'audio' | 'video') => {
    setDownloading(format);

    // Simulate download
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setDownloaded((prev) => new Set(prev).add(format));
    setDownloading(null);

    // Save to IndexedDB for offline access
    try {
      const cache = await caches.open('lesson-content-v1');
      await cache.add(`/api/lessons/${lessonId}/${format}`);
    } catch (error) {
      console.error('Failed to cache content:', error);
    }
  };

  const formatSize = (size: number, unit: 'KB' | 'MB') => {
    return `~${size} ${unit}`;
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
        <div>
          <h3 className="font-semibold text-base sm:text-lg">Скачать для офлайна</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Для работы без интернета
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Text Download */}
        {availableFormats.text && (
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-green-100 dark:border-green-900">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📚</div>
              <div>
                <div className="font-medium text-sm">Текстовый конспект</div>
                <div className="text-xs text-muted-foreground">
                  {formatSize(sizes.textKB, 'KB')} • Мгновенно
                </div>
              </div>
            </div>

            {downloaded.has('text') ? (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Скачано</span>
              </div>
            ) : (
              <button
                onClick={() => handleDownload('text')}
                disabled={downloading === 'text'}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50 text-xs sm:text-sm"
              >
                {downloading === 'text' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Скачать'
                )}
              </button>
            )}
          </div>
        )}

        {/* Audio Download */}
        {availableFormats.audio && (
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-green-100 dark:border-green-900">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎧</div>
              <div>
                <div className="font-medium text-sm">Аудиолекция</div>
                <div className="text-xs text-muted-foreground">
                  {formatSize(sizes.audioMB, 'MB')} • ~30 сек
                </div>
              </div>
            </div>

            {downloaded.has('audio') ? (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Скачано</span>
              </div>
            ) : (
              <button
                onClick={() => handleDownload('audio')}
                disabled={downloading === 'audio'}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50 text-xs sm:text-sm"
              >
                {downloading === 'audio' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Скачать'
                )}
              </button>
            )}
          </div>
        )}

        {/* Video Download */}
        {availableFormats.video && (
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-green-100 dark:border-green-900">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎥</div>
              <div>
                <div className="font-medium text-sm">Видео HD</div>
                <div className="text-xs text-muted-foreground">
                  {formatSize(sizes.videoMB, 'MB')} • ~2 мин
                </div>
              </div>
            </div>

            {downloaded.has('video') ? (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Скачано</span>
              </div>
            ) : (
              <button
                onClick={() => handleDownload('video')}
                disabled={downloading === 'video'}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50 text-xs sm:text-sm"
              >
                {downloading === 'video' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Скачать'
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {downloaded.size > 0 && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <p className="text-xs sm:text-sm text-green-800 dark:text-green-300">
            <strong>✓ Материалы сохранены</strong><br />
            Теперь доступны без интернета
          </p>
        </div>
      )}
    </div>
  );
}
