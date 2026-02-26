'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'interactive' | 'glass' | 'gradient' | 'feature';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'bg-white shadow-sm border border-neutral-100',
  elevated: 'bg-white shadow-elevated',
  bordered: 'bg-white border border-neutral-200',
  interactive: [
    'bg-white shadow-sm border border-neutral-100',
    'hover:shadow-elevated hover:-translate-y-1',
    'cursor-pointer transition-all duration-300 transform-gpu',
  ].join(' '),
  glass: [
    'bg-white/70 backdrop-blur-xl',
    'border border-white/30',
    'shadow-sm',
  ].join(' '),
  gradient: [
    'bg-gradient-to-br from-primary-50/50 to-accent-50/50',
    'border border-primary-100/50',
    'shadow-sm',
  ].join(' '),
  feature: [
    'bg-white',
    'border border-transparent',
    'shadow-elevated',
    'hover:shadow-elevated-lg hover:-translate-y-1',
    'transition-all duration-300 transform-gpu',
    // Gradient border effect via pseudo-element handled in CSS
    'relative overflow-hidden',
  ].join(' '),
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl',
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {variant === 'feature' && (
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-start justify-between mb-4', className)}
        {...props}
      >
        <div className="flex items-start gap-3">
          {icon && (
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 text-primary-600">
              {icon}
            </div>
          )}
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            )}
            {children}
            {subtitle && (
              <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export type CardContentProps = HTMLAttributes<HTMLDivElement>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end gap-2 mt-4 pt-4 border-t border-neutral-100',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
