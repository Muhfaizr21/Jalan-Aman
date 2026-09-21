/**
 * settingsService.ts
 * Clean architecture service communicating with JalanAman Go Backend for User System Settings.
 */

import { apiClient, ApiClient } from './apiClient';
import { API_CONFIG } from './apiConfig';
import { SystemSettingsState } from '@/types/settings';

export interface BackendUserSettings {
  user_id: string;
  anomaly_detection: boolean;
  auto_deadman_switch: boolean;
  shock_sensitivity: 'low' | 'medium' | 'high';
  end_to_end_encryption: boolean;
  obfuscate_feed_location: boolean;
  auto_purge_history: boolean;
  max_siren_volume: boolean;
  haptic_feedback: boolean;
  updated_at: string;
}

export const mapBackendToSystemSettings = (data: BackendUserSettings): SystemSettingsState => ({
  anomalyDetection: data.anomaly_detection,
  autoDeadmanSwitch: data.auto_deadman_switch,
  shockSensitivity: data.shock_sensitivity,
  endToEndEncryption: data.end_to_end_encryption,
  obfuscateFeedLocation: data.obfuscate_feed_location,
  autoPurgeHistory: data.auto_purge_history,
  maxSirenVolume: data.max_siren_volume,
  hapticFeedback: data.haptic_feedback,
});

export const mapSystemSettingsToBackend = (
  state: Partial<SystemSettingsState>
): Record<string, any> => {
  const mapped: Record<string, any> = {};
  if (state.anomalyDetection !== undefined) mapped.anomaly_detection = state.anomalyDetection;
  if (state.autoDeadmanSwitch !== undefined) mapped.auto_deadman_switch = state.autoDeadmanSwitch;
  if (state.shockSensitivity !== undefined) mapped.shock_sensitivity = state.shockSensitivity;
  if (state.endToEndEncryption !== undefined) mapped.end_to_end_encryption = state.endToEndEncryption;
  if (state.obfuscateFeedLocation !== undefined) mapped.obfuscate_feed_location = state.obfuscateFeedLocation;
  if (state.autoPurgeHistory !== undefined) mapped.auto_purge_history = state.autoPurgeHistory;
  if (state.maxSirenVolume !== undefined) mapped.max_siren_volume = state.maxSirenVolume;
  if (state.hapticFeedback !== undefined) mapped.haptic_feedback = state.hapticFeedback;
  return mapped;
};

export interface ISettingsService {
  getSettings(): Promise<SystemSettingsState>;
  updateSettings(settings: Partial<SystemSettingsState>): Promise<SystemSettingsState>;
  resetSettings(): Promise<SystemSettingsState>;
}

export class SettingsService implements ISettingsService {
  constructor(private client: ApiClient = apiClient) {}

  async getSettings(): Promise<SystemSettingsState> {
    const response = await this.client.get<BackendUserSettings>(API_CONFIG.endpoints.users.settings);
    return mapBackendToSystemSettings(response.data);
  }

  async updateSettings(settings: Partial<SystemSettingsState>): Promise<SystemSettingsState> {
    const payload = mapSystemSettingsToBackend(settings);
    const response = await this.client.put<BackendUserSettings>(
      API_CONFIG.endpoints.users.settings,
      payload
    );
    return mapBackendToSystemSettings(response.data);
  }

  async resetSettings(): Promise<SystemSettingsState> {
    const response = await this.client.post<BackendUserSettings>(
      API_CONFIG.endpoints.users.settingsReset,
      {}
    );
    return mapBackendToSystemSettings(response.data);
  }
}

export const settingsService: ISettingsService = new SettingsService();
