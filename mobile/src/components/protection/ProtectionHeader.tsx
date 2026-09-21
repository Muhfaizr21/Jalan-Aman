import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface ProtectionHeaderProps {
  onBack: () => void;
  isAudioActive: boolean;
  onToggleAudio: () => void;
}

function ArrowBackIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function VolumeIcon({ size = 20, isMuted = false, color = DashboardTheme.colors.textSecondary }: { size?: number; isMuted?: boolean; color?: string }) {
  if (isMuted) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
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

export const ProtectionHeader: React.FC<ProtectionHeaderProps> = ({
  onBack,
  isAudioActive,
  onToggleAudio,
}) => {
  const insets = useSafeAreaInsets();
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;
  const safeTop = Math.max(insets.top, statusBarHeight) + 8;

  return (
    <View style={[styles.headerContainer, { paddingTop: safeTop }]}>
      {/* Top Controls Row */}
      <View style={styles.topControlRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke Rute"
        >
          <ArrowBackIcon size={20} />
        </TouchableOpacity>

        {/* Live Tracking GPS Pill */}
        <View style={styles.gpsTrackingBadge}>
          <View style={styles.liveGreenDot} />
          <Text style={styles.gpsTrackingText}>Live Tracking GPS Aktif</Text>
        </View>

        {/* Sirene Mute Toggle Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onToggleAudio}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={isAudioActive ? 'Matikan Sirene' : 'Nyalakan Sirene'}
        >
          <VolumeIcon size={20} isMuted={!isAudioActive} />
        </TouchableOpacity>
      </View>

      {/* Title & Subtitle */}
      <View style={styles.titleSection}>
        <Text style={styles.pageTitle}>Proteksi Perjalanan</Text>
        <Text style={styles.pageSubtitle}>
          Pemantauan real-time &amp; siaga darurat otomatis
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    gap: 12,
  },
  topControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  gpsTrackingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: DashboardTheme.colors.semanticAccentBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: DashboardTheme.radius.full,
  },
  liveGreenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: DashboardTheme.colors.primary,
  },
  gpsTrackingText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: DashboardTheme.colors.onPrimaryContainer,
    letterSpacing: -0.1,
  },
  titleSection: {
    gap: 2,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: DashboardTheme.colors.textSecondary,
  },
});
