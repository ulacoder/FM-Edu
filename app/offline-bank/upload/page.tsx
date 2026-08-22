'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, FileText, AlertCircle } from 'lucide-react';
import { SubjectCategory, SUBJECT_NAMES, ACTIVE_SUBJECTS, FileFormat } from '@/types/offline-bank';
import { addTeacherMaterial } from '@/lib/offline-materials';

export default function UploadMaterialPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<SubjectCategory>('mathematics');
  const [targetClassId, setTargetClassId] = useState('');
  const [teacherNote, setTeacherNote] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'teacher') {
      router.push('/offline-bank');
      return;
    }

    setTeacher(user);

    // Загрузка классов учителя
    const classesStr = localStorage.getItem('fm_edu_classes');
    const allClasses = classesStr ? JSON.parse(classesStr) : [];
    const teacherClasses = allClasses.filter((c: any) => c.teacherId === user.id);
    setClasses(teacherClasses);

    setLoading(false);
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Проверка формата
    const allowedFormats = ['pdf', 'docx', 'pptx', 'xlsx'];
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedFormats.includes(fileExtension)) {
      setError('Поддерживаются только файлы: PDF, DOCX, PPTX, XLSX');
      return;
    }

    // Проверка размера (макс 50 MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('Файл слишком большой. Максимальный размер: 50 MB');
      return;
    }

    setFile(selectedFile);
    setError('');

    // Автозаполнение названия из имени файла
    if (!title.trim()) {
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, '');
      setTitle(fileName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!file || !title.trim() || !targetClassId) {
      setError('Заполните все обязательные поля');
      return;
    }

    setUploading(true);

    try {
      // В реальном приложении файл загружался бы на сервер
      // Здесь создаем локальную ссылку через FileReader
      const fileUrl = URL.createObjectURL(file);
      const fileFormat = file.name.split('.').pop()?.toLowerCase() as FileFormat;

      const newMaterial = {
        id: `teacher_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        subject,
        file_url: fileUrl,
        file_size: file.size,
        file_format: fileFormat,
        target_class_id: targetClassId,
        teacher_id: teacher.id,
        teacher_name: teacher.name,
        teacher_note: teacherNote.trim() || undefined,
        is_public: false,
        created_at: new Date().toISOString(),
      };

      addTeacherMaterial(newMaterial);

      // Успех
      router.push('/offline-bank');
    } catch (err) {
      setError('Ошибка при загрузке материала');
      setUploading(false);
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/offline-bank"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к Offline Bank
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Загрузить материал</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Материал будет доступен только выбранному классу
          </p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border/60 rounded-lg p-6">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Файл *
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.pptx,.xlsx"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center gap-3 w-full px-4 py-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/40 transition-colors"
                >
                  {file ? (
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-primary" />
                      <div className="text-left">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <div className="text-center">
                        <p className="font-medium">Нажмите для выбора файла</p>
                        <p className="text-sm text-muted-foreground">PDF, DOCX, PPTX, XLSX • Макс 50 MB</p>
                      </div>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Название материала *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Сборник задач по алгебре"
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-all bg-background border border-border focus:border-primary text-foreground"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Предмет *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectCategory)}
                className="w-full px-4 py-2.5 rounded-lg outline-none border border-border bg-background text-foreground"
              >
                {ACTIVE_SUBJECTS.map((subj) => (
                  <option key={subj} value={subj}>
                    {SUBJECT_NAMES[subj]}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Class */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Класс-адресат *
              </label>
              {classes.length === 0 ? (
                <div className="p-4 rounded-lg bg-muted border border-border text-sm text-muted-foreground">
                  У вас еще нет созданных классов. <Link href="/dashboard/teacher/classes" className="text-primary hover:underline">Создайте класс</Link>
                </div>
              ) : (
                <select
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg outline-none border border-border bg-background text-foreground"
                >
                  <option value="">Выберите класс</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.studentIds.length} студентов)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Teacher Note */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Записка для учеников (опционально)
              </label>
              <textarea
                value={teacherNote}
                onChange={(e) => setTeacherNote(e.target.value)}
                placeholder="Например: ТЫ ОБЯЗАН СДЕЛАТЬ ЭТО ДО ЗАВТРА!!"
                rows={3}
                maxLength={200}
                className="w-full px-4 py-2.5 rounded-lg outline-none transition-all bg-background border border-border focus:border-primary text-foreground resize-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {teacherNote.length}/200 символов
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Link href="/offline-bank" className="flex-1">
                <button
                  type="button"
                  className="w-full px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors"
                  disabled={uploading}
                >
                  Отмена
                </button>
              </Link>
              <button
                type="submit"
                disabled={!file || !title.trim() || !targetClassId || uploading}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Загрузка...' : 'Загрузить материал'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
