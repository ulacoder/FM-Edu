'use client';

import { useState } from 'react';
import { Package, Download, Plus, Search, HardDrive, FileArchive, CheckCircle } from 'lucide-react';

interface OfflinePackage {
  id: string;
  name: string;
  subject: string;
  grade: number;
  size: string;
  downloads: number;
  version: string;
  lastUpdated: string;
  status: 'active' | 'outdated' | 'building';
  topics: number;
  includes: string[];
}

export default function OfflinePackagesPage() {
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  const packages: OfflinePackage[] = [
    {
      id: '1',
      name: 'Математика 10 класс — Полный курс',
      subject: 'Математика',
      grade: 10,
      size: '2.4 GB',
      downloads: 342,
      version: '2.1.0',
      lastUpdated: '2026-08-20',
      status: 'active',
      topics: 24,
      includes: ['Видео уроки', 'Аудио материалы', 'Тесты', 'Инфографика', 'Конспекты']
    },
    {
      id: '2',
      name: 'Физика 10 класс — Механика + Термодинамика',
      subject: 'Физика',
      grade: 10,
      size: '1.8 GB',
      downloads: 287,
      version: '1.9.2',
      lastUpdated: '2026-08-18',
      status: 'active',
      topics: 18,
      includes: ['Видео уроки', 'Аудио материалы', 'Тесты', 'Симуляции']
    },
    {
      id: '3',
      name: 'Информатика 11 класс — ООП + Алгоритмы',
      subject: 'Информатика',
      grade: 11,
      size: '1.2 GB',
      downloads: 198,
      version: '2.0.1',
      lastUpdated: '2026-08-22',
      status: 'active',
      topics: 16,
      includes: ['Видео уроки', 'Примеры кода', 'Тесты', 'Практические задания']
    },
    {
      id: '4',
      name: 'Химия 10 класс — Органическая химия',
      subject: 'Химия',
      grade: 10,
      size: '1.6 GB',
      downloads: 156,
      version: '1.8.0',
      lastUpdated: '2026-08-10',
      status: 'outdated',
      topics: 20,
      includes: ['Видео уроки', 'Аудио материалы', 'Тесты', '3D модели молекул']
    },
    {
      id: '5',
      name: 'Биология 11 класс — Генетика + Экология',
      subject: 'Биология',
      grade: 11,
      size: '2.1 GB',
      downloads: 223,
      version: '2.2.0',
      lastUpdated: '2026-08-24',
      status: 'building',
      topics: 22,
      includes: ['Видео уроки', 'Аудио материалы', 'Тесты', 'Интерактивные схемы']
    },
    {
      id: '6',
      name: 'Математика 11 класс — Производные + Интегралы',
      subject: 'Математика',
      grade: 11,
      size: '2.8 GB',
      downloads: 412,
      version: '2.3.1',
      lastUpdated: '2026-08-21',
      status: 'active',
      topics: 26,
      includes: ['Видео уроки', 'Аудио материалы', 'Тесты', 'Интерактивные графики', 'Решения задач']
    }
  ];

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(search.toLowerCase()) ||
                         pkg.subject.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = filterSubject === 'all' || pkg.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const statusConfig = {
    active: { label: 'Актуальный', color: 'bg-green-100 text-green-700', icon: '✅' },
    outdated: { label: 'Устарел', color: 'bg-yellow-100 text-yellow-700', icon: '⚠️' },
    building: { label: 'Сборка...', color: 'bg-blue-100 text-blue-700', icon: '🔄' }
  };

  const totalSize = packages.reduce((acc, pkg) => {
    const sizeInGB = parseFloat(pkg.size.replace(' GB', ''));
    return acc + sizeInGB;
  }, 0);

  const totalDownloads = packages.reduce((acc, pkg) => acc + pkg.downloads, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Офлайн-пакеты</h1>
          <p className="text-gray-600 mt-1">Скачиваемые пакеты для обучения без интернета</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Создать пакет
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Всего пакетов</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Download className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Скачиваний</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">{totalDownloads.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Общий размер</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{totalSize.toFixed(1)} GB</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-gray-600">Актуальных</p>
          </div>
          <p className="text-2xl font-bold text-amber-600">
            {packages.filter(p => p.status === 'active').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию или предмету..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Все предметы</option>
            <option value="Математика">Математика</option>
            <option value="Физика">Физика</option>
            <option value="Информатика">Информатика</option>
            <option value="Химия">Химия</option>
            <option value="Биология">Биология</option>
          </select>
        </div>
      </div>

      {/* Packages List */}
      <div className="space-y-4">
        {filteredPackages.map((pkg) => {
          const statusInfo = statusConfig[pkg.status];
          return (
            <div
              key={pkg.id}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileArchive className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {pkg.subject}
                    </span>
                    <span>{pkg.grade} класс</span>
                    <span>{pkg.topics} тем</span>
                    <span className="font-medium text-gray-900">{pkg.size}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                  {statusInfo.icon} {statusInfo.label}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {pkg.includes.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>{pkg.downloads} скачиваний</span>
                  </div>
                  <div>
                    Версия: <span className="font-medium text-gray-900">{pkg.version}</span>
                  </div>
                  <div>
                    Обновлен: <span className="font-medium text-gray-900">
                      {new Date(pkg.lastUpdated).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {pkg.status === 'active' && (
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
                      Скачать
                    </button>
                  )}
                  {pkg.status === 'outdated' && (
                    <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors">
                      Обновить
                    </button>
                  )}
                  {pkg.status === 'building' && (
                    <button className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed">
                      Сборка...
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                    Редактировать
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium">Пакеты не найдены</p>
          <p className="text-sm">Попробуйте изменить фильтры</p>
        </div>
      )}
    </div>
  );
}
