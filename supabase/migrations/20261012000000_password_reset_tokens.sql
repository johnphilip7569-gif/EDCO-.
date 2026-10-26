-- Migration: 20261012000000_password_reset_tokens.sql
-- Description: Password reset recovery tokens for Resend email authentication flow

CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast lookup index for verification
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_lookup 
  ON public.password_reset_tokens (token_hash, used, expires_at);

-- Index on email
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email 
  ON public.password_reset_tokens (email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Deny direct client operations; accessible only via backend database pool / service role
DROP POLICY IF EXISTS "Deny all client operations on password_reset_tokens" ON public.password_reset_tokens;
CREATE POLICY "Deny all client operations on password_reset_tokens"
  ON public.password_reset_tokens
  FOR ALL
  TO public
  USING (false);
