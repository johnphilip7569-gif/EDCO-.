-- ==============================================================================
-- Migration: 20261017000000_hackathons_and_featured_events.sql
-- Description: Featured Hackathons, Case Competitions, and Events on Dashboard
-- Tables: events, user_saved_events + Real Seed Catalog
-- ==============================================================================

-- 1. Create events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organizer TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Case Competition', 'Hackathon', 'Hiring Challenge', 'Residency Challenge', 'Workshop'
  mode TEXT NOT NULL DEFAULT 'Online', -- 'Online', 'In-Person', 'Hybrid'
  is_free BOOLEAN NOT NULL DEFAULT TRUE,
  prize_pool TEXT NOT NULL, -- e.g. '₹1.8 Lakhs', '₹3 Lakhs + PPIs', '₹75,000'
  banner_style JSONB NOT NULL DEFAULT '{}'::jsonb, -- Gradient, badge tag, illustration type
  description TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  registration_deadline TIMESTAMPTZ,
  registration_url TEXT NOT NULL,
  registration_status TEXT NOT NULL DEFAULT 'Open', -- 'Open', 'Closing Soon', 'Live'
  skills TEXT[] NOT NULL DEFAULT '{}',
  team_size TEXT NOT NULL DEFAULT '1-4 Members',
  featured BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_featured ON public.events(featured);
CREATE INDEX IF NOT EXISTS idx_events_display_order ON public.events(display_order);

