/**
 * JalanAman Mobile - Modul 1 Dashboard Domain Types
 * Clean Code & SOLID: Segregated interfaces for Home Screen components.
 */

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  locationLabel: string;
  isOnline: boolean;
}

export interface TrustScoreData {
  score: number;
  maxScore: number;
  label: string;
}

export interface RadarStatusData {
  isActive: boolean;
  radiusKm: number;
  badgeLabel: string;
  statusText: string;
}

export interface QuickDestinationChip {
  id: string;
  label: string;
  type: 'office' | 'transit' | 'home';
  query: string;
}

export interface AmbientPinItem {
  id: string;
  label: string;
  type: 'police' | 'hospital' | 'hazard';
  top: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
}

export interface QuickActionItem {
  id: 'route' | 'report' | 'shelter' | 'contacts';
  title: string;
  subtitle: string;
  badgeCount?: number;
}

export interface CommunitySafetyReport {
  id: string;
  badgeType: 'verified' | 'warning' | 'safe_haven';
  badgeLabel: string;
  timeAgo: string;
  description: string;
  confirmations: number;
  isConfirmed?: boolean;
}

export type DashboardTabId = 'radar' | 'routes' | 'sos' | 'feed' | 'profile';
