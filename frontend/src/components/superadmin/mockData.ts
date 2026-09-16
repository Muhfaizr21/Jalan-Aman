import { IncidentReport, ClusterSummary, ModelMetrics, AdminUser, AuditLogEntry } from '../../types/superadmin';

export const mockIncidents: IncidentReport[] = [
  {
    id: 'INC-2023-001',
    category: 'Begal',
    coordinates: { lat: -6.200000, lng: 106.816666 },
    locationName: 'Jl. Sudirman, Jakarta Pusat',
    timestamp: '2023-10-27T02:15:00Z',
    status: 'Pending',
    dangerScore: 8,
    description: 'Dua orang mencurigakan membawa senjata tajam.',
    reporterId: 'USR-101'
  },
  {
    id: 'INC-2023-002',
    category: 'Kecelakaan',
    coordinates: { lat: -6.214620, lng: 106.845130 },
    locationName: 'Manggarai, Jakarta Selatan',
    timestamp: '2023-10-27T08:30:00Z',
    status: 'Verified',
    dangerScore: 6,
    description: 'Kecelakaan beruntun melibatkan 3 kendaraan.',
    reporterId: 'USR-102'
  },
  {
    id: 'INC-2023-003',
    category: 'Pelecehan',
    coordinates: { lat: -6.175110, lng: 106.827150 },
    locationName: 'Stasiun Gambir',
    timestamp: '2023-10-27T19:45:00Z',
    status: 'Resolved',
    dangerScore: 7,
    description: 'Tindakan asusila di gerbong kereta.',
    reporterId: 'USR-103'
  },
  {
    id: 'INC-2023-004',
    category: 'Infrastruktur',
    coordinates: { lat: -6.241586, lng: 106.823547 },
    locationName: 'Kuningan, Jakarta Selatan',
    timestamp: '2023-10-26T22:10:00Z',
    status: 'Verified',
    dangerScore: 4,
    description: 'Lampu jalan mati sepanjang 500 meter.',
    reporterId: 'USR-104'
  },
  {
    id: 'INC-2023-005',
    category: 'Lainnya',
    coordinates: { lat: -6.208763, lng: 106.845599 },
    locationName: 'Menteng, Jakarta Pusat',
    timestamp: '2023-10-26T14:20:00Z',
    status: 'Rejected',
    dangerScore: 2,
    description: 'Laporan palsu, tidak ada kejadian.',
    reporterId: 'USR-105'
  },
  {
    id: 'INC-2023-006',
    category: 'Begal',
    coordinates: { lat: -6.220000, lng: 106.820000 },
    locationName: 'Casablanca, Jakarta Selatan',
    timestamp: new Date().toISOString(),
    status: 'Pending',
    dangerScore: 9,
    description: 'Tindak kriminal kekerasan.',
    reporterId: 'USR-106'
  },
  {
    id: 'INC-2023-007',
    category: 'Infrastruktur',
    coordinates: { lat: -6.230000, lng: 106.810000 },
    locationName: 'Blok M, Jakarta Selatan',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'Pending',
    dangerScore: 5,
    description: 'Jalan berlubang cukup dalam.',
    reporterId: 'USR-107'
  }
];

export const mockClusters: ClusterSummary[] = [
  { id: 'CLS-001', center: { lat: -6.200000, lng: 106.816666 }, incidentCount: 15, radius: 500, dangerLevel: 'Critical' },
  { id: 'CLS-002', center: { lat: -6.214620, lng: 106.845130 }, incidentCount: 8, radius: 300, dangerLevel: 'High' },
  { id: 'CLS-003', center: { lat: -6.175110, lng: 106.827150 }, incidentCount: 3, radius: 200, dangerLevel: 'Medium' }
];

export const mockModelMetrics: ModelMetrics = {
  accuracy: 89.7,
  precision: 85.2,
  recall: 82.5,
  f1Score: 83.8,
  lastTrained: '2023-10-25T10:00:00Z',
  totalTrainingSamples: 15240
};

