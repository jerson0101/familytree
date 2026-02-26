'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Badge,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  Input,
  Skeleton,
} from '@kintree/ui';
import { createClient } from '@/lib/supabase';
import { useFamily } from '@/hooks/useFamily';

interface SecurityZone {
  id: string;
  name: string;
  address: string;
  radius: number;
  zoneType: 'home' | 'work' | 'school' | 'family' | 'other';
  isActive: boolean;
}

const zoneTypes = {
  home: { label: 'Home', color: 'bg-green-100 text-green-700' },
  work: { label: 'Work', color: 'bg-blue-100 text-blue-700' },
  school: { label: 'School', color: 'bg-yellow-100 text-yellow-700' },
  family: { label: 'Family', color: 'bg-purple-100 text-purple-700' },
  other: { label: 'Other', color: 'bg-neutral-100 text-neutral-700' },
};

export default function HeritageZonesPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { currentFamily } = useFamily();

  const [zones, setZones] = useState<SecurityZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newZone, setNewZone] = useState({ name: '', address: '', radius: 100, type: 'home' });

  // Fetch zones from database
  const fetchZones = useCallback(async () => {
    if (!currentFamily?.id) {
      setZones([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('security_zones')
        .select('*')
        .eq('family_id', currentFamily.id)
        .order('created_at', { ascending: false });

      if (error) {
        // Silently ignore errors - table might not exist yet
        setZones([]);
      } else {
        setZones(
          (data || []).map((z: any) => ({
            id: z.id,
            name: z.name,
            address: z.address,
            radius: z.radius,
            zoneType: z.zone_type,
            isActive: z.is_active,
          }))
        );
      }
    } catch {
      // Silently ignore errors - table might not exist yet
    } finally {
      setIsLoading(false);
    }
  }, [currentFamily?.id, supabase]);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const toggleZone = async (id: string) => {
    const zone = zones.find((z) => z.id === id);
    if (!zone) return;

    const newIsActive = !zone.isActive;

    // Optimistic update
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, isActive: newIsActive } : z))
    );

    const { error } = await supabase
      .from('security_zones')
      .update({ is_active: newIsActive, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      // Revert on error
      setZones((prev) =>
        prev.map((z) => (z.id === id ? { ...z, isActive: !newIsActive } : z))
      );
      // Silently ignore errors
    }
  };

  const handleCreateZone = async () => {
    if (!currentFamily?.id || !newZone.name.trim() || !newZone.address.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('security_zones')
        .insert({
          family_id: currentFamily.id,
          name: newZone.name.trim(),
          address: newZone.address.trim(),
          radius: newZone.radius,
          zone_type: newZone.type,
          created_by: userData.user.id,
        })
        .select()
        .single();

      if (error) {
        // Silently ignore errors - table might not exist yet
        return;
      }

      setZones((prev) => [
        {
          id: data.id,
          name: data.name,
          address: data.address,
          radius: data.radius,
          zoneType: data.zone_type,
          isActive: data.is_active,
        },
        ...prev,
      ]);
      setShowDialog(false);
      setNewZone({ name: '', address: '', radius: 100, type: 'home' });
    } catch (error) {
      console.error('Error creating zone:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteZone = async (id: string) => {
    const { error } = await supabase
      .from('security_zones')
      .delete()
      .eq('id', id);

    if (!error) {
      setZones((prev) => prev.filter((z) => z.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton width={200} height={32} />
          <Skeleton width={120} height={40} />
        </div>
        <Skeleton height={100} />
        <Skeleton height={100} />
        <Skeleton height={100} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-neutral-900">Safety Zones</h1>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          New Zone
        </Button>
      </div>

      <p className="text-neutral-600">
        Define important zones for your family and receive notifications when members
        enter or leave them.
      </p>

      {zones.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPinIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-neutral-600 mb-2">No zones configured</h3>
            <p className="text-neutral-400 mb-4">
              Create important zones for your family like home, work, or school.
            </p>
            <Button onClick={() => setShowDialog(true)}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Create first zone
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {zones.map((zone) => {
            const typeInfo = zoneTypes[zone.zoneType as keyof typeof zoneTypes] || zoneTypes.other;
            return (
              <Card key={zone.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-neutral-900">{zone.name}</h3>
                        <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + typeInfo.color}>
                          {typeInfo.label}
                        </span>
                        {!zone.isActive && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600">{zone.address}</p>
                      <p className="text-xs text-neutral-400 mt-1">Radius: {zone.radius}m</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDeleteZone(zone.id)}
                        className="text-neutral-400 hover:text-red-500 transition-colors"
                        title="Delete zone"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={zone.isActive}
                          onChange={() => toggleZone(zone.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogHeader>
          <h2 className="text-lg font-semibold">New Safety Zone</h2>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
              <Input
                value={newZone.name}
                onChange={(e) => setNewZone((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Grandma's House"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Address</label>
              <Input
                value={newZone.address}
                onChange={(e) => setNewZone((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Address or location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
              <select
                value={newZone.type}
                onChange={(e) => setNewZone((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-sm"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="school">School</option>
                <option value="family">Family</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Radius ({newZone.radius}m)
              </label>
              <input
                type="range"
                min="50"
                max="500"
                value={newZone.radius}
                onChange={(e) => setNewZone((prev) => ({ ...prev, radius: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleCreateZone} loading={isSubmitting} disabled={!newZone.name.trim() || !newZone.address.trim()}>
            Create Zone
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
