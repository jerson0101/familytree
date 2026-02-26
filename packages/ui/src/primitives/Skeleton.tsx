'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = 'rectangular',
      width,
      height,
      animation = 'pulse',
      style,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-neutral-200',
          variant === 'circular' && 'rounded-full',
          variant === 'rectangular' && 'rounded-xl',
          variant === 'text' && 'rounded h-4',
          animation === 'pulse' && 'animate-pulse',
          animation === 'wave' && 'animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]',
          className
        )}
        style={{
          width: width,
          height: height,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(i === lines - 1 && 'w-3/4')}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl p-4 shadow-sm', className)}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-1/2" />
          <Skeleton variant="text" className="w-1/3" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonAvatar({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizes = {
    sm: 32,
    md: 40,
    lg: 48,
  };
  return (
    <Skeleton
      variant="circular"
      width={sizes[size]}
      height={sizes[size]}
      className={className}
    />
  );
}
