'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Topic, Material, Assignment } from '@/types';

export default function LearnTopicPage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params.topicId as string;

  const [data, setData] = useState<{
    topic: Topic;
    materials: Material[];
    assignments: Assignment[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingAssignment, setGeneratingAssignment] = useState(false);

  useEffect(() => {
    if (topicId) {
      loadTopic();
    }
  }, [topicId]);

  const loadTopic = async () => {
    try {
      const response = await fetch(`/api/topics/${topicId}`);
      const data = await response.json();
      setData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading topic:', error);
      setLoading(false);
    }
  };

  const handleGenerateAssignment = async (difficulty: 'easy' | 'medium' | 'hard') => {
    setGeneratingAssignment(true);
    try {
      const response = await fetch('/api/assignments/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, difficulty, count: 5 }),
      });

      if (response.ok) {
        const assignment = await response.json();
        router.push(`/practice/${assignment.id}`);
      } else {
        alert('Ошибка генерации задания');
      }
    } catch (error) {
      alert('Ошибка соединения');
    }
    setGeneratingAssignment(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Тема не найдена</div>
      </div>
    );
  }

  const { topic, materials, assignments } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard/student" className="text-blue-600 hover:text-blue-700">
            ← Назад к дашборду
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Topic Info */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {topic.title}
              </h1>
              <p className="text-gray-600 mb-4">
                {topic.description}
              </p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>📚 Класс {topic.grade}</span>
                <span>📅 Четверть {topic.quarter}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Materials */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📺 Видео материалы
          </h2>
          {materials.length > 0 ? (
            <div className="space-y-4">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {material.title}
                      </h3>
                      <div className="flex gap-2 text-sm text-gray-500 mb-3">
                        <span className={`px-2 py-1 rounded ${
                          material.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          material.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {material.difficulty === 'easy' ? 'Легкий' :
                           material.difficulty === 'medium' ? 'Средний' : 'Сложный'}
                        </span>
                        {material.duration && (
                          <span>{Math.floor(material.duration / 60)} мин</span>
                        )}
                      </div>
                    </div>
                    <a
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Смотреть
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Материалы скоро появятся</p>
          )}
        </div>

        {/* Practice */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ✍️ Практика
          </h2>

          {assignments.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Доступные задания:</h3>
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                      <p className="text-sm text-gray-500">
                        {assignment.questions.length} вопросов
                      </p>
                    </div>
                    <Link
                      href={`/practice/${assignment.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Начать
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Создать новое задание:</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => handleGenerateAssignment('easy')}
                disabled={generatingAssignment}
                className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 disabled:opacity-50"
              >
                <div className="text-2xl mb-2">🟢</div>
                <div className="font-semibold text-gray-900">Легкий уровень</div>
                <div className="text-sm text-gray-600">Базовые задачи</div>
              </button>

              <button
                onClick={() => handleGenerateAssignment('medium')}
                disabled={generatingAssignment}
                className="p-4 border-2 border-yellow-200 rounded-lg hover:border-yellow-400 disabled:opacity-50"
              >
                <div className="text-2xl mb-2">🟡</div>
                <div className="font-semibold text-gray-900">Средний уровень</div>
                <div className="text-sm text-gray-600">Стандартные задачи</div>
              </button>

              <button
                onClick={() => handleGenerateAssignment('hard')}
                disabled={generatingAssignment}
                className="p-4 border-2 border-red-200 rounded-lg hover:border-red-400 disabled:opacity-50"
              >
                <div className="text-2xl mb-2">🔴</div>
                <div className="font-semibold text-gray-900">Сложный уровень</div>
                <div className="text-sm text-gray-600">Олимпиадные задачи</div>
              </button>
            </div>
          </div>

          {generatingAssignment && (
            <div className="mt-4 text-center text-gray-600">
              AI генерирует задание для вас...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
