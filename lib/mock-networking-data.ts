// Mock data for FM Edu Networking
// Use this when Supabase is unavailable or for demo purposes

export const MOCK_PROFILES = [
  {
    id: 'user-1',
    name: 'Айбек Нурмуханов',
    avatar_url: null,
    personality_type: 'INTJ',
    region: 'Алматы',
    grade: 11,
    gpa: 3.9,
    skills: ['Python', 'Machine Learning', 'React'],
    interests: ['AI', 'Robotics', 'Web Dev'],
    bio: 'Занимаюсь AI и machine learning. Участвовал в хакатоне Stardance 2025, занял 2 место. Сейчас разрабатываю чат-бота для помощи школьникам с домашкой.',
    linkedin: 'aibek-nurmukhanov',
    github: 'aibeknur',
    achievements: [
      { title: 'Stardance 2025 - 2 место', icon: '🥈', date: '2025-11' },
      { title: 'Olympiad Informatics Regional Winner', icon: '🏆', date: '2025-03' },
      { title: '100 день streak на FM Edu', icon: '🔥', date: '2026-08' }
    ],
    projects: [
      { name: 'AI-ассистент для школьников', status: 'in_progress', members: 2 },
      { name: 'Telegram бот для расписания НИШ', status: 'completed', members: 1 }
    ],
    stats: {
      totalPoints: 8450,
      completedCourses: 12,
      streak: 45,
      rank: 'Gold'
    }
  },
  {
    id: 'user-2',
    name: 'Асель Токтарова',
    avatar_url: null,
    personality_type: 'ENFP',
    region: 'Астана',
    grade: 12,
    gpa: 3.7,
    skills: ['UI/UX Design', 'Figma', 'Illustrator'],
    interests: ['Design', 'Art', 'Psychology'],
    bio: 'UI/UX дизайнер и иллюстратор. Люблю создавать красивые интерфейсы и помогать людям решать их задачи через дизайн. Мечтаю работать в международной продуктовой компании.',
    linkedin: 'asel-toktarova',
    behance: 'aseltoktarova',
    achievements: [
      { title: 'Best Design Award - NIS Hackathon', icon: '🎨', date: '2026-05' },
      { title: 'Portfolio на Behance: 5k просмотров', icon: '👁️', date: '2026-07' },
      { title: 'Figma Community Plugin Published', icon: '🔌', date: '2026-06' }
    ],
    projects: [
      { name: 'Редизайн мобильного приложения для НИШ', status: 'in_progress', members: 1 }
    ],
    stats: {
      totalPoints: 6320,
      completedCourses: 8,
      streak: 28,
      rank: 'Silver'
    }
  },
  {
    id: 'user-3',
    name: 'Даурен Сейтов',
    avatar_url: null,
    personality_type: 'ISTJ',
    region: 'Шымкент',
    grade: 10,
    gpa: 3.8,
    skills: ['Java', 'SQL', 'Backend'],
    interests: ['Programming', 'Math', 'Physics'],
    bio: 'Backend разработчик на Java. Интересуюсь алгоритмами и структурами данных. Готовлюсь к олимпиадам по информатике и хочу поступить в KAIST.',
    linkedin: 'dauren-seitov',
    github: 'daurseit',
    achievements: [
      { title: 'IEO Regional Qualifier', icon: '💻', date: '2026-04' },
      { title: 'Codeforces Expert (1600+)', icon: '⚡', date: '2026-08' },
      { title: 'Contributed to Open Source', icon: '🌐', date: '2026-07' }
    ],
    projects: [
      { name: 'Онлайн-платформа для олимпиад', status: 'in_progress', members: 3 }
    ],
    stats: {
      totalPoints: 9120,
      completedCourses: 15,
      streak: 67,
      rank: 'Gold'
    }
  },
  {
    id: 'user-4',
    name: 'Жанар Алтынбекова',
    avatar_url: null,
    personality_type: 'ESFJ',
    region: 'Караганда',
    grade: 11,
    gpa: 3.6,
    skills: ['Marketing', 'SMM', 'Content Writing'],
    interests: ['Business', 'Psychology', 'Languages'],
    bio: 'Занимаюсь маркетингом и SMM. Веду блог о саморазвитии для школьников. Хочу открыть свой EdTech стартап после университета.',
    linkedin: 'zhanar-altynbekova',
    instagram: '@zhanar.study',
    achievements: [
      { title: 'Instagram 10k followers', icon: '📱', date: '2026-06' },
      { title: 'NIS Debate Champion', icon: '🎤', date: '2026-03' },
      { title: 'Volunteering 100+ hours', icon: '🤝', date: '2026-08' }
    ],
    projects: [],
    stats: {
      totalPoints: 5200,
      completedCourses: 6,
      streak: 21,
      rank: 'Silver'
    }
  },
  {
    id: 'user-5',
    name: 'Ержан Бекбосынов',
    avatar_url: null,
    personality_type: 'ENTP',
    region: 'Алматы',
    grade: 12,
    gpa: 4.0,
    skills: ['iOS Development', 'Swift', 'Flutter'],
    interests: ['Mobile Dev', 'Startups', 'Tech'],
    bio: 'iOS разработчик и предприниматель. Запустил 2 приложения в App Store с 50k+ загрузок. Сейчас работаю над стартапом в сфере EdTech.',
    linkedin: 'yerzhan-bekbosynov',
    github: 'yerzhanbek',
    achievements: [
      { title: 'App Store: 50k downloads', icon: '📲', date: '2026-05' },
      { title: 'Startup Weekend Winner', icon: '🚀', date: '2026-02' },
      { title: 'Apple WWDC Scholar 2026', icon: '🍎', date: '2026-06' }
    ],
    projects: [
      { name: 'Платформа для обмена учебниками', status: 'in_progress', members: 2 }
    ],
    stats: {
      totalPoints: 11200,
      completedCourses: 18,
      streak: 89,
      rank: 'Platinum'
    }
  }
];

