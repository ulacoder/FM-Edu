import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET - получить прогресс пользователя по курсу
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: 'User ID and Course ID are required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: progress, error } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching progress:', error);
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      );
    }

    if (!progress) {
      return NextResponse.json({
        hasProgress: false,
        progress: {
          completed_lessons: 0,
          total_lessons: 0,
          status: 'not_started',
          accuracy: 0
        }
      });
    }

    const accuracy = progress.total_answers > 0
      ? Math.round((progress.correct_answers / progress.total_answers) * 100)
      : 0;

    return NextResponse.json({
      hasProgress: true,
      progress: {
        ...progress,
        accuracy
      }
    });

  } catch (error: any) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

// POST - обновить прогресс
export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      courseId,
      completedLessons,
      totalLessons,
      currentLessonIndex,
      correctAnswers,
      totalAnswers,
      timeSpentMinutes
    } = await request.json();

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: 'User ID and Course ID are required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Определяем статус
    let status = 'not_started';
    if (completedLessons > 0 && completedLessons < totalLessons) {
      status = 'in_progress';
    } else if (completedLessons === totalLessons && totalLessons > 0) {
      status = 'completed';
    }

    // Проверяем, есть ли уже запись
    const { data: existing } = await supabase
      .from('course_progress')
      .select('id, status')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    let result;

    if (existing) {
      // Обновляем существующую запись
      const updateData: any = {
        completed_lessons: completedLessons,
        total_lessons: totalLessons,
        current_lesson_index: currentLessonIndex,
        status,
        last_activity: new Date().toISOString()
      };

      if (correctAnswers !== undefined) {
        updateData.correct_answers = correctAnswers;
      }
      if (totalAnswers !== undefined) {
        updateData.total_answers = totalAnswers;
      }
      if (timeSpentMinutes !== undefined) {
        updateData.time_spent_minutes = timeSpentMinutes;
      }

      // Если курс завершён и раньше не был завершён, записываем completed_at
      if (status === 'completed' && existing.status !== 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('course_progress')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;

      // Если курс только что завершён, обновляем streak и проверяем achievements
      if (status === 'completed' && existing.status !== 'completed') {
        await updateStreakAndAchievements(userId, supabase);
      }

    } else {
      // Создаём новую запись
      const { data, error } = await supabase
        .from('course_progress')
        .insert({
          user_id: userId,
          course_id: courseId,
          completed_lessons: completedLessons,
          total_lessons: totalLessons,
          current_lesson_index: currentLessonIndex,
          status,
          correct_answers: correctAnswers || 0,
          total_answers: totalAnswers || 0,
          time_spent_minutes: timeSpentMinutes || 0,
          started_at: new Date().toISOString(),
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .select()
        .single();

      if (error) throw error;
      result = data;

      // Обновляем streak при первом прогрессе
      await updateStreakAndAchievements(userId, supabase);
    }

    return NextResponse.json({
      success: true,
      progress: result
    });

  } catch (error: any) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update progress' },
      { status: 500 }
    );
  }
}

// Вспомогательная функция для обновления streak и проверки achievements
async function updateStreakAndAchievements(userId: string, supabase: any) {
  try {
    // Вызываем SQL функцию для обновления streak
    await supabase.rpc('update_learning_streak', { p_user_id: userId });

    // Вызываем SQL функцию для проверки achievements
    await supabase.rpc('check_and_grant_achievements', { p_user_id: userId });
  } catch (error) {
    console.error('Error updating streak/achievements:', error);
    // Не бросаем ошибку, чтобы не блокировать сохранение прогресса
  }
}
