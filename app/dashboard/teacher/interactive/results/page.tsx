'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Star, Award, Home } from 'lucide-react';
import { InteractiveSession } from '@/types/interactive';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session');

  const [session, setSession] = useState<InteractiveSession | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      router.push('/dashboard/teacher/interactive');
      return;
    }

    // Загружаем результаты из sessionStorage
    const resultsStr = sessionStorage.getItem('interactive_results');
    if (!resultsStr) {
      router.push('/dashboard/teacher/interactive');
      return;
    }

    const completedSession: InteractiveSession = JSON.parse(resultsStr);
    setSession(completedSession);

    // Загружаем студентов
    const usersStr = localStorage.getItem('fm_edu_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    const classesStr = localStorage.getItem('fm_edu_classes');
    const classes = classesStr ? JSON.parse(classesStr) : [];
    const selectedClass = classes.find((c: any) => c.id === completedSession.classId);

    if (selectedClass) {
      const classStudents = users.filter((u: any) => selectedClass.studentIds.includes(u.id));
      setStudents(classStudents);
    }

    setLoading(false);

    // Очищаем временные данные
    sessionStorage.removeItem('interactive_session');
    sessionStorage.removeItem('interactive_results');
  }, [sessionId, router]);

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        <div className="text-2xl">Загрузка...</div>
      </div>
    );
  }

  // Подготовка данных для отображения
  const studentResults = students
    .map((student) => {
      const stats = session.studentAnswers[student.id] || {
        correctCount: 0,
        totalAnswered: 0,
        pointsEarned: 0,
      };

      return {
        id: student.id,
        name: student.name,
        correctCount: stats.correctCount,
        totalAnswered: stats.totalAnswered,
        pointsEarned: stats.pointsEarned,
        accuracy: stats.totalAnswered > 0 ? Math.round((stats.correctCount / stats.totalAnswered) * 100) : 0,
      };
    })
    .sort((a, b) => b.pointsEarned - a.pointsEarned);

  const topStudents = studentResults.slice(0, 3);
  const totalPointsDistributed = studentResults.reduce((sum, s) => sum + s.pointsEarned, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Trophy className="w-20 h-20 text-yellow-400 animate-bounce" />
            <h1 className="text-7xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Итоги интерактива
            </h1>
            <Trophy className="w-20 h-20 text-yellow-400 animate-bounce" />
          </div>
          <p className="text-3xl text-gray-300">Поздравляем победителей!</p>
        </div>

        {/* Team Results (если командный режим) */}
        {session.mode === 'team' && session.teams && session.teamScores && (
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">Результаты команд</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {session.teams
                .sort((a, b) => ((session.teamScores?.[b.id] || 0) - (session.teamScores?.[a.id] || 0)))
                .map((team, index) => {
                  const isWinner = index === 0;
                  return (
                    <div
                      key={team.id}
                      className={`p-8 rounded-2xl border-4 relative ${
                        isWinner
                          ? 'border-yellow-400 bg-yellow-500/20 scale-110'
                          : 'border-gray-600 bg-gray-800/50'
                      }`}
                    >
                      {isWinner && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                          <div className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-full text-xl font-black flex items-center gap-2">
                            <Trophy className="w-6 h-6" />
                            Победители
                          </div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">{team.name}</div>
                        <div className="text-6xl font-black text-yellow-400 mb-2">
                          {session.teamScores?.[team.id] || 0}
                        </div>
                        <div className="text-lg text-gray-400">{team.studentIds.length} участников</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Top 3 Students */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">Топ-3 активных учеников</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topStudents.map((student, index) => {
              const medals = ['🥇', '🥈', '🥉'];
              const colors = [
                'border-yellow-400 bg-yellow-500/20',
                'border-gray-400 bg-gray-500/20',
                'border-orange-400 bg-orange-500/20',
              ];

              return (
                <div
                  key={student.id}
                  className={`p-8 rounded-2xl border-4 ${colors[index]} relative`}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-6xl">
                    {medals[index]}
                  </div>
                  <div className="text-center pt-6">
                    <div className="text-3xl font-bold mb-3">{student.name}</div>
                    <div className="mb-4">
                      <div className="text-5xl font-black text-yellow-400">
                        {student.pointsEarned}
                      </div>
                      <div className="text-lg text-gray-400">баллов заработано</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-400">
                          {student.correctCount}
                        </div>
                        <div className="text-sm text-gray-400">правильных</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">
                          {student.accuracy}%
                        </div>
                        <div className="text-sm text-gray-400">точность</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Students Results */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">Подробные результаты</h2>
          <div className="bg-gray-800/50 rounded-2xl border-2 border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xl font-bold">Место</th>
                  <th className="px-6 py-4 text-left text-xl font-bold">Ученик</th>
                  <th className="px-6 py-4 text-center text-xl font-bold">Правильных</th>
                  <th className="px-6 py-4 text-center text-xl font-bold">Точность</th>
                  <th className="px-6 py-4 text-center text-xl font-bold">Баллы</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {studentResults.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-2xl font-bold">#{index + 1}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {index < 3 && (
                          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        )}
                        <span className="text-xl font-semibold">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xl font-semibold text-green-400">
                        {student.correctCount} / {student.totalAnswered}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xl font-semibold text-blue-400">
                        {student.accuracy}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-2xl font-bold text-yellow-400">
                        +{student.pointsEarned}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-purple-600/20 border-2 border-purple-500 text-center">
            <Award className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">{totalPointsDistributed}</div>
            <div className="text-gray-300">Всего баллов роздано</div>
          </div>
          <div className="p-6 rounded-xl bg-blue-600/20 border-2 border-blue-500 text-center">
            <Trophy className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">{studentResults.length}</div>
            <div className="text-gray-300">Участников</div>
          </div>
          <div className="p-6 rounded-xl bg-green-600/20 border-2 border-green-500 text-center">
            <Star className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">{session.questions.length}</div>
            <div className="text-gray-300">Вопросов пройдено</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-6">
          <Link href="/dashboard/teacher/interactive">
            <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-xl font-semibold transition-colors flex items-center gap-3">
              Запустить новый интерактив
            </button>
          </Link>
          <Link href="/dashboard/teacher">
            <button className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-xl font-semibold transition-colors flex items-center gap-3">
              <Home className="w-6 h-6" />
              Вернуться к дашборду
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function InteractiveResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        <div className="text-2xl">Загрузка...</div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
