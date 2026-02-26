import { create } from 'zustand';

export interface FamilyLocation {
  id: string;
  personId: string;
  personName: string;
  personPhotoUrl?: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  speed?: number;
  heading?: number;
  altitude?: number;
  batteryLevel?: number;
  timestamp: string;
  address?: string;
  isActive: boolean;
}

export interface Geofence {
  id: string;
  name: string;
  description?: string;
  type: 'circle' | 'polygon';
  centerLat?: number;
  centerLng?: number;
  radiusMeters?: number;
  polygon?: Array<{ lat: number; lng: number }>;
  isHeritageZone: boolean;
  alertOnEntry: boolean;
  alertOnExit: boolean;
  createdAt: string;
}

export interface LocationAlert {
  id: string;
  personId: string;
  personName: string;
  geofenceId: string;
  geofenceName: string;
  type: 'entry' | 'exit';
  timestamp: string;
  isRead: boolean;
}

export interface LocationHistory {
  personId: string;
  locations: Array<{
    latitude: number;
    longitude: number;
    timestamp: string;
  }>;
}

interface LocationState {
  // Real-time data
  locations: FamilyLocation[];
  geofences: Geofence[];
  alerts: LocationAlert[];

  // History
  historyData: LocationHistory[];
  selectedHistoryPersonId: string | null;
  historyDateRange: { start: string; end: string } | null;

  // UI State
  mapCenter: { lat: number; lng: number };
  mapZoom: number;
  selectedLocationId: string | null;
  isTrackingEnabled: boolean;
  isLoading: boolean;

  // Actions
  setLocations: (locations: FamilyLocation[]) => void;
  updateLocation: (personId: string, location: Partial<FamilyLocation>) => void;
  setGeofences: (geofences: Geofence[]) => void;
  addGeofence: (geofence: Geofence) => void;
  updateGeofence: (geofenceId: string, updates: Partial<Geofence>) => void;
  removeGeofence: (geofenceId: string) => void;
  setAlerts: (alerts: LocationAlert[]) => void;
  addAlert: (alert: LocationAlert) => void;
  markAlertAsRead: (alertId: string) => void;
  clearAlerts: () => void;

  setHistoryData: (data: LocationHistory[]) => void;
  setSelectedHistoryPerson: (personId: string | null) => void;
  setHistoryDateRange: (range: { start: string; end: string } | null) => void;

  setMapCenter: (center: { lat: number; lng: number }) => void;
  setMapZoom: (zoom: number) => void;
  setSelectedLocation: (locationId: string | null) => void;
  setTrackingEnabled: (enabled: boolean) => void;
  setLoading: (loading: boolean) => void;

  // Helpers
  getLocationByPersonId: (personId: string) => FamilyLocation | undefined;
  getUnreadAlertsCount: () => number;
  isPersonInGeofence: (personId: string, geofenceId: string) => boolean;

  reset: () => void;
}

const initialMapCenter = { lat: 40.4168, lng: -3.7038 }; // Madrid by default

export const useLocationStore = create<LocationState>((set, get) => ({
  // Initial state
  locations: [],
  geofences: [],
  alerts: [],
  historyData: [],
  selectedHistoryPersonId: null,
  historyDateRange: null,
  mapCenter: initialMapCenter,
  mapZoom: 12,
  selectedLocationId: null,
  isTrackingEnabled: true,
  isLoading: true,

  // Location actions
  setLocations: (locations) => set({ locations }),

  updateLocation: (personId, updates) =>
    set((state) => ({
      locations: state.locations.map((loc) =>
        loc.personId === personId ? { ...loc, ...updates } : loc
      ),
    })),

  // Geofence actions
  setGeofences: (geofences) => set({ geofences }),

  addGeofence: (geofence) =>
    set((state) => ({
      geofences: [...state.geofences, geofence],
    })),

  updateGeofence: (geofenceId, updates) =>
    set((state) => ({
      geofences: state.geofences.map((g) =>
        g.id === geofenceId ? { ...g, ...updates } : g
      ),
    })),

  removeGeofence: (geofenceId) =>
    set((state) => ({
      geofences: state.geofences.filter((g) => g.id !== geofenceId),
    })),

  // Alert actions
  setAlerts: (alerts) => set({ alerts }),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
    })),

  markAlertAsRead: (alertId) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId ? { ...a, isRead: true } : a
      ),
    })),

  clearAlerts: () => set({ alerts: [] }),

  // History actions
  setHistoryData: (historyData) => set({ historyData }),

  setSelectedHistoryPerson: (selectedHistoryPersonId) =>
    set({ selectedHistoryPersonId }),

  setHistoryDateRange: (historyDateRange) => set({ historyDateRange }),

  // Map actions
  setMapCenter: (mapCenter) => set({ mapCenter }),

  setMapZoom: (mapZoom) => set({ mapZoom }),

  setSelectedLocation: (selectedLocationId) => set({ selectedLocationId }),

  setTrackingEnabled: (isTrackingEnabled) => set({ isTrackingEnabled }),

  setLoading: (isLoading) => set({ isLoading }),

  // Helpers
  getLocationByPersonId: (personId) =>
    get().locations.find((loc) => loc.personId === personId),

  getUnreadAlertsCount: () =>
    get().alerts.filter((a) => !a.isRead).length,

  isPersonInGeofence: (personId, geofenceId) => {
    const location = get().getLocationByPersonId(personId);
    const geofence = get().geofences.find((g) => g.id === geofenceId);

    if (!location || !geofence) return false;

    if (geofence.type === 'circle' && geofence.centerLat && geofence.centerLng && geofence.radiusMeters) {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        geofence.centerLat,
        geofence.centerLng
      );
      return distance <= geofence.radiusMeters;
    }

    // For polygon, would need point-in-polygon check
    return false;
  },

  reset: () =>
    set({
      locations: [],
      geofences: [],
      alerts: [],
      historyData: [],
      selectedHistoryPersonId: null,
      historyDateRange: null,
      mapCenter: initialMapCenter,
      mapZoom: 12,
      selectedLocationId: null,
      isLoading: true,
    }),
}));

// Haversine formula for distance calculation
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
