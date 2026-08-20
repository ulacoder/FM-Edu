'use client';

import { useState } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import Link from 'next/link';

type Tab = 'region' | 'kz';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('region');

  // Mock data для топ-3
  const topThree = [
    { rank: 2, name: 'Айгерим К.', points: 2840, avatar: '👩', progress: 95 },
    { rank: 1, name: 'Нурасыл Б.', points: 3120, avatar: '👨', progress: 100 },
    { rank: 3, name: 'Дамир А.', points: 2650, avatar: '👨', progress: 88 },
  ];

  // Mock data для остальных
  const otherUsers = [
    { rank: 4, name: 'Алия М.', points: 2420, avatar: '👩' },
    { rank: 5, name: 'Ерлан Т.', points: 2280, avatar: '👨' },
    { rank: 6, name: 'Камила С.', points: 2150, avatar: '👩' },
    { rank: 7, name: 'Асель Ж.', points: 2080, avatar: '👩' },
    { rank: 8, name: 'Жанибек К.', points: 1950, avatar: '👨' },
    { rank: 9, name: 'Инкар Б.', points: 1920, avatar: '👩' },
    { rank: 10, name: 'Ернар М.', points: 1880, avatar: '👨' },
  ];

  const currentUser = {
    rank: 454,
    name: 'Жылкыбай Таир',
    points: 1826,
    nextRank: 453,
    pointsToNext: 2,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/student" className="text-purple-600 hover:underline mb-4 inline-block">
            ← Назад к дашборду
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-600" />
            Leaderboard
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab('region')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              activeTab === 'region'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-purple-300'
            }`}
          >
            My Group
          </button>
          <button
            onClick={() => setActiveTab('kz')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              activeTab === 'kz'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-purple-300'
            }`}
          >
            All Students
          </button>
        </div>

        {/* Your Rank Card */}
        <div className="bg-white rounded-xl p-6 border-2 border-yellow-300 shadow-sm mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">YOUR RANK</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-gray-900">#{currentUser.rank}</span>
                <span className="text-lg text-gray-600 font-semibold flex items-center gap-1">
                  GRINDING 💪
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">RANK</p>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {currentUser.rank} / 1185
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Next Level</span>
              <span className="text-sm font-semibold text-blue-600">{currentUser.pointsToNext} points needed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: '85%' }}
              />
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="bg-white rounded-xl p-8 border-2 border-gray-200 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🏆 Топ 3 🏆</h2>

          <div className="flex items-end justify-center gap-4 mb-8">
            {/* 2nd Place */}
            <div className="flex flex-col items-center flex-1 max-w-[160px]">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-3xl mb-3 border-4 border-white shadow-lg">
                {topThree[0].avatar}
              </div>
              <div className="w-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-xl p-4 text-center" style={{ height: '140px' }}>
                <div className="text-4xl mb-2">🥈</div>
                <p className="font-bold text-gray-900 mb-1">{topThree[0].name}</p>
                <p className="text-2xl font-bold text-gray-700">{topThree[0].points}</p>
                <div className="mt-2 w-full bg-gray-400 rounded-full h-1.5">
                  <div className="h-full bg-white rounded-full" style={{ width: `${topThree[0].progress}%` }} />
                </div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center flex-1 max-w-[180px]">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center text-4xl mb-3 border-4 border-white shadow-xl">
                {topThree[1].avatar}
              </div>
              <div className="w-full bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-t-xl p-4 text-center" style={{ height: '180px' }}>
                <div className="text-5xl mb-2">👑</div>
                <p className="font-bold text-gray-900 mb-1">{topThree[1].name}</p>
                <p className="text-3xl font-bold text-gray-800">{topThree[1].points}</p>
                <div className="mt-2 w-full bg-yellow-600 rounded-full h-1.5">
                  <div className="h-full bg-white rounded-full" style={{ width: `${topThree[1].progress}%` }} />
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center flex-1 max-w-[160px]">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full flex items-center justify-center text-3xl mb-3 border-4 border-white shadow-lg">
                {topThree[2].avatar}
              </div>
              <div className="w-full bg-gradient-to-br from-orange-200 to-orange-300 rounded-t-xl p-4 text-center" style={{ height: '120px' }}>
                <div className="text-4xl mb-2">🥉</div>
                <p className="font-bold text-gray-900 mb-1">{topThree[2].name}</p>
                <p className="text-2xl font-bold text-gray-700">{topThree[2].points}</p>
                <div className="mt-2 w-full bg-orange-500 rounded-full h-1.5">
                  <div className="h-full bg-white rounded-full" style={{ width: `${topThree[2].progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Rankings */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Рейтинг</h3>
            <div className="space-y-2">
              {otherUsers.map((user) => (
                <div
                  key={user.rank}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center font-bold text-gray-700">
                      {user.rank}
                    </div>
                    <div className="text-2xl">{user.avatar}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-purple-600">{user.points}</p>
                    <p className="text-xs text-gray-500">баллов</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current User Position (if not in top 10) */}
        {currentUser.rank > 10 && (
          <div className="mt-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-300 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white">
                  {currentUser.rank}
                </div>
                <div className="text-2xl">👤</div>
                <div>
                  <p className="font-semibold text-gray-900">{currentUser.name} (Вы)</p>
                  <p className="text-xs text-gray-600">Еще {currentUser.pointsToNext} баллов до {currentUser.nextRank} места</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-purple-600">{currentUser.points}</p>
                <p className="text-xs text-gray-500">баллов</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
