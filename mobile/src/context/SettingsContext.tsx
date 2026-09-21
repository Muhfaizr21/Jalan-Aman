/**
 * SettingsContext.tsx
 * React Context providing reactive, globally synchronized system settings and hardware telemetry.
 * Clean Code & SOLID: Open/Closed Principle (OCP) and Dependency Inversion Principle (DIP).
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  SystemSettingsState,
  StorageAllocationData,
} from '@/types/settings';
import {
  settingsStorage,
  DEFAULT_SYSTEM_SETTINGS,
  DEFAULT_STORAGE_ALLOCATION,
} from '@/services/settingsStorage';
import { settingsService } from '@/services/settingsService';
import { hardwareSensors } from '@/services/hardwareSensors';
import { offlineMapCache, OfflineDownloadProgress } from '@/services/offlineMapCache';
import { useAuth } from '@/hooks/useAuth';

interface SettingsContextValue {
  settings: SystemSettingsState;
  storageData: StorageAllocationData;
  isLoading: boolean;
  isDownloadingMap: boolean;
  downloadProgress: OfflineDownloadProgress | null;
  updateSetting: <K extends keyof SystemSettingsState>(
    key: K,
    value: SystemSettingsState[K]
  ) => Promise<void>;
  updateMultipleSettings: (partial: Partial<SystemSettingsState>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  purgeCache: () => Promise<void>;
  toggleOfflineMapDownload: (downloaded: boolean) => Promise<void>;
  backupSettingsToCloud: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState<SystemSettingsState>(DEFAULT_SYSTEM_SETTINGS);
  const [storageData, setStorageData] = useState<StorageAllocationData>(DEFAULT_STORAGE_ALLOCATION);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloadingMap, setIsDownloadingMap] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<OfflineDownloadProgress | null>(null);

  // Inisialisasi sensor akselerometer 3D saat mount
  useEffect(() => {
    hardwareSensors.startMotionDetection(settings.shockSensitivity);
    return () => {
      hardwareSensors.stopMotionDetection();
    };
  }, []);

  // Sinkronkan kepekaan akselerometer saat sensitivitas berubah
  useEffect(() => {
    hardwareSensors.setSensitivity(settings.shockSensitivity);
  }, [settings.shockSensitivity]);

  // Initial Load: local first, then sync with PostgreSQL backend if authenticated
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [savedLocalSettings, savedStorage] = await Promise.all([
          settingsStorage.getSettings(),
          settingsStorage.getStorageAllocation(),
        ]);
        if (isMounted) {
          setSettings(savedLocalSettings);
          setStorageData(savedStorage);
        }

        // If authenticated, fetch canonical settings from Go Backend PostgreSQL
        if (isAuthenticated) {
          try {
            const remoteSettings = await settingsService.getSettings();
            if (isMounted) {
              setSettings(remoteSettings);
              await settingsStorage.saveSettings(remoteSettings);
            }
          } catch {
            // Offline or network error -> continue with local settings
          }
        }
      } catch {
        // Fallback to defaults
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Update a single setting
  const updateSetting = useCallback(
    async <K extends keyof SystemSettingsState>(key: K, value: SystemSettingsState[K]) => {
      // 1. Berikan haptic feedback langsung jika diizinkan
      if (settings.hapticFeedback) {
        hardwareSensors.triggerHaptic([35]);
      }

      // 2. Optimistic local update
      setSettings((prev) => ({ ...prev, [key]: value }));
      await settingsStorage.saveSettings({ [key]: value });

      // 3. Sync to Go Backend PostgreSQL
      if (isAuthenticated) {
        try {
          await settingsService.updateSettings({ [key]: value });
        } catch {
          // Keep local change, will sync on next online session
        }
      }
    },
    [isAuthenticated, settings.hapticFeedback]
  );

  // Update multiple settings at once
  const updateMultipleSettings = useCallback(
    async (partial: Partial<SystemSettingsState>) => {
      if (settings.hapticFeedback) {
        hardwareSensors.triggerHaptic([40]);
      }
      setSettings((prev) => ({ ...prev, ...partial }));
      await settingsStorage.saveSettings(partial);

      if (isAuthenticated) {
        try {
          await settingsService.updateSettings(partial);
        } catch {
          // Graceful offline fallback
        }
      }
    },
    [isAuthenticated, settings.hapticFeedback]
  );

  // Reset to default settings
  const resetToDefaults = useCallback(async () => {
    hardwareSensors.triggerHaptic([60, 40, 60], settings.hapticFeedback);
    const defaults = await settingsStorage.resetSettings();
    setSettings(defaults);

    if (isAuthenticated) {
      try {
        await settingsService.resetSettings();
      } catch {
        // Fallback to local reset
      }
    }
  }, [isAuthenticated, settings.hapticFeedback]);

  // Purge offline cache
  const purgeCache = useCallback(async () => {
    hardwareSensors.triggerHaptic([50, 50], settings.hapticFeedback);
    const updated = await settingsStorage.purgeCache();
    setStorageData(updated);
  }, [settings.hapticFeedback]);

  // Toggle offline vector map download with REAL progress tracking
  const toggleOfflineMapDownload = useCallback(
    async (downloaded: boolean) => {
      hardwareSensors.triggerHaptic([80], settings.hapticFeedback);
      if (downloaded) {
        setIsDownloadingMap(true);
        try {
          await offlineMapCache.downloadAndCachePack((progress) => {
            setDownloadProgress(progress);
          });
        } catch (err: any) {
          Alert.alert('Unduhan Peta Gagal', err?.message || 'Koneksi ke server terputus');
        } finally {
          setIsDownloadingMap(false);
          setDownloadProgress(null);
        }
      } else {
        await offlineMapCache.purgeCache();
      }

      const updated = await offlineMapCache.calculateStorageData();
      setStorageData(updated);
    },
    [settings.hapticFeedback]
  );

  // Backup settings to cloud
  const backupSettingsToCloud = useCallback(async () => {
    hardwareSensors.triggerHaptic([50, 50, 100], settings.hapticFeedback);
    try {
      if (isAuthenticated) {
        const remote = await settingsService.updateSettings(settings);
        setSettings(remote);
      }
      Alert.alert(
        '✅ Cadangan Cloud Berhasil',
        'Seluruh konfigurasi sensor gerak, batas kepekaan guncangan, dan enkripsi privasi rute berhasil diamankan ke Server PostgreSQL JalanAman.'
      );
    } catch (err: any) {
      Alert.alert('Cadangan Gagal', err?.message || 'Gagal menyinkronkan pengaturan ke cloud.');
    }
  }, [isAuthenticated, settings]);

  const value: SettingsContextValue = {
    settings,
    storageData,
    isLoading,
    isDownloadingMap,
    downloadProgress,
    updateSetting,
    updateMultipleSettings,
    resetToDefaults,
    purgeCache,
    toggleOfflineMapDownload,
    backupSettingsToCloud,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export function useSystemSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSystemSettings must be used within a SettingsProvider');
  }
  return context;
}
