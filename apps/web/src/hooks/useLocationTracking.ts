'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import { useFamily } from './useFamily';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface FamilyMemberLocation {
  userId: string;
  personId: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  address: string | null;
  city: string | null;
  batteryLevel: number | null;
  isCharging: boolean;
  lastUpdatedAt: string;
  isOnline: boolean;
}

export interface LocationSharingSettings {
  shareLocation: boolean;
  shareWithAll: boolean;
  sharePreciseLocation: boolean;
  updateFrequency: 'realtime' | 'hourly' | 'daily' | 'manual';
}

type PermissionStatus = 'prompt' | 'granted' | 'denied' | 'unavailable';

export function useLocationTracking() {
  const supabase = useMemo(() => createClient(), []);
  const { currentFamily } = useFamily();

  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('prompt');
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [familyLocations, setFamilyLocations] = useState<FamilyMemberLocation[]>([]);
  const [settings, setSettings] = useState<LocationSharingSettings>({
    shareLocation: false,
    shareWithAll: true,
    sharePreciseLocation: true,
    updateFrequency: 'realtime',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if geolocation is available
  const isGeolocationAvailable = typeof navigator !== 'undefined' && 'geolocation' in navigator;

  // Check permission status
  const checkPermission = useCallback(async () => {
    if (!isGeolocationAvailable) {
      setPermissionStatus('unavailable');
      return 'unavailable';
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionStatus(result.state as PermissionStatus);

      result.onchange = () => {
        setPermissionStatus(result.state as PermissionStatus);
      };

      return result.state as PermissionStatus;
    } catch {
      // Some browsers don't support permissions API
      setPermissionStatus('prompt');
      return 'prompt';
    }
  }, [isGeolocationAvailable]);

  // Request location permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isGeolocationAvailable) {
      setError('Geolocation not available on this device');
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPermissionStatus('granted');
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined,
          });
          resolve(true);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setPermissionStatus('denied');
            setError('Location permission denied');
          } else {
            setError('Error getting location');
          }
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, [isGeolocationAvailable]);

  // Reverse geocode to get address
  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<{ address?: string; city?: string; country?: string }> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'KinTree Family App',
          },
        }
      );

      if (!response.ok) return {};

      const data = await response.json();
      const addr = data.address || {};

      return {
        address: data.display_name?.split(',').slice(0, 2).join(',') || undefined,
        city: addr.city || addr.town || addr.village || addr.municipality || undefined,
        country: addr.country || undefined,
      };
    } catch {
      return {};
    }
  }, []);

  // Update location in database
  const updateLocation = useCallback(async (location: LocationData) => {
    if (!currentFamily?.id) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get address if not provided
      let locationWithAddress = { ...location };
      if (!location.address) {
        const geoData = await reverseGeocode(location.latitude, location.longitude);
        locationWithAddress = { ...location, ...geoData };
      }

      // Get battery info if available
      let batteryLevel: number | undefined;
      let isCharging: boolean | undefined;

      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          batteryLevel = Math.round(battery.level * 100);
          isCharging = battery.charging;
        } catch {
          // Battery API not available
        }
      }

      const { error: rpcError } = await supabase.rpc('update_user_location', {
        p_family_id: currentFamily.id,
        p_latitude: locationWithAddress.latitude,
        p_longitude: locationWithAddress.longitude,
        p_accuracy: locationWithAddress.accuracy || null,
        p_altitude: locationWithAddress.altitude || null,
        p_heading: locationWithAddress.heading || null,
        p_speed: locationWithAddress.speed || null,
        p_address: locationWithAddress.address || null,
        p_city: locationWithAddress.city || null,
        p_country: locationWithAddress.country || null,
        p_battery_level: batteryLevel || null,
        p_is_charging: isCharging || null,
      });

      if (rpcError) {
        setError('Error updating location');
        return;
      }

      setCurrentLocation(locationWithAddress);
      setError(null);
    } catch (err) {
      setError('Error updating location');
    }
  }, [currentFamily?.id, supabase, reverseGeocode]);

  // Start tracking location
  const startTracking = useCallback(() => {
    if (!isGeolocationAvailable || permissionStatus !== 'granted') return () => { };

    let currentWatchId: number | null = null;
    let usingHighAccuracy = true;

    const handlePosition = (position: GeolocationPosition) => {
      const location: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude || undefined,
        heading: position.coords.heading || undefined,
        speed: position.coords.speed || undefined,
      };

      updateLocation(location);
    };

    const handleError = (error: GeolocationPositionError) => {
      // If high accuracy fails, switch to low accuracy
      if (usingHighAccuracy && (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE)) {
        usingHighAccuracy = false;
        if (currentWatchId !== null) navigator.geolocation.clearWatch(currentWatchId);

        currentWatchId = navigator.geolocation.watchPosition(
          handlePosition,
          (fallbackError) => {
            setError(`Error tracking location: ${fallbackError.message}`);
          },
          {
            enableHighAccuracy: false,
            timeout: 30000,
            maximumAge: 60000,
          }
        );
        return;
      }

      setError(`Error tracking location: ${error.message}`);
    };

    currentWatchId = navigator.geolocation.watchPosition(
      handlePosition,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10s for high accuracy
        maximumAge: 60000, // Cache for 1 minute
      }
    );

    return () => {
      if (currentWatchId !== null) navigator.geolocation.clearWatch(currentWatchId);
    };
  }, [isGeolocationAvailable, permissionStatus, updateLocation]);

  // Fetch family members' locations
  const fetchFamilyLocations = useCallback(async () => {
    if (!currentFamily?.id) {
      setFamilyLocations([]);
      return;
    }

    try {
      const { data, error: rpcError } = await supabase.rpc('get_family_locations', {
        p_family_id: currentFamily.id,
      });

      if (rpcError) {
        setError('Error fetching family locations');
        setFamilyLocations([]);
        return;
      }

      const locations: FamilyMemberLocation[] = (data || []).map((loc: any) => ({
        userId: loc.user_id,
        personId: loc.person_id,
        firstName: loc.first_name,
        lastName: loc.last_name,
        photoUrl: loc.photo_url,
        latitude: parseFloat(loc.latitude),
        longitude: parseFloat(loc.longitude),
        accuracy: loc.accuracy ? parseFloat(loc.accuracy) : null,
        address: loc.address,
        city: loc.city,
        batteryLevel: loc.battery_level,
        isCharging: loc.is_charging || false,
        lastUpdatedAt: loc.last_updated_at,
        isOnline: loc.is_online,
      }));

      setFamilyLocations(locations);
      setError(null);
    } catch (err) {
      setError('Error fetching family locations');
      setFamilyLocations([]);
    }
  }, [currentFamily?.id, supabase]);

  // Load settings
  const loadSettings = useCallback(async () => {
    if (!currentFamily?.id) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error: queryError } = await supabase
        .from('location_sharing_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('family_id', currentFamily.id)
        .maybeSingle();

      if (queryError) {
        setError('Error loading location settings');
        return;
      }

      if (data) {
        setSettings({
          shareLocation: data.share_location,
          shareWithAll: data.share_with_all,
          sharePreciseLocation: data.share_precise_location,
          updateFrequency: data.update_frequency,
        });
      }
    } catch (err) {
      setError('Error loading location settings');
    }
  }, [currentFamily?.id, supabase]);

  // Save settings
  const saveSettings = useCallback(async (newSettings: Partial<LocationSharingSettings>) => {
    if (!currentFamily?.id) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updatedSettings = { ...settings, ...newSettings };

      const { error: upsertError } = await supabase
        .from('location_sharing_settings')
        .upsert({
          user_id: user.id,
          family_id: currentFamily.id,
          share_location: updatedSettings.shareLocation,
          share_with_all: updatedSettings.shareWithAll,
          share_precise_location: updatedSettings.sharePreciseLocation,
          update_frequency: updatedSettings.updateFrequency,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,family_id',
        });

      if (upsertError) {
        setError('Error saving settings');
        return;
      }

      setSettings(updatedSettings);
      setError(null);
    } catch (err) {
      setError('Error saving settings');
    }
  }, [currentFamily?.id, supabase, settings]);

  // Enable location sharing
  const enableLocationSharing = useCallback(async () => {
    try {
      const hasPermission = await requestPermission();
      if (hasPermission) {
        await saveSettings({ shareLocation: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error enabling location sharing:', error);
      return false;
    }
  }, [requestPermission, saveSettings]);

  // Disable location sharing
  const disableLocationSharing = useCallback(async () => {
    await saveSettings({ shareLocation: false });
    setIsTracking(false);
  }, [saveSettings]);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await checkPermission();
      await loadSettings();
      await fetchFamilyLocations();
      setIsLoading(false);
    };

    init();
  }, [checkPermission, loadSettings, fetchFamilyLocations]);

  // Auto-start tracking if enabled
  // Auto-start tracking if enabled
  useEffect(() => {
    if (settings.shareLocation && permissionStatus === 'granted') {
      setIsTracking(true);
      const cleanup = startTracking();
      return () => {
        if (cleanup) cleanup();
        setIsTracking(false);
      };
    } else {
      setIsTracking(false);
    }
  }, [settings.shareLocation, permissionStatus, startTracking]);

  // Refresh family locations periodically
  useEffect(() => {
    if (!currentFamily?.id) return;

    const interval = setInterval(fetchFamilyLocations, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [currentFamily?.id, fetchFamilyLocations]);

  return {
    // State
    permissionStatus,
    isTracking,
    currentLocation,
    familyLocations,
    settings,
    isLoading,
    error,
    isGeolocationAvailable,

    // Actions
    requestPermission,
    enableLocationSharing,
    disableLocationSharing,
    saveSettings,
    refreshLocations: fetchFamilyLocations,
    updateLocationManually: updateLocation,
  };
}
