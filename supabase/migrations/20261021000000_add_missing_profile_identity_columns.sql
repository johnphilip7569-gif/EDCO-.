-- Migration: 20261021000000_add_missing_profile_identity_columns.sql
-- Description: Add first_name, last_name, avatar_url, location, portfolio_url, 
--              and show_birthday_to_connections to public.profiles and reload PostgREST schema cache

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS portfolio_url text,
  ADD COLUMN IF NOT EXISTS show_birthday_to_connections boolean DEFAULT false;

-- Backfill first_name and last_name from display_name or name if null
UPDATE public.profiles
SET 
  first_name = COALESCE(first_name, split_part(COALESCE(display_name, name, ''), ' ', 1)),
  last_name = COALESCE(last_name, NULLIF(substr(COALESCE(display_name, name, ''), length(split_part(COALESCE(display_name, name, ''), ' ', 1)) + 2), ''))
WHERE (first_name IS NULL OR last_name IS NULL) AND (display_name IS NOT NULL OR name IS NOT NULL);

-- Create fast lookup indexes on first_name and last_name
CREATE INDEX IF NOT EXISTS idx_profiles_first_name ON public.profiles(first_name);
CREATE INDEX IF NOT EXISTS idx_profiles_last_name ON public.profiles(last_name);

-- Force PostgREST to reload its schema cache immediately
NOTIFY pgrst, 'reload schema';
