module.exports = [
"[project]/packages/graph-engine/src/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Graph Engine Types
 * Types for P-Graph genealogical visualization
 */ __turbopack_context__.s([
    "DEFAULT_LAYOUT_CONFIG",
    ()=>DEFAULT_LAYOUT_CONFIG,
    "NODE_DIMENSIONS",
    ()=>NODE_DIMENSIONS,
    "ZOOM_LIMITS",
    ()=>ZOOM_LIMITS
]);
const DEFAULT_LAYOUT_CONFIG = {
    nodeWidth: 180,
    nodeHeight: 100,
    unionNodeSize: 24,
    horizontalSpacing: 60,
    verticalSpacing: 120,
    direction: 'TB'
};
const NODE_DIMENSIONS = {
    person: {
        width: 180,
        height: 100
    },
    union: {
        width: 24,
        height: 24
    }
};
const ZOOM_LIMITS = {
    min: 0.1,
    max: 3,
    step: 0.1
};
}),
"[project]/packages/graph-engine/src/core/Graph.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Graph Data Structure
 * Core graph operations for genealogical data
 */ __turbopack_context__.s([
    "Graph",
    ()=>Graph
]);
class Graph {
    persons = new Map();
    unions = new Map();
    relationships = [];
    // Adjacency lists
    parentMap = new Map();
    childrenMap = new Map();
    spouseMap = new Map();
    unionsByPerson = new Map();
    constructor(data){
        if (data) {
            this.loadData(data);
        }
    }
    /**
   * Load graph data from a GraphData object
   */ loadData(data) {
        this.clear();
        // Load persons
        for (const person of data.persons){
            this.persons.set(person.id, person);
        }
        // Load unions
        for (const union of data.unions){
            this.unions.set(union.id, union);
            // Build spouse and union maps
            this.addToMap(this.spouseMap, union.partner1Id, union.partner2Id);
            this.addToMap(this.spouseMap, union.partner2Id, union.partner1Id);
            this.addToMap(this.unionsByPerson, union.partner1Id, union.id);
            this.addToMap(this.unionsByPerson, union.partner2Id, union.id);
            // Build parent-child maps from union children
            for (const childId of union.childrenIds){
                this.addToMap(this.parentMap, childId, union.partner1Id);
                this.addToMap(this.parentMap, childId, union.partner2Id);
                this.addToMap(this.childrenMap, union.partner1Id, childId);
                this.addToMap(this.childrenMap, union.partner2Id, childId);
            }
        }
        // Load explicit relationships
        this.relationships = data.relationships;
        for (const rel of data.relationships){
            if (rel.type === 'parent') {
                this.addToMap(this.parentMap, rel.personId, rel.relatedPersonId);
                this.addToMap(this.childrenMap, rel.relatedPersonId, rel.personId);
            }
        }
    }
    /**
   * Clear all data
   */ clear() {
        this.persons.clear();
        this.unions.clear();
        this.relationships = [];
        this.parentMap.clear();
        this.childrenMap.clear();
        this.spouseMap.clear();
        this.unionsByPerson.clear();
    }
    // ============ Getters ============
    getPerson(id) {
        return this.persons.get(id);
    }
    getUnion(id) {
        return this.unions.get(id);
    }
    getAllPersons() {
        return Array.from(this.persons.values());
    }
    getAllUnions() {
        return Array.from(this.unions.values());
    }
    getPersonCount() {
        return this.persons.size;
    }
    getUnionCount() {
        return this.unions.size;
    }
    // ============ Relationship Queries ============
    getParents(personId) {
        const parentIds = this.parentMap.get(personId) || [];
        return parentIds.map((id)=>this.persons.get(id)).filter((p)=>p !== undefined);
    }
    getChildren(personId) {
        const childIds = this.childrenMap.get(personId) || [];
        return childIds.map((id)=>this.persons.get(id)).filter((p)=>p !== undefined);
    }
    getSpouses(personId) {
        const spouseIds = this.spouseMap.get(personId) || [];
        return spouseIds.map((id)=>this.persons.get(id)).filter((p)=>p !== undefined);
    }
    getSiblings(personId) {
        const parents = this.getParents(personId);
        if (parents.length === 0) return [];
        const siblingIds = new Set();
        for (const parent of parents){
            const children = this.getChildren(parent.id);
            for (const child of children){
                if (child.id !== personId) {
                    siblingIds.add(child.id);
                }
            }
        }
        return Array.from(siblingIds).map((id)=>this.persons.get(id)).filter((p)=>p !== undefined);
    }
    getUnionsForPerson(personId) {
        const unionIds = this.unionsByPerson.get(personId) || [];
        return unionIds.map((id)=>this.unions.get(id)).filter((u)=>u !== undefined);
    }
    getChildrenOfUnion(unionId) {
        const union = this.unions.get(unionId);
        if (!union) return [];
        return union.childrenIds.map((id)=>this.persons.get(id)).filter((p)=>p !== undefined);
    }
    // ============ Generation Calculation ============
    /**
   * Calculate generation numbers starting from a root person
   * Generation 0 is the root, positive numbers are ancestors, negative are descendants
   */ calculateGenerations(rootPersonId) {
        const generations = new Map();
        if (this.persons.size === 0) return generations;
        // If no root specified, find a person with no parents (oldest generation)
        const root = rootPersonId || this.findOldestGeneration();
        if (!root) return generations;
        // BFS to assign generations
        const visited = new Set();
        const queue = [
            {
                id: root,
                generation: 0
            }
        ];
        while(queue.length > 0){
            const { id, generation } = queue.shift();
            if (visited.has(id)) continue;
            visited.add(id);
            generations.set(id, generation);
            // Parents are one generation up (positive)
            const parents = this.parentMap.get(id) || [];
            for (const parentId of parents){
                if (!visited.has(parentId)) {
                    queue.push({
                        id: parentId,
                        generation: generation + 1
                    });
                }
            }
            // Children are one generation down (negative)
            const children = this.childrenMap.get(id) || [];
            for (const childId of children){
                if (!visited.has(childId)) {
                    queue.push({
                        id: childId,
                        generation: generation - 1
                    });
                }
            }
            // Spouses are same generation
            const spouses = this.spouseMap.get(id) || [];
            for (const spouseId of spouses){
                if (!visited.has(spouseId)) {
                    queue.push({
                        id: spouseId,
                        generation
                    });
                }
            }
        }
        // Normalize generations so minimum is 0
        const minGen = Math.min(...Array.from(generations.values()));
        if (minGen < 0) {
            for (const [id, gen] of generations){
                generations.set(id, gen - minGen);
            }
        }
        return generations;
    }
    /**
   * Find a person with no parents (oldest generation)
   */ findOldestGeneration() {
        for (const person of this.persons.values()){
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
   */ *bfs(startId) {
        const visited = new Set();
        const queue = [
            startId
        ];
        while(queue.length > 0){
            const id = queue.shift();
            if (visited.has(id)) continue;
            const person = this.persons.get(id);
            if (!person) continue;
            visited.add(id);
            yield person;
            // Add all connected persons
            const connected = [
                ...this.parentMap.get(id) || [],
                ...this.childrenMap.get(id) || [],
                ...this.spouseMap.get(id) || []
            ];
            for (const connectedId of connected){
                if (!visited.has(connectedId)) {
                    queue.push(connectedId);
                }
            }
        }
    }
    /**
   * Depth-first search from a starting person
   */ *dfs(startId) {
        const visited = new Set();
        const stack = [
            startId
        ];
        while(stack.length > 0){
            const id = stack.pop();
            if (visited.has(id)) continue;
            const person = this.persons.get(id);
            if (!person) continue;
            visited.add(id);
            yield person;
            // Add all connected persons
            const connected = [
                ...this.parentMap.get(id) || [],
                ...this.childrenMap.get(id) || [],
                ...this.spouseMap.get(id) || []
            ];
            for (const connectedId of connected){
                if (!visited.has(connectedId)) {
                    stack.push(connectedId);
                }
            }
        }
    }
    /**
   * Get ancestors up to a certain depth
   */ getAncestors(personId, maxDepth) {
        const ancestors = [];
        const visited = new Set();
        const queue = [];
        // Start with parents
        const parents = this.parentMap.get(personId) || [];
        for (const parentId of parents){
            queue.push({
                id: parentId,
                depth: 1
            });
        }
        while(queue.length > 0){
            const { id, depth } = queue.shift();
            if (visited.has(id)) continue;
            if (maxDepth !== undefined && depth > maxDepth) continue;
            const person = this.persons.get(id);
            if (!person) continue;
            visited.add(id);
            ancestors.push(person);
            // Add parents of this ancestor
            const ancestorParents = this.parentMap.get(id) || [];
            for (const parentId of ancestorParents){
                if (!visited.has(parentId)) {
                    queue.push({
                        id: parentId,
                        depth: depth + 1
                    });
                }
            }
        }
        return ancestors;
    }
    /**
   * Get descendants up to a certain depth
   */ getDescendants(personId, maxDepth) {
        const descendants = [];
        const visited = new Set();
        const queue = [];
        // Start with children
        const children = this.childrenMap.get(personId) || [];
        for (const childId of children){
            queue.push({
                id: childId,
                depth: 1
            });
        }
        while(queue.length > 0){
            const { id, depth } = queue.shift();
            if (visited.has(id)) continue;
            if (maxDepth !== undefined && depth > maxDepth) continue;
            const person = this.persons.get(id);
            if (!person) continue;
            visited.add(id);
            descendants.push(person);
            // Add children of this descendant
            const descendantChildren = this.childrenMap.get(id) || [];
            for (const childId of descendantChildren){
                if (!visited.has(childId)) {
                    queue.push({
                        id: childId,
                        depth: depth + 1
                    });
                }
            }
        }
        return descendants;
    }
    // ============ Helpers ============
    addToMap(map, key, value) {
        const existing = map.get(key);
        if (existing) {
            if (!existing.includes(value)) {
                existing.push(value);
            }
        } else {
            map.set(key, [
                value
            ]);
        }
    }
}
}),
"[project]/packages/graph-engine/src/layout/GenerationAssigner.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Generation Assigner
 * Assigns generation levels to nodes in the family tree
 */ __turbopack_context__.s([
    "assignGenerations",
    ()=>assignGenerations,
    "getSortedGenerations",
    ()=>getSortedGenerations,
    "groupByGeneration",
    ()=>groupByGeneration
]);
function assignGenerations(graph, rootPersonId) {
    const personGenerations = new Map();
    const unionGenerations = new Map();
    const persons = graph.getAllPersons();
    if (persons.length === 0) {
        return {
            personGenerations,
            unionGenerations,
            maxGeneration: 0,
            minGeneration: 0
        };
    }
    // Calculate person generations using the graph's method
    const rawGenerations = graph.calculateGenerations(rootPersonId);
    // Copy to our result map
    for (const [id, gen] of rawGenerations){
        personGenerations.set(id, gen);
    }
    // Calculate union generations (between the two partners' generations)
    const unions = graph.getAllUnions();
    for (const union of unions){
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
        minGeneration
    };
}
function groupByGeneration(persons, generations) {
    const groups = new Map();
    for (const person of persons){
        const gen = generations.get(person.id) ?? 0;
        const group = groups.get(gen);
        if (group) {
            group.push(person);
        } else {
            groups.set(gen, [
                person
            ]);
        }
    }
    return groups;
}
function getSortedGenerations(generations) {
    const uniqueGens = new Set(generations.values());
    return Array.from(uniqueGens).sort((a, b)=>b - a); // Descending (oldest first)
}
}),
"[project]/packages/graph-engine/src/layout/SugiyamaLayout.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Sugiyama Layout Algorithm
 * Implements a hierarchical layout algorithm for P-graphs (genealogical graphs)
 *
 * The algorithm consists of four main phases:
 * 1. Layer assignment (generation assignment)
 * 2. Crossing reduction (minimize edge crossings)
 * 3. Node positioning (calculate X coordinates)
 * 4. Edge routing (create smooth paths)
 */ __turbopack_context__.s([
    "SugiyamaLayout",
    ()=>SugiyamaLayout,
    "createSugiyamaLayout",
    ()=>createSugiyamaLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$core$2f$Graph$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/core/Graph.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$layout$2f$GenerationAssigner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/layout/GenerationAssigner.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/types.ts [app-ssr] (ecmascript)");
;
;
;
class SugiyamaLayout {
    config;
    graph;
    constructor(config = {}){
        this.config = {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_LAYOUT_CONFIG"],
            ...config
        };
        this.graph = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$core$2f$Graph$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Graph"]();
    }
    /**
   * Main entry point - compute layout for graph data
   */ compute(data) {
        this.graph.loadData(data);
        if (data.persons.length === 0) {
            return {
                nodes: [],
                edges: [],
                bounds: {
                    minX: 0,
                    minY: 0,
                    maxX: 0,
                    maxY: 0,
                    width: 0,
                    height: 0
                },
                generations: 0
            };
        }
        // Phase 1: Assign generations (layers)
        const { personGenerations, unionGenerations, maxGeneration } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$layout$2f$GenerationAssigner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assignGenerations"])(this.graph, this.config.rootPersonId);
        // Phase 2: Group by generation and order within generations
        const persons = this.graph.getAllPersons();
        const generationGroups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$layout$2f$GenerationAssigner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["groupByGeneration"])(persons, personGenerations);
        // Phase 3: Order nodes within each generation (minimize crossings)
        const orderedGroups = this.orderNodesWithinGenerations(generationGroups, personGenerations);
        // Phase 4: Calculate positions
        const nodes = this.calculatePositions(orderedGroups, personGenerations, unionGenerations, data.unions);
        // Phase 5: Create edges
        const edges = this.createEdges(nodes, data.unions);
        // Calculate bounds
        const bounds = this.calculateBounds(nodes);
        return {
            nodes,
            edges,
            bounds,
            generations: maxGeneration + 1
        };
    }
    /**
   * Phase 2: Order nodes within each generation to minimize crossings
   * Uses a barycenter heuristic
   */ orderNodesWithinGenerations(groups, generations) {
        const sortedGens = Array.from(groups.keys()).sort((a, b)=>b - a);
        const orderedGroups = new Map();
        // Start from oldest generation
        for(let i = 0; i < sortedGens.length; i++){
            const gen = sortedGens[i];
            const group = groups.get(gen) || [];
            if (i === 0) {
                // First generation: sort by family groups
                orderedGroups.set(gen, this.sortByFamilyGroups(group));
            } else {
                // Use barycenter method based on parent positions
                const prevGen = sortedGens[i - 1];
                const prevGroup = orderedGroups.get(prevGen) || [];
                const prevPositions = new Map();
                prevGroup.forEach((p, idx)=>prevPositions.set(p.id, idx));
                const sorted = this.barycenterSort(group, prevPositions);
                orderedGroups.set(gen, sorted);
            }
        }
        return orderedGroups;
    }
    /**
   * Sort persons by their family groups (spouses together)
   */ sortByFamilyGroups(persons) {
        const sorted = [];
        const added = new Set();
        for (const person of persons){
            if (added.has(person.id)) continue;
            // Add person
            sorted.push(person);
            added.add(person.id);
            // Add spouses
            const spouses = this.graph.getSpouses(person.id);
            for (const spouse of spouses){
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
   */ barycenterSort(persons, parentPositions) {
        const barycenters = [];
        for (const person of persons){
            const parents = this.graph.getParents(person.id);
            if (parents.length === 0) {
                barycenters.push({
                    person,
                    value: Infinity
                });
                continue;
            }
            // Calculate average position of parents
            let sum = 0;
            let count = 0;
            for (const parent of parents){
                const pos = parentPositions.get(parent.id);
                if (pos !== undefined) {
                    sum += pos;
                    count++;
                }
            }
            const barycenter = count > 0 ? sum / count : Infinity;
            barycenters.push({
                person,
                value: barycenter
            });
        }
        // Sort by barycenter value
        barycenters.sort((a, b)=>a.value - b.value);
        return barycenters.map((b)=>b.person);
    }
    /**
   * Phase 3 & 4: Calculate node positions
   */ calculatePositions(orderedGroups, personGenerations, unionGenerations, unions) {
        const nodes = [];
        const nodePositions = new Map();
        const { nodeWidth, nodeHeight, unionNodeSize, horizontalSpacing, verticalSpacing, direction } = this.config;
        // Sort generations
        const sortedGens = Array.from(orderedGroups.keys()).sort((a, b)=>direction === 'TB' ? b - a : a - b);
        // Calculate positions for each generation
        sortedGens.forEach((gen, genIndex)=>{
            const persons = orderedGroups.get(gen) || [];
            const y = genIndex * (nodeHeight + verticalSpacing);
            // Calculate total width of this generation
            const totalWidth = persons.length * nodeWidth + (persons.length - 1) * horizontalSpacing;
            let startX = -totalWidth / 2;
            persons.forEach((person, idx)=>{
                const x = startX + idx * (nodeWidth + horizontalSpacing) + nodeWidth / 2;
                const node = {
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
                        medicalConditions: person.medicalConditions
                    }
                };
                nodes.push(node);
                nodePositions.set(person.id, {
                    x,
                    y
                });
            });
        });
        // Create union nodes positioned between partners
        for (const union of unions){
            const pos1 = nodePositions.get(union.partner1Id);
            const pos2 = nodePositions.get(union.partner2Id);
            if (pos1 && pos2) {
                const x = (pos1.x + pos2.x) / 2;
                const y = pos1.y + nodeHeight / 2 + verticalSpacing / 4;
                const gen = unionGenerations.get(union.id) ?? 0;
                const unionNode = {
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
                        endDate: union.endDate
                    }
                };
                nodes.push(unionNode);
                nodePositions.set(`union-${union.id}`, {
                    x,
                    y
                });
            }
        }
        return nodes;
    }
    /**
   * Phase 5: Create edges between nodes
   */ createEdges(nodes, unions) {
        const edges = [];
        const nodeMap = new Map();
        for (const node of nodes){
            nodeMap.set(node.id, node);
        }
        // Create edges for each union
        for (const union of unions){
            const partner1Node = nodeMap.get(`person-${union.partner1Id}`);
            const partner2Node = nodeMap.get(`person-${union.partner2Id}`);
            const unionNode = nodeMap.get(`union-${union.id}`);
            if (partner1Node && unionNode) {
                // Edge from partner1 to union
                edges.push(this.createEdge(`edge-${union.partner1Id}-${union.id}`, partner1Node, unionNode, 'spouse'));
            }
            if (partner2Node && unionNode) {
                // Edge from partner2 to union
                edges.push(this.createEdge(`edge-${union.partner2Id}-${union.id}`, partner2Node, unionNode, 'spouse'));
            }
            // Edges from union to children
            if (unionNode) {
                for (const childId of union.childrenIds){
                    const childNode = nodeMap.get(`person-${childId}`);
                    if (childNode) {
                        edges.push(this.createEdge(`edge-${union.id}-${childId}`, unionNode, childNode, 'parent-child'));
                    }
                }
            }
        }
        return edges;
    }
    /**
   * Create a single edge with path data
   */ createEdge(id, source, target, type) {
        const sourcePoint = {
            x: source.x,
            y: source.y + (type === 'spouse' ? source.height / 2 : source.height / 2)
        };
        const targetPoint = {
            x: target.x,
            y: target.y - target.height / 2
        };
        // Create bezier curve path
        const pathData = this.createBezierPath(sourcePoint, targetPoint, type);
        return {
            id,
            sourceId: source.id,
            targetId: target.id,
            type: type,
            pathData,
            controlPoints: [
                sourcePoint,
                targetPoint
            ]
        };
    }
    /**
   * Create a smooth bezier curve path between two points
   */ createBezierPath(start, end, type) {
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
   */ calculateBounds(nodes) {
        if (nodes.length === 0) {
            return {
                minX: 0,
                minY: 0,
                maxX: 0,
                maxY: 0,
                width: 0,
                height: 0
            };
        }
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (const node of nodes){
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
            height: maxY - minY
        };
    }
    /**
   * Update configuration
   */ setConfig(config) {
        this.config = {
            ...this.config,
            ...config
        };
    }
    /**
   * Get current configuration
   */ getConfig() {
        return {
            ...this.config
        };
    }
}
function createSugiyamaLayout(config) {
    return new SugiyamaLayout(config);
}
}),
"[project]/packages/graph-engine/src/renderer/PersonNode.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PersonNode",
    ()=>PersonNode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
'use client';
;
function PersonNode({ node, isSelected = false, isHighlighted = false, isHovered = false, options, onClick, onMouseEnter, onMouseLeave }) {
    const data = node.data;
    const { width, height, x, y } = node;
    const isDeceased = !data.isLiving || !!data.deathDate;
    const fullName = `${data.firstName} ${data.lastName}`;
    const initials = `${data.firstName[0] || ''}${data.lastName[0] || ''}`.toUpperCase();
    // Calculate colors based on gender
    const genderColors = {
        male: {
            bg: '#dbeafe',
            border: '#3b82f6',
            text: '#1e40af'
        },
        female: {
            bg: '#fce7f3',
            border: '#ec4899',
            text: '#9d174d'
        },
        other: {
            bg: '#e5e7eb',
            border: '#6b7280',
            text: '#374151'
        },
        unknown: {
            bg: '#e5e7eb',
            border: '#6b7280',
            text: '#374151'
        }
    };
    const colors = genderColors[data.gender];
    // Border and shadow styles based on state
    const strokeWidth = isSelected ? 3 : isHighlighted ? 2.5 : isHovered ? 2 : 1.5;
    const strokeColor = isSelected ? '#0ea5e9' : isHighlighted ? '#f59e0b' : colors.border;
    // Format dates
    const formatYear = (date)=>{
        if (!date) return '';
        return new Date(date).getFullYear().toString();
    };
    const birthYear = formatYear(data.birthDate);
    const deathYear = formatYear(data.deathDate);
    const dateDisplay = isDeceased ? `${birthYear}${birthYear && deathYear ? ' - ' : ''}${deathYear}` : birthYear;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        transform: `translate(${x - width / 2}, ${y - height / 2})`,
        onClick: onClick,
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave,
        style: {
            cursor: 'pointer'
        },
        className: options.animationsEnabled ? 'transition-transform duration-200' : '',
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: 0,
                y: 0,
                width: width,
                height: height,
                rx: 12,
                ry: 12,
                fill: isDeceased ? '#f5f5f5' : 'white',
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                filter: "url(#node-shadow)",
                opacity: isDeceased && !options.showDeceased ? 0.5 : 1
            }, void 0, false, {
                fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            isDeceased && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: 0,
                y1: 0,
                x2: width,
                y2: height,
                stroke: "#9ca3af",
                strokeWidth: 1.5,
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                lineNumber: 90,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                transform: `translate(${16}, ${height / 2 - 24})`,
                children: [
                    options.showPhotos && data.photoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("clipPath", {
                        id: `avatar-clip-${node.id}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: 24,
                            cy: 24,
                            r: 24
                        }, void 0, false, {
                            fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                            lineNumber: 105,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                        lineNumber: 104,
                        columnNumber: 11
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: 24,
                        cy: 24,
                        r: 24,
                        fill: colors.bg,
                        stroke: colors.border,
                        strokeWidth: 2
                    }, void 0, false, {
                        fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this),
                    options.showPhotos && data.photoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("image", {
                        href: data.photoUrl,
                        x: 0,
                        y: 0,
                        width: 48,
                        height: 48,
                        clipPath: `url(#avatar-clip-${node.id})`,
                        preserveAspectRatio: "xMidYMid slice"
                    }, void 0, false, {
                        fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: 24,
                        y: 24,
                        textAnchor: "middle",
                        dominantBaseline: "central",
                        fill: colors.text,
                        fontSize: 16,
                        fontWeight: 600,
                        children: initials
                    }, void 0, false, {
                        fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                        lineNumber: 129,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                transform: `translate(${72}, ${20})`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: 0,
                        y: 0,
                        fill: isDeceased ? '#6b7280' : '#171717',
                        fontSize: 14,
                        fontWeight: 600,
                        dominantBaseline: "hanging",
                        children: truncateText(data.firstName, 12)
                    }, void 0, false, {
                        fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: 0,
                        y: 18,
                        fill: isDeceased ? '#9ca3af' : '#525252',
                        fontSize: 13,
                        dominantBaseline: "hanging",
                        children: truncateText(data.lastName, 14)
                    }, void 0, false, {
                        fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this),
                    options.showDates && dateDisplay && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: 0,
                        y: 40,
                        fill: "#a3a3a3",
                        fontSize: 11,
                        dominantBaseline: "hanging",
                        children: dateDisplay
                    }, void 0, false, {
                        fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                        lineNumber: 166,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GenderIndicator, {
                gender: data.gender,
                x: width - 20,
                y: 12
            }, void 0, false, {
                fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, this),
            options.showMedicalIcons && data.medicalConditions && data.medicalConditions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                transform: `translate(${width - 36}, ${height - 24})`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MedicalIndicator, {
                    conditions: data.medicalConditions
                }, void 0, false, {
                    fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                    lineNumber: 188,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                lineNumber: 187,
                columnNumber: 9
            }, this),
            (isSelected || isHighlighted) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: -4,
                y: -4,
                width: width + 8,
                height: height + 8,
                rx: 16,
                ry: 16,
                fill: "none",
                stroke: isSelected ? '#0ea5e9' : '#f59e0b',
                strokeWidth: 2,
                strokeDasharray: isHighlighted && !isSelected ? '4 2' : 'none',
                opacity: 0.5
            }, void 0, false, {
                fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                lineNumber: 194,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
function GenderIndicator({ gender, x, y }) {
    const size = 12;
    if (gender === 'male') {
        // Square for male
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
            x: x,
            y: y,
            width: size,
            height: size,
            fill: "none",
            stroke: "#3b82f6",
            strokeWidth: 2
        }, void 0, false, {
            fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
            lineNumber: 218,
            columnNumber: 7
        }, this);
    }
    if (gender === 'female') {
        // Circle for female
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
            cx: x + size / 2,
            cy: y + size / 2,
            r: size / 2,
            fill: "none",
            stroke: "#ec4899",
            strokeWidth: 2
        }, void 0, false, {
            fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
            lineNumber: 233,
            columnNumber: 7
        }, this);
    }
    // Diamond for other
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
        points: `${x + size / 2},${y} ${x + size},${y + size / 2} ${x + size / 2},${y + size} ${x},${y + size / 2}`,
        fill: "none",
        stroke: "#6b7280",
        strokeWidth: 2
    }, void 0, false, {
        fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
        lineNumber: 246,
        columnNumber: 5
    }, this);
}
function MedicalIndicator({ conditions }) {
    const count = conditions.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: 12,
                cy: 12,
                r: 10,
                fill: "#fef3c7",
                stroke: "#f59e0b",
                strokeWidth: 1.5
            }, void 0, false, {
                fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                x: 12,
                y: 12,
                textAnchor: "middle",
                dominantBaseline: "central",
                fill: "#92400e",
                fontSize: 10,
                fontWeight: 600,
                children: count
            }, void 0, false, {
                fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
                lineNumber: 272,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/packages/graph-engine/src/renderer/PersonNode.tsx",
        lineNumber: 263,
        columnNumber: 5
    }, this);
}
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 1) + '...';
}
}),
"[project]/packages/graph-engine/src/renderer/UnionNode.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UnionNode",
    ()=>UnionNode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
