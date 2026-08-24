import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { StudentActivity, AIIntervention, LearningSession } from '@/types';

const ACTIVITIES_FILE = path.join(process.cwd(), 'data', 'activities.json');
const SESSIONS_FILE = path.join(process.cwd(), 'data', 'learning-sessions.json');

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || '';
const BASE_URL = 'https://ws-yf8sb129bygmh1i9.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1';

// Инициализация файлов
async function ensureFiles() {
  try {
    await fs.access(ACTIVITIES_FILE);
  } catch {
    await fs.writeFile(ACTIVITIES_FILE, '[]', 'utf-8');
  }
  try {
    await fs.access(SESSIONS_FILE);
  } catch {
    await fs.writeFile(SESSIONS_FILE, '[]', 'utf-8');
  }
}

// Логирование активности
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, type, topicId, subject, duration, metadata } = body;

    if (!studentId || !type) {
      return NextResponse.json(
        { error: 'Не указаны необходимые параметры' },
        { status: 400 }
      );
    }

    await ensureFiles();

    // Записываем активность
    const activitiesData = await fs.readFile(ACTIVITIES_FILE, 'utf-8');
    const activities: StudentActivity[] = JSON.parse(activitiesData);

    const newActivity: StudentActivity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      studentId,
      type,
      topicId,
      subject,
      duration,
      timestamp: new Date(),
      metadata
    };

    activities.push(newActivity);

    // Храним последние 1000 активностей
    const limitedActivities = activities.slice(-1000);
    await fs.writeFile(ACTIVITIES_FILE, JSON.stringify(limitedActivities, null, 2), 'utf-8');

    // Обновляем/создаем сессию
    const sessionsData = await fs.readFile(SESSIONS_FILE, 'utf-8');
    const sessions: LearningSession[] = JSON.parse(sessionsData);

    let currentSession = sessions.find(s =>
      s.studentId === studentId &&
      !s.endTime &&
      (Date.now() - new Date(s.startTime).getTime() < 30 * 60 * 1000) // последние 30 минут
    );

    if (!currentSession) {
      // Создаем новую сессию
      currentSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        studentId,
        subject,
        topicId,
        startTime: new Date(),
        activities: [newActivity],
        interventions: []
      };
      sessions.push(currentSession);
    } else {
      // Обновляем существующую сессию
      currentSession.activities.push(newActivity);
      if (subject) currentSession.subject = subject;
      if (topicId) currentSession.topicId = topicId;
    }

    // Анализируем нужна ли интервенция
    const intervention = await analyzeAndIntervene(currentSession, newActivity);

    if (intervention) {
      currentSession.interventions.push(intervention);

      await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');

      return NextResponse.json({
        success: true,
        activity: newActivity,
        intervention
      });
    }

    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      activity: newActivity
    });

  } catch (error: any) {
    console.error('Error logging activity:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при записи активности' },
      { status: 500 }
    );
  }
}

// Анализ и автономное принятие решения о интервенции
async function analyzeAndIntervene(
  session: LearningSession,
  currentActivity: StudentActivity
): Promise<AIIntervention | null> {
  const now = Date.now();
  const sessionStart = new Date(session.startTime).getTime();
  const sessionDuration = (now - sessionStart) / 1000 / 60; // в минутах

  // Правило 1: Студент на одной теме более 15 минут
  if (currentActivity.topicId) {
    const topicActivities = session.activities.filter(
      a => a.topicId === currentActivity.topicId
    );

    if (topicActivities.length > 0) {
      const firstTopicActivity = topicActivities[0];
      const timeOnTopic = (now - new Date(firstTopicActivity.timestamp).getTime()) / 1000 / 60;

      if (timeOnTopic >= 15) {
        // Студент застрял!
        const intervention: AIIntervention = {
          id: `intervention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          studentId: session.studentId,
          type: 'help_offer',
          reason: `Студент изучает тему ${timeOnTopic.toFixed(1)} минут. Возможно, нужна помощь.`,
          message: await generateInterventionMessage('stuck', {
            timeOnTopic: timeOnTopic.toFixed(1),
            topicId: currentActivity.topicId,
            subject: currentActivity.subject
          }),
          triggerActivity: currentActivity.id,
          timestamp: new Date()
        };

        return intervention;
      }
    }
  }

  // Правило 2: Студент долго учится без перерыва (>45 минут)
  if (sessionDuration >= 45) {
    const recentBreakSuggestions = session.interventions.filter(
      i => i.type === 'break_suggestion' &&
      (now - new Date(i.timestamp).getTime()) < 30 * 60 * 1000
    );

    if (recentBreakSuggestions.length === 0) {
      const intervention: AIIntervention = {
        id: `intervention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        studentId: session.studentId,
        type: 'break_suggestion',
        reason: `Студент учится ${sessionDuration.toFixed(0)} минут без перерыва`,
        message: await generateInterventionMessage('break', {
          sessionDuration: sessionDuration.toFixed(0)
        }),
        timestamp: new Date()
      };

      return intervention;
    }
  }

  // Правило 3: Много попыток теста (>3) - предложить изменить формат
  const recentTests = session.activities.filter(
    a => a.type === 'test_attempt' &&
    (now - new Date(a.timestamp).getTime()) < 20 * 60 * 1000
  );

  if (recentTests.length >= 3) {
    const recentFormatChanges = session.interventions.filter(
      i => i.type === 'format_change' &&
      (now - new Date(i.timestamp).getTime()) < 20 * 60 * 1000
    );

    if (recentFormatChanges.length === 0) {
      const intervention: AIIntervention = {
        id: `intervention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        studentId: session.studentId,
        type: 'format_change',
        reason: `Студент сделал ${recentTests.length} попытки теста. Может быть, нужен другой формат?`,
        message: await generateInterventionMessage('format_change', {
          attempts: recentTests.length,
          subject: currentActivity.subject
        }),
        timestamp: new Date()
      };

      return intervention;
    }
  }

  // Правило 4: Низкая вовлеченность - мало активности за 10 минут
  if (sessionDuration >= 10) {
    const last10MinActivities = session.activities.filter(
      a => (now - new Date(a.timestamp).getTime()) < 10 * 60 * 1000
    );

    if (last10MinActivities.length < 3) {
      const recentMotivation = session.interventions.filter(
        i => i.type === 'motivation' &&
        (now - new Date(i.timestamp).getTime()) < 15 * 60 * 1000
      );

      if (recentMotivation.length === 0) {
        const intervention: AIIntervention = {
          id: `intervention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          studentId: session.studentId,
          type: 'motivation',
          reason: 'Низкая активность за последние 10 минут',
          message: await generateInterventionMessage('motivation', {
            subject: currentActivity.subject
          }),
          timestamp: new Date()
        };

        return intervention;
      }
    }
  }

  return null;
}

