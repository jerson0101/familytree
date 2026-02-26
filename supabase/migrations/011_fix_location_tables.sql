-- =====================================================
-- Migration 011: Unify Location Tables
-- =====================================================
-- This migration fixes conflicts between migrations 006 and 010
-- and ensures all location-related tables work correctly.

-- =====================================================
-- 1. FIX location_history TABLE
-- Migration 006 creates it with person_id (correct for history)
-- Migration 010 tries to create it with user_id (conflict)
-- We keep the 006 version with person_id for event history
-- =====================================================

-- First, check if location_history exists and has incorrect schema
-- If it has user_id instead of person_id, we need to recreate it
DO $$
BEGIN
    -- Check if the table exists with user_id column (from 010)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'location_history'
        AND column_name = 'user_id'
        AND table_schema = 'public'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'location_history'
        AND column_name = 'person_id'
        AND table_schema = 'public'
    ) THEN
        -- Drop the incorrect table and recreate with correct schema
        DROP TABLE IF EXISTS location_history CASCADE;
    END IF;
END $$;

-- Recreate location_history with correct schema (from 006)
-- Event type enum (may already exist)
DO $$ BEGIN
    CREATE TYPE location_event_type AS ENUM ('geofence_enter', 'geofence_exit', 'location_update');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS location_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES security_zones(id) ON DELETE SET NULL,
    event_type location_event_type NOT NULL DEFAULT 'location_update',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_location_history_family ON location_history(family_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_location_history_person ON location_history(person_id, recorded_at DESC);

-- RLS for location history
ALTER TABLE location_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Family members can view location history" ON location_history;
DROP POLICY IF EXISTS "System can insert location history" ON location_history;
DROP POLICY IF EXISTS "Users can manage own history" ON location_history;

CREATE POLICY "Family members can view location history"
    ON location_history
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = location_history.family_id
            AND user_id = auth.uid()
            AND is_active = true
        )
    );

CREATE POLICY "Family members can insert location history"
    ON location_history
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = location_history.family_id
            AND user_id = auth.uid()
            AND is_active = true
        )
    );

-- =====================================================
-- 2. ENSURE user_locations TABLE EXISTS (from 010)
-- This stores current real-time location per user
-- =====================================================

CREATE TABLE IF NOT EXISTS user_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,

    -- Location data
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(10, 2),
    altitude DECIMAL(10, 2),
    heading DECIMAL(5, 2),
    speed DECIMAL(10, 2),

    -- Address
    address TEXT,
    city TEXT,
    country TEXT,

    -- Device info
    battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
    is_charging BOOLEAN DEFAULT false,

    -- Status
    is_sharing BOOLEAN DEFAULT true,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, family_id)
);

CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_family_id ON user_locations(family_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_last_updated ON user_locations(last_updated_at DESC);

-- RLS for user_locations
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own location" ON user_locations;
DROP POLICY IF EXISTS "Users can update own location" ON user_locations;
DROP POLICY IF EXISTS "Family members can view shared locations" ON user_locations;

CREATE POLICY "Users can manage own location"
    ON user_locations FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Family members can view shared locations"
    ON user_locations FOR SELECT
    USING (
        is_sharing = true
        AND family_id IN (
            SELECT fm.family_id FROM family_members fm
            WHERE fm.user_id = auth.uid() AND fm.is_active = true
        )
    );

-- =====================================================
-- 3. ENSURE location_sharing_settings TABLE EXISTS
-- =====================================================

CREATE TABLE IF NOT EXISTS location_sharing_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,

    share_location BOOLEAN DEFAULT false,
    share_with_all BOOLEAN DEFAULT true,
    share_precise_location BOOLEAN DEFAULT true,
    update_frequency TEXT DEFAULT 'realtime' CHECK (update_frequency IN ('realtime', 'hourly', 'daily', 'manual')),

    notify_on_arrival BOOLEAN DEFAULT true,
    notify_on_departure BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, family_id)
);

ALTER TABLE location_sharing_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own sharing settings" ON location_sharing_settings;

CREATE POLICY "Users can manage own sharing settings"
    ON location_sharing_settings FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- 4. ENSURE security_zones TABLE EXISTS (from 006)
-- =====================================================

DO $$ BEGIN
    CREATE TYPE zone_type AS ENUM ('home', 'work', 'school', 'family', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS security_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    radius INTEGER DEFAULT 100,
    zone_type zone_type DEFAULT 'other',
    is_active BOOLEAN DEFAULT true,
    notify_on_enter BOOLEAN DEFAULT true,
    notify_on_exit BOOLEAN DEFAULT true,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zones_family ON security_zones(family_id);
CREATE INDEX IF NOT EXISTS idx_zones_active ON security_zones(family_id, is_active);

ALTER TABLE security_zones ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Family members can view zones" ON security_zones;
DROP POLICY IF EXISTS "Family admins can create zones" ON security_zones;
DROP POLICY IF EXISTS "Family admins can update zones" ON security_zones;
DROP POLICY IF EXISTS "Family admins can delete zones" ON security_zones;

CREATE POLICY "Family members can view zones"
    ON security_zones FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = security_zones.family_id
            AND user_id = auth.uid()
            AND is_active = true
        )
    );

