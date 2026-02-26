'use client';

import { useMemo } from 'react';
import {
  createSugiyamaLayout,
  type GraphData,
  type GraphNode,
  type GraphEdge,
  type Bounds,
  type LayoutConfig,
} from '@kintree/graph-engine';

export interface UseTreeLayoutOptions {
  config?: Partial<LayoutConfig>;
  rootPersonId?: string;
}

export interface UseTreeLayoutResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  bounds: Bounds;
  generations: number;
  isLoading: boolean;
}

/**
 * Hook to compute tree layout using Sugiyama algorithm
 */
export function useTreeLayout(
  data: GraphData | null,
  options: UseTreeLayoutOptions = {}
): UseTreeLayoutResult {
  const { config, rootPersonId } = options;

  const result = useMemo(() => {
    if (!data || !data.persons || data.persons.length === 0) {
      return {
        nodes: [],
        edges: [],
        bounds: { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 },
        generations: 0,
        isLoading: false,
      };
    }

    const layout = createSugiyamaLayout({
      ...config,
      rootPersonId,
    });

    const layoutResult = layout.compute(data);

    return {
      ...layoutResult,
      generations: (layoutResult as any).generations || 0,
      isLoading: false,
    };
  }, [data, config, rootPersonId]);

  return result;
}

/**
 * Create mock graph data for testing
 */
export function createMockGraphData(): GraphData {
  return {
    persons: [
      // Grandparents - Paternal
      {
        id: 'gp1',
        firstName: 'Roberto',
        lastName: 'García',
        gender: 'male',
        birthDate: '1940-05-12',
        isLiving: false,
      },
      {
        id: 'gp2',
        firstName: 'María',
        lastName: 'López',
        gender: 'female',
        birthDate: '1945-08-23',
        isLiving: false,
      },
      // Grandparents - Maternal
      {
        id: 'gp3',
        firstName: 'José',
        lastName: 'Martínez',
        gender: 'male',
        birthDate: '1942-03-15',
        isLiving: false,
      },
      {
        id: 'gp4',
        firstName: 'Carmen',
        lastName: 'Hernández',
        gender: 'female',
        birthDate: '1948-11-30',
        isLiving: true,
      },
      // Parents
      {
        id: 'p1',
        firstName: 'Juan',
        lastName: 'García',
        gender: 'male',
        birthDate: '1970-02-28',
        isLiving: true,
      },
      {
        id: 'p2',
        firstName: 'Ana',
        lastName: 'Martínez',
        gender: 'female',
        birthDate: '1972-07-14',
        isLiving: true,
      },
      // Children
      {
        id: 'c1',
        firstName: 'Carlos',
        lastName: 'García',
        gender: 'male',
        birthDate: '1998-12-05',
        isLiving: true,
      },
      {
        id: 'c2',
        firstName: 'Sofía',
        lastName: 'García',
        gender: 'female',
        birthDate: '2002-03-18',
        isLiving: true,
      },
    ],
    unions: [
      // Paternal grandparents union
      {
        id: 'u1',
        partner1Id: 'gp1',
        partner2Id: 'gp2',
        unionType: 'marriage',
        startDate: '1965-06-20',
        childrenIds: ['p1'],
      },
      // Maternal grandparents union
      {
        id: 'u2',
        partner1Id: 'gp3',
        partner2Id: 'gp4',
        unionType: 'marriage',
        startDate: '1968-09-15',
        childrenIds: ['p2'],
      },
      // Parents union
      {
        id: 'u3',
        partner1Id: 'p1',
        partner2Id: 'p2',
        unionType: 'marriage',
        startDate: '1995-04-10',
        childrenIds: ['c1', 'c2'],
      },
    ],
    relationships: [
      // Parent-child relationships for p1
      { id: 'r1', personId: 'gp1', relatedPersonId: 'p1', type: 'parent' },
      { id: 'r2', personId: 'gp2', relatedPersonId: 'p1', type: 'parent' },
      // Parent-child relationships for p2
      { id: 'r3', personId: 'gp3', relatedPersonId: 'p2', type: 'parent' },
      { id: 'r4', personId: 'gp4', relatedPersonId: 'p2', type: 'parent' },
      // Parent-child relationships for children
      { id: 'r5', personId: 'p1', relatedPersonId: 'c1', type: 'parent' },
      { id: 'r6', personId: 'p2', relatedPersonId: 'c1', type: 'parent' },
      { id: 'r7', personId: 'p1', relatedPersonId: 'c2', type: 'parent' },
      { id: 'r8', personId: 'p2', relatedPersonId: 'c2', type: 'parent' },
      // Sibling relationship
      { id: 'r9', personId: 'c1', relatedPersonId: 'c2', type: 'sibling' },
    ],
  };
}
