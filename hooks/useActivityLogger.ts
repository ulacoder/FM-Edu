import { useEffect, useCallback } from 'react';

interface UseActivityLoggerOptions {
  studentId: string;
  enabled?: boolean;
}

export function useActivityLogger({ studentId, enabled = true }: UseActivityLoggerOptions) {

  const logActivity = useCallback(async (
    type: 'topic_view' | 'chat_message' | 'test_attempt' | 'game_play' | 'material_view',
    data?: {
      topicId?: string;
      subject?: string;
      duration?: number;
      metadata?: Record<string, any>;
    }
  ) => {
    if (!enabled || !studentId) return;

    try {
      await fetch('/api/agent/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          type,
          topicId: data?.topicId,
          subject: data?.subject,
          duration: data?.duration,
          metadata: data?.metadata
        })
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }, [studentId, enabled]);

  // Автоматическое логирование времени на странице
  useEffect(() => {
    if (!enabled || !studentId) return;

    const startTime = Date.now();

    // Логируем просмотр при загрузке страницы
    const pathname = window.location.pathname;
    let activityType: 'topic_view' | 'chat_message' | 'test_attempt' | 'game_play' | 'material_view' = 'material_view';

    if (pathname.includes('/chat')) activityType = 'chat_message';
    else if (pathname.includes('/games')) activityType = 'game_play';
    else if (pathname.includes('/diagnostic')) activityType = 'test_attempt';
    else if (pathname.includes('/learn') || pathname.includes('/topic')) activityType = 'topic_view';

    // Логируем уход со страницы с подсчетом времени
    const handleBeforeUnload = () => {
      const duration = Date.now() - startTime;

      // Используем sendBeacon для надежной отправки при закрытии
      const data = JSON.stringify({
        studentId,
        type: activityType,
        duration,
        metadata: { pathname }
      });

      navigator.sendBeacon('/api/agent/activity', new Blob([data], { type: 'application/json' }));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Также логируем при размонтировании компонента
      const duration = Date.now() - startTime;
      if (duration > 5000) { // только если провел больше 5 секунд
        logActivity(activityType, { duration, metadata: { pathname } });
      }
    };
  }, [studentId, enabled, logActivity]);

  return { logActivity };
}
