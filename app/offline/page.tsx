'use client';

import { useEffect } from 'react';

export default function OfflinePage() {
  useEffect(() => {
    // Проверяем, вернулось ли соединение
    const checkConnection = () => {
      if (navigator.onLine) {
        window.location.href = '/';
      }
    };

    window.addEventListener('online', checkConnection);
    return () => window.removeEventListener('online', checkConnection);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">Нет подключения к интернету</h1>
        <p className="text-muted-foreground mb-6">
          Проверьте подключение к сети и попробуйте еще раз
        </p>

        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="font-semibold mb-3">💡 Вы знали?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            FM Edu поддерживает офлайн-режим! Скачайте материалы заранее, чтобы учиться без интернета.
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>✓ Работает без интернета</div>
            <div>✓ Специально для сельских школ</div>
            <div>✓ Занимает минимум места</div>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
