'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GraduationCap, BookOpen, Search, Filter, ChevronRight } from 'lucide-react';
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
    icon: getSubjectIcon(name),
    color: getSubjectColor(name),
    topicsCount: Math.floor(Math.random() * 30) + 20,
  }));

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 ml-16">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <Link href="/" className="text-lg font-bold text-gray-900">
                FM Edu
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {isAuthenticated ? (
                <Link href="/dashboard/student">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                    Дашборд
                  </button>
                </Link>
              ) : (
                <Link href="/login">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                    Войти
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Все предметы NIS Programme
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            Выберите предмет для изучения. Адаптивная программа под ваш уровень знаний.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск предмета..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
            <select
              value={selectedGrade || ''}
              onChange={(e) => setSelectedGrade(e.target.value ? parseInt(e.target.value) : null)}
              className="px-6 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none cursor-pointer"
            >
              <option value="">Все классы</option>
              {[7, 8, 9, 10, 11, 12].map(g => (
                <option key={g} value={g}>{g} класс</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="flex-1 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/courses/${subject.id}`}
                className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 ${subject.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {subject.icon}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{subject.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{subject.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{subject.topicsCount} тем</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>7-12 класс</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
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

function getSubjectIcon(name: string): string {
  const icons: Record<string, string> = {
    'Математика': '📐',
    'Физика': '⚛️',
    'Информатика': '💻',
    'Химия': '🧪',
    'Биология': '🧬',
    'Экономика': '📊',
    'География': '🌍',
    'Английский': '🇬🇧'
  };
  return icons[name] || '📚';
}

function getSubjectColor(name: string): string {
  const colors: Record<string, string> = {
    'Математика': 'bg-blue-100',
    'Физика': 'bg-purple-100',
    'Информатика': 'bg-green-100',
    'Химия': 'bg-orange-100',
    'Биология': 'bg-teal-100',
    'Экономика': 'bg-yellow-100',
    'География': 'bg-cyan-100',
    'Английский': 'bg-pink-100'
  };
  return colors[name] || 'bg-gray-100';
}
