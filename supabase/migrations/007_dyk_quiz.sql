-- =====================================================
-- DYK (Do You Know) Quiz System
-- =====================================================

-- Question category enum
DO $$ BEGIN
    CREATE TYPE quiz_category AS ENUM ('maternal', 'paternal', 'self', 'extended');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Question difficulty enum
DO $$ BEGIN
    CREATE TYPE quiz_difficulty AS ENUM ('easy', 'medium', 'hard');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Answer type enum
DO $$ BEGIN
    CREATE TYPE quiz_answer_type AS ENUM ('multiple_choice', 'text', 'date', 'yes_no');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =====================================================
-- DYK QUESTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS dyk_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    category quiz_category NOT NULL DEFAULT 'extended',
    difficulty quiz_difficulty NOT NULL DEFAULT 'medium',
    answer_type quiz_answer_type NOT NULL DEFAULT 'multiple_choice',
    options JSONB, -- For multiple choice questions
    correct_answer TEXT NOT NULL,
    points INTEGER DEFAULT 10,
    related_person_id UUID REFERENCES persons(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dyk_questions_family ON dyk_questions(family_id);
CREATE INDEX IF NOT EXISTS idx_dyk_questions_category ON dyk_questions(family_id, category);
CREATE INDEX IF NOT EXISTS idx_dyk_questions_person ON dyk_questions(related_person_id);

-- =====================================================
-- DYK RESPONSES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS dyk_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES dyk_questions(id) ON DELETE CASCADE,
    response TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    points_earned INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(family_id, user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_dyk_responses_user ON dyk_responses(user_id, family_id);
CREATE INDEX IF NOT EXISTS idx_dyk_responses_question ON dyk_responses(question_id);

-- =====================================================
-- DETECTIVE CHALLENGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS detective_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    points INTEGER DEFAULT 25,
    difficulty quiz_difficulty DEFAULT 'medium',
    challenge_type TEXT DEFAULT 'research',
    requirements JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- USER CHALLENGE PROGRESS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS user_challenge_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES detective_challenges(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- pending, in_progress, completed
    evidence_url TEXT,
    notes TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, family_id, challenge_id)
);

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE dyk_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dyk_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE detective_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;

-- DYK Questions policies
CREATE POLICY "Family members can view questions" ON dyk_questions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM family_members
        WHERE family_id = dyk_questions.family_id AND user_id = auth.uid()
    ));

CREATE POLICY "Family members can create questions" ON dyk_questions FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM family_members
        WHERE family_id = dyk_questions.family_id AND user_id = auth.uid()
    ));

CREATE POLICY "Family members can update questions" ON dyk_questions FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM family_members
        WHERE family_id = dyk_questions.family_id AND user_id = auth.uid()
    ));

-- DYK Responses policies
CREATE POLICY "Users can view their responses" ON dyk_responses FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their responses" ON dyk_responses FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their responses" ON dyk_responses FOR UPDATE
    USING (user_id = auth.uid());

-- Detective Challenges policies (public read)
CREATE POLICY "Anyone can view active challenges" ON detective_challenges FOR SELECT
    USING (is_active = true);

-- User Challenge Progress policies
CREATE POLICY "Users can view their progress" ON user_challenge_progress FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their progress" ON user_challenge_progress FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their progress" ON user_challenge_progress FOR UPDATE
    USING (user_id = auth.uid());

-- =====================================================
-- INSERT DEFAULT CHALLENGES
-- =====================================================

INSERT INTO detective_challenges (title, description, points, difficulty, challenge_type) VALUES
    ('Entrevista a un Abuelo', 'Graba una conversación con un abuelo sobre sus recuerdos de infancia', 50, 'medium', 'interview'),
    ('Digitaliza Fotos Antiguas', 'Encuentra y escanea al menos 5 fotos familiares de antes de 1980', 25, 'easy', 'archive'),
    ('Investiga Registros de Inmigración', 'Encuentra registros de inmigración o viaje de un antepasado que vino de otro país', 100, 'hard', 'research'),
    ('Crea el Árbol de 3 Generaciones', 'Completa la información de al menos 3 generaciones en tu árbol', 30, 'medium', 'tree'),
    ('Encuentra un Documento Histórico', 'Localiza un acta de nacimiento, matrimonio o defunción de un ancestro', 75, 'hard', 'archive'),
    ('Entrevista sobre Tradiciones', 'Documenta una tradición familiar con al menos 2 familiares diferentes', 40, 'medium', 'interview')
ON CONFLICT DO NOTHING;

-- =====================================================
-- FUNCTION TO CALCULATE USER QUIZ STATS
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_quiz_stats(p_user_id UUID, p_family_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_answered', COUNT(*),
        'total_correct', COUNT(*) FILTER (WHERE is_correct),
        'total_points', COALESCE(SUM(points_earned), 0),
        'score_percentage', CASE
            WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE is_correct)::numeric / COUNT(*)::numeric) * 100)
            ELSE 0
        END
    ) INTO v_stats
    FROM dyk_responses
    WHERE user_id = p_user_id AND family_id = p_family_id;

    RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
