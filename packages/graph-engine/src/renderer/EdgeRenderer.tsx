'use client';

import type { GraphEdge } from '../types';

export interface EdgeRendererProps {
  edge: GraphEdge;
  isHighlighted?: boolean;
  color?: string;
}

export function EdgeRenderer({
  edge,
  isHighlighted = false,
  color,
}: EdgeRendererProps) {
  const strokeColor = color || (isHighlighted ? '#0ea5e9' : '#d4d4d4');
  const strokeWidth = isHighlighted ? 2.5 : 2;

  return (
    <g>
      <path
        d={edge.pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-200"
      />
    </g>
  );
}

/**
 * Render multiple edges with the same styling
 */
export function EdgeGroup({
  edges,
  isHighlighted = false,
  color,
}: {
  edges: GraphEdge[];
  isHighlighted?: boolean;
  color?: string;
}) {
  return (
    <g>
      {edges.map((edge) => (
        <EdgeRenderer
          key={edge.id}
          edge={edge}
          isHighlighted={isHighlighted}
          color={color}
        />
      ))}
    </g>
  );
}
