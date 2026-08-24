'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  BookOpen,
  TrendingUp,
  Download,
  Clock,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DashboardStats {
  totalUsers: number;
  activeToday: number;
  totalCourses: number;
  offlineDownloads: number;
  avgSessionTime: number;
  topSubjects: { name: string; students: number; color: string }[];
  weeklyActivity: { day: string; students: number }[];
  skillsDistribution: { subject: string; avgScore: number; fullMark: number }[];
}

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#6366f1'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1247,
    activeToday: 389,
    totalCourses: 156,
    offlineDownloads: 842,
    avgSessionTime: 47,
    topSubjects: [
      { name: 'Математика', students: 456, color: '#8b5cf6' },
      { name: 'Физика', students: 389, color: '#ec4899' },
      { name: 'Информатика', students: 312, color: '#f59e0b' },
      { name: 'Химия', students: 267, color: '#10b981' },
      { name: 'Биология', students: 198, color: '#3b82f6' }
    ],
    weeklyActivity: [
      { day: 'Пн', students: 234 },
      { day: 'Вт', students: 312 },
      { day: 'Ср', students: 289 },
      { day: 'Чт', students: 367 },
      { day: 'Пт', students: 421 },
      { day: 'Сб', students: 156 },
      { day: 'Вс', students: 98 }
    ],
    skillsDistribution: [
      { subject: 'Математика', avgScore: 78, fullMark: 100 },
      { subject: 'Физика', avgScore: 72, fullMark: 100 },
      { subject: 'Информатика', avgScore: 85, fullMark: 100 },
      { subject: 'Химия', avgScore: 68, fullMark: 100 },
      { subject: 'Биология', avgScore: 74, fullMark: 100 }
    ]
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
    setLoading(false);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Общая статистика платформы FM Edu</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          title="Всего пользователей"
          value={stats.totalUsers.toLocaleString()}
          subtitle={`${stats.activeToday} активны сегодня`}
          color="bg-purple-500"
        />
        <StatCard
          icon={BookOpen}
          title="Курсы и уроки"
          value={stats.totalCourses}
          subtitle="Доступно на платформе"
          color="bg-pink-500"
        />
        <StatCard
          icon={Download}
          title="Офлайн скачивания"
          value={stats.offlineDownloads}
          subtitle="За последние 30 дней"
          color="bg-blue-500"
        />
        <StatCard
          icon={Clock}
          title="Среднее время сессии"
          value={`${stats.avgSessionTime} мин`}
          subtitle="На платформе"
          color="bg-green-500"
        />
        <StatCard
          icon={Award}
          title="Средний прогресс"
          value="73%"
          subtitle="По всем предметам"
          color="bg-amber-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Рост активности"
          value="+24%"
          subtitle="По сравнению с прошлым месяцем"
          color="bg-indigo-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Subjects - Pie Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Популярные предметы</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.topSubjects}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="students"
              >
                {stats.topSubjects.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Activity - Line Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Активность по дням</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skills Radar Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Средние баллы по предметам (FIFA Radar)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.skillsDistribution}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" stroke="#6b7280" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
            <Radar
              name="Средний балл"
              dataKey="avgScore"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.6}
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Subject Distribution - Bar Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Распределение студентов по предметам</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.topSubjects}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Bar dataKey="students" radius={[8, 8, 0, 0]}>
              {stats.topSubjects.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
