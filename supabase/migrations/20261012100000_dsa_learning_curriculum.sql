-- Migration: 20261012100000_dsa_learning_curriculum.sql
-- Description: DSA Curriculum, Visual Explainers, and Adaptive Practice Schema

-- 1. DSA Topics Table
CREATE TABLE IF NOT EXISTS public.dsa_topics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('Beginner', 'Intermediate', 'Advanced')),
  difficulty_level INT NOT NULL CHECK (difficulty_level IN (0, 1, 2)),
  interview_frequency TEXT NOT NULL CHECK (interview_frequency IN ('High', 'Medium', 'Low')),
  prerequisite_topic_ids TEXT[] DEFAULT '{}',
  explainer_concept TEXT NOT NULL,
  explainer_why_it_matters TEXT NOT NULL,
  explainer_common_use TEXT NOT NULL,
  worked_example JSONB NOT NULL,
  visualizer_type TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DSA Questions Table (No code execution: trace output, complexity, conceptual ordering)
CREATE TABLE IF NOT EXISTS public.dsa_questions (
  id TEXT PRIMARY KEY,
  topic_id TEXT REFERENCES public.dsa_topics(id) ON DELETE CASCADE,
  difficulty_level INT NOT NULL CHECK (difficulty_level IN (0, 1, 2)),
  question_type TEXT NOT NULL CHECK (question_type IN ('trace_output', 'complexity', 'conceptual_ordering')),
  question_text TEXT NOT NULL,
  code_snippet TEXT DEFAULT '',
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DSA Progress Table
CREATE TABLE IF NOT EXISTS public.dsa_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  topic_id TEXT REFERENCES public.dsa_topics(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  mastery_score INT DEFAULT 0,
  effective_level_for_topic INT DEFAULT 0,
  questions_answered INT DEFAULT 0,
  questions_correct INT DEFAULT 0,
  last_practiced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_dsa_topics_tier ON public.dsa_topics(tier);
CREATE INDEX IF NOT EXISTS idx_dsa_topics_frequency ON public.dsa_topics(interview_frequency);
CREATE INDEX IF NOT EXISTS idx_dsa_topics_order ON public.dsa_topics(order_index);
CREATE INDEX IF NOT EXISTS idx_dsa_questions_topic_level ON public.dsa_questions(topic_id, difficulty_level);
CREATE INDEX IF NOT EXISTS idx_dsa_progress_user_topic ON public.dsa_progress(user_id, topic_id);

-- Row Level Security
ALTER TABLE public.dsa_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsa_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dsa_progress ENABLE ROW LEVEL SECURITY;

-- Policies for dsa_topics
CREATE POLICY "Anyone can view dsa topics"
  ON public.dsa_topics FOR SELECT
  USING (true);

-- Policies for dsa_questions (Anyone can view questions)
CREATE POLICY "Anyone can view dsa questions"
  ON public.dsa_questions FOR SELECT
  USING (true);

-- Policies for dsa_progress (Users manage their own progress)
CREATE POLICY "Users can manage their own dsa progress"
  ON public.dsa_progress FOR ALL
  USING (auth.uid() = user_id);
