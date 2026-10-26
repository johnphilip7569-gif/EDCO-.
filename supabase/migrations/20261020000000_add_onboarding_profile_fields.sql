-- Migration: 20261020000000_add_onboarding_profile_fields.sql
-- Description: Add missing onboarding, education, career, and social profile fields to public.profiles

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS institution text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS degree text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS field_of_study text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS graduation_year text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_company text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience_level text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS leetcode_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS certifications jsonb DEFAULT '[]'::jsonb;

-- Notify PostgREST to reload its schema cache immediately
NOTIFY pgrst, 'reload schema';
