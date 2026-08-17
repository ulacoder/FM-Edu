import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { findById, create, findBy, update, generateId } from '@/lib/db';
import { Assignment, StudentProgress, AssignmentScore, StudentAnswer } from '@/types';
import { qwenChat } from '@/lib/qwen';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');
    const user = getUserFromToken(token || '');

    if (!user || user.role !== 'student') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { assignmentId, answers } = body as { assignmentId: string; answers: number[] };

    // Получаем задание
    const assignment = findById<Assignment>('assignments', assignmentId);
    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Подсчёт баллов и генерация AI-обратной связи
    const studentAnswers: StudentAnswer[] = [];
    let totalScore = 0;
    let maxScore = 0;

    for (let i = 0; i < assignment.questions.length; i++) {
      const question = assignment.questions[i];
      const userAnswer = answers[i];
      const isCorrect = userAnswer === question.correctAnswer;

      maxScore += question.points;
      if (isCorrect) {
        totalScore += question.points;
      }

      // Генерация персонализированной обратной связи через AI
      let aiFeedback = question.explanation;

      if (!isCorrect) {
        try {
          const feedbackPrompt = `Ученик ответил неправильно на вопрос.

Вопрос: ${question.text}
Правильный ответ: ${question.options?.[question.correctAnswer as number]}
Ответ ученика: ${question.options?.[userAnswer]}

Объяснение: ${question.explanation}

Дай короткий (2-3 предложения) персонализированный фидбек, который поможет ученику понять ошибку и запомнить правильный ответ.`;

          const aiResponse = await qwenChat([
            { role: 'user', content: feedbackPrompt }
          ]);
          aiFeedback = aiResponse.trim();
        } catch (error) {
          console.error('Error generating AI feedback:', error);
        }
      }

      studentAnswers.push({
        questionId: question.id,
        answer: userAnswer.toString(),
        isCorrect,
        aiFeedback,
      });
    }

    // Сохранение результата
    const score: AssignmentScore = {
      assignmentId,
      score: totalScore,
      maxScore,
      completedAt: new Date(),
      answers: studentAnswers,
    };

    // Обновление прогресса ученика
    const progressList = findBy<StudentProgress>('student-progress',
      (p) => p.studentId === user.userId && p.topicId === assignment.topicId
    );

    if (progressList.length > 0) {
      const progress = progressList[0];
      const updatedScores = [...progress.scores, score];
      const completedAssignments = [...new Set([...progress.completedAssignments, assignmentId])];

      // Обновляем слабые места на основе неправильных ответов
      const weakPoints = studentAnswers
        .filter(a => !a.isCorrect)
        .map(a => {
          const q = assignment.questions.find(q => q.id === a.questionId);
          return q?.text.slice(0, 50) || '';
        });

      update<StudentProgress>('student-progress', progress.id, {
        scores: updatedScores,
        completedAssignments,
        weakPoints: [...new Set([...progress.weakPoints, ...weakPoints])],
        lastActivity: new Date(),
      } as Partial<StudentProgress>);
    } else {
      // Создаём новый прогресс
      const newProgress: StudentProgress = {
        id: generateId(),
        studentId: user.userId,
        topicId: assignment.topicId,
        completedMaterials: [],
        completedAssignments: [assignmentId],
        scores: [score],
        weakPoints: studentAnswers
          .filter(a => !a.isCorrect)
          .map(a => {
            const q = assignment.questions.find(q => q.id === a.questionId);
            return q?.text.slice(0, 50) || '';
          }),
        lastActivity: new Date(),
      };
      create('student-progress', newProgress);
    }

    return NextResponse.json({
      score: totalScore,
      maxScore,
      percentage: Math.round((totalScore / maxScore) * 100),
      answers: studentAnswers,
    });
  } catch (error) {
    console.error('Assignment submit error:', error);
    return NextResponse.json(
      { error: 'Error submitting assignment' },
      { status: 500 }
    );
  }
}