-- 2. Create user_saved_events Table for Bookmarks
CREATE TABLE IF NOT EXISTS public.user_saved_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_saved_events_unique UNIQUE (user_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_user_saved_events_user ON public.user_saved_events(user_id);

-- 3. Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_events ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
DROP POLICY IF EXISTS "events_public_read" ON public.events;
CREATE POLICY "events_public_read" ON public.events
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "user_saved_events_select_own" ON public.user_saved_events;
CREATE POLICY "user_saved_events_select_own" ON public.user_saved_events
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_saved_events_insert_own" ON public.user_saved_events;
CREATE POLICY "user_saved_events_insert_own" ON public.user_saved_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_saved_events_delete_own" ON public.user_saved_events;
CREATE POLICY "user_saved_events_delete_own" ON public.user_saved_events
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Seed Catalog with Real Competitions Matching User Reference
INSERT INTO public.events (
  id, title, organizer, category, mode, is_free, prize_pool, 
  banner_style, description, eligibility, registration_deadline, 
  registration_url, registration_status, skills, team_size, featured, display_order
)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'HDFC Life''s Aspire 3.0',
    'HDFC Life',
    'Case Competition',
    'Online',
    TRUE,
    '₹1.8 Lakhs',
    '{"theme": "corporate", "bgGradient": "from-rose-950 via-slate-900 to-black", "badgeColor": "bg-rose-500/20 text-rose-300 border-rose-500/30", "accentColor": "#F43F5E", "headline": "Solve a real business case. Win up to ₹1.8 lakh.", "subHeadline": "Case study competition for MBA and college students brought to you by HDFC Life"}'::jsonb,
    'National level business case study competition where student teams solve critical real-world insurance and fintech challenges, engage with HDFC Life corporate leadership, and compete for cash prizes and pre-placement interviews.',
    'Open to 1st and 2nd year MBA students and pre-final/final year undergraduate college cohorts.',
    NOW() + INTERVAL '18 days',
    'https://unstop.com',
    'Open',
    ARRAY['Business Strategy', 'Financial Modeling', 'Market Sizing', 'Pitch Presentation'],
    '2-3 Members',
    TRUE,
    1
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Eurogrip TORQ Challenge 4.0',
    'Eurogrip Tyres',
    'Case Competition',
    'Online',
    TRUE,
    '₹3 Lakhs + PPIs',
    '{"theme": "automotive", "bgGradient": "from-blue-950 via-indigo-950 to-black", "badgeColor": "bg-blue-500/20 text-blue-300 border-blue-500/30", "accentColor": "#3B82F6", "headline": "Write a great case study. Make a case for your career!", "subHeadline": "Win up to ₹3 Lakhs + PPIs with the Case Study Competition and Amazon vouchers"}'::jsonb,
    'National Case-Study Competition by TVS Srichakra (Eurogrip). Craft innovative go-to-market strategies, supply chain breakthroughs, and brand initiatives with direct PPI opportunities for top finalists.',
    'Open to Engineering and Management students across recognized Indian universities.',
    NOW() + INTERVAL '24 days',
    'https://unstop.com',
    'Open',
    ARRAY['Supply Chain', 'Go-To-Market', 'Brand Strategy', 'Operations'],
    '1-3 Members',
    TRUE,
    2
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'DJXHack Residency - Selection Online Challenge',
    'DJX Labs',
    'Residency Challenge',
    'Online',
    TRUE,
    '₹75,000 + Residency',
    '{"theme": "hacker", "bgGradient": "from-amber-950 via-stone-900 to-black", "badgeColor": "bg-amber-500/20 text-amber-300 border-amber-500/30", "accentColor": "#F59E0B", "headline": "BUILD IT FROM HOME", "subHeadline": "Ideas. Code. Interact. Anywhere. ₹75,000 Online Prize + Ticket to Hacker Residency"}'::jsonb,
    'A creative online engineering challenge for real-world builders. Pick a hard problem, build a working prototype with any modern stack, submit a short demo video, and win cash prizes plus an all-expenses-paid hacker residency.',
    'Open to developers, product designers, and creative technologists worldwide.',
    NOW() + INTERVAL '12 days',
    'https://unstop.com',
    'Closing Soon',
    ARRAY['Full Stack', 'AI / LLMs', 'Prototyping', 'System Design'],
    'Individual or Teams (1-4)',
    TRUE,
    3
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'Get Unstoppable on LinkedIn',
    'LinkedIn x Unstop',
    'Hiring Challenge',
    'Online',
    TRUE,
    'Mentorship & Profiles',
    '{"theme": "networking", "bgGradient": "from-sky-950 via-slate-900 to-black", "badgeColor": "bg-sky-500/20 text-sky-300 border-sky-500/30", "accentColor": "#0EA5E9", "headline": "Get Unstoppable on LinkedIn", "subHeadline": "Show up. Speak up. Stand out. Build your high-signal professional presence"}'::jsonb,
    'Exclusive creator and professional sprint in partnership with LinkedIn. Master high-signal portfolio storytelling, expand executive networks, and unlock priority referral screenings with top tech recruiters.',
    'Open to all early career professionals, graduates, and college students.',
    NOW() + INTERVAL '30 days',
    'https://unstop.com',
    'Open',
    ARRAY['Personal Branding', 'Networking', 'Career Growth', 'ATS Resume'],
    'Individual',
    TRUE,
    4
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    'Smart India Hackathon 2026',
    'Ministry of Education & AICTE',
    'Hackathon',
    'Hybrid',
    TRUE,
    '₹1 Crore Prize Pool',
    '{"theme": "national", "bgGradient": "from-emerald-950 via-slate-900 to-black", "badgeColor": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", "accentColor": "#10B981", "headline": "World''s Biggest Open Innovation Model", "subHeadline": "Solve pressing challenges faced by government ministries and top industries"}'::jsonb,
    'Nationwide initiative to provide students with a platform to solve some of the pressing problems faced in daily life across healthcare, smart automation, clean water, and digital governance.',
    'Regular college students pursuing graduate or post-graduate degrees.',
    NOW() + INTERVAL '45 days',
    'https://sih.gov.in',
    'Open',
    ARRAY['AI / ML', 'IoT', 'Cloud Systems', 'Robotics', 'Cybersecurity'],
    '6 Members (min 1 female member)',
    TRUE,
    5
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    'Flipkart GRiD 6.0 Engineering Challenge',
    'Flipkart',
    'Hackathon',
    'Online',
    TRUE,
    '₹5.25 Lakhs + PPIs',
    '{"theme": "ecommerce", "bgGradient": "from-violet-950 via-slate-900 to-black", "badgeColor": "bg-violet-500/20 text-violet-300 border-violet-500/30", "accentColor": "#8B5CF6", "headline": "Flipkart GRiD 6.0", "subHeadline": "Next-Gen E-Commerce Technology, Robotics, and Generative AI Track"}'::jsonb,
    'Flipkart''s flagship engineering campus challenge offering live business problem statements in Generative AI, Robotics Automation, and High-Throughput E-commerce Infrastructure with SDE-1 PPI opportunities.',
    'B.Tech / B.E. / M.Tech / Dual Degree students of batch 2025, 2026, 2027.',
    NOW() + INTERVAL '20 days',
    'https://unstop.com',
    'Open',
    ARRAY['Algorithms', 'Generative AI', 'Robotics', 'Distributed Systems'],
    '2-3 Members',
    TRUE,
    6
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  organizer = EXCLUDED.organizer,
  category = EXCLUDED.category,
  mode = EXCLUDED.mode,
  is_free = EXCLUDED.is_free,
  prize_pool = EXCLUDED.prize_pool,
  banner_style = EXCLUDED.banner_style,
  description = EXCLUDED.description,
  eligibility = EXCLUDED.eligibility,
  registration_deadline = EXCLUDED.registration_deadline,
  registration_url = EXCLUDED.registration_url,
  registration_status = EXCLUDED.registration_status,
  skills = EXCLUDED.skills,
  team_size = EXCLUDED.team_size,
  featured = EXCLUDED.featured,
  display_order = EXCLUDED.display_order;
