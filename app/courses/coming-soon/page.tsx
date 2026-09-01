"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Clock,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Target,
  Bell,
  CheckCircle
} from "lucide-react";
import { useState, Suspense } from "react";
import { toast } from "sonner";

// Отключаем prerendering для этой страницы
export const dynamic = 'force-dynamic';

const COURSE_INFO: Record<string, { title: string; icon: string; description: string; eta: string }> = {
  'geography': {
    title: 'География Казахстана и мира',
    icon: '🌍',
    description: 'Изучай природные ресурсы, климатические зоны, экономические связи и геополитику',
    eta: 'Октябрь 2026'
  },
  'economics': {
    title: 'Экономика и Предпринимательство',
    icon: '💰',
    description: 'Микроэкономика, макроэкономика, рыночные механизмы и бизнес-планирование',
    eta: 'Ноябрь 2026'
  },
  'chemistry': {
    title: 'Химия: Основы и Органика',
    icon: '🧪',
    description: 'Атомная структура, химические реакции, органические соединения и электрохимия',
    eta: 'Декабрь 2026'
  },
  'biology': {
    title: 'Биология: Клетка и Генетика',
    icon: '🧬',
    description: 'Клеточное строение, ДНК, законы Менделя и эволюционные процессы',
    eta: 'Декабрь 2026'
  },
  'english': {
    title: 'Английский: Грамматика и IELTS',
    icon: '🇬🇧',
    description: 'Подготовка к IELTS, грамматика, лексика и написание эссе',
    eta: 'Январь 2027'
  },
  'sat-math': {
    title: 'SAT Math',
    icon: '🧮',
    description: 'Полная подготовка к математической секции SAT экзамена',
    eta: 'Февраль 2027'
  },
  'sat-english': {
    title: 'SAT English',
    icon: '📝',
    description: 'Reading, Writing and Language - полная подготовка к SAT',
    eta: 'Февраль 2027'
  }
};

function ComingSoonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course') || 'unknown';
  const [notifyMe, setNotifyMe] = useState(false);

  const courseInfo = COURSE_INFO[courseId] || {
    title: 'Новый курс',
    icon: '📚',
    description: 'Этот курс находится в разработке',
    eta: 'Скоро'
  };

  const handleNotify = () => {
    setNotifyMe(true);
    toast.success('✅ Мы уведомим тебя когда курс будет готов!');

    // Сохраняем в localStorage
    const notifications = JSON.parse(localStorage.getItem('course_notifications') || '[]');
    if (!notifications.includes(courseId)) {
      notifications.push(courseId);
      localStorage.setItem('course_notifications', JSON.stringify(notifications));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/courses')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к курсам
        </Button>

        {/* Main Card */}
        <Card className="p-8 md:p-12 text-center space-y-6">
          {/* Icon */}
          <div className="text-8xl mb-4 animate-bounce">
            {courseInfo.icon}
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            В разработке
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {courseInfo.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {courseInfo.description}
          </p>

          {/* ETA */}
          <div className="flex items-center justify-center gap-2 text-xl font-semibold text-blue-600 dark:text-blue-400">
            <Sparkles className="w-5 h-5" />
            Планируется: {courseInfo.eta}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-muted rounded-lg">
              <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Видео уроки</p>
              <p className="text-xs text-muted-foreground">От лучших преподавателей</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <Target className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Тесты и практика</p>
              <p className="text-xs text-muted-foreground">Проверка знаний</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">AI-помощник</p>
              <p className="text-xs text-muted-foreground">24/7 поддержка</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {notifyMe ? (
              <div className="flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg font-medium">
                <CheckCircle className="w-5 h-5" />
                Мы уведомим тебя!
              </div>
            ) : (
              <Button size="lg" onClick={handleNotify} className="bg-purple-600 hover:bg-purple-700">
                <Bell className="w-5 h-5 mr-2" />
                Уведомить когда выйдет
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/courses')}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Смотреть доступные курсы
            </Button>
          </div>

          {/* Progress Info */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Мы активно работаем над этим курсом!</strong>
              <br />
              Команда FM Edu готовит контент по программе НИШ специально для тебя.
              Подпишись на уведомления и узнай первым о запуске!
            </p>
          </div>
        </Card>

        {/* Alternative Courses */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">А пока можешь изучить:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              onClick={() => router.push('/courses/mathematics')}
            >
              <span className="text-3xl mb-2">📐</span>
              <span className="font-semibold">Математика</span>
              <span className="text-xs text-muted-foreground">180 тем</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              onClick={() => router.push('/courses/physics')}
            >
              <span className="text-3xl mb-2">⚛️</span>
              <span className="font-semibold">Физика</span>
              <span className="text-xs text-muted-foreground">160 тем</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              onClick={() => router.push('/recommendations')}
            >
              <span className="text-3xl mb-2">✨</span>
              <span className="font-semibold">AI рекомендации</span>
              <span className="text-xs text-muted-foreground">Персонально для тебя</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComingSoonPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    }>
      <ComingSoonContent />
    </Suspense>
  );
}
