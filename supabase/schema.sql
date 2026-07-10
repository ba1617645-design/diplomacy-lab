-- =============================================
--  Diplomacy Lab - Full Database Schema
-- =============================================

-- 1. Users table (registration data)
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. App state table (stores all platform data as JSON)
CREATE TABLE IF NOT EXISTS app_state (
  id INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial row
INSERT INTO app_state (id, data) VALUES (1, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- =============================================
--  RLS Policies
-- =============================================

-- Users table: allow insert for anyone, select for anyone
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert for all" ON users;
CREATE POLICY "Allow insert for all" ON users
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow select for all" ON users;
CREATE POLICY "Allow select for all" ON users
  FOR SELECT TO anon USING (true);

-- App state: allow read/write for everyone (simple key-value store)
ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on app_state" ON app_state;
CREATE POLICY "Allow all on app_state" ON app_state
  FOR ALL TO anon USING (true) WITH CHECK (true);
