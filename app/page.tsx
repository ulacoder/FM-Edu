'use client';

import Link from "next/link";
import { BookOpen, Target, MessageSquare, GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <Link href="/" className="text-lg font-bold">
                FM Edu
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/diagnostic" className="text-sm font-medium hover:text-primary transition-colors">
                Диагностика
              </Link>
              <Link href="/courses" className="text-sm font-medium hover:text-primary transition-colors">
                Предметы
              </Link>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Дашборд
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/login">
                <button className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                  Войти
                </button>
              </Link>
              <Link href="/register">
                <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors">
                  Начать
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 mb-6">
              <span className="text-sm font-medium text-primary">AI-платформа для школьников</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Персонализированное образование с искусственным интеллектом
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Адаптивная платформа для школьников 7-12 классов. Диагностика уровня знаний,
              индивидуальный план обучения и мгновенная обратная связь от AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link href="/register">
                <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium">
                  Начать обучение
                </button>
              </Link>
              <Link href="/diagnostic">
                <button className="px-6 py-3 border border-border hover:border-primary/40 rounded-lg transition-colors font-medium">
                  Пройти диагностику
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-12 pt-8 border-t border-border/40">
              <div>
                <div className="text-2xl font-semibold">8</div>
                <div className="text-sm text-muted-foreground">Предметов</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">6</div>
                <div className="text-sm text-muted-foreground">Классов (7-12)</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">100%</div>
                <div className="text-sm text-muted-foreground">МОН РК</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Почему FM Edu?
            </h2>
            <p className="text-muted-foreground">
              Современный подход к образованию с использованием AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors">
              <Target className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Адаптивный план обучения</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI анализирует результаты диагностики и создаёт индивидуальную траекторию обучения под ваш уровень
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors">
              <BookOpen className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Программа МОН РК</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Все материалы соответствуют официальной школьной программе Министерства образования Казахстана
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors">
              <MessageSquare className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Мгновенная обратная связь</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Персонализированные объяснения и подсказки к каждому заданию от AI-ассистента
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Доступные предметы</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Математика',
              'Физика',
              'Информатика',
              'Химия',
              'Биология',
              'Экономика',
              'География',
              'Английский'
            ].map((subject) => (
              <div
                key={subject}
                className="bg-card border border-border/60 rounded-lg p-6 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="text-sm font-medium">{subject}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Начните персонализированное обучение прямо сейчас
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Доступно всем школьникам 7-12 классов по всему Казахстану
            </p>
            <Link href="/register">
              <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium">
                Создать аккаунт бесплатно
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">FM Edu</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Персонализированная образовательная платформа для школьников Казахстана
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Платформа</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/diagnostic" className="hover:text-foreground transition-colors">Диагностика</Link></li>
                <li><Link href="/courses" className="hover:text-foreground transition-colors">Предметы</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Дашборд</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">О нас</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">О платформе</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Контакты</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 FM Edu. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
