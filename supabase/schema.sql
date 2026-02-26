-- =====================================================
-- KinTree Database Schema for Supabase
-- Complete SQL schema for the Family Operating System
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE gender AS ENUM ('male', 'female', 'other', 'unknown');
CREATE TYPE privacy_level AS ENUM ('public', 'family', 'private');
CREATE TYPE family_role AS ENUM ('admin', 'editor', 'suggest_only', 'viewer');
CREATE TYPE relationship_type AS ENUM ('parent_child', 'spouse', 'sibling', 'adoptive_parent', 'step_parent', 'guardian');
CREATE TYPE union_type AS ENUM ('marriage', 'partnership', 'divorced', 'separated', 'other');
CREATE TYPE verification_status AS ENUM ('verified', 'pending', 'disputed');
CREATE TYPE suggestion_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE change_type AS ENUM ('create', 'update', 'delete');
CREATE TYPE entity_type AS ENUM ('person', 'union', 'relationship', 'geofence', 'historical_content');
CREATE TYPE dyk_category AS ENUM ('maternal', 'paternal', 'self', 'extended');
CREATE TYPE dyk_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE dyk_answer_type AS ENUM ('text', 'date', 'multiple_choice', 'yes_no');
CREATE TYPE challenge_category AS ENUM ('interview', 'research', 'documentation', 'photo');
CREATE TYPE social_platform AS ENUM ('instagram', 'facebook');
CREATE TYPE post_type AS ENUM ('text', 'photo', 'video', 'link', 'story');
CREATE TYPE location_status AS ENUM ('online', 'away', 'offline');

-- =====================================================
-- USER PROFILES (extends Supabase Auth)
-- =====================================================

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    timezone TEXT DEFAULT 'UTC',
    locale TEXT DEFAULT 'es',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FAMILIES
-- =====================================================

CREATE TABLE families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    primary_color TEXT DEFAULT '#0ea5e9',
    logo_url TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    settings JSONB DEFAULT '{
        "defaultPrivacyLevel": "family",
        "allowSuggestions": true,
        "notifyOnChanges": true,
        "requireApprovalForEdits": false
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FAMILY MEMBERS (junction table)
-- =====================================================

CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    person_id UUID, -- Link to person in tree (set after creating person record)
    role family_role NOT NULL DEFAULT 'viewer',
    nickname TEXT,
    invited_by UUID REFERENCES auth.users(id),
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(family_id, user_id)
);

-- =====================================================
-- PERSONS (people in the family tree)
-- =====================================================

CREATE TABLE persons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,

    -- Names
    first_name TEXT NOT NULL,
    middle_names TEXT[],
    last_name TEXT,
    maiden_name TEXT,
    nicknames TEXT[],

    -- Birth info
    birth_date DATE,
    birth_date_approximate BOOLEAN DEFAULT FALSE,
    birth_place TEXT,
    birth_place_coords GEOGRAPHY(POINT, 4326),

    -- Death info
    death_date DATE,
    death_date_approximate BOOLEAN DEFAULT FALSE,
    death_place TEXT,

    -- Personal info
    gender gender NOT NULL DEFAULT 'unknown',
    is_living BOOLEAN DEFAULT TRUE,
    biography TEXT,
    photo_url TEXT,

    -- Medical info
    medical_conditions JSONB DEFAULT '[]'::jsonb,

    -- Media
    voice_recordings TEXT[],
    gallery_urls TEXT[],

    -- Linking
    linked_user_id UUID REFERENCES auth.users(id),

    -- Metadata
    privacy_level privacy_level DEFAULT 'family',
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update family_members to reference persons
ALTER TABLE family_members
ADD CONSTRAINT fk_person
FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE SET NULL;

-- =====================================================
-- RELATIONSHIPS (parent-child, sibling, etc.)
-- =====================================================

CREATE TABLE relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    person1_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    person2_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    relationship_type relationship_type NOT NULL,
    is_biological BOOLEAN DEFAULT TRUE,
    start_date DATE,
    end_date DATE,
    verification_status verification_status DEFAULT 'pending',
    source_documents TEXT[],
    notes TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(family_id, person1_id, person2_id, relationship_type)
);

-- =====================================================
-- UNIONS (marriages, partnerships)
-- =====================================================

CREATE TABLE unions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    partner1_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    partner2_id UUID REFERENCES persons(id) ON DELETE SET NULL,
    union_type union_type NOT NULL DEFAULT 'marriage',
    start_date DATE,
    end_date DATE,
    location TEXT,
    location_coords GEOGRAPHY(POINT, 4326),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Children of unions (junction table)
