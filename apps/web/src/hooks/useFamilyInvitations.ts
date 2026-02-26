'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { useFamily } from './useFamily';

export interface FamilyInvitation {
  id: string;
  familyId: string;
  personId: string;
  inviterId: string;
  inviteeEmail: string;
  inviteeUserId?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  message?: string;
  expiresAt: string;
  createdAt: string;
  // Joined data
  familyName?: string;
  personName?: string;
  inviterName?: string;
}

export function useFamilyInvitations() {
  const supabase = useMemo(() => createClient(), []);
  const { currentFamily } = useFamily();

  const [sentInvitations, setSentInvitations] = useState<FamilyInvitation[]>([]);
  const [receivedInvitations, setReceivedInvitations] = useState<FamilyInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all invitations
  const fetchInvitations = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch sent invitations
      const { data: sent, error: sentError } = await supabase
        .from('family_invitations')
        .select('*')
        .eq('inviter_id', user.id)
        .order('created_at', { ascending: false });

      if (sentError) {
        // Table might not exist yet - silently ignore
        const isTableMissing = sentError.code === '42P01' ||
          sentError.message?.includes('Could not find the table');
        if (!isTableMissing) {
          console.error('Error fetching sent invitations:', sentError.message || sentError);
        }
      } else {
        // Fetch related data separately
        const familyIds = [...new Set((sent || []).map((inv: any) => inv.family_id))];
        const personIds = [...new Set((sent || []).map((inv: any) => inv.person_id))];

        const [familiesResult, personsResult] = await Promise.all([
          familyIds.length > 0 ? supabase.from('families').select('id, name').in('id', familyIds) : { data: [] },
          personIds.length > 0 ? supabase.from('persons').select('id, first_name, last_name').in('id', personIds) : { data: [] },
        ]);

        const familyMap = new Map((familiesResult.data || []).map((f: any) => [f.id, f.name]));
        const personMap = new Map((personsResult.data || []).map((p: any) => [p.id, `${p.first_name} ${p.last_name || ''}`.trim()]));

        setSentInvitations(
          (sent || []).map((inv: any) => ({
            id: inv.id,
            familyId: inv.family_id,
            personId: inv.person_id,
            inviterId: inv.inviter_id,
            inviteeEmail: inv.invitee_email,
            inviteeUserId: inv.invitee_user_id,
            status: inv.status,
            message: inv.message,
            expiresAt: inv.expires_at,
            createdAt: inv.created_at,
            familyName: familyMap.get(inv.family_id),
            personName: personMap.get(inv.person_id),
          }))
        );
      }

      // Fetch received invitations
      const { data: received, error: receivedError } = await supabase
        .from('family_invitations')
        .select('*')
        .or(`invitee_email.eq.${user.email},invitee_user_id.eq.${user.id}`)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (receivedError) {
        // Table might not exist yet - silently ignore
        const isTableMissing = receivedError.code === '42P01' ||
          receivedError.message?.includes('Could not find the table');
        if (!isTableMissing) {
          console.error('Error fetching received invitations:', receivedError.message || receivedError);
        }
        setReceivedInvitations([]);
      } else if (received && received.length > 0) {
        // Fetch related data separately to avoid RLS issues
        const familyIds = [...new Set(received.map((inv: any) => inv.family_id))];
        const personIds = [...new Set(received.map((inv: any) => inv.person_id))];

        // Fetch families and persons
        const [familiesResult, personsResult] = await Promise.allSettled([
          familyIds.length > 0 ? supabase.from('families').select('id, name').in('id', familyIds) : Promise.resolve({ data: [] }),
          personIds.length > 0 ? supabase.from('persons').select('id, first_name, last_name').in('id', personIds) : Promise.resolve({ data: [] }),
        ]);

        // Extract data with fallback to empty arrays
        const familiesData = familiesResult.status === 'fulfilled' ? (familiesResult.value?.data || []) : [];
        const personsData = personsResult.status === 'fulfilled' ? (personsResult.value?.data || []) : [];

        const familyMap = new Map(familiesData.map((f: any) => [f.id, f.name]));
        const personMap = new Map(personsData.map((p: any) => [p.id, `${p.first_name} ${p.last_name || ''}`.trim()]));

        setReceivedInvitations(
          received.map((inv: any) => {
            // Use stored inviter_name from invitation (most reliable)
            const inviterName = inv.inviter_name || 'Un usuario';

            return {
              id: inv.id,
              familyId: inv.family_id,
              personId: inv.person_id,
              inviterId: inv.inviter_id,
              inviteeEmail: inv.invitee_email,
              inviteeUserId: inv.invitee_user_id,
              status: inv.status,
              message: inv.message,
              expiresAt: inv.expires_at,
              createdAt: inv.created_at,
              familyName: familyMap.get(inv.family_id) || 'Familia',
              personName: personMap.get(inv.person_id) || 'familiar',
              inviterName,
            };
          })
        );
      } else {
        setReceivedInvitations([]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // Load invitations on mount
  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  // Send invitation
  const sendInvitation = useCallback(async (
    personId: string,
    email: string,
    message?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentFamily?.id) {
      return { success: false, error: 'No hay familia seleccionada' };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'No autenticado' };
      }

      // Check if user already exists with this email
      const { data: existingUsers } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .limit(1);

      const inviteeUserId = existingUsers?.[0]?.id || null;

      // Create invitation
      const { data, error } = await supabase
        .from('family_invitations')
        .insert({
          family_id: currentFamily.id,
          person_id: personId,
          inviter_id: user.id,
          invitee_email: email.toLowerCase().trim(),
          invitee_user_id: inviteeUserId,
          message,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return { success: false, error: 'Ya existe una invitación pendiente para este email' };
        }
        console.error('Error creating invitation:', error);
        return { success: false, error: 'Error al crear invitación' };
      }

      // Refresh invitations
      await fetchInvitations();

      return { success: true };
    } catch (err) {
      console.error('Error:', err);
      return { success: false, error: 'Error inesperado' };
    }
  }, [currentFamily?.id, supabase, fetchInvitations]);

  // Accept invitation using database function (has SECURITY DEFINER for proper access)
  const acceptInvitation = useCallback(async (
    invitationId: string
  ): Promise<{ success: boolean; personId?: string; familyId?: string; error?: string }> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'No autenticado' };
      }

      // Get invitation first to have the family_id for the response
      const { data: invitation, error: invError } = await supabase
        .from('family_invitations')
        .select('family_id, person_id')
        .eq('id', invitationId)
        .eq('status', 'pending')
        .single();

      if (invError || !invitation) {
        console.error('Error fetching invitation:', invError);
        return { success: false, error: 'Invitación no encontrada o expirada' };
      }

      // Use the database function that has SECURITY DEFINER
      const { data: result, error: rpcError } = await supabase
        .rpc('accept_family_invitation', { invitation_id: invitationId });

      if (rpcError) {
        console.error('Error calling accept_family_invitation:', rpcError);
        return { success: false, error: 'Error al aceptar invitación' };
      }

      // The function returns JSONB with {success, person_id} or {success, error}
      if (result && result.success === false) {
        return { success: false, error: result.error || 'Error al aceptar invitación' };
      }

      // Refresh invitations
      await fetchInvitations();

      return {
        success: true,
        personId: result?.person_id || invitation.person_id,
        familyId: invitation.family_id
      };
    } catch (err) {
      console.error('Error:', err);
      return { success: false, error: 'Error inesperado' };
    }
  }, [supabase, fetchInvitations]);

  // Reject invitation
  const rejectInvitation = useCallback(async (
    invitationId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('family_invitations')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', invitationId);

      if (error) {
        console.error('Error rejecting invitation:', error);
        return { success: false, error: 'Error al rechazar invitación' };
      }

      await fetchInvitations();
      return { success: true };
    } catch (err) {
      console.error('Error:', err);
      return { success: false, error: 'Error inesperado' };
    }
  }, [supabase, fetchInvitations]);

  // Resend invitation
  const resendInvitation = useCallback(async (
    invitationId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('family_invitations')
        .update({
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', invitationId);

      if (error) {
        console.error('Error resending invitation:', error);
        return { success: false, error: 'Error al reenviar invitación' };
      }

      await fetchInvitations();
      return { success: true };
    } catch (err) {
      console.error('Error:', err);
      return { success: false, error: 'Error inesperado' };
    }
  }, [supabase, fetchInvitations]);

  // Cancel invitation
  const cancelInvitation = useCallback(async (
    invitationId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('family_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) {
        console.error('Error canceling invitation:', error);
        return { success: false, error: 'Error al cancelar invitación' };
      }

      await fetchInvitations();
      return { success: true };
    } catch (err) {
      console.error('Error:', err);
      return { success: false, error: 'Error inesperado' };
    }
  }, [supabase, fetchInvitations]);

  return {
    sentInvitations,
    receivedInvitations,
    isLoading,
    sendInvitation,
    acceptInvitation,
    rejectInvitation,
    resendInvitation,
    cancelInvitation,
    refreshInvitations: fetchInvitations,
  };
}