export const MOCK_PROJECT_REQUESTS = [
  {
    id: 'project-1',
    author_id: 'user-1',
    domain: 'AI & Robotics',
    title: 'AI-ассистент для школьников',
    description: 'Разрабатываем чат-бота на базе GPT для помощи ученикам с домашкой. Нужны программисты и дизайнеры.',
    user_skills: ['Python', 'Machine Learning', 'Backend'],
    looking_for_skills: ['Frontend', 'UI/UX', 'Mobile Dev'],
    max_members: 4,
    current_members_count: 2,
    target_mbti_filter: 'INTJ',
    mbti_match_mode: 'auto',
    status: 'open',
    created_at: '2026-08-28T10:00:00Z',
    updated_at: '2026-08-28T10:00:00Z',
    author: {
      id: 'user-1',
      name: 'Айбек Нурмуханов',
      avatar_url: null,
      personality_type: 'INTJ'
    }
  },
  {
    id: 'project-2',
    author_id: 'user-2',
    domain: 'Design & UX',
    title: 'Редизайн мобильного приложения для НИШ',
    description: 'Делаем крутое приложение для расписания и оценок НИШ. Ищем разработчиков!',
    user_skills: ['UI/UX Design', 'Figma', 'Prototyping'],
    looking_for_skills: ['React Native', 'Flutter', 'Backend'],
    max_members: 5,
    current_members_count: 1,
    target_mbti_filter: null,
    mbti_match_mode: 'any',
    status: 'open',
    created_at: '2026-08-29T14:30:00Z',
    updated_at: '2026-08-29T14:30:00Z',
    author: {
      id: 'user-2',
      name: 'Асель Токтарова',
      avatar_url: null,
      personality_type: 'ENFP'
    }
  },
  {
    id: 'project-3',
    author_id: 'user-5',
    domain: 'Startups & Business',
    title: 'Платформа для обмена учебниками',
    description: 'Создаём маркетплейс где школьники могут продавать/обменивать учебники. Нужна команда!',
    user_skills: ['iOS Development', 'Product Management'],
    looking_for_skills: ['Backend', 'Frontend', 'Marketing'],
    max_members: 4,
    current_members_count: 2,
    target_mbti_filter: 'ENTP',
    mbti_match_mode: 'auto',
    status: 'open',
    created_at: '2026-08-30T09:15:00Z',
    updated_at: '2026-08-30T09:15:00Z',
    author: {
      id: 'user-5',
      name: 'Ержан Бекбосынов',
      avatar_url: null,
      personality_type: 'ENTP'
    }
  },
  {
    id: 'project-4',
    author_id: 'user-3',
    domain: 'Web Development',
    title: 'Онлайн-платформа для олимпиад',
    description: 'Разрабатываем систему для проведения школьных олимпиад онлайн с автопроверкой.',
    user_skills: ['Java', 'Spring Boot', 'PostgreSQL'],
    looking_for_skills: ['React', 'DevOps', 'Testing'],
    max_members: 5,
    current_members_count: 3,
    target_mbti_filter: null,
    mbti_match_mode: 'any',
    status: 'open',
    created_at: '2026-08-27T16:45:00Z',
    updated_at: '2026-08-27T16:45:00Z',
    author: {
      id: 'user-3',
      name: 'Даурен Сейтов',
      avatar_url: null,
      personality_type: 'ISTJ'
    }
  }
];

