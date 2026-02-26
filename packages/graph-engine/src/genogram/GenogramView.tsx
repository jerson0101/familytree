'use client';

import { useMemo } from 'react';
import type {
  GraphData,
  GraphNode,
  Viewport,
  GenogramOptions,
  MedicalCondition,
} from '../types';
import { createSugiyamaLayout } from '../layout/SugiyamaLayout';
import { GraphCanvas } from '../renderer/GraphCanvas';

export interface GenogramViewProps {
  data: GraphData;
  viewport: Viewport;
  onViewportChange: (viewport: Viewport) => void;
  onNodeClick?: (nodeId: string) => void;
  options?: Partial<GenogramOptions>;
  className?: string;
}

const DEFAULT_OPTIONS: GenogramOptions = {
  showPhotos: false,
  showDates: true,
  showMedicalIcons: true,
  showDeceased: true,
  animationsEnabled: true,
  showRelationshipLines: true,
  showMedicalConditions: true,
  legendVisible: true,
};

const CONDITION_COLORS: Record<string, string> = {
  cardiovascular: '#ef4444',
  cancer: '#8b5cf6',
  metabolic: '#f59e0b',
  neurological: '#3b82f6',
  mental_health: '#10b981',
  autoimmune: '#ec4899',
  genetic: '#6366f1',
};

export function GenogramView({
  data,
  viewport,
  onViewportChange,
  onNodeClick,
  options = {},
  className = '',
}: GenogramViewProps) {
  const genogramOptions = { ...DEFAULT_OPTIONS, ...options };

  // Compute layout
  const layout = useMemo(() => {
    const layoutEngine = createSugiyamaLayout({
      nodeWidth: 120,
      nodeHeight: 80,
      horizontalSpacing: 80,
      verticalSpacing: 100,
    });
    return layoutEngine.compute(data);
  }, [data]);

  // Extract all medical conditions for legend
  const allConditions = useMemo(() => {
    const conditions = new Map<string, { category: string; count: number }>();

    for (const person of data.persons) {
      if (person.medicalConditions) {
        for (const condition of person.medicalConditions) {
          const existing = conditions.get(condition.category);
          if (existing) {
            existing.count++;
          } else {
            conditions.set(condition.category, {
              category: condition.category,
              count: 1,
            });
          }
        }
      }
    }

    return Array.from(conditions.values());
  }, [data.persons]);

  const handleNodeClick = (interaction: { nodeId: string }) => {
    // Extract person ID from node ID
    const personId = interaction.nodeId.replace('person-', '');
    onNodeClick?.(personId);
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <GraphCanvas
        nodes={layout.nodes}
        edges={layout.edges}
        bounds={layout.bounds}
        viewport={viewport}
        onViewportChange={onViewportChange}
        onNodeClick={handleNodeClick}
        options={{
          ...genogramOptions,
          showPhotos: false, // Genograms use symbols, not photos
        }}
      />

      {/* Medical condition legend */}
      {genogramOptions.legendVisible && allConditions.length > 0 && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-neutral-200 p-4">
          <h4 className="text-sm font-semibold text-neutral-700 mb-3">
            Medical Conditions
          </h4>
          <div className="space-y-2">
            {allConditions.map(({ category, count }) => (
              <div key={category} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: CONDITION_COLORS[category] }}
                />
                <span className="text-sm text-neutral-600 capitalize">
                  {category.replace('_', ' ')}
                </span>
                <span className="text-xs text-neutral-400">({count})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Symbol legend */}
      {genogramOptions.legendVisible && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-neutral-200 p-4">
          <h4 className="text-sm font-semibold text-neutral-700 mb-3">Symbols</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <rect x="2" y="2" width="16" height="16" fill="none" stroke="#3b82f6" strokeWidth="2" />
              </svg>
              <span className="text-sm text-neutral-600">Male</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" fill="none" stroke="#ec4899" strokeWidth="2" />
              </svg>
              <span className="text-sm text-neutral-600">Female</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <polygon points="10,2 18,10 10,18 2,10" fill="none" stroke="#6b7280" strokeWidth="2" />
              </svg>
              <span className="text-sm text-neutral-600">Other</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <rect x="2" y="2" width="16" height="16" fill="#f5f5f5" stroke="#9ca3af" strokeWidth="2" />
                <line x1="2" y1="2" x2="18" y2="18" stroke="#9ca3af" strokeWidth="1.5" />
              </svg>
              <span className="text-sm text-neutral-600">Deceased</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
