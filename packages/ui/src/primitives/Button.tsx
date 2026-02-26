'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glass' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: [
    'bg-gradient-to-r from-primary-500 to-primary-600 text-white',
    'hover:from-primary-600 hover:to-primary-700',
    'active:from-primary-700 active:to-primary-800',
    'shadow-primary hover:shadow-lg hover:shadow-primary-500/30',
    'hover:-translate-y-0.5',
  ].join(' '),
  secondary: [
    'bg-neutral-100 text-neutral-900',
    'hover:bg-neutral-200 active:bg-neutral-300',
    'hover:-translate-y-0.5',
  ].join(' '),
  outline: [
    'border border-neutral-300 text-neutral-700 bg-white',
    'hover:bg-neutral-50 hover:border-neutral-400 active:bg-neutral-100',
    'hover:-translate-y-0.5 hover:shadow-sm',
  ].join(' '),
  ghost: [
    'text-neutral-700',
    'hover:bg-neutral-100 active:bg-neutral-200',
  ].join(' '),
  danger: [
    'bg-gradient-to-r from-red-500 to-red-600 text-white',
    'hover:from-red-600 hover:to-red-700',
    'active:from-red-700 active:to-red-800',
    'shadow-md hover:shadow-lg hover:shadow-red-500/30',
    'hover:-translate-y-0.5',
  ].join(' '),
  glass: [
    'bg-white/70 backdrop-blur-xl text-neutral-800',
    'border border-white/30',
    'hover:bg-white/80 active:bg-white/90',
    'hover:-translate-y-0.5 hover:shadow-elevated',
  ].join(' '),
  accent: [
    'bg-gradient-to-r from-accent-400 to-accent-500 text-white',
    'hover:from-accent-500 hover:to-accent-600',
    'active:from-accent-600 active:to-accent-700',
    'shadow-accent hover:shadow-lg hover:shadow-accent-500/30',
    'hover:-translate-y-0.5',
  ].join(' '),
};

const sizeStyles = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-base gap-2',
  lg: 'h-13 px-6 text-lg gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium',
          'transition-all duration-300 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none',
          'min-w-[44px] min-h-[44px]', // Touch target
          'transform-gpu', // Enable hardware acceleration for smooth animations
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <LoadingSpinner className="w-5 h-5" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