export const mockUsers: AdminUser[] = [
  { id: 'ADM-001', name: 'Budi Santoso', email: 'budi@jalanaman.id', role: 'Superadmin', status: 'Active' },
  { id: 'ADM-002', name: 'Siti Aminah', email: 'siti@jalanaman.id', role: 'Moderator', status: 'Active' },
  { id: 'ADM-003', name: 'Andi Wijaya', email: 'andi@jalanaman.id', role: 'Analyst', status: 'Suspended' }
];

export const mockAuditLogs: AuditLogEntry[] = [
  { id: 'LOG-001', timestamp: '2023-10-27T08:35:00Z', adminId: 'ADM-002', action: 'Verified Incident', targetId: 'INC-2023-002', details: 'Status changed from Pending to Verified' },
  { id: 'LOG-002', timestamp: '2023-10-26T14:25:00Z', adminId: 'ADM-001', action: 'Rejected Incident', targetId: 'INC-2023-005', details: 'Marked as false report' },
  { id: 'LOG-003', timestamp: '2023-10-25T10:05:00Z', adminId: 'ADM-001', action: 'Model Retrained', details: 'Triggered manual retraining of Risk Model' }
];

// Data for charts (5W1H Logic)
export const chartDataCategory = [
  { name: 'Begal', value: 45 },
  { name: 'Pelecehan', value: 30 },
  { name: 'Kecelakaan', value: 20 },
  { name: 'Infrastruktur', value: 15 },
  { name: 'Lainnya', value: 5 },
];

export const chartDataTime = [
  { time: '00:00', incidents: 12 },
  { time: '04:00', incidents: 8 },
  { time: '08:00', incidents: 25 },
  { time: '12:00', incidents: 15 },
  { time: '16:00', incidents: 30 },
  { time: '20:00', incidents: 40 },
];

export const chartDataRegion = [
  { name: 'Jaksel', value: 120 },
  { name: 'Jakpus', value: 80 },
  { name: 'Jakbar', value: 65 },
  { name: 'Jaktim', value: 90 },
  { name: 'Jakut', value: 45 },
];

export const chartDataResolution = [
  { month: 'Jan', verified: 40, rejected: 10 },
  { month: 'Feb', verified: 50, rejected: 15 },
  { month: 'Mar', verified: 45, rejected: 12 },
  { month: 'Apr', verified: 60, rejected: 20 },
  { month: 'May', verified: 75, rejected: 8 },
];

export const chartDataDemographic = [
  { trustScore: 'Tinggi', users: 1500 },
  { trustScore: 'Sedang', users: 800 },
  { trustScore: 'Rendah', users: 200 },
];

// Top 3 Hotspots
export const topHotspots = [
  { id: 1, name: 'Jl. Margonda Raya', area: 'Depok', newIncidents: 12, trend: 'up' },
  { id: 2, name: 'Stasiun Manggarai', area: 'Jakarta Selatan', newIncidents: 8, trend: 'up' },
  { id: 3, name: 'Kawasan Monas', area: 'Jakarta Pusat', newIncidents: 5, trend: 'down' },
];

// System Health
export const systemHealth = [
  { id: 'dbscan', name: 'DBSCAN Engine', status: 'Healthy', latency: '12ms', lastSync: '1 min ago' },
  { id: 'rf', name: 'Random Forest API', status: 'Healthy', latency: '45ms', lastSync: '1 min ago' },
  { id: 'maps', name: 'Mapbox Services', status: 'Warning', latency: '150ms', lastSync: '5 mins ago' },
];

export const chartDataModel = [
  { metric: 'Accuracy', value: 89.7, benchmark: 80 },
  { metric: 'Precision', value: 85.2, benchmark: 80 },
  { metric: 'Recall', value: 82.5, benchmark: 80 },
  { metric: 'F1-Score', value: 83.8, benchmark: 80 },
  { metric: 'AUC-ROC', value: 91.2, benchmark: 85 },
];

export const chartDataWeekly = [
  { week: 'W1', pending: 15, verified: 45, rejected: 10 },
  { week: 'W2', pending: 20, verified: 55, rejected: 12 },
  { week: 'W3', pending: 12, verified: 60, rejected: 8 },
  { week: 'W4', pending: 25, verified: 40, rejected: 15 },
];

