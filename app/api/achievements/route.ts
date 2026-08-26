import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

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

    // Получаем заработанные achievements
    const { data: earnedAchievements, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('Error fetching achievements:', error);
      return NextResponse.json(
        { error: 'Failed to fetch achievements' },
        { status: 500 }
      );
    }

    // Все доступные achievements с описаниями
    const allAchievements = [
      {
        type: 'first_course',
        name: 'Первый шаг',
        description: 'Завершите первый курс',
        icon: '🎯',
        category: 'progress'
      },
      {
        type: 'course_completed',
        name: 'Финишёр',
        description: 'Завершите любой курс',
        icon: '🏆',
        category: 'progress'
      },
      {
        type: 'five_courses',
        name: 'Пятёрка',
        description: 'Завершите 5 курсов',
        icon: '⭐',
        category: 'progress'
      },
      {
        type: 'ten_courses',
        name: 'Десятка',
        description: 'Завершите 10 курсов',
        icon: '💎',
        category: 'progress'
      },
      {
        type: 'streak_3days',
        name: 'Огонёк',
        description: 'Занимайтесь 3 дня подряд',
        icon: '🔥',
        category: 'streak'
      },
      {
        type: 'streak_7days',
        name: 'Неделя силы',
        description: 'Занимайтесь 7 дней подряд',
        icon: '💪',
        category: 'streak'
      },
      {
        type: 'streak_30days',
        name: 'Месячный марафон',
        description: 'Занимайтесь 30 дней подряд',
        icon: '🚀',
        category: 'streak'
      },
      {
        type: 'perfect_score',
        name: 'Перфекционист',
        description: 'Получите 100% на тесте',
        icon: '💯',
        category: 'performance'
      },
      {
        type: 'fast_learner',
        name: 'Быстрый ум',
        description: 'Завершите курс за один день',
        icon: '⚡',
        category: 'performance'
      },
      {
        type: 'early_bird',
        name: 'Ранняя пташка',
        description: 'Занимайтесь до 8 утра',
        icon: '🌅',
        category: 'habit'
      },
      {
        type: 'night_owl',
        name: 'Сова',
        description: 'Занимайтесь после 22:00',
        icon: '🦉',
        category: 'habit'
      },
      {
        type: 'team_player',
        name: 'Командный игрок',
        description: 'Вступите в команду через Networking',
        icon: '🤝',
        category: 'social'
      },
      {
        type: 'diagnostic_master',
        name: 'Диагност',
        description: 'Пройдите диагностику по всем предметам',
        icon: '🎓',
        category: 'progress'
      }
    ];

    // Формируем ответ с earned/locked статусом
    const achievementsWithStatus = allAchievements.map(achievement => {
      const earned = earnedAchievements?.find(e => e.achievement_type === achievement.type);
      return {
        ...achievement,
        isEarned: !!earned,
        earnedAt: earned?.earned_at || null,
        metadata: earned?.metadata || null
      };
    });

    // Группируем по категориям
    const grouped = {
      progress: achievementsWithStatus.filter(a => a.category === 'progress'),
      streak: achievementsWithStatus.filter(a => a.category === 'streak'),
      performance: achievementsWithStatus.filter(a => a.category === 'performance'),
      habit: achievementsWithStatus.filter(a => a.category === 'habit'),
      social: achievementsWithStatus.filter(a => a.category === 'social')
    };

    const earnedCount = achievementsWithStatus.filter(a => a.isEarned).length;
    const totalCount = allAchievements.length;

    return NextResponse.json({
      achievements: achievementsWithStatus,
      grouped,
      stats: {
        earned: earnedCount,
        total: totalCount,
        percentage: Math.round((earnedCount / totalCount) * 100)
      }
    });

  } catch (error: any) {
    console.error('Achievements fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}
