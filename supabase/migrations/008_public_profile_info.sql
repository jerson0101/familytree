-- =====================================================
-- Public Profile Info Access
-- =====================================================

-- Function to get basic profile info (bypasses RLS for specific fields)
CREATE OR REPLACE FUNCTION get_public_profile_info(user_ids UUID[])
RETURNS TABLE (
    id UUID,
    first_name TEXT,
    last_name TEXT,
    email TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        up.id,
        up.first_name,
        up.last_name,
        up.email
    FROM user_profiles up
    WHERE up.id = ANY(user_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_public_profile_info(UUID[]) TO authenticated;

-- Also update RLS policy to allow users to see basic info of family members
-- This allows viewing profiles of people in the same family
DROP POLICY IF EXISTS "Users can view profiles of family members" ON user_profiles;
CREATE POLICY "Users can view profiles of family members" ON user_profiles
    FOR SELECT USING (
        auth.uid() = id OR
        EXISTS (
            SELECT 1 FROM family_members fm1
            JOIN family_members fm2 ON fm1.family_id = fm2.family_id
            WHERE fm1.user_id = auth.uid()
            AND fm2.user_id = user_profiles.id
            AND fm1.is_active = TRUE
            AND fm2.is_active = TRUE
        )
    );

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