'use client';
;
function UnionNode({ node, isSelected = false, onClick }) {
    const data = node.data;
    const { width, height, x, y } = node;
    // Color based on union type
    const getUnionStyle = ()=>{
        switch(data.unionType){
            case 'marriage':
                return {
                    fill: '#22c55e',
                    stroke: '#16a34a'
                };
            case 'partnership':
                return {
                    fill: '#3b82f6',
                    stroke: '#2563eb'
                };
            case 'divorced':
                return {
                    fill: '#ef4444',
                    stroke: '#dc2626'
                };
            case 'separated':
                return {
                    fill: '#f59e0b',
                    stroke: '#d97706'
                };
            default:
                return {
                    fill: '#6b7280',
                    stroke: '#4b5563'
                };
        }
    };
    const style = getUnionStyle();
    const radius = width / 2;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        transform: `translate(${x}, ${y})`,
        onClick: onClick,
        style: {
            cursor: 'pointer'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: 0,
                cy: 0,
                r: radius,
                fill: style.fill,
                stroke: isSelected ? '#0ea5e9' : style.stroke,
                strokeWidth: isSelected ? 3 : 2
            }, void 0, false, {
                fileName: "[project]/packages/graph-engine/src/renderer/UnionNode.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(UnionTypeIndicator, {
                type: data.unionType,
                radius: radius
            }, void 0, false, {
                fileName: "[project]/packages/graph-engine/src/renderer/UnionNode.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this),
            isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: 0,
                cy: 0,
                r: radius + 4,
                fill: "none",
                stroke: "#0ea5e9",
                strokeWidth: 2,
                opacity: 0.5
            }, void 0, false, {
                fileName: "[project]/packages/graph-engine/src/renderer/UnionNode.tsx",
                lineNumber: 56,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/packages/graph-engine/src/renderer/UnionNode.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
function UnionTypeIndicator({ type, radius }) {
    const iconSize = radius * 0.8;
    switch(type){
        case 'marriage':
            // Heart or rings icon
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                transform: `translate(${-iconSize / 2}, ${-iconSize / 2})`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: `M${iconSize / 2} ${iconSize * 0.3}
                C${iconSize * 0.2} 0, 0 ${iconSize * 0.3}, ${iconSize / 2} ${iconSize * 0.8}
                C${iconSize} ${iconSize * 0.3}, ${iconSize * 0.8} 0, ${iconSize / 2} ${iconSize * 0.3}`,
                    fill: "white",
                    stroke: "none"
                }, void 0, false, {
                    fileName: "[project]/packages/graph-engine/src/renderer/UnionNode.tsx",
                    lineNumber: 84,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/packages/graph-engine/src/renderer/UnionNode.tsx",
                lineNumber: 83,
                columnNumber: 9
            }, this);
        case 'divorced':
            // X mark
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: -iconSize / 2,
                        y1: -iconSize / 2,
                        x2: iconSize / 2,
                        y2: iconSize / 2,
                        stroke: "white",
                        strokeWidth: 2,
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/packages/graph-engine/src/renderer/UnionNode.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: iconSize / 2,
                        y1: -iconSize / 2,
                        x2: -iconSize / 2,
                        y2: iconSize / 2,
                        stroke: "white",
                        strokeWidth: 2,
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/packages/graph-engine/src/renderer/UnionNode.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/packages/graph-engine/src/renderer/UnionNode.tsx",
                lineNumber: 97,
                columnNumber: 9
            }, this);
        case 'separated':
            // Single line
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: -iconSize / 2,
                y1: 0,
                x2: iconSize / 2,
                y2: 0,
                stroke: "white",
                strokeWidth: 2,
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/packages/graph-engine/src/renderer/UnionNode.tsx",
                lineNumber: 122,
                columnNumber: 9
            }, this);
        case 'partnership':
            // Two dots
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: -iconSize / 4,
                        cy: 0,
                        r: iconSize / 5,
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/packages/graph-engine/src/renderer/UnionNode.tsx",
                        lineNumber: 137,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: iconSize / 4,
                        cy: 0,
                        r: iconSize / 5,
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/packages/graph-engine/src/renderer/UnionNode.tsx",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/packages/graph-engine/src/renderer/UnionNode.tsx",
                lineNumber: 136,
                columnNumber: 9
            }, this);
        default:
            return null;
    }
}
}),
"[project]/packages/graph-engine/src/renderer/EdgeRenderer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EdgeGroup",
    ()=>EdgeGroup,
    "EdgeRenderer",
    ()=>EdgeRenderer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
