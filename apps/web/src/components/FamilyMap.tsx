'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Types for family member location
export interface FamilyMemberMarker {
  id: string;
  name: string;
  photoUrl: string | null;
  status: 'online' | 'away' | 'offline';
  location: { lat: number; lng: number; address: string } | null;
  isSelected?: boolean;
}

interface FamilyMapProps {
  members: FamilyMemberMarker[];
  selectedMemberId: string | null;
  onMemberSelect: (memberId: string) => void;
  className?: string;
}

// Dynamically import the map to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Custom marker icons
function createCustomIcon(status: 'online' | 'away' | 'offline', isSelected: boolean) {
  if (typeof window === 'undefined') return undefined;

  const L = require('leaflet');

  const color = status === 'online' ? '#10b981' : status === 'away' ? '#f59e0b' : '#9ca3af';
  const size = isSelected ? 48 : 40;
  const borderColor = isSelected ? '#ff6b47' : color;
  const borderWidth = isSelected ? 4 : 3;

  const svgIcon = `
    <svg width="${size}" height="${size + 12}" viewBox="0 0 ${size} ${size + 12}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.3"/>
        </filter>
        <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.8" />
        </linearGradient>
      </defs>
      <path d="M${size / 2} ${size + 8} L${size / 2 - 8} ${size - 4} Q0 ${size / 2} 0 ${size / 2 - 4}
               A${size / 2} ${size / 2} 0 1 1 ${size} ${size / 2 - 4}
               Q${size} ${size / 2} ${size / 2 + 8} ${size - 4} Z"
            fill="url(#pinGrad)" filter="url(#shadow)"/>
      <circle cx="${size / 2}" cy="${size / 2 - 4}" r="${size / 2 - 6}" fill="white"/>
      <circle cx="${size / 2}" cy="${size / 2 - 4}" r="${size / 2 - 8}" fill="${color}" opacity="0.2"/>
      <circle cx="${size / 2}" cy="${size / 2 - 4}" r="${size / 4}" fill="${borderColor}" stroke="white" stroke-width="2"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [size, size + 12],
    iconAnchor: [size / 2, size + 8],
    popupAnchor: [0, -size],
  });
}

export default function FamilyMap({ members, selectedMemberId, onMemberSelect, className }: FamilyMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Add custom styles for markers
    const style = document.createElement('style');
    style.textContent = `
      .custom-marker {
        background: transparent !important;
        border: none !important;
      }
      .leaflet-popup-content-wrapper {
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      }
      .leaflet-popup-content {
        margin: 12px 16px;
      }
    `;
    document.head.appendChild(style);

    setMapReady(true);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  // Get members with valid locations
  const membersWithLocation = members.filter(m => m.location !== null);

  // Calculate center from members or default to a location
  const center = membersWithLocation.length > 0
    ? {
      lat: membersWithLocation.reduce((sum, m) => sum + (m.location?.lat || 0), 0) / membersWithLocation.length,
      lng: membersWithLocation.reduce((sum, m) => sum + (m.location?.lng || 0), 0) / membersWithLocation.length,
    }
    : { lat: -12.0464, lng: -77.0428 }; // Default to Lima, Peru

  if (!isClient || !mapReady) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50/30 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin" />
          <p className="text-neutral-500">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  // If no members have locations, show empty state
  if (membersWithLocation.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-neutral-50 via-primary-50/20 to-secondary-50/20 relative ${className}`}>
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-primary-100/50 animate-float" />
        <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-secondary-100/50 animate-float" style={{ animationDelay: '1s' }} />

        <div className="text-center p-8 relative z-10">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-200">
            <MapPinIcon className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-800 mb-3">
            Mapa Interactivo
          </h3>
          <p className="text-neutral-500 max-w-md mx-auto mb-6">
            {members.length === 0
              ? 'Agrega miembros a tu familia para ver sus ubicaciones en el mapa.'
              : 'Los miembros de tu familia aún no han compartido su ubicación. Invítalos a vincularse para ver su ubicación en tiempo real.'}
          </p>
          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-neutral-100 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-emerald-500" />
              <span className="text-neutral-600">En línea</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
              <span className="text-neutral-600">Ausente</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-neutral-300" />
              <span className="text-neutral-600">Sin conexión</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        className="w-full h-full rounded-2xl"
        style={{ background: '#f5f5f5' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {membersWithLocation.map((member) => {
          if (!member.location) return null;

          return (
            <Marker
              key={member.id}
              position={[member.location.lat, member.location.lng]}
              icon={createCustomIcon(member.status, selectedMemberId === member.id)}
              eventHandlers={{
                click: () => onMemberSelect(member.id),
              }}
            >
              <Popup>
                <div className="text-center min-w-[150px]">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-lg">
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <p className="font-semibold text-neutral-800">{member.name}</p>
                  <p className="text-xs text-neutral-500 mt-1">{member.location.address}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-green-500' : member.status === 'away' ? 'bg-amber-500' : 'bg-neutral-400'
                      }`} />
                    <span className="text-xs text-neutral-600 capitalize">
                      {member.status === 'online' ? 'En línea' : member.status === 'away' ? 'Ausente' : 'Sin conexión'}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-4 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-sm border border-neutral-100 shadow-lg text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500" />
          <span className="text-neutral-600">En línea</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
          <span className="text-neutral-600">Ausente</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
          <span className="text-neutral-600">Offline</span>
        </span>
      </div>

      {/* Zoom controls style override */}
      <style jsx global>{`
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
          border-radius: 12px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          background: white !important;
          color: #374151 !important;
          border: none !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f3f4f6 !important;
        }
      `}</style>
    </div>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
