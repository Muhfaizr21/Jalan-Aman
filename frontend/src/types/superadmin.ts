export type IncidentCategory = 'Begal' | 'Pelecehan' | 'Kecelakaan' | 'Infrastruktur' | 'Lainnya';
export type IncidentStatus = 'Pending' | 'Verified' | 'Rejected' | 'Resolved';

export interface IncidentReport {
  id: string;
  category: IncidentCategory;
  coordinates: {
    lat: number;
    lng: number;
  };
  locationName: string;
  timestamp: string; // ISO string
  status: IncidentStatus;
  dangerScore: number; // 1-10
  description: string;
  reporterId: string;
}

export interface ClusterSummary {
  id: string;
  center: {
    lat: number;
    lng: number;
  };
  incidentCount: number;
  radius: number; // in meters
  dangerLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrained: string;
  totalTrainingSamples: number;
}

export type AdminRole = 'Superadmin' | 'Moderator' | 'Analyst';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: 'Active' | 'Suspended';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminId: string;
  action: string;
  targetId?: string;
  details: string;
}
