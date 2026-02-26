'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Avatar } from '../primitives/Avatar';

export interface TimelineItemProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  timestamp?: string;
  date?: string; // Alias for timestamp
  icon?: ReactNode;
  type?: 'default' | 'birth' | 'death' | 'marriage' | 'location' | 'photo' | 'document';
  variant?: 'default' | 'birth' | 'death' | 'marriage' | 'location' | 'photo' | 'document'; // Alias for type
  personName?: string;
  personPhoto?: string | null;
  isLast?: boolean;
}

const typeColors = {
  default: 'bg-neutral-400',
  birth: 'bg-green-500',
  death: 'bg-neutral-600',
  marriage: 'bg-pink-500',
  location: 'bg-blue-500',
  photo: 'bg-purple-500',
  document: 'bg-amber-500',
};

const typeIcons: Record<string, ReactNode> = {
  birth: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v6m0 0l-3-3m3 3l3-3M5 12h14M5 12a7 7 0 0014 0M5 12a7 7 0 0114 0" />
    </svg>
  ),
  death: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L12 22M7 7L17 17M17 7L7 17" />
    </svg>
  ),
  marriage: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  location: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  photo: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  document: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
};

export const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  (
    {
      className,
      title,
      description,
      timestamp,
      date,
      icon,
      type = 'default',
      variant,
      personName,
      personPhoto,
      isLast = false,
      ...props
    },
    ref
  ) => {
    const dateValue = timestamp || date || new Date().toISOString();
    const typeValue = type || variant || 'default';
    const formattedDate = new Date(dateValue).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const formattedTime = new Date(dateValue).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div ref={ref} className={cn('flex gap-4', className)} {...props}>
        {/* Timeline line and dot */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0',
              typeColors[typeValue]
            )}
          >
            {icon || typeIcons[typeValue] || (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
          {!isLast && <div className="w-0.5 flex-1 bg-neutral-200 my-2" />}
        </div>

        {/* Content */}
        <div className="flex-1 pb-6">
          <div className="flex items-start justify-between gap-4 mb-1">
            <div>
              <h4 className="font-medium text-neutral-900">{title}</h4>
              <p className="text-sm text-neutral-500">
                {formattedDate} at {formattedTime}
              </p>
            </div>
            {personName && (
              <Avatar name={personName} src={personPhoto} size="sm" />
            )}
          </div>
          {description && (
            <p className="text-sm text-neutral-600 mt-2">{description}</p>
          )}
        </div>
      </div>
    );
  }
);

TimelineItem.displayName = 'TimelineItem';

export interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {children}
      </div>
    );
  }
);

Timeline.displayName = 'Timeline';
