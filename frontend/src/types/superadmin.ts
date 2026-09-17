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

export type UserRole = 'Superadmin' | 'Moderator' | 'User';
export type UserAccountStatus = 'Active' | 'Suspended' | 'Banned';

export interface UserRouteSearchHistory {
  id: string;
  timestamp: string;
  origin: string;
  destination: string;
  chosenRoute: 'Aman' | 'Tercepat';
  estimatedDurationMin: number;
}

export interface UserRouteRatingHistory {
  id: string;
  timestamp: string;
  routeName: string;
  rating: number; // 1-5
  comment?: string;
  safetyConfirmed: boolean;
}

export interface UserIncidentHistory {
  id: string;
  category: IncidentCategory;
  location: string;
  timestamp: string;
  status: IncidentStatus;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserAccountStatus;
  statusReason?: string;
  reportCount: number;
  verifiedReportCount: number;
  rejectedReportCount: number;
  trustScore: number; // 0 - 100
  dominantRegion: string;
  joinedAt: string;
  lastActive: string;
  routeSearches: UserRouteSearchHistory[];
  routeRatings: UserRouteRatingHistory[];
  incidentReports: UserIncidentHistory[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminId: string;
  action: string;
  targetId?: string;
  details: string;
}

export interface RoadSegmentRisk {
  id: string;
  name: string;
  region: string;
  riskScore: number; // 0 - 100
  dangerLevel: 'Aman' | 'Waspada' | 'Rawan' | 'Kritis';
  peakDangerHours: string;
  lightingQuality: 'Terang' | 'Sedang' | 'Minim' | 'Gelap Total';
  incidentHistoryCount: number;
  policePostDistance: number; // in meters
  lastEvaluated: string;
  featureContributions: {
    crimeHistory: number; // %
    lighting: number; // %
    nightTime: number; // %
    securityProximity: number; // %
  };
}

export interface ModelVersionHistory {
  version: string;
  trainedAt: string;
  durationSeconds: number;
  datasetScope: string;
  sampleCount: number;
  accuracy: number;
  f1Score: number;
  aucRoc: number;
  status: 'Active' | 'Deprecated' | 'Archived';
  trainedBy: string;
  notes: string;
}

export interface ConfusionMatrixData {
  truePositive: number;
  falsePositive: number;
  falseNegative: number;
  trueNegative: number;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number; // percentage
  category: 'Kriminalitas' | 'Lingkungan' | 'Spatiotemporal' | 'Infrastruktur';
  description: string;
}

export type AnalyticsTimeRange = '7d' | '30d' | '90d' | '1y';

export interface HourlyIncidentStat {
  hour: string;
  hourNumber: number;
  total: number;
  begal: number;
  pelecehan: number;
  kecelakaan: number;
  infrastruktur: number;
  isPeakDanger: boolean;
}

export interface RouteComparisonTelemetry {
  totalSearches: number;
  safeRouteCount: number;
  safeRoutePct: number;
  fastestRouteCount: number;
  fastestRoutePct: number;
  avgTimeDifferenceMinutes: number;
  avgHazardsAvoidedCount: number;
  citizenSatisfactionSafe: number; // out of 5
  citizenSatisfactionFastest: number; // out of 5
  safetyConfirmationRate: number; // %
  monthlyTrends: {
    month: string;
    safePct: number;
    fastestPct: number;
    avgTimeDiffMin: number;
    totalSearches: number;
  }[];
}

export interface HazardousZoneItem {
  rank: number;
  id: string;
  name: string;
  region: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  incidentCount: number;
  riskScore: number; // 0-100
  dangerLevel: 'Kritis' | 'Rawan' | 'Waspada' | 'Aman';
  dominantCategory: IncidentCategory;
  peakHours: string;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  policeDistanceMeters: number;
  lightingStatus: 'Minim' | 'Sedang' | 'Terang';
  recommendedIntervention: string;
}

export interface ContributingFactorItem {
  factor: string;
  percentage: number;
  impactLevel: 'Kritis' | 'Tinggi' | 'Sedang';
  description: string;
}

export interface ReporterDemographicItem {
  group: string;
  percentage: number;
  activeCount: number;
  avgTrustScore: number;
  verificationRate: number; // %
}

export interface TrendTimePoint {
  date: string;
  label: string;
  total: number;
  begal: number;
  pelecehan: number;
  kecelakaan: number;
  infrastruktur: number;
  lainnya: number;
  regionJaksel: number;
  regionJakpus: number;
  regionJakbar: number;
  regionJaktim: number;
  regionJakut: number;
  regionBodetabek: number;
}

// 6. MANAJEMEN KONTEN MASTER & KONFIGURASI SISTEM
export interface IncidentCategoryMaster {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  defaultSeverity: number; // 1-10
  severityLabel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis';
  colorHex: string;
  description: string;
  reportCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RiskThresholdConfig {
  safeMax: number; // e.g. 35 -> 0-35 "Aman"
  warningMax: number; // e.g. 65 -> 36-65 "Waspada"
  criticalMin: number; // e.g. 66 -> 66-100 "Berisiko"
  autoRerouteThreshold: number; // e.g. 60 -> trigger rerouting warning
  lastUpdated: string;
  updatedBy: string;
}

export interface DbscanSystemConfig {
  eps: number; // radius in meters
  minSamples: number; // min points to form cluster
  distanceMetric: 'haversine' | 'euclidean';
  timeDecayDays: number; // days window for decay
  clusterWeightMode: 'uniform' | 'severity_weighted';
  lastCalibration: string;
  simulatedClustersCount: number;
  simulatedNoisePointsCount: number;
}

// 9. MODERASI KONTEN LAPORAN
export type ContentModerationStatus = 'Pending' | 'Approved' | 'Redacted' | 'Rejected';
export type ContentFlagType = 'face_pii' | 'plate_pii' | 'graphic_violence' | 'offensive_text' | 'phone_pii' | 'blurry_media';

export interface ContentModerationFlag {
  type: ContentFlagType;
  label: string;
  confidence: number; // 0 - 100%
  severity: 'High' | 'Medium' | 'Low';
  snippet?: string;
}

export interface ModeratedContentItem {
  id: string;
  incidentId: string;
  category: IncidentCategory;
  locationName: string;
  timestamp: string;
  reporterName: string;
  reporterTrustScore: number;
  incidentVerificationStatus: 'Verified' | 'Pending' | 'Rejected';
  moderationStatus: ContentModerationStatus;
  originalText: string;
  redactedText: string;
  hasImage: boolean;
  imageTheme: 'street_dark' | 'cctv_alley' | 'accident_debris' | 'pothole_puddle' | 'station_crowd';
  isImageBlurred: boolean;
  blurTarget: 'None' | 'Face' | 'Plate' | 'Full';
  autoFlags: ContentModerationFlag[];
  moderatedBy?: string;
  moderatedAt?: string;
  moderationNote?: string;
}

// 10. MANAJEMEN INTEGRASI EKSTERNAL
export type IntegrationAuthType = 'api_key' | 'bearer_token' | 'mtls' | 'basic_auth';
export type IntegrationFormat = 'JSON' | 'GeoJSON' | 'XML_SOAP';
export type SyncScheduleFrequency = 'every_15_mins' | 'every_30_mins' | 'hourly' | 'daily_midnight' | 'manual';
export type SyncExecutionStatus = 'Success' | 'Partial' | 'Failed' | 'Running';

export interface PoliceIntegrationConfig {
  id: string;
  name: string;
  agency: string;
  endpointUrl: string;
  authType: IntegrationAuthType;
  authCredentialMasked: string;
  dataFormat: IntegrationFormat;
  syncSchedule: SyncScheduleFrequency;
  syncScheduleLabel: string;
  cronExpression: string;
  status: 'Connected' | 'Error' | 'Syncing' | 'Disabled';
  lastSyncAt: string;
  lastSyncStatus: SyncExecutionStatus;
  autoImportVerified: boolean;
  timeoutMs: number;
  retryCount: number;
  totalImportedAllTime: number;
}

export interface SyncLogEntry {
  id: string;
  sourceId: string;
  sourceName: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  recordsFetched: number;
  recordsImported: number;
  recordsDuplicate: number;
  recordsFailed: number;
  status: SyncExecutionStatus;
  errorDetails?: string[];
  triggeredBy: 'Automated Cron' | 'Manual Superadmin' | 'Webhook Push';
}

export interface ExternalPartnerApiKey {
  id: string;
  partnerName: string;
  partnerType: 'Ride Hailing' | 'Logistics' | 'Government' | 'Emergency Services';
  apiKeyMasked: string;
  apiKeyRawFull?: string; // used when generating/viewing
  status: 'Active' | 'Suspended' | 'Revoked';
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  usageToday: {
    totalRequests: number;
    quotaPercentage: number;
    lastActiveAt: string;
  };
  scopes: string[];
  contactEmail: string;
  createdAt: string;
  expiresAt: string;
}

export interface FieldMappingRule {
  id: string;
  sourceFieldName: string;
  sourceFieldType: 'string' | 'number' | 'datetime' | 'boolean';
  targetInternalField: 'category_id' | 'occurred_at' | 'latitude' | 'longitude' | 'description' | 'source_reference' | 'severity_level';
  targetFieldLabel: string;
  isRequired: boolean;
  transformationRule: 'none' | 'map_crime_code_to_category' | 'iso_timestamp_parse' | 'wgs84_float' | 'normalize_text' | 'default_value';
  fallbackValue?: string;
  sampleSourceValue: string;
  sampleTransformedValue: string;
}

// 11. KONFIGURASI NOTIFIKASI REAL-TIME
export type RiskNotificationLevel = 'Waspada' | 'Bahaya' | 'Darurat';

export interface NotificationTemplate {
  id: string;
  level: RiskNotificationLevel;
  levelLabel: string;
  minRiskScore: number;
  titleTemplate: string;
  bodyTemplate: string;
  actionButtonText: string;
  secondaryButtonText?: string;
  soundAlert: 'default' | 'urgent_siren' | 'discrete_chime';
  vibrationPattern: 'normal' | 'pulsed_alarm' | 'continuous';
  priority: 'Normal' | 'High' | 'Emergency';
  accentColor: string;
}

export interface ZoneNotificationSchedule {
  id: string;
  zoneName: string;
  region: string;
  isCustomSchedule: boolean;
  activeStartTime: string; // e.g. "00:00"
  activeEndTime: string; // e.g. "04:59"
  is24HoursEmergencyActive: boolean;
  triggerRadiusMeters: number; // e.g. 500
  userCooldownMinutes: number; // e.g. 30
  isActive: boolean;
}

export interface GlobalNotificationSettings {
  defaultRadiusMeters: number;
  minRadiusMeters: number;
  maxRadiusMeters: number;
  defaultStartTime: string;
  defaultEndTime: string;
  globalCooldownMinutes: number;
  emergencyBroadcastEnabled: boolean;
  pushChannelProvider: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface PushTestLog {
  id: string;
  timestamp: string;
  targetIdentifier: string;
  level: RiskNotificationLevel;
  renderedTitle: string;
  renderedBody: string;
  status: 'Delivered' | 'Pending' | 'Failed';
  deliveryLatencyMs: number;
  fcmMessageId: string;
}

// 12. SISTEM MONITORING & JOB QUEUE
export type JobType = 'dbscan_clustering' | 'random_forest_training' | 'police_external_sync' | 'route_cache_purge' | 'osm_road_graph_sync';
export type JobStatus = 'running' | 'success' | 'failed' | 'queued';

export interface SystemJob {
  id: string;
  type: JobType;
  title: string;
  status: JobStatus;
  progressPct: number;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  triggeredBy: 'Manual Superadmin' | 'Scheduled Cron';
  errorMessage?: string;
  recordsProcessed?: number;
  memoryPeakMb?: number;
}

export interface AStarPerformanceMetrics {
  avgResponseTimeMs: number;
  p95ResponseTimeMs: number;
  requestsPerMinute: number;
  peakRpmToday: number;
  errorRatePct: number;
  totalRoutesCalculatedToday: number;
  activeGraphNodes: number;
  activeGraphEdges: number;
  cacheHitRatioPct: number;
}

// 13. FEEDBACK LOOP RUTE
export type RouteFeedbackRating = 1 | 2 | 3 | 4 | 5;
export type SafetyPerception = 'Sangat Aman' | 'Cukup Aman' | 'Ragu-ragu' | 'Berbahaya' | 'Kritis / Ada Kejahatan';
export type FeedbackStatus = 'Pending' | 'Flagged for Retrain' | 'Investigated' | 'Dismissed';
export type TrainingInclusionStatus = 'Not Included' | 'Queued for Next Retrain' | 'Trained';

export interface RouteFeedbackItem {
  id: string;
  routeSearchId: string;
  originName: string;
  destinationName: string;
  chosenRouteType: 'safe' | 'fastest';
  predictedRiskScore: number;
  userRating: RouteFeedbackRating;
  safetyPerception: SafetyPerception;
  comment?: string;
  hasDiscrepancy: boolean;
  status: FeedbackStatus;
  trainingInclusionStatus: TrainingInclusionStatus;
  reportedAt: string;
  userName: string;
  userTrustScore: number;
}

// 14. DATA EXPORT & KEPATUHAN PRIVASI
export interface DataRetentionPolicy {
  anonymizeReporterAfterMonths: number;
  purgeRawTelemetryDays: number;
  aggregatePoliceExportRetentionYears: number;
  lastRetentionRun: string;
  autoAnonymizeEnabled: boolean;
}

export interface SensitiveDataAccessLog {
  id: string;
  adminName: string;
  adminEmail: string;
  role: string;
  actionType: 'Export Agregat Kepolisian' | 'Lihat Data Mentah PII' | 'Export Laporan CSV Pemkot' | 'Audit Data Consent';
  targetScope: string;
  justification: string;
  ipAddress: string;
  timestamp: string;
  recordsCount: number;
  status: 'Approved' | 'Logged';
}

export interface UserConsentMetrics {
  totalUsers: number;
  clusteringOptInPct: number;
  aiTrainingOptInPct: number;
  telemetryOptInPct: number;
  gdprErasureRequestsPending: number;
  lastConsentAuditDate: string;
}



