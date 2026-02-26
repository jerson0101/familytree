/**
 * Graph Data Structure
 * Core graph operations for genealogical data
 */

import type {
  GraphData,
  GraphPerson,
  GraphUnion,
  GraphRelationship,
  GraphNode,
  GraphEdge,
} from '../types';

export class Graph {
  private persons: Map<string, GraphPerson> = new Map();
  private unions: Map<string, GraphUnion> = new Map();
  private relationships: GraphRelationship[] = [];

  // Adjacency lists
  private parentMap: Map<string, string[]> = new Map(); // personId -> parentIds
  private childrenMap: Map<string, string[]> = new Map(); // personId -> childIds
  private spouseMap: Map<string, string[]> = new Map(); // personId -> spouseIds
  private unionsByPerson: Map<string, string[]> = new Map(); // personId -> unionIds

  constructor(data?: GraphData) {
    if (data) {
      this.loadData(data);
    }
  }

  /**
   * Load graph data from a GraphData object
   */
  loadData(data: GraphData): void {
    this.clear();

    // Load persons
    for (const person of data.persons) {
      this.persons.set(person.id, person);
    }

    // Load unions
    for (const union of data.unions) {
      this.unions.set(union.id, union);

      // Build spouse and union maps
      this.addToMap(this.spouseMap, union.partner1Id, union.partner2Id);
      this.addToMap(this.spouseMap, union.partner2Id, union.partner1Id);
      this.addToMap(this.unionsByPerson, union.partner1Id, union.id);
      this.addToMap(this.unionsByPerson, union.partner2Id, union.id);

      // Build parent-child maps from union children
      for (const childId of union.childrenIds) {
        this.addToMap(this.parentMap, childId, union.partner1Id);
        this.addToMap(this.parentMap, childId, union.partner2Id);
        this.addToMap(this.childrenMap, union.partner1Id, childId);
        this.addToMap(this.childrenMap, union.partner2Id, childId);
      }
    }

    // Load explicit relationships
    this.relationships = data.relationships;
    for (const rel of data.relationships) {
      if (rel.type === 'parent') {
        this.addToMap(this.parentMap, rel.personId, rel.relatedPersonId);
        this.addToMap(this.childrenMap, rel.relatedPersonId, rel.personId);
      }
    }
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.persons.clear();
    this.unions.clear();
    this.relationships = [];
    this.parentMap.clear();
    this.childrenMap.clear();
    this.spouseMap.clear();
    this.unionsByPerson.clear();
  }

  // ============ Getters ============

  getPerson(id: string): GraphPerson | undefined {
    return this.persons.get(id);
  }

  getUnion(id: string): GraphUnion | undefined {
    return this.unions.get(id);
  }

  getAllPersons(): GraphPerson[] {
    return Array.from(this.persons.values());
  }

  getAllUnions(): GraphUnion[] {
    return Array.from(this.unions.values());
  }

  getPersonCount(): number {
    return this.persons.size;
  }

  getUnionCount(): number {
    return this.unions.size;
  }

  // ============ Relationship Queries ============

  getParents(personId: string): GraphPerson[] {
    const parentIds = this.parentMap.get(personId) || [];
    return parentIds
      .map((id) => this.persons.get(id))
      .filter((p): p is GraphPerson => p !== undefined);
  }

  getChildren(personId: string): GraphPerson[] {
    const childIds = this.childrenMap.get(personId) || [];
    return childIds
      .map((id) => this.persons.get(id))
      .filter((p): p is GraphPerson => p !== undefined);
  }

  getSpouses(personId: string): GraphPerson[] {
    const spouseIds = this.spouseMap.get(personId) || [];
    return spouseIds
      .map((id) => this.persons.get(id))
      .filter((p): p is GraphPerson => p !== undefined);
  }

  getSiblings(personId: string): GraphPerson[] {
    const parents = this.getParents(personId);
    if (parents.length === 0) return [];

    const siblingIds = new Set<string>();
    for (const parent of parents) {
      const children = this.getChildren(parent.id);
      for (const child of children) {
        if (child.id !== personId) {
          siblingIds.add(child.id);
        }
      }
    }

    return Array.from(siblingIds)
      .map((id) => this.persons.get(id))
      .filter((p): p is GraphPerson => p !== undefined);
  }

  getUnionsForPerson(personId: string): GraphUnion[] {
    const unionIds = this.unionsByPerson.get(personId) || [];
    return unionIds
      .map((id) => this.unions.get(id))
      .filter((u): u is GraphUnion => u !== undefined);
  }

  getChildrenOfUnion(unionId: string): GraphPerson[] {
    const union = this.unions.get(unionId);
    if (!union) return [];

    return union.childrenIds
      .map((id) => this.persons.get(id))
      .filter((p): p is GraphPerson => p !== undefined);
  }

  // ============ Generation Calculation ============

