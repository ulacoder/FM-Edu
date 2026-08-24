'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Clock,
  Target,
  Award,
  Globe
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AnalyticsData {
  userGrowth: { month: string; users: number; active: number }[];
  subjectEngagement: { subject: string; hours: number; completion: number }[];
  regionalDistribution: { region: string; users: number; color: string }[];
  performanceMetrics: {
    avgTestScore: number;
    avgTimeSpent: number;
    completionRate: number;
    activeUsers: number;
  };
}

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    userGrowth: [
      { month: 'Январь', users: 450, active: 320 },
      { month: 'Февраль', users: 580, active: 410 },
      { month: 'Март', users: 720, active: 520 },
      { month: 'Апрель', users: 890, active: 640 },
      { month: 'Май', users: 1050, active: 780 },
      { month: 'Июнь', users: 1247, active: 920 }
    ],
    subjectEngagement: [
      { subject: 'Математика', hours: 3420, completion: 78 },
      { subject: 'Физика', hours: 2890, completion: 72 },
      { subject: 'Информатика', hours: 3150, completion: 85 },
      { subject: 'Химия', hours: 2340, completion: 68 },
      { subject: 'Биология', hours: 2120, completion: 74 }
    ],
    regionalDistribution: [
      { region: 'г. Астана', users: 312, color: '#8b5cf6' },
      { region: 'г. Алматы', users: 289, color: '#ec4899' },
      { region: 'г. Шымкент', users: 156, color: '#f59e0b' },
      { region: 'Акмолинская', users: 98, color: '#10b981' },
      { region: 'Другие', users: 392, color: '#3b82f6' }
    ],
    performanceMetrics: {
      avgTestScore: 76.4,
      avgTimeSpent: 47,
      completionRate: 73.2,
      activeUsers: 920
    }
  });

  const MetricCard = ({ icon: Icon, title, value, subtitle, color, trend }: any) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Аналитика платформы</h1>
        <p className="text-gray-600">Детальная статистика по всем метрикам</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Users}
          title="Активных пользователей"
          value={data.performanceMetrics.activeUsers}
          subtitle="За последние 30 дней"
          color="bg-purple-500"
          trend={24}
        />
        <MetricCard
          icon={Clock}
          title="Среднее время"
          value={`${data.performanceMetrics.avgTimeSpent} мин`}
          subtitle="На одну сессию"
          color="bg-blue-500"
          trend={12}
        />
        <MetricCard
          icon={Award}
          title="Средний балл"
          value={`${data.performanceMetrics.avgTestScore}%`}
          subtitle="По всем тестам"
          color="bg-green-500"
          trend={8}
        />
        <MetricCard
          icon={Target}
          title="Завершенность"
          value={`${data.performanceMetrics.completionRate}%`}
          subtitle="Курсов доведено до конца"
          color="bg-amber-500"
          trend={-3}
        />
      </div>

      {/* User Growth */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Рост пользователей</h2>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data.userGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="users"
              stackId="1"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.6}
              name="Всего пользователей"
            />
            <Area
              type="monotone"
              dataKey="active"
              stackId="2"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Активные"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Subject Engagement & Regional Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Engagement */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Вовлеченность по предметам</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.subjectEngagement}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#8b5cf6" name="Часы обучения" radius={[8, 8, 0, 0]} />
              <Bar dataKey="completion" fill="#10b981" name="% завершенности" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Regional Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            <Globe className="w-5 h-5 inline mr-2" />
            Региональное распределение
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.regionalDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ region, users }) => `${region} (${users})`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="users"
              >
                {data.regionalDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Performance Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Детальная статистика по предметам</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Предмет</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Часы обучения</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Завершенности</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.subjectEngagement.map((subject, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{subject.subject}</td>
                <td className="px-6 py-4 text-gray-600">{subject.hours.toLocaleString()} ч</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${subject.completion}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{subject.completion}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    subject.completion >= 80
                      ? 'bg-green-100 text-green-700'
                      : subject.completion >= 60
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {subject.completion >= 80 ? 'Отлично' : subject.completion >= 60 ? 'Хорошо' : 'Требует внимания'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
