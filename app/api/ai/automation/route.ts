import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const QWEN_API_KEY = process.env.QWEN_API_KEY;
const QWEN_API_URL = process.env.QWEN_API_URL;

export async function POST(request: NextRequest) {
  try {
    const { studentId, action, data } = await request.json();

    console.log('AI Automation:', action, 'for student:', studentId);

    switch (action) {
      case 'analyze_progress':
        return await analyzeStudentProgress(studentId, data);

      case 'save_lesson_completion':
        return await saveLessonCompletion(studentId, data);

      case 'track_video_watched':
        return await trackVideoWatched(studentId, data);

      case 'save_test_result':
        return await saveTestResult(studentId, data);

      case 'get_student_analytics':
        return await getStudentAnalytics(studentId);

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('AI Automation error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// Analyze student progress with AI
async function analyzeStudentProgress(studentId: string, data: any) {
  const memoryPath = path.join(process.cwd(), 'data', 'ai-memory.json');
  const memory = fs.existsSync(memoryPath) ? JSON.parse(fs.readFileSync(memoryPath, 'utf8')) : [];

  // Get student's history
  const studentHistory = memory.filter((entry: any) => entry.studentId === studentId);

  // AI analyzes patterns
  const prompt = `Проанализируй прогресс ученика за последние занятия:

${studentHistory.slice(-10).map((entry: any) => `
- Тема: ${entry.topicTitle} (${entry.subject})
- Результат: ${entry.testResult?.percentage || 'N/A'}%
- Дата: ${new Date(entry.timestamp).toLocaleDateString('ru-RU')}
`).join('\n')}

Дай краткий анализ (3-5 предложений):
1. Какие предметы даются легче
2. Где основные трудности
3. Общая динамика прогресса
4. Рекомендации`;

  const response = await fetch(`${QWEN_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${QWEN_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen-plus',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  const aiData = await response.json();
  const analysis = aiData.choices[0].message.content;

  return NextResponse.json({ analysis, historyCount: studentHistory.length });
}

// Save lesson completion
async function saveLessonCompletion(studentId: string, data: any) {
  const { topicId, subject, topicTitle, videoWatched, testPassed, testScore } = data;

  const completionsPath = path.join(process.cwd(), 'data', 'lesson-completions.json');
  let completions = fs.existsSync(completionsPath)
    ? JSON.parse(fs.readFileSync(completionsPath, 'utf8'))
    : [];

  completions.push({
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    studentId,
    topicId,
    subject,
    topicTitle,
    videoWatched,
    testPassed,
    testScore,
    completedAt: new Date().toISOString()
  });

  fs.writeFileSync(completionsPath, JSON.stringify(completions, null, 2));

  console.log('✅ Saved lesson completion to database');

  return NextResponse.json({ success: true, saved: true });
}

// Track video watched
async function trackVideoWatched(studentId: string, data: any) {
  const { topicId, subject, topicTitle, watchDuration } = data;

  const videoTracksPath = path.join(process.cwd(), 'data', 'video-tracking.json');
  let tracks = fs.existsSync(videoTracksPath)
    ? JSON.parse(fs.readFileSync(videoTracksPath, 'utf8'))
    : [];

  tracks.push({
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    studentId,
    topicId,
    subject,
    topicTitle,
    watchDuration: watchDuration || 0,
    watchedAt: new Date().toISOString()
  });

  fs.writeFileSync(videoTracksPath, JSON.stringify(tracks, null, 2));

  console.log('✅ Tracked video watching');

  return NextResponse.json({ success: true, tracked: true });
}

// Save test result
async function saveTestResult(studentId: string, data: any) {
  const { topicId, subject, topicTitle, score, maxScore, percentage, passed, answers } = data;

  const resultsPath = path.join(process.cwd(), 'data', 'test-results.json');
  let results = fs.existsSync(resultsPath)
    ? JSON.parse(fs.readFileSync(resultsPath, 'utf8'))
    : [];

  results.push({
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    studentId,
    topicId,
    subject,
    topicTitle,
    score,
    maxScore,
    percentage,
    passed,
    answersCount: answers?.length || 0,
    completedAt: new Date().toISOString()
  });

  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  console.log('✅ Saved test result to database');

  return NextResponse.json({ success: true, saved: true });
}

// Get student analytics
async function getStudentAnalytics(studentId: string) {
  const completionsPath = path.join(process.cwd(), 'data', 'lesson-completions.json');
  const resultsPath = path.join(process.cwd(), 'data', 'test-results.json');
  const videoTracksPath = path.join(process.cwd(), 'data', 'video-tracking.json');

  const completions = fs.existsSync(completionsPath)
    ? JSON.parse(fs.readFileSync(completionsPath, 'utf8')).filter((c: any) => c.studentId === studentId)
    : [];

  const results = fs.existsSync(resultsPath)
    ? JSON.parse(fs.readFileSync(resultsPath, 'utf8')).filter((r: any) => r.studentId === studentId)
    : [];

  const videos = fs.existsSync(videoTracksPath)
    ? JSON.parse(fs.readFileSync(videoTracksPath, 'utf8')).filter((v: any) => v.studentId === studentId)
    : [];

  const analytics = {
    totalLessonsCompleted: completions.length,
    totalTestsTaken: results.length,
    totalVideosWatched: videos.length,
    averageTestScore: results.length > 0
      ? Math.round(results.reduce((sum: number, r: any) => sum + r.percentage, 0) / results.length)
      : 0,
    passedTests: results.filter((r: any) => r.passed).length,
    failedTests: results.filter((r: any) => !r.passed).length,
    subjectBreakdown: getSubjectBreakdown(results),
    recentActivity: completions.slice(-5)
  };

  return NextResponse.json(analytics);
}

function getSubjectBreakdown(results: any[]) {
  const breakdown: any = {};

  results.forEach((result: any) => {
    if (!breakdown[result.subject]) {
      breakdown[result.subject] = {
        count: 0,
        totalScore: 0,
        passed: 0
      };
    }

    breakdown[result.subject].count++;
    breakdown[result.subject].totalScore += result.percentage;
    if (result.passed) breakdown[result.subject].passed++;
  });

  Object.keys(breakdown).forEach(subject => {
    breakdown[subject].averageScore = Math.round(
      breakdown[subject].totalScore / breakdown[subject].count
    );
  });

  return breakdown;
}
