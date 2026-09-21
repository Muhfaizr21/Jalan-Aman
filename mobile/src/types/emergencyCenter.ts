/**
 * JalanAman Mobile - Modul 6 Emergency Center & Safe Haven Domain Types
 * Clean Code & SOLID: Segregated interfaces for Emergency Panic & Safe Haven services.
 */

export interface EmergencyCallService {
  id: string;
  number: string;
  name: string;
  unit: string;
  badge: string;
  category: 'police' | 'medical' | 'fire' | 'hotline';
}

export interface SafeHavenItem {
  id: string;
  name: string;
  address: string;
  distanceMeters: number;
  etaMinutes: number;
  badges: Array<{
    id: string;
    label: string;
    icon: 'videocam' | 'light_mode' | 'shield' | 'health_and_safety' | 'group' | 'store' | 'wb_sunny';
    colorType: 'primary' | 'secondary' | 'tertiary' | 'alert' | 'muted';
  }>;
  actionType: 'evacuate_now' | 'view_route_map';
  actionLabel: string;
}

export interface TelemetryLocationData {
  address: string;
  district: string;
  accuracyMeters: number;
  statusText: string;
}
