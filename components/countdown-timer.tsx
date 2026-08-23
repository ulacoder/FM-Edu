'use client';

import { useEffect, useState } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { Deadline } from '@/types';
import Link from 'next/link';

interface CountdownTimerProps {
  studentId: string;
}

export function CountdownTimer({ studentId }: CountdownTimerProps) {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeadlines();
  }, [studentId]);

  const loadDeadlines = async () => {
    try {
      const res = await fetch(`/api/deadlines?studentId=${studentId}`);
      const data = await res.json();
      // Берем только ближайшие 3 невыполненных дедлайна
      const upcoming = (data.deadlines || [])
        .filter((d: Deadline) => !d.completed && new Date(d.date) >= new Date())
        .slice(0, 3);
      setDeadlines(upcoming);
    } catch (error) {
      console.error('Error loading deadlines:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeUntil = (date: Date) => {
    const now = new Date();
    const target = new Date(date);
    const diff = target.getTime() - now.getTime();

    if (diff < 0) return { text: 'Прошло', color: 'text-red-500' };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 7) {
      return { text: `${days} дней`, color: 'text-green-600' };
    } else if (days > 0) {
      return { text: `${days} дн. ${hours} ч.`, color: 'text-yellow-600' };
    } else if (hours > 0) {
      return { text: `${hours} ч. ${minutes} мин.`, color: 'text-orange-600' };
    } else {
      return { text: `${minutes} мин.`, color: 'text-red-600' };
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow-md p-6 border border-border/60">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (deadlines.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-md p-6 border border-border/60">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-foreground">Ближайшие дедлайны</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-4">Нет предстоящих дедлайнов</p>
        <Link href="/calendar">
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Добавить дедлайн
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-md p-6 border border-border/60">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-foreground">Ближайшие дедлайны</h3>
        </div>
        <Link href="/calendar">
          <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            Все →
          </button>
        </Link>
      </div>

      <div className="space-y-3">
        {deadlines.map(deadline => {
          const timeUntil = getTimeUntil(deadline.date);
          return (
            <div
              key={deadline.id}
              className="border border-border rounded-lg p-4 hover:border-purple-300 transition-colors bg-muted/30"
              style={{ borderLeftWidth: '4px', borderLeftColor: deadline.color }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-foreground text-sm">{deadline.title}</h4>
                <span className={`text-xs font-bold ${timeUntil.color}`}>
                  {timeUntil.text}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(deadline.date).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Link href="/calendar">
        <button className="w-full mt-4 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm text-foreground">
          <Calendar className="w-4 h-4" />
          Открыть календарь
        </button>
      </Link>
    </div>
  );
}
