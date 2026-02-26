'use client';

import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useContext,
} from 'react';
import { cn } from '../utils/cn';

interface SidebarContextValue {
  collapsed: boolean;
  onCollapse?: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({ collapsed: false });

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
  onCollapse?: () => void;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ className, collapsed = false, onCollapse, children, ...props }, ref) => {
    return (
      <SidebarContext.Provider value={{ collapsed, onCollapse }}>
        <aside
          ref={ref}
          className={cn(
            'h-screen bg-white border-r border-neutral-100',
            'flex flex-col transition-all duration-300',
            // Subtle gradient background
            'bg-gradient-to-b from-white via-white to-primary-50/30',
            collapsed ? 'w-16' : 'w-64',
            className
          )}
          {...props}
        >
          {children}
        </aside>
      </SidebarContext.Provider>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  logo?: ReactNode;
  title?: string;
}

export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, logo, title, children, ...props }, ref) => {
    const { collapsed } = useContext(SidebarContext);

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 p-4 border-b border-neutral-100',
          className
        )}
        {...props}
      >
        {logo && <div className="shrink-0">{logo}</div>}
        {!collapsed && title && (
          <span className="font-bold text-lg text-gradient-primary truncate">
            {title}
          </span>
        )}
        {children}
      </div>
    );
  }
);

SidebarHeader.displayName = 'SidebarHeader';

export type SidebarContentProps = HTMLAttributes<HTMLDivElement>;

export const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex-1 overflow-y-auto p-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SidebarContent.displayName = 'SidebarContent';

export interface SidebarItemProps extends HTMLAttributes<HTMLAnchorElement> {
  href?: string;
  icon?: ReactNode;
  label: string;
  active?: boolean;
  badge?: ReactNode;
  onClick?: () => void;
}

export const SidebarItem = forwardRef<HTMLAnchorElement, SidebarItemProps>(
  (
    { className, href, icon, label, active = false, badge, onClick, ...props },
    ref
  ) => {
    const { collapsed } = useContext(SidebarContext);
    const Component = href ? 'a' : 'button';

    return (
      <Component
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        href={href}
        onClick={onClick}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
          'text-left transition-all duration-300',
          'min-h-[44px] relative', // Touch target
          'transform-gpu',
          active
            ? [
              'bg-gradient-to-r from-primary-50 to-primary-100/50',
              'text-primary-700',
              'shadow-sm',
            ].join(' ')
            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
          collapsed && 'justify-center px-0',
          className
        )}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as any)}
      >
        {/* Active indicator */}
        {active && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-primary-500 to-primary-600 rounded-r-full" />
        )}
        {icon && (
          <span
            className={cn(
              'shrink-0 w-5 h-5 transition-colors',
              active ? 'text-primary-600' : 'text-neutral-400'
            )}
          >
            {icon}
          </span>
        )}
        {!collapsed && (
          <>
            <span className="flex-1 truncate font-medium">{label}</span>
            {badge && <span>{badge}</span>}
          </>
        )}
      </Component>
    );
  }
);

SidebarItem.displayName = 'SidebarItem';

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, title, children, ...props }, ref) => {
    const { collapsed } = useContext(SidebarContext);

    return (
      <div ref={ref} className={cn('mb-2', className)} {...props}>
        {!collapsed && title && (
          <div className="px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            {title}
          </div>
        )}
        <div className="space-y-0.5">{children}</div>
      </div>
    );
  }
);

SidebarGroup.displayName = 'SidebarGroup';

export type SidebarFooterProps = HTMLAttributes<HTMLDivElement>;

export const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-4 border-t border-neutral-100', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SidebarFooter.displayName = 'SidebarFooter';
