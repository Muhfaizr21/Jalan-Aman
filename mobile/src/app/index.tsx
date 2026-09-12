import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [routeType, setRouteType] = useState<'safe' | 'fast'>('safe');
  const [navigating, setNavigating] = useState(false);

  const handleStartNav = () => {
    setNavigating(!navigating);
    if (!navigating) {
      Alert.alert(
        'Navigasi Aman Aktif',
        'Rute diarahkan melalui jalur berpenerangan terbaik dan menghindari zona rawan kriminalitas malam.',
        [{ text: 'Mengerti' }]
      );
    }
  };

  const handleSOS = () => {
    Alert.alert(
      '🚨 Panggilan Darurat SOS',
      'Koordinat GPS live Anda akan disiarkan ke 3 kontak darurat dan diarahkan ke Pos Polisi terdekat.',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'KIRIM SOS SEKARANG', style: 'destructive' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#09090b" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HEADER BAR ================= */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoIcon}>🛡️</Text>
            </View>
            <View>
              <Text style={styles.brandTitle}>JalanAman</Text>
              <Text style={styles.brandSubtitle}>RUTE AMAN DARI KRIMINALITAS</Text>
            </View>
          </View>

          {/* Live Status LED */}
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Radar Aktif</Text>
          </View>
        </View>

        {/* ================= HERO CARD ================= */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroTag}>PANDUAN PERJALANAN MALAM</Text>
            <Text style={styles.heroTitle}>Pulang Lebih Tenang & Terlindungi</Text>
            <Text style={styles.heroDesc}>
              Sistem memprioritaskan jalan berpenerangan PJU aktif, ramai aktivitas, dan bebas dari titik rawan begal.
            </Text>
          </View>

          {/* Real-time Metrics Chips */}
          <View style={styles.metricsRow}>
            <View style={styles.metricChip}>
              <Text style={styles.metricValue}>96%</Text>
              <Text style={styles.metricLabel}>Indeks Aman</Text>
            </View>
            <View style={styles.metricChip}>
              <Text style={styles.metricValue}>0</Text>
              <Text style={styles.metricLabel}>Titik Rawan</Text>
            </View>
            <View style={styles.metricChip}>
              <Text style={styles.metricValue}>14</Text>
              <Text style={styles.metricLabel}>Pos Polisi</Text>
            </View>
          </View>
        </View>

        {/* ================= SIMULASI PEMILIHAN RUTE ================= */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Simulasi Penentuan Rute</Text>
            <Text style={styles.sectionHint}>Pilih algoritma</Text>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                routeType === 'safe' && styles.tabButtonActiveSafe,
              ]}
              onPress={() => setRouteType('safe')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  routeType === 'safe' && styles.tabTextActiveSafe,
                ]}
              >
                🛡️ Rute Teraman
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                routeType === 'fast' && styles.tabButtonActiveFast,
              ]}
              onPress={() => setRouteType('fast')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  routeType === 'fast' && styles.tabTextActiveFast,
                ]}
              >
                ⚠️ Rute Biasa
              </Text>
            </TouchableOpacity>
          </View>

          {/* Route Info Box */}
          <View
            style={[
              styles.routeInfoBox,
              routeType === 'safe' ? styles.routeBoxSafe : styles.routeBoxFast,
            ]}
          >
            <View style={styles.routeBoxHeader}>
              <View style={styles.routeBadgeRow}>
                <View
                  style={[
                    styles.routeScoreBadge,
                    routeType === 'safe'
                      ? styles.scoreBadgeSafe
                      : styles.scoreBadgeFast,
                  ]}
                >
                  <Text style={styles.scoreText}>
                    {routeType === 'safe' ? '96/100' : '38/100'}
                  </Text>
                </View>
                <Text style={styles.routeVerdictText}>
                  {routeType === 'safe'
                    ? 'Sangat Direkomendasikan'
                    : 'Beresiko Tindak Kejahatan'}
                </Text>
              </View>
              <Text style={styles.routeEtaText}>
                {routeType === 'safe' ? '18 Menit' : '15 Menit'}
              </Text>
            </View>

            <View style={styles.routeDetailList}>
              <View style={styles.routeDetailRow}>
                <Text style={styles.routeDetailBullet}>•</Text>
                <Text style={styles.routeDetailLabel}>Penerangan Jalan:</Text>
                <Text
                  style={[
                    styles.routeDetailVal,
                    routeType === 'safe' ? styles.valGood : styles.valBad,
                  ]}
                >
                  {routeType === 'safe' ? '92% Terang Benderang' : '40% Gelap Gulita'}
                </Text>
              </View>

              <View style={styles.routeDetailRow}>
                <Text style={styles.routeDetailBullet}>•</Text>
                <Text style={styles.routeDetailLabel}>Titik Rawan Begal:</Text>
                <Text
                  style={[
                    styles.routeDetailVal,
                    routeType === 'safe' ? styles.valGood : styles.valBad,
                  ]}
                >
                  {routeType === 'safe' ? '0 Dihindari' : '2 Titik Terlintasi'}
                </Text>
              </View>

              <View style={styles.routeDetailRow}>
                <Text style={styles.routeDetailBullet}>•</Text>
                <Text style={styles.routeDetailLabel}>Pos Pengamanan:</Text>
                <Text style={styles.routeDetailVal}>
                  {routeType === 'safe'
                    ? '1 Polsek + 2 Pos Satpam'
                    : 'Tidak Ada Shelter'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ================= 3 FITUR UTAMA ================= */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Fitur Proteksi Aktif</Text>

          <View style={styles.featuresList}>
            {/* Feature 1 */}
            <View style={styles.featureItem}>
              <View style={styles.featureIconBox}>
                <Text style={styles.featureEmoji}>💡</Text>
              </View>
              <View style={styles.featureTextBox}>
                <Text style={styles.featureTitle}>Algoritma Anti-Jalan Gelap</Text>
                <Text style={styles.featureDesc}>
                  Otomatis memandu melewati ruas jalan berpenerangan PJU aktif dan minimarket 24 jam.
                </Text>
              </View>
            </View>

            {/* Feature 2 */}
            <View style={styles.featureItem}>
              <View style={[styles.featureIconBox, styles.featureIconRose]}>
                <Text style={styles.featureEmoji}>⚠️</Text>
              </View>
              <View style={styles.featureTextBox}>
                <Text style={styles.featureTitle}>Radar Peringatan Begal</Text>
                <Text style={styles.featureDesc}>
                  Peringatan suara berbunyi jika mendekati radius 500 meter dari titik rawan kejahatan.
                </Text>
              </View>
            </View>

            {/* Feature 3 */}
            <View style={styles.featureItem}>
              <View style={[styles.featureIconBox, styles.featureIconAmber]}>
                <Text style={styles.featureEmoji}>🚨</Text>
              </View>
              <View style={styles.featureTextBox}>
                <Text style={styles.featureTitle}>Tombol SOS Satu Sentuhan</Text>
                <Text style={styles.featureDesc}>
                  Kirim koordinat lokasi langsung ke kerabat dan pandu evakuasi menuju pos polisi terdekat.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ================= ACTION BUTTONS ================= */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              navigating && styles.primaryButtonActive,
            ]}
            onPress={handleStartNav}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>
              {navigating ? '⏹ Hentikan Navigasi' : '🛡️ Mulai Navigasi Teraman'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sosButton}
            onPress={handleSOS}
            activeOpacity={0.8}
          >
            <Text style={styles.sosButtonText}>🚨 BANTUAN DARURAT (SOS)</Text>
          </TouchableOpacity>
        </View>

        {/* ================= FOOTER / PRIVACY ================= */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            🔒 Privasi Terlindungi • Enkripsi Lokasi End-to-End
          </Text>
          <Text style={styles.footerSubText}>
            JalanAman v1.0 • Inisiatif Rute Teraman dari Kriminalitas
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 18,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#10b981',
    letterSpacing: 0.8,
    marginTop: -1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#34d399',
  },

  /* Hero Card */
  heroCard: {
    marginTop: 18,
    borderRadius: 22,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 18,
  },
  heroHeader: {
    marginBottom: 16,
  },
  heroTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10b981',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    lineHeight: 27,
    marginBottom: 8,
  },
  heroDesc: {
    fontSize: 13,
    color: '#a1a1aa',
    lineHeight: 19,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  metricChip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#09090b',
    borderWidth: 1,
    borderColor: '#27272a',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10b981',
  },
  metricLabel: {
    fontSize: 10,
    color: '#71717a',
    marginTop: 2,
    fontWeight: '600',
  },

  /* Section */
  sectionContainer: {
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  sectionHint: {
    fontSize: 11,
    color: '#71717a',
  },

  /* Tabs */
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#18181b',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#27272a',
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActiveSafe: {
    backgroundColor: '#10b981',
  },
  tabButtonActiveFast: {
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.4)',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#71717a',
  },
  tabTextActiveSafe: {
    color: '#09090b',
  },
  tabTextActiveFast: {
    color: '#fb7185',
  },

  /* Route Info Box */
  routeInfoBox: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  routeBoxSafe: {
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  routeBoxFast: {
    backgroundColor: 'rgba(244, 63, 94, 0.06)',
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  routeBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  routeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeScoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  scoreBadgeSafe: {
    backgroundColor: '#10b981',
  },
  scoreBadgeFast: {
    backgroundColor: '#f43f5e',
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
  routeVerdictText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  routeEtaText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#a1a1aa',
  },
  routeDetailList: {
    gap: 6,
  },
  routeDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeDetailBullet: {
    color: '#71717a',
    fontSize: 14,
  },
  routeDetailLabel: {
    fontSize: 11,
    color: '#a1a1aa',
  },
  routeDetailVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 'auto',
  },
  valGood: {
    color: '#34d399',
  },
  valBad: {
    color: '#fb7185',
  },

  /* Feature List */
  featuresList: {
    gap: 10,
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#18181b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  featureIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconRose: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderColor: 'rgba(244, 63, 94, 0.25)',
  },
  featureIconAmber: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  featureEmoji: {
    fontSize: 18,
  },
  featureTextBox: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 11,
    color: '#a1a1aa',
    lineHeight: 16,
  },

  /* Actions */
  actionContainer: {
    marginTop: 26,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonActive: {
    backgroundColor: '#059669',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#09090b',
    letterSpacing: -0.2,
  },
  sosButton: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.4)',
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fb7185',
    letterSpacing: 0.5,
  },

  /* Footer */
  footerNote: {
    marginTop: 26,
    alignItems: 'center',
    gap: 4,
  },
  footerNoteText: {
    fontSize: 11,
    color: '#71717a',
    fontWeight: '600',
  },
  footerSubText: {
    fontSize: 10,
    color: '#52525b',
  },
});

