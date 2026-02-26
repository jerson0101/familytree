'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Avatar,
  Badge,
  Skeleton,
} from '@kintree/ui';
import { createClient } from '@/lib/supabase';
import { useFamily } from '@/hooks/useFamily';

interface LocationHistoryItem {
  id: string;
  personId: string;
  personName: string;
  location: string;
  address: string;
  timestamp: string;
  type: 'geofence_enter' | 'geofence_exit' | 'location_update';
}

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Entries', value: 'geofence_enter' },
  { label: 'Exits', value: 'geofence_exit' },
];

export default function SecurityHistoryPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { currentFamily } = useFamily();

  const [history, setHistory] = useState<LocationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7days');

  // Calculate date range
  const getDateFilter = useCallback(() => {
    const now = new Date();
    switch (dateRange) {
      case 'today':
        return new Date(now.setHours(0, 0, 0, 0)).toISOString();
      case '7days':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case '30days':
        return new Date(now.setDate(now.getDate() - 30)).toISOString();
      default:
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
    }
  }, [dateRange]);

  // Fetch location history
  const fetchHistory = useCallback(async () => {
    if (!currentFamily?.id) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const dateFilter = getDateFilter();

      const { data, error } = await supabase
        .from('location_history')
        .select(`
          id,
          person_id,
          event_type,
          address,
          recorded_at,
          persons:person_id(first_name, last_name),
          security_zones:zone_id(name)
        `)
        .eq('family_id', currentFamily.id)
        .gte('recorded_at', dateFilter)
        .order('recorded_at', { ascending: false })
        .limit(50);

      if (error) {
        // Silently ignore errors - table might not exist yet
        setHistory([]);
      } else {
        setHistory(
          (data || []).map((item: any) => ({
            id: item.id,
            personId: item.person_id,
            personName: item.persons
              ? `${item.persons.first_name} ${item.persons.last_name || ''}`.trim()
              : 'Unknown',
            location: item.security_zones?.name || 'Location',
            address: item.address || '',
            timestamp: item.recorded_at,
            type: item.event_type,
          }))
        );
      }
    } catch {
      // Silently ignore errors - table might not exist yet
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentFamily?.id, supabase, getDateFilter]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredHistory = history.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.type === selectedFilter;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton width={40} height={40} />
            <Skeleton width={250} height={32} />
          </div>
          <Skeleton width={150} height={40} />
        </div>
        <div className="flex gap-2">
          <Skeleton width={80} height={36} />
          <Skeleton width={80} height={36} />
          <Skeleton width={80} height={36} />
        </div>
        <Skeleton height={300} />
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
          <h1 className="text-2xl font-bold text-neutral-900">Location History</h1>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-2 border border-neutral-200 rounded-xl text-sm"
        >
          <option value="today">Today</option>
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
        </select>
      </div>

      <div className="flex gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={selectedFilter === filter.value ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-neutral-900">Recent Activity</h3>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <HistoryIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-neutral-600 mb-2">No activity</h3>
              <p className="text-neutral-400 max-w-sm mx-auto">
                No location records for the selected period.
                History will update when members enter or leave configured zones.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  <Avatar name={item.personName} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900">{item.personName}</p>
                      <Badge
                        variant={item.type === 'geofence_enter' ? 'success' : 'secondary'}
                      >
                        {item.type === 'geofence_enter' ? 'Entered' : 'Exited'}
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-600">{item.location}</p>
                    {item.address && <p className="text-xs text-neutral-400">{item.address}</p>}
                  </div>
                  <p className="text-sm text-neutral-500 whitespace-nowrap">
                    {formatDate(item.timestamp)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
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

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