'use client';
;
function EdgeRenderer({ edge, isHighlighted = false, color }) {
    const strokeColor = color || (isHighlighted ? '#0ea5e9' : '#d4d4d4');
    const strokeWidth = isHighlighted ? 2.5 : 2;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: edge.pathData,
            fill: "none",
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: "transition-all duration-200"
        }, void 0, false, {
            fileName: "[project]/packages/graph-engine/src/renderer/EdgeRenderer.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/packages/graph-engine/src/renderer/EdgeRenderer.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
function EdgeGroup({ edges, isHighlighted = false, color }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        children: edges.map((edge)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EdgeRenderer, {
                edge: edge,
                isHighlighted: isHighlighted,
                color: color
            }, edge.id, false, {
                fileName: "[project]/packages/graph-engine/src/renderer/EdgeRenderer.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/packages/graph-engine/src/renderer/EdgeRenderer.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
}),
"[project]/packages/graph-engine/src/renderer/GraphCanvas.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GraphCanvas",
    ()=>GraphCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$renderer$2f$PersonNode$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/renderer/PersonNode.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$renderer$2f$UnionNode$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/renderer/UnionNode.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$renderer$2f$EdgeRenderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/renderer/EdgeRenderer.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const DEFAULT_OPTIONS = {
    showPhotos: true,
    showDates: true,
    showMedicalIcons: false,
    showDeceased: true,
    animationsEnabled: true
};
function GraphCanvas({ nodes, edges, bounds, viewport, onViewportChange, onNodeClick, onNodeHover, options = {}, className = '', children }) {
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const svgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isPanning, setIsPanning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastPanPoint, setLastPanPoint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hoveredNodeId, setHoveredNodeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const renderOptions = {
        ...DEFAULT_OPTIONS,
        ...options
    };
    // Handle container resize
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const container = containerRef.current;
        if (!container) return;
        const resizeObserver = new ResizeObserver((entries)=>{
            for (const entry of entries){
                const { width, height } = entry.contentRect;
                onViewportChange({
                    ...viewport,
                    width,
                    height
                });
            }
        });
        resizeObserver.observe(container);
        return ()=>resizeObserver.disconnect();
    }, [
        viewport,
        onViewportChange
    ]);
    // Pan handlers
    const handleMouseDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (e.button === 0) {
            setIsPanning(true);
            setLastPanPoint({
                x: e.clientX,
                y: e.clientY
            });
        }
    }, []);
    const handleMouseMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!isPanning || !lastPanPoint) return;
        const dx = e.clientX - lastPanPoint.x;
        const dy = e.clientY - lastPanPoint.y;
        onViewportChange({
            ...viewport,
            x: viewport.x - dx / viewport.scale,
            y: viewport.y - dy / viewport.scale
        });
        setLastPanPoint({
            x: e.clientX,
            y: e.clientY
        });
    }, [
        isPanning,
        lastPanPoint,
        viewport,
        onViewportChange
    ]);
    const handleMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsPanning(false);
        setLastPanPoint(null);
    }, []);
    // Zoom handler
    const handleWheel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.preventDefault();
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        // Calculate zoom
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(Math.max(viewport.scale * delta, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ZOOM_LIMITS"].min), __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ZOOM_LIMITS"].max);
        // Zoom towards mouse position
        const scaleRatio = newScale / viewport.scale;
        const newX = viewport.x + mouseX / viewport.scale * (1 - 1 / scaleRatio);
        const newY = viewport.y + mouseY / viewport.scale * (1 - 1 / scaleRatio);
        onViewportChange({
            ...viewport,
            x: newX,
            y: newY,
            scale: newScale
        });
    }, [
        viewport,
        onViewportChange
    ]);
    // Touch handlers for mobile
    const handleTouchStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (e.touches.length === 1) {
            setIsPanning(true);
            setLastPanPoint({
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            });
        }
    }, []);
    const handleTouchMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!isPanning || !lastPanPoint || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - lastPanPoint.x;
        const dy = e.touches[0].clientY - lastPanPoint.y;
        onViewportChange({
            ...viewport,
            x: viewport.x - dx / viewport.scale,
            y: viewport.y - dy / viewport.scale
        });
        setLastPanPoint({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        });
    }, [
        isPanning,
        lastPanPoint,
        viewport,
        onViewportChange
    ]);
    const handleTouchEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsPanning(false);
        setLastPanPoint(null);
    }, []);
    // Node interaction handlers
    const handleNodeClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((node, e)=>{
        e.stopPropagation();
        onNodeClick?.({
            nodeId: node.id,
            type: 'click',
            position: {
                x: e.clientX,
                y: e.clientY
            },
            originalEvent: e.nativeEvent
        });
    }, [
        onNodeClick
    ]);
    const handleNodeHover = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((node, e)=>{
        setHoveredNodeId(node?.id ?? null);
        if (node && e) {
            onNodeHover?.({
                nodeId: node.id,
                type: 'hover',
                position: {
                    x: e.clientX,
                    y: e.clientY
                },
                originalEvent: e.nativeEvent
            });
        } else {
            onNodeHover?.(null);
        }
    }, [
        onNodeHover
    ]);
    // Calculate transform
    const transform = `translate(${viewport.width / 2 - viewport.x * viewport.scale}, ${viewport.height / 2 - viewport.y * viewport.scale}) scale(${viewport.scale})`;
    // Viewport culling - only render visible nodes
    const visibleNodes = nodes.filter((node)=>{
        const screenX = (node.x - viewport.x) * viewport.scale + viewport.width / 2;
        const screenY = (node.y - viewport.y) * viewport.scale + viewport.height / 2;
        const margin = Math.max(node.width, node.height) * viewport.scale;
        return screenX > -margin && screenX < viewport.width + margin && screenY > -margin && screenY < viewport.height + margin;
    });
    // Filter edges to only those connected to visible nodes
    const visibleNodeIds = new Set(visibleNodes.map((n)=>n.id));
    const visibleEdges = edges.filter((edge)=>visibleNodeIds.has(edge.sourceId) || visibleNodeIds.has(edge.targetId));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: `relative w-full h-full overflow-hidden bg-neutral-50 ${className}`,
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseUp,
        onWheel: handleWheel,
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        style: {
            cursor: isPanning ? 'grabbing' : 'grab'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                ref: svgRef,
                width: viewport.width,
                height: viewport.height,
                className: "absolute inset-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                                id: "node-shadow",
                                x: "-20%",
                                y: "-20%",
                                width: "140%",
                                height: "140%",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feDropShadow", {
                                    dx: "0",
                                    dy: "2",
                                    stdDeviation: "4",
                                    floodColor: "#000",
                                    floodOpacity: "0.1"
                                }, void 0, false, {
                                    fileName: "[project]/packages/graph-engine/src/renderer/GraphCanvas.tsx",
                                    lineNumber: 265,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/packages/graph-engine/src/renderer/GraphCanvas.tsx",
                                lineNumber: 264,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                id: "edge-gradient",
                                x1: "0%",
                                y1: "0%",
                                x2: "0%",
                                y2: "100%",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "0%",
                                        stopColor: "#a3a3a3"
                                    }, void 0, false, {
                                        fileName: "[project]/packages/graph-engine/src/renderer/GraphCanvas.tsx",
                                        lineNumber: 276,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                        offset: "100%",
                                        stopColor: "#d4d4d4"
                                    }, void 0, false, {
                                        fileName: "[project]/packages/graph-engine/src/renderer/GraphCanvas.tsx",
                                        lineNumber: 277,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/packages/graph-engine/src/renderer/GraphCanvas.tsx",
                                lineNumber: 275,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/packages/graph-engine/src/renderer/GraphCanvas.tsx",
                        lineNumber: 262,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        transform: transform,
                        children: [
                            visibleEdges.map((edge)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$renderer$2f$EdgeRenderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EdgeRenderer"], {
                                    edge: edge
                                }, edge.id, false, {
                                    fileName: "[project]/packages/graph-engine/src/renderer/GraphCanvas.tsx",
                                    lineNumber: 284,
                                    columnNumber: 13
                                }, this)),
                            visibleNodes.map((node)=>{
                                const isSelected = options.selectedNodeId === node.id;
                                const isHighlighted = options.highlightedNodeId === node.id;
                                const isHovered = hoveredNodeId === node.id;
                                if (node.type === 'person') {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$renderer$2f$PersonNode$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PersonNode"], {
                                        node: node,
                                        isSelected: isSelected,
                                        isHighlighted: isHighlighted,
                                        isHovered: isHovered,
                                        options: renderOptions,
                                        onClick: (e)=>handleNodeClick(node, e),
                                        onMouseEnter: (e)=>handleNodeHover(node, e),
                                        onMouseLeave: ()=>handleNodeHover(null)
                                    }, node.id, false, {
                                        fileName: "[project]/packages/graph-engine/src/renderer/GraphCanvas.tsx",
                                        lineNumber: 295,
                                        columnNumber: 17
                                    }, this);
                                }
                                if (node.type === 'union') {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$renderer$2f$UnionNode$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UnionNode"], {
                                        node: node,
                                        isSelected: isSelected,
                                        onClick: (e)=>handleNodeClick(node, e)
                                    }, node.id, false, {
                                        fileName: "[project]/packages/graph-engine/src/renderer/GraphCanvas.tsx",
                                        lineNumber: 311,
                                        columnNumber: 17
                                    }, this);
                                }
                                return null;
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/packages/graph-engine/src/renderer/GraphCanvas.tsx",
                        lineNumber: 281,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/packages/graph-engine/src/renderer/GraphCanvas.tsx",
                lineNumber: 256,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/packages/graph-engine/src/renderer/GraphCanvas.tsx",
        lineNumber: 243,
        columnNumber: 5
    }, this);
}
}),
"[project]/packages/graph-engine/src/renderer/MiniMap.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MiniMap",
    ()=>MiniMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
