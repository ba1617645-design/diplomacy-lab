-- ============================================================
--  Diplomacy Lab - Complete Supabase Schema
--  Run this in Supabase SQL Editor
-- ============================================================

-- 1. USERS TABLE (profiles linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  profession TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('participant', 'trainer')),
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  completed_missions TEXT[] NOT NULL DEFAULT '{}',
  scores JSONB NOT NULL DEFAULT '{"influence":0,"storytelling":0,"negotiation":0,"impact":0,"impactEngineering":0}',
  badges JSONB NOT NULL DEFAULT '[]',
  trainer_name TEXT NOT NULL DEFAULT '',
  trainer_org TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ACTIVITIES TABLE (trainer creates these)
CREATE TABLE IF NOT EXISTS activities (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  day_key TEXT NOT NULL UNIQUE,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert the 5 default activities
INSERT INTO activities (title, description, day_key, is_locked) VALUES
  ('اكتشف نفوذك المجتمعي', 'رحلة تفاعلية لاكتشاف مصادر نفوذك وتأثيرك في المجتمع', 'day1', false),
  ('ورشة صناعة السرد', 'صمم سردك القصصي المؤثر باستخدام الذكاء الاصطناعي', 'day2', false),
  ('محاكاة التفاوض', 'تفاوض مع 6 فرق في بيئة محاكاة تفاعلية', 'day3', false),
  ('من النشاط إلى الأثر', 'حوّل مبادرتك إلى نظرية تغيير متكاملة', 'day4', false),
  ('هندسة التأثير', 'صمم تدخلاً مجتمعياً بأعلى أثر وأقل تكلفة', 'day5', false)
ON CONFLICT (day_key) DO NOTHING;

-- 3. SUBMISSIONS TABLE (participant submissions)
CREATE TABLE IF NOT EXISTS submissions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_key TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  score INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, activity_key)
);

-- 4. TRAINER PROFILE (single row for trainer settings)
CREATE TABLE IF NOT EXISTS trainer_profile (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL DEFAULT 'د. عبدالله القحطاني',
  title TEXT NOT NULL DEFAULT 'مدرب معتمد في الدبلوماسية المجتمعية',
  organization TEXT NOT NULL DEFAULT 'المعهد الدولي للتنمية المستدامة',
  photo TEXT NOT NULL DEFAULT '/images/trainer.jpg',
  email TEXT NOT NULL DEFAULT 'a.alqahtani@iisd.org',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO trainer_profile (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles: users can read all profiles, update only their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- Activities: all authenticated users can read, only trainers can insert/update
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read activities"
  ON activities FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Trainers can insert activities"
  ON activities FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'trainer'));

CREATE POLICY "Trainers can update activities"
  ON activities FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'trainer'));

-- Submissions: users read own, trainers read all
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own submissions"
  ON submissions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'trainer'));

CREATE POLICY "Users insert own submissions"
  ON submissions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own submissions"
  ON submissions FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Trainer profile: all authenticated users can read, only trainers can update
ALTER TABLE trainer_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read trainer profile"
  ON trainer_profile FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Trainers can update trainer profile"
  ON trainer_profile FOR UPDATE TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'trainer'));
