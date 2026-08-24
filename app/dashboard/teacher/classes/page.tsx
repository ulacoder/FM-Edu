'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Plus, BookOpen, TrendingUp } from 'lucide-react';

interface TeacherClass {
  id: string;
  teacherId: string;
  name: string;
  description?: string;
  studentIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function TeacherClassesPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'teacher') {
      router.push('/dashboard/student');
      return;
    }

    setTeacher(user);
    loadClasses(user.id);
  }, [router]);

  const loadClasses = (teacherId: string) => {
    try {
      const classesStr = localStorage.getItem('fm_edu_classes');
      const allClasses: TeacherClass[] = classesStr ? JSON.parse(classesStr) : [];
      const teacherClasses = allClasses.filter(c => c.teacherId === teacherId);
      setClasses(teacherClasses);
      setLoading(false);
    } catch (error) {
      console.error('Error loading classes:', error);
      setLoading(false);
    }
  };

  const handleCreateClass = () => {
    if (!newClassName.trim() || !teacher) return;

    setCreating(true);

    try {
      const classesStr = localStorage.getItem('fm_edu_classes');
      const allClasses: TeacherClass[] = classesStr ? JSON.parse(classesStr) : [];

      const newClass: TeacherClass = {
        id: `class_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        teacherId: teacher.id,
        name: newClassName,
        description: newClassDescription,
        studentIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      allClasses.push(newClass);
      localStorage.setItem('fm_edu_classes', JSON.stringify(allClasses));

      setClasses([...classes, newClass]);
      setNewClassName('');
      setNewClassDescription('');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating class:', error);
    } finally {
      setCreating(false);
    }
  };

  if (loading || !teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-lg text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Мои классы</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Управление классами и студентами
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Создать класс</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{classes.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Всего классов</p>
          </div>

          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">
                {classes.reduce((sum, c) => sum + c.studentIds.length, 0)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Студентов</p>
          </div>

          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{teacher.pointsBalance || 0}</span>
            </div>
            <p className="text-sm text-muted-foreground">Баллов осталось</p>
          </div>

          <div className="bg-card border border-border/60 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">
                {30000 - (teacher.pointsBalance || 0)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Раздано баллов</p>
          </div>
        </div>

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <div className="bg-card border border-border/60 rounded-lg p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Нет созданных классов</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Создайте первый класс, чтобы начать работу со студентами
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Создать класс
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {classes.map((classItem) => (
              <Link key={classItem.id} href={`/dashboard/teacher/classes/${classItem.id}`}>
                <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {classItem.studentIds.length} студентов
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{classItem.name}</h3>
                  {classItem.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {classItem.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-md w-full p-6 border border-border">
            <h2 className="text-xl font-bold mb-4">Создать новый класс</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Название класса *
                </label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="9 А — Математика"
                  className="w-full px-4 py-2.5 rounded-lg outline-none transition-all bg-background border border-border focus:border-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Описание (опционально)
                </label>
                <textarea
                  value={newClassDescription}
                  onChange={(e) => setNewClassDescription(e.target.value)}
                  placeholder="Дополнительная информация о классе"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg outline-none transition-all bg-background border border-border focus:border-primary text-foreground"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewClassName('');
                  setNewClassDescription('');
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                disabled={creating}
              >
                Отмена
              </button>
              <button
                onClick={handleCreateClass}
                disabled={!newClassName.trim() || creating}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Создание...' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
