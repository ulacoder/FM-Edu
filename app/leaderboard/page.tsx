'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy,
  Medal,
  Award,
  GraduationCap,
  MapPin,
  Zap
} from 'lucide-react';
import { LeaderboardEntry, Region, regionNames } from '@/types';
import { getTranslation, type Locale } from '@/lib/i18n';

type LeaderboardMode = 'all' | Region;

export default function LeaderboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [mode, setMode] = useState<LeaderboardMode>('all');
  const [totalStudents, setTotalStudents] = useState(0);
  const [locale, setLocale] = useState<Locale>('ru');

  const t = (key: keyof typeof import('@/lib/i18n').translations.ru) => getTranslation(locale, key);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role !== 'student') {
        router.push('/dashboard/teacher');
        return;
      }
      setUser(userData);

      // Устанавливаем режим по умолчанию на регион пользователя
      if (userData.region) {
        setMode(userData.region);
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/login');
    }

    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['ru', 'kk', 'en'].includes(savedLocale)) {
      setLocale(savedLocale);
    }

    const handleLocaleChange = (e: CustomEvent<Locale>) => {
      setLocale(e.detail);
    };

    window.addEventListener('localeChange', handleLocaleChange as EventListener);
    setLoading(false);

    return () => window.removeEventListener('localeChange', handleLocaleChange as EventListener);
  }, [router]);

  useEffect(() => {
    if (!loading) {
      loadLeaderboard();
    }
  }, [mode, loading]);

  const loadLeaderboard = async () => {
    // Мок-данные для лидерборда
    const mockLeaderboard: LeaderboardEntry[] = [
      { studentId: 's1', studentName: 'Айгерим Сатпаева', grade: 11, region: 'astana', totalPoints: 2450, rank: 1 },
      { studentId: 's2', studentName: 'Ержан Нурланов', grade: 10, region: 'almaty', totalPoints: 2380, rank: 2 },
      { studentId: 's3', studentName: 'Мадина Жумабекова', grade: 12, region: 'shymkent', totalPoints: 2290, rank: 3 },
      { studentId: 's4', studentName: 'Даурен Бектемиров', grade: 11, region: 'astana', totalPoints: 2150, rank: 4 },
      { studentId: 's5', studentName: 'Алия Камалова', grade: 10, region: 'almaty', totalPoints: 2080, rank: 5 },
      { studentId: 's6', studentName: 'Нурбол Айтказинов', grade: 12, region: 'karaganda', totalPoints: 1950, rank: 6 },
      { studentId: 's7', studentName: 'Асель Турсунова', grade: 11, region: 'aktobe', totalPoints: 1890, rank: 7 },
      { studentId: 's8', studentName: 'Дияр Мухамедов', grade: 10, region: 'kostanay', totalPoints: 1820, rank: 8 },
      { studentId: 's9', studentName: 'Жанар Ержанова', grade: 12, region: 'pavlodar', totalPoints: 1760, rank: 9 },
      { studentId: 's10', studentName: 'Санжар Абдуллаев', grade: 11, region: 'atyrau', totalPoints: 1690, rank: 10 },
      { studentId: 's11', studentName: 'Аида Касымова', grade: 10, region: 'taraz', totalPoints: 1620, rank: 11 },
      { studentId: 's12', studentName: 'Ерлан Токаев', grade: 12, region: 'mangystau', totalPoints: 1580, rank: 12 },
      { studentId: 's13', studentName: 'Дина Омарова', grade: 11, region: 'petropavl', totalPoints: 1520, rank: 13 },
      { studentId: 's14', studentName: 'Тимур Досаев', grade: 10, region: 'kyzylorda', totalPoints: 1460, rank: 14 },
      { studentId: 's15', studentName: 'Камила Нурланова', grade: 12, region: 'ustkamenogorsk', totalPoints: 1400, rank: 15 },
    ];

    try {
      // Фильтруем по региону если нужно
      let filteredLeaderboard = mockLeaderboard;
      if (mode !== 'all') {
        filteredLeaderboard = mockLeaderboard.filter(e => e.region === mode);
        // Пересчитываем ранги после фильтрации
        filteredLeaderboard = filteredLeaderboard.map((entry, index) => ({
          ...entry,
          rank: index + 1
        }));
      }

      // Добавляем текущего пользователя если его нет в списке
      const userInList = filteredLeaderboard.find(e => e.studentId === user?.id);
      if (!userInList && user) {
        const userEntry: LeaderboardEntry = {
          studentId: user.id,
          studentName: user.name,
          grade: user.grade || 10,
          region: user.region || 'astana',
          totalPoints: user.totalPoints || 850,
          rank: filteredLeaderboard.length + 1
        };
        filteredLeaderboard.push(userEntry);
      }

      setLeaderboard(filteredLeaderboard);
      setTotalStudents(filteredLeaderboard.length);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">{t('loading')}</div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const userEntry = leaderboard.find(e => e.studentId === user.id);

  return (
    <div className="flex flex-col min-h-screen">{/* Main Content */}
      <div className="flex-1 bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
              <Trophy className="w-7 h-7 text-primary" />
              {t('leaderboard')}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t('topStudents')}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setMode('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-card border border-border/60 hover:border-primary/40'
              }`}
            >
              🇰🇿 Весь Казахстан
            </button>
            {user.region && (
              <button
                onClick={() => setMode(user.region)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === user.region
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border/60 hover:border-primary/40'
                }`}
              >
                <MapPin className="w-4 h-4 inline-block mr-1" />
                {regionNames[user.region as Region]}
              </button>
            )}
          </div>

          {/* User's Rank (if not in top) */}
          {userEntry && userEntry.rank > 10 && (
            <div className="mb-6 bg-card border-2 border-primary/40 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-primary">
                    #{userEntry.rank}
                  </div>
                  <div>
                    <div className="font-semibold">Твоя позиция</div>
                    <div className="text-sm text-muted-foreground">
                      {userEntry.totalPoints} баллов
                    </div>
                  </div>
                </div>
                <Zap className="w-6 h-6 text-primary" />
              </div>
            </div>
          )}

          {/* Leaderboard */}
          <div className="bg-card border border-border/60 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border/60">
              <div className="text-sm text-muted-foreground">
                Всего участников: <span className="font-semibold text-foreground">{totalStudents}</span>
              </div>
            </div>

            {leaderboard.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Пока нет данных для отображения
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.studentId}
                    className={`p-4 hover:bg-muted/20 transition-colors ${
                      entry.studentId === user.id ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Rank */}
                        <div className="flex items-center justify-center w-12">
                          {getRankIcon(entry.rank) || (
                            <span className="text-lg font-bold text-muted-foreground">
                              #{entry.rank}
                            </span>
                          )}
                        </div>

                        {/* Student Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate flex items-center gap-2">
                            {entry.studentName}
                            {entry.studentId === user.id && (
                              <span className="ml-1 text-xs text-primary">(Ты)</span>
                            )}
                            {(entry as any).badge && (
                              <span
                                className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                                  (entry as any).badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700 border border-yellow-400' :
                                  (entry as any).badge.rarity === 'epic' ? 'bg-purple-100 text-purple-700 border border-purple-400' :
                                  (entry as any).badge.rarity === 'rare' ? 'bg-blue-100 text-blue-700 border border-blue-400' :
                                  'bg-gray-100 text-gray-700 border border-gray-400'
                                }`}
                                title={(entry as any).badge.name}
                              >
                                🏆 {(entry as any).badge.name.replace('Бейдж ', '')}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                            <span>{entry.grade} класс</span>
                            {mode === 'all' && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {regionNames[entry.region]}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Points */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {entry.totalPoints}
                          </div>
                          <div className="text-xs text-muted-foreground">баллов</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="mt-6 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 text-center">
            <h3 className="text-lg font-bold mb-2">Хочешь подняться выше?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Играй в игры и зарабатывай баллы!
            </p>
            <Link href="/games">
              <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Играть
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2026 FM Edu. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
