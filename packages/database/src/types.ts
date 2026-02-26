// Database types for KinTree
// These will be replaced by auto-generated types from Supabase CLI

import type {
  Gender,
  PrivacyLevel,
  FamilyRole,
  RelationshipType,
  UnionType,
  VerificationStatus,
  SuggestionStatus,
  MedicalCondition,
} from '@kintree/shared';

export interface Family {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  settings: FamilySettings;
}

export interface FamilySettings {
  defaultPrivacyLevel?: PrivacyLevel;
  allowSuggestions?: boolean;
  notifyOnChanges?: boolean;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string | null;
  role: FamilyRole;
  invited_at: string;
  accepted_at: string | null;
}

export interface Person {
  id: string;
  family_id: string;
  first_name: string;
  middle_names: string[] | null;
  last_name: string | null;
  maiden_name: string | null;
  nicknames: string[] | null;
  birth_date: string | null;
  birth_date_approximate: boolean;
  birth_place: string | null;
  birth_place_coords: GeoPoint | null;
  death_date: string | null;
  death_date_approximate: boolean;
  death_place: string | null;
  gender: Gender;
  is_living: boolean;
  linked_user_id: string | null;
  medical_conditions: MedicalCondition[];
  biography: string | null;
  voice_recordings: string[] | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  privacy_level: PrivacyLevel;
}

export interface Relationship {
  id: string;
  family_id: string;
  person1_id: string;
  person2_id: string;
  relationship_type: RelationshipType;
  start_date: string | null;
  end_date: string | null;
  is_biological: boolean;
  verification_status: VerificationStatus;
  source_documents: string[] | null;
  created_at: string;
  created_by: string;
}

export interface Union {
  id: string;
  family_id: string;
  partner1_id: string;
  partner2_id: string | null;
  union_type: UnionType;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  children: string[];
}

export interface Location {
  id: string;
  user_id: string;
  family_id: string;
  coords: GeoPoint;
  accuracy: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  battery_level: number | null;
  recorded_at: string;
}

export interface Geofence {
  id: string;
  family_id: string;
  name: string;
  description: string | null;
  coords: GeoPolygon;
  center: GeoPoint;
  radius_meters: number;
  related_persons: string[] | null;
  historical_content: HistoricalContent | null;
  notify_on_enter: boolean;
  notify_on_exit: boolean;
  created_at: string;
}

export interface HistoricalContent {
  narrative?: string;
  photos?: string[];
  documents?: string[];
  audio?: string[];
  timeline?: TimelineEvent[];
}

export interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
  type: 'birth' | 'death' | 'marriage' | 'move' | 'milestone' | 'other';
}

export interface ChangeHistory {
  id: string;
  family_id: string;
  entity_type: 'person' | 'union' | 'relationship' | 'historical_content';
  entity_id: string;
  change_type: 'create' | 'update' | 'delete';
  previous_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  changed_by: string;
  change_description?: string;
  created_at: string;
}

export interface DYKResponse {
  id: string;
  user_id: string;
  family_id: string;
  responses: { questionId: string; answer: boolean }[];
  score: number;
  completed_at: string;
}

export interface ChangeSuggestion {
  id: string;
  family_id: string;
  entity_type: 'person' | 'union' | 'relationship' | 'historical_content';
  entity_id: string | null;
  change_type: 'create' | 'update' | 'delete';
  suggested_data: Record<string, unknown>;
  status: SuggestionStatus;
  suggested_by: string;
  reviewed_by: string | null;
  suggested_at: string;
  reviewed_at: string | null;
  reason?: string;
  review_notes?: string;
}

// DYK types are defined in services/dyk.ts
// Social media types are defined in services/social-media.ts

export interface CompletedChallengeRow {
  id: string;
  family_id: string;
  user_id: string;
  challenge_id: string;
  evidence?: string;
  completed_at: string;
}

// Geo types
export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GeoPolygon {
  type: 'Polygon';
  coordinates: [number, number][][];
}

// Insert/Update types (without auto-generated fields)
export type PersonInsert = Omit<
  Person,
  'id' | 'created_at' | 'updated_at'
> & { id?: string };

export type PersonUpdate = Partial<Omit<Person, 'id' | 'family_id' | 'created_at' | 'created_by'>>;

export type RelationshipInsert = Omit<
  Relationship,
  'id' | 'created_at'
> & { id?: string };

export type UnionInsert = Omit<Union, 'id'> & { id?: string };

export type GeofenceInsert = Omit<Geofence, 'id' | 'created_at'> & { id?: string };

export type LocationInsert = Omit<Location, 'id' | 'recorded_at'> & { recorded_at?: string };

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      families: {
        Row: Family;
        Insert: Omit<Family, 'id' | 'created_at'>;
        Update: Partial<Omit<Family, 'id'>>;
      };
      family_members: {
        Row: FamilyMember;
        Insert: Omit<FamilyMember, 'id' | 'invited_at'>;
        Update: Partial<Omit<FamilyMember, 'id'>>;
      };
      persons: {
        Row: Person;
        Insert: PersonInsert;
        Update: PersonUpdate;
      };
      relationships: {
        Row: Relationship;
        Insert: RelationshipInsert;
        Update: Partial<Omit<Relationship, 'id' | 'family_id'>>;
      };
      unions: {
        Row: Union;
        Insert: UnionInsert;
        Update: Partial<Omit<Union, 'id' | 'family_id'>>;
      };
      locations: {
        Row: Location;
        Insert: LocationInsert;
        Update: never;
      };
      geofences: {
        Row: Geofence;
        Insert: GeofenceInsert;
        Update: Partial<Omit<Geofence, 'id' | 'family_id'>>;
      };
      change_history: {
        Row: ChangeHistory;
        Insert: Omit<ChangeHistory, 'id' | 'created_at'>;
        Update: never;
      };
      dyk_responses: {
        Row: DYKResponse;
        Insert: Omit<DYKResponse, 'id' | 'completed_at'>;
        Update: never;
      };
      change_suggestions: {
        Row: ChangeSuggestion;
        Insert: Omit<ChangeSuggestion, 'id' | 'suggested_at'>;
        Update: Pick<ChangeSuggestion, 'status' | 'reviewed_by' | 'reviewed_at' | 'review_notes'>;
      };
      // Note: The following tables use dynamic typing since exact schema
      // depends on Supabase configuration. Use explicit type annotations in services.
      dyk_questions: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      completed_challenges: {
        Row: CompletedChallengeRow;
        Insert: Omit<CompletedChallengeRow, 'id' | 'completed_at'>;
        Update: never;
      };
      social_media_accounts: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      social_posts: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: never;
      };
      feed_preferences: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
  };
}
