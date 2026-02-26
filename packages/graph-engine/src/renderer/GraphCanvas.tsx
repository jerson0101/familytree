'use client';

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
  type MouseEvent,
  type WheelEvent,
  type TouchEvent,
} from 'react';
import type {
  GraphNode,
  GraphEdge,
  Viewport,
  Bounds,
  NodeInteraction,
  RenderOptions,
} from '../types';
import { ZOOM_LIMITS } from '../types';
import { PersonNode } from './PersonNode';
import { UnionNode } from './UnionNode';
import { EdgeRenderer } from './EdgeRenderer';

export interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  bounds: Bounds;
  viewport: Viewport;
  onViewportChange: (viewport: Viewport) => void;
  onNodeClick?: (interaction: NodeInteraction) => void;
  onNodeHover?: (interaction: NodeInteraction | null) => void;
  options?: Partial<RenderOptions>;
  className?: string;
  children?: ReactNode;
}

const DEFAULT_OPTIONS: RenderOptions = {
  showPhotos: true,
  showDates: true,
  showMedicalIcons: false,
  showDeceased: true,
  animationsEnabled: true,
};

export function GraphCanvas({
  nodes,
  edges,
  bounds,
  viewport,
  onViewportChange,
  onNodeClick,
  onNodeHover,
  options = {},
  className = '',
  children,
}: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<{ x: number; y: number } | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const renderOptions = { ...DEFAULT_OPTIONS, ...options };

  // Handle container resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        onViewportChange({ ...viewport, width, height });
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [viewport, onViewportChange]);

  // Pan handlers
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isPanning || !lastPanPoint) return;

      const dx = e.clientX - lastPanPoint.x;
      const dy = e.clientY - lastPanPoint.y;

      onViewportChange({
        ...viewport,
        x: viewport.x - dx / viewport.scale,
        y: viewport.y - dy / viewport.scale,
      });

      setLastPanPoint({ x: e.clientX, y: e.clientY });
    },
    [isPanning, lastPanPoint, viewport, onViewportChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setLastPanPoint(null);
  }, []);

  // Zoom handler
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate zoom
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(
        Math.max(viewport.scale * delta, ZOOM_LIMITS.min),
        ZOOM_LIMITS.max
      );

      // Zoom towards mouse position
      const scaleRatio = newScale / viewport.scale;
      const newX = viewport.x + (mouseX / viewport.scale) * (1 - 1 / scaleRatio);
      const newY = viewport.y + (mouseY / viewport.scale) * (1 - 1 / scaleRatio);

      onViewportChange({
        ...viewport,
        x: newX,
        y: newY,
        scale: newScale,
      });
    },
    [viewport, onViewportChange]
  );

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      setIsPanning(true);
      setLastPanPoint({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPanning || !lastPanPoint || e.touches.length !== 1) return;

      const dx = e.touches[0].clientX - lastPanPoint.x;
      const dy = e.touches[0].clientY - lastPanPoint.y;

      onViewportChange({
        ...viewport,
        x: viewport.x - dx / viewport.scale,
        y: viewport.y - dy / viewport.scale,
      });

      setLastPanPoint({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    },
    [isPanning, lastPanPoint, viewport, onViewportChange]
  );

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
    setLastPanPoint(null);
  }, []);

  // Node interaction handlers
  const handleNodeClick = useCallback(
    (node: GraphNode, e: MouseEvent) => {
      e.stopPropagation();
      onNodeClick?.({
        nodeId: node.id,
        type: 'click',
        position: { x: e.clientX, y: e.clientY },
        originalEvent: e.nativeEvent,
      });
    },
    [onNodeClick]
  );

  const handleNodeHover = useCallback(
    (node: GraphNode | null, e?: MouseEvent) => {
      setHoveredNodeId(node?.id ?? null);
      if (node && e) {
        onNodeHover?.({
          nodeId: node.id,
          type: 'hover',
          position: { x: e.clientX, y: e.clientY },
          originalEvent: e.nativeEvent,
        });
      } else {
        onNodeHover?.(null);
      }
    },
    [onNodeHover]
  );

  // Calculate transform
  const transform = `translate(${viewport.width / 2 - viewport.x * viewport.scale}, ${
    viewport.height / 2 - viewport.y * viewport.scale
  }) scale(${viewport.scale})`;

  // Viewport culling - only render visible nodes
  const visibleNodes = nodes.filter((node) => {
    const screenX = (node.x - viewport.x) * viewport.scale + viewport.width / 2;
    const screenY = (node.y - viewport.y) * viewport.scale + viewport.height / 2;
    const margin = Math.max(node.width, node.height) * viewport.scale;

    return (
      screenX > -margin &&
      screenX < viewport.width + margin &&
      screenY > -margin &&
      screenY < viewport.height + margin
    );
  });

  // Filter edges to only those connected to visible nodes
  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = edges.filter(
    (edge) =>
      visibleNodeIds.has(edge.sourceId) || visibleNodeIds.has(edge.targetId)
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-neutral-50 ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
    >
      <svg
        ref={svgRef}
        width={viewport.width}
        height={viewport.height}
        className="absolute inset-0"
      >
        <defs>
          {/* Drop shadow filter */}
          <filter id="node-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="4"
              floodColor="#000"
              floodOpacity="0.1"
            />
          </filter>

          {/* Gradient for edges */}
          <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a3a3a3" />
            <stop offset="100%" stopColor="#d4d4d4" />
          </linearGradient>
        </defs>

        <g transform={transform}>
          {/* Render edges first (below nodes) */}
          {visibleEdges.map((edge) => (
            <EdgeRenderer key={edge.id} edge={edge} />
          ))}

          {/* Render nodes */}
          {visibleNodes.map((node) => {
            const isSelected = options.selectedNodeId === node.id;
            const isHighlighted = options.highlightedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;

            if (node.type === 'person') {
              return (
                <PersonNode
                  key={node.id}
                  node={node}
                  isSelected={isSelected}
                  isHighlighted={isHighlighted}
                  isHovered={isHovered}
                  options={renderOptions}
                  onClick={(e) => handleNodeClick(node, e)}
                  onMouseEnter={(e) => handleNodeHover(node, e)}
                  onMouseLeave={() => handleNodeHover(null)}
                />
              );
            }

            if (node.type === 'union') {
              return (
                <UnionNode
                  key={node.id}
                  node={node}
                  isSelected={isSelected}
                  onClick={(e) => handleNodeClick(node, e)}
                />
              );
            }

            return null;
          })}
        </g>
      </svg>

      {children}
    </div>
  );
}
