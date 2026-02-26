'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export type BottomNavProps = HTMLAttributes<HTMLElement>;

export const BottomNav = forwardRef<HTMLElement, BottomNavProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-40',
          // Glassmorphism effect
          'bg-white/80 backdrop-blur-xl',
          'border-t border-white/50',
          'shadow-elevated',
          'flex items-center justify-around',
          'h-16 px-2 pb-safe',
          'md:hidden', // Only show on mobile
          className
        )}
        {...props}
      >
        {children}
      </nav>
    );
  }
);

BottomNav.displayName = 'BottomNav';

export interface BottomNavItemProps extends HTMLAttributes<HTMLAnchorElement> {
  href?: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

export const BottomNavItem = forwardRef<HTMLAnchorElement, BottomNavItemProps>(
  (
    { className, href, icon, label, active = false, badge, onClick, ...props },
    ref
  ) => {
    const Component = href ? 'a' : 'button';

    return (
      <Component
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        href={href}
        onClick={onClick}
        className={cn(
          'flex flex-col items-center justify-center gap-0.5',
          'min-w-[64px] min-h-[44px] px-3 py-1.5',
          'transition-all duration-300 relative',
          'transform-gpu',
          active
            ? 'text-primary-600'
            : 'text-neutral-400 active:text-neutral-600',
          className
        )}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as any)}
      >
        {/* Floating indicator for active state */}
        {active && (
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-primary" />
        )}
        <div className="relative">
          <span
            className={cn(
              'w-6 h-6 block',
              'transition-all duration-300',
              active && 'scale-110'
            )}
          >
            {icon}
          </span>
          {badge !== undefined && badge > 0 && (
            <span
              className={cn(
                'absolute -top-1 -right-1 min-w-[16px] h-4',
                'flex items-center justify-center',
                'bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-medium rounded-full px-1',
                'shadow-primary'
              )}
            >
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </div>
        <span
          className={cn(
            'text-xs font-medium transition-colors',
            active ? 'text-primary-600' : 'text-neutral-500'
          )}
        >
          {label}
        </span>
      </Component>
    );
  }
);

BottomNavItem.displayName = 'BottomNavItem';
