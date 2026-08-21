'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Brain,
  GraduationCap,
  Activity,
  Zap,
  Eye,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AIAgentDemoPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role !== 'student') {
        router.push('/dashboard/teacher');
        return;
      }
      setUser(userData);
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  const features = [
    {
      icon: Eye,
      title: 'Постоянное наблюдение',
      description: 'ИИ-агент отслеживает твою активность в реальном времени: какие темы изучаешь, сколько времени проводишь, как часто проходишь тесты.'
    },
    {
      icon: Clock,
      title: 'Обнаружение застревания',
      description: 'Если ты изучаешь одну тему более 15 минут, ИИ первым предлагает помощь. Он понимает, что ты можешь застрять, и сам инициирует объяснение другим способом.'
    },
    {
      icon: AlertCircle,
      title: 'Защита от выгорания',
      description: 'Когда ты занимаешься более 45 минут без перерыва, ИИ автономно предлагает отдохнуть или сыграть в обучающие игры.'
    },
    {
      icon: TrendingUp,
      title: 'Адаптация формата',
      description: 'Если видит, что тесты даются тяжело (3+ попытки), ИИ сам предлагает изменить формат: посмотреть видео, попрактиковаться или получить другое объяснение.'
    },
    {
      icon: Zap,
      title: 'Мониторинг вовлеченности',
      description: 'Отслеживает активность каждые 10 минут. При низкой вовлеченности проактивно мотивирует и предлагает интересные активности.'
    },
    {
      icon: Activity,
      title: 'Умные интервенции',
      description: 'Все предложения от ИИ приходят в нужный момент с конкретными действиями: "Поговорить с Navi", "Сыграть в игры", "Смотреть материалы".'
    }
  ];

  const agentRules = [
    {
      trigger: 'На одной теме > 15 минут',
      action: 'Предлагает помощь и альтернативное объяснение',
      color: 'border-red-500/50 bg-red-500/5'
    },
    {
      trigger: 'Учеба > 45 минут без перерыва',
      action: 'Рекомендует сделать перерыв или поиграть',
      color: 'border-yellow-500/50 bg-yellow-500/5'
    },
    {
      trigger: '3+ попытки теста за 20 минут',
      action: 'Предлагает изменить формат обучения',
      color: 'border-blue-500/50 bg-blue-500/5'
    },
    {
      trigger: 'Низкая активность за 10 минут',
      action: 'Мотивирует и предлагает интересные задачи',
      color: 'border-purple-500/50 bg-purple-500/5'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <Link href="/" className="text-base sm:text-lg font-bold">
                FM Edu
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Link href="/dashboard/student">
                <button className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                  Дашборд
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
              <span className="text-sm font-semibold text-primary">Not Just a Chatbot</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              <Brain className="w-10 h-10 text-primary inline-block mr-2" />
              Agentic AI Tutor
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              ИИ-тьютор с автономным принятием педагогических решений. Не просто отвечает на вопросы — проактивно наблюдает, анализирует и вмешивается когда нужна помощь.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-all">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Agent Rules */}
          <div className="bg-card border border-border/60 rounded-lg p-6 sm:p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              Правила автономных интервенций
            </h2>
            <p className="text-muted-foreground mb-6">
              ИИ-агент автоматически отслеживает эти паттерны поведения и принимает педагогические решения:
            </p>
            <div className="space-y-4">
              {agentRules.map((rule, idx) => (
                <div key={idx} className={`border rounded-lg p-4 ${rule.color}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold mb-1">
                        Триггер: <span className="text-primary">{rule.trigger}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Действие: {rule.action}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6 sm:p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Как это работает</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Непрерывный мониторинг</h3>
                  <p className="text-sm text-muted-foreground">
                    Каждое действие логируется: просмотр тем, прохождение тестов, игры, чат с ИИ. Система создает сессию обучения и отслеживает поведенческие паттерны.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Автономный анализ</h3>
                  <p className="text-sm text-muted-foreground">
                    ИИ-агент каждые 30 секунд анализирует текущую сессию по набору педагогических правил. Определяет нужна ли интервенция.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Проактивная интервенция</h3>
                  <p className="text-sm text-muted-foreground">
                    При обнаружении паттерна (застревание, усталость, низкая вовлеченность) ИИ сам генерирует персонализированное сообщение через Qwen AI и показывает уведомление с конкретными действиями.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Умная адаптация</h3>
                  <p className="text-sm text-muted-foreground">
                    ИИ не спамит — если студент отклонил предложение, следующая интервенция того же типа придет не раньше чем через 15-30 минут. Система учится когда лучше помогать.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-card border border-border/60 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Попробуй прямо сейчас!</h2>
            <p className="text-muted-foreground mb-6">
              Начни изучать любую тему, и ИИ-агент автоматически будет следить за твоим прогрессом и помогать когда нужно.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/courses">
                <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Начать обучение
                </button>
              </Link>
              <Link href="/games">
                <button className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors">
                  Попробовать игры
                </button>
              </Link>
              <Link href="/diagnostic">
                <button className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors">
                  Пройти тест
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2026 FM Edu. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
