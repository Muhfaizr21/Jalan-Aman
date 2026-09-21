import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';

export type ReportStatusFilter = 'all' | 'pending' | 'verified' | 'resolved';

export interface UserReportItem {
  id: string;
  categoryName: string;
  title: string;
  location: string;
  dateTime: string;
  status: 'pending' | 'verified' | 'in_progress' | 'resolved';
  statusLabel: string;
  upvotesCount: number;
  officialNote?: string;
}

interface MyReportsModalProps {
  visible: boolean;
  onDismiss: () => void;
  onNewReportPress?: () => void;
}

/* Vector Icons */
function ArrowBackIcon({ size = 22, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PlusIcon({ size = 18, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

function ThumbUpIcon({ size = 14, color = '#416900' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const SAMPLE_MY_REPORTS: UserReportItem[] = [
  {
    id: 'rep-1',
    categoryName: 'Penerangan Jalan',
    title: 'Lampu PJU Padam 150m',
    location: 'Jl. Raya Bulak No. 12, Jatibarang',
    dateTime: '17 Sep 2026 • 20:15 WIB',
    status: 'verified',
    statusLabel: 'Terverifikasi Warga',
    upvotesCount: 14,
    officialNote: 'Sudah diteruskan ke Dishub & Bina Marga Indramayu.',
  },
  {
    id: 'rep-2',
    categoryName: 'Infrastruktur Jalan',
    title: 'Jalan Berlubang Dalam (Rawan Jatuh)',
    location: 'Simpang Tiga Bulak - Jatibarang',
    dateTime: '15 Sep 2026 • 18:40 WIB',
    status: 'in_progress',
    statusLabel: 'Ditindaklanjuti Petugas',
    upvotesCount: 22,
    officialNote: 'Jadwal penambalan aspal darurat oleh Satgas Bina Marga Indramayu.',
  },
  {
    id: 'rep-3',
    categoryName: 'Potensi Kejahatan',
    title: 'Penerangan Minim & Rawan Begal Malam',
    location: 'Bypass Bulak arah Lohbener',
    dateTime: '12 Sep 2026 • 23:10 WIB',
    status: 'resolved',
    statusLabel: 'Selesai / Patroli Rutin',
    upvotesCount: 31,
    officialNote: 'Polsek Jatibarang telah menambahkan jadwal pos patroli keliling malam.',
  },
];

export const MyReportsModal: React.FC<MyReportsModalProps> = ({
  visible,
  onDismiss,
  onNewReportPress,
}) => {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<ReportStatusFilter>('all');

  const filteredReports = SAMPLE_MY_REPORTS.filter((rep) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return rep.status === 'pending';
    if (filter === 'verified') return rep.status === 'verified';
    if (filter === 'resolved') return rep.status === 'resolved' || rep.status === 'in_progress';
    return true;
  });

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
          <Text style={styles.headerTitle}>Laporanku & Kontribusi</Text>
          <TouchableOpacity
            style={styles.newReportHeaderBtn}
            onPress={() => {
              onDismiss();
              if (onNewReportPress) onNewReportPress();
            }}
            activeOpacity={0.8}
          >
            <PlusIcon size={16} />
            <Text style={styles.newReportHeaderBtnText}>Lapor</Text>
          </TouchableOpacity>
        </View>

        {/* Content Scroll */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Volunteer Impact & Poin Pengawal Card */}
          <View style={styles.impactCard}>
            <View style={styles.impactTopRow}>
              <View>
                <Text style={styles.impactSublabel}>STATUS KONTRIBUTOR WARGA</Text>
                <Text style={styles.impactTitle}>Relawan Pengawal Teladan ⭐</Text>
              </View>
              <View style={styles.poinPill}>
                <Text style={styles.poinNumber}>350</Text>
                <Text style={styles.poinUnit}>Poin</Text>
              </View>
            </View>

            <View style={styles.impactMetricsRow}>
              <View style={styles.metricCol}>
                <Text style={styles.metricNumber}>7</Text>
                <Text style={styles.metricLabel}>Laporan Terverifikasi</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricCol}>
                <Text style={styles.metricNumber}>67</Text>
                <Text style={styles.metricLabel}>Warga Terbantu Aman</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricCol}>
                <Text style={styles.metricNumber}>100%</Text>
                <Text style={styles.metricLabel}>Tingkat Akurasi Laporan</Text>
              </View>
            </View>
          </View>

          {/* Filter Status Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterTabsRow}
          >
            <TouchableOpacity
              style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
              onPress={() => setFilter('all')}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterChipText, filter === 'all' && styles.filterChipTextActive]}>
                Semua ({SAMPLE_MY_REPORTS.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, filter === 'verified' && styles.filterChipActive]}
              onPress={() => setFilter('verified')}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterChipText, filter === 'verified' && styles.filterChipTextActive]}>
                Terverifikasi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, filter === 'resolved' && styles.filterChipActive]}
              onPress={() => setFilter('resolved')}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterChipText, filter === 'resolved' && styles.filterChipTextActive]}>
                Selesai / Ditangani
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Reports List */}
          <View style={styles.reportListWrap}>
            <Text style={styles.sectionTitle}>RIWAYAT LAPORAN SPASIAL</Text>

            {filteredReports.map((report) => (
              <View key={report.id} style={styles.reportCard}>
                {/* Header: Category & Status Badge */}
                <View style={styles.reportCardTop}>
                  <Text style={styles.categoryPillText}>{report.categoryName}</Text>
                  <View
                    style={[
                      styles.statusPill,
                      report.status === 'verified' && styles.statusPillVerified,
                      report.status === 'in_progress' && styles.statusPillProgress,
                      report.status === 'resolved' && styles.statusPillResolved,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        report.status === 'verified' && { color: '#059669' },
                        report.status === 'in_progress' && { color: '#0284C7' },
                        report.status === 'resolved' && { color: '#334155' },
                      ]}
                    >
                      ● {report.statusLabel}
                    </Text>
                  </View>
                </View>

                {/* Title & Location */}
                <Text style={styles.reportCardTitle}>{report.title}</Text>
                <Text style={styles.reportCardLocation}>📍 {report.location}</Text>
                <Text style={styles.reportCardDate}>{report.dateTime}</Text>

                {/* Official Note if any */}
                {report.officialNote && (
                  <View style={styles.officialNoteBox}>
                    <Text style={styles.officialNoteTitle}>Tindak Lanjut Instansi Terkait:</Text>
                    <Text style={styles.officialNoteText}>{report.officialNote}</Text>
                  </View>
                )}

                {/* Upvotes Counter */}
                <View style={styles.cardFooter}>
                  <View style={styles.upvoteRow}>
                    <ThumbUpIcon size={14} />
                    <Text style={styles.upvoteText}>
                      Dikonfirmasi oleh <Text style={{ fontWeight: '800' }}>{report.upvotesCount}</Text> warga sekitar
                    </Text>
                  </View>
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
  newReportHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#416900',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  newReportHeaderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    gap: 18,
  },

  /* Impact Summary Card */
  impactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  impactTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  impactSublabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  impactTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  poinPill: {
    backgroundColor: '#F7FEE7',
    borderWidth: 1,
    borderColor: '#D9F99D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  poinNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#365314',
    lineHeight: 20,
  },
  poinUnit: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4D7C0F',
  },
  impactMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },

  /* Filter Tabs */
  filterTabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#416900',
    borderColor: '#416900',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Reports List */
  reportListWrap: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  reportCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillVerified: {
    backgroundColor: '#ECFDF5',
  },
  statusPillProgress: {
    backgroundColor: '#E0F2FE',
  },
  statusPillResolved: {
    backgroundColor: '#F1F5F9',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  reportCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  reportCardLocation: {
    fontSize: 12,
    color: '#475569',
  },
  reportCardDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  officialNoteBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#0284C7',
    gap: 3,
  },
  officialNoteTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
    textTransform: 'uppercase',
  },
  officialNoteText: {
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 16,
  },
  cardFooter: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  upvoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  upvoteText: {
    fontSize: 11,
    color: '#64748B',
  },
});