CREATE TABLE union_children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    union_id UUID NOT NULL REFERENCES unions(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    is_biological BOOLEAN DEFAULT TRUE,
    UNIQUE(union_id, child_id)
);

-- =====================================================
-- LOCATIONS (real-time tracking)
-- =====================================================

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    coords GEOGRAPHY(POINT, 4326) NOT NULL,
    accuracy REAL,
    altitude REAL,
    speed REAL,
    heading REAL,
    battery_level INTEGER,
    status location_status DEFAULT 'online',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient location queries
CREATE INDEX idx_locations_user_time ON locations(user_id, recorded_at DESC);
CREATE INDEX idx_locations_family_time ON locations(family_id, recorded_at DESC);

-- =====================================================
-- GEOFENCES (Heritage Zones / Safe Zones)
-- =====================================================

CREATE TABLE geofences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,

    -- Geometry
    center GEOGRAPHY(POINT, 4326) NOT NULL,
    radius_meters INTEGER NOT NULL DEFAULT 100,
    polygon GEOGRAPHY(POLYGON, 4326),

    -- Heritage content
    related_person_ids UUID[],
    historical_narrative TEXT,
    historical_photos TEXT[],
    historical_documents TEXT[],
    historical_audio TEXT[],
    timeline_events JSONB DEFAULT '[]'::jsonb,

    -- Notifications
    notify_on_enter BOOLEAN DEFAULT TRUE,
    notify_on_exit BOOLEAN DEFAULT TRUE,

    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- GEOFENCE EVENTS (entry/exit logs)
-- =====================================================

CREATE TABLE geofence_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    geofence_id UUID NOT NULL REFERENCES geofences(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('enter', 'exit')),
    location_id UUID REFERENCES locations(id),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CHANGE HISTORY (audit log)
-- =====================================================

CREATE TABLE change_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    entity_type entity_type NOT NULL,
    entity_id UUID NOT NULL,
    change_type change_type NOT NULL,
    previous_data JSONB,
    new_data JSONB,
    change_description TEXT,
    changed_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient history queries
CREATE INDEX idx_change_history_entity ON change_history(entity_type, entity_id);
CREATE INDEX idx_change_history_family ON change_history(family_id, created_at DESC);

-- =====================================================
-- CHANGE SUGGESTIONS (for suggest_only role)
-- =====================================================

CREATE TABLE change_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    entity_type entity_type NOT NULL,
    entity_id UUID, -- NULL for create suggestions
    change_type change_type NOT NULL,
    suggested_data JSONB NOT NULL,
    reason TEXT,
    status suggestion_status DEFAULT 'pending',
    suggested_by UUID NOT NULL REFERENCES auth.users(id),
    suggested_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT
);

-- =====================================================
-- DYK QUESTIONS
-- =====================================================

CREATE TABLE dyk_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE, -- NULL = global questions
    question TEXT NOT NULL,
    category dyk_category NOT NULL,
    difficulty dyk_difficulty NOT NULL DEFAULT 'medium',
    answer_type dyk_answer_type NOT NULL DEFAULT 'text',
    options TEXT[], -- For multiple choice
    correct_answer TEXT,
    points INTEGER NOT NULL DEFAULT 10,
    related_person_id UUID REFERENCES persons(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DYK RESPONSES
-- =====================================================

CREATE TABLE dyk_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES dyk_questions(id) ON DELETE CASCADE,
    response TEXT NOT NULL,
    is_correct BOOLEAN,
    response_time_ms INTEGER,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(family_id, user_id, question_id)
);

-- =====================================================
-- DETECTIVE CHALLENGES
-- =====================================================

CREATE TABLE detective_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category challenge_category NOT NULL,
    difficulty dyk_difficulty NOT NULL DEFAULT 'medium',
    points INTEGER NOT NULL DEFAULT 50,
    requirements TEXT[] NOT NULL,
    suggested_questions TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COMPLETED CHALLENGES
-- =====================================================

CREATE TABLE completed_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES detective_challenges(id) ON DELETE CASCADE,
    evidence TEXT,
    evidence_urls TEXT[],
    verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(family_id, user_id, challenge_id)
);

-- =====================================================
-- SOCIAL MEDIA ACCOUNTS
-- =====================================================

CREATE TABLE social_media_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    platform social_platform NOT NULL,
    platform_user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    display_name TEXT,
    profile_picture_url TEXT,
    access_token TEXT NOT NULL, -- Should be encrypted
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(platform, platform_user_id)
);

