-- Migration: Update recitals table and create recital_performers
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Add missing columns to existing recitals table
-- ============================================

ALTER TABLE "public"."recitals"
ADD COLUMN IF NOT EXISTS "event_date" TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS "venue" TEXT,
ADD COLUMN IF NOT EXISTS "custom_note" TEXT,
ADD COLUMN IF NOT EXISTS "background_type" TEXT DEFAULT 'plain',
ADD COLUMN IF NOT EXISTS "color_theme" TEXT DEFAULT '#6366f1',
ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN DEFAULT true;

-- Add unique constraint on teacher_id + slug if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'recitals_teacher_slug_unique'
    ) THEN
        ALTER TABLE "public"."recitals"
        ADD CONSTRAINT "recitals_teacher_slug_unique" UNIQUE ("teacher_id", "slug");
    END IF;
EXCEPTION WHEN others THEN
    NULL;
END $$;

-- ============================================
-- STEP 2: Create recital_performers table
-- ============================================

CREATE TABLE IF NOT EXISTS "public"."recital_performers" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "recital_id" UUID NOT NULL REFERENCES "public"."recitals"("id") ON DELETE CASCADE,
    "artist_id" UUID REFERENCES "public"."artists"("id") ON DELETE SET NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "performer_name" TEXT NOT NULL,
    "performer_image_url" TEXT,
    "performer_bio" TEXT,
    "performer_card_slug" TEXT,
    "piece_title" TEXT NOT NULL,
    "composer" TEXT,
    "instrument" TEXT,
    "estimated_duration_minutes" INTEGER,
    "is_intermission" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- STEP 3: Create Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS "idx_recitals_teacher_id" ON "public"."recitals" USING btree ("teacher_id");
CREATE INDEX IF NOT EXISTS "idx_recitals_slug" ON "public"."recitals" USING btree ("slug");
CREATE INDEX IF NOT EXISTS "idx_recital_performers_recital_id" ON "public"."recital_performers" USING btree ("recital_id");
CREATE INDEX IF NOT EXISTS "idx_recital_performers_sort_order" ON "public"."recital_performers" USING btree ("recital_id", "sort_order");

-- ============================================
-- STEP 4: Enable RLS on recital_performers
-- ============================================

ALTER TABLE "public"."recital_performers" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: Grants for recital_performers
-- ============================================

GRANT ALL ON TABLE "public"."recital_performers" TO "anon";
GRANT ALL ON TABLE "public"."recital_performers" TO "authenticated";
GRANT ALL ON TABLE "public"."recital_performers" TO "service_role";

-- ============================================
-- STEP 6: RLS Policies for recital_performers
-- ============================================

CREATE POLICY "performers_teacher_select" ON "public"."recital_performers"
    FOR SELECT TO authenticated
    USING (recital_id IN (SELECT id FROM "public"."recitals" WHERE teacher_id = auth.uid()));

CREATE POLICY "performers_teacher_insert" ON "public"."recital_performers"
    FOR INSERT TO authenticated
    WITH CHECK (recital_id IN (SELECT id FROM "public"."recitals" WHERE teacher_id = auth.uid()));

CREATE POLICY "performers_teacher_update" ON "public"."recital_performers"
    FOR UPDATE TO authenticated
    USING (recital_id IN (SELECT id FROM "public"."recitals" WHERE teacher_id = auth.uid()));

CREATE POLICY "performers_teacher_delete" ON "public"."recital_performers"
    FOR DELETE TO authenticated
    USING (recital_id IN (SELECT id FROM "public"."recitals" WHERE teacher_id = auth.uid()));

CREATE POLICY "performers_public_select" ON "public"."recital_performers"
    FOR SELECT TO anon
    USING (recital_id IN (SELECT id FROM "public"."recitals" WHERE is_active = true OR is_published = true));

-- ============================================
-- STEP 7: Add policy for viewing active recitals (using new is_active column)
-- ============================================

DO $$
BEGIN
    -- Drop old policy if it references only is_published
    DROP POLICY IF EXISTS "Public can view published recitals" ON "public"."recitals";
EXCEPTION WHEN others THEN
    NULL;
END $$;

CREATE POLICY "Public can view active recitals" ON "public"."recitals"
    FOR SELECT TO anon
    USING (is_active = true OR is_published = true);
