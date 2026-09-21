import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  StatusBar,
  Animated,
  Image,
  Alert,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Circle,
  Rect,
} from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { DashboardBottomNav, NotificationCenterModal } from '@/components/dashboard';
import { EmergencySOSModal } from '@/components/EmergencySOSModal';
import { SafetyHandbookModal } from '@/components/emergency';
import { DashboardTabId, CommunitySafetyReport } from '@/types/dashboard';
import { FeedDetailModal, FeedDetailItem } from '@/components/feed/FeedDetailModal';
import { useIncidents } from '@/hooks/useIncidents';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

/* ================= VECTOR ICONS ================= */
function ShieldHeartIcon({ size = 20, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth={2}
        fill={color}
        fillOpacity={0.15}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 8.5c-.6-1-2-1-2.5 0-.5 1 0 2 2.5 3.5 2.5-1.5 3-2.5 2.5-3.5-.5-1-1.9-1-2.5 0z"
        fill={color}
      />
    </Svg>
  );
}

function BellIcon({ size = 20, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function SearchIcon({ color = DashboardTheme.colors.textMuted, size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={2} />
      <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

function EyeAlertIcon({ color = DashboardTheme.colors.semanticInfo, size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
      <Path d="M12 2v2M12 20v2" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function AlarmLightIcon({ color = DashboardTheme.colors.semanticWarning, size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3a7 7 0 00-7 7v6h14v-6a7 7 0 00-7-7z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 19h16M7 22h10M12 5v2M8.5 7.5l1.5 1.5M15.5 7.5L14 9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ShieldCheckIcon({ color = DashboardTheme.colors.primary, size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronDownIcon({ color = DashboardTheme.colors.textMuted, size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9l6 6 6-6"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronUpIcon({ color = DashboardTheme.colors.primary, size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 15l-6-6-6 6"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function RadarScanIcon({ color = DashboardTheme.colors.accentNeon, size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
      <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth={1.6} strokeDasharray="3,3" />
      <Circle cx="12" cy="12" r="2" fill={color} />
      <Path d="M12 3v9l6 3" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function ClockSmallIcon({ color = DashboardTheme.colors.textSecondary, size = 13 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} />
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function FlashlightOffIcon({ color = DashboardTheme.colors.semanticWarning, size = 13 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 10l-4-4V2H10v4l-4 4v11a1 1 0 001 1h10a1 1 0 001-1V10z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path d="M4 4l16 16" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function ThumbsUpIcon({ size = 14, color = DashboardTheme.colors.primary, isFilled = false }: { size?: number; color?: string; isFilled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
        fill={isFilled ? color : 'none'}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ShareIcon({ size = 15, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth={2} />
      <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth={2} />
      <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth={2} />
      <Path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export interface FeedReportWithDetail extends CommunitySafetyReport {
  title: string;
  location: string;
  distance: string;
  reporterName: string;
  statusUpdate: string;
  routeAdvice: string;
  indicators: Array<{
    icon: 'cctv' | 'light' | 'patrol' | 'water' | 'police';
    label: string;
    value: string;
    isPositive?: boolean;
  }>;
}

const HOTSPOT_PANTURA: FeedDetailItem = {
  id: 'hotspot-pantura-bulak',
  title: 'Bypass Pantura Bulak Jatibarang',
  categoryLabel: 'Perhatian Khusus',
  categoryType: 'warning',
  location: 'Jl. Raya Bulak arah Lohbener, Jatibarang',
  distance: '850 m dari Anda',
  timeAgo: '45 mnt lalu',
  description: 'Terdapat 2 titik penerangan jalan padam di lajur kiri sepanjang 150m. Pengendara motor dan komuter malam disarankan melambat dan memilih koridor Jl. Mayor Dasuki.',
  confirmations: 28,
  isConfirmed: false,
  reporterName: 'Warga Koridor Pantura',
  statusUpdate: 'Laporan perbaikan lampu PJU telah diteruskan ke Dishub & Polsek Jatibarang.',
  routeAdvice: 'Disarankan gunakan rute perkotaan Jl. Mayor Dasuki yang terpantau CCTV.',
  indicators: [
    { icon: 'light', label: 'Penerangan', value: 'Gelap 150m', isPositive: false },
    { icon: 'cctv', label: 'CCTV Dishub', value: '1 Unit Aktif', isPositive: true },
    { icon: 'patrol', label: 'Patroli Polsek', value: 'Tiap 2 Jam', isPositive: true },
  ],
};

const HOTSPOT_SIMPANG: FeedDetailItem = {
  id: 'hotspot-stasiun-jatibarang',
  title: 'Koridor Stasiun KAI Jatibarang',
  categoryLabel: 'Jalur Rekomendasi',
  categoryType: 'verified',
  location: 'Jl. Mayor Dasuki, Jatibarang',
  distance: '250 m dari Anda',
  timeAgo: 'Terbaru',
  description: 'Jalur mobilitas komuter kereta api ramai lancar. Penerangan jalan 100% LED terang dan dekat dengan Safe Haven Polsek Jatibarang siaga 24 jam.',
  confirmations: 65,
  isConfirmed: false,
  reporterName: 'Komunitas Komuter Jatibarang',
  statusUpdate: 'Kondisi sangat kondusif dan aman dilalui warga hingga larut malam.',
  routeAdvice: 'Jalur prioritas yang paling direkomendasikan untuk pejalan kaki dan pengendara.',
  indicators: [
    { icon: 'light', label: 'Penerangan', value: '100% LED Terang', isPositive: true },
    { icon: 'cctv', label: 'CCTV Stasiun', value: '4 Kamera Aktif', isPositive: true },
    { icon: 'patrol', label: 'Polsek Jatibarang', value: 'Siaga 24 Jam', isPositive: true },
  ],
};

const INITIAL_FEED_REPORTS: FeedReportWithDetail[] = [];

export function SafetyInsightScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { hasUnread } = useNotifications();
  const [isSosModalVisible, setIsSosModalVisible] = useState(false);
  const [isNotifModalVisible, setIsNotifModalVisible] = useState(false);
  const [isHandbookModalVisible, setIsHandbookModalVisible] = useState(false);

  // Search input state for quick safety check
  const [searchQuery, setSearchQuery] = useState('');
  const [safetyCheckResult, setSafetyCheckResult] = useState<{
    query: string;
    score: number;
    label: string;
    level: 'safe' | 'caution' | 'danger';
    lightDensity: string;
    patrolFrequency: string;
  } | null>(null);

  // Accordion active state
  const [expandedAccordionId, setExpandedAccordionId] = useState<string | null>('g_01');

  // Community Feed State
  const { incidents, isLoading: isIncidentsLoading, refetch: refetchIncidents } = useIncidents();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'verified' | 'warning' | 'safe_haven'>('all');
  const [feedReports, setFeedReports] = useState<FeedReportWithDetail[]>(INITIAL_FEED_REPORTS);
  const [selectedDetailItem, setSelectedDetailItem] = useState<FeedDetailItem | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Synchronize with live incidents from PostgreSQL
  useEffect(() => {
    if (incidents && incidents.length > 0) {
      const liveList: FeedReportWithDetail[] = incidents.map((inc, idx) => {
        const isVerified = inc.status === 'Verified';
        return {
          id: inc.id,
          badgeType: isVerified ? 'verified' : 'warning',
          badgeLabel: isVerified ? 'Terverifikasi Tim / Warga' : 'Laporan Komunitas',
          title: inc.title,
          location: inc.location?.address || 'Indramayu',
          distance: '300 m dari Anda',
          timeAgo: 'Baru saja',
          reporterName: isVerified ? 'Pantauan Warga Indramayu' : 'Laporan Komunitas',
          statusUpdate: inc.description,
          routeAdvice: inc.severity === 'High' ? 'Disarankan melintas berkelompok dan gunakan rute terang.' : 'Tetap berhati-hati dan kurangi laju kecepatan.',
          description: inc.description,
          confirmations: 18 + idx * 7,
          isConfirmed: false,
          indicators: [
            { icon: 'light', label: 'Kategori', value: inc.category, isPositive: true },
            { icon: 'patrol', label: 'Tingkat', value: String(inc.severity), isPositive: inc.severity === 'Low' },
            { icon: 'cctv', label: 'Status', value: inc.status, isPositive: isVerified },
          ],
        };
      });
      setFeedReports(liveList);
    }
  }, [incidents]);

  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
  const safeTop = Math.max(insets.top, statusBarHeight);

  // Live Radar Pulse Animation
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const toggleAccordion = (id: string) => {
    setExpandedAccordionId(expandedAccordionId === id ? null : id);
  };

  const handleRunSafetyCheck = () => {
    const query = searchQuery.trim() || 'Jl. Mayor Dasuki, Jatibarang';
    const lower = query.toLowerCase();

    if (lower.includes('bypass') || lower.includes('pantura') || lower.includes('gelap') || lower.includes('sepi')) {
      setSafetyCheckResult({
        query,
        score: 42,
        label: 'Zona Risiko Tinggi',
        level: 'danger',
        lightDensity: '38% Penerangan Jalan',
        patrolFrequency: 'Patroli berkala tiap 4 jam',
      });
    } else if (lower.includes('stasiun') || lower.includes('kereta') || lower.includes('pasar')) {
      setSafetyCheckResult({
        query,
        score: 68,
        label: 'Zona Waspada Menengah',
        level: 'caution',
        lightDensity: '72% Penerangan Jalan',
        patrolFrequency: 'Patroli pos siaga aktif',
      });
    } else {
      setSafetyCheckResult({
        query,
        score: 94,
        label: 'Wilayah Terpantau Aman',
        level: 'safe',
        lightDensity: '95% Penerangan Terang',
        patrolFrequency: 'Patroli teratur <30 menit',
      });
    }
  };

  const handleConfirmReport = (id: string) => {
    setFeedReports((prev) =>
      prev.map((rep) => {
        if (rep.id === id) {
          const isConfirmed = !rep.isConfirmed;
          const nextCount = isConfirmed ? rep.confirmations + 1 : Math.max(0, rep.confirmations - 1);
          return {
            ...rep,
            isConfirmed,
            confirmations: nextCount,
          };
        }
        return rep;
      })
    );

    // Sync active detail modal state if opened
    setSelectedDetailItem((prev) => {
      if (!prev || prev.id !== id) return prev;
      const isConfirmed = !prev.isConfirmed;
      return {
        ...prev,
        isConfirmed,
        confirmations: isConfirmed ? prev.confirmations + 1 : Math.max(0, prev.confirmations - 1),
      };
    });
  };

  const handleOpenReportDetail = (report: FeedReportWithDetail) => {
    setSelectedDetailItem({
      id: report.id,
      title: report.title,
      categoryLabel: report.badgeLabel,
      categoryType: report.badgeType,
      location: report.location,
      distance: report.distance,
      timeAgo: report.timeAgo,
      description: report.description,
      confirmations: report.confirmations,
      isConfirmed: report.isConfirmed,
      reporterName: report.reporterName,
      statusUpdate: report.statusUpdate,
      routeAdvice: report.routeAdvice,
      indicators: report.indicators,
    });
    setIsDetailModalVisible(true);
  };

  const handleOpenHotspotPantura = () => {
    setSelectedDetailItem(HOTSPOT_PANTURA);
    setIsDetailModalVisible(true);
  };

  const handleOpenHotspotSimpang = () => {
    setSelectedDetailItem(HOTSPOT_SIMPANG);
    setIsDetailModalVisible(true);
  };

  const handleOpenSafetyCheckDetail = () => {
    if (!safetyCheckResult) return;
    setSelectedDetailItem({
      id: `check-${Date.now()}`,
      title: `Analisis Keamanan: ${safetyCheckResult.query}`,
      categoryLabel: safetyCheckResult.label,
      categoryType:
        safetyCheckResult.level === 'danger'
          ? 'danger'
          : safetyCheckResult.level === 'caution'
          ? 'warning'
          : 'verified',
      location: safetyCheckResult.query,
      distance: 'Sekitar Lokasi Input',
      timeAgo: 'Baru saja dihitung',
      description: `Hasil pemindaian sensor cerdas JalanAman untuk ${safetyCheckResult.query}. Skor keselamatan tercatat ${safetyCheckResult.score}/100 berdasarkan integrasi sensor CCTV publik, tingkat pencahayaan lampu jalanan malam hari, dan frekuensi patroli keamanan setempat.`,
      confirmations: 12,
      isConfirmed: false,
      reporterName: 'AI Radar & Sensor JalanAman',
      statusUpdate: 'Data diperbarui secara real-time dari sensor jalanan dan konfirmasi komunitas warga terdekat.',
      routeAdvice:
        safetyCheckResult.level === 'danger'
          ? 'Disarankan memilih jalur arteri alternatif dan hindari melintas sendirian larut malam.'
          : safetyCheckResult.level === 'caution'
          ? 'Tetap waspada dan perhatikan persimpangan minim penerangan.'
          : 'Wilayah tergolong sangat kondusif untuk dilalui pejalan kaki dan pengendara.',
      indicators: [
        {
          icon: 'light',
          label: 'Penerangan',
          value: safetyCheckResult.lightDensity,
          isPositive: safetyCheckResult.level === 'safe',
        },
        {
          icon: 'patrol',
          label: 'Patroli',
          value: safetyCheckResult.patrolFrequency,
          isPositive: true,
        },
        {
          icon: 'cctv',
          label: 'Sensor Terkoneksi',
          value: 'Online Aktif',
          isPositive: true,
        },
      ],
    });
    setIsDetailModalVisible(true);
  };

  const handleToggleConfirmFromModal = (id: string) => {
    handleConfirmReport(id);
  };

  const handleShareReport = async (report: CommunitySafetyReport) => {
    try {
      await Share.share({
        message: `🚨 Laporan JalanAman [${report.badgeLabel}]:\n"${report.description}"\n\nTetap waspada & gunakan aplikasi JalanAman untuk rute aman.`,
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleTabPress = useCallback((tabId: DashboardTabId) => {
    if (tabId === 'routes') {
      router.replace('/');
    } else if (tabId === 'radar') {
      router.replace('/radar');
    } else if (tabId === 'profile') {
      router.replace('/profile');
    }
  }, []);

  const filteredReports = feedReports.filter((r) => {
    if (selectedFilter === 'all') return true;
    return r.badgeType === selectedFilter;
  });

  const accordionGuides = [
    {
      id: 'g_01',
      title: 'Tanda-Tanda Sedang Dibuntuti di Jalan Sepi',
      summary:
        'Segera belokkan arah menuju retail 24 jam atau polsek terdekat yang tertera di direktori shelter. Jangan menepi di tempat gelap.',
      icon: 'eye-alert',
    },
    {
      id: 'g_02',
      title: 'Cara Kerja Tombol SOS Zero-Latency',
      summary:
        'Menahan tombol SOS selama 3 detik langsung mengirimkan koordinat satelit GPS ke kontak darurat tanpa jeda jaringan.',
      icon: 'alarm-light',
    },
    {
      id: 'g_03',
      title: 'Kriteria Laporan Komunitas Terverifikasi',
      summary:
        'Laporan dengan foto bukti dan titik koordinat akurat akan disetujui moderator dalam hitungan menit dan menaikkan Trust Score akun.',
      icon: 'shield-check',
    },
  ];

  const renderGuideIcon = (iconName: string) => {
    switch (iconName) {
      case 'eye-alert':
        return <EyeAlertIcon color={DashboardTheme.colors.semanticInfo} size={20} />;
      case 'alarm-light':
        return <AlarmLightIcon color={DashboardTheme.colors.semanticWarning} size={20} />;
      case 'shield-check':
        return <ShieldCheckIcon color={DashboardTheme.colors.primary} size={20} />;
      default:
        return <ShieldHeartIcon color={DashboardTheme.colors.primary} size={20} />;
    }
  };

  return (
    <View style={styles.screenContainer} testID="SafetyInsightScreen">
      <StatusBar barStyle="dark-content" backgroundColor={DashboardTheme.colors.surfaceCard} />

      {/* ================= UNIFIED APP BAR HEADER ================= */}
      <View style={[styles.headerContainer, { paddingTop: safeTop }]}>
        <View style={styles.headerContent}>
          {/* Brand Identity */}
          <View style={styles.brandRow}>
            <View style={styles.brandIconBox}>
              <ShieldHeartIcon size={20} />
            </View>
            <View>
              <Text style={styles.brandTitle}>JalanAman</Text>
              <Text style={styles.brandSubtitle}>Feed & Wawasan</Text>
            </View>
          </View>

          {/* Right Controls: Live Beacon Badge, Bell, Profile */}
          <View style={styles.headerActionsRow}>
            <View style={styles.liveRadarPill}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveRadarText}>{user?.domicile || 'Jatibarang, Indramayu'} • Aktif</Text>
            </View>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => setIsNotifModalVisible(true)}
              activeOpacity={0.7}
              accessibilityLabel="Notifikasi"
            >
              <BellIcon size={20} />
              {hasUnread && <View style={styles.unreadDot} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarWrap}
              onPress={() => router.push('/profile')}
              activeOpacity={0.8}
              accessibilityLabel="Profil Saya"
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                }}
                style={styles.avatarImg}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ================= SCROLLABLE FEED BODY ================= */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= SECTION 1: Ambient Safety Briefing Card ================= */}
        <View style={styles.ambientBriefCard}>
          <View style={styles.ambientTopRow}>
            <View style={styles.ambientStatusBadge}>
              <View style={styles.ambientGreenDot} />
              <Text style={styles.ambientBadgeText}>PANTAUAN LINGKUNGAN</Text>
            </View>
            <Text style={styles.ambientTimeText}>Pukul 13.40 WIB • Real-time</Text>
          </View>

          <Text style={styles.ambientTitle}>Kondisi Jalur Terpantau Kondusif</Text>
          <Text style={styles.ambientDescription}>
            Penerangan jalan arteri aktif 96%. Aktivitas komuter dan warga terpantau ramai lancar di sepanjang koridor Stasiun Jatibarang – Mayor Dasuki – Bulak.
          </Text>

          {/* Apple Weather / Citymapper Style Safety Metrics */}
          <View style={styles.ambientMetricsRow}>
            <View style={styles.ambientMetricCol}>
              <Text style={styles.metricVal}>96%</Text>
              <Text style={styles.metricLabel}>Penerangan Jalan</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.ambientMetricCol}>
              <Text style={styles.metricVal}>4 Pos</Text>
              <Text style={styles.metricLabel}>Shelter 24 Jam</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.ambientMetricCol}>
              <Text style={[styles.metricVal, { color: '#15803D' }]}>Aman</Text>
              <Text style={styles.metricLabel}>Status Koridor</Text>
            </View>
          </View>
        </View>

        {/* ================= SECTION 2: Corridor & Hotspot Summary ================= */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Pantauan Jalur & Koridor Terdekat</Text>
              <Text style={styles.sectionSubtitle}>Jatibarang, Indramayu & Sekitarnya</Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>2 Jalur Aktif</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalCardsScroll}
          >
            {/* Card 1: Underpass Dukuh Atas Timur */}
            <TouchableOpacity
              style={styles.corridorCard}
              onPress={handleOpenHotspotPantura}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Buka detail Bypass Pantura Bulak"
            >
              <View style={styles.corridorCardTop}>
                <View style={[styles.statusPill, { backgroundColor: '#FEF3C7' }]}>
                  <View style={[styles.statusDot, { backgroundColor: '#D97706' }]} />
                  <Text style={[styles.statusPillText, { color: '#B45309' }]}>Perhatian Khusus</Text>
                </View>
                <Text style={styles.corridorDistance}>850 m dari Anda</Text>
              </View>

              <Text style={styles.corridorTitle}>Bypass Pantura Bulak</Text>
              <Text style={styles.corridorSnippet}>
                Minim penerangan sepanjang 150m di lajur kiri arah Lohbener.
              </Text>

              <View style={styles.corridorMetaRow}>
                <ClockSmallIcon color={DashboardTheme.colors.textSecondary} size={13} />
                <Text style={styles.corridorAdvice}>
                  Disarankan gunakan jalur Jl. Mayor Dasuki
                </Text>
              </View>

              <View style={styles.corridorCardFooter}>
                <Text style={styles.corridorDetailLink}>Lihat Analisis Jalur ›</Text>
              </View>
            </TouchableOpacity>

            {/* Card 2: Koridor Stasiun KAI Jatibarang */}
            <TouchableOpacity
              style={styles.corridorCard}
              onPress={handleOpenHotspotSimpang}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Buka detail Koridor Stasiun KAI Jatibarang"
            >
              <View style={styles.corridorCardTop}>
                <View style={[styles.statusPill, { backgroundColor: '#DCFCE7' }]}>
                  <View style={[styles.statusDot, { backgroundColor: '#16A34A' }]} />
                  <Text style={[styles.statusPillText, { color: '#15803D' }]}>Jalur Ramai Terang</Text>
                </View>
                <Text style={styles.corridorDistance}>250 m dari Anda</Text>
              </View>

              <Text style={styles.corridorTitle}>Koridor Stasiun KAI Jatibarang</Text>
              <Text style={styles.corridorSnippet}>
                Jalur mobilitas komuter ramai lancar dengan penerangan 100% LED.
              </Text>

              <View style={styles.corridorMetaRow}>
                <ShieldCheckIcon color="#15803D" size={13} />
                <Text style={[styles.corridorAdvice, { color: '#15803D' }]}>
                  Dekat Safe Haven Polsek Jatibarang (24J)
                </Text>
              </View>

              <View style={styles.corridorCardFooter}>
                <Text style={styles.corridorDetailLink}>Lihat Analisis Jalur ›</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* ================= SECTION 3: Interactive Quick Safety Check ================= */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Periksa Keamanan Jalan</Text>
              <Text style={styles.sectionSubtitle}>Cek kondisi penerangan & pantauan keamanan instan</Text>
            </View>
          </View>

          <View style={styles.searchCardContainer}>
            {/* Unified Search Input with inline action - NO GIANT FULL WIDTH BUTTON */}
            <View style={styles.unifiedSearchRow}>
              <SearchIcon color="#64748B" size={18} />
              <TextInput
                style={styles.unifiedSearchInput}
                placeholder="Cari jalan, halte, atau gedung tujuan..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleRunSafetyCheck}
                returnKeyType="search"
              />
              <TouchableOpacity
                style={styles.inlineSearchBtn}
                onPress={handleRunSafetyCheck}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Cari rincian keamanan jalan"
              >
                <Text style={styles.inlineSearchBtnText}>Periksa</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Shortcut Chips (Consumer UX best practice) */}
            <View style={styles.quickSuggestionsRow}>
              <Text style={styles.quickSuggestionsLabel}>Pencarian Populer:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
                {[
                  { name: 'Jl. Mayor Dasuki', score: 94 },
                  { name: 'Stasiun Jatibarang', score: 96 },
                  { name: 'Simpang Lima', score: 95 },
                  { name: 'Alun-Alun Indramayu', score: 98 },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    style={styles.suggestionChip}
                    onPress={() => {
                      setSearchQuery(item.name);
                      setSafetyCheckResult({
                        query: item.name,
                        score: item.score,
                        label: item.score >= 90 ? 'Wilayah Terpantau Kondusif' : 'Zona Waspada Menengah',
                        level: item.score >= 90 ? 'safe' : 'caution',
                        lightDensity: item.score >= 90 ? '96% Penerangan Terang' : '75% Penerangan Cukup',
                        patrolFrequency: 'Patroli teratur <30 menit',
                      });
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.suggestionChipText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Interactive Result Card */}
            {safetyCheckResult && (
              <TouchableOpacity
                style={styles.checkResultBox}
                onPress={handleOpenSafetyCheckDetail}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Lihat rincian lengkap wilayah"
              >
                <View style={styles.checkResultHeader}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.checkResultQuery} numberOfLines={1}>
                      {safetyCheckResult.query}
                    </Text>
                    <Text
                      style={[
                        styles.checkResultLabel,
                        safetyCheckResult.level === 'danger'
                          ? { color: '#EF4444' }
                          : safetyCheckResult.level === 'caution'
                          ? { color: '#D97706' }
                          : { color: '#15803D' },
                      ]}
                    >
                      {safetyCheckResult.label}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.scoreCircleBadge,
                      safetyCheckResult.level === 'danger'
                        ? { backgroundColor: '#FEE2E2' }
                        : safetyCheckResult.level === 'caution'
                        ? { backgroundColor: '#FEF3C7' }
                        : { backgroundColor: '#DCFCE7' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.scoreNumber,
                        safetyCheckResult.level === 'danger'
                          ? { color: '#DC2626' }
                          : safetyCheckResult.level === 'caution'
                          ? { color: '#B45309' }
                          : { color: '#15803D' },
                      ]}
                    >
                      {safetyCheckResult.score}
                    </Text>
                    <Text style={styles.scoreUnit}>/100</Text>
                  </View>
                </View>

                <View style={styles.resultDetailsRow}>
                  <View style={styles.resultDetailPill}>
                    <Text style={styles.resultDetailText}>💡 {safetyCheckResult.lightDensity}</Text>
                  </View>
                  <View style={styles.resultDetailPill}>
                    <Text style={styles.resultDetailText}>🛡️ {safetyCheckResult.patrolFrequency}</Text>
                  </View>
                  <View style={[styles.resultDetailPill, { backgroundColor: '#F1F5F9' }]}>
                    <Text style={[styles.resultDetailText, { color: '#15803D', fontWeight: '700' }]}>
                      Rincian Lengkap ›
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ================= SECTION 4: Live Community Safety Feed ================= */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Feed Laporan Komunitas</Text>
            <TouchableOpacity
              onPress={() => router.push('/report')}
              activeOpacity={0.7}
            >
              <Text style={styles.addReportLink}>+ Lapor Bahaya</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Chips */}
          <View style={styles.filterChipRow}>
            {(['all', 'verified', 'warning', 'safe_haven'] as const).map((key) => {
              const labelMap = {
                all: 'Semua',
                verified: 'Terverifikasi',
                warning: 'Waspada',
                safe_haven: 'Safe Haven',
              };
              const isSelected = selectedFilter === key;

              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.filterChip, isSelected && styles.filterChipActive]}
                  onPress={() => setSelectedFilter(key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                    {labelMap[key]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Report Cards */}
          <View style={styles.feedReportsCol}>
            {filteredReports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.feedReportCard}
                onPress={() => handleOpenReportDetail(report)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`Lihat rincian ${report.title}`}
              >
                <View style={styles.feedCardTop}>
                  <View style={styles.feedBadgeAndTitleRow}>
                    <View
                      style={[
                        styles.feedBadge,
                        report.badgeType === 'verified' && { backgroundColor: DashboardTheme.colors.semanticAccentBg },
                        report.badgeType === 'warning' && { backgroundColor: DashboardTheme.colors.semanticAlertBg },
                        report.badgeType === 'safe_haven' && { backgroundColor: DashboardTheme.colors.semanticInfoBg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.feedBadgeText,
                          report.badgeType === 'verified' && { color: DashboardTheme.colors.primary },
                          report.badgeType === 'warning' && { color: DashboardTheme.colors.semanticAlert },
                          report.badgeType === 'safe_haven' && { color: DashboardTheme.colors.semanticInfo },
                        ]}
                      >
                        {report.badgeLabel}
                      </Text>
                    </View>
                    <Text style={styles.feedCardLocation} numberOfLines={1}>
                      {report.location}
                    </Text>
                  </View>

                  <View style={styles.feedTopRightRow}>
                    <Text style={styles.feedTimeAgo}>{report.timeAgo}</Text>
                    <Text style={styles.viewDetailChevron}>›</Text>
                  </View>
                </View>

                <Text style={styles.feedCardTitle}>{report.title}</Text>
                <Text style={styles.feedDesc} numberOfLines={3}>{report.description}</Text>

                <View style={styles.feedCardFooter}>
                  <TouchableOpacity
                    style={[styles.confirmBtn, report.isConfirmed && styles.confirmBtnActive]}
                    onPress={() => handleConfirmReport(report.id)}
                    activeOpacity={0.75}
                    accessibilityLabel={`Konfirmasi laporan ${report.title}`}
                  >
                    <ThumbsUpIcon
                      size={14}
                      color={report.isConfirmed ? DashboardTheme.colors.primary : DashboardTheme.colors.textSecondary}
                      isFilled={report.isConfirmed}
                    />
                    <Text style={[styles.confirmCount, report.isConfirmed && { color: DashboardTheme.colors.primary }]}>
                      {report.confirmations} Warga Mengonfirmasi
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.feedFooterRight}>
                    <TouchableOpacity
                      style={styles.shareIconBtn}
                      onPress={() => handleShareReport(report)}
                      activeOpacity={0.7}
                      accessibilityLabel="Bagikan Laporan"
                    >
                      <ShareIcon size={16} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ================= SECTION 5: Prosedur Tanggap Darurat ================= */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Prosedur Tanggap Darurat</Text>

          <View style={styles.accordionContainer}>
            {accordionGuides.map((item) => {
              const isExpanded = expandedAccordionId === item.id;
              return (
                <View key={item.id} style={styles.accordionItemCard}>
                  <TouchableOpacity
                    style={styles.accordionHeaderButton}
                    onPress={() => toggleAccordion(item.id)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                  >
                    <View style={styles.accordionIconCircle}>
                      {renderGuideIcon(item.icon)}
                    </View>

                    <Text style={styles.accordionTitleText} numberOfLines={2}>
                      {item.title}
                    </Text>

                    <View style={styles.accordionChevronWrapper}>
                      {isExpanded ? (
                        <ChevronUpIcon size={18} />
                      ) : (
                        <ChevronDownIcon size={18} />
                      )}
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.accordionBodyContent}>
                      <Text style={styles.accordionSummaryText}>{item.summary}</Text>
                      <TouchableOpacity
                        style={styles.openFullHandbookBtn}
                        onPress={() => setIsHandbookModalVisible(true)}
                        activeOpacity={0.75}
                        accessibilityRole="button"
                        accessibilityLabel="Buka SOP Lengkap di Buku Saku Darurat"
                      >
                        <Text style={styles.openFullHandbookText}>Buka SOP Lengkap di Buku Saku Darurat ›</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Clearance Spacer so floating bottom nav never cuts off content */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ================= FLOATING BOTTOM NAVIGATION ================= */}
      <DashboardBottomNav
        activeTab="feed"
        onTabPress={handleTabPress}
        onSosPress={() => setIsSosModalVisible(true)}
      />

      {/* Emergency SOS Modal Integration */}
      <EmergencySOSModal
        visible={isSosModalVisible}
        onDismiss={() => setIsSosModalVisible(false)}
        onEvacuationStart={() => {
          setIsSosModalVisible(false);
          router.push('/navigation');
        }}
      />

      {/* Community Feed & Hotspot Detail Modal */}
      <FeedDetailModal
        visible={isDetailModalVisible}
        item={selectedDetailItem}
        onClose={() => setIsDetailModalVisible(false)}
        onToggleConfirm={handleToggleConfirmFromModal}
      />

      {/* Item 3: Notification Center Modal */}
      <NotificationCenterModal
        visible={isNotifModalVisible}
        onDismiss={() => setIsNotifModalVisible(false)}
        onNavigateToMap={() => router.push('/')}
        onNavigateToReport={() => router.push('/report')}
      />

      {/* Item 7: Safety Handbook & Emergency Directory Modal */}
      <SafetyHandbookModal
        visible={isHandbookModalVisible}
        onDismiss={() => setIsHandbookModalVisible(false)}
        initialTab="guidelines"
      />
    </View>
  );
}

export default SafetyInsightScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
  },

  /* Top Bar Header */
  headerContainer: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    zIndex: 50,
  },
  headerContent: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DashboardTheme.colors.semanticAccentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 18,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
    marginTop: 1,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  liveRadarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  liveRadarText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.1,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: DashboardTheme.colors.semanticAlert,
  },
  avatarWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },

  /* Scrollable Body */
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },

  /* Section 1: Ambient Safety Briefing Card */
  ambientBriefCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  ambientTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ambientStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  ambientGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  ambientBadgeText: {
    color: '#15803D',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  ambientTimeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  ambientTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 5,
    letterSpacing: -0.2,
  },
  ambientDescription: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 14,
  },
  ambientMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.04)',
  },
  ambientMetricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
  },

  /* Common Section Styles */
  sectionContainer: {
    marginBottom: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  countBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 999,
    backgroundColor: DashboardTheme.colors.surfaceContainer,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: DashboardTheme.colors.semanticInfo,
  },
  addReportLink: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#15803D',
  },

  /* Section 2: Corridor & Hotspot Summary */
  horizontalCardsScroll: {
    gap: 12,
    paddingRight: 4,
  },
  corridorCard: {
    width: 255,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: 18,
    padding: 14,
    shadowColor: DashboardTheme.colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
  },
  corridorCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  corridorDistance: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
    fontWeight: '600',
  },
  corridorTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  corridorSnippet: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 8,
  },
  corridorMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginBottom: 8,
  },
  corridorAdvice: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    flex: 1,
  },
  corridorCardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(15, 23, 42, 0.05)',
    paddingTop: 8,
  },
  corridorDetailLink: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803D',
  },

  /* Section 3: Quick Safety Check (Unified Input - No Giant Button) */
  searchCardContainer: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    shadowColor: DashboardTheme.colors.textPrimary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  unifiedSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    borderRadius: 14,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    gap: 8,
  },
  unifiedSearchInput: {
    flex: 1,
    fontSize: 13,
    color: DashboardTheme.colors.textPrimary,
    paddingVertical: 4,
  },
  inlineSearchBtn: {
    backgroundColor: '#15803D',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inlineSearchBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  quickSuggestionsRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickSuggestionsLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  suggestionChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
  },
  suggestionChipText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },

  checkResultBox: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: DashboardTheme.colors.surfaceContainerLow,
  },
  checkResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkResultQuery: {
    fontSize: 14,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  checkResultLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  scoreCircleBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 2,
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: '900',
  },
  scoreUnit: {
    fontSize: 10,
    fontWeight: '600',
    color: DashboardTheme.colors.textMuted,
  },
  resultDetailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  resultDetailPill: {
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  resultDetailText: {
    fontSize: 11,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
  },

  /* Section 4: Filter Chips & Feed Reports */
  filterChipRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  filterChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  feedReportsCol: {
    gap: 10,
  },
  feedReportCard: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: 18,
    padding: 14,
    shadowColor: DashboardTheme.colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
  },
  feedCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedBadgeAndTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  feedCardLocation: {
    fontSize: 11,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
    flex: 1,
  },
  feedTopRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailChevron: {
    fontSize: 15,
    fontWeight: '700',
    color: DashboardTheme.colors.textMuted,
  },
  feedCardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  feedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  feedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  feedTimeAgo: {
    fontSize: 11,
    color: DashboardTheme.colors.textMuted,
  },
  feedDesc: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 10,
    fontWeight: '500',
  },
  feedCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: DashboardTheme.colors.surfaceContainerLow,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  confirmBtnActive: {
    opacity: 0.9,
  },
  confirmCount: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
    fontWeight: '600',
  },
  feedFooterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Section 5: Emergency Prep Guides */
  accordionContainer: {
    gap: 10,
  },
  accordionItemCard: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: DashboardTheme.colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
  },
  accordionHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  accordionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordionTitleText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    lineHeight: 18,
  },
  accordionChevronWrapper: {
    marginLeft: 4,
  },
  accordionBodyContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: DashboardTheme.colors.surfaceContainerLow,
  },
  accordionSummaryText: {
    fontSize: 12,
    color: DashboardTheme.colors.textSecondary,
    lineHeight: 18,
  },
  openFullHandbookBtn: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  openFullHandbookText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
  },

  /* Bottom clearance: generous 140px so floating bar never clips content */
  bottomSpacer: {
    height: 140,
  },
});
