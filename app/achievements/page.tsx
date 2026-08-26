'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Lock, Trophy, Flame, TrendingUp, Users, Brain, Calendar } from 'lucide-react';

interface Achievement {
  type: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  isEarned: boolean;
  earnedAt: string | null;
}

const categoryIcons: Record<string, any> = {
  progress: Trophy,
  streak: Flame,
  performance: TrendingUp,
  habit: Calendar,
  social: Users
};

const categoryNames: Record<string, string> = {
  progress: 'Прогресс',
  streak: 'Серии',
  performance: 'Мастерство',
  habit: 'Привычки',
  social: 'Социальные'
};

export default function AchievementsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [grouped, setGrouped] = useState<Record<string, Achievement[]>>({});
  const [stats, setStats] = useState({ earned: 0, total: 0, percentage: 0 });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      loadAchievements(userData.id);
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/login');
    }
  }, [router]);

  const loadAchievements = async (userId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/achievements?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setAchievements(data.achievements);
        setGrouped(data.grouped);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : grouped[selectedCategory] || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Загрузка достижений...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold">Достижения</h1>
              </div>
              <p className="text-white/90 text-lg">
                Получено {stats.earned} из {stats.total} ({stats.percentage}%)
              </p>
            </div>

            {/* Progress Circle */}
            <div className="relative w-24 h-24">
              <svg className="transform -rotate-90 w-24 h-24">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white/20"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - stats.percentage / 100)}`}
                  className="text-white transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{stats.percentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card hover:bg-muted'
            }`}
          >
            Все ({achievements.length})
          </button>
          {Object.keys(grouped).map(category => {
            const Icon = categoryIcons[category];
            const count = grouped[category]?.length || 0;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                {categoryNames[category]} ({count})
              </button>
            );
          })}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => (
            <Card
              key={achievement.type}
              className={`p-6 transition-all ${
                achievement.isEarned
                  ? 'bg-card hover:shadow-lg border-2 border-primary/40'
                  : 'bg-muted/30 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`text-5xl ${achievement.isEarned ? '' : 'grayscale opacity-40'}`}>
                  {achievement.icon}
                </div>
                {achievement.isEarned ? (
                  <Badge className="bg-green-500 text-white">
                    Получено
                  </Badge>
                ) : (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold mb-2">{achievement.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {achievement.description}
              </p>

              {achievement.isEarned && achievement.earnedAt && (
                <p className="text-xs text-muted-foreground">
                  Получено: {new Date(achievement.earnedAt).toLocaleDateString('ru-RU')}
                </p>
              )}
            </Card>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="text-muted-foreground">
              В этой категории пока нет достижений
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
