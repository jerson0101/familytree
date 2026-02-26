import { getSupabaseClient, type RealtimeChannel } from '../client';
import type { Location, LocationInsert } from '../types';
import { LOCATION_HISTORY_DAYS } from '@kintree/shared';

const TABLE = 'locations';

export async function insertLocation(location: LocationInsert): Promise<Location> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(location)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLatestLocations(familyId: string): Promise<Location[]> {
  const supabase = getSupabaseClient();

  // Get the latest location for each user in the family
  // Using a subquery to get distinct on user_id
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('family_id', familyId)
    .order('recorded_at', { ascending: false });

  if (error) throw error;

  // Deduplicate by user_id, keeping only the latest
  const latestByUser = new Map<string, Location>();
  for (const loc of data || []) {
    if (!latestByUser.has(loc.user_id)) {
      latestByUser.set(loc.user_id, loc);
    }
  }

  return Array.from(latestByUser.values());
}

export async function getLocationHistory(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<Location[]> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false });

  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - LOCATION_HISTORY_DAYS);

  query = query.gte('recorded_at', (startDate || defaultStartDate).toISOString());

  if (endDate) {
    query = query.lte('recorded_at', endDate.toISOString());
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getUserLocationAt(
  userId: string,
  timestamp: Date
): Promise<Location | null> {
  const supabase = getSupabaseClient();

  // Get the closest location to the specified timestamp
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .lte('recorded_at', timestamp.toISOString())
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// Delete old location data (for privacy/storage management)
export async function cleanupOldLocations(
  daysToKeep: number = LOCATION_HISTORY_DAYS
): Promise<number> {
  const supabase = getSupabaseClient();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const { error, count } = await supabase
    .from(TABLE)
    .delete()
    .lt('recorded_at', cutoffDate.toISOString());

  if (error) throw error;
  return count || 0;
}

// Subscribe to real-time location updates for a family
export function subscribeToFamilyLocations(
  familyId: string,
  callback: (location: Location) => void
): RealtimeChannel {
  const supabase = getSupabaseClient();

  return supabase
    .channel(`family-locations-${familyId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: TABLE,
        filter: `family_id=eq.${familyId}`,
      },
      (payload) => {
        callback(payload.new as Location);
      }
    )
    .subscribe();
}

// Batch insert locations (for catching up after offline)
export async function insertBatchLocations(
  locations: LocationInsert[]
): Promise<Location[]> {
  if (locations.length === 0) return [];

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(locations)
    .select();

  if (error) throw error;
  return data || [];
}
