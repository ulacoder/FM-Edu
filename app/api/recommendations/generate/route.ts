import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { qwenChat } from '@/lib/qwen';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Получаем профиль пользователя
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, name, grade, personality_type, region')
      .eq('id', userId)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // 2. Получаем прогресс по курсам
    const { data: courseProgress } = await supabase
      .from('course_progress')
      .select('course_id, status, completed_lessons, total_lessons, correct_answers, total_answers')
      .eq('user_id', userId);

    // 3. Получаем результаты диагностики (если есть)
    const { data: diagnosticResults } = await supabase
      .from('diagnostic_results')
      .select('subject, score, weak_topics, completed_at')
      .eq('student_id', userId)
      .order('completed_at', { ascending: false })
      .limit(3);

    // 4. Получаем streak данные
    const { data: streak } = await supabase
      .from('learning_streaks')
      .select('current_streak, longest_streak, total_learning_days')
      .eq('user_id', userId)
      .single();

    // 5. Получаем список всех доступных курсов
    const availableCourses = [
      { id: 'math-algebra', title: 'Алгебра', subject: 'Математика', grade: 10, difficulty: 'medium', topics: ['Уравнения', 'Неравенства', 'Функции'] },
      { id: 'math-geometry', title: 'Геометрия', subject: 'Математика', grade: 10, difficulty: 'medium', topics: ['Треугольники', 'Окружности', 'Векторы'] },
      { id: 'physics-mechanics', title: 'Механика', subject: 'Физика', grade: 10, difficulty: 'hard', topics: ['Законы Ньютона', 'Динамика', 'Кинематика'] },
      { id: 'physics-thermodynamics', title: 'Термодинамика', subject: 'Физика', grade: 10, difficulty: 'medium', topics: ['Температура', 'Теплота', 'Газы'] },
      { id: 'chemistry-basic', title: 'Основы химии', subject: 'Химия', grade: 10, difficulty: 'medium', topics: ['Атомы', 'Молекулы', 'Реакции'] },
      { id: 'biology-cell', title: 'Клеточная биология', subject: 'Биология', grade: 10, difficulty: 'easy', topics: ['Клетка', 'ДНК', 'Митоз'] },
      { id: 'english-grammar', title: 'Грамматика английского', subject: 'Английский', grade: 10, difficulty: 'medium', topics: ['Времена', 'Модальные глаголы', 'Пассив'] },
      { id: 'history-kazakhstan', title: 'История Казахстана', subject: 'История', grade: 10, difficulty: 'easy', topics: ['Средневековье', 'Независимость', 'Культура'] },
      { id: 'computer-science', title: 'Информатика', subject: 'Информатика', grade: 10, difficulty: 'medium', topics: ['Алгоритмы', 'Python', 'Структуры данных'] },
      { id: 'math-trigonometry', title: 'Тригонометрия', subject: 'Математика', grade: 10, difficulty: 'hard', topics: ['Синус', 'Косинус', 'Тангенс', 'Формулы'] },
    ];

    // 6. Формируем промпт для Qwen 3.6
    const completedCourseIds = courseProgress?.filter(c => c.status === 'completed').map(c => c.course_id) || [];
    const inProgressCourseIds = courseProgress?.filter(c => c.status === 'in_progress').map(c => c.course_id) || [];

    const accuracyStats = courseProgress?.reduce((acc, c) => {
      if (c.total_answers > 0) {
        acc.push(`${c.course_id}: ${Math.round((c.correct_answers / c.total_answers) * 100)}%`);
      }
      return acc;
    }, [] as string[]) || [];

    const prompt = `Ты — AI-помощник образовательной платформы FM Edu для учеников НИШ (Назарбаев Интеллектуальные школы) в Казахстане.

**Профиль студента:**
- Имя: ${profile.name}
- Класс: ${profile.grade || 10}
- MBTI: ${profile.personality_type || 'неизвестно'}
- Регион: ${profile.region || 'неизвестно'}
- Текущий streak: ${streak?.current_streak || 0} дней
- Лучший streak: ${streak?.longest_streak || 0} дней
- Всего дней обучения: ${streak?.total_learning_days || 0}

**Завершённые курсы:**
${completedCourseIds.length > 0 ? completedCourseIds.join(', ') : 'Нет завершённых курсов'}

**Курсы в процессе:**
${inProgressCourseIds.length > 0 ? inProgressCourseIds.join(', ') : 'Нет активных курсов'}

**Точность ответов:**
${accuracyStats.length > 0 ? accuracyStats.join('\n') : 'Нет данных'}

**Результаты диагностики:**
${diagnosticResults && diagnosticResults.length > 0
  ? diagnosticResults.map(d => `${d.subject}: ${d.score}% (слабые темы: ${d.weak_topics?.join(', ') || 'нет'})`).join('\n')
  : 'Диагностика не пройдена'}

**Доступные курсы:**
${availableCourses.map(c => `${c.id}: ${c.title} (${c.subject}, сложность: ${c.difficulty}, темы: ${c.topics.join(', ')})`).join('\n')}

**Задача:**
Проанализируй профиль студента и порекомендуй ТОП-5 курсов для изучения. Для каждого курса объясни:
1. **ПОЧЕМУ** именно этот курс подходит студенту (связь с его MBTI, результатами диагностики, пробелами в знаниях)
2. **ЧТО** он получит от прохождения (конкретные навыки)
3. **КАК** это поможет в будущем (связь с целями, экзаменами, карьерой)

**Важно:**
- Учитывай MBTI тип (если известен): INTJ/INTP любят логику и теорию, ESFP/ESFJ — практику и групповую работу
- Если есть слабые темы из диагностики — приоритизируй курсы, которые их закрывают
- Если streak = 0, рекомендуй простые курсы для старта
- Если accuracy низкая (<70%), рекомендуй базовые курсы
- Не рекомендуй уже завершённые курсы

**Формат ответа (строго JSON):**
{
  "recommendations": [
    {
      "courseId": "course-id",
      "title": "Название курса",
      "priority": 1,
      "reasoning": "Подробное объяснение ПОЧЕМУ этот курс для студента (2-3 предложения)",
      "benefits": "ЧТО получит студент (конкретные навыки)",
      "impact": "КАК это поможет в будущем",
      "matchScore": 95
    }
  ],
  "overallReasoning": "Общее объяснение логики подбора курсов (1-2 предложения)"
}

Верни ТОЛЬКО валидный JSON без дополнительного текста.`;

    // 7. Вызываем Qwen 3.6 Flash
    const aiResponse = await qwenChat([
      { role: 'system', content: 'Ты — эксперт в персонализации образовательных треков для школьников НИШ в Казахстане. Отвечай только валидным JSON.' },
      { role: 'user', content: prompt }
    ]);

    // 8. Парсим JSON ответ
    let parsedRecommendations;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      parsedRecommendations = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Failed to parse AI recommendations');
    }

    // 9. Сохраняем рекомендации в БД
    const { data: savedRecommendation, error: saveError } = await supabase
      .from('ai_recommendations')
      .insert({
        user_id: userId,
        recommendations: parsedRecommendations.recommendations,
        reasoning: parsedRecommendations.overallReasoning,
        factors_used: {
          mbti: profile.personality_type,
          grade: profile.grade,
          completed_courses: completedCourseIds.length,
          in_progress_courses: inProgressCourseIds.length,
          streak: streak?.current_streak || 0,
          has_diagnostic: diagnosticResults && diagnosticResults.length > 0
        },
        model_version: 'qwen3.6-flash',
        is_active: true
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving recommendations:', saveError);
    }

    // 10. Деактивируем старые рекомендации
    await supabase
      .from('ai_recommendations')
      .update({ is_active: false })
      .eq('user_id', userId)
      .neq('id', savedRecommendation?.id);

    return NextResponse.json({
      recommendations: parsedRecommendations.recommendations,
      overallReasoning: parsedRecommendations.overallReasoning,
      generatedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Recommendations generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
