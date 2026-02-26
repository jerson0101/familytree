'use client';

import { forwardRef, type ImgHTMLAttributes, useState } from 'react';
import { cn } from '../utils/cn';

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  name?: string;
  src?: string | null;
  status?: 'online' | 'offline' | 'away' | 'busy';
  ring?: boolean;
  ringColor?: 'primary' | 'secondary' | 'accent' | 'gradient';
}

const sizeStyles = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-3xl',
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-neutral-400',
  away: 'bg-amber-500',
  busy: 'bg-red-500',
};

const statusSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
  '2xl': 'w-5 h-5',
};

const ringStyles = {
  primary: 'ring-primary-500',
  secondary: 'ring-secondary-500',
  accent: 'ring-accent-500',
  gradient: 'ring-transparent', // Handled via wrapper
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Updated to use gradient backgrounds
const gradientColors = [
  'bg-gradient-to-br from-primary-400 to-primary-600', // Coral
  'bg-gradient-to-br from-secondary-400 to-secondary-600', // Teal
  'bg-gradient-to-br from-accent-400 to-accent-600', // Amber
  'bg-gradient-to-br from-pink-400 to-rose-600',
  'bg-gradient-to-br from-violet-400 to-purple-600',
  'bg-gradient-to-br from-blue-400 to-indigo-600',
  'bg-gradient-to-br from-emerald-400 to-green-600',
  'bg-gradient-to-br from-cyan-400 to-teal-600',
];

function getGradientFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradientColors[Math.abs(hash) % gradientColors.length];
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = 'md', name = '', src, status, ring, ringColor = 'primary', alt, ...props }, ref) => {
    const [imageError, setImageError] = useState(false);
    const showImage = src && !imageError;

    const avatarContent = (
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full overflow-hidden',
          'font-medium text-white',
          'shadow-sm',
          sizeStyles[size],
          !showImage && getGradientFromName(name),
          ring && ringColor !== 'gradient' && 'ring-2',
          ring && ringColor !== 'gradient' && ringStyles[ringColor]
        )}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            {...props}
          />
        ) : (
          <span className="drop-shadow-sm">{name ? getInitials(name) : '?'}</span>
        )}
      </div>
    );

    // Wrap in gradient ring if needed
    const wrappedContent = ring && ringColor === 'gradient' ? (
      <div className="p-0.5 rounded-full bg-gradient-to-br from-primary-500 via-accent-500 to-secondary-500">
        {avatarContent}
      </div>
    ) : avatarContent;

    return (
      <div ref={ref} className={cn('relative inline-block', className)}>
        {wrappedContent}
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-2 border-white',
              'shadow-sm',
              statusColors[status],
              statusSizes[size]
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export interface AvatarGroupProps {
  avatars: Array<{ name?: string; src?: string }>;
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = 'md',
  className,
}: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((avatar, i) => (
        <Avatar
          key={i}
          {...avatar}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full',
            'bg-gradient-to-br from-neutral-200 to-neutral-300 text-neutral-600 font-medium ring-2 ring-white',
            sizeStyles[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
