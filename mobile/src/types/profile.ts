/**
 * JalanAman Mobile - Modul 2 Profile Domain Types
 * Clean Code & SOLID: Segregated contracts for User Profile, Medical ID & Guardians.
 */

export type TransportMode = 'walk' | 'motorcycle' | 'car';

export interface UserProfileDetails {
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  memberId: string;
  isKtpVerified: boolean;
  isActiveMember: boolean;
  selectedTransport: TransportMode;
}

export interface TrustScoreDetails {
  score: number;
  maxScore: number;
  tierLabel: string;
  tierStatus: string;
  verifiedRoutesCount: number;
  sosResponseRate: number;
  violationsCount: number;
}

export interface MedicalVitalRecord {
  label: string;
  value: string;
  subValue: string;
  indicatorColor: string;
}

export interface MedicalIDData {
  bloodType: string;
  rhesus: string;
  donorLabel: string;
  vitals: MedicalVitalRecord[];
  showOnLockScreen: boolean;
}

export interface GuardianContactItem {
  id: string;
  name: string;
  relation: string;
  phone: string;
  badgeLabel: string;
  badgeType: 'full_location' | 'emergency_sos' | 'patrol_cctv';
  statusText: string;
}

export interface GuardiansCircleData {
  connectedCount: number;
  contacts: GuardianContactItem[];
  corridorAlertEnabled: boolean;
  deviationThresholdMeters: number;
}
