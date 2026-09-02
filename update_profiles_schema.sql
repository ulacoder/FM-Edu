-- Добавление полей для социальных сетей в таблицу profiles

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS behance TEXT,
ADD COLUMN IF NOT EXISTS twitter TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_courses INTEGER DEFAULT 0;

-- Создаем таблицу achievements если не существует
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);

-- Включаем RLS для achievements
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements are viewable by everyone" ON achievements
  FOR SELECT USING (true);

-- Обновляем существующие записи профилей (опционально)
UPDATE profiles
SET
  bio = 'Активный участник образовательной платформы FM Edu. Заинтересован в проектах и новых знакомствах.',
  skills = ARRAY['Программирование', 'Математика', 'Физика', 'Иностранные языки'],
  interests = ARRAY['IT', 'Образование', 'Стартапы', 'Искусственный интеллект']
WHERE bio IS NULL;

-- Пример заполнения для тестовых пользователей
UPDATE profiles
SET
  linkedin = 'nurtas-ulagat',
  github = 'ulacoder',
  instagram = 'nurtas_ulagat',
  points = 7500,
  level = 5,
  streak = 21
WHERE email = 'as@as.as';

UPDATE profiles
SET
  linkedin = 'example-user',
  github = 'example',
  instagram = 'example_insta',
  points = 4500,
  level = 4,
  streak = 14
WHERE email LIKE '%@student.kz';