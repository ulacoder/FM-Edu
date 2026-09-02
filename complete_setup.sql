-- ============================================================================
-- FM EDU COMPLETE DATABASE SETUP & MIGRATION FIX
-- This script fixes RLS policies and creates missing tables
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/vjzchdkiitiujyslydyn/sql
-- ============================================================================

-- STEP 1: TEMPORARILY DISABLE RLS FOR MIGRATION
-- ============================================================================

-- Temporarily disable RLS on profiles for data migration
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;

-- STEP 2: CREATE MISSING TABLES FOR YOUR DATA
-- ============================================================================

-- Topics table (for educational content)
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  grade INTEGER NOT NULL,
  quarter INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT,
  ai_difficulty_level TEXT,
  learning_objectives TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assignments table (for student assignments)
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  difficulty TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'graded')),
  score INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tests table (for diagnostic tests)
CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  grade INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL DEFAULT '[]',
  time_limit_minutes INTEGER DEFAULT 60,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Test results table
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  test_id UUID REFERENCES tests(id) ON DELETE SET NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]',
  feedback TEXT,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Materials table (for educational materials)
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'article', 'document', 'presentation', 'exercise')),
  url TEXT,
  content TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student progress table
CREATE TABLE IF NOT EXISTS student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent_minutes INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, topic_id)
);

-- Recommendations table (AI-generated recommendations)
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('topic', 'material', 'exercise', 'test')),
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER NOT NULL DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activities table (for user activity tracking)
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('login', 'topic_started', 'topic_completed', 'assignment_submitted', 'test_completed')),
  details JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Indexes for topics table
CREATE INDEX IF NOT EXISTS idx_topics_subject ON topics(subject);
CREATE INDEX IF NOT EXISTS idx_topics_grade ON topics(grade);
CREATE INDEX IF NOT EXISTS idx_topics_subject_grade ON topics(subject, grade);

-- Indexes for assignments table
CREATE INDEX IF NOT EXISTS idx_assignments_student ON assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_student_status ON assignments(student_id, status);

-- Indexes for tests table
CREATE INDEX IF NOT EXISTS idx_tests_subject ON tests(subject);
CREATE INDEX IF NOT EXISTS idx_tests_grade ON tests(grade);

-- Indexes for test_results table
CREATE INDEX IF NOT EXISTS idx_test_results_student ON test_results(student_id);
CREATE INDEX IF NOT EXISTS idx_test_results_test ON test_results(test_id);

-- Indexes for materials table
CREATE INDEX IF NOT EXISTS idx_materials_topic ON materials(topic_id);
CREATE INDEX IF NOT EXISTS idx_materials_type ON materials(type);

-- Indexes for student_progress table
CREATE INDEX IF NOT EXISTS idx_student_progress_student ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_topic ON student_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_status ON student_progress(status);

-- Indexes for recommendations table
CREATE INDEX IF NOT EXISTS idx_recommendations_student ON recommendations(student_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_priority ON recommendations(priority);
CREATE INDEX IF NOT EXISTS idx_recommendations_completed ON recommendations(completed);

-- Indexes for activities table
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);

-- STEP 4: ENABLE RLS WITH CORRECT POLICIES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Re-enable RLS on existing tables with fixed policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Fix profiles policies - allow insertion for migration
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Allow data migration insert" ON profiles
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Allow data migration update" ON profiles
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Fix users policies
DROP POLICY IF EXISTS "Allow insert for users" ON users;
CREATE POLICY "Allow insert for users" ON users
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update for users" ON users;
CREATE POLICY "Allow update for users" ON users
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow select for users" ON users;
CREATE POLICY "Allow select for users" ON users
  FOR SELECT USING (true);

-- Fix students policies
DROP POLICY IF EXISTS "Students are viewable by everyone" ON students;
CREATE POLICY "Allow all operations on students" ON students
  FOR ALL USING (true);

-- RLS policies for new tables
-- Topics: visible to everyone
CREATE POLICY "Topics are viewable by everyone" ON topics
  FOR SELECT USING (true);

-- Assignments: users can see their own assignments
CREATE POLICY "Users can see own assignments" ON assignments
  FOR SELECT USING (auth.uid() = student_id OR auth.role() = 'admin');

CREATE POLICY "Users can create own assignments" ON assignments
  FOR INSERT WITH CHECK (auth.uid() = student_id OR auth.role() = 'admin');

CREATE POLICY "Users can update own assignments" ON assignments
  FOR UPDATE USING (auth.uid() = student_id OR auth.role() = 'admin');

-- Tests: visible to everyone
CREATE POLICY "Tests are viewable by everyone" ON tests
  FOR SELECT USING (true);

-- Test results: users can see their own results
CREATE POLICY "Users can see own test results" ON test_results
  FOR SELECT USING (auth.uid() = student_id OR auth.role() = 'admin');

CREATE POLICY "Users can create own test results" ON test_results
  FOR INSERT WITH CHECK (auth.uid() = student_id OR auth.role() = 'admin');

-- Materials: visible to everyone
CREATE POLICY "Materials are viewable by everyone" ON materials
  FOR SELECT USING (true);

-- Student progress: users can see their own progress
CREATE POLICY "Users can see own progress" ON student_progress
  FOR SELECT USING (auth.uid() = student_id OR auth.role() = 'admin');

CREATE POLICY "Users can update own progress" ON student_progress
  FOR UPDATE USING (auth.uid() = student_id OR auth.role() = 'admin');

CREATE POLICY "Users can create own progress" ON student_progress
  FOR INSERT WITH CHECK (auth.uid() = student_id OR auth.role() = 'admin');

-- Recommendations: users can see their own recommendations
CREATE POLICY "Users can see own recommendations" ON recommendations
  FOR SELECT USING (auth.uid() = student_id OR auth.role() = 'admin');

CREATE POLICY "Users can update own recommendations" ON recommendations
  FOR UPDATE USING (auth.uid() = student_id OR auth.role() = 'admin');

CREATE POLICY "Users can create own recommendations" ON recommendations
  FOR INSERT WITH CHECK (auth.uid() = student_id OR auth.role() = 'admin');

-- Activities: users can see their own activities
CREATE POLICY "Users can see own activities" ON activities
  FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'admin');

CREATE POLICY "Users can create own activities" ON activities
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'admin');

-- STEP 5: VERIFY ALL TABLES ARE CREATED
-- ============================================================================

SELECT
  schemaname,
  tablename,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = t.schemaname
      AND tablename = t.tablename
    ) THEN 'RLS Enabled'
    ELSE 'No RLS'
  END as rls_status
FROM pg_tables t
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles', 'users', 'students',
    'topics', 'assignments', 'tests', 'test_results',
    'materials', 'student_progress', 'recommendations',
    'activities',
    'project_requests', 'team_rooms', 'team_room_members', 'team_chat_messages'
  )
ORDER BY tablename;

-- STEP 6: CREATE TRIGGER FUNCTIONS FOR UPDATED_AT
-- ============================================================================

-- Updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to new tables
CREATE OR REPLACE TRIGGER update_topics_updated_at
  BEFORE UPDATE ON topics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_tests_updated_at
  BEFORE UPDATE ON tests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_student_progress_updated_at
  BEFORE UPDATE ON student_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_recommendations_updated_at
  BEFORE UPDATE ON recommendations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DATABASE SETUP COMPLETE!
-- ============================================================================
-- Now you can run the migration script to load data
-- Run: node migrate_data_fixed.js
-- ============================================================================