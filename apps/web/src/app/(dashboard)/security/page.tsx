'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Button,
  Avatar,
  Badge,
  Tabs,
  TabList,
  TabTrigger,
  TabContent,
  Skeleton,
} from '@kintree/ui';
import { useFamilyTree } from '@/hooks/useFamilyTree';
import { useLocationTracking } from '@/hooks/useLocationTracking';

// Dynamically import components
const FamilyMap = dynamic(() => import('@/components/FamilyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50/30">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin" />
        <p className="text-neutral-500">Loading map...</p>
      </div>
    </div>
  ),
});

const LocationPermissionModal = dynamic(() => import('@/components/LocationPermissionModal'), {
  ssr: false,
});

interface FamilyMemberDisplay {
  id: string;
  name: string;
  photoUrl: string | null;
  status: 'online' | 'away' | 'offline';
  lastSeen: string | null;
  location: { lat: number; lng: number; address: string } | null;
  batteryLevel: number | null;
  linkedUserId: string | null;
}

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const { persons, isLoading: personsLoading } = useFamilyTree();
  const {
    familyLocations,
    settings,
    permissionStatus,
    isTracking,
    enableLocationSharing,
    disableLocationSharing,
    isLoading: locationLoading,
  } = useLocationTracking();

  // Combine persons data with real location data
  const familyMembersWithLocation: FamilyMemberDisplay[] = useMemo(() => {
    const matchedUserIds = new Set<string>();

    const members: FamilyMemberDisplay[] = persons.map((person) => {
      // Find real location data for this person
      const locationData = familyLocations.find((loc) => {
        if (loc.personId === person.id) return true;
        if (person.linkedUserId && loc.userId === person.linkedUserId) return true;

        // Fuzzy match fallback: link by first name if explicitly missing
        const pFirst = (person.firstName || '').trim().toLowerCase();
        const lFirst = (loc.firstName || '').trim().toLowerCase();
        if (pFirst && lFirst && pFirst.length >= 2 && lFirst.length >= 2) {
          if (pFirst === lFirst || pFirst.includes(lFirst) || lFirst.includes(pFirst)) {
            return true;
          }
        }
        return false;
      });

      if (locationData) {
        matchedUserIds.add(locationData.userId);
        // Has real location data
        const now = new Date();
        const lastUpdate = new Date(locationData.lastUpdatedAt);
        const minutesSinceUpdate = (now.getTime() - lastUpdate.getTime()) / 60000;

        let status: 'online' | 'away' | 'offline' = 'offline';
        if (minutesSinceUpdate < 5) {
          status = 'online';
        } else if (minutesSinceUpdate < 30) {
          status = 'away';
        }

        return {
          id: person.id,
          name: `${person.firstName} ${person.lastName || ''}`.trim(),
          photoUrl: person.photoUrl || locationData.photoUrl,
          status,
          lastSeen: locationData.lastUpdatedAt,
          location: {
            lat: locationData.latitude,
            lng: locationData.longitude,
            address: locationData.address || locationData.city || 'Unknown location',
          },
          batteryLevel: locationData.batteryLevel,
          linkedUserId: locationData.userId,
        };
      }

      // No location data - check if has linked user
      return {
        id: person.id,
        name: `${person.firstName} ${person.lastName || ''}`.trim(),
        photoUrl: person.photoUrl || null,
        status: 'offline' as const,
        lastSeen: null,
        location: null,
        batteryLevel: null,
        linkedUserId: person.linkedUserId || null,
      };
    });

    // Add locations from users who are sharing but not yet linked to a person in the tree
    familyLocations.forEach((loc) => {
      if (!matchedUserIds.has(loc.userId)) {
        const now = new Date();
        const lastUpdate = new Date(loc.lastUpdatedAt);
        const minutesSinceUpdate = (now.getTime() - lastUpdate.getTime()) / 60000;

        let status: 'online' | 'away' | 'offline' = 'offline';
        if (minutesSinceUpdate < 5) status = 'online';
        else if (minutesSinceUpdate < 30) status = 'away';

        members.push({
          id: `unlinked-${loc.userId}`,
          name: `${loc.firstName || ''} ${loc.lastName || ''}`.trim() || 'Me',
          photoUrl: loc.photoUrl,
          status,
          lastSeen: loc.lastUpdatedAt,
          location: {
            lat: loc.latitude,
            lng: loc.longitude,
            address: loc.address || loc.city || 'Unknown location',
          },
          batteryLevel: loc.batteryLevel,
          linkedUserId: loc.userId,
        });
      }
    });

    return members;
  }, [persons, familyLocations]);

  const activeMembersCount = familyMembersWithLocation.filter(m => m.status !== 'offline').length;
  const membersWithLocationCount = familyMembersWithLocation.filter(m => m.location !== null).length;

  const isLoading = personsLoading || locationLoading;

  if (isLoading) {
    return (
      <Container size="full" padding={false}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Skeleton width={200} height={32} />
            <Skeleton width={300} height={20} className="mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Skeleton height={300} className="rounded-2xl" />
          </div>
          <div className="lg:col-span-3">
            <Skeleton height={600} className="rounded-2xl" />
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container size="full" padding={false}>
      {/* Header with gradient text */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary">Family Security</h1>
          <p className="text-neutral-500 mt-1">Location tracking and safety zones</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Location sharing toggle */}
          {permissionStatus === 'granted' ? (
            <Button
              variant={settings.shareLocation ? 'primary' : 'outline'}
              leftIcon={<LocationIcon />}
              onClick={() => settings.shareLocation ? disableLocationSharing() : enableLocationSharing()}
            >
              {settings.shareLocation ? 'Sharing' : 'Share'}
            </Button>
          ) : (
            <Button
              variant="primary"
              leftIcon={<LocationIcon />}
              onClick={() => setShowPermissionModal(true)}
            >
              Enable Location
            </Button>
          )}
          <Link href="/security/zones">
            <Button variant="outline" leftIcon={<ZoneIcon />}>
              Zones
            </Button>
          </Link>
          <Link href="/security/history">
            <Button variant="outline" leftIcon={<HistoryIcon />}>
              History
            </Button>
          </Link>
        </div>
      </div>

      {/* Tracking status banner */}
      {isTracking && (
        <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <p className="text-sm text-green-700">
            Your location is being shared with your family
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={disableLocationSharing}
            className="ml-auto text-green-600 hover:text-green-700"
          >
            Disable
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Family Members Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card padding="md" className="hover-lift">
            <CardHeader
              title="Family Members"
              subtitle={`${familyMembersWithLocation.length} members · ${membersWithLocationCount} with location`}
            />
            <CardContent>
              {familyMembersWithLocation.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <UsersIcon className="w-8 h-8 text-primary-500" />
                  </div>
                  <p className="text-neutral-500 text-sm mb-3">No family members yet.</p>
                  <Link href="/tree">
                    <Button variant="outline" size="sm">
                      Add members
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {familyMembersWithLocation.map((member, index) => (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMember(member.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all animate-slide-up ${selectedMember === member.id
                        ? 'bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 shadow-sm'
                        : 'hover:bg-neutral-50 border border-transparent'
                        }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="relative">
                        <Avatar name={member.name} size="md" ringColor={selectedMember === member.id ? 'primary' : undefined} />
                        <span
                          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${member.status === 'online'
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-sm shadow-green-300'
                            : member.status === 'away'
                              ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm shadow-amber-300'
                              : 'bg-neutral-300'
                            }`}
                        />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium text-neutral-900 truncate">{member.name}</p>
                        <p className="text-xs text-neutral-500 truncate">
                          {member.location?.address || (member.linkedUserId ? 'Location not shared' : 'No linked account')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        {member.batteryLevel !== null ? (
                          <BatteryIndicator level={member.batteryLevel} />
                        ) : (
                          <span className="text-xs text-neutral-300">--</span>
                        )}
                        <span className="text-xs text-neutral-400 mt-1">
                          {member.lastSeen ? formatLastSeen(member.lastSeen) : 'Never'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats with glassmorphism */}
          <Card padding="md" variant="glass" className="hover-lift">
            <CardHeader title="Security Status" />
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                  <span className="text-neutral-700 font-medium">All safe</span>
                  <Badge variant="success" glow>
                    <CheckIcon className="w-3 h-3 mr-1" />
                    OK
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Active members</span>
                  <span className="font-bold text-primary-600">{activeMembersCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Sharing location</span>
                  <span className="font-bold text-neutral-800">{membersWithLocationCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Alerts today</span>
                  <span className="font-bold text-neutral-800">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <TabList className="mb-4">
              <TabTrigger value="map">Live Map</TabTrigger>
              <TabTrigger value="alerts">Alerts</TabTrigger>
            </TabList>

            <TabContent value="map">
              {/* Map container with gradient border */}
              <div className="relative p-[2px] rounded-2xl bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400">
                <Card variant="default" padding="none" className="h-[600px] rounded-2xl overflow-hidden">
                  <FamilyMap
                    members={familyMembersWithLocation.map(m => ({
                      id: m.id,
                      name: m.name,
                      photoUrl: m.photoUrl,
                      status: m.status,
                      location: m.location,
                      isSelected: selectedMember === m.id,
                    }))}
                    selectedMemberId={selectedMember}
                    onMemberSelect={setSelectedMember}
                    className="w-full h-full"
                  />
                </Card>
              </div>
            </TabContent>

            <TabContent value="alerts">
              <Card padding="lg" className="hover-lift">
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <BellIcon className="w-10 h-10 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-3">No alerts</h3>
                  <p className="text-neutral-500 max-w-sm mx-auto">
                    All your family members are in safe zones.
                    You will receive notifications when someone enters or leaves a configured zone.
                  </p>
                </div>
              </Card>
            </TabContent>
          </Tabs>
        </div>
      </div>

      {/* Location Permission Modal */}
      <LocationPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onEnable={enableLocationSharing}
        onSkip={() => setShowPermissionModal(false)}
      />
    </Container>
  );
}

function formatLastSeen(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function BatteryIndicator({ level }: { level: number }) {
  const gradientClass = level > 50
    ? 'from-green-400 to-emerald-500'
    : level > 20
      ? 'from-amber-400 to-orange-500'
      : 'from-red-400 to-rose-500';

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative w-5 h-3">
        <div className="absolute inset-0 rounded-sm border border-neutral-300 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${gradientClass} transition-all`}
            style={{ width: `${level}%` }}
          />
        </div>
        <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-neutral-300 rounded-r-full" />
      </div>
      <span className="text-xs font-medium text-neutral-600">{level}%</span>
    </div>
  );
}

// Icons
function LocationIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ZoneIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
      <path d="M12 22V15.5M22 8.5L12 15.5 2 8.5" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}
