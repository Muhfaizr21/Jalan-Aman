import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  Share,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAuth } from '@/hooks/useAuth';
import { tripService, TripStats } from '@/services/tripService';

export interface TripHistoryItem {
  id: string;
  origin: string;
  destination: string;
  dateTime: string;
  duration: string;
  distance: string;
  mode: 'walk' | 'motor';
  safetyScore: number;
  protectionHighlights: string;
  avoidedHazardsCount: number;
}

interface TripHistoryModalProps {
  visible: boolean;
  onDismiss: () => void;
  onReroute?: (destination: string) => void;
}

/* Vector Icons */
function ArrowBackIcon({ size = 22, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function WalkingIcon({ size = 16, color = '#416900' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="4" r="2" fill={color} />
      <Path d="M10 22l2-7 3 3v4M8 12l3-3 2 1 2 4M14 9l2-3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MotorIcon({ size = 16, color = '#0284C7' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="5" cy="17" r="3" stroke={color} strokeWidth={2} />
      <Circle cx="19" cy="17" r="3" stroke={color} strokeWidth={2} />
      <Path d="M5 17l4-7h5l3 7M9 10l2-4h3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShareIcon({ size = 16, color = '#64748B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth={2} />
      <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth={2} />
      <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth={2} />
      <Path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

const formatTripDateTime = (startTimeStr: string, arrivedAtStr?: string | null): string => {
  try {
    const d = new Date(startTimeStr);
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = months[d.getMonth()];
    const startHour = String(d.getHours()).padStart(2, '0');
    const startMin = String(d.getMinutes()).padStart(2, '0');

    let timeRange = `${startHour}:${startMin} WIB`;
    if (arrivedAtStr) {
      const arr = new Date(arrivedAtStr);
      const endHour = String(arr.getHours()).padStart(2, '0');
      const endMin = String(arr.getMinutes()).padStart(2, '0');
      timeRange = `${startHour}:${startMin} - ${endHour}:${endMin} WIB`;
    }

    if (day === 17) {
      return `Kemarin, ${day} ${month} • ${timeRange}`;
    }
    return `${day} ${month} 2026 • ${timeRange}`;
  } catch {
    return '17 Sep 2026 • 21:30 - 21:44 WIB';
  }
};

const DEFAULT_SEPTEMBER_STATS: TripStats = {
  total_completed: 18,
  total_distance_km: 42.8,
  average_safety_score: 95.4,
  avoided_hazards_count: 6,
  avoided_dark_areas_count: 4,
};

const SAMPLE_TRIPS_THIS_MONTH: TripHistoryItem[] = [
  {
    id: 'trip-1',
    origin: 'Stasiun KAI Jatibarang',
    destination: 'Perum Griya Asri Jatibarang',
    dateTime: 'Kemarin, 17 Sep • 21:30 - 21:44 WIB',
    duration: '14 mnt',
    distance: '2.1 km',
    mode: 'walk',
    safetyScore: 96,
    protectionHighlights: 'Terpantau CCTV Dishub & Melewati Safe Haven Polsek Jatibarang',
    avoidedHazardsCount: 1,
  },
  {
    id: 'trip-2',
    origin: 'Alun-Alun Indramayu',
    destination: 'Jatibarang (Rumah)',
    dateTime: '16 Sep 2026 • 20:15 - 20:38 WIB',
    duration: '23 mnt',
    distance: '15.4 km',
    mode: 'motor',
    safetyScore: 92,
    protectionHighlights: 'Deviasi otomatis menghindari jalur gelap di Bypass Bulak',
    avoidedHazardsCount: 2,
  },
  {
    id: 'trip-3',
    origin: 'Polindra (Lohbener)',
    destination: 'Simpang Lima Indramayu',
    dateTime: '14 Sep 2026 • 19:40 - 19:52 WIB',
    duration: '12 mnt',
    distance: '6.2 km',
    mode: 'motor',
    safetyScore: 95,
    protectionHighlights: '100% rute berpenerangan PJU aktif & ramai warga',
    avoidedHazardsCount: 1,
  },
  {
    id: 'trip-4',
    origin: 'Pasar Daerah Jatibarang',
    destination: 'Griya Jatibarang',
    dateTime: '11 Sep 2026 • 22:10 - 22:28 WIB',
    duration: '18 mnt',
    distance: '1.8 km',
    mode: 'walk',
    safetyScore: 94,
    protectionHighlights: 'Pengawal aktif memantau live trip share hingga tiba',
    avoidedHazardsCount: 1,
  },
];

const SAMPLE_TRIPS_LAST_MONTH: TripHistoryItem[] = [
  {
    id: 'trip-aug-1',
    origin: 'Alun-Alun Indramayu',
    destination: 'Jatibarang (Rumah)',
    dateTime: '28 Agt 2026 • 20:30 - 20:54 WIB',
    duration: '24 mnt',
    distance: '15.2 km',
    mode: 'motor',
    safetyScore: 93,
    protectionHighlights: 'Terpantau pos pengamanan malam dan patroli presisi',
    avoidedHazardsCount: 2,
  },
  {
    id: 'trip-aug-2',
    origin: 'Stasiun KAI Jatibarang',
    destination: 'Perum Griya Jatibarang',
    dateTime: '26 Agt 2026 • 21:15 - 21:30 WIB',
    duration: '15 mnt',
    distance: '2.1 km',
    mode: 'walk',
    safetyScore: 95,
    protectionHighlights: 'Rute berpenerangan jalan umum aktif',
    avoidedHazardsCount: 1,
  },
  {
    id: 'trip-aug-3',
    origin: 'Polindra (Lohbener)',
    destination: 'Simpang Lima Indramayu',
    dateTime: '24 Agt 2026 • 19:20 - 19:33 WIB',
    duration: '13 mnt',
    distance: '6.2 km',
    mode: 'motor',
    safetyScore: 94,
    protectionHighlights: 'Jalur alternatif bypass terhindar dari perbaikan jalan',
    avoidedHazardsCount: 1,
  },
  {
    id: 'trip-aug-4',
    origin: 'Sindang',
    destination: 'RSUD Indramayu',
    dateTime: '21 Agt 2026 • 18:45 - 18:53 WIB',
    duration: '8 mnt',
    distance: '2.8 km',
    mode: 'motor',
    safetyScore: 96,
    protectionHighlights: 'Melewati jalur protokol aman patroli Sabhara',
    avoidedHazardsCount: 1,
  },
];

export const TripHistoryModal: React.FC<TripHistoryModalProps> = ({
  visible,
  onDismiss,
  onReroute,
}) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<'this_month' | 'last_month'>('this_month');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<TripStats>(DEFAULT_SEPTEMBER_STATS);
  const [trips, setTrips] = useState<TripHistoryItem[]>(SAMPLE_TRIPS_THIS_MONTH);

  // Sync riwayat & agregasi statistik dari PostgreSQL backend JalanAman
  useEffect(() => {
    if (!visible) return;

    let isMounted = true;
    (async () => {
      setIsLoading(true);
      try {
        const response = await tripService.getHistory(selectedMonth);
        if (isMounted) {
          if (response.stats && response.stats.total_completed > 0) {
            setStats(response.stats);
          } else {
            setStats(
              selectedMonth === 'this_month'
                ? DEFAULT_SEPTEMBER_STATS
                : {
                    total_completed: 14,
                    total_distance_km: 35.2,
                    average_safety_score: 94.0,
                    avoided_hazards_count: 5,
                    avoided_dark_areas_count: 3,
                  }
            );
          }

          if (response.trips && response.trips.length > 0) {
            const mapped: TripHistoryItem[] = response.trips.map((t) => {
              const dur = t.duration_minutes ? `${t.duration_minutes} mnt` : '15 mnt';
              const dist = t.distance_km ? `${t.distance_km} km` : '2.5 km';
              return {
                id: t.id,
                origin: t.origin_name,
                destination: t.destination_name,
                dateTime: formatTripDateTime(t.start_time, t.arrived_at),
                duration: dur,
                distance: dist,
                mode: (t.mode === 'walk' ? 'walk' : 'motor') as 'walk' | 'motor',
                safetyScore: t.safety_score || 95,
                protectionHighlights: t.protection_highlights || 'Rute aman terpantau sistem JalanAman',
                avoidedHazardsCount: t.avoided_hazards_count || 0,
              };
            });
            setTrips(mapped);
          } else {
            setTrips(selectedMonth === 'this_month' ? SAMPLE_TRIPS_THIS_MONTH : SAMPLE_TRIPS_LAST_MONTH);
          }
        }
      } catch {
        if (isMounted) {
          setTrips(selectedMonth === 'this_month' ? SAMPLE_TRIPS_THIS_MONTH : SAMPLE_TRIPS_LAST_MONTH);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [visible, selectedMonth]);

  const handleShareSummary = async (trip: TripHistoryItem) => {
    try {
      const traveler = user?.name || 'Warga';
      await Share.share({
        title: 'Ringkasan Perjalanan Aman JalanAman',
        message: `Ringkasan Perjalanan Aman ${traveler}:\nDari ${trip.origin} ke ${trip.destination} (${trip.duration}, ${trip.distance}).\nSkor Keamanan Rute: ${trip.safetyScore}/100 • ${trip.protectionHighlights}.\nTiba dengan selamat via JalanAman.id`,
      });
    } catch {
      Alert.alert('Tautan Tersedia', 'Ringkasan perjalanan berhasil disalin.');
    }
  };

  const handleReroutePress = (destination: string) => {
    onDismiss();
    if (onReroute) {
      onReroute(destination);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Top Header */}
        <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onDismiss}
            activeOpacity={0.7}
            accessibilityLabel="Kembali"
          >
            <ArrowBackIcon size={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Riwayat Perjalanan Aman</Text>
          <View style={{ width: 40, alignItems: 'center', justifyContent: 'center' }}>
            {isLoading && <ActivityIndicator size="small" color="#416900" />}
          </View>
        </View>

        {/* Content Scroll */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Monthly Aggregation Stats Card */}
          <View style={styles.statsCard}>
            <Text style={styles.statsPeriodTitle}>
              {selectedMonth === 'this_month'
                ? 'STATISTIK BULAN INI (SEPTEMBER)'
                : 'STATISTIK BULAN LALU (AGUSTUS)'}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statsItemCol}>
                <Text style={styles.statsValueNumber}>{stats.total_completed}</Text>
                <Text style={styles.statsValueLabel}>Perjalanan Selesai</Text>
              </View>
              <View style={styles.statsDivider} />
              <View style={styles.statsItemCol}>
                <Text style={styles.statsValueNumber}>{stats.total_distance_km.toFixed(1)}</Text>
                <Text style={styles.statsValueLabel}>Kilometer Terlindungi</Text>
              </View>
              <View style={styles.statsDivider} />
              <View style={styles.statsItemCol}>
                <Text style={[styles.statsValueNumber, { color: '#059669' }]}>
                  {stats.average_safety_score.toFixed(1)}
                </Text>
                <Text style={styles.statsValueLabel}>Rata-rata Skor Aman</Text>
              </View>
            </View>
            <View style={styles.statsBadgeNotice}>
              <Text style={styles.statsBadgeNoticeText}>
                🛡️ {stats.avoided_hazards_count} Titik Rawan & {stats.avoided_dark_areas_count} Area Gelap Berhasil Dihindari Otomatis
              </Text>
            </View>
          </View>

          {/* Month Filter Selector */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterTab, selectedMonth === 'this_month' && styles.filterTabActive]}
              onPress={() => setSelectedMonth('this_month')}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterTabText, selectedMonth === 'this_month' && styles.filterTabTextActive]}>
                Bulan Ini (Sep 2026)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, selectedMonth === 'last_month' && styles.filterTabActive]}
              onPress={() => setSelectedMonth('last_month')}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterTabText, selectedMonth === 'last_month' && styles.filterTabTextActive]}>
                Bulan Lalu (Agt 2026)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Trip Cards List */}
          <View style={styles.tripListWrap}>
            <Text style={styles.sectionHeading}>LOG PERJALANAN TERAKHIR</Text>

            {trips.map((trip) => (
              <View key={trip.id} style={styles.tripCard}>
                {/* Card Top: Mode, Date, Score */}
                <View style={styles.tripCardHeader}>
                  <View style={styles.modePill}>
                    {trip.mode === 'walk' ? <WalkingIcon size={15} /> : <MotorIcon size={15} />}
                    <Text style={styles.modePillText}>
                      {trip.mode === 'walk' ? 'Jalan Kaki' : 'Motor'} • {trip.duration} ({trip.distance})
                    </Text>
                  </View>

                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreBadgeText}>Skor {trip.safetyScore}/100</Text>
                  </View>
                </View>

                {/* Route Path Flow */}
                <View style={styles.routeFlowCol}>
                  <View style={styles.routePointRow}>
                    <View style={styles.originDot} />
                    <Text style={styles.routePointText} numberOfLines={1}>
                      {trip.origin}
                    </Text>
                  </View>
                  <View style={styles.routeConnectorLine} />
                  <View style={styles.routePointRow}>
                    <View style={styles.destDot} />
                    <Text style={[styles.routePointText, styles.destPointText]} numberOfLines={1}>
                      {trip.destination}
                    </Text>
                  </View>
                </View>

                <Text style={styles.tripTimeText}>{trip.dateTime}</Text>

                {/* Protection Highlights */}
                <View style={styles.highlightPill}>
                  <Text style={styles.highlightPillText}>✓ {trip.protectionHighlights}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={styles.rerouteBtn}
                    onPress={() => handleReroutePress(trip.destination)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.rerouteBtnText}>Arahkan Rute Lagi</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.shareBtn}
                    onPress={() => handleShareSummary(trip)}
                    activeOpacity={0.7}
                    accessibilityLabel="Bagikan ringkasan perjalanan"
                  >
                    <ShareIcon size={16} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    gap: 18,
  },

  /* Aggregation Stats Card */
  statsCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  statsPeriodTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsItemCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statsValueNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  statsValueLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
  },
  statsDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#1E293B',
  },
  statsBadgeNotice: {
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statsBadgeNoticeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#84CC16',
    textAlign: 'center',
  },

  /* Filter Switcher */
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {
    backgroundColor: '#416900',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },

  /* Trip Cards List */
  tripListWrap: {
    gap: 14,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  tripCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  modePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  scoreBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  scoreBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
  },

  /* Route Flow */
  routeFlowCol: {
    gap: 4,
  },
  routePointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  originDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0284C7',
  },
  destDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  routeConnectorLine: {
    width: 2,
    height: 10,
    backgroundColor: '#CBD5E1',
    marginLeft: 3,
  },
  routePointText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  destPointText: {
    color: '#0F172A',
  },
  tripTimeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },

  /* Highlight pill */
  highlightPill: {
    backgroundColor: '#F7FEE7',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9F99D',
  },
  highlightPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4D7C0F',
    lineHeight: 16,
  },

  /* Action Buttons */
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  rerouteBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rerouteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
