-- =====================================================
-- Fix RLS Policy for Families Table
-- Run this in your Supabase SQL Editor
-- =====================================================

-- The issue: When creating a family, the SELECT policy fails because
-- the trigger that adds the user as admin runs AFTER the insert,
-- but Supabase's .select() tries to return the row immediately.

-- Fix: Allow family creators to view their own families

DROP POLICY IF EXISTS "Users can view families they belong to" ON families;

CREATE POLICY "Users can view families they belong to" ON families
    FOR SELECT USING (
        is_family_member(id) OR created_by = auth.uid()
    );

-- Also ensure the family_members insert policy allows the trigger to work
-- by adding a policy that allows inserting when you're the one being added

DROP POLICY IF EXISTS "Admins can insert family members" ON family_members;

CREATE POLICY "Users can insert family members" ON family_members
    FOR INSERT WITH CHECK (
        get_family_role(family_id) = 'admin'
        OR auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM families f
            WHERE f.id = family_id
            AND f.created_by = auth.uid()
        )
    );
