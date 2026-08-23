'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, PlayCircle, Shuffle } from 'lucide-react';
import { InteractiveMode } from '@/types/interactive';
import { getAllQuizzes, initializeQuizzes } from '@/lib/quizzes';

export default function TeacherInteractivePage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [selectedMode, setSelectedMode] = useState<InteractiveMode>('individual');
  const [teamCount, setTeamCount] = useState(2);
  const [error, setError] = useState('');

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

    // Загрузка классов учителя
    const classesStr = localStorage.getItem('fm_edu_classes');
    const allClasses = classesStr ? JSON.parse(classesStr) : [];
    const teacherClasses = allClasses.filter((c: any) => c.teacherId === user.id);
    setClasses(teacherClasses);

    // Инициализация квизов
    initializeQuizzes();
    const allQuizzes = getAllQuizzes();
    setQuizzes(allQuizzes);

    setLoading(false);
  }, [router]);

  const handleStartInteractive = () => {
    setError('');

    if (!selectedClassId || !selectedQuizId) {
      setError('Выберите класс и квиз');
      return;
    }

    const selectedClass = classes.find((c) => c.id === selectedClassId);
    if (!selectedClass || selectedClass.studentIds.length === 0) {
      setError('В выбранном классе нет учеников');
      return;
    }

    if (selectedMode === 'team' && selectedClass.studentIds.length < teamCount) {
      setError(`В классе недостаточно учеников для ${teamCount} команд`);
      return;
    }

    // Создаем сессию интерактива
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionData = {
      sessionId,
      classId: selectedClassId,
      quizId: selectedQuizId,
      mode: selectedMode,
      teamCount: selectedMode === 'team' ? teamCount : undefined,
    };

    // Сохраняем в sessionStorage для передачи в презентацию
    sessionStorage.setItem('interactive_session', JSON.stringify(sessionData));

    // Переход на страницу презентации
    router.push(`/dashboard/teacher/interactive/presentation?session=${sessionId}`);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/teacher"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к дашборду
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Классный интерактив</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Запустите квиз на проекторе для всего класса
          </p>
        </div>

        {/* Setup Form */}
        <div className="bg-card border border-border/60 rounded-lg p-6">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Выбор класса */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Выберите класс *
              </label>
              {classes.length === 0 ? (
                <div className="p-4 rounded-lg bg-muted border border-border text-sm text-muted-foreground">
                  У вас еще нет созданных классов. <Link href="/dashboard/teacher/classes" className="text-primary hover:underline">Создайте класс</Link>
                </div>
              ) : (
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg outline-none border border-border bg-background text-foreground"
                >
                  <option value="">Выберите класс</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.studentIds.length} учеников)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Выбор квиза */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Выберите квиз *
              </label>
              <select
                value={selectedQuizId}
                onChange={(e) => setSelectedQuizId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg outline-none border border-border bg-background text-foreground"
              >
                <option value="">Выберите квиз</option>
                {quizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title} ({quiz.questions.length} вопросов)
                  </option>
                ))}
              </select>
            </div>

            {/* Выбор режима */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Режим прохождения *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedMode('individual')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedMode === 'individual'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold mb-1">Индивидуальный</div>
                  <div className="text-xs text-muted-foreground">
                    Выбираете ученика для каждого вопроса
                  </div>
                </button>

                <button
                  onClick={() => setSelectedMode('team')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedMode === 'team'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <Shuffle className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold mb-1">Командный</div>
                  <div className="text-xs text-muted-foreground">
                    Класс делится на случайные команды
                  </div>
                </button>
              </div>
            </div>

            {/* Количество команд (если командный режим) */}
            {selectedMode === 'team' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Количество команд
                </label>
                <select
                  value={teamCount}
                  onChange={(e) => setTeamCount(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg outline-none border border-border bg-background text-foreground"
                >
                  <option value="2">2 команды</option>
                  <option value="3">3 команды</option>
                  <option value="4">4 команды</option>
                </select>
              </div>
            )}

            {/* Кнопка запуска */}
            <button
              onClick={handleStartInteractive}
              disabled={!selectedClassId || !selectedQuizId}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
            >
              <PlayCircle className="w-6 h-6" />
              Запустить интерактив на проекторе
            </button>
          </div>
        </div>

        {/* Информация */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
          <div className="font-semibold mb-2">💡 Горячие клавиши в режиме презентации:</div>
          <ul className="space-y-1 ml-4">
            <li>• <kbd className="px-2 py-0.5 bg-card rounded border">A</kbd>, <kbd className="px-2 py-0.5 bg-card rounded border">B</kbd>, <kbd className="px-2 py-0.5 bg-card rounded border">C</kbd>, <kbd className="px-2 py-0.5 bg-card rounded border">D</kbd> — выбор ответа</li>
            <li>• <kbd className="px-2 py-0.5 bg-card rounded border">Пробел</kbd> — следующий вопрос</li>
            <li>• <kbd className="px-2 py-0.5 bg-card rounded border">Esc</kbd> — выход из полноэкранного режима</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
