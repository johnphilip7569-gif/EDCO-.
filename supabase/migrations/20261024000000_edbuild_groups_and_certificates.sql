-- ==============================================================================
-- EDBUILD COLLABORATIVE GROUPS & CERTIFICATES SCHEMA
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.edbuild_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  access_type TEXT NOT NULL CHECK (access_type IN ('public', 'private')),
  join_key TEXT UNIQUE,
  team_size INTEGER NOT NULL DEFAULT 4,
  current_members_count INTEGER NOT NULL DEFAULT 1,
  leader_id UUID NOT NULL,
  leader_name TEXT NOT NULL,
  leader_email TEXT NOT NULL,
  leader_phone TEXT,
  problem_statement TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'FULL', 'IN_PROGRESS', 'PENDING_REVIEW', 'APPROVED', 'REJECTED')),
  submission_repo_url TEXT,
  submission_live_url TEXT,
  submission_notes TEXT,
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.edbuild_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.edbuild_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('LEADER', 'MEMBER')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_group_member UNIQUE (group_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.edbuild_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.edbuild_groups(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_name TEXT NOT NULL,
  sender_avatar TEXT,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'system')),
  content TEXT,
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.edbuild_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_code TEXT UNIQUE NOT NULL,
  group_id UUID REFERENCES public.edbuild_groups(id) ON DELETE SET NULL,
  user_id UUID NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  project_name TEXT NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  verification_hash TEXT NOT NULL
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_edbuild_groups_status ON public.edbuild_groups(status);
CREATE INDEX IF NOT EXISTS idx_edbuild_groups_access ON public.edbuild_groups(access_type);
CREATE INDEX IF NOT EXISTS idx_edbuild_groups_key ON public.edbuild_groups(join_key);
CREATE INDEX IF NOT EXISTS idx_edbuild_members_user ON public.edbuild_members(user_id);
CREATE INDEX IF NOT EXISTS idx_edbuild_members_group ON public.edbuild_members(group_id);
CREATE INDEX IF NOT EXISTS idx_edbuild_messages_group ON public.edbuild_messages(group_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_edbuild_certificates_code ON public.edbuild_certificates(LOWER(certificate_code));
