import { getSupabaseClient } from '../client';
import type { Family, FamilyMember, FamilySettings } from '../types';
import type { FamilyRole } from '@kintree/shared';

const FAMILIES_TABLE = 'families';
const MEMBERS_TABLE = 'family_members';

// Family CRUD
export async function createFamily(
  name: string,
  createdBy: string,
  settings?: FamilySettings
): Promise<Family> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(FAMILIES_TABLE)
    .insert({
      name,
      created_by: createdBy,
      settings: settings || {},
    })
    .select()
    .single();

  if (error) throw error;

  // Automatically add creator as admin
  await addFamilyMember(data.id, createdBy, 'admin');

  return data;
}

export async function getFamilyById(id: string): Promise<Family | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(FAMILIES_TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateFamily(
  id: string,
  updates: Partial<Pick<Family, 'name' | 'settings'>>
): Promise<Family> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(FAMILIES_TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFamily(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from(FAMILIES_TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Family Members
export async function addFamilyMember(
  familyId: string,
  userId: string,
  role: FamilyRole
): Promise<FamilyMember> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(MEMBERS_TABLE)
    .insert({
      family_id: familyId,
      user_id: userId,
      role,
      accepted_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function inviteFamilyMember(
  familyId: string,
  userId: string,
  role: FamilyRole
): Promise<FamilyMember> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(MEMBERS_TABLE)
    .insert({
      family_id: familyId,
      user_id: userId,
      role,
      // accepted_at is null until they accept
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function acceptFamilyInvitation(
  memberId: string
): Promise<FamilyMember> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(MEMBERS_TABLE)
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', memberId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMemberRole(
  memberId: string,
  role: FamilyRole
): Promise<FamilyMember> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(MEMBERS_TABLE)
    .update({ role })
    .eq('id', memberId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFamilyMember(memberId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from(MEMBERS_TABLE)
    .delete()
    .eq('id', memberId);

  if (error) throw error;
}

export async function getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(MEMBERS_TABLE)
    .select('*')
    .eq('family_id', familyId);

  if (error) throw error;
  return data || [];
}

export async function getUserFamilies(userId: string): Promise<Family[]> {
  const supabase = getSupabaseClient();

  // Get all family IDs where user is a member
  const { data: memberships, error: memberError } = await supabase
    .from(MEMBERS_TABLE)
    .select('family_id')
    .eq('user_id', userId)
    .not('accepted_at', 'is', null);

  if (memberError) throw memberError;

  if (!memberships || memberships.length === 0) return [];

  const familyIds = memberships.map((m) => m.family_id);

  const { data: families, error: familyError } = await supabase
    .from(FAMILIES_TABLE)
    .select('*')
    .in('id', familyIds);

  if (familyError) throw familyError;
  return families || [];
}

export async function getUserRoleInFamily(
  userId: string,
  familyId: string
): Promise<FamilyRole | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(MEMBERS_TABLE)
    .select('role')
    .eq('user_id', userId)
    .eq('family_id', familyId)
    .not('accepted_at', 'is', null)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.role || null;
}

export async function getPendingInvitations(userId: string): Promise<FamilyMember[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(MEMBERS_TABLE)
    .select('*')
    .eq('user_id', userId)
    .is('accepted_at', null);

  if (error) throw error;
  return data || [];
}
