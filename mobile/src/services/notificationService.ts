/**
 * notificationService.ts
 * Clean Architecture service for fetching and managing safety notifications directly from PostgreSQL backend.
 */

import { apiClient } from './apiClient';
import { API_CONFIG } from './apiConfig';

export interface BackendNotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  category: 'spatial' | 'guardian' | 'report';
  severity: 'urgent' | 'warning' | 'info' | 'safe';
  action_type: 'map' | 'track' | 'report';
  action_label: string;
  is_read: boolean;
  created_at: string;
}

export interface BackendNotificationListResponse {
  notifications: BackendNotificationItem[];
  unread_count: number;
  total_count: number;
}

export interface INotificationService {
  getNotifications(): Promise<BackendNotificationListResponse>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
}

export class NotificationService implements INotificationService {
  constructor(private client = apiClient) {}

  async getNotifications(): Promise<BackendNotificationListResponse> {
    const response = await this.client.get<BackendNotificationListResponse>(
      API_CONFIG.endpoints.notifications.list
    );
    return response.data;
  }

  async markAsRead(id: string): Promise<void> {
    await this.client.put(API_CONFIG.endpoints.notifications.markRead(id));
  }

  async markAllAsRead(): Promise<void> {
    await this.client.put(API_CONFIG.endpoints.notifications.markAllRead);
  }
}

export const notificationService = new NotificationService();
