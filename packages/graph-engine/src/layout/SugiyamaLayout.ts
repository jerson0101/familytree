/**
 * Sugiyama Layout Algorithm
 * Implements a hierarchical layout algorithm for P-graphs (genealogical graphs)
 *
 * The algorithm consists of four main phases:
 * 1. Layer assignment (generation assignment)
 * 2. Crossing reduction (minimize edge crossings)
 * 3. Node positioning (calculate X coordinates)
 * 4. Edge routing (create smooth paths)
 */

import type {
  GraphData,
  GraphNode,
  GraphEdge,
  LayoutConfig,
  LayoutResult,
  Bounds,
  PersonNodeData,
  UnionNodeData,
  Point,
} from '../types';
import { Graph } from '../core/Graph';
import { assignGenerations, groupByGeneration } from './GenerationAssigner';
import { DEFAULT_LAYOUT_CONFIG } from '../types';

export class SugiyamaLayout {
  private config: LayoutConfig;
  private graph: Graph;

  constructor(config: Partial<LayoutConfig> = {}) {
    this.config = { ...DEFAULT_LAYOUT_CONFIG, ...config };
    this.graph = new Graph();
  }

  /**
   * Main entry point - compute layout for graph data
   */
  compute(data: GraphData): LayoutResult {
    this.graph.loadData(data);

    if (data.persons.length === 0) {
      return {
        nodes: [],
        edges: [],
        bounds: { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 },
        generations: 0,
      };
    }

    // Phase 1: Assign generations (layers)
    const { personGenerations, unionGenerations, maxGeneration } = assignGenerations(
      this.graph,
      this.config.rootPersonId
    );

    // Phase 2: Group by generation and order within generations
    const persons = this.graph.getAllPersons();
    const generationGroups = groupByGeneration(persons, personGenerations);

    // Phase 3: Order nodes within each generation (minimize crossings)
    const orderedGroups = this.orderNodesWithinGenerations(
      generationGroups,
      personGenerations
    );

    // Phase 4: Calculate positions
    const nodes = this.calculatePositions(
      orderedGroups,
      personGenerations,
      unionGenerations,
      data.unions
    );

    // Phase 5: Create edges
    const edges = this.createEdges(nodes, data.unions);

    // Calculate bounds
    const bounds = this.calculateBounds(nodes);

    return {
      nodes,
      edges,
      bounds,
      generations: maxGeneration + 1,
    };
  }

  /**
   * Phase 2: Order nodes within each generation to minimize crossings
   * Uses a barycenter heuristic
   */
  private orderNodesWithinGenerations(
    groups: Map<number, import('../types').GraphPerson[]>,
    generations: Map<string, number>
  ): Map<number, import('../types').GraphPerson[]> {
    const sortedGens = Array.from(groups.keys()).sort((a, b) => b - a);
    const orderedGroups = new Map<number, import('../types').GraphPerson[]>();

    // Start from oldest generation
    for (let i = 0; i < sortedGens.length; i++) {
      const gen = sortedGens[i];
      const group = groups.get(gen) || [];

      if (i === 0) {
        // First generation: sort by family groups
        orderedGroups.set(gen, this.sortByFamilyGroups(group));
      } else {
        // Use barycenter method based on parent positions
        const prevGen = sortedGens[i - 1];
        const prevGroup = orderedGroups.get(prevGen) || [];
        const prevPositions = new Map<string, number>();
        prevGroup.forEach((p, idx) => prevPositions.set(p.id, idx));

        const sorted = this.barycenterSort(group, prevPositions);
        orderedGroups.set(gen, sorted);
      }
    }

    return orderedGroups;
  }

