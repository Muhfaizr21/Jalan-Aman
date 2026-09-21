import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface AudioSirenSectionProps {
  maxSirenVolume: boolean;
  onToggleMaxSirenVolume: (val: boolean) => void;
  hapticFeedback: boolean;
  onToggleHapticFeedback: (val: boolean) => void;
}

function VolumeUpIcon({ size = 22, color = DashboardTheme.colors.semanticAlert }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const AudioSirenSection: React.FC<AudioSirenSectionProps> = ({
  maxSirenVolume,
  onToggleMaxSirenVolume,
  hapticFeedback,
  onToggleHapticFeedback,
}) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <VolumeUpIcon size={22} />
        </View>
        <View style={styles.headerTextCol}>
          <Text style={styles.titleText}>Audio & Peringatan Sirine</Text>
          <Text style={styles.subtitleText}>Pengaturan respon sinyal darurat lokal</Text>
        </View>
      </View>

      {/* Item 1: Volume Sirine SOS Maksimal */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleTextCol}>
          <View style={styles.titleWithBadgeRow}>
            <Text style={styles.toggleTitle}>Volume Sirine SOS Maksimal</Text>
            <View style={styles.redDot} />
          </View>
          <Text style={styles.toggleDesc}>
            Abaikan mode "Jangan Ganggu" dan profil hening HP
          </Text>
        </View>
        <Switch
          value={maxSirenVolume}
          onValueChange={onToggleMaxSirenVolume}
          trackColor={{
            false: DashboardTheme.colors.surfaceContainer,
            true: DashboardTheme.colors.primaryContainer,
          }}
          thumbColor={DashboardTheme.colors.surfaceCard}
          accessibilityLabel="Aktifkan Volume Sirine Maksimal"
        />
      </View>

      <View style={styles.divider} />

      {/* Item 2: Umpan Balik Haptik Taktil */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleTextCol}>
          <Text style={styles.toggleTitle}>Umpan Balik Haptik Taktil</Text>
          <Text style={styles.toggleDesc}>
            Pola getaran berdenyut ganda saat pemicu darurat aktif
          </Text>
        </View>
        <Switch
          value={hapticFeedback}
          onValueChange={onToggleHapticFeedback}
          trackColor={{
            false: DashboardTheme.colors.surfaceContainer,
            true: DashboardTheme.colors.primaryContainer,
          }}
          thumbColor={DashboardTheme.colors.surfaceCard}
          accessibilityLabel="Aktifkan Umpan Balik Haptik"
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
    backgroundColor: DashboardTheme.colors.semanticAlertBg,
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
  redDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: DashboardTheme.colors.semanticAlert,
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
