'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Avatar } from '../primitives/Avatar';
import { Badge } from '../primitives/Badge';
import { Card } from '../primitives/Card';

export interface PersonCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  birthDate?: string;
  deathDate?: string;
  photoUrl?: string | null;
  gender?: 'male' | 'female' | 'other';
  relationship?: string;
  isDeceased?: boolean;
  isLiving?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  action?: ReactNode;
  onClick?: () => void;
}

function formatDate(date: string | undefined): string {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return date;
  }
}

function calculateAge(birthDate?: string, deathDate?: string): string | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const end = deathDate ? new Date(deathDate) : new Date();
  const age = Math.floor(
    (end.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );
  return `${age} years`;
}

export const PersonCard = forwardRef<HTMLDivElement, PersonCardProps>(
  (
    {
      className,
      name,
      birthDate,
      deathDate,
      photoUrl,
      // gender = 'other', // Removed unused prop
      relationship,
      isDeceased = false,
      isLiving = true,
      variant = 'default',
      action,
      onClick,
      ...props
    },
    ref
  ) => {
    const age = calculateAge(birthDate, deathDate);
    const deceased = isDeceased || !!deathDate;

    if (variant === 'compact') {
      return (
        <Card
          ref={ref}
          variant={onClick ? 'interactive' : 'default'}
          padding="sm"
          className={cn('flex items-center gap-3', className)}
          onClick={onClick}
          {...props}
        >
          <Avatar
            name={name}
            src={photoUrl}
            size="md"
            className={cn(deceased && 'opacity-60')}
          />
          <div className="flex-1 min-w-0">
            <p className={cn('font-medium text-neutral-900 truncate', deceased && 'text-neutral-500')}>
              {name}
            </p>
            {relationship && (
              <p className="text-sm text-neutral-500">{relationship}</p>
            )}
          </div>
          {action}
        </Card>
      );
    }

    if (variant === 'detailed') {
      return (
        <Card
          ref={ref}
          variant={onClick ? 'interactive' : 'default'}
          padding="lg"
          className={cn(className)}
          onClick={onClick}
          {...props}
        >
          <div className="flex items-start gap-4">
            <Avatar
              name={name}
              src={photoUrl}
              size="xl"
              className={cn(deceased && 'opacity-60')}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={cn('text-lg font-semibold truncate', deceased && 'text-neutral-500')}>
                  {name}
                </h3>
                {deceased && <Badge variant="default" size="sm">Deceased</Badge>}
              </div>
              {relationship && (
                <p className="text-sm text-primary-600 mb-2">{relationship}</p>
              )}
              <div className="space-y-1 text-sm text-neutral-500">
                {birthDate && (
                  <p>
                    Born: {formatDate(birthDate)}
                    {age && !deceased && ` (${age})`}
                  </p>
                )}
                {deathDate && <p>Died: {formatDate(deathDate)} ({age})</p>}
              </div>
            </div>
            {action && <div>{action}</div>}
          </div>
        </Card>
      );
    }

    // Default variant
    return (
      <Card
        ref={ref}
        variant={onClick ? 'interactive' : 'default'}
        padding="md"
        className={cn(className)}
        onClick={onClick}
        {...props}
      >
        <div className="flex items-center gap-3">
          <Avatar
            name={name}
            src={photoUrl}
            size="lg"
            className={cn(deceased && 'opacity-60')}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={cn('font-medium text-neutral-900 truncate', deceased && 'text-neutral-500')}>
                {name}
              </p>
              {deceased && <Badge variant="default" size="sm">Deceased</Badge>}
            </div>
            {relationship && (
              <p className="text-sm text-neutral-500">{relationship}</p>
            )}
            {age && isLiving && !deceased && (
              <p className="text-sm text-neutral-400">{age}</p>
            )}
          </div>
          {action}
        </div>
      </Card>
    );
  }
);

PersonCard.displayName = 'PersonCard';