'use client';
;
function MiniMap({ nodes, bounds, viewport, onViewportChange, width = 200, height = 150, className = '' }) {
    // Calculate scale to fit bounds in minimap
    const padding = 10;
    const availableWidth = width - padding * 2;
    const availableHeight = height - padding * 2;
    const scaleX = bounds.width > 0 ? availableWidth / bounds.width : 1;
    const scaleY = bounds.height > 0 ? availableHeight / bounds.height : 1;
    const scale = Math.min(scaleX, scaleY, 1);
    // Calculate viewport rectangle in minimap coordinates
    const viewportRect = {
        x: padding + (viewport.x - bounds.minX) * scale,
        y: padding + (viewport.y - bounds.minY) * scale,
        width: viewport.width / viewport.scale * scale,
        height: viewport.height / viewport.scale * scale
    };
    // Handle click on minimap to pan
    const handleClick = (e)=>{
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        // Convert click to graph coordinates
        const graphX = bounds.minX + (clickX - padding) / scale;
        const graphY = bounds.minY + (clickY - padding) / scale;
        onViewportChange({
            ...viewport,
            x: graphX,
            y: graphY
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden ${className}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: width,
            height: height,
            onClick: handleClick,
            style: {
                cursor: 'crosshair'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    fill: "#fafafa"
                }, void 0, false, {
                    fileName: "[project]/packages/graph-engine/src/renderer/MiniMap.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    transform: `translate(${padding - bounds.minX * scale}, ${padding - bounds.minY * scale}) scale(${scale})`,
                    children: nodes.map((node)=>{
                        const nodeColor = node.type === 'person' ? node.data.gender === 'male' ? '#3b82f6' : node.data.gender === 'female' ? '#ec4899' : '#6b7280' : '#22c55e';
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                            x: node.x - node.width / 2,
                            y: node.y - node.height / 2,
                            width: node.width,
                            height: node.height,
                            rx: node.type === 'person' ? 4 : node.width / 2,
                            fill: nodeColor,
                            opacity: 0.7
                        }, node.id, false, {
                            fileName: "[project]/packages/graph-engine/src/renderer/MiniMap.tsx",
                            lineNumber: 83,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/packages/graph-engine/src/renderer/MiniMap.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: viewportRect.x,
                    y: viewportRect.y,
                    width: Math.max(viewportRect.width, 20),
                    height: Math.max(viewportRect.height, 15),
                    fill: "rgba(14, 165, 233, 0.2)",
                    stroke: "#0ea5e9",
                    strokeWidth: 2,
                    rx: 2
                }, void 0, false, {
                    fileName: "[project]/packages/graph-engine/src/renderer/MiniMap.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: 0.5,
                    y: 0.5,
                    width: width - 1,
                    height: height - 1,
                    fill: "none",
                    stroke: "#e5e5e5",
                    rx: 8
                }, void 0, false, {
                    fileName: "[project]/packages/graph-engine/src/renderer/MiniMap.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/packages/graph-engine/src/renderer/MiniMap.tsx",
            lineNumber: 62,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/packages/graph-engine/src/renderer/MiniMap.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
}),
"[project]/packages/graph-engine/src/renderer/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$renderer$2f$GraphCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/renderer/GraphCanvas.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$renderer$2f$PersonNode$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/renderer/PersonNode.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$renderer$2f$UnionNode$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/renderer/UnionNode.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$renderer$2f$EdgeRenderer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/renderer/EdgeRenderer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$renderer$2f$MiniMap$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/renderer/MiniMap.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
}),
"[project]/packages/graph-engine/src/genogram/GenogramView.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GenogramView",
    ()=>GenogramView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$layout$2f$SugiyamaLayout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/layout/SugiyamaLayout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$renderer$2f$GraphCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/renderer/GraphCanvas.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const DEFAULT_OPTIONS = {
    showPhotos: false,
    showDates: true,
    showMedicalIcons: true,
    showDeceased: true,
    animationsEnabled: true,
    showRelationshipLines: true,
    showMedicalConditions: true,
    legendVisible: true
};
const CONDITION_COLORS = {
    cardiovascular: '#ef4444',
    cancer: '#8b5cf6',
    metabolic: '#f59e0b',
    neurological: '#3b82f6',
    mental_health: '#10b981',
    autoimmune: '#ec4899',
    genetic: '#6366f1'
};
function GenogramView({ data, viewport, onViewportChange, onNodeClick, options = {}, className = '' }) {
    const genogramOptions = {
        ...DEFAULT_OPTIONS,
        ...options
    };
    // Compute layout
    const layout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const layoutEngine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$layout$2f$SugiyamaLayout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSugiyamaLayout"])({
            nodeWidth: 120,
            nodeHeight: 80,
            horizontalSpacing: 80,
            verticalSpacing: 100
        });
        return layoutEngine.compute(data);
    }, [
        data
    ]);
    // Extract all medical conditions for legend
    const allConditions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const conditions = new Map();
        for (const person of data.persons){
            if (person.medicalConditions) {
                for (const condition of person.medicalConditions){
                    const existing = conditions.get(condition.category);
                    if (existing) {
                        existing.count++;
                    } else {
                        conditions.set(condition.category, {
                            category: condition.category,
                            count: 1
                        });
                    }
                }
            }
        }
        return Array.from(conditions.values());
    }, [
        data.persons
    ]);
    const handleNodeClick = (interaction)=>{
        // Extract person ID from node ID
        const personId = interaction.nodeId.replace('person-', '');
        onNodeClick?.(personId);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative w-full h-full ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$renderer$2f$GraphCanvas$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GraphCanvas"], {
                nodes: layout.nodes,
                edges: layout.edges,
                bounds: layout.bounds,
                viewport: viewport,
                onViewportChange: onViewportChange,
                onNodeClick: handleNodeClick,
                options: {
                    ...genogramOptions,
                    showPhotos: false
                }
            }, void 0, false, {
                fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            genogramOptions.legendVisible && allConditions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-neutral-200 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-sm font-semibold text-neutral-700 mb-3",
                        children: "Medical Conditions"
                    }, void 0, false, {
                        fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: allConditions.map(({ category, count })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-3 h-3 rounded-full",
                                        style: {
                                            backgroundColor: CONDITION_COLORS[category]
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                        lineNumber: 118,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-neutral-600 capitalize",
                                        children: category.replace('_', ' ')
                                    }, void 0, false, {
                                        fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                        lineNumber: 122,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-neutral-400",
                                        children: [
                                            "(",
                                            count,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                        lineNumber: 125,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, category, true, {
                                fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                lineNumber: 117,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                        lineNumber: 115,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                lineNumber: 111,
                columnNumber: 9
            }, this),
            genogramOptions.legendVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-neutral-200 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "text-sm font-semibold text-neutral-700 mb-3",
                        children: "Symbols"
                    }, void 0, false, {
                        fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "20",
                                        height: "20",
                                        viewBox: "0 0 20 20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                            x: "2",
                                            y: "2",
                                            width: "16",
                                            height: "16",
                                            fill: "none",
                                            stroke: "#3b82f6",
                                            strokeWidth: "2"
                                        }, void 0, false, {
                                            fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                            lineNumber: 139,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-neutral-600",
                                        children: "Male"
                                    }, void 0, false, {
                                        fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                        lineNumber: 141,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "20",
                                        height: "20",
                                        viewBox: "0 0 20 20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "10",
                                            cy: "10",
                                            r: "8",
                                            fill: "none",
                                            stroke: "#ec4899",
                                            strokeWidth: "2"
                                        }, void 0, false, {
                                            fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                            lineNumber: 145,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-neutral-600",
                                        children: "Female"
                                    }, void 0, false, {
                                        fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                lineNumber: 143,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "20",
                                        height: "20",
                                        viewBox: "0 0 20 20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                            points: "10,2 18,10 10,18 2,10",
                                            fill: "none",
                                            stroke: "#6b7280",
                                            strokeWidth: "2"
                                        }, void 0, false, {
                                            fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                            lineNumber: 151,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                        lineNumber: 150,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-neutral-600",
                                        children: "Other"
                                    }, void 0, false, {
                                        fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "20",
                                        height: "20",
                                        viewBox: "0 0 20 20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                x: "2",
                                                y: "2",
                                                width: "16",
                                                height: "16",
                                                fill: "#f5f5f5",
                                                stroke: "#9ca3af",
                                                strokeWidth: "2"
                                            }, void 0, false, {
                                                fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                                lineNumber: 157,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "2",
                                                y1: "2",
                                                x2: "18",
                                                y2: "18",
                                                stroke: "#9ca3af",
                                                strokeWidth: "1.5"
                                            }, void 0, false, {
                                                fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                                lineNumber: 158,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                        lineNumber: 156,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-neutral-600",
                                        children: "Deceased"
                                    }, void 0, false, {
                                        fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                        lineNumber: 160,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                                lineNumber: 155,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
                lineNumber: 134,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/packages/graph-engine/src/genogram/GenogramView.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
}),
"[project]/packages/graph-engine/src/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Types
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/types.ts [app-ssr] (ecmascript)");
// Core
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$core$2f$Graph$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/core/Graph.ts [app-ssr] (ecmascript)");
// Layout
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$layout$2f$SugiyamaLayout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/layout/SugiyamaLayout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$layout$2f$GenerationAssigner$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/layout/GenerationAssigner.ts [app-ssr] (ecmascript)");
// Renderer
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$renderer$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/renderer/index.ts [app-ssr] (ecmascript) <locals>");
// Genogram
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$genogram$2f$GenogramView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/genogram/GenogramView.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
}),
"[project]/apps/web/src/hooks/useTreeLayout.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createMockGraphData",
    ()=>createMockGraphData,
    "useTreeLayout",
    ()=>useTreeLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$layout$2f$SugiyamaLayout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/graph-engine/src/layout/SugiyamaLayout.ts [app-ssr] (ecmascript)");
