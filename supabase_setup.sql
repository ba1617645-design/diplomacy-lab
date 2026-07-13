-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'participant',
    country VARCHAR(100),
    profession VARCHAR(100),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    completed_missions JSONB DEFAULT '[]',
    scores JSONB DEFAULT '{}',
    badges JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trainer info
CREATE TABLE IF NOT EXISTS trainer_info (
    id INT PRIMARY KEY DEFAULT 1,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    organization VARCHAR(255),
    photo VARCHAR(500),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Locked days
CREATE TABLE IF NOT EXISTS locked_days (
    id SERIAL PRIMARY KEY,
    day_key VARCHAR(50) UNIQUE NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO trainer_info (id, name, title, organization, photo, email) 
VALUES (1, 'د. عبدالله القحطاني', 'مدرب معتمد', 'المعهد الدولي للتنمية المستدامة', '/images/trainer.jpg', 'a.alqahtani@iisd.org')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO locked_days (day_key, is_locked) VALUES 
('day1', FALSE), ('day2', FALSE), ('day3', FALSE), ('day4', FALSE), ('day5', FALSE)
ON CONFLICT (day_key) DO UPDATE SET is_locked = EXCLUDED.is_locked;

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE locked_days ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable read for all" ON trainer_info;
DROP POLICY IF EXISTS "Enable update for authenticated" ON trainer_info;
DROP POLICY IF EXISTS "Enable read for all" ON locked_days;
DROP POLICY IF EXISTS "Enable update for authenticated" ON locked_days;

-- Create policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id);
CREATE POLICY "Enable insert for authenticated users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for all" ON trainer_info FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated" ON trainer_info FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable read for all" ON locked_days FOR SELECT USING (true);
CREATE POLICY "Enable update for authenticated" ON locked_days FOR UPDATE USING (auth.role() = 'authenticated');