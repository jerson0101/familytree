'use client';

import { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { cn } from '../utils/cn';

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  allowApproximate?: boolean;
  onChange?: (value: string, isApproximate: boolean) => void;
  fullWidth?: boolean;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      className,
      label,
      error,
      hint,
      allowApproximate = false,
      onChange,
      fullWidth = false,
      id,
      value,
      ...props
    },
    ref
  ) => {
    const [isApproximate, setIsApproximate] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value, isApproximate);
    };

    const handleApproximateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newApproximate = e.target.checked;
      setIsApproximate(newApproximate);
      onChange?.(value as string || '', newApproximate);
    };

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="date"
            value={value}
            onChange={handleDateChange}
            className={cn(
              'w-full h-11 px-4 rounded-xl',
              'bg-white border border-neutral-200',
              'text-base text-neutral-900',
              'transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-50',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
        </div>

        {allowApproximate && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isApproximate}
              onChange={handleApproximateChange}
              className={cn(
                'w-4 h-4 rounded border-neutral-300',
                'text-primary-600 focus:ring-primary-500'
              )}
            />
            <span className="text-sm text-neutral-600">Approximate date</span>
          </label>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="text-sm text-neutral-500">{hint}</p>}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export interface DateRangePickerProps {
  label?: string;
  startDate?: string;
  endDate?: string;
  onChange?: (start: string, end: string) => void;
  error?: string;
  fullWidth?: boolean;
  className?: string;
}

export function DateRangePicker({
  label,
  startDate = '',
  endDate = '',
  onChange,
  error,
  fullWidth = false,
  className,
}: DateRangePickerProps) {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value, endDate);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(startDate, e.target.value);
  };

  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', className)}>
      {label && (
        <label className="text-sm font-medium text-neutral-700">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={handleStartChange}
          className={cn(
            'flex-1 h-11 px-4 rounded-xl',
            'bg-white border border-neutral-200',
            'text-base text-neutral-900',
            'transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error && 'border-red-500 focus:ring-red-500'
          )}
        />
        <span className="text-neutral-400">to</span>
        <input
          type="date"
          value={endDate}
          onChange={handleEndChange}
          className={cn(
            'flex-1 h-11 px-4 rounded-xl',
            'bg-white border border-neutral-200',
            'text-base text-neutral-900',
            'transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error && 'border-red-500 focus:ring-red-500'
          )}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
