/**
 * NotificationContext.tsx
 * Clean Architecture & SOLID: Centralized Notification Provider & State.
 * Directly synchronized with PostgreSQL backend via notificationService.
 * Controls unread count, red badge icon on dashboard header, and read-status persistence.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { notificationService, notificationStorage, BackendNotificationItem } from '@/services';
import { NotificationItem } from '@/components/dashboard/NotificationCenterModal';

function formatIndonesianTimeAgo(dateString: string): string {
  try {
    const timestamp = new Date(dateString).getTime();
    if (isNaN(timestamp)) return 'Baru saja';

    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 60) return 'Baru saja';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mnt lalu`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
    if (diffSec < 172800) return 'Kemarin';
    return `${Math.floor(diffSec / 86400)} hari lalu`;
  } catch {
    return 'Baru saja';
  }
}

export interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  hasUnread: boolean;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetch: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [backendItems, setBackendItems] = useState<BackendNotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch real notifications from PostgreSQL via Go Backend
  const fetchNotificationsFromBackend = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await notificationService.getNotifications();
      if (res && Array.isArray(res.notifications)) {
        setBackendItems(res.notifications);
      }
    } catch (err) {
      console.warn('[NotificationContext] Fetching notifications error, using cache/fallback:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificationsFromBackend();
  }, [fetchNotificationsFromBackend]);

  // Dynamically assemble notifications from PostgreSQL backend items + user guardian status
  const notifications = useMemo<NotificationItem[]>(() => {
    const items: NotificationItem[] = backendItems.map((b) => ({
      id: b.id,
      category: b.category,
      severity: b.severity,
      title: b.title,
      message: b.message,
      timeAgo: formatIndonesianTimeAgo(b.created_at),
      isRead: b.is_read,
      actionLabel: b.action_label || 'Lihat di Peta',
      actionType: b.action_type || 'map',
    }));

    // Guardian Status Prompt (Device & Account status)
    if (user?.guardian_name) {
      const guardianId = `guardian-linked-${user.id || 'active'}`;
      items.push({
        id: guardianId,
        category: 'guardian',
        severity: 'safe',
        title: `Pengawal Siaga (${user.guardian_name})`,
        message: `${user.guardian_name} (${user.guardian_phone || 'Kontak terhubung'}) siap menerima sinyal darurat & pantauan langsung rute perjalanan Anda.`,
        timeAgo: 'Siaga',
        isRead: true,
        actionLabel: 'Detail Pengawal',
        actionType: 'track',
      });
    } else {
      const guardianSetupId = 'guardian-setup-prompt';
      items.push({
        id: guardianSetupId,
        category: 'guardian',
        severity: 'warning',
        title: 'Kontak Pengawal Belum Diatur',
        message: 'Tambahkan kontak pengawal di menu profil agar dapat memantau saat deadman switch darurat aktif.',
        timeAgo: 'Penting',
        isRead: false,
        actionLabel: 'Atur Pengawal',
        actionType: 'track',
      });
    }

    return items;
  }, [backendItems, user]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Mark single notification as read in PostgreSQL backend
  const markAsRead = useCallback(async (id: string) => {
    // 1. Optimistic local state update
    setBackendItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
    );

    // 2. Persist to PostgreSQL backend via Go REST API
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      console.warn('[NotificationContext] Failed to mark as read on backend:', err);
    }

    // 3. Keep local storage backup in sync
    await notificationStorage.markIdAsRead(id);
  }, []);

  // Mark all notifications as read in PostgreSQL backend
  const markAllAsRead = useCallback(async () => {
    // 1. Optimistic local state update
    setBackendItems((prev) => prev.map((item) => ({ ...item, is_read: true })));

    // 2. Persist to PostgreSQL backend via Go REST API
    try {
      await notificationService.markAllAsRead();
    } catch (err) {
      console.warn('[NotificationContext] Failed to mark all as read on backend:', err);
    }

    // 3. Keep local storage backup in sync
    const allIds = notifications.map((n) => n.id);
    await notificationStorage.saveReadIds(allIds);
  }, [notifications]);

  const refetch = useCallback(async () => {
    await fetchNotificationsFromBackend();
  }, [fetchNotificationsFromBackend]);

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount,
      hasUnread: unreadCount > 0,
      isLoading,
      markAsRead,
      markAllAsRead,
      refetch,
    }),
    [notifications, unreadCount, isLoading, markAsRead, markAllAsRead, refetch]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
