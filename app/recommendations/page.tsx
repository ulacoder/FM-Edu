'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  BookOpen,
  TrendingUp,
  Target,
  Zap,
  RefreshCw,
  ArrowRight,
  Brain,
  Clock,
  Award,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

interface Recommendation {
  courseId: string;
  title: string;
  priority: number;
  reasoning: string;
  benefits: string;
  impact: string;
  matchScore: number;
}

interface RecommendationsData {
  hasRecommendations: boolean;
  recommendations?: Recommendation[];
  reasoning?: string;
  generatedAt?: string;
  message?: string;
}

export default function RecommendationsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<RecommendationsData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUserId(userData.id);
      loadRecommendations(userData.id);
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/login');
    }
  }, [router]);

  const loadRecommendations = async (uid: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/recommendations?userId=${uid}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load recommendations');
      }

      setData(result);

      // Если рекомендаций нет, генерируем автоматически
      if (!result.hasRecommendations) {
        await generateRecommendations(uid);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      // Показываем заглушку вместо ошибки
      setData({
        hasRecommendations: false,
        message: 'Рекомендации временно недоступны. Настройте Supabase подключение.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendations = async (uid: string) => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/recommendations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uid })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate recommendations');
      }

      setData({
        hasRecommendations: true,
        recommendations: result.recommendations,
        reasoning: result.overallReasoning,
        generatedAt: result.generatedAt
      });

      toast.success('Рекомендации обновлены!');
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Не удалось сгенерировать рекомендации');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (userId) {
      generateRecommendations(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Загружаем рекомендации...</p>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4 max-w-md">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto" />
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold">AI подбирает курсы для тебя</h2>
          <p className="text-muted-foreground">
            Анализируем твой профиль, результаты диагностики и прогресс...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold">Для тебя</h1>
              </div>
              <p className="text-white/90 text-lg">
                {data?.reasoning || 'AI-подобранные курсы специально под твой уровень и цели'}
              </p>
            </div>

            <Button
              onClick={handleRegenerate}
              disabled={isGenerating}
              variant="secondary"
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border-white/40"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {data?.hasRecommendations && data.recommendations && data.recommendations.length > 0 ? (
          <div className="space-y-6">
            {data.recommendations.map((rec, index) => (
              <Card key={rec.courseId} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Priority Badge */}
                    <div className="shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                        index === 1 ? 'bg-gradient-to-br from-purple-400 to-pink-500 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        #{rec.priority}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-xl font-bold">{rec.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          <Target className="w-3 h-3 mr-1" />
                          {rec.matchScore}% совпадение
                        </Badge>
                      </div>

                      {/* Reasoning - ПОЧЕМУ */}
                      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-2">
                          <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                              Почему этот курс для тебя
                            </p>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              {rec.reasoning}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Benefits - ЧТО получишь */}
                      <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-green-900 dark:text-green-100 mb-1">
                              Что ты получишь
                            </p>
                            <p className="text-sm text-green-800 dark:text-green-200">
                              {rec.benefits}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Impact - КАК поможет */}
                      <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-start gap-2">
                          <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                              Как это поможет в будущем
                            </p>
                            <p className="text-sm text-purple-800 dark:text-purple-200">
                              {rec.impact}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="shrink-0">
                    <Link href={`/learn/${rec.courseId}`}>
                      <Button size="lg" className="h-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Начать
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Рекомендации не найдены</h2>
            <p className="text-muted-foreground mb-6">
              Пройди диагностику, чтобы получить персонализированные рекомендации
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/diagnostic">
                <Button size="lg">
                  <Target className="w-4 h-4 mr-2" />
                  Пройти диагностику
                </Button>
              </Link>
              <Button
                onClick={handleRegenerate}
                variant="outline"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Сгенерировать рекомендации
              </Button>
            </div>
          </Card>
        )}

        {/* Generated At Info */}
        {data?.generatedAt && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Обновлено: {new Date(data.generatedAt).toLocaleString('ru-RU')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
