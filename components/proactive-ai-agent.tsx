'use client';

import { useEffect, useState } from 'react';
import { AIAgentIntervention } from './ai-agent-intervention';
import { useActivityLogger } from '@/hooks/useActivityLogger';

export function ProactiveAIAgent() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    // Получаем данные студента из localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'student') {
          setStudentId(user.id);
          setIsStudent(true);
        }
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }, []);

  // Автоматическое логирование активности
  useActivityLogger({
    studentId: studentId || '',
    enabled: isStudent && !!studentId
  });

  if (!isStudent || !studentId) return null;

  return (
    <>
      {/* Компонент интервенций ИИ */}
      <AIAgentIntervention studentId={studentId} />

      {/* Индикатор что ИИ-агент активен */}
      <div className="fixed bottom-4 left-4 z-40">
        <div className="bg-primary/10 border border-primary/30 rounded-full px-3 py-1.5 flex items-center gap-2 backdrop-blur-sm">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs font-medium text-primary">AI Agent Active</span>
        </div>
      </div>
    </>
  );
}
