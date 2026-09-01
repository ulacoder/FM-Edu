-- Migration: User Profiles & Core Tables
-- Created: 2026-09-01
-- Description: Core user profiles, students, teachers tables

-- ============================================================================
-- 1. PROFILES TABLE (Extended user info)
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic info
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,

  -- User type
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),

  -- Location & School
  region TEXT,
  school_name TEXT,
  grade INTEGER CHECK (grade >= 7 AND grade <= 12),

  -- Personality & Interests
  personality_type TEXT, -- MBTI тип (INTJ, ENFP, etc)
  interests TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  goals TEXT,

  -- Academic info
  gpa NUMERIC(3, 2),
  target_universities TEXT[] DEFAULT '{}',
  target_exams TEXT[] DEFAULT '{}',

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_region ON profiles(region);
CREATE INDEX idx_profiles_personality_type ON profiles(personality_type);

-- RLS для profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Все могут читать профили (для matchmaking)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Пользователи могут создавать свой профиль
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Пользователи могут обновлять свой профиль
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_profiles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_timestamp();

-- ============================================================================
-- 2. STUDENTS TABLE (Legacy compatibility)
-- ============================================================================

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_grade ON students(grade);
CREATE INDEX idx_students_region ON students(region);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students are viewable by everyone"
  ON students FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own student profile"
  ON students FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own student profile"
  ON students FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 3. TEACHERS TABLE (Legacy compatibility)
-- ============================================================================

CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  school TEXT,
  region TEXT,
  subjects TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_teachers_email ON teachers(email);
CREATE INDEX idx_teachers_region ON teachers(region);

ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers are viewable by everyone"
  ON teachers FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own teacher profile"
  ON teachers FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own teacher profile"
  ON teachers FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 4. USERS TABLE (Legacy - for JWT auth without Supabase Auth)
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, -- Hashed with bcrypt
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Эта таблица НЕ использует RLS (для JWT auth)

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE profiles IS 'Extended user profiles with MBTI, interests, goals';
COMMENT ON TABLE students IS 'Legacy student profiles table';
COMMENT ON TABLE teachers IS 'Legacy teacher profiles table';
COMMENT ON TABLE users IS 'Legacy users table for JWT authentication';
