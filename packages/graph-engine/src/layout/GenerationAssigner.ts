/**
 * Generation Assigner
 * Assigns generation levels to nodes in the family tree
 */

import type { GraphPerson, GraphUnion } from '../types';
import { Graph } from '../core/Graph';

export interface GenerationAssignment {
  personGenerations: Map<string, number>;
  unionGenerations: Map<string, number>;
  maxGeneration: number;
  minGeneration: number;
}

/**
 * Assigns generation numbers to all persons and unions in the graph
 * Generations are numbered from 0 (youngest) going up to older generations
 */
export function assignGenerations(
  graph: Graph,
  rootPersonId?: string
): GenerationAssignment {
  const personGenerations = new Map<string, number>();
  const unionGenerations = new Map<string, number>();

  const persons = graph.getAllPersons();
  if (persons.length === 0) {
    return { personGenerations, unionGenerations, maxGeneration: 0, minGeneration: 0 };
  }

  // Calculate person generations using the graph's method
  const rawGenerations = graph.calculateGenerations(rootPersonId);

  // Copy to our result map
  for (const [id, gen] of rawGenerations) {
    personGenerations.set(id, gen);
  }

  // Calculate union generations (between the two partners' generations)
  const unions = graph.getAllUnions();
  for (const union of unions) {
    const gen1 = personGenerations.get(union.partner1Id);
    const gen2 = personGenerations.get(union.partner2Id);

    if (gen1 !== undefined && gen2 !== undefined) {
      // Union is at the same generation as partners (should be equal ideally)
      // Add 0.5 to position union nodes visually between generations
      unionGenerations.set(union.id, Math.max(gen1, gen2));
    }
  }

  // Calculate min and max
  const allGenerations = Array.from(personGenerations.values());
  const maxGeneration = allGenerations.length > 0 ? Math.max(...allGenerations) : 0;
  const minGeneration = allGenerations.length > 0 ? Math.min(...allGenerations) : 0;

  return {
    personGenerations,
    unionGenerations,
    maxGeneration,
    minGeneration,
  };
}

/**
 * Groups persons by their generation
 */
export function groupByGeneration(
  persons: GraphPerson[],
  generations: Map<string, number>
): Map<number, GraphPerson[]> {
  const groups = new Map<number, GraphPerson[]>();

  for (const person of persons) {
    const gen = generations.get(person.id) ?? 0;
    const group = groups.get(gen);
    if (group) {
      group.push(person);
    } else {
      groups.set(gen, [person]);
    }
  }

  return groups;
}

/**
 * Gets all generations as sorted array (oldest to youngest)
 */
export function getSortedGenerations(generations: Map<string, number>): number[] {
  const uniqueGens = new Set(generations.values());
  return Array.from(uniqueGens).sort((a, b) => b - a); // Descending (oldest first)
}
