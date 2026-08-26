// Типы для модуля Matchmaking & Team Building

export type MBTIMatchMode = 'any' | 'exact' | 'auto';
export type ProjectRequestStatus = 'open' | 'full' | 'closed';
export type TeamRole = 'creator' | 'member';
export type MessageType = 'user' | 'system';

export interface ProjectRequest {
  id: string;
  author_id: string;

  // Основная информация
  domain: string;
  title: string;
  description?: string;

  // Навыки
  user_skills: string[];
  looking_for_skills: string[];

  // Настройки команды
  max_members: number;
  current_members_count: number;

  // MBTI фильтр
  target_mbti_filter?: string;
  mbti_match_mode: MBTIMatchMode;

  // Статус
  status: ProjectRequestStatus;

  // Timestamps
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export interface ProjectRequestWithAuthor extends ProjectRequest {
  author: {
    id: string;
    name: string;
    avatar_url?: string;
    personality_type?: string;
  };
}

export interface TeamRoom {
  id: string;
  project_request_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamRoomMember {
  id: string;
  team_room_id: string;
  user_id: string;
  project_request_id: string;
  role: TeamRole;
  user_mbti?: string;
  user_skills: string[];
  joined_at: string;
}

export interface TeamRoomMemberWithUser extends TeamRoomMember {
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface TeamChatMessage {
  id: string;
  team_room_id: string;
  user_id: string;
  content: string;
  message_type: MessageType;
  created_at: string;
}

export interface TeamChatMessageWithUser extends TeamChatMessage {
  user: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface CreateProjectRequestPayload {
  domain: string;
  title: string;
  description?: string;
  user_skills: string[];
  looking_for_skills: string[];
  max_members: number;
  target_mbti_filter?: string;
  mbti_match_mode: MBTIMatchMode;
}

export interface JoinTeamPayload {
  project_request_id: string;
  user_mbti?: string;
  user_skills: string[];
}

export interface MBTIMatchResult {
  isMatch: boolean;
  matchScore: number; // 0-4 (количество совпадающих букв)
  message?: string;
}
