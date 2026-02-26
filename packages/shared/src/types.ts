// Core KinTree Types

export type Gender = 'male' | 'female' | 'other' | 'unknown';
export type PrivacyLevel = 'public' | 'family' | 'private';
export type FamilyRole = 'admin' | 'editor' | 'suggest_only' | 'viewer';
export type VerificationStatus = 'verified' | 'pending' | 'disputed';
export type SuggestionStatus = 'pending' | 'approved' | 'rejected';

export type RelationshipType =
  | 'parent_child'
  | 'spouse'
  | 'sibling'
  | 'adoptive_parent'
  | 'step_parent'
  | 'guardian';

export type UnionType = 'marriage' | 'partnership' | 'unknown';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface DateRange {
  start?: Date;
  end?: Date;
}

export interface MedicalCondition {
  condition: string;
  type?: string;
  diagnosedAge?: number;
  notes?: string;
}

// DYK (Do You Know) Scale Questions
export interface DYKQuestion {
  id: string;
  category: 'maternal' | 'paternal' | 'self';
  question: string;
}

export interface DYKResponse {
  questionId: string;
  answer: boolean;
}

// Medical conditions categories
export const MEDICAL_CATEGORIES = {
  cardiovascular: ['heart_disease', 'hypertension', 'stroke', 'arrhythmia'],
  cancer: [
    'breast_cancer_brca1',
    'breast_cancer_brca2',
    'colon_cancer',
    'prostate_cancer',
    'lung_cancer',
    'ovarian_cancer',
  ],
  metabolic: ['diabetes_type1', 'diabetes_type2', 'obesity', 'thyroid_disorder'],
  neurological: ['alzheimer', 'parkinson', 'epilepsy', 'multiple_sclerosis'],
  mental_health: ['depression', 'bipolar', 'schizophrenia', 'anxiety_disorder'],
  autoimmune: ['lupus', 'rheumatoid_arthritis', 'crohn_disease', 'celiac_disease'],
  genetic: ['cystic_fibrosis', 'sickle_cell', 'huntington', 'hemophilia'],
} as const;

export type MedicalCategory = keyof typeof MEDICAL_CATEGORIES;
