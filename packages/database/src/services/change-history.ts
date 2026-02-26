/**
 * Change History Service
 * Tracks changes to family data and manages suggestions
 */

import { getSupabaseClient } from '../client';
import type { ChangeHistory, ChangeSuggestion } from '../types';

export interface ChangeHistoryInput {
  familyId: string;
  entityType: 'person' | 'union' | 'relationship' | 'historical_content';
  entityId: string;
  changeType: 'create' | 'update' | 'delete';
  changedBy: string;
  previousData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  changeDescription?: string;
}

export interface SuggestionInput {
  familyId: string;
  entityType: 'person' | 'union' | 'relationship' | 'historical_content';
  entityId?: string;
  changeType: 'create' | 'update' | 'delete';
  suggestedBy: string;
  suggestedData: Record<string, unknown>;
  reason?: string;
}

export interface SuggestionReview {
  suggestionId: string;
  reviewedBy: string;
  status: 'approved' | 'rejected';
  reviewNotes?: string;
}

/**
 * Get change history for a family
 */
export async function getChangeHistory(
  familyId: string,
  options?: {
    entityType?: string;
    entityId?: string;
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  }
): Promise<{ changes: ChangeHistory[]; total: number }> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('change_history')
    .select('*', { count: 'exact' })
    .eq('family_id', familyId)
    .order('changed_at', { ascending: false });

  if (options?.entityType) {
    query = query.eq('entity_type', options.entityType);
  }

  if (options?.entityId) {
    query = query.eq('entity_id', options.entityId);
  }

  if (options?.startDate) {
    query = query.gte('changed_at', options.startDate);
  }

  if (options?.endDate) {
    query = query.lte('changed_at', options.endDate);
  }

  const limit = options?.limit || 50;
  const offset = options?.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    changes: data || [],
    total: count || 0,
  };
}

/**
 * Record a change in history
 */
