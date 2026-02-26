import { getSupabaseClient, type RealtimeChannel } from '../client';
import type { Geofence, GeofenceInsert, GeoPoint } from '../types';
import { isInsideGeofence, type Coordinates } from '@kintree/shared';

const TABLE = 'geofences';

export async function getGeofencesByFamily(familyId: string): Promise<Geofence[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('family_id', familyId);

  if (error) throw error;
  return data || [];
}

export async function getGeofenceById(id: string): Promise<Geofence | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createGeofence(geofence: GeofenceInsert): Promise<Geofence> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(geofence)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGeofence(
  id: string,
  updates: Partial<Omit<Geofence, 'id' | 'family_id' | 'created_at'>>
): Promise<Geofence> {
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

export async function deleteGeofence(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) throw error;
}

// Convert GeoPoint to Coordinates
function geoPointToCoordinates(point: GeoPoint): Coordinates {
  return {
    longitude: point.coordinates[0],
    latitude: point.coordinates[1],
  };
}

// Check if a point is inside any geofence (Heritage Zone)
export async function checkGeofences(
  familyId: string,
  point: Coordinates
): Promise<Geofence[]> {
  const geofences = await getGeofencesByFamily(familyId);

  return geofences.filter((geofence) => {
    const center = geoPointToCoordinates(geofence.center);
    return isInsideGeofence(point, center, geofence.radius_meters);
  });
}

// Get geofences related to a specific person (ancestor)
export async function getGeofencesForPerson(
  familyId: string,
  personId: string
): Promise<Geofence[]> {
  const geofences = await getGeofencesByFamily(familyId);
  return geofences.filter(
    (g) => g.related_persons?.includes(personId)
  );
}

// Add person to geofence's related persons
export async function addPersonToGeofence(
  geofenceId: string,
  personId: string
): Promise<Geofence> {
  const geofence = await getGeofenceById(geofenceId);
  if (!geofence) throw new Error('Geofence not found');

  const relatedPersons = [...(geofence.related_persons || []), personId];
  return updateGeofence(geofenceId, { related_persons: relatedPersons });
}

// Remove person from geofence
export async function removePersonFromGeofence(
  geofenceId: string,
  personId: string
): Promise<Geofence> {
  const geofence = await getGeofenceById(geofenceId);
  if (!geofence) throw new Error('Geofence not found');

  const relatedPersons = (geofence.related_persons || []).filter(
    (id) => id !== personId
  );
  return updateGeofence(geofenceId, { related_persons: relatedPersons });
}

// Subscribe to geofence changes for a family
export function subscribeToGeofenceChanges(
  familyId: string,
  callback: (payload: {
    eventType: 'INSERT' | 'UPDATE' | 'DELETE';
    geofence: Geofence;
  }) => void
): RealtimeChannel {
  const supabase = getSupabaseClient();

  return supabase
    .channel(`family-geofences-${familyId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: TABLE,
        filter: `family_id=eq.${familyId}`,
      },
      (payload) => {
        callback({
          eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          geofence: (payload.new || payload.old) as Geofence,
        });
      }
    )
    .subscribe();
}

// Create a circular geofence from center point and radius
export function createCircularGeofenceData(
  center: Coordinates,
  radiusMeters: number,
  segments: number = 32
): { center: GeoPoint; coords: GeoPoint; radius_meters: number } {
  // Generate polygon approximation of circle
  const points: [number, number][] = [];

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    // Approximate meters to degrees (varies by latitude)
    const latOffset = (radiusMeters / 111320) * Math.cos(angle);
    const lngOffset =
      (radiusMeters / (111320 * Math.cos((center.latitude * Math.PI) / 180))) *
      Math.sin(angle);

    points.push([center.longitude + lngOffset, center.latitude + latOffset]);
  }

  return {
    center: {
      type: 'Point',
      coordinates: [center.longitude, center.latitude],
    },
    coords: {
      type: 'Point', // Note: for circular geofences we store center + radius
      coordinates: [center.longitude, center.latitude],
    },
    radius_meters: radiusMeters,
  };
}
