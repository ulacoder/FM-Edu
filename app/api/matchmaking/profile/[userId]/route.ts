import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Получаем основной профиль
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        students(
          points,
          level,
          streak
        )
      `)
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // 2. Получаем проекты пользователя (где он автор)
    const { data: userProjects, error: projectsError } = await supabase
      .from('project_requests')
      .select(`
        id,
        title,
        status,
        current_members_count,
        max_members,
        created_at
      `)
      .eq('author_id', userId)
      .order('created_at', { ascending: false });

    if (projectsError && projectsError.code !== '42P01') {
      console.error('Projects fetch error:', projectsError);
    }

    // 3. Получаем достижения пользователя (из таблицы achievements если существует)
    let achievements = [];
    try {
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false })
        .limit(5);

      if (achievementsData) {
        achievements = achievementsData.map(ach => ({
          title: ach.title,
          icon: ach.icon || '🏆',
          date: ach.earned_at
        }));
      }
    } catch (error) {
      // Таблица achievements может не существовать
      console.log('Achievements table not available, using default');
      achievements = [
        { title: 'Активный участник сообщества', icon: '👥', date: new Date().toISOString() },
        { title: 'Первый проект создан', icon: '🚀', date: new Date().toISOString() }
      ];
    }

    // 4. Форматируем данные для фронтенда
    const studentData = Array.isArray(profile.students) ? profile.students[0] : profile.students;

    const formattedProfile = {
      id: profile.id,
      name: profile.name,
      avatar_url: profile.avatar_url,
      personality_type: profile.personality_type,
      region: profile.region,
      grade: profile.grade,
      gpa: profile.gpa,
      skills: profile.skills || [],
      interests: profile.interests || [],
      bio: profile.bio || 'Пользователь еще не добавил информацию о себе',
      linkedin: profile.linkedin,
      github: profile.github,
      instagram: profile.instagram,
      behance: profile.behance,
      twitter: profile.twitter,
      website: profile.website,
      points: studentData?.points || 0,
      level: studentData?.level || 1,
      streak: studentData?.streak || 0
    };

    const formattedProjects = (userProjects || []).map(project => ({
      id: project.id,
      name: project.title,
      status: project.status === 'open' ? 'active' : project.status === 'full' ? 'filled' : 'closed',
      members: project.current_members_count,
      max_members: project.max_members,
      created_at: project.created_at
    }));

    return NextResponse.json({
      success: true,
      profile: formattedProfile,
      projects: formattedProjects,
      achievements,
      stats: {
        totalProjects: formattedProjects.length,
        activeProjects: formattedProjects.filter(p => p.status === 'active').length,
        completedProjects: formattedProjects.filter(p => p.status === 'closed').length,
        totalTeamMembers: formattedProjects.reduce((sum, p) => sum + p.members, 0)
      }
    });

  } catch (error) {
    console.error('Unexpected error in profile API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}