  /**
   * Sort persons by their family groups (spouses together)
   */
  private sortByFamilyGroups(persons: import('../types').GraphPerson[]): import('../types').GraphPerson[] {
    const sorted: import('../types').GraphPerson[] = [];
    const added = new Set<string>();

    for (const person of persons) {
      if (added.has(person.id)) continue;

      // Add person
      sorted.push(person);
      added.add(person.id);

      // Add spouses
      const spouses = this.graph.getSpouses(person.id);
      for (const spouse of spouses) {
        if (!added.has(spouse.id)) {
          sorted.push(spouse);
          added.add(spouse.id);
        }
      }
    }

    return sorted;
  }

  /**
   * Barycenter sorting - order children based on average parent position
   */
  private barycenterSort(
    persons: import('../types').GraphPerson[],
    parentPositions: Map<string, number>
  ): import('../types').GraphPerson[] {
    const barycenters: Array<{ person: import('../types').GraphPerson; value: number }> = [];

    for (const person of persons) {
      const parents = this.graph.getParents(person.id);
      if (parents.length === 0) {
        barycenters.push({ person, value: Infinity });
        continue;
      }

      // Calculate average position of parents
      let sum = 0;
      let count = 0;
      for (const parent of parents) {
        const pos = parentPositions.get(parent.id);
        if (pos !== undefined) {
          sum += pos;
          count++;
        }
      }

      const barycenter = count > 0 ? sum / count : Infinity;
      barycenters.push({ person, value: barycenter });
    }

    // Sort by barycenter value
    barycenters.sort((a, b) => a.value - b.value);
    return barycenters.map((b) => b.person);
  }

  /**
   * Phase 3 & 4: Calculate node positions
   */
  private calculatePositions(
    orderedGroups: Map<number, import('../types').GraphPerson[]>,
    personGenerations: Map<string, number>,
    unionGenerations: Map<string, number>,
    unions: import('../types').GraphUnion[]
  ): GraphNode[] {
    const nodes: GraphNode[] = [];
    const nodePositions = new Map<string, { x: number; y: number }>();

    const {
      nodeWidth,
      nodeHeight,
      unionNodeSize,
      horizontalSpacing,
      verticalSpacing,
      direction,
    } = this.config;

    // Sort generations
    const sortedGens = Array.from(orderedGroups.keys()).sort((a, b) =>
      direction === 'TB' ? b - a : a - b
    );

    // Calculate positions for each generation
    sortedGens.forEach((gen, genIndex) => {
      const persons = orderedGroups.get(gen) || [];
      const y = genIndex * (nodeHeight + verticalSpacing);

      // Calculate total width of this generation
      const totalWidth =
        persons.length * nodeWidth + (persons.length - 1) * horizontalSpacing;
      let startX = -totalWidth / 2;

      persons.forEach((person, idx) => {
        const x = startX + idx * (nodeWidth + horizontalSpacing) + nodeWidth / 2;

        const node: GraphNode = {
          id: `person-${person.id}`,
          type: 'person',
          x,
          y,
          width: nodeWidth,
          height: nodeHeight,
          generation: gen,
          data: {
            personId: person.id,
            firstName: person.firstName,
            lastName: person.lastName,
            gender: person.gender,
            birthDate: person.birthDate,
            birthDateApproximate: person.birthDateApproximate,
            deathDate: person.deathDate,
            deathDateApproximate: person.deathDateApproximate,
            photoUrl: person.photoUrl,
            isLiving: person.isLiving,
            medicalConditions: person.medicalConditions,
          } as PersonNodeData,
        };

        nodes.push(node);
        nodePositions.set(person.id, { x, y });
      });
    });

    // Create union nodes positioned between partners
    for (const union of unions) {
      const pos1 = nodePositions.get(union.partner1Id);
      const pos2 = nodePositions.get(union.partner2Id);

      if (pos1 && pos2) {
        const x = (pos1.x + pos2.x) / 2;
        const y = pos1.y + nodeHeight / 2 + verticalSpacing / 4;
        const gen = unionGenerations.get(union.id) ?? 0;

        const unionNode: GraphNode = {
          id: `union-${union.id}`,
          type: 'union',
          x,
          y,
          width: unionNodeSize,
          height: unionNodeSize,
          generation: gen,
          data: {
            unionId: union.id,
            partner1Id: union.partner1Id,
            partner2Id: union.partner2Id,
            unionType: union.unionType,
            startDate: union.startDate,
            endDate: union.endDate,
          } as UnionNodeData,
        };

        nodes.push(unionNode);
        nodePositions.set(`union-${union.id}`, { x, y });
      }
    }

    return nodes;
  }

