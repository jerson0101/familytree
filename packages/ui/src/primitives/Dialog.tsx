'use client';

import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ open, onClose, children, className }, ref) => {
    const handleEscape = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      },
      [onClose]
    );

    useEffect(() => {
      if (open) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }, [open, handleEscape]);

    if (!open) return null;

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
        {/* Content */}
        <div
          ref={ref}
          className={cn(
            'relative z-10 w-full max-w-lg mx-4',
            'bg-white rounded-2xl shadow-xl',
            'animate-in fade-in zoom-in-95 duration-300',
            'max-h-[90vh] flex flex-col',
            className
          )}
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </div>,
      document.body
    );
  }
);

Dialog.displayName = 'Dialog';

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  onClose?: () => void;
}

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, title, onClose, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between p-6 pb-0 flex-shrink-0',
          className
        )}
        {...props}
      >
        <div>
          {title && <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>}
          {children}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              'w-10 h-10 flex items-center justify-center rounded-full',
              'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100',
              'transition-colors duration-300'
            )}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    );
  }
);

DialogHeader.displayName = 'DialogHeader';

export type DialogContentProps = HTMLAttributes<HTMLDivElement>;

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('p-6 overflow-y-auto flex-1', className)} {...props}>
        {children}
      </div>
    );
  }
);

DialogContent.displayName = 'DialogContent';

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end gap-3 p-6 pt-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DialogFooter.displayName = 'DialogFooter';

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
