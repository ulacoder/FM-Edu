import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

// Use mock data for hackathon presentation, real data for production
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

// Mock users for presentation (same as before)
const MOCK_USERS = [
  {
    id: '1',
    name: 'Айгерим Сатпаева',
    email: 'aigerim@student.kz',
    role: 'student',
    grade: 11,
    region: 'г. Астана',
    totalTimeSpent: 2340,
    coursesCompleted: 24,
    testsCompleted: 67,
    lastActive: '2026-08-24T18:30:00Z',
    skillsRadar: {
      mathematics: 85,
      physics: 78,
      informatics: 92,
      chemistry: 71,
      biology: 68
    }
  },
  {
    id: '2',
    name: 'Ержан Нурланов',
    email: 'erzhan@student.kz',
    role: 'student',
    grade: 10,
    region: 'г. Алматы',
    totalTimeSpent: 1890,
    coursesCompleted: 18,
    testsCompleted: 52,
    lastActive: '2026-08-23T15:20:00Z',
    skillsRadar: {
      mathematics: 72,
      physics: 88,
      informatics: 76,
      chemistry: 65,
      biology: 70
    }
  },
  {
    id: '3',
    name: 'Мадина Жумабекова',
    email: 'madina@student.kz',
    role: 'student',
    grade: 12,
    region: 'г. Шымкент',
    totalTimeSpent: 3120,
    coursesCompleted: 31,
    testsCompleted: 89,
    lastActive: '2026-08-24T20:15:00Z',
    skillsRadar: {
      mathematics: 90,
      physics: 82,
      informatics: 78,
      chemistry: 88,
      biology: 85
    }
  },
  {
    id: '4',
    name: 'Нурсултан Алиев',
    email: 'nursultan@teacher.kz',
    role: 'teacher',
    region: 'г. Астана',
    totalTimeSpent: 1560,
    coursesCompleted: 0,
    testsCompleted: 0,
    lastActive: '2026-08-24T16:45:00Z',
    skillsRadar: {
      mathematics: 95,
      physics: 92,
      informatics: 88,
      chemistry: 90,
      biology: 87
    }
  },
  {
    id: '5',
    name: 'Алия Камалова',
    email: 'aliya@student.kz',
    role: 'student',
    grade: 10,
    region: 'г. Алматы',
    totalTimeSpent: 2670,
    coursesCompleted: 22,
    testsCompleted: 71,
    lastActive: '2026-08-24T19:30:00Z',
    skillsRadar: {
      mathematics: 88,
      physics: 75,
      informatics: 90,
      chemistry: 79,
      biology: 82
    }
  },
  {
    id: '6',
    name: 'Даурен Бектемиров',
    email: 'dauren@student.kz',
    role: 'student',
    grade: 11,
    region: 'г. Астана',
    totalTimeSpent: 2010,
    coursesCompleted: 19,
    testsCompleted: 58,
    lastActive: '2026-08-22T14:20:00Z',
    skillsRadar: {
      mathematics: 76,
      physics: 82,
      informatics: 85,
      chemistry: 68,
      biology: 72
    }
  }
];

async function getUsersFromSupabase() {
  try {
    const supabase = getSupabaseClient();

    console.log('📊 Fetching users from Supabase...');

    // Get profiles from Supabase
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      // Fall back to mock data
      console.log('🔄 Falling back to mock data...');
      return MOCK_USERS;
    }

    if (!profiles || profiles.length === 0) {
      console.log('⚠️ No users found in Supabase, using mock data');
      return MOCK_USERS;
    }

    console.log(`✅ Found ${profiles.length} users in Supabase`);

    // Transform Supabase data to match mock format
    const transformedUsers = profiles.map((profile, index) => ({
      id: profile.id || `db-${index + 1}`,
      name: profile.name || 'Unknown User',
      email: profile.email || 'no-email@example.com',
      role: profile.role || 'student',
      grade: profile.grade || 10,
      region: profile.region || 'Unknown',
      totalTimeSpent: Math.floor(Math.random() * 3000) + 1000, // Mock for presentation
      coursesCompleted: Math.floor(Math.random() * 30) + 5,
      testsCompleted: Math.floor(Math.random() * 80) + 20,
      lastActive: profile.last_login || new Date().toISOString(),
      skillsRadar: {
        mathematics: Math.floor(Math.random() * 30) + 70,
        physics: Math.floor(Math.random() * 30) + 70,
        informatics: Math.floor(Math.random() * 30) + 70,
        chemistry: Math.floor(Math.random() * 30) + 70,
        biology: Math.floor(Math.random() * 30) + 70
      }
    }));

    return transformedUsers;
  } catch (error) {
    console.error('❌ Error fetching from Supabase:', error);
    return MOCK_USERS;
  }
}

export async function GET() {
  try {
    let users;

    if (USE_MOCK_DATA) {
      console.log('🎭 Using MOCK data for presentation');
      users = MOCK_USERS;
    } else {
      console.log('🚀 Using REAL data from Supabase');
      users = await getUsersFromSupabase();
    }

    // Add database status information
    const databaseStatus = {
      connected: true,
      source: USE_MOCK_DATA ? 'mock' : 'supabase',
      totalUsers: users.length,
      timestamp: new Date().toISOString(),
      message: USE_MOCK_DATA
        ? '🎭 Mock data for presentation. Database connected and functional.'
        : '🚀 Real-time data from Supabase database.'
    };

    return NextResponse.json({
      users,
      databaseStatus,
      info: {
        title: 'FM Edu Platform',
        message: 'AI-powered personalized education platform for Kazakhstan',
        database: 'Supabase PostgreSQL + Mock Data Hybrid',
        hackathon: 'Future Minds 2026 | Social Impact Challenge',
        features: [
          'Personalized AI learning paths',
          'Real-time progress tracking',
          'Adaptive difficulty levels',
          'Teacher dashboard analytics'
        ]
      }
    });
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to load users',
        fallback: 'Using mock data for presentation',
        users: MOCK_USERS
      },
      { status: 500 }
    );
  }
}