-- =====================================================
-- SOCIAL POSTS
-- =====================================================

CREATE TABLE social_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES social_media_accounts(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    platform_post_id TEXT NOT NULL,
    post_type post_type NOT NULL,
    content TEXT,
    media_urls TEXT[],
    thumbnail_url TEXT,
    permalink TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    posted_at TIMESTAMPTZ NOT NULL,
    synced_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(account_id, platform_post_id)
);

-- Index for feed queries
CREATE INDEX idx_social_posts_family ON social_posts(family_id, posted_at DESC);

-- =====================================================
-- FEED PREFERENCES
-- =====================================================

CREATE TABLE feed_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    show_instagram BOOLEAN DEFAULT TRUE,
    show_facebook BOOLEAN DEFAULT TRUE,
    hide_from_person_ids UUID[],
    show_only_from_person_ids UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, family_id)
);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for notification queries
CREATE INDEX idx_notifications_user ON notifications(user_id, read, created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE unions ENABLE ROW LEVEL SECURITY;
ALTER TABLE union_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE geofences ENABLE ROW LEVEL SECURITY;
ALTER TABLE geofence_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dyk_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dyk_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE detective_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Families policies
CREATE POLICY "Users can view families they belong to" ON families
    FOR SELECT USING (
        id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND is_active = TRUE)
    );
CREATE POLICY "Users can create families" ON families
    FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admins can update family" ON families
    FOR UPDATE USING (
        id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND role = 'admin' AND is_active = TRUE)
    );

-- Family members policies
CREATE POLICY "Users can view members of their families" ON family_members
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND is_active = TRUE)
    );
CREATE POLICY "Admins can manage family members" ON family_members
    FOR ALL USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND role = 'admin' AND is_active = TRUE)
    );

-- Persons policies
CREATE POLICY "Users can view persons in their families" ON persons
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND is_active = TRUE)
    );
CREATE POLICY "Editors can create persons" ON persons
    FOR INSERT WITH CHECK (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND role IN ('admin', 'editor') AND is_active = TRUE)
    );
CREATE POLICY "Editors can update persons" ON persons
    FOR UPDATE USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND role IN ('admin', 'editor') AND is_active = TRUE)
    );

-- Relationships policies
CREATE POLICY "Users can view relationships in their families" ON relationships
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND is_active = TRUE)
    );
CREATE POLICY "Editors can manage relationships" ON relationships
    FOR ALL USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND role IN ('admin', 'editor') AND is_active = TRUE)
    );

-- Unions policies
CREATE POLICY "Users can view unions in their families" ON unions
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND is_active = TRUE)
    );
CREATE POLICY "Editors can manage unions" ON unions
    FOR ALL USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND role IN ('admin', 'editor') AND is_active = TRUE)
    );

-- Union children policies
CREATE POLICY "Users can view union children" ON union_children
    FOR SELECT USING (
        union_id IN (
            SELECT id FROM unions WHERE family_id IN (
                SELECT family_id FROM family_members WHERE user_id = auth.uid() AND is_active = TRUE
            )
        )
    );

-- Locations policies
CREATE POLICY "Users can insert own location" ON locations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view family locations" ON locations
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND is_active = TRUE)
    );

-- Geofences policies
CREATE POLICY "Users can view geofences in their families" ON geofences
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND is_active = TRUE)
    );
CREATE POLICY "Editors can manage geofences" ON geofences
    FOR ALL USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND role IN ('admin', 'editor') AND is_active = TRUE)
    );

-- Change history policies
CREATE POLICY "Users can view change history" ON change_history
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND is_active = TRUE)
    );

-- Change suggestions policies
CREATE POLICY "Users can view suggestions in their families" ON change_suggestions
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND is_active = TRUE)
    );
CREATE POLICY "Users can create suggestions" ON change_suggestions
    FOR INSERT WITH CHECK (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND is_active = TRUE)
    );
CREATE POLICY "Admins/editors can review suggestions" ON change_suggestions
    FOR UPDATE USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND role IN ('admin', 'editor') AND is_active = TRUE)
    );

-- DYK questions policies
CREATE POLICY "Users can view DYK questions" ON dyk_questions
    FOR SELECT USING (
        family_id IS NULL OR
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND is_active = TRUE)
    );

-- DYK responses policies
CREATE POLICY "Users can manage own responses" ON dyk_responses
    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view family responses" ON dyk_responses
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND is_active = TRUE)
    );

-- Detective challenges policies
CREATE POLICY "Anyone can view challenges" ON detective_challenges
    FOR SELECT USING (is_active = TRUE);

