'use client';

import { forwardRef, type InputHTMLAttributes, useState, useCallback } from 'react';
import { cn } from '../utils/cn';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  debounceMs?: number;
  loading?: boolean;
  showClear?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      onChange,
      onSearch,
      debounceMs = 300,
      loading = false,
      showClear = true,
      placeholder = 'Search...',
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onChange?.(newValue);

        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }

        if (onSearch) {
          const timeout = setTimeout(() => {
            onSearch(newValue);
          }, debounceMs);
          setDebounceTimeout(timeout);
        }
      },
      [onChange, onSearch, debounceMs, debounceTimeout]
    );

    const handleClear = useCallback(() => {
      setValue('');
      onChange?.('');
      onSearch?.('');
    }, [onChange, onSearch]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearch) {
          if (debounceTimeout) {
            clearTimeout(debounceTimeout);
          }
          onSearch(value);
        }
      },
      [onSearch, value, debounceTimeout]
    );

    return (
      <div className={cn('relative', className)}>
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full h-11 pl-10 pr-10 rounded-xl',
            'bg-neutral-100 border-none',
            'text-base text-neutral-900 placeholder:text-neutral-400',
            'transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          {...props}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && <LoadingSpinner className="w-4 h-4 text-neutral-400" />}
          {showClear && value && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <ClearIcon className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function ClearIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={cn('animate-spin', className)} viewBox="0 0 24 24" fill="none">
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
