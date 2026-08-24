'use client';

import { useState } from 'react';
import { Book, Plus, Search, Filter, Video, FileText, Headphones } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  icon: string;
  grade: number;
  topics: number;
  lessons: number;
  videoCount: number;
  audioCount: number;
  testCount: number;
  color: string;
  description: string;
}

export default function SubjectsPage() {
  const [search, setSearch] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');

  const subjects: Subject[] = [
    {
      id: '1',
      name: 'Математика',
      icon: '📐',
      grade: 10,
      topics: 24,
      lessons: 156,
      videoCount: 89,
      audioCount: 156,
      testCount: 67,
      color: 'purple',
      description: 'Алгебра, геометрия, тригонометрия, начала анализа'
    },
    {
      id: '2',
      name: 'Физика',
      icon: '⚡',
      grade: 10,
      topics: 18,
      lessons: 124,
      videoCount: 72,
      audioCount: 124,
      testCount: 54,
      color: 'blue',
      description: 'Механика, термодинамика, электричество, оптика'
    },
    {
      id: '3',
      name: 'Информатика',
      icon: '💻',
      grade: 10,
      topics: 16,
      lessons: 98,
      videoCount: 56,
      audioCount: 98,
      testCount: 42,
      color: 'green',
      description: 'Программирование, алгоритмы, базы данных, сети'
    },
    {
      id: '4',
      name: 'Химия',
      icon: '🧪',
      grade: 10,
      topics: 20,
      lessons: 112,
      videoCount: 64,
      audioCount: 112,
      testCount: 48,
      color: 'pink',
      description: 'Органическая, неорганическая, физическая химия'
    },
    {
      id: '5',
      name: 'Биология',
      icon: '🧬',
      grade: 10,
      topics: 22,
      lessons: 128,
      videoCount: 78,
      audioCount: 128,
      testCount: 56,
      color: 'amber',
      description: 'Ботаника, зоология, анатомия, генетика, экология'
    },
    {
      id: '6',
      name: 'Математика',
      icon: '📐',
      grade: 11,
      topics: 26,
      lessons: 178,
      videoCount: 102,
      audioCount: 178,
      testCount: 76,
      color: 'purple',
      description: 'Производные, интегралы, комбинаторика, стереометрия'
    },
    {
      id: '7',
      name: 'Физика',
      icon: '⚡',
      grade: 11,
      topics: 20,
      lessons: 142,
      videoCount: 84,
      audioCount: 142,
      testCount: 62,
      color: 'blue',
      description: 'Электромагнетизм, колебания, волны, квантовая физика'
    },
    {
      id: '8',
      name: 'Информатика',
      icon: '💻',
      grade: 11,
      topics: 18,
      lessons: 114,
      videoCount: 68,
      audioCount: 114,
      testCount: 52,
      color: 'green',
      description: 'ООП, структуры данных, веб-разработка, машинное обучение'
    }
  ];

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(search.toLowerCase()) ||
                         subject.description.toLowerCase().includes(search.toLowerCase());
    const matchesGrade = filterGrade === 'all' || subject.grade.toString() === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const colorClasses = {
    purple: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    blue: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    green: 'bg-green-50 border-green-200 hover:border-green-400',
    pink: 'bg-pink-50 border-pink-200 hover:border-pink-400',
    amber: 'bg-amber-50 border-amber-200 hover:border-amber-400'
  };

  const badgeColors = {
    purple: 'bg-purple-100 text-purple-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    pink: 'bg-pink-100 text-pink-700',
    amber: 'bg-amber-100 text-amber-700'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Предметы</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Управление учебными предметами и темами</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Добавить предмет
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию или описанию..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Все классы</option>
            {[7, 8, 9, 10, 11, 12].map(grade => (
              <option key={grade} value={grade}>{grade} класс</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Всего предметов</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{subjects.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Всего тем</p>
          <p className="text-2xl font-bold text-purple-600">
            {subjects.reduce((acc, s) => acc + s.topics, 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Всего уроков</p>
          <p className="text-2xl font-bold text-blue-600">
            {subjects.reduce((acc, s) => acc + s.lessons, 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Видео материалов</p>
          <p className="text-2xl font-bold text-green-600">
            {subjects.reduce((acc, s) => acc + s.videoCount, 0)}
          </p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <div
            key={subject.id}
            className={`rounded-xl p-6 border-2 transition-all cursor-pointer ${
              colorClasses[subject.color as keyof typeof colorClasses]
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{subject.icon}</div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                badgeColors[subject.color as keyof typeof badgeColors]
              }`}>
                {subject.grade} класс
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{subject.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{subject.description}</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Book className="w-4 h-4" />
                  <span>Темы</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{subject.topics}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Video className="w-4 h-4" />
                  <span>Видео</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{subject.videoCount}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Headphones className="w-4 h-4" />
                  <span>Аудио</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{subject.audioCount}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FileText className="w-4 h-4" />
                  <span>Тесты</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{subject.testCount}</span>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 transition-colors">
              Управление темами
            </button>
          </div>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Book className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium">Предметы не найдены</p>
          <p className="text-sm">Попробуйте изменить фильтры</p>
        </div>
      )}
    </div>
  );
}