  /**
   * Calculate generation numbers starting from a root person
   * Generation 0 is the root, positive numbers are ancestors, negative are descendants
   */
  calculateGenerations(rootPersonId?: string): Map<string, number> {
    const generations = new Map<string, number>();

    if (this.persons.size === 0) return generations;

    // If no root specified, find a person with no parents (oldest generation)
    const root = rootPersonId || this.findOldestGeneration();
    if (!root) return generations;

    // BFS to assign generations
    const visited = new Set<string>();
    const queue: Array<{ id: string; generation: number }> = [
      { id: root, generation: 0 },
    ];

    while (queue.length > 0) {
      const { id, generation } = queue.shift()!;

      if (visited.has(id)) continue;
      visited.add(id);
      generations.set(id, generation);

      // Parents are one generation up (positive)
      const parents = this.parentMap.get(id) || [];
      for (const parentId of parents) {
        if (!visited.has(parentId)) {
          queue.push({ id: parentId, generation: generation + 1 });
        }
      }

      // Children are one generation down (negative)
      const children = this.childrenMap.get(id) || [];
      for (const childId of children) {
        if (!visited.has(childId)) {
          queue.push({ id: childId, generation: generation - 1 });
        }
      }

      // Spouses are same generation
      const spouses = this.spouseMap.get(id) || [];
      for (const spouseId of spouses) {
        if (!visited.has(spouseId)) {
          queue.push({ id: spouseId, generation });
        }
      }
    }

    // Normalize generations so minimum is 0
    const minGen = Math.min(...Array.from(generations.values()));
    if (minGen < 0) {
      for (const [id, gen] of generations) {
        generations.set(id, gen - minGen);
      }
    }

    return generations;
  }

  /**
   * Find a person with no parents (oldest generation)
   */
  private findOldestGeneration(): string | undefined {
    for (const person of this.persons.values()) {
      const parents = this.parentMap.get(person.id);
      if (!parents || parents.length === 0) {
        return person.id;
      }
    }
    return this.persons.values().next().value?.id;
  }

  // ============ Traversal ============

  /**
   * Breadth-first search from a starting person
   */
  *bfs(startId: string): Generator<GraphPerson> {
    const visited = new Set<string>();
    const queue: string[] = [startId];

    while (queue.length > 0) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;

      const person = this.persons.get(id);
      if (!person) continue;

      visited.add(id);
      yield person;

      // Add all connected persons
      const connected = [
        ...(this.parentMap.get(id) || []),
        ...(this.childrenMap.get(id) || []),
        ...(this.spouseMap.get(id) || []),
      ];

      for (const connectedId of connected) {
        if (!visited.has(connectedId)) {
          queue.push(connectedId);
        }
      }
    }
  }

  /**
   * Depth-first search from a starting person
   */
  *dfs(startId: string): Generator<GraphPerson> {
    const visited = new Set<string>();
    const stack: string[] = [startId];

    while (stack.length > 0) {
      const id = stack.pop()!;
      if (visited.has(id)) continue;

      const person = this.persons.get(id);
      if (!person) continue;

      visited.add(id);
      yield person;

      // Add all connected persons
      const connected = [
        ...(this.parentMap.get(id) || []),
        ...(this.childrenMap.get(id) || []),
        ...(this.spouseMap.get(id) || []),
      ];

      for (const connectedId of connected) {
        if (!visited.has(connectedId)) {
          stack.push(connectedId);
        }
      }
    }
  }

  /**
   * Get ancestors up to a certain depth
   */
  getAncestors(personId: string, maxDepth?: number): GraphPerson[] {
    const ancestors: GraphPerson[] = [];
    const visited = new Set<string>();
    const queue: Array<{ id: string; depth: number }> = [];

    // Start with parents
    const parents = this.parentMap.get(personId) || [];
    for (const parentId of parents) {
      queue.push({ id: parentId, depth: 1 });
    }

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;

      if (visited.has(id)) continue;
      if (maxDepth !== undefined && depth > maxDepth) continue;

      const person = this.persons.get(id);
      if (!person) continue;

      visited.add(id);
      ancestors.push(person);

      // Add parents of this ancestor
      const ancestorParents = this.parentMap.get(id) || [];
      for (const parentId of ancestorParents) {
        if (!visited.has(parentId)) {
          queue.push({ id: parentId, depth: depth + 1 });
        }
      }
    }

    return ancestors;
  }

  /**
   * Get descendants up to a certain depth
   */
  getDescendants(personId: string, maxDepth?: number): GraphPerson[] {
    const descendants: GraphPerson[] = [];
    const visited = new Set<string>();
    const queue: Array<{ id: string; depth: number }> = [];

    // Start with children
    const children = this.childrenMap.get(personId) || [];
    for (const childId of children) {
      queue.push({ id: childId, depth: 1 });
    }

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;

      if (visited.has(id)) continue;
      if (maxDepth !== undefined && depth > maxDepth) continue;

      const person = this.persons.get(id);
      if (!person) continue;

      visited.add(id);
      descendants.push(person);

      // Add children of this descendant
      const descendantChildren = this.childrenMap.get(id) || [];
      for (const childId of descendantChildren) {
        if (!visited.has(childId)) {
          queue.push({ id: childId, depth: depth + 1 });
        }
      }
    }

    return descendants;
  }

  // ============ Helpers ============

  private addToMap(map: Map<string, string[]>, key: string, value: string): void {
    const existing = map.get(key);
    if (existing) {
      if (!existing.includes(value)) {
        existing.push(value);
      }
    } else {
      map.set(key, [value]);
    }
  }
}
