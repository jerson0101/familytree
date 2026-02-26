-- =====================================================
-- KinTree RLS Policies and Functions
-- Run this AFTER 001_initial_schema.sql
-- =====================================================

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_families_updated_at ON families;
CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_persons_updated_at ON persons;
CREATE TRIGGER update_persons_updated_at BEFORE UPDATE ON persons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_geofences_updated_at ON geofences;
CREATE TRIGGER update_geofences_updated_at BEFORE UPDATE ON geofences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_feed_preferences_updated_at ON feed_preferences;
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
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to add creator as admin when family is created
CREATE OR REPLACE FUNCTION add_family_creator_as_admin()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO family_members (family_id, user_id, role, accepted_at)
    VALUES (NEW.id, NEW.created_by, 'admin', NOW())
    ON CONFLICT (family_id, user_id) DO NOTHING;
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_family_created ON families;
CREATE TRIGGER on_family_created
    AFTER INSERT ON families
    FOR EACH ROW EXECUTE FUNCTION add_family_creator_as_admin();

-- Helper function to check if user is family member
CREATE OR REPLACE FUNCTION is_family_member(p_family_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM family_members
        WHERE family_id = p_family_id
        AND user_id = auth.uid()
        AND is_active = TRUE
    );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Helper function to check user's role in family
CREATE OR REPLACE FUNCTION get_family_role(p_family_id UUID)
RETURNS family_role AS $$
DECLARE
    v_role family_role;
BEGIN
    SELECT role INTO v_role FROM family_members
    WHERE family_id = p_family_id
    AND user_id = auth.uid()
    AND is_active = TRUE;
    RETURN v_role;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Helper function to check if user can edit in family
CREATE OR REPLACE FUNCTION can_edit_family(p_family_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_role family_role;
BEGIN
    v_role := get_family_role(p_family_id);
    RETURN v_role IN ('admin', 'editor');
END;
$$ language 'plpgsql' SECURITY DEFINER;

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

-- USER PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- FAMILIES
DROP POLICY IF EXISTS "Users can view families they belong to" ON families;
CREATE POLICY "Users can view families they belong to" ON families
    FOR SELECT USING (is_family_member(id));

DROP POLICY IF EXISTS "Users can create families" ON families;
CREATE POLICY "Users can create families" ON families
    FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Admins can update family" ON families;
CREATE POLICY "Admins can update family" ON families
    FOR UPDATE USING (get_family_role(id) = 'admin');

-- FAMILY MEMBERS
DROP POLICY IF EXISTS "Users can view members of their families" ON family_members;
CREATE POLICY "Users can view members of their families" ON family_members
    FOR SELECT USING (is_family_member(family_id));

DROP POLICY IF EXISTS "Admins can insert family members" ON family_members;
CREATE POLICY "Admins can insert family members" ON family_members
    FOR INSERT WITH CHECK (get_family_role(family_id) = 'admin' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update family members" ON family_members;
CREATE POLICY "Admins can update family members" ON family_members
    FOR UPDATE USING (get_family_role(family_id) = 'admin' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can delete family members" ON family_members;
CREATE POLICY "Admins can delete family members" ON family_members
    FOR DELETE USING (get_family_role(family_id) = 'admin');

-- PERSONS
DROP POLICY IF EXISTS "Users can view persons in their families" ON persons;
CREATE POLICY "Users can view persons in their families" ON persons
    FOR SELECT USING (is_family_member(family_id));

DROP POLICY IF EXISTS "Editors can create persons" ON persons;
CREATE POLICY "Editors can create persons" ON persons
    FOR INSERT WITH CHECK (can_edit_family(family_id));

DROP POLICY IF EXISTS "Editors can update persons" ON persons;
CREATE POLICY "Editors can update persons" ON persons
    FOR UPDATE USING (can_edit_family(family_id));

DROP POLICY IF EXISTS "Admins can delete persons" ON persons;
CREATE POLICY "Admins can delete persons" ON persons
    FOR DELETE USING (get_family_role(family_id) = 'admin');

-- RELATIONSHIPS
DROP POLICY IF EXISTS "Users can view relationships" ON relationships;
CREATE POLICY "Users can view relationships" ON relationships
    FOR SELECT USING (is_family_member(family_id));

DROP POLICY IF EXISTS "Editors can manage relationships" ON relationships;
CREATE POLICY "Editors can manage relationships" ON relationships
    FOR ALL USING (can_edit_family(family_id));

-- UNIONS
DROP POLICY IF EXISTS "Users can view unions" ON unions;
CREATE POLICY "Users can view unions" ON unions
    FOR SELECT USING (is_family_member(family_id));

DROP POLICY IF EXISTS "Editors can manage unions" ON unions;
CREATE POLICY "Editors can manage unions" ON unions
    FOR ALL USING (can_edit_family(family_id));

-- UNION CHILDREN
DROP POLICY IF EXISTS "Users can view union children" ON union_children;
CREATE POLICY "Users can view union children" ON union_children
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM unions u
            WHERE u.id = union_children.union_id
            AND is_family_member(u.family_id)
        )
    );

DROP POLICY IF EXISTS "Editors can manage union children" ON union_children;
CREATE POLICY "Editors can manage union children" ON union_children
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM unions u
            WHERE u.id = union_children.union_id
            AND can_edit_family(u.family_id)
        )
    );

