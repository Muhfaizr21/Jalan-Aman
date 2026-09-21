/**
 * notificationStorage.ts
 * Clean architecture adapter for persisting read notification IDs across Web and Native.
 * Adheres to Single Responsibility Principle (SRP) and Dependency Inversion Principle (DIP).
 */

import { Platform } from 'react-native';

const STORAGE_KEY = 'jalanaman_read_notification_ids';

export interface INotificationStorage {
  getReadIds(): Promise<string[]>;
  saveReadIds(ids: string[]): Promise<void>;
  markIdAsRead(id: string): Promise<string[]>;
  clearReadIds(): Promise<void>;
}

class MemoryNotificationStorage implements INotificationStorage {
  private inMemoryIds: Set<string> = new Set();

  async getReadIds(): Promise<string[]> {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            this.inMemoryIds = new Set(parsed);
            return parsed;
          }
        }
      } catch {
        // Fallback to memory
      }
    }
    return Array.from(this.inMemoryIds);
  }

  async saveReadIds(ids: string[]): Promise<void> {
    this.inMemoryIds = new Set(ids);
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      } catch {
        // Fallback to memory
      }
    }
  }

  async markIdAsRead(id: string): Promise<string[]> {
    this.inMemoryIds.add(id);
    const list = Array.from(this.inMemoryIds);
    await this.saveReadIds(list);
    return list;
  }

  async clearReadIds(): Promise<void> {
    this.inMemoryIds.clear();
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignored
      }
    }
  }
}

export const notificationStorage: INotificationStorage = new MemoryNotificationStorage();
