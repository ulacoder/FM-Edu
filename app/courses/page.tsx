'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GraduationCap, BookOpen, Search, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { subjectNames } from '@/types';

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const subjects = Object.entries(subjectNames).map(([key, name]) => ({
    id: key,
    name: name,
    description: getSubjectDescription(name),
    topicsCount: Math.floor(Math.random() * 30) + 20,
  }));

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
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
              {isAuthenticated ? (
                <Link href="/dashboard/student">
                  <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors">
                    Дашборд
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors">
                    Войти
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-8 sm:pt-16 pb-8 sm:pb-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
              Все предметы NIS Programme
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              Выберите предмет для изучения. Адаптивная программа под ваш уровень знаний.
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Поиск предмета..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-card border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <select
                value={selectedGrade || ''}
                onChange={(e) => setSelectedGrade(e.target.value ? parseInt(e.target.value) : null)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-card border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
              >
                <option value="">Все классы</option>
                {[7, 8, 9, 10, 11, 12].map(g => (
                  <option key={g} value={g}>{g} класс</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="flex-1 py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredSubjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/courses/${subject.id}`}
                className="group bg-card border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer min-h-[140px] sm:min-h-[160px]"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold">{subject.name}</h3>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">{subject.description}</p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{subject.topicsCount} тем</span>
                  <span className="mx-1 sm:mx-2">•</span>
                  <span>7-12 класс</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2026 FM Edu. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}

function getSubjectDescription(name: string): string {
  const descriptions: Record<string, string> = {
    'Математика': 'Алгебра, геометрия, тригонометрия и математический анализ',
    'Физика': 'Механика, термодинамика, электричество и оптика',
    'Информатика': 'Программирование, алгоритмы и структуры данных',
    'Химия': 'Органическая и неорганическая химия, химические реакции',
    'Биология': 'Ботаника, зоология, генетика и экология',
    'Экономика': 'Микро- и макроэкономика, финансовая грамотность',
    'География': 'Физическая и экономическая география мира',
    'Английский': 'Грамматика, лексика, говорение и письмо'
  };
  return descriptions[name] || 'Полная программа NIS для 7-12 классов';
}