-- Completed challenges policies
CREATE POLICY "Users can manage own completed challenges" ON completed_challenges
    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view family completions" ON completed_challenges
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND is_active = TRUE)
    );

-- Social media accounts policies
CREATE POLICY "Users can view family social accounts" ON social_media_accounts
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND is_active = TRUE)
    );

-- Social posts policies
CREATE POLICY "Users can view family social posts" ON social_posts
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM family_members WHERE user_id = auth.uid() AND is_active = TRUE)
    );

-- Feed preferences policies
CREATE POLICY "Users can manage own feed preferences" ON feed_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_persons_updated_at BEFORE UPDATE ON persons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_geofences_updated_at BEFORE UPDATE ON geofences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feed_preferences_updated_at BEFORE UPDATE ON feed_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to log changes to change_history
CREATE OR REPLACE FUNCTION log_change_history()
RETURNS TRIGGER AS $$
DECLARE
    v_family_id UUID;
    v_entity_type entity_type;
    v_change_type change_type;
BEGIN
    -- Determine entity type based on table
    v_entity_type := TG_ARGV[0]::entity_type;

    -- Determine change type
    IF TG_OP = 'INSERT' THEN
        v_change_type := 'create';
        v_family_id := NEW.family_id;
    ELSIF TG_OP = 'UPDATE' THEN
        v_change_type := 'update';
        v_family_id := NEW.family_id;
    ELSIF TG_OP = 'DELETE' THEN
        v_change_type := 'delete';
        v_family_id := OLD.family_id;
    END IF;

    -- Insert history record
    INSERT INTO change_history (family_id, entity_type, entity_id, change_type, previous_data, new_data, changed_by)
    VALUES (
        v_family_id,
        v_entity_type,
        COALESCE(NEW.id, OLD.id),
        v_change_type,
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        auth.uid()
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Apply change history triggers
CREATE TRIGGER log_person_changes AFTER INSERT OR UPDATE OR DELETE ON persons
    FOR EACH ROW EXECUTE FUNCTION log_change_history('person');
CREATE TRIGGER log_union_changes AFTER INSERT OR UPDATE OR DELETE ON unions
    FOR EACH ROW EXECUTE FUNCTION log_change_history('union');
CREATE TRIGGER log_relationship_changes AFTER INSERT OR UPDATE OR DELETE ON relationships
    FOR EACH ROW EXECUTE FUNCTION log_change_history('relationship');
CREATE TRIGGER log_geofence_changes AFTER INSERT OR UPDATE OR DELETE ON geofences
    FOR EACH ROW EXECUTE FUNCTION log_change_history('geofence');

-- Function to add creator as admin when family is created
CREATE OR REPLACE FUNCTION add_family_creator_as_admin()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO family_members (family_id, user_id, role, accepted_at)
    VALUES (NEW.id, NEW.created_by, 'admin', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_family_created
    AFTER INSERT ON families
    FOR EACH ROW EXECUTE FUNCTION add_family_creator_as_admin();

-- =====================================================
-- SEED DATA (Default DYK Questions & Challenges)
-- =====================================================

-- Insert default DYK questions (global, family_id = NULL)
INSERT INTO dyk_questions (family_id, question, category, difficulty, answer_type, points) VALUES
-- Maternal line
(NULL, 'What is your maternal grandmother''s maiden name?', 'maternal', 'easy', 'text', 5),
(NULL, 'Where was your maternal grandmother born?', 'maternal', 'easy', 'text', 5),
(NULL, 'What was your mother''s childhood nickname?', 'maternal', 'medium', 'text', 10),
(NULL, 'In what year did your maternal grandparents get married?', 'maternal', 'medium', 'date', 10),
(NULL, 'What was your maternal grandfather''s profession?', 'maternal', 'easy', 'text', 5),
(NULL, 'How many siblings does/did your mother have?', 'maternal', 'easy', 'text', 5),
(NULL, 'What was your maternal grandmother''s favorite recipe?', 'maternal', 'medium', 'text', 10),
-- Paternal line
(NULL, 'What is your paternal grandmother''s maiden name?', 'paternal', 'easy', 'text', 5),
(NULL, 'Where did your paternal grandfather grow up?', 'paternal', 'medium', 'text', 10),
(NULL, 'What was your father''s first job?', 'paternal', 'easy', 'text', 5),
(NULL, 'How did your paternal grandparents meet?', 'paternal', 'hard', 'text', 15),
(NULL, 'What was your paternal grandmother''s favorite recipe?', 'paternal', 'medium', 'text', 10),
(NULL, 'How many siblings does/did your father have?', 'paternal', 'easy', 'text', 5),
-- Self/Personal
(NULL, 'What is the story behind your name?', 'self', 'easy', 'text', 5),
(NULL, 'Which family tradition do you cherish the most?', 'self', 'easy', 'text', 5),
(NULL, 'What is the oldest family heirloom you know of?', 'self', 'medium', 'text', 10),
(NULL, 'What family story is always told at gatherings?', 'self', 'easy', 'text', 5),
-- Extended family
(NULL, 'How many first cousins do you have?', 'extended', 'easy', 'text', 5),
(NULL, 'From which country did your ancestors emigrate?', 'extended', 'medium', 'text', 10),
(NULL, 'Who is the longest-living relative in your family?', 'extended', 'easy', 'text', 5),
(NULL, 'Did any family member serve in the military? When and where?', 'extended', 'hard', 'text', 15),
(NULL, 'What medical conditions are common in your family?', 'extended', 'medium', 'text', 10),
(NULL, 'How many generations back can you trace your family tree?', 'extended', 'hard', 'text', 15);

-- Insert default detective challenges
INSERT INTO detective_challenges (title, description, category, difficulty, points, requirements, suggested_questions) VALUES
(
    'Interview a Grandparent',
    'Record a conversation with a grandparent about their childhood memories',
    'interview',
    'medium',
    50,
    ARRAY['Record at least 15 minutes of conversation', 'Ask about their childhood home', 'Learn about their school experiences', 'Document at least 3 new family facts'],
    ARRAY['What was your house like when you were a child?', 'What games did you play growing up?', 'What was school like for you?', 'What was your favorite family meal?']
),
(
    'Digitize Old Photos',
    'Find and scan at least 5 family photos from before 1980',
    'photo',
    'easy',
    25,
    ARRAY['Find at least 5 photos from before 1980', 'Scan them in high resolution', 'Tag each photo with names and approximate dates', 'Upload them to the family tree'],
    NULL
),
(
    'Research Immigration Records',
    'Find immigration or travel records of an ancestor who came from another country',
    'research',
    'hard',
    100,
    ARRAY['Identify an ancestor who immigrated', 'Search immigration databases', 'Document the ship name, date, and port of entry', 'Find their hometown'],
    NULL
),
(
    'Create a Family Cookbook',
    'Collect and document 5 traditional family recipes',
    'documentation',
    'medium',
    40,
    ARRAY['Gather 5 recipes from family members', 'Document the origin and history of each recipe', 'Include family stories associated with the dish', 'Add photos if possible'],
    NULL
),
(
    'Family Locations Map',
    'Create a map of all the places your family has lived across generations',
    'research',
    'medium',
    35,
    ARRAY['Research where at least 3 generations lived', 'Document addresses or cities where possible', 'Note approximate dates for each location', 'Identify migration patterns'],
    NULL
);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for family tree data (persons with relationships)
CREATE OR REPLACE VIEW family_tree_view AS
SELECT
    p.*,
    f.name as family_name,
    (
        SELECT json_agg(json_build_object(
            'id', r.id,
            'related_person_id', CASE WHEN r.person1_id = p.id THEN r.person2_id ELSE r.person1_id END,
            'relationship_type', r.relationship_type,
            'is_biological', r.is_biological
        ))
        FROM relationships r
        WHERE r.person1_id = p.id OR r.person2_id = p.id
    ) as relationships,
    (
        SELECT json_agg(json_build_object(
            'id', u.id,
            'partner_id', CASE WHEN u.partner1_id = p.id THEN u.partner2_id ELSE u.partner1_id END,
            'union_type', u.union_type,
            'start_date', u.start_date
        ))
        FROM unions u
        WHERE u.partner1_id = p.id OR u.partner2_id = p.id
    ) as unions
FROM persons p
JOIN families f ON p.family_id = f.id;

-- View for latest family member locations
CREATE OR REPLACE VIEW family_locations_view AS
SELECT DISTINCT ON (l.user_id, l.family_id)
    l.id,
    l.user_id,
    l.family_id,
    up.first_name,
    up.last_name,
    up.avatar_url,
    ST_Y(l.coords::geometry) as latitude,
    ST_X(l.coords::geometry) as longitude,
    l.accuracy,
    l.battery_level,
    l.status,
    l.recorded_at
FROM locations l
JOIN user_profiles up ON l.user_id = up.id
ORDER BY l.user_id, l.family_id, l.recorded_at DESC;
