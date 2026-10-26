-- ==============================================================================
-- Migration: 20261026000000_phase1_extensions.sql
-- Phase 1 High-Impact Extensions: Scam Offer Checker, Multi-Channel Alerts, Career Roadmaps
-- ==============================================================================

-- 1. Feature Flags Table Seeding for New Modules
INSERT INTO public.feature_flags (key, description, enabled, rollout_percentage)
VALUES 
  ('scam_offer_checker', 'AI and heuristic job scam risk analyzer', true, 100),
  ('multichannel_alerts', 'WhatsApp and Telegram role and city alert engine', true, 100),
  ('ai_career_roadmap', '1-year, 3-year, and 5-year interactive career roadmap', true, 100)
ON CONFLICT (key) DO UPDATE SET 
  enabled = EXCLUDED.enabled,
  rollout_percentage = EXCLUDED.rollout_percentage;

-- 2. Scam Checker Audit Logs Table
CREATE TABLE IF NOT EXISTS public.scam_check_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  company_name TEXT,
  contact_source TEXT,
  risk_score INT NOT NULL,
  verdict TEXT NOT NULL,
  red_flags JSONB DEFAULT '[]'::jsonb,
  raw_text_snippet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Multi-Channel Alert Subscriptions Table
CREATE TABLE IF NOT EXISTS public.user_alert_preferences (
  user_id TEXT PRIMARY KEY,
  whatsapp_enabled BOOLEAN DEFAULT false,
  whatsapp_number TEXT,
  whatsapp_verified BOOLEAN DEFAULT false,
  telegram_enabled BOOLEAN DEFAULT false,
  telegram_chat_id TEXT,
  telegram_username TEXT,
  selected_roles TEXT[] DEFAULT '{}',
  selected_cities TEXT[] DEFAULT '{}',
  notify_jobs BOOLEAN DEFAULT true,
  notify_hackathons BOOLEAN DEFAULT true,
  notify_deadlines BOOLEAN DEFAULT true,
  frequency TEXT DEFAULT 'instant' CHECK (frequency IN ('instant', 'daily_digest', 'weekly')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Career Roadmap & Milestones Table
CREATE TABLE IF NOT EXISTS public.career_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  target_role TEXT NOT NULL,
  current_level TEXT NOT NULL,
  timeline_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.career_roadmap_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  roadmap_id UUID REFERENCES public.career_roadmaps(id) ON DELETE CASCADE,
  horizon TEXT NOT NULL CHECK (horizon IN ('1_year', '3_year', '5_year')),
  month_index INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  skill_tags TEXT[] DEFAULT '{}',
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for optimal query performance
CREATE INDEX IF NOT EXISTS idx_scam_check_audits_user ON public.scam_check_audits(user_id);
CREATE INDEX IF NOT EXISTS idx_career_roadmaps_user ON public.career_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_career_milestones_user ON public.career_roadmap_milestones(user_id, horizon);

-- 5. Row Level Security Policies
ALTER TABLE public.scam_check_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_alert_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_roadmap_milestones ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_alert_preferences' AND policyname = 'Users can manage own alert preferences'
  ) THEN
    CREATE POLICY "Users can manage own alert preferences"
      ON public.user_alert_preferences FOR ALL
      USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'career_roadmaps' AND policyname = 'Users can read/write own career roadmaps'
  ) THEN
    CREATE POLICY "Users can read/write own career roadmaps"
      ON public.career_roadmaps FOR ALL
      USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'career_roadmap_milestones' AND policyname = 'Users can update own milestones'
  ) THEN
    CREATE POLICY "Users can update own milestones"
      ON public.career_roadmap_milestones FOR ALL
      USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');
  END IF;
END $$;
