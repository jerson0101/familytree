'use client';

import { useEffect, useCallback, useState, useMemo } from 'react';
import { useFamilyStore, type Family, type FamilyMember } from '@/stores/familyStore';
import { useAuthStore } from '@/stores/authStore';
import { createClient } from '@/lib/supabase';
import type { FamilyRole } from '@kintree/shared';

export interface CreateFamilyInput {
  name: string;
  description?: string;
  primaryColor?: string;
}

export function useFamily() {
  const user = useAuthStore((state) => state.user);
  const supabase = useMemo(() => createClient(), []);
  const {
    currentFamily,
    families,
    members,
    currentUserRole,
    isLoading,
    setCurrentFamily,
    setFamilies,
    setMembers,
    setCurrentUserRole,
    setLoading,
    reset,
  } = useFamilyStore();

  const [error, setError] = useState<string | null>(null);

  // Fetch user's families on mount
  useEffect(() => {
    if (user?.id) {
      fetchFamilies();
    } else {
      reset();
    }
  }, [user?.id]);

  // Fetch family members when current family changes
  useEffect(() => {
    if (currentFamily?.id && user?.id) {
      fetchMembers(currentFamily.id);
      fetchUserRole(currentFamily.id);
    }
  }, [currentFamily?.id, user?.id]);

  const fetchFamilies = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      // Get families where user is a member
      const { data: memberData, error: memberError } = await supabase
        .from('family_members')
        .select(`
          family_id,
          role,
          families (
            id,
            name,
            description,
            primary_color,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (memberError) throw memberError;

      const familyList: Family[] = (memberData || [])
        .filter((m: any) => m.families)
        .map((m: any) => ({
          id: (m.families as any).id,
          name: (m.families as any).name,
          description: (m.families as any).description,
          primaryColor: (m.families as any).primary_color || '#0ea5e9',
          createdAt: (m.families as any).created_at,
          memberCount: 0, // Will be updated later
        }));

      setFamilies(familyList);

      // Auto-select first family if none selected
      if (familyList.length > 0 && !currentFamily) {
        setCurrentFamily(familyList[0]);
      }
    } catch (err) {
      console.error('Error fetching families:', err);
      setError('Error loading families');
    } finally {
      setLoading(false);
    }
  }, [user?.id, currentFamily, setFamilies, setCurrentFamily, setLoading]);

  const fetchMembers = useCallback(async (familyId: string) => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select(`
          id,
          user_id,
          person_id,
          role,
          accepted_at,
          is_active
        `)
        .eq('family_id', familyId)
        .eq('is_active', true);

      if (error) throw error;

      // Fetch user profiles separately to avoid join issues
      const userIds = (data || []).map((m: any) => m.user_id);
      let profilesMap: Record<string, any> = {};

      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('id, email, first_name, last_name, avatar_url')
          .in('id', userIds);

        if (profiles) {
          profilesMap = profiles.reduce((acc: any, p: any) => {
            acc[p.id] = p;
            return acc;
          }, {});
        }
      }

      const memberList: FamilyMember[] = (data || []).map((m: any) => {
        const profile = profilesMap[m.user_id] || {};
        return {
          id: m.id,
          userId: m.user_id,
          personId: m.person_id || undefined,
          role: m.role as FamilyRole,
          email: profile.email || '',
          displayName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
          avatarUrl: profile.avatar_url,
          joinedAt: m.accepted_at || '',
          isActive: m.is_active,
        };
      });

      setMembers(memberList);

      // Update member count in current family
      if (currentFamily) {
        setCurrentFamily({ ...currentFamily, memberCount: memberList.length });
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      setMembers([]);
    }
  }, [currentFamily, setMembers, setCurrentFamily]);

  const fetchUserRole = useCallback(async (familyId: string) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('role')
        .eq('family_id', familyId)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      // data will be null if no record found, which is valid
      setCurrentUserRole(data?.role as FamilyRole || null);
    } catch (err) {
      console.error('Error fetching user role:', err);
      setCurrentUserRole(null);
    }
  }, [user?.id, setCurrentUserRole]);

  const createFamily = useCallback(async (input: CreateFamilyInput): Promise<Family | null> => {
    if (!user?.id) return null;

    setError(null);

    try {
      const { data, error } = await supabase
        .from('families')
        .insert({
          name: input.name,
          description: input.description,
          primary_color: input.primaryColor || '#0ea5e9',
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newFamily: Family = {
        id: data.id,
        name: data.name,
        description: data.description,
        primaryColor: data.primary_color,
        createdAt: data.created_at,
        memberCount: 1,
      };

      // Refresh families list
      await fetchFamilies();

      // Set as current family
      setCurrentFamily(newFamily);

      return newFamily;
    } catch (err) {
      console.error('Error creating family:', err);
      setError('Error creating family');
      return null;
    }
  }, [user?.id, fetchFamilies, setCurrentFamily]);

  const inviteMember = useCallback(async (email: string, role: FamilyRole = 'viewer'): Promise<boolean> => {
    if (!currentFamily?.id || !user?.id) return false;

    setError(null);

    try {
      // First, find the user by email
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        setError('User not found with that email');
        return false;
      }

      // Add them as a family member
      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_id: currentFamily.id,
          user_id: userData.id,
          role,
          invited_by: user.id,
        });

      if (memberError) {
        if (memberError.code === '23505') {
          setError('User is already a member of this family');
        } else {
          throw memberError;
        }
        return false;
      }

      // Refresh members
      await fetchMembers(currentFamily.id);

      return true;
    } catch (err) {
      console.error('Error inviting member:', err);
      setError('Error inviting member');
      return false;
    }
  }, [currentFamily?.id, user?.id, fetchMembers]);

  const updateMemberRole = useCallback(async (memberId: string, newRole: FamilyRole): Promise<boolean> => {
    if (!currentFamily?.id) return false;

    try {
      const { error } = await supabase
        .from('family_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      await fetchMembers(currentFamily.id);
      return true;
    } catch (err) {
      console.error('Error updating member role:', err);
      return false;
    }
  }, [currentFamily?.id, fetchMembers]);

  const removeMember = useCallback(async (memberId: string): Promise<boolean> => {
    if (!currentFamily?.id) return false;

    try {
      const { error } = await supabase
        .from('family_members')
        .update({ is_active: false })
        .eq('id', memberId);

      if (error) throw error;

      await fetchMembers(currentFamily.id);
      return true;
    } catch (err) {
      console.error('Error removing member:', err);
      return false;
    }
  }, [currentFamily?.id, fetchMembers]);

  const switchFamily = useCallback((familyId: string) => {
    const family = families.find((f) => f.id === familyId);
    if (family) {
      setCurrentFamily(family);
    }
  }, [families, setCurrentFamily]);

  const canEdit = currentUserRole === 'admin' || currentUserRole === 'editor';
  const isAdmin = currentUserRole === 'admin';

  return {
    currentFamily,
    families,
    members,
    currentUserRole,
    isLoading,
    error,
    canEdit,
    isAdmin,
    fetchFamilies,
    createFamily,
    inviteMember,
    updateMemberRole,
    removeMember,
    switchFamily,
  };
}
