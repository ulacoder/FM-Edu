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
    // Расширенные мок-данные для лидерборда (минимум 5 студентов на регион)
    const mockLeaderboard: LeaderboardEntry[] = [
      // Astana (6 студентов)
      { studentId: 's1', studentName: 'Айгерим Сатпаева', grade: 11, region: 'astana', totalPoints: 2450, rank: 1 },
      { studentId: 's4', studentName: 'Даурен Бектемиров', grade: 11, region: 'astana', totalPoints: 2150, rank: 4 },
      { studentId: 's16', studentName: 'Нурсултан Алиев', grade: 10, region: 'astana', totalPoints: 1850, rank: 16 },
      { studentId: 's17', studentName: 'Айша Касымова', grade: 12, region: 'astana', totalPoints: 1780, rank: 17 },
      { studentId: 's18', studentName: 'Бауыржан Ермеков', grade: 11, region: 'astana', totalPoints: 1690, rank: 18 },
      { studentId: 's19', studentName: 'Сауле Нурланова', grade: 10, region: 'astana', totalPoints: 1620, rank: 19 },

      // Almaty (6 студентов)
      { studentId: 's2', studentName: 'Ержан Нурланов', grade: 10, region: 'almaty', totalPoints: 2380, rank: 2 },
      { studentId: 's5', studentName: 'Алия Камалова', grade: 10, region: 'almaty', totalPoints: 2080, rank: 5 },
      { studentId: 's20', studentName: 'Арман Сейдалиев', grade: 11, region: 'almaty', totalPoints: 1920, rank: 20 },
      { studentId: 's21', studentName: 'Дильназ Токтарова', grade: 12, region: 'almaty', totalPoints: 1840, rank: 21 },
      { studentId: 's22', studentName: 'Ерлан Кайратов', grade: 10, region: 'almaty', totalPoints: 1750, rank: 22 },
      { studentId: 's23', studentName: 'Айнур Жумагулова', grade: 11, region: 'almaty', totalPoints: 1670, rank: 23 },

      // Shymkent (5 студентов)
      { studentId: 's3', studentName: 'Мадина Жумабекова', grade: 12, region: 'shymkent', totalPoints: 2290, rank: 3 },
      { studentId: 's24', studentName: 'Абай Сериков', grade: 11, region: 'shymkent', totalPoints: 1880, rank: 24 },
      { studentId: 's25', studentName: 'Жанна Мукашева', grade: 10, region: 'shymkent', totalPoints: 1790, rank: 25 },
      { studentId: 's26', studentName: 'Темирлан Оспанов', grade: 12, region: 'shymkent', totalPoints: 1710, rank: 26 },
      { studentId: 's27', studentName: 'Карина Абдуллаева', grade: 11, region: 'shymkent', totalPoints: 1640, rank: 27 },

      // Karaganda (5 студентов)
      { studentId: 's6', studentName: 'Нурбол Айтказинов', grade: 12, region: 'karaganda', totalPoints: 1950, rank: 6 },
      { studentId: 's28', studentName: 'Алмас Бекмуратов', grade: 11, region: 'karaganda', totalPoints: 1820, rank: 28 },
      { studentId: 's29', studentName: 'Гульнара Сейткалиева', grade: 10, region: 'karaganda', totalPoints: 1740, rank: 29 },
      { studentId: 's30', studentName: 'Ерболат Нургалиев', grade: 12, region: 'karaganda', totalPoints: 1660, rank: 30 },
      { studentId: 's31', studentName: 'Айгуль Мухтарова', grade: 11, region: 'karaganda', totalPoints: 1590, rank: 31 },

      // Aktobe (5 студентов)
      { studentId: 's7', studentName: 'Асель Турсунова', grade: 11, region: 'aktobe', totalPoints: 1890, rank: 7 },
      { studentId: 's32', studentName: 'Данияр Жақсылыков', grade: 10, region: 'aktobe', totalPoints: 1800, rank: 32 },
      { studentId: 's33', studentName: 'Камила Ержанова', grade: 12, region: 'aktobe', totalPoints: 1720, rank: 33 },
      { studentId: 's34', studentName: 'Нуржан Омаров', grade: 11, region: 'aktobe', totalPoints: 1650, rank: 34 },
      { studentId: 's35', studentName: 'Айдана Сарсенова', grade: 10, region: 'aktobe', totalPoints: 1580, rank: 35 },

      // Kostanay (5 студентов)
      { studentId: 's8', studentName: 'Дияр Мухамедов', grade: 10, region: 'kostanay', totalPoints: 1820, rank: 8 },
      { studentId: 's36', studentName: 'Бекзат Курманов', grade: 11, region: 'kostanay', totalPoints: 1730, rank: 36 },
      { studentId: 's37', studentName: 'Аружан Касенова', grade: 12, region: 'kostanay', totalPoints: 1680, rank: 37 },
      { studentId: 's38', studentName: 'Ернар Сабитов', grade: 10, region: 'kostanay', totalPoints: 1610, rank: 38 },
      { studentId: 's39', studentName: 'Динара Абылхасова', grade: 11, region: 'kostanay', totalPoints: 1540, rank: 39 },

      // Pavlodar (5 студентов)
      { studentId: 's9', studentName: 'Жанар Ержанова', grade: 12, region: 'pavlodar', totalPoints: 1760, rank: 9 },
      { studentId: 's40', studentName: 'Асхат Тулеуов', grade: 11, region: 'pavlodar', totalPoints: 1700, rank: 40 },
      { studentId: 's41', studentName: 'Медина Утеулиева', grade: 10, region: 'pavlodar', totalPoints: 1630, rank: 41 },
      { studentId: 's42', studentName: 'Нурлан Досымов', grade: 12, region: 'pavlodar', totalPoints: 1560, rank: 42 },
      { studentId: 's43', studentName: 'Жансая Кенжебаева', grade: 11, region: 'pavlodar', totalPoints: 1500, rank: 43 },

      // Atyrau (5 студентов)
      { studentId: 's10', studentName: 'Санжар Абдуллаев', grade: 11, region: 'atyrau', totalPoints: 1690, rank: 10 },
      { studentId: 's44', studentName: 'Алихан Бекетов', grade: 10, region: 'atyrau', totalPoints: 1620, rank: 44 },
      { studentId: 's45', studentName: 'Сабина Исмаилова', grade: 12, region: 'atyrau', totalPoints: 1570, rank: 45 },
      { studentId: 's46', studentName: 'Ерасыл Мамытов', grade: 11, region: 'atyrau', totalPoints: 1510, rank: 46 },
      { studentId: 's47', studentName: 'Айым Нурбекова', grade: 10, region: 'atyrau', totalPoints: 1450, rank: 47 },

      // Jambyl (5 студентов)
      { studentId: 's11', studentName: 'Аида Касымова', grade: 10, region: 'jambyl', totalPoints: 1620, rank: 11 },
      { studentId: 's48', studentName: 'Бексултан Шакиров', grade: 11, region: 'jambyl', totalPoints: 1580, rank: 48 },
      { studentId: 's49', studentName: 'Гулим Тулегенова', grade: 12, region: 'jambyl', totalPoints: 1530, rank: 49 },
      { studentId: 's50', studentName: 'Еркебулан Жаксылыков', grade: 10, region: 'jambyl', totalPoints: 1470, rank: 50 },
      { studentId: 's51', studentName: 'Жадыра Ахметова', grade: 11, region: 'jambyl', totalPoints: 1410, rank: 51 },

      // Mangystau (5 студентов)
      { studentId: 's12', studentName: 'Ерлан Токаев', grade: 12, region: 'mangystau', totalPoints: 1580, rank: 12 },
      { studentId: 's52', studentName: 'Айбек Нурланов', grade: 11, region: 'mangystau', totalPoints: 1550, rank: 52 },
      { studentId: 's53', studentName: 'Дина Сагидуллина', grade: 10, region: 'mangystau', totalPoints: 1490, rank: 53 },
      { studentId: 's54', studentName: 'Ерлан Байбосынов', grade: 12, region: 'mangystau', totalPoints: 1430, rank: 54 },
      { studentId: 's55', studentName: 'Жанель Кайратова', grade: 11, region: 'mangystau', totalPoints: 1370, rank: 55 },

      // North Kazakhstan (5 студентов)
      { studentId: 's13', studentName: 'Дина Омарова', grade: 11, region: 'northkazakhstan', totalPoints: 1520, rank: 13 },
      { studentId: 's56', studentName: 'Азамат Ердаулетов', grade: 10, region: 'northkazakhstan', totalPoints: 1480, rank: 56 },
      { studentId: 's57', studentName: 'Балжан Кумарова', grade: 12, region: 'northkazakhstan', totalPoints: 1440, rank: 57 },
      { studentId: 's58', studentName: 'Ерсултан Кабдрахманов', grade: 11, region: 'northkazakhstan', totalPoints: 1390, rank: 58 },
      { studentId: 's59', studentName: 'Жансая Толеубаева', grade: 10, region: 'northkazakhstan', totalPoints: 1330, rank: 59 },

      // Kyzylorda (5 студентов)
      { studentId: 's14', studentName: 'Тимур Досаев', grade: 10, region: 'kyzylorda', totalPoints: 1460, rank: 14 },
      { studentId: 's60', studentName: 'Алибек Сержанов', grade: 11, region: 'kyzylorda', totalPoints: 1420, rank: 60 },
      { studentId: 's61', studentName: 'Галия Омарова', grade: 12, region: 'kyzylorda', totalPoints: 1380, rank: 61 },
      { studentId: 's62', studentName: 'Ерназар Берикболов', grade: 10, region: 'kyzylorda', totalPoints: 1320, rank: 62 },
      { studentId: 's63', studentName: 'Жанар Нурболатова', grade: 11, region: 'kyzylorda', totalPoints: 1260, rank: 63 },

      // East Kazakhstan (5 студентов)
      { studentId: 's15', studentName: 'Камила Нурланова', grade: 12, region: 'eastkazakhstan', totalPoints: 1400, rank: 15 },
      { studentId: 's64', studentName: 'Асан Турсынов', grade: 11, region: 'eastkazakhstan', totalPoints: 1360, rank: 64 },
      { studentId: 's65', studentName: 'Динара Жумабаева', grade: 10, region: 'eastkazakhstan', totalPoints: 1310, rank: 65 },
      { studentId: 's66', studentName: 'Ердос Аманжолов', grade: 12, region: 'eastkazakhstan', totalPoints: 1250, rank: 66 },
      { studentId: 's67', studentName: 'Жазира Султанова', grade: 11, region: 'eastkazakhstan', totalPoints: 1190, rank: 67 },
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
