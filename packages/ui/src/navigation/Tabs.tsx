'use client';

import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useContext,
} from 'react';
import { cn } from '../utils/cn';

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, value, onChange, children, ...props }, ref) => {
    return (
      <TabsContext.Provider value={{ value, onChange }}>
        <div ref={ref} className={cn('w-full', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'pills' | 'underlined';
}

const variantStyles = {
  default: 'bg-neutral-100 p-1 rounded-xl',
  pills: 'gap-2',
  underlined: 'border-b border-neutral-200',
};

export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn('flex items-center', variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabList.displayName = 'TabList';

export interface TabTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export const TabTrigger = forwardRef<HTMLButtonElement, TabTriggerProps>(
  ({ className, value, icon, disabled = false, children, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabTrigger must be used within Tabs');

    const isActive = context.value === value;

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        disabled={disabled}
        onClick={() => context.onChange(value)}
        className={cn(
          'flex items-center justify-center gap-2 px-4 py-2',
          'font-medium text-sm transition-all duration-300',
          'min-h-[40px] min-w-[44px]', // Touch target
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          isActive
            ? 'bg-white text-neutral-900 shadow-sm rounded-lg'
            : 'text-neutral-500 hover:text-neutral-700',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {icon && <span className="w-4 h-4">{icon}</span>}
        {children}
      </button>
    );
  }
);

TabTrigger.displayName = 'TabTrigger';

export interface TabContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabContent = forwardRef<HTMLDivElement, TabContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabContent must be used within Tabs');

    if (context.value !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn('mt-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TabContent.displayName = 'TabContent';
