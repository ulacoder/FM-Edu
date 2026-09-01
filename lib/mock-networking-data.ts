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
    interests: ['AI', 'Robotics', 'Web Dev']
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
    interests: ['Design', 'Art', 'Psychology']
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
    interests: ['Programming', 'Math', 'Physics']
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
    interests: ['Business', 'Psychology', 'Languages']
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
    interests: ['Mobile Dev', 'Startups', 'Tech']
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
  interests: ['Startups', 'AI', 'Education Tech']
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
    MOCK_USER_TEAMS.push({
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
    });

    return true;
  }
  return false;
}

export function leaveMockTeam(teamId: string) {
  const teamIndex = MOCK_USER_TEAMS.findIndex(t => t.team_room_id === teamId);
  if (teamIndex !== -1) {
    MOCK_USER_TEAMS.splice(teamIndex, 1);
    return true;
  }
  return false;
}