// Генерация сообщения интервенции через AI
async function generateInterventionMessage(
  type: string,
  context: Record<string, any>
): Promise<string> {
  try {
    const prompts: Record<string, string> = {
      stuck: `Студент изучает тему уже ${context.timeOnTopic} минут. Предложи помощь тактично и по-дружески. Спроси, может ли ИИ объяснить по-другому или показать примеры. Будь кратким (2-3 предложения).`,
      break: `Студент учится ${context.sessionDuration} минут без перерыва. Предложи сделать короткий перерыв или сыграть в обучающие игры. Будь заботливым и дружелюбным (2-3 предложения).`,
      format_change: `Студент сделал ${context.attempts} попытки теста подряд. Предложи другой формат обучения - видео, практические задачи или объяснение от ИИ. Будь поддерживающим (2-3 предложения).`,
      motivation: `Студент стал менее активен. Подбодри его, напомни о целях и прогрессе. Предложи что-то интересное - игру или новую тему. Будь мотивирующим (2-3 предложения).`
    };

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen3.6-flash',
        messages: [
          {
            role: 'system',
            content: 'Ты - Navi, заботливый ИИ-тьютор. Ты проактивно помогаешь студентам. Отвечай только на русском, используй эмодзи, будь дружелюбным.'
          },
          {
            role: 'user',
            content: prompts[type] || 'Предложи помощь студенту.'
          }
        ],
        temperature: 0.8,
        max_tokens: 200
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices[0]?.message?.content || getDefaultMessage(type);
    }
  } catch (error) {
    console.error('Error generating intervention message:', error);
  }

  return getDefaultMessage(type);
}

function getDefaultMessage(type: string): string {
  const defaults: Record<string, string> = {
    stuck: '👋 Эй, заметил что ты уже давно на этой теме! Может, мне объяснить по-другому или показать примеры? Я здесь чтобы помочь! 💪',
    break: '⏰ Ты уже долго занимаешься! Может, сделаем короткий перерыв? Или сыграем в обучающие игры? Отдых важен для эффективной учебы! 🎮',
    format_change: '🤔 Вижу, что тесты даются непросто. Может, попробуем другой подход? Посмотрим видео или я объясню тему заново? Иногда смена формата очень помогает!',
    motivation: '🌟 Продолжай в том же духе! Ты уже многого достиг. Хочешь попробовать что-то новое? Могу предложить интересную игру или тему! 🚀'
  };

  return defaults[type] || 'Привет! Я здесь чтобы помочь тебе! 😊';
}

// Получение интервенций для студента
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Не указан ID студента' },
        { status: 400 }
      );
    }

    await ensureFiles();

    const sessionsData = await fs.readFile(SESSIONS_FILE, 'utf-8');
    const sessions: LearningSession[] = JSON.parse(sessionsData);

    // Находим активные интервенции
    const activeSession = sessions.find(s =>
      s.studentId === studentId &&
      !s.endTime &&
      (Date.now() - new Date(s.startTime).getTime() < 30 * 60 * 1000)
    );

    const pendingInterventions = activeSession?.interventions.filter(
      i => !i.dismissed
    ) || [];

    return NextResponse.json({
      interventions: pendingInterventions,
      sessionId: activeSession?.id
    });

  } catch (error: any) {
    console.error('Error getting interventions:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при получении интервенций' },
      { status: 500 }
    );
  }
}
