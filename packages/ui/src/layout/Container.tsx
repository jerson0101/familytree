'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  centered?: boolean;
}

const sizeStyles = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    { className, size = 'xl', padding = true, centered = true, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          sizeStyles[size],
          padding && 'px-4 sm:px-6 lg:px-8',
          centered && 'mx-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
