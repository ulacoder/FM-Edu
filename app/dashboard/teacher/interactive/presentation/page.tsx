'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Shuffle, Check, ChevronRight } from 'lucide-react';
import { InteractiveSession, Team, TEAM_COLORS, POINTS_PER_CORRECT_ANSWER } from '@/types/interactive';
import { getQuizById } from '@/lib/quizzes';

function PresentationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session');

  const [session, setSession] = useState<InteractiveSession | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      router.push('/dashboard/teacher/interactive');
      return;
    }

    // Загружаем данные сессии из sessionStorage
    const sessionDataStr = sessionStorage.getItem('interactive_session');
    if (!sessionDataStr) {
      router.push('/dashboard/teacher/interactive');
      return;
    }

    const sessionData = JSON.parse(sessionDataStr);
    const quiz = getQuizById(sessionData.quizId);

    if (!quiz) {
      router.push('/dashboard/teacher/interactive');
      return;
    }

    // Загружаем класс и студентов
    const classesStr = localStorage.getItem('fm_edu_classes');
    const classes = classesStr ? JSON.parse(classesStr) : [];
    const selectedClass = classes.find((c: any) => c.id === sessionData.classId);

    if (!selectedClass) {
      router.push('/dashboard/teacher/interactive');
      return;
    }

    const usersStr = localStorage.getItem('fm_edu_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    const classStudents = users.filter((u: any) => selectedClass.studentIds.includes(u.id));
    setStudents(classStudents);

    // Инициализируем сессию
    const newSession: InteractiveSession = {
      id: sessionData.sessionId,
      teacherId: 'current_teacher',
      classId: sessionData.classId,
      mode: sessionData.mode,
      quizId: sessionData.quizId,
      questions: quiz.questions,
      currentQuestionIndex: 0,
      studentAnswers: {},
      startedAt: new Date().toISOString(),
    };

    // Если командный режим — создаем команды
    if (sessionData.mode === 'team') {
      const teamCount = sessionData.teamCount || 2;
      const shuffledStudents = [...classStudents].sort(() => Math.random() - 0.5);
      const studentsPerTeam = Math.ceil(shuffledStudents.length / teamCount);

      const teams: Team[] = [];
      for (let i = 0; i < teamCount; i++) {
        const teamStudents = shuffledStudents.slice(i * studentsPerTeam, (i + 1) * studentsPerTeam);
        teams.push({
          id: `team_${i}`,
          name: TEAM_COLORS[i].name,
          color: TEAM_COLORS[i].color,
          studentIds: teamStudents.map((s: any) => s.id),
          score: 0,
        });
      }

      newSession.teams = teams;
      newSession.currentTeamIndex = 0;
      newSession.teamScores = teams.reduce((acc, team) => {
        acc[team.id] = 0;
        return acc;
      }, {} as { [key: string]: number });
    }

    setSession(newSession);
    setLoading(false);

    // Полноэкранный режим
    document.documentElement.requestFullscreen?.();
  }, [sessionId, router]);

  // Обработка горячих клавиш
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (showResult) {
      if (e.code === 'Space') {
        e.preventDefault();
        handleNextQuestion();
      }
      return;
    }

    switch (e.code) {
      case 'KeyA':
        setSelectedAnswer('A');
        break;
      case 'KeyB':
        setSelectedAnswer('B');
        break;
      case 'KeyC':
        setSelectedAnswer('C');
        break;
      case 'KeyD':
        setSelectedAnswer('D');
        break;
      case 'Escape':
        document.exitFullscreen?.();
        router.push('/dashboard/teacher/interactive');
        break;
    }
  }, [showResult, router]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleRandomStudent = () => {
    const randomIndex = Math.floor(Math.random() * students.length);
    setSelectedStudent(students[randomIndex].id);
  };

  const handleCheckAnswer = () => {
    if (!session || !selectedAnswer) return;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.correctAnswer;

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      if (session.mode === 'individual' && selectedStudent) {
        // Индивидуальный режим: +50 баллов студенту
        const updatedAnswers = { ...session.studentAnswers };
        if (!updatedAnswers[selectedStudent]) {
          updatedAnswers[selectedStudent] = {
            correctCount: 0,
            totalAnswered: 0,
            pointsEarned: 0,
          };
        }
        updatedAnswers[selectedStudent].correctCount++;
        updatedAnswers[selectedStudent].totalAnswered++;
        updatedAnswers[selectedStudent].pointsEarned += POINTS_PER_CORRECT_ANSWER;

        setSession({ ...session, studentAnswers: updatedAnswers });
      } else if (session.mode === 'team' && session.teams && session.currentTeamIndex !== undefined) {
        // Командный режим: +50 баллов команде
        const currentTeam = session.teams[session.currentTeamIndex];
        const updatedTeamScores = { ...session.teamScores };
        updatedTeamScores[currentTeam.id] = (updatedTeamScores[currentTeam.id] || 0) + POINTS_PER_CORRECT_ANSWER;

        const updatedTeams = session.teams.map((team) =>
          team.id === currentTeam.id ? { ...team, score: updatedTeamScores[team.id] } : team
        );

        setSession({
          ...session,
          teams: updatedTeams,
          teamScores: updatedTeamScores,
        });
      }
    } else {
      // Неправильный ответ — просто засчитываем попытку
      if (session.mode === 'individual' && selectedStudent) {
        const updatedAnswers = { ...session.studentAnswers };
        if (!updatedAnswers[selectedStudent]) {
          updatedAnswers[selectedStudent] = {
            correctCount: 0,
            totalAnswered: 0,
            pointsEarned: 0,
          };
        }
        updatedAnswers[selectedStudent].totalAnswered++;
        setSession({ ...session, studentAnswers: updatedAnswers });
      }
    }
  };

  const handleNextQuestion = () => {
    if (!session) return;

    const nextIndex = session.currentQuestionIndex + 1;

    if (nextIndex >= session.questions.length) {
      // Квиз завершен — переход к результатам
      handleFinishSession();
      return;
    }

    // Переход к следующему вопросу
    const updatedSession = {
      ...session,
      currentQuestionIndex: nextIndex,
    };

    // В командном режиме переключаем команду
    if (session.mode === 'team' && session.teams && session.currentTeamIndex !== undefined) {
      updatedSession.currentTeamIndex = (session.currentTeamIndex + 1) % session.teams.length;
    }

    setSession(updatedSession);
    setSelectedAnswer(null);
    setSelectedStudent(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const handleFinishSession = () => {
    if (!session) return;

    // Сохраняем результаты в localStorage
    const completedSession = {
      ...session,
      completedAt: new Date().toISOString(),
    };

    // Начисляем баллы студентам
    const usersStr = localStorage.getItem('fm_edu_users');
    const users = usersStr ? JSON.parse(usersStr) : [];

    if (session.mode === 'individual') {
      // Индивидуальный режим: баллы уже посчитаны
      Object.entries(session.studentAnswers).forEach(([studentId, stats]) => {
        const studentIndex = users.findIndex((u: any) => u.id === studentId);
        if (studentIndex !== -1) {
          users[studentIndex].totalPoints = (users[studentIndex].totalPoints || 0) + stats.pointsEarned;
        }
      });
    } else if (session.mode === 'team' && session.teams && session.teamScores) {
      // Командный режим: делим баллы команды поровну между участниками
      session.teams.forEach((team) => {
        const teamScore = session.teamScores![team.id] || 0;
        const pointsPerStudent = Math.ceil(teamScore / team.studentIds.length);

        team.studentIds.forEach((studentId) => {
          const studentIndex = users.findIndex((u: any) => u.id === studentId);
          if (studentIndex !== -1) {
            users[studentIndex].totalPoints = (users[studentIndex].totalPoints || 0) + pointsPerStudent;

            // Обновляем статистику студента
            if (!completedSession.studentAnswers[studentId]) {
              completedSession.studentAnswers[studentId] = {
                correctCount: 0,
                totalAnswered: 0,
                pointsEarned: pointsPerStudent,
              };
            } else {
              completedSession.studentAnswers[studentId].pointsEarned = pointsPerStudent;
            }
          }
        });
      });
    }

    localStorage.setItem('fm_edu_users', JSON.stringify(users));

    // Сохраняем результаты сессии для экрана итогов
    sessionStorage.setItem('interactive_results', JSON.stringify(completedSession));

    // Переход к экрану итогов
    router.push(`/dashboard/teacher/interactive/results?session=${session.id}`);
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-2xl">Загрузка...</div>
      </div>
    );
  }

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-8 relative">
      {/* Exit Button */}
      <button
        onClick={() => {
          document.exitFullscreen?.();
          router.push('/dashboard/teacher/interactive');
        }}
        className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors z-50"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-semibold">
            Вопрос {session.currentQuestionIndex + 1} из {session.questions.length}
          </span>
          <span className="text-xl font-semibold">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Team Scores (Командный режим) */}
      {session.mode === 'team' && session.teams && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {session.teams.map((team, index) => {
            const teamColor = TEAM_COLORS[index];
            const isCurrentTeam = index === session.currentTeamIndex;

            return (
              <div
                key={team.id}
                className={`p-6 rounded-xl border-4 transition-all ${
                  isCurrentTeam
                    ? `${teamColor.borderColor} bg-white/10 scale-105`
                    : 'border-gray-700 bg-gray-800/50'
                }`}
              >
                <div className={`text-2xl font-bold mb-2 ${isCurrentTeam ? teamColor.textColor : 'text-white'}`}>
                  {team.name}
                </div>
                <div className="text-5xl font-black">{team.score}</div>
                <div className="text-sm text-gray-400 mt-1">{team.studentIds.length} учеников</div>
                {isCurrentTeam && (
                  <div className="mt-2 px-3 py-1 bg-yellow-500 text-gray-900 rounded-full text-xs font-bold inline-block">
                    Ваш ход
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Question */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">{currentQuestion.question}</h1>
        </div>

        {/* Answer Options */}
        {!showResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {(['A', 'B', 'C', 'D'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSelectedAnswer(option)}
                className={`p-8 rounded-2xl border-4 transition-all transform hover:scale-105 ${
                  selectedAnswer === option
                    ? 'border-purple-500 bg-purple-600/30 scale-105'
                    : 'border-gray-600 bg-gray-800/50 hover:border-purple-400'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl font-black ${
                      selectedAnswer === option ? 'bg-purple-500' : 'bg-gray-700'
                    }`}
                  >
                    {option}
                  </div>
                  <div className="text-3xl font-semibold text-left flex-1">
                    {currentQuestion.options[option]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Result Display */}
        {showResult && (
          <div className="mb-12">
            <div
              className={`p-12 rounded-3xl border-4 text-center ${
                isCorrect
                  ? 'border-green-500 bg-green-600/20'
                  : 'border-red-500 bg-red-600/20'
              }`}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                {isCorrect ? (
                  <>
                    <Check className="w-16 h-16 text-green-400" />
                    <span className="text-6xl font-black text-green-400">Правильно!</span>
                  </>
                ) : (
                  <>
                    <X className="w-16 h-16 text-red-400" />
                    <span className="text-6xl font-black text-red-400">Неправильно</span>
                  </>
                )}
              </div>

              {isCorrect && (
                <div className="text-4xl font-bold text-yellow-400 mb-4">
                  +{POINTS_PER_CORRECT_ANSWER} баллов
                </div>
              )}

              <div className="text-2xl mb-6">
                Правильный ответ: <span className="font-bold text-purple-400">{currentQuestion.correctAnswer}</span>
              </div>

              {currentQuestion.explanation && (
                <div className="text-xl text-gray-300 max-w-3xl mx-auto">
                  {currentQuestion.explanation}
                </div>
              )}

              <button
                onClick={handleNextQuestion}
                className="mt-8 px-12 py-6 bg-purple-600 hover:bg-purple-700 rounded-2xl text-3xl font-bold transition-colors flex items-center gap-4 mx-auto"
              >
                {session.currentQuestionIndex + 1 < session.questions.length ? (
                  <>
                    Следующий вопрос
                    <ChevronRight className="w-10 h-10" />
                  </>
                ) : (
                  <>
                    Завершить квиз
                    <Check className="w-10 h-10" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Controls */}
        {!showResult && (
          <div className="flex items-center justify-center gap-6">
            {/* Student Selector (Индивидуальный режим) */}
            {session.mode === 'individual' && (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleRandomStudent}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-xl font-semibold transition-colors flex items-center gap-3"
                >
                  <Shuffle className="w-6 h-6" />
                  Выбрать случайного ученика
                </button>

                {selectedStudent && (
                  <div className="px-6 py-4 bg-blue-500/20 border-2 border-blue-500 rounded-xl text-xl font-semibold">
                    {students.find((s) => s.id === selectedStudent)?.name}
                  </div>
                )}
              </div>
            )}

            {/* Check Answer Button */}
            <button
              onClick={handleCheckAnswer}
              disabled={!selectedAnswer || (session.mode === 'individual' && !selectedStudent)}
              className="px-12 py-6 bg-purple-600 hover:bg-purple-700 rounded-2xl text-3xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Проверить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InteractivePresentationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-2xl">Загрузка...</div>
      </div>
    }>
      <PresentationContent />
    </Suspense>
  );
}
