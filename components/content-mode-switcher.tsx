'use client';

import { useState } from 'react';
import { Video, FileText, Headphones } from 'lucide-react';

export type ContentMode = 'video' | 'text' | 'audio';

interface ContentModeSwitcherProps {
  currentMode: ContentMode;
  onModeChange: (mode: ContentMode) => void;
  videoWatched?: boolean;
  audioAvailable?: boolean;
}

export function ContentModeSwitcher({
  currentMode,
  onModeChange,
  videoWatched = false,
  audioAvailable = false,
}: ContentModeSwitcherProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      {/* Text Mode */}
      <button
        onClick={() => onModeChange('text')}
        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
          currentMode === 'text'
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-primary/40 active:scale-[0.98]'
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <FileText className={`w-6 h-6 ${currentMode === 'text' ? 'text-primary' : 'text-muted-foreground'}`} />
          <div>
            <div className={`font-semibold text-sm sm:text-base ${currentMode === 'text' ? 'text-primary' : ''}`}>
              📚 Конспект
            </div>
            <div className="text-xs text-muted-foreground">
              Легкий • Без трафика
            </div>
          </div>
        </div>
      </button>

      {/* Audio Mode */}
      <button
        onClick={() => onModeChange('audio')}
        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
          currentMode === 'audio'
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-primary/40 active:scale-[0.98]'
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Headphones className={`w-6 h-6 ${currentMode === 'audio' ? 'text-primary' : 'text-muted-foreground'}`} />
          <div>
            <div className={`font-semibold text-sm sm:text-base ${currentMode === 'audio' ? 'text-primary' : ''}`}>
              🎧 Аудио
            </div>
            <div className="text-xs text-muted-foreground">
              Сжатый • ~3 МБ
            </div>
          </div>
          {!audioAvailable && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded">
              Скоро
            </span>
          )}
        </div>
      </button>

      {/* Video Mode */}
      <button
        onClick={() => onModeChange('video')}
        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
          currentMode === 'video'
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-primary/40 active:scale-[0.98]'
        }`}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Video className={`w-6 h-6 ${currentMode === 'video' ? 'text-primary' : 'text-muted-foreground'}`} />
          <div>
            <div className={`font-semibold text-sm sm:text-base ${currentMode === 'video' ? 'text-primary' : ''}`}>
              🎥 Видео
            </div>
            <div className="text-xs text-muted-foreground">
              Тяжелый • ~50 МБ
            </div>
          </div>
          {videoWatched && (
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
              Просмотрено
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
