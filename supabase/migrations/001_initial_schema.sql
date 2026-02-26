-- =====================================================
-- KinTree Database Schema for Supabase
-- Run this in the Supabase SQL Editor
-- =====================================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

DO $$ BEGIN
    CREATE TYPE gender AS ENUM ('male', 'female', 'other', 'unknown');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE privacy_level AS ENUM ('public', 'family', 'private');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE family_role AS ENUM ('admin', 'editor', 'suggest_only', 'viewer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE relationship_type AS ENUM ('parent_child', 'spouse', 'sibling', 'adoptive_parent', 'step_parent', 'guardian');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE union_type AS ENUM ('marriage', 'partnership', 'divorced', 'separated', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('verified', 'pending', 'disputed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE suggestion_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE change_type_enum AS ENUM ('create', 'update', 'delete');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE entity_type AS ENUM ('person', 'union', 'relationship', 'geofence', 'historical_content');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE dyk_category AS ENUM ('maternal', 'paternal', 'self', 'extended');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE dyk_difficulty AS ENUM ('easy', 'medium', 'hard');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE dyk_answer_type AS ENUM ('text', 'date', 'multiple_choice', 'yes_no');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE challenge_category AS ENUM ('interview', 'research', 'documentation', 'photo');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE social_platform AS ENUM ('instagram', 'facebook');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE post_type AS ENUM ('text', 'photo', 'video', 'link', 'story');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE location_status AS ENUM ('online', 'away', 'offline');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =====================================================
-- USER PROFILES (extends Supabase Auth)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_profiles (
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

CREATE TABLE IF NOT EXISTS families (
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
-- FAMILY MEMBERS
-- =====================================================

CREATE TABLE IF NOT EXISTS family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    person_id UUID,
    role family_role NOT NULL DEFAULT 'viewer',
    nickname TEXT,
    invited_by UUID REFERENCES auth.users(id),
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(family_id, user_id)
);

-- =====================================================
-- PERSONS
-- =====================================================

CREATE TABLE IF NOT EXISTS persons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    middle_names TEXT[],
    last_name TEXT,
    maiden_name TEXT,
    nicknames TEXT[],
    birth_date DATE,
    birth_date_approximate BOOLEAN DEFAULT FALSE,
    birth_place TEXT,
    birth_place_lat DOUBLE PRECISION,
    birth_place_lng DOUBLE PRECISION,
    death_date DATE,
    death_date_approximate BOOLEAN DEFAULT FALSE,
    death_place TEXT,
    gender gender NOT NULL DEFAULT 'unknown',
    is_living BOOLEAN DEFAULT TRUE,
    biography TEXT,
    photo_url TEXT,
    medical_conditions JSONB DEFAULT '[]'::jsonb,
    voice_recordings TEXT[],
    gallery_urls TEXT[],
    linked_user_id UUID REFERENCES auth.users(id),
    privacy_level privacy_level DEFAULT 'family',
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK from family_members to persons
ALTER TABLE family_members DROP CONSTRAINT IF EXISTS fk_person;
ALTER TABLE family_members ADD CONSTRAINT fk_person FOREIGN KEY (person_id) REFERENCES persons(id) ON DELETE SET NULL;

-- =====================================================
-- RELATIONSHIPS
-- =====================================================

CREATE TABLE IF NOT EXISTS relationships (
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
-- UNIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS unions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    partner1_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    partner2_id UUID REFERENCES persons(id) ON DELETE SET NULL,
    union_type union_type NOT NULL DEFAULT 'marriage',
    start_date DATE,
    end_date DATE,
    location TEXT,
    location_lat DOUBLE PRECISION,
    location_lng DOUBLE PRECISION,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Children of unions
CREATE TABLE IF NOT EXISTS union_children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    union_id UUID NOT NULL REFERENCES unions(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    is_biological BOOLEAN DEFAULT TRUE,
    UNIQUE(union_id, child_id)
);

-- =====================================================
-- LOCATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy REAL,
    altitude REAL,
    speed REAL,
    heading REAL,
    battery_level INTEGER,
    status location_status DEFAULT 'online',
    address TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_locations_user_time ON locations(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_locations_family_time ON locations(family_id, recorded_at DESC);

-- =====================================================
-- GEOFENCES
-- =====================================================

CREATE TABLE IF NOT EXISTS geofences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    center_lat DOUBLE PRECISION NOT NULL,
    center_lng DOUBLE PRECISION NOT NULL,
    radius_meters INTEGER NOT NULL DEFAULT 100,
    related_person_ids UUID[],
    historical_narrative TEXT,
    historical_photos TEXT[],
    historical_documents TEXT[],
    historical_audio TEXT[],
    timeline_events JSONB DEFAULT '[]'::jsonb,
    notify_on_enter BOOLEAN DEFAULT TRUE,
    notify_on_exit BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- GEOFENCE EVENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS geofence_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    geofence_id UUID NOT NULL REFERENCES geofences(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('enter', 'exit')),
    location_id UUID REFERENCES locations(id),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CHANGE HISTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS change_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    entity_type entity_type NOT NULL,
    entity_id UUID NOT NULL,
    change_type change_type_enum NOT NULL,
    previous_data JSONB,
    new_data JSONB,
    change_description TEXT,
    changed_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_change_history_entity ON change_history(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_change_history_family ON change_history(family_id, created_at DESC);

-- =====================================================
-- CHANGE SUGGESTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS change_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    entity_type entity_type NOT NULL,
    entity_id UUID,
    change_type change_type_enum NOT NULL,
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

CREATE TABLE IF NOT EXISTS dyk_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    category dyk_category NOT NULL,
    difficulty dyk_difficulty NOT NULL DEFAULT 'medium',
    answer_type dyk_answer_type NOT NULL DEFAULT 'text',
    options TEXT[],
    correct_answer TEXT,
    points INTEGER NOT NULL DEFAULT 10,
    related_person_id UUID REFERENCES persons(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DYK RESPONSES
-- =====================================================

CREATE TABLE IF NOT EXISTS dyk_responses (
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

CREATE TABLE IF NOT EXISTS detective_challenges (
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

CREATE TABLE IF NOT EXISTS completed_challenges (
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

CREATE TABLE IF NOT EXISTS social_media_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    platform social_platform NOT NULL,
    platform_user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    display_name TEXT,
    profile_picture_url TEXT,
    access_token TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS social_posts (
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

CREATE INDEX IF NOT EXISTS idx_social_posts_family ON social_posts(family_id, posted_at DESC);

-- =====================================================
-- FEED PREFERENCES
-- =====================================================

CREATE TABLE IF NOT EXISTS feed_preferences (
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

CREATE TABLE IF NOT EXISTS notifications (
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

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read, created_at DESC);
