-- ============================================================================
-- FM EDU DATABASE SETUP - COMPLETE MIGRATION
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/vjzchdkiitiujyslydyn/sql
-- ============================================================================

-- STEP 1: PROFILES AND USER TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  region TEXT,
  school_name TEXT,
  grade INTEGER CHECK (grade >= 7 AND grade <= 12),
  personality_type TEXT,
  interests TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  goals TEXT,
  gpa NUMERIC(3, 2),
  target_universities TEXT[] DEFAULT '{}',
  target_exams TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_region ON profiles(region);
CREATE INDEX IF NOT EXISTS idx_profiles_personality_type ON profiles(personality_type);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Триггер для updated_at
CREATE OR REPLACE FUNCTION update_profiles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_timestamp();

-- STEP 2: LEGACY TABLES (students, teachers, users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  grade INTEGER CHECK (grade >= 7 AND grade <= 12),
  region TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students are viewable by everyone" ON students;
CREATE POLICY "Students are viewable by everyone" ON students FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- STEP 3: MATCHMAKING TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL,
  domain TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  user_skills TEXT[] NOT NULL DEFAULT '{}',
  looking_for_skills TEXT[] NOT NULL DEFAULT '{}',
  max_members INTEGER NOT NULL DEFAULT 4 CHECK (max_members >= 1 AND max_members <= 5),
  current_members_count INTEGER NOT NULL DEFAULT 1,
  target_mbti_filter TEXT,
  mbti_match_mode TEXT NOT NULL DEFAULT 'auto' CHECK (mbti_match_mode IN ('any', 'exact', 'auto')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_project_requests_author ON project_requests(author_id);
CREATE INDEX IF NOT EXISTS idx_project_requests_status ON project_requests(status);
CREATE INDEX IF NOT EXISTS idx_project_requests_created ON project_requests(created_at DESC);

ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Project requests are viewable by everyone" ON project_requests;
CREATE POLICY "Project requests are viewable by everyone" ON project_requests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create project requests" ON project_requests;
CREATE POLICY "Users can create project requests" ON project_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own project requests" ON project_requests;
CREATE POLICY "Users can update their own project requests" ON project_requests FOR UPDATE USING (true);

CREATE TABLE IF NOT EXISTS team_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_request_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_rooms_project ON team_rooms(project_request_id);

ALTER TABLE team_rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team rooms are viewable by everyone" ON team_rooms;
CREATE POLICY "Team rooms are viewable by everyone" ON team_rooms FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS team_room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_room_id UUID NOT NULL REFERENCES team_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  project_request_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('creator', 'member')),
  user_mbti TEXT,
  user_skills TEXT[] DEFAULT '{}',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_room_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_team_room_members_room ON team_room_members(team_room_id);
CREATE INDEX IF NOT EXISTS idx_team_room_members_user ON team_room_members(user_id);

ALTER TABLE team_room_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team members are viewable by everyone" ON team_room_members;
CREATE POLICY "Team members are viewable by everyone" ON team_room_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can join teams" ON team_room_members;
CREATE POLICY "Users can join teams" ON team_room_members FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can leave teams" ON team_room_members;
CREATE POLICY "Users can leave teams" ON team_room_members FOR DELETE USING (true);

CREATE TABLE IF NOT EXISTS team_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_room_id UUID NOT NULL REFERENCES team_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'user' CHECK (message_type IN ('user', 'system')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_chat_messages_room ON team_chat_messages(team_room_id);
CREATE INDEX IF NOT EXISTS idx_team_chat_messages_created ON team_chat_messages(created_at DESC);

ALTER TABLE team_chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Team messages are viewable by everyone" ON team_chat_messages;
CREATE POLICY "Team messages are viewable by everyone" ON team_chat_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Room members can send messages" ON team_chat_messages;
CREATE POLICY "Room members can send messages" ON team_chat_messages FOR INSERT WITH CHECK (true);

-- ============================================================================
-- DONE! All tables created with proper RLS policies
-- ============================================================================

-- Verify tables exist:
SELECT
  schemaname,
  tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'project_requests', 'team_rooms', 'team_room_members', 'team_chat_messages', 'students', 'users')
ORDER BY tablename;
