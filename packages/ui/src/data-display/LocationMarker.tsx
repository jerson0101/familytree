'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { Avatar } from '../primitives/Avatar';

export interface LocationMarkerProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  photoUrl?: string | null;
  isActive?: boolean;
  accuracy?: number; // meters
  timestamp?: string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

const pulseStyles = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
};

export const LocationMarker = forwardRef<HTMLDivElement, LocationMarkerProps>(
  (
    {
      className,
      name,
      photoUrl,
      isActive = true,
      accuracy,
      // timestamp, // Removed unused prop
      size = 'md',
      pulse = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('relative inline-flex items-center justify-center', className)}
        {...props}
      >
        {/* Pulse animation for active locations */}
        {isActive && pulse && (
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              pulseStyles[size]
            )}
          >
            <div className="absolute w-full h-full bg-primary-400 rounded-full animate-ping opacity-20" />
            <div className="absolute w-3/4 h-3/4 bg-primary-400 rounded-full animate-ping opacity-30 animation-delay-300" />
          </div>
        )}

        {/* Marker container */}
        <div
          className={cn(
            'relative z-10 flex flex-col items-center',
            !isActive && 'opacity-60'
          )}
        >
          {/* Avatar with border */}
          <div
            className={cn(
              'rounded-full p-0.5',
              isActive ? 'bg-primary-500' : 'bg-neutral-400'
            )}
          >
            <Avatar
              name={name}
              src={photoUrl}
              size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'}
              className="border-2 border-white"
            />
          </div>

          {/* Pin point */}
          <div
            className={cn(
              'w-0 h-0 -mt-0.5',
              'border-l-[6px] border-l-transparent',
              'border-r-[6px] border-r-transparent',
              'border-t-[8px]',
              isActive ? 'border-t-primary-500' : 'border-t-neutral-400'
            )}
          />
        </div>

        {/* Accuracy circle indicator */}
        {accuracy !== undefined && accuracy > 50 && (
          <div
            className={cn(
              'absolute rounded-full border-2 border-primary-300 border-dashed opacity-30',
              'pointer-events-none'
            )}
            style={{
              width: Math.min(accuracy / 2, 100),
              height: Math.min(accuracy / 2, 100),
            }}
          />
        )}
      </div>
    );
  }
);

LocationMarker.displayName = 'LocationMarker';

export interface LocationInfoPopupProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  address?: string;
  timestamp?: string;
  accuracy?: number;
  speed?: number;
  batteryLevel?: number;
}

export const LocationInfoPopup = forwardRef<HTMLDivElement, LocationInfoPopupProps>(
  (
    { className, name, address, timestamp, accuracy, speed, batteryLevel, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-xl shadow-lg p-4 min-w-[200px]',
          className
        )}
        {...props}
      >
        <h4 className="font-semibold text-neutral-900 mb-2">{name}</h4>
        <div className="space-y-1 text-sm text-neutral-500">
          {address && <p>{address}</p>}
          {timestamp && (
            <p>
              Last updated:{' '}
              {new Date(timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
          {accuracy && <p>Accuracy: {Math.round(accuracy)}m</p>}
          {speed !== undefined && <p>Speed: {Math.round(speed)} km/h</p>}
          {batteryLevel !== undefined && (
            <div className="flex items-center gap-2">
              <BatteryIcon level={batteryLevel} />
              <span>{batteryLevel}%</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

LocationInfoPopup.displayName = 'LocationInfoPopup';

function BatteryIcon({ level }: { level: number }) {
  const color =
    level > 50 ? 'text-green-500' : level > 20 ? 'text-amber-500' : 'text-red-500';

  return (
    <svg
      className={cn('w-4 h-4', color)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="2" y="7" width="18" height="10" rx="2" />
      <rect x="22" y="10" width="2" height="4" rx="1" />
      <rect
        x="4"
        y="9"
        width={Math.round((level / 100) * 14)}
        height="6"
        rx="1"
        fill="currentColor"
      />
    </svg>
  );
}
