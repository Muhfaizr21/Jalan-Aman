import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Circle,
  Rect,
} from 'react-native-svg';

/* ================= VECTOR ICONS ================= */
function ShieldAlertIcon({ color = '#DC2626', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth="2"
        fill={color}
        fillOpacity="0.15"
      />
      <Path d="M12 8v5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx="12" cy="16.5" r="1.2" fill={color} />
    </Svg>
  );
}

function EyeAlertIcon({ color = '#0284C7', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
      <Path d="M12 2v2M12 20v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function AlarmLightIcon({ color = '#F59E0B', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3a7 7 0 00-7 7v6h14v-6a7 7 0 00-7-7z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 19h16M7 22h10M12 5v2M8.5 7.5l1.5 1.5M15.5 7.5L14 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function ShieldCheckIcon({ color = '#059669', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronDownIcon({ color = '#64748B', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9l6 6 6-6"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronUpIcon({ color = '#0284C7', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 15l-6-6-6 6"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SearchIcon({ color = '#64748B', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
      <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

function RadarScanIcon({ color = '#06B6D4', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.6" strokeDasharray="3,3" />
      <Circle cx="12" cy="12" r="2" fill={color} />
      <Path d="M12 3v9l6 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function FlashlightOffIcon({ color = '#F59E0B', size = 14 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 10l-4-4V2H10v4l-4 4v11a1 1 0 001 1h10a1 1 0 001-1V10z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path d="M4 4l16 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function ClockSmallIcon({ color = '#64748B', size = 13 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function SafetyInsightScreen() {
  const insets = useSafeAreaInsets();

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

  const toggleAccordion = (id: string) => {
    setExpandedAccordionId(expandedAccordionId === id ? null : id);
  };

  const handleRunSafetyCheck = () => {
    const query = searchQuery.trim() || 'Jl. Raya Jatibarang - Sleman';
    // Dynamic simulated assessment calculation
    const lower = query.toLowerCase();
    if (lower.includes('bypass') || lower.includes('pantura') || lower.includes('gelap')) {
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
      title: 'Kriteria Laporan Crowdsourcing Terverifikasi',
      summary:
        'Laporan dengan foto bukti dan titik koordinat akurat akan disetujui moderator dalam hitungan menit dan menaikkan Trust Score akun.',
      icon: 'shield-check',
    },
  ];

  const renderGuideIcon = (iconName: string) => {
    switch (iconName) {
      case 'eye-alert':
        return <EyeAlertIcon color="#0284C7" size={22} />;
      case 'alarm-light':
        return <AlarmLightIcon color="#F59E0B" size={22} />;
      case 'shield-check':
        return <ShieldCheckIcon color="#059669" size={22} />;
      default:
        return <ShieldAlertIcon color="#0284C7" size={22} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']} testID="SafetyInsightScreen">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ================= HEADER: standard_top_bar ================= */}
      <View style={styles.topBarHeader}>
        <View style={styles.topBarTitleCol}>
          <Text style={styles.topBarTitle}>Wawasan & Info Aman</Text>
          <Text style={styles.topBarSubtitle}>
            Data kerawanan real-time & panduan malam
          </Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.liveBadgeText}>LIVE RADAR</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 72 },
        ]}
      >
        {/* ================= SECTION 1: current_risk_status_card ================= */}
        <View style={styles.gradientBannerCard}>
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#0F172A" />
                <Stop offset="100%" stopColor="#1E293B" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" rx={16} fill="url(#bannerGrad)" />
          </Svg>

          {/* Badge */}
          <View style={styles.statusBadgeRow}>
            <View style={styles.statusBadge}>
              <View style={styles.statusBadgeDot} />
              <Text style={styles.statusBadgeText}>STATUS LINGKUNGAN SAAT INI</Text>
            </View>
            <RadarScanIcon color="#06B6D4" size={16} />
          </View>

          {/* Headline */}
          <Text style={styles.statusHeadline}>
            Fase Jam Rawan Tinggi (00.00 – 04.59 WIB)
          </Text>

          {/* Description */}
          <Text style={styles.statusDescription}>
            Tingkat risiko kejahatan jalanan meningkat hingga 3.4x lipat. Sistem
            otomatis memperbesar bobot penghindaran jalan pintas sepi.
          </Text>
        </View>

        {/* ================= SECTION 2: hotspot_radar_summary ================= */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Pantauan Klaster Aktif Sekitar</Text>
            <Text style={styles.sectionSubCount}>2 Terdeteksi</Text>
          </View>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalCardsScroll}
          >
            {/* Card 1: hs_01 */}
            <View style={styles.hotspotCard}>
              <View style={styles.hotspotCardTop}>
                <View style={[styles.severityBadge, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={[styles.severityBadgeText, { color: '#DC2626' }]}>
                    Tinggi (Zona Merah)
                  </Text>
                </View>
                <Text style={styles.hotspotDistance}>1.2 km dari Anda</Text>
              </View>

              <Text style={styles.hotspotTitle}>Klaster Bypass Pantura</Text>

              <View style={styles.hotspotMetaRow}>
                <ClockSmallIcon color="#64748B" size={13} />
                <Text style={styles.hotspotMetaText}>
                  3 jam lalu (Begal/Curas)
                </Text>
              </View>

              <View style={styles.hotspotMetaRow}>
                <FlashlightOffIcon color="#F59E0B" size={13} />
                <Text style={styles.hotspotMetaTextHighlight}>
                  45% Lampu Padam
                </Text>
              </View>

              <View style={styles.hotspotCardFooter}>
                <Text style={styles.hotspotActionHint}>
                  ⚠️ Rute otomatis dialihkan via jalur arteri
                </Text>
              </View>
            </View>

            {/* Card 2: hs_02 */}
            <View style={styles.hotspotCard}>
              <View style={styles.hotspotCardTop}>
                <View style={[styles.severityBadge, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={[styles.severityBadgeText, { color: '#D97706' }]}>
                    Sedang (Zona Kuning)
                  </Text>
                </View>
                <Text style={styles.hotspotDistance}>2.8 km dari Anda</Text>
              </View>

              <Text style={styles.hotspotTitle}>Simpang Perlintasan Kereta</Text>

              <View style={styles.hotspotMetaRow}>
                <ClockSmallIcon color="#64748B" size={13} />
                <Text style={styles.hotspotMetaText}>
                  Kemarin (Jalan Rusak/Sepi)
                </Text>
              </View>

              <View style={styles.hotspotMetaRow}>
                <ShieldCheckIcon color="#059669" size={13} />
                <Text style={[styles.hotspotMetaText, { color: '#059669' }]}>
                  80% Penerangan Cukup
                </Text>
              </View>

              <View style={styles.hotspotCardFooter}>
                <Text style={styles.hotspotActionHint}>
                  ⚡ Kurangi kecepatan saat melintas
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* ================= SECTION 3: quick_safety_check ================= */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Periksa Tingkat Keamanan Wilayah</Text>

          <View style={styles.searchCardContainer}>
            <View style={styles.searchInputRow}>
              <SearchIcon color="#94A3B8" size={18} />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari nama jalan atau kelurahan tujuan..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleRunSafetyCheck}
                returnKeyType="search"
              />
            </View>

            <TouchableOpacity
              style={styles.searchActionButton}
              onPress={handleRunSafetyCheck}
              activeOpacity={0.88}
              accessibilityRole="button"
            >
              <Text style={styles.searchActionButtonText}>Cek Skor Risiko</Text>
            </TouchableOpacity>

            {/* Interactive Result Card */}
            {safetyCheckResult && (
              <View style={styles.checkResultBox}>
                <View style={styles.checkResultHeader}>
                  <View>
                    <Text style={styles.checkResultQuery} numberOfLines={1}>
                      {safetyCheckResult.query}
                    </Text>
                    <Text
                      style={[
                        styles.checkResultLabel,
                        safetyCheckResult.level === 'danger'
                          ? styles.textDanger
                          : safetyCheckResult.level === 'caution'
                          ? styles.textCaution
                          : styles.textSafe,
                      ]}
                    >
                      {safetyCheckResult.label}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.scoreCircleBadge,
                      safetyCheckResult.level === 'danger'
                        ? styles.scoreDanger
                        : safetyCheckResult.level === 'caution'
                        ? styles.scoreCaution
                        : styles.scoreSafe,
                    ]}
                  >
                    <Text
                      style={[
                        styles.scoreNumber,
                        safetyCheckResult.level === 'danger'
                          ? styles.textDanger
                          : safetyCheckResult.level === 'caution'
                          ? styles.textCaution
                          : styles.textSafe,
                      ]}
                    >
                      {safetyCheckResult.score}
                    </Text>
                    <Text style={styles.scoreUnit}>/100</Text>
                  </View>
                </View>

                <View style={styles.resultDetailsRow}>
                  <View style={styles.resultDetailPill}>
                    <Text style={styles.resultDetailText}>
                      💡 {safetyCheckResult.lightDensity}
                    </Text>
                  </View>
                  <View style={styles.resultDetailPill}>
                    <Text style={styles.resultDetailText}>
                      🛡️ {safetyCheckResult.patrolFrequency}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ================= SECTION 4: emergency_prep_guides ================= */}
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
                        <ChevronUpIcon color="#0284C7" size={18} />
                      ) : (
                        <ChevronDownIcon color="#64748B" size={18} />
                      )}
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.accordionBodyContent}>
                      <Text style={styles.accordionSummaryText}>
                        {item.summary}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SafetyInsightScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* Top Bar */
  topBarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  topBarTitleCol: {
    flex: 1,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  topBarSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0284C7',
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  /* Section 1: Current Risk Status Card */
  gradientBannerCard: {
    borderRadius: 16,
    padding: 18,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 22,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      default: {
        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.18)',
      },
    }),
  },
  statusBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 5,
  },
  statusBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  statusHeadline: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  statusDescription: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },

  /* Common Section Styles */
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  sectionSubCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284C7',
    marginBottom: 12,
  },

  /* Section 2: Hotspot Radar Summary */
  horizontalCardsScroll: {
    gap: 12,
    paddingRight: 10,
  },
  hotspotCard: {
    width: 250,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      default: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  hotspotCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  severityBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  hotspotDistance: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  hotspotTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  hotspotMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  hotspotMetaText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  hotspotMetaTextHighlight: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '600',
  },
  hotspotCardFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  hotspotActionHint: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '500',
  },

  /* Section 3: Quick Safety Check */
  searchCardContainer: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  searchActionButton: {
    backgroundColor: '#0284C7',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchActionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* Result Box */
  checkResultBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
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
    color: '#0F172A',
    maxWidth: 200,
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
    borderRadius: 8,
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: '900',
  },
  scoreUnit: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  scoreSafe: {
    backgroundColor: '#D1FAE5',
  },
  scoreCaution: {
    backgroundColor: '#FEF3C7',
  },
  scoreDanger: {
    backgroundColor: '#FEE2E2',
  },
  textSafe: {
    color: '#059669',
  },
  textCaution: {
    color: '#D97706',
  },
  textDanger: {
    color: '#DC2626',
  },
  resultDetailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  resultDetailPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resultDetailText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#475569',
  },

  /* Section 4: Emergency Prep Guides */
  accordionContainer: {
    gap: 10,
  },
  accordionItemCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  accordionHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  accordionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordionTitleText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
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
    borderTopColor: '#EEF2F6',
  },
  accordionSummaryText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
});
