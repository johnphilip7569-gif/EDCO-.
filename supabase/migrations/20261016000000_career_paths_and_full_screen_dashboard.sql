-- ==============================================================================
-- Migration: 20261016000000_career_paths_and_full_screen_dashboard.sql
-- Description: Feature 31 - Career Path Selection & Full-Screen Career-Driven Dashboard
-- Tables: career_paths, user_career_paths, career_path_widget_map + Seeds & Migration
-- ==============================================================================

-- 1. Create career_paths Table
CREATE TABLE IF NOT EXISTS public.career_paths (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  typical_skills TEXT[] NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_paths_category ON public.career_paths(category);
CREATE INDEX IF NOT EXISTS idx_career_paths_active ON public.career_paths(active);

-- 2. Create user_career_paths Table (1 primary + max 2 secondary per user)
CREATE TABLE IF NOT EXISTS public.user_career_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  career_path_id TEXT NOT NULL REFERENCES public.career_paths(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  selected_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_career_paths_unique UNIQUE (user_id, career_path_id)
);

CREATE INDEX IF NOT EXISTS idx_user_career_paths_user ON public.user_career_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_user_career_paths_primary ON public.user_career_paths(user_id, is_primary);

-- 3. Create career_path_widget_map Table (Dynamic configuration for dashboard widget priority)
CREATE TABLE IF NOT EXISTS public.career_path_widget_map (
  career_path_id TEXT PRIMARY KEY REFERENCES public.career_paths(id) ON DELETE CASCADE,
  priority_widgets TEXT[] NOT NULL,
  secondary_widgets TEXT[] NOT NULL DEFAULT '{}',
  focus_areas JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security
ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_path_widget_map ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "career_paths_public_read" ON public.career_paths;
CREATE POLICY "career_paths_public_read" ON public.career_paths
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "career_path_widget_map_public_read" ON public.career_path_widget_map;
CREATE POLICY "career_path_widget_map_public_read" ON public.career_path_widget_map
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "user_career_paths_select_own" ON public.user_career_paths;
CREATE POLICY "user_career_paths_select_own" ON public.user_career_paths
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_career_paths_insert_own" ON public.user_career_paths;
CREATE POLICY "user_career_paths_insert_own" ON public.user_career_paths
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_career_paths_update_own" ON public.user_career_paths;
CREATE POLICY "user_career_paths_update_own" ON public.user_career_paths
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_career_paths_delete_own" ON public.user_career_paths;
CREATE POLICY "user_career_paths_delete_own" ON public.user_career_paths
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Comprehensive Seed Catalog for career_paths
INSERT INTO public.career_paths (id, name, category, description, typical_skills, display_order)
VALUES
  -- Software & Tech
  ('swe_fullstack', 'Full Stack Software Engineer', 'Software & Tech', 'Designs and builds end-to-end web applications, APIs, and responsive user interfaces.', ARRAY['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'System Design'], 1),
  ('swe_backend', 'Backend Systems Engineer', 'Software & Tech', 'Architects high-throughput server-side systems, distributed caching, and microservices.', ARRAY['Go', 'Java', 'Python', 'Distributed Systems', 'Kafka', 'Redis'], 2),
  ('swe_frontend', 'Frontend Engineer', 'Software & Tech', 'Crafts accessible, high-performance web applications and design systems.', ARRAY['React', 'Next.js', 'CSS Architecture', 'Web Performance', 'TypeScript'], 3),
  ('cloud_devops', 'Cloud & DevOps Engineer', 'Software & Tech', 'Automates continuous deployment pipelines, Kubernetes clusters, and cloud infrastructure.', ARRAY['Docker', 'Kubernetes', 'Terraform', 'AWS', 'CI/CD Pipelines'], 4),
  ('mobile_developer', 'Mobile App Developer', 'Software & Tech', 'Builds native and cross-platform mobile apps for iOS and Android ecosystems.', ARRAY['Flutter', 'React Native', 'Swift', 'Kotlin', 'Mobile UI Architecture'], 5),
  ('cybersecurity_engineer', 'Cybersecurity & InfoSec Engineer', 'Software & Tech', 'Protects infrastructure, applications, and networks from cyber threats and compliance risks.', ARRAY['Network Security', 'Penetration Testing', 'OWASP', 'Cryptography', 'SIEM'], 6),
  ('embedded_iot', 'Embedded Systems & IoT Engineer', 'Software & Tech', 'Programs microcontrollers, firmware, and low-latency hardware-software interfaces.', ARRAY['C', 'C++', 'RTOS', 'Microcontrollers', 'IoT Protocols'], 7),

  -- Data & AI
  ('data_scientist', 'Data Scientist', 'Data & AI', 'Analyzes complex datasets with statistical models and machine learning to drive decisions.', ARRAY['Python', 'SQL', 'Statistics', 'Scikit-Learn', 'Exploratory Data Analysis'], 10),
  ('ai_ml_engineer', 'Machine Learning / AI Engineer', 'Data & AI', 'Designs, trains, and deploys deep learning models, LLMs, and neural networks in production.', ARRAY['PyTorch', 'Transformers', 'LLMs', 'Vector Databases', 'MLOps'], 11),
  ('data_engineer', 'Data Engineer', 'Data & AI', 'Constructs scalable data pipelines, data warehouses, and automated ETL workflows.', ARRAY['Apache Spark', 'SQL', 'Airflow', 'dbt', 'Data Lakehouses'], 12),
  ('bi_data_analyst', 'Business Intelligence & Data Analyst', 'Data & AI', 'Transforms raw business metrics into actionable dashboards, KPIs, and executive reports.', ARRAY['SQL', 'Power BI', 'Tableau', 'Excel', 'Metric Modeling'], 13),

  -- Design & Product
  ('uiux_designer', 'UI/UX & Product Designer', 'Design & Product', 'Researches user behaviors and crafts intuitive interfaces, wireframes, and design systems.', ARRAY['Figma', 'User Research', 'Design Systems', 'Wireframing', 'Prototyping'], 20),
  ('graphic_brand_designer', 'Graphic & Brand Designer', 'Design & Product', 'Creates brand identities, visual communication, typography, and marketing assets.', ARRAY['Illustrator', 'Photoshop', 'Brand Strategy', 'Typography', 'Visual Design'], 21),
  ('product_manager', 'Technical Product Manager', 'Design & Product', 'Defines product roadmaps, prioritizes features, and bridges business and engineering.', ARRAY['Product Strategy', 'User Stories', 'Agile/Scrum', 'Data Analytics', 'Roadmapping'], 22),

  -- Business & Management
  ('management_consultant', 'Management Consultant', 'Business & Management', 'Advises corporate executives on strategic growth, cost optimization, and operations.', ARRAY['Structured Problem Solving', 'Financial Modeling', 'Market Sizing', 'Executive Presentation'], 30),
  ('operations_manager', 'Operations & Supply Chain Manager', 'Business & Management', 'Optimizes logistical networks, procurement, and end-to-end supply chain processes.', ARRAY['Process Optimization', 'Logistics', 'Inventory Management', 'Vendor Management'], 31),
  ('hr_talent_partner', 'Human Resources & Talent Specialist', 'Business & Management', 'Drives talent acquisition, organizational culture, employee relations, and HR compliance.', ARRAY['Talent Sourcing', 'Compensation & Benefits', 'Labor Law', 'Performance Management'], 32),
  ('sales_bd_manager', 'Sales & Enterprise BD Manager', 'Business & Management', 'Identifies commercial opportunities, closes enterprise sales deals, and expands accounts.', ARRAY['B2B Sales', 'CRM Pipeline Management', 'Negotiation', 'Client Relationship'], 33),

  -- Finance & Accounting
  ('investment_banking', 'Investment Banking Analyst', 'Finance & Accounting', 'Evaluates valuation multiples, builds LBO models, and coordinates M&A transactions.', ARRAY['Financial Modeling', 'DCF Valuation', 'M&A Due Diligence', 'Pitch Decks'], 40),
  ('chartered_accountant', 'Chartered Accountant / Auditor', 'Finance & Accounting', 'Oversees financial auditing, corporate taxation compliance, and statutory balance sheets.', ARRAY['Statutory Auditing', 'Taxation Laws', 'IFRS / Ind AS', 'Financial Reporting'], 41),
  ('quant_analyst', 'Quantitative Analyst / Trader', 'Finance & Accounting', 'Applies mathematical models, statistical arbitrage, and algorithms to trading markets.', ARRAY['Python', 'Stochastic Calculus', 'Algorithmic Trading', 'Risk Modeling'], 42),
  ('corporate_finance', 'Corporate Finance & FP&A Analyst', 'Finance & Accounting', 'Forecasts quarterly budgets, models working capital, and allocates corporate capital.', ARRAY['Budget Forecasting', 'Variance Analysis', 'Cash Flow Modeling', 'Excel / PowerQuery'], 43),

  -- Core Engineering
  ('mechanical_engineer', 'Mechanical & Automotive Engineer', 'Core Engineering', 'Designs physical machinery, thermal systems, structural chassis, and CAD models.', ARRAY['SolidWorks', 'AutoCAD', 'Thermodynamics', 'Finite Element Analysis', 'Manufacturing'], 50),
  ('civil_engineer', 'Civil & Structural Engineer', 'Core Engineering', 'Plans and oversees construction of residential buildings, bridges, and infrastructure.', ARRAY['Structural Analysis', 'STAAD Pro', 'AutoCAD', 'Surveying', 'Project Management'], 51),
  ('electrical_engineer', 'Electrical & Electronics Engineer', 'Core Engineering', 'Designs power grids, circuit schematics, PCB layouts, and electronic controllers.', ARRAY['Circuit Design', 'MATLAB', 'PCB Design', 'Power Systems', 'Microprocessors'], 52),
  ('chemical_engineer', 'Chemical & Process Engineer', 'Core Engineering', 'Develops industrial chemical manufacturing processes, plant safety, and reaction yields.', ARRAY['Process Simulation', 'Chemical Kinetics', 'Safety Engineering', 'Mass Transfer'], 53),

  -- Healthcare & Life Sciences
  ('clinical_doctor', 'Clinical Physician / Doctor', 'Healthcare & Life Sciences', 'Diagnoses and treats patient medical ailments across clinical and hospital settings.', ARRAY['Clinical Diagnosis', 'Patient Care', 'Pharmacology', 'Medical Ethics'], 60),
  ('biomedical_engineer', 'Biomedical Engineer', 'Healthcare & Life Sciences', 'Develops innovative medical devices, prosthetic hardware, and diagnostic imaging equipment.', ARRAY['Biomechanics', 'Medical Instrumentation', 'Biomaterials', 'FDA Regulatory Standards'], 61),
  ('pharma_scientist', 'Pharmaceutical Scientist', 'Healthcare & Life Sciences', 'Formulates and tests therapeutic drugs, clinical trial pipelines, and dosage compounds.', ARRAY['Drug Formulation', 'Pharmacokinetics', 'Analytical Chemistry', 'Clinical Protocols'], 62),
  ('biotech_researcher', 'Biotechnology & Genomics Researcher', 'Healthcare & Life Sciences', 'Conducts genetic sequencing, gene editing, cell cultures, and recombinant DNA research.', ARRAY['Molecular Biology', 'CRISPR Gene Editing', 'Bioinformatics', 'Cell Culture'], 63),

  -- Law & Legal Services
  ('corporate_lawyer', 'Corporate Lawyer', 'Law & Legal Services', 'Drafts commercial contracts, structures M&A agreements, and guides corporate governance.', ARRAY['Contract Drafting', 'M&A Due Diligence', 'Corporate Law', 'Regulatory Compliance'], 70),
  ('litigation_advocate', 'Litigation & Dispute Advocate', 'Law & Legal Services', 'Represents clients in judicial courtrooms, arbitration panels, and legal hearings.', ARRAY['Legal Research', 'Courtroom Advocacy', 'Civil Procedure', 'Oral Argumentation'], 71),
  ('ip_patent_attorney', 'Intellectual Property & Patent Attorney', 'Law & Legal Services', 'Secures patent protections, trademark filings, software copyrights, and licensing terms.', ARRAY['Patent Drafting', 'Trademark Law', 'IP Prosecution', 'Prior Art Search'], 72),

  -- Government & Public Services
  ('civil_services_officer', 'Civil Services Officer (IAS / IPS / IFS)', 'Government & Public Services', 'Administers district public policy, law enforcement, and national foreign diplomacy.', ARRAY['Public Administration', 'Constitutional Law', 'Policy Formulation', 'Crisis Governance'], 80),
  ('govt_banking_exams', 'Public Sector & Banking Officer (IBPS / SSC)', 'Government & Public Services', 'Executes government revenue administration, central compliance, and banking operations.', ARRAY['Quantitative Aptitude', 'Reasoning Agility', 'Banking Awareness', 'General Studies'], 81),
  ('defense_officer', 'Defense & Armed Forces Officer', 'Government & Public Services', 'Leads tactical missions and commands military, naval, or aerospace defense forces.', ARRAY['Strategic Leadership', 'Tactical Operations', 'Defense Logistics', 'Crisis Response'], 82),

  -- Teaching & Research
  ('university_professor', 'University Professor & Academician', 'Teaching & Research', 'Educates higher education students and publishes academic peer-reviewed research.', ARRAY['Pedagogical Curriculum', 'Academic Publishing', 'Grant Writing', 'Higher Education'], 90),
  ('stem_educator', 'School & STEM Educator', 'Teaching & Research', 'Inspires primary and secondary learners with foundational sciences and mathematics.', ARRAY['Instructional Design', 'Student Assessment', 'Classroom Leadership', 'STEM Pedagogy'], 91),
  ('rd_scientist', 'Industrial R&D Research Scientist', 'Teaching & Research', 'Executes applied laboratory research to pioneer commercial products and innovations.', ARRAY['Experimental Design', 'Data Modeling', 'Scientific Writing', 'Patent Disclosure'], 92),

  -- Media, Journalism & Creative
  ('content_creator', 'Digital Media Producer & Content Creator', 'Media & Creative', 'Produces digital video, podcasts, and multimedia narratives across channels.', ARRAY['Video Editing', 'Scriptwriting', 'Social Distribution', 'Visual Storytelling'], 100),
  ('journalist', 'Journalist & Investigative Reporter', 'Media & Creative', 'Investigates breaking news stories, verifies facts, and publishes public reporting.', ARRAY['Investigative Research', 'Interviewing', 'News Writing', 'Media Ethics'], 101),
  ('pr_communications', 'Public Relations & Communications', 'Media & Creative', 'Directs corporate reputation, brand narrative, press relationships, and crises.', ARRAY['Press Releases', 'Media Pitching', 'Crisis Communication', 'Stakeholder Management'], 102),

  -- Entrepreneurship
  ('startup_founder', 'Startup Founder & Venture Builder', 'Entrepreneurship', 'Launches high-growth ventures, develops MVPs, raises venture funding, and scales teams.', ARRAY['Product-Market Fit', 'Venture Fundraising', 'Go-To-Market Strategy', 'Team Leadership'], 110),

  -- Exploratory
  ('other_exploring', 'Other / Not Sure Yet', 'Exploratory & Open Focus', 'Open to exploring career disciplines across technology, business, and creative fields.', ARRAY['General Aptitude', 'Communication', 'Career Exploration', 'Critical Thinking'], 999)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  typical_skills = EXCLUDED.typical_skills,
  display_order = EXCLUDED.display_order;

-- 7. Seed career_path_widget_map Configuration
INSERT INTO public.career_path_widget_map (career_path_id, priority_widgets, secondary_widgets, focus_areas)
VALUES
  -- Software & Tech paths
  ('swe_fullstack', ARRAY['continue_dsa', 'my_career_plan', 'continue_learning', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['daily_practice_sprint', 'connection_birthdays', 'verified_identity'], '{"drills": ["dsa", "star_interview", "resume_ats"], "categorySlug": "software-engineering"}'::jsonb),
  ('swe_backend', ARRAY['continue_dsa', 'continue_learning', 'my_career_plan', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['daily_practice_sprint', 'connection_birthdays', 'verified_identity'], '{"drills": ["system_design", "dsa", "sql"], "categorySlug": "backend-engineering"}'::jsonb),
  ('swe_frontend', ARRAY['continue_learning', 'my_career_plan', 'continue_dsa', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['daily_practice_sprint', 'connection_birthdays', 'verified_identity'], '{"drills": ["web_performance", "javascript", "react"], "categorySlug": "frontend-engineering"}'::jsonb),
  ('cloud_devops', ARRAY['continue_learning', 'my_career_plan', 'recommended_curriculum', 'score_readiness_matrix', 'daily_practice_sprint'], ARRAY['continue_dsa', 'connection_birthdays', 'verified_identity'], '{"drills": ["kubernetes", "docker", "ci_cd"], "categorySlug": "cloud-devops"}'::jsonb),
  ('mobile_developer', ARRAY['continue_learning', 'my_career_plan', 'continue_dsa', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['daily_practice_sprint', 'connection_birthdays', 'verified_identity'], '{"drills": ["flutter", "mobile_arch", "react_native"], "categorySlug": "mobile-development"}'::jsonb),
  ('cybersecurity_engineer', ARRAY['continue_learning', 'my_career_plan', 'recommended_curriculum', 'score_readiness_matrix', 'daily_practice_sprint'], ARRAY['connection_birthdays', 'verified_identity', 'continue_dsa'], '{"drills": ["owasp", "network_sec", "cryptography"], "categorySlug": "cybersecurity"}'::jsonb),
  ('embedded_iot', ARRAY['continue_learning', 'continue_dsa', 'my_career_plan', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['daily_practice_sprint', 'connection_birthdays', 'verified_identity'], '{"drills": ["c_cpp", "rtos", "hardware_interfacing"], "categorySlug": "embedded-iot"}'::jsonb),

  -- Data & AI paths
  ('data_scientist', ARRAY['continue_learning', 'my_career_plan', 'recommended_curriculum', 'score_readiness_matrix', 'daily_practice_sprint'], ARRAY['continue_dsa', 'connection_birthdays', 'verified_identity'], '{"drills": ["statistics", "python_data", "sql"], "categorySlug": "data-science"}'::jsonb),
  ('ai_ml_engineer', ARRAY['continue_learning', 'my_career_plan', 'continue_dsa', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['daily_practice_sprint', 'connection_birthdays', 'verified_identity'], '{"drills": ["pytorch", "llm_systems", "neural_nets"], "categorySlug": "ai-ml"}'::jsonb),
  ('data_engineer', ARRAY['continue_learning', 'my_career_plan', 'continue_dsa', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['daily_practice_sprint', 'connection_birthdays', 'verified_identity'], '{"drills": ["data_pipelines", "sql", "spark"], "categorySlug": "data-engineering"}'::jsonb),
  ('bi_data_analyst', ARRAY['my_career_plan', 'continue_learning', 'daily_practice_sprint', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["sql_bi", "excel_modeling", "kpi_dashboards"], "categorySlug": "data-analytics"}'::jsonb),

  -- Design & Product
  ('uiux_designer', ARRAY['my_career_plan', 'continue_learning', 'recommended_curriculum', 'score_readiness_matrix', 'daily_practice_sprint'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["portfolio_review", "design_critique", "heuristics"], "categorySlug": "product-design"}'::jsonb),
  ('graphic_brand_designer', ARRAY['my_career_plan', 'continue_learning', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['daily_practice_sprint', 'connection_birthdays', 'verified_identity'], '{"drills": ["visual_portfolio", "brand_identity"], "categorySlug": "graphic-design"}'::jsonb),
  ('product_manager', ARRAY['my_career_plan', 'continue_learning', 'score_readiness_matrix', 'recommended_curriculum', 'daily_practice_sprint'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["product_sense", "metric_case", "behavioral"], "categorySlug": "product-management"}'::jsonb),

  -- Business & Management
  ('management_consultant', ARRAY['my_career_plan', 'daily_practice_sprint', 'continue_learning', 'score_readiness_matrix', 'recommended_curriculum'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["case_interviews", "guesstimates", "market_sizing"], "categorySlug": "management-consulting"}'::jsonb),
  ('operations_manager', ARRAY['my_career_plan', 'daily_practice_sprint', 'continue_learning', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["supply_chain", "operations_case"], "categorySlug": "operations-management"}'::jsonb),
  ('hr_talent_partner', ARRAY['my_career_plan', 'continue_learning', 'daily_practice_sprint', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["behavioral_hr", "talent_strategy"], "categorySlug": "human-resources"}'::jsonb),
  ('sales_bd_manager', ARRAY['my_career_plan', 'continue_learning', 'daily_practice_sprint', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["enterprise_sales", "pitch_simulations"], "categorySlug": "business-development"}'::jsonb),

  -- Finance & Accounting
  ('investment_banking', ARRAY['my_career_plan', 'daily_practice_sprint', 'continue_learning', 'score_readiness_matrix', 'recommended_curriculum'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["valuation_dcf", "accounting_finance", "lbo"], "categorySlug": "investment-banking"}'::jsonb),
  ('chartered_accountant', ARRAY['my_career_plan', 'daily_practice_sprint', 'continue_learning', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["statutory_audit", "tax_compliance"], "categorySlug": "accounting-audit"}'::jsonb),
  ('quant_analyst', ARRAY['continue_dsa', 'daily_practice_sprint', 'my_career_plan', 'continue_learning', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["quant_math", "python_algo", "stochastic"], "categorySlug": "quant-finance"}'::jsonb),
  ('corporate_finance', ARRAY['my_career_plan', 'daily_practice_sprint', 'continue_learning', 'score_readiness_matrix', 'recommended_curriculum'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["fpa_budgeting", "financial_modeling"], "categorySlug": "corporate-finance"}'::jsonb),

  -- Core Engineering
  ('mechanical_engineer', ARRAY['my_career_plan', 'continue_learning', 'daily_practice_sprint', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["cad_modeling", "thermodynamics_case"], "categorySlug": "mechanical-engineering"}'::jsonb),
  ('civil_engineer', ARRAY['my_career_plan', 'continue_learning', 'daily_practice_sprint', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["structural_design", "surveying_case"], "categorySlug": "civil-engineering"}'::jsonb),
  ('electrical_engineer', ARRAY['my_career_plan', 'continue_learning', 'daily_practice_sprint', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['continue_dsa', 'connection_birthdays', 'verified_identity'], '{"drills": ["circuit_simulation", "power_systems"], "categorySlug": "electrical-engineering"}'::jsonb),
  ('chemical_engineer', ARRAY['my_career_plan', 'continue_learning', 'daily_practice_sprint', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["process_simulation", "reaction_kinetics"], "categorySlug": "chemical-engineering"}'::jsonb),

  -- Healthcare & Life Sciences
  ('clinical_doctor', ARRAY['my_career_plan', 'continue_learning', 'daily_practice_sprint', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["clinical_case", "medical_ethics"], "categorySlug": "healthcare"}'::jsonb),
  ('biomedical_engineer', ARRAY['my_career_plan', 'continue_learning', 'daily_practice_sprint', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["biomaterials", "device_compliance"], "categorySlug": "biomedical-engineering"}'::jsonb),
  ('pharma_scientist', ARRAY['my_career_plan', 'continue_learning', 'daily_practice_sprint', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["drug_kinetics", "pharma_regulations"], "categorySlug": "pharmaceuticals"}'::jsonb),
  ('biotech_researcher', ARRAY['my_career_plan', 'continue_learning', 'daily_practice_sprint', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["genomics_data", "molecular_bio"], "categorySlug": "biotechnology"}'::jsonb),

  -- Law & Legal Services
  ('corporate_lawyer', ARRAY['my_career_plan', 'continue_learning', 'daily_practice_sprint', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["contract_analysis", "mna_case"], "categorySlug": "corporate-law"}'::jsonb),
  ('litigation_advocate', ARRAY['my_career_plan', 'continue_learning', 'daily_practice_sprint', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["legal_advocacy", "case_arguments"], "categorySlug": "litigation-law"}'::jsonb),
  ('ip_patent_attorney', ARRAY['my_career_plan', 'continue_learning', 'daily_practice_sprint', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["patent_claim_drafting", "prior_art"], "categorySlug": "patent-law"}'::jsonb),

  -- Government & Public Services
  ('civil_services_officer', ARRAY['daily_practice_sprint', 'my_career_plan', 'continue_learning', 'score_readiness_matrix', 'recommended_curriculum'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["general_studies", "essay_case_studies"], "categorySlug": "civil-services"}'::jsonb),
  ('govt_banking_exams', ARRAY['daily_practice_sprint', 'my_career_plan', 'continue_learning', 'score_readiness_matrix', 'recommended_curriculum'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["speed_math", "logical_reasoning", "english"], "categorySlug": "banking-exams"}'::jsonb),
  ('defense_officer', ARRAY['daily_practice_sprint', 'my_career_plan', 'continue_learning', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["ssb_psychology", "officer_intelligence"], "categorySlug": "defense-services"}'::jsonb),

  -- Teaching & Research
  ('university_professor', ARRAY['my_career_plan', 'continue_learning', 'recommended_curriculum', 'daily_practice_sprint', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["pedagogy", "research_methodology"], "categorySlug": "higher-education"}'::jsonb),
  ('stem_educator', ARRAY['my_career_plan', 'daily_practice_sprint', 'continue_learning', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["stem_instruction", "concept_breakdowns"], "categorySlug": "stem-education"}'::jsonb),
  ('rd_scientist', ARRAY['my_career_plan', 'continue_learning', 'recommended_curriculum', 'score_readiness_matrix'], ARRAY['daily_practice_sprint', 'connection_birthdays', 'verified_identity'], '{"drills": ["experimental_design", "patent_literature"], "categorySlug": "industrial-rd"}'::jsonb),

  -- Media & Creative
  ('content_creator', ARRAY['my_career_plan', 'continue_learning', 'recommended_curriculum', 'daily_practice_sprint'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["portfolio_review", "digital_storytelling"], "categorySlug": "digital-media"}'::jsonb),
  ('journalist', ARRAY['my_career_plan', 'continue_learning', 'daily_practice_sprint', 'recommended_curriculum'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["fact_checking", "interview_techniques"], "categorySlug": "journalism"}'::jsonb),
  ('pr_communications', ARRAY['my_career_plan', 'continue_learning', 'daily_practice_sprint', 'recommended_curriculum'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["crisis_pr", "media_pitching"], "categorySlug": "pr-communications"}'::jsonb),

  -- Entrepreneurship
  ('startup_founder', ARRAY['my_career_plan', 'continue_learning', 'score_readiness_matrix', 'daily_practice_sprint', 'recommended_curriculum'], ARRAY['connection_birthdays', 'verified_identity'], '{"drills": ["pitch_deck", "financial_runway", "gtm"], "categorySlug": "entrepreneurship"}'::jsonb),

  -- Exploratory
  ('other_exploring', ARRAY['daily_practice_sprint', 'my_career_plan', 'continue_learning', 'personalized_timetable', 'score_readiness_matrix'], ARRAY['recommended_curriculum', 'connection_birthdays', 'verified_identity'], '{"drills": ["general_aptitude", "interview_basics", "resume_intro"], "categorySlug": "career-exploration"}'::jsonb)
ON CONFLICT (career_path_id) DO UPDATE SET
  priority_widgets = EXCLUDED.priority_widgets,
  secondary_widgets = EXCLUDED.secondary_widgets,
  focus_areas = EXCLUDED.focus_areas;

-- 8. Add target_role to profiles if not present, and migrate existing profiles into user_career_paths
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_role TEXT;

INSERT INTO public.user_career_paths (user_id, career_path_id, is_primary)
SELECT 
  p.id, 
  CASE 
    WHEN p.target_role ILIKE '%backend%' THEN 'swe_backend'
    WHEN p.target_role ILIKE '%frontend%' THEN 'swe_frontend'
    WHEN p.target_role ILIKE '%data sci%' THEN 'data_scientist'
    WHEN p.target_role ILIKE '%ai%' OR p.target_role ILIKE '%machine learn%' THEN 'ai_ml_engineer'
    WHEN p.target_role ILIKE '%design%' OR p.target_role ILIKE '%ui%' OR p.target_role ILIKE '%ux%' THEN 'uiux_designer'
    WHEN p.target_role ILIKE '%product%' THEN 'product_manager'
    WHEN p.target_role ILIKE '%finance%' OR p.target_role ILIKE '%bank%' THEN 'investment_banking'
    WHEN p.target_role ILIKE '%consult%' THEN 'management_consultant'
    ELSE 'swe_fullstack'
  END AS career_path_id,
  TRUE AS is_primary
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_career_paths ucp WHERE ucp.user_id = p.id
)
ON CONFLICT (user_id, career_path_id) DO NOTHING;

-- Also update profiles.target_role for any profiles where target_role is NULL from the primary path
UPDATE public.profiles p
SET target_role = cp.name
FROM public.user_career_paths ucp
JOIN public.career_paths cp ON cp.id = ucp.career_path_id
WHERE ucp.user_id = p.id AND ucp.is_primary = TRUE AND (p.target_role IS NULL OR p.target_role = '');

