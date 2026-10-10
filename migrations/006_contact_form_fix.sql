-- Contact form fix. Safe to run more than once.

-- 1. Create the table if it was never created
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    interest_area VARCHAR(100) NOT NULL DEFAULT 'General Inquiry',
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Allow longer phone numbers (was 20 characters)
ALTER TABLE clients ALTER COLUMN phone_number TYPE VARCHAR(50);

-- 3. Make sure visitors (not logged in) can submit the form
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anyone to insert clients" ON clients;
CREATE POLICY "Allow anyone to insert clients" ON clients
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read clients" ON clients;
CREATE POLICY "Allow authenticated users to read clients" ON clients
    FOR SELECT TO authenticated USING (true);

-- 4. Permissions
GRANT INSERT ON clients TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON clients TO authenticated;
