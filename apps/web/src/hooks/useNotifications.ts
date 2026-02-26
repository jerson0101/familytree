'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase';

export interface Notification {
  id: string;
  userId: string;
  familyId?: string;
  type: string;
  title: string;
  body?: string;
  data?: Record<string, any>;
  read: boolean;
  readAt?: string;
  createdAt: string;
}

export function useNotifications() {
  const supabase = useMemo(() => createClient(), []);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      const mapped: Notification[] = (data || []).map((n: any) => ({
        id: n.id,
        userId: n.user_id,
        familyId: n.family_id,
        type: n.type,
        title: n.title,
        body: n.body,
        data: n.data,
        read: n.read,
        readAt: n.read_at,
        createdAt: n.created_at,
      }));

      setNotifications(mapped);
      setUnreadCount(mapped.filter(n => !n.read).length);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Subscribe to realtime notifications
  useEffect(() => {
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {
            const newNotification: Notification = {
              id: payload.new.id,
              userId: payload.new.user_id,
              familyId: payload.new.family_id,
              type: payload.new.type,
              title: payload.new.title,
              body: payload.new.body,
              data: payload.new.data,
              read: payload.new.read,
              readAt: payload.new.read_at,
              createdAt: payload.new.created_at,
            };

            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Show browser notification if permission granted
            if (Notification.permission === 'granted') {
              new Notification(newNotification.title, {
                body: newNotification.body,
                icon: '/icon-192.png',
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupSubscription();
  }, [supabase]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          read: true,
          read_at: new Date().toISOString(),
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, read: true, readAt: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error:', err);
    }
  }, [supabase]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({
          read: true,
          read_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.error('Error marking all as read:', error);
        return;
      }

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error:', err);
    }
  }, [supabase]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const notification = notifications.find(n => n.id === notificationId);

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Error deleting notification:', error);
        return;
      }

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }, [supabase, notifications]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: fetchNotifications,
    requestPermission,
  };
}
