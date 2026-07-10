-- =============================================
--  Supabase Migration: إنشاء جداول المنصة
--  شغّل هذا الملف في SQL Editor في Supabase Dashboard
-- =============================================

-- 1. جدول المستخدمين (profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT DEFAULT '',
  password TEXT,
  role TEXT DEFAULT 'participant',
  country TEXT DEFAULT '',
  profession TEXT DEFAULT '',
  organization TEXT DEFAULT '',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  completed_missions TEXT[] DEFAULT '{}',
  scores JSONB DEFAULT '{}',
  badges JSONB DEFAULT '[]',
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (true);

-- 2. جدول الأنشطة (activities)
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  day_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  is_locked BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read activities" ON activities
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update activities" ON activities
  FOR UPDATE USING (true);

-- 3. جدول المدرب (trainer_profile)
CREATE TABLE IF NOT EXISTS trainer_profile (
  id SERIAL PRIMARY KEY,
  name TEXT DEFAULT '',
  title TEXT DEFAULT '',
  organization TEXT DEFAULT '',
  photo TEXT DEFAULT '',
  email TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE trainer_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read trainer_profile" ON trainer_profile
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update trainer_profile" ON trainer_profile
  FOR UPDATE USING (true);

-- 4. بيانات الأنشطة الافتراضية
INSERT INTO activities (day_key, title, description, is_locked)
SELECT * FROM (VALUES
  ('day1', 'اليوم الأول: أساسيات الدبلوماسية', 'مقدمة في الدبلوماسية ومهارات التأثير', false),
  ('day2', 'اليوم الثاني: السرد القصصي', 'فن السرد القصصي وتأثيره في العلاقات', true),
  ('day3', 'اليوم الثالث: التفاوض', 'مهارات التفاوض والإقناع', true),
  ('day4', 'اليوم الرابع: تقييم الأثر', 'قياس الأثر وتقييم المبادرات', true),
  ('day5', 'اليوم الخامس: الهندسة التأثيرية', 'تصميم وتنفيذ مشاريع التأثير', true)
) AS t
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE day_key = t.column1);

-- 5. بيانات المدرب الافتراضية
INSERT INTO trainer_profile (id, name, title, organization, email)
SELECT 1, 'د. عبدالله القحطاني', 'مدرب معتمد', 'المعهد الدولي للتنمية المستدامة', 'a.alqahtani@iisd.org'
WHERE NOT EXISTS (SELECT 1 FROM trainer_profile WHERE id = 1);
