-- Миграция для модуля Matchmaking & Team Building

-- Таблица заявок на поиск команды
CREATE TABLE IF NOT EXISTS project_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Основная информация
  domain TEXT NOT NULL, -- Сфера (IT, Design, Physics, etc)
  title TEXT NOT NULL, -- Название проекта/заявки
  description TEXT,

  -- Навыки и требования
  user_skills TEXT[] NOT NULL DEFAULT '{}', -- Что автор привносит
  looking_for_skills TEXT[] NOT NULL DEFAULT '{}', -- Кого ищет

  -- Настройки команды
  max_members INTEGER NOT NULL DEFAULT 4 CHECK (max_members >= 1 AND max_members <= 5),
  current_members_count INTEGER NOT NULL DEFAULT 1,

  -- MBTI фильтр
  target_mbti_filter TEXT, -- 'any' | конкретный MBTI | NULL (автоподбор 3/4)
  mbti_match_mode TEXT NOT NULL DEFAULT 'auto' CHECK (mbti_match_mode IN ('any', 'exact', 'auto')),
  -- 'any' = любой MBTI
  -- 'exact' = строгое совпадение с target_mbti_filter
  -- 'auto' = автоподбор (3 из 4 букв)

  -- Статус
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'closed')),

  -- Метаданные
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Таблица командных комнат (Team Chat)
CREATE TABLE IF NOT EXISTS team_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_request_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,

  name TEXT NOT NULL, -- Название комнаты (автогенерируется из проекта)
  description TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Связь участников с командной комнатой
CREATE TABLE IF NOT EXISTS team_room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_room_id UUID NOT NULL REFERENCES team_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_request_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,

  -- Роль в команде
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('creator', 'member')),

  -- Информация участника (для быстрого доступа)
  user_mbti TEXT,
  user_skills TEXT[] DEFAULT '{}',

  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Уникальность: один пользователь может быть только 1 раз в одной комнате
  UNIQUE(team_room_id, user_id)
);

-- Сообщения в командном чате
CREATE TABLE IF NOT EXISTS team_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_room_id UUID NOT NULL REFERENCES team_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'user' CHECK (message_type IN ('user', 'system')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_project_requests_author ON project_requests(author_id);
CREATE INDEX IF NOT EXISTS idx_project_requests_status ON project_requests(status);
CREATE INDEX IF NOT EXISTS idx_project_requests_created ON project_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_team_rooms_project ON team_rooms(project_request_id);
CREATE INDEX IF NOT EXISTS idx_team_room_members_room ON team_room_members(team_room_id);
CREATE INDEX IF NOT EXISTS idx_team_room_members_user ON team_room_members(user_id);

CREATE INDEX IF NOT EXISTS idx_team_chat_messages_room ON team_chat_messages(team_room_id);
CREATE INDEX IF NOT EXISTS idx_team_chat_messages_created ON team_chat_messages(created_at DESC);

-- RLS (Row Level Security) политики
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_chat_messages ENABLE ROW LEVEL SECURITY;

-- Политики для project_requests
CREATE POLICY "Project requests are viewable by everyone"
  ON project_requests FOR SELECT
  USING (true);

CREATE POLICY "Users can create project requests"
  ON project_requests FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own project requests"
  ON project_requests FOR UPDATE
  USING (auth.uid() = author_id);

-- Политики для team_rooms
CREATE POLICY "Team rooms are viewable by members"
  ON team_rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_room_members
      WHERE team_room_members.team_room_id = team_rooms.id
      AND team_room_members.user_id = auth.uid()
    )
  );

-- Политики для team_room_members
CREATE POLICY "Team members are viewable by room members"
  ON team_room_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_room_members AS trm
      WHERE trm.team_room_id = team_room_members.team_room_id
      AND trm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join teams"
  ON team_room_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave teams"
  ON team_room_members FOR DELETE
  USING (auth.uid() = user_id);

-- Политики для team_chat_messages
CREATE POLICY "Team messages are viewable by room members"
  ON team_chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_room_members
      WHERE team_room_members.team_room_id = team_chat_messages.team_room_id
      AND team_room_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Room members can send messages"
  ON team_chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM team_room_members
      WHERE team_room_members.team_room_id = team_chat_messages.team_room_id
      AND team_room_members.user_id = auth.uid()
    )
  );

-- Функция для автообновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для автообновления timestamps
CREATE TRIGGER update_project_requests_updated_at
  BEFORE UPDATE ON project_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_rooms_updated_at
  BEFORE UPDATE ON team_rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
