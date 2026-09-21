/**
 * JalanAman Mobile - Modul 3 Navigation Domain Types
 * Clean Code & SOLID: Interface Segregation for Route Planning & HUD Navigation.
 */

export type RouteOptionType = 'safe' | 'fast';

export interface RoutePerkItem {
  id: string;
  label: string;
  icon: 'sun' | 'shield' | 'cctv';
}

export interface RouteDetailItem {
  id: RouteOptionType;
  title: string;
  viaLabel: string;
  safetyScore: number;
  durationMin: number;
  distanceKm: number;
  etaText: string;
  isRecommended?: boolean;
  perks?: RoutePerkItem[];
  caution?: string;
}

export interface TurnInstructionData {
  distance: number;
  unit: string;
  instruction: string;
  nextStep: string;
  cctvCount: number;
  patrollerCount: number;
}

export interface SpatialHazardData {
  id: string;
  title: string;
  description: string;
  deviationMin: number;
  distanceAheadMeters: number;
  hazardType: 'dark_spot' | 'reported_incident' | 'roadblock';
}

export interface MapPinLocation {
  id: string;
  title: string;
  subtitle?: string;
  type: 'police' | 'safe_haven' | 'hazard' | 'destination';
  x: number;
  y: number;
}