export async function recordChange(
  input: ChangeHistoryInput
): Promise<ChangeHistory> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('change_history')
    .insert({
      family_id: input.familyId,
      entity_type: input.entityType,
      entity_id: input.entityId,
      change_type: input.changeType,
      changed_by: input.changedBy,
      previous_data: input.previousData,
      new_data: input.newData,
      change_description: input.changeDescription,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Revert a change
 */
export async function revertChange(
  changeId: string,
  revertedBy: string
): Promise<void> {
  const supabase = getSupabaseClient();

  // Get the original change
  const { data: change, error: fetchError } = await supabase
    .from('change_history')
    .select('*')
    .eq('id', changeId)
    .single();

  if (fetchError) throw fetchError;
  if (!change) throw new Error('Change not found');

  // Determine revert action based on change type
  const { entity_type, entity_id, change_type, previous_data, new_data, family_id } = change;

  if (change_type === 'create') {
    // Delete the created entity
    await supabase.from(getTableName(entity_type)).delete().eq('id', entity_id);
  } else if (change_type === 'update' && previous_data) {
    // Restore previous data
    await supabase
      .from(getTableName(entity_type))
      .update(previous_data)
      .eq('id', entity_id);
  } else if (change_type === 'delete' && previous_data) {
    // Re-create deleted entity
    await supabase.from(getTableName(entity_type)).insert(previous_data);
  }

  // Record the revert as a new change
  await recordChange({
    familyId: family_id,
    entityType: entity_type,
    entityId: entity_id,
    changeType: 'update',
    changedBy: revertedBy,
    previousData: new_data,
    newData: previous_data,
    changeDescription: `Reverted change ${changeId}`,
  });
}

/**
 * Create a suggestion (for "suggest only" role)
 */
export async function createSuggestion(
  input: SuggestionInput
): Promise<ChangeSuggestion> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('change_suggestions')
    .insert({
      family_id: input.familyId,
      entity_type: input.entityType,
      entity_id: input.entityId,
      change_type: input.changeType,
      suggested_by: input.suggestedBy,
      suggested_data: input.suggestedData,
      reason: input.reason,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get pending suggestions for a family
 */
export async function getPendingSuggestions(
  familyId: string
): Promise<ChangeSuggestion[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('change_suggestions')
    .select('*')
    .eq('family_id', familyId)
    .eq('status', 'pending')
    .order('suggested_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get all suggestions for a family
 */
export async function getSuggestions(
  familyId: string,
  options?: {
    status?: 'pending' | 'approved' | 'rejected';
    suggestedBy?: string;
    limit?: number;
  }
): Promise<ChangeSuggestion[]> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('change_suggestions')
    .select('*')
    .eq('family_id', familyId)
    .order('suggested_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.suggestedBy) {
    query = query.eq('suggested_by', options.suggestedBy);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

/**
 * Review a suggestion (approve or reject)
 */
export async function reviewSuggestion(
  review: SuggestionReview
): Promise<ChangeSuggestion> {
  const supabase = getSupabaseClient();

  // Update suggestion status
  const { data: suggestion, error: updateError } = await supabase
    .from('change_suggestions')
    .update({
      status: review.status,
      reviewed_by: review.reviewedBy,
      reviewed_at: new Date().toISOString(),
      review_notes: review.reviewNotes,
    })
    .eq('id', review.suggestionId)
    .select()
    .single();

  if (updateError) throw updateError;

  // If approved, apply the suggested change
  if (review.status === 'approved' && suggestion) {
    await applySuggestion(suggestion, review.reviewedBy);
  }

  return suggestion;
}

/**
 * Apply an approved suggestion
 */
async function applySuggestion(
  suggestion: ChangeSuggestion,
  appliedBy: string
): Promise<void> {
  const supabase = getSupabaseClient();
  const { entity_type, entity_id, change_type, suggested_data, family_id } = suggestion;

  // Get current data for change history
  let previousData: Record<string, unknown> | undefined;

  if (entity_id && change_type !== 'create') {
    const { data } = await supabase
      .from(getTableName(entity_type))
      .select('*')
      .eq('id', entity_id)
      .single();
    previousData = data;
  }

  // Apply the change
  if (change_type === 'create') {
    const { data: newEntity } = await supabase
      .from(getTableName(entity_type))
      .insert({ ...suggested_data, family_id })
      .select()
      .single();

    // Record in history
    await recordChange({
      familyId: family_id,
      entityType: entity_type,
      entityId: newEntity?.id,
      changeType: 'create',
      changedBy: appliedBy,
      newData: suggested_data,
      changeDescription: `Applied suggestion ${suggestion.id}`,
    });
  } else if (change_type === 'update' && entity_id) {
    await supabase
      .from(getTableName(entity_type))
      .update(suggested_data)
      .eq('id', entity_id);

    await recordChange({
      familyId: family_id,
      entityType: entity_type,
      entityId: entity_id,
      changeType: 'update',
      changedBy: appliedBy,
      previousData,
      newData: suggested_data,
      changeDescription: `Applied suggestion ${suggestion.id}`,
    });
  } else if (change_type === 'delete' && entity_id) {
    await supabase.from(getTableName(entity_type)).delete().eq('id', entity_id);

    await recordChange({
      familyId: family_id,
      entityType: entity_type,
      entityId: entity_id,
      changeType: 'delete',
      changedBy: appliedBy,
      previousData,
      changeDescription: `Applied suggestion ${suggestion.id}`,
    });
  }
}

/**
 * Get table name from entity type
 */
function getTableName(entityType: string): string {
  const tableMap: Record<string, string> = {
    person: 'persons',
    union: 'unions',
    relationship: 'relationships',
    historical_content: 'historical_content',
  };

  return tableMap[entityType] || entityType;
}

/**
 * Get change statistics for a family
 */
export async function getChangeStats(
  familyId: string,
  days: number = 30
): Promise<{
  totalChanges: number;
  changesByType: Record<string, number>;
  changesByEntity: Record<string, number>;
  activeContributors: number;
}> {
  const supabase = getSupabaseClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: changes, error } = await supabase
    .from('change_history')
    .select('change_type, entity_type, changed_by')
    .eq('family_id', familyId)
    .gte('changed_at', startDate.toISOString());

  if (error) throw error;

  const changesByType: Record<string, number> = {};
  const changesByEntity: Record<string, number> = {};
  const contributors = new Set<string>();

  for (const change of changes || []) {
    changesByType[change.change_type] = (changesByType[change.change_type] || 0) + 1;
    changesByEntity[change.entity_type] = (changesByEntity[change.entity_type] || 0) + 1;
    contributors.add(change.changed_by);
  }

  return {
    totalChanges: changes?.length || 0,
    changesByType,
    changesByEntity,
    activeContributors: contributors.size,
  };
}
