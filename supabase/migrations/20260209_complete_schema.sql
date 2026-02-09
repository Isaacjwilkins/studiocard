-- ============================================
-- STUDIO.CARD COMPLETE SCHEMA MIGRATION
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. TEACHERS TABLE
-- ============================================

-- Core columns (should already exist)
-- id, email, username, slug, full_name, is_active

-- Subscription columns
ALTER TABLE public.teachers
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS max_students INTEGER DEFAULT 3;

-- Stripe columns
ALTER TABLE public.teachers
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Onboarding columns (for welcome survey)
ALTER TABLE public.teachers
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS survey_data JSONB;

-- Index for onboarding queries
CREATE INDEX IF NOT EXISTS idx_teachers_onboarding
ON public.teachers (onboarding_completed);

-- Index for Stripe subscription lookups
CREATE INDEX IF NOT EXISTS idx_teachers_stripe_subscription
ON public.teachers (stripe_subscription_id);

-- ============================================
-- 2. ARTISTS TABLE (Students)
-- ============================================

-- Core columns (should already exist)
-- id, full_name, slug, teacher_id, is_private, access_code

-- Profile columns
ALTER TABLE public.artists
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS card_color TEXT DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS caption TEXT;

-- Teacher feedback columns
ALTER TABLE public.artists
ADD COLUMN IF NOT EXISTS current_note TEXT,
ADD COLUMN IF NOT EXISTS current_assignments TEXT,
ADD COLUMN IF NOT EXISTS audio_feedback_url TEXT;

-- Social media columns
ALTER TABLE public.artists
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS twitter TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS youtube TEXT,
ADD COLUMN IF NOT EXISTS snapchat TEXT,
ADD COLUMN IF NOT EXISTS facebook TEXT,
ADD COLUMN IF NOT EXISTS tiktok TEXT,
ADD COLUMN IF NOT EXISTS spotify TEXT,
ADD COLUMN IF NOT EXISTS apple_music TEXT,
ADD COLUMN IF NOT EXISTS soundcloud TEXT;

-- Badge/status columns
ALTER TABLE public.artists
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;

-- Parent/contact info columns
ALTER TABLE public.artists
ADD COLUMN IF NOT EXISTS parent_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- ============================================
-- 3. TRACKS TABLE
-- ============================================

-- Core columns (should already exist)
-- id, title, audio_url, artist_id, created_at

-- Additional columns
ALTER TABLE public.tracks
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS release_date DATE,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

-- Index for teacher inbox queries
CREATE INDEX IF NOT EXISTS idx_tracks_artist_read
ON public.tracks (artist_id, is_read, created_at DESC);

-- ============================================
-- 4. RECITALS TABLE (Future Feature)
-- ============================================

CREATE TABLE IF NOT EXISTS public.recitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recitals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recitals
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'recitals' AND policyname = 'Teachers can manage own recitals'
    ) THEN
        CREATE POLICY "Teachers can manage own recitals" ON public.recitals
            FOR ALL USING (teacher_id = auth.uid());
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'recitals' AND policyname = 'Public can view published recitals'
    ) THEN
        CREATE POLICY "Public can view published recitals" ON public.recitals
            FOR SELECT USING (is_published = true);
    END IF;
END $$;

-- ============================================
-- 5. RECITAL_TRACKS TABLE (Future Feature)
-- ============================================

CREATE TABLE IF NOT EXISTS public.recital_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recital_id UUID REFERENCES public.recitals(id) ON DELETE CASCADE,
    track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    student_name_snapshot TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recital_tracks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recital_tracks
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'recital_tracks' AND policyname = 'Teachers can manage own recital tracks'
    ) THEN
        CREATE POLICY "Teachers can manage own recital tracks" ON public.recital_tracks
            FOR ALL USING (
                recital_id IN (SELECT id FROM public.recitals WHERE teacher_id = auth.uid())
            );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'recital_tracks' AND policyname = 'Public can view published recital tracks'
    ) THEN
        CREATE POLICY "Public can view published recital tracks" ON public.recital_tracks
            FOR SELECT USING (
                recital_id IN (SELECT id FROM public.recitals WHERE is_published = true)
            );
    END IF;
END $$;

-- ============================================
-- 6. STORAGE POLICIES
-- ============================================

-- Make sure the audio-tracks bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-tracks', 'audio-tracks', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies (wrapped to avoid duplicates)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'objects' AND policyname = 'Public can read audio-tracks'
    ) THEN
        CREATE POLICY "Public can read audio-tracks" ON storage.objects
            FOR SELECT USING (bucket_id = 'audio-tracks');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'objects' AND policyname = 'Authenticated users can upload to audio-tracks'
    ) THEN
        CREATE POLICY "Authenticated users can upload to audio-tracks" ON storage.objects
            FOR INSERT WITH CHECK (bucket_id = 'audio-tracks' AND auth.role() = 'authenticated');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'objects' AND policyname = 'Users can update own audio files'
    ) THEN
        CREATE POLICY "Users can update own audio files" ON storage.objects
            FOR UPDATE USING (bucket_id = 'audio-tracks' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'objects' AND policyname = 'Users can delete own audio files'
    ) THEN
        CREATE POLICY "Users can delete own audio files" ON storage.objects
            FOR DELETE USING (bucket_id = 'audio-tracks' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;
END $$;

-- ============================================
-- 7. MIGRATE EXISTING DATA
-- ============================================

-- Set defaults for existing teachers without subscription info
UPDATE public.teachers
SET
    subscription_status = COALESCE(subscription_status, 'free'),
    subscription_tier = COALESCE(subscription_tier, 'free'),
    max_students = COALESCE(max_students, 3),
    onboarding_completed = COALESCE(onboarding_completed, true)
WHERE subscription_status IS NULL
   OR subscription_tier IS NULL
   OR max_students IS NULL;

-- Set is_read to false for any existing tracks without it
UPDATE public.tracks
SET is_read = false
WHERE is_read IS NULL;

-- ============================================
-- 8. HELPER FUNCTIONS (Optional)
-- ============================================

-- Function to get teacher's student count
CREATE OR REPLACE FUNCTION get_teacher_student_count(teacher_uuid UUID)
RETURNS INTEGER AS $$
    SELECT COUNT(*)::INTEGER
    FROM public.artists
    WHERE teacher_id = teacher_uuid;
$$ LANGUAGE SQL STABLE;

-- ============================================
-- DONE!
-- ============================================
-- After running this, your schema should be fully up to date.
--
-- Required environment variables for Stripe:
-- - STRIPE_SECRET_KEY
-- - STRIPE_WEBHOOK_SECRET
-- - STRIPE_STUDIO_PLAN_PRICE_ID
-- ============================================
