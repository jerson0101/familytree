import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Design system colors
 */
export const colors = {
  // Primary accent (configurable per family)
  primary: {
    50: 'var(--color-primary-50, #f0f9ff)',
    100: 'var(--color-primary-100, #e0f2fe)',
    200: 'var(--color-primary-200, #bae6fd)',
    300: 'var(--color-primary-300, #7dd3fc)',
    400: 'var(--color-primary-400, #38bdf8)',
    500: 'var(--color-primary-500, #0ea5e9)',
    600: 'var(--color-primary-600, #0284c7)',
    700: 'var(--color-primary-700, #0369a1)',
    800: 'var(--color-primary-800, #075985)',
    900: 'var(--color-primary-900, #0c4a6e)',
  },
  // Neutrals
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  // Semantic colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

/**
 * Animation durations
 */
export const animations = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const;

/**
 * Common transition styles
 */
export const transitions = {
  default: 'transition-all duration-300 ease-in-out',
  fast: 'transition-all duration-150 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',
} as const;
