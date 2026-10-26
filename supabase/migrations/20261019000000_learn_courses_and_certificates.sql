-- ==============================================================================
-- Migration: 20261019000000_learn_courses_and_certificates.sql
-- Description: Multi-Field Learning Academy (learn.edworld.co.in)
-- Tables: courses, course_certificates
-- ==============================================================================

-- 1. Create courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Tech & AI', 'Business & Management', 'Finance & Accounting', 'Core Engineering', 'Healthcare & Science', 'Design & Creative', 'Law & Governance', 'Entrepreneurship'
  level TEXT NOT NULL DEFAULT 'Intermediate', -- 'Beginner', 'Intermediate', 'Advanced'
  duration_weeks INT NOT NULL DEFAULT 6,
  skills TEXT[] NOT NULL DEFAULT '{}',
  icon_name TEXT NOT NULL DEFAULT 'Code2',
  roadmap JSONB NOT NULL DEFAULT '[]'::jsonb,
  resources JSONB NOT NULL DEFAULT '[]'::jsonb,
  quiz_spec JSONB NOT NULL DEFAULT '{"passing_score": 75, "questions": []}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_is_active ON public.courses(is_active);
CREATE INDEX IF NOT EXISTS idx_courses_display_order ON public.courses(display_order);

-- 2. Create course_certificates Table
CREATE TABLE IF NOT EXISTS public.course_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_code TEXT UNIQUE NOT NULL, -- e.g. 'EDW-CERT-2026-X9K2'
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  recipient_name TEXT NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  course_title TEXT NOT NULL,
  course_slug TEXT NOT NULL,
  course_category TEXT NOT NULL,
  score_percentage INT NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT TRUE,
  verification_hash TEXT NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_course_certificates_code ON public.course_certificates(certificate_code);
CREATE INDEX IF NOT EXISTS idx_course_certificates_user ON public.course_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_course_certificates_course ON public.course_certificates(course_id);

-- 3. Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
DROP POLICY IF EXISTS "courses_public_read" ON public.courses;
CREATE POLICY "courses_public_read" ON public.courses
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "certificates_public_read" ON public.course_certificates;
CREATE POLICY "certificates_public_read" ON public.course_certificates
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "certificates_insert" ON public.course_certificates;
CREATE POLICY "certificates_insert" ON public.course_certificates
  FOR INSERT WITH CHECK (true);
