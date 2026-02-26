import type { Coordinates } from './types';

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Check if a point is inside a geofence (circular)
 */
export function isInsideGeofence(
  point: Coordinates,
  center: Coordinates,
  radiusMeters: number
): boolean {
  return calculateDistance(point, center) <= radiusMeters;
}

/**
 * Format a date for display, handling approximate dates
 */
export function formatDate(
  date: Date | string | null,
  approximate: boolean = false
): string {
  if (!date) return 'Unknown';

  const d = typeof date === 'string' ? new Date(date) : date;
  const formatted = d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return approximate ? `~${formatted}` : formatted;
}

/**
 * Calculate age from birth date
 */
export function calculateAge(
  birthDate: Date | string,
  deathDate?: Date | string | null
): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const end = deathDate
    ? typeof deathDate === 'string'
      ? new Date(deathDate)
      : deathDate
    : new Date();

  let age = end.getFullYear() - birth.getFullYear();
  const monthDiff = end.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Generate initials from a name
 */
export function getInitials(
  firstName?: string | null,
  lastName?: string | null
): string {
  const first = firstName?.charAt(0).toUpperCase() || '';
  const last = lastName?.charAt(0).toUpperCase() || '';
  return first + last || '?';
}

/**
 * Generate a full name from parts
 */
export function getFullName(
  firstName?: string | null,
  middleNames?: string[] | null,
  lastName?: string | null,
  maidenName?: string | null
): string {
  const parts: string[] = [];

  if (firstName) parts.push(firstName);
  if (middleNames?.length) parts.push(...middleNames);
  if (lastName) parts.push(lastName);
  if (maidenName) parts.push(`(née ${maidenName})`);

  return parts.join(' ') || 'Unknown';
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for rate limiting
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generate a unique ID (client-side, not for database)
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
