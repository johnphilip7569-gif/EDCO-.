-- Migration: 20261018000000_voice_interview_and_privacy.sql
-- Description: Extends consents and interview_sessions for Voice Interview (Myra), privacy retention, and auditability

-- 1. Extend consents table with voice recording consent columns
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consents' AND column_name = 'voice_recording_consent'
  ) THEN
    ALTER TABLE public.consents ADD COLUMN voice_recording_consent BOOLEAN NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consents' AND column_name = 'voice_consent_accepted_at'
  ) THEN
    ALTER TABLE public.consents ADD COLUMN voice_consent_accepted_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consents' AND column_name = 'voice_retention_days'
  ) THEN
    ALTER TABLE public.consents ADD COLUMN voice_retention_days INTEGER NOT NULL DEFAULT 7;
  END IF;
END $$;

-- 2. Extend interview_sessions table with voice audit fields
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'interview_sessions' AND column_name = 'voice_opt_in'
  ) THEN
    ALTER TABLE public.interview_sessions ADD COLUMN voice_opt_in BOOLEAN NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'interview_sessions' AND column_name = 'audio_url'
  ) THEN
    ALTER TABLE public.interview_sessions ADD COLUMN audio_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'interview_sessions' AND column_name = 'audio_deleted_at'
  ) THEN
    ALTER TABLE public.interview_sessions ADD COLUMN audio_deleted_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'interview_sessions' AND column_name = 'retention_expires_at'
  ) THEN
    ALTER TABLE public.interview_sessions ADD COLUMN retention_expires_at TIMESTAMPTZ;
  END IF;
END $$;

-- 3. Add indices for fast session lookups and scheduled retention cleanup
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_created 
  ON public.interview_sessions(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_retention 
  ON public.interview_sessions(retention_expires_at) 
  WHERE retention_expires_at IS NOT NULL AND audio_deleted_at IS NULL;
