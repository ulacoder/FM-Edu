-- Migration: AI Personalization & Achievements System
-- Created: 2026-08-31
-- Description: Course progress tracking, achievements, and AI recommendations

-- ============================================================================
-- 1. COURSE PROGRESS TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  completed_lessons INTEGER NOT NULL DEFAULT 0,
  total_lessons INTEGER NOT NULL DEFAULT 0,
  current_lesson_index INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_spent_minutes INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_answers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_course_progress_user ON course_progress(user_id);
CREATE INDEX idx_course_progress_status ON course_progress(status);
CREATE INDEX idx_course_progress_last_activity ON course_progress(last_activity);

-- RLS для course_progress
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own course progress"
  ON course_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own course progress"
  ON course_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own course progress"
  ON course_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_course_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_course_progress_updated_at
  BEFORE UPDATE ON course_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_course_progress_timestamp();

-- ============================================================================
-- 2. ACHIEVEMENTS SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL CHECK (achievement_type IN (
    'first_course',
    'course_completed',
    'streak_3days',
    'streak_7days',
    'streak_30days',
    'perfect_score',
    'fast_learner',
    'early_bird',
    'night_owl',
    'team_player',
    'diagnostic_master',
    'five_courses',
    'ten_courses'
  )),
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  metadata JSONB DEFAULT '{}',
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_type)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_type ON user_achievements(achievement_type);
CREATE INDEX idx_user_achievements_earned_at ON user_achievements(earned_at);

-- RLS для user_achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 3. AI RECOMMENDATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendations JSONB NOT NULL DEFAULT '[]',
  reasoning TEXT,
  factors_used JSONB DEFAULT '{}',
  model_version TEXT NOT NULL DEFAULT 'qwen-2.5',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_recommendations_user ON ai_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_active ON ai_recommendations(is_active);
CREATE INDEX idx_ai_recommendations_generated_at ON ai_recommendations(generated_at);

-- RLS для ai_recommendations
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations"
  ON ai_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON ai_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON ai_recommendations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Функция для деактивации старых рекомендаций
CREATE OR REPLACE FUNCTION deactivate_expired_recommendations()
RETURNS void AS $$
BEGIN
  UPDATE ai_recommendations
  SET is_active = FALSE
  WHERE expires_at < NOW() AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4. LEARNING STREAKS
-- ============================================================================

CREATE TABLE IF NOT EXISTS learning_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_learning_days INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_learning_streaks_user ON learning_streaks(user_id);

-- RLS для learning_streaks
ALTER TABLE learning_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks"
  ON learning_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks"
  ON learning_streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON learning_streaks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Функция для обновления streak
CREATE OR REPLACE FUNCTION update_learning_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_last_date DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
BEGIN
  -- Получаем текущие данные
  SELECT last_activity_date, current_streak, longest_streak
  INTO v_last_date, v_current_streak, v_longest_streak
  FROM learning_streaks
  WHERE user_id = p_user_id;

  -- Если записи нет, создаём
  IF NOT FOUND THEN
    INSERT INTO learning_streaks (user_id, current_streak, longest_streak, last_activity_date, total_learning_days)
    VALUES (p_user_id, 1, 1, CURRENT_DATE, 1);
    RETURN;
  END IF;

  -- Если сегодня уже была активность, ничего не делаем
  IF v_last_date = CURRENT_DATE THEN
    RETURN;
  END IF;

  -- Если вчера была активность, увеличиваем streak
  IF v_last_date = CURRENT_DATE - INTERVAL '1 day' THEN
    UPDATE learning_streaks
    SET
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      last_activity_date = CURRENT_DATE,
      total_learning_days = total_learning_days + 1,
      updated_at = NOW()
    WHERE user_id = p_user_id;
  ELSE
    -- Streak прервался, начинаем заново
    UPDATE learning_streaks
    SET
      current_streak = 1,
      last_activity_date = CURRENT_DATE,
      total_learning_days = total_learning_days + 1,
      updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. HELPER FUNCTIONS
-- ============================================================================

-- Функция для получения статистики прогресса пользователя
CREATE OR REPLACE FUNCTION get_user_progress_stats(p_user_id UUID)
RETURNS TABLE (
  total_courses INTEGER,
  completed_courses INTEGER,
  in_progress_courses INTEGER,
  total_time_minutes INTEGER,
  average_accuracy NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_courses,
    COUNT(*) FILTER (WHERE status = 'completed')::INTEGER as completed_courses,
    COUNT(*) FILTER (WHERE status = 'in_progress')::INTEGER as in_progress_courses,
    COALESCE(SUM(time_spent_minutes), 0)::INTEGER as total_time_minutes,
    CASE
      WHEN SUM(total_answers) > 0 THEN
        ROUND((SUM(correct_answers)::NUMERIC / SUM(total_answers)::NUMERIC) * 100, 2)
      ELSE 0
    END as average_accuracy
  FROM course_progress
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Функция для проверки и выдачи achievements
CREATE OR REPLACE FUNCTION check_and_grant_achievements(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_completed_count INTEGER;
  v_current_streak INTEGER;
BEGIN
  -- Проверяем количество завершённых курсов
  SELECT COUNT(*) INTO v_completed_count
  FROM course_progress
  WHERE user_id = p_user_id AND status = 'completed';

  -- Первый курс
  IF v_completed_count = 1 THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_name, achievement_description)
    VALUES (p_user_id, 'first_course', 'Первый шаг', 'Завершён первый курс')
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  END IF;

  -- 5 курсов
  IF v_completed_count = 5 THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_name, achievement_description)
    VALUES (p_user_id, 'five_courses', 'Пятёрка', 'Завершено 5 курсов')
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  END IF;

  -- 10 курсов
  IF v_completed_count = 10 THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_name, achievement_description)
    VALUES (p_user_id, 'ten_courses', 'Десятка', 'Завершено 10 курсов')
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  END IF;

  -- Проверяем streak
  SELECT current_streak INTO v_current_streak
  FROM learning_streaks
  WHERE user_id = p_user_id;

  IF v_current_streak >= 3 THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_name, achievement_description)
    VALUES (p_user_id, 'streak_3days', 'Огонёк', 'Streak 3 дня подряд')
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  END IF;

  IF v_current_streak >= 7 THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_name, achievement_description)
    VALUES (p_user_id, 'streak_7days', 'Неделя силы', 'Streak 7 дней подряд')
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  END IF;

  IF v_current_streak >= 30 THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_name, achievement_description)
    VALUES (p_user_id, 'streak_30days', 'Месячный марафон', 'Streak 30 дней подряд')
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE course_progress IS 'Tracks user progress through courses';
COMMENT ON TABLE user_achievements IS 'Stores earned achievements/badges for users';
COMMENT ON TABLE ai_recommendations IS 'Stores AI-generated personalized course recommendations';
COMMENT ON TABLE learning_streaks IS 'Tracks daily learning streaks and activity';
