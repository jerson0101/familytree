import { getSupabaseClient } from '../client';
import type { Person, PersonInsert, PersonUpdate } from '../types';

const TABLE = 'persons';

export async function getPersonsByFamily(familyId: string): Promise<Person[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('family_id', familyId)
    .order('last_name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getPersonById(id: string): Promise<Person | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getPersonByUserId(userId: string): Promise<Person | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('linked_user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createPerson(person: PersonInsert): Promise<Person> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(person)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePerson(
  id: string,
  updates: PersonUpdate
): Promise<Person> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePerson(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) throw error;
}

export async function searchPersons(
  familyId: string,
  query: string
): Promise<Person[]> {
  const supabase = getSupabaseClient();
  const searchTerm = `%${query}%`;

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('family_id', familyId)
    .or(
      `first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},maiden_name.ilike.${searchTerm}`
    )
    .order('last_name', { ascending: true })
    .limit(20);

  if (error) throw error;
  return data || [];
}

export async function getLivingPersons(familyId: string): Promise<Person[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('family_id', familyId)
    .eq('is_living', true)
    .order('first_name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getAncestors(familyId: string): Promise<Person[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('family_id', familyId)
    .eq('is_living', false)
    .order('birth_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Get persons with specific medical conditions for genogram
export async function getPersonsWithMedicalConditions(
  familyId: string,
  conditions: string[]
): Promise<Person[]> {
  const supabase = getSupabaseClient();

  // Use raw query for JSONB array containment
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('family_id', familyId)
    .not('medical_conditions', 'is', null);

  if (error) throw error;

  // Filter in JS for complex JSONB queries
  return (data || []).filter((person) =>
    person.medical_conditions?.some((mc: { condition: string }) =>
      conditions.includes(mc.condition)
    )
  );
}

// Link a person to a user account
export async function linkPersonToUser(
  personId: string,
  userId: string
): Promise<Person> {
  return updatePerson(personId, { linked_user_id: userId });
}
