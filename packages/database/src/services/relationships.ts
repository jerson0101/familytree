import { getSupabaseClient } from '../client';
import type { Relationship, RelationshipInsert } from '../types';

const TABLE = 'relationships';

export async function getRelationshipsByFamily(
  familyId: string
): Promise<Relationship[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('family_id', familyId);

  if (error) throw error;
  return data || [];
}

export async function getRelationshipById(
  id: string
): Promise<Relationship | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getRelationshipsForPerson(
  personId: string
): Promise<Relationship[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .or(`person1_id.eq.${personId},person2_id.eq.${personId}`);

  if (error) throw error;
  return data || [];
}

export async function createRelationship(
  relationship: RelationshipInsert
): Promise<Relationship> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(relationship)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRelationship(
  id: string,
  updates: Partial<Omit<Relationship, 'id' | 'family_id'>>
): Promise<Relationship> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRelationship(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) throw error;
}

// Get all parent-child relationships for a person
export async function getParents(personId: string): Promise<Relationship[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('person2_id', personId)
    .eq('relationship_type', 'parent_child');

  if (error) throw error;
  return data || [];
}

export async function getChildren(personId: string): Promise<Relationship[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('person1_id', personId)
    .eq('relationship_type', 'parent_child');

  if (error) throw error;
  return data || [];
}

export async function getSiblings(personId: string): Promise<Relationship[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .or(`person1_id.eq.${personId},person2_id.eq.${personId}`)
    .eq('relationship_type', 'sibling');

  if (error) throw error;
  return data || [];
}

export async function getSpouses(personId: string): Promise<Relationship[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .or(`person1_id.eq.${personId},person2_id.eq.${personId}`)
    .eq('relationship_type', 'spouse');

  if (error) throw error;
  return data || [];
}

// Check if a relationship already exists between two persons
export async function relationshipExists(
  person1Id: string,
  person2Id: string,
  type: string
): Promise<boolean> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('id')
    .or(
      `and(person1_id.eq.${person1Id},person2_id.eq.${person2Id}),and(person1_id.eq.${person2Id},person2_id.eq.${person1Id})`
    )
    .eq('relationship_type', type)
    .limit(1);

  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

// Verify a relationship (admin function)
export async function verifyRelationship(
  id: string,
  status: 'verified' | 'disputed'
): Promise<Relationship> {
  return updateRelationship(id, { verification_status: status });
}
