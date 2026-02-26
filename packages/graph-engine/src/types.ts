/**
 * Graph Engine Types
 * Types for P-Graph genealogical visualization
 */

import type { Gender } from '@kintree/shared';

// ============ Node Types ============

export interface GraphNode {
  id: string;
  type: 'person' | 'union';
  x: number;
  y: number;
  width: number;
  height: number;
  generation: number;
  data: PersonNodeData | UnionNodeData;
}

export interface PersonNodeData {
  personId: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate?: string;
  birthDateApproximate?: boolean;
  deathDate?: string;
  deathDateApproximate?: boolean;
  photoUrl?: string;
  isLiving: boolean;
  medicalConditions?: MedicalCondition[];
}

export interface UnionNodeData {
  unionId: string;
  partner1Id: string;
  partner2Id: string;
  unionType: 'marriage' | 'partnership' | 'divorced' | 'separated' | 'other';
  startDate?: string;
  endDate?: string;
}

export interface MedicalCondition {
  id: string;
  name: string;
  category: 'cardiovascular' | 'cancer' | 'metabolic' | 'neurological' | 'mental_health' | 'autoimmune' | 'genetic';
  severity?: 'mild' | 'moderate' | 'severe';
}

// ============ Edge Types ============

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: EdgeType;
  sourceAnchor?: AnchorPoint;
  targetAnchor?: AnchorPoint;
  pathData?: string; // SVG path data
  controlPoints?: Point[];
}

export type EdgeType =
  | 'parent-child'    // From union to child
  | 'spouse'          // Between person and union
  | 'sibling';        // Between siblings (usually implicit)

export type AnchorPoint = 'top' | 'bottom' | 'left' | 'right' | 'center';

// ============ Layout Types ============

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export interface LayoutConfig {
  nodeWidth: number;        // Person node width (default: 180)
  nodeHeight: number;       // Person node height (default: 100)
  unionNodeSize: number;    // Union node diameter (default: 24)
  horizontalSpacing: number; // Between nodes (default: 60)
  verticalSpacing: number;  // Between generations (default: 120)
  rootPersonId?: string;    // Optional root to center on
  maxGenerations?: number;  // Limit generations to display
  direction: 'TB' | 'BT';   // Top-to-bottom or bottom-to-top
}

export interface LayoutResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  bounds: Bounds;
  generations: number;
}

// ============ Graph Data Types ============

export interface GraphData {
  persons: GraphPerson[];
  unions: GraphUnion[];
  relationships: GraphRelationship[];
}

export interface GraphPerson {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate?: string;
  birthDateApproximate?: boolean;
  deathDate?: string;
  deathDateApproximate?: boolean;
  photoUrl?: string;
  isLiving: boolean;
  medicalConditions?: MedicalCondition[];
}

export interface GraphUnion {
  id: string;
  partner1Id: string;
  partner2Id: string;
  unionType: 'marriage' | 'partnership' | 'divorced' | 'separated' | 'other';
  startDate?: string;
  endDate?: string;
  childrenIds: string[];
}

export interface GraphRelationship {
  id: string;
  personId: string;
  relatedPersonId: string;
  type: 'parent' | 'child' | 'sibling';
}

// ============ Viewport Types ============

export interface Viewport {
  x: number;
  y: number;
  scale: number;
  width: number;
  height: number;
}

export interface ViewportBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

// ============ Interaction Types ============

export interface NodeInteraction {
  nodeId: string;
  type: 'click' | 'hover' | 'drag' | 'contextmenu';
  position: Point;
  originalEvent?: Event;
}

export interface EdgeInteraction {
  edgeId: string;
  type: 'click' | 'hover';
  position: Point;
  originalEvent?: Event;
}

export interface ViewportInteraction {
  type: 'pan' | 'zoom' | 'pinch';
  delta: Point;
  scale?: number;
  center?: Point;
}

// ============ Render Options ============

export interface RenderOptions {
  showPhotos: boolean;
  showDates: boolean;
  showMedicalIcons: boolean;
  showDeceased: boolean;
  highlightedNodeId?: string;
  selectedNodeId?: string;
  focusedNodeId?: string;
  animationsEnabled: boolean;
}

// ============ Genogram Types ============

export interface GenogramOptions extends RenderOptions {
  showRelationshipLines: boolean;
  showMedicalConditions: boolean;
  conditionFilter?: string[];
  legendVisible: boolean;
}

export interface GenogramSymbol {
  gender: Gender;
  isDeceased: boolean;
  conditions: MedicalCondition[];
}

// ============ Constants ============

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  nodeWidth: 180,
  nodeHeight: 100,
  unionNodeSize: 24,
  horizontalSpacing: 60,
  verticalSpacing: 120,
  direction: 'TB',
};

export const NODE_DIMENSIONS = {
  person: { width: 180, height: 100 },
  union: { width: 24, height: 24 },
} as const;

export const ZOOM_LIMITS = {
  min: 0.1,
  max: 3,
  step: 0.1,
} as const;
