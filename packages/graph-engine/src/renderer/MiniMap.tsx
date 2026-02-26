'use client';

import type { GraphNode, Viewport, Bounds } from '../types';

export interface MiniMapProps {
  nodes: GraphNode[];
  bounds: Bounds;
  viewport: Viewport;
  onViewportChange: (viewport: Viewport) => void;
  width?: number;
  height?: number;
  className?: string;
}

export function MiniMap({
  nodes,
  bounds,
  viewport,
  onViewportChange,
  width = 200,
  height = 150,
  className = '',
}: MiniMapProps) {
  // Calculate scale to fit bounds in minimap
  const padding = 10;
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;

  const scaleX = bounds.width > 0 ? availableWidth / bounds.width : 1;
  const scaleY = bounds.height > 0 ? availableHeight / bounds.height : 1;
  const scale = Math.min(scaleX, scaleY, 1);

  // Calculate viewport rectangle in minimap coordinates
  const viewportRect = {
    x: padding + ((viewport.x - bounds.minX) * scale),
    y: padding + ((viewport.y - bounds.minY) * scale),
    width: (viewport.width / viewport.scale) * scale,
    height: (viewport.height / viewport.scale) * scale,
  };

  // Handle click on minimap to pan
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert click to graph coordinates
    const graphX = bounds.minX + (clickX - padding) / scale;
    const graphY = bounds.minY + (clickY - padding) / scale;

    onViewportChange({
      ...viewport,
      x: graphX,
      y: graphY,
    });
  };

  return (
    <div
      className={`absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden ${className}`}
    >
      <svg
        width={width}
        height={height}
        onClick={handleClick}
        style={{ cursor: 'crosshair' }}
      >
        {/* Background */}
        <rect x={0} y={0} width={width} height={height} fill="#fafafa" />

        {/* Nodes */}
        <g transform={`translate(${padding - bounds.minX * scale}, ${padding - bounds.minY * scale}) scale(${scale})`}>
          {nodes.map((node) => {
            const nodeColor = node.type === 'person'
              ? (node.data as any).gender === 'male'
                ? '#3b82f6'
                : (node.data as any).gender === 'female'
                ? '#ec4899'
                : '#6b7280'
              : '#22c55e';

            return (
              <rect
                key={node.id}
                x={node.x - node.width / 2}
                y={node.y - node.height / 2}
                width={node.width}
                height={node.height}
                rx={node.type === 'person' ? 4 : node.width / 2}
                fill={nodeColor}
                opacity={0.7}
              />
            );
          })}
        </g>

        {/* Viewport indicator */}
        <rect
          x={viewportRect.x}
          y={viewportRect.y}
          width={Math.max(viewportRect.width, 20)}
          height={Math.max(viewportRect.height, 15)}
          fill="rgba(14, 165, 233, 0.2)"
          stroke="#0ea5e9"
          strokeWidth={2}
          rx={2}
        />

        {/* Border */}
        <rect
          x={0.5}
          y={0.5}
          width={width - 1}
          height={height - 1}
          fill="none"
          stroke="#e5e5e5"
          rx={8}
        />
      </svg>
    </div>
  );
}
