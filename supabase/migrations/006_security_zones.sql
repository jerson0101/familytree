-- =====================================================
-- Security Zones System
-- =====================================================

-- Zone type enum
DO $$ BEGIN
    CREATE TYPE zone_type AS ENUM ('home', 'work', 'school', 'family', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =====================================================
-- SECURITY ZONES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS security_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    radius INTEGER DEFAULT 100, -- in meters
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

-- =====================================================
-- RLS POLICIES FOR SECURITY ZONES
-- =====================================================

ALTER TABLE security_zones ENABLE ROW LEVEL SECURITY;

-- Users can view zones of families they belong to
CREATE POLICY "Family members can view zones"
    ON security_zones
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = security_zones.family_id
            AND user_id = auth.uid()
        )
    );

-- Admins/editors can create zones
CREATE POLICY "Family admins can create zones"
    ON security_zones
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = security_zones.family_id
            AND user_id = auth.uid()
            AND role IN ('admin', 'editor')
        )
    );

-- Admins/editors can update zones
CREATE POLICY "Family admins can update zones"
    ON security_zones
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = security_zones.family_id
            AND user_id = auth.uid()
            AND role IN ('admin', 'editor')
        )
    );

-- Admins can delete zones
CREATE POLICY "Family admins can delete zones"
    ON security_zones
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = security_zones.family_id
            AND user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- =====================================================
-- LOCATION HISTORY TABLE
-- =====================================================

-- Event type enum
DO $$ BEGIN
    CREATE TYPE location_event_type AS ENUM ('geofence_enter', 'geofence_exit', 'location_update');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS location_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES security_zones(id) ON DELETE SET NULL,
    event_type location_event_type NOT NULL,
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

CREATE POLICY "Family members can view location history"
    ON location_history
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = location_history.family_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "System can insert location history"
    ON location_history
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = location_history.family_id
            AND user_id = auth.uid()
        )
    );
