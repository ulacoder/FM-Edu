'use client';

import { useEffect, useState } from 'react';
import { Award, X, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Achievement {
  type: string;
  name: string;
  description: string;
  icon: string;
}

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Анимация появления
    setTimeout(() => setIsVisible(true), 100);

    // Автозакрытие через 5 секунд
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <Card className="w-80 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none shadow-2xl">
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                {achievement.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium opacity-90">Новое достижение!</span>
                </div>
                <h3 className="font-bold text-lg">{achievement.name}</h3>
              </div>
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-white/90 ml-15">{achievement.description}</p>
        </div>
      </Card>
    </div>
  );
}

// Hook для использования в компонентах
export function useAchievementNotifications() {
  const [achievement, setAchievement] = useState<Achievement | null>(null);

  const showAchievement = (ach: Achievement) => {
    setAchievement(ach);
  };

  const hideAchievement = () => {
    setAchievement(null);
  };

  return {
    achievement,
    showAchievement,
    hideAchievement
  };
}