  /**
   * Phase 5: Create edges between nodes
   */
  private createEdges(
    nodes: GraphNode[],
    unions: import('../types').GraphUnion[]
  ): GraphEdge[] {
    const edges: GraphEdge[] = [];
    const nodeMap = new Map<string, GraphNode>();

    for (const node of nodes) {
      nodeMap.set(node.id, node);
    }

    // Create edges for each union
    for (const union of unions) {
      const partner1Node = nodeMap.get(`person-${union.partner1Id}`);
      const partner2Node = nodeMap.get(`person-${union.partner2Id}`);
      const unionNode = nodeMap.get(`union-${union.id}`);

      if (partner1Node && unionNode) {
        // Edge from partner1 to union
        edges.push(this.createEdge(
          `edge-${union.partner1Id}-${union.id}`,
          partner1Node,
          unionNode,
          'spouse'
        ));
      }

      if (partner2Node && unionNode) {
        // Edge from partner2 to union
        edges.push(this.createEdge(
          `edge-${union.partner2Id}-${union.id}`,
          partner2Node,
          unionNode,
          'spouse'
        ));
      }

      // Edges from union to children
      if (unionNode) {
        for (const childId of union.childrenIds) {
          const childNode = nodeMap.get(`person-${childId}`);
          if (childNode) {
            edges.push(this.createEdge(
              `edge-${union.id}-${childId}`,
              unionNode,
              childNode,
              'parent-child'
            ));
          }
        }
      }
    }

    return edges;
  }

  /**
   * Create a single edge with path data
   */
  private createEdge(
    id: string,
    source: GraphNode,
    target: GraphNode,
    type: 'spouse' | 'parent-child'
  ): GraphEdge {
    const sourcePoint: Point = {
      x: source.x,
      y: source.y + (type === 'spouse' ? source.height / 2 : source.height / 2),
    };

    const targetPoint: Point = {
      x: target.x,
      y: target.y - target.height / 2,
    };

    // Create bezier curve path
    const pathData = this.createBezierPath(sourcePoint, targetPoint, type);

    return {
      id,
      sourceId: source.id,
      targetId: target.id,
      type: type,
      pathData,
      controlPoints: [sourcePoint, targetPoint],
    };
  }

  /**
   * Create a smooth bezier curve path between two points
   */
  private createBezierPath(
    start: Point,
    end: Point,
    type: 'spouse' | 'parent-child'
  ): string {
    if (type === 'spouse') {
      // Horizontal line for spouse connections
      const midX = (start.x + end.x) / 2;
      return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
    }

    // Vertical bezier curve for parent-child
    const midY = (start.y + end.y) / 2;
    return `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
  }

  /**
   * Calculate the bounding box of all nodes
   */
  private calculateBounds(nodes: GraphNode[]): Bounds {
    if (nodes.length === 0) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const node of nodes) {
      const left = node.x - node.width / 2;
      const right = node.x + node.width / 2;
      const top = node.y - node.height / 2;
      const bottom = node.y + node.height / 2;

      minX = Math.min(minX, left);
      minY = Math.min(minY, top);
      maxX = Math.max(maxX, right);
      maxY = Math.max(maxY, bottom);
    }

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<LayoutConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): LayoutConfig {
    return { ...this.config };
  }
}

/**
 * Factory function for creating a Sugiyama layout
 */
export function createSugiyamaLayout(config?: Partial<LayoutConfig>): SugiyamaLayout {
  return new SugiyamaLayout(config);
}