'use client';
;
;
function useTreeLayout(data, options = {}) {
    const { config, rootPersonId } = options;
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!data || !data.persons || data.persons.length === 0) {
            return {
                nodes: [],
                edges: [],
                bounds: {
                    minX: 0,
                    minY: 0,
                    maxX: 0,
                    maxY: 0,
                    width: 0,
                    height: 0
                },
                generations: 0,
                isLoading: false
            };
        }
        const layout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$graph$2d$engine$2f$src$2f$layout$2f$SugiyamaLayout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSugiyamaLayout"])({
            ...config,
            rootPersonId
        });
        const layoutResult = layout.compute(data);
        return {
            ...layoutResult,
            generations: layoutResult.generations || 0,
            isLoading: false
        };
    }, [
        data,
        config,
        rootPersonId
    ]);
    return result;
}
function createMockGraphData() {
    return {
        persons: [
            // Grandparents - Paternal
            {
                id: 'gp1',
                firstName: 'Roberto',
                lastName: 'García',
                gender: 'male',
                birthDate: '1940-05-12',
                isLiving: false
            },
            {
                id: 'gp2',
                firstName: 'María',
                lastName: 'López',
                gender: 'female',
                birthDate: '1945-08-23',
                isLiving: false
            },
            // Grandparents - Maternal
            {
                id: 'gp3',
                firstName: 'José',
                lastName: 'Martínez',
                gender: 'male',
                birthDate: '1942-03-15',
                isLiving: false
            },
            {
                id: 'gp4',
                firstName: 'Carmen',
                lastName: 'Hernández',
                gender: 'female',
                birthDate: '1948-11-30',
                isLiving: true
            },
            // Parents
            {
                id: 'p1',
                firstName: 'Juan',
                lastName: 'García',
                gender: 'male',
                birthDate: '1970-02-28',
                isLiving: true
            },
            {
                id: 'p2',
                firstName: 'Ana',
                lastName: 'Martínez',
                gender: 'female',
                birthDate: '1972-07-14',
                isLiving: true
            },
            // Children
            {
                id: 'c1',
                firstName: 'Carlos',
                lastName: 'García',
                gender: 'male',
                birthDate: '1998-12-05',
                isLiving: true
            },
            {
                id: 'c2',
                firstName: 'Sofía',
                lastName: 'García',
                gender: 'female',
                birthDate: '2002-03-18',
                isLiving: true
            }
        ],
        unions: [
            // Paternal grandparents union
            {
                id: 'u1',
                partner1Id: 'gp1',
                partner2Id: 'gp2',
                unionType: 'marriage',
                startDate: '1965-06-20',
                childrenIds: [
                    'p1'
                ]
            },
            // Maternal grandparents union
            {
                id: 'u2',
                partner1Id: 'gp3',
                partner2Id: 'gp4',
                unionType: 'marriage',
                startDate: '1968-09-15',
                childrenIds: [
                    'p2'
                ]
            },
            // Parents union
            {
                id: 'u3',
                partner1Id: 'p1',
                partner2Id: 'p2',
                unionType: 'marriage',
                startDate: '1995-04-10',
                childrenIds: [
                    'c1',
                    'c2'
                ]
            }
        ],
        relationships: [
            // Parent-child relationships for p1
            {
                id: 'r1',
                personId: 'gp1',
                relatedPersonId: 'p1',
                type: 'parent'
            },
            {
                id: 'r2',
                personId: 'gp2',
                relatedPersonId: 'p1',
                type: 'parent'
            },
            // Parent-child relationships for p2
            {
                id: 'r3',
                personId: 'gp3',
                relatedPersonId: 'p2',
                type: 'parent'
            },
            {
                id: 'r4',
                personId: 'gp4',
                relatedPersonId: 'p2',
                type: 'parent'
            },
            // Parent-child relationships for children
            {
                id: 'r5',
                personId: 'p1',
                relatedPersonId: 'c1',
                type: 'parent'
            },
            {
                id: 'r6',
                personId: 'p2',
                relatedPersonId: 'c1',
                type: 'parent'
            },
            {
                id: 'r7',
                personId: 'p1',
                relatedPersonId: 'c2',
                type: 'parent'
            },
            {
                id: 'r8',
                personId: 'p2',
                relatedPersonId: 'c2',
                type: 'parent'
            },
            // Sibling relationship
            {
                id: 'r9',
                personId: 'c1',
                relatedPersonId: 'c2',
                type: 'sibling'
            }
        ]
    };
}
}),
"[project]/apps/web/src/hooks/useFamilyTree.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFamilyTree",
    ()=>useFamilyTree
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$familyStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/stores/familyStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/supabase.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function useFamilyTree() {
    const currentFamily = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$familyStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFamilyStore"])((state)=>state.currentFamily);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])(), []);
    const [persons, setPersons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [unions, setUnions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [relationships, setRelationships] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Fetch all data when family changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (currentFamily?.id) {
            fetchTreeData(currentFamily.id);
        } else {
            setPersons([]);
            setUnions([]);
            setRelationships([]);
            setIsLoading(false);
        }
    }, [
        currentFamily?.id
    ]);
    const fetchTreeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (familyId)=>{
        setIsLoading(true);
        setError(null);
        try {
            // Fetch persons
            const { data: personsData, error: personsError } = await supabase.from('persons').select('*').eq('family_id', familyId).order('created_at', {
                ascending: true
            });
            if (personsError) throw personsError;
            // Fetch unions
            const { data: unionsData, error: unionsError } = await supabase.from('unions').select('*').eq('family_id', familyId);
            if (unionsError) throw unionsError;
            // Fetch union children
            const { data: childrenData, error: childrenError } = await supabase.from('union_children').select('union_id, child_id').in('union_id', (unionsData || []).map((u)=>u.id));
            if (childrenError) throw childrenError;
            // Fetch relationships
            const { data: relationshipsData, error: relError } = await supabase.from('relationships').select('*').eq('family_id', familyId);
            if (relError) throw relError;
            // Map data
            const personsList = (personsData || []).map((p)=>({
                    id: p.id,
                    familyId: p.family_id,
                    firstName: p.first_name,
                    middleNames: p.middle_names,
                    lastName: p.last_name,
                    maidenName: p.maiden_name,
                    nicknames: p.nicknames,
                    birthDate: p.birth_date,
                    birthDateApproximate: p.birth_date_approximate,
                    birthPlace: p.birth_place,
                    deathDate: p.death_date,
                    deathDateApproximate: p.death_date_approximate,
                    deathPlace: p.death_place,
                    gender: p.gender,
                    isLiving: p.is_living,
                    biography: p.biography,
                    photoUrl: p.photo_url,
                    medicalConditions: p.medical_conditions,
                    linkedUserId: p.linked_user_id,
                    createdAt: p.created_at
                }));
            // Group children by union
            const childrenByUnion = new Map();
            (childrenData || []).forEach((c)=>{
                const existing = childrenByUnion.get(c.union_id) || [];
                existing.push(c.child_id);
                childrenByUnion.set(c.union_id, existing);
            });
            const unionsList = (unionsData || []).map((u)=>({
                    id: u.id,
                    familyId: u.family_id,
                    partner1Id: u.partner1_id,
                    partner2Id: u.partner2_id,
                    unionType: u.union_type,
                    startDate: u.start_date,
                    endDate: u.end_date,
                    location: u.location,
                    children: childrenByUnion.get(u.id) || []
                }));
            const relationshipsList = (relationshipsData || []).map((r)=>({
                    id: r.id,
                    familyId: r.family_id,
                    person1Id: r.person1_id,
                    person2Id: r.person2_id,
                    relationshipType: r.relationship_type,
                    isBiological: r.is_biological
                }));
            setPersons(personsList);
            setUnions(unionsList);
            setRelationships(relationshipsList);
        } catch (err) {
            console.error('Error fetching tree data:', err);
            setError('Error loading family tree');
        } finally{
            setIsLoading(false);
        }
    }, []);
    // Convert to GraphData format for the layout engine
    const graphData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const graphPersons = persons.map((p)=>({
                id: p.id,
                firstName: p.firstName,
                lastName: p.lastName || '',
                gender: p.gender,
                birthDate: p.birthDate,
                birthDateApproximate: p.birthDateApproximate,
                deathDate: p.deathDate,
                deathDateApproximate: p.deathDateApproximate,
                photoUrl: p.photoUrl,
                isLiving: p.isLiving,
                medicalConditions: p.medicalConditions
            }));
        const graphUnions = unions.map((u)=>({
                id: u.id,
                partner1Id: u.partner1Id,
                partner2Id: u.partner2Id || '',
                unionType: u.unionType,
                startDate: u.startDate,
                endDate: u.endDate,
                childrenIds: u.children
            }));
        const graphRelationships = relationships.map((r)=>({
                id: r.id,
                personId: r.person1Id,
                relatedPersonId: r.person2Id,
                type: r.relationshipType === 'parent_child' ? 'parent' : r.relationshipType
            }));
        return {
            persons: graphPersons,
            unions: graphUnions,
            relationships: graphRelationships
        };
    }, [
        persons,
        unions,
        relationships
    ]);
    // CRUD operations
    const createPerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (input)=>{
        if (!currentFamily?.id) return null;
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return null;
        try {
            const { data, error } = await supabase.from('persons').insert({
                family_id: currentFamily.id,
                first_name: input.firstName,
                last_name: input.lastName,
                gender: input.gender,
                birth_date: input.birthDate,
                is_living: input.isLiving ?? true,
                photo_url: input.photoUrl,
                created_by: userData.user.id
            }).select().single();
            if (error) throw error;
            const newPerson = {
                id: data.id,
                familyId: data.family_id,
                firstName: data.first_name,
                lastName: data.last_name,
                gender: data.gender,
                birthDate: data.birth_date,
                isLiving: data.is_living,
                photoUrl: data.photo_url,
                createdAt: data.created_at
            };
            setPersons((prev)=>[
                    ...prev,
                    newPerson
                ]);
            return newPerson;
        } catch (err) {
            console.error('Error creating person:', err);
            setError('Error creating person');
            return null;
        }
    }, [
        currentFamily?.id
    ]);
    const updatePerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (personId, updates)=>{
        try {
            const updateData = {};
            if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
            if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
            if (updates.gender !== undefined) updateData.gender = updates.gender;
            if (updates.birthDate !== undefined) updateData.birth_date = updates.birthDate;
            if (updates.isLiving !== undefined) updateData.is_living = updates.isLiving;
            if (updates.photoUrl !== undefined) updateData.photo_url = updates.photoUrl;
            const { error } = await supabase.from('persons').update(updateData).eq('id', personId);
            if (error) throw error;
            // Refresh data
            if (currentFamily?.id) {
                await fetchTreeData(currentFamily.id);
            }
            return true;
        } catch (err) {
            console.error('Error updating person:', err);
            return false;
        }
    }, [
        currentFamily?.id,
        fetchTreeData
    ]);
    const deletePerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (personId)=>{
        try {
            const { error } = await supabase.from('persons').delete().eq('id', personId);
            if (error) throw error;
            setPersons((prev)=>prev.filter((p)=>p.id !== personId));
            return true;
        } catch (err) {
            console.error('Error deleting person:', err);
            return false;
        }
    }, []);
    const createUnion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (partner1Id, partner2Id, type = 'marriage')=>{
        if (!currentFamily?.id) return null;
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return null;
        try {
            const { data, error } = await supabase.from('unions').insert({
                family_id: currentFamily.id,
                partner1_id: partner1Id,
                partner2_id: partner2Id,
                union_type: type,
                created_by: userData.user.id
            }).select().single();
            if (error) throw error;
            const newUnion = {
                id: data.id,
                familyId: data.family_id,
                partner1Id: data.partner1_id,
                partner2Id: data.partner2_id,
                unionType: data.union_type,
                startDate: data.start_date,
                endDate: data.end_date,
                location: data.location,
                children: []
            };
            setUnions((prev)=>[
                    ...prev,
                    newUnion
                ]);
            return newUnion;
        } catch (err) {
            console.error('Error creating union:', err);
            return null;
        }
    }, [
        currentFamily?.id
    ]);
    const addChildToUnion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (unionId, childId)=>{
        try {
            const { error } = await supabase.from('union_children').insert({
                union_id: unionId,
                child_id: childId
            });
            if (error) throw error;
            // Update local state
            setUnions((prev)=>prev.map((u)=>u.id === unionId ? {
                        ...u,
                        children: [
                            ...u.children,
                            childId
                        ]
                    } : u));
            return true;
        } catch (err) {
            console.error('Error adding child to union:', err);
            return false;
        }
    }, []);
    const createRelationship = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (person1Id, person2Id, type, isBiological = true)=>{
        if (!currentFamily?.id) return false;
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return false;
        try {
            const { error } = await supabase.from('relationships').insert({
                family_id: currentFamily.id,
                person1_id: person1Id,
                person2_id: person2Id,
                relationship_type: type,
                is_biological: isBiological,
                created_by: userData.user.id
            });
            if (error) throw error;
            // Refresh data
            await fetchTreeData(currentFamily.id);
            return true;
        } catch (err) {
            console.error('Error creating relationship:', err);
            return false;
        }
    }, [
        currentFamily?.id,
        fetchTreeData
    ]);
    const getPersonById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((personId)=>{
        return persons.find((p)=>p.id === personId);
    }, [
        persons
    ]);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (currentFamily?.id) {
            await fetchTreeData(currentFamily.id);
        }
    }, [
        currentFamily?.id,
        fetchTreeData
    ]);
    // Get root person (first person added or self-marked person)
    const getRootPerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (persons.length === 0) return null;
        // For now, return the first person created
        return persons[0];
    }, [
        persons
    ]);
    // Find or create a union between two people
    const findOrCreateUnion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (partner1Id, partner2Id, type = 'marriage')=>{
        // Look for existing union
        const existingUnion = unions.find((u)=>u.partner1Id === partner1Id && u.partner2Id === partner2Id || u.partner1Id === partner2Id && u.partner2Id === partner1Id);
        if (existingUnion) {
            return existingUnion.id;
        }
        // Create new union
        const newUnion = await createUnion(partner1Id, partner2Id, type);
        return newUnion?.id || null;
    }, [
        unions,
        createUnion
    ]);
    // Get parents of a person
    const getParentsOfPerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((personId)=>{
        // Find union where this person is a child
        for (const union of unions){
            if (union.children.includes(personId)) {
                const partner1 = persons.find((p)=>p.id === union.partner1Id);
                const partner2 = persons.find((p)=>p.id === union.partner2Id);
                let fatherId;
                let motherId;
                if (partner1?.gender === 'male') fatherId = partner1.id;
                else if (partner1?.gender === 'female') motherId = partner1.id;
                if (partner2?.gender === 'male') fatherId = partner2.id;
                else if (partner2?.gender === 'female') motherId = partner2.id;
                return {
                    fatherId,
                    motherId,
                    unionId: union.id
                };
            }
        }
        return {};
    }, [
        unions,
        persons
    ]);
    // Get spouse of a person
    const getSpouseOfPerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((personId)=>{
        for (const union of unions){
            if (union.partner1Id === personId && union.partner2Id) {
                return persons.find((p)=>p.id === union.partner2Id) || null;
            }
            if (union.partner2Id === personId) {
                return persons.find((p)=>p.id === union.partner1Id) || null;
            }
        }
        return null;
    }, [
        unions,
        persons
    ]);
    // Create person with relationship - the main function for adding family members
    const createPersonWithRelationship = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (input)=>{
        if (!currentFamily?.id) return null;
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return null;
        try {
            // First, create the person
            const { data: personData, error: personError } = await supabase.from('persons').insert({
                family_id: currentFamily.id,
                first_name: input.firstName,
                last_name: input.lastName,
                gender: input.gender,
                birth_date: input.birthDate,
                is_living: input.isLiving ?? true,
                photo_url: input.photoUrl,
                medical_conditions: input.medicalConditions || null,
                created_by: userData.user.id
            }).select().single();
            if (personError) throw personError;
            const newPersonId = personData.id;
            const relatedToId = input.relatedToPersonId;
            // Now handle the relationship based on type
            switch(input.relationshipType){
                case 'self':
                    break;
                case 'father':
                case 'mother':
                    {
                        // Adding a parent to the related person
                        if (!relatedToId) break;
                        // Get existing parents of the related person
                        const existingParents = getParentsOfPerson(relatedToId);
                        if (existingParents.unionId) {
                            // Union exists, update it to add this parent as the second partner
                            if (input.relationshipType === 'father' && !existingParents.fatherId) {
                                // If partner1 is already the mother, add father as partner2
                                // Otherwise update partner1
                                const currentUnion = unions.find((u)=>u.id === existingParents.unionId);
                                if (currentUnion?.partner1Id && !currentUnion?.partner2Id) {
                                    await supabase.from('unions').update({
                                        partner2_id: newPersonId
                                    }).eq('id', existingParents.unionId);
                                } else {
                                    await supabase.from('unions').update({
                                        partner1_id: newPersonId
                                    }).eq('id', existingParents.unionId);
                                }
                            } else if (input.relationshipType === 'mother' && !existingParents.motherId) {
                                const currentUnion = unions.find((u)=>u.id === existingParents.unionId);
                                if (currentUnion?.partner1Id && !currentUnion?.partner2Id) {
                                    await supabase.from('unions').update({
                                        partner2_id: newPersonId
                                    }).eq('id', existingParents.unionId);
                                } else {
                                    await supabase.from('unions').update({
                                        partner1_id: newPersonId
                                    }).eq('id', existingParents.unionId);
                                }
                            }
                        } else {
                            // Create new union with new parent and add related person as child
                            // The new parent is always partner1, partner2 will be added later
                            const union = await createUnion(newPersonId, null, 'marriage');
                            if (union) {
                                await addChildToUnion(union.id, relatedToId);
                            }
                        }
                        // Create parent-child relationship
                        await createRelationship(newPersonId, relatedToId, 'parent_child', true);
                        break;
                    }
                case 'spouse':
                    {
                        // Adding a spouse to the related person
                        if (!relatedToId) break;
                        // Create or find union between them
                        await findOrCreateUnion(relatedToId, newPersonId, 'marriage');
                        // Create spouse relationship
                        await createRelationship(relatedToId, newPersonId, 'spouse', false);
                        break;
                    }
                case 'son':
                case 'daughter':
                    {
                        // Adding a child to the related person
                        if (!relatedToId) break;
                        // Find or create union for the parent
                        const spouse = getSpouseOfPerson(relatedToId);
                        let unionId = null;
                        if (spouse) {
                            // Find existing union with spouse
                            unionId = await findOrCreateUnion(relatedToId, spouse.id, 'marriage');
                        } else {
                            // Create single-parent union
                            const union = await createUnion(relatedToId, null, 'other');
                            unionId = union?.id || null;
                        }
                        if (unionId) {
                            await addChildToUnion(unionId, newPersonId);
                        }
                        // Create parent-child relationship
                        await createRelationship(relatedToId, newPersonId, 'parent_child', true);
                        break;
                    }
                case 'brother':
                case 'sister':
                    {
                        // Adding a sibling to the related person
                        if (!relatedToId) break;
                        // Find the parents union of the related person
                        const existingParents = getParentsOfPerson(relatedToId);
                        if (existingParents.unionId) {
                            // Add to same union as sibling (they share the same parents)
                            await addChildToUnion(existingParents.unionId, newPersonId);
                        }
                        // If no parents exist yet, we just create the sibling relationship
                        // Parents can be added later, and both siblings will be linked to them
                        // Create sibling relationship
                        await createRelationship(relatedToId, newPersonId, 'sibling', true);
                        break;
                    }
                case 'grandfather_paternal':
                case 'grandmother_paternal':
                    {
                        // Adding paternal grandparent
                        if (!relatedToId) break;
                        const parents = getParentsOfPerson(relatedToId);
                        if (parents.fatherId) {
                            // Add as parent of the father
                            const fatherParents = getParentsOfPerson(parents.fatherId);
                            if (fatherParents.unionId) {
                                // Update existing grandparents union - add as second partner
                                const currentUnion = unions.find((u)=>u.id === fatherParents.unionId);
                                if (currentUnion?.partner1Id && !currentUnion?.partner2Id) {
                                    await supabase.from('unions').update({
                                        partner2_id: newPersonId
                                    }).eq('id', fatherParents.unionId);
                                } else if (!currentUnion?.partner1Id) {
                                    await supabase.from('unions').update({
                                        partner1_id: newPersonId
                                    }).eq('id', fatherParents.unionId);
                                }
                            } else {
                                // Create new union and add father as child
                                const union = await createUnion(newPersonId, null, 'marriage');
                                if (union) {
                                    await addChildToUnion(union.id, parents.fatherId);
                                }
                            }
                            await createRelationship(newPersonId, parents.fatherId, 'parent_child', true);
                        }
                        break;
                    }
                case 'grandfather_maternal':
                case 'grandmother_maternal':
                    {
                        // Adding maternal grandparent
                        if (!relatedToId) break;
                        const parents = getParentsOfPerson(relatedToId);
                        if (parents.motherId) {
                            // Add as parent of the mother
                            const motherParents = getParentsOfPerson(parents.motherId);
                            if (motherParents.unionId) {
                                // Update existing grandparents union - add as second partner
                                const currentUnion = unions.find((u)=>u.id === motherParents.unionId);
                                if (currentUnion?.partner1Id && !currentUnion?.partner2Id) {
                                    await supabase.from('unions').update({
                                        partner2_id: newPersonId
                                    }).eq('id', motherParents.unionId);
                                } else if (!currentUnion?.partner1Id) {
                                    await supabase.from('unions').update({
                                        partner1_id: newPersonId
                                    }).eq('id', motherParents.unionId);
                                }
                            } else {
                                // Create new union and add mother as child
                                const union = await createUnion(newPersonId, null, 'marriage');
                                if (union) {
                                    await addChildToUnion(union.id, parents.motherId);
                                }
                            }
                            await createRelationship(newPersonId, parents.motherId, 'parent_child', true);
                        }
                        break;
                    }
                case 'uncle':
                case 'aunt':
                    {
                        // Adding uncle/aunt (sibling of parent)
                        if (!relatedToId) break;
                        const parents = getParentsOfPerson(relatedToId);
                        const parentId = input.gender === 'male' ? parents.fatherId || parents.motherId : parents.motherId || parents.fatherId;
                        if (parentId) {
                            // Find grandparents union
                            const grandparents = getParentsOfPerson(parentId);
                            if (grandparents.unionId) {
                                // Add new person as child of grandparents
                                await addChildToUnion(grandparents.unionId, newPersonId);
                                await createRelationship(parentId, newPersonId, 'sibling', true);
                            }
                        }
                        break;
                    }
                case 'cousin':
                    {
                        // Adding a cousin is complex - need to find uncle/aunt first
                        // For now, just add as a person without automatic relationship
                        console.log('Cousin relationship requires manual setup');
                        break;
                    }
            }
            // Refresh all data
            await fetchTreeData(currentFamily.id);
            // Return the created person (constructed from the insert response)
            const createdPerson = {
                id: personData.id,
                familyId: personData.family_id,
                firstName: personData.first_name,
                lastName: personData.last_name,
                gender: personData.gender,
                birthDate: personData.birth_date,
                isLiving: personData.is_living,
                photoUrl: personData.photo_url,
                medicalConditions: personData.medical_conditions,
                createdAt: personData.created_at
            };
            return createdPerson;
        } catch (err) {
            console.error('Error creating person with relationship:', err);
            setError('Error creating person');
            return null;
        }
    }, [
        currentFamily?.id,
        supabase,
        createUnion,
        addChildToUnion,
        createRelationship,
        getParentsOfPerson,
        getSpouseOfPerson,
        findOrCreateUnion,
        fetchTreeData,
        persons
    ]);
    // Calculate the relationship role of a person relative to the root person
    const getPersonRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((personId)=>{
        const root = getRootPerson();
        if (!root) return null;
        if (personId === root.id) return 'Me';
        const person = persons.find((p)=>p.id === personId);
        if (!person) return null;
        // Get parents of root person
        const rootParents = getParentsOfPerson(root.id);
        // Check if person is parent of root
        if (rootParents.fatherId === personId) return 'Father';
        if (rootParents.motherId === personId) return 'Mother';
        // Check if person is spouse of root
        const rootSpouse = getSpouseOfPerson(root.id);
        if (rootSpouse?.id === personId) {
            return person.gender === 'male' ? 'Husband' : 'Wife';
        }
        // Check if person is child of root (root is parent in a union)
        for (const union of unions){
            if (union.partner1Id === root.id || union.partner2Id === root.id) {
                if (union.children.includes(personId)) {
                    return person.gender === 'male' ? 'Son' : 'Daughter';
                }
            }
        }
        // Check if person is sibling (shares same parents as root)
        if (rootParents.unionId) {
            const rootUnion = unions.find((u)=>u.id === rootParents.unionId);
            if (rootUnion && rootUnion.children.includes(personId)) {
                return person.gender === 'male' ? 'Brother' : 'Sister';
            }
        }
        // Also check sibling relationship in relationships table
        const siblingRelationship = relationships.find((r)=>r.relationshipType === 'sibling' && (r.person1Id === root.id && r.person2Id === personId || r.person1Id === personId && r.person2Id === root.id));
        if (siblingRelationship) {
            return person.gender === 'male' ? 'Brother' : 'Sister';
        }
        // Check if they share at least one parent (alternative sibling check)
        const personParents = getParentsOfPerson(personId);
        if (rootParents.fatherId && rootParents.fatherId === personParents.fatherId || rootParents.motherId && rootParents.motherId === personParents.motherId) {
            return person.gender === 'male' ? 'Brother' : 'Sister';
        }
        // Check if person is grandparent
        if (rootParents.fatherId) {
            const fatherParents = getParentsOfPerson(rootParents.fatherId);
            if (fatherParents.fatherId === personId) return 'Paternal Grandfather';
            if (fatherParents.motherId === personId) return 'Paternal Grandmother';
        }
        if (rootParents.motherId) {
            const motherParents = getParentsOfPerson(rootParents.motherId);
            if (motherParents.fatherId === personId) return 'Maternal Grandfather';
            if (motherParents.motherId === personId) return 'Maternal Grandmother';
        }
        // Check if person is uncle/aunt (sibling of root's parents)
        if (rootParents.fatherId) {
            const fatherParents = getParentsOfPerson(rootParents.fatherId);
            if (fatherParents.unionId) {
                const fatherSiblingsUnion = unions.find((u)=>u.id === fatherParents.unionId);
                if (fatherSiblingsUnion) {
                    // Filter out the root's father himself from the siblings
                    const siblingsOfFather = fatherSiblingsUnion.children.filter((id)=>id !== rootParents.fatherId);
                    if (siblingsOfFather.includes(personId)) {
                        return person.gender === 'male' ? 'Uncle' : 'Aunt';
                    }
                }
            }
        }
        if (rootParents.motherId) {
            const motherParents = getParentsOfPerson(rootParents.motherId);
            if (motherParents.unionId) {
                const motherSiblingsUnion = unions.find((u)=>u.id === motherParents.unionId);
                if (motherSiblingsUnion) {
                    // Filter out the root's mother herself from the siblings
                    const siblingsOfMother = motherSiblingsUnion.children.filter((id)=>id !== rootParents.motherId);
                    if (siblingsOfMother.includes(personId)) {
                        return person.gender === 'male' ? 'Uncle' : 'Aunt';
                    }
                }
            }
        }
        // Check if person is grandchild
        for (const union of unions){
            if (union.partner1Id === root.id || union.partner2Id === root.id) {
                for (const childId of union.children){
                    // Check if this child has children that include the person
                    for (const childUnion of unions){
                        if (childUnion.partner1Id === childId || childUnion.partner2Id === childId) {
                            if (childUnion.children.includes(personId)) {
                                return person.gender === 'male' ? 'Grandson' : 'Granddaughter';
                            }
                        }
                    }
                }
            }
        }
        // Check if person is nephew/niece (child of sibling)
        if (rootParents.unionId) {
            const rootUnion = unions.find((u)=>u.id === rootParents.unionId);
            if (rootUnion) {
                for (const siblingId of rootUnion.children){
                    if (siblingId === root.id) continue; // Skip the root person themselves
                    // Check if person is child of this sibling
                    for (const siblingUnion of unions){
                        if (siblingUnion.partner1Id === siblingId || siblingUnion.partner2Id === siblingId) {
                            if (siblingUnion.children.includes(personId)) {
                                return person.gender === 'male' ? 'Nephew' : 'Niece';
                            }
                        }
                    }
                }
            }
        }
        // Check if person is cousin (child of uncle/aunt)
        // First get uncles/aunts
        const unclesAunts = [];
        if (rootParents.fatherId) {
            const fatherParents = getParentsOfPerson(rootParents.fatherId);
            if (fatherParents.unionId) {
                const fatherSiblingsUnion = unions.find((u)=>u.id === fatherParents.unionId);
                if (fatherSiblingsUnion) {
                    unclesAunts.push(...fatherSiblingsUnion.children.filter((id)=>id !== rootParents.fatherId));
                }
            }
        }
        if (rootParents.motherId) {
            const motherParents = getParentsOfPerson(rootParents.motherId);
            if (motherParents.unionId) {
                const motherSiblingsUnion = unions.find((u)=>u.id === motherParents.unionId);
                if (motherSiblingsUnion) {
                    unclesAunts.push(...motherSiblingsUnion.children.filter((id)=>id !== rootParents.motherId));
                }
            }
        }
        // Check if person is child of any uncle/aunt
        for (const uncleAuntId of unclesAunts){
            for (const uncleAuntUnion of unions){
                if (uncleAuntUnion.partner1Id === uncleAuntId || uncleAuntUnion.partner2Id === uncleAuntId) {
                    if (uncleAuntUnion.children.includes(personId)) {
                        return 'Cousin';
                    }
                }
            }
        }
        return 'Relative';
    }, [
        persons,
        unions,
        relationships,
        getRootPerson,
        getParentsOfPerson,
        getSpouseOfPerson
    ]);
    return {
        persons,
        unions,
        relationships,
        graphData,
        isLoading,
        error,
        createPerson,
        createPersonWithRelationship,
        updatePerson,
        deletePerson,
        createUnion,
        addChildToUnion,
        createRelationship,
        getPersonById,
        getRootPerson,
        getParentsOfPerson,
        getSpouseOfPerson,
        getPersonRole,
        refresh
    };
}
}),
"[project]/apps/web/src/app/(dashboard)/tree/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TreePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/layout/Container.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$forms$2f$SearchInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/forms/SearchInput.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/navigation/Tabs.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Avatar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Skeleton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useTreeLayout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useTreeLayout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useFamilyTree.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyInvitations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useFamilyInvitations.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
// Common medical conditions for family history
const COMMON_MEDICAL_CONDITIONS = [
    {
        id: 'diabetes',
        name: 'Diabetes',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BloodIcon, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 31,
            columnNumber: 45
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'hypertension',
        name: 'Hypertension',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(HeartIcon, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 32,
            columnNumber: 53
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'heart_disease',
        name: 'Heart Disease',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(HeartAnatomyIcon, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 33,
            columnNumber: 55
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'cancer',
        name: 'Cancer',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RibbonIcon, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 34,
            columnNumber: 41
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'asthma',
        name: 'Asthma',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LungsIcon, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 35,
            columnNumber: 41
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'alzheimers',
        name: 'Alzheimer\'s',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BrainIcon, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 36,
            columnNumber: 51
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'depression',
        name: 'Depression',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BrainIcon, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 37,
            columnNumber: 49
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'arthritis',
        name: 'Arthritis',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BoneIcon, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 38,
            columnNumber: 47
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'thyroid',
        name: 'Thyroid',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ButterflyIcon, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 39,
            columnNumber: 43
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'obesity',
        name: 'Obesity',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ScaleIcon, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 40,
            columnNumber: 43
        }, ("TURBOPACK compile-time value", void 0))
    }
];
// Relationship options for the dropdown
const RELATIONSHIP_OPTIONS = [
    {
        value: 'self',
        label: 'Myself (Main Person)',
        requiresRelatedPerson: false
    },
    {
        value: 'father',
        label: 'Father',
        requiresRelatedPerson: true
    },
    {
        value: 'mother',
        label: 'Mother',
        requiresRelatedPerson: true
    },
    {
        value: 'spouse',
        label: 'Spouse',
        requiresRelatedPerson: true
    },
    {
        value: 'son',
        label: 'Son',
        requiresRelatedPerson: true
    },
    {
        value: 'daughter',
        label: 'Daughter',
        requiresRelatedPerson: true
    },
    {
        value: 'brother',
        label: 'Brother',
        requiresRelatedPerson: true
    },
    {
        value: 'sister',
        label: 'Sister',
        requiresRelatedPerson: true
    },
    {
        value: 'grandfather_paternal',
        label: 'Paternal Grandfather',
        requiresRelatedPerson: true
    },
    {
        value: 'grandmother_paternal',
        label: 'Paternal Grandmother',
        requiresRelatedPerson: true
    },
    {
        value: 'grandfather_maternal',
        label: 'Maternal Grandfather',
        requiresRelatedPerson: true
    },
    {
        value: 'grandmother_maternal',
        label: 'Maternal Grandmother',
        requiresRelatedPerson: true
    },
    {
        value: 'uncle',
        label: 'Uncle',
        requiresRelatedPerson: true
    },
    {
        value: 'aunt',
        label: 'Aunt',
        requiresRelatedPerson: true
    },
    {
        value: 'cousin',
        label: 'Cousin',
        requiresRelatedPerson: true
    }
];
// Initial viewport state
const INITIAL_VIEWPORT = {
    x: 0,
    y: 0,
    scale: 0.8,
    width: 800,
    height: 600
};
function TreePage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('tree');
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [viewport, setViewport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(INITIAL_VIEWPORT);
    const [selectedNodeId, setSelectedNodeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isPanning, setIsPanning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastPanPoint, setLastPanPoint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Modal state for adding person
    const [isAddModalOpen, setIsAddModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [invitationSent, setInvitationSent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [invitationError, setInvitationError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [newPerson, setNewPerson] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        firstName: '',
        lastName: '',
        gender: 'male',
        birthDate: '',
        birthPlace: '',
        isLiving: true,
        email: '',
        sendInvitation: false,
        relationshipType: 'self',
        relatedToPersonId: '',
        medicalConditions: []
    });
    // Get real data from Supabase
    const { graphData, persons, isLoading: dataLoading, createPersonWithRelationship, getRootPerson, getPersonRole } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFamilyTree"])();
    const { sendInvitation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyInvitations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFamilyInvitations"])();
    // Get the root person for default "related to" selection
    const rootPerson = getRootPerson();
    // Handle adding a new person
    const handleAddPerson = async ()=>{
        if (!newPerson.firstName.trim() || !newPerson.birthPlace.trim()) {
            setInvitationError('Name and birth place are required');
            return;
        }
        // Validate: if not "self", must select a related person
        const requiresRelated = RELATIONSHIP_OPTIONS.find((o)=>o.value === newPerson.relationshipType)?.requiresRelatedPerson;
        if (requiresRelated && !newPerson.relatedToPersonId) {
            setInvitationError('You must select who they are related to');
            return;
        }
        setIsSubmitting(true);
        setInvitationError(null);
        setInvitationSent(false);
        try {
            const result = await createPersonWithRelationship({
                firstName: newPerson.firstName.trim(),
                lastName: newPerson.lastName.trim() || undefined,
                gender: newPerson.gender,
                birthDate: newPerson.birthDate || undefined,
                birthPlace: newPerson.birthPlace,
                isLiving: newPerson.isLiving,
                relationshipType: newPerson.relationshipType,
                relatedToPersonId: newPerson.relatedToPersonId || undefined,
                medicalConditions: newPerson.medicalConditions.length > 0 ? newPerson.medicalConditions : undefined
            });
            if (result) {
                // Send invitation if email provided
                if (newPerson.sendInvitation && newPerson.email.trim()) {
                    const invResult = await sendInvitation(result.id, newPerson.email.trim(), `I invite you to join our family tree as ${newPerson.firstName}`);
                    if (invResult.success) {
                        setInvitationSent(true);
                    } else {
                        setInvitationError(invResult.error || 'Error sending invitation');
                    }
                }
                // Reset form and close modal
                setNewPerson({
                    firstName: '',
                    lastName: '',
                    gender: 'male',
                    birthDate: '',
                    birthPlace: '',
                    isLiving: true,
                    email: '',
                    sendInvitation: false,
                    relationshipType: persons.length === 0 ? 'self' : 'son',
                    relatedToPersonId: rootPerson?.id || '',
                    medicalConditions: []
                });
                setIsAddModalOpen(false);
            }
        } catch (error) {
            console.error('Error creating person:', error);
        } finally{
            setIsSubmitting(false);
        }
    };
    // Compute layout from real data with root person
    const { nodes, edges, bounds, generations } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useTreeLayout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTreeLayout"])(graphData?.persons?.length > 0 ? graphData : null, {
        rootPersonId: rootPerson?.id
    });
    // Update viewport size on mount and resize
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const updateSize = ()=>{
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setViewport((v)=>({
                        ...v,
                        width: rect.width,
                        height: rect.height
                    }));
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return ()=>window.removeEventListener('resize', updateSize);
    }, []);
    // Center the tree on initial load
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (bounds.width > 0 && bounds.height > 0) {
            const centerX = (bounds.minX + bounds.maxX) / 2;
            const centerY = (bounds.minY + bounds.maxY) / 2;
            setViewport((v)=>({
                    ...v,
                    x: centerX,
                    y: centerY,
                    scale: Math.min(v.width / (bounds.width + 100), v.height / (bounds.height + 100), 1)
                }));
        }
    }, [
        bounds
    ]);
    // Handle node click
    const handleNodeClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((node)=>{
        if (node.type === 'person') {
            const data = node.data;
            setSelectedNodeId(node.id);
            router.push(`/tree/${data.personId}`);
        }
    }, [
        router
    ]);
    // Pan handlers
    const handleMouseDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (e.button === 0) {
            setIsPanning(true);
            setLastPanPoint({
                x: e.clientX,
                y: e.clientY
            });
        }
    }, []);
    const handleMouseMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!isPanning || !lastPanPoint) return;
        const dx = e.clientX - lastPanPoint.x;
        const dy = e.clientY - lastPanPoint.y;
        setViewport((v)=>({
                ...v,
                x: v.x - dx / v.scale,
                y: v.y - dy / v.scale
            }));
        setLastPanPoint({
            x: e.clientX,
            y: e.clientY
        });
    }, [
        isPanning,
        lastPanPoint
    ]);
    const handleMouseUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsPanning(false);
        setLastPanPoint(null);
    }, []);
    // Zoom handlers
    const handleWheel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.preventDefault();
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setViewport((v)=>{
            const newScale = Math.min(Math.max(v.scale * delta, 0.1), 3);
            const scaleRatio = newScale / v.scale;
            return {
                ...v,
                x: v.x + (mouseX / v.scale - v.width / 2 / v.scale) * (1 - 1 / scaleRatio),
                y: v.y + (mouseY / v.scale - v.height / 2 / v.scale) * (1 - 1 / scaleRatio),
                scale: newScale
            };
        });
    }, []);
    const handleZoomIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setViewport((v)=>({
                ...v,
                scale: Math.min(v.scale * 1.2, 3)
            }));
    }, []);
    const handleZoomOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setViewport((v)=>({
                ...v,
                scale: Math.max(v.scale / 1.2, 0.1)
            }));
    }, []);
    const handleFitToScreen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (bounds.width > 0) {
            const centerX = (bounds.minX + bounds.maxX) / 2;
            const centerY = (bounds.minY + bounds.maxY) / 2;
            setViewport((v)=>({
                    ...v,
                    x: centerX,
                    y: centerY,
                    scale: Math.min(v.width / (bounds.width + 100), v.height / (bounds.height + 100), 1)
                }));
        }
    }, [
        bounds
    ]);
    // Transform for SVG
    const transform = `translate(${viewport.width / 2 - viewport.x * viewport.scale}, ${viewport.height / 2 - viewport.y * viewport.scale}) scale(${viewport.scale})`;
    // Show loading state
    if (dataLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Container"], {
            size: "full",
            padding: false,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                width: 250,
                                height: 32
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 307,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                width: 150,
                                height: 20,
                                className: "mt-2"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 308,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                        lineNumber: 306,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                    lineNumber: 305,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                    height: 500,
                    className: "rounded-2xl"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                    lineNumber: 311,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 304,
            columnNumber: 7
        }, this);
    }
    const personCount = persons.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Container"], {
        size: "full",
        padding: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-gradient-primary",
                                children: "Family Tree"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 323,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 mt-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: "primary",
                                        glow: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(UsersSmallIcon, {
                                                className: "w-3 h-3 mr-1"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                lineNumber: 326,
                                                columnNumber: 15
                                            }, this),
                                            personCount,
                                            " people"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                        lineNumber: 325,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: "secondary",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LayersIcon, {
                                                className: "w-3 h-3 mr-1"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                lineNumber: 330,
                                                columnNumber: 15
                                            }, this),
                                            generations || 0,
                                            " generations"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                        lineNumber: 329,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 324,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                        lineNumber: 322,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$forms$2f$SearchInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SearchInput"], {
                                placeholder: "Search family...",
                                onChange: setSearchQuery,
                                onSearch: (q)=>console.log('Search:', q),
                                className: "w-64"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 336,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PlusIcon, {}, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 342,
                                    columnNumber: 29
                                }, void 0),
                                onClick: ()=>setIsAddModalOpen(true),
                                children: "Add Person"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 342,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 321,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tabs"], {
                value: viewMode,
                onChange: setViewMode,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabList"], {
                        variant: "default",
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabTrigger"], {
                                value: "tree",
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TreeIcon, {}, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 351,
                                    columnNumber: 42
                                }, void 0),
                                children: "Tree View"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 351,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabTrigger"], {
                                value: "genogram",
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GenogramIcon, {}, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 354,
                                    columnNumber: 46
                                }, void 0),
                                children: "Genogram"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 354,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabTrigger"], {
                                value: "list",
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ListIcon, {}, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 357,
                                    columnNumber: 42
                                }, void 0),
                                children: "List View"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 357,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                        lineNumber: 350,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabContent"], {
                        value: "tree",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative h-[calc(100vh-280px)] min-h-[500px] rounded-3xl border border-neutral-200 bg-neutral-50/30 overflow-hidden shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: containerRef,
                                    className: "w-full h-full bg-neutral-50/50 relative z-10",
                                    onMouseDown: handleMouseDown,
                                    onMouseMove: handleMouseMove,
                                    onMouseUp: handleMouseUp,
                                    onMouseLeave: handleMouseUp,
                                    onWheel: handleWheel,
                                    style: {
                                        cursor: isPanning ? 'grabbing' : 'grab'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: viewport.width,
                                        height: viewport.height,
                                        className: "absolute inset-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                                                        id: "shadow",
                                                        x: "-30%",
                                                        y: "-30%",
                                                        width: "160%",
                                                        height: "160%",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feDropShadow", {
                                                                dx: "0",
                                                                dy: "4",
                                                                stdDeviation: "6",
                                                                floodColor: "#000",
                                                                floodOpacity: "0.08"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 380,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feDropShadow", {
                                                                dx: "0",
                                                                dy: "2",
                                                                stdDeviation: "3",
                                                                floodColor: "#000",
                                                                floodOpacity: "0.06"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 381,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                        lineNumber: 379,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                                        id: "maleGradient",
                                                        x1: "0%",
                                                        y1: "0%",
                                                        x2: "100%",
                                                        y2: "100%",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                                offset: "0%",
                                                                stopColor: "#60a5fa"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 385,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                                offset: "100%",
                                                                stopColor: "#3b82f6"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 386,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                        lineNumber: 384,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                                        id: "femaleGradient",
                                                        x1: "0%",
                                                        y1: "0%",
                                                        x2: "100%",
                                                        y2: "100%",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                                offset: "0%",
                                                                stopColor: "#f472b6"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 390,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                                offset: "100%",
                                                                stopColor: "#ec4899"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 391,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                        lineNumber: 389,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                                        id: "selectedGradient",
                                                        x1: "0%",
                                                        y1: "0%",
                                                        x2: "100%",
                                                        y2: "100%",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                                offset: "0%",
                                                                stopColor: "#ff6b47"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 395,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                                offset: "100%",
                                                                stopColor: "#f59e0b"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 396,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                        lineNumber: 394,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                                        id: "edgeGradient",
                                                        x1: "0%",
                                                        y1: "0%",
                                                        x2: "0%",
                                                        y2: "100%",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                                offset: "0%",
                                                                stopColor: "#d4d4d4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 400,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                                offset: "100%",
                                                                stopColor: "#a3a3a3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 401,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                        lineNumber: 399,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                lineNumber: 377,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                transform: transform,
                                                children: [
                                                    edges.map((edge)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            d: edge.pathData || '',
                                                            fill: "none",
                                                            stroke: "url(#edgeGradient)",
                                                            strokeWidth: 2.5,
                                                            className: "transition-colors",
                                                            strokeLinecap: "round"
                                                        }, edge.id, false, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                            lineNumber: 408,
                                                            columnNumber: 21
                                                        }, this)),
                                                    nodes.map((node)=>{
                                                        if (node.type === 'person') {
                                                            const data = node.data;
                                                            const isSelected = selectedNodeId === node.id;
                                                            const gradientId = isSelected ? 'selectedGradient' : data.gender === 'male' ? 'maleGradient' : 'femaleGradient';
                                                            const personRole = getPersonRole(data.personId);
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                                transform: `translate(${node.x - node.width / 2}, ${node.y - node.height / 2})`,
                                                                onClick: ()=>handleNodeClick(node),
                                                                className: "cursor-pointer transition-transform hover:scale-105",
                                                                style: {
                                                                    transformOrigin: 'center'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                        width: node.width,
                                                                        height: node.height,
                                                                        rx: 16,
                                                                        fill: "white",
                                                                        filter: "url(#shadow)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                        lineNumber: 436,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                        width: node.width,
                                                                        height: node.height,
                                                                        rx: 16,
                                                                        fill: "none",
                                                                        stroke: `url(#${gradientId})`,
                                                                        strokeWidth: isSelected ? 3 : 2,
                                                                        className: "transition-all"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                        lineNumber: 444,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    !data.isLiving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                        x1: 0,
                                                                        y1: 0,
                                                                        x2: node.width,
                                                                        y2: node.height,
                                                                        stroke: "#9ca3af",
                                                                        strokeWidth: 1,
                                                                        opacity: 0.4
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                        lineNumber: 455,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    personRole && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                                x: node.width / 2 - 30,
                                                                                y: -10,
                                                                                width: 60,
                                                                                height: 18,
                                                                                rx: 9,
                                                                                fill: personRole === 'Me' ? '#ff6b47' : data.gender === 'male' ? '#3b82f6' : '#ec4899'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                                lineNumber: 468,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                                                x: node.width / 2,
                                                                                y: 3,
                                                                                textAnchor: "middle",
                                                                                fontSize: 10,
                                                                                fontWeight: 600,
                                                                                fill: "white",
                                                                                children: personRole
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                                lineNumber: 476,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                        cx: node.width / 2,
                                                                        cy: 35,
                                                                        r: 22,
                                                                        fill: `url(#${data.gender === 'male' ? 'maleGradient' : 'femaleGradient'})`,
                                                                        opacity: 0.15
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                        lineNumber: 489,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                        cx: node.width / 2,
                                                                        cy: 35,
                                                                        r: 20,
                                                                        fill: `url(#${data.gender === 'male' ? 'maleGradient' : 'femaleGradient'})`,
                                                                        opacity: 0.2
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                        lineNumber: 496,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                                        x: node.width / 2,
                                                                        y: 40,
                                                                        textAnchor: "middle",
                                                                        fontSize: 14,
                                                                        fontWeight: 700,
                                                                        fill: data.gender === 'male' ? '#1e40af' : '#9d174d',
                                                                        children: [
                                                                            data.firstName?.[0] || '',
                                                                            data.lastName?.[0] || ''
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                        lineNumber: 504,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                                        x: node.width / 2,
                                                                        y: 68,
                                                                        textAnchor: "middle",
                                                                        fontSize: 12,
                                                                        fontWeight: 600,
                                                                        fill: "#1f2937",
                                                                        children: data.firstName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                        lineNumber: 515,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                                        x: node.width / 2,
                                                                        y: 83,
                                                                        textAnchor: "middle",
                                                                        fontSize: 10,
                                                                        fill: "#6b7280",
                                                                        children: data.lastName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                        lineNumber: 525,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    data.birthDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                                        x: node.width / 2,
                                                                        y: 96,
                                                                        textAnchor: "middle",
                                                                        fontSize: 9,
                                                                        fill: "#9ca3af",
                                                                        children: [
                                                                            data.birthDate.split('-')[0],
                                                                            !data.isLiving && ' †'
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                        lineNumber: 536,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, node.id, true, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 428,
                                                                columnNumber: 25
                                                            }, this);
                                                        }
                                                        if (node.type === 'union') {
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                        cx: node.x,
                                                                        cy: node.y,
                                                                        r: node.width / 2 + 2,
                                                                        fill: "url(#selectedGradient)",
                                                                        opacity: 0.3
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                        lineNumber: 554,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                        cx: node.x,
                                                                        cy: node.y,
                                                                        r: node.width / 2,
                                                                        fill: "#f5f5f5",
                                                                        stroke: "#d4d4d4",
                                                                        strokeWidth: 1.5
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                        lineNumber: 561,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, node.id, true, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 553,
                                                                columnNumber: 25
                                                            }, this);
                                                        }
                                                        return null;
                                                    })
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                lineNumber: 405,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                        lineNumber: 376,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 366,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-4 right-4 flex gap-2 glass rounded-xl p-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "sm",
                                            onClick: handleZoomOut,
                                            className: "hover:bg-white/50",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MinusIcon, {}, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                lineNumber: 582,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 581,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "sm",
                                            onClick: handleZoomIn,
                                            className: "hover:bg-white/50",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PlusSmallIcon, {}, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                lineNumber: 585,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 584,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-px bg-neutral-200 my-1"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 587,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "ghost",
                                            size: "sm",
                                            onClick: handleFitToScreen,
                                            className: "hover:bg-white/50",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FitIcon, {}, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                lineNumber: 589,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 588,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 580,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-4 left-4 glass px-3 py-1.5 rounded-lg",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-medium text-neutral-600",
                                        children: [
                                            Math.round(viewport.scale * 100),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                        lineNumber: 595,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 594,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                            lineNumber: 364,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                        lineNumber: 362,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabContent"], {
                        value: "genogram",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                            variant: "bordered",
                            padding: "none",
                            className: "h-[calc(100vh-280px)] min-h-[500px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50/30",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GenogramIcon, {
                                                className: "w-10 h-10 text-primary-500"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                lineNumber: 607,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 606,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-neutral-800 mb-2",
                                            children: "Medical Genogram"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 609,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-neutral-500 max-w-sm mx-auto mb-6",
                                            children: "Visualize family tree with hereditary medical conditions."
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 612,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/tree/genogram",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                children: "View Full Genogram"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                lineNumber: 616,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 615,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 605,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 604,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                            lineNumber: 603,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                        lineNumber: 602,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabContent"], {
                        value: "list",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                            variant: "bordered",
                            padding: "lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: nodes.filter((n)=>n.type === 'person').map((node, index)=>{
                                    const data = node.data;
                                    const personRole = getPersonRole(data.personId);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleNodeClick(node),
                                        className: "w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent border border-transparent hover:border-primary-100 transition-all text-left group animate-slide-up",
                                        style: {
                                            animationDelay: `${index * 50}ms`
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Avatar"], {
                                                name: `${data.firstName} ${data.lastName}`,
                                                size: "md",
                                                ringColor: "primary"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                lineNumber: 638,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-medium text-neutral-900 group-hover:text-primary-700 transition-colors",
                                                                children: [
                                                                    data.firstName,
                                                                    " ",
                                                                    data.lastName
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 641,
                                                                columnNumber: 27
                                                            }, this),
                                                            personRole && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `px-2 py-0.5 text-xs font-medium rounded-full text-white ${personRole === 'Me' ? 'bg-primary-500' : data.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'}`,
                                                                children: personRole
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 645,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                        lineNumber: 640,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-neutral-500",
                                                        children: [
                                                            data.birthDate?.split('-')[0],
                                                            !data.isLiving && ' - Deceased'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                        lineNumber: 651,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                lineNumber: 639,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "opacity-0 group-hover:opacity-100 transition-opacity",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ChevronRightIcon, {}, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                    lineNumber: 657,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                lineNumber: 656,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, node.id, true, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                        lineNumber: 632,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 625,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                            lineNumber: 624,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                        lineNumber: 623,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 349,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-neutral-400 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MouseIcon, {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                        lineNumber: 671,
                                        columnNumber: 13
                                    }, this),
                                    "Drag to pan"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 670,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-neutral-300",
                                children: "·"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 674,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "inline-flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ScrollIcon, {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                        lineNumber: 676,
                                        columnNumber: 13
                                    }, this),
                                    "Scroll to zoom"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 675,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                        lineNumber: 669,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DownloadIcon, {}, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 681,
                                    columnNumber: 55
                                }, void 0),
                                children: "Export"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 681,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ShareIcon, {}, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 684,
                                    columnNumber: 55
                                }, void 0),
                                children: "Share"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 684,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                        lineNumber: 680,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 668,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isAddModalOpen,
                onClose: ()=>setIsAddModalOpen(false),
                className: "max-h-[85vh] flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                        title: "Add Family Member",
                        onClose: ()=>setIsAddModalOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                        lineNumber: 692,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
                        className: "overflow-y-auto flex-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-semibold text-neutral-800 mb-2",
                                            children: "Relationship Type *"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 697,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none",
                                            value: newPerson.relationshipType,
                                            onChange: (e)=>{
                                                const relType = e.target.value;
                                                // Auto-set gender based on relationship type
                                                let autoGender = newPerson.gender;
                                                if ([
                                                    'father',
                                                    'grandfather_paternal',
                                                    'grandfather_maternal',
                                                    'son',
                                                    'brother',
                                                    'uncle'
                                                ].includes(relType)) {
                                                    autoGender = 'male';
                                                } else if ([
                                                    'mother',
                                                    'grandmother_paternal',
                                                    'grandmother_maternal',
                                                    'daughter',
                                                    'sister',
                                                    'aunt'
                                                ].includes(relType)) {
                                                    autoGender = 'female';
                                                }
                                                setNewPerson({
                                                    ...newPerson,
                                                    relationshipType: relType,
                                                    gender: autoGender,
                                                    relatedToPersonId: relType === 'self' ? '' : rootPerson?.id || ''
                                                });
                                            },
                                            children: persons.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "self",
                                                children: "Myself (create root person)"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                lineNumber: 721,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        disabled: true,
                                                        children: "Select relationship"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                        lineNumber: 724,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("optgroup", {
                                                        label: "Immediate Family",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "father",
                                                                children: "Father"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 726,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "mother",
                                                                children: "Mother"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 727,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "spouse",
                                                                children: "Spouse"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 728,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "son",
                                                                children: "Son"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 729,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "daughter",
                                                                children: "Daughter"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 730,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "brother",
                                                                children: "Brother"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 731,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "sister",
                                                                children: "Sister"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 732,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                        lineNumber: 725,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("optgroup", {
                                                        label: "Grandparents",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "grandfather_paternal",
                                                                children: "Paternal Grandfather"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 735,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "grandmother_paternal",
                                                                children: "Paternal Grandmother"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 736,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "grandfather_maternal",
                                                                children: "Maternal Grandfather"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 737,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "grandmother_maternal",
                                                                children: "Maternal Grandmother"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 738,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                        lineNumber: 734,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("optgroup", {
                                                        label: "Other Relatives",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "uncle",
                                                                children: "Uncle"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 741,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "aunt",
                                                                children: "Aunt"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 742,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "cousin",
                                                                children: "Cousin"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                                lineNumber: 743,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                        lineNumber: 740,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 700,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 696,
                                    columnNumber: 13
                                }, this),
                                newPerson.relationshipType !== 'self' && persons.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-neutral-700 mb-1.5",
                                            children: "Related to *"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 753,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: newPerson.relatedToPersonId,
                                            onChange: (e)=>setNewPerson({
                                                    ...newPerson,
                                                    relatedToPersonId: e.target.value
                                                }),
                                            className: "w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "Select person..."
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                    lineNumber: 761,
                                                    columnNumber: 19
                                                }, this),
                                                persons.map((person)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: person.id,
                                                        children: [
                                                            person.firstName,
                                                            " ",
                                                            person.lastName || ''
                                                        ]
                                                    }, person.id, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                        lineNumber: 763,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 756,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-neutral-500 mt-1",
                                            children: "Select the person you want to add this relative to"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 768,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 752,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-t border-neutral-100 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3",
                                            children: "Personal Details"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 775,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                    label: "First Name",
                                                    value: newPerson.firstName,
                                                    onChange: (e)=>setNewPerson({
                                                            ...newPerson,
                                                            firstName: e.target.value
                                                        }),
                                                    placeholder: "John",
                                                    required: true,
                                                    fullWidth: true
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                    lineNumber: 778,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                    label: "Last Name",
                                                    value: newPerson.lastName,
                                                    onChange: (e)=>setNewPerson({
                                                            ...newPerson,
                                                            lastName: e.target.value
                                                        }),
                                                    placeholder: "Doe",
                                                    fullWidth: true
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                    lineNumber: 786,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 777,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 774,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-neutral-700 mb-1.5",
                                                    children: "Género"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                    lineNumber: 798,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: newPerson.gender,
                                                    onChange: (e)=>setNewPerson({
                                                            ...newPerson,
                                                            gender: e.target.value
                                                        }),
                                                    className: "w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "male",
                                                            children: "Male"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                            lineNumber: 806,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "female",
                                                            children: "Female"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                            lineNumber: 807,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "other",
                                                            children: "Other"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                            lineNumber: 808,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                    lineNumber: 801,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 797,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                            label: "Birth Date",
                                            type: "date",
                                            value: newPerson.birthDate,
                                            onChange: (e)=>setNewPerson({
                                                    ...newPerson,
                                                    birthDate: e.target.value
                                                }),
                                            fullWidth: true
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 812,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                            label: "Birth Place",
                                            value: newPerson.birthPlace,
                                            onChange: (e)=>setNewPerson({
                                                    ...newPerson,
                                                    birthPlace: e.target.value
                                                }),
                                            placeholder: "City, Country",
                                            required: true,
                                            fullWidth: true,
                                            className: "col-span-2"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 819,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 796,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "flex items-center gap-2 cursor-pointer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: newPerson.isLiving,
                                            onChange: (e)=>setNewPerson({
                                                    ...newPerson,
                                                    isLiving: e.target.checked
                                                }),
                                            className: "w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 831,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-neutral-700",
                                            children: "Living Person"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 837,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 830,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-t border-neutral-100 pt-4 mt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3",
                                            children: "Medical Conditions (Family History)"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 842,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-neutral-400 mb-3",
                                            children: "Select known medical conditions for the genogram"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 845,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-2",
                                            children: COMMON_MEDICAL_CONDITIONS.map((condition)=>{
                                                const isSelected = newPerson.medicalConditions.some((c)=>c.id === condition.id);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: `flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-primary-50 border-primary-300 text-primary-800' : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: isSelected,
                                                            onChange: (e)=>{
                                                                if (e.target.checked) {
                                                                    setNewPerson({
                                                                        ...newPerson,
                                                                        medicalConditions: [
                                                                            ...newPerson.medicalConditions,
                                                                            {
                                                                                id: condition.id,
                                                                                name: condition.name
                                                                            }
                                                                        ]
                                                                    });
                                                                } else {
                                                                    setNewPerson({
                                                                        ...newPerson,
                                                                        medicalConditions: newPerson.medicalConditions.filter((c)=>c.id !== condition.id)
                                                                    });
                                                                }
                                                            },
                                                            className: "w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                            lineNumber: 859,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm",
                                                            children: [
                                                                condition.icon,
                                                                " ",
                                                                condition.name
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                            lineNumber: 880,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, condition.id, true, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                    lineNumber: 852,
                                                    columnNumber: 21
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 848,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 841,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-t border-neutral-100 pt-4 mt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "flex items-center gap-2 cursor-pointer mb-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: newPerson.sendInvitation,
                                                    onChange: (e)=>setNewPerson({
                                                            ...newPerson,
                                                            sendInvitation: e.target.checked
                                                        }),
                                                    className: "w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                    lineNumber: 892,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm text-neutral-700",
                                                    children: "Send invitation to confirm kinship"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                    lineNumber: 898,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 891,
                                            columnNumber: 15
                                        }, this),
                                        newPerson.sendInvitation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-4 mb-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-primary-700 mb-3",
                                                    children: "A notification will be sent to confirm they are your relative and to connect their social networks."
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                    lineNumber: 903,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                    label: "Relative's Email",
                                                    type: "email",
                                                    value: newPerson.email,
                                                    onChange: (e)=>setNewPerson({
                                                            ...newPerson,
                                                            email: e.target.value
                                                        }),
                                                    placeholder: "relative@email.com",
                                                    fullWidth: true
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                                    lineNumber: 906,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 902,
                                            columnNumber: 17
                                        }, this),
                                        invitationError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-red-600 mb-2",
                                            children: invitationError
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                            lineNumber: 918,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                    lineNumber: 890,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                            lineNumber: 694,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                        lineNumber: 693,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 p-6 pt-4 border-t border-neutral-100 flex-shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                fullWidth: true,
                                onClick: ()=>setIsAddModalOpen(false),
                                disabled: isSubmitting,
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 925,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                fullWidth: true,
                                onClick: handleAddPerson,
                                loading: isSubmitting,
                                disabled: !newPerson.firstName.trim(),
                                children: "Add"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                                lineNumber: 933,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                        lineNumber: 924,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 691,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 319,
        columnNumber: 5
    }, this);
}
// Icons
function PlusIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-5 h-5",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 5v14M5 12h14"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 951,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 950,
        columnNumber: 5
    }, this);
}
function PlusSmallIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 5v14M5 12h14"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 959,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 958,
        columnNumber: 5
    }, this);
}
function MinusIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M5 12h14"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 967,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 966,
        columnNumber: 5
    }, this);
}
function TreeIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 22V8M12 8C9 8 6 5 6 2h12c0 3-3 6-6 6z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 975,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 22h6"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 976,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 974,
        columnNumber: 5
    }, this);
}
function GenogramIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-4 h-4',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "2",
                y: "2",
                width: "8",
                height: "8"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 984,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "18",
                cy: "6",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 985,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "2",
                y: "14",
                width: "8",
                height: "8"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 986,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "18",
                cy: "18",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 987,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10 6h4M6 10v4M18 10v4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 988,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 983,
        columnNumber: 5
    }, this);
}
function ListIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-4 h-4',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 996,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 995,
        columnNumber: 5
    }, this);
}
function FitIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 1004,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1003,
        columnNumber: 5
    }, this);
}
function DownloadIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 1012,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1011,
        columnNumber: 5
    }, this);
}
function ShareIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "18",
                cy: "5",
                r: "3"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1020,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "6",
                cy: "12",
                r: "3"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1021,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "18",
                cy: "19",
                r: "3"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1022,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1023,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1019,
        columnNumber: 5
    }, this);
}
function ChevronRightIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-5 h-5 text-primary-400",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M9 18l6-6-6-6"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 1031,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1030,
        columnNumber: 5
    }, this);
}
function UsersSmallIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-4 h-4',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1039,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "9",
                cy: "7",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1040,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1041,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1038,
        columnNumber: 5
    }, this);
}
function LayersIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-4 h-4',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                points: "12 2 2 7 12 12 22 7 12 2"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1049,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "2 17 12 22 22 17"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1050,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "2 12 12 17 22 12"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1051,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1048,
        columnNumber: 5
    }, this);
}
function MouseIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-4 h-4',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "6",
                y: "3",
                width: "12",
                height: "18",
                rx: "6"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1059,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 7v4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1060,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1058,
        columnNumber: 5
    }, this);
}
function ScrollIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-4 h-4',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 3v18M5 10l7-7 7 7M5 14l7 7 7-7"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 1068,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1067,
        columnNumber: 5
    }, this);
}
function BloodIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4 inline-block text-red-500",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 1076,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1075,
        columnNumber: 5
    }, this);
}
function HeartIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4 inline-block text-red-500",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 1084,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1083,
        columnNumber: 5
    }, this);
}
function HeartAnatomyIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4 inline-block text-red-600",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12.5 3.5v5M18.5 7v4M8.5 4v6M12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0-7.78-7.78L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23z"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 1092,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1091,
        columnNumber: 5
    }, this);
}
function RibbonIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4 inline-block text-purple-500",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 18s-7-5.5-7-10a5 5 0 0 1 10 0c0 4.5-7 10-7 10z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "m19 21-5-6M5 21l5-6"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1101,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1099,
        columnNumber: 5
    }, this);
}
function LungsIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4 inline-block text-blue-400",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 3v9M7 6v6a5 5 0 1 0 10 0V6"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 1109,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1108,
        columnNumber: 5
    }, this);
}
function BrainIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4 inline-block text-pink-400",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9.5 2h5M5 6.5a4.5 4.5 0 0 1 14 0c0 1.25-.5 2.5-1.5 3.5a4.5 4.5 0 0 1-5.5 1 4.5 4.5 0 0 1-5.5-1C5.5 9 5 7.75 5 6.5z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9.5 11v6a4.5 4.5 0 0 0 9 0M5.5 11v6a4.5 4.5 0 0 0 9 0"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1118,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1116,
        columnNumber: 5
    }, this);
}
function BoneIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4 inline-block text-orange-200",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17 10c.8-.8 2-.6 2.8.2.8.8.8 2 0 2.8l-1.4 1.4-2.8-2.8L17 10Z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M15.6 11.4 8.6 18.4M4.2 17c-.8.8-1 2-.2 2.8.8.8 2 1 2.8.2l1.4-1.4-2.8-2.8L4.2 17Z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1127,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M7 14c-.8-.8-2-.6-2.8.2-.8.8-.8 2 0 2.8l1.4-1.4 2.8 2.8L7 14Z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1128,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M19.8 7c.8-.8 1-2 .2-2.8C19.2 3.4 18 3.2 17.2 4l-1.4 1.4 2.8 2.8L19.8 7Z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
                lineNumber: 1129,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1125,
        columnNumber: 5
    }, this);
}
function ButterflyIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4 inline-block text-blue-500",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 2v20M8 6a4 4 0 0 1 8 0c0 2.5-4 6-4 6s-4-3.5-4-6M6 14a4 4 0 0 1 12 0c0 2.5-6 6-6 6s-6-3.5-6-6"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 1137,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1136,
        columnNumber: 5
    }, this);
}
function ScaleIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4 inline-block text-neutral-500",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 3v18M5 10l7-7 7 7M5 14l7 7 7-7"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
            lineNumber: 1145,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/page.tsx",
        lineNumber: 1144,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_cd47bb69._.js.map