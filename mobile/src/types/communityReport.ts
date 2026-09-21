/**
 * JalanAman Mobile - Modul 5: Pelaporan Komunitas & Bahaya Types
 * Clean Code & SOLID principles.
 */

export type IncidentCategoryId = 'lampu_mati' | 'kriminalitas' | 'kerusakan_jalan' | 'bahaya_spasial';

export interface IncidentCategoryData {
  id: IncidentCategoryId;
  title: string;
  subtitle: string;
  iconName: string;
  accentColor: string;
}

export interface ReportTimelineStepData {
  id: string;
  title: string;
  time: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  icon: string;
  badgeLabel?: string;
}

export interface RouteFeedbackExperienceChip {
  id: string;
  label: string;
  icon: string;
  isPositive: boolean;
}
