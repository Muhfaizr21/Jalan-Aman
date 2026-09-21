/**
 * JalanAman Mobile - Modul 4: Proteksi Perjalanan & Deadman's Switch Types
 * Clean Code & SOLID principles.
 */

export interface TripTelemetryData {
  destinationTitle: string;
  distanceKm: number;
  etaMinutes: number;
  speedKmh: number;
  batteryPercent: number;
  signalLabel: string;
  isCorridorSafe: boolean;
}

export interface GuardianQuickContact {
  id: string;
  name: string;
  relation: string;
  statusText: string;
  isOnline: boolean;
  avatarUrl?: string;
  iconName?: 'family' | 'police' | 'user';
}

export interface AnomalySensorAlert {
  title: string;
  description: string;
  secondsRemaining: number;
  isTriggered: boolean;
}
