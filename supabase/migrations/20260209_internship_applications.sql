-- Internship Applications Table
CREATE TABLE IF NOT EXISTS internship_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    linkedin_url TEXT,
    resume_url TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE internship_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public application form)
CREATE POLICY "Anyone can submit applications"
    ON internship_applications
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Only authenticated users (admins) can view applications
-- For now, we'll allow service role to read
CREATE POLICY "Service role can view applications"
    ON internship_applications
    FOR SELECT
    TO service_role
    USING (true);
