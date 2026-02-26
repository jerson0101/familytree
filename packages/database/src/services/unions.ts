import { getSupabaseClient } from '../client';
import type { Union, UnionInsert } from '../types';

const TABLE = 'unions';

export async function getUnionsByFamily(familyId: string): Promise<Union[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('family_id', familyId);

  if (error) throw error;
  return data || [];
}

export async function getUnionById(id: string): Promise<Union | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getUnionsForPerson(personId: string): Promise<Union[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .or(`partner1_id.eq.${personId},partner2_id.eq.${personId}`);

  if (error) throw error;
  return data || [];
}

export async function createUnion(union: UnionInsert): Promise<Union> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(union)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUnion(
  id: string,
  updates: Partial<Omit<Union, 'id' | 'family_id'>>
): Promise<Union> {
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

export async function deleteUnion(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) throw error;
}

// Add a child to a union
export async function addChildToUnion(
  unionId: string,
  childId: string
): Promise<Union> {
  const union = await getUnionById(unionId);
  if (!union) throw new Error('Union not found');

  const children = [...(union.children || []), childId];
  return updateUnion(unionId, { children });
}

// Remove a child from a union
export async function removeChildFromUnion(
  unionId: string,
  childId: string
): Promise<Union> {
  const union = await getUnionById(unionId);
  if (!union) throw new Error('Union not found');

  const children = (union.children || []).filter((id) => id !== childId);
  return updateUnion(unionId, { children });
}

// Find union between two persons
export async function findUnionBetween(
  person1Id: string,
  person2Id: string
): Promise<Union | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .or(
      `and(partner1_id.eq.${person1Id},partner2_id.eq.${person2Id}),and(partner1_id.eq.${person2Id},partner2_id.eq.${person1Id})`
    )
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// Get all unions (marriages/partnerships) in chronological order
export async function getUnionTimeline(familyId: string): Promise<Union[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('family_id', familyId)
    .order('start_date', { ascending: true, nullsFirst: false });

  if (error) throw error;
  return data || [];
}
