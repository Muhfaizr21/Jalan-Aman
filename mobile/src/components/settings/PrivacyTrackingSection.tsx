import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface PrivacyTrackingSectionProps {
  endToEndEncryption: boolean;
  onToggleEndToEndEncryption: (val: boolean) => void;
  obfuscateFeedLocation: boolean;
  onToggleObfuscateFeedLocation: (val: boolean) => void;
  autoPurgeHistory: boolean;
  onToggleAutoPurgeHistory: (val: boolean) => void;
}

function VerifiedUserIcon({ size = 22, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
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

export const PrivacyTrackingSection: React.FC<PrivacyTrackingSectionProps> = ({
  endToEndEncryption,
  onToggleEndToEndEncryption,
  obfuscateFeedLocation,
  onToggleObfuscateFeedLocation,
  autoPurgeHistory,
  onToggleAutoPurgeHistory,
}) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <VerifiedUserIcon size={22} />
        </View>
        <View style={styles.headerTextCol}>
          <Text style={styles.titleText}>Privasi & Pelacakan</Text>
          <Text style={styles.subtitleText}>Kendali penuh atas data koordinat dan rute Anda</Text>
        </View>
      </View>

      {/* Item 1: Enkripsi End-to-End Rute */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleTextCol}>
          <View style={styles.titleWithBadgeRow}>
            <Text style={styles.toggleTitle}>Enkripsi End-to-End Rute</Text>
            <View style={styles.milBadge}>
              <Text style={styles.milBadgeText}>Mil-Grade 256</Text>
            </View>
          </View>
          <Text style={styles.toggleDesc}>
            Hanya kontak darurat terpilih yang dapat mendekripsi
          </Text>
        </View>
        <Switch
          value={endToEndEncryption}
          onValueChange={onToggleEndToEndEncryption}
          trackColor={{
            false: DashboardTheme.colors.surfaceContainer,
            true: DashboardTheme.colors.primaryContainer,
          }}
          thumbColor={DashboardTheme.colors.surfaceCard}
          accessibilityLabel="Aktifkan Enkripsi End-to-End Rute"
        />
      </View>

      <View style={styles.divider} />

      {/* Item 2: Samarkan Lokasi di Feed Komunitas */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleTextCol}>
          <Text style={styles.toggleTitle}>Samarkan Lokasi di Feed Komunitas</Text>
          <Text style={styles.toggleDesc}>
            Titik insiden diacak radius 75-100m dari titik presisi
          </Text>
        </View>
        <Switch
          value={obfuscateFeedLocation}
          onValueChange={onToggleObfuscateFeedLocation}
          trackColor={{
            false: DashboardTheme.colors.surfaceContainer,
            true: DashboardTheme.colors.primaryContainer,
          }}
          thumbColor={DashboardTheme.colors.surfaceCard}
          accessibilityLabel="Aktifkan Samarkan Lokasi Komunitas"
        />
      </View>

      <View style={styles.divider} />

      {/* Item 3: Hapus Riwayat Perjalanan Otomatis */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleTextCol}>
          <Text style={styles.toggleTitle}>Hapus Riwayat Perjalanan Otomatis</Text>
          <Text style={styles.toggleDesc}>
            Hapus jejak GPS setelah 24 jam status dinyatakan selamat
          </Text>
        </View>
        <Switch
          value={autoPurgeHistory}
          onValueChange={onToggleAutoPurgeHistory}
          trackColor={{
            false: DashboardTheme.colors.surfaceContainer,
            true: DashboardTheme.colors.primaryContainer,
          }}
          thumbColor={DashboardTheme.colors.surfaceCard}
          accessibilityLabel="Aktifkan Hapus Riwayat Otomatis"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: 22,
    padding: 16,
    shadowColor: DashboardTheme.colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: DashboardTheme.colors.semanticAccentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.2,
  },
  subtitleText: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 4,
  },
  toggleTextCol: {
    flex: 1,
    paddingRight: 6,
  },
  titleWithBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  toggleTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  milBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    backgroundColor: DashboardTheme.colors.surfaceContainer,
  },
  milBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  toggleDesc: {
    fontSize: 11.5,
    color: DashboardTheme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    marginVertical: 12,
  },
});
