/**
 * settingsStorage.ts
 * Clean Architecture adapter for persisting System Settings and Hardware Telemetry preferences.
 * Follows Single Responsibility Principle (SRP) and Open/Closed Principle (OCP).
 */

import { Platform } from 'react-native';
import { SystemSettingsState, StorageAllocationData } from '@/types/settings';
import { offlineMapCache, OFFLINE_STATUS_KEY } from './offlineMapCache';

const SETTINGS_STORAGE_KEY = 'jalanaman_system_settings_v1';
const STORAGE_DATA_KEY = 'jalanaman_storage_allocation_v1';

export const DEFAULT_SYSTEM_SETTINGS: SystemSettingsState = {
  anomalyDetection: true,
  autoDeadmanSwitch: true,
  shockSensitivity: 'medium',
  endToEndEncryption: true,
  obfuscateFeedLocation: true,
  autoPurgeHistory: false,
  maxSirenVolume: true,
  hapticFeedback: true,
};

export const DEFAULT_STORAGE_ALLOCATION: StorageAllocationData = {
  usedGb: 2.42,
  totalGb: 8.0,
  usedPercentage: 30,
  items: [
    {
      id: 'maps',
      label: 'Peta Indramayu & Pantura Jatibarang',
      sizeLabel: '1.8 GB',
      color: '#84CC16',
      tag: 'Offline Siaga',
    },
    {
      id: 'voice_cache',
      label: 'Cache Suara, Peta & Telemetri Darurat',
      sizeLabel: '620 MB',
      color: '#0284C7',
    },
    {
      id: 'free_space',
      label: 'Ruang Memori Tersedia',
      sizeLabel: '5.58 GB',
      color: '#64748B',
    },
  ],
};

export interface ISettingsStorage {
  getSettings(): Promise<SystemSettingsState>;
  saveSettings(partial: Partial<SystemSettingsState>): Promise<SystemSettingsState>;
  resetSettings(): Promise<SystemSettingsState>;
  getStorageAllocation(): Promise<StorageAllocationData>;
  purgeCache(): Promise<StorageAllocationData>;
  setOfflineMapStatus(downloaded: boolean): Promise<StorageAllocationData>;
}

class MemorySettingsStorage implements ISettingsStorage {
  private inMemorySettings: SystemSettingsState = { ...DEFAULT_SYSTEM_SETTINGS };
  private inMemoryStorageData: StorageAllocationData = { ...DEFAULT_STORAGE_ALLOCATION };

  async getSettings(): Promise<SystemSettingsState> {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          this.inMemorySettings = { ...DEFAULT_SYSTEM_SETTINGS, ...parsed };
          return this.inMemorySettings;
        }
      } catch {
        // Fallback to memory
      }
    }
    return { ...this.inMemorySettings };
  }

  async saveSettings(partial: Partial<SystemSettingsState>): Promise<SystemSettingsState> {
    this.inMemorySettings = { ...this.inMemorySettings, ...partial };
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(
          SETTINGS_STORAGE_KEY,
          JSON.stringify(this.inMemorySettings)
        );
      } catch {
        // Fallback to memory
      }
    }
    return { ...this.inMemorySettings };
  }

  async resetSettings(): Promise<SystemSettingsState> {
    this.inMemorySettings = { ...DEFAULT_SYSTEM_SETTINGS };
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(SETTINGS_STORAGE_KEY);
      } catch {
        // Ignored
      }
    }
    return { ...this.inMemorySettings };
  }

  async getStorageAllocation(): Promise<StorageAllocationData> {
    try {
      const realData = await offlineMapCache.calculateStorageData();
      this.inMemoryStorageData = realData;
      return realData;
    } catch {
      return { ...this.inMemoryStorageData };
    }
  }

  async purgeCache(): Promise<StorageAllocationData> {
    await offlineMapCache.purgeCache();
    const updated = await offlineMapCache.calculateStorageData();
    this.inMemoryStorageData = updated;
    return updated;
  }

  async setOfflineMapStatus(downloaded: boolean): Promise<StorageAllocationData> {
    if (downloaded) {
      try {
        await offlineMapCache.downloadAndCachePack();
      } catch (err) {
        console.warn('[Offline Map Download]', err);
      }
    } else {
      await offlineMapCache.purgeCache();
    }
    const updated = await offlineMapCache.calculateStorageData();
    this.inMemoryStorageData = updated;
    return updated;
  }
}

export const settingsStorage: ISettingsStorage = new MemorySettingsStorage();
