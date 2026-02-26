'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Card } from '../primitives/Card';

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'secondary' | 'accent';
}

const variantStyles = {
  default: {
    icon: 'bg-neutral-100 text-neutral-600',
    iconGradient: 'from-neutral-100 to-neutral-200',
    trend: {
      up: 'text-green-600',
      down: 'text-red-600',
      neutral: 'text-neutral-500',
    },
  },
  primary: {
    icon: 'bg-primary-100 text-primary-600',
    iconGradient: 'from-primary-100 to-primary-200',
    trend: {
      up: 'text-green-600',
      down: 'text-red-600',
      neutral: 'text-neutral-500',
    },
  },
  secondary: {
    icon: 'bg-secondary-100 text-secondary-600',
    iconGradient: 'from-secondary-100 to-secondary-200',
    trend: {
      up: 'text-green-600',
      down: 'text-red-600',
      neutral: 'text-neutral-500',
    },
  },
  accent: {
    icon: 'bg-accent-100 text-accent-600',
    iconGradient: 'from-accent-100 to-accent-200',
    trend: {
      up: 'text-green-600',
      down: 'text-red-600',
      neutral: 'text-neutral-500',
    },
  },
  success: {
    icon: 'bg-green-100 text-green-600',
    iconGradient: 'from-green-100 to-emerald-200',
    trend: {
      up: 'text-green-600',
      down: 'text-red-600',
      neutral: 'text-neutral-500',
    },
  },
  warning: {
    icon: 'bg-amber-100 text-amber-600',
    iconGradient: 'from-amber-100 to-orange-200',
    trend: {
      up: 'text-green-600',
      down: 'text-red-600',
      neutral: 'text-neutral-500',
    },
  },
  error: {
    icon: 'bg-red-100 text-red-600',
    iconGradient: 'from-red-100 to-rose-200',
    trend: {
      up: 'text-green-600',
      down: 'text-red-600',
      neutral: 'text-neutral-500',
    },
  },
};

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      title,
      value,
      subtitle,
      icon,
      trend,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const styles = variantStyles[variant];

    return (
      <Card
        ref={ref}
        padding="md"
        className={cn(
          'hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5',
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-500 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-neutral-900">{value}</p>
              {trend && (
                <span
                  className={cn(
                    'flex items-center text-sm font-medium',
                    styles.trend[trend.direction]
                  )}
                >
                  {trend.direction === 'up' && (
                    <TrendUpIcon className="w-4 h-4 mr-0.5" />
                  )}
                  {trend.direction === 'down' && (
                    <TrendDownIcon className="w-4 h-4 mr-0.5" />
                  )}
                  {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div
              className={cn(
                'p-3 rounded-xl',
                'bg-gradient-to-br',
                styles.iconGradient,
                'text-current'
              )}
              style={{ color: `var(--color-${variant === 'default' ? 'neutral' : variant}-600)` }}
            >
              {icon}
            </div>
          )}
        </div>
      </Card>
    );
  }
);

StatCard.displayName = 'StatCard';

function TrendUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  );
}

function TrendDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M23 18l-9.5-9.5-5 5L1 6" />
      <path d="M17 18h6v-6" />
    </svg>
  );
}

export interface StatGridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const StatGrid = forwardRef<HTMLDivElement, StatGridProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StatGrid.displayName = 'StatGrid';
