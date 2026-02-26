'use client';

import type { MouseEvent } from 'react';
import type { GraphNode, UnionNodeData } from '../types';

export interface UnionNodeProps {
  node: GraphNode;
  isSelected?: boolean;
  onClick?: (e: MouseEvent) => void;
}

export function UnionNode({ node, isSelected = false, onClick }: UnionNodeProps) {
  const data = node.data as UnionNodeData;
  const { width, height, x, y } = node;

  // Color based on union type
  const getUnionStyle = () => {
    switch (data.unionType) {
      case 'marriage':
        return { fill: '#22c55e', stroke: '#16a34a' };
      case 'partnership':
        return { fill: '#3b82f6', stroke: '#2563eb' };
      case 'divorced':
        return { fill: '#ef4444', stroke: '#dc2626' };
      case 'separated':
        return { fill: '#f59e0b', stroke: '#d97706' };
      default:
        return { fill: '#6b7280', stroke: '#4b5563' };
    }
  };

  const style = getUnionStyle();
  const radius = width / 2;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Union circle */}
      <circle
        cx={0}
        cy={0}
        r={radius}
        fill={style.fill}
        stroke={isSelected ? '#0ea5e9' : style.stroke}
        strokeWidth={isSelected ? 3 : 2}
      />

      {/* Union type indicator */}
      <UnionTypeIndicator type={data.unionType} radius={radius} />

      {/* Selection ring */}
      {isSelected && (
        <circle
          cx={0}
          cy={0}
          r={radius + 4}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth={2}
          opacity={0.5}
        />
      )}
    </g>
  );
}

function UnionTypeIndicator({
  type,
  radius,
}: {
  type: string;
  radius: number;
}) {
  const iconSize = radius * 0.8;

  switch (type) {
    case 'marriage':
      // Heart or rings icon
      return (
        <g transform={`translate(${-iconSize / 2}, ${-iconSize / 2})`}>
          <path
            d={`M${iconSize / 2} ${iconSize * 0.3}
                C${iconSize * 0.2} 0, 0 ${iconSize * 0.3}, ${iconSize / 2} ${iconSize * 0.8}
                C${iconSize} ${iconSize * 0.3}, ${iconSize * 0.8} 0, ${iconSize / 2} ${iconSize * 0.3}`}
            fill="white"
            stroke="none"
          />
        </g>
      );

    case 'divorced':
      // X mark
      return (
        <g>
          <line
            x1={-iconSize / 2}
            y1={-iconSize / 2}
            x2={iconSize / 2}
            y2={iconSize / 2}
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <line
            x1={iconSize / 2}
            y1={-iconSize / 2}
            x2={-iconSize / 2}
            y2={iconSize / 2}
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>
      );

    case 'separated':
      // Single line
      return (
        <line
          x1={-iconSize / 2}
          y1={0}
          x2={iconSize / 2}
          y2={0}
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
        />
      );

    case 'partnership':
      // Two dots
      return (
        <g>
          <circle cx={-iconSize / 4} cy={0} r={iconSize / 5} fill="white" />
          <circle cx={iconSize / 4} cy={0} r={iconSize / 5} fill="white" />
        </g>
      );

    default:
      return null;
  }
}