-- LOCATIONS
DROP POLICY IF EXISTS "Users can insert own location" ON locations;
CREATE POLICY "Users can insert own location" ON locations
    FOR INSERT WITH CHECK (auth.uid() = user_id AND is_family_member(family_id));

DROP POLICY IF EXISTS "Users can view family locations" ON locations;
CREATE POLICY "Users can view family locations" ON locations
    FOR SELECT USING (is_family_member(family_id));

-- GEOFENCES
DROP POLICY IF EXISTS "Users can view geofences" ON geofences;
CREATE POLICY "Users can view geofences" ON geofences
    FOR SELECT USING (is_family_member(family_id));

DROP POLICY IF EXISTS "Editors can manage geofences" ON geofences;
CREATE POLICY "Editors can manage geofences" ON geofences
    FOR ALL USING (can_edit_family(family_id));

-- GEOFENCE EVENTS
DROP POLICY IF EXISTS "Users can view geofence events" ON geofence_events;
CREATE POLICY "Users can view geofence events" ON geofence_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM geofences g
            WHERE g.id = geofence_events.geofence_id
            AND is_family_member(g.family_id)
        )
    );

DROP POLICY IF EXISTS "Users can insert own geofence events" ON geofence_events;
CREATE POLICY "Users can insert own geofence events" ON geofence_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CHANGE HISTORY
DROP POLICY IF EXISTS "Users can view change history" ON change_history;
CREATE POLICY "Users can view change history" ON change_history
    FOR SELECT USING (is_family_member(family_id));

-- CHANGE SUGGESTIONS
DROP POLICY IF EXISTS "Users can view suggestions" ON change_suggestions;
CREATE POLICY "Users can view suggestions" ON change_suggestions
    FOR SELECT USING (is_family_member(family_id));

DROP POLICY IF EXISTS "Users can create suggestions" ON change_suggestions;
CREATE POLICY "Users can create suggestions" ON change_suggestions
    FOR INSERT WITH CHECK (is_family_member(family_id) AND auth.uid() = suggested_by);

DROP POLICY IF EXISTS "Editors can review suggestions" ON change_suggestions;
CREATE POLICY "Editors can review suggestions" ON change_suggestions
    FOR UPDATE USING (can_edit_family(family_id));

-- DYK QUESTIONS
DROP POLICY IF EXISTS "Anyone can view active global questions" ON dyk_questions;
CREATE POLICY "Anyone can view active global questions" ON dyk_questions
    FOR SELECT USING (family_id IS NULL AND is_active = TRUE);

DROP POLICY IF EXISTS "Users can view family questions" ON dyk_questions;
CREATE POLICY "Users can view family questions" ON dyk_questions
    FOR SELECT USING (family_id IS NOT NULL AND is_family_member(family_id));

-- DYK RESPONSES
DROP POLICY IF EXISTS "Users can manage own responses" ON dyk_responses;
CREATE POLICY "Users can manage own responses" ON dyk_responses
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view family responses" ON dyk_responses;
CREATE POLICY "Users can view family responses" ON dyk_responses
    FOR SELECT USING (is_family_member(family_id));

-- DETECTIVE CHALLENGES
DROP POLICY IF EXISTS "Anyone can view active challenges" ON detective_challenges;
CREATE POLICY "Anyone can view active challenges" ON detective_challenges
    FOR SELECT USING (is_active = TRUE);

-- COMPLETED CHALLENGES
DROP POLICY IF EXISTS "Users can manage own completed challenges" ON completed_challenges;
CREATE POLICY "Users can manage own completed challenges" ON completed_challenges
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view family completions" ON completed_challenges;
CREATE POLICY "Users can view family completions" ON completed_challenges
    FOR SELECT USING (is_family_member(family_id));

-- SOCIAL MEDIA ACCOUNTS
DROP POLICY IF EXISTS "Users can view family social accounts" ON social_media_accounts;
CREATE POLICY "Users can view family social accounts" ON social_media_accounts
    FOR SELECT USING (is_family_member(family_id));

DROP POLICY IF EXISTS "Editors can manage social accounts" ON social_media_accounts;
CREATE POLICY "Editors can manage social accounts" ON social_media_accounts
    FOR ALL USING (can_edit_family(family_id));

-- SOCIAL POSTS
DROP POLICY IF EXISTS "Users can view family posts" ON social_posts;
CREATE POLICY "Users can view family posts" ON social_posts
    FOR SELECT USING (is_family_member(family_id));

-- FEED PREFERENCES
DROP POLICY IF EXISTS "Users can manage own feed preferences" ON feed_preferences;
CREATE POLICY "Users can manage own feed preferences" ON feed_preferences
    FOR ALL USING (auth.uid() = user_id);

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
CREATE POLICY "System can insert notifications" ON notifications
    FOR INSERT WITH CHECK (TRUE);
