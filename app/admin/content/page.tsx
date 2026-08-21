'use client';

import { useState, useEffect } from 'react';

interface SubjectStatus {
  generated: boolean;
  topics: number;
  withVideo: number;
  withTests: number;
}

export default function ContentAdminPage() {
  const [status, setStatus] = useState<Record<string, SubjectStatus> | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadStatus = async () => {
    try {
      const res = await fetch('/api/content/load');
      const data = await res.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 5000); // Обновляем каждые 5 секунд
    return () => clearInterval(interval);
  }, []);

  const loadSubjectContent = async (subject: string) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/content/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject })
      });
      const data = await res.json();

      if (data.success) {
        setMessage(`✅ Загружено: ${data.materialsAdded} материалов, ${data.assignmentsAdded} тестов`);
        loadStatus();
      } else {
        setMessage(`❌ Ошибка: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Ошибка загрузки`);
    }
    setLoading(false);
  };

  const subjectNames: Record<string, string> = {
    mathematics: 'Математика',
    physics: 'Физика',
    informatics: 'Информатика'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🎓 FM Edu — Управление контентом</h1>

        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            {message}
          </div>
        )}

        <div className="space-y-4">
          {status && Object.entries(status).map(([subject, info]) => (
            <div
              key={subject}
              className="bg-white rounded-lg shadow p-6 border-l-4"
              style={{ borderLeftColor: info.generated ? '#10b981' : '#ef4444' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">
                    {info.generated ? '✅' : '⏳'} {subjectNames[subject]}
                  </h2>

                  {info.generated ? (
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📚 Всего тем: <span className="font-semibold">{info.topics}</span></p>
                      <p>🎥 С видео: <span className="font-semibold">{info.withVideo}</span></p>
                      <p>📝 С тестами: <span className="font-semibold">{info.withTests}</span></p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Контент ещё не сгенерирован</p>
                  )}
                </div>

                <button
                  onClick={() => loadSubjectContent(subject)}
                  disabled={!info.generated || loading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    info.generated && !loading
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Загружаю...' : 'Загрузить в БД'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold mb-2">ℹ️ Инструкция:</h3>
          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
            <li>Дождись пока генерация предмета завершится (статус станет ✅)</li>
            <li>Нажми "Загрузить в БД" чтобы добавить контент в систему</li>
            <li>После загрузки контент будет доступен ученикам</li>
          </ol>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>🔄 Автообновление каждые 5 секунд</p>
          <p>📁 Контент генерируется в: <code className="bg-gray-100 px-2 py-1 rounded">data/generated/</code></p>
        </div>
      </div>
    </div>
  );
}
