'use client';

import type { MouseEvent } from 'react';
import type { GraphNode, PersonNodeData, RenderOptions } from '../types';

export interface PersonNodeProps {
  node: GraphNode;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isHovered?: boolean;
  options: RenderOptions;
  onClick?: (e: MouseEvent) => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: () => void;
}

export function PersonNode({
  node,
  isSelected = false,
  isHighlighted = false,
  isHovered = false,
  options,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: PersonNodeProps) {
  const data = node.data as PersonNodeData;
  const { width, height, x, y } = node;

  const isDeceased = !data.isLiving || !!data.deathDate;
  const fullName = `${data.firstName} ${data.lastName}`;
  const initials = `${data.firstName[0] || ''}${data.lastName[0] || ''}`.toUpperCase();

  // Calculate colors based on gender
  const genderColors = {
    male: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
    female: { bg: '#fce7f3', border: '#ec4899', text: '#9d174d' },
    other: { bg: '#e5e7eb', border: '#6b7280', text: '#374151' },
    unknown: { bg: '#e5e7eb', border: '#6b7280', text: '#374151' },
  };

  const colors = genderColors[data.gender];

  // Border and shadow styles based on state
  const strokeWidth = isSelected ? 3 : isHighlighted ? 2.5 : isHovered ? 2 : 1.5;
  const strokeColor = isSelected
    ? '#0ea5e9'
    : isHighlighted
    ? '#f59e0b'
    : colors.border;

  // Format dates
  const formatYear = (date?: string) => {
    if (!date) return '';
    return new Date(date).getFullYear().toString();
  };

  const birthYear = formatYear(data.birthDate);
  const deathYear = formatYear(data.deathDate);
  const dateDisplay = isDeceased
    ? `${birthYear}${birthYear && deathYear ? ' - ' : ''}${deathYear}`
    : birthYear;

  return (
    <g
      transform={`translate(${x - width / 2}, ${y - height / 2})`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'pointer' }}
      className={options.animationsEnabled ? 'transition-transform duration-200' : ''}
    >
      {/* Card background */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={12}
        ry={12}
        fill={isDeceased ? '#f5f5f5' : 'white'}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        filter="url(#node-shadow)"
        opacity={isDeceased && !options.showDeceased ? 0.5 : 1}
      />

      {/* Deceased overlay line */}
      {isDeceased && (
        <line
          x1={0}
          y1={0}
          x2={width}
          y2={height}
          stroke="#9ca3af"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      )}

      {/* Avatar circle */}
      <g transform={`translate(${16}, ${height / 2 - 24})`}>
        {options.showPhotos && data.photoUrl ? (
          <clipPath id={`avatar-clip-${node.id}`}>
            <circle cx={24} cy={24} r={24} />
          </clipPath>
        ) : null}

        <circle
          cx={24}
          cy={24}
          r={24}
          fill={colors.bg}
          stroke={colors.border}
          strokeWidth={2}
        />

        {options.showPhotos && data.photoUrl ? (
          <image
            href={data.photoUrl}
            x={0}
            y={0}
            width={48}
            height={48}
            clipPath={`url(#avatar-clip-${node.id})`}
            preserveAspectRatio="xMidYMid slice"
          />
        ) : (
          <text
            x={24}
            y={24}
            textAnchor="middle"
            dominantBaseline="central"
            fill={colors.text}
            fontSize={16}
            fontWeight={600}
          >
            {initials}
          </text>
        )}
      </g>

      {/* Name and info */}
      <g transform={`translate(${72}, ${20})`}>
        <text
          x={0}
          y={0}
          fill={isDeceased ? '#6b7280' : '#171717'}
          fontSize={14}
          fontWeight={600}
          dominantBaseline="hanging"
        >
          {truncateText(data.firstName, 12)}
        </text>
        <text
          x={0}
          y={18}
          fill={isDeceased ? '#9ca3af' : '#525252'}
          fontSize={13}
          dominantBaseline="hanging"
        >
          {truncateText(data.lastName, 14)}
        </text>

        {options.showDates && dateDisplay && (
          <text
            x={0}
            y={40}
            fill="#a3a3a3"
            fontSize={11}
            dominantBaseline="hanging"
          >
            {dateDisplay}
          </text>
        )}
      </g>

      {/* Gender indicator */}
      <GenderIndicator
        gender={data.gender}
        x={width - 20}
        y={12}
      />

      {/* Medical condition indicators */}
      {options.showMedicalIcons && data.medicalConditions && data.medicalConditions.length > 0 && (
        <g transform={`translate(${width - 36}, ${height - 24})`}>
          <MedicalIndicator conditions={data.medicalConditions} />
        </g>
      )}

      {/* Selection/highlight ring */}
      {(isSelected || isHighlighted) && (
        <rect
          x={-4}
          y={-4}
          width={width + 8}
          height={height + 8}
          rx={16}
          ry={16}
          fill="none"
          stroke={isSelected ? '#0ea5e9' : '#f59e0b'}
          strokeWidth={2}
          strokeDasharray={isHighlighted && !isSelected ? '4 2' : 'none'}
          opacity={0.5}
        />
      )}
    </g>
  );
}

function GenderIndicator({ gender, x, y }: { gender: string; x: number; y: number }) {
  const size = 12;

  if (gender === 'male') {
    // Square for male
    return (
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={2}
      />
    );
  }

  if (gender === 'female') {
    // Circle for female
    return (
      <circle
        cx={x + size / 2}
        cy={y + size / 2}
        r={size / 2}
        fill="none"
        stroke="#ec4899"
        strokeWidth={2}
      />
    );
  }

  // Diamond for other
  return (
    <polygon
      points={`${x + size / 2},${y} ${x + size},${y + size / 2} ${x + size / 2},${y + size} ${x},${y + size / 2}`}
      fill="none"
      stroke="#6b7280"
      strokeWidth={2}
    />
  );
}

function MedicalIndicator({
  conditions,
}: {
  conditions: Array<{ category: string }>;
}) {
  const count = conditions.length;

  return (
    <g>
      <circle
        cx={12}
        cy={12}
        r={10}
        fill="#fef3c7"
        stroke="#f59e0b"
        strokeWidth={1.5}
      />
      <text
        x={12}
        y={12}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#92400e"
        fontSize={10}
        fontWeight={600}
      >
        {count}
      </text>
    </g>
  );
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '...';
}