CREATE POLICY "Family members can create zones"
    ON security_zones FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = security_zones.family_id
            AND user_id = auth.uid()
            AND is_active = true
        )
    );

CREATE POLICY "Family members can update zones"
    ON security_zones FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = security_zones.family_id
            AND user_id = auth.uid()
            AND is_active = true
        )
    );

CREATE POLICY "Family members can delete zones"
    ON security_zones FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = security_zones.family_id
            AND user_id = auth.uid()
            AND is_active = true
        )
    );

-- =====================================================
-- 5. CREATE/REPLACE RPC FUNCTIONS
-- =====================================================

-- Function to update user location
CREATE OR REPLACE FUNCTION update_user_location(
    p_family_id UUID,
    p_latitude DECIMAL,
    p_longitude DECIMAL,
    p_accuracy DECIMAL DEFAULT NULL,
    p_altitude DECIMAL DEFAULT NULL,
    p_heading DECIMAL DEFAULT NULL,
    p_speed DECIMAL DEFAULT NULL,
    p_address TEXT DEFAULT NULL,
    p_city TEXT DEFAULT NULL,
    p_country TEXT DEFAULT NULL,
    p_battery_level INTEGER DEFAULT NULL,
    p_is_charging BOOLEAN DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_is_sharing BOOLEAN;
BEGIN
    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Check if user is member of this family
    IF NOT EXISTS (
        SELECT 1 FROM family_members
        WHERE user_id = v_user_id AND family_id = p_family_id AND is_active = true
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not a family member');
    END IF;

    -- Check if user has sharing enabled
    SELECT share_location INTO v_is_sharing
    FROM location_sharing_settings
    WHERE user_id = v_user_id AND family_id = p_family_id;

    IF v_is_sharing IS NULL THEN
        v_is_sharing := true;
    END IF;

    -- Upsert location
    INSERT INTO user_locations (
        user_id, family_id, latitude, longitude, accuracy, altitude,
        heading, speed, address, city, country, battery_level, is_charging,
        is_sharing, last_updated_at
    )
    VALUES (
        v_user_id, p_family_id, p_latitude, p_longitude, p_accuracy, p_altitude,
        p_heading, p_speed, p_address, p_city, p_country, p_battery_level, p_is_charging,
        v_is_sharing, NOW()
    )
    ON CONFLICT (user_id, family_id)
    DO UPDATE SET
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        accuracy = EXCLUDED.accuracy,
        altitude = EXCLUDED.altitude,
        heading = EXCLUDED.heading,
        speed = EXCLUDED.speed,
        address = COALESCE(EXCLUDED.address, user_locations.address),
        city = COALESCE(EXCLUDED.city, user_locations.city),
        country = COALESCE(EXCLUDED.country, user_locations.country),
        battery_level = EXCLUDED.battery_level,
        is_charging = EXCLUDED.is_charging,
        is_sharing = v_is_sharing,
        last_updated_at = NOW();

    RETURN jsonb_build_object('success', true);
END;
$$;

-- Function to get family locations
CREATE OR REPLACE FUNCTION get_family_locations(p_family_id UUID)
RETURNS TABLE (
    user_id UUID,
    person_id UUID,
    first_name TEXT,
    last_name TEXT,
    photo_url TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    accuracy DECIMAL,
    address TEXT,
    city TEXT,
    battery_level INTEGER,
    is_charging BOOLEAN,
    last_updated_at TIMESTAMPTZ,
    is_online BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Verify caller is member of family
    IF NOT EXISTS (
        SELECT 1 FROM family_members fm
        WHERE fm.user_id = auth.uid() AND fm.family_id = p_family_id AND fm.is_active = true
    ) THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT
        ul.user_id,
        p.id as person_id,
        COALESCE(p.first_name, au.raw_user_meta_data->>'full_name', 'Usuario') as first_name,
        COALESCE(p.last_name, '') as last_name,
        COALESCE(p.photo_url, au.raw_user_meta_data->>'avatar_url') as photo_url,
        ul.latitude,
        ul.longitude,
        ul.accuracy,
        ul.address,
        ul.city,
        ul.battery_level,
        ul.is_charging,
        ul.last_updated_at,
        (ul.last_updated_at > NOW() - INTERVAL '5 minutes') as is_online
    FROM user_locations ul
    LEFT JOIN persons p ON p.linked_user_id = ul.user_id AND p.family_id = ul.family_id
    LEFT JOIN auth.users au ON ul.user_id = au.id
    WHERE ul.family_id = p_family_id
        AND ul.is_sharing = true;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_user_location TO authenticated;
GRANT EXECUTE ON FUNCTION get_family_locations TO authenticated;

-- =====================================================
-- Done!
-- =====================================================
