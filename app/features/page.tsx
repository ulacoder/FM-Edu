"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Target,
  Brain,
  Zap,
  Award,
  TrendingUp,
  Users,
  Trophy,
  Sparkles,
  Clock,
  BarChart,
  Heart,
} from "lucide-react";

export default function FeaturesPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-heading font-bold">FM Edu</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/courses" className="text-sm font-medium hover:text-primary transition-colors">
                Курсы
              </Link>
              <Link href="/games" className="text-sm font-medium hover:text-primary transition-colors">
                Игры
              </Link>
              <Link href="/leaderboard" className="text-sm font-medium hover:text-primary transition-colors">
                Лидерборд
              </Link>
              <Link href="/features" className="text-sm font-medium text-primary">
                Возможности
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button size="sm" onClick={() => router.push('/courses')}>
                Начать обучение
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="flex-1">
        {/* Hero */}
        <div className="border-b border-border/40 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Возможности платформы
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Современная образовательная платформа с геймификацией, AI-ассистентом и персонализированным обучением
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Core Features */}
          <section className="mb-16">
            <h2 className="text-2xl font-heading font-bold mb-8">Основные возможности</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature 1 */}
              <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors">
                <Brain className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-3">AI-ассистент для обучения</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Персональный AI помощник помогает разобраться в сложных темах, объясняет материал простым языком
                  и отвечает на вопросы по любому предмету. Доступен 24/7 прямо в интерфейсе платформы.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors">
                <Target className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-3">Персонализированное обучение</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Платформа адаптируется под твой уровень знаний и скорость обучения. Алгоритм отслеживает твой
                  прогресс и предлагает материалы, которые подходят именно тебе.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors">
                <Zap className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-3">Геймификация обучения</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Зарабатывай коины за прохождение уроков и выполнение заданий. Играй в образовательные мини-игры,
                  соревнуйся с друзьями и получай достижения за успехи в учёбе.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors">
                <TrendingUp className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-3">Трекинг прогресса</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Детальная статистика твоего обучения: прогресс по каждому предмету, результаты тестов,
                  время занятий. Визуализация прогресса мотивирует достигать новых высот.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors">
                <Trophy className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-3">Лидерборд и соревнования</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Соревнуйся с другими учениками школы в общем рейтинге. Поднимайся в топ по разным предметам
                  и получай звания за свои достижения.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors">
                <Sparkles className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-3">Интерактивные уроки</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Не просто текст и видео — интерактивные задания, тесты с мгновенной проверкой,
                  визуализации и практические упражнения делают обучение увлекательным.
                </p>
              </div>
            </div>
          </section>

          {/* Additional Features */}
          <section className="mb-16">
            <h2 className="text-2xl font-heading font-bold mb-8">Дополнительные возможности</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Small feature 1 */}
              <div className="bg-card border border-border/60 rounded-lg p-6">
                <Clock className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-heading font-semibold mb-2">Гибкий график</h3>
                <p className="text-sm text-muted-foreground">
                  Учись в любое время и в любом месте. Платформа доступна 24/7 с любого устройства
                </p>
              </div>

              {/* Small feature 2 */}
              <div className="bg-card border border-border/60 rounded-lg p-6">
                <BarChart className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-heading font-semibold mb-2">Диагностика знаний</h3>
                <p className="text-sm text-muted-foreground">
                  Проходи диагностические тесты и узнавай свои сильные и слабые стороны по каждому предмету
                </p>
              </div>

              {/* Small feature 3 */}
              <div className="bg-card border border-border/60 rounded-lg p-6">
                <Heart className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-heading font-semibold mb-2">Избранное</h3>
                <p className="text-sm text-muted-foreground">
                  Сохраняй интересные темы и задачи в избранное для быстрого доступа
                </p>
              </div>

              {/* Small feature 4 */}
              <div className="bg-card border border-border/60 rounded-lg p-6">
                <Award className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-heading font-semibold mb-2">Система достижений</h3>
                <p className="text-sm text-muted-foreground">
                  Получай значки и награды за выполнение челленджей и достижение целей
                </p>
              </div>

              {/* Small feature 5 */}
              <div className="bg-card border border-border/60 rounded-lg p-6">
                <Users className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-heading font-semibold mb-2">Командная работа</h3>
                <p className="text-sm text-muted-foreground">
                  Создавай учебные группы с одноклассниками и вместе решайте задачи
                </p>
              </div>

              {/* Small feature 6 */}
              <div className="bg-card border border-border/60 rounded-lg p-6">
                <BookOpen className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-heading font-semibold mb-2">8 предметов</h3>
                <p className="text-sm text-muted-foreground">
                  Математика, физика, химия, биология, английский, информатика, география, экономика
                </p>
              </div>
            </div>
          </section>

          {/* Games Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-heading font-bold mb-8">Образовательные игры</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-2">Быстрый счёт</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Тренируй навыки устного счёта. Решай примеры на время и зарабатывай коины
                    </p>
                    <Button size="sm" variant="outline" onClick={() => router.push('/games')}>
                      Играть
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center shrink-0">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-2">Викторина знаний</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Проверь свои знания в увлекательной викторине по всем предметам
                    </p>
                    <Button size="sm" variant="outline" onClick={() => router.push('/games')}>
                      Играть
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section>
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-heading font-bold mb-3">
                Начни обучение прямо сейчас
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Все возможности платформы доступны бесплатно. Выбери свой класс и предмет,
                и начни изучать материал в удобном темпе
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => router.push('/courses')}
              >
                Перейти к курсам
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold">FM Edu</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 FM Edu. Образовательная платформа для школьников.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