export const MOCK_USER_TEAMS = [
  {
    team_room_id: 'team-1',
    role: 'creator',
    team_rooms: {
      id: 'team-1',
      name: 'AI-ассистент для школьников',
      description: 'Команда разработчиков AI чат-бота',
      project_request_id: 'project-1',
      project_requests: {
        current_members_count: 2,
        max_members: 4
      }
    }
  }
];

export const MOCK_CURRENT_USER = {
  id: 'current-user',
  name: 'Нуртас Улагат',
  avatar_url: null,
  personality_type: 'INTJ',
  region: 'Алматы',
  grade: 12,
  gpa: 3.95,
  skills: ['Full-Stack', 'AI', 'Product Design'],
  interests: ['Startups', 'AI', 'Education Tech'],
  bio: 'Full-stack разработчик и энтузиаст AI. Создаю образовательные продукты и работаю над проектами в сфере EdTech. Интересуюсь стартапами и инновациями в образовании.',
  linkedin: 'nurtas-ulagat',
  github: 'ulacoder',
  achievements: [
    { title: 'FM Edu Platform Creator', icon: '🚀', date: '2026-08' },
    { title: 'NASA Space Apps Hackathon', icon: '🛰️', date: '2025-10' },
    { title: 'FM Edu 150+ day streak', icon: '🔥', date: '2026-09' }
  ],
  projects: [
    { name: 'FM Edu - AI Platform', status: 'in_progress', members: 1 }
  ],
  stats: {
    totalPoints: 12500,
    completedCourses: 20,
    streak: 152,
    rank: 'Platinum'
  }
};

export function getMockData() {
  return {
    profile: MOCK_CURRENT_USER,
    projectRequests: MOCK_PROJECT_REQUESTS,
    userTeams: MOCK_USER_TEAMS,
  };
}

export function addMockProject(project: any) {
  MOCK_PROJECT_REQUESTS.unshift({
    ...project,
    id: `project-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    current_members_count: 1,
    status: 'open',
    author: {
      id: MOCK_CURRENT_USER.id,
      name: MOCK_CURRENT_USER.name,
      avatar_url: MOCK_CURRENT_USER.avatar_url,
      personality_type: MOCK_CURRENT_USER.personality_type,
    },
  });
}

export function joinMockTeam(projectId: string) {
  const project = MOCK_PROJECT_REQUESTS.find(p => p.id === projectId);
  if (project && project.current_members_count < project.max_members) {
    project.current_members_count += 1;

    // Add to user's teams
    const newTeam = {
      team_room_id: `team-${projectId}`,
      role: 'member',
      team_rooms: {
        id: `team-${projectId}`,
        name: project.title,
        description: project.description,
        project_request_id: projectId,
        project_requests: {
          current_members_count: project.current_members_count,
          max_members: project.max_members
        }
      }
    };

    MOCK_USER_TEAMS.push(newTeam);

    // Сохраняем в sessionStorage для сохранения во время сессии браузера
    try {
      const joinedTeams = JSON.parse(sessionStorage.getItem('joined_teams') || '[]');
      if (!joinedTeams.includes(projectId)) {
        joinedTeams.push(projectId);
        sessionStorage.setItem('joined_teams', JSON.stringify(joinedTeams));
      }
    } catch (e) {
      console.error('Failed to save to sessionStorage:', e);
    }

    return true;
  }
  return false;
}

export function isUserInTeam(projectId: string): boolean {
  // Проверяем sessionStorage
  try {
    const joinedTeams = JSON.parse(sessionStorage.getItem('joined_teams') || '[]');
    return joinedTeams.includes(projectId);
  } catch (e) {
    return false;
  }
}

export function leaveMockTeam(teamId: string) {
  const teamIndex = MOCK_USER_TEAMS.findIndex(t => t.team_room_id === teamId);
  if (teamIndex !== -1) {
    MOCK_USER_TEAMS.splice(teamIndex, 1);
    return true;
  }
  return false;
}

export function getMockProfile(userId: string) {
  if (userId === 'current-user') {
    return MOCK_CURRENT_USER;
  }
  return MOCK_PROFILES.find(p => p.id === userId) || null;
}

export function getAllMockProfiles() {
  return [...MOCK_PROFILES, MOCK_CURRENT_USER];
}
