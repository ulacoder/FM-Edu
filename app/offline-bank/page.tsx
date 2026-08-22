'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Download, FileText, Check, BookOpen, Award } from 'lucide-react';
import { OfflineMaterial, SubjectCategory, SUBJECT_NAMES, ACTIVE_SUBJECTS, COMING_SOON_SUBJECTS, formatFileSize } from '@/types/offline-bank';
import { getMaterialsForStudent, initializeOfflineMaterials } from '@/lib/offline-materials';

export default function OfflineBankPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [materials, setMaterials] = useState<OfflineMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<OfflineMaterial[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);

    // Инициализация публичных материалов
    initializeOfflineMaterials();

    // Загрузка материалов для студента
    if (userData.role === 'student') {
      // Получаем классы студента
      const classesStr = localStorage.getItem('fm_edu_classes');
      const classes = classesStr ? JSON.parse(classesStr) : [];
      const studentClassIds = classes
        .filter((c: any) => c.studentIds?.includes(userData.id))
        .map((c: any) => c.id);

      const studentMaterials = getMaterialsForStudent(studentClassIds);
      setMaterials(studentMaterials);
      setFilteredMaterials(studentMaterials);
    } else {
      // Для учителей показываем все материалы
      const materialsStr = localStorage.getItem('fm_edu_offline_materials');
      const allMaterials = materialsStr ? JSON.parse(materialsStr) : [];
      setMaterials(allMaterials);
      setFilteredMaterials(allMaterials);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    let result = materials;

    // Фильтрация по предмету
    if (selectedSubject !== 'all') {
      result = result.filter((m) => m.subject === selectedSubject);
    }

    // Поиск по названию
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((m) => m.title.toLowerCase().includes(query));
    }

    setFilteredMaterials(result);
  }, [selectedSubject, searchQuery, materials]);

  const handleDownload = async (material: OfflineMaterial) => {
    // TODO: Реализовать скачивание и кэширование через Service Worker
    alert(`Скачивание: ${material.title}`);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-lg text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  const isTeacher = user.role === 'teacher';

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Offline Bank</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Учебные материалы для скачивания и офлайн-просмотра
              </p>
            </div>
            {isTeacher && (
              <Link href="/offline-bank/upload">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Загрузить материал</span>
                </button>
              </Link>
            )}
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition-all bg-background border border-border focus:border-primary text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Subject Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedSubject === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:border-primary/40'
              }`}
            >
              Все предметы
            </button>
            {ACTIVE_SUBJECTS.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedSubject === subject
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border hover:border-primary/40'
                }`}
              >
                {SUBJECT_NAMES[subject]}
              </button>
            ))}
          </div>
        </div>

        {/* Coming Soon Subjects */}
        {selectedSubject !== 'all' && COMING_SOON_SUBJECTS.includes(selectedSubject as SubjectCategory) && (
          <div className="bg-card border border-border/60 rounded-lg p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Материалы скоро появятся</h3>
            <p className="text-sm text-muted-foreground">
              Мы работаем над добавлением материалов по предмету "{SUBJECT_NAMES[selectedSubject as SubjectCategory]}"
            </p>
          </div>
        )}

        {/* Materials Grid */}
        {(selectedSubject === 'all' || ACTIVE_SUBJECTS.includes(selectedSubject as SubjectCategory)) && (
          <>
            {filteredMaterials.length === 0 ? (
              <div className="bg-card border border-border/60 rounded-lg p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Материалы не найдены</h3>
                <p className="text-sm text-muted-foreground">
                  Попробуйте изменить фильтры или поисковый запрос
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMaterials.map((material) => {
                  const isFromTeacher = !material.is_public && material.teacher_id;
                  const isCached = material.cached_locally;

                  return (
                    <div
                      key={material.id}
                      className={`bg-card rounded-lg p-5 transition-all relative ${
                        isFromTeacher
                          ? 'border-2 border-yellow-500/60 hover:border-yellow-500 shadow-lg shadow-yellow-500/10'
                          : 'border border-border/60 hover:border-primary/40'
                      }`}
                    >
                      {/* Teacher Badge */}
                      {isFromTeacher && (
                        <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          От вашего учителя
                        </div>
                      )}

                      {/* Cached Badge */}
                      {isCached && (
                        <div className="absolute top-3 left-3 px-2 py-1 bg-green-500/20 text-green-600 text-xs font-medium rounded flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Сохранено офлайн
                        </div>
                      )}

                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                            {material.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{SUBJECT_NAMES[material.subject]}</span>
                            <span>•</span>
                            <span className="uppercase">{material.file_format}</span>
                            <span>•</span>
                            <span>{formatFileSize(material.file_size)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Teacher Note */}
                      {material.teacher_note && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="text-xs font-medium text-yellow-800 mb-1 flex items-center gap-1">
                            📌 Записка от учителя {material.teacher_name && `(${material.teacher_name})`}:
                          </div>
                          <p className="text-sm text-yellow-900 font-medium">
                            {material.teacher_note}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => handleDownload(material)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Скачать</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
