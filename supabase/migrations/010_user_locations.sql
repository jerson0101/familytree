-- User locations table for real-time location tracking
CREATE TABLE IF NOT EXISTS user_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,

  -- Location data
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(10, 2), -- Accuracy in meters
  altitude DECIMAL(10, 2),
  heading DECIMAL(5, 2), -- Direction in degrees
  speed DECIMAL(10, 2), -- Speed in m/s

  -- Address (reverse geocoded)
  address TEXT,
  city TEXT,
  country TEXT,

  -- Device info
  battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
  is_charging BOOLEAN DEFAULT false,

  -- Status
  is_sharing BOOLEAN DEFAULT true, -- User can toggle sharing on/off
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: one location record per user per family
  UNIQUE(user_id, family_id)
);

-- Location sharing preferences
CREATE TABLE IF NOT EXISTS location_sharing_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,

  -- Sharing preferences
  share_location BOOLEAN DEFAULT false, -- Master toggle
  share_with_all BOOLEAN DEFAULT true, -- Share with all family members
  share_precise_location BOOLEAN DEFAULT true, -- Precise vs approximate

  -- Update frequency
  update_frequency TEXT DEFAULT 'realtime' CHECK (update_frequency IN ('realtime', 'hourly', 'daily', 'manual')),

  -- Notification preferences
  notify_on_arrival BOOLEAN DEFAULT true,
  notify_on_departure BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, family_id)
);

-- Location history for tracking movements (optional, can be enabled per user)
CREATE TABLE IF NOT EXISTS location_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,

  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(10, 2),
  address TEXT,

  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_family_id ON user_locations(family_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_last_updated ON user_locations(last_updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_location_history_user_family ON location_history(user_id, family_id);
CREATE INDEX IF NOT EXISTS idx_location_history_recorded ON location_history(recorded_at DESC);

-- RLS Policies
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_sharing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_history ENABLE ROW LEVEL SECURITY;

-- Users can see their own location
CREATE POLICY "Users can view own location"
  ON user_locations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own location
CREATE POLICY "Users can update own location"
  ON user_locations FOR ALL
  USING (auth.uid() = user_id);

-- Family members can see each other's locations if sharing is enabled
CREATE POLICY "Family members can view shared locations"
  ON user_locations FOR SELECT
  USING (
    is_sharing = true
    AND family_id IN (
      SELECT family_id FROM family_members
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Location sharing settings policies
CREATE POLICY "Users can manage own sharing settings"
  ON location_sharing_settings FOR ALL
  USING (auth.uid() = user_id);

-- Location history policies
CREATE POLICY "Users can manage own history"
  ON location_history FOR ALL
  USING (auth.uid() = user_id);

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

  -- Check if user has sharing enabled for this family
  SELECT share_location INTO v_is_sharing
  FROM location_sharing_settings
  WHERE user_id = v_user_id AND family_id = p_family_id;

  -- Default to sharing if no settings exist
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

-- Function to get family members' locations
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
  RETURN QUERY
  SELECT
    ul.user_id,
    p.id as person_id,
    p.first_name,
    p.last_name,
    p.photo_url,
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
  JOIN persons p ON p.linked_user_id = ul.user_id AND p.family_id = ul.family_id
  WHERE ul.family_id = p_family_id
    AND ul.is_sharing = true
    AND ul.family_id IN (
      SELECT fm.family_id FROM family_members fm
      WHERE fm.user_id = auth.uid() AND fm.is_active = true
    );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_user_location TO authenticated;
GRANT EXECUTE ON FUNCTION get_family_locations TO authenticated;
