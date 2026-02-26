-- =====================================================
-- Family Invitations System
-- =====================================================

-- Invitation status enum
DO $$ BEGIN
    CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'rejected', 'expired');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- =====================================================
-- FAMILY INVITATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS family_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invitee_email TEXT NOT NULL,
    invitee_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status invitation_status DEFAULT 'pending',
    message TEXT,
    token UUID DEFAULT uuid_generate_v4(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    accepted_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(family_id, person_id, invitee_email)
);

CREATE INDEX IF NOT EXISTS idx_invitations_email ON family_invitations(invitee_email, status);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON family_invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_user ON family_invitations(invitee_user_id, status);

-- =====================================================
-- RLS POLICIES FOR FAMILY INVITATIONS
-- =====================================================

ALTER TABLE family_invitations ENABLE ROW LEVEL SECURITY;

-- Users can view invitations sent to them or that they sent
CREATE POLICY "Users can view their invitations"
    ON family_invitations
    FOR SELECT
    USING (
        inviter_id = auth.uid() OR
        invitee_user_id = auth.uid() OR
        invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- Users can create invitations for families they belong to
CREATE POLICY "Family members can create invitations"
    ON family_invitations
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = family_invitations.family_id
            AND user_id = auth.uid()
            AND role IN ('admin', 'editor')
        )
    );

-- Invitees can update their invitation status (accept/reject)
CREATE POLICY "Invitees can respond to invitations"
    ON family_invitations
    FOR UPDATE
    USING (
        invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
        invitee_user_id = auth.uid()
    )
    WITH CHECK (
        invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
        invitee_user_id = auth.uid()
    );

-- =====================================================
-- FUNCTION TO SEND INVITATION NOTIFICATION
-- =====================================================

CREATE OR REPLACE FUNCTION notify_family_invitation()
RETURNS TRIGGER AS $$
BEGIN
    -- Create notification for invitee if they have an account
    IF NEW.invitee_user_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, family_id, type, title, body, data)
        VALUES (
            NEW.invitee_user_id,
            NEW.family_id,
            'family_invitation',
            'Nueva invitación familiar',
            (SELECT first_name || ' ' || COALESCE(last_name, '') FROM user_profiles WHERE id = NEW.inviter_id) ||
            ' te ha invitado a unirte a la familia ' ||
            (SELECT name FROM families WHERE id = NEW.family_id),
            jsonb_build_object(
                'invitation_id', NEW.id,
                'person_id', NEW.person_id,
                'family_id', NEW.family_id,
                'inviter_id', NEW.inviter_id
            )
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for invitation notifications
DROP TRIGGER IF EXISTS on_family_invitation_created ON family_invitations;
CREATE TRIGGER on_family_invitation_created
    AFTER INSERT ON family_invitations
    FOR EACH ROW
    EXECUTE FUNCTION notify_family_invitation();

-- =====================================================
-- FUNCTION TO HANDLE INVITATION ACCEPTANCE
-- =====================================================

CREATE OR REPLACE FUNCTION accept_family_invitation(invitation_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_invitation family_invitations%ROWTYPE;
    v_user_id UUID;
    v_person persons%ROWTYPE;
BEGIN
    v_user_id := auth.uid();

    -- Get the invitation
    SELECT * INTO v_invitation
    FROM family_invitations
    WHERE id = invitation_id
    AND status = 'pending'
    AND expires_at > NOW();

    IF v_invitation.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invitation not found or expired');
    END IF;

    -- Verify the user is the invitee
    IF v_invitation.invitee_user_id != v_user_id AND
       v_invitation.invitee_email != (SELECT email FROM auth.users WHERE id = v_user_id) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authorized');
    END IF;

    -- Update invitation status
    UPDATE family_invitations
    SET status = 'accepted',
        accepted_at = NOW(),
        invitee_user_id = v_user_id,
        updated_at = NOW()
    WHERE id = invitation_id;

    -- Link the person to the user
    UPDATE persons
    SET linked_user_id = v_user_id
    WHERE id = v_invitation.person_id;

    -- Add user to family members
    INSERT INTO family_members (family_id, user_id, person_id, role, accepted_at)
    VALUES (v_invitation.family_id, v_user_id, v_invitation.person_id, 'viewer', NOW())
    ON CONFLICT (family_id, user_id) DO UPDATE
    SET person_id = v_invitation.person_id, accepted_at = NOW();

    -- Create notification for inviter
    INSERT INTO notifications (user_id, family_id, type, title, body, data)
    VALUES (
        v_invitation.inviter_id,
        v_invitation.family_id,
        'invitation_accepted',
        'Invitación aceptada',
        (SELECT first_name || ' ' || COALESCE(last_name, '') FROM persons WHERE id = v_invitation.person_id) ||
        ' ha aceptado unirse a tu familia',
        jsonb_build_object(
            'invitation_id', invitation_id,
            'person_id', v_invitation.person_id,
            'accepted_by', v_user_id
        )
    );

    RETURN jsonb_build_object('success', true, 'person_id', v_invitation.person_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION TO MATCH INVITATIONS WHEN USER REGISTERS
-- =====================================================

CREATE OR REPLACE FUNCTION match_pending_invitations()
RETURNS TRIGGER AS $$
BEGIN
    -- Update any pending invitations for this email
    UPDATE family_invitations
    SET invitee_user_id = NEW.id
    WHERE invitee_email = NEW.email
    AND status = 'pending'
    AND invitee_user_id IS NULL;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: This trigger would need to be applied to auth.users which requires superuser
-- For now, we'll handle this in the application code
