'use client';

import { useEffect, useState } from 'react';
import { X, Sparkles, Coffee, BookOpen, Zap, Target } from 'lucide-react';
import { AIIntervention } from '@/types';

interface AIAgentInterventionProps {
  studentId: string;
}

export function AIAgentIntervention({ studentId }: AIAgentInterventionProps) {
  const [interventions, setInterventions] = useState<AIIntervention[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!studentId) return;

    // Проверяем интервенции каждые 30 секунд
    const checkInterventions = async () => {
      try {
        const response = await fetch(`/api/agent/activity?studentId=${studentId}`);
        if (response.ok) {
          const data = await response.json();
          const newInterventions = data.interventions.filter(
            (i: AIIntervention) => !dismissedIds.has(i.id)
          );
          setInterventions(newInterventions);
        }
      } catch (error) {
        console.error('Error checking interventions:', error);
      }
    };

    checkInterventions();
    const interval = setInterval(checkInterventions, 30000); // каждые 30 секунд

    return () => clearInterval(interval);
  }, [studentId, dismissedIds]);

  const dismissIntervention = (id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
    setInterventions(prev => prev.filter(i => i.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'help_offer': return <Sparkles className="w-5 h-5" />;
      case 'break_suggestion': return <Coffee className="w-5 h-5" />;
      case 'format_change': return <BookOpen className="w-5 h-5" />;
      case 'motivation': return <Zap className="w-5 h-5" />;
      case 'test_suggestion': return <Target className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getTitle = (type: string) => {
    switch (type) {
      case 'help_offer': return '💡 Нужна помощь?';
      case 'break_suggestion': return '☕ Время перерыва!';
      case 'format_change': return '🔄 Попробуем по-другому?';
      case 'motivation': return '🌟 Продолжай!';
      case 'test_suggestion': return '📝 Проверим знания?';
      default: return '🤖 Navi предлагает';
    }
  };

  if (interventions.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
      {interventions.map((intervention) => (
        <div
          key={intervention.id}
          className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/40 rounded-lg shadow-lg p-4 animate-slide-up backdrop-blur-sm"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
              {getIcon(intervention.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">
                  {getTitle(intervention.type)}
                </h4>
                <button
                  onClick={() => dismissIntervention(intervention.id)}
                  className="p-1 hover:bg-primary/10 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {intervention.message}
              </p>

              <div className="flex gap-2">
                {intervention.type === 'help_offer' && (
                  <a
                    href="/chat"
                    onClick={() => dismissIntervention(intervention.id)}
                    className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Поговорить с Navi
                  </a>
                )}
                {intervention.type === 'break_suggestion' && (
                  <a
                    href="/games"
                    onClick={() => dismissIntervention(intervention.id)}
                    className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Сыграть в игры
                  </a>
                )}
                {intervention.type === 'format_change' && (
                  <a
                    href="/courses"
                    onClick={() => dismissIntervention(intervention.id)}
                    className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Смотреть материалы
                  </a>
                )}
                {intervention.type === 'test_suggestion' && (
                  <a
                    href="/diagnostic"
                    onClick={() => dismissIntervention(intervention.id)}
                    className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Пройти тест
                  </a>
                )}
                <button
                  onClick={() => dismissIntervention(intervention.id)}
                  className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                >
                  Позже
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
