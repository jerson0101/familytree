-- Add inviter_name column to store the name at invitation time
ALTER TABLE family_invitations ADD COLUMN IF NOT EXISTS inviter_name TEXT;

-- Update existing invitations with inviter names
UPDATE family_invitations fi
SET inviter_name = COALESCE(
    (SELECT NULLIF(TRIM(COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')), '')
     FROM user_profiles WHERE id = fi.inviter_id),
    (SELECT email FROM auth.users WHERE id = fi.inviter_id)
)
WHERE inviter_name IS NULL;
