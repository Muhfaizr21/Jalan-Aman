/**
 * JalanAman Mobile - Modul 7 System Settings & Hardware Telemetry Domain Types
 * Clean Code & SOLID: Segregated interfaces for System Settings, Storage, Sensors, and Privacy.
 */

export type SensorSensitivityLevel = 'low' | 'medium' | 'high';

export interface StorageLegendItem {
  id: string;
  label: string;
  sizeLabel: string;
  color: string;
  tag?: string;
}

export interface StorageAllocationData {
  usedGb: number;
  totalGb: number;
  usedPercentage: number;
  items: StorageLegendItem[];
}

export interface SystemSettingsState {
  // Sensors & Protection
  anomalyDetection: boolean;
  autoDeadmanSwitch: boolean;
  shockSensitivity: SensorSensitivityLevel;

  // Privacy & Tracking
  endToEndEncryption: boolean;
  obfuscateFeedLocation: boolean;
  autoPurgeHistory: boolean;

  // Audio & Siren
  maxSirenVolume: boolean;
  hapticFeedback: boolean;
}
