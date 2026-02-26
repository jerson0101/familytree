'use client';

import { forwardRef, type SVGAttributes } from 'react';
import { cn } from '../utils/cn';

export interface GenogramSymbolProps extends SVGAttributes<SVGSVGElement> {
  size?: number;
  filled?: boolean;
  deceased?: boolean;
}

/**
 * Male symbol - Square
 */
export const MaleSymbol = forwardRef<SVGSVGElement, GenogramSymbolProps>(
  ({ className, size = 24, filled = false, deceased = false, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={cn('shrink-0', className)}
        {...props}
      >
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          fill={filled ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
        />
        {deceased && (
          <line
            x1="2"
            y1="2"
            x2="22"
            y2="22"
            stroke="currentColor"
            strokeWidth="2"
          />
        )}
      </svg>
    );
  }
);

MaleSymbol.displayName = 'MaleSymbol';

/**
 * Female symbol - Circle
 */
export const FemaleSymbol = forwardRef<SVGSVGElement, GenogramSymbolProps>(
  ({ className, size = 24, filled = false, deceased = false, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={cn('shrink-0', className)}
        {...props}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill={filled ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
        />
        {deceased && (
          <line
            x1="2"
            y1="2"
            x2="22"
            y2="22"
            stroke="currentColor"
            strokeWidth="2"
          />
        )}
      </svg>
    );
  }
);

FemaleSymbol.displayName = 'FemaleSymbol';

/**
 * Unknown/Other gender symbol - Diamond
 */
export const UnknownGenderSymbol = forwardRef<SVGSVGElement, GenogramSymbolProps>(
  ({ className, size = 24, filled = false, deceased = false, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={cn('shrink-0', className)}
        {...props}
      >
        <polygon
          points="12,2 22,12 12,22 2,12"
          fill={filled ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
        />
        {deceased && (
          <line
            x1="2"
            y1="2"
            x2="22"
            y2="22"
            stroke="currentColor"
            strokeWidth="2"
          />
        )}
      </svg>
    );
  }
);

UnknownGenderSymbol.displayName = 'UnknownGenderSymbol';

/**
 * Deceased marker overlay
 */
export const DeceasedMarker = forwardRef<SVGSVGElement, { size?: number; className?: string }>(
  ({ className, size = 24, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={cn('shrink-0', className)}
        {...props}
      >
        <line
          x1="2"
          y1="2"
          x2="22"
          y2="22"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }
);

DeceasedMarker.displayName = 'DeceasedMarker';

/**
 * Medical condition icons
 */
export interface MedicalIconProps extends SVGAttributes<SVGSVGElement> {
  size?: number;
  condition: 'cardiovascular' | 'cancer' | 'metabolic' | 'neurological' | 'mental_health' | 'autoimmune' | 'genetic';
}

const conditionColors = {
  cardiovascular: '#ef4444', // red
  cancer: '#8b5cf6', // purple
  metabolic: '#f59e0b', // amber
  neurological: '#3b82f6', // blue
  mental_health: '#10b981', // emerald
  autoimmune: '#ec4899', // pink
  genetic: '#6366f1', // indigo
};

const conditionSymbols = {
  cardiovascular: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z', // heart
  cancer: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z', // star
  metabolic: 'M12 2v20M2 12h20', // plus
  neurological: 'M12 2a10 10 0 1010 10A10 10 0 0012 2z', // circle
  mental_health: 'M9 9h6v6H9z', // square
  autoimmune: 'M12 2l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z', // shield
  genetic: 'M12 2C8 2 4 6 4 12s4 10 8 10 8-4 8-10S16 2 12 2zM4 12h16', // DNA simplified
};

export const MedicalIcon = forwardRef<SVGSVGElement, MedicalIconProps>(
  ({ className, size = 16, condition, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={conditionColors[condition]}
        className={cn('shrink-0', className)}
        {...props}
      >
        <path d={conditionSymbols[condition]} />
      </svg>
    );
  }
);

MedicalIcon.displayName = 'MedicalIcon';

/**
 * Relationship line types
 */
export interface RelationshipLineProps extends SVGAttributes<SVGSVGElement> {
  type: 'marriage' | 'divorced' | 'separated' | 'partnership' | 'engaged';
  length?: number;
}

export const RelationshipLine = forwardRef<SVGSVGElement, RelationshipLineProps>(
  ({ className, type, length = 40, ...props }, ref) => {
    const renderLine = () => {
      switch (type) {
        case 'marriage':
          return <line x1="0" y1="12" x2={length} y2="12" stroke="currentColor" strokeWidth="2" />;
        case 'divorced':
          return (
            <>
              <line x1="0" y1="12" x2={length} y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1={length / 2 - 4} y1="6" x2={length / 2 + 4} y2="18" stroke="currentColor" strokeWidth="2" />
              <line x1={length / 2} y1="6" x2={length / 2 + 8} y2="18" stroke="currentColor" strokeWidth="2" />
            </>
          );
        case 'separated':
          return (
            <>
              <line x1="0" y1="12" x2={length} y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1={length / 2} y1="6" x2={length / 2} y2="18" stroke="currentColor" strokeWidth="2" />
            </>
          );
        case 'partnership':
          return (
            <line
              x1="0"
              y1="12"
              x2={length}
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
          );
        case 'engaged':
          return (
            <line
              x1="0"
              y1="12"
              x2={length}
              y2="12"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="8 4"
            />
          );
        default:
          return null;
      }
    };

    return (
      <svg
        ref={ref}
        width={length}
        height={24}
        viewBox={`0 0 ${length} 24`}
        className={cn('shrink-0', className)}
        {...props}
      >
        {renderLine()}
      </svg>
    );
  }
);

RelationshipLine.displayName = 'RelationshipLine';
