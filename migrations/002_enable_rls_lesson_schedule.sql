-- Migration: Enable RLS on lesson_schedule table
-- Run this in Supabase SQL Editor
--
-- This fixes the security issue where RLS policies exist but RLS is not enabled

-- Enable Row Level Security on the lesson_schedule table
ALTER TABLE "public"."lesson_schedule" ENABLE ROW LEVEL SECURITY;

-- Verify RLS is enabled (optional check)
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'lesson_schedule';
