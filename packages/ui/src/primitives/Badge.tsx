'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'accent';
  size?: 'sm' | 'md';
  glow?: boolean;
}

const variantStyles = {
  default: 'bg-neutral-100 text-neutral-700',
  primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm',
  secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-sm',
  success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm',
  warning: 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 shadow-sm',
  error: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm',
  info: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm',
  accent: 'bg-gradient-to-r from-accent-400 to-accent-500 text-white shadow-sm',
};

const glowStyles = {
  default: '',
  primary: 'shadow-primary-500/30',
  secondary: 'shadow-secondary-500/30',
  success: 'shadow-green-500/30',
  warning: 'shadow-amber-500/30',
  error: 'shadow-red-500/30',
  info: 'shadow-blue-500/30',
  accent: 'shadow-accent-500/30',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', glow = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          'transition-all duration-300',
          variantStyles[variant],
          sizeStyles[size],
          glow && glowStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: 'active' | 'inactive' | 'pending' | 'verified' | 'deceased';
}

const statusConfig = {
  active: { label: 'Active', variant: 'success' as const, dotColor: 'bg-green-400' },
  inactive: { label: 'Inactive', variant: 'default' as const, dotColor: 'bg-neutral-400' },
  pending: { label: 'Pending', variant: 'warning' as const, dotColor: 'bg-amber-400' },
  verified: { label: 'Verified', variant: 'info' as const, dotColor: 'bg-blue-400' },
  deceased: { label: 'Deceased', variant: 'default' as const, dotColor: 'bg-neutral-400' },
};

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, ...props }, ref) => {
    const config = statusConfig[status];
    return (
      <Badge
        ref={ref}
        variant={config.variant}
        size="sm"
        className={cn('gap-1.5', className)}
        {...props}
      >
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            config.dotColor,
            status === 'active' && 'animate-pulse'
          )}
        />
        {config.label}
      </Badge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';
