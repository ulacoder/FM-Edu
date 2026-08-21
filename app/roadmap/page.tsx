'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Target,
  GraduationCap,
  Plus,
  CheckCircle2,
  Circle,
  AlertCircle,
  Sparkles,
  X,
  Trash2
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { RoadmapGoal, RoadmapGoalType, subjectNames, UniversityPortfolio } from '@/types';

export default function RoadmapPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [roadmaps, setRoadmaps] = useState<RoadmapGoal[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const [newGoal, setNewGoal] = useState({
    type: 'university' as RoadmapGoalType,
    title: '',
    targetUniversity: '',
    targetSubject: '',
    targetDate: '',
    portfolio: {
      gpa: 4.0,
      achievements: [] as string[],
      activities: [] as string[],
      projects: [] as string[],
      certifications: [] as string[],
      leadership: [] as string[],
      testScores: {
        ent: undefined,
        sat: undefined,
        ielts: undefined,
        toefl: undefined
      }
    } as UniversityPortfolio,
    tempInputs: {
      achievement: '',
      activity: '',
      project: '',
      certification: '',
      leadership: ''
    }
  });

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
      loadRoadmaps(userData.id);
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const loadRoadmaps = async (studentId: string) => {
    try {
      const response = await fetch(`/api/roadmap?studentId=${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setRoadmaps(data.roadmaps);
      }
    } catch (error) {
      console.error('Error loading roadmaps:', error);
    }
  };

  const createRoadmap = async () => {
    if (!user || !newGoal.title) {
      setError('Заполните название цели');
      return;
    }

    if (newGoal.type === 'university' && !newGoal.targetUniversity) {
      setError('Укажите целевой университет');
      return;
    }

    if ((newGoal.type === 'olympiad' || newGoal.type === 'exam') && !newGoal.targetSubject) {
      setError('Выберите предмет');
      return;
    }

    setCreating(true);
    setError('');
    try {
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          type: newGoal.type,
          title: newGoal.title,
          targetUniversity: newGoal.targetUniversity || undefined,
          targetSubject: newGoal.targetSubject || undefined,
          targetDate: newGoal.targetDate || undefined,
          portfolio: newGoal.type === 'university' ? newGoal.portfolio : undefined,
          studentGrade: user.grade
        })
      });

      if (response.ok) {
        const data = await response.json();
        setRoadmaps([...roadmaps, data.roadmap]);
        setShowCreateModal(false);
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка при создании роадмапа');
      }
    } catch (error: any) {
      console.error('Error creating roadmap:', error);
      setError(error.message || 'Ошибка при создании роадмапа');
    }
    setCreating(false);
  };

  const resetForm = () => {
    setNewGoal({
      type: 'university',
      title: '',
      targetUniversity: '',
      targetSubject: '',
      targetDate: '',
      portfolio: {
        gpa: 4.0,
        achievements: [],
        activities: [],
        projects: [],
        certifications: [],
        leadership: [],
        testScores: {
          ent: undefined,
          sat: undefined,
          ielts: undefined,
          toefl: undefined
        }
      },
      tempInputs: {
        achievement: '',
        activity: '',
        project: '',
        certification: '',
        leadership: ''
      }
    });
    setError('');
  };

  const toggleTask = async (roadmapId: string, taskId: string, completed: boolean) => {
    try {
      const response = await fetch('/api/roadmap', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roadmapId, taskId, completed: !completed })
      });

      if (response.ok) {
        const data = await response.json();
        setRoadmaps(roadmaps.map(r => r.id === roadmapId ? data.roadmap : r));
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const addArrayItem = (key: 'achievements' | 'activities' | 'projects' | 'certifications' | 'leadership') => {
    const inputKey = key.slice(0, -1) as keyof typeof newGoal.tempInputs;
    const value = newGoal.tempInputs[inputKey]?.trim();
    if (value) {
      setNewGoal({
        ...newGoal,
        portfolio: {
          ...newGoal.portfolio,
          [key]: [...newGoal.portfolio[key], value]
        },
        tempInputs: {
          ...newGoal.tempInputs,
          [inputKey]: ''
        }
      });
    }
  };

  const removeArrayItem = (key: 'achievements' | 'activities' | 'projects' | 'certifications' | 'leadership', index: number) => {
    setNewGoal({
      ...newGoal,
      portfolio: {
        ...newGoal.portfolio,
        [key]: newGoal.portfolio[key].filter((_, i) => i !== index)
      }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 border-red-500/50';
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/50';
      case 'low': return 'bg-green-500/10 border-green-500/50';
      default: return 'bg-muted border-border/60';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Критично';
      case 'medium': return 'Важно';
      case 'low': return 'Желательно';
      default: return 'Обычно';
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <Link href="/" className="text-base sm:text-lg font-bold">
                FM Edu
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Link href="/dashboard/student">
                <button className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                  Дашборд
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
                <Target className="w-7 h-7 text-primary" />
                Мой роадмап
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                План действий для достижения целей
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Создать цель</span>
            </button>
          </div>

          {/* Roadmaps */}
          {roadmaps.length === 0 ? (
            <div className="bg-card border border-border/60 rounded-lg p-12 text-center">
              <Target className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Пока нет целей</h3>
              <p className="text-muted-foreground mb-6">
                Создай свой первый роадмап для достижения мечты!
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Создать первый роадмап
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {roadmaps.map((roadmap) => {
                const completedTasks = roadmap.tasks.filter(t => t.completed).length;
                const totalTasks = roadmap.tasks.length;
                const progress = Math.round((completedTasks / totalTasks) * 100);

                return (
                  <div key={roadmap.id} className="bg-card border border-border/60 rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-border/40">
                      <h2 className="text-xl font-bold mb-2">{roadmap.title}</h2>
                      {roadmap.targetUniversity && (
                        <p className="text-sm text-muted-foreground mb-3">
                          🎓 {roadmap.targetUniversity}
                        </p>
                      )}
                      {roadmap.targetSubject && (
                        <p className="text-sm text-muted-foreground mb-3">
                          📚 {subjectNames[roadmap.targetSubject]}
                        </p>
                      )}
                      {roadmap.targetDate && (
                        <p className="text-sm text-muted-foreground mb-3">
                          📅 Целевая дата: {new Date(roadmap.targetDate).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      )}

                      {/* Progress */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {completedTasks}/{totalTasks}
                        </span>
                      </div>

                      {/* AI Analysis */}
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold">Анализ от ИИ</span>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {roadmap.aiAnalysis}
                        </p>
                      </div>

                      {/* Alternative Universities */}
                      {roadmap.alternativeUniversities && roadmap.alternativeUniversities.length > 0 && (
                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Альтернативные университеты</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">Если не получится с основной целью, рассмотри эти варианты:</p>
                          <ul className="space-y-1">
                            {roadmap.alternativeUniversities.map((uni, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                {uni}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Tasks */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-4">Задачи</h3>
                      <div className="space-y-3">
                        {roadmap.tasks.map((task) => (
                          <div
                            key={task.id}
                            className={`border rounded-lg p-4 transition-colors ${
                              task.completed
                                ? 'bg-muted/50 border-border/40'
                                : `${getPriorityColor(task.priority)}`
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleTask(roadmap.id, task.id, task.completed)}
                                className="mt-0.5 flex-shrink-0"
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-primary" />
                                ) : (
                                  <Circle className="w-5 h-5 text-muted-foreground" />
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <h4 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                    {task.title}
                                  </h4>
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getPriorityBadgeColor(task.priority)}`}>
                                    {getPriorityText(task.priority)}
                                  </span>
                                </div>
                                <p className={`text-sm mb-2 ${task.completed ? 'text-muted-foreground' : ''}`}>
                                  {task.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>Дедлайн: {task.deadline}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border/60 rounded-lg max-w-3xl w-full my-8">
            <div className="p-6 border-b border-border/40 flex items-center justify-between sticky top-0 bg-card z-10">
              <h2 className="text-xl font-bold">Создать новый роадмап</h2>
              <button
                onClick={() => { setShowCreateModal(false); resetForm(); }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Тип цели *</label>
                <select
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as RoadmapGoalType })}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="university">Поступление в университет</option>
                  <option value="olympiad">Победа в олимпиаде</option>
                  <option value="grades">Выйти на пятерки</option>
                  <option value="exam">Подготовка к экзамену</option>
                  <option value="custom">Другая цель</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Название цели *</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="Например: Поступить в Назарбаев Университет"
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              {/* Target Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Целевая дата (опционально)</label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Когда ты планируешь достичь эту цель?
                </p>
              </div>

              {/* University */}
              {newGoal.type === 'university' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Целевой университет *</label>
                    <input
                      type="text"
                      value={newGoal.targetUniversity}
                      onChange={(e) => setNewGoal({ ...newGoal, targetUniversity: e.target.value })}
                      placeholder="Назарбаев Университет"
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Portfolio Section */}
                  <div className="border border-border/60 rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold text-lg">Портфолио *</h3>
                    <p className="text-sm text-muted-foreground">
                      Заполни информацию о себе для более точных рекомендаций от ИИ
                    </p>

                    {/* GPA */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Средний балл (GPA) *</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={newGoal.portfolio.gpa}
                        onChange={(e) => setNewGoal({
                          ...newGoal,
                          portfolio: { ...newGoal.portfolio, gpa: parseFloat(e.target.value) }
                        })}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>

                    {/* Achievements */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Достижения</label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Призы олимпиад, конкурсов, соревнований
                      </p>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newGoal.tempInputs.achievement}
                          onChange={(e) => setNewGoal({
                            ...newGoal,
                            tempInputs: { ...newGoal.tempInputs, achievement: e.target.value }
                          })}
                          onKeyPress={(e) => e.key === 'Enter' && addArrayItem('achievements')}
                          placeholder="Например: Призер республиканской олимпиады по математике"
                          className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                        <button
                          onClick={() => addArrayItem('achievements')}
                          className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {newGoal.portfolio.achievements.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 mb-2">
                          <span className="flex-1 text-sm">{item}</span>
                          <button onClick={() => removeArrayItem('achievements', index)} className="p-1 hover:bg-background rounded">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Activities */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Внеклассная активность</label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Клубы, волонтерство, общественная работа
                      </p>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newGoal.tempInputs.activity}
                          onChange={(e) => setNewGoal({
                            ...newGoal,
                            tempInputs: { ...newGoal.tempInputs, activity: e.target.value }
                          })}
                          onKeyPress={(e) => e.key === 'Enter' && addArrayItem('activities')}
                          placeholder="Например: Волонтер в детском доме"
                          className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                        <button onClick={() => addArrayItem('activities')} className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {newGoal.portfolio.activities.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 mb-2">
                          <span className="flex-1 text-sm">{item}</span>
                          <button onClick={() => removeArrayItem('activities', index)} className="p-1 hover:bg-background rounded">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Projects */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Проекты</label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Научные, творческие, бизнес-проекты
                      </p>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newGoal.tempInputs.project}
                          onChange={(e) => setNewGoal({
                            ...newGoal,
                            tempInputs: { ...newGoal.tempInputs, project: e.target.value }
                          })}
                          onKeyPress={(e) => e.key === 'Enter' && addArrayItem('projects')}
                          placeholder="Например: Разработка мобильного приложения"
                          className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                        <button onClick={() => addArrayItem('projects')} className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {newGoal.portfolio.projects.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 mb-2">
                          <span className="flex-1 text-sm">{item}</span>
                          <button onClick={() => removeArrayItem('projects', index)} className="p-1 hover:bg-background rounded">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Certifications */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Сертификаты</label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Курсы, языковые экзамены, тренинги
                      </p>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newGoal.tempInputs.certification}
                          onChange={(e) => setNewGoal({
                            ...newGoal,
                            tempInputs: { ...newGoal.tempInputs, certification: e.target.value }
                          })}
                          onKeyPress={(e) => e.key === 'Enter' && addArrayItem('certifications')}
                          placeholder="Например: Сертификат Python (Coursera)"
                          className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                        <button onClick={() => addArrayItem('certifications')} className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {newGoal.portfolio.certifications.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 mb-2">
                          <span className="flex-1 text-sm">{item}</span>
                          <button onClick={() => removeArrayItem('certifications', index)} className="p-1 hover:bg-background rounded">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Leadership */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Лидерство</label>
                      <p className="text-xs text-muted-foreground mb-2">
                        Руководящие позиции в школе, командах, организациях
                      </p>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newGoal.tempInputs.leadership}
                          onChange={(e) => setNewGoal({
                            ...newGoal,
                            tempInputs: { ...newGoal.tempInputs, leadership: e.target.value }
                          })}
                          onKeyPress={(e) => e.key === 'Enter' && addArrayItem('leadership')}
                          placeholder="Например: Президент ученического самоуправления"
                          className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                        <button onClick={() => addArrayItem('leadership')} className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {newGoal.portfolio.leadership.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 mb-2">
                          <span className="flex-1 text-sm">{item}</span>
                          <button onClick={() => removeArrayItem('leadership', index)} className="p-1 hover:bg-background rounded">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Test Scores */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Результаты тестов (опционально)</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">ЕНТ</label>
                          <input
                            type="number"
                            min="0"
                            max="140"
                            value={newGoal.portfolio.testScores?.ent || ''}
                            onChange={(e) => setNewGoal({
                              ...newGoal,
                              portfolio: {
                                ...newGoal.portfolio,
                                testScores: {
                                  ...newGoal.portfolio.testScores,
                                  ent: e.target.value ? parseInt(e.target.value) : undefined
                                }
                              }
                            })}
                            placeholder="0-140"
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">SAT</label>
                          <input
                            type="number"
                            min="400"
                            max="1600"
                            value={newGoal.portfolio.testScores?.sat || ''}
                            onChange={(e) => setNewGoal({
                              ...newGoal,
                              portfolio: {
                                ...newGoal.portfolio,
                                testScores: {
                                  ...newGoal.portfolio.testScores,
                                  sat: e.target.value ? parseInt(e.target.value) : undefined
                                }
                              }
                            })}
                            placeholder="400-1600"
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">IELTS</label>
                          <input
                            type="number"
                            min="0"
                            max="9"
                            step="0.5"
                            value={newGoal.portfolio.testScores?.ielts || ''}
                            onChange={(e) => setNewGoal({
                              ...newGoal,
                              portfolio: {
                                ...newGoal.portfolio,
                                testScores: {
                                  ...newGoal.portfolio.testScores,
                                  ielts: e.target.value ? parseFloat(e.target.value) : undefined
                                }
                              }
                            })}
                            placeholder="0-9"
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">TOEFL</label>
                          <input
                            type="number"
                            min="0"
                            max="120"
                            value={newGoal.portfolio.testScores?.toefl || ''}
                            onChange={(e) => setNewGoal({
                              ...newGoal,
                              portfolio: {
                                ...newGoal.portfolio,
                                testScores: {
                                  ...newGoal.portfolio.testScores,
                                  toefl: e.target.value ? parseInt(e.target.value) : undefined
                                }
                              }
                            })}
                            placeholder="0-120"
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Subject */}
              {(newGoal.type === 'olympiad' || newGoal.type === 'exam') && (
                <div>
                  <label className="block text-sm font-medium mb-2">Предмет *</label>
                  <select
                    value={newGoal.targetSubject}
                    onChange={(e) => setNewGoal({ ...newGoal, targetSubject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="">Выберите предмет</option>
                    {Object.entries(subjectNames).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border/40 flex gap-3 justify-end">
              <button
                onClick={() => { setShowCreateModal(false); resetForm(); }}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={createRoadmap}
                disabled={creating || !newGoal.title}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Создание...' : 'Создать роадмап'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2026 FM Edu. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
