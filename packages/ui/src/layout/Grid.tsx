'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

const colStyles = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
  auto: 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
};

const gapStyles = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    { className, cols = 'auto', gap = 'md', responsive = true, children, ...props },
    ref
  ) => {
    const responsiveClass =
      responsive && typeof cols === 'number' && cols > 1
        ? `grid-cols-1 sm:grid-cols-2 lg:${colStyles[cols]}`
        : colStyles[cols];

    return (
      <div
        ref={ref}
        className={cn('grid', responsive ? responsiveClass : colStyles[cols], gapStyles[gap], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'full';
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

const spanStyles = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  12: 'col-span-12',
  full: 'col-span-full',
};

const startStyles = {
  1: 'col-start-1',
  2: 'col-start-2',
  3: 'col-start-3',
  4: 'col-start-4',
  5: 'col-start-5',
  6: 'col-start-6',
  7: 'col-start-7',
  8: 'col-start-8',
  9: 'col-start-9',
  10: 'col-start-10',
  11: 'col-start-11',
  12: 'col-start-12',
};

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, span, start, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          span && spanStyles[span],
          start && startStyles[start],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GridItem.displayName = 'GridItem';
