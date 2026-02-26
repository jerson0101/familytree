// App-wide constants

export const APP_NAME = 'KinTree';
export const APP_TAGLINE = 'Family Operating System';

// GPS tracking configuration
export const GPS_CONFIG = {
  UPDATE_INTERVAL_MS: 10000, // 10 seconds
  DISTANCE_FILTER_METERS: 10,
  ACCURACY: 'high' as const,
  BATTERY_OPTIMIZATION: true,
} as const;

// Location history retention
export const LOCATION_HISTORY_DAYS = 30;

// Geofence defaults
export const GEOFENCE_DEFAULTS = {
  DEFAULT_RADIUS_METERS: 100,
  MIN_RADIUS_METERS: 50,
  MAX_RADIUS_METERS: 5000,
} as const;

// P-Graph visualization
export const GRAPH_CONFIG = {
  NODE_WIDTH: 180,
  NODE_HEIGHT: 100,
  UNION_NODE_SIZE: 24,
  HORIZONTAL_SPACING: 60,
  VERTICAL_SPACING: 120,
  ANIMATION_DURATION_MS: 300,
} as const;

// Genogram symbols
export const GENOGRAM_SYMBOLS = {
  MALE: 'square',
  FEMALE: 'circle',
  OTHER: 'diamond',
  UNKNOWN: 'question',
  DECEASED_LINE: 'diagonal',
} as const;

// DYK Scale
export const DYK_CONFIG = {
  TOTAL_QUESTIONS: 20,
  HIGH_KNOWLEDGE_THRESHOLD: 15,
  MEDIUM_KNOWLEDGE_THRESHOLD: 8,
} as const;

// Storage buckets
export const STORAGE_BUCKETS = {
  PHOTOS: 'photos',
  DOCUMENTS: 'documents',
  AUDIO: 'audio',
  AVATARS: 'avatars',
} as const;

// Roles and permissions
export const ROLE_PERMISSIONS = {
  admin: ['read', 'create', 'update', 'delete', 'manage_members', 'approve_suggestions'],
  editor: ['read', 'create', 'update'],
  suggest_only: ['read', 'suggest'],
  viewer: ['read'],
} as const;

// Privacy levels descriptions
export const PRIVACY_LEVELS = {
  public: 'Visible to everyone',
  family: 'Visible to family members only',
  private: 'Visible only to you and admins',
} as const;
